FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace manifests first for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ packages/
COPY apps/web-antd/package.json apps/web-antd/
COPY scripts/ scripts/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy full source
COPY . .

# Build only the web-antd app
RUN pnpm run build --filter=@vben/web-antd

# Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/apps/web-antd/dist /usr/share/nginx/html

# SPA fallback — all routes serve index.html
RUN printf 'server {\n\
  listen 3000;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
