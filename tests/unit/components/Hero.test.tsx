import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from '@/components/Hero';

// Mock the Icon component
vi.mock('@/components/ui', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid={`icon-${name}`} data-size={size}>
      {name}
    </div>
  ),
}));

describe('Hero', () => {
  describe('Component Structure', () => {
    it('should render the hero section with correct styling', () => {
      render(<Hero />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('w-full', 'py-12', 'md:py-24', 'lg:py-32', 'bg-background');
    });

    it('should render with proper container and grid layout', () => {
      render(<Hero />);
      
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('px-4', 'md:px-6');
      
      const grid = container?.querySelector('.grid');
      expect(grid).toHaveClass('gap-6', 'lg:grid-cols-[1fr_400px]', 'lg:gap-12', 'xl:grid-cols-[1fr_500px]');
    });
  });

  describe('Hero Content', () => {
    it('should render the main heading with correct text and styling', () => {
      render(<Hero />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('John Doe');
      expect(heading).toHaveClass(
        'text-3xl',
        'font-bold',
        'tracking-tighter',
        'sm:text-5xl',
        'xl:text-6xl/none'
      );
    });

    it('should render the subtitle with correct text and styling', () => {
      render(<Hero />);
      
      const subtitle = screen.getByText('Senior Software Engineer');
      expect(subtitle).toHaveClass('text-xl', 'text-muted-foreground');
    });

    it('should render the description paragraph', () => {
      render(<Hero />);
      
      const description = screen.getByText(/I build accessible, inclusive products/);
      expect(description).toBeInTheDocument();
      expect(description.closest('div')).toHaveClass(
        'max-w-[600px]',
        'text-muted-foreground',
        'md:text-xl'
      );
    });
  });

  describe('Call-to-Action Buttons', () => {
    it('should render Contact Me button with correct styling and attributes', () => {
      render(<Hero />);
      
      const contactButton = screen.getByRole('link', { name: 'Contact Me' });
      expect(contactButton).toHaveAttribute('href', '#contact');
      expect(contactButton).toHaveClass(
        'inline-flex',
        'h-10',
        'items-center',
        'justify-center',
        'rounded-md',
        'bg-primary',
        'px-8',
        'text-sm',
        'font-medium',
        'text-primary-foreground',
        'shadow',
        'transition-colors',
        'hover:bg-primary/90'
      );
    });

    it('should render View Projects button with correct styling and attributes', () => {
      render(<Hero />);
      
      const projectsButton = screen.getByRole('link', { name: 'View Projects' });
      expect(projectsButton).toHaveAttribute('href', '#projects');
      expect(projectsButton).toHaveClass(
        'inline-flex',
        'h-10',
        'items-center',
        'justify-center',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-8',
        'text-sm',
        'font-medium',
        'shadow-sm',
        'transition-colors',
        'hover:bg-accent',
        'hover:text-accent-foreground'
      );
    });

    it('should render buttons in responsive flex container', () => {
      render(<Hero />);
      
      const buttonContainer = screen.getByRole('link', { name: 'Contact Me' }).closest('.flex');
      expect(buttonContainer).toHaveClass(
        'flex',
        'flex-col',
        'gap-2',
        'min-[400px]:flex-row'
      );
    });
  });

  describe('Social Media Links', () => {
    it('should render GitHub link with icon and proper attributes', () => {
      render(<Hero />);
      
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('href', 'https://github.com');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(githubLink).toHaveClass(
        'text-muted-foreground',
        'hover:text-foreground',
        'transition-colors'
      );
      
      const githubIcon = screen.getByTestId('icon-github-logo');
      expect(githubIcon).toHaveAttribute('data-size', '20');
    });

    it('should render LinkedIn link with icon and proper attributes', () => {
      render(<Hero />);
      
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      const linkedinIcon = screen.getByTestId('icon-linkedin-logo');
      expect(linkedinIcon).toHaveAttribute('data-size', '20');
    });

    it('should render Twitter link with icon and proper attributes', () => {
      render(<Hero />);
      
      const twitterLink = screen.getByRole('link', { name: /twitter/i });
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
      expect(twitterLink).toHaveAttribute('target', '_blank');
      expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      const twitterIcon = screen.getByTestId('icon-twitter');
      expect(twitterIcon).toHaveAttribute('data-size', '20');
    });

    it('should render Email link with icon and proper attributes', () => {
      render(<Hero />);
      
      const emailLink = screen.getByRole('link', { name: /email/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
      // Email link should not have target="_blank"
      expect(emailLink).not.toHaveAttribute('target', '_blank');
      
      const emailIcon = screen.getByTestId('icon-mail');
      expect(emailIcon).toHaveAttribute('data-size', '20');
    });

    it('should render social links container with proper styling', () => {
      render(<Hero />);
      
      const socialContainer = screen.getByRole('link', { name: /github/i }).closest('.flex');
      expect(socialContainer).toHaveClass('flex', 'items-center', 'gap-4', 'mt-4');
    });
  });

  describe('Profile Image', () => {
    it('should render profile image with correct attributes', () => {
      render(<Hero />);
      
      const profileImage = screen.getByRole('img');
      expect(profileImage).toHaveAttribute('alt', 'John Doe, Software Engineer');
      expect(profileImage).toHaveAttribute('src');
      expect(profileImage.getAttribute('src')).toContain('unsplash.com');
      expect(profileImage).toHaveClass('object-cover', 'w-full', 'h-full');
    });

    it('should render image in properly styled container', () => {
      render(<Hero />);
      
      const imageContainer = screen.getByRole('img').closest('.relative');
      expect(imageContainer).toHaveClass(
        'relative',
        'h-[450px]',
        'w-[300px]',
        'overflow-hidden',
        'rounded-lg',
        'md:h-[550px]',
        'md:w-[400px]'
      );
    });

    it('should render image section with proper layout', () => {
      render(<Hero />);
      
      const imageSection = screen.getByRole('img').closest('.flex');
      expect(imageSection).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Hero />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });

    it('should have screen reader text for all social icons', () => {
      render(<Hero />);
      
      expect(screen.getByText('GitHub')).toHaveClass('sr-only');
      expect(screen.getByText('LinkedIn')).toHaveClass('sr-only');
      expect(screen.getByText('Twitter')).toHaveClass('sr-only');
      expect(screen.getByText('Email')).toHaveClass('sr-only');
    });

    it('should have descriptive alt text for profile image', () => {
      render(<Hero />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'John Doe, Software Engineer');
    });

    it('should have proper link text for navigation', () => {
      render(<Hero />);
      
      expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View Projects' })).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive typography classes', () => {
      render(<Hero />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl', 'sm:text-5xl', 'xl:text-6xl/none');
      
      const description = screen.getByText(/I build accessible, inclusive products/).closest('div');
      expect(description).toHaveClass('md:text-xl');
    });

    it('should apply responsive layout classes', () => {
      render(<Hero />);
      
      const section = document.querySelector('section');
      expect(section).toHaveClass('py-12', 'md:py-24', 'lg:py-32');
      
      const container = document.querySelector('.container');
      expect(container).toHaveClass('px-4', 'md:px-6');
    });

    it('should apply responsive grid classes', () => {
      render(<Hero />);
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass(
        'gap-6',
        'lg:grid-cols-[1fr_400px]',
        'lg:gap-12',
        'xl:grid-cols-[1fr_500px]'
      );
    });

    it('should apply responsive button layout', () => {
      render(<Hero />);
      
      const buttonContainer = screen.getByRole('link', { name: 'Contact Me' }).closest('.flex');
      expect(buttonContainer).toHaveClass('flex-col', 'min-[400px]:flex-row');
    });

    it('should apply responsive image sizing', () => {
      render(<Hero />);
      
      const imageContainer = screen.getByRole('img').closest('.relative');
      expect(imageContainer).toHaveClass(
        'h-[450px]',
        'w-[300px]',
        'md:h-[550px]',
        'md:w-[400px]'
      );
    });
  });

  describe('Icon Integration', () => {
    it('should render all social media icons with correct names and sizes', () => {
      render(<Hero />);
      
      const githubIcon = screen.getByTestId('icon-github-logo');
      const linkedinIcon = screen.getByTestId('icon-linkedin-logo');
      const twitterIcon = screen.getByTestId('icon-twitter');
      const mailIcon = screen.getByTestId('icon-mail');
      
      [githubIcon, linkedinIcon, twitterIcon, mailIcon].forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '20');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should use correct icon names from the sprite system', () => {
      render(<Hero />);
      
      expect(screen.getByTestId('icon-github-logo')).toHaveTextContent('github-logo');
      expect(screen.getByTestId('icon-linkedin-logo')).toHaveTextContent('linkedin-logo');
      expect(screen.getByTestId('icon-twitter')).toHaveTextContent('twitter');
      expect(screen.getByTestId('icon-mail')).toHaveTextContent('mail');
    });
  });

  describe('Content Structure', () => {
    it('should have proper content hierarchy and spacing', () => {
      render(<Hero />);
      
      const contentSection = screen.getByRole('heading', { level: 1 }).closest('.flex');
      expect(contentSection).toHaveClass('flex', 'flex-col', 'justify-center', 'space-y-4');
    });

    it('should group name and title together', () => {
      render(<Hero />);
      
      const nameContainer = screen.getByRole('heading', { level: 1 }).closest('.space-y-2');
      expect(nameContainer).toBeInTheDocument();
      expect(nameContainer).toContainElement(screen.getByText('John Doe'));
      expect(nameContainer).toContainElement(screen.getByText('Senior Software Engineer'));
    });

    it('should render all content sections in correct order', () => {
      render(<Hero />);
      
      const contentContainer = screen.getByRole('heading', { level: 1 }).closest('.space-y-4');
      
      // Check that all main sections are present
      expect(contentContainer).toContainElement(screen.getByText('John Doe'));
      expect(contentContainer).toContainElement(screen.getByText(/I build accessible, inclusive products/));
      expect(contentContainer).toContainElement(screen.getByRole('link', { name: 'Contact Me' }));
      expect(contentContainer).toContainElement(screen.getByRole('link', { name: /github/i }));
    });
  });
});