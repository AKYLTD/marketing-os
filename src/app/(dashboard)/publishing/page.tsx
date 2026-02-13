'use client';

import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface MetricCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface PublishingRow {
  id: string;
  name: string;
  channel: string;
  emoji: string;
  scheduledDate: string;
  status: 'ready' | 'review';
}

const metrics: MetricCard[] = [
  {
    label: 'Queued',
    value: 12,
    icon: <Clock className="w-5 h-5" />,
    color: 'text-blue-600',
  },
  {
    label: 'Published this month',
    value: 48,
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-green-600',
  },
  {
    label: 'Needs review',
    value: 3,
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-yellow-600',
  },
];

const publishingData: PublishingRow[] = [
  {
    id: '1',
    name: 'Valentine\'s Day Special - Instagram Reel',
    channel: 'Instagram',
    emoji: '📷',
    scheduledDate: 'Feb 14, 10:00 AM',
    status: 'ready',
  },
  {
    id: '2',
    name: 'TikTok Trend - Dancing with Product',
    channel: 'TikTok',
    emoji: '🎵',
    scheduledDate: 'Feb 15, 6:00 PM',
    status: 'review',
  },
  {
    id: '3',
    name: 'LinkedIn Article - Industry Insights',
    channel: 'LinkedIn',
    emoji: '💼',
    scheduledDate: 'Feb 16, 9:00 AM',
    status: 'ready',
  },
  {
    id: '4',
    name: 'Facebook Event Promotion',
    channel: 'Facebook',
    emoji: '👥',
    scheduledDate: 'Feb 17, 2:00 PM',
    status: 'review',
  },
  {
    id: '5',
    name: 'Email Campaign - Weekly Newsletter',
    channel: 'Email',
    emoji: '✉️',
    scheduledDate: 'Feb 18, 8:00 AM',
    status: 'ready',
  },
];

export default function PublishingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Publishing Queue</h1>
        <p className="text-gray-600 mt-1">Manage and track your scheduled content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                <p className="text-3xl font-bold mt-2">{metric.value}</p>
              </div>
              <div className={`${metric.color} bg-gray-50 p-3 rounded-lg`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Upcoming Publishes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Content Name</th>
                <th>Channel</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {publishingData.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium">{row.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{row.emoji}</span>
                      {row.channel}
                    </div>
                  </td>
                  <td className="text-gray-600">{row.scheduledDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {row.status === 'ready' ? 'Ready' : 'Review'}
                    </span>
                  </td>
                  <td>
                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      {row.status === 'review' ? 'Review' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
