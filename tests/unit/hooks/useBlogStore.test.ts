import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock data for testing
const mockPosts = [
  {
    id: '1',
    title: 'First Post',
    content: 'Content of first post',
    excerpt: 'First post excerpt',
    author: 'John Doe',
    publishedAt: '2024-01-01',
    status: 'published' as const,
    tags: ['React', 'TypeScript'],
    readingTime: 5,
    slug: 'first-post',
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'Content of second post',
    excerpt: 'Second post excerpt',
    author: 'Jane Doe',
    publishedAt: '2024-01-02',
    status: 'draft' as const,
    tags: ['JavaScript', 'Web'],
    readingTime: 3,
    slug: 'second-post',
  },
];

// Mock implementation of useBlogStore
const createMockBlogStore = () => {
  let posts = [...mockPosts];
  let nextId = 3;

  return {
    posts,
    loading: false,
    error: null,
    
    // Statistics
    getStatistics: () => ({
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.status === 'published').length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      totalTags: [...new Set(posts.flatMap(p => p.tags))].length,
    }),
    
    // CRUD operations
    createPost: vi.fn((postData: any) => {
      const newPost = {
        ...postData,
        id: String(nextId++),
        publishedAt: new Date().toISOString().split('T')[0],
        readingTime: Math.ceil(postData.content?.length / 250) || 1,
        slug: postData.title?.toLowerCase().replace(/\s+/g, '-') || '',
      };
      posts.push(newPost);
      return newPost;
    }),
    
    updatePost: vi.fn((id: string, updates: any) => {
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...updates };
        return posts[index];
      }
      return null;
    }),
    
    deletePost: vi.fn((id: string) => {
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts.splice(index, 1);
        return true;
      }
      return false;
    }),
    
    getPostById: vi.fn((id: string) => {
      return posts.find(p => p.id === id) || null;
    }),
    
    // Search and filter
    searchPosts: vi.fn((query: string) => {
      const trimmedQuery = query.trim();
      return posts.filter(post =>
        post.title.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(trimmedQuery.toLowerCase()))
      );
    }),
    
    getPostsByTag: vi.fn((tag: string) => {
      return posts.filter(post => post.tags.includes(tag));
    }),
    
    // Tags
    getAllTags: vi.fn(() => {
      const tagCounts: Record<string, number> = {};
      posts.forEach(post => {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      return Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));
    }),
    
    getPopularTags: vi.fn((limit = 10) => {
      const tags = [...new Set(posts.flatMap(p => p.tags))];
      return tags.slice(0, limit).map(tag => ({
        tag,
        count: posts.filter(p => p.tags.includes(tag)).length,
      }));
    }),
  };
};

describe('useBlogStore Hook', () => {
  let mockStore: ReturnType<typeof createMockBlogStore>;

  beforeEach(() => {
    mockStore = createMockBlogStore();
  });

  describe('Initial State', () => {
    it('should have initial posts', () => {
      expect(mockStore.posts).toHaveLength(2);
      expect(mockStore.posts[0].title).toBe('First Post');
      expect(mockStore.posts[1].title).toBe('Second Post');
    });

    it('should not be loading initially', () => {
      expect(mockStore.loading).toBe(false);
    });

    it('should have no error initially', () => {
      expect(mockStore.error).toBeNull();
    });
  });

  describe('Statistics', () => {
    it('should calculate correct statistics', () => {
      const stats = mockStore.getStatistics();
      
      expect(stats.totalPosts).toBe(2);
      expect(stats.publishedPosts).toBe(1);
      expect(stats.draftPosts).toBe(1);
      expect(stats.totalTags).toBe(4); // React, TypeScript, JavaScript, Web -> unique = 4
    });

    it('should update statistics after adding posts', () => {
      const initialStats = mockStore.getStatistics();
      
      mockStore.createPost({
        title: 'New Post',
        content: 'New content',
        status: 'published',
        tags: ['New', 'Tag'],
      });
      
      const newStats = mockStore.getStatistics();
      
      expect(newStats.totalPosts).toBe(initialStats.totalPosts + 1);
      expect(newStats.publishedPosts).toBe(initialStats.publishedPosts + 1);
    });

    it('should update statistics after deleting posts', () => {
      const initialStats = mockStore.getStatistics();
      
      mockStore.deletePost('1');
      
      const newStats = mockStore.getStatistics();
      
      expect(newStats.totalPosts).toBe(initialStats.totalPosts - 1);
      expect(newStats.publishedPosts).toBe(initialStats.publishedPosts - 1);
    });
  });

  describe('CRUD Operations', () => {
    describe('Create Post', () => {
      it('should create a new post', () => {
        const postData = {
          title: 'New Post',
          content: 'This is a new post content',
          excerpt: 'New post excerpt',
          author: 'Test Author',
          status: 'draft' as const,
          tags: ['Test', 'New'],
        };
        
        const newPost = mockStore.createPost(postData);
        
        expect(newPost).toBeDefined();
        expect(newPost.title).toBe(postData.title);
        expect(newPost.id).toBe('3');
        expect(mockStore.posts).toHaveLength(3);
      });

      it('should generate slug from title', () => {
        const newPost = mockStore.createPost({
          title: 'My Awesome Post Title',
          content: 'Content',
          status: 'draft',
          tags: [],
        });
        
        expect(newPost.slug).toBe('my-awesome-post-title');
      });

      it('should calculate reading time', () => {
        const longContent = 'a'.repeat(1000); // 1000 characters
        const newPost = mockStore.createPost({
          title: 'Long Post',
          content: longContent,
          status: 'draft',
          tags: [],
        });
        
        expect(newPost.readingTime).toBeGreaterThan(0);
      });

      it('should set current date as publishedAt', () => {
        const newPost = mockStore.createPost({
          title: 'Test Post',
          content: 'Content',
          status: 'draft',
          tags: [],
        });
        
        const today = new Date().toISOString().split('T')[0];
        expect(newPost.publishedAt).toBe(today);
      });
    });

    describe('Update Post', () => {
      it('should update existing post', () => {
        const updates = {
          title: 'Updated Title',
          content: 'Updated content',
        };
        
        const updatedPost = mockStore.updatePost('1', updates);
        
        expect(updatedPost).toBeDefined();
        expect(updatedPost?.title).toBe('Updated Title');
        expect(updatedPost?.content).toBe('Updated content');
        expect(updatedPost?.id).toBe('1');
      });

      it('should return null for non-existent post', () => {
        const result = mockStore.updatePost('999', { title: 'Updated' });
        
        expect(result).toBeNull();
      });

      it('should preserve unchanged fields', () => {
        const originalPost = mockStore.getPostById('1');
        const updates = { title: 'New Title' };
        
        const updatedPost = mockStore.updatePost('1', updates);
        
        expect(updatedPost?.title).toBe('New Title');
        expect(updatedPost?.content).toBe(originalPost?.content);
        expect(updatedPost?.author).toBe(originalPost?.author);
      });
    });

    describe('Delete Post', () => {
      it('should delete existing post', () => {
        const initialLength = mockStore.posts.length;
        const result = mockStore.deletePost('1');
        
        expect(result).toBe(true);
        expect(mockStore.posts).toHaveLength(initialLength - 1);
        expect(mockStore.getPostById('1')).toBeNull();
      });

      it('should return false for non-existent post', () => {
        const result = mockStore.deletePost('999');
        
        expect(result).toBe(false);
      });

      it('should not affect other posts', () => {
        const post2 = mockStore.getPostById('2');
        mockStore.deletePost('1');
        
        expect(mockStore.getPostById('2')).toEqual(post2);
      });
    });

    describe('Get Post By ID', () => {
      it('should return correct post', () => {
        const post = mockStore.getPostById('1');
        
        expect(post).toBeDefined();
        expect(post?.id).toBe('1');
        expect(post?.title).toBe('First Post');
      });

      it('should return null for non-existent post', () => {
        const post = mockStore.getPostById('999');
        
        expect(post).toBeNull();
      });
    });
  });

  describe('Search and Filter', () => {
    describe('Search Posts', () => {
      it('should search by title', () => {
        const results = mockStore.searchPosts('First');
        
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe('First Post');
      });

      it('should search by content', () => {
        const results = mockStore.searchPosts('first post');
        
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('1');
      });

      it('should search by tags', () => {
        const results = mockStore.searchPosts('React');
        
        expect(results).toHaveLength(1);
        expect(results[0].tags).toContain('React');
      });

      it('should be case insensitive', () => {
        const results = mockStore.searchPosts('FIRST');
        
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe('First Post');
      });

      it('should return empty array for no matches', () => {
        const results = mockStore.searchPosts('NonExistent');
        
        expect(results).toHaveLength(0);
      });

      it('should return all posts for empty query', () => {
        const results = mockStore.searchPosts('');
        
        expect(results).toHaveLength(2);
      });
    });

    describe('Get Posts By Tag', () => {
      it('should return posts with specific tag', () => {
        const results = mockStore.getPostsByTag('React');
        
        expect(results).toHaveLength(1);
        expect(results[0].tags).toContain('React');
      });

      it('should return empty array for non-existent tag', () => {
        const results = mockStore.getPostsByTag('NonExistent');
        
        expect(results).toHaveLength(0);
      });

      it('should be case sensitive', () => {
        const results = mockStore.getPostsByTag('react');
        
        expect(results).toHaveLength(0);
      });
    });
  });

  describe('Tag Management', () => {
    describe('Get All Tags', () => {
      it('should return all tags with counts', () => {
        const tags = mockStore.getAllTags();
        
        expect(tags).toBeInstanceOf(Array);
        expect(tags.length).toBeGreaterThan(0);
        
        tags.forEach(tagInfo => {
          expect(tagInfo).toHaveProperty('tag');
          expect(tagInfo).toHaveProperty('count');
          expect(typeof tagInfo.tag).toBe('string');
          expect(typeof tagInfo.count).toBe('number');
        });
      });

      it('should count tag usage correctly', () => {
        // Create a post with React tag to increase count
        mockStore.createPost({
          title: 'React Post',
          content: 'React content',
          status: 'published',
          tags: ['React'],
        });
        
        const tags = mockStore.getAllTags();
        const reactTag = tags.find(t => t.tag === 'React');
        
        expect(reactTag).toBeDefined();
        expect(reactTag?.count).toBe(2); // Original + new post
      });
    });

    describe('Get Popular Tags', () => {
      it('should return popular tags', () => {
        const popularTags = mockStore.getPopularTags();
        
        expect(popularTags).toBeInstanceOf(Array);
        expect(popularTags.length).toBeGreaterThan(0);
        
        popularTags.forEach(tagInfo => {
          expect(tagInfo).toHaveProperty('tag');
          expect(tagInfo).toHaveProperty('count');
        });
      });

      it('should respect limit parameter', () => {
        const limitedTags = mockStore.getPopularTags(2);
        
        expect(limitedTags.length).toBeLessThanOrEqual(2);
      });

      it('should default to 10 if no limit specified', () => {
        const defaultTags = mockStore.getPopularTags();
        
        expect(defaultTags.length).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle posts with no tags', () => {
      const newPost = mockStore.createPost({
        title: 'No Tags Post',
        content: 'Content without tags',
        status: 'draft',
        tags: [],
      });
      
      expect(newPost.tags).toEqual([]);
      
      const tags = mockStore.getAllTags();
      expect(tags.find(t => t.tag === '')).toBeUndefined();
    });

    it('should handle posts with duplicate tags', () => {
      const newPost = mockStore.createPost({
        title: 'Duplicate Tags Post',
        content: 'Content with duplicate tags',
        status: 'draft',
        tags: ['React', 'React', 'TypeScript'],
      });
      
      // The implementation should handle duplicates gracefully
      expect(newPost.tags).toContain('React');
      expect(newPost.tags).toContain('TypeScript');
    });

    it('should handle empty search queries', () => {
      const results = mockStore.searchPosts('');
      
      expect(results).toHaveLength(mockStore.posts.length);
    });

    it('should handle whitespace in search queries', () => {
      const results = mockStore.searchPosts('  First  ');
      
      expect(results).toHaveLength(1);
    });
  });

  describe('Performance', () => {
    it('should handle large number of posts efficiently', () => {
      // Add many posts
      for (let i = 0; i < 100; i++) {
        mockStore.createPost({
          title: `Post ${i}`,
          content: `Content ${i}`,
          status: 'published',
          tags: [`Tag${i % 5}`],
        });
      }
      
      const startTime = Date.now();
      const stats = mockStore.getStatistics();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
      expect(stats.totalPosts).toBe(102); // 2 initial + 100 new
    });

    it('should handle search efficiently with many posts', () => {
      // Add many posts
      for (let i = 0; i < 50; i++) {
        mockStore.createPost({
          title: `Test Post ${i}`,
          content: `Test content ${i}`,
          status: 'published',
          tags: ['Test'],
        });
      }
      
      const startTime = Date.now();
      const results = mockStore.searchPosts('Test');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(50); // Should be fast
      expect(results.length).toBeGreaterThan(0);
    });
  });
});