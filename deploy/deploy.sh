#!/bin/bash

# Deploy the built files to the server
# Setup ssh-agent to use fot all commands
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

scp -r dist/* podlomar@podlomar.me:/var/www/sasky.podlomar.me/server
scp package.json package-lock.json podlomar@podlomar.me:/var/www/sasky.podlomar.me
ssh podlomar@podlomar.me "cd /var/www/sasky.podlomar.me/server && npm install --production"
