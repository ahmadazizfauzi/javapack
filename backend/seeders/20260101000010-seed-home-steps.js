'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'home_steps',
      [
        {
          step_label: 'Step 01 - Book Online',
          title: 'Choose Your Gear',
          description:
            'Select winter jackets, Pocket WiFi modems, or cabin luggage and set your travel dates.',
          sort_order: 1,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          step_label: 'Step 02 - Instant Checkout',
          title: 'Instant Payment',
          description:
            'Pay securely via Midtrans and receive instant order confirmation on WhatsApp.',
          sort_order: 2,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          step_label: 'Step 03 - Departure',
          title: 'Airport Pickup',
          description:
            'Show your order code at our airport counter and pick up your sanitized gear.',
          sort_order: 3,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          step_label: 'Step 04 - Arrival',
          title: 'Easy Return',
          description:
            'Drop off your gear at the airport counter when you land back home.',
          sort_order: 4,
          is_active: true,
          created_at: now,
          updated_at: now
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('home_steps', null, {});
  }
};
