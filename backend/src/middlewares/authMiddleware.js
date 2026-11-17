const jwt = require('jsonwebtoken');
const ApiResponse = require('../helpers/apiResponse');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production');
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Invalid or expired token.');
  }
};

module.exports = authMiddleware;
