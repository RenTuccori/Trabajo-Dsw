import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';

// Mock del AuthProvider
const mockComprobarToken = vi.fn();

// Mock del contexto de autenticación
vi.mock('../context/global/AuthProvider', () => ({
  useAuth: () => ({
    comprobarToken: mockComprobarToken,
  }),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when provided', () => {
    const testContent = <div>Protected Content</div>;

    renderWithRouter(
      <ProtectedRoute requiredRole="Admin">{testContent}</ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should call comprobarToken with required role', () => {
    const testContent = <div>Test Content</div>;

    renderWithRouter(
      <ProtectedRoute requiredRole="Doctor">{testContent}</ProtectedRoute>
    );

    expect(mockComprobarToken).toHaveBeenCalledWith('Doctor');
  });

  it('should call comprobarToken with Patient role', () => {
    const testContent = <div>Patient Area</div>;

    renderWithRouter(
      <ProtectedRoute requiredRole="Patient">{testContent}</ProtectedRoute>
    );

    expect(mockComprobarToken).toHaveBeenCalledWith('Patient');
  });

  it('should render multiple children correctly', () => {
    renderWithRouter(
      <ProtectedRoute requiredRole="Admin">
        <h1>Title</h1>
        <p>Description</p>
        <button>Action</button>
      </ProtectedRoute>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
