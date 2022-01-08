FROM node:14-stretch
WORKDIR /app
COPY . ./
COPY package-lock.json ./
COPY package.json ./
RUN npm install --silent
RUN npm install react-scripts
COPY index.js ./node_modules/react-chat-widget/lib

CMD ["npm", "start"]