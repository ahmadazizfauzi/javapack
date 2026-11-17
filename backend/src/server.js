// Set process timezone to WIB (Asia/Jakarta)
process.env.TZ = process.env.TZ || 'Asia/Jakarta';

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Optional: Test database connection on startup
    // await sequelize.authenticate();
    // console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
      console.log(`Health check available at: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
