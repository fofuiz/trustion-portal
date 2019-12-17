FROM registry-prd1.accesstage.com.br/nginx-generic-alpine

## Copy our default nginx config
COPY ./nginx/default.conf  /etc/nginx/conf.d/default.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY . /usr/share/nginx/html/trustion-portal

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
