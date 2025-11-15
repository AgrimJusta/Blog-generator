# Frontend Dockerfile (build static files)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS server
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
