# SortTea Instagram Giveaway Backend

A Django-based backend service for managing and verifying giveaway entries through Instagram interactions.

## Features

- Instagram API integration
- Configurable verification rules for giveaway entries
- Secure entry submission and validation
- Winner selection functionality
- Comprehensive audit logging
- RESTful API with OpenAPI documentation

## Technical Stack

- Python 3.10+
- Django + Django REST Framework
- Poetry for dependency management
- SQLite (development) / PostgreSQL (production)
- RESTful API with Swagger documentation

## Setup

### Prerequisites

- Python 3.10 or higher
- Poetry
- PostgreSQL (for production)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sorttea-backend
   ```

2. Install dependencies using Poetry:
   ```
   poetry install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///db.sqlite3
   INSTAGRAM_CLIENT_ID=your-instagram-client-id
   INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
   ```

4. Apply migrations:
   ```
   poetry run python manage.py migrate
   ```

5. Create a superuser:
   ```
   poetry run python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   poetry run python manage.py runserver
   ```

## API Documentation

API documentation is available at `/swagger/` when the server is running.

## Testing

Run tests with:

```
poetry run pytest
```

## License

[Insert License information here] 