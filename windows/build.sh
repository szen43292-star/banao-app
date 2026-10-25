#!/bin/sh
# Builds Banao.exe for 64-bit Windows from Linux or macOS using Zig (pip install ziglang).
set -e
cd "$(dirname "$0")"
ZIG="${ZIG:-python3 -m ziglang}"
python3 gen_assets.py
$ZIG cc -target x86_64-windows-gnu -O2 -municode -Wl,--subsystem,windows -o Banao.exe banao.c banao.rc -lws2_32 -lshell32 -lshlwapi -lole32
ls -la Banao.exe
