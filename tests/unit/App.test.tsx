import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../src/App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    
    // The router should render and we should see the homepage content
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
  });

  it('should render navigation elements', () => {
    render(<App />);
    
    expect(screen.getByText('Joshua Dix')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should render theme toggle button', () => {
    render(<App />);
    
    const themeToggle = screen.getByLabelText('Toggle theme');
    expect(themeToggle).toBeInTheDocument();
  });
});