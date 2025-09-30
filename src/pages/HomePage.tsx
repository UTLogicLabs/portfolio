import { useState } from 'react';
import { Link } from 'react-router';
import { Icon } from '@/components/ui';
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { BlogPost } from '@/types';
import { BlogSection } from '@/components/BlogSection';


const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Building Scalable React Applications: Best Practices',
      content: '# Building Scalable React Applications\n\nThis is a sample markdown content...',
      excerpt: 'Learn how to structure your React applications for scalability, maintainability, and performance. This guide covers component design, state management, and optimization techniques.',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-06-15'),
      readTime: '8 min read',
      tags: ['React', 'Web Development', 'JavaScript'],
      status: 'published',
      author: 'Joshua Dix',
      views: 243,
      slug: 'building-scalable-react-applications',
      featured: true
    },
    {
      id: '2',
      title: 'TypeScript Tips for JavaScript Developers',
      excerpt: "Make the transition from JavaScript to TypeScript smoother with these practical tips and tricks. Discover how to leverage TypeScript's type system to write more robust code.",
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date('2023-05-22'),
      updatedAt: new Date('2023-05-22'),
      readTime: '6 min read',
      slug: 'typescript-tips-for-javascript-developers',
      content: '',
      author: 'Joshua Dix',
      status: 'draft',
      tags: ['TypeScript', 'JavaScript', 'Web Development'],
      views: 0,
      featured: false
    },
    {
      id: '3',
      title: 'Optimizing Web Performance: The Ultimate Guide',
      excerpt: 'Explore techniques for improving website performance, from code splitting and lazy loading to image optimization and caching strategies. Learn how to deliver a faster user experience.',
      coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date('2023-04-10'),
      updatedAt: new Date('2023-04-10'),
      readTime: '10 min read',
      slug: 'optimizing-web-performance',
      content: '',
      author: 'Joshua Dix',
      status: 'published',
      tags: ['Performance', 'Web Development'],
      views: 0,
      featured: false
    }
  ];

export function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">Joshua Dix</Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                About
              </a>
              <a href="#projects" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Projects
              </a>
              <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Blog
              </Link>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Contact
              </a>
              <Link to="/admin/login" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                Admin
              </Link>
            </nav>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              <Icon name={isDarkMode ? 'sun' : 'moon'} size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 animate-fade-in">
              Full Stack Developer
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
              Building modern web applications with React, TypeScript, and cutting-edge technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                View Projects
              </button>
              <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                Download Resume
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">About Me</h3>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p>
                I'm a passionate full-stack developer with expertise in modern web technologies. 
                I love creating efficient, scalable, and user-friendly applications that solve real-world problems.
              </p>
              <p>
                With a strong foundation in React, TypeScript, and Node.js, I'm always exploring 
                new technologies and best practices to deliver exceptional digital experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section Placeholder */}
        <BlogSection blogPosts={blogPosts} />
        

        {/* Contact Section Placeholder */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Interested in working together? Let's connect!
            </p>
            <button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Contact Me
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2025 Joshua Dix. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}