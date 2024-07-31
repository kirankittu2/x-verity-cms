FROM node

WORKDIR /app

COPY package*.json ./

COPY ckeditor5 ./ckeditor5

RUN ls -la ./ckeditor5 # Debugging step to check if the folder is copied

RUN npm install

RUN ls -la ./node_modules # Debugging step to check if node_modules is populated

COPY . .

COPY update.sh /usr/local/bin/update.sh

RUN chmod +x /usr/local/bin/update.sh

RUN apt-get update && apt-get install -y \
    docker.io \
    curl \
    bash

RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
