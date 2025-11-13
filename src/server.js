const express = require("express");
const dotenv = require("dotenv");
const db = require("./db/db-postgres");

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

// Start the server only when this file is run directly (node src/server.js)
// This prevents tests that `require('./src/server')` from opening a listening TCP server
if (require.main === module) {
	app.listen(PORT, () => console.log(`API prête sur http://localhost:${PORT}`));
}

module.exports = app;
