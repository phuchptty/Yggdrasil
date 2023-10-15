FROM python:3.9-alpine

LABEL org.opencontainers.image.source https://github.com/phuchptty/Yggdrasil

ENV USER=alixia
ENV UID=6789
ENV GID=1234

RUN apk update && apk add bash

RUN addgroup --gid ${GID} hk3d

RUN adduser \
    --disabled-password \
    --gecos "" \
    --uid "$UID" \
    --ingroup "hk3d" \
    --home "/home/$USER" \
    --no-create-home \
    "$USER"

RUN sed -i '/^alixia:/!d' /etc/passwd

RUN mkdir /home/${USER}
RUN chown ${GID}:${GID} /home/${USER}
RUN chmod 775 /home/${USER}
RUN chmod g+s /home/${USER}

# Create a directory for the database and expose as a volume for persistence
RUN mkdir /home/${USER}/runner
RUN chown ${GID}:${GID} /home/${USER}/runner
VOLUME /home/${USER}/runner

WORKDIR /home/alixia
USER alixia

# Install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["tail", "-f", "/dev/null"]