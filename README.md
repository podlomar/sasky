# Sasky Chess Application - Server Setup Guide

This guide provides step-by-step instructions for setting up the Sasky chess application on an Ubuntu server with nginx and systemd. The application is deployed by cloning directly from the git repository and building on the server.

## Prerequisites

- Ubuntu Server (24.04 or later)
- Node.js v22.21.0 (LTS) installed
- nginx installed
- sudo/root access
- Domain: `sasky.podlomar.me` pointing to your server

## 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx nodejs npm git

# Install PM2 for process management (optional but recommended)
sudo npm install -g pm2
```

## 2. Clone and Build Application

```bash
# Create data directory
sudo mkdir -p /var/www/sasky.podlomar.me/data

# Clone the repository
cd /var/www
sudo git clone https://github.com/podlomar/sasky.git sasky.podlomar.me

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

## 4. Create Systemd Service

Create the service file:

```bash
sudo nano /etc/systemd/system/sasky.service
```

Add the following content from file `sasky.service`. Then enable and start the service:

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
sudo netstat -tlnp | grep :9000

# Check logs
sudo journalctl -u sasky -f
```

### Test the application:

Visit `http://sasky.podlomar.me` (or `https://sasky.podlomar.me` if SSL is configured) Your Sasky chess application should now be running! 🎉
