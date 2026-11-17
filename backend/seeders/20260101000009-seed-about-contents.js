'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'about_contents',
      [
        {
          eyebrow: 'WHY CHOOSE JAVAPACK?',
          title: 'Rent Premium Travel Gear, Save Up to 70% on Trip Costs',
          description:
            'JavaPack helps travelers heading to four-season destinations avoid buying expensive thermal parkas, hardcase luggage, or action cameras that are only used once a year.\n\nEvery item goes through hygienic laundry and UV sterilization before dispatch, and can be picked up and returned directly at our Soekarno-Hatta Terminal 3 counter.',
          banner_image_url: '/images/travel-lounge.jpg',
          side_image_url: '/images/travel-winter.jpg',
          created_at: now,
          updated_at: now
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('about_contents', null, {});
  }
};
