# local staging environment
FROM node:21.1.0
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ../ ./
RUN apt update && apt install -y nginx
RUN npm install -g pnpm
RUN pnpm install

COPY ./nginx.conf /etc/nginx/sites-available/default

EXPOSE 80
CMD  service nginx start && pnpm run dev
