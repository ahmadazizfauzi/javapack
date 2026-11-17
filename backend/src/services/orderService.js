const { sequelize, Order, Product, PickupLocation, User, RentalHistoryLog } = require('../models');
const PaginationHelper = require('../helpers/paginationHelper');
const PaymentService = require('./paymentService');
const N8nService = require('./n8nService');

class OrderService {
  static calculateDurationDays(startDate, endDate) {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      const error = new Error('Invalid start_date or end_date format (expected YYYY-MM-DD)');
      error.statusCode = 400;
      throw error;
    }
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
      const error = new Error('end_date must be at least 1 day after start_date');
      error.statusCode = 400;
      throw error;
    }
    return diffDays;
  }

  static generateOrderCode() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `JVP-${y}${m}${d}-${rand}`;
  }

  static async syncPendingOrdersWithMidtrans(extraWhere = {}) {
    const pendingOrders = await Order.findAll({
      where: { ...extraWhere, status: 'pending_payment' },
      attributes: ['id', 'order_code', 'status']
    });
    for (const pending of pendingOrders) {
      const midtransStatus = await PaymentService.getTransactionStatus(pending.order_code);
      if (
        midtransStatus &&
        (midtransStatus.transaction_status === 'settlement' ||
          midtransStatus.transaction_status === 'capture')
      ) {
        await this.handlePaymentWebhook({
          order_code: pending.order_code,
          payment_status: midtransStatus.transaction_status
        });
      }
    }
  }

  static async getUserOrders(userId, query = {}) {
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const where = { user_id: userId };

    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.order_code = { [require('sequelize').Op.like]: `%${query.search}%` };
    }
    const dateFilter = PaginationHelper.buildDateRangeFilter(query);
    if (dateFilter) {
      Object.assign(where, dateFilter);
    }

    await this.syncPendingOrdersWithMidtrans({ user_id: userId });

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'slug', 'image_url', 'price_per_day'] },
        { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city', 'address'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async getUserRentalHistory(userId, query = {}) {
    await this.syncPendingOrdersWithMidtrans({ user_id: userId });
    const { page, limit, offset } = PaginationHelper.getPaginationParams(query);
    const { rows, count } = await RentalHistoryLog.findAndCountAll({
      where: { user_id: userId },
      include: [{ model: Order, as: 'order', attributes: ['id', 'payment_url', 'status'] }],
      order: [['created_at', 'DESC'], ['id', 'DESC']],
      limit,
      offset
    });

    return PaginationHelper.formatPaginatedResponse(rows, count, page, limit);
  }

  static async recordRentalLog({ order, productName, eventStatus, note = null, transaction = null }) {
    const queryOpts = transaction ? { transaction } : undefined;
    const existing = await RentalHistoryLog.findOne({
      where: { order_code: order.order_code },
      ...queryOpts
    });

    const payload = {
      order_id: order.id,
      user_id: order.user_id,
      product_id: order.product_id,
      order_code: order.order_code,
      product_name: productName,
      quantity: order.quantity,
      duration_days: order.duration_days,
      start_date: order.start_date,
      end_date: order.end_date,
      total_amount: order.total_amount,
      event_status: eventStatus,
      note
    };

    if (existing) {
      await existing.update(payload, queryOpts);
      return existing;
    }

    return RentalHistoryLog.create(payload, queryOpts);
  }

  static async getOrderById(userId, orderId) {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'slug', 'image_url', 'price_per_day'] },
        { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city', 'address', 'operational_hours'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return order;
  }

  static async createOrder(userId, { product_id, pickup_location_id, quantity = 1, start_date, end_date }) {
    const parsedQty = parseInt(quantity, 10);
    if (!parsedQty || parsedQty < 1) {
      const error = new Error('Quantity must be at least 1');
      error.statusCode = 400;
      throw error;
    }

    const durationDays = this.calculateDurationDays(start_date, end_date);

    return sequelize.transaction(async (t) => {
      const product = await Product.findOne({
        where: { id: product_id, is_active: true },
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (!product) {
        const error = new Error('Product not found or inactive');
        error.statusCode = 404;
        throw error;
      }

      if (product.stock < parsedQty) {
        const error = new Error('Insufficient product stock');
        error.statusCode = 400;
        throw error;
      }

      const targetLocationId = pickup_location_id || product.pickup_location_id;
      const location = await PickupLocation.findOne({
        where: { id: targetLocationId, is_active: true },
        transaction: t
      });

      if (!location) {
        const error = new Error('Pickup location not found or inactive');
        error.statusCode = 404;
        throw error;
      }

      const pricePerDay = Number(product.price_per_day);
      const totalAmount = pricePerDay * durationDays * parsedQty;
      const orderCode = this.generateOrderCode();

      await product.update({ stock: product.stock - parsedQty }, { transaction: t });

      const user = await User.findByPk(userId, { transaction: t });
      const paymentSession = await PaymentService.createPaymentSession({
        order_code: orderCode,
        gross_amount: totalAmount,
        customer: user || {},
        item: {
          id: product.id,
          name: product.name,
          price: pricePerDay * durationDays,
          quantity: parsedQty
        }
      });

      const order = await Order.create(
        {
          order_code: orderCode,
          user_id: userId,
          product_id: product.id,
          pickup_location_id: location.id,
          quantity: parsedQty,
          start_date,
          end_date,
          duration_days: durationDays,
          price_per_day: pricePerDay,
          total_amount: totalAmount,
          status: 'pending_payment',
          payment_reference: paymentSession.payment_reference,
          payment_url: paymentSession.payment_url
        },
        { transaction: t }
      );

      await this.recordRentalLog({
        order,
        productName: product.name,
        eventStatus: 'pending_payment',
        note: 'Order created and awaiting payment',
        transaction: t
      });

      return order;
    });
  }

  static async updatePendingOrder(userId, orderId, { pickup_location_id, quantity, start_date, end_date }) {
    return sequelize.transaction(async (t) => {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
      }

      if (order.status !== 'pending_payment') {
        const error = new Error('Only pending_payment orders can be updated');
        error.statusCode = 400;
        throw error;
      }

      const product = await Product.findByPk(order.product_id, { lock: t.LOCK.UPDATE, transaction: t });
      const newQty = quantity !== undefined ? parseInt(quantity, 10) : order.quantity;
      if (!newQty || newQty < 1) {
        const error = new Error('Quantity must be at least 1');
        error.statusCode = 400;
        throw error;
      }

      const qtyDiff = newQty - order.quantity;
      if (qtyDiff > 0 && product.stock < qtyDiff) {
        const error = new Error('Insufficient product stock for updated quantity');
        error.statusCode = 400;
        throw error;
      }

      const newStartDate = start_date || order.start_date;
      const newEndDate = end_date || order.end_date;
      const newDurationDays = this.calculateDurationDays(newStartDate, newEndDate);

      if (pickup_location_id !== undefined) {
        const location = await PickupLocation.findOne({
          where: { id: pickup_location_id, is_active: true },
          transaction: t
        });
        if (!location) {
          const error = new Error('Pickup location not found or inactive');
          error.statusCode = 404;
          throw error;
        }
      }

      await product.update({ stock: product.stock - qtyDiff }, { transaction: t });

      const newTotalAmount = Number(order.price_per_day) * newDurationDays * newQty;
      await order.update(
        {
          pickup_location_id: pickup_location_id !== undefined ? pickup_location_id : order.pickup_location_id,
          quantity: newQty,
          start_date: newStartDate,
          end_date: newEndDate,
          duration_days: newDurationDays,
          total_amount: newTotalAmount
        },
        { transaction: t }
      );

      await this.recordRentalLog({
        order,
        productName: product.name,
        eventStatus: 'pending_payment',
        note: 'Order created and awaiting payment',
        transaction: t
      });

      return order;
    });
  }

  static async deletePendingOrder(userId, orderId) {
    return sequelize.transaction(async (t) => {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
      }

      if (order.status !== 'pending_payment') {
        const error = new Error('Only pending_payment orders can be deleted');
        error.statusCode = 400;
        throw error;
      }

      const product = await Product.findByPk(order.product_id, { lock: t.LOCK.UPDATE, transaction: t });
      if (product) {
        await product.update({ stock: product.stock + order.quantity }, { transaction: t });
      }

      await order.destroy({ transaction: t });
      return { id: orderId };
    });
  }

  static async handlePaymentWebhook({ order_code, payment_status }) {
    const order = await Order.findOne({ where: { order_code } });
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (payment_status === 'settlement' || payment_status === 'capture' || payment_status === 'paid') {
      await order.update({ status: 'paid' });
      const product = await Product.findByPk(order.product_id);
      await this.recordRentalLog({
        order,
        productName: product ? product.name : 'Travel Gear',
        eventStatus: 'paid',
        note: 'Payment confirmed via webhook'
      });
      await N8nService.triggerOrderPaidWebhook(order);
    }

    return order;
  }
}

module.exports = OrderService;
