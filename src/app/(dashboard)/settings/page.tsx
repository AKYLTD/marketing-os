'use client';

import { useState } from 'react';

type TabName = 'general' | 'brand' | 'channels' | 'audience' | 'budget' | 'ai' | 'notifications';

interface TabConfig {
  id: TabName;
  label: string;
}

const tabs: TabConfig[] = [
  { id: 'general', label: 'General' },
  { id: 'brand', label: 'Brand' },
  { id: 'channels', label: 'Channels' },
  { id: 'audience', label: 'Audience' },
  { id: 'budget', label: 'Budget' },
  { id: 'ai', label: 'AI' },
  { id: 'notifications', label: 'Notifications' },
];

function GeneralTab() {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Name
        </label>
        <input
          type="text"
          placeholder="Your business name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue="Acme Coffee Co."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue="hello@acmecoffee.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>EST (UTC-5)</option>
          <option>CST (UTC-6)</option>
          <option>MST (UTC-7)</option>
          <option>PST (UTC-8)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Save Changes
      </button>
    </div>
  );
}

function BrandTab() {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            defaultValue="#3B82F6"
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            placeholder="#3B82F6"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="#3B82F6"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accent Color
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            defaultValue="#F59E0B"
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            placeholder="#F59E0B"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="#F59E0B"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Inter</option>
          <option>Roboto</option>
          <option>Playfair Display</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand Tone
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Professional</option>
          <option>Casual</option>
          <option>Friendly</option>
        </select>
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Save Changes
      </button>
    </div>
  );
}

function ChannelsTab() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Manage your connected channels in the Channels page. You can connect, reconnect, or disconnect channels there.
      </p>
      <a href="/channels" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Go to Channels
      </a>
    </div>
  );
}

function AudienceTab() {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Audience Age
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>18-24</option>
          <option>25-34</option>
          <option>35-44</option>
          <option>45-54</option>
          <option>55+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Locations
        </label>
        <input
          type="text"
          placeholder="e.g., New York, Los Angeles, Chicago"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry/Category
        </label>
        <input
          type="text"
          placeholder="e.g., Food & Beverage"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Save Changes
      </button>
    </div>
  );
}

function BudgetTab() {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Budget
        </label>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">$</span>
          <input
            type="number"
            placeholder="5000"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="5000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Threshold
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="80"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="80"
          />
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">%</span>
        </div>
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Save Changes
      </button>
    </div>
  );
}

function AITab() {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OpenAI API Key
        </label>
        <input
          type="password"
          placeholder="sk-..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Your API key is securely stored and never shared.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Model
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>GPT-4</option>
          <option>GPT-3.5 Turbo</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="ai-content" defaultChecked className="w-4 h-4" />
        <label htmlFor="ai-content" className="text-sm font-medium text-gray-700">
          Enable AI content generation
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="ai-suggestions" defaultChecked className="w-4 h-4" />
        <label htmlFor="ai-suggestions" className="text-sm font-medium text-gray-700">
          Enable AI recommendations
        </label>
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Save Changes
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Email Notifications</h3>
          <p className="text-sm text-gray-600">Receive updates via email</p>
        </div>
        <input type="checkbox" defaultChecked className="w-4 h-4" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Content Ready for Review</h3>
          <p className="text-sm text-gray-600">When content is ready to publish</p>
        </div>
        <input type="checkbox" defaultChecked className="w-4 h-4" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Campaign Performance</h3>
          <p className="text-sm text-gray-600">Daily campaign metrics and insights</p>
        </div>
        <input type="checkbox" defaultChecked className="w-4 h-4" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">AI Recommendations</h3>
          <p className="text-sm text-gray-600">New AI-generated suggestions</p>
        </div>
        <input type="checkbox" defaultChecked className="w-4 h-4" />
      </div>

      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        Save Changes
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('general');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />;
      case 'brand':
        return <BrandTab />;
      case 'channels':
        return <ChannelsTab />;
      case 'audience':
        return <AudienceTab />;
      case 'budget':
        return <BudgetTab />;
      case 'ai':
        return <AITab />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="card">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-blue-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
