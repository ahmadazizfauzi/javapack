const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', OrderController.listMyOrders);
router.get('/history', OrderController.listMyHistory);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.patch('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
