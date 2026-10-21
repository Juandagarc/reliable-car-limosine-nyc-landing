FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html 404.html robots.txt sitemap.xml site.webmanifest favicon.ico favicon.svg apple-touch-icon.png /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY booking /usr/share/nginx/html/booking
EXPOSE 80
