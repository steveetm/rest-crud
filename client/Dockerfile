FROM docker-registry.l6/nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /war/www/html/
COPY ./views/ /var/www/html/
COPY ./public/ /var/www/html/