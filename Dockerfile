# Use the official Node.js image as the base
FROM node:18
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json first
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY . .
# Expose the port your Express app runs on
EXPOSE 3000
# Command to start the application
CMD ["node", "app.js"]