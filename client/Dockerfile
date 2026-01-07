# Image Node.js
FROM node:20

# Dossier de travail
WORKDIR /app

# Copier package.json et installer les dependances
COPY package*.json ./
RUN npm install

# Copier le code
COPY . .

# Port du frontend
EXPOSE 5173

# Lancer le serveur de dev
CMD ["npm", "run", "dev", "--", "--host"]
