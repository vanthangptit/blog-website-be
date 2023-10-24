FROM node:16.13-alpine

WORKDIR /usr/local/nonroot/app

# Copy source over
COPY ./ .

# Install dependencies
RUN yarn add -g \
  pm2 \
  concurrently

RUN yarn install && yarn build

EXPOSE 8080

# Start app
CMD ["yarn", "start"]
