import { Link } from 'react-router';
import { Icon } from '@/components/ui';

export function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Icon name="arrow-left" size={16} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-bold">Blog</h1>
            <div></div> {/* Spacer for flexbox centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Blog posts about web development, technology, and my journey as a developer.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Check back soon for interesting articles and tutorials!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}