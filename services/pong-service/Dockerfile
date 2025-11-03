FROM node:18-alpine

WORKDIR /app

# copy package manifests first
COPY package.json package-lock.json* ./

# install all deps (including dev) so we can build
RUN npm install

# copy source
COPY . ./

# build TypeScript
RUN npm run build

EXPOSE 8081

CMD ["node", "dist/server.js"]
