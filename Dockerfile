# Image Node.js
FROM node:20

# Dossier de travail
WORKDIR /app

# Copier package.json et installer les dependances
COPY package*.json ./
RUN npm install

# Copier le code
COPY src/ ./src/

# Port du serveur
EXPOSE 3000

# Lancer le serveur
CMD ["node", "src/server.js"]
