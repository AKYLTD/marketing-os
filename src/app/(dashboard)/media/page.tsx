'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X, Trash2, Clock, Send, Loader2, ChevronDown, Copy, Check } from 'lucide-react';

type Channel = 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn' | 'X';
type ContentType = 'image' | 'video' | 'reel' | 'story' | 'carousel';
type PostStatus = 'draft' | 'scheduled' | 'published';

interface Post {
  id: string;
  title: string;
  content: string;
  platform: string;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  reach?: number;
  impressions?: number;
  engagement?: number;
  clicks?: number;
  mediaUrls?: string[];
  createdAt?: string;
}

interface CreatePost {
  uploadedFile: string | null;
  uploadedFileName: string;
  topicText: string;
  selectedChannels: Channel[];
  contentType: ContentType;
  caption: string;
  hashtags: string;
  scheduleMode: 'now' | 'schedule';
  scheduledDate: string;
  scheduledTime: string;
}

const CHANNEL_EMOJIS: Record<Channel, string> = {
  Instagram: '📷',
  TikTok: '🎵',
  Facebook: 'f',
  LinkedIn: '🔗',
  X: '𝕏',
};

const CHANNEL_COLORS: Record<Channel, string> = {
  Instagram: '#E1306C',
  TikTok: '#000000',
  Facebook: '#1877F2',
  LinkedIn: '#0A66C2',
  X: '#000000',
};

export default function MediaPage() {
  // Create Post State
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [topicText, setTopicText] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['Instagram']);
  const [contentType, setContentType] = useState<ContentType>('image');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Content Library State
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');
  const [filterContentType, setFilterContentType] = useState<string>('all');
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Detail Modal State
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingCaption, setEditingCaption] = useState('');
  const [editingHashtags, setEditingHashtags] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);

  // UI State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragZoneRef = useRef<HTMLDivElement>(null);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts
  useEffect(() => {
    let filtered = posts;

    if (filterChannel !== 'all') {
      filtered = filtered.filter(p => p.platform.toLowerCase() === filterChannel.toLowerCase());
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (filterContentType !== 'all') {
      // Check if mediaUrls contains the content type indicator
      const hasContentType = filtered.filter(p => {
        const urls = p.mediaUrls || [];
        return urls.some(url => url.includes(filterContentType));
      });
      filtered = hasContentType;
    }

    setFilteredPosts(filtered);
  }, [posts, filterChannel, filterStatus, filterContentType]);

  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await fetch('/api/posts');

      if (response.ok) {
        const data = await response.json();
        const postsList = Array.isArray(data) ? data : data.posts || [];
        setPosts(postsList);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragZoneRef.current) {
      dragZoneRef.current.style.borderColor = 'var(--accent)';
      dragZoneRef.current.style.backgroundColor = 'var(--accent-bg)';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragZoneRef.current) {
      dragZoneRef.current.style.borderColor = 'var(--border)';
      dragZoneRef.current.style.backgroundColor = 'transparent';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragZoneRef.current) {
      dragZoneRef.current.style.borderColor = 'var(--border)';
      dragZoneRef.current.style.backgroundColor = 'transparent';
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Only images and videos are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setUploadedFile(base64);
      setUploadedFileName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Channel Toggle
  const toggleChannel = (channel: Channel) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // Generate AI Caption
  const handleGenerateWithAI = async () => {
    if (!topicText.trim()) {
      setError('Please enter a topic or description');
      return;
    }

    if (selectedChannels.length === 0) {
      setError('Please select at least one channel');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const channelList = selectedChannels.join(', ');
      const prompt = `Create a social media post for ${channelList}. Topic: ${topicText}. Generate an engaging caption with relevant hashtags. Format: Return the caption text followed by a new line, then the hashtags starting with #.`;

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate caption');

      const data = await response.json();
      const reply = data.reply || '';

      // Parse the AI response: caption + hashtags
      const parts = reply.split('\n');
      let captionText = '';
      let hashtagsText = '';

      // Find where hashtags start
      let hashtagStartIdx = -1;
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].trim().startsWith('#')) {
          hashtagStartIdx = i;
          break;
        }
      }

      if (hashtagStartIdx > -1) {
        captionText = parts.slice(0, hashtagStartIdx).join('\n').trim();
        hashtagsText = parts.slice(hashtagStartIdx).join(' ').trim();
      } else {
        captionText = reply.trim();
      }

      setCaption(captionText);
      setHashtags(hashtagsText);
      setSuccess('AI generated your caption!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate caption');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save/Publish Post
  const handleSavePost = async (status: PostStatus) => {
    if (!caption.trim()) {
      setError('Please add a caption');
      return;
    }

    if (selectedChannels.length === 0) {
      setError('Please select at least one channel');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const fullContent = `${caption}\n\n${hashtags}`;
      const scheduledDateTime = status === 'scheduled' && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined;

      // Save to each selected channel
      for (const channel of selectedChannels) {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: topicText || `Post ${new Date().toLocaleDateString()}`,
            content: fullContent,
            platform: channel,
            status: status,
            scheduledAt: scheduledDateTime,
            mediaUrls: uploadedFile ? [uploadedFile] : [],
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save post for ${channel}`);
        }
      }

      setSuccess(
        status === 'scheduled'
          ? `Post scheduled for ${scheduledDate} at ${scheduledTime}!`
          : 'Post published successfully!'
      );

      // Reset form
      setUploadedFile(null);
      setUploadedFileName('');
      setTopicText('');
      setCaption('');
      setHashtags('');
      setScheduledDate('');
      setScheduledTime('09:00');

      // Refresh posts
      await fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  // Update existing post
  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    try {
      setIsSaving(true);
      setError(null);

      const fullContent = `${editingCaption}\n\n${editingHashtags}`;

      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPost.id,
          content: fullContent,
          status: selectedPost.status,
        }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      setSuccess('Post updated successfully!');
      setIsEditingPost(false);
      setSelectedPost(null);
      await fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId }),
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setSuccess('Post deleted successfully!');
      setSelectedPost(null);
      await fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const getStatusColor = (status: PostStatus): string => {
    switch (status) {
      case 'draft':
        return 'tag-amber';
      case 'scheduled':
        return 'tag-blue';
      case 'published':
        return 'tag-green';
      default:
        return 'tag-blue';
    }
  };

  const getStatusLabel = (status: PostStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="page-title">Media Studio</h1>
          <p className="page-subtitle">
            Create AI-powered content for all your channels
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Error & Success Messages */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg border" style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'var(--red)',
            color: 'var(--red)',
          }}>
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-lg border" style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'var(--green)',
            color: 'var(--green)',
          }}>
            <span>✓</span>
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X size={18} />
            </button>
          </div>
        )}

        {/* CREATE POST SECTION */}
        <div className="card space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="section-title">Create New Post</h2>
            <p style={{ color: 'var(--text3)', fontSize: '13px', marginTop: '4px' }}>
              Upload content, generate with AI, and publish in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Upload Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Area */}
              <div
                ref={dragZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg3)',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      {uploadedFile.startsWith('data:video/') ? (
                        <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center text-4xl">
                          🎬
                        </div>
                      ) : (
                        <img
                          src={uploadedFile}
                          alt="Upload preview"
                          className="w-40 h-40 object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                          setUploadedFileName('');
                        }}
                        className="absolute -top-2 -right-2 p-1 rounded-full"
                        style={{ backgroundColor: 'var(--red)' }}
                      >
                        <X size={16} color="white" />
                      </button>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text2)', fontWeight: 500 }}>
                        {uploadedFileName}
                      </p>
                      <p style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '4px' }}>
                        Click to replace or drag another file
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload size={32} style={{ color: 'var(--accent)', margin: '0 auto' }} />
                    <div>
                      <p style={{ color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>
                        Drag & drop your image or video here
                      </p>
                      <p style={{ color: 'var(--text3)', fontSize: '12px' }}>
                        or click to browse from your computer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Topic Input */}
              <div>
                <label className="form-label">Post Topic or Idea</label>
                <textarea
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  placeholder="e.g., New sourdough bagels for spring menu, product launch announcement, team celebration"
                  rows={3}
                  className="form-input"
                />
              </div>

              {/* Channel Selection */}
              <div>
                <label className="form-label">Select Channels</label>
                <div className="flex flex-wrap gap-2">
                  {(['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'X'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center gap-2 ${
                        selectedChannels.includes(ch)
                          ? 'border-transparent text-white'
                          : 'border'
                      }`}
                      style={{
                        backgroundColor: selectedChannels.includes(ch)
                          ? CHANNEL_COLORS[ch]
                          : 'var(--bg2)',
                        borderColor: selectedChannels.includes(ch) ? CHANNEL_COLORS[ch] : 'var(--border)',
                        color: selectedChannels.includes(ch) ? 'white' : 'var(--text)',
                      }}
                    >
                      <span>{CHANNEL_EMOJIS[ch]}</span>
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Type */}
              <div>
                <label className="form-label">Content Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['image', 'video', 'reel', 'story', 'carousel'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setContentType(type)}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                        contentType === type
                          ? 'border-accent'
                          : 'border'
                      }`}
                      style={{
                        backgroundColor: contentType === type ? 'var(--accent-bg)' : 'var(--bg2)',
                        borderColor: contentType === type ? 'var(--accent)' : 'var(--border)',
                        color: contentType === type ? 'var(--accent)' : 'var(--text2)',
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Generate Button & Preview */}
            <div className="space-y-6">
              {/* Generate with AI Button */}
              <button
                onClick={handleGenerateWithAI}
                disabled={isGenerating || !topicText.trim()}
                className="w-full btn btn-primary text-base font-semibold py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: 'var(--gradient)',
                  opacity: isGenerating || !topicText.trim() ? 0.5 : 1,
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    ✨ Generate with AI
                  </>
                )}
              </button>

              {/* Caption Preview */}
              {caption && (
                <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg3)' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text2)' }}>
                    AI Generated Caption
                  </p>
                  <p style={{ color: 'var(--text)', fontSize: '13px', lineHeight: 1.5 }}>
                    {caption}
                  </p>
                  {hashtags && (
                    <div style={{ color: 'var(--accent)', fontSize: '13px', wordBreak: 'break-word' }}>
                      {hashtags}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Editable Caption & Hashtags */}
          {caption && (
            <div className="space-y-4 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="section-title">Review & Edit</h3>

              <div>
                <label className="form-label">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Hashtags</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#hashtag #social #marketing"
                  className="form-input"
                />
              </div>

              {/* Schedule Options */}
              <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg3)' }}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="now"
                    name="schedule"
                    checked={scheduleMode === 'now'}
                    onChange={() => setScheduleMode('now')}
                  />
                  <label htmlFor="now" style={{ color: 'var(--text)', cursor: 'pointer' }}>
                    Post Now
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="schedule"
                    name="schedule"
                    checked={scheduleMode === 'schedule'}
                    onChange={() => setScheduleMode('schedule')}
                  />
                  <label htmlFor="schedule" style={{ color: 'var(--text)', cursor: 'pointer' }}>
                    Schedule for Later
                  </label>
                </div>

                {scheduleMode === 'schedule' && (
                  <div className="grid grid-cols-2 gap-3 mt-4 ml-6">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSavePost('draft')}
                  disabled={isSaving}
                  className="btn btn-secondary"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() =>
                    handleSavePost(scheduleMode === 'schedule' ? 'scheduled' : 'published')
                  }
                  disabled={isSaving || (scheduleMode === 'schedule' && (!scheduledDate || !scheduledTime))}
                  className="btn btn-primary"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : scheduleMode === 'schedule' ? (
                    <>
                      <Clock size={16} />
                      Schedule Post
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Publish Now
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT LIBRARY SECTION */}
        <div className="space-y-6">
          <div>
            <h2 className="section-title">Content Library</h2>
            <p style={{ color: 'var(--text3)', fontSize: '13px', marginTop: '4px' }}>
              {posts.length === 0
                ? 'No posts yet. Create your first AI-powered post above!'
                : `${posts.length} post${posts.length !== 1 ? 's' : ''} total`}
            </p>
          </div>

          {/* Filters */}
          {posts.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="form-label block mb-2">Channel</label>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Channels</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X (Twitter)</option>
                </select>
              </div>

              <div>
                <label className="form-label block mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="form-input"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {isLoadingPosts ? (
            <div className="flex items-center justify-center py-12">
              <div style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={18} className="animate-spin" />
                Loading posts...
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: 'var(--text2)' }}>
                {posts.length === 0
                  ? 'No posts yet. Create your first AI-powered post above!'
                  : 'No posts match your filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setEditingCaption(post.content?.split('\n\n')[0] || '');
                    setEditingHashtags(post.content?.split('\n\n')[1] || '');
                    setIsEditingPost(false);
                  }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Thumbnail */}
                  <div
                    className="h-40 flex items-center justify-center text-4xl relative"
                    style={{
                      backgroundColor: `hsl(${Math.random() * 360}, 70%, 85%)`,
                      backgroundImage: post.mediaUrls?.[0]?.startsWith('data:')
                        ? `url(${post.mediaUrls[0]})`
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!post.mediaUrls?.[0] && '📱'}

                    {/* Channel Badge */}
                    <div
                      className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 text-white"
                      style={{ backgroundColor: CHANNEL_COLORS[post.platform as Channel] || 'var(--text3)' }}
                    >
                      {CHANNEL_EMOJIS[post.platform as Channel] || '📱'}
                      {post.platform}
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute bottom-2 left-2 tag ${getStatusColor(post.status)}`}>
                      {getStatusLabel(post.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--text)' }}>
                      {post.title}
                    </h3>

                    <p
                      className="text-xs line-clamp-2"
                      style={{ color: 'var(--text3)' }}
                    >
                      {post.content?.split('\n\n')[0]}
                    </p>

                    {/* Engagement Stats */}
                    {post.status === 'published' && (post.reach || post.impressions || post.engagement) && (
                      <div className="text-xs flex gap-4" style={{ color: 'var(--text2)' }}>
                        {post.reach && <span>👁️ {post.reach}</span>}
                        {post.impressions && <span>📊 {post.impressions}</span>}
                        {post.engagement && <span>💬 {post.engagement}</span>}
                      </div>
                    )}

                    {/* Date */}
                    {(post.publishedAt || post.scheduledAt) && (
                      <p className="text-xs" style={{ color: 'var(--text3)' }}>
                        {post.scheduledAt && `Scheduled: ${new Date(post.scheduledAt).toLocaleDateString()}`}
                        {post.publishedAt && `Published: ${new Date(post.publishedAt).toLocaleDateString()}`}
                      </p>
                    )}

                    <button
                      className="w-full btn btn-secondary btn-sm mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                        setEditingCaption(post.content?.split('\n\n')[0] || '');
                        setEditingHashtags(post.content?.split('\n\n')[1] || '');
                        setIsEditingPost(false);
                      }}
                    >
                      View & Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POST DETAIL MODAL */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between mb-6 p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="section-title">{selectedPost.title}</h2>
              <button onClick={() => setSelectedPost(null)} className="p-1">
                <X size={20} style={{ color: 'var(--text2)' }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text3)' }}>
                    Status
                  </p>
                  <div className={`tag ${getStatusColor(selectedPost.status)}`}>
                    {getStatusLabel(selectedPost.status)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text3)' }}>
                    Platform
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      backgroundColor: CHANNEL_COLORS[selectedPost.platform as Channel] || 'var(--text3)',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {CHANNEL_EMOJIS[selectedPost.platform as Channel] || '📱'}
                    {selectedPost.platform}
                  </div>
                </div>
              </div>

              {/* Social Preview */}
              <div
                className="border rounded-lg p-4"
                style={{ backgroundColor: 'var(--bg3)', borderColor: 'var(--border)' }}
              >
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text2)' }}>
                  Social Media Preview
                </p>
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: 'var(--bg2)',
                    border: `1px solid var(--border)`,
                  }}
                >
                  {/* Mock social frame header */}
                  <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: `1px solid var(--border)` }}>
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: 'var(--gradient)',
                      }}
                    />
                    <div className="text-xs">
                      <p style={{ fontWeight: 600, color: 'var(--text)' }}>Your Brand</p>
                      <p style={{ color: 'var(--text3)' }}>@yourbrand</p>
                    </div>
                  </div>

                  {/* Media preview */}
                  {selectedPost.mediaUrls?.[0]?.startsWith('data:') ? (
                    selectedPost.mediaUrls[0].startsWith('data:video/') ? (
                      <div className="h-32 bg-black rounded mb-3 flex items-center justify-center text-3xl">
                        ▶️
                      </div>
                    ) : (
                      <img
                        src={selectedPost.mediaUrls[0]}
                        alt="Post preview"
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )
                  ) : (
                    <div
                      className="h-32 rounded mb-3 flex items-center justify-center text-3xl"
                      style={{
                        backgroundColor: `hsl(${Math.random() * 360}, 70%, 85%)`,
                      }}
                    >
                      📱
                    </div>
                  )}

                  {/* Caption */}
                  <p style={{ color: 'var(--text)', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>
                    {editingCaption}
                  </p>

                  {/* Hashtags */}
                  {editingHashtags && (
                    <p style={{ color: 'var(--accent)', fontSize: '12px', marginBottom: '12px' }}>
                      {editingHashtags}
                    </p>
                  )}

                  {/* Social interactions */}
                  <div className="flex gap-3 text-lg">
                    <span>❤️</span>
                    <span>💬</span>
                    <span>📤</span>
                  </div>
                </div>
              </div>

              {/* Edit Mode */}
              {isEditingPost ? (
                <div className="space-y-4 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="section-title">Edit Content</h3>

                  <div>
                    <label className="form-label">Caption</label>
                    <textarea
                      value={editingCaption}
                      onChange={(e) => setEditingCaption(e.target.value)}
                      rows={4}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Hashtags</label>
                    <input
                      type="text"
                      value={editingHashtags}
                      onChange={(e) => setEditingHashtags(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditingPost(false)}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePost}
                      disabled={isSaving}
                      className="btn btn-primary flex-1"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setIsEditingPost(true)}
                    className="btn btn-secondary flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(selectedPost.id)}
                    className="btn btn-secondary"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="btn btn-primary flex-1"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
