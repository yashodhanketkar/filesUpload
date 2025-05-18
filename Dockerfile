# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Generate Prisma client (optional: skip if client already generated)
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
