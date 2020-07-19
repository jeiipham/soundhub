FROM node:12 AS build 
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . . 
RUN npm run build 

FROM nginx:1.18
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
