#!/bin/bash
echo 'Import des restaurants dans MongoDB...'
mongoimport --db orium_db --collection restaurants --file /docker-entrypoint-initdb.d/restaurants.json --jsonArray
echo 'Import termine!'