'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'contact_infos',
      [
        {
          location_title: 'JavaPack Counter — Malang, East Java',
          location_subtitle: 'Malang City, East Java, Indonesia',
          address: 'Jl. Soekarno Hatta No. 18, Lowokwaru, Malang, East Java 65141',
          whatsapp: '+62 812-3456-7890',
          email: 'hello@javapack.id',
          operating_hours: 'Open Daily 08:00 - 22:00 WIB',
          latitude: '-7.9467',
          longitude: '112.6157',
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
