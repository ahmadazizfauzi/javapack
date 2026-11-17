const ApiResponse = require('../helpers/apiResponse');
const PublicService = require('../services/publicService');
const DashboardService = require('../services/dashboardService');

class PublicController {
  static async getHome(req, res, next) {
    try {
      const data = await PublicService.getHomeData(req.query);
      return ApiResponse.success(res, 'Home data retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getProducts(req, res, next) {
    try {
      const data = await PublicService.getProducts(req.query);
      return ApiResponse.success(res, 'Products retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getProductBySlug(req, res, next) {
    try {
      const data = await PublicService.getProductBySlug(req.params.slug);
      return ApiResponse.success(res, 'Product detail retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const data = await PublicService.getCategories(req.query);
      return ApiResponse.success(res, 'Categories retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getPickupLocations(req, res, next) {
    try {
      const data = await PublicService.getPickupLocations(req.query);
      return ApiResponse.success(res, 'Pickup locations retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getFaqs(req, res, next) {
    try {
      const data = await PublicService.getFaqs(req.query);
      return ApiResponse.success(res, 'FAQs retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getAboutUs(req, res, next) {
    try {
      const data = await PublicService.getAboutUs();
      return ApiResponse.success(res, 'About Us content retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getContactInfo(req, res, next) {
    try {
      const data = await PublicService.getContactInfo();
      return ApiResponse.success(res, 'Contact info retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async createContactMessage(req, res, next) {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return ApiResponse.badRequest(res, 'Name, email, subject, and message are required');
      }

      const data = await PublicService.createContactMessage({ name, email, subject, message });
      return ApiResponse.created(res, 'Contact message submitted successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async recordSiteVisit(req, res, next) {
    try {
      const { visitor_token, page } = req.body;
      if (!visitor_token) {
        return ApiResponse.badRequest(res, 'visitor_token is required');
      }

      const data = await DashboardService.recordVisit({
        visitor_token,
        page: page || 'home',
        user_agent: req.headers['user-agent']
      });
      return ApiResponse.created(res, 'Site visit recorded successfully', data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = PublicController;
