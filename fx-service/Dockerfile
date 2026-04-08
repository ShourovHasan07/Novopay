FROM node:20-alpine

WORKDIR /usr/src/app

# পুরো প্রজেক্ট কপি করছি (shared সহ)
COPY . .

# এখন service ফোল্ডারে চলে যাচ্ছি
WORKDIR /usr/src/app/fx-service

RUN npm install

EXPOSE 3004

CMD ["npm", "run", "start"]