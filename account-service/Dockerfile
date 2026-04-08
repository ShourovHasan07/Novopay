FROM node:20-alpine

WORKDIR /usr/src/app


COPY . .


WORKDIR /usr/src/app/account-service

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start"]