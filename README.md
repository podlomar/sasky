# Šášky Chess Application - Server Setup Guide

This guide provides step-by-step instructions for setting up the Sasky chess application on an Ubuntu server with nginx and systemd. The application is an [Astro](https://astro.build) app rendered on demand by the Node adapter, and is deployed by cloning directly from the git repository and building on the server.

## Local development

```bash
npm install
npm run dev      # dev server on http://localhost:5000
npm run check    # type check
npm run build    # production build into dist/
npm start        # run the production build
```

Game and player data are read from JSON files in the directory given by `SASKY_DATA_DIR` (default `./data`). That directory must contain `games.json` and `players.json`; both are valid as an empty array `[]` on a fresh install.

## Prerequisites

- Ubuntu Server (24.04 or later)
- Node.js v22.21.0 (LTS) installed
- nginx installed
- sudo/root access
- Domain: `sasky.podlomar.me` pointing to the server

## 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx nodejs npm git
```

## 2. Clone and Build Application

```bash
# Clone the repository
cd /var/www
sudo git clone https://github.com/podlomar/sasky.git sasky.podlomar.me

# Create data directory
sudo mkdir -p /var/www/sasky.podlomar.me/data

# Seed the data files if this is a fresh install
echo '[]' | sudo tee /var/www/sasky.podlomar.me/data/games.json
echo '[]' | sudo tee /var/www/sasky.podlomar.me/data/players.json

# Set ownership
sudo chown -R www-data:www-data /var/www/sasky.podlomar.me

# Switch to www-data user for building
sudo -u www-data bash

# Install dependencies and build
cd /var/www/sasky.podlomar.me
npm install
npm run build

# Exit back to your user
exit
```

The build produces `dist/server/entry.mjs`, a standalone server that also serves the client assets from `dist/client/`.

## 3. Update Application (for future deployments)

To update the application with the latest code:

```bash
# Switch to application directory
cd /var/www/sasky.podlomar.me

# Stop the service
sudo systemctl stop sasky

# Pull latest changes
sudo -u www-data git pull origin master

# Switch to www-data user for building
sudo -u www-data bash

# Install any new dependencies and rebuild
npm install
npm run build

# Exit back to your user
exit

# Restart the service
sudo systemctl start sasky
```

Alternatively, `npm run deploy` builds locally and copies `dist/` plus the package manifests to the server over ssh, then restarts the service.

## 4. Create Systemd Service

Create the service file:

```bash
sudo nano /etc/systemd/system/sasky.service
```

Add the following content from file `sasky.service`. It runs the server on port 9000 and points `SASKY_DATA_DIR` at `/var/www/sasky.podlomar.me/data`. Then enable and start the service:

```bash
# Reload systemd daemon
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable sasky

# Start the service
sudo systemctl start sasky

# Check status
sudo systemctl status sasky
```

## 5. Configure Nginx

### Create the nginx site configuration:

```bash
sudo nano /etc/nginx/sites-available/sasky.podlomar.me
```

Add the content of `nginx.conf`:

### Enable the site:

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/sasky.podlomar.me /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## 6. Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw --force enable
```

## 7. Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d sasky.podlomar.me

# Test automatic renewal
sudo certbot renew --dry-run
```

## 8. Verify Installation

### Check that everything is running:

```bash
# Check service status
sudo systemctl status sasky

# Check nginx status
sudo systemctl status nginx

# Check if port 9000 is listening
sudo ss -tlnp | grep :9000

# Check logs
sudo journalctl -u sasky -f
```

### Test the application:

Visit `http://sasky.podlomar.me` (or `https://sasky.podlomar.me` if SSL is configured) Your Sasky chess application should now be running!
