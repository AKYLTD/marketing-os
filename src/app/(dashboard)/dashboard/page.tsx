'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import MetricCard from '@/components/MetricCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue',
      data: [420, 580, 520, 890, 760, 1200, 980],
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4F46E5',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1400,
      ticks: {
        callback: function (value: number) {
          return '£' + value;
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const activityFeed = [
  {
    id: 1,
    message: 'Campaign performance improved',
    time: '2 hours ago',
    color: 'bg-green-500',
  },
  {
    id: 2,
    message: 'New engagement spike detected',
    time: '4 hours ago',
    color: 'bg-blue-500',
  },
  {
    id: 3,
    message: 'Revenue milestone achieved',
    time: '1 day ago',
    color: 'bg-purple-500',
  },
  {
    id: 4,
    message: 'Post optimization suggestion',
    time: '2 days ago',
    color: 'bg-yellow-500',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back — here's your marketing overview
        </p>
      </div>

      {/* Agent Bar */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-medium text-gray-900">AI Agent Activity</p>
            <p className="text-sm text-gray-600">
              Your marketing assistant has analyzed recent activity and optimized your campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Reach"
          value="24.8K"
          change={12.5}
          icon="📊"
        />
        <MetricCard
          title="Revenue"
          value="£3,240"
          change={8.3}
          icon="💰"
        />
        <MetricCard
          title="Engagement"
          value="5.2%"
          change={1.1}
          icon="👥"
        />
        <MetricCard
          title="ROAS"
          value="4.2x"
          change={0.3}
          icon="📈"
        />
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance Trend</h2>
            <p className="text-sm text-gray-600">Weekly revenue performance</p>
          </div>
          <div className="h-[200px]" id="dashChart">
            <Line data={chartData} options={chartOptions as any} />
          </div>
        </div>

        {/* Agent Activity Feed */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="space-y-4">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className={`${item.color} mt-1.5 h-3 w-3 rounded-full flex-shrink-0`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.message}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
