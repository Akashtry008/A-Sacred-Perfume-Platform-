import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useParams } from 'react-router-dom';
import { db } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import { CheckCircle2, Truck, Package, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OrderConfirmationPage({ params }) {
  const routerParams = useParams();
  const orderNumber = params?.orderNumber || routerParams?.orderNumber;

  const [order, setOrder] = useState(() => db.getOrderByNumber(orderNumber));

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${orderNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch((e) => console.error('Error fetching order from FastAPI:', e));
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: '#6B635B', margin: '16px 0 24px' }}>We could not find the order details for #{orderNumber}.</p>
        <Link href="/" className="btn-primary">Return to Storefront</Link>
      </div>
    );
  }

  const items = order.items || [];
  const address = order.shippingAddress || {};

  return (
    <div style={{ padding: '48px 0 80px', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Success Banner */}
        <div
          style={{
            backgroundColor: '#FFF',
            borderRadius: '16px',
            border: '1px solid #EAE3D6',
            padding: '40px 32px',
            textAlign: 'center',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EAF4EE',
              color: '#1E5E3A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Sacred Order Confirmed
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', margin: '8px 0 12px', color: '#1C1917' }}>
            Thank You, {address.fullName || 'Devotee'}!
          </h1>
          <p style={{ color: '#6B635B', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 16px', lineHeight: 1.6 }}>
            Your sacred formulations are being carefully packed at our NCR Gaushala warehouse with pure devotion.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FAF7F2',
              border: '1px dashed #C8822A',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1C1917',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span>Order ID: {order.orderNumber}</span>
            {order.billId && (
              <span style={{ fontSize: '0.8rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 10px', borderRadius: '4px', fontWeight: 700 }}>
                Delivery Bill: {order.billId}
              </span>
            )}
          </div>
        </div>

        {/* Order Details Card */}
        <div
          style={{
            backgroundColor: '#FFF',
            borderRadius: '12px',
            border: '1px solid #EAE3D6',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', marginBottom: '16px' }}>
            Ordered Items
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #FAF7F2', paddingBottom: '12px' }}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80'}
                  alt={item.title}
                  style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#1C1917' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#6B635B', margin: '2px 0 0' }}>Quantity: {item.quantity}</p>
                </div>
                <div style={{ fontWeight: 700, color: '#1C1917' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #EAE3D6', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B635B' }}>
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal || order.total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B635B' }}>
              <span>Shipping:</span>
              <span>{order.shippingTotal === 0 ? 'FREE' : formatPrice(order.shippingTotal || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: '#C8822A', borderTop: '1px solid #EAE3D6', paddingTop: '8px', marginTop: '4px' }}>
              <span>Total Paid:</span>
              <span>{formatPrice(order.grandTotal || order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Live Tracking & Storefront */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            href={`/track-order?id=${encodeURIComponent(order.orderNumber)}`}
            className="btn btn-secondary"
            style={{
              padding: '14px 28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            <Truck size={18} color="#C8822A" />
            <span>Track Live Dispatch Status</span>
          </Link>
          <Link
            href="/"
            className="btn btn-primary"
            style={{
              padding: '14px 28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem',
            }}
          >
            <span>Continue Exploring Offerings</span> <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
