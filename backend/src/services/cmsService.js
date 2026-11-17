const { Op } = require('sequelize');
const {
  sequelize,
  Order,
  User,
  Product,
  Category,
  PickupLocation,
  ContactMessage,
  RentalHistoryLog,
  AboutContent,
  HomeContent,
  ContactInfo
} = require('../models');
const PaginationHelper = require('../helpers/paginationHelper');

class CmsService {
  static async listOrders(query = {}) {
    await require('./orderService').syncPendingOrdersWithMidtrans();
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.pickup_location_id) {
      where.pickup_location_id = query.pickup_location_id;
    }
    if (query.search) {
      where[Op.or] = [
        { order_code: { [Op.like]: `%${query.search}%` } },
        { '$user.name$': { [Op.like]: `%${query.search}%` } },
        { '$user.email$': { [Op.like]: `%${query.search}%` } },
        { '$product.name$': { [Op.like]: `%${query.search}%` } }
      ];
    }

    const dateFilter = PaginationHelper.buildDateRangeFilter(query);
    if (dateFilter) {
      Object.assign(where, dateFilter);
    }

    const productWhere = {};
    if (query.category_id) {
      productWhere.category_id = query.category_id;
    }

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'category_id', 'price_per_day'],
          where: Object.keys(productWhere).length ? productWhere : undefined,
          include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
        },
        { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city', 'address'] }
      ],
      order: [['id', 'ASC']],
      limit,
      offset,
      subQuery: false
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async getOrderById(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'price_per_day'],
          include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
        },
        { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city', 'address', 'operational_hours'] }
      ]
    });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }
    return order;
  }

  static async updateOrderStatus(orderId, status) {
    const allowedStatuses = ['pending_payment', 'paid', 'active_rent'];
    if (!allowedStatuses.includes(status)) {
      const error = new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const order = await this.getOrderById(orderId);
    await order.update({ status });
    await require('./orderService').recordRentalLog({
      order,
      productName: order.product ? order.product.name : 'Travel Gear',
      eventStatus: status,
      note: `Status updated to ${status} by admin`
    });
    return order;
  }

  static async deleteOrder(orderId) {
    return sequelize.transaction(async (t) => {
      const order = await Order.findByPk(orderId, { lock: t.LOCK.UPDATE, transaction: t });
      if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
      }

      if (order.status === 'pending_payment') {
        const product = await Product.findByPk(order.product_id, { lock: t.LOCK.UPDATE, transaction: t });
        if (product) {
          await product.update({ stock: product.stock + order.quantity }, { transaction: t });
        }
      }

      await order.destroy({ transaction: t });
      return { id: Number(orderId) };
    });
  }

  static async listUsers(query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = {};

    if (query.role) {
      where.role = query.role;
    }
    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { email: { [Op.like]: `%${query.search}%` } },
        { phone: { [Op.like]: `%${query.search}%` } }
      ];
    }

    const dateFilter = PaginationHelper.buildDateRangeFilter(query);
    if (dateFilter) {
      Object.assign(where, dateFilter);
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      order: [['id', 'ASC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async listContacts(query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { email: { [Op.like]: `%${query.search}%` } },
        { subject: { [Op.like]: `%${query.search}%` } },
        { message: { [Op.like]: `%${query.search}%` } }
      ];
    }

    const dateFilter = PaginationHelper.buildDateRangeFilter(query);
    if (dateFilter) {
      Object.assign(where, dateFilter);
    }

    const { rows, count } = await ContactMessage.findAndCountAll({
      where,
      order: [['id', 'ASC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async updateContactStatus(contactId, status) {
    const allowedStatuses = ['unread', 'read'];
    if (!allowedStatuses.includes(status)) {
      const error = new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const contact = await ContactMessage.findByPk(contactId);
    if (!contact) {
      const error = new Error('Contact message not found');
      error.statusCode = 404;
      throw error;
    }

    await contact.update({ status });
    return contact;
  }

  static async deleteContact(contactId) {
    const contact = await ContactMessage.findByPk(contactId);
    if (!contact) {
      const error = new Error('Contact message not found');
      error.statusCode = 404;
      throw error;
    }

    await contact.destroy();
    return { id: Number(contactId) };
  }

  static async getAboutUs() {
    const about = await AboutContent.findOne({ order: [['id', 'ASC']] });
    return (
      about || {
        id: null,
        eyebrow: '',
        title: '',
        description: '',
        banner_image_url: '',
        side_image_url: ''
      }
    );
  }

  static async updateAboutUs(payload = {}) {
    const about = await AboutContent.findOne({ order: [['id', 'ASC']] });
    if (!about) {
      return AboutContent.create({
        eyebrow: payload.eyebrow || 'WHY CHOOSE JAVAPACK?',
        title: payload.title || '',
        description: payload.description || '',
        banner_image_url: payload.banner_image_url || '/images/travel-lounge.jpg',
        side_image_url: payload.side_image_url || '/images/travel-winter.jpg'
      });
    }
    await about.update({
      eyebrow: payload.eyebrow !== undefined ? payload.eyebrow : about.eyebrow,
      title: payload.title !== undefined ? payload.title : about.title,
      description: payload.description !== undefined ? payload.description : about.description,
      banner_image_url:
        payload.banner_image_url !== undefined ? payload.banner_image_url : about.banner_image_url,
      side_image_url:
        payload.side_image_url !== undefined ? payload.side_image_url : about.side_image_url
    });
    return about;
  }

  static async getHomeContent() {
    const home = await HomeContent.findOne({ order: [['id', 'ASC']] });
    return (
      home || {
        id: null,
        badge_text: '',
        headline: '',
        subheadline: ''
      }
    );
  }

  static async updateHomeContent(payload = {}) {
    const home = await HomeContent.findOne({ order: [['id', 'ASC']] });
    if (!home) {
      return HomeContent.create({
        badge_text: payload.badge_text || '',
        headline: payload.headline || '',
        subheadline: payload.subheadline || ''
      });
    }
    await home.update({
      badge_text: payload.badge_text !== undefined ? payload.badge_text : home.badge_text,
      headline: payload.headline !== undefined ? payload.headline : home.headline,
      subheadline: payload.subheadline !== undefined ? payload.subheadline : home.subheadline
    });
    return home;
  }

  static async getContactInfo() {
    const info = await ContactInfo.findOne({ order: [['id', 'ASC']] });
    return (
      info || {
        id: null,
        location_title: '',
        location_subtitle: '',
        address: '',
        whatsapp: '',
        email: '',
        operating_hours: '',
        latitude: '',
        longitude: ''
      }
    );
  }

  static async updateContactInfo(payload = {}) {
    const info = await ContactInfo.findOne({ order: [['id', 'ASC']] });
    if (!info) {
      return ContactInfo.create({
        location_title: payload.location_title || '',
        location_subtitle: payload.location_subtitle || '',
        address: payload.address || '',
        whatsapp: payload.whatsapp || '',
        email: payload.email || '',
        operating_hours: payload.operating_hours || '',
        latitude: payload.latitude || null,
        longitude: payload.longitude || null
      });
    }
    await info.update({
      location_title:
        payload.location_title !== undefined ? payload.location_title : info.location_title,
      location_subtitle:
        payload.location_subtitle !== undefined ? payload.location_subtitle : info.location_subtitle,
      address: payload.address !== undefined ? payload.address : info.address,
      whatsapp: payload.whatsapp !== undefined ? payload.whatsapp : info.whatsapp,
      email: payload.email !== undefined ? payload.email : info.email,
      operating_hours:
        payload.operating_hours !== undefined ? payload.operating_hours : info.operating_hours,
      latitude: payload.latitude !== undefined ? payload.latitude : info.latitude,
      longitude: payload.longitude !== undefined ? payload.longitude : info.longitude
    });
    return info;
  }
}

module.exports = CmsService;
