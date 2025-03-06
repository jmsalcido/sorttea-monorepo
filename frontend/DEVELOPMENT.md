# Frontend Development Guide

## Technology Stack

This project uses:

- **Next.js 15.x**: The React framework for production
- **React 18.x**: A JavaScript library for building user interfaces
- **TailwindCSS 4.x**: A utility-first CSS framework
- **TypeScript**: For type-safe JavaScript

## Development Setup

Refer to the root README.md file for instructions on setting up the development environment.

## UI Component Architecture

The project follows a component-based architecture:

- **Page Components**: Found in `src/pages`, define routes in the application
- **UI Components**: Reusable components like buttons, inputs, cards, etc.
- **Layout Components**: Define the structure of the application
- **Feature Components**: Implement specific features or business logic

## State Management

We use a combination of:

- **React Context**: For global state that needs to be accessed by many components
- **Zustand**: For more complex state management scenarios
- **React Query**: For server state management and data fetching

## Working with API

- API calls are made using the Fetch API or React Query
- The API URL is configured in the `.env.local` file

## Styling

- Tailwind CSS is used for styling components
- Custom styles should be avoided when possible
- Use Tailwind classes for responsive design

## Testing

- Write tests for components using React Testing Library
- Run tests with `npm test`

## Best Practices

- Follow the React 18 documentation for best practices
- Use functional components with hooks
- Use TypeScript types for props, state, and function parameters
- Keep components small and focused on a single responsibility 