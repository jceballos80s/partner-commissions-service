FROM node:20-slim AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN apt-get update && apt-get install -yq chromium

ENV ADDRESS=0.0.0.0 PORT=3000

CMD ["bash", "/app/docker-bootstrap.sh"]
