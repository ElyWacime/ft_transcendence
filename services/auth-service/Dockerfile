FROM node:20-bullseye

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl sqlite3 && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p /app/prisma/db

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN npx prisma generate

CMD ["entrypoint"]
