const { Op } = require('sequelize');
const PaginationHelper = require('../helpers/paginationHelper');

/**
 * Generic CRUD service for supporting master tables (HeroBanner, Category, PickupLocation, Product, Faq).
 */
class MasterCrudService {
  static slugify(text) {
    return String(text)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  static async list(Model, query = {}, options = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = {};

    if (query.search && options.searchFields && options.searchFields.length > 0) {
      where[Op.or] = options.searchFields.map((field) => ({
        [field]: { [Op.like]: `%${query.search}%` }
      }));
    }

    if (query.is_active !== undefined) {
      where.is_active = query.is_active === 'true' || query.is_active === true;
    }

    if (options.filterFields && options.filterFields.length > 0) {
      for (const field of options.filterFields) {
        if (query[field] !== undefined && query[field] !== '') {
          where[field] = query[field];
        }
      }
    }

    const dateFilter = PaginationHelper.buildDateRangeFilter(query);
    if (dateFilter) {
      Object.assign(where, dateFilter);
    }

    const { rows, count } = await Model.findAndCountAll({
      where,
      include: options.include || [],
      order: PaginationHelper.buildSortOrder(
        query,
        options.sortFields || ['id', 'created_at', 'updated_at'],
        options.order || [['id', 'DESC']]
      ),
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async getById(Model, id, entityName = 'Resource', options = {}) {
    const record = await Model.findByPk(id, { include: options.include || [] });
    if (!record) {
      const error = new Error(`${entityName} not found`);
      error.statusCode = 404;
      throw error;
    }
    return record;
  }

  static async create(Model, payload, options = {}) {
    const data = { ...payload };
    if (options.autoSlugFrom && data[options.autoSlugFrom] && !data.slug) {
      data.slug = this.slugify(data[options.autoSlugFrom]);
    }
    return Model.create(data);
  }

  static async update(Model, id, payload, entityName = 'Resource', options = {}) {
    const record = await this.getById(Model, id, entityName);
    const data = { ...payload };
    if (options.autoSlugFrom && data[options.autoSlugFrom] && !data.slug) {
      data.slug = this.slugify(data[options.autoSlugFrom]);
    }
    await record.update(data);
    return record;
  }

  static async remove(Model, id, entityName = 'Resource') {
    const record = await this.getById(Model, id, entityName);
    await record.destroy();
    return { id: Number(id) };
  }
}

module.exports = MasterCrudService;
