import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readTime: string;
  status: 'draft' | 'published';
  tags: string[];
  views: number;
  url: string;
}

export interface BlogTag {
  id: string;
  name: string;
  count: number;
}

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  popularTags: BlogTag[];
}

interface BlogStoreContextType {
  posts: BlogPost[];
  tags: BlogTag[];
  stats: BlogStats;
  addPost: (post: Omit<BlogPost, 'id' | 'date' | 'views'>) => BlogPost;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => BlogPost | undefined;
  addTag: (name: string) => BlogTag;
  deleteTag: (id: string) => void;
}

const BlogStoreContext = createContext<BlogStoreContextType | undefined>(undefined);

// Generate a URL slug from a title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Calculate read time based on content length
const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Simple UUID generator for testing purposes
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

interface BlogStoreProviderProps {
  children: ReactNode;
}

export const BlogStoreProvider = ({ children }: BlogStoreProviderProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedPosts = localStorage.getItem('blog_posts');
    const storedTags = localStorage.getItem('blog_tags');

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      // Initialize with sample posts if none exist
      const samplePosts: BlogPost[] = [
        {
          id: '1',
          title: 'Building Scalable React Applications: Best Practices',
          content: '# Building Scalable React Applications\n\nThis is a sample markdown content...',
          excerpt: 'Learn how to structure your React applications for scalability, maintainability, and performance.',
          coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          date: 'June 15, 2023',
          readTime: '8 min read',
          status: 'published',
          tags: ['React', 'Web Development', 'JavaScript'],
          views: 243,
          url: '/blog/building-scalable-react-applications'
        },
        {
          id: '2',
          title: 'TypeScript Tips for JavaScript Developers',
          content: '# TypeScript Tips for JavaScript Developers\n\nThis is a sample markdown content...',
          excerpt: 'Make the transition from JavaScript to TypeScript smoother with these practical tips and tricks.',
          coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          date: 'May 22, 2023',
          readTime: '6 min read',
          status: 'published',
          tags: ['TypeScript', 'JavaScript', 'Web Development'],
          views: 187,
          url: '/blog/typescript-tips-for-javascript-developers'
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('blog_posts', JSON.stringify(samplePosts));
    }

    if (storedTags) {
      setTags(JSON.parse(storedTags));
    } else {
      // Initialize with sample tags if none exist
      const sampleTags: BlogTag[] = [
        {
          id: '1',
          name: 'React',
          count: 1
        },
        {
          id: '2',
          name: 'JavaScript',
          count: 2
        },
        {
          id: '3',
          name: 'TypeScript',
          count: 1
        },
        {
          id: '4',
          name: 'Web Development',
          count: 2
        }
      ];
      setTags(sampleTags);
      localStorage.setItem('blog_tags', JSON.stringify(sampleTags));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
  }, [posts]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('blog_tags', JSON.stringify(tags));
  }, [tags]);

  // Calculate blog stats
  const stats: BlogStats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(post => post.status === 'published').length,
    draftPosts: posts.filter(post => post.status === 'draft').length,
    totalViews: posts.reduce((total, post) => total + post.views, 0),
    popularTags: [...tags].sort((a, b) => b.count - a.count).slice(0, 5)
  };

  const addPost = (postData: Omit<BlogPost, 'id' | 'date' | 'views'>) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const slug = generateSlug(postData.title);
    const readTime = calculateReadTime(postData.content);

    const newPost: BlogPost = {
      ...postData,
      id: generateId(),
      date: formattedDate,
      views: 0,
      readTime,
      url: `/blog/${slug}`
    };

    setPosts(prevPosts => [...prevPosts, newPost]);

    // Update tag counts
    postData.tags.forEach(tagName => {
      const existingTag = tags.find(t => t.name === tagName);
      if (existingTag) {
        updateTagCount(existingTag.id, existingTag.count + 1);
      } else {
        addTag(tagName);
      }
    });

    return newPost;
  };

  const updatePost = (updatedPost: BlogPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post))
    );
    // Update tags - this is simplified and would need more complex logic
    // for a real implementation to accurately track tag usage
  };

  const deletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    // Would need to update tag counts here in a real implementation
  };

  const getPost = (id: string) => {
    return posts.find(post => post.id === id);
  };

  const addTag = (name: string) => {
    const newTag: BlogTag = {
      id: generateId(),
      name,
      count: 1
    };
    setTags(prevTags => [...prevTags, newTag]);
    return newTag;
  };

  const updateTagCount = (id: string, count: number) => {
    setTags(prevTags =>
      prevTags.map(tag => (tag.id === id ? { ...tag, count } : tag))
    );
  };

  const deleteTag = (id: string) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== id));
  };

  return (
    <BlogStoreContext.Provider
      value={{
        posts,
        tags,
        stats,
        addPost,
        updatePost,
        deletePost,
        getPost,
        addTag,
        deleteTag
      }}
    >
      {children}
    </BlogStoreContext.Provider>
  );
};

export const useBlogStore = () => {
  const context = useContext(BlogStoreContext);
  if (context === undefined) {
    throw new Error('useBlogStore must be used within a BlogStoreProvider');
  }
  return context;
};