FROM node:22.13 as dev
WORKDIR /app/auth
COPY ./AuthWinterService .
COPY ./AuthWinterService/.env .env
ENV PORT 4000
RUN npm install
RUN npm i bcrypt
EXPOSE 4000
CMD [ "npm", "run", "start" ]