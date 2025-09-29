import { useState, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  currentImage?: string;
}

export function ImageUploader({
  onImageSelected,
  currentImage
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    setError(null);
    const file = files[0];

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageSelected('');
  };

  // For a real app, we'd upload to S3, Cloudinary, etc.
  // For this demo, we'll just use the data URL directly
  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-input hover:border-primary/50'
        }`}
      >
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-md object-contain" 
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground hover:bg-background"
              aria-label="Remove image"
            >
              <Icon name="cross" size={16} aria-hidden="true" />
              <span className="sr-only">Remove image</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Icon name="image" size={24} className="text-primary" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">
                Drag and drop an image, or{' '}
                <label htmlFor="image-upload" className="text-primary cursor-pointer hover:underline">
                  browse
                </label>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG or GIF up to 5MB
              </p>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      
      {!previewUrl && (
        <div className="text-center">
          <label
            htmlFor="image-upload"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 cursor-pointer"
          >
            <Icon name="upload" size={16} className="mr-2" aria-hidden="true" />
            Select Image
          </label>
        </div>
      )}
      
      {previewUrl && (
        <p className="text-xs text-center text-muted-foreground">
          Click the image to replace it or the X to remove it
        </p>
      )}
    </div>
  );
}