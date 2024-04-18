FROM node:16.20.2-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN node -v
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4201
CMD ["npm", "start"]