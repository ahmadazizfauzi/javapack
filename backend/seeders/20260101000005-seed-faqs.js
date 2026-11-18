'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const faqs = [
      {
        question: 'What is JavaPack?',
        answer:
          'JavaPack is a travel gear rental platform offering winter jackets, Pocket WiFi modems, and cabin luggage with convenient airport pickup across Indonesia.'
      },
      {
        question: 'How do I place an order?',
        answer:
          'Browse the product catalog, choose your rental dates, quantity, and airport pickup location, then complete your payment online through the integrated payment gateway.'
      },
      {
        question: 'Who created JavaPack?',
        answer:
          'JavaPack was created and developed by Ahmad Aziz Fauzi (contact: 085216373763).'
      }
    ].map((item) => ({ ...item, is_active: true, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('faqs_contents', faqs, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('faqs_contents', null, {});
  }
};
