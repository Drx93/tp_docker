const express = require("express");
const dotenv = require("dotenv");
const db = require("./db/db-postgres");
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount routes
const userRoutes = require("./routes/users.routes");
app.use("/api/users", userRoutes);
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

// Error handler
app.use((err, req, res, next) => {
	console.error(" Erreur serveur:", err.message);
	res.status(500).json({ error: "Erreur interne serveur" });
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
