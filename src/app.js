const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/restaurants.routes');

const app = express();

// Middleware
app.use(express.json());

// Rate limiter (global for this app instance)
const { defaultLimiter } = require('./middlewares/rateLimiter');
app.use(defaultLimiter);

// CORS configuration
// Allow configuration via environment variables:
// - CORS_ALLOW_ALL=true -> allow any origin
// - CORS_ALLOWED_ORIGINS="https://example.com,https://foo" -> CSV of allowed origins
if (process.env.CORS_ALLOW_ALL === 'true') {
	app.use(cors());
} else if (process.env.CORS_ALLOWED_ORIGINS) {
	const origins = process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim());
	app.use(cors({ origin: function(origin, cb) {
		// allow requests with no origin (e.g. curl, mobile apps)
		if (!origin) return cb(null, true);
		if (origins.indexOf(origin) !== -1) return cb(null, true);
		cb(new Error('Origin not allowed by CORS'));
	}}));
} else {
	// sensible default in development: allow all
	app.use(cors());
}

// Serve static files (simple frontend) from src/public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/restaurants', routes);

// Home page (accueil)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
