# MedKhoj AI

Single deployable app: the Express backend serves the built React frontend from `client/dist`, so one service and one port handle everything.

## Run locally (development)

Install dependencies once:

```sh
npm run install:all
```

Start backend (nodemon, port 5000) and frontend (Vite, port 5173) together:

```sh
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the backend. Set `API_PROXY_TARGET` if the backend runs elsewhere.

## Run as one merged app (production mode)

```sh
npm run build   # builds the frontend into client/dist
npm start       # starts the backend, which also serves client/dist
```

Open `http://localhost:5000`. The React app, `/api/health`, `/api/medicines`, and `/api/ai/chat` are all on the same origin, so no CORS or proxy setup is needed.

## Deploy (Render, Railway, VPS, etc.)

- **Build command:** `npm run install:all && npm run build`
- **Start command:** `npm start`
- **Environment variables:** `GEMINI_API_KEY`, `GEMINI_MODEL` (optional, default `gemini-3.5-flash-lite`), `PORT` (most hosts set this automatically)
- **Node:** 20 or newer

The SQLite database lives in `server/data/medkhoj.db` and is created automatically with demo medicines on first start. On hosts with an ephemeral filesystem, attach a persistent disk at `server/data` if you need the data to survive restarts.

## Gemini medicine assistant

The medicine-information chat calls Gemini through the backend; the API key is never sent to the browser. For local use, create `server/.env` from `server/.env.example` and put your Google AI Studio key in `GEMINI_API_KEY`:

```powershell
Copy-Item server/.env.example server/.env
```

Do not commit or share this file. Restart the server after changing the key. The endpoint is `POST /api/ai/chat` and is rate limited. It provides general educational information only, not diagnosis or personalized dosing.

## Useful scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev mode, frontend + backend with hot reload |
| `npm run build` | Build frontend into `client/dist` |
| `npm start` | Start merged production server |
| `npm run seed` | Re-run the demo medicine seed |
