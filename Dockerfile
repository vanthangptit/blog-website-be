FROM node:16.13-alpine

EXPOSE 8080

WORKDIR /usr/local/nonroot/app

# Copy source over
COPY ./ .

# Install global npm dependencies
RUN yarn add \
 pm2 \
 concurrently

RUN yarn install

# Start app
CMD yarn start
