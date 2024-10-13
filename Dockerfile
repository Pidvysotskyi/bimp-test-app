FROM node:22.9-alpine

WORKDIR /app

COPY . /app

RUN npm cache clean --force && npm install

RUN npx tsc -p ./tsconfig.json

CMD ["node",  "./dist/index.js"]