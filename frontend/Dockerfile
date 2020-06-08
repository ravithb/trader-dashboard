FROM node:10.19.0-alpine as builder

ARG env=prod
ENV NODE_ENV=$env
ENV NODE_OPTIONS='--max-old-space-size=4096'

RUN apk update && \
	apk upgrade && \
	apk add git

RUN mkdir /ng-app

WORKDIR /ng-app

ADD package.json /ng-app/

RUN npm install

ADD ./ /ng-app/

RUN $(npm bin)/ng build --prod --configuration=production  --build-optimizer=true --verbose=true --sourceMap=false --progress=true --lazyModules

FROM nginx:1.13.3-alpine

ADD nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist/trader/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

