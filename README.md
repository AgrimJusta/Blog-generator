# AI Content Generator

Complete React + Vite app with an example Express proxy server to keep API keys secret. See .env.example for environment variables.

## Quick start

1. Install dependencies:
```bash
npm install
```
2. Go to .env.example file and replace api key
    Change only AI_API_KEY with open ai api key
    Then change the file name to ".env"
   
4. Start the backend server (in one terminal):
```bash
npm run start:server
```

4. Start the frontend (in another terminal):
```bash
npm run dev
```

5. Open http://localhost:5173

## Production notes
- Use a backend proxy for API keys (the included `server` does that).
- Configure CORS and rate-limiting for production servers.
