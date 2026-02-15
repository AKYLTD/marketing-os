'use client';

import { useState } from 'react';
import {
  Save,
  Eye,
  EyeOff,
  Link2,
  Upload,
  ChevronRight,
} from 'lucide-react';

type TabType = 'general' | 'brand' | 'channels' | 'ai' | 'audience' | 'budget' | 'notifications' | 'integrations';
type AIProvider = 'openai' | 'anthropic' | 'google' | 'custom';

interface AIModelOption {
  value: string;
  label: string;
}

interface ChannelConfig {
  id: string;
  name: string;
  connected: boolean;
  defaultTime: string;
}

interface Integration {
  id: string;
  name: string;
  connected: boolean;
  icon: string;
}

const aiProviders = {
  openai: {
    label: 'OpenAI',
    models: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o-mini' },
    ],
  },
  anthropic: {
    label: 'Anthropic',
    models: [
      { value: 'claude-sonnet', label: 'Claude Sonnet' },
      { value: 'claude-opus', label: 'Claude Opus' },
    ],
  },
  google: {
    label: 'Google',
    models: [
      { value: 'gemini-pro', label: 'Gemini Pro' },
      { value: 'gemini-flash', label: 'Gemini Flash' },
    ],
  },
  custom: {
    label: 'Custom/Self-hosted',
    models: [{ value: 'custom', label: 'Custom Endpoint' }],
  },
};

const channelConfigs: ChannelConfig[] = [
  { id: '1', name: 'Instagram', connected: true, defaultTime: '09:00 AM' },
  { id: '2', name: 'TikTok', connected: true, defaultTime: '07:00 PM' },
  { id: '3', name: 'Facebook', connected: true, defaultTime: '06:00 PM' },
  { id: '4', name: 'LinkedIn', connected: false, defaultTime: '09:00 AM' },
  { id: '5', name: 'YouTube', connected: true, defaultTime: '08:00 PM' },
];

const integrations: Integration[] = [
  { id: '1', name: 'Google Analytics', connected: true, icon: 'G' },
  { id: '2', name: 'Mailchimp', connected: true, icon: 'M' },
  { id: '3', name: 'Shopify', connected: false, icon: 'S' },
  { id: '4', name: 'Zapier', connected: true, icon: 'Z' },
  { id: '5', name: 'Slack', connected: false, icon: 'L' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [aiProvider, setAiProvider] = useState<AIProvider>('anthropic');
  const [aiModel, setAiModel] = useState('claude-sonnet');
  const [customApiUrl, setCustomApiUrl] = useState('');

  const [generalSettings, setGeneralSettings] = useState({
    businessName: "Roni's Bagel Bakery",
    industry: 'Food & Beverage',
    location: 'New York, NY',
    website: 'https://ronisbagels.com',
    timezone: 'America/New_York',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
  });

  const [brandSettings, setBrandSettings] = useState({
    primaryColor: '#6B46C1',
    secondaryColor: '#EC4899',
    accentColor: '#F59E0B',
    tagline: 'Freshly Baked, Always Made with Love',
  });

  const [aiSettings, setAiSettings] = useState({
    contentGeneration: true,
    autoScheduling: true,
    sentimentAnalysis: true,
    competitorMonitoring: false,
    campaignOptimization: true,
    smartReplies: true,
  });

  const [aiSliders, setAiSliders] = useState({
    creativity: 7,
    responseLength: 6,
    toneMatching: 8,
  });

  const [budgetSettings, setBudgetSettings] = useState({
    monthlyBudget: 500,
    instagram: 35,
    tiktok: 30,
    facebook: 20,
    linkedin: 10,
    youtube: 5,
    currency: 'GBP',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailDaily: true,
    emailWeekly: true,
    emailCampaignAlerts: true,
    emailBudgetWarning: true,
    emailFailedPost: true,
    pushNotifications: true,
  });

  const [apiKeys, setApiKeys] = useState({
    openai: 'sk-proj-••••••••••••••••••••••••••••••••',
    anthropic: 'sk-ant-••••••••••••••••••••••••••••••',
    custom: 'api-••••••••••••••••••••••••••••••',
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKey((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'brand', label: 'Brand' },
    { id: 'channels', label: 'Channels' },
    { id: 'ai', label: 'AI & Models' },
    { id: 'audience', label: 'Audience' },
    { id: 'budget', label: 'Budget' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Configure your Marketing OS experience
        </p>
      </div>

      {/* Tab Navigation - Horizontal Scroll on Mobile */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max sm:flex-wrap sm:min-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--bg3)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">Business Information</h2>

            <div className="space-y-4">
              <div>
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={generalSettings.businessName}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      businessName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Industry</label>
                  <select
                    className="form-input"
                    value={generalSettings.industry}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        industry: e.target.value,
                      })
                    }
                  >
                    <option>Food & Beverage</option>
                    <option>Retail</option>
                    <option>Services</option>
                    <option>Technology</option>
                    <option>Finance</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={generalSettings.location}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={generalSettings.website}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      website: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Timezone</label>
                  <select
                    className="form-input"
                    value={generalSettings.timezone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        timezone: e.target.value,
                      })
                    }
                  >
                    <option>America/New_York</option>
                    <option>America/Chicago</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Europe/Paris</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Language</label>
                  <select
                    className="form-input"
                    value={generalSettings.language}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        language: e.target.value,
                      })
                    }
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Date Format</label>
                <div className="space-y-2">
                  {['MM/DD/YYYY', 'DD/MM/YYYY'].map((format) => (
                    <label key={format} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dateFormat"
                        value={format}
                        checked={generalSettings.dateFormat === format}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            dateFormat: e.target.value,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[var(--text)]">
                        {format}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      )}

      {/* Brand Tab */}
      {activeTab === 'brand' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">Brand Settings</h2>

            <div className="space-y-4">
              <button className="btn btn-secondary w-full justify-start">
                <Link2 size={18} />
                Go to Brand DNA Page
              </button>

              <div>
                <label className="form-label">Logo Upload</label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:bg-[var(--bg2)] transition-colors">
                  <Upload size={32} className="mx-auto text-[var(--text2)] mb-2" />
                  <p className="text-sm text-[var(--text2)]">
                    Drag and drop your logo here or click to select
                  </p>
                </div>
              </div>

              <div>
                <label className="form-label">Brand Tagline</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={brandSettings.tagline}
                  onChange={(e) =>
                    setBrandSettings({
                      ...brandSettings,
                      tagline: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="form-label mb-3 block">Brand Colors</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'primaryColor', label: 'Primary Color' },
                    { key: 'secondaryColor', label: 'Secondary Color' },
                    { key: 'accentColor', label: 'Accent Color' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="form-label text-xs">{label}</label>
                      <div className="flex gap-2">
                        <div
                          className="w-12 h-10 rounded border border-[var(--border)]"
                          style={{
                            backgroundColor:
                              brandSettings[key as keyof typeof brandSettings] as string,
                          }}
                        />
                        <input
                          type="text"
                          className="form-input flex-1"
                          value={
                            brandSettings[key as keyof typeof brandSettings] as string
                          }
                          onChange={(e) =>
                            setBrandSettings({
                              ...brandSettings,
                              [key]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      )}

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">Connected Channels</h2>

            <div className="space-y-3">
              {channelConfigs.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 bg-[var(--bg2)] rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[var(--text)]">
                      {channel.name}
                    </p>
                    {channel.connected && (
                      <p className="text-xs text-[var(--text2)] mt-1">
                        Default time: {channel.defaultTime}
                      </p>
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channel.connected}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[var(--text2)]">
                      {channel.connected ? 'Connected' : 'Connect'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      )}

      {/* AI & Models Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">AI Engine Selection</h2>

            <div className="space-y-4 mb-8">
              {(Object.entries(aiProviders) as [AIProvider, any][]).map(
                ([provider, config]) => (
                  <div
                    key={provider}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      aiProvider === provider
                        ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
                        : 'border-[var(--border)] bg-[var(--bg2)]'
                    }`}
                    onClick={() => {
                      setAiProvider(provider);
                      setAiModel(config.models[0].value);
                    }}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="aiProvider"
                        value={provider}
                        checked={aiProvider === provider}
                        onChange={() => {
                          setAiProvider(provider);
                          setAiModel(config.models[0].value);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-[var(--text)]">
                        {config.label}
                      </span>
                    </label>

                    {aiProvider === provider && (
                      <div className="mt-3 ml-7">
                        <label className="form-label text-xs">
                          Select Model
                        </label>
                        <select
                          className="form-input"
                          value={aiModel}
                          onChange={(e) => setAiModel(e.target.value)}
                        >
                          {config.models.map((model: AIModelOption) => (
                            <option key={model.value} value={model.value}>
                              {model.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )
              )}

              {aiProvider === 'custom' && (
                <div className="mt-4">
                  <label className="form-label">API Endpoint URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://your-api.example.com"
                    value={customApiUrl}
                    onChange={(e) => setCustomApiUrl(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-[var(--border)] pt-6">
              <h3 className="section-title mb-4">AI Capabilities</h3>
              <div className="space-y-3">
                {[
                  { key: 'contentGeneration', label: 'Content Generation' },
                  { key: 'autoScheduling', label: 'Auto-scheduling' },
                  { key: 'sentimentAnalysis', label: 'Sentiment Analysis' },
                  { key: 'competitorMonitoring', label: 'Competitor Monitoring' },
                  { key: 'campaignOptimization', label: 'Campaign Optimization' },
                  { key: 'smartReplies', label: 'Smart Replies' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={aiSettings[key as keyof typeof aiSettings]}
                      onChange={(e) =>
                        setAiSettings({
                          ...aiSettings,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[var(--text)]">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6 mt-6">
              <h3 className="section-title mb-4">AI Behavior</h3>
              <div className="space-y-4">
                {[
                  { key: 'creativity', label: 'Creativity', min: 'Conservative', max: 'Creative' },
                  { key: 'responseLength', label: 'Response Length', min: 'Brief', max: 'Detailed' },
                  { key: 'toneMatching', label: 'Tone Matching', min: 'Loose', max: 'Strict' },
                ].map(({ key, label, min, max }) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-[var(--text)]">
                        {label}
                      </label>
                      <span className="text-sm text-[var(--accent)] font-semibold">
                        {aiSliders[key as keyof typeof aiSliders]}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={aiSliders[key as keyof typeof aiSliders]}
                      onChange={(e) =>
                        setAiSliders({
                          ...aiSliders,
                          [key]: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[var(--text3)] mt-1">
                      <span>{min}</span>
                      <span>{max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6 mt-6">
              <h3 className="section-title mb-4">API Keys</h3>
              <div className="space-y-3">
                {[
                  { key: 'openai', label: 'OpenAI API Key' },
                  { key: 'anthropic', label: 'Anthropic API Key' },
                  { key: 'custom', label: 'Custom API Key' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="form-label">{label}</label>
                    <div className="flex gap-2">
                      <input
                        type={
                          showApiKey[key] ? 'text' : 'password'
                        }
                        className="form-input flex-1"
                        value={apiKeys[key as keyof typeof apiKeys]}
                        readOnly
                      />
                      <button
                        onClick={() => toggleApiKeyVisibility(key)}
                        className="btn btn-secondary"
                      >
                        {showApiKey[key] ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      )}

      {/* Audience Tab */}
      {activeTab === 'audience' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">Audience Insights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[var(--bg2)] rounded-lg">
                <p className="text-sm font-medium text-[var(--text2)]">
                  Age Range
                </p>
                <p className="text-lg font-semibold text-[var(--text)] mt-1">
                  25-44 years old
                </p>
              </div>
              <div className="p-4 bg-[var(--bg2)] rounded-lg">
                <p className="text-sm font-medium text-[var(--text2)]">
                  Top Segments
                </p>
                <ul className="text-sm text-[var(--text)] mt-2 space-y-1">
                  <li>Young Professionals: 42%</li>
                  <li>Food Enthusiasts: 35%</li>
                  <li>New Yorkers: 28%</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--bg2)] rounded-lg">
                <p className="text-sm font-medium text-[var(--text2)]">
                  Peak Engagement Times
                </p>
                <p className="text-sm text-[var(--text)] mt-2">
                  Tuesday-Friday, 7-9 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">Budget Allocation</h2>

            <div className="space-y-4">
              <div>
                <label className="form-label">Monthly Budget</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="form-input flex-1"
                    value={budgetSettings.monthlyBudget}
                    onChange={(e) =>
                      setBudgetSettings({
                        ...budgetSettings,
                        monthlyBudget: parseInt(e.target.value),
                      })
                    }
                  />
                  <select
                    className="form-input w-24"
                    value={budgetSettings.currency}
                    onChange={(e) =>
                      setBudgetSettings({
                        ...budgetSettings,
                        currency: e.target.value,
                      })
                    }
                  >
                    <option>GBP</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <label className="form-label mb-4 block">
                  Channel Allocation
                </label>
                {[
                  { name: 'instagram', label: 'Instagram' },
                  { name: 'tiktok', label: 'TikTok' },
                  { name: 'facebook', label: 'Facebook' },
                  { name: 'linkedin', label: 'LinkedIn' },
                  { name: 'youtube', label: 'YouTube' },
                ].map(({ name, label }) => (
                  <div key={name} className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--text)]">{label}</span>
                      <span className="font-semibold text-[var(--accent)]">
                        {budgetSettings[name as keyof typeof budgetSettings]}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={budgetSettings[name as keyof typeof budgetSettings]}
                      onChange={(e) =>
                        setBudgetSettings({
                          ...budgetSettings,
                          [name]: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">Notification Preferences</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-[var(--text)] mb-3">
                  Email Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'emailDaily', label: 'Daily Report' },
                    { key: 'emailWeekly', label: 'Weekly Summary' },
                    { key: 'emailCampaignAlerts', label: 'Campaign Alerts' },
                    { key: 'emailBudgetWarning', label: 'Low Budget Warning' },
                    { key: 'emailFailedPost', label: 'Failed Post Alert' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          notificationSettings[
                            key as keyof typeof notificationSettings
                          ]
                        }
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[var(--text)]">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="font-medium text-[var(--text)] mb-3">
                  Push Notifications
                </h3>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[var(--text)]">
                    Enable Push Notifications
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button className="btn btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">Connected Integrations</h2>

            <div className="space-y-3">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 bg-[var(--bg2)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {integration.icon}
                    </div>
                    <span className="font-medium text-[var(--text)]">
                      {integration.name}
                    </span>
                  </div>
                  <button
                    className={`btn btn-sm ${
                      integration.connected
                        ? 'btn-secondary'
                        : 'btn-primary'
                    }`}
                  >
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
