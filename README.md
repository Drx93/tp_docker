# orium_agence_scrapper


# API Restaurants Île-de-France

## Introduction
*Le blabla de l'intro décrivant le projet en quoi il consiste , que je vais déveloper tout à l'heure*

Cette API REST recense les restaurants en Île-de-France depuis un CSV, avec options de filtrage, recherche et historique des utilisateurs. Elle utilise une architecture REST + MVC + POO, et est sécurisée avec JWT, rate limiting et CORS.  

---

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Drx93/orium_agence_scrapper.git
cd orium_agence_scrapper
````

### 2. Installer les dépendances

```bash
npm init -y

npm i express dotenv cors
npm i swagger-ui-express swagger-jsdoc
npm i pg mongoose mongodb-memory-server
npm i -D jest supertest cross-env
npm i bcrypt jsonwebtoken express-rate-limit
```

---

## Configuration

Créer un fichier `.env` à la racine du projet et définir vos variables d'environnement, par exemple :

```
PORT=3000
DATABASE_URL=postgresql://postgres:votre_mot_de_passe@127.0.0.1:5432/orium_agence_scrapper_sql
MONGO_URI=mongodb://127.0.0.1:27017/orium_agence_scrapper_nosql
JWT_SECRET=ton_secret_jwt_key
```

Rate limiting: le projet utilise `express-rate-limit`. La configuration par défaut se trouve dans `src/middlewares/rateLimiter.js` (fenêtre 5 minutes, 100 requêtes). Vous pouvez modifier ces valeurs ou créer des limiteurs spécifiques via la factory `createLimiter` exportée par ce fichier.

CORS: Le projet utilise `cors` pour gérer les origines autorisées. Vous pouvez configurer le comportement via ces variables d'environnement dans votre `.env`:

```
# Autoriser toutes les origines (utile en dev)
CORS_ALLOW_ALL=true

# Ou limiter aux origines listées (CSV)
CORS_ALLOWED_ORIGINS=https://example.com,https://frontend.local
```

Par défaut (si aucune variable n'est définie) le serveur autorise toutes les origines pour faciliter le développement.

---

## Démarrage

### Lancer le serveur en développement

```bash
npm run dev
```

### Lancer le serveur en production

```bash
npm start
```

---

## Structure du projet
à revoir cette partie, c'est juste l'exemple type ducoup
```
├─ /src
│  ├─ /controllers    # Logique des routes
│  ├─ /db             # Connexions au db
│  ├─ /models         # Models SQL et NoSQL
│  ├─ /routes         # Définition des endpoints
│  ├─ /middlewares    # CORS, rate limiter, auth, etc.
│  └─ /utils          # Fonctions utilitaires
├─ /tests              # Tests d'intégration et unitaires
├─ .env
└─ package.json
```

---

## Documentation

La documentation Swagger est générée automatiquement et disponible sur :

```
http://localhost:3000/api-docs
```

---

## Tests

Les tests sont écrits avec Jest et Supertest.
Pour lancer les tests :

```bash
npm test
```
