'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Clock, X } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  emoji: string;
  status: 'connected' | 'pending' | 'not-connected';
  token?: string;
}

const channels: Channel[] = [
  { id: 'instagram', name: 'Instagram', emoji: '📷', status: 'connected' },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', status: 'connected' },
  { id: 'facebook', name: 'Facebook', emoji: '👥', status: 'pending' },
  { id: 'google', name: 'Google Business', emoji: '🌐', status: 'pending' },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', status: 'not-connected' },
  { id: 'email', name: 'Email/Mailchimp', emoji: '✉️', status: 'connected' },
];

const statusConfig = {
  connected: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100', icon: Check },
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100', icon: Clock },
  'not-connected': { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100', icon: X },
};

function ChannelCard({ channel }: { channel: Channel }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = statusConfig[channel.status];
  const IconComponent = config.icon;
  const statusText = channel.status === 'not-connected' ? 'Not connected' : channel.status.charAt(0).toUpperCase() + channel.status.slice(1);

  return (
    <div className={`card ${config.bg}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{channel.emoji}</span>
            <div>
              <h3 className="font-semibold">{channel.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${config.badge} ${config.text}`}>
              <IconComponent className="w-3 h-3 inline mr-1" />
              {statusText}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Token
            </label>
            <input
              type="password"
              placeholder="Enter your API token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={channel.token || ''}
            />
          </div>
          <div className="flex gap-2">
            {channel.status === 'connected' ? (
              <>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                  Reconnect
                </button>
                <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium">
                  Disconnect
                </button>
              </>
            ) : (
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Connect Channel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Channels</h1>
        <p className="text-gray-600 mt-1">Manage your social media and email channels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}
