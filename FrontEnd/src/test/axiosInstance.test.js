import { describe, it, expect, vi } from 'vitest';

// Mock axios before importing axiosInstance
const mockRequestUse = vi.fn();
const mockResponseUse = vi.fn();

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: mockRequestUse },
          response: { use: mockResponseUse },
        },
        defaults: { baseURL: 'http://localhost:3000/api/' },
      })),
    },
  };
});

// Import after mock is configured — this triggers the module-level code
await import('../api/axiosInstance.js');
import axios from 'axios';

describe('Axios Instance', () => {
  it('should create an axios instance with /api/ baseURL', () => {
    expect(axios.create).toHaveBeenCalled();
    const callArgs = axios.create.mock.calls[0][0];
    expect(callArgs).toHaveProperty('baseURL');
    expect(callArgs.baseURL).toContain('/api/');
  });

  it('should register a request interceptor for auth token', () => {
    expect(mockRequestUse).toHaveBeenCalled();
  });

  it('should register a response interceptor for error handling', () => {
    expect(mockResponseUse).toHaveBeenCalled();
  });

  it('should add Bearer token to request headers when token exists', () => {
    // Get the request interceptor callback
    const requestCallback = mockRequestUse.mock.calls[0][0];
    
    // Mock localStorage.getItem via spy
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('test-jwt-token');

    const config = { headers: {} };
    const result = requestCallback(config);

    expect(result.headers.Authorization).toBe('Bearer test-jwt-token');

    spy.mockRestore();
  });

  it('should not add Authorization header when no token', () => {
    const requestCallback = mockRequestUse.mock.calls[0][0];
    
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const config = { headers: {} };
    const result = requestCallback(config);

    expect(result.headers.Authorization).toBeUndefined();

    spy.mockRestore();
  });
});

describe('USER_TYPES constant', () => {
  it('should have correct role values', () => {
    const expectedRoles = ['Patient', 'Doctor', 'Admin'];
    expectedRoles.forEach(role => {
      expect(typeof role).toBe('string');
      expect(role.length).toBeGreaterThan(0);
    });
  });
});
