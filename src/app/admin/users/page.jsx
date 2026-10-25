import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  Eye,
  X,
  MapPin,
  Search,
  Trash2,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  ShoppingBag,
  RefreshCw,
  UserCheck,
  Laptop,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Devotee Dossier & Security Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDossierLoading, setIsDossierLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('security'); // 'security' | 'activities' | 'orders'

  // Admin Password Reset State
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      showToast?.('Error loading devotees list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDossier = async (user) => {
    setSelectedUser(user);
    setIsDossierLoading(true);
    setUserOrders([]);
    setUserActivities([]);
    setNewPasswordInput('');
    setActiveTab('security');

    try {
      const res = await fetch(`/api/admin/users/${user.id}/details`);
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data.orders || []);
        setUserActivities(data.activities || []);
        if (data.user) {
          setSelectedUser((prev) => ({ ...prev, ...data.user }));
        }
      }
    } catch (err) {
      showToast?.('Failed to load activity timeline', 'error');
    } finally {
      setIsDossierLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    setIsUpdatingSecurity(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast?.(`Account status changed to ${newStatus}`, 'success');
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        throw new Error('Failed to update status');
      }
    } catch (e) {
      showToast?.(e.message, 'error');
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setIsUpdatingSecurity(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        showToast?.(`Role updated to ${newRole}`, 'success');
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => ({ ...prev, role: newRole }));
        }
      }
    } catch (e) {
      showToast?.('Failed to update role', 'error');
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const handleResetPassword = async (userId) => {
    if (!newPasswordInput || newPasswordInput.length < 6) {
      showToast?.('Password must be at least 6 characters', 'error');
      return;
    }
    setIsUpdatingSecurity(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordInput }),
      });
      if (res.ok) {
        showToast?.('Devotee password successfully updated!', 'success');
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: newPasswordInput } : u)));
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) => ({ ...prev, password: newPasswordInput }));
        }
        setNewPasswordInput('');
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (e) {
      showToast?.(e.message, 'error');
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Permanently delete account for ${email}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast?.(`User ${email} permanently removed.`, 'success');
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (selectedUser?.id === userId) setSelectedUser(null);
      }
    } catch (e) {
      showToast?.('Failed to delete user', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (u.email || '').toLowerCase().includes(q) ||
      (u.firstName || '').toLowerCase().includes(q) ||
      (u.lastName || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.lastDevice || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || (u.status || 'ACTIVE') === statusFilter;
    const matchesRole = roleFilter === 'ALL' || (u.role || 'CUSTOMER') === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1340px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C8822A', fontWeight: 700 }}>
              Security & Identity Console
            </span>
            <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
              {users.length} Registered Accounts
            </span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
            Devotees, Logged-in Devices & Activity Logs
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            Inspect devotee login sessions, devices, IP locations, platform activities, audit passwords, and manage account security.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={15} /> Refresh Accounts
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #EAE3D6',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#948A7F" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search by devotee name, email, phone, or device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #D6CEBE',
              fontSize: '0.85rem',
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#78716C', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #D6CEBE', fontSize: '0.85rem', backgroundColor: '#FFF' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {/* Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#78716C', fontWeight: 600 }}>Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #D6CEBE', fontSize: '0.85rem', backgroundColor: '#FFF' }}
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Devotee (Customer)</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>
      </div>

      {/* Devotees Table */}
      {isLoading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#C8822A', fontSize: '0.9rem' }}>
          Loading registered accounts and device footprints from MongoDB...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ padding: '48px 24px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', textAlign: 'center' }}>
          <Users size={36} color="#A8A29E" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            No devotee accounts matching current filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1.5px solid #EAE3D6',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1.5px solid #EAE3D6', color: '#44403C' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Devotee Name</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Email Address</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Role & Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Device Logged In & IP</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Password (Audit)</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Orders Placed</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Security Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => {
                  const status = u.status || 'ACTIVE';
                  const isSuspended = status === 'SUSPENDED';
                  const isBlocked = status === 'BLOCKED';
                  const isMobile = (u.lastDevice || '').toLowerCase().includes('mobile') || (u.lastDevice || '').toLowerCase().includes('iphone') || (u.lastDevice || '').toLowerCase().includes('android');

                  return (
                    <tr
                      key={u.id || i}
                      style={{
                        borderBottom: '1px solid #F5F1E8',
                        backgroundColor: i % 2 === 0 ? '#FFF' : '#FCFAF7',
                      }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: '#1C1917' }}>
                          {u.firstName} {u.lastName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#78716C' }}>
                          ID: {u.id}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', color: '#44403C' }}>
                        <div>{u.email}</div>
                        {u.phone && <div style={{ fontSize: '0.72rem', color: '#78716C' }}>+91 {u.phone}</div>}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: u.role === 'ADMIN' ? '#FAF0E4' : '#F3F4F6',
                              color: u.role === 'ADMIN' ? '#9B3828' : '#374151',
                              width: 'fit-content',
                            }}
                          >
                            {u.role === 'ADMIN' ? '👑 ADMIN' : 'DEVOTEE'}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: isBlocked ? '#FEE2E2' : isSuspended ? '#FEF3C7' : '#DCFCE7',
                              color: isBlocked ? '#991B1B' : isSuspended ? '#92400E' : '#166534',
                              width: 'fit-content',
                            }}
                          >
                            {status}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1C1917', fontWeight: 500 }}>
                          {isMobile ? <Smartphone size={15} color="#C8822A" /> : <Laptop size={15} color="#C8822A" />}
                          <span style={{ fontSize: '0.8rem' }}>{u.lastDevice || 'Chrome on Windows (Desktop)'}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#78716C', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Globe size={11} /> IP: {u.lastLoginIp || '127.0.0.1 (Local)'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#B45309' }}>
                        <span
                          style={{
                            backgroundColor: '#FEF3C7',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          {u.password || 'vedic123'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            backgroundColor: '#F3F4F6',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            color: '#374151',
                          }}
                        >
                          {u.ordersCount || 0} orders
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleOpenDossier(u)}
                            className="btn btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="View Activity Dossier & Security"
                          >
                            <Eye size={13} /> Dossier
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #FCA5A5',
                              backgroundColor: '#FEF2F2',
                              color: '#991B1B',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                            title="Delete User Account"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* DEVOTEE ACTIVITY & SECURITY DOSSIER MODAL */}
      {/* ============================================================================== */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(28, 25, 23, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedUser(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              border: '1.5px solid #C8822A',
              boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#1C1917',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(200, 130, 42, 0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', color: '#FAF7F2', fontSize: '1.35rem', margin: 0 }}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: selectedUser.role === 'ADMIN' ? '#9B3828' : '#C8822A',
                      color: '#FFF',
                    }}
                  >
                    {selectedUser.role}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#D4C9B8', marginTop: '4px' }}>
                  {selectedUser.email} • ID: {selectedUser.id}
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #EAE3D6', backgroundColor: '#FAF9F6' }}>
              <button
                onClick={() => setActiveTab('security')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  backgroundColor: activeTab === 'security' ? '#FFF' : 'transparent',
                  fontWeight: activeTab === 'security' ? 700 : 500,
                  color: activeTab === 'security' ? '#C8822A' : '#78716C',
                  borderBottom: activeTab === 'security' ? '2px solid #C8822A' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <ShieldCheck size={16} /> Security & Devices
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  backgroundColor: activeTab === 'activities' ? '#FFF' : 'transparent',
                  fontWeight: activeTab === 'activities' ? 700 : 500,
                  color: activeTab === 'activities' ? '#C8822A' : '#78716C',
                  borderBottom: activeTab === 'activities' ? '2px solid #C8822A' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Clock size={16} /> Activity Timeline ({userActivities.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  backgroundColor: activeTab === 'orders' ? '#FFF' : 'transparent',
                  fontWeight: activeTab === 'orders' ? 700 : 500,
                  color: activeTab === 'orders' ? '#C8822A' : '#78716C',
                  borderBottom: activeTab === 'orders' ? '2px solid #C8822A' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <ShoppingBag size={16} /> Devotee Orders ({userOrders.length})
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: SECURITY & DEVICES */}
              {activeTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Logged in Device Info Box */}
                  <div style={{ backgroundColor: '#FAF7F2', padding: '18px', borderRadius: '12px', border: '1px solid #EAE3D6' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Laptop size={16} color="#C8822A" /> Current Device & Network Footprint
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#78716C' }}>Logged In Device</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1917' }}>
                          {selectedUser.lastDevice || 'Chrome 124 on Windows 11 (Desktop)'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#78716C' }}>Last Active IP Address</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1917' }}>
                          {selectedUser.lastLoginIp || '127.0.0.1 (Localhost / Wi-Fi)'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#78716C' }}>Last Login Timestamp</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1917' }}>
                          {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString('en-IN') : 'Recent'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Status & Role Controls */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #EAE3D6', backgroundColor: '#FFF' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#44403C', marginBottom: '8px' }}>
                        Account Security Status
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedUser.id, 'ACTIVE')}
                          disabled={isUpdatingSecurity || selectedUser.status === 'ACTIVE'}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #86EFAC',
                            backgroundColor: selectedUser.status === 'ACTIVE' ? '#DCFCE7' : '#FFF',
                            color: '#166534',
                            cursor: 'pointer',
                          }}
                        >
                          ✓ Active
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedUser.id, 'SUSPENDED')}
                          disabled={isUpdatingSecurity || selectedUser.status === 'SUSPENDED'}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #FDE68A',
                            backgroundColor: selectedUser.status === 'SUSPENDED' ? '#FEF3C7' : '#FFF',
                            color: '#92400E',
                            cursor: 'pointer',
                          }}
                        >
                          Suspend
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedUser.id, 'BLOCKED')}
                          disabled={isUpdatingSecurity || selectedUser.status === 'BLOCKED'}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #FCA5A5',
                            backgroundColor: selectedUser.status === 'BLOCKED' ? '#FEE2E2' : '#FFF',
                            color: '#991B1B',
                            cursor: 'pointer',
                          }}
                        >
                          Block
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #EAE3D6', backgroundColor: '#FFF' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#44403C', marginBottom: '8px' }}>
                        Platform Role Privileges
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleUpdateRole(selectedUser.id, 'CUSTOMER')}
                          disabled={isUpdatingSecurity || selectedUser.role === 'CUSTOMER'}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: selectedUser.role === 'CUSTOMER' ? '#F3F4F6' : '#FFF',
                            color: '#374151',
                            cursor: 'pointer',
                          }}
                        >
                          Devotee (Customer)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateRole(selectedUser.id, 'ADMIN')}
                          disabled={isUpdatingSecurity || selectedUser.role === 'ADMIN'}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #F3DFC1',
                            backgroundColor: selectedUser.role === 'ADMIN' ? '#FAF0E4' : '#FFF',
                            color: '#9B3828',
                            cursor: 'pointer',
                          }}
                        >
                          👑 Store Admin
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Reset Section */}
                  <div style={{ padding: '18px', borderRadius: '10px', border: '1px solid #EAE3D6', backgroundColor: '#FFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#44403C', margin: 0 }}>
                        Current Password (Audit) & Password Reset
                      </label>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                        Current: {selectedUser.password || 'vedic123'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Enter new password (min 6 chars)..."
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleResetPassword(selectedUser.id)}
                        disabled={isUpdatingSecurity || !newPasswordInput}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVITIES TIMELINE */}
              {activeTab === 'activities' && (
                <div>
                  {isDossierLoading ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#C8822A' }}>Loading activity logs...</div>
                  ) : userActivities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#78716C' }}>No activity records found for this account.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {userActivities.map((act, i) => (
                        <div
                          key={act.id || i}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #EAE3D6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.82rem',
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 700, color: '#C8822A', marginRight: '8px' }}>
                              [{act.action}]
                            </span>
                            <span style={{ color: '#292524' }}>{act.description}</span>
                          </div>
                          <span style={{ color: '#8C827A', fontSize: '0.75rem', flexShrink: 0, marginLeft: '12px' }}>
                            {act.timestamp ? new Date(act.timestamp).toLocaleString('en-IN') : 'Recent'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeTab === 'orders' && (
                <div>
                  {userOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#78716C' }}>No orders placed yet by this devotee.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {userOrders.map((ord) => (
                        <div
                          key={ord.id || ord.orderNumber}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '8px',
                            border: '1px solid #EAE3D6',
                            backgroundColor: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.85rem',
                          }}
                        >
                          <div>
                            <strong style={{ color: '#1C1917' }}>{ord.orderNumber}</strong>
                            <div style={{ color: '#6B635B', fontSize: '0.78rem', marginTop: '2px' }}>
                              Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')} • {ord.items?.length || 1} items • ₹{ord.total}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '4px',
                              backgroundColor: ord.fulfillmentStatus === 'DELIVERED' ? '#DCFCE7' : '#FEF3C7',
                              color: ord.fulfillmentStatus === 'DELIVERED' ? '#166534' : '#B45309',
                            }}
                          >
                            {ord.fulfillmentStatus || ord.status || 'PAID'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
