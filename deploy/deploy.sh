#!/bin/bash
set -euo pipefail

# Prompt (no echo) for password, store in a shell variable
read -r -s -p "SSH password: " SSHPASS_INPUT
echo

# Make sure we clear the variable on exit or interrupt
cleanup() {
  unset SSHPASS
  unset SSHPASS_INPUT
}
trap cleanup EXIT INT TERM

export SSHPASS="$SSHPASS_INPUT"

echo "Deploying to podlomar.me..."
echo "Cleaning remote server directory..."
sshpass -e ssh podlomar@podlomar.me "rm -rf /var/www/sasky.podlomar.me/server/*"

echo "Uploading new files..."
sshpass -e scp -r dist/* podlomar@podlomar.me:/var/www/sasky.podlomar.me/server
sshpass -e scp package.json package-lock.json podlomar@podlomar.me:/var/www/sasky.podlomar.me

echo "Installing production dependencies on remote server..."
sshpass -e ssh podlomar@podlomar.me "cd /var/www/sasky.podlomar.me/server && npm install --production"
