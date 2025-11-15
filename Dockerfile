# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy app source
COPY . .

# Run app
CMD ["npm", "start"]
