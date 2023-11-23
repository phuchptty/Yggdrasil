FROM node:18-alpine AS base

RUN apk add g++ make py3-pip pkgconfig

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

LABEL authors="Lucas Dang <mica-pings-0z@icloud.com>"

ENV NODE_ENV production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY ./.env.local ./

RUN addgroup --gid 1001 --system nodejs
RUN adduser --system nextjs --uid 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]