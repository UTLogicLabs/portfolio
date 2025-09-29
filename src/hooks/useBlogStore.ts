import { useState } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  status: 'draft' | 'published';
  tags: string[];
  views: number;
  author: string;
}

export interface BlogTag {
  id: string;
  name: string;
  count: number;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  popularTags: Array<{ id: string; name: string; count: number }>;
}

// Mock blog data for demo purposes
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    excerpt: 'Learn how to set up a modern React application with TypeScript for better development experience.',
    content: 'Full content here...',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
    date: '2024-03-15',
    status: 'published',
    tags: ['React', 'TypeScript', 'Web Development'],
    views: 1250,
    author: 'Joshua Dix'
  },
  {
    id: '2',
    title: 'Building Modern UIs with Tailwind CSS',
    excerpt: 'Discover the power of utility-first CSS framework for rapid UI development.',
    content: 'Full content here...',
    coverImage: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=300&h=200&fit=crop',
    date: '2024-03-10',
    status: 'published',
    tags: ['CSS', 'Tailwind', 'Design'],
    views: 980,
    author: 'Joshua Dix'
  },
  {
    id: '3',
    title: 'Advanced JavaScript Patterns',
    excerpt: 'Explore advanced JavaScript patterns and techniques for better code organization.',
    content: 'Full content here...',
    coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&h=200&fit=crop',
    date: '2024-03-05',
    status: 'draft',
    tags: ['JavaScript', 'Patterns', 'Advanced'],
    views: 0,
    author: 'Joshua Dix'
  },
  {
    id: '4',
    title: 'State Management in React Applications',
    excerpt: 'Compare different state management solutions for React applications.',
    content: 'Full content here...',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
    date: '2024-02-28',
    status: 'published',
    tags: ['React', 'State Management', 'Redux'],
    views: 756,
    author: 'Joshua Dix'
  },
  {
    id: '5',
    title: 'Testing React Components with Playwright',
    excerpt: 'Learn how to write comprehensive E2E tests for React applications.',
    content: 'Full content here...',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop',
    date: '2024-02-20',
    status: 'draft',
    tags: ['Testing', 'Playwright', 'React'],
    views: 0,
    author: 'Joshua Dix'
  }
];

const mockTags: BlogTag[] = [
  { id: '1', name: 'React', count: 3 },
  { id: '2', name: 'TypeScript', count: 2 },
  { id: '3', name: 'JavaScript', count: 2 },
  { id: '4', name: 'CSS', count: 1 },
  { id: '5', name: 'Tailwind', count: 1 },
  { id: '6', name: 'Testing', count: 1 },
  { id: '7', name: 'Web Development', count: 1 },
  { id: '8', name: 'Design', count: 1 },
  { id: '9', name: 'Patterns', count: 1 },
  { id: '10', name: 'Advanced', count: 1 },
  { id: '11', name: 'State Management', count: 1 },
  { id: '12', name: 'Redux', count: 1 },
  { id: '13', name: 'Playwright', count: 1 }
];

export function useBlogStore() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [tags, setTags] = useState<BlogTag[]>(mockTags);
  
  const stats: BlogStats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((total, post) => total + post.views, 0),
    popularTags: tags
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(tag => ({ id: tag.id, name: tag.name, count: tag.count }))
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    // Update tag counts when deleting posts
    const deletedPost = posts.find(p => p.id === id);
    if (deletedPost) {
      setTags(prev => prev.map(tag => ({
        ...tag,
        count: deletedPost.tags.includes(tag.name) ? Math.max(0, tag.count - 1) : tag.count
      })));
    }
  };

  const addPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString()
    };
    setPosts(prev => [newPost, ...prev]);
    
    // Update tag counts
    post.tags.forEach(tagName => {
      setTags(prev => {
        const existingTag = prev.find(t => t.name === tagName);
        if (existingTag) {
          return prev.map(t => t.id === existingTag.id ? { ...t, count: t.count + 1 } : t);
        } else {
          return [...prev, { id: Date.now().toString(), name: tagName, count: 1 }];
        }
      });
    });
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ));
  };

  return {
    posts,
    tags,
    stats,
    deletePost,
    addPost,
    updatePost
  };
}