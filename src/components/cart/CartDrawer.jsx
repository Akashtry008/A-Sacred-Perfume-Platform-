import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@/components/common/Link';
import { X, Trash2, ArrowRight, CheckCircle2, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    totals,
    itemCount,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    closeDrawer();
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

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCode.trim());
    setIsApplyingCoupon(false);
    setCouponCode('');
  };

  const freeShippingPct = Math.min(
    100,
    Math.round(((totals.freeShippingThreshold - totals.amountNeededForFreeShipping) / totals.freeShippingThreshold) * 100)
  );

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#C8822A" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Your Sacred Cart</h3>
            <span style={{ fontSize: '0.8125rem', color: '#6B635B' }}>({itemCount} items)</span>
          </div>
          <button onClick={closeDrawer} style={{ color: '#6B635B', padding: '4px' }} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div style={{ padding: '16px 24px', backgroundColor: '#FAF8F5', borderBottom: '1px solid var(--border-color)' }}>
          <div className="free-shipping-bar">
            {totals.amountNeededForFreeShipping > 0 ? (
              <p>
                Add <strong>{formatPrice(totals.amountNeededForFreeShipping)}</strong> more to unlock{' '}
                <strong>FREE Pan-India Delivery!</strong>
              </p>
            ) : (
              <p style={{ color: '#1E5E3A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Congratulations! You unlocked FREE Delivery!
              </p>
            )}
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${freeShippingPct}%` }} />
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-body">
          {!cart || cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6B635B' }}>
              <ShoppingBag size={48} color="#D4C5B3" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', marginBottom: '8px' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
                Explore our sacred collection of bambooless incense and havan cups.
              </p>
              <Link href="/collections" onClick={closeDrawer} className="btn-primary">
                Shop Best Sellers
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img
                  src={item.product?.images?.[0]?.url || item.variant?.image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80'}
                  alt={item.product?.title || 'Product'}
                  className="cart-item-img"
                />

                <div className="cart-item-info">
                  <div>
                    <h4 className="cart-item-title">{item.product?.title}</h4>
                    <p className="cart-item-variant">
                      {item.variant?.title}
                      {item.isGiftItem && (
                        <span
                          style={{
                            marginLeft: '6px',
                            backgroundColor: '#EAF4EE',
                            color: '#1E5E3A',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.6875rem',
                          }}
                        >
                          FREE GIFT
                        </span>
                      )}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    {item.isGiftItem ? (
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E5E3A' }}>
                        FREE
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                        {item.isGiftItem ? '₹0' : formatPrice(item.variant?.price * item.quantity)}
                      </span>

                      {!item.isGiftItem && (
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ color: '#9CA3AF', padding: '4px' }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Totals */}
        {cart && cart.items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Coupon Application Box */}
            <div style={{ marginBottom: '16px' }}>
              {cart.appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#EAF4EE',
                    borderRadius: '6px',
                    border: '1px solid #C2E2CD',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E5E3A', fontSize: '0.875rem', fontWeight: 600 }}>
                    <Tag size={16} /> Code {cart.appliedCoupon} Active
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon (e.g. VEDIC10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#FFF',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="summary-row">
              <span style={{ color: '#6B635B' }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{formatPrice(totals.subtotal)}</span>
            </div>

            {totals.discountTotal > 0 && (
              <div className="summary-row" style={{ color: '#1E5E3A' }}>
                <span>Coupon Savings</span>
                <span style={{ fontWeight: 600 }}>-{formatPrice(totals.discountTotal)}</span>
              </div>
            )}

            <div className="summary-row">
              <span style={{ color: '#6B635B' }}>Shipping</span>
              <span style={{ fontWeight: 500 }}>
                {totals.shippingTotal === 0 ? 'FREE' : formatPrice(totals.shippingTotal)}
              </span>
            </div>

            <div className="summary-row total">
              <span>Estimated Total</span>
              <span style={{ color: '#C8822A' }}>{formatPrice(totals.grandTotal)}</span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#948A7F', marginBottom: '16px' }}>
              All taxes included. Secure payment via Razorpay / UPI / Cards.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleProceedToCheckout}
                className="btn-primary btn-full"
                style={{ fontSize: '1rem', padding: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <Link
                href="/cart"
                onClick={closeDrawer}
                style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B635B', textDecoration: 'underline' }}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
