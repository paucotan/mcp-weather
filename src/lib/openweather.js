import { fetch } from 'undici';

// Tiny client to call OpenWeather and normalize the result
export async function getCurrentWeather(city, { apiKey, units = 'metric' } = {}) {
  if (!apiKey) {
    const err = new Error('OPENWEATHER_API_KEY missing');
    err.status = 500;
    throw err;
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q', city);
  url.searchParams.set('appid', apiKey);
  url.searchParams.set('units', units);

  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) {
    const err = new Error(text || `OpenWeather error ${r.status}`);
    err.status = r.status;
    throw err;
  }
  const data = JSON.parse(text);
  return {
    city: data.name,
    country: data.sys?.country,
    tempC: data.main?.temp,
    description: data.weather?.[0]?.description,
    humidity: data.main?.humidity,
    windKph: data.wind?.speed ? Math.round(data.wind.speed * 3.6) : null,
  };
}

