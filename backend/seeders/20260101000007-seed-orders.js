'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE deleted_at IS NULL ORDER BY id ASC LIMIT 1'
    );
    const [products] = await queryInterface.sequelize.query(
      'SELECT id, pickup_location_id, price_per_day FROM products WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    if (!users.length || !products.length) {
      throw new Error('Users and products must be seeded before orders.');
    }

    const userId = users[0].id;
    const now = new Date();
    const statuses = ['pending_payment', 'paid', 'active_rent'];

    const orders = Array.from({ length: 11 }, (_, idx) => {
      const product = products[idx % products.length];
      const quantity = (idx % 2) + 1;
      const durationDays = (idx % 5) + 2;
      const pricePerDay = Number(product.price_per_day);
      const totalAmount = pricePerDay * durationDays * quantity;
      const startObj = new Date(2026, 10, 18 + (idx % 10)); // Nov 18..27, 2026
      const endObj = new Date(startObj);
      endObj.setDate(startObj.getDate() + durationDays);

      const formatDateOnly = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      const orderCode = `JVP-20261117-${String(1001 + idx)}`;

      return {
        order_code: orderCode,
        user_id: userId,
        product_id: product.id,
        pickup_location_id: product.pickup_location_id,
        quantity,
        start_date: formatDateOnly(startObj),
        end_date: formatDateOnly(endObj),
        duration_days: durationDays,
        price_per_day: pricePerDay,
        total_amount: totalAmount,
        status: statuses[idx % statuses.length],
        payment_reference: `PAY-${orderCode}`,
        payment_url: `/payment/PAY-${orderCode}`,
        created_at: now,
        updated_at: now
      };
    });

    await queryInterface.bulkInsert('orders', orders, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
