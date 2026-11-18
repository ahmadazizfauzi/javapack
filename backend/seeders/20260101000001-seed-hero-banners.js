'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const banners = [
      {
        title: 'Raturu Winter Jacket',
        subtitle: 'Rent insulated thermal puffer jackets built for cold-weather and snowy destinations without buying new.',
        image_url: '/uploads/jaket.jpg',
        cta_text: 'Rent Jacket',
        cta_link: '/products?search=Raturu',
        sort_order: 1,
        is_active: true
      },
      {
        title: 'Unlimited 5G Pocket WiFi Modem',
        subtitle: 'Stay connected abroad with high-speed 5G internet for up to 6 devices and all-day battery life.',
        image_url: '/uploads/modem.jpg',
        cta_text: 'Rent Modem',
        cta_link: '/products?search=Modem',
        sort_order: 2,
        is_active: true
      },
      {
        title: 'Premium Hardcase Cabin Luggage',
        subtitle: 'Lightweight polycarbonate cabin suitcase with 360-degree spinner wheels and TSA-approved lock.',
        image_url: '/uploads/koper.jpg',
        cta_text: 'Rent Luggage',
        cta_link: '/products?search=Luggage',
        sort_order: 3,
        is_active: true
      }
    ].map((item) => ({ ...item, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('hero_banners', banners, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('hero_banners', null, {});
  }
};
