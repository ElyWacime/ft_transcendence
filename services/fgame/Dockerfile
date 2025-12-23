FROM node:20 AS build
WORKDIR /app
RUN chmod 777 /app
COPY package*.json ./
COPY DBController.js ./DBController.js
COPY game.sql ./game.sql
COPY database.sqlite ./database.sqlite
RUN chmod 777 ./database.sqlite
RUN apt update
RUN npm install
RUN apt install sqlite3
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
