#!/bin/bash

scp -r dist/* podlomar@podlomar.me:/var/www/sasky.podlomar.me/server
scp package.json package-lock.json podlomar@podlomar.me:/var/www/sasky.podlomar.me
ssh podlomar@podlomar.me "cd /var/www/sasky.podlomar.me/server && npm install --production"
