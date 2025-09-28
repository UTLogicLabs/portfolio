import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from '@/components/ui/Icon';

describe('Icon Component', () => {
  it('should render with correct name', () => {
    render(<Icon name="sun" data-testid="icon" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon.querySelector('use')).toHaveAttribute('href', '/icons/sprite.svg#sun');
  });

  it('should apply custom size', () => {
    render(<Icon name="moon" size={32} data-testid="icon" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('should apply custom className', () => {
    render(<Icon name="github-logo" className="text-blue-500" data-testid="icon" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('text-blue-500');
    expect(icon).toHaveClass('inline-block');
  });

  it('should pass through additional props', () => {
    render(<Icon name="mail" aria-label="Email icon" data-testid="icon" />);
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-label', 'Email icon');
  });
});