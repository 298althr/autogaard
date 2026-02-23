# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# We need environment variables at build time for Next.js if they are prefixed with NEXT_PUBLIC_
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
# Copy config files if they exist (using wildcard to avoid failure if one is missing)
COPY --from=builder /app/next.config.* ./ 

EXPOSE 3000
# Next.js defaults to 3000, but we can override with PORT env var
ENV PORT 3000
CMD ["npm", "start"]
