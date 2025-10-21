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

sshpass -e ssh podlomar@podlomar.me "rm -rf /var/www/sasky.podlomar.me/server/*"
sshpass -e scp -r dist/* podlomar@podlomar.me:/var/www/sasky.podlomar.me/server
sshpass -e scp package.json package-lock.json podlomar@podlomar.me:/var/www/sasky.podlomar.me
sshpass -e ssh podlomar@podlomar.me "cd /var/www/sasky.podlomar.me/server && npm install --production"
