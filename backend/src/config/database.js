require('dotenv').config();

const baseConfig = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'javapack_db',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: process.env.DB_DIALECT || 'mysql',
  // Enforce Western Indonesia Time (WIB / UTC+7) natively in MySQL
  timezone: '+07:00',
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: true
  },
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
};

module.exports = {
  development: {
    ...baseConfig,
    logging: console.log
  },
  test: {
    ...baseConfig,
    database: process.env.DB_NAME_TEST || 'javapack_db_test',
    logging: false
  },
  production: {
    ...baseConfig,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
