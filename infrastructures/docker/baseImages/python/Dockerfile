FROM python:3.9-alpine

LABEL org.opencontainers.image.source https://github.com/phuchptty/Yggdrasil

ENV USER=alixia
ENV UID=6789
ENV GID=1234

RUN apk update && apk add bash

RUN addgroup --gid ${GID} hk3rd

RUN adduser \
    --disabled-password \
    --gecos "" \
    --uid "$UID" \
    --ingroup "hk3rd" \
    --home "/home/$USER" \
    --no-create-home \
    "$USER"

# Magic string but it's user name from above
RUN sed -i '/^alixia:/!d' /etc/passwd

RUN mkdir /home/${USER}
RUN chown ${GID}:${GID} /home/${USER}
RUN chmod 775 /home/${USER}
RUN chmod g+s /home/${USER}

# Create a directory for nfs mount
RUN mkdir /home/${USER}/runner
RUN chown ${GID}:${GID} /home/${USER}/runner
VOLUME /home/${USER}/runner

WORKDIR /home/${USER}/runner
USER ${USER}

# Install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["/bin/bash"]