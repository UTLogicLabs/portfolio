import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TagsInput } from '@/components/admin/TagsInput';
import { BlogStoreProvider } from '@/utils/BlogStore';
import { ReactNode } from 'react';

// Mock the Icon component
vi.mock('@/components/ui', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid={`icon-${name}`} data-size={size}>
      {name}
    </div>
  ),
}));

// Mock localStorage for BlogStore
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test wrapper with BlogStore provider
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BlogStoreProvider>{children}</BlogStoreProvider>
);

describe('TagsInput', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null); // Start with empty localStorage
  });

  describe('Component Structure', () => {
    it('should render the input field with correct styling', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass(
        'w-full',
        'border-0',
        'bg-transparent',
        'p-0',
        'text-sm',
        'focus:outline-none',
        'focus:ring-0'
      );
    });

    it('should render the container with proper styling', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const container = document.querySelector('.flex.flex-wrap.gap-2.p-2.rounded-md.border.border-input.bg-background.min-h-\\[38px\\]');
      expect(container).toBeInTheDocument();
    });

    it('should render helper text', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      expect(screen.getByText('Press enter to add a tag, backspace to remove the last tag')).toBeInTheDocument();
    });

    it('should show placeholder when no tags are selected', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Add tags...');
    });

    it('should not show placeholder when tags are selected', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', '');
    });
  });

  describe('Selected Tags Display', () => {
    it('should display selected tags', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React', 'TypeScript']} onChange={mockOnChange} />
        </TestWrapper>
      );

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should render tag pills with correct styling', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const tagPill = screen.getByText('React').closest('div');
      expect(tagPill).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1',
        'rounded-full',
        'bg-accent',
        'px-2',
        'py-1',
        'text-xs'
      );
    });

    it('should render remove buttons for each tag', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React', 'TypeScript']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const removeButtons = screen.getAllByRole('button', { name: /Remove/ });
      expect(removeButtons).toHaveLength(2);
      expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove TypeScript' })).toBeInTheDocument();
    });

    it('should render cross icons in remove buttons', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const crossIcon = screen.getByTestId('icon-cross');
      expect(crossIcon).toBeInTheDocument();
      expect(crossIcon).toHaveAttribute('data-size', '12');
    });
  });

  describe('Tag Removal', () => {
    it('should remove tag when remove button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React', 'TypeScript']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const removeButton = screen.getByRole('button', { name: 'Remove React' });
      await user.click(removeButton);

      expect(mockOnChange).toHaveBeenCalledWith(['TypeScript']);
    });

    it('should remove last tag when backspace is pressed with empty input', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React', 'TypeScript']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.keyboard('{Backspace}');

      expect(mockOnChange).toHaveBeenCalledWith(['React']);
    });

    it('should not remove tags when backspace is pressed with text in input', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, 'test');
      await user.keyboard('{Backspace}');

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not remove tags when no tags exist and backspace is pressed', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.keyboard('{Backspace}');

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Input Handling', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'new tag');

      expect(input).toHaveValue('new tag');
    });

    it('should add tag when Enter is pressed', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag');
      await user.keyboard('{Enter}');

      expect(mockOnChange).toHaveBeenCalledWith(['New Tag']);
    });

    it('should clear input after adding tag with Enter', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag');
      await user.keyboard('{Enter}');

      expect(input).toHaveValue('');
    });

    it('should not add empty tags when Enter is pressed', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      await user.keyboard('{Enter}');

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not add whitespace-only tags', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, '   ');
      await user.keyboard('{Enter}');

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should trim whitespace from tag names', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, '  New Tag  ');
      await user.keyboard('{Enter}');

      expect(mockOnChange).toHaveBeenCalledWith(['New Tag']);
    });

    it('should not add duplicate tags', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'React');
      await user.keyboard('{Enter}');

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Dropdown Functionality', () => {
    beforeEach(() => {
      // Mock sample tags in localStorage for the BlogStore
      const sampleTags = [
        { id: '1', name: 'React', count: 5 },
        { id: '2', name: 'JavaScript', count: 3 },
        { id: '3', name: 'TypeScript', count: 7 }
      ];
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify([])) // posts
        .mockReturnValueOnce(JSON.stringify(sampleTags)); // tags
    });

    it('should show dropdown when input has value', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('should hide dropdown when input is empty', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');
      
      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      await user.clear(input);

      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });
    });

    it('should filter tags based on input', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'Type');

      await waitFor(() => {
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.queryByText('React')).not.toBeInTheDocument();
        expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
      });
    });

    it('should show tag counts in dropdown', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // React count
      });
    });

    it('should sort tags by count in descending order', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'script'); // Should match both JavaScript and TypeScript

      await waitFor(() => {
        const dropdownButtons = screen.getAllByRole('button');
        const tagButtons = dropdownButtons.filter(button => 
          button.textContent?.includes('JavaScript') || button.textContent?.includes('TypeScript')
        );
        
        // TypeScript should come first (count: 7) before JavaScript (count: 3)
        expect(tagButtons[0]).toHaveTextContent('TypeScript');
        expect(tagButtons[1]).toHaveTextContent('JavaScript');
      });
    });

    it('should add tag when dropdown option is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      const reactButton = screen.getByRole('button', { name: /React/ });
      await user.click(reactButton);

      expect(mockOnChange).toHaveBeenCalledWith(['React']);
    });

    it('should clear input and close dropdown after selecting from dropdown', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      const reactButton = screen.getByRole('button', { name: /React/ });
      await user.click(reactButton);

      expect(input).toHaveValue('');
      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });
    });

    it('should exclude already selected tags from dropdown', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');

      await waitFor(() => {
        // React should not appear in dropdown options since it's already selected
        // Only check for dropdown buttons (not remove buttons)
        const dropdownButtons = screen.queryAllByRole('button').filter(button => 
          button.textContent?.includes('React') && 
          !button.hasAttribute('aria-label') // Remove buttons have aria-label
        );
        expect(dropdownButtons).toHaveLength(0);
      });
    });
  });

  describe('Create New Tag Functionality', () => {
    beforeEach(() => {
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify([])) // posts
        .mockReturnValueOnce(JSON.stringify([])); // empty tags
    });

    it('should show create button when no matching tags exist', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'NewTag');

      await waitFor(() => {
        expect(screen.getByText('Create "NewTag"')).toBeInTheDocument();
      });
    });

    it('should render plus icon in create button', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'NewTag');

      await waitFor(() => {
        const plusIcon = screen.getByTestId('icon-plus');
        expect(plusIcon).toBeInTheDocument();
        expect(plusIcon).toHaveAttribute('data-size', '12');
      });
    });

    it('should create new tag when create button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'NewTag');

      await waitFor(() => {
        expect(screen.getByText('Create "NewTag"')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /Create "NewTag"/ });
      await user.click(createButton);

      expect(mockOnChange).toHaveBeenCalledWith(['NewTag']);
    });

    it('should create button have correct styling', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'NewTag');

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create "NewTag"/ });
        expect(createButton).toHaveClass(
          'flex',
          'w-full',
          'items-center',
          'justify-center',
          'gap-1',
          'rounded-md',
          'bg-primary',
          'px-2',
          'py-1',
          'text-xs',
          'text-primary-foreground'
        );
      });
    });
  });

  describe('Focus and Dropdown Behavior', () => {
    beforeEach(() => {
      const sampleTags = [
        { id: '1', name: 'React', count: 5 }
      ];
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify([])) // posts
        .mockReturnValueOnce(JSON.stringify(sampleTags)); // tags
    });

    it('should show dropdown on focus if input has value', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');
      await user.click(document.body); // Blur input
      
      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });

      await user.click(input); // Focus again

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('should not show dropdown on focus if input is empty', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });
  });

  describe('Click Outside Behavior', () => {
    beforeEach(() => {
      const sampleTags = [
        { id: '1', name: 'React', count: 5 }
      ];
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify([])) // posts
        .mockReturnValueOnce(JSON.stringify(sampleTags)); // tags
    });

    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <TestWrapper>
            <TagsInput selectedTags={[]} onChange={mockOnChange} />
          </TestWrapper>
          <button>Outside Button</button>
        </div>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      const outsideButton = screen.getByText('Outside Button');
      await user.click(outsideButton);

      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });
    });

    it('should not close dropdown when clicking inside dropdown', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'R');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      const reactButton = screen.getByRole('button', { name: /React/ });
      // Just hovering shouldn't close it
      await user.hover(reactButton);

      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  describe('Case Insensitive Filtering', () => {
    beforeEach(() => {
      const sampleTags = [
        { id: '1', name: 'React', count: 5 },
        { id: '2', name: 'JavaScript', count: 3 }
      ];
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify([])) // posts
        .mockReturnValueOnce(JSON.stringify(sampleTags)); // tags
    });

    it('should filter tags case-insensitively', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('should filter with mixed case input', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'jAvAsCrIpT');

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for remove buttons', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React', 'TypeScript']} onChange={mockOnChange} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove TypeScript' })).toBeInTheDocument();
    });

    it('should have screen reader text for remove buttons', () => {
      render(
        <TestWrapper>
          <TagsInput selectedTags={['React']} onChange={mockOnChange} />
        </TestWrapper>
      );

      const srText = document.querySelector('.sr-only');
      expect(srText).toHaveTextContent('Remove React');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TagsInput selectedTags={[]} onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      
      // Should be focusable
      await user.tab();
      expect(input).toHaveFocus();
    });
  });
});