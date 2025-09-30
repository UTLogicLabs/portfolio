import { Icon } from '@/components/ui';
import type { BlogPost } from '@/types';
import { Link } from 'react-router';

export function BlogSection({ blogPosts = [] }: { blogPosts?: BlogPost[] }) {
  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Blog & Writing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center">
              <ComingSoonCard />
            </div>
          ) : (
            blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))
          )}
        </div>
        <div className="mt-12 flex justify-center">
          <a
          href="/blog"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            View All Posts
          </a>
        </div>
      </div>
    </section>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h4 className="text-xl font-semibold mb-3">{post.title}</h4>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
              {tag}
          </span>
          ))}
        </div>
        <Link
          to={`blog/${post.slug}`}
          className="mt-4 inline-flex items-center text-sm font-medium text-primary"
        >
          Read More
          <Icon name="arrow-right" size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  )
}

function ComingSoonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700 max-w-md">
      <div className="flex justify-center mb-4">
        <Icon name="external-link" size={24} className="text-primary" />
      </div>
      <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Coming Soon</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        I'm working on some exciting blog posts about web development, React, and more. Check back soon for insightful articles and tutorials!
      </p>
      <div className="flex justify-center">
        <span className="px-3 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
          Blog
        </span>
      </div>
    </div>
  )
}