import { render, screen } from '@testing-library/react';import { render, screen } from '@testing-library/react';

import { describe, it, expect, vi } from 'vitest';import { describe, it, expect, vi } from 'vitest';

import { BlogSection } from '@/components/BlogSection';import { BlogSection } from '@/components/BlogSection';

import type { BlogPost } from '@/types';import type { BlogPost } from '@/types';



// Mock the Icon component// Mock the Icon component

vi.mock('@/components/ui', () => ({vi.mock('@/components/ui', () => ({

  Icon: ({ name, size, className }: { name: string; size: number; className?: string }) => (  Icon: ({ name, size, className }: { name: string; size: number; className?: string }) => (

    <div data-testid={`icon-${name}`} data-size={size} className={className}>    <div data-testid={`icon-${name}`} data-size={size} className={className}>

      {name}      {name}

    </div>    </div>

  ),  ),

}));}));



// Mock react-router Link// Mock react-router Link

vi.mock('react-router', () => ({vi.mock('react-router', () => ({

  Link: ({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) => (  Link: ({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) => (

    <a href={to} className={className}>    <a href={to} className={className}>

      {children}      {children}

    </a>    </a>

  ),  ),

}));}));



// Create test blog posts// Create test blog posts

const mockBlogPosts: BlogPost[] = [const mockBlogPosts: BlogPost[] = [

  {  {

    id: '1',    id: '1',

    title: 'Building Scalable React Applications: Best Practices',    title: 'Building Scalable React Applications: Best Practices',

    excerpt: 'Learn how to structure your React applications for scalability and maintainability.',    excerpt: 'Learn how to structure your React applications for scalability and maintainability.',

    content: 'Full content here...',    content: 'Full content here...',

    slug: 'building-scalable-react-applications',    slug: 'building-scalable-react-applications',

    tags: ['React', 'JavaScript', 'Frontend'],    tags: ['React', 'JavaScript', 'Frontend'],

    publishedAt: new Date('2023-06-15'),    publishedAt: new Date('2023-06-15'),

    updatedAt: new Date('2023-06-15'),    updatedAt: new Date('2023-06-15'),

    featured: true,    featured: true,

    coverImage: '/blog/react-best-practices.jpg',    coverImage: '/blog/react-best-practices.jpg',

    author: 'Joshua Dix',    author: 'Joshua Dix',

    readTime: '8 min read',    readTime: '8 min read',

    status: 'published',    status: 'published',

    views: 1250    views: 1250

  },  },

  {  {

    id: '2',    id: '2',

    title: 'TypeScript Tips for JavaScript Developers',    title: 'TypeScript Tips for JavaScript Developers',

    excerpt: 'Make the transition from JavaScript to TypeScript smoother with these practical tips.',    excerpt: 'Make the transition from JavaScript to TypeScript smoother with these practical tips.',

    content: 'Full content here...',    content: 'Full content here...',

    slug: 'typescript-tips-for-javascript-developers',    slug: 'typescript-tips-for-javascript-developers',

    tags: ['TypeScript', 'JavaScript', 'Development'],    tags: ['TypeScript', 'JavaScript', 'Development'],

    publishedAt: new Date('2023-05-22'),    publishedAt: new Date('2023-05-22'),

    updatedAt: new Date('2023-05-22'),    updatedAt: new Date('2023-05-22'),

    featured: true,    featured: true,

    coverImage: '/blog/typescript-tips.jpg',    coverImage: '/blog/typescript-tips.jpg',

    author: 'Joshua Dix',    author: 'Joshua Dix',

    readTime: '6 min read',    readTime: '6 min read',

    status: 'published',    status: 'published',

    views: 890    views: 890

  },  },

  {  {

    id: '3',    id: '3',

    title: 'Optimizing Web Performance: The Ultimate Guide',    title: 'Optimizing Web Performance: The Ultimate Guide',

    excerpt: 'Comprehensive guide to improving your web application performance.',    excerpt: 'Comprehensive guide to improving your web application performance.',

    content: 'Full content here...',    content: 'Full content here...',

    slug: 'optimizing-web-performance-guide',    slug: 'optimizing-web-performance-guide',

    tags: ['Performance', 'Web Development', 'Optimization'],    tags: ['Performance', 'Web Development', 'Optimization'],

    publishedAt: new Date('2023-04-10'),    publishedAt: new Date('2023-04-10'),

    updatedAt: new Date('2023-04-10'),    updatedAt: new Date('2023-04-10'),

    featured: true,    featured: true,

    coverImage: '/blog/web-performance.jpg',    coverImage: '/blog/web-performance.jpg',

    author: 'Joshua Dix',    author: 'Joshua Dix',

    readTime: '12 min read',    readTime: '12 min read',

    status: 'published',    status: 'published',

    views: 1580    views: 1580

  }  }

];];



describe('BlogSection', () => {describe('BlogSection', () => {

  describe('Component Structure', () => {  describe('Component Structure', () => {

    it('should render the blog section with correct ID and classes', () => {    it('should render the blog section with correct ID and classes', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const section = document.querySelector('#projects');      const section = document.querySelector('#projects');

      expect(section).toBeInTheDocument();      expect(section).toBeInTheDocument();

      expect(section).toHaveClass('py-20', 'px-4', 'sm:px-6', 'lg:px-8');      expect(section).toHaveClass('py-20', 'px-4', 'sm:px-6', 'lg:px-8');

    });    });



    it('should render the container with proper styling', () => {    it('should render the container with proper styling', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const container = document.querySelector('.max-w-6xl');      const container = document.querySelector('.max-w-6xl');

      expect(container).toBeInTheDocument();      expect(container).toBeInTheDocument();

      expect(container).toHaveClass('mx-auto');      expect(container).toHaveClass('mx-auto');

    });    });



    it('should render the main heading', () => {    it('should render the main heading', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const heading = screen.getByRole('heading', { level: 3 });      const heading = screen.getByRole('heading', { level: 3 });

      expect(heading).toHaveTextContent('Featured Projects');      expect(heading).toHaveTextContent('Featured Projects');

      expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-center', 'mb-12');      expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-center', 'mb-12');

    });    });

  });  });



  describe('Blog Posts Grid', () => {  describe('Blog Posts Grid', () => {

    it('should render the posts grid with correct styling', () => {    it('should render the posts grid with correct styling', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const grid = document.querySelector('.grid');      const grid = document.querySelector('.grid');

      expect(grid).toBeInTheDocument();      expect(grid).toBeInTheDocument();

      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8');      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8');

    });    });



    it('should render exactly 3 blog post cards', () => {    it('should render exactly 3 blog post cards', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const postCards = document.querySelectorAll('.bg-white');      const postCards = document.querySelectorAll('.bg-white');

      expect(postCards).toHaveLength(3);      expect(postCards).toHaveLength(3);

    });    });



    it('should render each post card with proper structure', () => {    it('should render each post card with proper structure', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const postCards = document.querySelectorAll('.bg-white');      const postCards = document.querySelectorAll('.bg-white');

            

      postCards.forEach(card => {      postCards.forEach(card => {

        expect(card).toHaveClass('dark:bg-gray-800', 'rounded-lg', 'shadow-lg', 'overflow-hidden');        expect(card).toHaveClass('dark:bg-gray-800', 'rounded-lg', 'shadow-lg', 'overflow-hidden');

                

        const contentContainer = card.querySelector('.p-6');        const contentContainer = card.querySelector('.p-6');

        expect(contentContainer).toBeInTheDocument();        expect(contentContainer).toBeInTheDocument();

      });      });

    });    });

  });  });



  describe('Blog Post Content', () => {  describe('Blog Post Content', () => {

    it('should render the first blog post with correct content', () => {    it('should render the first blog post with correct content', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const firstPostTitle = screen.getByText('Building Scalable React Applications: Best Practices');      const firstPostTitle = screen.getByText('Building Scalable React Applications: Best Practices');

      expect(firstPostTitle).toBeInTheDocument();      expect(firstPostTitle).toBeInTheDocument();

      expect(firstPostTitle).toHaveClass('text-xl', 'font-semibold', 'mb-3');      expect(firstPostTitle).toHaveClass('text-xl', 'font-semibold', 'mb-3');

            

      const firstPostExcerpt = screen.getByText(/Learn how to structure your React applications for scalability/);      const firstPostExcerpt = screen.getByText(/Learn how to structure your React applications for scalability/);

      expect(firstPostExcerpt).toBeInTheDocument();      expect(firstPostExcerpt).toBeInTheDocument();

    });    });



    it('should render the second blog post with correct content', () => {    it('should render the second blog post with correct content', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const secondPostTitle = screen.getByText('TypeScript Tips for JavaScript Developers');      const secondPostTitle = screen.getByText('TypeScript Tips for JavaScript Developers');

      expect(secondPostTitle).toBeInTheDocument();      expect(secondPostTitle).toBeInTheDocument();

            

      const secondPostExcerpt = screen.getByText(/Make the transition from JavaScript to TypeScript smoother/);      const secondPostExcerpt = screen.getByText(/Make the transition from JavaScript to TypeScript smoother/);

      expect(secondPostExcerpt).toBeInTheDocument();      expect(secondPostExcerpt).toBeInTheDocument();

    });    });



    it('should render the third blog post with correct content', () => {    it('should render the third blog post with correct content', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const thirdPostTitle = screen.getByText('Optimizing Web Performance: The Ultimate Guide');      const thirdPostTitle = screen.getByText('Optimizing Web Performance: The Ultimate Guide');

      expect(thirdPostTitle).toBeInTheDocument();      expect(thirdPostTitle).toBeInTheDocument();

            

      const thirdPostExcerpt = screen.getByText(/Comprehensive guide to improving your web application performance/);      const thirdPostExcerpt = screen.getByText(/Comprehensive guide to improving your web application performance/);

      expect(thirdPostExcerpt).toBeInTheDocument();      expect(thirdPostExcerpt).toBeInTheDocument();

    });    });



    it('should render all blog post headings as h4 elements', () => {    it('should render all blog post headings as h4 elements', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const headings = screen.getAllByRole('heading', { level: 4 });      const headings = screen.getAllByRole('heading', { level: 4 });

      expect(headings).toHaveLength(3);      expect(headings).toHaveLength(3);

    });    });

  });  });



  describe('Blog Post Tags', () => {  describe('Blog Post Tags', () => {

    it('should render tags for each post', () => {    it('should render tags for each post', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      expect(screen.getByText('React')).toBeInTheDocument();      expect(screen.getByText('React')).toBeInTheDocument();

      expect(screen.getByText('JavaScript')).toBeInTheDocument();      expect(screen.getByText('JavaScript')).toBeInTheDocument();

      expect(screen.getByText('Frontend')).toBeInTheDocument();      expect(screen.getByText('Frontend')).toBeInTheDocument();

      expect(screen.getByText('TypeScript')).toBeInTheDocument();      expect(screen.getByText('TypeScript')).toBeInTheDocument();

      expect(screen.getByText('Performance')).toBeInTheDocument();      expect(screen.getByText('Performance')).toBeInTheDocument();

    });    });



    it('should render tags with proper styling', () => {    it('should render tags with proper styling', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const reactTag = screen.getByText('React');      const reactTag = screen.getByText('React');

      expect(reactTag).toHaveClass('px-3', 'py-1', 'text-xs', 'rounded-full');      expect(reactTag).toHaveClass('px-3', 'py-1', 'text-xs', 'rounded-full');

    });    });

  });  });



  describe('Read More Links', () => {  describe('Read More Links', () => {

    it('should render read more links with correct href attributes', () => {    it('should render read more links with correct href attributes', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const readMoreLinks = screen.getAllByText('Read More');      const readMoreLinks = screen.getAllByText('Read More');

      expect(readMoreLinks).toHaveLength(3);      expect(readMoreLinks).toHaveLength(3);

            

      const firstLink = readMoreLinks[0].closest('a');      const firstLink = readMoreLinks[0].closest('a');

      expect(firstLink).toHaveAttribute('href', 'blog/building-scalable-react-applications');      expect(firstLink).toHaveAttribute('href', 'blog/building-scalable-react-applications');

    });    });



    it('should render read more links with correct styling', () => {    it('should render read more links with correct styling', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const readMoreLinks = screen.getAllByText('Read More');      const readMoreLinks = screen.getAllByText('Read More');

      readMoreLinks.forEach(link => {      readMoreLinks.forEach(link => {

        expect(link.closest('a')).toHaveClass('mt-4', 'inline-flex', 'items-center', 'text-sm', 'font-medium', 'text-primary');        expect(link.closest('a')).toHaveClass('mt-4', 'inline-flex', 'items-center', 'text-sm', 'font-medium', 'text-primary');

      });      });

    });    });



    it('should render arrow icons in read more links', () => {    it('should render arrow icons in read more links', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const arrowIcons = screen.getAllByTestId('icon-arrow-right');      const arrowIcons = screen.getAllByTestId('icon-arrow-right');

      expect(arrowIcons).toHaveLength(3);      expect(arrowIcons).toHaveLength(3);

            

      arrowIcons.forEach(icon => {      arrowIcons.forEach(icon => {

        expect(icon).toHaveAttribute('data-size', '14');        expect(icon).toHaveAttribute('data-size', '14');

        expect(icon).toHaveClass('ml-1');        expect(icon).toHaveClass('ml-1');

      });      });

    });    });

  });  });



  describe('View All Posts Button', () => {  describe('View All Posts Button', () => {

    it('should render the view all posts button with correct href', () => {    it('should render the view all posts button with correct href', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const viewAllButton = screen.getByText('View All Posts');      const viewAllButton = screen.getByText('View All Posts');

      expect(viewAllButton.closest('a')).toHaveAttribute('href', '/blog');      expect(viewAllButton.closest('a')).toHaveAttribute('href', '/blog');

    });    });



    it('should render the view all posts button with correct styling', () => {    it('should render the view all posts button with correct styling', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const viewAllButton = screen.getByText('View All Posts');      const viewAllButton = screen.getByText('View All Posts');

      const buttonElement = viewAllButton.closest('a');      const buttonElement = viewAllButton.closest('a');

      expect(buttonElement).toHaveClass(      expect(buttonElement).toHaveClass(

        'inline-flex',        'inline-flex',

        'h-10',        'h-10',

        'items-center',        'items-center',

        'justify-center',        'justify-center',

        'rounded-md',        'rounded-md',

        'bg-primary',        'bg-primary',

        'px-8',        'px-8',

        'text-sm',        'text-sm',

        'font-medium',        'font-medium',

        'text-primary-foreground'        'text-primary-foreground'

      );      );

    });    });



    it('should render the view all posts button in centered container', () => {    it('should render the view all posts button in centered container', () => {

      render(<BlogSection blogPosts={mockBlogPosts} />);      render(<BlogSection blogPosts={mockBlogPosts} />);

            

      const buttonContainer = document.querySelector('.mt-12.flex.justify-center');      const buttonContainer = document.querySelector('.mt-12.flex.justify-center');

      expect(buttonContainer).toBeInTheDocument();      expect(buttonContainer).toBeInTheDocument();

            

      const viewAllButton = screen.getByText('View All Posts');      const viewAllButton = screen.getByText('View All Posts');

      expect(buttonContainer).toContainElement(viewAllButton.closest('a'));      expect(buttonContainer).toContainElement(viewAllButton.closest('a'));

    });    });

  });  });



  describe('Empty State', () => {  describe('Empty State', () => {

    it('should handle empty blog posts array', () => {    it('should handle empty blog posts array', () => {

      render(<BlogSection blogPosts={[]} />);      render(<BlogSection blogPosts={[]} />);

            

      const heading = screen.getByText('Featured Projects');      const heading = screen.getByText('Featured Projects');

      expect(heading).toBeInTheDocument();      expect(heading).toBeInTheDocument();

            

      const postCards = document.querySelectorAll('.bg-white');      const postCards = document.querySelectorAll('.bg-white');

      expect(postCards).toHaveLength(0);      expect(postCards).toHaveLength(0);

    });    });

  });  });

});});

// Create test blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications: Best Practices',
    excerpt: 'Learn how to structure your React applications for scalability and maintainability.',
    content: 'Full content here...',
    slug: 'building-scalable-react-applications',
    tags: ['React', 'JavaScript', 'Frontend'],
    publishedAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15'),
    featured: true,
    coverImage: '/blog/react-best-practices.jpg',
    author: 'Joshua Dix',
    readTime: '8 min read',
    status: 'published',
    views: 1250
  },
  {
    id: '2',
    title: 'TypeScript Tips for JavaScript Developers',
    excerpt: 'Make the transition from JavaScript to TypeScript smoother with these practical tips.',
    content: 'Full content here...',
    slug: 'typescript-tips-for-javascript-developers',
    tags: ['TypeScript', 'JavaScript', 'Development'],
    publishedAt: new Date('2023-05-22'),
    updatedAt: new Date('2023-05-22'),
    featured: true,
    coverImage: '/blog/typescript-tips.jpg',
    author: 'Joshua Dix',
    readTime: '6 min read',
    status: 'published',
    views: 890
  },
  {
    id: '3',
    title: 'Optimizing Web Performance: The Ultimate Guide',
    excerpt: 'Comprehensive guide to improving your web application performance.',
    content: 'Full content here...',
    slug: 'optimizing-web-performance-guide',
    tags: ['Performance', 'Web Development', 'Optimization'],
    publishedAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-10'),
    featured: true,
    coverImage: '/blog/web-performance.jpg',
    author: 'Joshua Dix',
    readTime: '12 min read',
    status: 'published',
    views: 1580
  }
];

describe('BlogSection', () => {
  describe('Component Structure', () => {
    it('should render the blog section with correct ID and classes', () => {
      render(<BlogSection blogPosts={mockBlogPosts} />);
      
      const section = document.querySelector('#projects');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('py-20', 'px-4', 'sm:px-6', 'lg:px-8');
    });

    it('should render the container with proper styling', () => {
      render(<BlogSection blogPosts={mockBlogPosts} />);
      
      const container = document.querySelector('.max-w-6xl');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('mx-auto');
    });

    it('should render the header section with proper alignment', () => {
      render(<BlogSection blogPosts={mockBlogPosts} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Featured Projects');
      expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-center', 'mb-12');
    });
  });

  describe('Section Header', () => {
    it('should render the main heading with correct text and styling', () => {
      render(<BlogSection />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Latest Blog Posts');
      expect(heading).toHaveClass(
        'text-3xl',
        'font-bold',
        'tracking-tighter',
        'sm:text-4xl',
        'md:text-5xl'
      );
    });

    it('should render the description paragraph with correct text and styling', () => {
      render(<BlogSection />);
      
      const description = screen.getByText('Technical insights, tutorials, and thoughts on software development');
      expect(description).toHaveClass(
        'mx-auto',
        'max-w-[700px]',
        'text-muted-foreground',
        'md:text-xl'
      );
    });

    it('should render header content in proper containers', () => {
      render(<BlogSection />);
      
      const spaceContainer = document.querySelector('.space-y-2');
      expect(spaceContainer).toBeInTheDocument();
      
      const heading = screen.getByRole('heading', { level: 2 });
      const description = screen.getByText('Technical insights, tutorials, and thoughts on software development');
      
      expect(spaceContainer).toContainElement(heading);
      expect(spaceContainer).toContainElement(description);
    });
  });

  describe('Blog Posts Grid', () => {
    it('should render the posts grid with correct styling', () => {
      render(<BlogSection />);
      
      const grid = document.querySelector('.mt-12.grid.gap-8.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('should render exactly 3 blog post cards', () => {
      render(<BlogSection />);
      
      const postCards = document.querySelectorAll('.group.flex.flex-col.overflow-hidden.rounded-lg.border.bg-card.text-card-foreground.shadow-sm');
      expect(postCards).toHaveLength(3);
    });

    it('should render each post card with proper structure', () => {
      render(<BlogSection />);
      
      const postCards = document.querySelectorAll('.group.flex.flex-col.overflow-hidden.rounded-lg.border.bg-card.text-card-foreground.shadow-sm');
      
      postCards.forEach(card => {
        // Check for image container
        const imageContainer = card.querySelector('.aspect-video.w-full.overflow-hidden');
        expect(imageContainer).toBeInTheDocument();
        
        // Check for content container
        const contentContainer = card.querySelector('.flex.flex-1.flex-col.justify-between.p-6');
        expect(contentContainer).toBeInTheDocument();
      });
    });
  });

  describe('Blog Post Content', () => {
    it('should render the first blog post with correct content', () => {
      render(<BlogSection />);
      
      const firstPostTitle = screen.getByText('Building Scalable React Applications: Best Practices');
      expect(firstPostTitle).toBeInTheDocument();
      expect(firstPostTitle).toHaveClass('mt-3', 'text-lg', 'font-bold');
      
      const firstPostExcerpt = screen.getByText(/Learn how to structure your React applications for scalability/);
      expect(firstPostExcerpt).toBeInTheDocument();
      expect(firstPostExcerpt).toHaveClass('mt-2', 'text-muted-foreground');
      
      expect(screen.getByText('June 15, 2023')).toBeInTheDocument();
      expect(screen.getByText('8 min read')).toBeInTheDocument();
    });

    it('should render the second blog post with correct content', () => {
      render(<BlogSection />);
      
      const secondPostTitle = screen.getByText('TypeScript Tips for JavaScript Developers');
      expect(secondPostTitle).toBeInTheDocument();
      expect(secondPostTitle).toHaveClass('mt-3', 'text-lg', 'font-bold');
      
      const secondPostExcerpt = screen.getByText(/Make the transition from JavaScript to TypeScript smoother/);
      expect(secondPostExcerpt).toBeInTheDocument();
      expect(secondPostExcerpt).toHaveClass('mt-2', 'text-muted-foreground');
      
      expect(screen.getByText('May 22, 2023')).toBeInTheDocument();
      expect(screen.getByText('6 min read')).toBeInTheDocument();
    });

    it('should render the third blog post with correct content', () => {
      render(<BlogSection />);
      
      const thirdPostTitle = screen.getByText('Optimizing Web Performance: The Ultimate Guide');
      expect(thirdPostTitle).toBeInTheDocument();
      expect(thirdPostTitle).toHaveClass('mt-3', 'text-lg', 'font-bold');
      
      const thirdPostExcerpt = screen.getByText(/Explore techniques for improving website performance/);
      expect(thirdPostExcerpt).toBeInTheDocument();
      expect(thirdPostExcerpt).toHaveClass('mt-2', 'text-muted-foreground');
      
      expect(screen.getByText('April 10, 2023')).toBeInTheDocument();
      expect(screen.getByText('10 min read')).toBeInTheDocument();
    });

    it('should render all blog post headings as h3 elements', () => {
      render(<BlogSection />);
      
      const postHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(postHeadings).toHaveLength(3);
      
      expect(postHeadings[0]).toHaveTextContent('Building Scalable React Applications: Best Practices');
      expect(postHeadings[1]).toHaveTextContent('TypeScript Tips for JavaScript Developers');
      expect(postHeadings[2]).toHaveTextContent('Optimizing Web Performance: The Ultimate Guide');
    });
  });

  describe('Blog Post Images', () => {
    it('should render images with correct src and alt attributes', () => {
      render(<BlogSection />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      
      expect(images[0]).toHaveAttribute('src', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
      expect(images[0]).toHaveAttribute('alt', 'Building Scalable React Applications: Best Practices');
      
      expect(images[1]).toHaveAttribute('src', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
      expect(images[1]).toHaveAttribute('alt', 'TypeScript Tips for JavaScript Developers');
      
      expect(images[2]).toHaveAttribute('src', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
      expect(images[2]).toHaveAttribute('alt', 'Optimizing Web Performance: The Ultimate Guide');
    });

    it('should render images with correct styling classes', () => {
      render(<BlogSection />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        expect(image).toHaveClass(
          'object-cover',
          'w-full',
          'h-full',
          'transition-transform',
          'group-hover:scale-105'
        );
      });
    });

    it('should render image containers with correct aspect ratio', () => {
      render(<BlogSection />);
      
      const imageContainers = document.querySelectorAll('.aspect-video.w-full.overflow-hidden');
      expect(imageContainers).toHaveLength(3);
      
      imageContainers.forEach(container => {
        expect(container).toHaveClass('aspect-video', 'w-full', 'overflow-hidden');
      });
    });
  });

  describe('Post Metadata', () => {
    it('should render date icons with correct props', () => {
      render(<BlogSection />);
      
      const dateIcons = screen.getAllByTestId('icon-file-text');
      expect(dateIcons).toHaveLength(3);
      
      dateIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '14');
      });
    });

    it('should render read time icons with correct props', () => {
      render(<BlogSection />);
      
      const timeIcons = screen.getAllByTestId('icon-briefcase');
      expect(timeIcons).toHaveLength(3);
      
      timeIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '14');
      });
    });

    it('should render metadata with proper styling', () => {
      render(<BlogSection />);
      
      const metadataContainers = document.querySelectorAll('.flex.items-center.gap-4.text-sm.text-muted-foreground');
      expect(metadataContainers).toHaveLength(3);
      
      metadataContainers.forEach(container => {
        const dateContainer = container.querySelector('.flex.items-center.gap-1');
        expect(dateContainer).toBeInTheDocument();
      });
    });

    it('should display all dates and read times correctly', () => {
      render(<BlogSection />);
      
      // Check dates
      expect(screen.getByText('June 15, 2023')).toBeInTheDocument();
      expect(screen.getByText('May 22, 2023')).toBeInTheDocument();
      expect(screen.getByText('April 10, 2023')).toBeInTheDocument();
      
      // Check read times
      expect(screen.getByText('8 min read')).toBeInTheDocument();
      expect(screen.getByText('6 min read')).toBeInTheDocument();
      expect(screen.getByText('10 min read')).toBeInTheDocument();
    });
  });

  describe('Read More Links', () => {
    it('should render read more links with correct href attributes', () => {
      render(<BlogSection />);
      
      const readMoreLinks = screen.getAllByText('Read More');
      expect(readMoreLinks).toHaveLength(3);
      
      expect(readMoreLinks[0].closest('a')).toHaveAttribute('href', '/blog/building-scalable-react-applications');
      expect(readMoreLinks[1].closest('a')).toHaveAttribute('href', '/blog/typescript-tips-for-javascript-developers');
      expect(readMoreLinks[2].closest('a')).toHaveAttribute('href', '/blog/optimizing-web-performance');
    });

    it('should render read more links with correct styling', () => {
      render(<BlogSection />);
      
      const readMoreLinks = screen.getAllByText('Read More');
      
      readMoreLinks.forEach(link => {
        const anchor = link.closest('a');
        expect(anchor).toHaveClass(
          'mt-4',
          'inline-flex',
          'items-center',
          'text-sm',
          'font-medium',
          'text-primary'
        );
      });
    });

    it('should render arrow icons in read more links', () => {
      render(<BlogSection />);
      
      const arrowIcons = screen.getAllByTestId('icon-arrow-right');
      expect(arrowIcons).toHaveLength(3);
      
      arrowIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '14');
        expect(icon).toHaveClass('ml-1');
      });
    });
  });

  describe('View All Posts Button', () => {
    it('should render the view all posts button with correct href', () => {
      render(<BlogSection />);
      
      const viewAllButton = screen.getByRole('link', { name: 'View All Posts' });
      expect(viewAllButton).toHaveAttribute('href', '/blog');
    });

    it('should render the view all posts button with correct styling', () => {
      render(<BlogSection />);
      
      const viewAllButton = screen.getByRole('link', { name: 'View All Posts' });
      expect(viewAllButton).toHaveClass(
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
        'hover:bg-primary/90',
        'focus-visible:outline-none',
        'focus-visible:ring-1',
        'focus-visible:ring-ring',
        'disabled:pointer-events-none',
        'disabled:opacity-50'
      );
    });

    it('should render the view all posts button in centered container', () => {
      render(<BlogSection />);
      
      const buttonContainer = document.querySelector('.mt-12.flex.justify-center');
      expect(buttonContainer).toBeInTheDocument();
      
      const viewAllButton = screen.getByRole('link', { name: 'View All Posts' });
      expect(buttonContainer).toContainElement(viewAllButton);
    });
  });

  describe('Icon Integration', () => {
    it('should render all icons with correct names and sizes', () => {
      render(<BlogSection />);
      
      // Date icons (file-text)
      const dateIcons = screen.getAllByTestId('icon-file-text');
      expect(dateIcons).toHaveLength(3);
      dateIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '14');
        expect(icon).toHaveTextContent('file-text');
      });
      
      // Time icons (briefcase)
      const timeIcons = screen.getAllByTestId('icon-briefcase');
      expect(timeIcons).toHaveLength(3);
      timeIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '14');
        expect(icon).toHaveTextContent('briefcase');
      });
      
      // Arrow icons
      const arrowIcons = screen.getAllByTestId('icon-arrow-right');
      expect(arrowIcons).toHaveLength(3);
      arrowIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-size', '14');
        expect(icon).toHaveTextContent('arrow-right');
        expect(icon).toHaveClass('ml-1');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding on section', () => {
      render(<BlogSection />);
      
      const section = document.querySelector('#blog');
      expect(section).toHaveClass('py-12', 'md:py-24');
    });

    it('should have responsive padding on container', () => {
      render(<BlogSection />);
      
      const container = document.querySelector('.container');
      expect(container).toHaveClass('px-4', 'md:px-6');
    });

    it('should have responsive text sizing on heading', () => {
      render(<BlogSection />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'md:text-5xl');
    });

    it('should have responsive text sizing on description', () => {
      render(<BlogSection />);
      
      const description = screen.getByText('Technical insights, tutorials, and thoughts on software development');
      expect(description).toHaveClass('md:text-xl');
    });

    it('should have responsive grid layout', () => {
      render(<BlogSection />);
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<BlogSection />);
      
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Latest Blog Posts');
      
      const postHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(postHeadings).toHaveLength(3);
    });

    it('should have proper alt attributes for images', () => {
      render(<BlogSection />);
      
      const images = screen.getAllByRole('img');
      
      expect(images[0]).toHaveAttribute('alt', 'Building Scalable React Applications: Best Practices');
      expect(images[1]).toHaveAttribute('alt', 'TypeScript Tips for JavaScript Developers');
      expect(images[2]).toHaveAttribute('alt', 'Optimizing Web Performance: The Ultimate Guide');
    });

    it('should have proper link accessibility', () => {
      render(<BlogSection />);
      
      const readMoreLinks = screen.getAllByText('Read More');
      readMoreLinks.forEach(link => {
        const anchor = link.closest('a');
        expect(anchor).toHaveAttribute('href');
      });
      
      const viewAllButton = screen.getByRole('link', { name: 'View All Posts' });
      expect(viewAllButton).toHaveAttribute('href', '/blog');
    });

    it('should have focus-visible styles on interactive elements', () => {
      render(<BlogSection />);
      
      const viewAllButton = screen.getByRole('link', { name: 'View All Posts' });
      expect(viewAllButton).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-1', 'focus-visible:ring-ring');
    });
  });

  describe('Layout and Positioning', () => {
    it('should have proper section background and spacing', () => {
      render(<BlogSection />);
      
      const section = document.querySelector('#blog');
      expect(section).toHaveClass('w-full', 'bg-accent');
    });

    it('should have proper content spacing', () => {
      render(<BlogSection />);
      
      const headerSection = document.querySelector('.space-y-4');
      expect(headerSection).toBeInTheDocument();
      
      const titleContainer = document.querySelector('.space-y-2');
      expect(titleContainer).toBeInTheDocument();
      
      const grid = document.querySelector('.mt-12.grid');
      expect(grid).toBeInTheDocument();
      
      const buttonContainer = document.querySelector('.mt-12.flex.justify-center');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('should have proper card layout and spacing', () => {
      render(<BlogSection />);
      
      const cards = document.querySelectorAll('.group.flex.flex-col');
      cards.forEach(card => {
        const contentContainer = card.querySelector('.flex.flex-1.flex-col.justify-between.p-6');
        expect(contentContainer).toBeInTheDocument();
      });
    });
  });
});