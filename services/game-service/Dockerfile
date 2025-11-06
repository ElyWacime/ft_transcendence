# ---------- Base image ----------
FROM node:20-alpine

WORKDIR /app

# ---------- Install dependencies ----------
COPY package*.json ./
RUN npm install

# ---------- Copy source ----------
COPY . .

# ---------- Build (if using TypeScript) ----------
# RUN npm run build

# ---------- Expose & Run ----------
EXPOSE 3001
# CMD ["npm", "run", "start"]
# CMD ["npm", "run", "dev"]
CMD ["node", "server.js"]