#!/bin/bash

PASSWORD="********"  # Replace with the actual password

echo "Deploying to podlomar.me..."
echo "Cleaning remote server directory..."
sshpass -p "$PASSWORD" ssh podlomar@podlomar.me "rm -rf /var/www/sasky.podlomar.me/server/*"

echo "Uploading new files..."
sshpass -p "$PASSWORD" scp -r dist/* podlomar@podlomar.me:/var/www/sasky.podlomar.me/server
sshpass -p "$PASSWORD" scp package.json package-lock.json podlomar@podlomar.me:/var/www/sasky.podlomar.me

echo "Installing production dependencies on remote server..."
sshpass -p "$PASSWORD" ssh podlomar@podlomar.me "cd /var/www/sasky.podlomar.me/server && npm install --production"
