'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  channel: 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn';
  time: string;
  status: 'Draft' | 'Scheduled' | 'Published';
}

interface SpecialDate {
  date: number;
  emoji: string;
  name: string;
  description: string;
}

const specialDates: Record<number, SpecialDate> = {
  9: { date: 9, emoji: '🥯', name: 'National Bagel Day', description: 'Celebrate the perfect bagel!' },
  14: { date: 14, emoji: '💝', name: "Valentine's Day", description: 'Share love and delicious bagels' },
  17: { date: 17, emoji: '🍀', name: "St Patrick's Day", description: 'Lucky bagel colors available' },
  30: { date: 30, emoji: '💐', name: "Mother's Day", description: 'Treat the special women in your life' },
};

const postsData: Record<string, Post[]> = {
  '2026-02-06': [
    { id: 1, title: 'Weekend Breakfast Goals', channel: 'Instagram', time: '09:00 AM', status: 'Published' },
  ],
  '2026-02-08': [
    { id: 2, title: 'TikTok Bagel Hack', channel: 'TikTok', time: '02:00 PM', status: 'Published' },
  ],
  '2026-02-10': [
    { id: 3, title: 'Community Spotlight', channel: 'Facebook', time: '10:30 AM', status: 'Published' },
  ],
  '2026-02-13': [
    { id: 4, title: 'Valentine Promo Post', channel: 'Instagram', time: '08:00 AM', status: 'Scheduled' },
    { id: 5, title: 'LinkedIn Article', channel: 'LinkedIn', time: '10:00 AM', status: 'Scheduled' },
  ],
  '2026-02-14': [
    { id: 6, title: 'Love & Bagels Campaign', channel: 'Instagram', time: '06:00 AM', status: 'Scheduled' },
    { id: 7, title: 'Valentine Gift Guide', channel: 'TikTok', time: '12:00 PM', status: 'Scheduled' },
  ],
  '2026-02-16': [
    { id: 8, title: 'Artisan Spotlight', channel: 'Facebook', time: '03:00 PM', status: 'Scheduled' },
  ],
  '2026-02-20': [
    { id: 9, title: 'Weekly Bagel Drop', channel: 'Instagram', time: '07:00 AM', status: 'Draft' },
  ],
  '2026-02-22': [
    { id: 10, title: 'Behind The Scenes', channel: 'TikTok', time: '11:00 AM', status: 'Scheduled' },
  ],
  '2026-03-04': [
    { id: 11, title: 'Pancake Day Twist', channel: 'Instagram', time: '09:00 AM', status: 'Scheduled' },
  ],
  '2026-03-17': [
    { id: 12, title: 'Lucky Green Bagels', channel: 'Instagram', time: '08:00 AM', status: 'Draft' },
    { id: 13, title: 'St Patrick Celebration', channel: 'TikTok', time: '01:00 PM', status: 'Draft' },
  ],
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      Instagram: '#ec4899',
      TikTok: '#000000',
      Facebook: '#1f2937',
      LinkedIn: '#0a66c2',
    };
    return colors[channel] || '#6366f1';
  };

  const getStatusTag = (status: string) => {
    const tags: Record<string, string> = {
      Draft: 'tag-amber',
      Scheduled: 'tag-blue',
      Published: 'tag-green',
    };
    return tags[status] || 'tag-blue';
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const getPostsForDay = (day: number | null): Post[] => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return postsData[dateStr] || [];
  };

  const selectedPosts = selectedDate ? getPostsForDay(selectedDate) : [];
  const selectedSpecialDate = selectedDate ? specialDates[selectedDate] : null;

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days: (number | null)[] = [];
  const firstDay = firstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth(currentMonth); i++) {
    days.push(i);
  }

  const today = new Date();
  const isToday = (day: number | null) => {
    return (
      day &&
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="page-title">Content Calendar</h1>
          <p className="page-subtitle">Plan, schedule, and track your content across all channels</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 card p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="btn btn-secondary btn-sm p-2"
                title="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="section-title">{monthName}</h2>
              <button
                onClick={nextMonth}
                className="btn btn-secondary btn-sm p-2"
                title="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayHeaders.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold py-2"
                  style={{ color: 'var(--text2)' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const posts = getPostsForDay(day);
                const special = day ? specialDates[day] : null;
                const todayFlag = isToday(day);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(selectedDate === day ? null : day)}
                    className={`cal-cell relative min-h-20 sm:min-h-24 rounded-lg p-2 text-left transition-all hover:shadow-md ${
                      day === null
                        ? 'opacity-0 pointer-events-none'
                        : selectedDate === day
                          ? 'ring-2'
                          : ''
                    }`}
                    style={{
                      backgroundColor: day === null ? 'transparent' : 'var(--bg2)',
                      borderColor: 'var(--border)',
                      ringColor: selectedDate === day ? 'var(--accent)' : 'transparent',
                    }}
                  >
                    {day && (
                      <>
                        <div className="flex justify-between items-start mb-1">
                          <span
                            className={`text-sm font-bold ${
                              todayFlag ? 'bg-red-500 text-white px-1.5 py-0.5 rounded' : ''
                            }`}
                            style={{ color: todayFlag ? undefined : 'var(--text)' }}
                          >
                            {day}
                          </span>
                        </div>

                        {/* Special Date Badge */}
                        {special && (
                          <div
                            className="mb-1 text-xs font-semibold px-1.5 py-1 rounded line-clamp-1"
                            style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}
                          >
                            {special.emoji} {special.name.split(' ')[0]}
                          </div>
                        )}

                        {/* Post Indicators */}
                        <div className="flex flex-wrap gap-0.5">
                          {posts.slice(0, 3).map((post, idx) => (
                            <div
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: getChannelColor(post.channel) }}
                              title={post.channel}
                            />
                          ))}
                          {posts.length > 3 && (
                            <span className="text-xs" style={{ color: 'var(--text3)' }}>
                              +{posts.length - 3}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text2)' }}>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ec4899' }} />
                <span>Instagram</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#000000' }} />
                <span>TikTok</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1f2937' }} />
                <span>Facebook</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0a66c2' }} />
                <span>LinkedIn</span>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="card p-6 h-fit sticky top-4">
            <h3 className="section-title mb-4">
              {selectedDate
                ? `${currentMonth.toLocaleString('default', { month: 'short' })} ${selectedDate}`
                : 'Select a date'}
            </h3>

            {selectedSpecialDate && (
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-bg)' }}>
                <div className="text-2xl mb-2">{selectedSpecialDate.emoji}</div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--accent)' }}>
                  {selectedSpecialDate.name}
                </h4>
                <p className="text-xs mb-3" style={{ color: 'var(--text2)' }}>
                  {selectedSpecialDate.description}
                </p>
                <button className="btn btn-primary btn-sm w-full">Create Campaign</button>
              </div>
            )}

            {selectedPosts.length > 0 ? (
              <div className="space-y-3 mb-6">
                {selectedPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-3" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getChannelColor(post.channel) }}
                        />
                        <span style={{ color: 'var(--text2)' }}>{post.channel}</span>
                      </div>
                      <span className={`tag ${getStatusTag(post.status)}`}>{post.status}</span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'var(--text3)' }}>
                      {post.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>
                {selectedDate ? 'No posts scheduled for this date' : 'Select a date to view details'}
              </p>
            )}

            <button className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-2">
              <Plus size={16} />
              Add Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
