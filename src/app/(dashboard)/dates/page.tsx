'use client';

interface SpecialDate {
  id: string;
  name: string;
  emoji: string;
  date: string;
  status: 'running' | 'planned' | 'drafting';
}

const specialDates: SpecialDate[] = [
  { id: '1', name: "Valentine's Day", emoji: '❤️', date: 'Feb 14', status: 'running' },
  { id: '2', name: "St Patrick's Day", emoji: '🍀', date: 'Mar 17', status: 'planned' },
  { id: '3', name: 'Easter', emoji: '🐰', date: 'Apr 9', status: 'drafting' },
  { id: '4', name: "Mother's Day", emoji: '🌸', date: 'May 12', status: 'planned' },
  { id: '5', name: 'Earth Day', emoji: '🌍', date: 'Apr 22', status: 'planned' },
  { id: '6', name: 'Bank Holiday', emoji: '🏦', date: 'May 27', status: 'planned' },
];

function DateCard({ date }: { date: SpecialDate }) {
  const statusConfig = {
    running: { badge: 'bg-green-100 text-green-700', text: 'Running' },
    planned: { badge: 'bg-blue-100 text-blue-700', text: 'Planned' },
    drafting: { badge: 'bg-yellow-100 text-yellow-700', text: 'Drafting' },
  };

  const config = statusConfig[date.status];

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{date.emoji}</span>
        <span className={`badge ${config.badge}`}>{config.text}</span>
      </div>
      <h3 className="font-semibold text-lg mb-1">{date.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{date.date}</p>
      <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
        {date.status === 'running' ? 'View Campaign' : 'Set Up Campaign'}
      </button>
    </div>
  );
}

export default function DatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Special Dates Calendar</h1>
        <p className="text-gray-600 mt-1">Plan campaigns around important dates and holidays</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialDates.map((date) => (
          <DateCard key={date.id} date={date} />
        ))}
      </div>
    </div>
  );
}
