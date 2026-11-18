'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'home_stories',
      [
        {
          customer_name: 'Raka Pratama',
          gear_tag: 'Unlimited 5G Pocket WiFi Modem',
          testimonial:
            'Traveling abroad with my family was effortless. Renting the JavaPack Pocket WiFi kept everyone connected with a stable signal and easy airport pickup.',
          image_url: '/images/stories/story-family-modem.jpg',
          sort_order: 1,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          customer_name: 'Dina Safitri',
          gear_tag: 'Raturu Winter Jacket',
          testimonial:
            'My solo winter trip stayed super cozy. The JavaPack winter jacket was warm, lightweight to carry, and quick to pick up right before boarding.',
          image_url: '/images/stories/story-solo-paris.jpg',
          sort_order: 2,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          customer_name: 'Bima & Nadia',
          gear_tag: '20-Inch Hardcase Cabin Luggage',
          testimonial:
            'Exploring the city was so much smoother with JavaPack cabin luggage. Smooth wheels, spacious interior, and hassle-free drop-off at the airport counter.',
          image_url: '/images/stories/story-couple-china.jpg',
          sort_order: 3,
          is_active: true,
          created_at: now,
          updated_at: now
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('home_stories', null, {});
  }
};
