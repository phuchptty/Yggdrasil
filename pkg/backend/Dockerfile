FROM node:lts-alpine AS dependences
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile``

COPY . .
RUN yarn build

FROM node:lts-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=dependences /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
