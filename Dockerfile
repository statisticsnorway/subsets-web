
# Working code, no build

#FROM node:latest
#COPY . /var/www
#WORKDIR /var/www
#RUN npm install
#EXPOSE 3000
#ENTRYPOINT ["npm", "start"]


# After BUILD
# with loadbalancer NGINX

FROM nginx:1.27-alpine

RUN apk upgrade --no-cache
RUN apk add --no-cache nodejs yarn
RUN yarn global add @beam-australia/react-env

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .env docker-entrypoint.sh /var/
COPY /build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["sh", "/var/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
