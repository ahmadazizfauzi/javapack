const axios = require('axios');

class N8nService {
  static async triggerOrderPaidWebhook(order) {
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
          product_id: order.product_id,
          pickup_location_id: order.pickup_location_id,
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
