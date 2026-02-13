'use client';

import { useState } from 'react';
import { BarChart3, Users, CreditCard, Gift, Settings } from 'lucide-react';

type AdminTab = 'dashboard' | 'users' | 'subscriptions' | 'payments' | 'vouchers' | 'settings';

interface User {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: string;
}

const adminUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', tier: 'Pro', status: 'Active' },
  { id: '2', name: 'Mike Chen', email: 'mike@example.com', tier: 'Basic', status: 'Active' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily@example.com', tier: 'Enterprise', status: 'Active' },
  { id: '4', name: 'David Lee', email: 'david@example.com', tier: 'Basic', status: 'Inactive' },
  { id: '5', name: 'Jessica Smith', email: 'jessica@example.com', tier: 'Pro', status: 'Active' },
];

function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-600 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold mt-1">$24,580</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-2xl font-bold mt-1">1,247</p>
              <p className="text-xs text-green-600 mt-1">+23 this week</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-600 text-sm">New Signups</p>
              <p className="text-2xl font-bold mt-1">89</p>
              <p className="text-xs text-gray-600 mt-1">This month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-gray-600 text-sm">Churn Rate</p>
              <p className="text-2xl font-bold mt-1">2.3%</p>
              <p className="text-xs text-red-600 mt-1">+0.1% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">New user signup</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subscription upgrade</span>
            <span className="text-gray-500">5 hours ago</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment processed</span>
            <span className="text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td className="text-gray-600">{user.email}</td>
                <td>
                  <span className="badge bg-blue-100 text-blue-700">{user.tier}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubscriptionsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Basic Plan</h3>
          <span className="text-2xl">234</span>
        </div>
        <p className="text-gray-600 text-sm">Active subscribers</p>
        <p className="text-xs text-gray-500 mt-2">$29/month</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pro Plan</h3>
          <span className="text-2xl">456</span>
        </div>
        <p className="text-gray-600 text-sm">Active subscribers</p>
        <p className="text-xs text-gray-500 mt-2">$99/month</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Enterprise</h3>
          <span className="text-2xl">78</span>
        </div>
        <p className="text-gray-600 text-sm">Active subscribers</p>
        <p className="text-xs text-gray-500 mt-2">Custom pricing</p>
      </div>
    </div>
  );
}

function PaymentsTab() {
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Recent Payments</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-sm text-gray-600">Pro Plan</p>
            </div>
            <span className="font-semibold">$99.00</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Mike Chen</p>
              <p className="text-sm text-gray-600">Basic Plan</p>
            </div>
            <span className="font-semibold">$29.00</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Emily Rodriguez</p>
              <p className="text-sm text-gray-600">Enterprise Plan</p>
            </div>
            <span className="font-semibold">$499.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VouchersTab() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Vouchers & Promotions</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
          Create Voucher
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <p className="font-medium">WELCOME2024</p>
            <p className="text-sm text-gray-600">20% off, expires Mar 31</p>
          </div>
          <span className="text-green-600 font-medium">45 uses</span>
        </div>
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <p className="font-medium">SPRING50</p>
            <p className="text-sm text-gray-600">50% off first month, expires May 31</p>
          </div>
          <span className="text-green-600 font-medium">128 uses</span>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="card p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform Name
        </label>
        <input
          type="text"
          placeholder="Marketing OS"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue="Marketing OS"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Support Email
        </label>
        <input
          type="email"
          placeholder="support@marketingos.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Save Changes
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'vouchers', label: 'Vouchers', icon: Gift },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'users':
        return <UsersTab />;
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'vouchers':
        return <VouchersTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage users, subscriptions, and platform settings</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {adminTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-blue-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {renderTabContent()}
      </div>

      <div className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg">
        <span className="text-xl">💬</span>
      </div>
    </div>
  );
}
