const ApiResponse = require('../helpers/apiResponse');
const MasterCrudService = require('../services/masterCrudService');

/**
 * Creates a standardized CRUD controller for a given Sequelize model.
 */
function createMasterCrudController(Model, entityName, options = {}) {
  return {
    list: async (req, res, next) => {
      try {
        const data = await MasterCrudService.list(Model, req.query, options);
        return ApiResponse.success(res, `${entityName} list retrieved successfully`, data);
      } catch (error) {
        return next(error);
      }
    },

    getById: async (req, res, next) => {
      try {
        const data = await MasterCrudService.getById(Model, req.params.id, entityName, options);
        return ApiResponse.success(res, `${entityName} retrieved successfully`, data);
      } catch (error) {
        return next(error);
      }
    },

    create: async (req, res, next) => {
      try {
        if (options.requiredFields) {
          const missing = options.requiredFields.filter((f) => req.body[f] === undefined || req.body[f] === '');
          if (missing.length > 0) {
            return ApiResponse.badRequest(res, `Missing required fields: ${missing.join(', ')}`);
          }
        }
        const data = await MasterCrudService.create(Model, req.body, options);
        return ApiResponse.created(res, `${entityName} created successfully`, data);
      } catch (error) {
        return next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const data = await MasterCrudService.update(Model, req.params.id, req.body, entityName, options);
        return ApiResponse.success(res, `${entityName} updated successfully`, data);
      } catch (error) {
        return next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const data = await MasterCrudService.remove(Model, req.params.id, entityName);
        return ApiResponse.success(res, `${entityName} deleted successfully`, data);
      } catch (error) {
        return next(error);
      }
    }
  };
}

module.exports = createMasterCrudController;
