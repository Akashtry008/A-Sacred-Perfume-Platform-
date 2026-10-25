import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { CreditCard, Search, CheckCircle2, Clock, AlertCircle, RefreshCw, ArrowUpRight } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error('Error loading payments:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = payments.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      q === '' ||
      p.orderNumber?.toLowerCase().includes(q) ||
      p.providerPaymentId?.toLowerCase().includes(q) ||
      p.customerName?.toLowerCase().includes(q) ||
      p.customerEmail?.toLowerCase().includes(q)
    );
  });

  const totalCaptured = payments
    .filter((p) => p.status === 'CAPTURED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
            Payments & Transaction Audits
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            Real-time reconciliation of Razorpay payments, UPI settlements, and COD orders.
          </p>
        </div>

        <button
          onClick={loadPayments}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
            Settled Volume
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#166534' }}>
            {formatPrice(totalCaptured)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '4px' }}>
            100% 256-bit TLS encrypted
          </div>
        </div>

        <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
            Total Transactions
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1C1917' }}>
            {payments.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B635B', marginTop: '4px' }}>
            Across all customer checkout sessions
          </div>
        </div>

        <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
            Payment Processor
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0C4A6E' }}>
            Razorpay PCI-DSS
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0284C7', marginTop: '4px' }}>
            Instant UPI & Cards gateway
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #EAE3D6',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#A8A29E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payment ID, order #, customer..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #D6D3D1',
              fontSize: '0.85rem',
            }}
          />
        </div>

        <div style={{ fontSize: '0.8125rem', color: '#78716C' }}>
          Showing <strong>{filtered.length}</strong> transactions
        </div>
      </div>

      {/* Transactions Table */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #EAE3D6',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#78716C' }}>
            <CreditCard size={40} color="#C8822A" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
              No transactions recorded yet
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              Completed orders from the storefront will automatically log payment records here.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF7F2', textAlign: 'left', borderBottom: '1px solid #EAE3D6' }}>
                  <th style={{ padding: '14px 16px' }}>Payment ID</th>
                  <th style={{ padding: '14px 16px' }}>Order #</th>
                  <th style={{ padding: '14px 16px' }}>Customer</th>
                  <th style={{ padding: '14px 16px' }}>Amount</th>
                  <th style={{ padding: '14px 16px' }}>Method</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pay) => (
                  <tr key={pay.id} style={{ borderBottom: '1px solid #F5F1EB' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#C8822A' }}>
                      {pay.providerPaymentId || pay.id}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      <Link href={`/admin/orders?search=${pay.orderNumber}`} style={{ color: '#1C1917', textDecoration: 'none' }}>
                        {pay.orderNumber}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1C1917' }}>{pay.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#78716C' }}>{pay.customerEmail}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#166534' }}>
                      {formatPrice(pay.amount)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#44403C' }}>
                      {pay.provider || 'RAZORPAY'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: 700,
                          backgroundColor: pay.status === 'CAPTURED' ? '#DCFCE7' : '#FEF3C7',
                          color: pay.status === 'CAPTURED' ? '#166534' : '#92400E',
                        }}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#78716C' }}>
                      {formatDate(pay.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
