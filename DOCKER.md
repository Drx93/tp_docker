# Documentation Docker - Orium Agence Scraper

## Architecture Multi-Conteneurs

L'application est composée de **4 services** conteneurisés :

```
Frontend : React/Vite
Backend : Node.js/Express
MongoDB : Base de données pour les restaurants
PostgreSQL : Base de données pour les utilisateurs
```

## Démarrage Rapide

### 1. Cloner le projet

```bash
git clone https://github.com/Drx93/orium_agence_scrapper.git
cd orium_agence_scrapper
```

### 2. Lancer l'application

```bash
docker-compose up --build
```

### 3. Accéder à l'application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Documentation API | http://localhost:3000/api-docs |

## Description des Services

### Frontend (React/Vite)
- **Image** : node:20
- **Port** : 5173
- **Rôle** : Interface utilisateur React

### Backend (Node.js/Express)
- **Image** : node:20
- **Port** : 3000
- **Rôle** : API REST, logique métier

### MongoDB
- **Image** : mongo:7
- **Port** : 27017
- **Rôle** : Base de données pour les restaurants

### PostgreSQL
- **Image** : postgres:16
- **Port** : 5432
- **Rôle** : Base de données pour les utilisateurs

## Variables d'Environnement

Le backend utilise les variables suivantes (définies dans docker-compose.yml) :

| Variable | Valeur | Description |
|----------|--------|-------------|
| PORT | 3000 | Port du serveur backend |
| MONGO_URI | mongodb://mongodb:27017/orium_db | Connexion MongoDB |
| DATABASE_URL | postgresql://postgres:postgres@postgres:5432/orium_db | Connexion PostgreSQL |
| CORS_ALLOW_ALL | true | Autorise toutes les origines CORS |

## Persistance des Données

Les données sont persistées grâce aux volumes Docker :

| Volume | Service | Chemin dans le conteneur |
|--------|---------|--------------------------|
| mongo_data | MongoDB | /data/db |
| postgres_data | PostgreSQL | /var/lib/postgresql/data |

Les données survivent aux redémarrages des conteneurs.

## Commandes Utiles

### Gestion des conteneurs

```bash
# Lancer l'application (avec rebuild)
docker-compose up --build

# Lancer l'application (sans rebuild)
docker-compose up

# Lancer en arrière-plan
docker-compose up -d

# Arrêter l'application
docker-compose down

# Arrêter et supprimer les volumes (efface les données)
docker-compose down -v
```

### Logs et débogage

```bash
# Voir tous les logs
docker-compose logs

# Voir les logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
docker-compose logs postgres

# Suivre les logs en temps réel
docker-compose logs -f backend
```

### Accéder à un conteneur

```bash
# Ouvrir un shell dans le backend
docker-compose exec backend sh

# Ouvrir un shell MongoDB
docker-compose exec mongodb mongosh

# Ouvrir un shell PostgreSQL
docker-compose exec postgres psql -U postgres -d orium_db
```

## Communication Entre Services

Les services communiquent via le réseau Docker interne :

- Le **frontend** appelle le **backend** via `http://backend:3000`
- Le **backend** appelle **MongoDB** via `mongodb://mongodb:27017`
- Le **backend** appelle **PostgreSQL** via `postgresql://postgres:5432`

Les noms de services (`backend`, `mongodb`, `postgres`) servent de noms DNS internes.

## Structure des Fichiers Docker

```
orium_agence_scraper/
├── Dockerfile              # Build du backend
├── docker-compose.yml      # Gestions des services
├── .dockerignore           # Fichiers exclus du build backend
└── client/
    ├── Dockerfile          # Build du frontend
    ├── nginx.conf          # Configuration Nginx
    └── .dockerignore       # Fichiers exclus du build frontend
```