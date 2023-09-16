build:docker:keycloak
	docker build -t $(REGISTRY_URL)/$(IMAGE_NAME)/keycloak:$(IMAGE_TAG) ./infrastructures/docker/keycloak

build:docker:beacon
	docker build -t $(REGISTRY_URL)/$(IMAGE_NAME)/beacon:$(IMAGE_TAG) ./pkg/beacon