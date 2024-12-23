# Usa l'immagine base di Node.js
FROM node:18-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia il package.json e package-lock.json per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutti i file del progetto nella directory di lavoro
COPY . .

# Esegui la build di produzione
RUN npm run build

# Esponi la porta su cui il server sarà in esecuzione
EXPOSE 3000

# Avvia il server in modalità produzione
CMD ["npm", "start"]
