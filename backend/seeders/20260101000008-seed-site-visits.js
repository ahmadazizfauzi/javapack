'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const pages = ['home', 'products', 'checkout'];
    const visitorTypes = ['new', 'returning'];

    const visits = Array.from({ length: 11 }, (_, idx) => {
      const day = String(7 + idx).padStart(2, '0');
      return {
        visitor_token: `vis-demo-${1001 + (idx % 6)}`,
        visitor_type: visitorTypes[idx % visitorTypes.length],
        page: pages[idx % pages.length],
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        visit_date: `2026-11-${day}`,
        created_at: now,
        updated_at: now
      };
    });

    await queryInterface.bulkInsert('site_visits', visits, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('site_visits', null, {});
  }
};
