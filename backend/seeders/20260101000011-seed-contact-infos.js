'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'contact_infos',
      [
        {
          location_title: 'Malang',
          location_subtitle: 'Suhat',
          address: 'Jatimulyo, Lowokwaru, Kota Malang, Jawa Timur',
          whatsapp: '085216373763',
          email: 'admin@gmail.com',
          operating_hours: 'Open Daily 08:00 - 22:00 WIB',
          latitude: '-7.962497128667803',
          longitude: '112.65455289479156',
          created_at: now,
          updated_at: now
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('contact_infos', null, {});
  }
};
