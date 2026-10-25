import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Printer,
  X,
  ExternalLink,
  Flame,
  Phone,
  HelpCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function TrackOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const queryParam = new URLSearchParams(location.search).get('id') || '';
  const [searchInput, setSearchInput] = useState(queryParam);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    if (queryParam) {
      setSearchInput(queryParam);
      fetchOrderTracking(queryParam);
    }
  }, [queryParam]);

  const fetchOrderTracking = async (idToQuery) => {
    const cleanId = idToQuery.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setErrorMsg('');
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'No order found matching your search.');
      }

      setOrder(data.order);
      showToast?.(`Found order ${data.order.orderNumber}!`, 'success');
    } catch (err) {
      setOrder(null);
      setErrorMsg(err.message || 'Unable to find order. Please verify your reference number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track-order?id=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Determine Pipeline Status Level (1 to 5)
  const getPipelineStage = (status) => {
    const s = (status || 'PAID').toUpperCase();
    if (s === 'DELIVERED') return 5;
    if (s === 'SHIPPED') return 4;
    if (s === 'PROCESSING') return 3;
    if (s === 'PAID') return 2;
    return 1;
  };

  const currentStage = order ? getPipelineStage(order.status) : 1;

  const pipelineSteps = [
    {
      num: 1,
      title: 'Sacred Order Placed',
      desc: 'Payment received & verified under Vedic altar guidelines.',
      icon: CheckCircle2,
    },
    {
      num: 2,
      title: 'Atelier Consecration',
      desc: 'Formulations hand-inspected & sanctified with Holy Gangajal.',
      icon: Flame,
    },
    {
      num: 3,
      title: 'Consignment Packed',
      desc: order?.billId ? `Delivery Bill: ${order.billId}` : 'Box sealed with tamper-evident sacred tape.',
      icon: FileText,
    },
    {
      num: 4,
      title: 'In Express Transit',
      desc: order?.trackingNumber ? `${order.shippingCourier || 'Delhivery'}: ${order.trackingNumber}` : 'Handed over to high-priority devotional courier.',
      icon: Truck,
    },
    {
      num: 5,
      title: 'Delivered & Sanctified',
      desc: 'Received at your doorstep for daily worship and peace.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt;{' '}
          <span style={{ color: '#C8822A', fontWeight: 600 }}>Track Order & Delivery Bill</span>
        </div>

        {/* Page Hero */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#C8822A',
              backgroundColor: '#FAF0E4',
              border: '1px solid #E8D5BF',
              padding: '4px 14px',
              borderRadius: '20px',
              marginBottom: '12px',
            }}
          >
            <Truck size={14} /> Live Devotional Consignment Tracking
          </span>
          <h1 className="heading-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', margin: '0 0 12px', color: '#1C1917' }}>
            Track Your Sacred Consignment
          </h1>
          <p style={{ color: '#6B635B', fontSize: '1rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Enter your <strong>Order ID</strong> (e.g. <code>VP-20261015-XXXX</code>), <strong>Delivery Bill ID</strong> (e.g. <code>VP-BILL-2026-XXXX</code>), or registered phone number to check current packing, dispatch, and courier movement.
          </p>
        </div>

        {/* Search Input Box */}
        <div
          style={{
            backgroundColor: '#FFF',
            borderRadius: '16px',
            border: '1px solid #EAE3D6',
            padding: '24px clamp(16px, 3vw, 32px)',
            boxShadow: 'var(--shadow-card-classic)',
            marginBottom: '40px',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                placeholder="Enter Order ID / Bill No / Phone (e.g. VP-2026... or 9876543210)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px 14px 44px',
                  borderRadius: '10px',
                  border: '1.5px solid #D6D3D1',
                  backgroundColor: '#FAF7F2',
                  fontSize: '0.95rem',
                  color: '#1C1917',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              <Search
                size={18}
                color="#78716C"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Search size={16} />
              <span>{isLoading ? 'Locating...' : 'Track Consignment'}</span>
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                color: '#991B1B',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <X size={18} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {order && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header Badge Strip */}
            <div
              style={{
                backgroundColor: '#FFF',
                border: '1.5px solid #EAE3D6',
                borderRadius: '16px',
                padding: '24px 28px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', margin: 0, color: '#1C1917' }}>
                    Order {order.orderNumber}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: order.status === 'DELIVERED' ? '#DCFCE7' : '#FEF3C7',
                      color: order.status === 'DELIVERED' ? '#166534' : '#92400E',
                      padding: '3px 10px',
                      borderRadius: '12px',
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span>Placed: <strong>{formatDate(order.createdAt)}</strong></span>
                  {order.billId && (
                    <span>• Delivery Bill: <strong style={{ color: '#166534', fontFamily: 'monospace' }}>{order.billId}</strong></span>
                  )}
                  {order.consignmentId && (
                    <span>• Box ID: <strong style={{ fontFamily: 'monospace' }}>{order.consignmentId}</strong></span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    backgroundColor: '#FAF0E4',
                    border: '1px solid #E8D5BF',
                    borderRadius: '8px',
                    color: '#8C5816',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={15} /> Print Delivery Slip / Bill
                </button>
              </div>
            </div>

            {/* 5-Step Visual Progress Tracker */}
            <div
              style={{
                backgroundColor: '#FFF',
                border: '1.5px solid #EAE3D6',
                borderRadius: '16px',
                padding: '32px 28px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C1917', margin: '0 0 24px' }}>
                Consignment Dispatch Pipeline
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', position: 'relative' }}>
                {pipelineSteps.map((step) => {
                  const Icon = step.icon;
                  const isDone = currentStage >= step.num;
                  const isCurrent = currentStage === step.num;

                  return (
                    <div
                      key={step.num}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? '#166534' : isCurrent ? '#C8822A' : '#E7E5E4',
                          color: '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '12px',
                          boxShadow: isCurrent ? '0 0 0 4px rgba(200, 130, 42, 0.2)' : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Icon size={20} />
                      </div>

                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isDone ? '#166534' : '#1C1917', marginBottom: '4px' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#78716C', lineHeight: 1.4 }}>
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier AWB & Routing Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Courier Card */}
              <div
                style={{
                  backgroundColor: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Truck size={20} color="#C8822A" />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C1917' }}>
                    Courier Logistics & AWB
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#78716C', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Partner</span>
                    <strong style={{ color: '#1C1917', fontSize: '0.95rem' }}>{order.shippingCourier || 'Delhivery Express Direct'}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#78716C', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Air Waybill (AWB)</span>
                    <strong style={{ fontFamily: 'monospace', color: '#9B3828', fontSize: '1rem' }}>
                      {order.trackingNumber || 'Awaiting Handover Scan'}
                    </strong>
                  </div>

                  {order.trackingNumber && (
                    <a
                      href={`https://www.delhivery.com/track/package/${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{
                        marginTop: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.8125rem',
                        textDecoration: 'none',
                      }}
                    >
                      <span>Track on {order.shippingCourier || 'Delhivery'} Website</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* Delivery Destination Card */}
              <div
                style={{
                  backgroundColor: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <MapPin size={20} color="#C8822A" />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C1917' }}>
                    Sacred Destination
                  </h4>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#44403C', lineHeight: 1.5 }}>
                  <strong style={{ fontSize: '1rem', color: '#1C1917', display: 'block', marginBottom: '4px' }}>
                    {order.shippingAddress?.fullName || 'Valued Devotee'}
                  </strong>
                  {order.shippingAddress?.addressLine1}<br />
                  {order.shippingAddress?.addressLine2 && <>{order.shippingAddress?.addressLine2}<br /></>}
                  <strong>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                  </strong><br />
                  <span style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '6px', display: 'block' }}>
                    Phone: {order.guestPhone || order.shippingAddress?.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Manifest */}
            <div
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h4 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: '#1C1917' }}>
                Manifest Items in this Parcel ({order.items?.length || 0})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#FAF7F2',
                      borderRadius: '8px',
                      border: '1px solid #EAE3D6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt=""
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1C1917' }}>
                          {item.productTitle || item.title} {item.isGift && <span style={{ color: '#D97706', fontSize: '0.75rem' }}>(Complimentary Gift)</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C' }}>
                          {item.variantTitle} × {item.quantity}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>
                      {item.isGift ? 'FREE' : formatPrice(item.totalPrice || item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div
                style={{
                  borderTop: '1px solid #EAE3D6',
                  marginTop: '16px',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#78716C' }}>
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal || order.grandTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#78716C' }}>
                    <span>Sacred Express Shipping:</span>
                    <span style={{ color: '#166534', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#1C1917',
                      borderTop: '1.5px solid #1C1917',
                      paddingTop: '8px',
                      marginTop: '4px',
                    }}
                  >
                    <span>Total Paid:</span>
                    <span style={{ color: '#C8822A' }}>{formatPrice(order.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Not Searched yet */}
        {!order && !isLoading && (
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <Package size={44} color="#D6D3D1" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1C1917', marginBottom: '8px' }}>
              Instant Sacred Consignment Lookup
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              All devotional shipments are dispatched with holy Gangajal sanctification. Track real-time movement from our Kashi atelier to your mandir.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#78716C', alignSelf: 'center' }}>Need help?</span>
              <Link href="/pages/faq" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                View Shipping FAQs
              </Link>
              <Link href="/pages/contact" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                Contact Seva Desk
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Printable Delivery Slip Modal */}
      {isPrintModalOpen && order && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          {/* Print Specific CSS */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #devotee-printable-bill, #devotee-printable-bill * {
                visibility: visible !important;
              }
              #devotee-printable-bill {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 16px !important;
                background: #ffffff !important;
                color: #000000 !important;
                box-shadow: none !important;
                border: 2px solid #000 !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Actions Header */}
            <div
              className="no-print"
              style={{
                padding: '16px 24px',
                backgroundColor: '#1C1917',
                color: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Printer size={20} color="#E09C48" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                    Official Consignment Receipt & Delivery Bill
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
                    Print or save this consecrated bill for your records
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    backgroundColor: '#C8822A',
                    color: '#FFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Printer size={16} /> Print Receipt (Ctrl + P)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  style={{
                    backgroundColor: '#292524',
                    color: '#D6D3D1',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* The Actual Printable Slip */}
            <div style={{ padding: '28px', overflowY: 'auto', backgroundColor: '#F8F6F0' }}>
              <div
                id="devotee-printable-bill"
                style={{
                  backgroundColor: '#FFF',
                  padding: '32px',
                  borderRadius: '12px',
                  border: '1.5px solid #292524',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  color: '#1C1917',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '2px solid #1C1917',
                    paddingBottom: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 800, color: '#1C1917' }}>
                        VEDAPAVITRA
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, border: '1px solid #C8822A', color: '#C8822A', padding: '2px 6px', borderRadius: '4px' }}>
                        Sacred Vedic Atelier
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#57534E', lineHeight: 1.4 }}>
                      Shri Kashi Vishwanath Marg, Varanasi, Uttar Pradesh - 221001<br />
                      GSTIN: 09AABCV1234F1Z8 | care@vedapavitra.com
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#1C1917', color: '#FFF', fontWeight: 800, fontSize: '0.85rem', borderRadius: '4px', marginBottom: '6px' }}>
                      Delivery Bill & Manifest
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#44403C' }}>
                      Date: <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#44403C' }}>
                      Status: <strong>{order.status} (Verified)</strong>
                    </div>
                  </div>
                </div>

                {/* Tracking & Parcel IDs */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid #D6D3D1',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    marginBottom: '20px',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                      Delivery Bill No.
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#9B3828' }}>
                      {order.billId || `VP-BILL-2026-${order.orderNumber?.replace('VP-', '')}`}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                      Parcel Box ID
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#1C1917' }}>
                      {order.consignmentId || `VP-PKG-${order.orderNumber?.replace('VP-', '')}`}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                      Courier Tracking AWB
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: '#1C1917' }}>
                      {order.shippingCourier || 'Delhivery'}: {order.trackingNumber || 'Pending AWB'}
                    </span>
                  </div>
                </div>

                {/* Routing Addresses */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    border: '1.5px solid #EAE3D6',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ borderRight: '1px solid #EAE3D6', paddingRight: '16px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#78716C', marginBottom: '6px' }}>
                      DISPATCHED FROM
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917' }}>
                      VedaPavitra Consecration & Dispatch Atelier
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#44403C', lineHeight: 1.4, marginTop: '2px' }}>
                      Dashashwamedh Ghat Marg, Kashi<br />
                      Varanasi, UP - 221001
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#C8822A', marginBottom: '6px' }}>
                      DELIVER TO (DEVOTEE)
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C1917' }}>
                      {order.shippingAddress?.fullName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#1C1917', lineHeight: 1.45, marginTop: '2px' }}>
                      {order.shippingAddress?.addressLine1}<br />
                      {order.shippingAddress?.addressLine2 && <>{order.shippingAddress?.addressLine2}<br /></>}
                      <strong>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                      </strong><br />
                      <span>Phone: {order.guestPhone || order.shippingAddress?.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Items Manifest */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1C1917', color: '#FFF' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: '4px 0 0 0' }}>#</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Sacred Offering</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Variant</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #EAE3D6' }}>
                        <td style={{ padding: '10px', color: '#78716C' }}>{idx + 1}</td>
                        <td style={{ padding: '10px', fontWeight: 600 }}>{item.productTitle || item.title}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#57534E' }}>{item.variantTitle || 'Standard'}</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                          {item.isGift ? 'FREE' : formatPrice(item.totalPrice || item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Financial Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> GANGAJAL CONSECRATED & SANCTIFIED
                  </div>
                  <div style={{ width: '240px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal || order.grandTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Shipping:</span>
                      <span style={{ color: '#166534', fontWeight: 600 }}>FREE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', borderTop: '1.5px solid #1C1917', paddingTop: '6px' }}>
                      <span>Total Paid:</span>
                      <span style={{ color: '#C8822A' }}>{formatPrice(order.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
