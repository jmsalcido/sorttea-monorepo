# SortTea Monorepo

This monorepo contains all the code for the SortTea application, which helps manage and verify Instagram giveaway entries.

## Project Structure

- **frontend/**: Next.js application with React 19 and Tailwind CSS
- **backend/**: Django REST API with PostgreSQL database
- **scripts/**: Helper scripts for development and deployment
- **docs/**: Project documentation

## Prerequisites

- Node.js (v18+)
- Python (3.10+)
- Poetry (for Python dependency management)
- Docker and Docker Compose (for local development)
- Git

## Getting Started

### Clone the Repository

```bash
git clone <your-repository-url>
cd sorttea-monorepo
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development database:
   ```bash
   docker-compose up -d
   ```

5. Run migrations:
   ```bash
   poetry run python manage.py migrate
   ```

6. Start the development server:
   ```bash
   poetry run python manage.py runserver
   ```

The backend API will be available at http://localhost:8000/

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

The frontend will be available at http://localhost:3000/

## Development Workflow

- Use feature branches for new features
- Submit pull requests for code reviews
- Run tests before submitting your code

## License

[Your License Here] 