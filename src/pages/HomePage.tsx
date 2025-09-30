import { useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import { Icon } from '@/components/ui';
import type { BlogPost } from '@/types';
import { BlogSection } from '@/components/BlogSection';

// Loader function for blog posts
export async function homePageLoader(): Promise<{ blogPosts: BlogPost[] }> {
  // For now, we'll return an empty array to show the "Coming Soon" card
  // Later this can be connected to your blog store or API
  try {
    // You can replace this with actual data fetching logic
    // For example: const posts = await fetchBlogPosts();
    const blogPosts: BlogPost[] = [];
    
    return { blogPosts };
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return { blogPosts: [] };
  }
}



export function HomePage() {
  const { blogPosts } = useLoaderData() as { blogPosts: BlogPost[] };
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