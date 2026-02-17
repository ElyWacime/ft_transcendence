FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN apt update
RUN npm install
RUN npm install -g nodemon
RUN apt install sqlite3

# Copy app code
COPY . .

# Make SQLite file writable
# RUN  sqlite3 database.sqlite < game.sql
RUN chmod 777 database.sqlite

EXPOSE 3000

# Start server with nodemon for live reload
CMD ["nodemon", "server.js"]
# CMD ["node", "server.js"]