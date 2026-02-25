FROM node:20-alpine

<<<<<<< HEAD
# Use high-performance networking for build if needed (handled in docker-compose)
=======
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
WORKDIR /app

# Install dependencies
COPY package*.json ./
<<<<<<< HEAD
RUN npm install --omit=dev --legacy-peer-deps --no-audit --no-fund
=======
RUN npm install --omit=dev --legacy-peer-deps
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28

# Copy source
COPY . .

# Expose port
EXPOSE 4000

# Start application
CMD ["npm", "start"]
