#!/bin/bash

# Load password from external file
PASSWORD_FILE="$(dirname "$0")/password.local"

if [ ! -f "$PASSWORD_FILE" ]; then
    echo "Error: Password file not found at $PASSWORD_FILE"
    echo "Please create the file with your password and try again."
    exit 1
fi

PASSWORD=$(cat "$PASSWORD_FILE" | tr -d '\n')

if [ -z "$PASSWORD" ]; then
    echo "Error: Password file is empty"
    exit 1
fi

echo "Testing SSH connection..."
if ! sshpass -p "$PASSWORD" ssh -o ConnectTimeout=10 -o BatchMode=no podlomar@podlomar.me "echo 'Connection successful'" 2>/dev/null; then
    echo "Error: SSH connection failed. Please check:"
    echo "  - Password is correct"
    echo "  - Server is reachable"
    echo "  - Username is correct"
    exit 1
fi
echo "✓ SSH connection test passed"

echo "Deploying to podlomar.me..."
echo "Cleaning remote server directory..."
sshpass -p "$PASSWORD" ssh podlomar@podlomar.me "rm -rf /var/www/sasky.podlomar.me/server/*"

echo "Uploading new files..."
sshpass -p "$PASSWORD" scp -r dist/* podlomar@podlomar.me:/var/www/sasky.podlomar.me/server
sshpass -p "$PASSWORD" scp package.json package-lock.json podlomar@podlomar.me:/var/www/sasky.podlomar.me

echo "Installing production dependencies on remote server..."
sshpass -p "$PASSWORD" ssh podlomar@podlomar.me "cd /var/www/sasky.podlomar.me/server && npm install --production"
