# Banao apps

Banao (website and software builder) packaged as:

| Platform | File | How it is built |
|---|---|---|
| Android | `Banao.apk` | Capacitor project in `mobile/android`, built by GitHub Actions |
| iPhone / iPad | `Banao-unsigned.ipa` | Capacitor project in `mobile/ios`, built by GitHub Actions on a Mac runner |
| Windows 10 / 11 | `Banao.exe` | Small C launcher in `windows/`, built with Zig (works from Linux, macOS or GitHub Actions) |

All three run the same Banao app from `www/`, fully offline, with its fonts bundled. Nothing is sent to a server.

## Folders

- `src/` – Banao's source (page, styles, builder engine, website and software generators).
- `build/` – turns `src/` into `www/` (`node build_app.js`) and draws the app icons (`node make_native_icons.js`).
- `www/` – the finished app page, fonts and icons that every platform loads.
- `mobile/` – the Android and iPhone projects (Capacitor 8). App id: `com.banaoapp.builder`.
- `windows/` – `banao.c` (local server plus Edge app window), icon and version info, `build.sh`.
- `.github/workflows/build.yml` – builds all three on every push to `main` and attaches them to a GitHub Release.

## Getting the files

Push this folder to a GitHub repository. The **Build Banao apps** workflow runs by itself (or start it from the Actions tab with **Run workflow**). When it finishes, open **Releases**: the newest release has `Banao.apk`, `Banao.exe` and `Banao-unsigned.ipa`.

## Installing

**Android.** Copy `Banao.apk` to the phone and open it. Android asks to allow installs from that app (Files, Chrome or WhatsApp): allow it once. This test build is signed with a debug key, which is fine for your own phones but not for Google Play.

**Windows.** Double-click `Banao.exe`. Because the file is not code-signed yet, Windows SmartScreen may say "Windows protected your PC": click **More info**, then **Run anyway**. Banao opens in its own window using Microsoft Edge, which is built into Windows 10 and 11 (Chrome also works). Projects are kept in `%LOCALAPPDATA%\Banao`.

**iPhone.** Apple only installs apps that are signed. Two ways:
1. Free, for your own phone: install `Banao-unsigned.ipa` with Sideloadly or AltStore using your Apple ID. Apps signed this way stop opening after 7 days and need re-signing.
2. Proper: join the Apple Developer Program ($99 a year). Then the same project can be signed and sent to TestFlight and the App Store.

## Download website (Netlify)

`site/` is the public download website. It offers Banao for each device and does not run Banao itself:

- `/downloads/Banao.exe` for Windows, and `/downloads/Banao.html` (one file with fonts inside) for Mac, Linux and Chromebook.
- The main button picks the visitor's device. The Android button turns on by itself once `downloads/Banao.apk` is on the site.
- Install steps, file sizes and SHA-256 checksums are filled in at build time.

```sh
cd build && node build_app.js && sh ../windows/build.sh && node build_site.js
```

To add the Android app later, put `Banao.apk` in `downloads-extra/` before building, or drop it into `site/downloads/` before uploading. Deploy by dragging the `site` folder onto https://app.netlify.com/drop.

## Changing Banao

Edit the files in `src/`, then:

```sh
cd build && npm ci && node build_app.js          # rebuilds www/
cd ../mobile && npm ci && npx cap sync            # copies www/ into Android and iPhone
sh ../windows/build.sh                            # Windows exe (needs: pip install ziglang)
```

Or just push to GitHub and let the workflow build everything.

## Next steps for the stores

- **Google Play**: create an upload key, build a signed `.aab` (`./gradlew bundleRelease`), $25 one-time developer account.
- **Microsoft Store**: package as MSIX, $19 one-time developer account. A code-signing certificate also removes the SmartScreen warning for the direct `.exe`.
- **App Store**: Apple Developer Program, signing certificate and provisioning profile, upload through Xcode or Transporter.
