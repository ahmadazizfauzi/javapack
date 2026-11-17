const express = require('express');
const createMasterCrudController = require('../controllers/masterCrudController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  HeroBanner,
  Category,
  PickupLocation,
  Product,
  Faq
} = require('../models');

function buildCrudRouter(controller) {
  const r = express.Router();
  r.use(authMiddleware, roleMiddleware('admin'));
  r.get('/', controller.list);
  r.get('/:id', controller.getById);
  r.post('/', controller.create);
  r.put('/:id', controller.update);
  r.delete('/:id', controller.remove);
  return r;
}

const heroBannerRouter = buildCrudRouter(
  createMasterCrudController(HeroBanner, 'Hero banner', {
    searchFields: ['title', 'subtitle'],
    order: [['id', 'ASC']],
    requiredFields: ['title', 'image_url']
  })
);

const categoryRouter = buildCrudRouter(
  createMasterCrudController(Category, 'Category', {
    searchFields: ['name', 'description'],
    order: [['id', 'ASC']],
    autoSlugFrom: 'name',
    requiredFields: ['name']
  })
);

const pickupLocationRouter = buildCrudRouter(
  createMasterCrudController(PickupLocation, 'Pickup location', {
    searchFields: ['name', 'city', 'address'],
    order: [['id', 'ASC']],
    requiredFields: ['name', 'address', 'city']
  })
);

const productRouter = buildCrudRouter(
  createMasterCrudController(Product, 'Product', {
    searchFields: ['name', 'description'],
    filterFields: ['category_id', 'pickup_location_id'],
    order: [['id', 'ASC']],
    autoSlugFrom: 'name',
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      { model: PickupLocation, as: 'pickupLocation', attributes: ['id', 'name', 'city'] }
    ],
    requiredFields: ['category_id', 'pickup_location_id', 'name', 'price_per_day']
  })
);

const faqRouter = buildCrudRouter(
  createMasterCrudController(Faq, 'FAQ', {
    searchFields: ['question', 'answer'],
    order: [['id', 'ASC']],
    requiredFields: ['question', 'answer']
  })
);

module.exports = {
  heroBannerRouter,
  categoryRouter,
  pickupLocationRouter,
  productRouter,
  faqRouter
};
