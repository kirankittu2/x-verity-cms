#!/bin/bash

# Navigate to your project directory
cd /x-verity-cms

# Pull the latest changes from GitHub
git pull origin main

# Install dependencies
npm install

# Build the project (if your project requires building, e.g., for a React app)
npm run build

# Restart the server (assuming you use a process manager like PM2)
npm run start
