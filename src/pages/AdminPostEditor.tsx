import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router';

export function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const handleSave = () => {
    // TODO: Implement save functionality
    navigate('/admin/dashboard');
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <span className="mr-1">←</span>
              Back to Dashboard
            </Link>
            <h1 className="text-lg font-bold text-foreground">
              {isEdit ? 'Edit Post' : 'Create New Post'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-accent text-foreground"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {isEdit ? 'Update' : 'Create'} Post
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter post title..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="text-sm font-medium text-foreground">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              placeholder="Enter post excerpt..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Content
            </label>
            <textarea
              id="content"
              rows={15}
              placeholder="Write your post content here..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium text-foreground">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                placeholder="React, TypeScript, Web Development"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-foreground">
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="coverImage" className="text-sm font-medium text-foreground">
              Cover Image URL
            </label>
            <input
              id="coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}