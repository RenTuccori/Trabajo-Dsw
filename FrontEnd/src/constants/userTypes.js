/**
 * User role constants used across the application.
 * These values must match the roles assigned in JWT tokens by the backend.
 */
export const USER_TYPES = Object.freeze({
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  ADMIN: 'Admin',
});
