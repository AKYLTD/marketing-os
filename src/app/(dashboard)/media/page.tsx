'use client';

import { useState, useEffect } from 'react';
import { Eye, Edit3, Plus, X, Trash2 } from 'lucide-react';

interface MediaItem {
  id: string;
  channel: 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn';
  status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Scheduled';
  title: string;
  caption: string;
  gradient: string;
  type: 'image' | 'video' | 'story' | 'reel';
  views?: number;
  likes?: number;
  comments?: number;
  postedDate?: string;
  scheduledDate?: string;
}

export default function MediaPage() {
  const [filter, setFilter] = useState<'All' | 'Images' | 'Videos' | 'Stories' | 'Reels'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    caption: '',
    channel: 'Instagram' as const,
    type: 'image' as const,
    status: 'Draft' as const,
  });

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');

        if (response.ok) {
          const data = await response.json();
          setMediaItems(Array.isArray(data) ? data : data.posts || []);
        } else {
          throw new Error('Failed to fetch posts');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getChannelBadge = (channel: string) => {
    const badges: Record<string, string> = {
      Instagram: '📷',
      TikTok: '🎵',
      Facebook: 'f',
      LinkedIn: 'in',
    };
    return badges[channel] || channel;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Draft':
        return 'tag-amber';
      case 'Review':
        return 'tag-blue';
      case 'Approved':
        return 'tag-green';
      case 'Published':
        return 'tag-green';
      case 'Scheduled':
        return 'tag-amber';
      default:
        return 'tag-blue';
    }
  };

  const filteredMedia = mediaItems.filter((item) => {
    const typeMatch =
      filter === 'All' ||
      (filter === 'Images' && item.type === 'image') ||
      (filter === 'Videos' && item.type === 'video') ||
      (filter === 'Stories' && item.type === 'story') ||
      (filter === 'Reels' && item.type === 'reel');

    const statusMatch =
      statusFilter === 'All Statuses' ||
      item.status === statusFilter;

    return typeMatch && statusMatch;
  });

  const handleSuggestCaptions = () => {
    setSuggestedCaptions([
      'Just baked perfection awaiting your tastebuds! Fresh from our ovens.',
      'Craving something golden and delicious? We\'ve got you covered.',
      'Every bite tells a story of craftsmanship, tradition, and love.',
    ]);
  };

  const isEditableStatus = (status: string) => {
    return status === 'Draft' || status === 'Review' || status === 'Scheduled';
  };

  const handleSaveCaption = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editingCaption }),
      });

      if (response.ok) {
        setMediaItems(items =>
          items.map(item =>
            item.id === postId ? { ...item, caption: editingCaption } : item
          )
        );
        if (selectedMedia?.id === postId) {
          setSelectedMedia({ ...selectedMedia, caption: editingCaption });
        }
      } else {
        setError('Failed to save caption');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save caption');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMediaItems(items => items.filter(item => item.id !== postId));
        setSelectedMedia(null);
      } else {
        setError('Failed to delete post');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.caption.trim()) {
      setError('Title and caption are required');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          gradient: 'from-purple-600 to-pink-500',
        }),
      });

      if (response.ok) {
        const createdPost = await response.json();
        setMediaItems([...mediaItems, createdPost]);
        setShowCreateModal(false);
        setNewPost({
          title: '',
          caption: '',
          channel: 'Instagram',
          type: 'image',
          status: 'Draft',
        });
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="page-title">Media Studio</h1>
            <p className="page-subtitle">
              Create, edit, and preview your content across channels
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p style={{ color: 'var(--text2)' }}>Loading your media...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="page-title">Media Studio</h1>
          <p className="page-subtitle">
            Create, edit, and preview your content across channels
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Images', 'Videos', 'Stories', 'Reels'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`btn btn-sm ${
                  filter === type ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input max-w-xs"
            >
              <option>All Statuses</option>
              <option>Draft</option>
              <option>Review</option>
              <option>Approved</option>
              <option>Published</option>
              <option>Scheduled</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text2)' }} className="mb-4">
              {mediaItems.length === 0 ? 'No posts yet. Create your first post!' : 'No posts match your filters'}
            </p>
          </div>
        ) : (
          /* Content Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => {
                  setSelectedMedia(media);
                  setEditingCaption(media.caption);
                }}
              >
                {/* Thumbnail */}
                <div
                  className={`relative h-40 bg-gradient-to-br ${media.gradient} flex items-center justify-center overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="text-4xl opacity-50">{media.type === 'video' ? '🎬' : '🖼️'}</span>
                  </div>

                  {/* Channel Badge */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold">
                    {getChannelBadge(media.channel)} {media.channel}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute bottom-2 left-2 tag ${getStatusColor(media.status)}`}>
                    {media.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">{media.title}</h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text3)' }}>
                    {media.caption}
                  </p>

                  {/* Engagement Row */}
                  {media.status === 'Published' && (
                    <div className="flex gap-3 mb-3 text-xs" style={{ color: 'var(--text2)' }}>
                      <span>👁 {media.views || 0}</span>
                      <span>❤️ {media.likes || 0}</span>
                      <span>💬 {media.comments || 0}</span>
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-xs mb-4" style={{ color: 'var(--text2)' }}>
                    {media.postedDate && `Posted: ${media.postedDate}`}
                    {media.scheduledDate && `Scheduled: ${media.scheduledDate}`}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isEditableStatus(media.status) && (
                      <button className="btn btn-sm btn-secondary flex-1 flex items-center justify-center gap-1">
                        <Edit3 size={14} />
                        Edit
                      </button>
                    )}
                    <button className="btn btn-sm btn-secondary flex-1 flex items-center justify-center gap-1">
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="section-title">{selectedMedia.title}</h2>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Preview */}
              <div className={`bg-gradient-to-br ${selectedMedia.gradient} h-64 rounded-lg mb-6 flex items-center justify-center`}>
                <span className="text-6xl opacity-50">{selectedMedia.type === 'video' ? '🎬' : '🖼️'}</span>
              </div>

              {/* Social Frame Preview */}
              <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text2)' }}>
                  How it will look on {selectedMedia.channel}
                </p>
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
                    <div className="text-xs">
                      <p className="font-semibold">Your Brand</p>
                      <p style={{ color: 'var(--text2)' }}>@yourbrand</p>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-br ${selectedMedia.gradient} h-32 rounded mb-2 flex items-center justify-center`}>
                    <span className="text-4xl opacity-50">{selectedMedia.type === 'video' ? '▶️' : ''}</span>
                  </div>
                  <div className="flex gap-3 text-lg">
                    <span>❤️</span>
                    <span>💬</span>
                    <span>📤</span>
                  </div>
                </div>
              </div>

              {/* Caption Edit Section */}
              {isEditableStatus(selectedMedia.status) && (
                <div className="mb-6">
                  <label className="form-label">Caption</label>
                  <textarea
                    value={editingCaption}
                    onChange={(e) => setEditingCaption(e.target.value)}
                    rows={4}
                    className="form-input w-full mb-3"
                  />
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleSaveCaption(selectedMedia.id)}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      Save Caption
                    </button>
                    <button
                      onClick={() => handleDeletePost(selectedMedia.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleSuggestCaptions}
                    className="btn btn-secondary text-sm"
                  >
                    AI Suggest Captions
                  </button>

                  {suggestedCaptions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                        Suggested variations:
                      </p>
                      {suggestedCaptions.map((caption, idx) => (
                        <button
                          key={idx}
                          onClick={() => setEditingCaption(caption)}
                          className="block w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <p className="text-sm">{caption}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Close Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="btn btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="section-title mb-4">Create New Post</h2>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="form-input"
                    placeholder="Post title"
                  />
                </div>

                <div>
                  <label className="form-label">Caption</label>
                  <textarea
                    value={newPost.caption}
                    onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                    rows={4}
                    className="form-input"
                    placeholder="Post caption"
                  />
                </div>

                <div>
                  <label className="form-label">Channel</label>
                  <select
                    value={newPost.channel}
                    onChange={(e) => setNewPost({ ...newPost, channel: e.target.value as any })}
                    className="form-input"
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>Facebook</option>
                    <option>LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Type</label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({ ...newPost, type: e.target.value as any })}
                    className="form-input"
                  >
                    <option>image</option>
                    <option>video</option>
                    <option>story</option>
                    <option>reel</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="btn btn-primary flex-1"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 btn btn-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        title="Create new post"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
