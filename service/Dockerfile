FROM node:lts-alpine

ARG env=prod
ARG port=3000
ARG apiUrlPrefix=""
ARG pgHost=""
ARG pgUser=""
ARG pgPass=""
ENV NODE_ENV=$env
ENV PORT=$port
ENV API_PREFIX=$apiUrlPrefix

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && rm -rf /var/cache/apk/*
  
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start" ]

EXPOSE 3000
