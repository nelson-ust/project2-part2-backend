// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation that allows API testing',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};

// Combine itemRoutes and authRoutes in the APIs array
const combinedApis = [
  ...options.apis,
  itemRoutes, // Add your itemRoutes file
  authRoutes, // Add your authRoutes file
];

const specs = swaggerJsdoc({
  ...options,
  apis: combinedApis,
});

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
};
