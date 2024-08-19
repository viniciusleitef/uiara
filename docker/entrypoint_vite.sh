#!/bin/sh

# ngrok config add-authtoken $NGROK_AUTH_TOKEN

# ngrok http 8301 &

# echo sleeping for 30s

# sleep 30

# cp /app/env/.env.production /app/

npm run build

# echo $(curl -s localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

npm run preview