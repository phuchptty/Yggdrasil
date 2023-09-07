FROM node:lts-alpine as theme-build

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY theme/package.json theme/pnpm-lock.yaml ./

RUN pnpm install

COPY theme .

RUN pnpm build && pnpm build:jar

FROM bitnami/keycloak:22.0.1

LABEL org.opencontainers.image.source https://github.com/phuchptty/Yggdrasil

COPY --from=theme-build /app/out/keywind.jar /opt/bitnami/keycloak/providers/keywind.jar

ENV KC_FEATURES=update-email
