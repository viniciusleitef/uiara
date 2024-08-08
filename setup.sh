#!/bin/sh

sudo ./close_setup.sh

screen -dmS front_detectai && screen -S front_detectai -p 0 -X stuff "cd $PWD/react\n" && screen -S front_detectai -p 0 -X stuff "npm run dev\n"

screen -dmS back_detectai && screen -S back_detectai -p 0 -X stuff "python3 main.py\n"

screen -dmS ngrok_detectai && screen -S ngrok_detectai -p 0 -X stuff "ngrok http 8301\n"

screen -dmS serveo_detectai && screen -S serveo_detectai -p 0 -X stuff "ssh -R 80:localhost:8302 serveo.net\n"

sleep 5

screen -S ngrok_detectai -p 0 -X hardcopy /tmp/ngrok_output.txt
grep -o 'https://.*\.ngrok-free.app' /tmp/ngrok_output.txt

screen -S serveo_detectai -p 0 -X hardcopy /tmp/serveo_output.txt
grep -o 'https://[0-9a-z]*.serveo.net' /tmp/serveo_output.txt