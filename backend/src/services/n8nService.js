const axios = require('axios');

class N8nService {
  static async triggerOrderPaidWebhook(order, { user = null, product = null, pickupLocation = null } = {}) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return null;
    }

    try {
      const response = await axios.post(
        webhookUrl,
        {
          event: 'order.paid',
          order_code: order.order_code,
          user_id: order.user_id,
          customer_name: user ? user.name : null,
          customer_email: user ? user.email : null,
          customer_phone: user ? user.phone : null,
          product_id: order.product_id,
          product_name: product ? product.name : null,
          pickup_location_id: order.pickup_location_id,
          pickup_location_name: pickupLocation ? pickupLocation.name : null,
          quantity: order.quantity,
          start_date: order.start_date,
          end_date: order.end_date,
          duration_days: order.duration_days,
          total_amount: order.total_amount,
          status: order.status
        },
        { timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.warn('[N8nService] Failed to trigger webhook:', err.message);
      return null;
    }
  }
}

module.exports = N8nService;
