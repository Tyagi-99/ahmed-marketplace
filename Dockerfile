FROM node:22

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/api/package.json ./packages/api/
COPY apps/admin/package.json ./apps/admin/
COPY apps/vendor/package.json ./apps/vendor/
COPY apps/storefront/package.json ./apps/storefront/

RUN corepack enable && yarn install --immutable

COPY . .

EXPOSE 7000 7001 8000 9000