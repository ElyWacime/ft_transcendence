FROM node:20

WORKDIR /usr/src/app

COPY package*.json tsconfig*.json ./

RUN npm install -y
RUN npm install --save-dev @types/better-sqlite3

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
