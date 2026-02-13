'use client';

import { TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'planned' | 'draft';
  description?: string;
  progress?: number;
  daysCurrent?: number;
  daysTotal?: number;
  performanceVsTarget?: string;
  channels?: string[];
  channelEmojis?: string[];
  createdBy?: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: "Valentine's Special",
    status: 'active',
    progress: 57,
    daysCurrent: 8,
    daysTotal: 14,
    performanceVsTarget: '+23% above target',
    channels: ['Instagram', 'TikTok', 'Facebook'],
    channelEmojis: ['📷', '🎵', '👥'],
  },
  {
    id: '2',
    name: 'Spring Menu Launch',
    status: 'planned',
    channels: ['Instagram', 'Facebook', 'Email'],
    channelEmojis: ['📷', '👥', '✉️'],
    description: 'Starts Mar 1',
  },
  {
    id: '3',
    name: 'Competitor Counter-Move',
    status: 'draft',
    createdBy: 'AI Agent',
    description: 'Auto-generated response campaign',
  },
];

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const statusConfig = {
    active: {
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    planned: {
      bg: 'bg-purple-50',
      badge: 'bg-purple-100 text-purple-700',
      icon: <Clock className="w-4 h-4" />,
    },
    draft: {
      bg: 'bg-gray-50',
      badge: 'bg-gray-100 text-gray-700',
      icon: <AlertCircle className="w-4 h-4" />,
    },
  };

  const config = statusConfig[campaign.status];
  const statusText =
    campaign.status === 'active'
      ? 'Active'
      : campaign.status === 'planned'
        ? 'Planned'
        : 'Agent-Created';

  return (
    <div className={`card ${config.bg}`}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{campaign.name}</h3>
          <span className={`badge ${config.badge}`}>
            {config.icon}
            {statusText}
          </span>
        </div>

        {campaign.status === 'active' && campaign.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Day {campaign.daysCurrent}/{campaign.daysTotal}
              </span>
              <span className="text-green-600 font-medium">
                {campaign.performanceVsTarget}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{campaign.progress}% complete</p>
          </div>
        )}

        {campaign.status === 'planned' && (
          <div className="space-y-3">
            {campaign.channels && (
              <div className="flex gap-2 flex-wrap">
                {campaign.channels.map((channel, idx) => (
                  <span
                    key={channel}
                    className="badge bg-gray-100 text-gray-700"
                  >
                    {campaign.channelEmojis?.[idx]} {channel}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-600">{campaign.description}</p>
          </div>
        )}

        {campaign.status === 'draft' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{campaign.description}</p>
            <p className="text-xs text-gray-500">Created by: {campaign.createdBy}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                Approve
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm">
                Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <p className="text-gray-600 mt-1">Launch and monitor your marketing campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
