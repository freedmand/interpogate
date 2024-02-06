FROM node:20.11.0

COPY ./package.json /app/
WORKDIR /app

RUN npm install

CMD npm run dev -- --host 0.0.0.0