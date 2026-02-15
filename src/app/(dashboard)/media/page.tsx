'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Upload, X, Trash2, Clock, Send, Loader2, Sparkles,
  Image as ImageIcon, Video, Wand2, Hash, Type, Eye,
  CheckCircle, AlertCircle, RotateCcw, Copy, Check,
  Heart, MessageCircle, Share2, Bookmark,
} from 'lucide-react';

type Channel = 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn' | 'X';
type ContentType = 'image' | 'video' | 'reel' | 'story' | 'carousel';
type PostStatus = 'draft' | 'scheduled' | 'published';
type AIMode = 'full' | 'caption' | 'hashtags';

interface Post {
  id: string;
  title: string;
  content: string;
  platform: string;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  reach?: number;
  impressions?: number;
  engagement?: number;
  clicks?: number;
  mediaUrls?: string[];
  createdAt?: string;
}

interface BrandDNA {
  brandName: string;
  industry: string;
  location: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const CHANNEL_CONFIG: Record<Channel, { emoji: string; color: string; aspectClass: string; aspectLabel: string }> = {
  Instagram: { emoji: '📷', color: '#E1306C', aspectClass: 'aspect-square', aspectLabel: '1:1 Square' },
  TikTok: { emoji: '🎵', color: '#000000', aspectClass: 'aspect-[9/16]', aspectLabel: '9:16 Vertical' },
  Facebook: { emoji: 'f', color: '#1877F2', aspectClass: 'aspect-video', aspectLabel: '16:9 Landscape' },
  LinkedIn: { emoji: '🔗', color: '#0A66C2', aspectClass: 'aspect-video', aspectLabel: '16:9 Landscape' },
  X: { emoji: '𝕏', color: '#000000', aspectClass: 'aspect-video', aspectLabel: '16:9 Landscape' },
};

// ─── INSTAGRAM PREVIEW ─────────────────────────────────────
function InstagramPreview({
  caption,
  hashtags,
  mediaUrl,
  brandName,
  brandColor,
}: {
  caption: string;
  hashtags: string;
  mediaUrl: string | null;
  brandName: string;
  brandColor: string;
}) {
  const isVideo = mediaUrl?.startsWith('data:video/');
  const profileInitial = (brandName || 'B').charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-[375px] mx-auto rounded-3xl overflow-hidden" style={{
      backgroundColor: '#fff',
      border: '12px solid #000',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    }}>
      {/* Status Bar */}
      <div className="h-6 bg-black flex items-center justify-between px-3" style={{ fontSize: '10px', color: '#fff' }}>
        <span>9:41</span>
        <div className="flex gap-1">📶 📡 🔋</div>
      </div>

      {/* Header with Profile */}
      <div className="flex items-center gap-3 px-3 py-2.5 border-b" style={{ borderColor: '#e0e0e0' }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: brandColor || '#E1306C' }}
        >
          {profileInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold" style={{ color: '#262626' }}>
            {brandName || 'yourbrand'}
          </p>
          <p className="text-[10px]" style={{ color: '#8e8e8e' }}>
            Sponsored
          </p>
        </div>
        <button className="text-[10px] font-semibold px-3 py-1.5 rounded" style={{ color: '#0095f6', border: '1px solid #e0e0e0' }}>
          Follow
        </button>
        <span style={{ color: '#262626', fontSize: '16px' }}>⋯</span>
      </div>

      {/* Media - FULL WIDTH, EDGE TO EDGE */}
      <div className="w-full aspect-square relative overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
        {mediaUrl ? (
          isVideo ? (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-5xl">▶️</div>
            </div>
          ) : (
            <img src={mediaUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brandColor || '#E1306C'}20, ${brandColor || '#E1306C'}05)` }}>
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={48} style={{ color: brandColor || '#E1306C', opacity: 0.3 }} />
            </div>
          </div>
        )}
      </div>

      {/* Action Icons Row */}
      <div className="px-3 pt-3 pb-1.5 flex items-center gap-4">
        <Heart size={20} style={{ color: '#262626', cursor: 'pointer' }} strokeWidth={1.5} />
        <MessageCircle size={20} style={{ color: '#262626', cursor: 'pointer' }} strokeWidth={1.5} />
        <Share2 size={20} style={{ color: '#262626', cursor: 'pointer' }} strokeWidth={1.5} />
        <Bookmark size={20} style={{ color: '#262626', cursor: 'pointer', marginLeft: 'auto' }} strokeWidth={1.5} />
      </div>

      {/* Likes Count */}
      <div className="px-3 py-0.5">
        <p className="text-xs font-semibold" style={{ color: '#262626' }}>12.5K likes</p>
      </div>

      {/* Caption with Username & Hashtags */}
      <div className="px-3 pb-3">
        <p className="text-xs leading-relaxed" style={{ color: '#262626' }}>
          <span className="font-semibold">{(brandName || 'yourbrand').toLowerCase().replace(/\s+/g, '')} </span>
          {caption || 'Your caption will appear here...'}
          {hashtags && (
            <>
              <br />
              <span style={{ color: '#0095f6' }}>{hashtags}</span>
            </>
          )}
        </p>
      </div>

      {/* View Comments */}
      <div className="px-3 pb-2">
        <p className="text-xs" style={{ color: '#8e8e8e' }}>View all 42 comments</p>
      </div>

      {/* Timestamp */}
      <div className="px-3 pb-2">
        <p className="text-[10px] uppercase" style={{ color: '#8e8e8e' }}>2 hours ago</p>
      </div>
    </div>
  );
}

// ─── TIKTOK PREVIEW ───────────────────────────────────────
function TikTokPreview({
  caption,
  hashtags,
  mediaUrl,
  brandName,
  brandColor,
}: {
  caption: string;
  hashtags: string;
  mediaUrl: string | null;
  brandName: string;
  brandColor: string;
}) {
  const isVideo = mediaUrl?.startsWith('data:video/');
  const profileInitial = (brandName || 'B').charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden relative" style={{
      backgroundColor: '#000',
      aspectRatio: '9/16',
      maxHeight: '520px',
      border: '12px solid #000',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      {/* Top Bar - Following | For You */}
      <div className="absolute top-0 left-0 right-0 z-20 h-8 flex items-center justify-center gap-6 pt-2">
        <p className="text-xs text-white font-medium">Following</p>
        <p className="text-xs text-white opacity-60">For You</p>
      </div>

      {/* Media - FULL FRAME */}
      <div className="absolute inset-0">
        {mediaUrl ? (
          isVideo ? (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-5xl">▶️</div>
            </div>
          ) : (
            <img src={mediaUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${brandColor}40, #000)` }}>
            <Video size={48} style={{ color: '#fff', opacity: 0.3 }} />
          </div>
        )}
      </div>

      {/* Right Side Floating Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20">
        {/* Profile Button */}
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: brandColor || '#000', border: '2px solid #fff' }}
          >
            {profileInitial}
          </div>
          <div className="w-5 h-5 rounded-full bg-[#FE2C55] flex items-center justify-center -mt-2 text-white text-[10px] font-bold font-sans">+</div>
        </div>

        {/* Heart Count */}
        <div className="flex flex-col items-center text-white text-xs">
          <Heart size={24} fill="white" strokeWidth={0} />
          <span className="text-[10px] mt-0.5">24.5K</span>
        </div>

        {/* Comment Count */}
        <div className="flex flex-col items-center text-white text-xs">
          <MessageCircle size={24} strokeWidth={1.5} />
          <span className="text-[10px] mt-0.5">312</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center text-white text-xs">
          <Share2 size={24} strokeWidth={1.5} />
          <span className="text-[10px] mt-0.5">Share</span>
        </div>

        {/* Music Note */}
        <div className="flex flex-col items-center text-white">
          <span className="text-2xl">🎵</span>
        </div>
      </div>

      {/* Bottom Caption Area */}
      <div className="absolute left-3 right-16 bottom-6 z-20">
        <p className="text-white text-xs font-bold mb-1">
          @{(brandName || 'yourbrand').toLowerCase().replace(/\s+/g, '')}
        </p>
        <p className="text-white text-xs leading-relaxed line-clamp-2">
          {caption || 'Your caption here...'}
          {hashtags && (
            <>
              {' '}
              <span style={{ color: '#58c4dc' }}>{hashtags}</span>
            </>
          )}
        </p>

        {/* Music Bar */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-white text-xs">🎵</span>
          <div className="overflow-hidden flex-1">
            <p className="text-white text-[10px] whitespace-nowrap animate-pulse">
              Original Sound - {brandName || 'Your Brand'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FACEBOOK PREVIEW ──────────────────────────────────────
function FacebookPreview({
  caption,
  hashtags,
  mediaUrl,
  brandName,
  brandColor,
}: {
  caption: string;
  hashtags: string;
  mediaUrl: string | null;
  brandName: string;
  brandColor: string;
}) {
  const isVideo = mediaUrl?.startsWith('data:video/');
  const profileInitial = (brandName || 'B').charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-[500px] mx-auto rounded-lg overflow-hidden" style={{
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: brandColor || '#1877F2' }}
          >
            {profileInitial}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#050505' }}>
              {brandName || 'Your Brand'}
            </p>
            <p className="text-xs" style={{ color: '#65676b' }}>2 hours ago • 🌐</p>
          </div>
        </div>
        <button style={{ color: '#65676b' }}>⋯</button>
      </div>

      {/* Caption */}
      <div className="px-4 py-2">
        <p className="text-sm leading-relaxed" style={{ color: '#050505' }}>
          {caption || 'Your caption here...'}
          {hashtags && (
            <>
              <br />
              <span style={{ color: '#0064d1' }}>{hashtags}</span>
            </>
          )}
        </p>
      </div>

      {/* Media */}
      <div className="w-full aspect-video relative overflow-hidden" style={{ backgroundColor: '#f0f2f5' }}>
        {mediaUrl ? (
          isVideo ? (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-5xl">▶️</div>
            </div>
          ) : (
            <img src={mediaUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brandColor}15, #f0f2f5)` }}>
            <ImageIcon size={40} style={{ color: '#1877F2', opacity: 0.3 }} />
          </div>
        )}
      </div>

      {/* Reactions & Counts */}
      <div className="px-4 py-2 flex items-center justify-between text-xs" style={{ color: '#65676b', borderTop: '1px solid #e0e0e0' }}>
        <span>👍😍 1.2K</span>
        <div className="flex gap-4">
          <span>156 comments</span>
          <span>42 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 flex items-center justify-around text-xs font-semibold" style={{ color: '#65676b', borderTop: '1px solid #e0e0e0' }}>
        <button className="flex items-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded justify-center">👍 Like</button>
        <button className="flex items-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded justify-center">💬 Comment</button>
        <button className="flex items-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded justify-center">📤 Share</button>
      </div>
    </div>
  );
}

// ─── LINKEDIN PREVIEW ──────────────────────────────────────
function LinkedInPreview({
  caption,
  hashtags,
  mediaUrl,
  brandName,
  brandColor,
}: {
  caption: string;
  hashtags: string;
  mediaUrl: string | null;
  brandName: string;
  brandColor: string;
}) {
  const isVideo = mediaUrl?.startsWith('data:video/');
  const profileInitial = (brandName || 'B').charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-[500px] mx-auto rounded-lg overflow-hidden" style={{
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: brandColor || '#0A66C2' }}
          >
            {profileInitial}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: '#000' }}>
              {brandName || 'Your Brand'}
            </p>
            <p className="text-xs" style={{ color: '#666' }}>1st •</p>
            <p className="text-xs" style={{ color: '#666' }}>1,234 followers • 2h • 🌐</p>
          </div>
        </div>
        <button style={{ color: '#65676b' }}>⋯</button>
      </div>

      {/* Caption */}
      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed" style={{ color: '#000' }}>
          {caption || 'Your professional caption here...'}
          {hashtags && (
            <>
              <br />
              <span style={{ color: '#0A66C2' }}>{hashtags}</span>
            </>
          )}
        </p>
      </div>

      {/* Media */}
      <div className="w-full aspect-video relative overflow-hidden" style={{ backgroundColor: '#f3f2ef' }}>
        {mediaUrl ? (
          isVideo ? (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-5xl">▶️</div>
            </div>
          ) : (
            <img src={mediaUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brandColor}15, #f3f2ef)` }}>
            <ImageIcon size={40} style={{ color: '#0A66C2', opacity: 0.3 }} />
          </div>
        )}
      </div>

      {/* Social Proof */}
      <div className="px-4 py-2 text-xs" style={{ color: '#666', borderTop: '1px solid #e0e0e0' }}>
        👍😍🎉 342 reactions • 28 comments
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 flex items-center justify-around text-xs font-semibold" style={{ color: '#65676b', borderTop: '1px solid #e0e0e0' }}>
        <button className="flex items-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded justify-center">👍 Like</button>
        <button className="flex items-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded justify-center">💬 Comment</button>
        <button className="flex items-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded justify-center">🔄 Repost</button>
        <button className="flex items-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded justify-center">📤 Send</button>
      </div>
    </div>
  );
}

// ─── X (TWITTER) PREVIEW ──────────────────────────────────
function XPreview({
  caption,
  hashtags,
  mediaUrl,
  brandName,
  brandColor,
}: {
  caption: string;
  hashtags: string;
  mediaUrl: string | null;
  brandName: string;
  brandColor: string;
}) {
  const isVideo = mediaUrl?.startsWith('data:video/');
  const profileInitial = (brandName || 'B').charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-[500px] mx-auto rounded-xl overflow-hidden" style={{
      backgroundColor: '#000',
      border: '1px solid #2f3336',
    }}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: brandColor || '#000' }}
          >
            {profileInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: '#e7e9ea' }}>
              {brandName || 'Your Brand'}
            </p>
            <p className="text-xs" style={{ color: '#71767b' }}>
              @{(brandName || 'yourbrand').toLowerCase().replace(/\s+/g, '')} • 2h
            </p>
          </div>
        </div>
        <button style={{ color: '#71767b' }}>⋯</button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed" style={{ color: '#e7e9ea' }}>
          {caption || 'Your post here...'}
          {hashtags && (
            <>
              {' '}
              <span style={{ color: '#1d9bf0' }}>{hashtags}</span>
            </>
          )}
        </p>
      </div>

      {/* Media */}
      {mediaUrl && (
        <div className="mx-4 mb-3 rounded-2xl overflow-hidden aspect-video relative" style={{ backgroundColor: '#16181c' }}>
          {isVideo ? (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-5xl">▶️</div>
            </div>
          ) : (
            <img src={mediaUrl} alt="Post" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
      )}

      {/* Action Counts */}
      <div className="px-4 py-3 flex items-center justify-around text-xs" style={{ color: '#71767b', borderTop: '1px solid #2f3336' }}>
        <span>💬 12</span>
        <span>🔄 8</span>
        <span>♡ 124</span>
        <span>📊 1.2K</span>
        <span>↗️</span>
      </div>
    </div>
  );
}

// ─── SOCIAL PREVIEW WRAPPER ────────────────────────────────
function SocialPreview({
  channel,
  caption,
  hashtags,
  mediaUrl,
  brandName,
  brandColor,
}: {
  channel: Channel;
  caption: string;
  hashtags: string;
  mediaUrl: string | null;
  brandName: string;
  brandColor: string;
}) {
  switch (channel) {
    case 'Instagram':
      return <InstagramPreview caption={caption} hashtags={hashtags} mediaUrl={mediaUrl} brandName={brandName} brandColor={brandColor} />;
    case 'TikTok':
      return <TikTokPreview caption={caption} hashtags={hashtags} mediaUrl={mediaUrl} brandName={brandName} brandColor={brandColor} />;
    case 'Facebook':
      return <FacebookPreview caption={caption} hashtags={hashtags} mediaUrl={mediaUrl} brandName={brandName} brandColor={brandColor} />;
    case 'LinkedIn':
      return <LinkedInPreview caption={caption} hashtags={hashtags} mediaUrl={mediaUrl} brandName={brandName} brandColor={brandColor} />;
    case 'X':
      return <XPreview caption={caption} hashtags={hashtags} mediaUrl={mediaUrl} brandName={brandName} brandColor={brandColor} />;
  }
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────
export default function MediaPage() {
  // Create Post State
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [topicText, setTopicText] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['Instagram']);
  const [contentType, setContentType] = useState<ContentType>('image');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');

  // AI State
  const [aiMode, setAiMode] = useState<AIMode>('full');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiTone, setAiTone] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);

  // Saving State
  const [isSaving, setIsSaving] = useState(false);

  // Content Library State
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Brand DNA
  const [brandDNA, setBrandDNA] = useState<BrandDNA | null>(null);

  // Detail Modal
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingCaption, setEditingCaption] = useState('');
  const [editingHashtags, setEditingHashtags] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);

  // Preview Channel Selector
  const [previewChannel, setPreviewChannel] = useState<Channel>('Instagram');

  // UI
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragZoneRef = useRef<HTMLDivElement>(null);

  // ─── Effects ────────────────────────────────────────────
  useEffect(() => {
    fetchPosts();
    fetchBrandDNA();
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (filterChannel !== 'all') {
      filtered = filtered.filter(p => p.platform?.toLowerCase() === filterChannel.toLowerCase());
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    setFilteredPosts(filtered);
  }, [posts, filterChannel, filterStatus]);

  useEffect(() => {
    if (selectedChannels.length > 0 && !selectedChannels.includes(previewChannel)) {
      setPreviewChannel(selectedChannels[0]);
    }
  }, [selectedChannels, previewChannel]);

  // ─── API Calls ──────────────────────────────────────────
  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } else {
        throw new Error(`Failed to fetch posts: ${res.status}`);
      }
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setError('Unable to load content library');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchBrandDNA = async () => {
    try {
      const res = await fetch('/api/brand');
      if (res.ok) {
        const data = await res.json();
        if (data.brand) {
          setBrandDNA({
            brandName: data.brand.brandName || '',
            industry: data.brand.industry || '',
            location: data.brand.location || '',
            primaryColor: data.brand.colors?.primary || '#000000',
            secondaryColor: data.brand.colors?.secondary || '#FFFFFF',
            accentColor: data.brand.colors?.accent || '#0066cc',
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch brand', err);
    }
  };

  // ─── File Handling ──────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragZoneRef.current) {
      dragZoneRef.current.style.borderColor = 'var(--accent)';
      dragZoneRef.current.style.backgroundColor = 'var(--accent-bg)';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragZoneRef.current) {
      dragZoneRef.current.style.borderColor = 'var(--border)';
      dragZoneRef.current.style.backgroundColor = 'transparent';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragZoneRef.current) {
      dragZoneRef.current.style.borderColor = 'var(--border)';
      dragZoneRef.current.style.backgroundColor = 'transparent';
    }
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Only images and videos are allowed');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile(e.target?.result as string);
      setUploadedFileName(file.name);
      setError(null);
      if (file.type.startsWith('video/')) {
        setContentType('video');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) processFile(files[0]);
  };

  // ─── Channel Toggle ─────────────────────────────────────
  const toggleChannel = (channel: Channel) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // ─── AI Edit ────────────────────────────────────────────
  const handleAIEdit = async (mode: AIMode) => {
    if (!topicText.trim() && !uploadedFile) {
      setError('Please enter a topic or upload media first');
      return;
    }
    if (selectedChannels.length === 0) {
      setError('Please select at least one channel');
      return;
    }

    try {
      setIsGenerating(true);
      setAiMode(mode);
      setError(null);
      setAiError(null);

      const res = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          topic: topicText,
          platform: previewChannel,
          contentType,
          hasMedia: !!uploadedFile,
          mediaType: uploadedFile?.startsWith('data:video/') ? 'video' : 'image',
          existingCaption: caption,
          existingHashtags: hashtags,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `AI generation failed (${res.status})`);
      }

      const data = await res.json();
      const result = data.result;

      if (result) {
        if (mode === 'full' || mode === 'caption') {
          setCaption(result.caption || caption);
        }
        if (mode === 'full' || mode === 'hashtags') {
          setHashtags(result.hashtags || hashtags);
        }
        setAiSuggestions(result.suggestions || []);
        setAiTone(result.tone || '');
      }

      setSuccess(
        mode === 'full' ? 'AI generated caption & hashtags!' :
        mode === 'caption' ? 'AI generated caption!' :
        'AI generated hashtags!'
      );
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI generation failed. Please try again.';
      setAiError(errorMessage);
      console.error('AI Edit error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Save / Publish ─────────────────────────────────────
  const handleSavePost = async (status: PostStatus) => {
    if (!caption.trim()) {
      setError('Please add a caption');
      return;
    }
    if (selectedChannels.length === 0) {
      setError('Please select at least one channel');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const fullContent = `${caption}\n\n${hashtags}`;
      const scheduledDateTime = status === 'scheduled' && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined;

      for (const channel of selectedChannels) {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: topicText || `${channel} Post ${new Date().toLocaleDateString()}`,
            content: fullContent,
            platform: channel,
            status,
            scheduledAt: scheduledDateTime,
            mediaUrls: uploadedFile ? [uploadedFile] : [],
          }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to save for ${channel}`);
        }
      }

      setSuccess(
        status === 'scheduled'
          ? `Post scheduled for ${scheduledDate} at ${scheduledTime}!`
          : status === 'draft'
          ? 'Saved as draft!'
          : 'Post published!'
      );

      // Reset
      setUploadedFile(null);
      setUploadedFileName('');
      setTopicText('');
      setCaption('');
      setHashtags('');
      setScheduledDate('');
      setScheduledTime('09:00');
      setAiSuggestions([]);
      setAiTone('');
      setAiError(null);
      await fetchPosts();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save post';
      setError(errorMessage);
      console.error('Save post error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Update Post ────────────────────────────────────────
  const handleUpdatePost = async () => {
    if (!selectedPost) return;
    try {
      setIsSaving(true);
      setError(null);
      const fullContent = `${editingCaption}\n\n${editingHashtags}`;
      const res = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPost.id, content: fullContent, status: selectedPost.status }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update post');
      }
      setSuccess('Post updated!');
      setIsEditingPost(false);
      setSelectedPost(null);
      await fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      setError(errorMessage);
      console.error('Update post error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete Post ────────────────────────────────────────
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete post');
      }
      setSelectedPost(null);
      await fetchPosts();
      setSuccess('Post deleted');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      console.error('Delete post error:', err);
    }
  };

  // ─── Copy to Clipboard ─────────────────────────────────
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusColor = (status: PostStatus): string => {
    const map: Record<string, string> = { draft: 'tag-amber', scheduled: 'tag-blue', published: 'tag-green' };
    return map[status] || 'tag-blue';
  };

  const brandColor = brandDNA?.primaryColor || '#000';
  const brandName = brandDNA?.brandName || 'Your Brand';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* ─── Header ──────────────────────────────────────── */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="page-title">Media Studio</h1>
          <p className="page-subtitle">Create AI-powered content from your Brand DNA</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ─── Alerts ────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--red)', color: 'var(--red)' }}>
            <AlertCircle size={18} />
            <span className="flex-1 text-sm">{error}</span>
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', color: 'var(--green)' }}>
            <CheckCircle size={18} />
            <span className="flex-1 text-sm">{success}</span>
            <button onClick={() => setSuccess(null)}><X size={16} /></button>
          </div>
        )}

        {/* ─── CREATE POST ───────────────────────────────── */}
        <div className="card" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-6">
            <h2 className="section-title">Create New Post</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>
              Upload content and let AI craft the perfect post using your Brand DNA
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── Left Column: Input ─────────────────────── */}
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                ref={dragZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg3)' }}
              >
                <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileInputChange} className="hidden" />
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      {uploadedFile.startsWith('data:video/') ? (
                        <div className="w-32 h-32 bg-black rounded-lg flex items-center justify-center text-4xl">🎬</div>
                      ) : (
                        <img src={uploadedFile} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setUploadedFileName(''); }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: 'var(--red)' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text2)' }}>{uploadedFileName}</p>
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>Click to replace</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload size={28} style={{ color: 'var(--accent)', margin: '0 auto' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Drop your image or video here</p>
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>or click to browse</p>
                  </div>
                )}
              </div>

              {/* Topic */}
              <div>
                <label className="form-label">Post Topic or Idea</label>
                <textarea
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  placeholder="e.g., New sourdough bagels for spring, weekend brunch promotion..."
                  rows={3}
                  className="form-input"
                />
              </div>

              {/* Channels */}
              <div>
                <label className="form-label">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {(['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'X'] as const).map((ch) => {
                    const cfg = CHANNEL_CONFIG[ch];
                    const selected = selectedChannels.includes(ch);
                    return (
                      <button
                        key={ch}
                        onClick={() => toggleChannel(ch)}
                        className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                        style={{
                          backgroundColor: selected ? cfg.color : 'var(--bg2)',
                          color: selected ? '#fff' : 'var(--text)',
                          border: `1px solid ${selected ? cfg.color : 'var(--border)'}`,
                        }}
                      >
                        <span>{cfg.emoji}</span>
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Type */}
              <div>
                <label className="form-label">Content Type</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['image', 'video', 'reel', 'story', 'carousel'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setContentType(type)}
                      className="py-2 px-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: contentType === type ? 'var(--accent-bg)' : 'var(--bg2)',
                        color: contentType === type ? 'var(--accent)' : 'var(--text2)',
                        border: `1px solid ${contentType === type ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── AI Edit Buttons ──────────────────────── */}
              <div className="space-y-3 p-5 rounded-xl" style={{ backgroundColor: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>AI Edit</span>
                  <span className="text-xs" style={{ color: 'var(--text3)' }}>Powered by your Brand DNA</span>
                </div>

                {aiError && (
                  <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid var(--red)' }}>
                    {aiError}
                  </div>
                )}

                {/* Main AI Button */}
                <button
                  onClick={() => handleAIEdit('full')}
                  disabled={isGenerating || (!topicText.trim() && !uploadedFile)}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  style={{ background: 'var(--gradient)' }}
                >
                  {isGenerating && aiMode === 'full' ? (
                    <><Loader2 size={18} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Wand2 size={18} /> AI Edit - Full Post</>
                  )}
                </button>

                {/* Selective AI Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAIEdit('caption')}
                    disabled={isGenerating || (!topicText.trim() && !uploadedFile)}
                    className="py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                    style={{ backgroundColor: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {isGenerating && aiMode === 'caption' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Type size={14} />
                    )}
                    Caption Only
                  </button>
                  <button
                    onClick={() => handleAIEdit('hashtags')}
                    disabled={isGenerating || (!topicText.trim() && !uploadedFile)}
                    className="py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                    style={{ backgroundColor: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {isGenerating && aiMode === 'hashtags' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Hash size={14} />
                    )}
                    Hashtags Only
                  </button>
                </div>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>AI Suggestions</p>
                    <ul className="space-y-1">
                      {aiSuggestions.map((s, i) => (
                        <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--text2)' }}>
                          <span style={{ color: 'var(--accent)' }}>•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column: Preview ──────────────────── */}
            <div className="space-y-6">
              {/* Preview Channel Tabs */}
              {selectedChannels.length > 0 && (
                <div>
                  <label className="form-label flex items-center gap-2">
                    <Eye size={14} />
                    Live Preview
                  </label>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedChannels.map((ch) => {
                      const cfg = CHANNEL_CONFIG[ch];
                      return (
                        <button
                          key={ch}
                          onClick={() => setPreviewChannel(ch)}
                          className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                          style={{
                            backgroundColor: previewChannel === ch ? cfg.color : 'var(--bg2)',
                            color: previewChannel === ch ? '#fff' : 'var(--text2)',
                            border: `1px solid ${previewChannel === ch ? cfg.color : 'var(--border)'}`,
                          }}
                        >
                          {cfg.emoji} {ch}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] mb-3" style={{ color: 'var(--text3)' }}>
                    {CHANNEL_CONFIG[previewChannel]?.aspectLabel} format
                  </p>
                </div>
              )}

              {/* Social Preview */}
              <div className="rounded-xl p-6 flex items-center justify-center" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--border)', minHeight: '400px' }}>
                <SocialPreview
                  channel={previewChannel}
                  caption={caption}
                  hashtags={hashtags}
                  mediaUrl={uploadedFile}
                  brandName={brandName}
                  brandColor={brandColor}
                />
              </div>
            </div>
          </div>

          {/* ─── Edit Caption & Hashtags ───────────────── */}
          <div className="mt-8 pt-6 space-y-5" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 className="section-title">Review & Edit</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label mb-0">Caption</label>
                  {caption && (
                    <button
                      onClick={() => copyToClipboard(caption, 'caption')}
                      className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                      style={{ color: 'var(--accent)' }}
                    >
                      {copiedField === 'caption' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedField === 'caption' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={5}
                  placeholder="Your caption will appear here after AI generates it, or type your own..."
                  className="form-input"
                />
              </div>

              {/* Hashtags */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label mb-0">Hashtags</label>
                  {hashtags && (
                    <button
                      onClick={() => copyToClipboard(hashtags, 'hashtags')}
                      className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                      style={{ color: 'var(--accent)' }}
                    >
                      {copiedField === 'hashtags' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedField === 'hashtags' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <textarea
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  rows={5}
                  placeholder="#hashtags will appear here after AI generates them..."
                  className="form-input"
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg3)' }}>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text)' }}>
                  <input type="radio" name="schedule" checked={scheduleMode === 'now'} onChange={() => setScheduleMode('now')} />
                  Post Now
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text)' }}>
                  <input type="radio" name="schedule" checked={scheduleMode === 'schedule'} onChange={() => setScheduleMode('schedule')} />
                  Schedule for Later
                </label>
              </div>
              {scheduleMode === 'schedule' && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="form-input" />
                  <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="form-input" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSavePost('draft')}
                disabled={isSaving || !caption.trim()}
                className="btn btn-secondary disabled:opacity-40"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSavePost(scheduleMode === 'schedule' ? 'scheduled' : 'published')}
                disabled={isSaving || !caption.trim() || (scheduleMode === 'schedule' && (!scheduledDate || !scheduledTime))}
                className="btn btn-primary disabled:opacity-40"
              >
                {isSaving ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving...</>
                ) : scheduleMode === 'schedule' ? (
                  <><Clock size={16} /> Schedule Post</>
                ) : (
                  <><Send size={16} /> Publish Now</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─── CONTENT LIBRARY ───────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title">Content Library</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>
                {posts.length === 0 ? 'No posts yet' : `${posts.length} post${posts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {posts.length > 0 && (
              <div className="flex gap-2">
                <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)} className="form-input text-xs py-1">
                  <option value="all">All Channels</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="form-input text-xs py-1">
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            )}
          </div>

          {isLoadingPosts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={18} className="animate-spin" style={{ color: 'var(--text2)' }} />
              <span className="ml-2 text-sm" style={{ color: 'var(--text2)' }}>Loading posts...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="card text-center py-12">
              <p style={{ color: 'var(--text2)' }}>
                {posts.length === 0 ? 'Create your first AI-powered post above!' : 'No posts match your filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post) => {
                const chConfig = CHANNEL_CONFIG[post.platform as Channel];
                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      setEditingCaption(post.content?.split('\n\n')[0] || '');
                      setEditingHashtags(post.content?.split('\n\n').slice(1).join('\n\n') || '');
                      setIsEditingPost(false);
                    }}
                    className="card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                  >
                    {/* Thumbnail with Image Preview */}
                    <div
                      className="h-40 relative overflow-hidden rounded-t-lg bg-cover bg-center"
                      style={{
                        backgroundColor: chConfig?.color ? `${chConfig.color}15` : 'var(--bg3)',
                        backgroundImage: post.mediaUrls?.[0] ? `url(${post.mediaUrls[0]})` : undefined,
                      }}
                    >
                      {!post.mediaUrls?.[0] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon size={40} style={{ color: chConfig?.color || 'var(--text3)', opacity: 0.2 }} />
                        </div>
                      )}

                      {/* Platform Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: chConfig?.color || 'var(--text3)' }}>
                        <span>{chConfig?.emoji}</span>
                        <span className="hidden sm:inline">{post.platform}</span>
                      </div>

                      {/* Status Badge */}
                      <div className={`absolute bottom-2 left-2 tag ${getStatusColor(post.status)} text-xs`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </div>

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye size={24} style={{ color: '#fff' }} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--text)' }}>
                        {post.title}
                      </h3>
                      <p className="text-xs line-clamp-2" style={{ color: 'var(--text3)' }}>
                        {post.content?.split('\n\n')[0] || 'No caption'}
                      </p>
                      {(post.scheduledAt || post.publishedAt || post.createdAt) && (
                        <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                          {post.publishedAt ? `Published ${new Date(post.publishedAt).toLocaleDateString()}` :
                           post.scheduledAt ? `Scheduled ${new Date(post.scheduledAt).toLocaleDateString()}` :
                           post.createdAt ? `Created ${new Date(post.createdAt).toLocaleDateString()}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── POST DETAIL MODAL ───────────────────────────── */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPost(null)}>
          <div className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{selectedPost.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`tag ${getStatusColor(selectedPost.status)} text-xs`}>
                    {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: CHANNEL_CONFIG[selectedPost.platform as Channel]?.color || '#666' }}>
                    {CHANNEL_CONFIG[selectedPost.platform as Channel]?.emoji} {selectedPost.platform}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-1">
                <X size={20} style={{ color: 'var(--text2)' }} />
              </button>
            </div>

            {/* Social Preview in Modal */}
            <div className="mb-6 p-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--border)', minHeight: '400px' }}>
              <SocialPreview
                channel={selectedPost.platform as Channel}
                caption={editingCaption}
                hashtags={editingHashtags}
                mediaUrl={selectedPost.mediaUrls?.[0]?.startsWith('data:') ? selectedPost.mediaUrls[0] : null}
                brandName={brandName}
                brandColor={brandColor}
              />
            </div>

            {/* Edit / View */}
            {isEditingPost ? (
              <div className="space-y-4">
                <div>
                  <label className="form-label">Caption</label>
                  <textarea value={editingCaption} onChange={(e) => setEditingCaption(e.target.value)} rows={4} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Hashtags</label>
                  <textarea value={editingHashtags} onChange={(e) => setEditingHashtags(e.target.value)} rows={2} className="form-input" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsEditingPost(false)} className="btn btn-secondary flex-1">Cancel</button>
                  <button onClick={handleUpdatePost} disabled={isSaving} className="btn btn-primary flex-1">
                    {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setIsEditingPost(true)} className="btn btn-secondary flex-1">Edit</button>
                <button onClick={() => handleDeletePost(selectedPost.id)} className="btn" style={{ color: 'var(--red)', border: '1px solid var(--red)' }}>
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setSelectedPost(null)} className="btn btn-primary flex-1">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
