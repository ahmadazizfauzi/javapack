const express = require('express');
const router = express.Router();
const CmsDashboardController = require('../controllers/cmsDashboardController');
const CmsController = require('../controllers/cmsController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware, roleMiddleware('admin'));

// Dashboard Overview
router.get('/dashboard', CmsDashboardController.getOverview);

// CMS Orders Management
router.get('/orders', CmsController.listOrders);
router.get('/orders/:id', CmsController.getOrderById);
router.patch('/orders/:id/status', CmsController.updateOrderStatus);
router.delete('/orders/:id', CmsController.deleteOrder);

// CMS Users Management
router.get('/users', CmsController.listUsers);

// CMS Contact Messages Management
router.get('/contacts', CmsController.listContacts);
router.patch('/contacts/:id/status', CmsController.updateContactStatus);
router.delete('/contacts/:id', CmsController.deleteContact);

// CMS About Us Content Management (Single Record)
router.get('/about-us', CmsController.getAboutUs);
router.put('/about-us', CmsController.updateAboutUs);

// CMS Home Content Management (Single Record)
router.get('/home-content', CmsController.getHomeContent);
router.put('/home-content', CmsController.updateHomeContent);

// CMS Contact Info Management (Single Record)
router.get('/contact-info', CmsController.getContactInfo);
router.put('/contact-info', CmsController.updateContactInfo);

// CMS Image Upload
router.post('/upload-image', CmsController.uploadImage);

module.exports = router;
