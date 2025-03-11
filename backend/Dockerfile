FROM python:3.10-slim

# Accept Doppler arguments
ARG DOPPLER_TOKEN
ARG DOPPLER_ENVIRONMENT=prod
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN
ENV DOPPLER_ENVIRONMENT=$DOPPLER_ENVIRONMENT

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.6.1
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_CACHE_DIR=/opt/.cache

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Doppler CLI
RUN curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# Install Poetry
RUN python3 -m venv $POETRY_VENV \
    && $POETRY_VENV/bin/pip install -U pip setuptools \
    && $POETRY_VENV/bin/pip install poetry==${POETRY_VERSION}

# Add Poetry to PATH
ENV PATH="${POETRY_VENV}/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy poetry configuration files
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not use a virtual environment
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi --no-root

# Copy project
COPY . .

# Create logs directory
RUN mkdir -p logs

# Run migrations and collect static files with Doppler
RUN doppler run -- python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run gunicorn with Doppler
CMD ["doppler", "run", "--", "gunicorn", "--bind", "0.0.0.0:8000", "sorttea.wsgi:application"] 