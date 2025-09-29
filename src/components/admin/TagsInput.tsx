import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui';
import { useBlogStore } from '@/utils/BlogStore';

interface TagsInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ selectedTags, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { tags } = useBlogStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.trim()) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      const newTags = [...selectedTags];
      newTags.pop();
      onChange(newTags);
    }
  };

  const addTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Filter tags for suggestions
  const filteredTags = tags
    .filter(
      tag =>
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag.name)
    )
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 rounded-md border border-input bg-background min-h-[38px]">
        {selectedTags.map(tag => (
          <div
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-muted p-0.5"
              aria-label={`Remove ${tag}`}
            >
              <Icon name="cross" size={12} aria-hidden="true" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </div>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.trim() && setIsDropdownOpen(true)}
            placeholder={selectedTags.length === 0 ? 'Add tags...' : ''}
            className="w-full border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0"
          />
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 w-full rounded-md border border-input bg-background shadow-md"
            >
              {filteredTags.length > 0 ? (
                <div className="py-1">
                  {filteredTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => addTag(tag.name)}
                      className="flex w-full items-center justify-between px-3 py-1.5 text-sm hover:bg-accent"
                    >
                      <span>{tag.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {tag.count}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => addTag(inputValue.trim())}
                    className="flex w-full items-center justify-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                  >
                    <Icon name="plus" size={12} />
                    Create "{inputValue}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Press enter to add a tag, backspace to remove the last tag
      </p>
    </div>
  );
}