# Orium Agence Scraper - TP Docker

Application web conteneurisée avec Docker.

## Lancement

```bash

git clone https://github.com/Drx93/tp_docker.git
cd tp_docker

docker-compose up --build
```

## Accès

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Documentation API | http://localhost:3000/api-docs |

## Architecture

- **Frontend** : React/Vite (port 5173)
- **Backend** : Node.js/Express (port 3000)
- **MongoDB** : Base de données restaurants (port 27017)
- **PostgreSQL** : Base de données utilisateurs (port 5432)

## Documentation complète

Voir [DOCKER.md](./DOCKER.md) pour la documentation détaillée.
