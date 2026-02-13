'use client';

import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const channelData = [
  { channel: 'Instagram', spend: '£320', revenue: '£2,140', roas: '6.7x', roi: '567%' },
  { channel: 'TikTok', spend: '£280', revenue: '£1,890', roas: '6.8x', roi: '575%' },
  { channel: 'Email', spend: '£180', revenue: '£1,240', roas: '6.9x', roi: '589%' },
  { channel: 'Facebook', spend: '£320', revenue: '£1,680', roas: '5.3x', roi: '425%' },
  { channel: 'Google', spend: '£180', revenue: '£1,470', roas: '8.2x', roi: '717%' },
  { channel: 'Total', spend: '£1,280', revenue: '£8,420', roas: '6.6x', roi: '558%' },
];

const postPerformance = [
  { id: 1, channel: 'Instagram', content: 'Summer collection launch', reach: '12.4K', engagement: '1.2K', revenue: '£890' },
  { id: 2, channel: 'TikTok', content: 'Behind the scenes video', reach: '24.8K', engagement: '3.2K', revenue: '£1,240' },
  { id: 3, channel: 'Email', content: 'Weekly newsletter', reach: '8.3K', engagement: '2.1K', revenue: '£620' },
  { id: 4, channel: 'Instagram', content: 'Customer spotlight', reach: '9.2K', engagement: '890', revenue: '£540' },
  { id: 5, channel: 'Facebook', content: 'New product announcement', reach: '15.6K', engagement: '1.4K', revenue: '£750' },
  { id: 6, channel: 'Google', content: 'Seasonal campaign', reach: '32.1K', engagement: '2.8K', revenue: '£1,680' },
  { id: 7, channel: 'TikTok', content: 'Trending challenge', reach: '18.9K', engagement: '2.4K', revenue: '£920' },
  { id: 8, channel: 'Instagram', content: 'Influencer collaboration', reach: '21.3K', engagement: '2.9K', revenue: '£1,120' },
  { id: 9, channel: 'Email', content: 'Flash sale notification', reach: '7.8K', engagement: '1.9K', revenue: '£580' },
  { id: 10, channel: 'Facebook', content: 'User generated content', reach: '14.2K', engagement: '1.6K', revenue: '£680' },
  { id: 11, channel: 'Google', content: 'Holiday promotion', reach: '28.4K', engagement: '2.6K', revenue: '£1,420' },
  { id: 12, channel: 'TikTok', content: 'Product demo reel', reach: '19.7K', engagement: '2.1K', revenue: '£840' },
];

const revenueChartData = {
  labels: ['Instagram', 'TikTok', 'Email', 'Facebook', 'Google'],
  datasets: [
    {
      data: [2140, 1890, 1240, 1680, 1470],
      backgroundColor: [
        '#E1306C',
        '#000000',
        '#EA4335',
        '#1877F2',
        '#4285F4',
      ],
      borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
      borderWidth: 2,
    },
  ],
};

const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 15,
        font: { size: 12 },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return '£' + context.parsed;
        },
      },
    },
  },
};

const conversionData = {
  labels: ['Visitors', 'Leads', 'Customers'],
  datasets: [
    {
      label: 'Conversion Funnel',
      data: [142000, 18500, 8420],
      backgroundColor: ['#4F46E5', '#818CF8', '#C7D2FE'],
      borderRadius: 8,
    },
  ],
};

const conversionOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        callback: function (value: number) {
          return value / 1000 + 'K';
        },
      },
    },
  },
};

export default function AnalyticsPage() {
  const [channelFilter, setChannelFilter] = useState('all');

  const filteredPosts =
    channelFilter === 'all'
      ? postPerformance
      : postPerformance.filter((post) => post.channel === channelFilter);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Detailed performance metrics and channel analysis
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">£8,420</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Impressions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">142K</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">ROAS</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">4.2x</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">ROI</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">312%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Doughnut Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue by Channel</h2>
          <div className="flex justify-center">
            <div className="h-64 w-64">
              <Doughnut data={revenueChartData} options={revenueChartOptions as any} />
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Conversion Funnel</h2>
          <div className="h-64">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">Visitors</span>
                  <span className="font-semibold text-indigo-600">142K</span>
                </div>
                <div className="h-8 w-full rounded-lg bg-indigo-600"></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">Leads</span>
                  <span className="font-semibold text-indigo-500">18.5K</span>
                </div>
                <div className="h-8 rounded-lg bg-indigo-500" style={{ width: '13%' }}></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">Customers</span>
                  <span className="font-semibold text-indigo-400">8.4K</span>
                </div>
                <div className="h-8 rounded-lg bg-indigo-400" style={{ width: '5.9%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Performance Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Channel Performance & ROI</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Channel</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Spend</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ROAS</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {channelData.map((row, index) => (
                <tr
                  key={index}
                  className={index === channelData.length - 1 ? 'bg-indigo-50 font-semibold' : ''}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.channel}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.spend}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.revenue}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.roas}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly ROI Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Spend</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">£1,280</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-green-600">£8,420</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Net ROI</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">558%</p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 p-6">
        <div className="flex gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-gray-900">AI Insight</p>
            <p className="mt-1 text-sm text-gray-700">
              Google and TikTok are your top performers with ROAS above 6.8x. Consider increasing budget allocation to these channels while optimizing Facebook performance, which currently shows lower returns.
            </p>
          </div>
        </div>
      </div>

      {/* Post Performance History */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Post Performance History</h2>
            <div className="flex gap-2">
              {['all', 'Instagram', 'TikTok', 'Email', 'Facebook', 'Google'].map((channel) => (
                <button
                  key={channel}
                  onClick={() => setChannelFilter(channel)}
                  className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                    channelFilter === channel
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Channel</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Content</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reach</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Engagement</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.channel}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.content}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.reach}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.engagement}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{post.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
