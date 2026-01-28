FROM node:22.17.0-slim AS build

ARG BUILD_ENV

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build-${BUILD_ENV}

EXPOSE 80 80
ENV NODE_ENV=${BUILD_ENV}
CMD PORT=80 npm start
