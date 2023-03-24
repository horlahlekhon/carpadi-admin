# Base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Build the app
RUN yarn build

# Set the environment variable
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
