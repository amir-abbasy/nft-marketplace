FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN apt update && apt install nano

RUN npm install --quiet

CMD [ "npm", "run", "dev" ]
