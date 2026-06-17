import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';

// Mock of AuthProvider
const mockComprobarToken = vi.fn();

// Mock of authentication context
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
    mockComprobarToken.mockReturnValue(true);
  });

  it('should render children when the token is valid for the required role', async () => {
    const testContent = <div>Protected Content</div>;

    renderWithRouter(
      <ProtectedRoute requiredRole="Admin">{testContent}</ProtectedRoute>
    );

    expect(await screen.findByText('Protected Content')).toBeInTheDocument();
  });

  it('should call comprobarToken with required role', async () => {
    const testContent = <div>Test Content</div>;

    renderWithRouter(
      <ProtectedRoute requiredRole="Doctor">{testContent}</ProtectedRoute>
    );

    await screen.findByText('Test Content');
    expect(mockComprobarToken).toHaveBeenCalledWith('Doctor');
  });

  it('should call comprobarToken with Patient role', async () => {
    const testContent = <div>Patient Area</div>;

    renderWithRouter(
      <ProtectedRoute requiredRole="Patient">{testContent}</ProtectedRoute>
    );

    await screen.findByText('Patient Area');
    expect(mockComprobarToken).toHaveBeenCalledWith('Patient');
  });

  it('should render access denied when the token is not valid for the role', async () => {
    mockComprobarToken.mockReturnValue(false);

    renderWithRouter(
      <ProtectedRoute requiredRole="Admin">
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(await screen.findByText('Acceso Denegado')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render multiple children correctly', async () => {
    renderWithRouter(
      <ProtectedRoute requiredRole="Admin">
        <h1>Title</h1>
        <p>Description</p>
        <button>Action</button>
      </ProtectedRoute>
    );

    expect(await screen.findByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
