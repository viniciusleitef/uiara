#!/bin/sh

echo "VITE_API_URL=${VITE_API_URL}" >> .env.production
echo "VITE_HAVE_AUTH=${VITE_HAVE_AUTH}" >> .env.production

npm run build

npm run preview