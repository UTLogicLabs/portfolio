import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LinkedInFeed } from '@/components/LinkedInFeed';

// Mock the Icon component
vi.mock('@/components/ui', () => ({
  Icon: ({ name, size, className }: { name: string; size: number; className?: string }) => (
    <div data-testid={`icon-${name}`} data-size={size} className={className}>
      {name}
    </div>
  ),
}));

describe('LinkedInFeed', () => {
  describe('Component Structure', () => {
    it('should render the section with correct id and styling', () => {
      render(<LinkedInFeed />);
      
      const section = document.getElementById('linkedin');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('w-full', 'py-12', 'md:py-24', 'bg-accent');
    });

    it('should render the main heading and description', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('LinkedIn Activity');
      expect(screen.getByText('Check out my recent posts and updates on LinkedIn')).toBeInTheDocument();
    });

    it('should render all three LinkedIn posts', () => {
      render(<LinkedInFeed />);
      
      // Check for all three posts by looking for author names
      const authorElements = screen.getAllByText('John Doe');
      expect(authorElements).toHaveLength(3);
      
      // Check for role text
      const roleElements = screen.getAllByText('Senior Software Engineer');
      expect(roleElements).toHaveLength(3);
    });
  });

  describe('Post Content', () => {
    it('should display correct post content for first post', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByText(/Excited to share that I've just launched a new open-source library/)).toBeInTheDocument();
      expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
    });

    it('should display correct post content for second post', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByText(/Just published my latest blog post on 'Optimizing React Performance'/)).toBeInTheDocument();
      expect(screen.getByText(/1 week ago/)).toBeInTheDocument();
    });

    it('should display correct post content for third post', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByText(/Thrilled to announce that I'll be speaking at the upcoming React Conference/)).toBeInTheDocument();
      expect(screen.getByText(/2 weeks ago/)).toBeInTheDocument();
    });

    it('should render author avatars with correct attributes', () => {
      render(<LinkedInFeed />);
      
      const avatars = screen.getAllByAltText('John Doe');
      expect(avatars).toHaveLength(3);
      
      avatars.forEach(avatar => {
        expect(avatar).toHaveAttribute('src');
        expect(avatar.getAttribute('src')).toContain('unsplash.com');
        expect(avatar).toHaveClass('object-cover', 'w-full', 'h-full');
      });
    });
  });

  describe('Social Engagement Metrics', () => {
    it('should display likes with emoji for all posts', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByText('143')).toBeInTheDocument(); // First post likes
      expect(screen.getByText('89')).toBeInTheDocument();  // Second post likes
      expect(screen.getByText('217')).toBeInTheDocument(); // Third post likes
      
      // Check for thumbs up emojis
      const thumbsUpEmojis = screen.getAllByText('👍');
      expect(thumbsUpEmojis).toHaveLength(3);
    });

    it('should display comments with emoji for all posts', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByText('23')).toBeInTheDocument(); // First post comments
      expect(screen.getByText('14')).toBeInTheDocument(); // Second post comments
      expect(screen.getByText('31')).toBeInTheDocument(); // Third post comments
      
      // Check for comment emojis
      const commentEmojis = screen.getAllByText('💬');
      expect(commentEmojis).toHaveLength(3);
    });

    it('should display shares with external-link icon for all posts', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByText('12')).toBeInTheDocument(); // First post shares
      expect(screen.getByText('8')).toBeInTheDocument();  // Second post shares
      expect(screen.getByText('42')).toBeInTheDocument(); // Third post shares
      
      // Check for external-link icons
      const shareIcons = screen.getAllByTestId('icon-external-link');
      expect(shareIcons).toHaveLength(3);
      shareIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '16');
      });
    });
  });

  describe('LinkedIn Links', () => {
    it('should render "View on LinkedIn" links for each post', () => {
      render(<LinkedInFeed />);
      
      const viewLinks = screen.getAllByText('View on LinkedIn');
      expect(viewLinks).toHaveLength(3);
      
      viewLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href', 'https://linkedin.com');
        expect(link.closest('a')).toHaveAttribute('target', '_blank');
        expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should render LinkedIn icons for "View on LinkedIn" links', () => {
      render(<LinkedInFeed />);
      
      const linkedinIcons = screen.getAllByTestId('icon-linkedin-logo');
      // Should have 4 total: 3 for "View on LinkedIn" + 1 for "Connect on LinkedIn"
      expect(linkedinIcons).toHaveLength(4);
      
      linkedinIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '16');
      });
    });

    it('should render main "Connect on LinkedIn" CTA button', () => {
      render(<LinkedInFeed />);
      
      const connectButton = screen.getByText('Connect on LinkedIn');
      expect(connectButton.closest('a')).toHaveAttribute('href', 'https://linkedin.com');
      expect(connectButton.closest('a')).toHaveAttribute('target', '_blank');
      expect(connectButton.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply correct container and responsive classes', () => {
      render(<LinkedInFeed />);
      
      const container = document.querySelector('.container');
      expect(container).toHaveClass('px-4', 'md:px-6');
    });

    it('should render post cards with proper styling', () => {
      render(<LinkedInFeed />);
      
      const postCards = screen.getAllByText('John Doe').map(el => 
        el.closest('.rounded-lg')
      );
      
      expect(postCards).toHaveLength(3);
      postCards.forEach(card => {
        expect(card).toHaveClass(
          'rounded-lg', 
          'border', 
          'bg-card', 
          'text-card-foreground', 
          'shadow-sm'
        );
      });
    });

    it('should apply responsive text sizing to heading', () => {
      render(<LinkedInFeed />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass(
        'text-3xl', 
        'font-bold', 
        'tracking-tighter', 
        'sm:text-4xl', 
        'md:text-5xl'
      );
    });

    it('should apply correct styling to main CTA button', () => {
      render(<LinkedInFeed />);
      
      const ctaButton = screen.getByText('Connect on LinkedIn').closest('a');
      expect(ctaButton).toHaveClass(
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
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<LinkedInFeed />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should have alt text for all avatar images', () => {
      render(<LinkedInFeed />);
      
      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(3);
      
      avatars.forEach(avatar => {
        expect(avatar).toHaveAttribute('alt', 'John Doe');
      });
    });

    it('should have proper link attributes for external links', () => {
      render(<LinkedInFeed />);
      
      const externalLinks = screen.getAllByRole('link');
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Data Structure', () => {
    it('should handle post data correctly', () => {
      render(<LinkedInFeed />);
      
      // Verify each post has unique content
      expect(screen.getByText(/open-source library for React developers/)).toBeInTheDocument();
      expect(screen.getByText(/Optimizing React Performance/)).toBeInTheDocument();
      expect(screen.getByText(/Building Accessible Web Applications/)).toBeInTheDocument();
    });

    it('should display correct time stamps', () => {
      render(<LinkedInFeed />);
      
      expect(screen.getByText('2 days ago')).toBeInTheDocument();
      expect(screen.getByText('1 week ago')).toBeInTheDocument();
      expect(screen.getByText('2 weeks ago')).toBeInTheDocument();
    });

    it('should display hashtags in post content', () => {
      render(<LinkedInFeed />);
      
      // ReactJS appears in multiple posts, so use getAllByText and check length
      expect(screen.getAllByText(/#ReactJS/).length).toBeGreaterThan(0);
      expect(screen.getByText(/#WebPerformance/)).toBeInTheDocument();
      expect(screen.getByText(/#Accessibility/)).toBeInTheDocument();
    });
  });

  describe('Icon Integration', () => {
    it('should render LinkedIn icons with correct props', () => {
      render(<LinkedInFeed />);
      
      const linkedinIcons = screen.getAllByTestId('icon-linkedin-logo');
      
      linkedinIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '16');
      });
      
      // Check for specific className on CTA button icon
      const ctaIcon = linkedinIcons.find(icon => 
        icon.classList.contains('mr-2')
      );
      expect(ctaIcon).toBeInTheDocument();
    });

    it('should render external-link icons for shares', () => {
      render(<LinkedInFeed />);
      
      const externalLinkIcons = screen.getAllByTestId('icon-external-link');
      expect(externalLinkIcons).toHaveLength(3);
      
      externalLinkIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '16');
      });
    });
  });
});