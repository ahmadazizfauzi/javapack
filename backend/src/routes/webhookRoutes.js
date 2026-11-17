const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

router.post('/payment', OrderController.paymentWebhook);

module.exports = router;
