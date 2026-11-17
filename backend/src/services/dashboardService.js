const { Op, fn, col } = require('sequelize');
const { Product, Order, SiteVisit } = require('../models');
const DateHelper = require('../helpers/dateHelper');

class DashboardService {
  static async recordVisit({ visitor_token, page = 'home', user_agent = null }) {
    const existing = await SiteVisit.findOne({ where: { visitor_token } });
    const visitorType = existing ? 'returning' : 'new';
    const todayWib = DateHelper.nowWib().slice(0, 10);

    return SiteVisit.create({
      visitor_token,
      visitor_type: visitorType,
      page,
      user_agent: user_agent ? String(user_agent).slice(0, 255) : null,
      visit_date: todayWib
    });
  }

  static async getDashboardOverview(query = {}) {
    const nowWibStr = DateHelper.nowWib();
    const defaultYear = parseInt(nowWibStr.slice(0, 4), 10);
    const defaultMonth = parseInt(nowWibStr.slice(5, 7), 10);

    const year = parseInt(query.year, 10) || defaultYear;
    const month = Math.min(12, Math.max(1, parseInt(query.month, 10) || defaultMonth));
    const daysInMonth = new Date(year, month, 0).getDate();

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    const visitWhere = {
      visit_date: { [Op.between]: [startDate, endDate] }
    };
    if (query.page && query.page !== 'all') {
      visitWhere.page = query.page;
    }
    if (query.visitor_type && query.visitor_type !== 'all') {
      visitWhere.visitor_type = query.visitor_type;
    }

    const [totalProducts, activeRentals, totalRevenue, totalVisits, dailyVisits] = await Promise.all([
      Product.count({ where: { is_active: true } }),
      Order.count({ where: { status: 'active_rent' } }),
      Order.sum('total_amount', { where: { status: ['paid', 'active_rent'] } }),
      SiteVisit.count(),
      SiteVisit.findAll({
        attributes: ['visit_date', [fn('COUNT', col('id')), 'visits']],
        where: visitWhere,
        group: ['visit_date'],
        raw: true
      })
    ]);

    const visitMap = {};
    dailyVisits.forEach((row) => {
      const dayKey = String(row.visit_date).slice(8, 10);
      visitMap[dayKey] = Number(row.visits) || 0;
    });

    const siteVisits = Array.from({ length: daysInMonth }, (_, idx) => {
      const day = String(idx + 1).padStart(2, '0');
      return {
        day,
        visits: visitMap[day] || 0
      };
    });

    const formattedRevenue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(totalRevenue || 0));

    return {
      kpis: [
        { id: 'total-products', label: 'Active Products', value: String(totalProducts) },
        { id: 'active-rentals', label: 'Active Rentals', value: String(activeRentals) },
        { id: 'total-revenue', label: 'Confirmed Revenue', value: formattedRevenue, highlighted: true },
        { id: 'total-visits', label: 'Total Site Visits', value: String(totalVisits) }
      ],
      siteVisits
    };
  }
}

module.exports = DashboardService;
