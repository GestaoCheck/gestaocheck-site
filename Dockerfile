# Site estatico (HTML/CSS/JS puro, sem build step) - so serve os arquivos
# como estao. Ver docker-compose.yml pras labels do Traefik (mesma VPS e
# mesmo padrao ja usado em producao pelo sistema principal).
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80
