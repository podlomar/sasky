#!/bin/bash
set -euo pipefail

REMOTE=podlomar@podlomar.me
TARGET=/var/www/sasky.podlomar.me

ssh "$REMOTE" "rm -rf $TARGET/dist"
scp -r dist "$REMOTE:$TARGET/"
scp -r drizzle "$REMOTE:$TARGET/"
scp package.json package-lock.json "$REMOTE:$TARGET/"
ssh "$REMOTE" "cd $TARGET && npm ci --omit=dev"
ssh "$REMOTE" "sudo systemctl restart sasky"
