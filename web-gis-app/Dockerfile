# Stage 1: Build Angular application
FROM node:16.14-alpine AS angular

WORKDIR /web-gis-app

COPY . .

RUN npm install --legacy-peer-deeps
RUN npm run build

# Stage 2: Serve Angular application using http-server
FROM node:16.14-alpine

WORKDIR /usr/src/app

# Install http-server
RUN npm install -g http-server

# Copy built files from the previous stage
COPY --from=angular /web-gis-app/dist .

# Expose the port
EXPOSE 3000

# Command to start the server
CMD [ "http-server", "./", "-p", "3000" ]
