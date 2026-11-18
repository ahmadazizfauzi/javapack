'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM categories WHERE deleted_at IS NULL ORDER BY id ASC'
    );
    const [locations] = await queryInterface.sequelize.query(
      'SELECT id FROM pickup_locations WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    if (!categories.length || !locations.length) {
      throw new Error('Categories and pickup_locations must be seeded before products.');
    }

    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));
    const esimId = categoryMap.get('esim') ?? categories[0].id;
    const apparelId = categoryMap.get('apparel') ?? categories[0].id;
    const pocketWifiId = categoryMap.get('pocket-wifi') ?? categories[0].id;
    const bagsLuggageId = categoryMap.get('bags-and-luggage') ?? categories[0].id;

    const now = new Date();
    const rawProducts = [
      {
        category_id: apparelId,
        name: 'Raturu Winter Jacket',
        slug: 'raturu-winter-jacket',
        description: 'Windproof thermal puffer jacket designed for snow and four-season travel.',
        image_url: '/uploads/jaket.jpg',
        price_per_day: 45000,
        stock: 20,
        is_physical: true
      },
      {
        category_id: pocketWifiId,
        name: 'Unlimited 5G Pocket WiFi Modem',
        slug: 'unlimited-5g-pocket-wifi-modem',
        description: 'Portable 5G Pocket WiFi modem delivering fast unlimited internet for up to 6 devices.',
        image_url: '/uploads/modem.jpg',
        price_per_day: 55000,
        stock: 25,
        is_physical: true
      },
      {
        category_id: bagsLuggageId,
        name: '20-Inch Hardcase Cabin Luggage',
        slug: '20-inch-hardcase-cabin-luggage',
        description: 'Lightweight polycarbonate cabin suitcase with 360-degree wheels and TSA-approved lock.',
        image_url: '/uploads/koper.jpg',
        price_per_day: 40000,
        stock: 15,
        is_physical: true
      },
      {
        category_id: esimId,
        name: 'eSIM Japan',
        slug: 'esim-japan',
        description: 'Single country Japan 5G eSIM with unlimited and fixed quota options — instant QR activation.',
        image_url: '/uploads/esim-japan.jpg',
        price_per_day: 19000,
        stock: 50,
        is_physical: false
      }
    ];

    const products = rawProducts.map((item, idx) => ({
      ...item,
      pickup_location_id: item.is_physical ? locations[idx % locations.length].id : null,
      is_active: true,
      created_at: now,
      updated_at: now
    }));

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
