FROM node:20-bullseye

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl sqlite3 && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

