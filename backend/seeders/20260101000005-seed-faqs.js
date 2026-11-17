'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const faqs = [
      { question: 'How does the rental duration calculation work?', answer: 'Rental duration is calculated per calendar day based on your selected start date and return date.' },
      { question: 'Do I need an account before placing an order?', answer: 'Yes, customers must register and log in so we can track your booking, billing details, and pickup code.' },
      { question: 'Where can I pick up my rented travel gear?', answer: 'Each product lists its available pickup hub, such as Soekarno-Hatta Terminal 3 or Jakarta Selatan HQ.' },
      { question: 'How is the winter apparel cleaned between rentals?', answer: 'All outerwear and thermal layers undergo professional dry cleaning and medical-grade ozone sanitization.' },
      { question: 'What payment methods are supported?', answer: 'We support virtual accounts, QRIS, e-wallets, and credit cards via our integrated payment gateway.' },
      { question: 'Can I modify my booking before paying?', answer: 'Yes, orders in pending_payment status can have their quantity, dates, or pickup location updated.' },
      { question: 'What happens if I cancel an unpaid order?', answer: 'Cancelling a pending_payment order immediately releases the reserved stock back to the catalog.' },
      { question: 'Is a security deposit required?', answer: 'No cash deposit is required for verified accounts; only a valid government ID at pickup.' },
      { question: 'Can I extend my rental while already abroad?', answer: 'Yes, contact our 24/7 support team at least 24 hours before your scheduled return date.' },
      { question: 'Are power banks safe for cabin luggage?', answer: 'Yes, all our power banks are under 100Wh and comply with international aviation regulations.' },
      { question: 'What if the gear is damaged during my trip?', answer: 'Minor wear and tear is covered; major damage is assessed transparently based on our protection policy.' }
    ].map((item) => ({ ...item, is_active: true, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('faqs', faqs, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('faqs', null, {});
  }
};
