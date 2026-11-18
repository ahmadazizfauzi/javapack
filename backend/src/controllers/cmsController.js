const fs = require('fs');
const path = require('path');
const ApiResponse = require('../helpers/apiResponse');
const CmsService = require('../services/cmsService');

class CmsController {
  static async listOrders(req, res, next) {
    try {
      const data = await CmsService.listOrders(req.query);
      return ApiResponse.success(res, 'CMS orders retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const data = await CmsService.getOrderById(req.params.id);
      return ApiResponse.success(res, 'CMS order detail retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async verifyOrderPickupToken(req, res, next) {
    try {
      const data = await CmsService.getOrderByPickupToken(req.query.token);
      return ApiResponse.success(res, 'Order verified successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status) {
        return ApiResponse.badRequest(res, 'status is required');
      }
      const data = await CmsService.updateOrderStatus(req.params.id, status);
      return ApiResponse.success(res, 'Order status updated successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteOrder(req, res, next) {
    try {
      const data = await CmsService.deleteOrder(req.params.id);
      return ApiResponse.success(res, 'Order deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async listUsers(req, res, next) {
    try {
      const data = await CmsService.listUsers(req.query);
      return ApiResponse.success(res, 'CMS users retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async updateUserStatus(req, res, next) {
    try {
      if (req.body.is_active === undefined) {
        return ApiResponse.badRequest(res, 'is_active is required');
      }
      const data = await CmsService.updateUserStatus(req.params.id, req.body.is_active);
      return ApiResponse.success(res, 'User status updated successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async listContacts(req, res, next) {
    try {
      const data = await CmsService.listContacts(req.query);
      return ApiResponse.success(res, 'Contact messages retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async updateContactStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status) {
        return ApiResponse.badRequest(res, 'status is required');
      }
      const data = await CmsService.updateContactStatus(req.params.id, status);
      return ApiResponse.success(res, 'Contact message status updated successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteContact(req, res, next) {
    try {
      const data = await CmsService.deleteContact(req.params.id);
      return ApiResponse.success(res, 'Contact message deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getAboutUs(req, res, next) {
    try {
      const data = await CmsService.getAboutUs();
      return ApiResponse.success(res, 'About Us content retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async updateAboutUs(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return ApiResponse.badRequest(res, 'title and description are required');
      }
      const data = await CmsService.updateAboutUs(req.body);
      return ApiResponse.success(res, 'About Us content updated successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async uploadImage(req, res, next) {
    try {
      const { filename, dataUrl } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return ApiResponse.badRequest(res, 'dataUrl is required');
      }

      const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/i);
      if (!match) {
        return ApiResponse.badRequest(res, 'Invalid image format. Allowed: png, jpg, jpeg, webp, gif');
      }

      const ext = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
      const baseName = (filename || 'image')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 40) || 'image';
      const savedName = `${Date.now()}-${baseName}.${ext}`;

      const uploadDir = path.join(__dirname, '../../public/uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, savedName), Buffer.from(match[2], 'base64'));

      const baseUrl =
        (process.env.APP_BASE_URL || '').replace(/\/+$/, '') ||
        `${req.protocol}://${req.get('host')}`;
      const url = `${baseUrl}/uploads/${savedName}`;

      return ApiResponse.success(res, 'Image uploaded successfully', { url });
    } catch (error) {
      return next(error);
    }
  }

  static async getContactInfo(req, res, next) {
    try {
      const data = await CmsService.getContactInfo();
      return ApiResponse.success(res, 'Contact info retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async updateContactInfo(req, res, next) {
    try {
      const { location_title, address, whatsapp, email, latitude, longitude } = req.body;
      if (!location_title || !address || !whatsapp || !email || !latitude || !longitude) {
        return ApiResponse.badRequest(
          res,
          'location_title, address, whatsapp, email, latitude, and longitude are required'
        );
      }
      const data = await CmsService.updateContactInfo(req.body);
      return ApiResponse.success(res, 'Contact info updated successfully', data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CmsController;
