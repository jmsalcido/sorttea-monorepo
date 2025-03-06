#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up SortTea development environment...${NC}"

# Check for required tools
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check for Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git not found. Please install Git and try again.${NC}"
    exit 1
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Please install Docker and try again.${NC}"
    exit 1
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose not found. Please install Docker Compose and try again.${NC}"
    exit 1
fi

# Check for Poetry
if ! command -v poetry &> /dev/null; then
    echo -e "${RED}Poetry not found. Please install Poetry and try again.${NC}"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Please install Node.js and try again.${NC}"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not found. Please install npm and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}All prerequisites are installed.${NC}"

# Setting up backend
echo -e "${YELLOW}Setting up backend...${NC}"
cd "$(dirname "$0")/../backend" || exit 1

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env file. Please edit it with your configuration.${NC}"
else
    echo -e "${GREEN}.env file already exists.${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
poetry install

# Start Docker services
echo -e "${YELLOW}Starting database and other services...${NC}"
docker-compose up -d

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
poetry run python manage.py migrate

echo -e "${GREEN}Backend setup complete.${NC}"

# Setting up frontend
echo -e "${YELLOW}Setting up frontend...${NC}"
cd "$(dirname "$0")/../frontend" || exit 1

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file from example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}Created .env.local file. Please edit it with your configuration.${NC}"
else
    echo -e "${GREEN}.env.local file already exists.${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
echo -e "${YELLOW}Note: Using --legacy-peer-deps to handle React 19 compatibility issues${NC}"
npm install --legacy-peer-deps

echo -e "${GREEN}Frontend setup complete.${NC}"

# Final message
echo -e "${GREEN}SortTea development environment setup complete!${NC}"
echo -e "${YELLOW}To start the backend:${NC}"
echo -e "cd backend && poetry run python manage.py runserver"
echo -e "${YELLOW}To start the frontend:${NC}"
echo -e "cd frontend && npm run dev"
