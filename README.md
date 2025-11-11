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
npm i prisma @prisma/client
npm i swagger-ui-express swagger-jsdoc
npm i mongoose
npm i -D jest supertest cross-env
npm i bcrypt jsonwebtoken express-rate-limit
```

---

## Configuration

Créer un fichier `.env` à la racine du projet et définir vos variables d'environnement, par exemple :

```
PORT=3000
DATABASE_URL=postgresql://user:password@127.0.0.1:5432/nomdb
MONGO_URI=mongodb://127.0.0.1:27017/nomdb
JWT_SECRET=ton_secret_jwt
```

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
│  ├─ /services       # Business logic
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
