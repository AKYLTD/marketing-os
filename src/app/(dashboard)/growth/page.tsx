'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Beaker,
  Pause,
  StopCircle,
  Eye,
  Lightbulb,
  Zap,
  X,
} from 'lucide-react';

type TabType = 'active' | 'completed' | 'ideas';
type Channel = 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn' | 'YouTube';
type ExperimentStatus = 'idea' | 'active' | 'paused' | 'completed';
type ExperimentCategory = 'content' | 'engagement' | 'acquisition' | 'retention';

interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  channel: Channel;
  duration: string;
  progress: number;
  startDate: string;
  endDate: string;
  baselineMetric: string;
  baselineValue: number;
  currentValue: number;
  percentChange: number;
  resultsData: number[];
  status: ExperimentStatus;
  category: ExperimentCategory;
  verdict?: 'Winner' | 'No Significant Difference';
}

interface IdeaItem {
  id: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
}

interface ModalState {
  isOpen: boolean;
  name: string;
  hypothesis: string;
  channel: Channel;
  duration: '1 week' | '2 weeks' | '1 month';
  metric: string;
}

const channelColors: Record<Channel, string> = {
  Instagram: 'tag-purple',
  TikTok: 'tag-blue',
  Facebook: 'tag-blue',
  LinkedIn: 'tag-blue',
  YouTube: 'tag-red',
};

export default function GrowthPage() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    name: '',
    hypothesis: '',
    channel: 'Instagram',
    duration: '2 weeks',
    metric: 'Engagement',
  });

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/growth');
        if (!response.ok) {
          throw new Error('Failed to fetch experiments');
        }
        const data = await response.json();
        setExperiments(data.experiments || []);
        setIdeas(data.ideas || []);
        setRecommendations(data.recommendations || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setExperiments([]);
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  const handleOpenModal = () => {
    setModal({
      isOpen: true,
      name: '',
      hypothesis: '',
      channel: 'Instagram',
      duration: '2 weeks',
      metric: 'Engagement',
    });
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleStartExperiment = async () => {
    try {
      const response = await fetch('/api/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modal.name,
          hypothesis: modal.hypothesis,
          channel: modal.channel,
          duration: modal.duration,
          metric: modal.metric,
          status: 'active',
          category: 'engagement',
        }),
      });

      if (response.ok) {
        const newExperiment = await response.json();
        setExperiments([...experiments, newExperiment]);
        handleCloseModal();
      }
    } catch (err) {
      console.error('Failed to create experiment:', err);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'tag-red';
      case 'Medium':
        return 'tag-amber';
      case 'Low':
        return 'tag-blue';
      default:
        return 'tag-blue';
    }
  };

  const renderChart = (data: number[]) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data);
    return (
      <div className="flex gap-1 h-12 items-end">
        {data.map((value, idx) => (
          <div
            key={idx}
            className="flex-1 bg-gradient-to-t from-[var(--accent)] to-[var(--accent-bg)] rounded-sm"
            style={{ height: `${(value / max) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  const activeExperiments = experiments.filter((e) => e.status === 'active');
  const completedExperiments = experiments.filter((e) => e.status === 'completed');

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Growth Lab</h1>
          <p className="page-subtitle">
            Run experiments, test hypotheses, and accelerate your growth
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          New Experiment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[var(--border)]">
        {(['active', 'completed', 'ideas'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-[var(--accent)] text-[var(--text)]'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            {tab === 'active' && 'Active Experiments'}
            {tab === 'completed' && 'Completed'}
            {tab === 'ideas' && 'Ideas Backlog'}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-8">
          <p className="text-[var(--text2)]">Loading experiments...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="card border border-[var(--red)] bg-[var(--red)]/10 py-6">
          <p className="text-[var(--text)]">Failed to load experiments. Please try again.</p>
        </div>
      )}

      {/* Active Experiments */}
      {activeTab === 'active' && !loading && (
        <div className="space-y-6 mb-8">
          {activeExperiments.length === 0 ? (
            <div className="card py-8 text-center">
              <p className="text-[var(--text2)]">No active experiments yet. Start your first growth experiment!</p>
            </div>
          ) : (
            activeExperiments.map((exp) => (
            <div key={exp.id} className="card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">
                    {exp.name}
                  </h3>
                  <p className="text-sm text-[var(--text2)] mt-1">
                    {exp.hypothesis}
                  </p>
                </div>
                <span className={`tag ${channelColors[exp.channel]} whitespace-nowrap`}>
                  {exp.channel}
                </span>
              </div>

              <div className="space-y-4 mb-4">
                {/* Duration Progress */}
                <div>
                  <div className="flex justify-between text-xs text-[var(--text2)] mb-2">
                    <span>{exp.duration}</span>
                    <span>{exp.progress}% complete</span>
                  </div>
                  <div className="h-2 bg-[var(--bg2)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all"
                      style={{ width: `${exp.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text3)] mt-1">
                    <span>Started: {exp.startDate}</span>
                    <span>Ends: {exp.endDate}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-[var(--bg2)] p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--text2)]">
                      {exp.baselineMetric}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text)]">
                        {exp.baselineValue} → {exp.currentValue}
                      </span>
                      <span className="text-sm font-semibold text-[var(--green)]">
                        +{exp.percentChange}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <p className="text-xs text-[var(--text2)] mb-2">
                    Results so far
                  </p>
                  {renderChart(exp.resultsData)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={async () => {
                    await fetch(`/api/growth/${exp.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'paused' }),
                    });
                    const updated = experiments.map((e) =>
                      e.id === exp.id ? { ...e, status: 'paused' as ExperimentStatus } : e
                    );
                    setExperiments(updated);
                  }}
                  className="btn btn-sm"
                >
                  <Pause size={16} />
                  Pause
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/growth/${exp.id}`, {
                      method: 'DELETE',
                    });
                    setExperiments(experiments.filter((e) => e.id !== exp.id));
                  }}
                  className="btn btn-sm"
                >
                  <StopCircle size={16} />
                  Stop Early
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      )}

      {/* Completed Experiments */}
      {activeTab === 'completed' && !loading && (
        <div className="space-y-6 mb-8">
          {completedExperiments.length === 0 ? (
            <div className="card py-8 text-center">
              <p className="text-[var(--text2)]">No completed experiments yet.</p>
            </div>
          ) : (
            completedExperiments.map((exp) => (
            <div key={exp.id} className="card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">
                    {exp.name}
                  </h3>
                  <p className="text-sm text-[var(--text2)] mt-1">
                    {exp.hypothesis}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`tag ${channelColors[exp.channel]}`}>
                    {exp.channel}
                  </span>
                  <span
                    className={`tag ${
                      exp.verdict === 'Winner' ? 'tag-green' : 'tag-amber'
                    }`}
                  >
                    {exp.verdict}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                {/* Final Results */}
                <div className="bg-[var(--bg2)] p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--text2)]">
                      Final {exp.baselineMetric}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text)]">
                        {exp.baselineValue} → {exp.currentValue}
                      </span>
                      <span className="text-sm font-semibold text-[var(--green)]">
                        +{exp.percentChange}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <p className="text-xs text-[var(--text2)] mb-2">
                    Complete results
                  </p>
                  {renderChart(exp.resultsData)}
                </div>
              </div>

              <button className="btn btn-secondary btn-sm">
                <Eye size={16} />
                View Full Report
              </button>
            </div>
            ))
          )}
        </div>
      )}

      {/* Ideas Backlog */}
      {activeTab === 'ideas' && !loading && (
        <div className="card">
          {ideas.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[var(--text2)]">No ideas yet. Create experiments or add ideas to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-[var(--bg2)] rounded-lg hover:bg-[var(--bg3)] transition-colors"
                >
                  <div>
                    <p className="font-medium text-[var(--text)]">{idea.title}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`tag ${getImpactColor(idea.impact)}`}>
                      {idea.impact} impact
                    </span>
                    <button className="btn btn-primary btn-sm">
                      <Zap size={16} />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Recommendations */}
      {!loading && recommendations.length > 0 && (
        <div className="mt-12">
          <div className="card border-2 border-[var(--accent-bg)]">
            <div className="flex gap-3 items-start">
              <Lightbulb
                size={24}
                className="text-[var(--accent)] flex-shrink-0 mt-1"
              />
              <div className="flex-1">
                <h3 className="section-title mb-3">AI Recommendations</h3>
                <p className="text-sm text-[var(--text2)] mb-4">
                  Based on your data, we recommend:
                </p>
                <ul className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 text-sm text-[var(--text)]"
                    >
                      <span className="text-[var(--accent)] font-semibold flex-shrink-0">
                        {idx + 1}.
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg)] rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--text)]">
                New Experiment
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-[var(--text2)] hover:text-[var(--text)]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Experiment Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Reel-First Strategy"
                  value={modal.name}
                  onChange={(e) => setModal({ ...modal, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Hypothesis</label>
                <textarea
                  className="form-input"
                  placeholder="What do you expect to happen?"
                  rows={3}
                  value={modal.hypothesis}
                  onChange={(e) =>
                    setModal({ ...modal, hypothesis: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="form-label">Channel</label>
                <select
                  className="form-input"
                  value={modal.channel}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      channel: e.target.value as Channel,
                    })
                  }
                >
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>Facebook</option>
                  <option>LinkedIn</option>
                  <option>YouTube</option>
                </select>
              </div>

              <div>
                <label className="form-label">Duration</label>
                <select
                  className="form-input"
                  value={modal.duration}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      duration: e.target.value as
                        | '1 week'
                        | '2 weeks'
                        | '1 month',
                    })
                  }
                >
                  <option>1 week</option>
                  <option>2 weeks</option>
                  <option>1 month</option>
                </select>
              </div>

              <div>
                <label className="form-label">Metric to Track</label>
                <select
                  className="form-input"
                  value={modal.metric}
                  onChange={(e) =>
                    setModal({ ...modal, metric: e.target.value })
                  }
                >
                  <option>Followers</option>
                  <option>Engagement</option>
                  <option>Reach</option>
                  <option>Conversions</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartExperiment}
                  className="btn btn-primary flex-1"
                >
                  <Beaker size={18} />
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
