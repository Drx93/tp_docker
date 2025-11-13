const express = require("express");
const dotenv = require("dotenv");
const db = require("./db/db-postgres");
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Note: legacy static frontend removed. Frontend is served separately (e.g. Vite dev server or built client).

// CORS configuration
const cors = require('cors');
if (process.env.CORS_ALLOW_ALL === 'true') {
	app.use(cors());
} else if (process.env.CORS_ALLOWED_ORIGINS) {
	const origins = process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim());
	app.use(cors({ origin: function(origin, cb) {
		if (!origin) return cb(null, true);
		if (origins.indexOf(origin) !== -1) return cb(null, true);
		cb(new Error('Origin not allowed by CORS'));
	}}));
} else {
	app.use(cors());
}

// Rate limiter (global)
const { defaultLimiter } = require('./middlewares/rateLimiter');
app.use(defaultLimiter);

// Mount routes
const userRoutes = require("./routes/users.routes");
app.use("/api/users", userRoutes);

const restaurantsRoutes = require("./routes/restaurants.routes");
app.use("/api/restaurants", restaurantsRoutes);
// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);
// User-Restaurants routes (link Postgres users with Mongo restaurants)
const userRestaurantsRoutes = require('./routes/userRestaurants.routes');
app.use('/api/user-restaurants', userRestaurantsRoutes);

// Health
app.get("/api/status", (req, res) => {
	res.json({ status: "ok", time: new Date().toISOString() });
});

// 404
app.use((req, res) => res.status(404).json({ error: "Route inconnue" }));

// Error handler (logs full error in non-production for easier debugging)
app.use((err, req, res, next) => {
	console.error('Erreur serveur:', err);
	const isProd = process.env.NODE_ENV === 'production';
	if (!isProd) {
		return res.status(500).json({ error: err.message || 'Erreur interne serveur', stack: err.stack });
	}
	return res.status(500).json({ error: 'Erreur interne serveur' });
});

// Global handlers for unexpected errors to aid debugging during development
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Rejection at:', reason);
});
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});

// Try to test DB connection at startup (non-blocking)
(async () => {
	const ok = await db.testConnection();
	if (ok) console.log('Connected to Postgres');
	else console.log('Postgres not connected (check DATABASE_URL)');
})();

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
	mongoose.connect(process.env.MONGO_URI)
		.then(() => console.log('Connected to MongoDB'))
		.catch(err => console.error('MongoDB connection error:', err.message));
} else {
	console.warn('MONGO_URI not set in environment; MongoDB features will fail');
}

// Start the server only when this file is run directly (node src/server.js)
// This prevents tests that `require('./src/server')` from opening a listening TCP server
if (require.main === module) {
	app.listen(PORT, () => console.log(`API prête sur http://localhost:${PORT}`));
}

module.exports = app;
