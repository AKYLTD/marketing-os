'use client';

import { useState } from 'react';
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

const mockCRMContacts: CRMContact[] = [
  {
    id: '1',
    name: 'TechStart Inc',
    company: 'Technology',
    email: 'hello@techstart.io',
    status: 'Lead',
    value: 0,
    lastContact: '2025-02-10',
    nextAction: 'Send proposal',
  },
  {
    id: '2',
    name: 'FashionBrand Co',
    company: 'Fashion',
    email: 'info@fashionbrand.com',
    status: 'Active',
    value: 2500,
    lastContact: '2025-02-14',
    nextAction: 'Monthly review',
  },
  {
    id: '3',
    name: 'HealthFood Ltd',
    company: 'Food & Beverage',
    email: 'contact@healthfood.co.uk',
    status: 'At Risk',
    value: 1500,
    lastContact: '2024-12-20',
    nextAction: 'Retention call',
  },
  {
    id: '4',
    name: 'EcoClean Supply',
    company: 'Cleaning Products',
    email: 'sales@ecoclean.com',
    status: 'Churned',
    value: 0,
    lastContact: '2024-11-15',
    nextAction: 'Win-back campaign',
  },
  {
    id: '5',
    name: 'CoffeeRoasters',
    company: 'Food & Beverage',
    email: 'marketing@coffeeroasters.co',
    status: 'Active',
    value: 3200,
    lastContact: '2025-02-12',
    nextAction: 'Upsell consultation',
  },
  {
    id: '6',
    name: 'BeautyBox Studios',
    company: 'Beauty',
    email: 'hello@beautybox.com',
    status: 'Lead',
    value: 0,
    lastContact: '2025-02-08',
    nextAction: 'Demo scheduled',
  },
  {
    id: '7',
    name: 'LocalBakeries Network',
    company: 'Food & Beverage',
    email: 'network@localbakeries.co.uk',
    status: 'Active',
    value: 4100,
    lastContact: '2025-02-14',
    nextAction: 'Quarterly check-in',
  },
  {
    id: '8',
    name: 'FitnessPro Coaching',
    company: 'Fitness',
    email: 'info@fitnesspro.io',
    status: 'At Risk',
    value: 1800,
    lastContact: '2024-12-30',
    nextAction: 'Feature walkthrough',
  },
  {
    id: '9',
    name: 'DesignStudio Collective',
    company: 'Design',
    email: 'contact@designstudio.co',
    status: 'Lead',
    value: 0,
    lastContact: '2025-02-05',
    nextAction: 'Follow-up email',
  },
  {
    id: '10',
    name: 'OrganicGroceries',
    company: 'Retail',
    email: 'hello@organicgroceries.com',
    status: 'Active',
    value: 2800,
    lastContact: '2025-02-13',
    nextAction: 'Renewal negotiation',
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

  const filteredUsers = mockUsers.filter((user) =>
    userFilter === 'All' ? true : user.tier === userFilter
  );

  const filteredContacts = mockCRMContacts.filter((contact) =>
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
                  User Details: {mockUsers.find((u) => u.id === expandedUser)?.name}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text2)]">
                  <div>
                    <p>Last Active: {mockUsers.find((u) => u.id === expandedUser)?.lastActive}</p>
                  </div>
                  <div>
                    <p>Member Since: {mockUsers.find((u) => u.id === expandedUser)?.joined}</p>
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
                        setExpandedContact(
                          expandedContact === contact.id ? null : contact.id
                        )
                      }
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        {contact.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {contact.company}
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
            {expandedContact && (
              <div className="mt-4 p-4 bg-[var(--bg2)] rounded-lg">
                {(() => {
                  const contact = mockCRMContacts.find(
                    (c) => c.id === expandedContact
                  );
                  return contact ? (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-[var(--text)]">
                            {contact.name}
                          </p>
                          <p className="text-xs text-[var(--text2)]">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-[var(--text2)]">
                            Next Action
                          </p>
                          <p className="text-[var(--text)]">
                            {contact.nextAction}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text2)]">
                            Value
                          </p>
                          <p className="text-[var(--text)]">£{contact.value}</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
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
            <button className="btn btn-primary mb-6">
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockVouchers.map((voucher) => (
                    <tr
                      key={voucher.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--bg2)]"
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
                      <td className="px-4 py-3 text-[var(--text)]">
                        {voucher.usedCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text2)]">
                        {voucher.expiry}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`tag ${voucher.active ? 'tag-green' : 'tag-red'}`}
                        >
                          {voucher.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="btn btn-secondary btn-sm">
                          <Trash2 size={14} />
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
