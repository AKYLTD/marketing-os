import { NextRequest, NextResponse } from 'next/server';

interface SamplePost {
  id: string;
  title: string;
  content: string;
  channel: string;
  platform: string;
  publishedAt: string;
  engagementMetrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  status: 'published' | 'scheduled' | 'draft';
}

interface MediaAsset {
  id: string;
  title: string;
  type: 'image' | 'video';
  dimensions: string;
  size: string;
  createdAt: string;
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'planned' | 'draft';
  startDate: string;
  endDate: string;
  channels: string[];
  budget: number;
}

interface SpecialDate {
  id: string;
  name: string;
  date: string;
  status: 'running' | 'planned' | 'drafting';
}

const samplePosts: SamplePost[] = [
  {
    id: 'post-1',
    title: "New Winter Collection Launch",
    content: "Check out our latest winter styles! 🥶✨",
    channel: "Instagram",
    platform: "instagram",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 1243, comments: 89, shares: 45, views: 8932 },
    status: 'published',
  },
  {
    id: 'post-2',
    title: "Behind the Scenes - Studio Time",
    content: "Creating magic behind the scenes 📸",
    channel: "TikTok",
    platform: "tiktok",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 5432, comments: 342, shares: 892, views: 124500 },
    status: 'published',
  },
  {
    id: 'post-3',
    title: "Customer Spotlight - Sarah's Story",
    content: "Meet our amazing customer of the month! 🌟",
    channel: "Instagram",
    platform: "instagram",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 892, comments: 56, shares: 23, views: 5643 },
    status: 'published',
  },
  {
    id: 'post-4',
    title: "Quick Tips - Morning Routine",
    content: "5 tips for the perfect morning! ☀️",
    channel: "TikTok",
    platform: "tiktok",
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 3211, comments: 198, shares: 567, views: 89234 },
    status: 'published',
  },
  {
    id: 'post-5',
    title: "Valentine's Day Special Announcement",
    content: "Get 20% off this Valentine's Day! 💝",
    channel: "Facebook",
    platform: "facebook",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 456, comments: 34, shares: 12, views: 3456 },
    status: 'published',
  },
  {
    id: 'post-6',
    title: "LinkedIn Article - Industry Trends",
    content: "2024 Marketing Trends You Need to Know",
    channel: "LinkedIn",
    platform: "linkedin",
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 234, comments: 45, shares: 23, views: 4567 },
    status: 'published',
  },
  {
    id: 'post-7',
    title: "Instagram Reel - Dance Trend",
    content: "Join the trend! 🎵💃",
    channel: "Instagram",
    platform: "instagram",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 7823, comments: 456, shares: 234, views: 156234 },
    status: 'published',
  },
  {
    id: 'post-8',
    title: "Email Campaign - Weekly Newsletter",
    content: "Your weekly digest of the best content",
    channel: "Email",
    platform: "email",
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 2145 },
    status: 'published',
  },
  {
    id: 'post-9',
    title: "Product Demo Video",
    content: "See how our product works in 60 seconds",
    channel: "YouTube",
    platform: "youtube",
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 456, comments: 23, shares: 45, views: 12345 },
    status: 'published',
  },
  {
    id: 'post-10',
    title: "Team Announcement - New Hire",
    content: "Welcome to the team! 🎉",
    channel: "LinkedIn",
    platform: "linkedin",
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 123, comments: 34, shares: 12, views: 2345 },
    status: 'published',
  },
  {
    id: 'post-11',
    title: "Flash Sale - 24 Hours Only",
    content: "Don't miss out! Limited time offer 🔥",
    channel: "Instagram",
    platform: "instagram",
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 3456, comments: 234, shares: 156, views: 45678 },
    status: 'published',
  },
  {
    id: 'post-12',
    title: "Customer Testimonial Video",
    content: "Hear from our happy customers! ⭐",
    channel: "TikTok",
    platform: "tiktok",
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 4567, comments: 345, shares: 234, views: 78234 },
    status: 'published',
  },
  {
    id: 'post-13',
    title: "Scheduled: Spring Collection Preview",
    content: "Coming next week...",
    channel: "Instagram",
    platform: "instagram",
    publishedAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    status: 'scheduled',
  },
  {
    id: 'post-14',
    title: "Scheduled: New Product Announcement",
    content: "Exclusive reveal coming soon",
    channel: "Facebook",
    platform: "facebook",
    publishedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    status: 'scheduled',
  },
  {
    id: 'post-15',
    title: "Draft: Sustainability Initiative",
    content: "Work in progress - our commitment to the planet",
    channel: "LinkedIn",
    platform: "linkedin",
    publishedAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    status: 'draft',
  },
  {
    id: 'post-16',
    title: "Scheduled: TikTok Trend Participation",
    content: "Join the viral trend",
    channel: "TikTok",
    platform: "tiktok",
    publishedAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    status: 'scheduled',
  },
  {
    id: 'post-17',
    title: "Draft: Webinar Announcement",
    content: "Learn from industry experts",
    channel: "Email",
    platform: "email",
    publishedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    status: 'draft',
  },
  {
    id: 'post-18',
    title: "Scheduled: Easter Campaign",
    content: "Special Easter offers inside",
    channel: "Instagram",
    platform: "instagram",
    publishedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    status: 'scheduled',
  },
  {
    id: 'post-19',
    title: "Published: Success Story Case Study",
    content: "How our client achieved 300% ROI",
    channel: "LinkedIn",
    platform: "linkedin",
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 567, comments: 78, shares: 45, views: 6789 },
    status: 'published',
  },
  {
    id: 'post-20',
    title: "Scheduled: Black Friday Campaign",
    content: "Get ready for the biggest sale",
    channel: "Facebook",
    platform: "facebook",
    publishedAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    engagementMetrics: { likes: 0, comments: 0, shares: 0, views: 0 },
    status: 'scheduled',
  },
];

const mediaAssets: MediaAsset[] = [
  {
    id: 'media-1',
    title: 'Winter Collection Hero Image',
    type: 'image',
    dimensions: '1920x1080',
    size: '2.4MB',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-2',
    title: 'Behind the Scenes Video',
    type: 'video',
    dimensions: '1080x1920',
    size: '125MB',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-3',
    title: 'Customer Testimonial',
    type: 'video',
    dimensions: '1080x1080',
    size: '45MB',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-4',
    title: 'Product Photography Pack',
    type: 'image',
    dimensions: '4000x3000',
    size: '8.7MB',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-5',
    title: 'Brand Guideline Assets',
    type: 'image',
    dimensions: '2560x1440',
    size: '3.2MB',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-6',
    title: 'Product Demo Video',
    type: 'video',
    dimensions: '1920x1080',
    size: '230MB',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-7',
    title: 'Influencer Collaboration Assets',
    type: 'image',
    dimensions: '1080x1080',
    size: '5.6MB',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-8',
    title: 'Event Coverage Video',
    type: 'video',
    dimensions: '1920x1080',
    size: '450MB',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const campaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: "Valentine's Special",
    status: 'active',
    startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['Instagram', 'TikTok', 'Facebook'],
    budget: 2000,
  },
  {
    id: 'campaign-2',
    name: 'Spring Menu Launch',
    status: 'planned',
    startDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['Instagram', 'Facebook', 'Email'],
    budget: 1500,
  },
  {
    id: 'campaign-3',
    name: 'Competitor Counter-Move',
    status: 'draft',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['Instagram', 'TikTok'],
    budget: 1000,
  },
];

const specialDates: SpecialDate[] = [
  {
    id: 'date-1',
    name: "Valentine's Day",
    date: '2024-02-14',
    status: 'running',
  },
  {
    id: 'date-2',
    name: "St Patrick's Day",
    date: '2024-03-17',
    status: 'planned',
  },
  {
    id: 'date-3',
    name: 'Easter',
    date: '2024-04-09',
    status: 'drafting',
  },
  {
    id: 'date-4',
    name: "Mother's Day",
    date: '2024-05-12',
    status: 'planned',
  },
  {
    id: 'date-5',
    name: 'Earth Day',
    date: '2024-04-22',
    status: 'planned',
  },
  {
    id: 'date-6',
    name: 'Bank Holiday',
    date: '2024-05-27',
    status: 'planned',
  },
];

export async function GET(request: NextRequest) {
  try {
    console.log('Seeding database with sample data...');

    const counts = {
      posts: samplePosts.length,
      mediaAssets: mediaAssets.length,
      campaigns: campaigns.length,
      specialDates: specialDates.length,
    };

    console.log('Seed data created:', counts);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      counts,
      data: {
        posts: samplePosts,
        mediaAssets,
        campaigns,
        specialDates,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
