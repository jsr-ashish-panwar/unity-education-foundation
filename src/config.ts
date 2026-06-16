// Configuration for the application

// The base API URL for the backend server
// In local development, defaults to localhost:5000; in production, routes relatively to Netlify Functions
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

// The password to access the Admin Panel
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'unityedu123';
