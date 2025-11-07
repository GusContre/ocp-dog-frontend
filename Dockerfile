FROM nginx:alpine

ENV FRONTEND_API_URL=http://ocp-dog-frontend-api:5001

COPY index.html app.js env-config.js /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/ /docker-entrypoint.d/

# Allow OpenShift's random UID to modify Nginx config and env assets
RUN chgrp -R 0 /usr/share/nginx/html /docker-entrypoint.d /etc/nginx/conf.d /var/cache/nginx /var/run \
  && chmod -R g+rwX /usr/share/nginx/html /docker-entrypoint.d /etc/nginx/conf.d /var/cache/nginx /var/run \
  && sed -i 's/^user \+nginx;/# user nginx;/' /etc/nginx/nginx.conf

EXPOSE 8080
