import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2, Gift, Percent, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminPromotionsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    value: 15,
    minCartValue: 499,
    maxDiscount: 200,
    description: '',
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await fetch('/api/admin/promotions/list');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.log('Error loading coupons:', e);
    }
  };

  const handleToggleCoupon = async (couponId, currentStatus) => {
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: couponId,
          updates: { isActive: !currentStatus },
        }),
      });

      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === couponId ? { ...c, isActive: !currentStatus } : c))
        );
        showToast?.('Coupon status updated', 'success');
      }
    } catch (e) {
      showToast?.('Failed to toggle coupon', 'error');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon');

      showToast?.(`Coupon ${newCoupon.code.toUpperCase()} created successfully!`, 'success');
      setCoupons((prev) => [data.coupon, ...prev]);
      setIsCreating(false);
      setNewCoupon({
        code: '',
        discountType: 'PERCENTAGE',
        value: 15,
        minCartValue: 499,
        maxDiscount: 200,
        description: '',
      });
    } catch (err) {
      showToast?.(err.message || 'Error creating coupon', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
            Promotions, Coupons & Tiered Gifts
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            Configure checkout discount codes and manage automated free gift threshold rules.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> {isCreating ? 'Cancel' : 'Create New Coupon'}
        </button>
      </div>

      {/* Create Coupon Drawer / Card */}
      {isCreating && (
        <div
          style={{
            backgroundColor: '#FFF',
            border: '2px solid #C8822A',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#1C1917', marginBottom: '16px' }}>
            New Promotional Coupon
          </h2>
          <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI25"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Discount Type
                </label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                    backgroundColor: '#FFF',
                  }}
                >
                  <option value="PERCENTAGE">Percentage (%) Off</option>
                  <option value="FIXED_AMOUNT">Flat Amount (₹) Off</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Discount Value *
                </label>
                <input
                  type="number"
                  required
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Min Cart Value (₹)
                </label>
                <input
                  type="number"
                  value={newCoupon.minCartValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minCartValue: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Max Cap Discount (₹)
                </label>
                <input
                  type="number"
                  value={newCoupon.maxDiscount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                Description / Purpose
              </label>
              <input
                type="text"
                placeholder="e.g. Special festival coupon for Instagram community"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #D6D3D1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                Save & Activate Coupon
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Coupons Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '16px' }}>
          Discount Coupons ({coupons.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      color: '#C8822A',
                      backgroundColor: '#FAF0E4',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleToggleCoupon(coupon.id, coupon.isActive)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: coupon.isActive ? '#DCFCE7' : '#F5F5F4',
                      color: coupon.isActive ? '#166534' : '#78716C',
                    }}
                  >
                    {coupon.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                  {coupon.discountType === 'PERCENTAGE'
                    ? `${coupon.value}% Off Cart Value`
                    : `₹${coupon.value} Flat Off`}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#6B635B', margin: '0 0 12px', lineHeight: 1.5 }}>
                  {coupon.description || 'Promotional discount voucher'}
                </p>
              </div>

              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid #F5F1EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: '#78716C',
                }}
              >
                <span>Min: {formatPrice(coupon.minCartValue || 0)}</span>
                {coupon.maxDiscount && <span>Max: {formatPrice(coupon.maxDiscount)}</span>}
                <span>Used: {coupon.usageCount || 0} times</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automatic Free Gift Rules Section */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #EAE3D6',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Gift size={22} color="#C8822A" />
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#1C1917', margin: 0 }}>
            Automated Free Gift Tiers
          </h2>
        </div>
        <p style={{ color: '#6B635B', fontSize: '0.875rem', marginBottom: '20px' }}>
          These sacred gift rewards are automatically calculated and added to the customer cart by our server engine when the order subtotal reaches the tier threshold.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div
            style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid #EAE3D6',
              borderRadius: '10px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase' }}>
                Tier 1 Gift
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '10px' }}>
                Auto-Injected
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
              Royal Mysore Sandalwood Discovery Trial Pack
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6B635B' }}>
              Spend Threshold: <strong>₹599+</strong>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid #EAE3D6',
              borderRadius: '10px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase' }}>
                Free Shipping Rule
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '10px' }}>
                Pan-India
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
              100% Free Express Delivery
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6B635B' }}>
              Spend Threshold: <strong>₹499+</strong> (Otherwise ₹50 flat fee)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
