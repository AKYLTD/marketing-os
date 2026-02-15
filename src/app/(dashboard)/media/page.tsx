'use client';

import { useState } from 'react';
import { Eye, Edit3, Plus, X } from 'lucide-react';

interface MediaItem {
  id: number;
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

const mediaItems: MediaItem[] = [
  {
    id: 1,
    channel: 'Instagram',
    status: 'Published',
    title: 'Fresh Bagel Monday',
    caption: 'Just baked this morning! Our signature everything bagels with authentic New York style crust.',
    gradient: 'from-pink-500 to-rose-500',
    type: 'image',
    views: 2340,
    likes: 287,
    comments: 45,
    postedDate: '2026-02-10',
  },
  {
    id: 2,
    channel: 'TikTok',
    status: 'Published',
    title: 'Behind the Scenes: Bagel Rolling',
    caption: 'Watch our artisans roll and proof every bagel by hand. 5 hours from dough to delicious.',
    gradient: 'from-gray-900 to-gray-700',
    type: 'video',
    views: 12400,
    likes: 1840,
    comments: 234,
    postedDate: '2026-02-08',
  },
  {
    id: 3,
    channel: 'Facebook',
    status: 'Published',
    title: 'Community Love',
    caption: 'Thank you to everyone who visited us this week! Your support means everything.',
    gradient: 'from-blue-600 to-blue-400',
    type: 'image',
    views: 1200,
    likes: 156,
    comments: 32,
    postedDate: '2026-02-09',
  },
  {
    id: 4,
    channel: 'LinkedIn',
    status: 'Scheduled',
    title: 'Sustainability in Artisan Baking',
    caption: 'Our commitment to locally sourced, sustainable ingredients is core to our mission.',
    gradient: 'from-indigo-700 to-indigo-500',
    type: 'image',
    scheduledDate: '2026-02-14',
  },
  {
    id: 5,
    channel: 'Instagram',
    status: 'Draft',
    title: 'Valentine\'s Special Menu',
    caption: 'Love is in the air! Try our limited edition heart-shaped bagels for Valentine\'s Day.',
    gradient: 'from-red-500 to-pink-500',
    type: 'image',
  },
  {
    id: 6,
    channel: 'TikTok',
    status: 'Review',
    title: 'ASMR: Bagel Toasting Sounds',
    caption: 'The satisfying crunch of our toasted bagels. Pure audio bliss.',
    gradient: 'from-amber-500 to-yellow-400',
    type: 'video',
  },
  {
    id: 7,
    channel: 'Instagram',
    status: 'Scheduled',
    title: 'Bagel Breakfast Inspiration',
    caption: 'Six ways to enjoy your favorite bagel. Which is your go-to combination?',
    gradient: 'from-orange-500 to-amber-500',
    type: 'image',
    scheduledDate: '2026-02-16',
  },
  {
    id: 8,
    channel: 'Facebook',
    status: 'Approved',
    title: 'Local Farmers Spotlight',
    caption: 'Meet the farmers who provide our premium ingredients. Building community, one crop at a time.',
    gradient: 'from-green-600 to-emerald-500',
    type: 'image',
  },
  {
    id: 9,
    channel: 'LinkedIn',
    status: 'Published',
    title: 'Growth Update: 50% Revenue Increase',
    caption: 'We\'re thrilled to announce our continued growth in the London artisan market.',
    gradient: 'from-slate-700 to-slate-500',
    type: 'image',
    views: 450,
    likes: 78,
    comments: 12,
    postedDate: '2026-02-07',
  },
  {
    id: 10,
    channel: 'Instagram',
    status: 'Published',
    title: 'Bagel Dough Rise Time-lapse',
    caption: 'Watch the magic: 3 hours of fermentation condensed into 15 seconds.',
    gradient: 'from-purple-600 to-pink-500',
    type: 'video',
    views: 5600,
    likes: 723,
    comments: 89,
    postedDate: '2026-02-06',
  },
  {
    id: 11,
    channel: 'TikTok',
    status: 'Draft',
    title: 'Bagel Taste Test Challenge',
    caption: 'Can you guess which bagel variety won the taste test?',
    gradient: 'from-cyan-500 to-blue-500',
    type: 'video',
  },
  {
    id: 12,
    channel: 'Facebook',
    status: 'Review',
    title: 'Weekend Pop-up Location',
    caption: 'Join us at Borough Market this Saturday for freshly baked bagels!',
    gradient: 'from-fuchsia-500 to-purple-600',
    type: 'image',
  },
];

export default function MediaPage() {
  const [filter, setFilter] = useState<'All' | 'Images' | 'Videos' | 'Stories' | 'Reels'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);

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

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedMedia(media)}
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
                    <span>👁 {media.views}</span>
                    <span>❤️ {media.likes}</span>
                    <span>💬 {media.comments}</span>
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
      </div>

      {/* Modal */}
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
                      <p className="font-semibold">Roni's Bagel Bakery</p>
                      <p style={{ color: 'var(--text2)' }}>@ronisbagels</p>
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
                    defaultValue={selectedMedia.caption}
                    rows={4}
                    className="form-input w-full mb-3"
                  />
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

      {/* Create New FAB */}
      <button
        className="fixed bottom-8 right-8 btn btn-primary rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        title="Create new post"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
