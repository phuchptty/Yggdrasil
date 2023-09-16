FROM python:3.9-alpine

LABEL org.opencontainers.image.source https://github.com/phuchptty/Yggdrasil

ENV USER=alixia
ENV UID=6789

RUN apk update && apk add bash

RUN adduser \
    --disabled-password \
    --gecos "" \
    --uid "$UID" \
    "$USER"

RUN sed -i '/^alixia:/!d' /etc/passwd

WORKDIR /home/alixia

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN chown -R alixia:alixia /home/alixia

RUN chmod 700 /home/alixia

USER alixia

ENTRYPOINT ["tail", "-f", "/dev/null"]