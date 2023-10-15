FROM python:3.9-alpine

LABEL org.opencontainers.image.source https://github.com/phuchptty/Yggdrasil

ENV USER=alixia
ENV UID=6789
ENV GID=1234

RUN apk update && apk add bash

RUN addgroup --gid 1024 app-group

RUN adduser \
    --disabled-password \
    --gecos "" \
    --uid "$UID" \
    --gid "$GID" \
    --home "/home/$USER" \
    --none-unique \
    "$USER"

RUN sed -i '/^alixia:/!d' /etc/passwd

RUN chown 1024:1024 /home/${USER}
RUN chmod 775 /home/${USER}
RUN chmod g+s /home/${USER}

WORKDIR /home/alixia
USER alixia

# Create a directory for the database and expose as a volume for persistence
RUN mkdir /home/${USER}/runner
RUN chown 1024:1024 /home/${USER}/runner
VOLUME /home/${USER}/runner

# Install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["tail", "-f", "/dev/null"]