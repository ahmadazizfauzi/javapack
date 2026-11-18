const express = require('express');
const createMasterCrudController = require('../controllers/masterCrudController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  HeroBanner,
  HomeStep,
  HomeStory,
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
    sortFields: ['id', 'created_at', 'sort_order', 'title'],
    order: [['id', 'ASC']],
    requiredFields: ['title', 'image_url']
  })
);

const categoryRouter = buildCrudRouter(
  createMasterCrudController(Category, 'Category', {
    searchFields: ['name', 'description'],
    sortFields: ['id', 'created_at', 'name'],
    order: [['id', 'ASC']],
    autoSlugFrom: 'name',
    requiredFields: ['name']
  })
);

const pickupLocationRouter = buildCrudRouter(
  createMasterCrudController(PickupLocation, 'Pickup location', {
    searchFields: ['name', 'city', 'address'],
    sortFields: ['id', 'created_at', 'name', 'city'],
    order: [['id', 'ASC']],
    requiredFields: ['name', 'address', 'city']
  })
);

const productRouter = buildCrudRouter(
  createMasterCrudController(Product, 'Product', {
    searchFields: ['name', 'description'],
    filterFields: ['category_id', 'pickup_location_id'],
    sortFields: ['id', 'created_at', 'name', 'price_per_day', 'stock'],
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
    sortFields: ['id', 'created_at', 'question'],
    order: [['id', 'ASC']],
    requiredFields: ['question', 'answer']
  })
);

const homeStepRouter = buildCrudRouter(
  createMasterCrudController(HomeStep, 'Home step', {
    searchFields: ['step_label', 'title', 'description'],
    sortFields: ['id', 'created_at', 'sort_order', 'title'],
    order: [['sort_order', 'ASC'], ['id', 'ASC']],
    requiredFields: ['step_label', 'title', 'description']
  })
);

const homeStoryRouter = buildCrudRouter(
  createMasterCrudController(HomeStory, 'Home story', {
    searchFields: ['customer_name', 'gear_tag', 'testimonial'],
    sortFields: ['id', 'created_at', 'sort_order', 'customer_name'],
    order: [['sort_order', 'ASC'], ['id', 'ASC']],
    requiredFields: ['customer_name', 'gear_tag', 'testimonial', 'image_url']
  })
);

module.exports = {
  heroBannerRouter,
  homeStepRouter,
  homeStoryRouter,
  categoryRouter,
  pickupLocationRouter,
  productRouter,
  faqRouter
};
