const ApiResponse = require('../helpers/apiResponse');

class HealthController {
  static check(req, res) {
    return ApiResponse.success(res, 'Backend service is up and running!', {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
}

module.exports = HealthController;
