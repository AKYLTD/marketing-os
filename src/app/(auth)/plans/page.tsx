'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started',
    badge: null,
  },
  {
    name: 'Gold',
    price: '£29',
    period: '/mo',
    description: 'Most popular for growing businesses',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '£99',
    period: '/mo',
    description: 'For large-scale operations',
    badge: null,
  },
];

const features = [
  {
    category: 'Dashboard & Analytics',
    items: [
      { name: 'Analytics Dashboard', basic: true, gold: true, enterprise: true },
      { name: 'Real-time Reporting', basic: false, gold: true, enterprise: true },
      { name: 'Custom Reports', basic: false, gold: true, enterprise: true },
      { name: 'Performance Insights', basic: false, gold: true, enterprise: true },
    ],
  },
  {
    category: 'Content & Publishing',
    items: [
      { name: 'Content Calendar', basic: true, gold: true, enterprise: true },
      { name: 'AI Content Generation', basic: false, gold: true, enterprise: true },
      { name: 'Advanced Scheduling', basic: false, gold: true, enterprise: true },
      { name: 'Media Library', basic: true, gold: true, enterprise: true },
    ],
  },
  {
    category: 'Brand & Channels',
    items: [
      { name: 'Manage 3 Channels', basic: true, gold: true, enterprise: true },
      { name: 'Unlimited Channels', basic: false, gold: false, enterprise: true },
      { name: 'Brand Kit Manager', basic: false, gold: true, enterprise: true },
      { name: 'Multi-Brand Support', basic: false, gold: false, enterprise: true },
    ],
  },
  {
    category: 'Campaigns & Growth',
    items: [
      { name: 'Basic Campaigns', basic: true, gold: true, enterprise: true },
      { name: 'A/B Testing', basic: false, gold: true, enterprise: true },
      { name: 'Influencer Tools', basic: false, gold: true, enterprise: true },
      { name: 'Growth Automation', basic: false, gold: false, enterprise: true },
    ],
  },
  {
    category: 'AI & Support',
    items: [
      { name: 'AI Assistant', basic: true, gold: true, enterprise: true },
      { name: 'Priority Support', basic: false, gold: true, enterprise: true },
      { name: 'Dedicated Account Manager', basic: false, gold: false, enterprise: true },
      { name: 'Custom AI Training', basic: false, gold: false, enterprise: true },
    ],
  },
];

export default function PlansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planName: string) => {
    setLoading(true);
    setSelectedPlan(planName);

    try {
      const response = await fetch('/api/auth/select-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: planName.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to select plan');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error selecting plan:', error);
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-700 mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Select the perfect plan to power your social media strategy
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl transition-all ${
                plan.badge
                  ? 'ring-2 ring-purple-500 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20'
                  : 'bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-600">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col h-full">
                {/* Plan Name and Price */}
                <div className="mb-6">
                  <h2 className="text-2xl font-700 text-white mb-2">{plan.name}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-700 text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loading && selectedPlan === plan.name}
                  className={`w-full py-3 rounded-lg font-600 transition-all mb-6 ${
                    plan.badge
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  } disabled:opacity-50`}
                >
                  {loading && selectedPlan === plan.name ? 'Selecting...' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-x-auto">
          <h2 className="text-2xl font-700 text-white mb-8">Feature Comparison</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-gray-300 font-600">Features</th>
                <th className="text-center py-4 px-4 text-gray-300 font-600 w-24">Basic</th>
                <th className="text-center py-4 px-4 text-gray-300 font-600 w-24">Gold</th>
                <th className="text-center py-4 px-4 text-gray-300 font-600 w-24">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, categoryIdx) => (
                <div key={categoryIdx}>
                  {/* Category Header */}
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 px-4 bg-white/5 border-b border-white/10"
                    >
                      <h3 className="font-600 text-white">{category.category}</h3>
                    </td>
                  </tr>
                  {/* Feature Rows */}
                  {category.items.map((item, itemIdx) => (
                    <tr
                      key={itemIdx}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-300 text-sm">{item.name}</td>
                      <td className="py-4 px-4 text-center">
                        {item.basic ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {item.gold ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {item.enterprise ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </div>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/signin"
            className="text-gray-400 hover:text-white transition-colors font-500"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
