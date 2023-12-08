# Use the official Node.js 14 image as a parent image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

ENV NODE_ENV=test

# Copy the rest of the code
COPY . .

# Expose port 3000
EXPOSE 5000

# Define the command to run the app
CMD ["node", "/app/src/server.js"]
