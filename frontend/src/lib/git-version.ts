'use client';

// This version will be replaced during build time
// The actual version will be injected by the build process
export function getGitVersion(): string {
  // In development, we'll use a placeholder
  if (process.env.NODE_ENV === 'development') {
    return 'dev-local';
  }
  
  // In production, we'll use the version from the build-time constant
  // This will be replaced during build time
  return '__GIT_VERSION__';
} 