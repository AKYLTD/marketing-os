'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Post {
  id: string;
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

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [postsData, setPostsData] = useState<Record<string, Post[]>>({});
  const [specialDates, setSpecialDates] = useState<Record<number, SpecialDate>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    channel: 'Instagram' as const,
    status: 'Scheduled' as const,
    time: '09:00 AM',
  });

  // Fetch calendar data on mount and when month changes
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const month = currentMonth.getMonth() + 1;
        const year = currentMonth.getFullYear();

        const response = await fetch(`/api/calendar?month=${month}&year=${year}`);

        if (response.ok) {
          const data = await response.json();
          setPostsData(data.posts || {});
          setSpecialDates(data.specialDates || {});
        } else {
          throw new Error('Failed to fetch calendar data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentMonth]);

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

  const handleCreateEvent = async () => {
    if (!selectedDate || !newEvent.title.trim()) {
      setError('Please select a date and enter a title');
      return;
    }

    try {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          date: dateStr,
        }),
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPostsData(prev => ({
          ...prev,
          [dateStr]: [...(prev[dateStr] || []), createdPost],
        }));
        setShowNewEventModal(false);
        setNewEvent({
          title: '',
          channel: 'Instagram',
          status: 'Scheduled',
          time: '09:00 AM',
        });
      } else {
        setError('Failed to create event');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="page-title">Content Calendar</h1>
            <p className="page-subtitle">Plan, schedule, and track your content across all channels</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p style={{ color: 'var(--text2)' }}>Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

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
        {error && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}>
            {error}
          </div>
        )}

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

            <button
              onClick={() => {
                if (!selectedDate) {
                  setError('Please select a date first');
                  return;
                }
                setShowNewEventModal(true);
              }}
              className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Post
            </button>
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      {showNewEventModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowNewEventModal(false)}
        >
          <div
            className="card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="section-title mb-4">
                Add Event for {currentMonth.toLocaleString('default', { month: 'short' })} {selectedDate}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="form-input"
                    placeholder="Post title"
                  />
                </div>

                <div>
                  <label className="form-label">Channel</label>
                  <select
                    value={newEvent.channel}
                    onChange={(e) => setNewEvent({ ...newEvent, channel: e.target.value as any })}
                    className="form-input"
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>Facebook</option>
                    <option>LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    value={newEvent.time.replace(' AM', '').replace(' PM', '')}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as any })}
                    className="form-input"
                  >
                    <option>Draft</option>
                    <option>Scheduled</option>
                    <option>Published</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="btn btn-primary flex-1"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
