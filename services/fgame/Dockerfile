FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY DBController.js ./DBController.js
COPY game.sql ./game.sql
COPY database.sqlite ./database.sqlite
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
