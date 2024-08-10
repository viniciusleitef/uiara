SHELL=/bin/bash

.PHONY: build
build:
	sudo docker build -t detectai_fastapi_image -f docker/Dockerfile.fastapi .
	sudo docker build -t detectai_vite_image -f docker/Dockerfile.vite .

.PHONY: up
up:
	sudo docker compose -f docker/docker-compose.yaml up -d

.PHONY: down
down:
	sudo docker compose -f docker/docker-compose.yaml down

.PHONY: remove
remove:
	sudo docker rm detectai_fastapi --force
	sudo docker rm detectai_vite  --force

	sudo docker rmi detectai_fastapi_image
	sudo docker rmi detectai_vite_image