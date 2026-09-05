# syntax=docker/dockerfile:1

# Stage 1: Build application assets and bundle backend server
FROM node:22-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy full application source code
COPY . .

# Compile frontend SPA and build self-contained backend server.cjs bundle
RUN npm run build

# Stage 2: Production runtime image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app-data
ENV UPLOAD_DIR=/app-data/uploads
ENV DB_BACKUP_FILE=/app-data/archive-database.json

# Copy production package declarations and install runtime-only dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled production artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Create persistent storage directory mountpoint with appropriate permissions
RUN mkdir -p /app-data/uploads && chmod -R 777 /app-data

# Expose production listening port
EXPOSE 3000

# Healthcheck to verify the web service responds
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Start compiled CommonJS server bundle
CMD ["node", "dist/server.cjs"]
