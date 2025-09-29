import { Icon } from '@/components/ui';

export function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: 'Building Scalable React Applications: Best Practices',
      excerpt: 'Learn how to structure your React applications for scalability, maintainability, and performance. This guide covers component design, state management, and optimization techniques.',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'June 15, 2023',
      readTime: '8 min read',
      url: '/blog/building-scalable-react-applications'
    },
    {
      id: 2,
      title: 'TypeScript Tips for JavaScript Developers',
      excerpt: "Make the transition from JavaScript to TypeScript smoother with these practical tips and tricks. Discover how to leverage TypeScript's type system to write more robust code.",
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'May 22, 2023',
      readTime: '6 min read',
      url: '/blog/typescript-tips-for-javascript-developers'
    },
    {
      id: 3,
      title: 'Optimizing Web Performance: The Ultimate Guide',
      excerpt: 'Explore techniques for improving website performance, from code splitting and lazy loading to image optimization and caching strategies. Learn how to deliver a faster user experience.',
      coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'April 10, 2023',
      readTime: '10 min read',
      url: '/blog/optimizing-web-performance'
    }
  ];

  return (
    <section id="blog" className="w-full py-12 md:py-24 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Latest Blog Posts
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Technical insights, tutorials, and thoughts on software development
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="file-text" size={14} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="briefcase" size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="mt-3 text-lg font-bold">{post.title}</h3>
                  <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                </div>
                <a
                  href={post.url}
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                >
                  Read More
                  <Icon name="arrow-right" size={14} className="ml-1" />
                </a>
              </div>
            </div>
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