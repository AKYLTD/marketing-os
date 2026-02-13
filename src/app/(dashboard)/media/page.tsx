'use client';

import { useState } from 'react';

const mediaItems = [
  {
    id: 1,
    type: 'image',
    status: 'approved',
    title: 'Campaign Banner A',
    engagement: '2.4K',
    revenue: '£420',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: 2,
    type: 'video',
    status: 'approved',
    title: 'Product Demo',
    engagement: '3.1K',
    revenue: '£560',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 3,
    type: 'image',
    status: 'review',
    title: 'New Brand Concept',
    engagement: '1.2K',
    revenue: '£280',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    type: 'video',
    status: 'approved',
    engagement: '4.7K',
    revenue: '£890',
    title: 'Customer Testimonial',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 5,
    type: 'image',
    status: 'editing',
    title: 'Promotional Graphics',
    engagement: '0.8K',
    revenue: '£150',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 6,
    type: 'image',
    status: 'approved',
    title: 'Social Media Post',
    engagement: '2.9K',
    revenue: '£480',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 7,
    type: 'video',
    status: 'review',
    title: 'Tutorial Video',
    engagement: '1.5K',
    revenue: '£320',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 8,
    type: 'image',
    status: 'approved',
    title: 'Newsletter Header',
    engagement: '3.3K',
    revenue: '£610',
    gradient: 'from-purple-500 to-pink-500',
  },
];

export default function MediaPage() {
  const [filter, setFilter] = useState('all');

  const totalCount = mediaItems.length;
  const approvedCount = mediaItems.filter((m) => m.status === 'approved').length;
  const reviewCount = mediaItems.filter((m) => m.status === 'review').length;
  const editingCount = mediaItems.filter((m) => m.status === 'editing').length;

  const filterMedia = (media: typeof mediaItems, filterType: string) => {
    if (filterType === 'all') return media;
    if (filterType === 'images') return media.filter((m) => m.type === 'image');
    if (filterType === 'videos') return media.filter((m) => m.type === 'video');
    return media.filter((m) => m.status === filterType);
  };

  const filteredMedia = filterMedia(mediaItems, filter);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Studio</h1>
        <p className="mt-2 text-gray-600">Manage your marketing assets and media files</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{approvedCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">In Review</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{reviewCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Editing</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{editingCount}</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <p className="text-lg font-medium text-gray-900">📁 Drop files here or click to upload</p>
        <p className="mt-2 text-sm text-gray-600">Supported formats: JPG, PNG, MP4, WebM</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'approved', 'review', 'editing', 'images', 'videos'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              filter === filterType
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredMedia.map((media) => (
          <div
            key={media.id}
            data-media={`${media.type} ${media.status}`}
            className="group cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
          >
            {/* Card Background */}
            <div
              className={`relative h-48 bg-gradient-to-br ${media.gradient} transition-opacity group-hover:opacity-75`}
            >
              {/* Media Type Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <span className="text-6xl">{media.type === 'image' ? '🖼️' : '🎬'}</span>
              </div>

              {/* Status Badge */}
              <div className="absolute right-2 top-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    media.status === 'approved'
                      ? 'bg-green-500'
                      : media.status === 'review'
                        ? 'bg-yellow-500'
                        : 'bg-purple-500'
                  }`}
                >
                  {media.status === 'review' ? 'In Review' : media.status.charAt(0).toUpperCase() + media.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="bg-white p-4">
              <h3 className="font-medium text-gray-900">{media.title}</h3>
              <div className="mt-3 flex justify-between text-sm">
                <div>
                  <p className="text-xs text-gray-600">Engagement</p>
                  <p className="font-semibold text-gray-900">{media.engagement}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Revenue</p>
                  <p className="font-semibold text-gray-900">{media.revenue}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
