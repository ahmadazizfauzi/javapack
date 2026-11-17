const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const publicRoutes = require('./publicRoutes');
const orderRoutes = require('./orderRoutes');
const webhookRoutes = require('./webhookRoutes');
const cmsRoutes = require('./cmsRoutes');
const {
  heroBannerRouter,
  categoryRouter,
  pickupLocationRouter,
  productRouter,
  faqRouter
} = require('./masterRoutes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/orders', orderRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/cms', cmsRoutes);

// Master CRUD routes supporting Public Page menus
router.use('/hero-banners', heroBannerRouter);
router.use('/categories', categoryRouter);
router.use('/pickup-locations', pickupLocationRouter);
router.use('/products', productRouter);
router.use('/faqs', faqRouter);

module.exports = router;
