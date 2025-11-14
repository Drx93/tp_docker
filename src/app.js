const express = require('express');
const cors = require('cors');
const routes = require('./routes/restaurants.routes');

const app = express();

// Middleware : parser JSON pour le corps des requêtes
app.use(express.json());

// Limiteur de débit (global pour cette instance de l'application)
const { defaultLimiter } = require('./middlewares/rateLimiter');
app.use(defaultLimiter);

// Configuration CORS
// Permet la configuration via des variables d'environnement :
// - CORS_ALLOW_ALL=true -> autorise toutes les origines
// - CORS_ALLOWED_ORIGINS="https://example.com,https://foo" -> liste CSV d'origines autorisées
if (process.env.CORS_ALLOW_ALL === 'true') {
	// Autoriser toutes les origines
	app.use(cors());
} else if (process.env.CORS_ALLOWED_ORIGINS) {
	// Autorisations basées sur une liste d'origines fournies
	const origins = process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim());
	app.use(cors({ origin: function(origin, cb) {
		// Autoriser les requêtes sans champ Origin (ex : curl, applications mobiles)
		if (!origin) return cb(null, true);
		// Autoriser si l'origine est dans la liste
		if (origins.indexOf(origin) !== -1) return cb(null, true);
		// Refuser sinon
		cb(new Error('Origin not allowed by CORS'));
	}}));
} else {
	// Par défaut (utile en développement) : autoriser toutes les origines
	app.use(cors());
}


// Routes de l'API pour les restaurants
app.use('/api/restaurants', routes);

// Ancien front statique supprimé ; l'application cliente est gérée séparément (Vite ou bundle compilé).

// Endpoint de santé
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
