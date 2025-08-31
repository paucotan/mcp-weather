import { config as loadEnv } from 'dotenv';

loadEnv();

const port = process.env.PORT || 3000;
const openWeatherKey = (process.env.OPENWEATHER_API_KEY || '').trim();

if (!openWeatherKey) {
  console.warn('[mcp-weather] Warning: OPENWEATHER_API_KEY is missing. The /weather route will return a helpful error until set.');
}

export const config = {
  port,
  openWeatherKey,
};

