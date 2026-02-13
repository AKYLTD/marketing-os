'use client';

import { Lightbulb } from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  variant: string;
  engagement: string;
  status: string;
  startDate: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  color: string;
}

const experiments: Experiment[] = [
  {
    id: '1',
    name: 'Reel vs Carousel',
    variant: 'Reels performing 34% better',
    engagement: '+34%',
    status: 'Running',
    startDate: 'Feb 1',
  },
  {
    id: '2',
    name: 'Posting Time Optimization',
    variant: '8 AM vs 2 PM',
    engagement: '+18%',
    status: 'Running',
    startDate: 'Feb 5',
  },
  {
    id: '3',
    name: 'UGC vs Branded Content',
    variant: 'User content gets 2.5x engagement',
    engagement: '+150%',
    status: 'Running',
    startDate: 'Feb 3',
  },
];

const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Increase Reel Production',
    description:
      'Based on the 34% performance boost, allocate 60% of video content to Reels format.',
    impact: 'Est. +25-30% engagement',
    color: 'border-l-4 border-l-blue-500',
  },
  {
    id: '2',
    title: 'Partner with Micro-Influencers',
    description:
      'UGC content is significantly outperforming. Consider micro-influencer collaborations.',
    impact: 'Est. +40-50% reach',
    color: 'border-l-4 border-l-green-500',
  },
];

export default function GrowthLabPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Growth Lab</h1>
        <p className="text-gray-600 mt-1">Experiments and AI-powered recommendations</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Active Experiments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Experiment</th>
                  <th>Variant</th>
                  <th>Performance</th>
                  <th>Status</th>
                  <th>Started</th>
                </tr>
              </thead>
              <tbody>
                {experiments.map((exp) => (
                  <tr key={exp.id}>
                    <td className="font-medium">{exp.name}</td>
                    <td className="text-gray-600 text-sm">{exp.variant}</td>
                    <td>
                      <span className="font-semibold text-green-600">
                        {exp.engagement}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-blue-100 text-blue-700">
                        {exp.status}
                      </span>
                    </td>
                    <td className="text-gray-600 text-sm">{exp.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-lg">AI Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className={`card p-4 ${rec.color}`}>
                <h3 className="font-semibold mb-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                <p className="text-xs font-medium text-blue-600">{rec.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
