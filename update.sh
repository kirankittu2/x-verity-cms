#!/bin/bash

# Pull the latest code from the repository
git pull origin main

# Install any new dependencies
npm install

# # Restart the application (assuming you use PM2)
pm2 restart all

echo "Application updated successfully"
