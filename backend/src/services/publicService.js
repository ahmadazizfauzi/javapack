const { Op } = require('sequelize');
const {
  HeroBanner,
  Category,
  PickupLocation,
  Product,
  Faq,
  ContactMessage,
  AboutContent,
  HomeContent,
  ContactInfo
} = require('../models');
const PaginationHelper = require('../helpers/paginationHelper');
const UrlHelper = require('../helpers/urlHelper');

class PublicService {
  static formatBanner(banner) {
    const data = banner.toJSON();
    data.image_url = UrlHelper.resolveAssetUrl(data.image_url);
    return data;
  }

  static formatProduct(product) {
    const data = product.toJSON();
    data.image_url = UrlHelper.resolveAssetUrl(data.image_url);
    return data;
  }

  static async getHomeData(query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);

    const [banners, categories, pickupLocations, productResult, homeContent] = await Promise.all([
      HeroBanner.findAll({
        where: { is_active: true },
        order: [['sort_order', 'ASC'], ['id', 'ASC']]
      }),
      Category.findAll({
        where: { is_active: true },
        order: [['id', 'ASC']]
      }),
      PickupLocation.findAll({
        where: { is_active: true },
        order: [['id', 'ASC']]
      }),
      Product.findAndCountAll({
        where: { is_active: true },
        include: [
          { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
          { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city', 'address', 'operational_hours'] }
        ],
        order: [['id', 'ASC']],
        limit,
        offset
      }),
      HomeContent.findOne({ order: [['id', 'ASC']] })
    ]);

    return {
      home_content: homeContent || {
        badge_text: 'International Travel Gear Rental',
        headline: 'Travel Lighter, Your Gear Ready at the Airport',
        subheadline:
          'Rent winter jackets, hardcase luggage, action cams & WiFi adapters without buying expensive gear — easy pickup at Terminal 3.'
      },
      hero_banners: banners.map((b) => this.formatBanner(b)),
      categories,
      pickup_locations: pickupLocations,
      featured_products: PaginationHelper.formatPaginatedResponse(
        productResult.rows.map((p) => this.formatProduct(p)),
        productResult.count,
        page,
        limit
      )
    };
  }

  static async getProducts(query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams({
      ...query,
      limit: query.limit || 20
    });
    const where = { is_active: true };

    if (query.category_id) {
      where.category_id = query.category_id;
    }
    if (query.pickup_location_id) {
      where.pickup_location_id = query.pickup_location_id;
    }
    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } }
      ];
    }
    const dateFilter = PaginationHelper.buildDateRangeFilter(query);
    if (dateFilter) {
      Object.assign(where, dateFilter);
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city', 'address', 'operational_hours'] }
      ],
      order: [['id', 'ASC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(
      rows.map((p) => this.formatProduct(p)),
      count,
      page,
      limit
    );
  }

  static async getProductBySlug(slug) {
    const product = await Product.findOne({
      where: { slug, is_active: true },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city', 'address', 'operational_hours'] }
      ]
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    return this.formatProduct(product);
  }

  static async getCategories(query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = { is_active: true };

    if (query.search) {
      where.name = { [Op.like]: `%${query.search}%` };
    }

    const { rows, count } = await Category.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async getPickupLocations(query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = { is_active: true };

    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { city: { [Op.like]: `%${query.search}%` } }
      ];
    }

    const { rows, count } = await PickupLocation.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async getFaqs(query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = { is_active: true };

    if (query.search) {
      where[Op.or] = [
        { question: { [Op.like]: `%${query.search}%` } },
        { answer: { [Op.like]: `%${query.search}%` } }
      ];
    }

    const { rows, count } = await Faq.findAndCountAll({
      where,
      order: [['id', 'ASC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async createContactMessage({ name, email, subject, message }) {
    return ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'unread'
    });
  }

  static async getAboutUs() {
    const about = await AboutContent.findOne({ order: [['id', 'ASC']] });
    return about || {};
  }

  static async getContactInfo() {
    const info = await ContactInfo.findOne({ order: [['id', 'ASC']] });
    return info || {};
  }
}

module.exports = PublicService;
