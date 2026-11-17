const ApiResponse = require('../helpers/apiResponse');
const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password || !phone || !String(phone).trim()) {
        return ApiResponse.badRequest(res, 'Name, email, phone, and password are required');
      }

      const result = await AuthService.register({ name, email, password, phone });
      return ApiResponse.created(res, 'User registered successfully', result);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ApiResponse.badRequest(res, 'Email and password are required');
      }

      const result = await AuthService.login({ email, password });
      return ApiResponse.success(res, 'Login successful', result);
    } catch (error) {
      return next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return ApiResponse.badRequest(res, 'refreshToken is required');
      }

      const result = await AuthService.refreshToken(refreshToken);
      return ApiResponse.success(res, 'Token refreshed successfully', result);
    } catch (error) {
      return next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return ApiResponse.success(res, 'User profile retrieved successfully', user);
    } catch (error) {
      return next(error);
    }
  }

  static async updateMe(req, res, next) {
    try {
      const { name, phone } = req.body;
      const user = await AuthService.updateProfile(req.user.id, { name, phone });
      return ApiResponse.success(res, 'User profile updated successfully', user);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthController;
