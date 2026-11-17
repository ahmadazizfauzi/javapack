const express = require('express');
const router = express.Router();
const PublicController = require('../controllers/publicController');

router.get('/home', PublicController.getHome);
router.get('/products', PublicController.getProducts);
router.get('/products/:slug', PublicController.getProductBySlug);
router.get('/categories', PublicController.getCategories);
router.get('/pickup-locations', PublicController.getPickupLocations);
router.get('/faqs', PublicController.getFaqs);
router.get('/about-us', PublicController.getAboutUs);
router.get('/contact-info', PublicController.getContactInfo);
router.post('/contact', PublicController.createContactMessage);
router.post('/visits', PublicController.recordSiteVisit);

module.exports = router;
