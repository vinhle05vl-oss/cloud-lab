
# ============================================
# STAGE 1: Build React Application với Vite
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ============================================
# STAGE 2: Serve static files với Nginx
# ============================================
FROM nginx:alpine

# Copy kết quả build từ Stage 1 vào Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Copy file cấu hình Nginx (proxy /api/ đến Backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]