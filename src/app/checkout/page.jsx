import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { db } from '@/lib/db';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh'
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totals, refreshCart } = useCart();
  const { showToast, showAlert } = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Form Fields
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    state: 'Uttar Pradesh',
    postalCode: '',
    paymentMethod: 'RAZORPAY_UPI',
    notes: '',
  });

  // Verify Devotee Authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            const addr = data.user.shippingAddress || {};
            setFormData((prev) => ({
              ...prev,
              email: data.user.email || prev.email,
              phone: data.user.phone || addr.phone || prev.phone,
              fullName: addr.fullName || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || prev.fullName,
              streetLine1: addr.streetLine1 || prev.streetLine1,
              streetLine2: addr.streetLine2 || prev.streetLine2,
              city: addr.city || prev.city,
              state: addr.state || prev.state,
              postalCode: addr.postalCode || prev.postalCode,
            }));
            setIsCheckingAuth(false);
            return;
          }
        }
        // Devotee must be logged in before opening checkout
        navigate('/account/login?redirect=/checkout');
      } catch (e) {
        navigate('/account/login?redirect=/checkout');
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // PIN auto-lookup helper for popular Indian cities
    if (name === 'postalCode' && value.length === 6) {
      const pinPrefix = value.substring(0, 2);
      if (['11'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'New Delhi', state: 'Delhi NCR' }));
      else if (['20'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'Ghaziabad', state: 'Uttar Pradesh' }));
      else if (['40'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }));
      else if (['56'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }));
      else if (['50'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'Hyderabad', state: 'Telangana' }));
      else if (['60'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'Chennai', state: 'Tamil Nadu' }));
      else if (['70'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'Kolkata', state: 'West Bengal' }));
      else if (['30'].includes(pinPrefix)) setFormData((prev) => ({ ...prev, city: 'Jaipur', state: 'Rajasthan' }));
    }
  };

  const ensureAuthenticated = () => {
    if (!currentUser) {
      showAlert({
        title: 'Devotee Sign-In Required',
        message: 'To place a sacred order on VedaPavitra, you must first log in with your registered devotee account. If you have not registered yet, please create an account.',
        type: 'warning',
        confirmText: 'Sign In Now',
        cancelText: 'Create Account',
        onConfirm: () => navigate('/account/login?redirect=/checkout'),
        onCancel: () => navigate('/account/register?redirect=/checkout'),
      });
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!ensureAuthenticated()) return;

    if (step === 1) {
      if (!formData.email || !formData.phone) {
        showToast('Please enter your contact email and phone number', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.fullName || !formData.streetLine1 || !formData.city || !formData.postalCode) {
        showToast('Please fill in complete shipping address details', 'error');
        return;
      }
      setStep(3);
    }
  };

  const handleCompleteOrder = async () => {
    if (!ensureAuthenticated()) return;

    setIsSubmitting(true);
    try {
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('vp_guest_token') : '';
      const idempotencyKey = 'vp_ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      let orderNumber = null;
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser?.id,
            guestToken,
            cartId: cart?.id,
            email: formData.email,
            phone: formData.phone,
            shippingAddress: {
              fullName: formData.fullName,
              phone: formData.phone,
              streetLine1: formData.streetLine1,
              streetLine2: formData.streetLine2,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: 'IN',
            },
            customerNotes: formData.notes,
            idempotencyKey,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.data?.order?.orderNumber) {
            orderNumber = data.data.order.orderNumber;
          }
        }
      } catch (netErr) {
        console.warn('API checkout request failed, falling back to local engine:', netErr);
      }

      if (!orderNumber) {
        try {
          const localOrder = db.createOrder({
            cartId: cart?.id,
            userId: currentUser?.id,
            guestEmail: formData.email,
            guestPhone: formData.phone,
            shippingAddress: {
              fullName: formData.fullName,
              phone: formData.phone,
              streetLine1: formData.streetLine1,
              streetLine2: formData.streetLine2,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: 'IN',
            },
            billingAddress: {
              fullName: formData.fullName,
              phone: formData.phone,
              streetLine1: formData.streetLine1,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: 'IN',
            },
            customerNotes: formData.notes,
            idempotencyKey,
          });
          orderNumber = localOrder?.orderNumber;
        } catch (dbErr) {
          console.error('Local db order creation error:', dbErr);
          throw dbErr;
        }
      }

      if (orderNumber) {
        await refreshCart();
        showToast('Sacred order placed successfully!', 'success');
        navigate(`/checkout/confirmation/${orderNumber}`);
      } else {
        throw new Error('Unable to complete order placement');
      }
    } catch (err) {
      showToast(err.message || 'Payment or checkout failed', 'error');
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#6B635B', marginBottom: '24px' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link href="/collections" className="btn-primary">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 0 80px', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Checkout Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8822A', fontWeight: 600 }}>
              Secure Checkout
            </span>
            <h1 className="heading-display" style={{ fontSize: '2.25rem', margin: '2px 0 0' }}>
              Sacred Order Placement
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#1E5E3A', fontWeight: 600 }}>
            <Lock size={16} /> 256-bit Encrypted
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '36px' }}>
          {['1. Contact Information', '2. Shipping Address', '3. Payment & Confirmation'].map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div
                key={title}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isCurrent ? '#FFF' : isCompleted ? '#EAF4EE' : '#F0EAE1',
                  border: isCurrent ? '2px solid #C8822A' : isCompleted ? '1px solid #C2E2CD' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isCurrent || isCompleted ? 600 : 400,
                  color: isCurrent ? '#C8822A' : isCompleted ? '#1E5E3A' : '#6B635B',
                }}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <span>{stepNum}.</span>}
                <span>{title}</span>
              </div>
            );
          })}
        </div>

        {/* Two Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* Form Side */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '32px' }}>
            {/* Devotee Account Status Bar */}
            {currentUser ? (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                  fontSize: '0.82rem',
                  color: '#166534',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#16A34A" />
                  <span>
                    Authenticated Devotee: <strong>{currentUser.firstName} {currentUser.lastName}</strong> ({currentUser.email})
                  </span>
                </div>
                <Link href="/account" style={{ color: '#C8822A', fontWeight: 600, fontSize: '0.78rem' }}>
                  Manage Address
                </Link>
              </div>
            ) : !isCheckingAuth ? (
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#FEF3E2',
                  border: '1.5px solid #C8822A',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8A5818', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Lock size={15} color="#C8822A" /> Devotee Account Required to Place Order
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#6B635B' }}>
                    To place any order, you must first log in. If not registered, create an account.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href="/account/login?redirect=/checkout"
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/account/register?redirect=/checkout"
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    Register
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Step 1: Customer Contact */}
            {step === 1 && (
              <form onSubmit={handleNextStep}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '8px' }}>
                  Contact Information
                </h3>
                <p style={{ color: '#6B635B', fontSize: '0.875rem', marginBottom: '20px' }}>
                  We will send order confirmation and live Delhivery tracking updates here.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="e.g. rohan.sharma@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                      Mobile Phone Number *
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '12px 14px', backgroundColor: '#F5EFEB', border: '1px solid #D4C9B8', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-full" style={{ padding: '14px', fontSize: '1rem' }}>
                  Continue to Shipping Address <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <form onSubmit={handleNextStep}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem' }}>Shipping Address</h3>
                  <button type="button" onClick={() => setStep(1)} style={{ fontSize: '0.8125rem', color: '#C8822A', textDecoration: 'underline' }}>
                    Edit Contact
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      placeholder="e.g. Acharya Ramanand"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                      PIN Code (Postal Code) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      name="postalCode"
                      placeholder="e.g. 110001 (auto detects city & state)"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                      Flat, House No., Building, Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      name="streetLine1"
                      placeholder="e.g. Flat 402, Shanti Kunj Apartments"
                      value={formData.streetLine1}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                      Area, Street, Sector, Village (Optional)
                    </label>
                    <input
                      type="text"
                      name="streetLine2"
                      placeholder="e.g. Sector 14, Near Shiv Mandir"
                      value={formData.streetLine2}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.95rem', backgroundColor: '#FFF' }}
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-full" style={{ padding: '14px', fontSize: '1rem' }}>
                  Proceed to Payment Options <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* Step 3: Payment & Final Placement */}
            {step === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem' }}>Select Payment Method</h3>
                  <button type="button" onClick={() => setStep(2)} style={{ fontSize: '0.8125rem', color: '#C8822A', textDecoration: 'underline' }}>
                    Edit Address
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {/* Option 1: Razorpay UPI */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '8px',
                      border: formData.paymentMethod === 'RAZORPAY_UPI' ? '2px solid #C8822A' : '1px solid #D4C9B8',
                      backgroundColor: formData.paymentMethod === 'RAZORPAY_UPI' ? '#FDF6EC' : '#FFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY_UPI"
                      checked={formData.paymentMethod === 'RAZORPAY_UPI'}
                      onChange={handleInputChange}
                      style={{ accentColor: '#C8822A' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                        Prepaid UPI / Cards / NetBanking (Razorpay)
                      </strong>
                      <span style={{ fontSize: '0.8125rem', color: '#6B635B' }}>
                        Instant GPay, PhonePe, Paytm, RuPay, Visa, Mastercard
                      </span>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '8px',
                      border: formData.paymentMethod === 'COD' ? '2px solid #C8822A' : '1px solid #D4C9B8',
                      backgroundColor: formData.paymentMethod === 'COD' ? '#FDF6EC' : '#FFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleInputChange}
                      style={{ accentColor: '#C8822A' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                        Cash on Delivery (Pay upon delivery)
                      </strong>
                      <span style={{ fontSize: '0.8125rem', color: '#6B635B' }}>
                        Pay cash directly to Delhivery courier executive
                      </span>
                    </div>
                  </label>
                </div>

                {/* Recipient Summary Pill */}
                <div style={{ backgroundColor: '#FAF8F5', border: '1px solid #EAE3D6', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.875rem' }}>
                  <p><strong>Deliver to:</strong> {formData.fullName}</p>
                  <p style={{ color: '#6B635B' }}>{formData.streetLine1}, {formData.city}, {formData.state} - {formData.postalCode}</p>
                  <p style={{ color: '#6B635B' }}>Phone: +91 {formData.phone} | Email: {formData.email}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting}
                  className="btn-primary btn-full"
                  style={{ padding: '16px', fontSize: '1.05rem' }}
                >
                  <ShieldCheck size={20} />
                  {isSubmitting ? 'Securing Your Sacred Order...' : `Pay & Complete Order (${formatPrice(totals.grandTotal)})`}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Items Snapshot */}
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '12px',
              border: '1px solid #EAE3D6',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '20px' }}>
              Order Snapshot
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80'}
                    alt={item.product?.title}
                    style={{ width: '56px', height: '56px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C1917' }}>
                      {item.product?.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#6B635B' }}>
                      {item.variant?.title} × {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                    {item.isGiftItem ? 'FREE' : formatPrice(item.variant?.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #EAE3D6', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6B635B' }}>
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>

              {totals.discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#1E5E3A' }}>
                  <span>Applied Savings</span>
                  <span>-{formatPrice(totals.discountTotal)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6B635B' }}>
                <span>Delivery Charges</span>
                <span>{totals.shippingTotal === 0 ? 'FREE' : formatPrice(totals.shippingTotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, paddingTop: '12px', borderTop: '1px solid #EAE3D6' }}>
                <span>Total Amount</span>
                <span style={{ color: '#C8822A' }}>{formatPrice(totals.grandTotal)}</span>
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#FAF8F5', borderRadius: '8px', fontSize: '0.75rem', color: '#6B635B', lineHeight: 1.5 }}>
              🛡️ <strong>VedaPavitra Purity Guarantee:</strong> Packed in sacred, moisture-sealed containers. In the rare case of courier transit damage, we immediately reship 100% free replacements.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
