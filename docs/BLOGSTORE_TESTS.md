# BlogStore Context Tests

## Overview

This document describes the comprehensive test suite for the `BlogStore` context utility, covering 30 tests across 9 test suites to ensure full functionality of the blog post management system including localStorage integration, CRUD operations, and statistical calculations.

## Test Structure

The BlogStore tests are organized into the following categories:

### 1. BlogStoreProvider Initialization (4 tests)
- ✅ **Empty localStorage**: Tests initialization with sample data when localStorage is empty
- ✅ **Existing data loading**: Verifies loading of existing posts and tags from localStorage
- ✅ **Sample posts creation**: Tests creation of 2 default sample blog posts
- ✅ **Sample tags creation**: Verifies creation of 4 default sample tags

### 2. useBlogStore Hook (2 tests)
- ✅ **Provider requirement**: Tests that hook throws error when used outside provider
- ✅ **Context access**: Verifies all context methods and properties are available

### 3. Blog Stats Calculation (3 tests)
- ✅ **Sample data stats**: Tests totalPosts, publishedPosts, draftPosts, totalViews calculations
- ✅ **Mixed status stats**: Verifies stats with combination of draft and published posts
- ✅ **Popular tags sorting**: Tests top 5 tags sorted by count in descending order

### 4. addPost Function (5 tests)
- ✅ **Generated fields**: Tests auto-generation of id, date, views, readTime, and URL
- ✅ **URL slug generation**: Verifies proper slug creation from post titles
- ✅ **Read time calculation**: Tests calculation based on content word count (200 wpm)
- ✅ **Existing tag updates**: Verifies tag count incrementation for existing tags
- ✅ **New tag creation**: Tests automatic creation of new tags with count of 1

### 5. updatePost Function (2 tests)
- ✅ **Post updating**: Tests updating of existing post properties
- ✅ **Other posts preservation**: Verifies other posts remain unchanged during updates

### 6. deletePost Function (3 tests)
- ✅ **Post deletion**: Tests removal of posts by ID
- ✅ **Other posts preservation**: Verifies other posts remain unchanged during deletion
- ✅ **Non-existent handling**: Tests graceful handling of non-existent post deletion

### 7. getPost Function (2 tests)
- ✅ **Post retrieval**: Tests finding posts by ID
- ✅ **Non-existent handling**: Verifies undefined return for non-existent IDs

### 8. Tag Management (5 tests)
#### addTag Function (2 tests)
- ✅ **New tag addition**: Tests creation of new tags with count of 1
- ✅ **Multiple tag addition**: Verifies adding multiple tags correctly

#### deleteTag Function (3 tests)
- ✅ **Tag deletion**: Tests removal of tags by ID
- ✅ **Other tags preservation**: Verifies other tags remain unchanged during deletion
- ✅ **Non-existent handling**: Tests graceful handling of non-existent tag deletion

### 9. LocalStorage Integration (2 tests)
- ✅ **Posts persistence**: Tests saving posts to localStorage on state changes
- ✅ **Tags persistence**: Verifies saving tags to localStorage on state changes

### 10. Utility Functions (2 tests)
- ✅ **URL slug generation**: Tests proper slug creation for various title formats
- ✅ **Read time calculation**: Verifies accurate read time calculation for different content lengths

## Key Testing Patterns

### LocalStorage Mocking
```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

### Provider Testing
```typescript
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BlogStoreProvider>{children}</BlogStoreProvider>
);

const { result } = renderHook(() => useBlogStore(), {
  wrapper: TestWrapper,
});
```

### Date Mocking for Consistency
```typescript
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2023-09-28'));
});

afterEach(() => {
  vi.useRealTimers();
});
```

### State Change Testing
```typescript
act(() => {
  result.current.addPost(postData);
});

expect(result.current.posts).toHaveLength(3);
```

## Blog Post Data Structure

### Sample Blog Posts
The context initializes with 2 sample posts:

1. **"Building Scalable React Applications: Best Practices"**
   - ID: '1'
   - Status: published
   - Tags: ['React', 'Web Development', 'JavaScript']
   - Views: 243
   - Read Time: '8 min read'

2. **"TypeScript Tips for JavaScript Developers"**
   - ID: '2'
   - Status: published
   - Tags: ['TypeScript', 'JavaScript', 'Web Development']
   - Views: 187
   - Read Time: '6 min read'

### Sample Tags
Initial tags with usage counts:
- React (count: 1)
- JavaScript (count: 2)
- TypeScript (count: 1)
- Web Development (count: 2)

## Blog Statistics Calculations

```typescript
const stats: BlogStats = {
  totalPosts: posts.length,
  publishedPosts: posts.filter(post => post.status === 'published').length,
  draftPosts: posts.filter(post => post.status === 'draft').length,
  totalViews: posts.reduce((total, post) => total + post.views, 0),
  popularTags: [...tags].sort((a, b) => b.count - a.count).slice(0, 5)
};
```

## Utility Function Testing

### URL Slug Generation
```typescript
const testCases = [
  { title: 'Hello World', expected: '/blog/hello-world' },
  { title: 'React Tips & Tricks!', expected: '/blog/react-tips-tricks' },
  { title: 'Advanced    JavaScript    Concepts', expected: '/blog/advanced-javascript-concepts' },
  { title: 'TypeScript: The Ultimate Guide', expected: '/blog/typescript-the-ultimate-guide' }
];
```

### Read Time Calculation (200 words per minute)
```typescript
const testCases = [
  { words: 100, expected: '1 min read' },
  { words: 200, expected: '1 min read' },
  { words: 300, expected: '2 min read' }, // Rounded up
  { words: 600, expected: '3 min read' }
];
```

## LocalStorage Integration

### Data Persistence
- Posts saved to `'blog_posts'` key
- Tags saved to `'blog_tags'` key
- Data automatically synced on state changes
- JSON serialization/deserialization handled automatically

### Sample Data Initialization
- If localStorage is empty, initializes with sample posts and tags
- If localStorage has data, loads existing data
- Maintains data persistence across browser sessions

## Error Handling Testing

### Context Requirement
```typescript
it('should throw error when used outside of provider', () => {
  expect(() => {
    renderHook(() => useBlogStore());
  }).toThrow('useBlogStore must be used within a BlogStoreProvider');
});
```

### Graceful Degradation
- Non-existent post/tag operations handled gracefully
- No errors thrown for invalid IDs
- State remains consistent during failed operations

## Coverage Summary

- **Total Tests**: 30
- **Context Initialization**: 100% covered
- **CRUD Operations**: All create, read, update, delete operations tested
- **State Management**: Tag counting and statistics calculations validated
- **LocalStorage Integration**: Persistence and loading functionality verified
- **Utility Functions**: URL slug generation and read time calculation tested
- **Error Handling**: Context usage requirements and graceful degradation verified

## Test Execution

```bash
npm test BlogStore.test.tsx
# ✓ 30 tests passing
# Duration: ~555ms
```

## Integration Notes

- **React Testing Library**: Uses renderHook for context testing
- **Vitest**: Comprehensive mocking of localStorage and Date objects
- **TypeScript**: Full type safety maintained throughout tests
- **State Management**: React hooks (useState, useEffect, useContext) thoroughly tested
- **Data Persistence**: LocalStorage integration with proper serialization
- **Sample Data**: Realistic blog post and tag data for testing
- **Error Boundaries**: Proper error handling for context usage outside provider

This comprehensive test suite ensures the BlogStore context maintains reliability across all blog management operations, data persistence, statistical calculations, and utility functions while providing a robust foundation for blog post management in the portfolio application.