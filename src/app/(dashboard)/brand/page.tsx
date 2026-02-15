'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Sparkles, Loader2, CheckCircle, Search } from 'lucide-react';

interface BrandState {
  businessName: string;
  industry: string;
  foundedYear: number;
  location: string;
  website: string;
  maturity: number;
  direction: number;
  ageRanges: string[];
  genderMale: number;
  incomeLevel: string;
  interests: string[];
  interestInput: string;
  playfulProfessional: number;
  boldSubtle: number;
  modernClassic: number;
  friendlyAuthoritative: number;
  innovativeTraditional: number;
  formality: number;
  humor: number;
  enthusiasm: number;
  emojiUsage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  brandStory: string;
  competitors: Array<{ name: string; url: string }>;
  usp: string[];
}

const emptyState: BrandState = {
  businessName: '',
  industry: 'Food & Beverage',
  foundedYear: new Date().getFullYear(),
  location: '',
  website: '',
  maturity: 50,
  direction: 50,
  ageRanges: [],
  genderMale: 50,
  incomeLevel: 'Mid-range',
  interests: [],
  interestInput: '',
  playfulProfessional: 0,
  boldSubtle: 0,
  modernClassic: 0,
  friendlyAuthoritative: 0,
  innovativeTraditional: 0,
  formality: 5,
  humor: 5,
  enthusiasm: 5,
  emojiUsage: 'Minimal',
  primaryColor: '#000000',
  secondaryColor: '#FFFFFF',
  accentColor: '#0066cc',
  brandStory: '',
  competitors: [],
  usp: [],
};

export default function BrandPage() {
  const [state, setState] = useState<BrandState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [researching, setResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);

  // Fetch brand data on mount
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/brand');

        if (response.status === 500) {
          // Database not ready - show empty state
          setState(emptyState);
          setHasData(false);
        } else if (response.ok) {
          const data = await response.json();
          // Extract brand from wrapper object
          if (data.brand) {
            // Map API fields back to state structure
            const mappedState: BrandState = {
              businessName: data.brand.brandName || '',
              industry: data.brand.industry || 'Food & Beverage',
              foundedYear: data.brand.foundedYear || new Date().getFullYear(),
              location: data.brand.location || '',
              website: data.brand.websiteUrl || '',
              maturity: data.brand.maturity || 50,
              direction: data.brand.direction || 50,
              ageRanges: data.brand.targetAudience?.ageRanges || [],
              genderMale: data.brand.targetAudience?.genderMale || 50,
              incomeLevel: data.brand.targetAudience?.incomeLevel || 'Mid-range',
              interests: data.brand.targetAudience?.interests || [],
              interestInput: '',
              playfulProfessional: data.brand.personality?.playfulProfessional || 0,
              boldSubtle: data.brand.personality?.boldSubtle || 0,
              modernClassic: data.brand.personality?.modernClassic || 0,
              friendlyAuthoritative: data.brand.personality?.friendlyAuthoritative || 0,
              innovativeTraditional: data.brand.personality?.innovativeTraditional || 0,
              formality: data.brand.voiceSettings?.formality || 5,
              humor: data.brand.voiceSettings?.humor || 5,
              enthusiasm: data.brand.voiceSettings?.enthusiasm || 5,
              emojiUsage: data.brand.voiceSettings?.emojiUsage || 'Minimal',
              primaryColor: data.brand.colors?.primary || '#000000',
              secondaryColor: data.brand.colors?.secondary || '#FFFFFF',
              accentColor: data.brand.colors?.accent || '#0066cc',
              brandStory: data.brand.description || '',
              competitors: data.brand.competitors || [],
              usp: [],
            };
            setState(mappedState);
            setHasData(true);
          } else {
            setState(emptyState);
            setHasData(false);
          }
        } else if (response.status === 404) {
          // No brand profile exists yet
          setState(emptyState);
          setHasData(false);
        } else {
          throw new Error('Failed to fetch brand data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brand data');
        setState(emptyState);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  const saveBrandData = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Map state fields to API fields
      const payload = {
        brandName: state.businessName,
        industry: state.industry,
        maturity: state.maturity,
        direction: state.direction,
        targetAudience: {
          ageRanges: state.ageRanges,
          genderMale: state.genderMale,
          incomeLevel: state.incomeLevel,
          interests: state.interests,
        },
        personality: {
          playfulProfessional: state.playfulProfessional,
          boldSubtle: state.boldSubtle,
          modernClassic: state.modernClassic,
          friendlyAuthoritative: state.friendlyAuthoritative,
          innovativeTraditional: state.innovativeTraditional,
        },
        voiceSettings: {
          formality: state.formality,
          humor: state.humor,
          enthusiasm: state.enthusiasm,
          emojiUsage: state.emojiUsage,
        },
        colors: {
          primary: state.primaryColor,
          secondary: state.secondaryColor,
          accent: state.accentColor,
        },
        description: state.brandStory,
        competitors: state.competitors,
        websiteUrl: state.website,
      };

      const response = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 500) {
        throw new Error('Database not available. Please try again later.');
      }

      if (!response.ok) {
        throw new Error('Failed to save brand data');
      }

      setHasData(true);
      setSuccessMessage('Brand profile saved successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save brand data');
    } finally {
      setSaving(false);
    }
  }, [state]);

  const autoResearchBrand = useCallback(async () => {
    try {
      setResearching(true);
      setError(null);
      setSuccessMessage(null);

      if (!state.businessName || !state.industry || !state.website) {
        setError('Please fill in Business Name, Industry, and Website before researching.');
        return;
      }

      const response = await fetch('/api/brand/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: state.businessName,
          industry: state.industry,
          website: state.website,
          location: state.location,
        }),
      });

      if (response.status === 500) {
        throw new Error('Research service temporarily unavailable. Please try again later.');
      }

      if (!response.ok) {
        throw new Error('Failed to research brand');
      }

      const data = await response.json();
      const research = data.research;

      // Auto-fill form with research data
      setState((prev) => ({
        ...prev,
        brandStory: research.brandStory || prev.brandStory,
        primaryColor: research.primaryColor || prev.primaryColor,
        secondaryColor: research.secondaryColor || prev.secondaryColor,
        accentColor: research.accentColor || prev.accentColor,
        ageRanges: research.targetAudience?.ageRanges || prev.ageRanges,
        genderMale: research.targetAudience?.genderMale ?? prev.genderMale,
        incomeLevel: research.targetAudience?.incomeLevel || prev.incomeLevel,
        interests: research.targetAudience?.interests || prev.interests,
        playfulProfessional: research.personality?.playfulProfessional ?? prev.playfulProfessional,
        boldSubtle: research.personality?.boldSubtle ?? prev.boldSubtle,
        modernClassic: research.personality?.modernClassic ?? prev.modernClassic,
        friendlyAuthoritative: research.personality?.friendlyAuthoritative ?? prev.friendlyAuthoritative,
        innovativeTraditional: research.personality?.innovativeTraditional ?? prev.innovativeTraditional,
        formality: research.voiceSettings?.formality ?? prev.formality,
        humor: research.voiceSettings?.humor ?? prev.humor,
        enthusiasm: research.voiceSettings?.enthusiasm ?? prev.enthusiasm,
        emojiUsage: research.voiceSettings?.emojiUsage || prev.emojiUsage,
        competitors: research.competitors || prev.competitors,
        usp: research.usp || prev.usp,
        maturity: research.maturity ?? prev.maturity,
        direction: research.direction ?? prev.direction,
      }));

      setSuccessMessage('Brand profile auto-filled from research! Review and amend below.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to research brand');
    } finally {
      setResearching(false);
    }
  }, [state.businessName, state.industry, state.website, state.location]);

  const handleInputChange = (field: keyof BrandState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAgeRangeChange = (range: string) => {
    setState((prev) => ({
      ...prev,
      ageRanges: prev.ageRanges.includes(range)
        ? prev.ageRanges.filter((r) => r !== range)
        : [...prev.ageRanges, range],
    }));
  };

  const addInterest = () => {
    if (state.interestInput.trim()) {
      setState((prev) => ({
        ...prev,
        interests: [...prev.interests, prev.interestInput],
        interestInput: '',
      }));
    }
  };

  const removeInterest = (interest: string) => {
    setState((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const updateCompetitor = (index: number, field: 'name' | 'url', value: string) => {
    setState((prev) => ({
      ...prev,
      competitors: prev.competitors.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addCompetitor = () => {
    setState((prev) => ({
      ...prev,
      competitors: [...prev.competitors, { name: '', url: '' }],
    }));
  };

  const updateUSP = (index: number, value: string) => {
    setState((prev) => ({
      ...prev,
      usp: prev.usp.map((u, i) => (i === index ? value : u)),
    }));
  };

  const traitLabels = [
    { left: 'Playful', right: 'Professional', value: state.playfulProfessional },
    { left: 'Bold', right: 'Subtle', value: state.boldSubtle },
    { left: 'Modern', right: 'Classic', value: state.modernClassic },
    { left: 'Friendly', right: 'Authoritative', value: state.friendlyAuthoritative },
    { left: 'Innovative', right: 'Traditional', value: state.innovativeTraditional },
  ];

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="page-title">Brand DNA Profile</h1>
            <p className="page-subtitle">
              Define your brand identity for AI-powered content that matches your voice perfectly
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p style={{ color: 'var(--text2)' }}>Loading your brand profile...</p>
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
          <h1 className="page-title">Brand DNA Profile</h1>
          <p className="page-subtitle">
            Define your brand identity for AI-powered content that matches your voice perfectly
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg border flex items-center gap-2" style={{ backgroundColor: '#dcfce7', borderColor: '#86efac', color: '#166534' }}>
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {!hasData && !loading && (
          <div className="mb-8 p-6 rounded-lg border text-center" style={{ backgroundColor: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text2)' }}>
            <p className="text-sm mb-4">Setting up your brand profile...</p>
            <p className="text-xs">Fill in your basic info below, then use Auto-Research to fill the rest automatically</p>
          </div>
        )}

        {/* Auto-Research Section */}
        <div className="mb-8 p-6 rounded-lg border" style={{ backgroundColor: 'var(--accent-bg)', borderColor: 'var(--border)' }}>
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1">
              <h3 className="section-title mb-2">Quick Setup</h3>
              <p style={{ color: 'var(--text2)' }} className="text-sm mb-4">
                Enter your basic info, then click Auto-Research to instantly fill your brand profile using web research.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    value={state.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g., Acme Corp"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Industry</label>
                  <select
                    value={state.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="form-input"
                  >
                    <option>Food & Beverage</option>
                    <option>Fashion</option>
                    <option>Tech</option>
                    <option>Health</option>
                    <option>Finance</option>
                    <option>Real Estate</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    value={state.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={autoResearchBrand}
              disabled={researching || !state.businessName || !state.industry || !state.website}
              style={{
                background: researching ? 'var(--bg2)' : 'var(--gradient)',
                color: 'white',
              }}
              className="btn btn-primary whitespace-nowrap h-fit disabled:opacity-50"
            >
              {researching ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Auto-Research
                </>
              )}
            </button>
          </div>
        </div>

        {/* Brand Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Stage */}
          <div className="card p-6">
            <h3 className="section-title mb-4">Brand Stage</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={state.maturity}
                onChange={(e) => handleInputChange('maturity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded cursor-pointer"
              />
              <div className="flex justify-between text-xs" style={{ color: 'var(--text2)' }}>
                <span>New Brand (Building from scratch)</span>
                <span>Established Brand (Refining existing)</span>
              </div>
              <div
                className="text-center font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                {state.maturity}%
              </div>
            </div>
          </div>

          {/* Brand Direction */}
          <div className="card p-6">
            <h3 className="section-title mb-4">Brand Direction</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={state.direction}
                onChange={(e) => handleInputChange('direction', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded cursor-pointer"
              />
              <div className="flex justify-between text-xs" style={{ color: 'var(--text2)' }}>
                <span>Keep Existing Identity</span>
                <span>Complete Rebrand</span>
              </div>
              <div
                className="text-center font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                {state.direction}%
              </div>
            </div>
          </div>
        </div>

        {/* Brand Info */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-6">Brand Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="form-label">Business Name</label>
              <input
                type="text"
                value={state.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="form-input"
                placeholder="e.g., Acme Corp"
              />
            </div>
            <div>
              <label className="form-label">Industry</label>
              <select
                value={state.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="form-input"
              >
                <option>Food & Beverage</option>
                <option>Fashion</option>
                <option>Tech</option>
                <option>Health</option>
                <option>Finance</option>
                <option>Real Estate</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Founded Year</label>
              <input
                type="number"
                value={state.foundedYear}
                onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                value={state.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="form-input"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Website</label>
              <input
                type="url"
                value={state.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-6">Target Audience</h3>

          {/* Age Range */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Age Range
            </h4>
            <div className="flex flex-wrap gap-4">
              {['18-24', '25-34', '35-44', '45-54', '55+'].map((range) => (
                <label key={range} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.ageRanges.includes(range)}
                    onChange={() => handleAgeRangeChange(range)}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ color: 'var(--text2)' }}>{range}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Split */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Gender Split
            </h4>
            <input
              type="range"
              min="0"
              max="100"
              value={state.genderMale}
              onChange={(e) => handleInputChange('genderMale', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text2)' }}>
              <span>{state.genderMale}% Male</span>
              <span>{100 - state.genderMale}% Female</span>
            </div>
          </div>

          {/* Income Level */}
          <div className="mb-8">
            <label className="form-label">Income Level</label>
            <select
              value={state.incomeLevel}
              onChange={(e) => handleInputChange('incomeLevel', e.target.value)}
              className="form-input"
            >
              <option>Budget</option>
              <option>Mid-range</option>
              <option>Premium</option>
              <option>Luxury</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Interests
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {state.interests.map((interest) => (
                <div key={interest} className="tag tag-blue flex items-center gap-1">
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="hover:opacity-80"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={state.interestInput}
                onChange={(e) => handleInputChange('interestInput', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                placeholder="Add interest..."
                className="form-input flex-1"
              />
              <button onClick={addInterest} className="btn btn-secondary">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Brand Personality */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-6">Brand Personality</h3>
          <div className="space-y-8">
            {traitLabels.map((trait, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text2)' }}>
                    {trait.left}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text2)' }}>
                    {trait.right}
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={trait.value}
                  onChange={(e) => {
                    const traitKeys: (keyof BrandState)[] = [
                      'playfulProfessional',
                      'boldSubtle',
                      'modernClassic',
                      'friendlyAuthoritative',
                      'innovativeTraditional',
                    ];
                    handleInputChange(traitKeys[idx], parseInt(e.target.value));
                  }}
                  className="w-full h-2 bg-gray-300 rounded cursor-pointer"
                />
                <div className="text-center text-xs mt-1" style={{ color: 'var(--accent)' }}>
                  {trait.value > 0 ? '+' : ''}{trait.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice & Tone */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-6">Voice & Tone</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Formality
              </h4>
              <input
                type="range"
                min="1"
                max="10"
                value={state.formality}
                onChange={(e) => handleInputChange('formality', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded cursor-pointer"
              />
              <div className="text-center text-sm mt-2" style={{ color: 'var(--accent)' }}>
                {state.formality}/10
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Humor
              </h4>
              <input
                type="range"
                min="1"
                max="10"
                value={state.humor}
                onChange={(e) => handleInputChange('humor', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded cursor-pointer"
              />
              <div className="text-center text-sm mt-2" style={{ color: 'var(--accent)' }}>
                {state.humor}/10
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                Enthusiasm
              </h4>
              <input
                type="range"
                min="1"
                max="10"
                value={state.enthusiasm}
                onChange={(e) => handleInputChange('enthusiasm', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded cursor-pointer"
              />
              <div className="text-center text-sm mt-2" style={{ color: 'var(--accent)' }}>
                {state.enthusiasm}/10
              </div>
            </div>
          </div>

          {/* Emoji Usage */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Emoji Usage
            </h4>
            <div className="flex flex-wrap gap-4">
              {['None', 'Minimal', 'Moderate', 'Heavy'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="emoji"
                    value={option}
                    checked={state.emojiUsage === option}
                    onChange={(e) => handleInputChange('emojiUsage', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span style={{ color: 'var(--text2)' }}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-6">Brand Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="form-label">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#000000"
                  className="form-input flex-1"
                />
                <input
                  type="color"
                  value={state.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  placeholder="#000000"
                  className="form-input flex-1"
                />
                <input
                  type="color"
                  value={state.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  placeholder="#000000"
                  className="form-input flex-1"
                />
                <input
                  type="color"
                  value={state.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="flex gap-3 h-16">
            <div
              className="flex-1 rounded shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: state.primaryColor }}
            />
            <div
              className="flex-1 rounded shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: state.secondaryColor }}
            />
            <div
              className="flex-1 rounded shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: state.accentColor }}
            />
          </div>
        </div>

        {/* Brand Story */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-4">Brand Story</h3>
          <label className="form-label">Tell your brand story in 2-3 sentences</label>
          <textarea
            value={state.brandStory}
            onChange={(e) => handleInputChange('brandStory', e.target.value)}
            rows={6}
            className="form-input w-full"
          />
        </div>

        {/* Competitors */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-6">Competitors</h3>
          <div className="space-y-4 mb-6">
            {state.competitors.map((competitor, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={competitor.name}
                    onChange={(e) => updateCompetitor(idx, 'name', e.target.value)}
                    placeholder="Competitor name"
                    className="form-input"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    value={competitor.url}
                    onChange={(e) => updateCompetitor(idx, 'url', e.target.value)}
                    placeholder="Website URL"
                    className="form-input"
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addCompetitor} className="btn btn-secondary">
            <Plus size={16} />
            Add Competitor
          </button>
        </div>

        {/* USP */}
        <div className="card p-6 mb-8">
          <h3 className="section-title mb-6">Unique Selling Points</h3>
          <div className="space-y-4">
            {state.usp.map((point, idx) => (
              <div key={idx}>
                <label className="form-label">USP {idx + 1}</label>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updateUSP(idx, e.target.value)}
                  className="form-input"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4 mb-12">
          <button
            onClick={saveBrandData}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save & Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
