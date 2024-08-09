#!/bin/bash

if [[ "$1" == "build" ]]; then  
    sudo docker build -t detectai_fastapi_image -f docker/Dockerfile.fastapi .
    sudo docker build -t detectai_vite_image -f docker/Dockerfile.vite .
fi

if [[ "$1" == "up" && "$2" ]]; then
    echo $2
    NGROK_AUTH_TOKEN=$2 sudo docker compose -f docker/docker-compose.yaml up -d
fi

if [[ "$1" == "down" ]]; then  
    sudo docker compose -f docker/docker-compose.yaml down
fi

if [[ "$1" == "remove" ]]; then  
    sudo docker remove detectai_fastapi --force
    sudo docker remove detectai_vite  --force

    sudo docker rmi detectai_fastapi_image
    sudo docker rmi detectai_vite_image
fi