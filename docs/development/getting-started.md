# Development Guide: Getting Started

This guide will help you set up your development environment and understand the workflow for contributing to the SortTea project.

## Development Environment Setup

The easiest way to set up your development environment is to use the provided setup script:

```bash
./scripts/setup.sh
```

This script will:
1. Check that all prerequisites are installed
2. Set up environment files
3. Install dependencies
4. Start required services
5. Initialize the database

## Manual Setup

If you prefer to set up manually, follow these steps:

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment using Poetry:
   ```bash
   poetry install
   poetry shell
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the database and other services:
   ```bash
   docker-compose up -d
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Git Workflow

We follow a feature branch workflow:

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with descriptive messages:
   ```bash
   git add .
   git commit -m "Add feature X that does Y"
   ```

3. Push your branch to the remote repository:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create a pull request for code review

### Code Style

- Backend: We follow PEP 8 and use Black for code formatting
- Frontend: We follow the Next.js and React best practices

### Testing

- Backend: Write tests using pytest
- Frontend: Write tests using React Testing Library

### Running Tests

Backend:
```bash
cd backend
poetry run pytest
```

Frontend:
```bash
cd frontend
npm test
```

## Common Tasks

### Adding Backend Dependencies

```bash
cd backend
poetry add package-name
```

### Adding Frontend Dependencies

```bash
cd frontend
npm install package-name
```

### Database Migrations

```bash
cd backend
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```

### Linting

Backend:
```bash
cd backend
poetry run flake8
poetry run black .
poetry run isort .
```

Frontend:
```bash
cd frontend
npm run lint
``` 