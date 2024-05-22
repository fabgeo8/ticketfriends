FROM node:20-alpine

RUN apk add --update --no-cache \
  make \
  g++ \
  jpeg-dev \
  cairo-dev \
  giflib-dev \
  pango-dev \
  libtool \
  autoconf \
  automake

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN mkdir /app/src

RUN npm install

COPY ./tsconfig.json /app/tsconfig.json
COPY ./src/ /app/src/
# COPY ./types/ /app/types/

ENV NODE_OPTIONS=--max_old_space_size=4096

CMD [ "npm", "run", "dev" ]
