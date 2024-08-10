#!/bin/bash

ssh -o StrictHostKeyChecking=no -R 80:localhost:8302 serveo.net > output.txt 2>&1 &

sleep 10

if grep -q 'https://[^ ]*.serveo.net' output.txt; then
    url=$(grep -o 'https://[^ ]*.serveo.net' output.txt)

    echo "VITE_API_URL=$url" > /app/env/.env.production
    
    echo "URL captured: $url"
else
    echo "URL capture failed"
fi

python3 main.py
