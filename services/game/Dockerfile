# build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build

# # runtime stage
# FROM node:20-slim
# WORKDIR /app
# ENV NODE_ENV=production
# COPY --from=build /app/package*.json ./
# COPY --from=build /app/dist ./dist
# RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "server.ts"]
