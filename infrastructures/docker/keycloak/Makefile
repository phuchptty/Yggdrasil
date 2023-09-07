# Docker image name and tag
IMAGE_NAME := phuchptty/yggdrasil/keycloak
IMAGE_TAG := latest

# Docker registry URL
REGISTRY_URL := ghcr.io

build:
	docker build -t $(REGISTRY_URL)/$(IMAGE_NAME):$(IMAGE_TAG) .

push:
	docker push $(REGISTRY_URL)/$(IMAGE_NAME):$(IMAGE_TAG)

bupu:
	make build
	make push

dev:
	docker compose up -d

down:
	docker compose down