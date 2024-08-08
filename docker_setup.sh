#!/bin/bash

if [[ "$1" == "build" ]]; then  
    sudo docker build -t detectai_fastapi_image -f docker/Dockerfile.fastapi .
    sudo docker build -t detectai_vite_image -f docker/Dockerfile.vite .
fi

if [[ "$1" == "run" ]]; then  
    sudo docker run --name detectai_fastapi -p 8302:8302 -d detectai_fastapi_image
    sudo docker run --name detectai_vite -p 8301:8301 -d detectai_vite_image
fi

if [[ "$1" == "remove" ]]; then  
    sudo docker remove detectai_fastapi --force
    sudo docker remove detectai_vite  --force

    sudo docker rmi detectai_fastapi_image
    sudo docker rmi detectai_vite_image
fi