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
          headline: 'Travel Lighter, Your Gear Ready at the Airport',
          subheadline:
            'Rent winter jackets, hardcase luggage, action cams & WiFi adapters without buying expensive gear — easy pickup at Terminal 3.',
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
