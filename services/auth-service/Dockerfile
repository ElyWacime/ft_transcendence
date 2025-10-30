
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN apt-get update -y && apt-get install -y openssl
# Use legacy peer deps during image build to avoid ERESOLVE failures from dev-only
# packages (e.g. prisma-erd-generator) that require older @prisma/client versions.
RUN npm install --legacy-peer-deps

COPY . .
RUN mkdir -p /app/prisma/db

# Generate Prisma client inside Debian
RUN npx prisma generate

CMD ["npm", "run", "dev"]

