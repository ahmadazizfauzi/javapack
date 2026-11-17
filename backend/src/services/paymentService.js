const axios = require('axios');
const crypto = require('crypto');

class PaymentService {
  static getAuthHeader() {
    const serverKey = process.env.PAYMENT_GATEWAY_SERVER_KEY || '';
    const encoded = Buffer.from(`${serverKey}:`).toString('base64');
    return `Basic ${encoded}`;
  }

  static async createPaymentSession({ order_code, gross_amount, customer = {}, item }) {
    const baseUrl = (
      process.env.PAYMENT_GATEWAY_BASE_URL || 'https://app.sandbox.midtrans.com'
    ).replace(/\/+$/, '');
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const serverKey = process.env.PAYMENT_GATEWAY_SERVER_KEY || '';

    if (!serverKey || serverKey === 'your_payment_gateway_server_key') {
      const paymentReference = `PAY-${order_code}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      return {
        payment_reference: paymentReference,
        payment_url: `${clientUrl}/payment/${paymentReference}`
      };
    }

    const payload = {
      transaction_details: {
        order_id: order_code,
        gross_amount: Math.round(Number(gross_amount))
      },
      callbacks: {
        finish: `${clientUrl}/profile`
      }
    };

    if (item) {
      payload.item_details = [
        {
          id: String(item.id),
          price: Math.round(Number(item.price)),
          quantity: Number(item.quantity),
          name: String(item.name || 'Travel Gear Rental').slice(0, 50)
        }
      ];
    }

    if (customer.name || customer.email) {
      payload.customer_details = {
        first_name: customer.name || 'Customer',
        email: customer.email || undefined,
        phone: customer.phone || undefined
      };
    }

    const response = await axios.post(`${baseUrl}/snap/v1/transactions`, payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader()
      }
    });

    return {
      payment_reference: response.data.token,
      payment_url: response.data.redirect_url
    };
  }

  static async getTransactionStatus(orderCode) {
    const serverKey = process.env.PAYMENT_GATEWAY_SERVER_KEY || '';
    if (!serverKey || serverKey === 'your_payment_gateway_server_key') {
      return null;
    }

    const snapUrl = process.env.PAYMENT_GATEWAY_BASE_URL || 'https://app.sandbox.midtrans.com';
    const apiBaseUrl = snapUrl.includes('sandbox')
      ? 'https://api.sandbox.midtrans.com'
      : 'https://api.midtrans.com';

    try {
      const response = await axios.get(`${apiBaseUrl}/v2/${orderCode}/status`, {
        headers: {
          Accept: 'application/json',
          Authorization: this.getAuthHeader()
        }
      });
      return response.data;
    } catch {
      return null;
    }
  }
}

module.exports = PaymentService;
