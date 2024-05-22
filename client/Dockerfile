FROM node:20-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install

COPY ./vite.config.ts ./tsconfig.json ./tsconfig.node.json ./index.html /app/

COPY ./src /app/src
COPY ./public /app/public

CMD [ "npm", "start" ]

