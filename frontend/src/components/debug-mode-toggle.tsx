'use client';

import { useState, useEffect } from 'react';
import { setDebugMode, isDebugMode } from '@/lib/debug-mode';

export function DebugModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isDebugMode());
  }, []);

  const toggleDebugMode = () => {
    const newState = !enabled;
    setEnabled(newState);
    setDebugMode(newState);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleDebugMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm">Debug Mode</span>
    </div>
  );
} 