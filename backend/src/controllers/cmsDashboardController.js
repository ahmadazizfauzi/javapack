const ApiResponse = require('../helpers/apiResponse');
const DashboardService = require('../services/dashboardService');

class CmsDashboardController {
  static async getOverview(req, res, next) {
    try {
      const data = await DashboardService.getDashboardOverview(req.query);
      return ApiResponse.success(res, 'Dashboard overview retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CmsDashboardController;
