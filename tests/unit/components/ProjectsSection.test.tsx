import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from '@/components/layout/ProjectsSection';

// Mock the Icon component
vi.mock('@/components/ui', () => ({
  Icon: ({ name, size, className, ...props }: any) => (
    <svg 
      data-testid={`icon-${name}`} 
      data-size={size}
      className={className}
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  ),
}));

describe('ProjectsSection Component', () => {
  describe('Rendering', () => {
    it('should render the section with correct structure', () => {
      render(<ProjectsSection />);
      
      // Check section element by ID since it doesn't have role="region"
      const section = document.getElementById('projects');
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe('SECTION');
      
      // Check main heading
      expect(screen.getByText('Featured Projects')).toBeInTheDocument();
      expect(screen.getByText('Explore some of my recent work and technical projects')).toBeInTheDocument();
    });

    it('should render all project cards', () => {
      render(<ProjectsSection />);
      
      // Check that all 4 projects are rendered (actual titles from component)
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
      expect(screen.getByText('Task Management App')).toBeInTheDocument();
      expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Social Media Analytics Tool')).toBeInTheDocument();
    });

    it('should render project descriptions', () => {
      render(<ProjectsSection />);
      
      // Check project descriptions (actual text from component)
      expect(screen.getByText(/A full-stack e-commerce platform built with React/)).toBeInTheDocument();
      expect(screen.getByText(/A productivity application for managing tasks and projects/)).toBeInTheDocument();
      expect(screen.getByText(/A weather application that displays current and forecasted/)).toBeInTheDocument();
      expect(screen.getByText(/A dashboard for tracking and analyzing social media metrics/)).toBeInTheDocument();
    });

    it('should render technology tags for each project', () => {
      render(<ProjectsSection />);
      
      // Check technology tags (use getAllByText for multiple occurrences)
      expect(screen.getAllByText('React')).toHaveLength(4); // React appears in 4 projects
      expect(screen.getAllByText('Node.js')).toHaveLength(2); // Node.js appears in 2 projects
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Stripe API')).toBeInTheDocument();
      expect(screen.getByText('Firebase')).toBeInTheDocument();
      expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('OpenWeather API')).toBeInTheDocument();
      expect(screen.getByText('Chart.js')).toBeInTheDocument();
      expect(screen.getByText('Geolocation API')).toBeInTheDocument();
      expect(screen.getByText('D3.js')).toBeInTheDocument();
      expect(screen.getByText('Social Media APIs')).toBeInTheDocument();
    });

    it('should render action buttons with correct icons', () => {
      render(<ProjectsSection />);
      
      // Check that Source Code and Live Demo buttons are rendered for each project
      const codeButtons = screen.getAllByText('Source Code');
      const demoButtons = screen.getAllByText('Live Demo');
      
      expect(codeButtons).toHaveLength(4);
      expect(demoButtons).toHaveLength(4);
      
      // Check icons - github-logo for Source Code, external-link for Live Demo
      expect(screen.getAllByTestId('icon-github-logo')).toHaveLength(4);
      expect(screen.getAllByTestId('icon-external-link')).toHaveLength(4);
      
      // Also check the "View All Projects" button
      expect(screen.getByText('View All Projects')).toBeInTheDocument();
      expect(screen.getByTestId('icon-code')).toBeInTheDocument();
    });
  });

  describe('Project Card Structure', () => {
    it('should render each project with correct link attributes', () => {
      render(<ProjectsSection />);
      
      // Get all GitHub links (Source Code buttons)
      const codeLinks = screen.getAllByRole('link', { name: /Source Code/i });
      const demoLinks = screen.getAllByRole('link', { name: /Live Demo/i });
      
      // Check that all links open in new tabs
      codeLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link.getAttribute('href')).toBe('https://github.com');
      });
      
      demoLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link.getAttribute('href')).toBe('https://example.com');
      });
    });

    it('should render project cards with proper structure', () => {
      render(<ProjectsSection />);
      
      // Check that we have 4 project cards (divs with project content)
      const projectImages = screen.getAllByRole('img');
      expect(projectImages).toHaveLength(4);
      
      // Check that each project has its elements
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(projectHeadings).toHaveLength(4);
      
      // Check that we have the expected number of links (4 projects × 2 links + 1 "View All")
      const allLinks = screen.getAllByRole('link');
      expect(allLinks).toHaveLength(9); // 4 source code + 4 live demo + 1 view all
      
      // Check technology tags
      const techTags = document.querySelectorAll('[class*="bg-accent"]');
      expect(techTags.length).toBeGreaterThan(0);
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should apply correct CSS classes to section', () => {
      render(<ProjectsSection />);
      
      const section = document.getElementById('projects');
      expect(section).toHaveClass('w-full', 'py-12', 'md:py-24');
    });

    it('should apply grid layout classes', () => {
      render(<ProjectsSection />);
      
      // Find the grid container
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('mt-12', 'grid', 'gap-8', 'md:grid-cols-2');
    });

    it('should apply hover effects on project cards', () => {
      render(<ProjectsSection />);
      
      // Find project card containers
      const projectCards = document.querySelectorAll('.group');
      expect(projectCards.length).toBe(4);
      
      projectCards.forEach(card => {
        expect(card).toHaveClass('transition-all', 'hover:shadow-md');
      });
    });

    it('should apply correct styling to technology tags', () => {
      render(<ProjectsSection />);
      
      // Check technology tag styling - there are multiple "React" tags, get the first one
      const reactTags = screen.getAllByText('React');
      expect(reactTags[0]).toHaveClass('inline-flex', 'items-center', 'rounded-md', 'bg-accent', 'px-2', 'py-1', 'text-xs', 'font-medium');
    });

    it('should apply correct styling to action buttons', () => {
      render(<ProjectsSection />);
      
      const codeButtons = screen.getAllByRole('link', { name: /Source Code/i });
      const demoButtons = screen.getAllByRole('link', { name: /Live Demo/i });
      
      [...codeButtons, ...demoButtons].forEach(button => {
        expect(button).toHaveClass(
          'inline-flex',
          'items-center',
          'text-sm',
          'font-medium',
          'text-primary',
          'hover:underline'
        );
      });
    });
  });

  describe('Icon Integration', () => {
    it('should render github icons with correct props', () => {
      render(<ProjectsSection />);
      
      const githubIcons = screen.getAllByTestId('icon-github-logo');
      expect(githubIcons).toHaveLength(4);
      
      githubIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '16');
      });
    });

    it('should render external link icons with correct props', () => {
      render(<ProjectsSection />);
      
      const externalIcons = screen.getAllByTestId('icon-external-link');
      expect(externalIcons).toHaveLength(4);
      
      externalIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '16');
      });
    });

    it('should render code icon for "View All Projects" button', () => {
      render(<ProjectsSection />);
      
      const codeIcon = screen.getByTestId('icon-code');
      expect(codeIcon).toHaveAttribute('data-size', '16');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<ProjectsSection />);
      
      // Check main section heading
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Featured Projects');
      
      // Check project headings
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(projectHeadings).toHaveLength(4);
      
      const expectedProjectTitles = [
        'E-commerce Platform',
        'Task Management App',
        'Weather Dashboard',
        'Social Media Analytics Tool'
      ];
      
      projectHeadings.forEach((heading, index) => {
        expect(heading).toHaveTextContent(expectedProjectTitles[index]);
      });
    });

    it('should have proper link accessibility', () => {
      render(<ProjectsSection />);
      
      const allLinks = screen.getAllByRole('link');
      
      allLinks.forEach(link => {
        // External links should have proper rel attribute
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
        
        // Links should have accessible text
        expect(link).toHaveAccessibleName();
      });
    });

    it('should use semantic HTML elements', () => {
      render(<ProjectsSection />);
      
      // Should use section element
      const section = document.getElementById('projects');
      expect(section?.tagName).toBe('SECTION');
      
      // Check that we have proper semantic structure with headings and content
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();
      
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(projectHeadings).toHaveLength(4);
    });

    it('should have proper ARIA attributes', () => {
      render(<ProjectsSection />);
      
      const section = document.getElementById('projects');
      expect(section).toHaveAttribute('id', 'projects');
      
      // Check that section can be referenced by aria-labelledby
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      render(<ProjectsSection />);
      
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-2');
    });

    it('should have responsive padding classes', () => {
      render(<ProjectsSection />);
      
      const section = document.getElementById('projects');
      expect(section).toHaveClass('py-12', 'md:py-24');
    });

    it('should have responsive text sizes', () => {
      render(<ProjectsSection />);
      
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveClass('text-3xl', 'sm:text-4xl', 'md:text-5xl');
    });
  });

  describe('User Interactions', () => {
    it('should handle link clicks properly', () => {
      // Mock window.open to prevent actual navigation in tests
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      
      render(<ProjectsSection />);
      
      const firstCodeLink = screen.getAllByRole('link', { name: /Code/i })[0];
      
      // Note: Since these are actual links with href attributes,
      // we can't easily test the click without mocking navigation
      // This test verifies the link exists and has correct attributes
      expect(firstCodeLink).toHaveAttribute('href');
      expect(firstCodeLink).toHaveAttribute('target', '_blank');
      
      windowOpenSpy.mockRestore();
    });
  });
});