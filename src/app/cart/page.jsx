import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, ArrowRight, Trash2, CheckCircle2, Tag } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    totals,
    itemCount,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          navigate('/checkout');
          return;
        }
      }
    } catch (err) {}
    navigate('/account/login?redirect=/checkout');
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponCode.trim());
    setIsApplying(false);
    setCouponCode('');
  };

  const freeShippingPct = Math.min(
    100,
    Math.round(((totals.freeShippingThreshold - totals.amountNeededForFreeShipping) / totals.freeShippingThreshold) * 100)
  );

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Your Sacred Cart</span>
        </div>

        <h1 className="heading-display" style={{ fontSize: '2.5rem', marginBottom: '28px' }}>
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>

        {!cart || cart.items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 20px',
              backgroundColor: '#FFF',
              borderRadius: '12px',
              border: '1px solid #EAE3D6',
            }}
          >
            <ShoppingBag size={56} color="#D4C5B3" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>
              Your sacred cart is currently empty
            </h2>
            <p style={{ color: '#6B635B', marginBottom: '24px' }}>
              Browse our handcrafted bambooless incense and Vedic havan essentials.
            </p>
            <Link href="/collections" className="btn-primary">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left Items Column */}
            <div>
              {/* Free Shipping Meter */}
              <div
                style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EAE3D6',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                }}
              >
                <div className="free-shipping-bar" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>
                  {totals.amountNeededForFreeShipping > 0 ? (
                    <p>
                      Add <strong>{formatPrice(totals.amountNeededForFreeShipping)}</strong> more to qualify for{' '}
                      <strong>FREE Pan-India Delivery!</strong>
                    </p>
                  ) : (
                    <p style={{ color: '#1E5E3A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> You unlocked FREE Shipping across India!
                    </p>
                  )}
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${freeShippingPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div
                style={{
                  backgroundColor: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid #F0EAE1',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product?.title}
                      style={{ width: '84px', height: '84px', borderRadius: '8px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1 }}>
                      <Link href={`/products/${item.product?.slug}`}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                          {item.product?.title}
                        </h3>
                      </Link>

                      <p style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '8px' }}>
                        {item.variant?.title}
                        {item.isGiftItem && (
                          <span
                            style={{
                              marginLeft: '8px',
                              backgroundColor: '#EAF4EE',
                              color: '#1E5E3A',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                            }}
                          >
                            FREE GIFT
                          </span>
                        )}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {item.isGiftItem ? (
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E5E3A' }}>
                            FREE PROMO ITEM
                          </span>
                        ) : (
                          <div className="cart-stepper">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                            {item.isGiftItem ? '₹0' : formatPrice(item.variant?.price * item.quantity)}
                          </span>

                          {!item.isGiftItem && (
                            <button
                              onClick={() => removeItem(item.id)}
                              style={{ color: '#9CA3AF', padding: '4px', cursor: 'pointer' }}
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Notes */}
              <div style={{ marginTop: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                  Special Pooja Instructions / Gift Note (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Include any specific packaging request or auspicious message..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #D4C9B8',
                    backgroundColor: '#FFF',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '20px' }}>
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div style={{ marginBottom: '20px' }}>
                {cart.appliedCoupon ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: '#EAF4EE',
                      borderRadius: '6px',
                      border: '1px solid #C2E2CD',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E5E3A', fontSize: '0.875rem', fontWeight: 600 }}>
                      <Tag size={16} /> Code {cart.appliedCoupon} Applied
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D4C9B8',
                        backgroundColor: '#FAF7F2',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="btn-secondary"
                      style={{ padding: '10px 16px', fontSize: '0.875rem' }}
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Line item breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                  <span style={{ color: '#6B635B' }}>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(totals.subtotal)}</span>
                </div>

                {totals.discountTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#1E5E3A' }}>
                    <span>Discount</span>
                    <span style={{ fontWeight: 600 }}>-{formatPrice(totals.discountTotal)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                  <span style={{ color: '#6B635B' }}>Shipping</span>
                  <span style={{ fontWeight: 500 }}>
                    {totals.shippingTotal === 0 ? 'FREE' : formatPrice(totals.shippingTotal)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    paddingTop: '16px',
                    borderTop: '1px solid #EAE3D6',
                    marginTop: '4px',
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: '#C8822A' }}>{formatPrice(totals.grandTotal)}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#8C8277', marginBottom: '20px' }}>
                Taxes included. Cash on delivery & prepaid UPI / NetBanking accepted.
              </p>

              <button
                onClick={handleProceedToCheckout}
                className="btn-primary btn-full"
                style={{ fontSize: '1rem', padding: '16px', marginBottom: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <Link
                href="/collections"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: '#6B635B',
                  textDecoration: 'underline',
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
