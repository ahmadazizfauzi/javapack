'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const banners = [
      {
        title: 'eSIM Japan',
        subtitle: 'Single country Japan 5G eSIM with unlimited and fixed quota options — instant QR activation.',
        image_url: '/uploads/esim-japan.jpg',
        cta_text: 'Rent eSIM',
        cta_link: '/products?search=eSIM',
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
