'use client';

import { useState } from 'react';

const samplePosts = {
  '2026-01-05': [
    {
      id: 1,
      title: 'New Year Campaign Launch',
      reach: '12.4K',
      engagement: '1.2K',
      revenue: '£890',
      roi: '340%',
    },
  ],
  '2026-01-12': [
    {
      id: 2,
      title: 'Weekly Newsletter',
      reach: '8.3K',
      engagement: '2.1K',
      revenue: '£620',
      roi: '380%',
    },
    {
      id: 3,
      title: 'Instagram Story Series',
      reach: '15.6K',
      engagement: '1.8K',
      revenue: '£450',
      roi: '210%',
    },
  ],
  '2026-01-18': [
    {
      id: 4,
      title: 'Customer Testimonial Video',
      reach: '24.8K',
      engagement: '3.2K',
      revenue: '£1,240',
      roi: '450%',
    },
  ],
  '2026-01-25': [
    {
      id: 5,
      title: 'Product Launch Announcement',
      reach: '32.1K',
      engagement: '2.8K',
      revenue: '£1,680',
      roi: '520%',
    },
  ],
  '2026-02-02': [
    {
      id: 6,
      title: 'Flash Sale Promotion',
      reach: '18.9K',
      engagement: '2.4K',
      revenue: '£920',
      roi: '380%',
    },
  ],
  '2026-02-08': [
    {
      id: 7,
      title: 'Influencer Collaboration',
      reach: '21.3K',
      engagement: '2.9K',
      revenue: '£1,120',
      roi: '410%',
    },
    {
      id: 8,
      title: 'Behind-the-Scenes Reel',
      reach: '14.2K',
      engagement: '1.6K',
      revenue: '£680',
      roi: '290%',
    },
  ],
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const days = [];
  const firstDay = firstDayOfMonth(currentMonth);
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  // Add empty cells for days before month starts
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth(currentMonth); i++) {
    days.push(i);
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const getPostsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return samplePosts[dateStr as keyof typeof samplePosts] || [];
  };

  const selectedPosts = selectedDate ? getPostsForDay(parseInt(selectedDate)) : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="mt-2 text-gray-600">Plan and track your content calendar</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* Month Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              ← Previous
            </button>
            <h2 className="text-lg font-bold text-gray-900">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Next →
            </button>
          </div>

          {/* Day Headers */}
          <div className="mb-4 grid grid-cols-7 gap-2">
            {dayHeaders.map((day) => (
              <div
                key={day}
                className="rounded-lg bg-indigo-50 px-2 py-2 text-center text-sm font-semibold text-indigo-700"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const posts = getPostsForDay(day);
              const dateStr =
                day !== null
                  ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : null;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`cal-cell relative min-h-24 rounded-lg border-2 p-2 text-left transition-colors ${
                    day === null
                      ? 'bg-gray-50'
                      : isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-indigo-400'
                  }`}
                >
                  {day !== null && (
                    <>
                      <span className="block font-semibold text-gray-900">{day}</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {posts.map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i === 0
                                ? 'bg-green-500'
                                : i === 1
                                  ? 'bg-blue-500'
                                  : 'bg-purple-500'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {selectedDate ? selectedDate : 'Select a day'}
          </h3>

          {selectedPosts.length > 0 ? (
            <div className="space-y-4">
              {selectedPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h4 className="mb-2 font-medium text-gray-900">{post.title}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Reach</span>
                      <span className="font-semibold text-gray-900">{post.reach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement</span>
                      <span className="font-semibold text-gray-900">{post.engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue</span>
                      <span className="font-semibold text-gray-900">{post.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI</span>
                      <span className="font-semibold text-green-600">{post.roi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {selectedDate ? 'No posts scheduled' : 'Select a date to view details'}
            </p>
          )}

          {selectedDate && selectedPosts.length > 0 && (
            <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700">
              Edit Posts
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
