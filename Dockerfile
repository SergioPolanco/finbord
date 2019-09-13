FROM node:10

LABEL maintainer="Sergio Polanco"

RUN mkdir /code

WORKDIR /code
COPY . /code/

RUN npm install
RUN npm run tsc

EXPOSE 3000

ENTRYPOINT [ "node", "build/app.js" ]