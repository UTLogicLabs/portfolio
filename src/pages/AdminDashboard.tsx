import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useBlogStore } from '../hooks/useBlogStore';
// Using simple symbols instead of icons for now

export function AdminDashboard() {
  const { logout, user } = useAdminAuth();
  const { posts, tags, stats, deletePost } = useBlogStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditPost = (id: string) => {
    navigate(`/admin/post/${id}`);
  };

  const handleCreatePost = () => {
    navigate('/admin/post');
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <span className="mr-1">←</span>
              Back to Website
            </Link>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Logged in as {user?.username}
            </span>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              <span className="mr-1">↗</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Dashboard</h2>
                <nav className="flex flex-col space-y-1">
                  <button 
                    onClick={() => setActiveTab('stats')}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      activeTab === 'stats' ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    <span>📊</span>
                    <span>Statistics</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('posts')}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      activeTab === 'posts' ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    <span>📝</span>
                    <span>Posts</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('tags')}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      activeTab === 'tags' ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    <span>🏷️</span>
                    <span>Tags</span>
                  </button>
                </nav>
              </div>
              <div className="pt-4 border-t">
                <button 
                  onClick={handleCreatePost}
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  <span className="mr-2">+</span>
                  New Post
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Blog Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total Posts
                    </div>
                    <div className="text-2xl font-bold">{stats.totalPosts}</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">
                      Published
                    </div>
                    <div className="text-2xl font-bold">{stats.publishedPosts}</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">
                      Drafts
                    </div>
                    <div className="text-2xl font-bold">{stats.draftPosts}</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total Views
                    </div>
                    <div className="text-2xl font-bold">{stats.totalViews}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.popularTags.map(tag => (
                      <div key={tag.id} className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm">
                        {tag.name}
                        <span className="inline-flex items-center justify-center rounded-full bg-muted w-5 h-5 text-xs">
                          {tag.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recent Posts</h3>
                  <div className="space-y-2">
                    {posts.slice(0, 5).map(post => (
                      <div key={post.id} className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                        <div className="flex items-center gap-2">
                          {post.status === 'published' ? (
                            <span className="text-green-500">👁️</span>
                          ) : (
                            <span className="text-amber-500">🔒</span>
                          )}
                          <span>{post.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {post.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Posts</h2>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Search posts..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-md border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No posts found.
                    </div>
                  ) : (
                    filteredPosts.map(post => (
                      <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img 
                              src={post.coverImage} 
                              alt={post.title}
                              className="object-cover w-full h-full" 
                            />
                          </div>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                post.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {post.status === 'published' ? 'Published' : 'Draft'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {post.date}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {post.views} views
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditPost(post.id)}
                            className="p-2 rounded-md hover:bg-accent"
                          >
                            <span>✏️</span>
                            <span className="sr-only">Edit</span>
                          </button>
                          <button 
                            onClick={() => deletePost(post.id)}
                            className="p-2 rounded-md hover:bg-accent text-red-500 hover:text-red-600"
                          >
                            <span>🗑️</span>
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tags Tab */}
            {activeTab === 'tags' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Tags</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center justify-between p-3 rounded-md border bg-card text-card-foreground shadow-sm">
                      <div className="font-medium">{tag.name}</div>
                      <div className="inline-flex items-center justify-center rounded-full bg-accent px-2 text-sm">
                        {tag.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}