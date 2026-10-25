import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { db } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, Truck, ArrowRight, FileText } from 'lucide-react';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState(() => db.getOrders() || []);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((e) => console.log('Error fetching user orders:', e));
  }, []);

  return (
    <div style={{ padding: '36px 0 80px', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt;{' '}
          <Link href="/account" style={{ color: '#1C1917' }}>My Account</Link> &gt;{' '}
          <span>Orders</span>
        </div>

        <h1 className="heading-display" style={{ fontSize: '2.25rem', marginBottom: '28px' }}>
          Your Sacred Orders ({orders.length})
        </h1>

        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '64px 20px',
              textAlign: 'center',
            }}
          >
            <Package size={48} color="#D4C5B3" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
              No orders placed yet
            </h3>
            <p style={{ color: '#6B635B', marginBottom: '24px' }}>
              When you purchase sacred samagri, your order history and live tracking will appear here.
            </p>
            <Link href="/collections" className="btn-primary">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  backgroundColor: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #F0EAE1',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#6B635B', textTransform: 'uppercase' }}>
                      Order Placed: {formatDate(ord.createdAt)}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{ord.orderNumber}</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        backgroundColor: '#EAF4EE',
                        color: '#1E5E3A',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                      }}
                    >
                      {ord.status}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#C8822A' }}>
                      {formatPrice(ord.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Tracking row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FAF8F5',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '0.875rem',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#44403C', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={16} color="#C8822A" />
                      <span>Courier: <strong>{ord.shippingCourier || 'Delhivery Express'}</strong></span>
                    </div>
                    {ord.trackingNumber && (
                      <span>• AWB: <strong>{ord.trackingNumber}</strong></span>
                    )}
                    {ord.billId && (
                      <span style={{ fontSize: '0.75rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={12} /> Bill: {ord.billId}
                      </span>
                    )}
                  </div>

                  {ord.trackingUrl && (
                    <a
                      href={ord.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'underline', fontSize: '0.8125rem' }}
                    >
                      Live Tracking
                    </a>
                  )}
                </div>

                {/* Items snapshot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ord.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span>
                        {item.productTitle} — <span style={{ color: '#6B635B' }}>{item.variantTitle} × {item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
