import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/Navbar.jsx';

// Wrapper for React Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar Component', () => {
  it('should render the navbar with logo and title', () => {
    renderWithRouter(<Navbar />);

    // Verify that the title appears
    expect(screen.getByText(/Sanatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/UTN/i)).toBeInTheDocument();

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

    // Verify they have the correct classes base
    expect(doctorLink).toHaveClass('text-gray-500');
    expect(adminLink).toHaveClass('text-gray-500');
  });

  it('should have proper CSS classes for styling', () => {
    renderWithRouter(<Navbar />);

    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('sticky', 'top-0', 'z-50');

    const title1 = screen.getByText(/Sanatorio/i);
    expect(title1).toHaveClass('text-lg', 'font-extrabold', 'text-gray-900');
  });

  it('should render home link correctly', () => {
    renderWithRouter(<Navbar />);

    // Buscar el logo o su enlace asociado
    const homeLink = screen.getAllByRole('link')[0];
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
