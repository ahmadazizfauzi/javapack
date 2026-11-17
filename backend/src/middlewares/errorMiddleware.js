const ApiResponse = require('../helpers/apiResponse');

// Handle 404 routes
const notFoundHandler = (req, res, next) => {
  return ApiResponse.notFound(res, `Cannot ${req.method} ${req.originalUrl}`);
};

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  console.error('[Error caught by middleware]:', err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
