FROM nginx:latest

ARG LISTEN_PORT
ARG SERVER_NAME
ARG PROXY_PASS

ENV LISTEN_PORT=$LISTEN_PORT
ENV SERVER_NAME=$SERVER_NAME
ENV PROXY_PASS=$PROXY_PASS

RUN rm /etc/nginx/conf.d/default.conf
RUN touch /etc/nginx/conf.d/finbord.conf

COPY ./nginx/nginx_template.tmpl /etc/nginx/nginx.tmpl

CMD /bin/sh -c "envsubst '\$LISTEN_PORT \$SERVER_NAME \$PROXY_PASS' < /etc/nginx/nginx.tmpl > /etc/nginx/conf.d/finbord.conf && nginx -g 'daemon off;' || cat /etc/nginx/conf.d/finbord.conf"
