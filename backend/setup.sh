#!/bin/bash

# Setup script for SortTea backend development environment

# Check if Poetry is installed
if ! command -v poetry &> /dev/null; then
    echo "Poetry is not installed. Please install Poetry first."
    echo "Visit https://python-poetry.org/docs/#installation for installation instructions."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
poetry install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please update the .env file with your actual configuration values."
fi

# Create logs directory
mkdir -p logs

# Create migrations for all apps
echo "Creating migrations for all apps..."
poetry run python manage.py makemigrations accounts
poetry run python manage.py makemigrations giveaway
poetry run python manage.py makemigrations instagram

# Run migrations
echo "Running migrations..."
poetry run python manage.py migrate

# Create superuser if needed
read -p "Do you want to create a superuser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    poetry run python manage.py createsuperuser
fi

echo "Setup complete! You can now run the development server with:"
echo "poetry run python manage.py runserver" 