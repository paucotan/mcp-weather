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
  const tempRaw = data.main?.temp;
  const windRaw = data.wind?.speed; // m/s for metric, mph for imperial

  // Normalize temperature and wind, preserving backward-compatible fields
  const isMetric = units === 'metric';
  const tempC = (typeof tempRaw === 'number')
    ? (isMetric ? tempRaw : Math.round(((tempRaw - 32) * 5) / 9 * 10) / 10)
    : null;
  const temp = (typeof tempRaw === 'number') ? tempRaw : null; // in requested units

  const windKph = (typeof windRaw === 'number')
    ? Math.round((isMetric ? windRaw * 3.6 : windRaw * 1.60934))
    : null;
  const windMph = (typeof windRaw === 'number')
    ? Math.round((isMetric ? windRaw * 2.23694 : windRaw))
    : null;

  return {
    city: data.name,
    country: data.sys?.country,
    units,
    temp,   // temperature in requested units
    tempC,  // always Celsius for compatibility
    description: data.weather?.[0]?.description,
    humidity: data.main?.humidity,
    windKph,
    windMph,
  };
}
