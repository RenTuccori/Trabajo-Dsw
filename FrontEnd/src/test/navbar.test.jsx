import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/navbar.jsx';

// Wrapper for React Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar Component', () => {
  it('should render the navbar with logo and title', () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText('Sanatorio')).toBeInTheDocument();
    expect(screen.getByText('UTN')).toBeInTheDocument();

    // Verify that the logo appears
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('logo.png'));
  });

  it('should have navigation links to doctor and admin sections', () => {
    renderWithRouter(<Navbar />);

    // Verify navigation links by attributes
    const links = screen.getAllByRole('link');

    // Find link to /doctor
    const doctorLink = links.find(
      (link) => link.getAttribute('href') === '/doctor'
    );
    expect(doctorLink).toBeInTheDocument();

    // Find link to /admin
    const adminLink = links.find(
      (link) => link.getAttribute('href') === '/admin'
    );
    expect(adminLink).toBeInTheDocument();

    expect(doctorLink).toHaveAccessibleName('Médicos');
    expect(adminLink).toHaveAccessibleName('Admin');
  });

  it('should have proper CSS classes for styling', () => {
    renderWithRouter(<Navbar />);

    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pacientes' })).toHaveAttribute(
      'href',
      '/patient'
    );
  });

  it('should render home link correctly', () => {
    renderWithRouter(<Navbar />);

    const homeLink = screen.getByRole('link', { name: /logo sanatorioutn/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
