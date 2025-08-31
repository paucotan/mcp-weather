import { Router } from 'express';
import { getCurrentWeather } from '../lib/openweather.js';
import { config } from '../lib/env.js';
import { asyncHandler } from '../middleware/errors.js';

const router = Router();

// GET /weather?city=Vancouver
router.get('/', asyncHandler(async (req, res) => {
  const city = (req.query.city || '').toString().trim();
  if (!city) return res.status(400).json({ error: 'Missing ?city' });

  // Optional units: metric (default) or imperial
  let units = (req.query.units || 'metric').toString().trim().toLowerCase();
  if (!['metric', 'imperial'].includes(units)) units = 'metric';

  try {
    const data = await getCurrentWeather(city, { apiKey: config.openWeatherKey, units });
    res.json(data);
  } catch (e) {
    // Provide a friendlier hint for 401
    if (e && e.status === 401) {
      return res.status(401).json({
        error: 'Unauthorized from OpenWeather',
        hint: 'Check your API key, allow 10–60 minutes for activation, and ensure the env var is OPENWEATHER_API_KEY.',
        detail: String(e.message || e),
      });
    }
    throw e;
  }
}));

export default router;
