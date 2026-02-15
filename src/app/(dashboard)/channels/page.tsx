'use client';

import { useState } from 'react';
import { Plus, Settings, LogOut, X } from 'lucide-react';

interface Channel {
  id: string;
  platform: string;
  handle: string;
  status: 'connected' | 'pending' | 'disconnected';
  followers: number;
  postsThisMonth: number;
  engagementRate: number;
  lastSyncedAt: string;
  brandColor: string;
}

const CONNECTED_CHANNELS: Channel[] = [
  {
    id: 'instagram-1',
    platform: 'Instagram',
    handle: '@ronisbagels',
    status: 'connected',
    followers: 12400,
    postsThisMonth: 18,
    engagementRate: 4.2,
    lastSyncedAt: '2 hours ago',
    brandColor: '#E1306C',
  },
  {
    id: 'tiktok-1',
    platform: 'TikTok',
    handle: '@ronisbagels',
    status: 'connected',
    followers: 8700,
    postsThisMonth: 24,
    engagementRate: 6.1,
    lastSyncedAt: '1 hour ago',
    brandColor: '#000000',
  },
  {
    id: 'facebook-1',
    platform: 'Facebook',
    handle: 'Ronis Bagel Bakery',
    status: 'connected',
    followers: 5200,
    postsThisMonth: 12,
    engagementRate: 2.8,
    lastSyncedAt: '3 hours ago',
    brandColor: '#1877F2',
  },
  {
    id: 'linkedin-1',
    platform: 'LinkedIn',
    handle: '@ronisbagels',
    status: 'connected',
    followers: 2100,
    postsThisMonth: 8,
    engagementRate: 3.5,
    lastSyncedAt: '5 hours ago',
    brandColor: '#0A66C2',
  },
];

const AVAILABLE_PLATFORMS = [
  { name: 'X (Twitter)', color: '#000000' },
  { name: 'YouTube', color: '#FF0000' },
  { name: 'Pinterest', color: '#E60023' },
  { name: 'Email', color: '#999999' },
  { name: 'Google Business', color: '#4285F4' },
];

function ChannelCard({
  channel,
  onDisconnect,
}: {
  channel: Channel;
  onDisconnect: (id: string) => void;
}) {
  const statusConfig = {
    connected: { label: 'Connected', color: 'tag-green' },
    pending: { label: 'Pending', color: 'tag-amber' },
    disconnected: { label: 'Disconnected', color: 'tag-red' },
  };

  const config = statusConfig[channel.status];

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      Instagram: '📷',
      TikTok: '🎵',
      Facebook: 'f',
      LinkedIn: 'in',
      YouTube: '▶️',
      'X (Twitter)': '𝕏',
      Pinterest: 'P',
      Email: '✉️',
      'Google Business': 'G',
    };
    return icons[platform] || '◆';
  };

  return (
    <div
      className="card relative overflow-hidden transition-all hover:shadow-lg"
      style={{
        borderTop: `3px solid ${channel.brandColor}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-lg flex items-center justify-center text-xl font-bold text-white"
            style={{ backgroundColor: channel.brandColor }}
          >
            {getPlatformIcon(channel.platform)}
          </div>
          <div>
            <h3 className="font-semibold text-base">{channel.platform}</h3>
            <p className="text-sm text-[var(--text2)]">{channel.handle}</p>
          </div>
        </div>
        <span className={`tag ${config.color} text-xs`}>{config.label}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-[var(--border)]">
        <div>
          <p className="text-xs text-[var(--text2)] uppercase tracking-wide">
            Followers
          </p>
          <p className="text-lg font-semibold">
            {channel.followers > 1000
              ? `${(channel.followers / 1000).toFixed(1)}K`
              : channel.followers}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text2)] uppercase tracking-wide">
            Posts
          </p>
          <p className="text-lg font-semibold">{channel.postsThisMonth}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text2)] uppercase tracking-wide">
            Engagement
          </p>
          <p className="text-lg font-semibold">{channel.engagementRate}%</p>
        </div>
      </div>

      <p className="text-xs text-[var(--text2)] mb-4">
        Last synced: {channel.lastSyncedAt}
      </p>

      <div className="flex items-center gap-2">
        <button className="flex-1 btn btn-secondary btn-sm">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        {channel.status === 'connected' && (
          <button
            onClick={() => onDisconnect(channel.id)}
            className="flex-1 btn btn-sm text-[var(--red)] hover:bg-[var(--red)] hover:text-white border border-[var(--red)]"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}

function AddChannelModal({
  isOpen,
  onClose,
  onConnect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Add a New Channel</h2>
          <button
            onClick={onClose}
            className="text-[var(--text2)] hover:text-[var(--text)]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-[var(--text2)] mb-8">
          Select a platform to connect to your Roni's Bagel Bakery account
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {AVAILABLE_PLATFORMS.map((platform) => (
            <button
              key={platform.name}
              onClick={() => onConnect(platform.name)}
              className="card p-6 text-center hover:shadow-lg transition-all cursor-pointer border-2 border-[var(--border)] hover:border-[var(--accent)]"
            >
              <div
                className="h-16 w-16 rounded-lg flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3"
                style={{ backgroundColor: platform.color }}
              >
                {platform.name === 'X (Twitter)'
                  ? '𝕏'
                  : platform.name === 'YouTube'
                  ? '▶️'
                  : platform.name === 'Pinterest'
                  ? 'P'
                  : platform.name === 'Email'
                  ? '✉️'
                  : 'G'}
              </div>
              <p className="font-semibold">{platform.name}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChannelsPage() {
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(CONNECTED_CHANNELS);

  const handleDisconnect = (channelId: string) => {
    setChannels(channels.filter((ch) => ch.id !== channelId));
  };

  const handleAddChannel = (platform: string) => {
    const newChannel: Channel = {
      id: `${platform.toLowerCase()}-${Date.now()}`,
      platform,
      handle: `@ronisbagels`,
      status: 'pending',
      followers: 0,
      postsThisMonth: 0,
      engagementRate: 0,
      lastSyncedAt: 'Pending verification',
      brandColor: '#4285F4',
    };
    setChannels([...channels, newChannel]);
    setIsAddChannelModalOpen(false);
  };

  const connectedChannels = channels.filter((ch) => ch.status === 'connected');
  const pendingChannels = channels.filter((ch) => ch.status === 'pending');

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">Channels</h1>
          <p className="page-subtitle">
            Connect and manage your social media accounts
          </p>
        </div>
        <button
          onClick={() => setIsAddChannelModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add Channel
        </button>
      </div>

      {connectedChannels.length > 0 && (
        <section>
          <h2 className="section-title mb-6">Connected Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        </section>
      )}

      {pendingChannels.length > 0 && (
        <section>
          <h2 className="section-title mb-6">Pending Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        </section>
      )}

      <AddChannelModal
        isOpen={isAddChannelModalOpen}
        onClose={() => setIsAddChannelModalOpen(false)}
        onConnect={handleAddChannel}
      />
    </div>
  );
}
