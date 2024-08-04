git pull origin dev 2>&1 || { echo "Git pull failed"; exit 1; }

npm install 2>&1 || { echo "npm install failed"; exit 1; }

npm run build 2>&1 || { echo "npm run build failed"; exit 1; }