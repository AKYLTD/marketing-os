'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Lock,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Bell,
  Users,
  TrendingUp,
  Zap,
  Eye,
  X,
  AlertCircle,
  Mail,
  FileText,
  Calendar,
  Phone,
  Save,
} from 'lucide-react';

type TabType =
  | 'overview'
  | 'users'
  | 'subscriptions'
  | 'crm'
  | 'payments'
  | 'vouchers'
  | 'system';
type UserTier = 'All' | 'Basic' | 'Gold' | 'Enterprise';
type CRMFilter = 'All' | 'Leads' | 'Active' | 'At Risk' | 'Churned';

interface User {
  id: string;
  name: string;
  email: string;
  tier: 'Basic' | 'Gold' | 'Enterprise';
  status: 'Active' | 'Inactive';
  joined: string;
  lastActive: string;
}

interface CRMContact {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'Lead' | 'Active' | 'Churned' | 'At Risk';
  value: number;
  lastContact: string;
  nextAction: string;
}

interface Payment {
  id: string;
  invoice: string;
  user: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

interface Voucher {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  usedCount: number;
  expiry: string;
  active: boolean;
}

interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
}

interface ContactActivity {
  id: string;
  type: 'email' | 'note' | 'call' | 'status_change';
  action: string;
  timestamp: string;
  details?: string;
}

interface ContactNote {
  id: string;
  text: string;
  date: string;
}

interface CRMContactDetail extends CRMContact {
  phone?: string;
  activities?: ContactActivity[];
  notes?: ContactNote[];
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Roni Delgado',
    email: 'roni@bagels.com',
    tier: 'Gold',
    status: 'Active',
    joined: '2024-08-15',
    lastActive: '2025-02-14',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@marketing.co',
    tier: 'Enterprise',
    status: 'Active',
    joined: '2024-09-02',
    lastActive: '2025-02-14',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@startup.io',
    tier: 'Basic',
    status: 'Active',
    joined: '2024-10-10',
    lastActive: '2025-02-10',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@brands.io',
    tier: 'Gold',
    status: 'Inactive',
    joined: '2024-07-20',
    lastActive: '2025-01-15',
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'alex@agency.com',
    tier: 'Enterprise',
    status: 'Active',
    joined: '2024-09-10',
    lastActive: '2025-02-13',
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    email: 'lisa@retail.shop',
    tier: 'Basic',
    status: 'Active',
    joined: '2025-01-05',
    lastActive: '2025-02-12',
  },
  {
    id: '7',
    name: 'David Park',
    email: 'david@tech.com',
    tier: 'Gold',
    status: 'Active',
    joined: '2024-10-25',
    lastActive: '2025-02-11',
  },
  {
    id: '8',
    name: 'Jessica Brown',
    email: 'jessica@creative.co',
    tier: 'Basic',
    status: 'Inactive',
    joined: '2024-11-01',
    lastActive: '2025-01-20',
  },
];

const mockCRMContacts: CRMContactDetail[] = [
  {
    id: '1',
    name: 'TechStart Inc',
    company: 'Technology',
    email: 'hello@techstart.io',
    phone: '+44 20 7946 0958',
    status: 'Lead',
    value: 0,
    lastContact: '2025-02-10',
    nextAction: 'Send proposal',
    activities: [
      { id: '1', type: 'email', action: 'Initial outreach sent', timestamp: '2025-02-10', details: 'Introductory email' },
      { id: '2', type: 'status_change', action: 'Status: Prospect → Lead', timestamp: '2025-02-08', details: 'Meeting scheduled' },
    ],
    notes: [
      { id: '1', text: 'Very interested in demo next week', date: '2025-02-10' },
    ],
  },
  {
    id: '2',
    name: 'FashionBrand Co',
    company: 'Fashion',
    email: 'info@fashionbrand.com',
    phone: '+44 20 7946 0959',
    status: 'Active',
    value: 2500,
    lastContact: '2025-02-14',
    nextAction: 'Monthly review',
    activities: [
      { id: '1', type: 'call', action: 'Monthly check-in call', timestamp: '2025-02-14', details: 'All systems running smoothly' },
      { id: '2', type: 'email', action: 'Monthly report sent', timestamp: '2025-02-14', details: 'Performance metrics' },
      { id: '3', type: 'note', action: 'Added note', timestamp: '2025-02-10', details: 'Expansion plans discussed' },
    ],
    notes: [
      { id: '1', text: 'Looking to expand to 3 more regions', date: '2025-02-10' },
      { id: '2', text: 'Contact prefers Tuesday meetings', date: '2025-02-05' },
    ],
  },
  {
    id: '3',
    name: 'HealthFood Ltd',
    company: 'Food & Beverage',
    email: 'contact@healthfood.co.uk',
    phone: '+44 121 567 8901',
    status: 'At Risk',
    value: 1500,
    lastContact: '2024-12-20',
    nextAction: 'Retention call',
    activities: [
      { id: '1', type: 'email', action: 'Payment issue resolved', timestamp: '2024-12-20', details: 'Invoice dispute settled' },
      { id: '2', type: 'status_change', action: 'Status: Active → At Risk', timestamp: '2024-12-15', details: 'Inactivity detected' },
    ],
    notes: [
      { id: '1', text: 'Had some issues with billing last month', date: '2024-12-20' },
    ],
  },
  {
    id: '4',
    name: 'EcoClean Supply',
    company: 'Cleaning Products',
    email: 'sales@ecoclean.com',
    phone: '+44 161 234 5678',
    status: 'Churned',
    value: 0,
    lastContact: '2024-11-15',
    nextAction: 'Win-back campaign',
    activities: [
      { id: '1', type: 'email', action: 'Cancellation email received', timestamp: '2024-11-15', details: 'Account terminated' },
    ],
    notes: [
      { id: '1', text: 'Price sensitivity was key issue', date: '2024-11-15' },
    ],
  },
  {
    id: '5',
    name: 'CoffeeRoasters',
    company: 'Food & Beverage',
    email: 'marketing@coffeeroasters.co',
    phone: '+44 131 456 7890',
    status: 'Active',
    value: 3200,
    lastContact: '2025-02-12',
    nextAction: 'Upsell consultation',
    activities: [
      { id: '1', type: 'call', action: 'Upsell consultation scheduled', timestamp: '2025-02-12', details: 'Enterprise features discussion' },
      { id: '2', type: 'email', action: 'Feature comparison sent', timestamp: '2025-02-10', details: 'Gold vs Enterprise plans' },
    ],
    notes: [
      { id: '1', text: 'Strong interest in advanced analytics', date: '2025-02-12' },
    ],
  },
  {
    id: '6',
    name: 'BeautyBox Studios',
    company: 'Beauty',
    email: 'hello@beautybox.com',
    phone: '+44 20 7946 0960',
    status: 'Lead',
    value: 0,
    lastContact: '2025-02-08',
    nextAction: 'Demo scheduled',
    activities: [
      { id: '1', type: 'email', action: 'Demo scheduled', timestamp: '2025-02-08', details: 'Thursday 3pm GMT' },
      { id: '2', type: 'note', action: 'Added note', timestamp: '2025-02-07', details: 'Referred by Sarah Chen' },
    ],
    notes: [
      { id: '1', text: 'Referred by existing customer', date: '2025-02-07' },
    ],
  },
  {
    id: '7',
    name: 'LocalBakeries Network',
    company: 'Food & Beverage',
    email: 'network@localbakeries.co.uk',
    phone: '+44 113 234 5678',
    status: 'Active',
    value: 4100,
    lastContact: '2025-02-14',
    nextAction: 'Quarterly check-in',
    activities: [
      { id: '1', type: 'call', action: 'Quarterly business review', timestamp: '2025-02-14', details: 'Expansion results reviewed' },
      { id: '2', type: 'email', action: 'Quarterly report sent', timestamp: '2025-02-14', details: 'Performance summary' },
    ],
    notes: [
      { id: '1', text: 'Best performing customer this quarter', date: '2025-02-14' },
    ],
  },
  {
    id: '8',
    name: 'FitnessPro Coaching',
    company: 'Fitness',
    email: 'info@fitnesspro.io',
    phone: '+44 191 456 7890',
    status: 'At Risk',
    value: 1800,
    lastContact: '2024-12-30',
    nextAction: 'Feature walkthrough',
    activities: [
      { id: '1', type: 'email', action: 'Feature walkthrough scheduled', timestamp: '2024-12-30', details: 'Advanced reporting features' },
      { id: '2', type: 'status_change', action: 'Status: Active → At Risk', timestamp: '2024-12-28', details: 'Support tickets increased' },
    ],
    notes: [
      { id: '1', text: 'Having technical issues with integrations', date: '2024-12-30' },
    ],
  },
  {
    id: '9',
    name: 'DesignStudio Collective',
    company: 'Design',
    email: 'contact@designstudio.co',
    phone: '+44 151 567 8901',
    status: 'Lead',
    value: 0,
    lastContact: '2025-02-05',
    nextAction: 'Follow-up email',
    activities: [
      { id: '1', type: 'email', action: 'Follow-up email sent', timestamp: '2025-02-05', details: 'No response to initial contact' },
      { id: '2', type: 'email', action: 'Initial inquiry received', timestamp: '2025-02-01', details: 'Contact form submission' },
    ],
    notes: [
      { id: '1', text: 'Awaiting response to follow-up', date: '2025-02-05' },
    ],
  },
  {
    id: '10',
    name: 'OrganicGroceries',
    company: 'Retail',
    email: 'hello@organicgroceries.com',
    phone: '+44 141 234 5678',
    status: 'Active',
    value: 2800,
    lastContact: '2025-02-13',
    nextAction: 'Renewal negotiation',
    activities: [
      { id: '1', type: 'call', action: 'Renewal discussion initiated', timestamp: '2025-02-13', details: 'Contract renewal in March' },
      { id: '2', type: 'email', action: 'Renewal proposal sent', timestamp: '2025-02-10', details: 'Updated pricing and terms' },
    ],
    notes: [
      { id: '1', text: 'Likely to upgrade to Enterprise tier', date: '2025-02-13' },
      { id: '2', text: 'Very satisfied with current implementation', date: '2025-02-10' },
    ],
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    invoice: 'INV-2025-001',
    user: 'Roni Delgado',
    amount: 29,
    date: '2025-02-14',
    status: 'Paid',
  },
  {
    id: '2',
    invoice: 'INV-2025-002',
    user: 'Sarah Chen',
    amount: 99,
    date: '2025-02-14',
    status: 'Paid',
  },
  {
    id: '3',
    invoice: 'INV-2025-003',
    user: 'Mike Johnson',
    amount: 0,
    date: '2025-02-13',
    status: 'Paid',
  },
  {
    id: '4',
    invoice: 'INV-2025-004',
    user: 'Emma Wilson',
    amount: 29,
    date: '2025-02-12',
    status: 'Pending',
  },
  {
    id: '5',
    invoice: 'INV-2025-005',
    user: 'Alex Rodriguez',
    amount: 99,
    date: '2025-02-11',
    status: 'Paid',
  },
  {
    id: '6',
    invoice: 'INV-2025-006',
    user: 'Lisa Thompson',
    amount: 0,
    date: '2025-02-10',
    status: 'Paid',
  },
  {
    id: '7',
    invoice: 'INV-2025-007',
    user: 'David Park',
    amount: 29,
    date: '2025-02-09',
    status: 'Failed',
  },
  {
    id: '8',
    invoice: 'INV-2025-008',
    user: 'Jessica Brown',
    amount: 0,
    date: '2025-02-08',
    status: 'Paid',
  },
];

const mockVouchers: Voucher[] = [
  { id: '1', code: 'WELCOME20', discount: 20, maxUses: 1000, usedCount: 432, expiry: '2025-12-31', active: true },
  { id: '2', code: 'BAGEL50', discount: 50, maxUses: 100, usedCount: 89, expiry: '2025-03-15', active: true },
  { id: '3', code: 'LOYALTY10', discount: 10, maxUses: 500, usedCount: 145, expiry: '2025-06-30', active: true },
  { id: '4', code: 'SPRING25', discount: 25, maxUses: 300, usedCount: 78, expiry: '2025-04-30', active: true },
];

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [userFilter, setUserFilter] = useState<UserTier>('All');
  const [crmFilter, setCRMFilter] = useState<CRMFilter>('All');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [crmContacts, setCrmContacts] = useState<CRMContactDetail[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  // CRM Modal states
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactForm, setNewContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead' as const,
    value: '',
    notes: '',
  });

  // CRM Contact expansion states
  const [expandedContactDetail, setExpandedContactDetail] = useState<string | null>(null);
  const [contactEmailForm, setContactEmailForm] = useState<{ [key: string]: { subject: string; message: string; composing: boolean } }>({});
  const [contactNoteForm, setContactNoteForm] = useState<{ [key: string]: { text: string; saving: boolean } }>({});
  const [contactCallForm, setContactCallForm] = useState<{ [key: string]: { notes: string; outcome: string; saving: boolean } }>({});
  const [contactFollowupForm, setContactFollowupForm] = useState<{ [key: string]: { date: string; reason: string; saving: boolean } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contactsRes, usersRes, vouchersRes] = await Promise.all([
          fetch('/api/contacts'),
          fetch('/api/admin/users'),
          fetch('/api/vouchers'),
        ]);

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setCrmContacts(contactsData.contacts || mockCRMContacts);
        } else {
          setCrmContacts(mockCRMContacts);
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || mockUsers);
        } else {
          setUsers(mockUsers);
        }

        if (vouchersRes.ok) {
          const vouchersData = await vouchersRes.json();
          setVouchers(vouchersData.vouchers || mockVouchers);
        } else {
          setVouchers(mockVouchers);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        setCrmContacts(mockCRMContacts);
        setUsers(mockUsers);
        setVouchers(mockVouchers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Voucher Modal states
  const [showCreateVoucherModal, setShowCreateVoucherModal] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discount: '',
    maxUses: '',
    expiryDate: '',
    sendTo: 'all' as 'all' | 'tier' | 'emails',
    tier: 'Basic' as 'Basic' | 'Gold' | 'Enterprise',
    emails: '',
  });
  const [expandedVoucher, setExpandedVoucher] = useState<string | null>(null);

  // TODO: Restrict to ADMIN_EMAILS in production
  const ADMIN_EMAILS = ['alonkubi@gmail.com'];
  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email || '') || session?.user?.email; // Allow all logged-in users during testing

  if (!isAdmin) {
    return (
      <div className="page-content flex flex-col items-center justify-center min-h-96 text-center">
        <div className="bg-[var(--bg2)] rounded-lg p-8 max-w-sm">
          <Lock size={48} className="text-[var(--text2)] mx-auto mb-4" />
          <h1 className="page-title mb-2">Access Denied</h1>
          <p className="text-[var(--text2)]">
            This page is restricted to administrators only. Please contact support if you believe you should have access.
          </p>
        </div>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic':
        return 'tag-blue';
      case 'Gold':
        return 'tag-amber';
      case 'Enterprise':
        return 'tag-purple';
      default:
        return 'tag-blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Paid':
      case 'Lead':
        return 'tag-green';
      case 'Inactive':
      case 'Pending':
      case 'At Risk':
        return 'tag-amber';
      case 'Failed':
      case 'Churned':
        return 'tag-red';
      default:
        return 'tag-blue';
    }
  };

  const generateVoucherCode = () => {
    const codes = ['WELCOME', 'BAGEL', 'LOYALTY', 'SPRING', 'SUMMER', 'FALL', 'WINTER', 'SPECIAL'];
    const code = codes[Math.floor(Math.random() * codes.length)];
    const num = Math.floor(Math.random() * 90) + 10;
    setVoucherForm({ ...voucherForm, code: `${code}${num}` });
  };

  const filteredUsers = users.filter((user) =>
    userFilter === 'All' ? true : user.tier === userFilter
  );

  const filteredContacts = crmContacts.filter((contact) =>
    crmFilter === 'All' ? true : contact.status === crmFilter
  );

  const metrics: MetricCard[] = [
    { label: 'Total Users', value: 47 },
    { label: 'Active Subscriptions', value: 32 },
    { label: 'Monthly Revenue', value: '£2,847' },
    { label: 'Churn Rate', value: '2.1%' },
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'crm', label: 'CRM' },
    { id: 'payments', label: 'Payments' },
    { id: 'vouchers', label: 'Vouchers' },
    { id: 'system', label: 'System Settings' },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">
          Manage users, subscriptions, and platform settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max sm:flex-wrap sm:min-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--bg3)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="card">
                <p className="text-xs text-[var(--text2)] mb-2">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {metric.value}
                </p>
                {metric.change && (
                  <p className="text-xs text-[var(--green)] mt-1">
                    {metric.change}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="card">
            <h3 className="section-title mb-4">Revenue (Last 6 Months)</h3>
            <div className="h-48 bg-[var(--bg2)] rounded-lg flex items-end gap-2 p-4">
              {[2100, 2400, 2300, 2650, 2800, 2847].map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-[var(--accent)] to-[var(--accent-bg)] rounded-sm"
                  style={{
                    height: `${(value / 2847) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="section-title mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { event: 'New signup', user: 'Jessica Brown', time: '2 hours ago' },
                { event: 'Tier upgrade', user: 'Sarah Chen', time: '5 hours ago' },
                { event: 'Cancellation', user: 'Mike Johnson', time: '1 day ago' },
                { event: 'New signup', user: 'David Park', time: '2 days ago' },
                { event: 'Tier upgrade', user: 'Emma Wilson', time: '3 days ago' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-[var(--bg2)] rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {activity.event}
                    </p>
                    <p className="text-xs text-[var(--text2)] mt-1">
                      {activity.user}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--text3)]">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="section-title mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="btn btn-primary">
                <Plus size={18} />
                Add User
              </button>
              <button className="btn btn-secondary">
                <Download size={18} />
                Generate Report
              </button>
              <button className="btn btn-secondary">
                <Bell size={18} />
                Send Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <label className="form-label text-sm">Filter by Tier</label>
                <select
                  className="form-input text-sm"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as UserTier)}
                >
                  <option>All</option>
                  <option>Basic</option>
                  <option>Gold</option>
                  <option>Enterprise</option>
                </select>
              </div>
              <button className="btn btn-primary">
                <Plus size={18} />
                Add User
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg2)] transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedUser(
                          expandedUser === user.id ? null : user.id
                        )
                      }
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${getTierColor(user.tier)}`}>
                          {user.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {user.joined}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="btn btn-secondary btn-sm">
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-secondary btn-sm">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded User Details */}
            {expandedUser && (
              <div className="mt-4 p-4 bg-[var(--bg2)] rounded-lg">
                <p className="text-sm font-medium text-[var(--text)] mb-2">
                  User Details: {users.find((u) => u.id === expandedUser)?.name}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text2)]">
                  <div>
                    <p>Last Active: {users.find((u) => u.id === expandedUser)?.lastActive}</p>
                  </div>
                  <div>
                    <p>Member Since: {users.find((u) => u.id === expandedUser)?.joined}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { tier: 'Basic', users: 23, price: 'Free' },
              { tier: 'Gold', users: 15, price: '£29/mo', mrr: 435 },
              { tier: 'Enterprise', users: 9, price: '£99/mo', mrr: 891 },
            ].map((sub, idx) => (
              <div key={idx} className="card">
                <p className="text-sm font-medium text-[var(--text2)] mb-2">
                  {sub.tier}
                </p>
                <p className="text-2xl font-bold text-[var(--text)] mb-1">
                  {sub.users}
                </p>
                <p className="text-xs text-[var(--text2)]">{sub.price}</p>
                {sub.mrr && (
                  <p className="text-xs text-[var(--accent)] mt-2">
                    MRR: £{sub.mrr}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="section-title mb-4">Total MRR: £1,326</h3>

            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      From Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      To Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      user: 'Sarah Chen',
                      from: 'Gold',
                      to: 'Enterprise',
                      date: '2025-02-10',
                      reason: 'Requested upgrade',
                    },
                    {
                      user: 'Mike Johnson',
                      from: 'Gold',
                      to: 'Basic',
                      date: '2025-02-08',
                      reason: 'Downgrade request',
                    },
                    {
                      user: 'Emma Wilson',
                      from: 'Basic',
                      to: 'Gold',
                      date: '2025-02-05',
                      reason: 'Usage growth',
                    },
                  ].map((change, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg2)]"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        {change.user}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${getTierColor(change.from)}`}>
                          {change.from}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${getTierColor(change.to)}`}>
                          {change.to}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {change.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {change.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CRM Tab */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          {/* Pipeline Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Leads', count: crmContacts.filter(c => c.status === 'Lead').length, color: 'tag-blue' },
              { label: 'Active', count: crmContacts.filter(c => c.status === 'Active').length, color: 'tag-green' },
              { label: 'At Risk', count: crmContacts.filter(c => c.status === 'At Risk').length, color: 'tag-amber' },
              { label: 'Churned', count: crmContacts.filter(c => c.status === 'Churned').length, color: 'tag-red' },
            ].map((stage, idx) => (
              <div key={idx} className="card">
                <p className="text-xs text-[var(--text2)] mb-2">{stage.label}</p>
                <p className="text-3xl font-bold text-[var(--text)]">{stage.count}</p>
              </div>
            ))}
          </div>

          {/* Add Contact Button */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <label className="form-label text-sm">Filter by Status</label>
                <select
                  className="form-input text-sm"
                  value={crmFilter}
                  onChange={(e) => setCRMFilter(e.target.value as CRMFilter)}
                >
                  <option>All</option>
                  <option>Leads</option>
                  <option>Active</option>
                  <option>At Risk</option>
                  <option>Churned</option>
                </select>
              </div>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="btn btn-primary"
              >
                <Plus size={18} />
                Add Contact
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Last Contact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg2)] cursor-pointer"
                      onClick={() =>
                        setExpandedContactDetail(
                          expandedContactDetail === contact.id ? null : contact.id
                        )
                      }
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        {contact.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {contact.company}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {contact.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        £{contact.value}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {contact.lastContact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Contact Details */}
            {expandedContactDetail && (
              <div className="mt-6 p-6 bg-[var(--bg2)] rounded-lg">
                {(() => {
                  const contact = crmContacts.find((c) => c.id === expandedContactDetail);
                  if (!contact) return null;

                  return (
                    <div className="space-y-6">
                      {/* Contact Header */}
                      <div className="border-b border-[var(--border)] pb-4">
                        <h3 className="text-lg font-bold text-[var(--text)] mb-3">{contact.name}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-[var(--text2)] text-xs mb-1">Company</p>
                            <p className="text-[var(--text)]">{contact.company}</p>
                          </div>
                          <div>
                            <p className="text-[var(--text2)] text-xs mb-1">Email</p>
                            <p className="text-[var(--text)]">{contact.email}</p>
                          </div>
                          <div>
                            <p className="text-[var(--text2)] text-xs mb-1">Phone</p>
                            <p className="text-[var(--text)]">{contact.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[var(--text2)] text-xs mb-1">Value</p>
                            <p className="text-[var(--accent)] font-medium">£{contact.value}</p>
                          </div>
                        </div>
                      </div>

                      {/* Engagement Actions */}
                      <div className="border-b border-[var(--border)] pb-4">
                        <p className="text-sm font-semibold text-[var(--text)] mb-3">Engagement Actions</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <button
                            onClick={() => {
                              const key = `email-${contact.id}`;
                              if (!contactEmailForm[key]) {
                                contactEmailForm[key] = { subject: '', message: '', composing: false };
                              }
                              setContactEmailForm({
                                ...contactEmailForm,
                                [key]: { ...contactEmailForm[key], composing: !contactEmailForm[key].composing }
                              });
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            <Mail size={16} />
                            Send Email
                          </button>
                          <button
                            onClick={() => {
                              const key = `note-${contact.id}`;
                              if (!contactNoteForm[key]) {
                                contactNoteForm[key] = { text: '', saving: false };
                              }
                              setContactNoteForm({
                                ...contactNoteForm,
                                [key]: { ...contactNoteForm[key], saving: !contactNoteForm[key].saving }
                              });
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            <FileText size={16} />
                            Add Note
                          </button>
                          <button
                            onClick={() => {
                              const key = `followup-${contact.id}`;
                              if (!contactFollowupForm[key]) {
                                contactFollowupForm[key] = { date: '', reason: '', saving: false };
                              }
                              setContactFollowupForm({
                                ...contactFollowupForm,
                                [key]: { ...contactFollowupForm[key], saving: !contactFollowupForm[key].saving }
                              });
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            <Calendar size={16} />
                            Schedule Follow-up
                          </button>
                          <button
                            onClick={() => {
                              const key = `call-${contact.id}`;
                              if (!contactCallForm[key]) {
                                contactCallForm[key] = { notes: '', outcome: 'Connected', saving: false };
                              }
                              setContactCallForm({
                                ...contactCallForm,
                                [key]: { ...contactCallForm[key], saving: !contactCallForm[key].saving }
                              });
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            <Phone size={16} />
                            Log Call
                          </button>
                        </div>

                        {/* Email Compose */}
                        {contactEmailForm[`email-${contact.id}`]?.composing && (
                          <div className="bg-[var(--bg)] p-4 rounded-lg mb-4 space-y-3">
                            <input
                              type="text"
                              placeholder="Email subject"
                              value={contactEmailForm[`email-${contact.id}`]?.subject || ''}
                              onChange={(e) => {
                                const key = `email-${contact.id}`;
                                setContactEmailForm({
                                  ...contactEmailForm,
                                  [key]: { ...contactEmailForm[key], subject: e.target.value }
                                });
                              }}
                              className="form-input w-full text-sm"
                            />
                            <textarea
                              placeholder="Email message"
                              value={contactEmailForm[`email-${contact.id}`]?.message || ''}
                              onChange={(e) => {
                                const key = `email-${contact.id}`;
                                setContactEmailForm({
                                  ...contactEmailForm,
                                  [key]: { ...contactEmailForm[key], message: e.target.value }
                                });
                              }}
                              className="form-input w-full text-sm h-24"
                            />
                            <button
                              onClick={async () => {
                                try {
                                  const key = `email-${contact.id}`;
                                  const response = await fetch('/api/contacts/activities', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      contactId: contact.id,
                                      type: 'email',
                                      action: 'Email sent',
                                      details: contactEmailForm[key]?.message,
                                    }),
                                  });
                                  if (response.ok) {
                                    setContactEmailForm({
                                      ...contactEmailForm,
                                      [key]: { ...contactEmailForm[key], composing: false, subject: '', message: '' }
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to send email:', err);
                                }
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              Send
                            </button>
                          </div>
                        )}

                        {/* Add Note */}
                        {contactNoteForm[`note-${contact.id}`]?.saving && (
                          <div className="bg-[var(--bg)] p-4 rounded-lg mb-4 space-y-3">
                            <textarea
                              placeholder="Add a note..."
                              value={contactNoteForm[`note-${contact.id}`]?.text || ''}
                              onChange={(e) => {
                                const key = `note-${contact.id}`;
                                setContactNoteForm({
                                  ...contactNoteForm,
                                  [key]: { ...contactNoteForm[key], text: e.target.value }
                                });
                              }}
                              className="form-input w-full text-sm h-20"
                            />
                            <button
                              onClick={async () => {
                                try {
                                  const key = `note-${contact.id}`;
                                  const response = await fetch('/api/contacts/activities', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      contactId: contact.id,
                                      type: 'note',
                                      action: 'Note added',
                                      details: contactNoteForm[key]?.text,
                                    }),
                                  });
                                  if (response.ok) {
                                    setContactNoteForm({
                                      ...contactNoteForm,
                                      [key]: { ...contactNoteForm[key], saving: false, text: '' }
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to save note:', err);
                                }
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              Save Note
                            </button>
                          </div>
                        )}

                        {/* Schedule Follow-up */}
                        {contactFollowupForm[`followup-${contact.id}`]?.saving && (
                          <div className="bg-[var(--bg)] p-4 rounded-lg mb-4 space-y-3">
                            <input
                              type="date"
                              value={contactFollowupForm[`followup-${contact.id}`]?.date || ''}
                              onChange={(e) => {
                                const key = `followup-${contact.id}`;
                                setContactFollowupForm({
                                  ...contactFollowupForm,
                                  [key]: { ...contactFollowupForm[key], date: e.target.value }
                                });
                              }}
                              className="form-input w-full text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Follow-up reason"
                              value={contactFollowupForm[`followup-${contact.id}`]?.reason || ''}
                              onChange={(e) => {
                                const key = `followup-${contact.id}`;
                                setContactFollowupForm({
                                  ...contactFollowupForm,
                                  [key]: { ...contactFollowupForm[key], reason: e.target.value }
                                });
                              }}
                              className="form-input w-full text-sm"
                            />
                            <button
                              onClick={async () => {
                                try {
                                  const key = `followup-${contact.id}`;
                                  const response = await fetch('/api/contacts/activities', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      contactId: contact.id,
                                      type: 'status_change',
                                      action: 'Follow-up scheduled',
                                      details: contactFollowupForm[key]?.reason,
                                    }),
                                  });
                                  if (response.ok) {
                                    setContactFollowupForm({
                                      ...contactFollowupForm,
                                      [key]: { ...contactFollowupForm[key], saving: false, date: '', reason: '' }
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to schedule follow-up:', err);
                                }
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              Schedule
                            </button>
                          </div>
                        )}

                        {/* Log Call */}
                        {contactCallForm[`call-${contact.id}`]?.saving && (
                          <div className="bg-[var(--bg)] p-4 rounded-lg mb-4 space-y-3">
                            <textarea
                              placeholder="Call notes"
                              value={contactCallForm[`call-${contact.id}`]?.notes || ''}
                              onChange={(e) => {
                                const key = `call-${contact.id}`;
                                setContactCallForm({
                                  ...contactCallForm,
                                  [key]: { ...contactCallForm[key], notes: e.target.value }
                                });
                              }}
                              className="form-input w-full text-sm h-20"
                            />
                            <select
                              value={contactCallForm[`call-${contact.id}`]?.outcome || 'Connected'}
                              onChange={(e) => {
                                const key = `call-${contact.id}`;
                                setContactCallForm({
                                  ...contactCallForm,
                                  [key]: { ...contactCallForm[key], outcome: e.target.value }
                                });
                              }}
                              className="form-input w-full text-sm"
                            >
                              <option>Connected</option>
                              <option>Voicemail</option>
                              <option>No Answer</option>
                            </select>
                            <button
                              onClick={async () => {
                                try {
                                  const key = `call-${contact.id}`;
                                  const response = await fetch('/api/contacts/activities', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      contactId: contact.id,
                                      type: 'call',
                                      action: `Call logged - ${contactCallForm[key]?.outcome}`,
                                      details: contactCallForm[key]?.notes,
                                    }),
                                  });
                                  if (response.ok) {
                                    setContactCallForm({
                                      ...contactCallForm,
                                      [key]: { ...contactCallForm[key], saving: false, notes: '', outcome: 'Connected' }
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to log call:', err);
                                }
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              Log Call
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Activity Timeline */}
                      <div className="border-b border-[var(--border)] pb-4">
                        <p className="text-sm font-semibold text-[var(--text)] mb-3">Activity Timeline</p>
                        <div className="space-y-3">
                          {contact.activities?.map((activity) => (
                            <div key={activity.id} className="text-sm">
                              <div className="flex items-start justify-between">
                                <p className="text-[var(--text)]">{activity.action}</p>
                                <p className="text-xs text-[var(--text2)]">{activity.timestamp}</p>
                              </div>
                              {activity.details && (
                                <p className="text-xs text-[var(--text2)] mt-1">{activity.details}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes Section */}
                      {contact.notes && contact.notes.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-[var(--text)] mb-3">Notes</p>
                          <div className="space-y-3">
                            {contact.notes.map((note) => (
                              <div key={note.id} className="p-3 bg-[var(--bg)] rounded-lg">
                                <p className="text-sm text-[var(--text)]">{note.text}</p>
                                <p className="text-xs text-[var(--text2)] mt-1">{note.date}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next Action */}
                      <div className="bg-[var(--accent-bg)] p-3 rounded-lg">
                        <p className="text-xs text-[var(--text2)] mb-1">Next Action</p>
                        <p className="text-sm font-medium text-[var(--text)]">{contact.nextAction}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg)] rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">Add Contact</h2>
              <button onClick={() => setShowAddContactModal(false)} className="text-[var(--text2)]">
                <X size={20} />
              </button>
            </div>
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                placeholder="Contact name"
                value={newContactForm.name}
                onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input
                type="text"
                placeholder="Company name"
                value={newContactForm.company}
                onChange={(e) => setNewContactForm({ ...newContactForm, company: e.target.value })}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Email address"
                value={newContactForm.email}
                onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                placeholder="Phone number"
                value={newContactForm.phone}
                onChange={(e) => setNewContactForm({ ...newContactForm, phone: e.target.value })}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                value={newContactForm.status}
                onChange={(e) => setNewContactForm({ ...newContactForm, status: e.target.value as typeof newContactForm.status })}
                className="form-input w-full"
              >
                <option>Lead</option>
                <option>Active</option>
                <option>At Risk</option>
                <option>Churned</option>
              </select>
            </div>
            <div>
              <label className="form-label">Initial Value (£)</label>
              <input
                type="number"
                placeholder="0"
                value={newContactForm.value}
                onChange={(e) => setNewContactForm({ ...newContactForm, value: e.target.value })}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="form-label">Notes</label>
              <textarea
                placeholder="Add notes..."
                value={newContactForm.notes}
                onChange={(e) => setNewContactForm({ ...newContactForm, notes: e.target.value })}
                className="form-input w-full h-20"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddContactModal(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/contacts', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newContactForm),
                    });
                    if (response.ok) {
                      const newContact = await response.json();
                      setCrmContacts([...crmContacts, newContact]);
                      setShowAddContactModal(false);
                      setNewContactForm({ name: '', company: '', email: '', phone: '', status: 'Lead', value: '', notes: '' });
                    }
                  } catch (err) {
                    console.error('Failed to add contact:', err);
                  }
                }}
                className="btn btn-primary flex-1"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card">
              <p className="text-xs text-[var(--text2)] mb-2">
                Collected This Month
              </p>
              <p className="text-2xl font-bold text-[var(--text)]">£2,847</p>
            </div>
            <div className="card">
              <p className="text-xs text-[var(--text2)] mb-2">
                Outstanding Amount
              </p>
              <p className="text-2xl font-bold text-[var(--amber)]">£145</p>
            </div>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Invoice
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg2)]"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        {payment.invoice}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {payment.user}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        £{payment.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {payment.date}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="btn btn-secondary btn-sm">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="card">
            <button onClick={() => setShowCreateVoucherModal(true)} className="btn btn-primary mb-6">
              <Plus size={18} />
              Create Voucher
            </button>

            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Max Uses
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Used
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Expiry
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text2)] uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => (
                    <React.Fragment key={voucher.id}>
                      <tr
                        className="border-b border-[var(--border)] hover:bg-[var(--bg2)] cursor-pointer"
                        onClick={() => setExpandedVoucher(expandedVoucher === voucher.id ? null : voucher.id)}
                      >
                        <td className="px-4 py-3 font-bold text-[var(--text)]">
                          {voucher.code}
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--accent)]">
                          {voucher.discount}%
                        </td>
                        <td className="px-4 py-3 text-[var(--text)]">
                          {voucher.maxUses}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[var(--text)]">{voucher.usedCount}</span>
                            <div className="w-16 h-2 bg-[var(--bg2)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--accent)]"
                                style={{ width: `${(voucher.usedCount / voucher.maxUses) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text2)]">
                          {voucher.expiry}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const response = await fetch(`/api/vouchers/${voucher.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ active: !voucher.active }),
                                });
                                if (response.ok) {
                                  const updated = vouchers.map((v) =>
                                    v.id === voucher.id ? { ...v, active: !v.active } : v
                                  );
                                  setVouchers(updated);
                                }
                              } catch (err) {
                                console.error('Failed to toggle voucher:', err);
                              }
                            }}
                            className={`tag ${voucher.active ? 'tag-green' : 'tag-red'} cursor-pointer`}
                          >
                            {voucher.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const response = await fetch(`/api/vouchers/${voucher.id}`, {
                                    method: 'DELETE',
                                  });
                                  if (response.ok) {
                                    setVouchers(vouchers.filter((v) => v.id !== voucher.id));
                                  }
                                } catch (err) {
                                  console.error('Failed to delete voucher:', err);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedVoucher === voucher.id && (
                        <tr className="border-b border-[var(--border)]">
                          <td colSpan={7} className="p-4 bg-[var(--bg2)]">
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-semibold text-[var(--text)] mb-2">Redemption History</p>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between p-2 bg-[var(--bg)] rounded">
                                    <span className="text-[var(--text)]">John Smith (john@email.com)</span>
                                    <span className="text-[var(--text2)]">2025-02-14</span>
                                  </div>
                                  <div className="flex justify-between p-2 bg-[var(--bg)] rounded">
                                    <span className="text-[var(--text)]">Sarah Johnson (sarah@email.com)</span>
                                    <span className="text-[var(--text2)]">2025-02-13</span>
                                  </div>
                                  <div className="flex justify-between p-2 bg-[var(--bg)] rounded">
                                    <span className="text-[var(--text)]">Emma Davis (emma@email.com)</span>
                                    <span className="text-[var(--text2)]">2025-02-12</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[var(--text)] mb-2">Send to More Users</p>
                                <div className="flex gap-2">
                                  <input
                                    type="email"
                                    placeholder="user@example.com, user2@example.com"
                                    className="form-input flex-1 text-sm"
                                  />
                                  <button
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(`/api/vouchers/send`, {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            voucherId: voucher.id,
                                            code: voucher.code,
                                          }),
                                        });
                                        if (response.ok) {
                                          alert('Voucher sent successfully!');
                                        }
                                      } catch (err) {
                                        console.error('Failed to send voucher:', err);
                                      }
                                    }}
                                    className="btn btn-secondary btn-sm"
                                  >
                                    Send
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Voucher Modal */}
      {showCreateVoucherModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg)] rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[var(--text)]">Create Voucher</h2>
              <button onClick={() => setShowCreateVoucherModal(false)} className="text-[var(--text2)]">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Voucher Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., WELCOME20"
                    value={voucherForm.code}
                    onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                    className="form-input flex-1"
                  />
                  <button onClick={generateVoucherCode} className="btn btn-secondary">
                    Auto
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  placeholder="20"
                  value={voucherForm.discount}
                  onChange={(e) => setVoucherForm({ ...voucherForm, discount: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Max Uses</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={voucherForm.maxUses}
                  onChange={(e) => setVoucherForm({ ...voucherForm, maxUses: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  value={voucherForm.expiryDate}
                  onChange={(e) => setVoucherForm({ ...voucherForm, expiryDate: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-sm font-semibold text-[var(--text)] mb-3">Send To</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sendTo"
                    checked={voucherForm.sendTo === 'all'}
                    onChange={() => setVoucherForm({ ...voucherForm, sendTo: 'all' })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[var(--text)]">All users</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sendTo"
                    checked={voucherForm.sendTo === 'tier'}
                    onChange={() => setVoucherForm({ ...voucherForm, sendTo: 'tier' })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[var(--text)]">Specific tier</span>
                </label>
                {voucherForm.sendTo === 'tier' && (
                  <select
                    value={voucherForm.tier}
                    onChange={(e) => setVoucherForm({ ...voucherForm, tier: e.target.value as typeof voucherForm.tier })}
                    className="form-input ml-7 text-sm"
                  >
                    <option>Basic</option>
                    <option>Gold</option>
                    <option>Enterprise</option>
                  </select>
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sendTo"
                    checked={voucherForm.sendTo === 'emails'}
                    onChange={() => setVoucherForm({ ...voucherForm, sendTo: 'emails' })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[var(--text)]">Specific emails</span>
                </label>
                {voucherForm.sendTo === 'emails' && (
                  <textarea
                    placeholder="user1@example.com, user2@example.com"
                    value={voucherForm.emails}
                    onChange={(e) => setVoucherForm({ ...voucherForm, emails: e.target.value })}
                    className="form-input ml-7 h-20 text-sm"
                  />
                )}
              </div>
            </div>

            <div className="bg-[var(--accent-bg)] p-3 rounded-lg">
              <p className="text-sm text-[var(--text2)]">Email preview:</p>
              <p className="text-sm text-[var(--text)]">
                Users will receive an email with the voucher code and {voucherForm.discount || '0'}% off
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowCreateVoucherModal(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/vouchers', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(voucherForm),
                    });
                    if (response.ok) {
                      const newVoucher = await response.json();
                      setVouchers([...vouchers, newVoucher]);
                      setShowCreateVoucherModal(false);
                      setVoucherForm({ code: '', discount: '', maxUses: '', expiryDate: '', sendTo: 'all', tier: 'Basic', emails: '' });
                    }
                  } catch (err) {
                    console.error('Failed to create voucher:', err);
                  }
                }}
                className="btn btn-primary flex-1"
              >
                Create & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6 max-w-2xl">
          <div className="card">
            <h2 className="section-title mb-6">System Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="form-label">Platform Name</label>
                <input
                  type="text"
                  className="form-input"
                  value="Marketing OS"
                  readOnly
                />
              </div>

              <div>
                <label className="form-label">Support Email</label>
                <input
                  type="email"
                  className="form-input"
                  value="support@marketingos.io"
                  readOnly
                />
              </div>

              <div>
                <label className="form-label">Default Currency</label>
                <select className="form-input">
                  <option>GBP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-[var(--text)]">
                    Maintenance Mode
                  </span>
                </label>
              </div>

              <div>
                <label className="form-label">Data Retention Period</label>
                <select className="form-input">
                  <option>6 months</option>
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>Indefinite</option>
                </select>
              </div>

              <div>
                <label className="form-label">Backup Frequency</label>
                <select className="form-input">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div>
                <label className="form-label">API Rate Limiting</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Requests per minute"
                  defaultValue="60"
                />
              </div>
            </div>
          </div>

          <button className="btn btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}
