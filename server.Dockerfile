FROM node:12

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . ./
CMD ["node", "server"]
