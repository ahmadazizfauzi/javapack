const ApiResponse = require('../helpers/apiResponse');
const OrderService = require('../services/orderService');

class OrderController {
  static async listMyOrders(req, res, next) {
    try {
      const data = await OrderService.getUserOrders(req.user.id, req.query);
      return ApiResponse.success(res, 'Orders retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async listMyHistory(req, res, next) {
    try {
      const data = await OrderService.getUserRentalHistory(req.user.id, req.query);
      return ApiResponse.success(res, 'Rental history logs retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const data = await OrderService.getOrderById(req.user.id, req.params.id);
      return ApiResponse.success(res, 'Order detail retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      const { product_id, pickup_location_id, quantity, start_date, end_date } = req.body;
      if (!product_id || !start_date || !end_date) {
        return ApiResponse.badRequest(res, 'product_id, start_date, and end_date are required');
      }

      const data = await OrderService.createOrder(req.user.id, {
        product_id,
        pickup_location_id,
        quantity,
        start_date,
        end_date
      });
      return ApiResponse.created(res, 'Order created successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async updateOrder(req, res, next) {
    try {
      const { pickup_location_id, quantity, start_date, end_date } = req.body;
      const data = await OrderService.updatePendingOrder(req.user.id, req.params.id, {
        pickup_location_id,
        quantity,
        start_date,
        end_date
      });
      return ApiResponse.success(res, 'Order updated successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteOrder(req, res, next) {
    try {
      const data = await OrderService.deletePendingOrder(req.user.id, req.params.id);
      return ApiResponse.success(res, 'Order deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  static async paymentWebhook(req, res, next) {
    try {
      const order_code = req.body.order_code || req.body.order_id;
      const payment_status = req.body.payment_status || req.body.transaction_status;
      if (!order_code || !payment_status) {
        return ApiResponse.badRequest(res, 'order_code and payment_status are required');
      }

      const data = await OrderService.handlePaymentWebhook({ order_code, payment_status });
      return ApiResponse.success(res, 'Payment webhook processed successfully', data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = OrderController;
