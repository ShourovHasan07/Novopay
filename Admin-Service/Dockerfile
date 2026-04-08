FROM node:20-alpine

WORKDIR /usr/src/app


COPY . .


WORKDIR /usr/src/app/admin-service

RUN npm install

EXPOSE 3007

CMD ["npm", "run", "start"]