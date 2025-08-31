MCP Weather
===========

Tiny Express app exposing a `/weather` endpoint backed by OpenWeather, plus an OpenAPI doc for MCP tool discovery. Includes a minimal static UI.

Project Structure
-

- `src/server.js`: App entry; wires middleware, static assets, routes, errors
- `src/routes/weather.js`: `/weather` route (query `?city=`)
- `src/lib/openweather.js`: Calls OpenWeather and normalizes the response
- `src/lib/env.js`: Loads env and exports config
- `src/middleware/errors.js`: Async wrapper, 404 + error handlers
- `public/`: Minimal UI (`index.html`, `app.js`, `styles.css`)
- `openapi.yaml`: OpenAPI spec served at `/openapi.yaml`

Quick Start
-

- Install deps: `npm install`
- Create `.env` with your key: `OPENWEATHER_API_KEY=YOUR_KEY_HERE`
- Run the server: `npm start`
- Open UI: `http://localhost:3000/`
- Try API: `http://localhost:3000/weather?city=Vancouver`
- OpenAPI: `http://localhost:3000/openapi.yaml`

Environment
-

- `OPENWEATHER_API_KEY` (required): Get one at https://home.openweathermap.org/api_keys
- `PORT` (optional): Defaults to `3000`

API
-

- `GET /weather?city=CityName`
  - Response JSON: `{ city, country, tempC, description, humidity, windKph }`
  - Errors: 400 (missing city), 401 (invalid/unactivated key), 500 (server)

MCP Integration
-

- Import `openapi.yaml` in an MCP-capable client to discover the `GET /weather` tool.

Troubleshooting 401 Unauthorized
-

- Ensure env var name is exact: `OPENWEATHER_API_KEY`
- Restart the server after editing `.env`
- Keys can take 10–60 minutes to activate after creation
- Test raw URL in your browser (replace CITY and KEY):
  - `https://api.openweathermap.org/data/2.5/weather?q=CITY&appid=KEY&units=metric`
- If still 401, rotate the key in the OpenWeather dashboard and retry

Development
-

- Scripts: `npm start` (dev)
- Static UI is under `public/`; API under `src/`
- OpenAPI spec is a file at the repo root (`openapi.yaml`)
