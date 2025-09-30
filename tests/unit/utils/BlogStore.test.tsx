import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReactNode } from 'react';
import { BlogStoreProvider, useBlogStore, BlogTag } from '@/utils/BlogStore';
import { BlogPost } from '@/types';

// Helper function to create test post data
const createTestPost = (overrides: Partial<Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'views'>> = {}) => ({
  title: 'Test Post',
  content: 'Test content',
  excerpt: 'Test excerpt',
  coverImage: 'test-image.jpg',
  status: 'published' as const,
  author: 'Test Author',
  tags: [],
  slug: 'test-slug',
  readTime: '1 min read',
  featured: false,
  ...overrides
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BlogStoreProvider>{children}</BlogStoreProvider>
);

describe('BlogStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date to have consistent timestamps
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-09-28'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('BlogStoreProvider Initialization', () => {
    it('should initialize with empty localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      expect(result.current.posts).toHaveLength(2); // Sample posts
      expect(result.current.tags).toHaveLength(4); // Sample tags
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'blog_posts',
        expect.any(String)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'blog_tags',
        expect.any(String)
      );
    });

    it('should load existing data from localStorage', () => {
      const existingPosts: BlogPost[] = [
        {
          id: 'test-1',
          title: 'Test Post',
          content: 'Test content',
          excerpt: 'Test excerpt',
          coverImage: 'test-image.jpg',
          publishedAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          readTime: '2 min read',
          status: 'published',
          author: 'Test Author',
          tags: ['Test'],
          views: 10,
          slug: 'test-post',
          featured: false
        }
      ];

      const existingTags: BlogTag[] = [
        {
          id: 'tag-1',
          name: 'Test',
          count: 1
        }
      ];

      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(existingPosts))
        .mockReturnValueOnce(JSON.stringify(existingTags));

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      expect(result.current.posts).toEqual(existingPosts);
      expect(result.current.tags).toEqual(existingTags);
    });

    it('should initialize with correct sample posts when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      expect(result.current.posts).toHaveLength(2);
      expect(result.current.posts[0].title).toBe('Building Scalable React Applications: Best Practices');
      expect(result.current.posts[1].title).toBe('TypeScript Tips for JavaScript Developers');
    });

    it('should initialize with correct sample tags when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      expect(result.current.tags).toHaveLength(4);
      expect(result.current.tags.map(tag => tag.name)).toEqual([
        'React',
        'JavaScript',
        'TypeScript',
        'Web Development'
      ]);
    });
  });

  describe('useBlogStore Hook', () => {
    it('should throw error when used outside of provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useBlogStore());
      }).toThrow('useBlogStore must be used within a BlogStoreProvider');

      console.error = originalError;
    });

    it('should return context value when used within provider', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      expect(result.current).toHaveProperty('posts');
      expect(result.current).toHaveProperty('tags');
      expect(result.current).toHaveProperty('stats');
      expect(result.current).toHaveProperty('addPost');
      expect(result.current).toHaveProperty('updatePost');
      expect(result.current).toHaveProperty('deletePost');
      expect(result.current).toHaveProperty('getPost');
      expect(result.current).toHaveProperty('addTag');
      expect(result.current).toHaveProperty('deleteTag');
    });
  });

  describe('Blog Stats Calculation', () => {
    it('should calculate correct stats for sample data', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      expect(result.current.stats.totalPosts).toBe(2);
      expect(result.current.stats.publishedPosts).toBe(2);
      expect(result.current.stats.draftPosts).toBe(0);
      expect(result.current.stats.totalViews).toBe(430); // 243 + 187
      expect(result.current.stats.popularTags).toHaveLength(4);
    });

    it('should calculate stats with mixed draft and published posts', () => {
      const postsWithDrafts: BlogPost[] = [
        {
          id: '1',
          title: 'Published Post',
          content: 'Content',
          excerpt: 'Excerpt',
          coverImage: 'image.jpg',
          publishedAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          readTime: '5 min read',
          status: 'published',
          author: 'Test Author',
          tags: ['Test'],
          views: 100,
          slug: 'published-post',
          featured: false
        },
        {
          id: '2',
          title: 'Draft Post',
          content: 'Content',
          excerpt: 'Excerpt',
          coverImage: 'image.jpg',
          publishedAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
          readTime: '3 min read',
          status: 'draft',
          author: 'Test Author',
          tags: ['Test'],
          views: 0,
          slug: 'draft-post',
          featured: false
        }
      ];

      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(postsWithDrafts))
        .mockReturnValueOnce(JSON.stringify([]));

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      expect(result.current.stats.totalPosts).toBe(2);
      expect(result.current.stats.publishedPosts).toBe(1);
      expect(result.current.stats.draftPosts).toBe(1);
      expect(result.current.stats.totalViews).toBe(100);
    });

    it('should sort popular tags by count correctly', () => {
      const tagsData: BlogTag[] = [
        { id: '1', name: 'JavaScript', count: 5 },
        { id: '2', name: 'React', count: 10 },
        { id: '3', name: 'TypeScript', count: 3 },
        { id: '4', name: 'Vue', count: 8 },
        { id: '5', name: 'Angular', count: 2 },
        { id: '6', name: 'Node.js', count: 7 }
      ];

      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify([]))
        .mockReturnValueOnce(JSON.stringify(tagsData));

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const popularTags = result.current.stats.popularTags;
      expect(popularTags).toHaveLength(5); // Top 5 only
      expect(popularTags[0].name).toBe('React'); // count: 10
      expect(popularTags[1].name).toBe('Vue'); // count: 8
      expect(popularTags[2].name).toBe('Node.js'); // count: 7
      expect(popularTags[3].name).toBe('JavaScript'); // count: 5
      expect(popularTags[4].name).toBe('TypeScript'); // count: 3
    });
  });

  describe('addPost Function', () => {
    it('should add a new post with generated fields', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const postData = {
        title: 'New Test Post',
        content: 'This is a test post with some content to calculate read time.',
        excerpt: 'Test excerpt',
        coverImage: 'test-image.jpg',
        status: 'published' as const,
        author: 'Test Author',
        tags: ['Test', 'New'],
        slug: 'original-slug', // Will be overridden by auto-generated slug
        readTime: 'original-time', // Will be overridden by auto-calculated time
        featured: false
      };

      let newPost: BlogPost;
      act(() => {
        newPost = result.current.addPost(postData);
      });

      expect(newPost!).toHaveProperty('id');
      expect(newPost!.title).toBe('New Test Post');
      expect(newPost!.publishedAt).toBeInstanceOf(Date);
      expect(newPost!.updatedAt).toBeInstanceOf(Date);
      expect(newPost!.views).toBe(0);
      expect(newPost!.slug).toBe('new-test-post'); // Auto-generated from title
      expect(newPost!.readTime).toBe('1 min read'); // Auto-calculated from content
      expect(result.current.posts).toHaveLength(3); // 2 sample + 1 new
    });

    it('should generate URL slug correctly', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const postData = {
        title: 'My New Post! With Special Characters & Spaces',
        content: 'Content',
        excerpt: 'Excerpt',
        coverImage: 'image.jpg',
        status: 'draft' as const,
        author: 'Test Author',
        tags: [],
        slug: 'original-slug',
        readTime: '1 min read',
        featured: false
      };

      let newPost: BlogPost;
      act(() => {
        newPost = result.current.addPost(postData);
      });

      expect(newPost!.slug).toBe('my-new-post-with-special-characters-spaces');
    });

    it('should calculate read time based on content length', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      // Create content with approximately 400 words (should be 2 min read at 200 wpm)
      // Note: 'word '.repeat(400) creates 799 words due to split behavior
      const longContent = Array(400).fill('word').join(' ');

      const postData = {
        title: 'Long Post',
        content: longContent,
        excerpt: 'Excerpt',
        coverImage: 'image.jpg',
        status: 'published' as const,
        author: 'Test Author',
        tags: [],
        slug: 'original-slug',
        readTime: '1 min read', // This should be overwritten
        featured: false
      };

      let newPost: BlogPost;
      act(() => {
        newPost = result.current.addPost(postData);
      });

      expect(newPost!.readTime).toBe('2 min read');
    });

    it('should update existing tag counts when adding post with existing tags', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const initialReactTag = result.current.tags.find(tag => tag.name === 'React');
      expect(initialReactTag?.count).toBe(1);

      const postData = createTestPost({
        title: 'React Post',
        content: 'Content about React',
        tags: ['React', 'JavaScript'],
      });

      act(() => {
        result.current.addPost(postData);
      });

      const updatedReactTag = result.current.tags.find(tag => tag.name === 'React');
      const updatedJSTag = result.current.tags.find(tag => tag.name === 'JavaScript');
      
      expect(updatedReactTag?.count).toBe(2); // Increased from 1 to 2
      expect(updatedJSTag?.count).toBe(3); // Increased from 2 to 3
    });

    it('should create new tags when adding post with new tags', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const initialTagCount = result.current.tags.length;

      const postData = createTestPost({
        title: 'Vue Post',
        content: 'Content about Vue',
        tags: ['Vue', 'NewFramework'],
      });

      act(() => {
        result.current.addPost(postData);
      });

      expect(result.current.tags.length).toBe(initialTagCount + 2);
      
      const vueTag = result.current.tags.find(tag => tag.name === 'Vue');
      const newFrameworkTag = result.current.tags.find(tag => tag.name === 'NewFramework');
      
      expect(vueTag).toBeDefined();
      expect(vueTag?.count).toBe(1);
      expect(newFrameworkTag).toBeDefined();
      expect(newFrameworkTag?.count).toBe(1);
    });
  });

  describe('updatePost Function', () => {
    it('should update existing post', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const originalPost = result.current.posts[0];
      const updatedPost: BlogPost = {
        ...originalPost,
        title: 'Updated Title',
        excerpt: 'Updated excerpt'
      };

      act(() => {
        result.current.updatePost(updatedPost);
      });

      const post = result.current.getPost(originalPost.id);
      expect(post?.title).toBe('Updated Title');
      expect(post?.excerpt).toBe('Updated excerpt');
    });

    it('should not affect other posts when updating', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const originalPost1 = result.current.posts[0];
      const originalPost2 = result.current.posts[1];
      
      const updatedPost: BlogPost = {
        ...originalPost1,
        title: 'Updated Title'
      };

      act(() => {
        result.current.updatePost(updatedPost);
      });

      const post1 = result.current.getPost(originalPost1.id);
      const post2 = result.current.getPost(originalPost2.id);
      
      expect(post1?.title).toBe('Updated Title');
      expect(post2?.title).toBe(originalPost2.title); // Unchanged
    });
  });

  describe('deletePost Function', () => {
    it('should delete post by id', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const initialCount = result.current.posts.length;
      const postToDelete = result.current.posts[0];

      act(() => {
        result.current.deletePost(postToDelete.id);
      });

      expect(result.current.posts.length).toBe(initialCount - 1);
      expect(result.current.getPost(postToDelete.id)).toBeUndefined();
    });

    it('should not affect other posts when deleting', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const postToDelete = result.current.posts[0];
      const postToKeep = result.current.posts[1];

      act(() => {
        result.current.deletePost(postToDelete.id);
      });

      expect(result.current.getPost(postToKeep.id)).toBeDefined();
      expect(result.current.getPost(postToKeep.id)?.title).toBe(postToKeep.title);
    });

    it('should handle deleting non-existent post gracefully', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const initialCount = result.current.posts.length;

      act(() => {
        result.current.deletePost('non-existent-id');
      });

      expect(result.current.posts.length).toBe(initialCount); // No change
    });
  });

  describe('getPost Function', () => {
    it('should return post by id', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const firstPost = result.current.posts[0];
      const retrievedPost = result.current.getPost(firstPost.id);

      expect(retrievedPost).toEqual(firstPost);
    });

    it('should return undefined for non-existent id', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const retrievedPost = result.current.getPost('non-existent-id');
      expect(retrievedPost).toBeUndefined();
    });
  });

  describe('Tag Management', () => {
    describe('addTag Function', () => {
      it('should add new tag with count of 1', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => useBlogStore(), {
          wrapper: TestWrapper,
        });

        const initialCount = result.current.tags.length;

        let newTag: BlogTag;
        act(() => {
          newTag = result.current.addTag('NewTag');
        });

        expect(result.current.tags.length).toBe(initialCount + 1);
        expect(newTag!.name).toBe('NewTag');
        expect(newTag!.count).toBe(1);
        expect(newTag!).toHaveProperty('id');
      });

      it('should add multiple tags correctly', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => useBlogStore(), {
          wrapper: TestWrapper,
        });

        const initialCount = result.current.tags.length;

        act(() => {
          result.current.addTag('Tag1');
          result.current.addTag('Tag2');
          result.current.addTag('Tag3');
        });

        expect(result.current.tags.length).toBe(initialCount + 3);
        expect(result.current.tags.find(tag => tag.name === 'Tag1')).toBeDefined();
        expect(result.current.tags.find(tag => tag.name === 'Tag2')).toBeDefined();
        expect(result.current.tags.find(tag => tag.name === 'Tag3')).toBeDefined();
      });
    });

    describe('deleteTag Function', () => {
      it('should delete tag by id', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => useBlogStore(), {
          wrapper: TestWrapper,
        });

        const initialCount = result.current.tags.length;
        const tagToDelete = result.current.tags[0];

        act(() => {
          result.current.deleteTag(tagToDelete.id);
        });

        expect(result.current.tags.length).toBe(initialCount - 1);
        expect(result.current.tags.find(tag => tag.id === tagToDelete.id)).toBeUndefined();
      });

      it('should not affect other tags when deleting', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => useBlogStore(), {
          wrapper: TestWrapper,
        });

        const tagToDelete = result.current.tags[0];
        const tagToKeep = result.current.tags[1];

        act(() => {
          result.current.deleteTag(tagToDelete.id);
        });

        expect(result.current.tags.find(tag => tag.id === tagToKeep.id)).toBeDefined();
      });

      it('should handle deleting non-existent tag gracefully', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => useBlogStore(), {
          wrapper: TestWrapper,
        });

        const initialCount = result.current.tags.length;

        act(() => {
          result.current.deleteTag('non-existent-id');
        });

        expect(result.current.tags.length).toBe(initialCount); // No change
      });
    });
  });

  describe('LocalStorage Integration', () => {
    it('should save posts to localStorage when posts change', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const postData = createTestPost({
        title: 'New Post',
        content: 'Content',
      });

      act(() => {
        result.current.addPost(postData);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'blog_posts',
        expect.stringContaining('New Post')
      );
    });

    it('should save tags to localStorage when tags change', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.addTag('NewTag');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'blog_tags',
        expect.stringContaining('NewTag')
      );
    });
  });

  describe('Utility Functions', () => {
    it('should generate proper URL slugs', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const testCases = [
        { title: 'Hello World', expected: 'hello-world' },
        { title: 'React Tips & Tricks!', expected: 'react-tips-tricks' },
        { title: 'My First Post!!', expected: 'my-first-post' },
        { title: 'React Hooks Tutorial', expected: 'react-hooks-tutorial' },
        { title: 'JavaScript & TypeScript', expected: 'javascript-typescript' },
        { title: 'Advanced    JavaScript    Concepts', expected: 'advanced-javascript-concepts' },
        { title: 'TypeScript: The Ultimate Guide', expected: 'typescript-the-ultimate-guide' }
      ];

      testCases.forEach(({ title, expected }) => {
        const postData = createTestPost({
          title,
          content: 'Content',
        });

        let newPost: BlogPost;
        act(() => {
          newPost = result.current.addPost(postData);
        });

        expect(newPost!.slug).toBe(expected);
      });
    });

    it('should calculate read time correctly for different content lengths', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useBlogStore(), {
        wrapper: TestWrapper,
      });

      const testCases = [
        { words: 100, expected: '1 min read' }, // 100 words = 1 min at 200 wpm
        { words: 200, expected: '1 min read' }, // 200 words = 1 min at 200 wpm
        { words: 300, expected: '2 min read' }, // 300 words = 2 min at 200 wpm (rounded up)
        { words: 600, expected: '3 min read' }, // 600 words = 3 min at 200 wpm
      ];

      testCases.forEach(({ words, expected }, index) => {
        const content = Array(words).fill('word').join(' ');
        const postData = createTestPost({
          title: `Test Post ${index}`,
          content,
        });

        let newPost: BlogPost;
        act(() => {
          newPost = result.current.addPost(postData);
        });

        expect(newPost!.readTime).toBe(expected);
      });
    });
  });
});