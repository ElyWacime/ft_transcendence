# Node image
FROM node:20

# Create app directory
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build TypeScript
RUN npm run build

# Expose Fastify port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
