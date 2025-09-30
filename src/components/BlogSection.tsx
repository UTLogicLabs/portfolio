import { Icon } from '@/components/ui';
import type { BlogPost } from '@/types';
import { Link } from 'react-router';

export function BlogSection({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project cards will be added here */}
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
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