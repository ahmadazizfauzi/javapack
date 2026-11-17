'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const banners = [
      {
        title: 'Winter Expedition Ready',
        subtitle: 'Rent premium thermal parkas, snow boots, and insulated gear for your cold-weather journey.',
        image_url: '/images/hero/hero-winter.jpg',
        cta_text: 'Explore Winter Gear',
        cta_link: '/products?category=1',
        sort_order: 1,
        is_active: true
      },
      {
        title: 'Seamless Airport Pickup',
        subtitle: 'Collect your reserved travel gear directly at Soekarno-Hatta Terminal 3 before boarding.',
        image_url: '/images/hero/hero-airport.jpg',
        cta_text: 'View Pickup Points',
        cta_link: '/products',
        sort_order: 2,
        is_active: true
      },
      {
        title: 'Capture Every Peak',
        subtitle: 'Action cameras, stabilization gimbals, and rugged power banks ready for extreme altitudes.',
        image_url: '/images/hero/hero-camera.jpg',
        cta_text: 'Browse Cameras',
        cta_link: '/products?search=Japan',
        sort_order: 3,
        is_active: true
      },
      {
        title: 'Ultralight Cabin Luggage',
        subtitle: 'Polycarbonate hardcase luggage built to withstand international transit.',
        image_url: '/images/hero/hero-luggage.jpg',
        cta_text: 'Rent Luggage',
        cta_link: '/products?category=2',
        sort_order: 4,
        is_active: true
      },
      {
        title: 'Stay Connected Abroad',
        subtitle: 'High-speed pocket WiFi and universal travel adapters for over 120 countries.',
        image_url: '/images/hero/hero-wifi.jpg',
        cta_text: 'Check Connectivity',
        cta_link: '/products?category=1',
        sort_order: 5,
        is_active: true
      },
      {
        title: 'Alpine Trekking Essentials',
        subtitle: 'Trekking poles, waterproof shells, and hydration packs for high-altitude trails.',
        image_url: '/images/hero/hero-trekking.jpg',
        cta_text: 'Explore Trekking',
        cta_link: '/products?category=3',
        sort_order: 6,
        is_active: true
      },
      {
        title: 'Business Travel Comfort',
        subtitle: 'Noise-canceling headphones and ergonomic travel kits for long-haul flights.',
        image_url: '/images/hero/hero-business.jpg',
        cta_text: 'View Audio Gear',
        cta_link: '/products',
        sort_order: 7,
        is_active: true
      },
      {
        title: 'Flexible Daily Rates',
        subtitle: 'Pay only for the days you travel with transparent billing and instant confirmation.',
        image_url: '/images/hero/hero-rates.jpg',
        cta_text: 'Start Booking',
        cta_link: '/products',
        sort_order: 8,
        is_active: true
      },
      {
        title: 'Hygienic & Sanitized Gear',
        subtitle: 'Every garment and accessory undergoes medical-grade ozone sanitization before dispatch.',
        image_url: '/images/hero/hero-sanitize.jpg',
        cta_text: 'Learn More',
        cta_link: '/about',
        sort_order: 9,
        is_active: true
      },
      {
        title: 'Group & Family Bundles',
        subtitle: 'Equip your entire family for winter holidays without buying bulky one-time coats.',
        image_url: '/images/hero/hero-family.jpg',
        cta_text: 'Browse Catalog',
        cta_link: '/products',
        sort_order: 10,
        is_active: true
      },
      {
        title: '24/7 Traveler Support',
        subtitle: 'Dedicated assistance for itinerary changes, extensions, and pickup coordination.',
        image_url: '/images/hero/hero-support.jpg',
        cta_text: 'Contact Support',
        cta_link: '/contact',
        sort_order: 11,
        is_active: true
      }
    ].map((item) => ({ ...item, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('hero_banners', banners, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('hero_banners', null, {});
  }
};
