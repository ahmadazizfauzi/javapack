'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM categories WHERE deleted_at IS NULL ORDER BY id ASC'
    );
    const [locations] = await queryInterface.sequelize.query(
      'SELECT id FROM pickup_locations WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    if (!categories.length || !locations.length) {
      throw new Error('Categories and pickup_locations must be seeded before products.');
    }

    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));
    const pocketWifiId = categoryMap.get('pocket-wifi') ?? categories[0].id;
    const esimId = categoryMap.get('esim') ?? categories[1]?.id ?? categories[0].id;
    const simCardId = categoryMap.get('sim-card') ?? categories[2]?.id ?? categories[0].id;

    const now = new Date();
    const rawProducts = [
      // Pocket WiFi (8 from reference + 4 additional)
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Japan Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-japan-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G/5G Pocket WiFi in Japan with 1GB/day high-speed FUP.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 40000,
        stock: 25
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Singapore Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-singapore-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G/5G Pocket WiFi in Singapore with 1GB/day high-speed FUP.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 25000,
        stock: 30
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Malaysia Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-malaysia-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G/5G Pocket WiFi in Malaysia with 1GB/day high-speed FUP.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 40000,
        stock: 22
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Saudi Arabia Unlimited Plus',
        slug: 'global-wifi-saudi-arabia-unlimited-plus',
        description: 'Unlimited Plus Pocket WiFi coverage across Makkah, Madinah, and Jeddah.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 140000,
        stock: 18
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Thailand Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-thailand-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G/5G Pocket WiFi in Thailand with 1GB/day high-speed FUP.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 40000,
        stock: 24
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi South Korea Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-south-korea-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G/5G Pocket WiFi in South Korea with 1GB/day high-speed FUP.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 40000,
        stock: 20
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi China Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-china-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G/5G Pocket WiFi in China with built-in open internet access.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 75000,
        stock: 16
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi All Europe Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-all-europe-unlimited-savvy-fup-1gb',
        description: 'Multi-country Pocket WiFi covering 37+ European destinations seamlessly.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 100000,
        stock: 15
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Australia Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-australia-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G Pocket WiFi across Sydney, Melbourne, Perth, and Gold Coast.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 85000,
        stock: 14
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi USA & Canada Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-usa-canada-unlimited-savvy-fup-1gb',
        description: 'High-speed Pocket WiFi covering United States and Canada up to 8 devices.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 95000,
        stock: 12
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Taiwan Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-taiwan-unlimited-savvy-fup-1gb',
        description: 'Unlimited 4G Pocket WiFi in Taiwan with 1GB/day high-speed FUP.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 45000,
        stock: 20
      },
      {
        category_id: pocketWifiId,
        name: 'Global WiFi Hong Kong & Macau Unlimited Savvy FUP 1GB',
        slug: 'global-wifi-hong-kong-macau-unlimited-savvy-fup-1gb',
        description: 'Cross-border Pocket WiFi for Hong Kong and Macau with 1GB/day FUP.',
        image_url: '/images/products/pocket-wifi.jpg',
        price_per_day: 50000,
        stock: 18
      },

      // eSIM (8 items)
      {
        category_id: esimId,
        name: 'eSIM Japan GO Savvy Unlimited 1GB/Day 1 Day',
        slug: 'esim-japan-go-savvy-unlimited-1gb-day-1-day',
        description: 'Instant QR eSIM for Japan with 1GB/day high-speed quota.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 19000,
        stock: 100
      },
      {
        category_id: esimId,
        name: 'eSIM Singapore GO Savvy Unlimited 1GB/day 1 Day',
        slug: 'esim-singapore-go-savvy-unlimited-1gb-day-1-day',
        description: 'Instant QR eSIM for Singapore with 1GB/day high-speed quota.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 13000,
        stock: 100
      },
      {
        category_id: esimId,
        name: 'eSIM Malaysia Max Quota 1GB 3 Days',
        slug: 'esim-malaysia-max-quota-1gb-3-days',
        description: 'Instant QR eSIM for Malaysia with 1GB max quota valid for 3 days.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 12000,
        stock: 100
      },
      {
        category_id: esimId,
        name: 'eSIM Saudi Arabia GO Savvy Unlimited 1GB/Day 1 Day',
        slug: 'esim-saudi-arabia-go-savvy-unlimited-1gb-day-1-day',
        description: 'Instant QR eSIM for Saudi Arabia with 1GB/day high-speed quota.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 29000,
        stock: 100
      },
      {
        category_id: esimId,
        name: 'eSIM Thailand GO Savvy Unlimited 1GB/Day 1 Day',
        slug: 'esim-thailand-go-savvy-unlimited-1gb-day-1-day',
        description: 'Instant QR eSIM for Thailand with 1GB/day high-speed quota.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 19000,
        stock: 100
      },
      {
        category_id: esimId,
        name: 'eSIM China GO Quota 1GB 7 Days',
        slug: 'esim-china-go-quota-1gb-7-days',
        description: 'Instant QR eSIM for China with 1GB quota valid for 7 days.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 28000,
        stock: 100
      },
      {
        category_id: esimId,
        name: 'eSIM South Korea GO Savvy Unlimited 1GB/Day 1 Day',
        slug: 'esim-south-korea-go-savvy-unlimited-1gb-day-1-day',
        description: 'Instant QR eSIM for South Korea with 1GB/day high-speed quota.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 19000,
        stock: 100
      },
      {
        category_id: esimId,
        name: 'eSIM Europe Balkan MAX Savvy Unlimited 1GB/Day 1 Day',
        slug: 'esim-europe-balkan-max-savvy-unlimited-1gb-day-1-day',
        description: 'Instant QR eSIM covering 35+ Europe & Balkan countries.',
        image_url: '/images/travel-lounge.jpg',
        price_per_day: 39000,
        stock: 100
      },

      // SIM Card (8 items)
      {
        category_id: simCardId,
        name: 'JavaSIM Japan Unlimited FUP 1GB/Day 3 Days',
        slug: 'javasim-japan-unlimited-fup-1gb-day-3-days',
        description: 'Physical travel SIM card for Japan with 1GB/day FUP for 3 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 69000,
        stock: 50
      },
      {
        category_id: simCardId,
        name: 'JavaSIM Singapore Unlimited FUP 1GB/Day 3 Days',
        slug: 'javasim-singapore-unlimited-fup-1gb-day-3-days',
        description: 'Physical travel SIM card for Singapore with 1GB/day FUP for 3 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 39000,
        stock: 50
      },
      {
        category_id: simCardId,
        name: 'JavaSIM Malaysia Unlimited FUP 1GB/Day 3 Days',
        slug: 'javasim-malaysia-unlimited-fup-1gb-day-3-days',
        description: 'Physical travel SIM card for Malaysia with 1GB/day FUP for 3 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 39000,
        stock: 50
      },
      {
        category_id: simCardId,
        name: 'JavaSIM Saudi Arabia 5GB 10 Days',
        slug: 'javasim-saudi-arabia-5gb-10-days',
        description: 'Physical travel SIM card for Saudi Arabia with 5GB quota for 10 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 169000,
        stock: 40
      },
      {
        category_id: simCardId,
        name: 'JavaSIM Thailand Unlimited FUP 1GB/Day 3 Days',
        slug: 'javasim-thailand-unlimited-fup-1gb-day-3-days',
        description: 'Physical travel SIM card for Thailand with 1GB/day FUP for 3 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 69000,
        stock: 50
      },
      {
        category_id: simCardId,
        name: 'JavaSIM United States Unlimited FUP 500MB/Day 5 Days',
        slug: 'javasim-united-states-unlimited-fup-500mb-day-5-days',
        description: 'Physical travel SIM card for USA with 500MB/day FUP for 5 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 69000,
        stock: 35
      },
      {
        category_id: simCardId,
        name: 'JavaSIM China 3GB 5D',
        slug: 'javasim-china-3gb-5d',
        description: 'Physical travel SIM card for China with 3GB quota for 5 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 79000,
        stock: 40
      },
      {
        category_id: simCardId,
        name: 'JavaSIM Malaysia Unlimited FUP 1GB/Day 3 Days (Twin Pack)',
        slug: 'javasim-malaysia-unlimited-fup-1gb-day-3-days-twin',
        description: 'Physical travel SIM card for Malaysia with 1GB/day FUP for 3 days.',
        image_url: '/images/travel-winter.jpg',
        price_per_day: 39000,
        stock: 45
      }
    ];

    const products = rawProducts.map((item, idx) => ({
      ...item,
      pickup_location_id: locations[idx % locations.length].id,
      is_active: true,
      created_at: now,
      updated_at: now
    }));

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
