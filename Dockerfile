FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

ENV NODE_ENV=test

COPY . .

EXPOSE 5000

# Define the command to run the app
CMD ["node", "/app/src/server.js"]
