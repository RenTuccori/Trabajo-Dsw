import '@testing-library/jest-dom';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    VITE_APP_NAME: 'Sistema de Turnos Médicos',
  },
  writable: true,
});
