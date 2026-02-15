'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Settings, LogOut, X, Info, ExternalLink, CheckCircle, AlertCircle, Loader2, HelpCircle, Link2, Zap } from 'lucide-react';

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

interface Platform {
  name: string;
  emoji: string;
  color: string;
  description: string;
  category: 'social' | 'video' | 'professional' | 'email';
}

const AVAILABLE_PLATFORMS: Platform[] = [
  {
    name: 'Instagram',
    emoji: '📷',
    color: '#E1306C',
    description: 'Share photos, reels, and stories with your audience',
    category: 'social',
  },
  {
    name: 'TikTok',
    emoji: '🎵',
    color: '#000000',
    description: 'Create short-form video content and reach younger audiences',
    category: 'video',
  },
  {
    name: 'Facebook',
    emoji: 'f',
    color: '#1877F2',
    description: 'Connect with communities and build a loyal following',
    category: 'social',
  },
  {
    name: 'LinkedIn',
    emoji: '🔗',
    color: '#0A66C2',
    description: 'Build professional connections and establish thought leadership',
    category: 'professional',
  },
  {
    name: 'X',
    emoji: '𝕏',
    color: '#000000',
    description: 'Share real-time updates and engage with your audience',
    category: 'social',
  },
  {
    name: 'YouTube',
    emoji: '▶️',
    color: '#FF0000',
    description: 'Share long-form video content and grow your subscriber base',
    category: 'video',
  },
  {
    name: 'Pinterest',
    emoji: '📌',
    color: '#E60023',
    description: 'Drive traffic and showcase visual inspiration to your audience',
    category: 'social',
  },
  {
    name: 'Google Business',
    emoji: 'G',
    color: '#4285F4',
    description: 'Manage your business profile and connect with local customers',
    category: 'professional',
  },
  {
    name: 'Email Marketing',
    emoji: '✉️',
    color: '#6366F1',
    description: 'Send newsletters and campaigns directly to your subscribers',
    category: 'email',
  },
];

const INTEGRATION_GUIDES: { [key: string]: { steps: string[]; url: string; buttonText: string } } = {
  Instagram: {
    steps: [
      'Go to Meta Business Suite (business.facebook.com)',
      'Navigate to Settings → Linked Accounts',
      'Click "Connect Instagram Account"',
      'Select your Instagram business account',
      'Authorize the connection',
      'Copy your account handle below',
    ],
    url: 'https://business.facebook.com',
    buttonText: 'Open Meta Business Suite',
  },
  TikTok: {
    steps: [
      'Visit TikTok for Business (ads.tiktok.com)',
      'Go to Developer Portal in your account settings',
      'Create a new application for API access',
      'Get your TikTok Business Account ID',
      'Authorize the integration',
      'Enter your TikTok handle below',
    ],
    url: 'https://ads.tiktok.com',
    buttonText: 'Open TikTok Developer Portal',
  },
  Facebook: {
    steps: [
      'Go to Meta Business Suite (business.facebook.com)',
      'Navigate to Pages → Select your page',
      'Go to Settings → Connected Apps & Websites',
      'Click "Connect a New App"',
      'Select our app from the list',
      'Enter your Facebook page handle below',
    ],
    url: 'https://business.facebook.com',
    buttonText: 'Open Meta Business Suite',
  },
  LinkedIn: {
    steps: [
      'Visit LinkedIn Developers (linkedin.com/developers)',
      'Click "Create App" and fill in your company details',
      'Accept the legal agreement',
      'Go to the Auth tab and copy your credentials',
      'Authorize our app to access your LinkedIn account',
      'Enter your LinkedIn handle below',
    ],
    url: 'https://www.linkedin.com/developers',
    buttonText: 'Open LinkedIn Developers',
  },
  X: {
    steps: [
      'Go to Twitter Developer Portal (developer.twitter.com)',
      'Navigate to Projects & Apps',
      'Create a new project if needed',
      'Create an app within your project',
      'Go to Keys & Tokens tab',
      'Copy your credentials and authorize',
      'Enter your X (Twitter) handle below',
    ],
    url: 'https://developer.twitter.com',
    buttonText: 'Open Twitter Developer Portal',
  },
  YouTube: {
    steps: [
      'Visit Google Cloud Console (console.cloud.google.com)',
      'Create a new project (or select existing one)',
      'Enable the YouTube Data API v3',
      'Create OAuth 2.0 credentials (Desktop application)',
      'Download and save your client credentials',
      'Authorize your YouTube channel',
      'Enter your channel handle below',
    ],
    url: 'https://console.cloud.google.com',
    buttonText: 'Open Google Cloud Console',
  },
  Pinterest: {
    steps: [
      'Go to Pinterest Developers (developers.pinterest.com)',
      'Click "Create App"',
      'Fill in your app details',
      'Go to Authentication section',
      'Copy your access token',
      'Authorize the integration',
      'Enter your Pinterest handle below',
    ],
    url: 'https://developers.pinterest.com',
    buttonText: 'Open Pinterest Developers',
  },
  'Google Business': {
    steps: [
      'Visit Google Business Profile (business.google.com)',
      'Sign in with your business account',
      'Select your business location',
      'Go to Settings → Account Verification',
      'Complete the verification if needed',
      'Authorize access to your profile',
      'Enter your business name or handle below',
    ],
    url: 'https://business.google.com',
    buttonText: 'Open Google Business Profile',
  },
  'Email Marketing': {
    steps: [
      'Choose your email provider: Mailchimp, SendGrid, or custom SMTP',
      'For Mailchimp: Go to Account → Integrations → API Keys',
      'For SendGrid: Go to Settings → API Keys',
      'For custom SMTP: Gather your server details (host, port, username, password)',
      'Copy your credentials',
      'Authorize the connection',
      'Enter your email/account identifier below',
    ],
    url: 'https://mailchimp.com',
    buttonText: 'Open Email Provider',
  },
};

const PLATFORM_COLORS: { [key: string]: string } = {
  instagram: '#E1306C',
  tiktok: '#000000',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  x: '#000000',
  youtube: '#FF0000',
  pinterest: '#E60023',
  'google business': '#4285F4',
  'email marketing': '#6366F1',
};

function ChannelCard({
  channel,
  onDisconnect,
  onShowGuide,
}: {
  channel: Channel;
  onDisconnect: (id: string) => void;
  onShowGuide: (platform: string) => void;
}) {
  const statusConfig = {
    connected: { label: 'Connected', color: 'tag-green', icon: CheckCircle },
    pending: { label: 'Pending', color: 'tag-amber', icon: AlertCircle },
    disconnected: { label: 'Disconnected', color: 'tag-red', icon: AlertCircle },
  };

  const config = statusConfig[channel.status];
  const StatusIcon = config.icon;

  const getPlatformEmoji = (platform: string) => {
    const platformData = AVAILABLE_PLATFORMS.find((p) => p.name.toLowerCase() === platform.toLowerCase());
    return platformData?.emoji || '◆';
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
            {getPlatformEmoji(channel.platform)}
          </div>
          <div>
            <h3 className="font-semibold text-base">{channel.platform}</h3>
            <p className="text-sm text-[var(--text2)]">{channel.handle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`tag ${config.color} text-xs flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-[var(--border)]">
        <div>
          <p className="text-xs text-[var(--text2)] uppercase tracking-wide">Followers</p>
          <p className="text-lg font-semibold">
            {channel.followers > 1000 ? `${(channel.followers / 1000).toFixed(1)}K` : channel.followers}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text2)] uppercase tracking-wide">Posts</p>
          <p className="text-lg font-semibold">{channel.postsThisMonth}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text2)] uppercase tracking-wide">Engagement</p>
          <p className="text-lg font-semibold">{channel.engagementRate}%</p>
        </div>
      </div>

      <p className="text-xs text-[var(--text2)] mb-4">Last synced: {channel.lastSyncedAt}</p>

      <div className="flex items-center gap-2">
        <button className="flex-1 btn btn-secondary btn-sm">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <button
          onClick={() => onShowGuide(channel.platform)}
          className="flex-1 btn btn-secondary btn-sm"
          title="View connection instructions"
        >
          <HelpCircle className="h-4 w-4" />
          How To
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

function IntegrationGuideModal({
  isOpen,
  platform,
  onClose,
  onConnect,
  isLoading,
}: {
  isOpen: boolean;
  platform: string | null;
  onClose: () => void;
  onConnect: (platform: string, handle: string) => void;
  isLoading: boolean;
}) {
  const [handle, setHandle] = useState('');
  const [step, setStep] = useState<'guide' | 'entering'>('guide');

  if (!isOpen || !platform) return null;

  const guide = INTEGRATION_GUIDES[platform];
  const platformData = AVAILABLE_PLATFORMS.find((p) => p.name === platform);

  const handleConnect = () => {
    if (handle.trim()) {
      onConnect(platform, handle);
      setHandle('');
      setStep('guide');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center text-lg font-bold text-white"
              style={{ backgroundColor: platformData?.color }}
            >
              {platformData?.emoji}
            </div>
            <h2 className="text-2xl font-bold">Connect {platform}</h2>
          </div>
          <button onClick={onClose} className="text-[var(--text2)] hover:text-[var(--text)]">
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'guide' && (
          <>
            <div className="mb-8 p-4 bg-[var(--bg2)] rounded-lg border border-[var(--border)]">
              <p className="text-sm text-[var(--text2)] mb-4">
                {platformData?.description}
              </p>
              <p className="text-sm font-semibold text-[var(--text)] mb-3">Follow these steps:</p>
              <ol className="space-y-2">
                {guide.steps.map((step, idx) => (
                  <li key={idx} className="text-sm flex gap-3">
                    <span className="font-semibold text-[var(--accent)] min-w-6">{idx + 1}.</span>
                    <span className="text-[var(--text2)]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-3 mb-6">
              <a
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {guide.buttonText}
              </a>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => setStep('entering')}
                className="flex-1 btn btn-primary"
              >
                I've Set Up My Credentials
              </button>
            </div>
          </>
        )}

        {step === 'entering' && (
          <>
            <div className="mb-6">
              <label className="form-label">
                Enter your {platform} handle or account name
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder={`e.g., @myaccount or myemail@example.com`}
                className="form-input w-full"
                disabled={isLoading}
              />
              <p className="text-xs text-[var(--text2)] mt-2">
                This helps us identify your account when fetching data
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('guide')}
                className="flex-1 btn btn-secondary"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleConnect}
                disabled={!handle.trim() || isLoading}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Connect {platform}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  onPlatformSelect,
}: {
  onPlatformSelect: (platform: string) => void;
}) {
  const categories = {
    social: AVAILABLE_PLATFORMS.filter((p) => p.category === 'social'),
    video: AVAILABLE_PLATFORMS.filter((p) => p.category === 'video'),
    professional: AVAILABLE_PLATFORMS.filter((p) => p.category === 'professional'),
    email: AVAILABLE_PLATFORMS.filter((p) => p.category === 'email'),
  };

  return (
    <div className="space-y-12">
      <div className="card text-center py-12 bg-gradient-to-br from-[var(--accent-bg)] to-[var(--bg)]">
        <div className="mb-4 text-5xl">🎯</div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Channels!</h2>
        <p className="text-[var(--text2)] mb-4">
          Connect your social media and email marketing accounts to manage all your content from one place.
        </p>
        <p className="text-sm text-[var(--text2)]">
          Click "Connect" on any platform below to get started in just a few minutes.
        </p>
      </div>

      {Object.entries(categories).map(([category, platforms]) => (
        <section key={category}>
          <h3 className="section-title mb-4 capitalize">
            {category === 'email' ? 'Email & Marketing' : `${category} Platforms`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="card p-6 hover:shadow-lg transition-all border-2 border-[var(--border)] hover:border-[var(--accent)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="h-14 w-14 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.emoji}
                  </div>
                </div>

                <h4 className="font-semibold text-base mb-2">{platform.name}</h4>
                <p className="text-sm text-[var(--text2)] mb-4">{platform.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onPlatformSelect(platform.name)}
                    className="flex-1 btn btn-primary btn-sm"
                  >
                    <Link2 className="h-4 w-4" />
                    Connect
                  </button>
                  <button
                    onClick={() => onPlatformSelect(platform.name)}
                    className="btn btn-secondary btn-sm px-3"
                    title="View how to connect"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="card p-6 bg-[var(--accent-bg)] border border-[var(--accent)]">
        <div className="flex gap-3">
          <Zap className="h-5 w-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[var(--text)] mb-1">Pro Tip</p>
            <p className="text-sm text-[var(--text2)]">
              Start with your most active platform and add more gradually. Each connection takes just a few minutes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChannelsPage() {
  const [selectedPlatformForGuide, setSelectedPlatformForGuide] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/channels');

      if (res.status === 500) {
        setChannels([]);
        setError(null);
      } else if (res.ok) {
        const data = await res.json();
        const rawChannels = data.channels || [];
        const mappedChannels = rawChannels.map((ch: any) => ({
          id: ch.id,
          platform: ch.platform,
          handle: ch.handle,
          status: ch.isActive ? 'connected' : 'disconnected',
          followers: ch.followers || 0,
          postsThisMonth: 0,
          engagementRate: 0,
          lastSyncedAt: ch.createdAt ? new Date(ch.createdAt).toLocaleDateString() : 'Never',
          brandColor: PLATFORM_COLORS[ch.platform?.toLowerCase()] || '#000000',
        }));
        setChannels(mappedChannels);
        setError(null);
      } else {
        setError('Failed to fetch channels');
      }
    } catch (e) {
      console.error(e);
      setError('Error fetching channels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleDisconnect = async (channelId: string) => {
    try {
      const res = await fetch('/api/channels', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: channelId }),
      });
      if (res.ok) {
        setChannels(channels.filter((ch) => ch.id !== channelId));
        setSuccessMessage('Channel disconnected successfully');
      }
    } catch (e) {
      console.error(e);
      setError('Error disconnecting channel');
    }
  };

  const handleAddChannel = async (platform: string, handle: string) => {
    try {
      setIsConnecting(true);
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          handle,
          displayName: platform,
        }),
      });
      if (res.status === 500) {
        setError('Database not available. Please try again later.');
      } else if (res.ok) {
        await fetchChannels();
        setSelectedPlatformForGuide(null);
        setSuccessMessage(`${platform} connected successfully!`);
      } else {
        setError('Failed to connect channel. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setError('Error adding channel');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectedChannels = channels.filter((ch) => ch.status === 'connected');
  const pendingChannels = channels.filter((ch) => ch.status === 'pending');
  const hasChannels = connectedChannels.length > 0 || pendingChannels.length > 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="page-title">Channels</h1>
            <p className="page-subtitle">Connect and manage your social media accounts</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[var(--accent)]" />
          <p className="text-[var(--text2)]">Loading your channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">Channels</h1>
          <p className="page-subtitle">Connect and manage your social media accounts</p>
        </div>
        {hasChannels && (
          <button
            onClick={() => setSelectedPlatformForGuide('')}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4" />
            Add Channel
          </button>
        )}
      </div>

      {error && (
        <div className="card bg-[var(--red)]/10 border border-[var(--red)]/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[var(--red)] flex-shrink-0 mt-0.5" />
          <p className="text-[var(--red)]">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="card bg-[var(--green)]/10 border border-[var(--green)]/20 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-[var(--green)] flex-shrink-0 mt-0.5" />
          <p className="text-[var(--green)]">{successMessage}</p>
        </div>
      )}

      {!hasChannels ? (
        <EmptyState onPlatformSelect={setSelectedPlatformForGuide} />
      ) : (
        <>
          {connectedChannels.length > 0 && (
            <section>
              <h2 className="section-title mb-6">Connected Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedChannels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    onDisconnect={handleDisconnect}
                    onShowGuide={setSelectedPlatformForGuide}
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
                    onShowGuide={setSelectedPlatformForGuide}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <IntegrationGuideModal
        isOpen={selectedPlatformForGuide !== null}
        platform={selectedPlatformForGuide && selectedPlatformForGuide !== '' ? selectedPlatformForGuide : null}
        onClose={() => setSelectedPlatformForGuide(null)}
        onConnect={handleAddChannel}
        isLoading={isConnecting}
      />
    </div>
  );
}
