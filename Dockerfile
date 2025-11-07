FROM nginx:alpine

ENV FRONTEND_API_URL=http://ocp-dog-frontend-api:5001

COPY index.html app.js env-config.js /usr/share/nginx/html/
COPY docker-entrypoint.d/ /docker-entrypoint.d/

EXPOSE 80
