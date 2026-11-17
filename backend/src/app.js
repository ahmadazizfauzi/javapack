require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const ApiResponse = require('./helpers/apiResponse');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorMiddleware');

const app = express();
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Welcome root
app.get('/', (req, res) => {
  return ApiResponse.success(res, 'Welcome to JavaPack Backend API', {
    version: '1.0.0',
    healthCheck: `${apiPrefix}/health`
  });
});

// API Routes
app.use(apiPrefix, routes);

// Error Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
