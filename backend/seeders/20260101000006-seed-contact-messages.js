'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const messages = [
      { name: 'Liam Carter', email: 'liam.carter@example.com', subject: 'Group Winter Jacket Inquiry', message: 'Do you offer discounts for 8 parkas rented for 10 days?', status: 'unread' },
      { name: 'Sophia Lin', email: 'sophia.lin@example.com', subject: 'Terminal 3 Early Morning Pickup', message: 'Can I collect my luggage at 05:30 WIB before my flight to Tokyo?', status: 'read' },
      { name: 'Noah Pratama', email: 'noah.pratama@example.com', subject: 'Action Camera Mount Compatibility', message: 'Does the GoAction 4K kit include a helmet mount for skiing?', status: 'unread' },
      { name: 'Emma Wijaya', email: 'emma.wijaya@example.com', subject: 'Rental Extension Request', message: 'I would like to extend my pocket WiFi rental by 3 additional days.', status: 'read' },
      { name: 'Daniel Kusuma', email: 'daniel.kusuma@example.com', subject: 'Corporate Travel Partnership', message: 'We would like to discuss a monthly corporate rental plan for our team.', status: 'unread' },
      { name: 'Olivia Hartono', email: 'olivia.hartono@example.com', subject: 'Snow Boot Sizing Guide', message: 'Should I size up for thick thermal socks when renting snow boots?', status: 'read' },
      { name: 'Ethan Santoso', email: 'ethan.santoso@example.com', subject: 'Payment Confirmation Question', message: 'My payment completed via QRIS, how soon will the status update?', status: 'read' },
      { name: 'Ava Nugroho', email: 'ava.nugroho@example.com', subject: 'Bali Pickup Availability', message: 'Are thermal base layers stocked at Ngurah Rai International hub?', status: 'unread' },
      { name: 'Lucas Setiawan', email: 'lucas.setiawan@example.com', subject: 'Hardcase Cabin Dimensions', message: 'Does the AeroShell 20-inch fit Garuda and ANA overhead bins?', status: 'read' },
      { name: 'Mia Tanoto', email: 'mia.tanoto@example.com', subject: 'Lost Charger Cable', message: 'I misplaced the USB-C cable for my power bank, how much is the fee?', status: 'unread' },
      { name: 'Oliver Halim', email: 'oliver.halim@example.com', subject: 'Weekend Return Drop-off', message: 'Is the Jakarta Selatan HQ open on Sundays for gear return?', status: 'read' }
    ].map((item) => ({ ...item, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('contact_messages', messages, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('contact_messages', null, {});
  }
};
