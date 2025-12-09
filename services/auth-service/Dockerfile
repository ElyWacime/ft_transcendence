FROM node:20-bullseye

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p /app/prisma/db

RUN npx prisma generate

CMD ["npm", "run", "dev"]
