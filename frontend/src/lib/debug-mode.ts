'use client';

export function isDebugMode(): boolean {
  // Always return false on server
  if (typeof window === 'undefined') return false;
  
  // On client, check the cookie
  return document.cookie.split(';').some((item) => item.trim().startsWith('debug_mode=true'));
}

export function setDebugMode(enabled: boolean) {
  // Only run on client
  if (typeof window === 'undefined') return;
  
  if (enabled) {
    document.cookie = `debug_mode=true; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
  } else {
    document.cookie = 'debug_mode=; path=/; max-age=0';
  }
} 