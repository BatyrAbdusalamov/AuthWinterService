FROM node:22 as dev
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
CMD [ "npm", "run", "start" ]