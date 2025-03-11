# CapRover Deployment Workflow

This GitHub Actions workflow automatically deploys the application to CapRover when a new GitHub Release is created, using the official [caprover/deploy-from-github](https://github.com/caprover/deploy-from-github) action.

## Setup Instructions

To use this workflow, you'll need to add the following secrets to your GitHub repository:

1. `CAPROVER_SERVER` - The URL of your CapRover server (e.g., `https://captain.your-domain.com`)
2. `CAPROVER_BACKEND_APP` - The name of your backend app in CapRover
3. `CAPROVER_BACKEND_TOKEN` - The app token for your backend app (generated in CapRover)
4. `CAPROVER_FRONTEND_APP` - The name of your frontend app in CapRover
5. `CAPROVER_FRONTEND_TOKEN` - The app token for your frontend app (generated in CapRover)
6. `DOPPLER_TOKEN_BACKEND` - Doppler service token for backend environment variables
7. `DOPPLER_TOKEN_FRONTEND` - Doppler service token for frontend environment variables

## Managing Environment Variables with Doppler

This workflow uses [Doppler](https://www.doppler.com/) to securely manage environment variables at both build-time and runtime. Doppler is a SecretOps platform that helps manage secrets and configuration across environments.

### Setting Up Doppler

1. Sign up for a Doppler account at [https://www.doppler.com/](https://www.doppler.com/)
2. Create a project for your application
3. Set up environments (e.g., dev, staging, production)
4. Add your environment variables to Doppler
5. Create service tokens for your applications:
   - Go to your Doppler project
   - Navigate to "Access" → "Service Tokens"
   - Create a token for your backend service
   - Create a token for your frontend service
6. Add these tokens as secrets in your GitHub repository:
   - `DOPPLER_TOKEN_BACKEND`
   - `DOPPLER_TOKEN_FRONTEND`

### How Environment Variables Work

The workflow handles environment variables in the following way:

1. **Build Phase**: Doppler tokens are passed as build arguments to Docker during image building
   ```yaml
   build-args: |
     DOPPLER_TOKEN=${{ secrets.DOPPLER_TOKEN_BACKEND }}
     DOPPLER_ENVIRONMENT=prd
   ```

2. **Runtime**: The Docker images have the Doppler CLI installed and are configured to use the tokens at startup
   ```dockerfile
   CMD ["doppler", "run", "--", "gunicorn", "--bind", "0.0.0.0:8000", "sorttea.wsgi:application"]
   ```

This approach provides several benefits:
- Centralized secrets management
- Environment-specific configurations
- Secrets available during both build and runtime
- Audit logs for secret access
- No need to store sensitive data in GitHub secrets or environment files
- Runtime configuration updates without redeployment

## Preparing Your Applications for Doppler

### Backend (Django) Setup

Our backend Dockerfile is configured to:
1. Accept `DOPPLER_TOKEN` and `DOPPLER_ENVIRONMENT` as build arguments
2. Install the Doppler CLI
3. Use Doppler during the build process (static file collection, etc.)
4. Use Doppler at runtime to fetch environment variables

```dockerfile
# Accept Doppler arguments
ARG DOPPLER_TOKEN
ARG DOPPLER_ENVIRONMENT=prod
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN
ENV DOPPLER_ENVIRONMENT=$DOPPLER_ENVIRONMENT

# Install Doppler CLI
RUN curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# Use Doppler in build commands
RUN doppler run -- python manage.py collectstatic --noinput

# Use Doppler at runtime
CMD ["doppler", "run", "--", "gunicorn", "--bind", "0.0.0.0:8000", "sorttea.wsgi:application"]
```

### Frontend (Next.js) Setup

Our frontend Dockerfile is configured to:
1. Accept `DOPPLER_TOKEN` and `DOPPLER_ENVIRONMENT` as build arguments
2. Install the Doppler CLI
3. Use Doppler during the build process (Next.js build)
4. Use Doppler at runtime to fetch environment variables

```dockerfile
# Accept Doppler arguments
ARG DOPPLER_TOKEN
ARG DOPPLER_ENVIRONMENT=prod
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN
ENV DOPPLER_ENVIRONMENT=$DOPPLER_ENVIRONMENT

# Install Doppler CLI
RUN curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh

# Use Doppler in build commands
RUN doppler run -- npm run build

# Use Doppler at runtime
CMD ["doppler", "run", "--", "npm", "start"]
```

## Local Development with Doppler

For local development, you can use Doppler to manage your environment variables:

1. Install the Doppler CLI locally:
   ```
   # macOS
   brew install dopplerhq/cli/doppler

   # Windows
   scoop bucket add doppler https://github.com/DopplerHQ/scoop-doppler.git
   scoop install doppler

   # Linux
   curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh
   ```

2. Log in to Doppler:
   ```
   doppler login
   ```

3. Set up your project:
   ```
   doppler setup
   ```

4. Run your applications with Doppler:
   ```
   # Backend
   cd backend
   doppler run -- python manage.py runserver

   # Frontend
   cd frontend
   doppler run -- npm run dev
   ```

## Testing Docker Builds Locally

To test your Docker builds locally with Doppler:

1. Build the Docker images with Doppler tokens:
   ```
   # Backend
   cd backend
   docker build -t sorttea-backend --build-arg DOPPLER_TOKEN=<your-backend-token> --build-arg DOPPLER_ENVIRONMENT=dev .

   # Frontend
   cd frontend
   docker build -t sorttea-frontend --build-arg DOPPLER_TOKEN=<your-frontend-token> --build-arg DOPPLER_ENVIRONMENT=dev .
   ```

2. Run the Docker containers with your Doppler token:
   ```
   # Backend
   docker run -p 8000:8000 sorttea-backend

   # Frontend
   docker run -p 3000:3000 sorttea-frontend
   ```

   Note: You don't need to pass the tokens again at runtime since they're already baked into the images during build.

## How to Generate App Tokens in CapRover

1. Log in to your CapRover dashboard
2. Navigate to the Apps section
3. Select your application
4. Go to "Deployment" tab
5. In the "Method 3: Deploy using GitHub Actions" section, copy the generated token

## Using caprover/deploy-from-github

This workflow uses the official [caprover/deploy-from-github](https://github.com/caprover/deploy-from-github) action to deploy the Docker images to your CapRover server. The action handles the deployment process, connecting to your CapRover server and deploying the pre-built Docker images.

```yaml
- name: Deploy to CapRover
  uses: caprover/deploy-from-github@v1.1.2
  with:
    server: '${{ secrets.CAPROVER_SERVER }}'
    app: '${{ secrets.CAPROVER_BACKEND_APP }}'
    token: '${{ secrets.CAPROVER_BACKEND_TOKEN }}'
    image: '${{ fromJSON(steps.meta.outputs.json).tags[0] }}'
```

## Deployment Process

The workflow will:

1. Build Docker images for both frontend and backend, using Doppler during the build
2. Push the images to GitHub Container Registry (GHCR)
3. Deploy the images to your CapRover server using the official caprover/deploy-from-github action

## Triggering a Deployment

To trigger a deployment, simply create a new Release in GitHub:

1. Go to the "Releases" section in your repository
2. Click "Draft a new release"
3. Create a new tag version (e.g., v1.0.0)
4. Add a title and description for your release
5. Click "Publish release"

The workflow will automatically trigger and deploy your application. 