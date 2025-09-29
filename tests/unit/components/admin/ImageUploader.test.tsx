import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploader } from '@/components/admin/ImageUploader';

// Mock the Icon component
vi.mock('@/components/ui/Icon', () => ({
  Icon: ({ name, size, className, 'aria-hidden': ariaHidden }: any) => (
    <div data-testid={`icon-${name}`} data-size={size} className={className} aria-hidden={ariaHidden}>
      {name}
    </div>
  ),
}));

describe('ImageUploader', () => {
  const mockOnImageSelected = vi.fn();
  
  beforeEach(() => {
    mockOnImageSelected.mockClear();
    // Mock FileReader
    global.FileReader = class {
      result: string | null = null;
      onloadend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      
      readAsDataURL() {
        this.result = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD';
        // Use setTimeout to make FileReader async like in real browser
        setTimeout(() => {
          if (this.onloadend) {
            this.onloadend();
          }
        }, 0);
      }
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Structure', () => {
    it('should render the upload area when no image is provided', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      expect(screen.getByText('Drag and drop an image, or')).toBeInTheDocument();
      expect(screen.getByText('PNG, JPG or GIF up to 5MB')).toBeInTheDocument();
    });

    it('should render the upload area with correct styling', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      // Target the drag area container correctly
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      expect(uploadArea).toHaveClass('border-2', 'border-dashed', 'rounded-lg', 'p-6', 'text-center');
    });

    it('should render the image icon in upload area', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      expect(screen.getByTestId('icon-image')).toBeInTheDocument();
    });

    it('should render the select image button', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      expect(screen.getByText('Select Image')).toBeInTheDocument();
    });

    it('should render upload icon in select button', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      expect(screen.getByTestId('icon-upload')).toBeInTheDocument();
    });
  });

  describe('File Validation', () => {
    it('should reject non-image files', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      // Directly set files and dispatch change event
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(screen.getByText('Please select an image file')).toBeInTheDocument();
      });
    });

    it('should reject files larger than 5MB', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      // Create a mock large file
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });
      
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [largeFile],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(screen.getByText('Image must be less than 5MB')).toBeInTheDocument();
      });
    });

    it('should accept valid image files', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [validFile],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      // Should not show error
      await waitFor(() => {
        expect(screen.queryByText('Please select an image file')).not.toBeInTheDocument();
        expect(screen.queryByText('Image must be less than 5MB')).not.toBeInTheDocument();
      });
      
      // Should call onImageSelected after FileReader completes
      await waitFor(() => {
        expect(mockOnImageSelected).toHaveBeenCalledWith('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD');
      });
    });

    it('should clear previous errors on valid file selection', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      // First, upload invalid file
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(input, 'files', {
        value: [invalidFile],
        configurable: true,
      });
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(screen.getByText('Please select an image file')).toBeInTheDocument();
      });
      
      // Then upload valid file
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(input, 'files', {
        value: [validFile],
        configurable: true,
      });
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(screen.queryByText('Please select an image file')).not.toBeInTheDocument();
      });
    });
  });

  describe('Current Image Display', () => {
    it('should display current image when provided', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'test-url');
    });

    it('should render image with correct styling', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveClass('max-h-64', 'mx-auto', 'rounded-md', 'object-contain');
    });

    it('should render remove button when image is displayed', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      expect(screen.getByRole('button', { name: /remove image/i })).toBeInTheDocument();
    });

    it('should render cross icon in remove button', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      expect(screen.getByTestId('icon-cross')).toBeInTheDocument();
    });

    it('should show replacement instructions when image is displayed', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      expect(screen.getByText('Click the image to replace it or the X to remove it')).toBeInTheDocument();
    });

    it('should not show select button when image is displayed', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      expect(screen.queryByText('Select Image')).not.toBeInTheDocument();
    });
  });

  describe('Image Removal', () => {
    it('should remove image when remove button is clicked', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      const removeButton = screen.getByRole('button', { name: /remove image/i });
      fireEvent.click(removeButton);
      
      expect(mockOnImageSelected).toHaveBeenCalledWith('');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should show upload area after removing image', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      const removeButton = screen.getByRole('button', { name: /remove image/i });
      fireEvent.click(removeButton);
      
      expect(screen.getByText('Drag and drop an image, or')).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should handle file selection via input', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(mockOnImageSelected).toHaveBeenCalledWith('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD');
      });
    });

    it('should handle file selection via select button', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      // Click the select button (which is a label)
      const selectButton = screen.getByText('Select Image');
      fireEvent.click(selectButton);
      
      // Then simulate file selection
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(mockOnImageSelected).toHaveBeenCalledWith('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD');
      });
    });

    it('should display preview after file selection', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        const previewImage = screen.getByRole('img');
        expect(previewImage).toHaveAttribute('src', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD');
      });
    });

    it('should handle multiple files by taking the first one', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file1, file2],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(mockOnImageSelected).toHaveBeenCalledWith('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD');
      });
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag over event', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      // Target the correct drag area element
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      
      fireEvent.dragOver(uploadArea!, { dataTransfer: { files: [] } });
      
      expect(uploadArea).toHaveClass('border-primary', 'bg-primary/5');
    });

    it('should handle drag leave event', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      
      // First drag over
      fireEvent.dragOver(uploadArea!, { dataTransfer: { files: [] } });
      expect(uploadArea).toHaveClass('border-primary', 'bg-primary/5');
      
      // Then drag leave
      fireEvent.dragLeave(uploadArea!, { dataTransfer: { files: [] } });
      expect(uploadArea).toHaveClass('border-input');
      expect(uploadArea).not.toHaveClass('border-primary', 'bg-primary/5');
    });

    it('should handle file drop', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      fireEvent.drop(uploadArea!, {
        dataTransfer: {
          files: [file],
        },
      });
      
      await waitFor(() => {
        expect(mockOnImageSelected).toHaveBeenCalledWith('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD');
      });
    });

    it('should reset drag state after drop', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      // First drag over
      fireEvent.dragOver(uploadArea!, { dataTransfer: { files: [] } });
      expect(uploadArea).toHaveClass('border-primary', 'bg-primary/5');
      
      // Then drop
      fireEvent.drop(uploadArea!, {
        dataTransfer: {
          files: [file],
        },
      });
      
      expect(uploadArea).toHaveClass('border-input');
      expect(uploadArea).not.toHaveClass('border-primary', 'bg-primary/5');
    });

    it('should handle drop with no files', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      
      fireEvent.drop(uploadArea!, {
        dataTransfer: {
          files: [],
        },
      });
      
      expect(mockOnImageSelected).not.toHaveBeenCalled();
    });

    it('should validate dropped files', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      // Reset mock before this test
      mockOnImageSelected.mockClear();
      
      fireEvent.drop(uploadArea!, {
        dataTransfer: {
          files: [file],
        },
      });
      
      await waitFor(() => {
        expect(screen.getByText('Please select an image file')).toBeInTheDocument();
      });
      
      // Since validation fails early, onImageSelected should not be called
      // Wait a bit to ensure any async FileReader operations would have completed
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(mockOnImageSelected).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error with proper styling', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        const errorElement = screen.getByText('Please select an image file');
        expect(errorElement).toHaveClass('text-sm', 'text-red-500');
      });
    });

    it('should handle FileReader errors gracefully', async () => {
      // Mock FileReader to throw an error
      global.FileReader = class {
        result: string | null = null;
        onloadend: (() => void) | null = null;
        onerror: (() => void) | null = null;
        
        readAsDataURL() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror();
            }
          }, 0);
        }
      } as any;

      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      // Should not crash or call onImageSelected
      await waitFor(() => {
        expect(mockOnImageSelected).not.toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for remove button', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      const removeButton = screen.getByRole('button', { name: /remove image/i });
      expect(removeButton).toHaveAttribute('aria-label', 'Remove image');
    });

    it('should have screen reader text for remove button', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      expect(screen.getByText('Remove image')).toHaveClass('sr-only');
    });

    it('should have proper alt text for preview image', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Preview');
    });

    it('should have proper labels for file inputs', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const input = screen.getByLabelText(/browse/i);
      expect(input).toBeInTheDocument();
    });

    it('should have aria-hidden on decorative icons', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const uploadIcon = screen.getByTestId('icon-upload');
      expect(uploadIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have role="alert" for error messages', async () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const input = screen.getByLabelText(/browse/i) as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        const errorElement = screen.getByText('Please select an image file');
        expect(errorElement).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('File Input Attributes', () => {
    it('should have correct accept attribute', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const input = document.querySelector('input[type="file"]');
      expect(input).toHaveAttribute('accept', 'image/*');
    });

    it('should have correct id attribute', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const input = document.querySelector('input[type="file"]');
      expect(input).toHaveAttribute('id', 'image-upload');
    });

    it('should be hidden', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const input = document.querySelector('input[type="file"]');
      expect(input).toHaveClass('hidden');
    });
  });

  describe('Button Styling', () => {
    it('should have correct styling for select image button', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const selectButton = screen.getByText('Select Image');
      expect(selectButton).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-md',
        'bg-primary',
        'px-4',
        'py-2',
        'text-sm',
        'font-medium',
        'text-primary-foreground',
        'shadow',
        'hover:bg-primary/90',
        'cursor-pointer'
      );
    });

    it('should have correct styling for remove button', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} currentImage="test-url" />);
      
      const removeButton = screen.getByRole('button', { name: /remove image/i });
      expect(removeButton).toHaveClass(
        'absolute',
        'top-2',
        'right-2',
        'p-1',
        'rounded-full',
        'bg-background/80',
        'text-foreground',
        'hover:bg-background'
      );
    });
  });

  describe('Layout and Spacing', () => {
    it('should have correct spacing classes', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const container = screen.getByText('Drag and drop an image, or').closest('.space-y-4');
      expect(container).toHaveClass('space-y-4');
    });

    it('should have correct padding and layout for upload area', () => {
      render(<ImageUploader onImageSelected={mockOnImageSelected} />);
      
      const uploadArea = screen.getByText('Drag and drop an image, or').closest('div')?.parentElement?.parentElement;
      expect(uploadArea).toHaveClass('p-6', 'text-center');
      
      const contentArea = screen.getByText('Drag and drop an image, or').closest('.space-y-4');
      expect(contentArea).toHaveClass('py-4');
    });
  });
});