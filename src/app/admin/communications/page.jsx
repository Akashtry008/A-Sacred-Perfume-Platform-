import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Building2,
  Mail,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Phone,
  Download,
  Save,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Eye,
  Send,
  User,
  MapPin,
  Tag,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminCommunicationsPage() {
  const { showToast, showAlert } = useToast();
  const [activeTab, setActiveTab] = useState('contacts'); // contacts | wholesale | subscribers | policies
  const [isLoading, setIsLoading] = useState(true);

  // Auth Header helper
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vedapavitra_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('ALL');

  // Wholesale state
  const [wholesaleList, setWholesaleList] = useState([]);
  const [wholesaleSearch, setWholesaleSearch] = useState('');
  const [wholesaleStatusFilter, setWholesaleStatusFilter] = useState('ALL');

  // Subscribers state
  const [subscribers, setSubscribers] = useState([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Policies state
  const [policies, setPolicies] = useState({
    shippingPolicy: '',
    returnRefundPolicy: '',
    privacyPolicy: '',
    termsAndConditions: '',
  });
  const [activePolicyTab, setActivePolicyTab] = useState('shippingPolicy');
  const [isSavingPolicies, setIsSavingPolicies] = useState(false);

  // Fetch all communications data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const [inquiriesRes, subscribersRes, policiesRes] = await Promise.all([
        fetch('/api/admin/inquiries', { headers }),
        fetch('/api/admin/newsletter', { headers }),
        fetch('/api/admin/policies', { headers }),
      ]);

      if (inquiriesRes.ok) {
        const inqData = await inquiriesRes.json();
        const allInqs = inqData.inquiries || [];
        // Segregate contacts vs wholesale
        setContacts(allInqs.filter((item) => (item.type || '').toUpperCase() === 'CONTACT'));
        setWholesaleList(allInqs.filter((item) => (item.type || '').toLowerCase() === 'wholesale' || !item.type));
      }

      if (subscribersRes.ok) {
        const subData = await subscribersRes.json();
        setSubscribers(subData.subscribers || []);
      }

      if (policiesRes.ok) {
        const polData = await policiesRes.json();
        if (polData.policies) {
          setPolicies({
            shippingPolicy: polData.policies.shippingPolicy || '',
            returnRefundPolicy: polData.policies.returnRefundPolicy || '',
            privacyPolicy: polData.policies.privacyPolicy || '',
            termsAndConditions: polData.policies.termsAndConditions || '',
          });
        }
      }
    } catch (err) {
      console.error('Error loading communications:', err);
      showToast?.('Failed to load communications from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Inquiry Status
  const handleUpdateStatus = async (id, newStatus, isWholesale = false) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast?.(`Inquiry status updated to ${newStatus}`, 'success');
        if (isWholesale) {
          setWholesaleList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
          );
        } else {
          setContacts((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
          );
        }
      } else {
        showToast?.('Failed to update status', 'error');
      }
    } catch (err) {
      showToast?.('Network error updating status', 'error');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = (id, isWholesale = false) => {
    showAlert?.({
      title: 'Delete Inquiry Record?',
      message: 'Are you sure you wish to permanently delete this inquiry record? This action cannot be reversed.',
      type: 'warning',
      confirmText: 'Delete Record',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const headers = getAuthHeaders();
          const res = await fetch(`/api/admin/inquiries/${id}`, {
            method: 'DELETE',
            headers,
          });

          if (res.ok) {
            showToast?.('Inquiry record deleted', 'info');
            if (isWholesale) {
              setWholesaleList((prev) => prev.filter((item) => item.id !== id));
            } else {
              setContacts((prev) => prev.filter((item) => item.id !== id));
            }
          } else {
            showToast?.('Failed to delete inquiry', 'error');
          }
        } catch {
          showToast?.('Network error deleting inquiry', 'error');
        }
      },
    });
  };

  // Delete Subscriber
  const handleDeleteSubscriber = (identifier) => {
    showAlert?.({
      title: 'Remove Devotee Subscriber?',
      message: `Remove "${identifier}" from the VedaPavitra Spiritual Circle newsletter list?`,
      type: 'warning',
      confirmText: 'Remove',
      cancelText: 'Keep',
      onConfirm: async () => {
        try {
          const headers = getAuthHeaders();
          const res = await fetch(`/api/admin/newsletter/${identifier}`, {
            method: 'DELETE',
            headers,
          });

          if (res.ok) {
            showToast?.('Subscriber removed successfully', 'info');
            setSubscribers((prev) => prev.filter((s) => s.email !== identifier && s.id !== identifier));
          } else {
            showToast?.('Failed to remove subscriber', 'error');
          }
        } catch {
          showToast?.('Network error removing subscriber', 'error');
        }
      },
    });
  };

  // Export Subscribers to CSV
  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      showToast?.('No subscribers available to export', 'info');
      return;
    }
    const headers = 'Email,Subscription Date\n';
    const rows = subscribers
      .map((s) => `"${s.email}","${s.subscribedAt ? new Date(s.subscribedAt).toLocaleString() : ''}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VedaPavitra_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.('Devotee newsletter subscribers exported to CSV', 'success');
  };

  // Save Policies
  const handleSavePolicies = async (e) => {
    if (e) e.preventDefault();
    setIsSavingPolicies(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/admin/policies', {
        method: 'PUT',
        headers,
        body: JSON.stringify(policies),
      });

      if (res.ok) {
        showToast?.('Storefront legal policies updated and sanctified!', 'success');
      } else {
        const d = await res.json().catch(() => ({}));
        showToast?.(d.detail || 'Failed to save policies', 'error');
      }
    } catch {
      showToast?.('Network error while saving policies', 'error');
    } finally {
      setIsSavingPolicies(false);
    }
  };

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes(contactSearch.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(contactSearch.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(contactSearch.toLowerCase()) ||
      (c.message || '').toLowerCase().includes(contactSearch.toLowerCase());
    const matchesStatus = contactStatusFilter === 'ALL' || (c.status || 'NEW').toUpperCase() === contactStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered wholesale
  const filteredWholesale = wholesaleList.filter((w) => {
    const matchesSearch =
      (w.name || '').toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
      (w.organization || '').toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
      (w.email || '').toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
      (w.phone || '').toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
      (w.city || '').toLowerCase().includes(wholesaleSearch.toLowerCase());
    const matchesStatus = wholesaleStatusFilter === 'ALL' || (w.status || 'NEW').toUpperCase() === wholesaleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered subscribers
  const filteredSubscribers = subscribers.filter((s) =>
    (s.email || '').toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  return (
    <div style={{ padding: '24px 32px 80px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', backgroundColor: '#FAF0E4', padding: '4px 10px', borderRadius: '12px' }}>
              Operations & Devotee Relations
            </span>
          </div>
          <h1 className="heading-display" style={{ fontSize: '1.9rem', margin: '4px 0', color: '#1C1917' }}>
            Communications, Wholesale & Policies Hub
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.875rem', margin: 0 }}>
            Manage devotee contact inquiries, wholesale partnership proposals, newsletter subscribers, and legal terms.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: '#FFF',
              border: '1px solid #D6D3D1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#44403C',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #EAE3D6',
          marginBottom: '28px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.92rem',
            fontWeight: activeTab === 'contacts' ? 700 : 500,
            color: activeTab === 'contacts' ? '#C8822A' : '#78716C',
            borderBottom: activeTab === 'contacts' ? '2.5px solid #C8822A' : '2.5px solid transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <MessageSquare size={17} />
          <span>Contact Inquiries</span>
          <span style={{ fontSize: '0.72rem', backgroundColor: activeTab === 'contacts' ? '#FAF0E4' : '#F5F5F4', color: activeTab === 'contacts' ? '#C8822A' : '#78716C', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
            {contacts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wholesale')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.92rem',
            fontWeight: activeTab === 'wholesale' ? 700 : 500,
            color: activeTab === 'wholesale' ? '#C8822A' : '#78716C',
            borderBottom: activeTab === 'wholesale' ? '2.5px solid #C8822A' : '2.5px solid transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <Building2 size={17} />
          <span>Wholesale & B2B Proposals</span>
          <span style={{ fontSize: '0.72rem', backgroundColor: activeTab === 'wholesale' ? '#FAF0E4' : '#F5F5F4', color: activeTab === 'wholesale' ? '#C8822A' : '#78716C', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
            {wholesaleList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscribers')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.92rem',
            fontWeight: activeTab === 'subscribers' ? 700 : 500,
            color: activeTab === 'subscribers' ? '#C8822A' : '#78716C',
            borderBottom: activeTab === 'subscribers' ? '2.5px solid #C8822A' : '2.5px solid transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <Mail size={17} />
          <span>Devotee Circle Subscribers</span>
          <span style={{ fontSize: '0.72rem', backgroundColor: activeTab === 'subscribers' ? '#FAF0E4' : '#F5F5F4', color: activeTab === 'subscribers' ? '#C8822A' : '#78716C', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
            {subscribers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.92rem',
            fontWeight: activeTab === 'policies' ? 700 : 500,
            color: activeTab === 'policies' ? '#C8822A' : '#78716C',
            borderBottom: activeTab === 'policies' ? '2.5px solid #C8822A' : '2.5px solid transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          <FileText size={17} />
          <span>Legal & Sanctum Policies Editor</span>
        </button>
      </div>

      {/* TAB 1: CONTACT INQUIRIES */}
      {activeTab === 'contacts' && (
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 320px' }}>
              <Search size={16} color="#78716C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by devotee name, email, phone, or question..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.875rem',
                  backgroundColor: '#FFF',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.825rem', color: '#6B635B', fontWeight: 600 }}>Filter Status:</span>
              {['ALL', 'NEW', 'IN_REVIEW', 'RESOLVED'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setContactStatusFilter(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: contactStatusFilter === status ? '#C8822A' : '#E5E5E5',
                    backgroundColor: contactStatusFilter === status ? '#FAF0E4' : '#FFF',
                    color: contactStatusFilter === status ? '#C8822A' : '#78716C',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Inquiries Cards */}
          {filteredContacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6' }}>
              <MessageSquare size={36} color="#D6D3D1" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#44403C', margin: '0 0 6px' }}>No contact inquiries found</h3>
              <p style={{ color: '#78716C', fontSize: '0.875rem', margin: 0 }}>
                {contactSearch ? 'Try a different search term or clear the filter.' : 'Devotee messages submitted from the Contact page will appear here.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {filteredContacts.map((inq) => {
                const status = (inq.status || 'NEW').toUpperCase();
                const statusBg = status === 'RESOLVED' ? '#DCFCE7' : status === 'IN_REVIEW' ? '#FEF3C7' : '#EFF6FF';
                const statusColor = status === 'RESOLVED' ? '#15803D' : status === 'IN_REVIEW' ? '#B45309' : '#1D4ED8';

                return (
                  <div
                    key={inq.id}
                    style={{
                      backgroundColor: '#FFF',
                      borderRadius: '12px',
                      border: '1px solid #EAE3D6',
                      padding: '20px 24px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1C1917' }}>
                            {inq.name || 'Anonymous Devotee'}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '10px', backgroundColor: statusBg, color: statusColor }}>
                            {status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#78716C', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} />
                            {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.825rem', color: '#6B635B' }}>
                          {inq.email && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <Mail size={14} color="#C8822A" />
                              <a href={`mailto:${inq.email}`} style={{ color: '#C8822A', textDecoration: 'none' }}>
                                {inq.email}
                              </a>
                            </span>
                          )}
                          {inq.phone && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <Phone size={14} color="#15803D" />
                              <a href={`tel:${inq.phone}`} style={{ color: '#44403C', textDecoration: 'none' }}>
                                {inq.phone}
                              </a>
                            </span>
                          )}
                          {inq.subject && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                              <Tag size={14} color="#78716C" />
                              Subject: {inq.subject}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status and Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {status !== 'RESOLVED' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(inq.id, 'RESOLVED')}
                            style={{
                              padding: '7px 12px',
                              backgroundColor: '#DCFCE7',
                              border: '1px solid #BBF7D0',
                              color: '#15803D',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Mark Resolved</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(inq.id, 'NEW')}
                            style={{
                              padding: '7px 12px',
                              backgroundColor: '#F5F5F4',
                              border: '1px solid #D6D3D1',
                              color: '#57534E',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Reopen
                          </button>
                        )}

                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${inq.name || 'Devotee'}, thank you for contacting VedaPavitra. We are replying to your inquiry: "${inq.message?.slice(0, 50)}..."`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '7px 12px',
                              backgroundColor: '#25D366',
                              color: '#FFF',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id, false)}
                          style={{
                            padding: '7px 10px',
                            backgroundColor: '#FFF',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div
                      style={{
                        backgroundColor: '#FAF7F2',
                        borderRadius: '8px',
                        padding: '14px 18px',
                        fontSize: '0.9rem',
                        color: '#292524',
                        lineHeight: 1.6,
                        borderLeft: '3px solid #C8822A',
                      }}
                    >
                      {inq.message || 'No additional message provided.'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WHOLESALE & B2B PROPOSALS */}
      {activeTab === 'wholesale' && (
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 320px' }}>
              <Search size={16} color="#78716C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by organization, temple name, city, email..."
                value={wholesaleSearch}
                onChange={(e) => setWholesaleSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.875rem',
                  backgroundColor: '#FFF',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.825rem', color: '#6B635B', fontWeight: 600 }}>Filter Status:</span>
              {['ALL', 'NEW', 'IN_REVIEW', 'RESOLVED'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setWholesaleStatusFilter(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: wholesaleStatusFilter === status ? '#C8822A' : '#E5E5E5',
                    backgroundColor: wholesaleStatusFilter === status ? '#FAF0E4' : '#FFF',
                    color: wholesaleStatusFilter === status ? '#C8822A' : '#78716C',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredWholesale.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6' }}>
              <Building2 size={36} color="#D6D3D1" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#44403C', margin: '0 0 6px' }}>No wholesale inquiries found</h3>
              <p style={{ color: '#78716C', fontSize: '0.875rem', margin: 0 }}>
                {wholesaleSearch ? 'Try a different search query.' : 'Temple trusts, ashrams, and distributors who submit the Wholesale form will appear here.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {filteredWholesale.map((w) => {
                const status = (w.status || 'NEW').toUpperCase();
                const statusBg = status === 'RESOLVED' ? '#DCFCE7' : status === 'IN_REVIEW' ? '#FEF3C7' : '#EFF6FF';
                const statusColor = status === 'RESOLVED' ? '#15803D' : status === 'IN_REVIEW' ? '#B45309' : '#1D4ED8';

                return (
                  <div
                    key={w.id}
                    style={{
                      backgroundColor: '#FFF',
                      borderRadius: '12px',
                      border: '1px solid #EAE3D6',
                      padding: '22px 26px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1C1917' }}>
                            {w.organization || w.name || 'Commercial Devotee'}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '10px', backgroundColor: statusBg, color: statusColor }}>
                            {status}
                          </span>
                          {w.businessType && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#FAF0E4', color: '#C8822A' }}>
                              {w.businessType}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.835rem', color: '#6B635B', marginTop: '6px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <User size={14} color="#78716C" />
                            <strong>Contact:</strong> {w.name || 'N/A'}
                          </span>
                          {w.email && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <Mail size={14} color="#C8822A" />
                              <a href={`mailto:${w.email}`} style={{ color: '#C8822A', textDecoration: 'none' }}>
                                {w.email}
                              </a>
                            </span>
                          )}
                          {w.phone && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <Phone size={14} color="#15803D" />
                              <a href={`tel:${w.phone}`} style={{ color: '#1C1917', textDecoration: 'none', fontWeight: 600 }}>
                                {w.phone}
                              </a>
                            </span>
                          )}
                          {(w.city || w.state) && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <MapPin size={14} color="#78716C" />
                              {[w.city, w.state].filter(Boolean).join(', ')}
                            </span>
                          )}
                          {w.estimatedMonthlySpend && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#9B3828', fontWeight: 700 }}>
                              Est. Monthly Volume: {w.estimatedMonthlySpend}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {status !== 'RESOLVED' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(w.id, 'RESOLVED', true)}
                            style={{
                              padding: '7px 14px',
                              backgroundColor: '#DCFCE7',
                              border: '1px solid #BBF7D0',
                              color: '#15803D',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve / Close</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(w.id, 'NEW', true)}
                            style={{
                              padding: '7px 12px',
                              backgroundColor: '#F5F5F4',
                              border: '1px solid #D6D3D1',
                              color: '#57534E',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Reopen
                          </button>
                        )}

                        {w.phone && (
                          <a
                            href={`https://wa.me/${w.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${w.name || w.organization}, thank you for your wholesale inquiry with VedaPavitra. Our Seva coordinator is pleased to assist your bulk order.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '7px 12px',
                              backgroundColor: '#25D366',
                              color: '#FFF',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <MessageSquare size={14} />
                            <span>B2B WhatsApp</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(w.id, true)}
                          style={{
                            padding: '7px 10px',
                            backgroundColor: '#FFF',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          title="Delete Proposal"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Requirements / Remarks */}
                    <div
                      style={{
                        backgroundColor: '#FAF7F2',
                        borderRadius: '8px',
                        padding: '14px 18px',
                        fontSize: '0.9rem',
                        color: '#292524',
                        lineHeight: 1.6,
                        borderLeft: '3px solid #9B3828',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', color: '#9B3828', marginBottom: '4px' }}>
                        Sacred Requirements & Details:
                      </strong>
                      {w.message || 'No specific notes mentioned.'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEVOTEE CIRCLE NEWSLETTER SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 320px' }}>
              <Search size={16} color="#78716C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search subscriber email address..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.875rem',
                  backgroundColor: '#FFF',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleExportSubscribersCSV}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#1C1917',
                  color: '#FAF7F2',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Download size={15} />
                <span>Export CSV ({filteredSubscribers.length})</span>
              </button>
            </div>
          </div>

          {filteredSubscribers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6' }}>
              <Mail size={36} color="#D6D3D1" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#44403C', margin: '0 0 6px' }}>No newsletter subscribers found</h3>
              <p style={{ color: '#78716C', fontSize: '0.875rem', margin: 0 }}>
                Devotees who enter their email in the footer or newsletter popups will be automatically listed here.
              </p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D6', color: '#6B635B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 20px' }}>#</th>
                    <th style={{ padding: '14px 20px' }}>Devotee Email</th>
                    <th style={{ padding: '14px 20px' }}>Subscription Date</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((sub, idx) => (
                    <tr key={sub.id || sub.email} style={{ borderBottom: '1px solid #F5F5F4' }}>
                      <td style={{ padding: '14px 20px', color: '#A8A29E', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#1C1917' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={15} color="#C8822A" />
                          {sub.email}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#6B635B' }}>
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '0.72rem', backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>
                          ACTIVE SUBSCRIBER
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubscriber(sub.email)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#FFF',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LEGAL & SANCTUM POLICIES EDITOR */}
      {activeTab === 'policies' && (
        <div>
          {/* Policy Sub-Tabs and Save Button */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'shippingPolicy', label: 'Shipping & Delivery Policy', path: '/pages/shipping-policy' },
                { key: 'returnRefundPolicy', label: 'Return & Refund Policy', path: '/pages/return-refund-policy' },
                { key: 'privacyPolicy', label: 'Privacy Policy', path: '/pages/privacy-policy' },
                { key: 'termsAndConditions', label: 'Terms & Conditions', path: '/pages/terms-and-conditions' },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setActivePolicyTab(p.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1.5px solid',
                    borderColor: activePolicyTab === p.key ? '#C8822A' : '#E5E5E5',
                    backgroundColor: activePolicyTab === p.key ? '#FAF0E4' : '#FFF',
                    color: activePolicyTab === p.key ? '#C8822A' : '#57534E',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleSavePolicies}
                disabled={isSavingPolicies}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#C8822A',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: isSavingPolicies ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(200, 130, 42, 0.35)',
                }}
              >
                <Save size={16} />
                <span>{isSavingPolicies ? 'Sanctifying & Saving...' : 'Save All Policies'}</span>
              </button>
            </div>
          </div>

          {/* Two-Column Editor: Markdown Input vs Real-time HTML Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
            {/* Left: Policy Content Editor */}
            <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', textTransform: 'uppercase' }}>
                  Markdown & Text Editor
                </span>
                <span style={{ fontSize: '0.75rem', color: '#78716C' }}>
                  Supports Markdown headings, lists, and bold text
                </span>
              </div>

              <textarea
                rows={22}
                value={policies[activePolicyTab] || ''}
                onChange={(e) => setPolicies({ ...policies, [activePolicyTab]: e.target.value })}
                placeholder="Enter policy terms, legal clauses, dispatch rules..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Right: Live Preview Panel */}
            <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>
                  Storefront Devotee View (Live Preview)
                </span>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  Real-time
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #EAE3D6',
                  borderRadius: '8px',
                  padding: '24px',
                  flex: 1,
                  overflowY: 'auto',
                  maxHeight: '520px',
                  lineHeight: 1.7,
                  color: '#292524',
                  fontSize: '0.92rem',
                }}
              >
                <div style={{ marginBottom: '16px', borderBottom: '1px solid #E8D5BF', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8822A', fontWeight: 700 }}>
                    Official Policy Document
                  </span>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', margin: '4px 0 0', color: '#1C1917' }}>
                    {activePolicyTab === 'shippingPolicy' && 'Shipping & Delivery Policy'}
                    {activePolicyTab === 'returnRefundPolicy' && 'Sanctity Guarantee & Return/Refund Policy'}
                    {activePolicyTab === 'privacyPolicy' && 'Devotee Privacy & Security Policy'}
                    {activePolicyTab === 'termsAndConditions' && 'Terms of Service & Devotional Commerce Ethics'}
                  </h2>
                </div>

                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {policies[activePolicyTab] || 'No content written yet. Begin typing in the editor on the left.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
