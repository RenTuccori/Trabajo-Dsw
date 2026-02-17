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
    expect(screen.getByText('Sanatorio UTN')).toBeInTheDocument();

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

    // Verify they have the correct classes
    expect(doctorLink).toHaveClass('text-blue-800', 'hover:text-blue-600');
    expect(adminLink).toHaveClass('text-blue-800', 'hover:text-blue-600');
  });

  it('should have proper CSS classes for styling', () => {
    renderWithRouter(<Navbar />);

    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('py-4');

    const title = screen.getByText('Sanatorio UTN');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-blue-800');
  });

  it('should render home link correctly', () => {
    renderWithRouter(<Navbar />);

    const homeLink = screen.getByRole('link', { name: /logo sanatorio utn/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
