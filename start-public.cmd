@echo off
REM MedKhoj AI: build frontend, start merged server, open a public Cloudflare link.
cd /d "%~dp0"
echo Building frontend...
call npm run build
echo Starting server on port 5000...
start "MedKhoj Server" cmd /k npm start
timeout /t 5 /nobreak >nul
echo Starting Cloudflare tunnel... (public link appears below as https://xxxx.trycloudflare.com)
"C:\Users\USER\cloudflared\cloudflared.exe" tunnel --url http://localhost:5000
