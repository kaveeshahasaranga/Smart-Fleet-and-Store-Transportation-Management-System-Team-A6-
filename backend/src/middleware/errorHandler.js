export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error, _req, res, _next) {
  let status = error.status || error.statusCode || 500;
  let message = error.message;
  if (error.code === 11000) {
    status = 409;
    message = 'An active record with this registration number or item name already exists.';
  } else if (error.name === 'VersionError') {
    status = 409;
    message = 'This record changed. Refresh and try again.';
  } else if (['ValidationError', 'CastError', 'StrictModeError'].includes(error.name)) {
    status = 400;
  } else if (error.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON request body.';
  }
  if (status >= 500) console.error(error);
  res.status(status).json({
    message: status >= 500 ? 'Service unavailable. Please try again later.' : message,
    ...(status < 500 && error.details ? { details: error.details } : {}),
  });
}
