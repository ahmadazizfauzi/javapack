'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'about_contents',
      [
        {
          eyebrow: 'ABOUT JAVAPACK',
          title: 'The Story Behind JavaPack and Our Travel Gear Rental Service',
          description:
            'The name JavaPack comes from two simple words: "Java", representing Jawa, and "Pack", meaning the essential belongings we pack for a journey. Built on that straightforward idea, JavaPack makes international and seasonal travel easier without forcing travelers to buy expensive gear for occasional trips.\n\nWe provide clean, well-maintained winter jackets, 5G Pocket WiFi modems, and hardcase cabin luggage ready for pickup directly at your chosen airport.',
          banner_image_url: '/images/products/koper.jpg',
          side_image_url: '/images/products/jaket.jpg',
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
