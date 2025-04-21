FROM node:22-alpine AS base

# Accept Doppler arguments
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

# Set working directory
WORKDIR /app

# Install Doppler CLI
RUN apk add --no-cache curl gnupg
RUN curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files and configs
COPY . .

# Set environment variable to skip TypeScript checks
ENV NEXT_SKIP_TYPESCRIPT_CHECK=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application with Doppler
RUN doppler run -- npm run build -- --no-lint

# Production image
FROM node:22-alpine AS production

# Accept Doppler arguments for production stage
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install Doppler CLI in production image
RUN apk add --no-cache curl gnupg
RUN curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# Copy necessary files from build stage
COPY --from=base /app/package.json ./
COPY --from=base /app/package-lock.json ./
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/src ./src
COPY --from=base /app/postcss.config.mjs ./
COPY --from=base /app/tailwind.config.js ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port
EXPOSE 3000

# Start the application with Doppler
CMD ["doppler", "run", "--", "npm", "start"] 