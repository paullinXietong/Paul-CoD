# syntax=docker/dockerfile:1
FROM node:22.13-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY src ./src
COPY migrations ./migrations
ENV NODE_ENV=production PORT=8788
RUN addgroup -S nodejs && adduser -S appuser -G nodejs && chown -R appuser:nodejs /app
USER appuser
EXPOSE 8788
CMD ["node", "src/server.js"]
