'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const cities = [
      'Malang',
      'Semarang',
      'Surabaya',
      'Boyolali',
      'Jakarta',
      'Bali',
      'Yogyakarta',
      'Bandung',
      'Medan',
      'Makassar',
      'Balikpapan',
      'Palembang',
      'Lombok',
      'Batam',
      'Manado'
    ];

    const locations = cities.map((city) => ({
      name: `${city} Airport`,
      address: `Arrival Terminal, ${city} Airport`,
      city,
      operational_hours: '07:00 - 22:00 WIB',
      is_active: true,
      created_at: now,
      updated_at: now
    }));

    await queryInterface.bulkInsert('pickup_locations', locations, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('pickup_locations', null, {});
  }
};
