FROM node:18

# Create app directory and move into it
WORKDIR /usr/src/app

# Install app dependencies
COPY ./package*.json ./

RUN npm install

# If code is for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .
# COPY .env .env

RUN npm run build

# ENV NODE_ENV production

EXPOSE 3000

CMD [ "node", "dist/server.js" ]

USER node