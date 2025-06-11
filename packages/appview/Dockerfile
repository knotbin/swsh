FROM node:20-slim

WORKDIR /app

# Install pnpm, Deno, and SQLite build dependencies
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate && \
    apt-get update && \
    apt-get install -y curl unzip python3 make g++ && \
    curl -fsSL https://deno.land/x/install/install.sh | sh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add Deno to PATH
ENV PATH="/root/.deno/bin:${PATH}"

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/appview/package.json ./packages/appview/
COPY packages/client/package.json ./packages/client/
COPY packages/lexicon/package.json ./packages/lexicon/

# Install dependencies and rebuild better-sqlite3
RUN pnpm install --frozen-lockfile && \
    cd packages/appview && \
    pnpm rebuild better-sqlite3

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose the port
EXPOSE 3001

# Start the service
CMD ["pnpm", "start:appview"] 