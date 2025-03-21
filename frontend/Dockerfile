FROM node:22-alpine AS base

# Accept Doppler arguments
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

# Set working directory
WORKDIR /app

# Install Doppler CLI
RUN apk add --no-cache curl gnupg
RUN curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Set environment variable to skip TypeScript checks
ENV NEXT_SKIP_TYPESCRIPT_CHECK=true

# Build the application with Doppler
RUN doppler run -- npm run build -- --no-lint

# Production image
FROM node:22-alpine AS production

# Accept Doppler arguments for production stage
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

WORKDIR /app

ENV NODE_ENV=production

# Install Doppler CLI in production image
RUN apk add --no-cache curl gnupg
RUN curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# Copy necessary files from build stage
COPY --from=base /app/package.json ./
COPY --from=base /app/package-lock.json ./
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port
EXPOSE 3000

# Start the application with Doppler
CMD ["doppler", "run", "--", "npm", "start"] 