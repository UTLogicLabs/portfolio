import { Icon } from '@/components/ui';
import type { BlogPost } from '@/types';


// export function BlogSection({ blogPosts }: { blogPosts: BlogPost[] }) {

//   return (
//     <section id="blog" className="w-full py-12 md:py-24 bg-accent">
//       <div className="container px-4 md:px-6">
//         <div className="flex flex-col items-center justify-center space-y-4 text-center">
//           <div className="space-y-2">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
//               Latest Blog Posts
//             </h2>
//             <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
//               Technical insights, tutorials, and thoughts on software development
//             </p>
//           </div>
//         </div>
//         <div className="mt-12 grid gap-8 md:grid-cols-3">
//           {blogPosts.map((post) => (
//             <div
//               key={post.id}
//               className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
//             >
//               <div className="aspect-video w-full overflow-hidden">
//                 <img
//                   src={post.coverImage}
//                   alt={post.title}
//                   className="object-cover w-full h-full transition-transform group-hover:scale-105"
//                 />
//               </div>
//               <div className="flex flex-1 flex-col justify-between p-6">
//                 <div>
//                   <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <Icon name="file-text" size={14} />
//                       <span>{post.date}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Icon name="briefcase" size={14} />
//                       <span>{post.readTime}</span>
//                     </div>
//                   </div>
//                   <h3 className="mt-3 text-lg font-bold">{post.title}</h3>
//                   <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
//                 </div>
//                 <a
//                   href={post.url}
//                   className="mt-4 inline-flex items-center text-sm font-medium text-primary"
//                 >
//                   Read More
//                   <Icon name="arrow-right" size={14} className="ml-1" />
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="mt-12 flex justify-center">
//           <a
//             href="/blog"
//             className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//           >
//             View All Posts
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

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
          <a
            href={`blog/${post.slug}`}
                 className="mt-4 inline-flex items-center text-sm font-medium text-primary"
               >
                 Read More
                 <Icon name="arrow-right" size={14} className="ml-1" />
               </a>
        </div>
      </div>
    </div>
  )
}