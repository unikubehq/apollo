FROM node:14.5-alpine
ENV ENDPOINTS="projectservice:http://projectservice:8082/graphql orgaservice:http://orgaservice:8081/graphql"
ENV POLLING_INTERVAL=6000

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

CMD [ "node", "service.js" ]