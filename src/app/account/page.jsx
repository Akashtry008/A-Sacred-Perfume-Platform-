import React, { useEffect, useState } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Edit3,
  Save,
  ShoppingBag,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useWishlist } from '@/context/WishlistContext';

export default function AccountDashboardPage() {
  const navigate = useNavigate();
  const { showToast, showAlert } = useToast();
  const { wishlistIds } = useWishlist();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    state: 'Uttar Pradesh',
    postalCode: '',
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Authenticate user on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('vedapavitra_token') : null;
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('/api/auth/me', { headers });
        if (!res.ok) {
          // Strictly redirect if not logged in
          if (isMounted) navigate('/account/login');
          return;
        }
        const data = await res.json();
        if (data.user && isMounted) {
          setUser(data.user);
          setOrders(data.user.orders || []);
          setActivities(data.user.activities || []);
          if (data.user.shippingAddress) {
            setAddressForm(data.user.shippingAddress);
          }
        } else if (isMounted) {
          navigate('/account/login');
        }
      } catch (err) {
        if (isMounted) navigate('/account/login');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSignOut = () => {
    showAlert({
      title: 'Sign Out Confirmation',
      message: 'Are you sure you wish to log out from your devotee account?',
      type: 'warning',
      confirmText: 'Sign Out',
      cancelText: 'Stay Logged In',
      onConfirm: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {}
        showToast('You have been safely signed out.', 'info');
        navigate('/account/login');
      },
    });
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const res = await fetch('/api/account/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser((prev) => ({ ...prev, shippingAddress: data.shippingAddress }));
        setIsEditingAddress(false);
        showToast('Your sacred delivery address has been saved.', 'success');
      } else {
        showToast(data.detail || 'Could not update address', 'error');
      }
    } catch (err) {
      showToast('Network error while saving address', 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '96px 0', textAlign: 'center', backgroundColor: '#FAF7F2', minHeight: '60vh' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#C8822A', fontSize: '1rem', fontWeight: 600 }}>
          <Loader2 className="animate-spin" size={20} /> Verifying Devotee Session...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ padding: '36px 0 80px', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '1020px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>My Devotee Account</span>
        </div>

        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8822A', fontWeight: 600 }}>
              Sacred Devotee Portal
            </span>
            <h1 className="heading-display" style={{ fontSize: '2.4rem', margin: '2px 0 0', color: '#1C1917' }}>
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <p style={{ color: '#6B635B', fontSize: '0.92rem', margin: '4px 0 0' }}>
              {user.email} {user.phone && `• +91 ${user.phone}`}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="btn btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Dashboard Navigation Cards */}
        <div className="grid-3" style={{ marginBottom: '40px' }}>
          <Link
            href="/account/orders"
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-card-classic)',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FDF6EC', color: '#C8822A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Package size={22} />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', marginBottom: '4px', color: '#1C1917' }}>
              Orders & Tracking
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.85rem', flex: 1, margin: '0 0 16px' }}>
              {orders.length} sacred orders placed with VedaPavitra
            </p>
            <span style={{ color: '#C8822A', fontWeight: 600, fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              View Orders <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/account/wishlist"
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-card-classic)',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FDF6EC', color: '#C8822A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Heart size={22} />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', marginBottom: '4px', color: '#1C1917' }}>
              Saved Offerings
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.85rem', flex: 1, margin: '0 0 16px' }}>
              {wishlistIds?.length || 0} cherished items saved in your wishlist
            </p>
            <span style={{ color: '#C8822A', fontWeight: 600, fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              View Wishlist <ArrowRight size={14} />
            </span>
          </Link>

          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-card-classic)',
            }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FDF6EC', color: '#C8822A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', marginBottom: '4px', color: '#1C1917' }}>
              Gandhashastra Purity
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.85rem', flex: 1, margin: '0 0 16px' }}>
              100% Bambooless & Charcoal-Free Vedic formulation certified
            </p>
            <span style={{ color: '#1E5E3A', fontWeight: 600, fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> Verified Devotee
            </span>
          </div>
        </div>

        {/* Two-Column Grid: Delivery Address & Recent Orders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '40px' }}>
          
          {/* SHIPPING ADDRESS CARD */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '14px',
              padding: '28px',
              boxShadow: 'var(--shadow-card-classic)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="#C8822A" />
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', margin: 0, color: '#1C1917' }}>
                  Delivery Address
                </h2>
              </div>
              {!isEditingAddress ? (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Edit3 size={13} /> Change Address
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingAddress(false)}
                  style={{ background: 'none', border: 'none', color: '#8C827A', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>

            {!isEditingAddress ? (
              <div>
                {user.shippingAddress?.streetLine1 || user.shippingAddress?.city ? (
                  <div style={{ color: '#44403C', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    <p style={{ fontWeight: 600, color: '#1C1917', margin: '0 0 4px' }}>
                      {user.shippingAddress.fullName || `${user.firstName} ${user.lastName}`}
                    </p>
                    <p style={{ margin: 0 }}>{user.shippingAddress.streetLine1}</p>
                    {user.shippingAddress.streetLine2 && <p style={{ margin: 0 }}>{user.shippingAddress.streetLine2}</p>}
                    <p style={{ margin: 0 }}>
                      {user.shippingAddress.city}, {user.shippingAddress.state} - {user.shippingAddress.postalCode}
                    </p>
                    {user.shippingAddress.phone && (
                      <p style={{ margin: '6px 0 0', color: '#6B635B' }}>
                        Phone: +91 {user.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '20px', backgroundColor: '#FDF8F0', borderRadius: '8px', border: '1px dashed #E8D5BF', textAlign: 'center' }}>
                    <p style={{ color: '#8A6D47', fontSize: '0.85rem', margin: '0 0 10px' }}>
                      No shipping address saved yet. Save your sacred delivery address for faster checkout.
                    </p>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="btn btn-primary"
                      style={{ padding: '7px 16px', fontSize: '0.8rem' }}
                    >
                      + Add Delivery Address
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Address Edit Form */
              <form onSubmit={handleAddressSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Full Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addressForm.postalCode || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    House / Building / Apartment
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.streetLine1 || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, streetLine1: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Street / Sector / Landmark
                  </label>
                  <input
                    type="text"
                    value={addressForm.streetLine2 || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, streetLine2: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.city || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.state || 'Uttar Pradesh'}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="btn btn-primary"
                  style={{ marginTop: '8px', padding: '10px 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Save size={15} /> {isSavingAddress ? 'Saving...' : 'Save Shipping Address'}
                </button>
              </form>
            )}
          </div>

          {/* RECENT ORDERS OVERVIEW CARD */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '14px',
              padding: '28px',
              boxShadow: 'var(--shadow-card-classic)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} color="#C8822A" />
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', margin: 0, color: '#1C1917' }}>
                  Recent Orders
                </h2>
              </div>
              <Link href="/account/orders" style={{ fontSize: '0.8rem', color: '#C8822A', fontWeight: 600 }}>
                View All
              </Link>
            </div>

            {orders.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <p style={{ color: '#6B635B', fontSize: '0.88rem', margin: '0 0 14px' }}>
                  You have not placed any orders yet. Discover our sacred bambooless agarbatti and havan cups.
                </p>
                <Link href="/collections" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                  Explore Sacred Catalog
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id || ord.orderNumber}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #EAE3D6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1917' }}>
                        {ord.orderNumber}
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#78716C' }}>
                        {ord.items?.length || 1} items • ₹{ord.total}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: ord.fulfillmentStatus === 'DELIVERED' ? '#DCFCE7' : '#FEF3C7',
                        color: ord.fulfillmentStatus === 'DELIVERED' ? '#166534' : '#B45309',
                      }}
                    >
                      {ord.fulfillmentStatus || 'PROCESSING'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Devotee Platform Activity Log */}
        {activities.length > 0 && (
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '14px',
              padding: '24px 28px',
              boxShadow: 'var(--shadow-card-classic)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Clock size={18} color="#C8822A" />
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', margin: 0, color: '#1C1917' }}>
                Account Activity & Security Audit
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activities.slice(0, 5).map((act, i) => (
                <div
                  key={act.id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: '#57534E',
                    padding: '6px 0',
                    borderBottom: i < 4 ? '1px solid #F5F1E8' : 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#C8822A' }}>•</span> {act.description || act.action}
                  </span>
                  <span style={{ color: '#A8A29E', fontSize: '0.75rem' }}>
                    {new Date(act.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
