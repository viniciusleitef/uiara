# Chaos IP

```sh
150.165.167.12
```

# Makefile and Docker setup

prereqs

- [Docker](https://docs.docker.com/engine/install/)
- sudo apt install make

.env

```sh
NGROK_AUTH_TOKEN=...
```

to see the frontend url

```sh
docker logs detectai_vite
```

commands

```sh
make build  # to install images 

make up     # to run containers from images

make down   # to remove containers

make remove # to remove image and containers
```

# Manual local setup

## Vite

```sh
cd vite

# install and build packages
# npm i
# npm run build

npm run preview
```

./vite/.env.production

```sh
VITE_API_URL=...
```

## Fastapi

run

```sh
cd fastapi

# install packages
# pip install -r requirements.txt

python3 main.py
```