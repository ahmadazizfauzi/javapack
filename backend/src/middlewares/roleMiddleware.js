const ApiResponse = require('../helpers/apiResponse');

/**
 * Role-based authorization middleware.
 * @param  {...string} allowedRoles
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Access denied. Insufficient permissions.');
    }
    return next();
  };
};

module.exports = roleMiddleware;
