# Use official Node.js LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package.json & package-lock.json first
COPY package*.json ./

# Install dependencies first (Docker layer caching)
RUN npm install
RUN npm install -g nodemon

# Then copy the rest of the project
COPY . .

# Install sqlite3 binary (if needed for CLI tools)
RUN apt update && apt install -y sqlite3

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]