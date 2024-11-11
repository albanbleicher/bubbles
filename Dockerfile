# Build stage
FROM node:18-alpine AS builder
RUN npm i -g pnpm

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN pnpm i 
COPY . .
RUN rm -rf .parcel-cache
RUN pnpm build
# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]