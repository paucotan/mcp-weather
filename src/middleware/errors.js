// Wrap async route handlers to forward errors to Express
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path, hint: 'Use /weather?city=CityName or /openapi.yaml' });
};

export const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  // Avoid leaking sensitive info; include message and a generic label
  res.status(status).json({ error: status === 401 ? 'Unauthorized' : 'Server error', detail: String(err.message || err) });
};

