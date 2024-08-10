#!/bin/sh

ssh -o StrictHostKeyChecking=no -R 80:localhost:8302 serveo.net | tee /app/env/url_serveo.txt

sleep 5

echo "API_URL=$(cat /app/env/url_serveo.txt | grep -o 'https://[^ ]*.serveo.net')" | tee /app/env/.env.production

python3 main.py
