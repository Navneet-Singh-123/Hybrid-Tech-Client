# Pull Docker Hub base image
FROM node:10
# Set working directory
WORKDIR /usr/app/client
# Install app dependencies
COPY package*.json ./
RUN npm install -qy
# Copy app to container
COPY . .
# Expose the port 
EXPOSE 3000
# Run the "dev" script in package.json
CMD ["npm", "run", "dev"]