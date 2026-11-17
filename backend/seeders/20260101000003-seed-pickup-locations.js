'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const locations = [
      {
        name: 'Semarang Simpang Lima',
        address: 'Jl. Ahmad Yani No. 140, Semarang',
        city: 'Semarang',
        operational_hours: '09:00 - 20:00 WIB'
      },
      {
        name: 'Malang Soekarno-Hatta Hub',
        address: 'Jl. Soekarno Hatta No. 18, Lowokwaru, Malang',
        city: 'Malang',
        operational_hours: '08:00 - 22:00 WIB'
      },
      {
        name: 'Jakarta Selatan HQ',
        address: 'Jl. Kemang Raya No. 45, South Jakarta',
        city: 'Jakarta',
        operational_hours: '08:00 - 21:00 WIB'
      },
      {
        name: 'Boyolali Adi Soemarmo Point',
        address: 'Jl. Bandara Adi Soemarmo No. 12, Boyolali',
        city: 'Boyolali',
        operational_hours: '07:00 - 21:00 WIB'
      }
    ].map((item) => ({ ...item, is_active: true, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('pickup_locations', locations, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('pickup_locations', null, {});
  }
};
