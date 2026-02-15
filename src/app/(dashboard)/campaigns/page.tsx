'use client';

import { useState } from 'react';
import { Plus, Edit2, Pause, Play, BarChart3, Trash2, X, Calendar } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'planned' | 'draft' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  channels: string[];
  budget: number;
  spent: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  roi?: number;
  progress: number;
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: "Valentine's Day Special",
    status: 'active',
    startDate: 'Feb 6',
    endDate: 'Feb 20',
    channels: ['Instagram', 'TikTok', 'Facebook'],
    budget: 2000,
    spent: 1300,
    impressions: 48250,
    clicks: 3402,
    conversions: 287,
    roi: 156,
    progress: 65,
  },
  {
    id: '2',
    name: 'Spring Menu Launch',
    status: 'planned',
    startDate: 'Mar 1',
    endDate: 'Mar 15',
    channels: ['Instagram', 'Facebook', 'Email'],
    budget: 1500,
    spent: 0,
    progress: 0,
  },
  {
    id: '3',
    name: 'Weekend Brunch Push',
    status: 'active',
    startDate: 'Feb 1',
    endDate: 'Mar 31',
    channels: ['TikTok', 'Instagram'],
    budget: 800,
    spent: 320,
    impressions: 22100,
    clicks: 1840,
    conversions: 142,
    roi: 89,
    progress: 40,
  },
  {
    id: '4',
    name: 'Loyalty Program Launch',
    status: 'draft',
    startDate: 'Apr 1',
    endDate: 'Apr 30',
    channels: [
      'Instagram',
      'TikTok',
      'Facebook',
      'LinkedIn',
      'Email',
    ],
    budget: 3000,
    spent: 0,
    progress: 0,
  },
  {
    id: '5',
    name: 'Easter Campaign',
    status: 'planned',
    startDate: 'Apr 14',
    endDate: 'Apr 21',
    channels: ['Instagram', 'Facebook'],
    budget: 1200,
    spent: 0,
    progress: 0,
  },
];

function CreateCampaignModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    objective: 'awareness',
    channels: [] as string[],
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
  });

  const channelOptions = [
    'Instagram',
    'TikTok',
    'Facebook',
    'LinkedIn',
    'Email',
  ];

  const handleChannelToggle = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Campaign</h2>
          <button
            onClick={onClose}
            className="text-[var(--text2)] hover:text-[var(--text)]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <label className="form-label">Campaign Name</label>
            <input
              type="text"
              className="form-input w-full"
              placeholder="e.g., Summer Sale Campaign"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="form-label">Objective</label>
            <select
              className="form-input w-full"
              value={formData.objective}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, objective: e.target.value }))
              }
            >
              <option value="awareness">Awareness</option>
              <option value="engagement">Engagement</option>
              <option value="conversion">Conversion</option>
              <option value="retention">Retention</option>
            </select>
          </div>

          <div>
            <label className="form-label">Channels</label>
            <div className="space-y-2">
              {channelOptions.map((channel) => (
                <label key={channel} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.channels.includes(channel)}
                    onChange={() => handleChannelToggle(channel)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{channel}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input w-full"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input w-full"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">Budget</label>
            <div className="flex items-center">
              <span className="text-[var(--text2)] mr-2">£</span>
              <input
                type="number"
                className="form-input w-full"
                placeholder="0"
                value={formData.budget}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, budget: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input w-full"
              rows={4}
              placeholder="Campaign details..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const statusConfigs = {
    active: { color: 'tag-green', label: 'Active' },
    planned: { color: 'tag-blue', label: 'Planned' },
    draft: { color: 'tag-amber', label: 'Draft' },
    completed: { color: 'tag-blue', label: 'Completed' },
    paused: { color: 'tag-red', label: 'Paused' },
  };

  const config = statusConfigs[campaign.status];
  const spendPercentage = (campaign.spent / campaign.budget) * 100;

  return (
    <div className="card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold">{campaign.name}</h3>
          <p className="text-xs text-[var(--text2)] mt-1">
            {campaign.startDate} - {campaign.endDate}
          </p>
        </div>
        <span className={`tag ${config.color} text-xs`}>{config.label}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {campaign.channels.map((channel) => (
          <span key={channel} className="tag tag-blue text-xs">
            {channel}
          </span>
        ))}
      </div>

      <div className="mb-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--text2)]">
            Budget
          </span>
          <span className="text-sm font-semibold">
            £{campaign.spent} / £{campaign.budget}
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--bg2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{ width: `${Math.min(spendPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {campaign.impressions && (
        <div className="mb-4 pb-4 border-b border-[var(--border)]">
          <h4 className="text-xs font-semibold text-[var(--text2)] uppercase mb-3">
            Metrics
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-[var(--text2)]">Impressions</p>
              <p className="text-sm font-semibold">
                {campaign.impressions?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text2)]">Clicks</p>
              <p className="text-sm font-semibold">
                {campaign.clicks?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text2)]">Conversions</p>
              <p className="text-sm font-semibold">
                {campaign.conversions?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text2)]">ROI</p>
              <p className="text-sm font-semibold text-[var(--green)]">
                {campaign.roi}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--text2)]">
            Progress
          </span>
          <span className="text-xs font-medium text-[var(--text2)]">
            {campaign.progress}%
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--bg2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{ width: `${campaign.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 btn btn-secondary btn-sm">
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
        <button className="flex-1 btn btn-secondary btn-sm">
          <BarChart3 className="h-4 w-4" />
          Report
        </button>
        {campaign.status === 'active' ? (
          <button className="flex-1 btn btn-secondary btn-sm">
            <Pause className="h-4 w-4" />
            Pause
          </button>
        ) : (
          <button className="flex-1 btn btn-secondary btn-sm">
            <Play className="h-4 w-4" />
            Resume
          </button>
        )}
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SAMPLE_CAMPAIGNS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">
            Plan, launch, and track your marketing campaigns
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
