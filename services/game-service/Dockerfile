FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

RUN apt update && apt install -y sqlite3

EXPOSE 3000

CMD ["node", "server.js"]