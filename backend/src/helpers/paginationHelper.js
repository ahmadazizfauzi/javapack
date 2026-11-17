const { Op } = require('sequelize');

/**
 * Pagination & Standardized Query Filter Helper across all list endpoints.
 * Standard query params: `page`, `limit`, `search`, `start_date`, `end_date`.
 */
class PaginationHelper {
  static getPaginationParams(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  static buildDateRangeFilter(query = {}, field = 'created_at') {
    const { start_date, end_date } = query;
    if (!start_date && !end_date) {
      return null;
    }

    const range = {};
    if (start_date) {
      range[Op.gte] = `${start_date} 00:00:00`;
    }
    if (end_date) {
      range[Op.lte] = `${end_date} 23:59:59`;
    }

    return { [field]: range };
  }

  static formatPaginatedResponse(rows, count, page, limit) {
    return {
      items: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit) || 1
      }
    };
  }
}

module.exports = PaginationHelper;
