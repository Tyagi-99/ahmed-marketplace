FROM node:22

WORKDIR /app

COPY . .

RUN corepack enable
RUN yarn install

EXPOSE 7000 7001 8000 9000

CMD ["yarn","dev"]