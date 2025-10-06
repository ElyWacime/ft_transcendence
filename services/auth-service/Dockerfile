
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN apt-get update -y && apt-get install -y openssl
RUN npm install

COPY . .
RUN mkdir -p /app/prisma/db

# Generate Prisma client inside Debian
RUN npx prisma generate

CMD ["npm", "run", "dev"]

