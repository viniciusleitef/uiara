#!/bin/sh

mv /app/env/.env.production /app/

npm run build

npm run preview