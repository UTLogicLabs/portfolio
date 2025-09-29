# TagsInput Component

## Overview

The `TagsInput` component is a sophisticated tag selection interface designed for admin purposes. It provides functionality for selecting, creating, and managing tags with autocomplete suggestions, dropdown filtering, and comprehensive keyboard navigation.

## Features

- **Tag Display & Management**: Shows selected tags as removable pills
- **Autocomplete Dropdown**: Suggests existing tags from BlogStore with usage counts
- **Tag Creation**: Allows creation of new tags when no matches exist
- **Keyboard Navigation**: Full keyboard support including Enter to add, Backspace to remove
- **Click-Outside Behavior**: Automatically closes dropdown when clicking outside
- **Case-Insensitive Filtering**: Smart filtering that works regardless of case
- **BlogStore Integration**: Seamlessly integrates with the blog management system
- **Accessibility**: Proper ARIA labels and screen reader support

## Props

```typescript
interface TagsInputProps {
  selectedTags: string[];           // Array of currently selected tag names
  onChange: (tags: string[]) => void; // Callback when tag selection changes
}
```

## Dependencies

- **BlogStore Context**: Uses `useBlogStore` for tag suggestions and creation
- **Icon Component**: Uses custom Icon system for cross and plus icons
- **React Hooks**: useState, useRef, useEffect for state management

## Usage

```tsx
import { TagsInput } from '@/components/admin/TagsInput';

function BlogEditor() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['React', 'TypeScript']);

  return (
    <div>
      <TagsInput 
        selectedTags={selectedTags}
        onChange={setSelectedTags}
      />
    </div>
  );
}
```

## Component Structure

### Container
- Styled input container with border and background
- Flexible layout that adapts to content
- Minimum height to maintain consistency

### Tag Pills
- Styled as rounded accent-colored pills
- Each tag has a remove button with cross icon
- Proper ARIA labels for accessibility

### Input Field
- Transparent input that blends with container
- Auto-sizing with flexible layout
- Focus management for better UX

### Dropdown
- Appears below input with shadow and border
- Shows existing tags filtered by input
- Displays usage counts for each tag
- Sorted by popularity (usage count)

### Create Button
- Appears when no matching tags exist
- Shows plus icon and "Create" text
- Adds new tag to both selection and BlogStore

## Behavior

### Tag Selection
```typescript
// Add tag via Enter key
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && inputValue.trim()) {
    addTag(inputValue.trim());
  }
});

// Add tag via dropdown click
const handleDropdownClick = (tagName: string) => {
  addTag(tagName);
};
```

### Tag Removal
```typescript
// Remove specific tag via button
const removeTag = (tagToRemove: string) => {
  const newTags = selectedTags.filter(tag => tag !== tagToRemove);
  onChange(newTags);
};

// Remove last tag via Backspace
input.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
    const newTags = [...selectedTags];
    newTags.pop();
    onChange(newTags);
  }
});
```

### Dropdown Management
```typescript
// Show dropdown when typing
const filteredTags = tags
  .filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTags.includes(tag.name)
  )
  .sort((a, b) => b.count - a.count);

// Close on click outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!containerRef.current?.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

## Styling

### Tailwind Classes
- `space-y-2`: Vertical spacing between elements
- `flex flex-wrap gap-2`: Flexible tag layout
- `border border-input`: Consistent border styling
- `bg-background`: Theme-aware background
- `rounded-md`: Consistent border radius
- `absolute z-10`: Dropdown positioning
- `shadow-md`: Subtle dropdown shadow

### Tag Pills
```css
.tag-pill {
  @apply inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs;
}
```

### Remove Buttons
```css
.remove-button {
  @apply rounded-full hover:bg-muted p-0.5;
}
```

## Accessibility

### ARIA Labels
- Remove buttons have `aria-label="Remove {tagName}"`
- Icons have `aria-hidden="true"` to avoid duplication
- Screen reader text provides context

### Keyboard Navigation
- **Enter**: Add current input as tag
- **Backspace**: Remove last tag (when input empty)
- **Focus/Blur**: Show/hide dropdown appropriately
- **Click**: All interactive elements keyboard accessible

### Screen Reader Support
```jsx
<button aria-label={`Remove ${tag}`}>
  <Icon name="cross" size={12} aria-hidden="true" />
  <span className="sr-only">Remove {tag}</span>
</button>
```

## Testing

### Test Coverage: 41/41 tests passing ✅

#### Component Structure (5 tests)
- Input field rendering and styling
- Container layout and styling  
- Helper text display
- Placeholder behavior

#### Selected Tags Display (4 tests)
- Tag display and styling
- Remove button functionality
- Icon rendering

#### Tag Removal (4 tests)
- Remove via button click
- Remove via Backspace key
- Edge case handling

#### Input Handling (7 tests)
- Input value updates
- Tag addition via Enter
- Input clearing
- Empty/whitespace validation
- Duplicate prevention

#### Dropdown Functionality (8 tests)
- Show/hide behavior
- Filtering logic
- Count display
- Sorting by popularity
- Selection from dropdown
- Exclusion of selected tags

#### Create New Tag (4 tests)
- Create button appearance
- Icon rendering
- Tag creation functionality
- Button styling

#### Focus & Dropdown (2 tests)
- Focus-based dropdown control
- Input state awareness

#### Click Outside (2 tests)
- Close on outside click
- Stay open on inside click

#### Case Insensitive Filtering (2 tests)
- Lowercase/uppercase filtering
- Mixed case handling

#### Accessibility (3 tests)
- ARIA label validation
- Screen reader text
- Keyboard navigation

### Test Examples

```tsx
// Test tag removal
it('should remove tag when remove button is clicked', async () => {
  const onChange = vi.fn();
  render(
    <TestWrapper>
      <TagsInput selectedTags={['React', 'TypeScript']} onChange={onChange} />
    </TestWrapper>
  );

  const removeButton = screen.getByRole('button', { name: 'Remove React' });
  await user.click(removeButton);

  expect(onChange).toHaveBeenCalledWith(['TypeScript']);
});

// Test dropdown filtering
it('should exclude already selected tags from dropdown', async () => {
  render(
    <TestWrapper>
      <TagsInput selectedTags={['React']} onChange={vi.fn()} />
    </TestWrapper>
  );

  const input = screen.getByRole('textbox');
  await user.type(input, 'R');

  await waitFor(() => {
    // React should not appear in dropdown since it's already selected
    const dropdownButtons = screen.queryAllByRole('button').filter(button => 
      button.textContent?.includes('React') && 
      !button.hasAttribute('aria-label') // Remove buttons have aria-label
    );
    expect(dropdownButtons).toHaveLength(0);
  });
});
```

## Integration with BlogStore

### Tag Suggestions
```typescript
const { tags } = useBlogStore();

// Filter available tags
const filteredTags = tags
  .filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTags.includes(tag.name)
  )
  .sort((a, b) => b.count - a.count);
```

### Tag Creation
```typescript
const { createTag } = useBlogStore();

const handleCreateTag = () => {
  if (inputValue.trim()) {
    createTag(inputValue.trim());
    addTag(inputValue.trim());
  }
};
```

## Performance Considerations

- **Debounced Filtering**: Filtering is efficient with case-insensitive search
- **Memoized Callbacks**: Event handlers are stable to prevent re-renders
- **Optimized Rendering**: Only re-renders when necessary state changes
- **Click Outside**: Single event listener managed with cleanup

## Best Practices

1. **State Management**: Keep selected tags in parent component state
2. **Validation**: Implement tag validation based on your needs
3. **Styling**: Use consistent theme colors and spacing
4. **Accessibility**: Always provide proper ARIA labels
5. **Performance**: Consider debouncing for large tag lists
6. **User Experience**: Clear visual feedback for all interactions

## Common Use Cases

- Blog post tag selection
- Category management
- Skill/technology selection
- Metadata organization
- Content classification

## Browser Support

- Modern browsers with ES6+ support
- Requires CSS Grid and Flexbox
- Tested with React 18+
- Tailwind CSS integration