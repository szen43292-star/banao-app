/*
 * Banao for Windows.
 * A small launcher: it serves the bundled Banao app on 127.0.0.1 and opens it
 * in a Microsoft Edge app window (no address bar), with its own profile so
 * saved projects stay on this computer. Everything works offline.
 *
 * The server part also builds on Linux/macOS (cc banao.c -lpthread) so it can be tested there.
 */
#ifdef _WIN32
#  ifndef UNICODE
#    define UNICODE
#  endif
#  ifndef _UNICODE
#    define _UNICODE
#  endif
#  define WIN32_LEAN_AND_MEAN
#  include <winsock2.h>
#  include <ws2tcpip.h>
#  include <windows.h>
#  include <shellapi.h>
#  include <shlobj.h>
#else
#  include <sys/socket.h>
#  include <sys/time.h>
#  include <netinet/in.h>
#  include <arpa/inet.h>
#  include <unistd.h>
#  include <pthread.h>
   typedef int SOCKET;
#  define INVALID_SOCKET (-1)
#  define closesocket close
#  define SD_SEND SHUT_WR
#endif
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include "assets.h"

#define PORT_FIRST 47821
#define PORT_LAST  47830

static SOCKET g_listen = INVALID_SOCKET;

static void set_timeout(SOCKET s, int ms) {
#ifdef _WIN32
  DWORD t = (DWORD)ms; setsockopt(s, SOL_SOCKET, SO_RCVTIMEO, (const char *)&t, sizeof t);
#else
  struct timeval tv; tv.tv_sec = ms / 1000; tv.tv_usec = (ms % 1000) * 1000; setsockopt(s, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof tv);
#endif
}

static int spawn(void (*fn)(void *), void *arg);

static const asset_t *find_asset(const char *path) {
  if (strcmp(path, "/") == 0) path = "/index.html";
  for (unsigned i = 0; i < ASSET_COUNT; i++) if (strcmp(ASSETS[i].path, path) == 0) return &ASSETS[i];
  return NULL;
}

static int send_all(SOCKET s, const char *buf, long len) {
  while (len > 0) { int n = (int)send(s, buf, (int)(len > 65536 ? 65536 : len), 0); if (n <= 0) return -1; buf += n; len -= n; }
  return 0;
}

static void handle_client(void *arg) {
  SOCKET c = (SOCKET)(size_t)arg;
  set_timeout(c, 8000);
  char req[4096]; int got = 0;
  while (got < (int)sizeof req - 1) {
    int n = (int)recv(c, req + got, (int)sizeof req - 1 - got, 0);
    if (n <= 0) break;
    got += n; req[got] = 0;
    if (strstr(req, "\r\n\r\n")) break;
  }
  if (got > 0) {
    req[got] = 0;
    char method[8] = {0}, path[1024] = {0};
    if (sscanf(req, "%7s %1023s", method, path) == 2) {
      char *q = strchr(path, '?'); if (q) *q = 0;
      if (strcmp(path, "/__banao") == 0) {
        const char *r = "HTTP/1.0 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 8\r\nConnection: close\r\n\r\nBANAO-OK";
        send_all(c, r, (long)strlen(r));
      } else {
        const asset_t *a = find_asset(path);
        char hdr[512];
        if (a) {
          int html = strncmp(a->mime, "text/html", 9) == 0;
          int hl = snprintf(hdr, sizeof hdr, "HTTP/1.0 200 OK\r\nContent-Type: %s\r\nContent-Length: %u\r\nCache-Control: %s\r\nX-Content-Type-Options: nosniff\r\nConnection: close\r\n\r\n",
                            a->mime, a->len, html ? "no-store" : "max-age=31536000");
          if (send_all(c, hdr, hl) == 0 && strcmp(method, "HEAD") != 0) send_all(c, (const char *)a->data, (long)a->len);
        } else {
          const char *r = "HTTP/1.0 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 9\r\nConnection: close\r\n\r\nNot found";
          send_all(c, r, (long)strlen(r));
        }
      }
    }
  }
  shutdown(c, SD_SEND);
  closesocket(c);
}

static void serve(void *unused) {
  (void)unused;
  for (;;) {
    SOCKET c = accept(g_listen, NULL, NULL);
    if (c == INVALID_SOCKET) return;
    if (!spawn(handle_client, (void *)(size_t)c)) closesocket(c);
  }
}

/* Is a Banao launcher already serving on this port? */
static int is_banao(int port) {
  SOCKET s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
  if (s == INVALID_SOCKET) return 0;
  struct sockaddr_in a; memset(&a, 0, sizeof a);
  a.sin_family = AF_INET; a.sin_port = htons((unsigned short)port); a.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
  set_timeout(s, 2000);
  int ok = 0;
  if (connect(s, (struct sockaddr *)&a, sizeof a) == 0) {
    const char *q = "GET /__banao HTTP/1.0\r\n\r\n";
    send_all(s, q, (long)strlen(q));
    char buf[512]; int got = 0, n;
    while (got < (int)sizeof buf - 1 && (n = (int)recv(s, buf + got, (int)sizeof buf - 1 - got, 0)) > 0) got += n;
    buf[got] = 0;
    ok = strstr(buf, "BANAO-OK") != NULL;
  }
  closesocket(s);
  return ok;
}

/* Bind 127.0.0.1 on the first free port. Returns the port, or 0. *reuse is set when another Banao already serves it. */
static int open_server(int *reuse) {
  *reuse = 0;
  for (int port = PORT_FIRST; port <= PORT_LAST; port++) {
    SOCKET s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (s == INVALID_SOCKET) return 0;
#ifdef _WIN32
    BOOL excl = TRUE; setsockopt(s, SOL_SOCKET, SO_EXCLUSIVEADDRUSE, (const char *)&excl, sizeof excl);
#endif
    struct sockaddr_in a; memset(&a, 0, sizeof a);
    a.sin_family = AF_INET; a.sin_port = htons((unsigned short)port); a.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    if (bind(s, (struct sockaddr *)&a, sizeof a) == 0 && listen(s, 64) == 0) { g_listen = s; return port; }
    closesocket(s);
    if (is_banao(port)) { *reuse = 1; return port; }
  }
  return 0;
}

#ifdef _WIN32
typedef struct { void (*fn)(void *); void *arg; } job_t;
static DWORD WINAPI run_job(LPVOID p) { job_t j = *(job_t *)p; HeapFree(GetProcessHeap(), 0, p); j.fn(j.arg); return 0; }
static int spawn(void (*fn)(void *), void *arg) {
  job_t *j = (job_t *)HeapAlloc(GetProcessHeap(), 0, sizeof *j); if (!j) return 0;
  j->fn = fn; j->arg = arg;
  HANDLE t = CreateThread(NULL, 0, run_job, j, 0, NULL);
  if (!t) { HeapFree(GetProcessHeap(), 0, j); return 0; }
  CloseHandle(t); return 1;
}

static HANDLE launch(const wchar_t *exe, const wchar_t *args) {
  SHELLEXECUTEINFOW sei; memset(&sei, 0, sizeof sei);
  sei.cbSize = sizeof sei; sei.fMask = SEE_MASK_NOCLOSEPROCESS | SEE_MASK_FLAG_NO_UI;
  sei.lpVerb = L"open"; sei.lpFile = exe; sei.lpParameters = args; sei.nShow = SW_SHOWNORMAL;
  if (!ShellExecuteExW(&sei)) return NULL;
  return sei.hProcess ? sei.hProcess : INVALID_HANDLE_VALUE;
}

int WINAPI wWinMain(HINSTANCE hInst, HINSTANCE hPrev, PWSTR cmd, int show) {
  (void)hInst; (void)hPrev; (void)cmd; (void)show;
  WSADATA wsa;
  if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) { MessageBoxW(NULL, L"Banao could not start (Windows networking is unavailable).", L"Banao", MB_ICONERROR); return 1; }

  int reuse = 0, port = open_server(&reuse);
  if (!port) { MessageBoxW(NULL, L"Banao could not open a local port. Ports 47821 to 47830 are all in use by other programs. Close them and try again.", L"Banao", MB_ICONERROR); return 1; }
  if (!reuse && !spawn(serve, NULL)) { MessageBoxW(NULL, L"Banao could not start its local server.", L"Banao", MB_ICONERROR); return 1; }

  /* its own browser profile, so projects saved in Banao stay on this computer: %LOCALAPPDATA%\Banao\Profile */
  wchar_t base[MAX_PATH], profile[MAX_PATH + 32];
  if (FAILED(SHGetFolderPathW(NULL, CSIDL_LOCAL_APPDATA, NULL, 0, base))) GetTempPathW(MAX_PATH, base);
  swprintf(profile, MAX_PATH + 32, L"%ls\\Banao", base); CreateDirectoryW(profile, NULL);
  swprintf(profile, MAX_PATH + 32, L"%ls\\Banao\\Profile", base); CreateDirectoryW(profile, NULL);

  wchar_t url[64], args[MAX_PATH * 2];
  swprintf(url, 64, L"http://127.0.0.1:%d/", port);
  swprintf(args, MAX_PATH * 2, L"--app=%ls --user-data-dir=\"%ls\" --no-first-run --no-default-browser-check --disable-background-mode --window-size=1280,860", url, profile);

  HANDLE proc = launch(L"msedge.exe", args);
  if (!proc) proc = launch(L"chrome.exe", args);
  if (!proc) {
    ShellExecuteW(NULL, L"open", url, NULL, NULL, SW_SHOWNORMAL);
    if (!reuse) MessageBoxW(NULL, L"Banao is open in your web browser.\n\nKeep this message open while you use Banao. Click OK to close Banao.", L"Banao", MB_ICONINFORMATION);
  } else if (proc != INVALID_HANDLE_VALUE) {
    if (!reuse) WaitForSingleObject(proc, INFINITE);
    CloseHandle(proc);
  } else if (!reuse) {
    MessageBoxW(NULL, L"Banao is open.\n\nKeep this message open while you use Banao. Click OK to close Banao.", L"Banao", MB_ICONINFORMATION);
  }

  if (g_listen != INVALID_SOCKET) closesocket(g_listen);
  WSACleanup();
  return 0;
}
#else
static void *run_job(void *p) { void **j = (void **)p; void (*fn)(void *) = (void (*)(void *))j[0]; void *arg = j[1]; free(p); fn(arg); return NULL; }

static int spawn(void (*fn)(void *), void *arg) {
  void **j = malloc(2 * sizeof(void *)); if (!j) return 0;
  j[0] = (void *)fn; j[1] = arg;
  pthread_t t; if (pthread_create(&t, NULL, run_job, j) != 0) { free(j); return 0; }
  pthread_detach(t); return 1;
}
int main(void) {
  int reuse = 0, port = open_server(&reuse);
  if (!port) { fprintf(stderr, "no port\n"); return 1; }
  printf("http://127.0.0.1:%d/ %s\n", port, reuse ? "(already running)" : "");
  fflush(stdout);
  if (!reuse) serve(NULL);
  return 0;
}
#endif
