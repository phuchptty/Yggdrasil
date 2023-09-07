FROM bitnami/keycloak:22.0.1

LABEL org.opencontainers.image.source https://github.com/phuchptty/Yggdrasil

COPY themes/*.jar /opt/bitnami/keycloak/providers

ENV KC_FEATURES=update-email
