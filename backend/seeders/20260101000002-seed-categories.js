'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const categories = [
      {
        name: 'eSIM',
        slug: 'esim',
        description: 'Instant digital eSIM data plans activated without swapping physical SIM cards.'
      },
      {
        name: 'Pocket WiFi',
        slug: 'pocket-wifi',
        description: 'Portable WiFi modems for reliable multi-device international internet connectivity.'
      },
      {
        name: 'SIM Card',
        slug: 'sim-card',
        description: 'Prepaid physical travel SIM cards ready for international journeys.'
      },
      {
        name: 'Bags & Luggage',
        slug: 'bags-and-luggage',
        description: 'Durable hardcase cabin luggage and travel bags built for frequent flyers.'
      },
      {
        name: 'Apparel',
        slug: 'apparel',
        description: 'Insulated winter jackets and cold-weather outerwear available for rent.'
      }
    ].map((item) => ({ ...item, is_active: true, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
