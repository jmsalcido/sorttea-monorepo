# SortTea Frontend

SortTea is a giveaway verification platform integrated with Instagram. This frontend application provides a seamless experience for users to create, manage, and verify giveaway campaigns.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A backend API server (see Backend Setup below)

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Copy `.env.local.example` to `.env.local` and update the values:
   ```bash
   cp .env.local.example .env.local
   ```
5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Connecting to the Backend

The frontend and backend communicate through REST API calls. Here's how it works:

### 1. Environment Configuration

Make sure your `.env.local` file contains the correct backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Change this to match your backend server's address. The frontend will use this URL as the base for all API requests.

### 2. Authentication Flow

The application uses NextAuth.js for authentication:

1. Users sign in using OAuth providers (Google, Facebook)
2. NextAuth exchanges the provider token for a JWT
3. The JWT is stored in a secure HTTP-only cookie
4. API requests automatically include the token
5. The backend validates the token for each request

### 3. API Services

API requests are structured through service classes:

- `ApiClient` - Base client that handles auth headers and error handling
- `GiveawayService` - Methods for giveaway CRUD operations
- `AnalyticsService` - Methods for fetching analytics data
- `UserService` - Methods for user profile and management

### 4. Data Fetching with React Query

The application uses TanStack Query (React Query) for data fetching:

1. Custom hooks in the `hooks` directory encapsulate API calls
2. Components use these hooks to fetch, cache, and synchronize server state
3. Mutations handle data updates with automatic invalidation
4. Loading and error states are managed automatically

Example:
```jsx
// Using the useGiveaways hook
const { data, isLoading, isError } = useGiveaways();

// Data is automatically cached and refreshed when needed
```

## Backend Setup

To run the frontend with a functioning backend:

1. Set up the SortTea API server
2. Configure OAuth credentials for NextAuth
3. Update connection details in `.env.local`

### Expected API Endpoints

The frontend expects these API endpoints to be available:

- `/api/giveaways` - Giveaway management
- `/api/analytics` - Analytics and reporting
- `/api/users` - User profile management

Refer to the API documentation for detailed endpoint specifications.

## Authentication Configuration

To set up authentication:

1. Create OAuth applications in Google and Facebook developer consoles
2. Add the credentials to your `.env.local` file
3. Configure the callback URLs in your OAuth provider settings

## Features

- Single sign-on with OAuth 2.0
- Giveaway creation and management
- Entry verification system
- Analytics and insights
- Role-based access control
- Light/dark mode support

## Development

### Folder Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and helpers
- `/services` - API service classes
- `/stores` - State management
- `/types` - TypeScript type definitions

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running Tests

```bash
npm test
# or
yarn test
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
