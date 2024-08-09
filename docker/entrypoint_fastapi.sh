#!/bin/bash

ssh -o StrictHostKeyChecking=no -R 80:localhost:8302 serveo.net | tee /app/env/url_serveo.txt &

python3 main.py
