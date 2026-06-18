# AutoPièces Fès

E-commerce catalog for auto parts (React + Vite frontend, Express + MySQL API).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- MySQL (XAMPP, WAMP, or standalone) with a database named `autopiecesfes`
- [ngrok](https://ngrok.com/) account (free tier works)

## Quick start (local)

```powershell
# 1. Install dependencies
npm install
npm install --prefix server

# 2. Configure the API (copy and edit if needed)
copy server\.env.example server\.env

# 3. Start the API (terminal 1)
npm run dev:api

# 4. Start the frontend (terminal 2)
npm run dev
```

Open http://localhost:5173 (frontend) — API runs on http://localhost:4000.

Ports are detected automatically from `vite.config.js` and `server/.env` (defaults: **5173** and **4000**).

## Share with a friend (ngrok)

The app needs **two local servers** (frontend + API). ngrok exposes both over HTTPS so your friend can use the site from anywhere.

### One-time ngrok setup

1. Create a free account at [ngrok.com](https://ngrok.com/signup).
2. Copy your authtoken from [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken).
3. Run once:

```powershell
ngrok config add-authtoken YOUR_TOKEN_HERE
```

If ngrok is not installed, the share script tries `winget install Ngrok.Ngrok`, or download from [ngrok.com/download](https://ngrok.com/download).

### Expose the app (3 terminals)

**Terminal 1 — API**

```powershell
cd c:\Users\reda\Desktop\autopiecesfes
npm run dev:api
```

**Terminal 2 — Frontend**

```powershell
cd c:\Users\reda\Desktop\autopiecesfes
npm run dev
```

**Terminal 3 — ngrok tunnels**

```powershell
cd c:\Users\reda\Desktop\autopiecesfes
npm run share
```

The script will:

- Detect ports (5173 + 4000 by default)
- Generate `ngrok.yml`
- Start ngrok with two HTTPS tunnels (web + api)
- Write `.env.local` with `VITE_API_URL` pointing to the public API URL
- Print the **public HTTPS URL** to send to your friend

**After `npm run share` runs**, restart Vite in terminal 2 if it was already running:

```powershell
# Ctrl+C, then:
npm run dev
```

Send your friend the **green URL** shown by the script (e.g. `https://xxxx.ngrok-free.app`).

- ngrok web UI (requests, status): http://127.0.0.1:4040
- Stop ngrok: close terminal 3 or run `Stop-Process -Name ngrok`

### npm scripts reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite frontend |
| `npm run dev:api` | Start Express API |
| `npm run ports` | Show detected frontend/API ports |
| `npm run ngrok:config` | Regenerate `ngrok.yml` from detected ports |
| `npm run share` | Start ngrok and print the public URL |

### Manual ngrok (alternative)

```powershell
npm run ngrok:config
ngrok start --all --config ngrok.yml
```

Then open http://127.0.0.1:4040 to see tunnel URLs, and set `VITE_API_URL` in `.env.local` to the **api** tunnel HTTPS URL before running `npm run dev`.

### Troubleshooting

| Issue | Fix |
|-------|-----|
| `ngrok not found` | Run `winget install Ngrok.Ngrok` and restart the terminal |
| `authtoken is not configured` | Run `ngrok config add-authtoken YOUR_TOKEN` |
| Friend sees UI but API fails | Restart `npm run dev` after `npm run share` (loads `.env.local`) |
| `Nothing listening on port …` | Start `npm run dev` and/or `npm run dev:api` first |
| Free ngrok “Visit Site” interstitial | Your friend clicks **Visit Site** once per session (ngrok free tier) |
| MySQL errors | Ensure MySQL is running and `server/.env` is correct |

## Project structure

```
autopiecesfes/
├── src/           React frontend
├── server/        Express API + MySQL
├── scripts/       Port detection & ngrok helpers
├── ngrok.yml      Generated tunnel config (do not commit secrets)
└── .env.local     Generated VITE_API_URL for ngrok (gitignored)
```
