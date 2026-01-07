#!/bin/bash
# Script d'initialisation MongoDB
# Importe les restaurants dans la base de donnees

echo "Import des restaurants dans MongoDB..."
mongoimport --db orium_db --collection restaurants --file /docker-entrypoint-initdb.d/restaurants.json --jsonArray
echo "Import termine!"
