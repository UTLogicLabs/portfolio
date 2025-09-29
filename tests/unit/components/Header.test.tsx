import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/Header';

// Mock the Icon component
vi.mock('@/components/ui', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid={`icon-${name}`} data-size={size}>
      {name}
    </div>
  ),
}));

describe('Header', () => {
  describe('Component Structure', () => {
    it('should render the header with correct styling', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass(
        'sticky',
        'top-0',
        'z-50',
        'w-full',
        'bg-background/80',
        'backdrop-blur-sm',
        'border-b'
      );
    });

    it('should render with proper container and layout', () => {
      render(<Header />);
      
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('flex', 'h-16', 'items-center', 'justify-between');
    });
  });

  describe('Brand/Logo', () => {
    it('should render the brand logo with correct text and styling', () => {
      render(<Header />);
      
      const logo = screen.getByRole('link', { name: 'John.Dev' });
      expect(logo).toHaveAttribute('href', '#');
      expect(logo).toHaveClass('text-xl', 'font-bold');
      expect(logo).toHaveTextContent('John.Dev');
    });

    it('should render logo in proper container', () => {
      render(<Header />);
      
      const logoContainer = screen.getByRole('link', { name: 'John.Dev' }).closest('.flex');
      expect(logoContainer).toHaveClass('flex', 'items-center', 'gap-2');
    });
  });

  describe('Desktop Navigation', () => {
    it('should render all desktop navigation links', () => {
      render(<Header />);
      
      // Get all desktop nav links (they are hidden on mobile)
      const nav = document.querySelector('nav.hidden.md\\:flex');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('hidden', 'md:flex', 'items-center', 'gap-6');
      
      // Check all navigation links exist within desktop nav
      const navLinks = nav?.querySelectorAll('a');
      expect(navLinks).toHaveLength(5);
    });

    it('should render Home link with correct attributes', () => {
      render(<Header />);
      
      const nav = document.querySelector('nav.hidden.md\\:flex');
      const homeLink = nav?.querySelector('a[href="#"]');
      expect(homeLink).toHaveTextContent('Home');
      expect(homeLink).toHaveClass(
        'text-sm',
        'font-medium',
        'hover:text-primary/80',
        'transition-colors'
      );
    });

    it('should render Projects link with correct attributes', () => {
      render(<Header />);
      
      const nav = document.querySelector('nav.hidden.md\\:flex');
      const projectsLink = nav?.querySelector('a[href="#projects"]');
      expect(projectsLink).toHaveTextContent('Projects');
      expect(projectsLink).toHaveClass(
        'text-sm',
        'font-medium',
        'hover:text-primary/80',
        'transition-colors'
      );
    });

    it('should render LinkedIn link with correct attributes', () => {
      render(<Header />);
      
      const nav = document.querySelector('nav.hidden.md\\:flex');
      const linkedinLink = nav?.querySelector('a[href="#linkedin"]');
      expect(linkedinLink).toHaveTextContent('LinkedIn');
      expect(linkedinLink).toHaveClass(
        'text-sm',
        'font-medium',
        'hover:text-primary/80',
        'transition-colors'
      );
    });

    it('should render Blog link with correct attributes', () => {
      render(<Header />);
      
      const nav = document.querySelector('nav.hidden.md\\:flex');
      const blogLink = nav?.querySelector('a[href="#blog"]');
      expect(blogLink).toHaveTextContent('Blog');
      expect(blogLink).toHaveClass(
        'text-sm',
        'font-medium',
        'hover:text-primary/80',
        'transition-colors'
      );
    });

    it('should render Contact link with correct attributes', () => {
      render(<Header />);
      
      const nav = document.querySelector('nav.hidden.md\\:flex');
      const contactLink = nav?.querySelector('a[href="#contact"]');
      expect(contactLink).toHaveTextContent('Contact');
      expect(contactLink).toHaveClass(
        'text-sm',
        'font-medium',
        'hover:text-primary/80',
        'transition-colors'
      );
    });
  });

  describe('Mobile Menu Button', () => {
    it('should render mobile menu button with correct styling', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      expect(menuButton).toHaveClass('md:hidden', 'p-2', 'rounded-md', 'hover:bg-accent');
    });

    it('should display menu icon when menu is closed', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      expect(menuButton).toBeInTheDocument();
      
      const menuIcon = screen.getByTestId('icon-home');
      expect(menuIcon).toHaveAttribute('data-size', '20');
    });

    it('should toggle to close icon when menu is opened', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
      const closeIcon = screen.getByTestId('icon-chevron-down');
      expect(closeIcon).toHaveAttribute('data-size', '20');
    });

    it('should toggle back to menu icon when menu is closed again', () => {
      render(<Header />);
      
      const openButton = screen.getByLabelText('Open menu');
      fireEvent.click(openButton);
      
      const closeButton = screen.getByLabelText('Close menu');
      fireEvent.click(closeButton);
      
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    });
  });

  describe('Mobile Navigation Menu', () => {
    it('should not show mobile menu by default', () => {
      render(<Header />);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0');
      expect(mobileNav).not.toBeInTheDocument();
    });

    it('should show mobile menu when menu button is clicked', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0');
      expect(mobileNav).toBeInTheDocument();
      expect(mobileNav).toHaveClass(
        'md:hidden',
        'fixed',
        'inset-0',
        'top-16',
        'bg-background',
        'z-40'
      );
    });

    it('should render mobile navigation with correct styling', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      expect(mobileNav).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'h-full',
        'gap-8'
      );
    });

    it('should render all mobile navigation links', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      const mobileLinks = mobileNav?.querySelectorAll('a');
      expect(mobileLinks).toHaveLength(5);
      
      // Check each link has correct styling
      mobileLinks?.forEach(link => {
        expect(link).toHaveClass('text-lg', 'font-medium');
      });
    });

    it('should close mobile menu when a navigation link is clicked', () => {
      render(<Header />);
      
      // Open menu
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      // Click on Home link in mobile menu
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      const homeLink = mobileNav?.querySelector('a[href="#"]');
      expect(homeLink).toBeInTheDocument();
      
      fireEvent.click(homeLink!);
      
      // Menu should be closed
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('should close mobile menu when Projects link is clicked', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      const projectsLink = mobileNav?.querySelector('a[href="#projects"]');
      fireEvent.click(projectsLink!);
      
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
    });

    it('should close mobile menu when LinkedIn link is clicked', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      const linkedinLink = mobileNav?.querySelector('a[href="#linkedin"]');
      fireEvent.click(linkedinLink!);
      
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
    });

    it('should close mobile menu when Blog link is clicked', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      const blogLink = mobileNav?.querySelector('a[href="#blog"]');
      fireEvent.click(blogLink!);
      
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
    });

    it('should close mobile menu when Contact link is clicked', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      const contactLink = mobileNav?.querySelector('a[href="#contact"]');
      fireEvent.click(contactLink!);
      
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should hide desktop navigation on mobile', () => {
      render(<Header />);
      
      const desktopNav = document.querySelector('nav.hidden.md\\:flex');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    it('should hide mobile menu button on desktop', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      expect(menuButton).toHaveClass('md:hidden');
    });

    it('should position mobile menu correctly', () => {
      render(<Header />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileMenu = document.querySelector('.md\\:hidden.fixed.inset-0');
      expect(mobileMenu).toHaveClass('top-16'); // Below the header
    });
  });

  describe('Accessibility', () => {
    it('should have proper header role', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have accessible labels for menu button states', () => {
      render(<Header />);
      
      // Initially should have "Open menu" label
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
      
      // After clicking should have "Close menu" label
      fireEvent.click(screen.getByLabelText('Open menu'));
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    it('should have proper navigation landmarks', () => {
      render(<Header />);
      
      const navigations = screen.getAllByRole('navigation');
      expect(navigations.length).toBeGreaterThanOrEqual(1);
    });

    it('should have proper link accessibility', () => {
      render(<Header />);
      
      const logo = screen.getByRole('link', { name: 'John.Dev' });
      expect(logo).toBeInTheDocument();
      
      // Desktop navigation links should be accessible
      const desktopNav = document.querySelector('nav.hidden.md\\:flex');
      const links = desktopNav?.querySelectorAll('a');
      links?.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('State Management', () => {
    it('should manage menu open/close state correctly', () => {
      render(<Header />);
      
      // Initially closed
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
      
      // Open menu
      fireEvent.click(screen.getByLabelText('Open menu'));
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).toBeInTheDocument();
      
      // Close menu
      fireEvent.click(screen.getByLabelText('Close menu'));
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
    });

    it('should reset menu state when navigation links are clicked', () => {
      render(<Header />);
      
      // Open menu
      fireEvent.click(screen.getByLabelText('Open menu'));
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).toBeInTheDocument();
      
      // Click any navigation link
      const mobileNav = document.querySelector('.md\\:hidden.fixed.inset-0 nav');
      const anyLink = mobileNav?.querySelector('a');
      fireEvent.click(anyLink!);
      
      // Menu should be closed
      expect(document.querySelector('.md\\:hidden.fixed.inset-0')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });
  });

  describe('Icon Integration', () => {
    it('should render menu icon with correct props when closed', () => {
      render(<Header />);
      
      const menuIcon = screen.getByTestId('icon-home');
      expect(menuIcon).toHaveAttribute('data-size', '20');
      expect(menuIcon).toHaveTextContent('home');
    });

    it('should render close icon with correct props when opened', () => {
      render(<Header />);
      
      fireEvent.click(screen.getByLabelText('Open menu'));
      
      const closeIcon = screen.getByTestId('icon-chevron-down');
      expect(closeIcon).toHaveAttribute('data-size', '20');
      expect(closeIcon).toHaveTextContent('chevron-down');
    });

    it('should toggle between icons correctly', () => {
      render(<Header />);
      
      // Initially shows menu icon
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
      
      // Click to open - should show close icon
      fireEvent.click(screen.getByLabelText('Open menu'));
      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
      expect(screen.queryByTestId('icon-home')).not.toBeInTheDocument();
      
      // Click to close - should show menu icon again
      fireEvent.click(screen.getByLabelText('Close menu'));
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
      expect(screen.queryByTestId('icon-chevron-down')).not.toBeInTheDocument();
    });
  });

  describe('Layout and Positioning', () => {
    it('should be sticky positioned at top', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('should have correct backdrop blur and background', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-background/80', 'backdrop-blur-sm', 'border-b');
    });

    it('should maintain proper height', () => {
      render(<Header />);
      
      const container = document.querySelector('.container');
      expect(container).toHaveClass('h-16');
    });
  });
});