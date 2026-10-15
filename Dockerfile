# Stage 1: Build
FROM node:22.14.0 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@11.5.2
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional, can skip if default is fine)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
