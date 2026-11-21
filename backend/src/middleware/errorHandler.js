export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error, _req, res, _next) {
  const duplicateTripCode = error.code === 'ER_DUP_ENTRY' || error.code === 11000;
  const status = duplicateTripCode ? 409 : error.name === 'ValidationError' ? 400 : error.status || error.statusCode || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: status >= 500 ? 'Internal server error' : duplicateTripCode ? 'A trip with this code already exists.' : error.message });
}
