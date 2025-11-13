const express = require('express');
const routes = require('./routes/restaurants.routes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
