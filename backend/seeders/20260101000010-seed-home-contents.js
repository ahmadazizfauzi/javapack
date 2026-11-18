'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'home_contents',
      [
        {
          badge_text: 'International Travel Gear Rental',
          headline: 'Travel Lighter with JavaPack',
          subheadline:
            'Rent winter jackets, Pocket WiFi modems, and cabin luggage with convenient pickup right at the airport.',
          created_at: now,
          updated_at: now
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('home_contents', null, {});
  }
};
