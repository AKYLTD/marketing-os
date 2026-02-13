'use client';

import { useState } from 'react';

const personalityTraits = [
  'Authentic',
  'Community-driven',
  'Artisan',
  'Warm',
  'Premium',
  'Local',
];

const colorSwatches = [
  { color: '#6366F1', name: 'Primary Indigo' },
  { color: '#F59E0B', name: 'Accent Amber' },
  { color: '#10B981', name: 'Success Green' },
  { color: '#1F2937', name: 'Neutral Dark' },
];

export default function BrandPage() {
  const [sliders, setSliders] = useState({
    formality: 30,
    humor: 55,
    enthusiasm: 80,
  });

  const handleSliderChange = (key: string, value: number) => {
    setSliders((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Brand DNA</h1>
        <p className="mt-2 text-gray-600">
          Your brand identity and voice configuration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Brand Score Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Brand Score</h2>
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 border-4 border-indigo-200">
                <span className="text-4xl font-bold text-indigo-600">87</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Consistency</span>
                <span>87%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                  style={{ width: '87%' }}
                ></div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">
              <span className="font-semibold text-indigo-600">Out of 100</span> - Excellent consistency
            </p>
          </div>
        </div>

        {/* Personality Traits Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Personality Traits</h2>
          <div className="flex flex-wrap gap-3">
            {personalityTraits.map((trait) => (
              <span
                key={trait}
                className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Voice Settings Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Voice Settings</h2>
          <div className="space-y-8">
            {/* Formality Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-900">Formality</label>
                <span className="text-sm font-semibold text-indigo-600">{sliders.formality}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.formality}
                onChange={(e) => handleSliderChange('formality', parseInt(e.target.value))}
                className="h-2 w-full rounded-lg bg-gray-200 accent-indigo-600"
              />
            </div>

            {/* Humor Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-900">Humor</label>
                <span className="text-sm font-semibold text-indigo-600">{sliders.humor}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.humor}
                onChange={(e) => handleSliderChange('humor', parseInt(e.target.value))}
                className="h-2 w-full rounded-lg bg-gray-200 accent-indigo-600"
              />
            </div>

            {/* Enthusiasm Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-900">Enthusiasm</label>
                <span className="text-sm font-semibold text-indigo-600">{sliders.enthusiasm}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliders.enthusiasm}
                onChange={(e) => handleSliderChange('enthusiasm', parseInt(e.target.value))}
                className="h-2 w-full rounded-lg bg-gray-200 accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Visual Identity Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Visual Identity</h2>
          <div className="space-y-6">
            {/* Color Swatches */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Brand Colors</p>
              <div className="flex gap-4">
                {colorSwatches.map((swatch) => (
                  <div key={swatch.color} className="space-y-2">
                    <div
                      className="h-16 w-16 rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: swatch.color }}
                    ></div>
                    <p className="text-xs text-gray-600">{swatch.color}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Info */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700">Typography</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Headings</p>
                  <p className="font-semibold text-gray-900" style={{ fontFamily: 'Inter' }}>
                    Inter Bold
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Body</p>
                  <p className="text-gray-900" style={{ fontFamily: 'Inter' }}>
                    Inter Regular
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
