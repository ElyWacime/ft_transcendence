FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .
RUN mkdir -p /app/prisma/db

# Generate Prisma client inside Debian
RUN npx prisma generate

CMD ["npm", "run", "dev"]

