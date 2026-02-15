'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  channel: string;
  channelColor: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'queued' | 'scheduled' | 'published' | 'failed';
  thumbnail?: string;
}

const PLATFORM_COLORS: { [key: string]: string } = {
  instagram: '#E1306C',
  tiktok: '#000000',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  twitter: '#000000',
  'x (twitter)': '#000000',
  youtube: '#FF0000',
  pinterest: '#E60023',
  email: '#999999',
  'google business': '#4285F4',
};

interface Metric {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text2)]">{metric.label}</p>
          <p className="text-3xl font-bold mt-1">{metric.value}</p>
        </div>
        <div className="p-3 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)]">
          {metric.icon}
        </div>
      </div>
    </div>
  );
}

function PreviewModal({
  post,
  isOpen,
  onClose,
}: {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !post) return null;

  const getFrameClass = (channel: string) => {
    if (channel === 'Instagram') return 'aspect-square';
    if (channel === 'TikTok') return 'aspect-[9/16]';
    if (channel === 'Facebook' || channel === 'LinkedIn')
      return 'aspect-video';
    return 'aspect-square';
  };

  const getChannelName = (channel: string) => {
    const names: { [key: string]: string } = {
      Instagram: 'Instagram Post',
      TikTok: 'TikTok Video',
      Facebook: 'Facebook Post',
      LinkedIn: 'LinkedIn Article',
    };
    return names[channel] || channel;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Preview</h2>
            <p className="text-[var(--text2)] mt-1">{getChannelName(post.channel)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text2)] hover:text-[var(--text)]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-[var(--bg2)]">
          <div
            className={`${getFrameClass(post.channel)} rounded-lg bg-gradient-to-br from-[${post.channelColor}] to-[${post.channelColor}]/80 flex items-center justify-center text-white text-center p-4`}
            style={{
              backgroundImage: `linear-gradient(135deg, ${post.channelColor}, ${post.channelColor}80)`,
            }}
          >
            <div>
              <p className="text-2xl font-bold mb-2">{post.title}</p>
              <p className="text-sm opacity-75">
                Posted on {post.scheduledDate} at {post.scheduledTime}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm font-medium text-[var(--text2)]">Title</p>
            <p className="mt-1 text-[var(--text)]">{post.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text2)]">Channel</p>
            <p className="mt-1 text-[var(--text)]">{post.channel}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text2)]">
              Scheduled Date & Time
            </p>
            <p className="mt-1 text-[var(--text)]">
              {post.scheduledDate} at {post.scheduledTime}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PublishingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');

      if (res.status === 500) {
        // Database not ready - show empty state
        setPosts([]);
        setError(null);
      } else if (res.ok) {
        const data = await res.json();
        // Extract posts from wrapper object and map DB fields to interface
        const rawPosts = data.posts || [];
        const mappedPosts = rawPosts.map((post: any) => ({
          id: post.id,
          title: post.title || 'Untitled',
          channel: post.platform || 'Unknown',
          channelColor: PLATFORM_COLORS[post.platform?.toLowerCase()] || '#000000',
          scheduledDate: post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString() : new Date().toLocaleDateString(),
          scheduledTime: post.scheduledAt ? new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00',
          status: post.status || 'draft',
        }));
        setPosts(mappedPosts);
        setError(null);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (e) {
      console.error(e);
      setError('Error fetching posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const channels = [
    'All',
    ...Array.from(new Set(posts.map((p) => p.channel))),
  ];
  const statuses = [
    'All',
    'Queued',
    'Scheduled',
    'Published',
    'Failed',
  ];

  const filteredPosts = posts.filter((post) => {
    const channelMatch =
      filterChannel === 'All' || post.channel === filterChannel;
    const statusMatch =
      filterStatus === 'All' ||
      post.status === filterStatus.toLowerCase();
    return channelMatch && statusMatch;
  });

  const getStatusTag = (status: string) => {
    const configs: { [key: string]: string } = {
      queued: 'tag-amber',
      scheduled: 'tag-blue',
      published: 'tag-green',
      failed: 'tag-red',
    };
    const labels: { [key: string]: string } = {
      queued: 'Queued',
      scheduled: 'Scheduled',
      published: 'Published',
      failed: 'Failed',
    };
    return { color: configs[status], label: labels[status] };
  };

  const handlePreview = (post: Post) => {
    setPreviewPost(post);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      } else if (res.status === 500) {
        setError('Database error. Please try again later.');
      }
    } catch (e) {
      console.error(e);
      setError('Error deleting post');
    }
  };

  const getMetrics = (): Metric[] => {
    const queuedCount = posts.filter((p) => p.status === 'queued').length;
    const publishedCount = posts.filter((p) => p.status === 'published').length;
    const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

    return [
      {
        label: 'Queued',
        value: queuedCount,
        icon: <Clock className="h-5 w-5" />,
      },
      {
        label: 'Published This Week',
        value: publishedCount,
        icon: <CheckCircle className="h-5 w-5" />,
      },
      {
        label: 'In Review',
        value: 0,
        icon: <AlertCircle className="h-5 w-5" />,
      },
      {
        label: 'Scheduled',
        value: scheduledCount,
        icon: <Calendar className="h-5 w-5" />,
      },
    ];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="page-title">Publishing Queue</h1>
            <p className="page-subtitle">Schedule and manage your content pipeline</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-[var(--text2)]">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">Publishing Queue</h1>
          <p className="page-subtitle">
            Schedule and manage your content pipeline
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4" />
          Schedule New Post
        </button>
      </div>

      {error && (
        <div className="card bg-[var(--red)]/10 border border-[var(--red)]/20">
          <p className="text-[var(--red)]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getMetrics().map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="card">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="section-title">Filter & Sort</h2>
        </div>
        <div className="p-6 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
          <div className="flex-1">
            <label className="form-label">Channel</label>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="form-input w-full"
            >
              {channels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input w-full"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setFilterChannel('All');
              setFilterStatus('All');
            }}
            className="btn btn-secondary w-full md:w-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-[var(--text2)]">No posts found with current filters.</p>
        </div>
      ) : (
        <div className="hidden md:block">
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}></th>
                  <th style={{ width: '35%' }}>Post Title</th>
                  <th style={{ width: '15%' }}>Channel</th>
                  <th style={{ width: '20%' }}>Scheduled</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => {
                  const statusTag = getStatusTag(post.status);
                  return (
                    <tr key={post.id}>
                      <td>
                        <div
                          className="h-10 w-10 rounded"
                          style={{ backgroundColor: post.channelColor }}
                        ></div>
                      </td>
                      <td className="font-medium">{post.title}</td>
                      <td>
                        <span className="tag tag-blue text-xs">
                          {post.channel}
                        </span>
                      </td>
                      <td className="text-sm text-[var(--text2)]">
                        {post.scheduledDate}
                        <br />
                        {post.scheduledTime}
                      </td>
                      <td>
                        <span className={`tag ${statusTag.color} text-xs`}>
                          {statusTag.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(post)}
                            className="p-1 hover:bg-[var(--bg2)] rounded"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-[var(--bg2)] rounded"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1 hover:bg-[var(--bg2)] rounded text-[var(--red)]"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="md:hidden card text-center py-12">
          <p className="text-[var(--text2)]">No posts found with current filters.</p>
        </div>
      ) : (
        <div className="md:hidden space-y-4">
          {filteredPosts.map((post) => {
            const statusTag = getStatusTag(post.status);
            return (
              <div key={post.id} className="card">
                <div className="flex gap-4 mb-4">
                  <div
                    className="h-16 w-16 rounded flex-shrink-0"
                    style={{ backgroundColor: post.channelColor }}
                  ></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{post.title}</h3>
                    <p className="text-xs text-[var(--text2)] mt-1">
                      {post.channel}
                    </p>
                  </div>
                </div>
                <div className="mb-4 pb-4 border-b border-[var(--border)]">
                  <p className="text-xs text-[var(--text2)]">
                    {post.scheduledDate} at {post.scheduledTime}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`tag ${statusTag.color} text-xs`}>
                    {statusTag.label}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(post)}
                    className="flex-1 btn btn-secondary btn-sm"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button className="flex-1 btn btn-secondary btn-sm">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 btn btn-sm text-[var(--red)] border border-[var(--red)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PreviewModal
        post={previewPost}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
