# AI Content Generator

Complete React + Vite app with an example Express proxy server to keep API keys secret. See .env.example for environment variables.

## Quick start

1. Install dependencies:
```bash
npm install
```

2. Start the backend server (in one terminal):
```bash
npm run start:server
```

3. Start the frontend (in another terminal):
```bash
npm run dev
```

4. Open http://localhost:5173

## Production notes
- Use a backend proxy for API keys (the included `server` does that).
- Configure CORS and rate-limiting for production servers.
