import { Icon } from '@/components/ui';

export function LinkedInFeed() {
  const linkedInPosts = [{
    id: 1,
    author: 'John Doe',
    role: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: "Excited to share that I've just launched a new open-source library for React developers! Check out my latest project on GitHub. #ReactJS #OpenSource #WebDevelopment",
    likes: 143,
    comments: 23,
    shares: 12,
    time: '2 days ago'
  }, {
    id: 2,
    author: 'John Doe',
    role: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: "Just published my latest blog post on 'Optimizing React Performance'. In this article, I dive deep into advanced techniques for improving your React application's speed and responsiveness. Link in comments! #WebPerformance #ReactJS #FrontendDevelopment",
    likes: 89,
    comments: 14,
    shares: 8,
    time: '1 week ago'
  }, {
    id: 3,
    author: 'John Doe',
    role: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: "Thrilled to announce that I'll be speaking at the upcoming React Conference about 'Building Accessible Web Applications'. Can't wait to share my insights with the community! #Accessibility #ReactConf #WebDevelopment",
    likes: 217,
    comments: 31,
    shares: 42,
    time: '2 weeks ago'
  }];

  return (
    <section id="linkedin" className="w-full py-12 md:py-24 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              LinkedIn Activity
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Check out my recent posts and updates on LinkedIn
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-8">
          {linkedInPosts.map(post => (
            <div key={post.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={post.avatar} alt={post.author} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {post.role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.time}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p>{post.content}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">👍</span>
                      <span className="text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">💬</span>
                      <span className="text-sm">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="external-link" size={16} />
                      <span className="text-sm">{post.shares}</span>
                    </div>
                  </div>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-sm font-medium text-primary"
                  >
                    <Icon name="linkedin-logo" size={16} className="mr-1" />
                    View on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Icon name="linkedin-logo" size={16} className="mr-2" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}