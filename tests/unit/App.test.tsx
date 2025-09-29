import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import App from '../../src/App';

// Helper function to render App with Router context
const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App Component', () => {
  it('should render the main heading', () => {
    renderWithRouter();
    
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter();
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should render theme toggle button', () => {
    renderWithRouter();
    
    const themeToggle = screen.getByLabelText('Toggle theme');
    expect(themeToggle).toBeInTheDocument();
  });
});