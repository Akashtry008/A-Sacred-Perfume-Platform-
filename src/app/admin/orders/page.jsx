import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
  X,
  ExternalLink,
  RefreshCw,
  Printer,
  FileText,
  ShieldCheck,
  Check,
  QrCode,
  MessageCircle,
  Send,
  Copy,
  Download,
  CheckSquare,
  Square,
  Layers,
  List,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { db } from '@/lib/db';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Printing states (supports single order or batch multi-order generation)
  const [printingOrders, setPrintingOrders] = useState([]);
  const [printViewTab, setPrintViewTab] = useState('slips'); // 'slips' | 'manifest'
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

  // Status edit form state
  const [editStatus, setEditStatus] = useState('');
  const [editCourier, setEditCourier] = useState('');
  const [editTracking, setEditTracking] = useState('');

  useEffect(() => {
    loadOrdersList();
  }, []);

  const loadOrdersList = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
          return;
        }
      }
      const local = db.getOrders ? db.getOrders() : [];
      setOrders(local);
    } catch {
      const local = db.getOrders ? db.getOrders() : [];
      setOrders(local);
    }
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditCourier(order.shippingCourier || 'Delhivery Express');
    setEditTracking(order.trackingNumber || '');
  };

  // Individual Order Accept & Bill Generation
  const handleAcceptOrder = async (order) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PROCESSING',
          fulfillmentStatus: 'PROCESSING',
          shippingCourier: order.shippingCourier || 'Delhivery Express',
          generateBill: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || 'Failed to accept order');

      const updated = data.order || {
        ...order,
        status: 'PROCESSING',
        billId: `VP-BILL-2026-${order.orderNumber.replace('VP-', '').slice(-5)}`,
        consignmentId: `VP-PKG-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        trackingNumber: order.trackingNumber || `DELH-VP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        shippingCourier: order.shippingCourier || 'Delhivery Express',
      };

      showToast?.(`Order ${order.orderNumber} accepted! Delivery bill ${updated.billId} generated.`, 'success');
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      if (selectedOrder && selectedOrder.id === updated.id) {
        setSelectedOrder(updated);
        setEditStatus(updated.status);
      }
      setPrintingOrders([updated]);
      setPrintViewTab('slips');
    } catch (err) {
      showToast?.(err.message || 'Error accepting order', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Individual Print Bill
  const handlePrintIndividualBill = (order) => {
    const preparedOrder = order.billId ? order : {
      ...order,
      billId: `VP-BILL-2026-${(order.orderNumber || order.id).replace('VP-', '').slice(-5).toUpperCase()}`,
      consignmentId: order.consignmentId || `VP-PKG-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      trackingNumber: order.trackingNumber || `DELH-VP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      shippingCourier: order.shippingCourier || 'Delhivery Express',
    };
    setPrintingOrders([preparedOrder]);
    setPrintViewTab('slips');
  };

  // Selection Checkbox Handlers
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const handleToggleSelectOrder = (orderId) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  // Batch Accept All Orders (or Accept Selected)
  const handleBatchAcceptOrders = async () => {
    const targetOrders = selectedOrderIds.size > 0
      ? filteredOrders.filter((o) => selectedOrderIds.has(o.id))
      : filteredOrders.filter((o) => o.status !== 'CANCELLED' && !o.billId);

    const idsToAccept = targetOrders.map((o) => o.id);

    if (idsToAccept.length === 0) {
      showToast?.('All selected or filtered orders already have generated delivery bills.', 'info');
      return;
    }

    setIsBatchUpdating(true);
    try {
      const res = await fetch('/api/admin/orders/batch-accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: idsToAccept,
          status: 'PROCESSING',
          shippingCourier: 'Delhivery Express',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || 'Failed to accept orders');

      const updatedMap = new Map((data.orders || []).map((o) => [o.id, o]));
      const now = new Date().toISOString();

      const nextOrders = orders.map((o) => {
        if (updatedMap.has(o.id)) return updatedMap.get(o.id);
        if (idsToAccept.includes(o.id)) {
          const shortRef = (o.orderNumber || o.id).replace('VP-', '').slice(-5).toUpperCase();
          return {
            ...o,
            status: 'PROCESSING',
            billId: o.billId || `VP-BILL-2026-${shortRef}`,
            consignmentId: o.consignmentId || `VP-PKG-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
            trackingNumber: o.trackingNumber || `DELH-VP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
            shippingCourier: o.shippingCourier || 'Delhivery Express',
            acceptedAt: now,
            billGeneratedAt: now,
          };
        }
        return o;
      });

      setOrders(nextOrders);
      setSelectedOrderIds(new Set());
      showToast?.(`Accepted ${idsToAccept.length} orders & generated all delivery bills!`, 'success');

      // Automatically open all newly accepted bills for batch printing
      const acceptedBills = nextOrders.filter((o) => idsToAccept.includes(o.id));
      if (acceptedBills.length > 0) {
        setPrintingOrders(acceptedBills);
        setPrintViewTab('slips');
      }
    } catch (err) {
      showToast?.(err.message || 'Error accepting orders in batch', 'error');
    } finally {
      setIsBatchUpdating(false);
    }
  };

  // Batch Print All Bills / Generate Manifest List
  const handlePrintAllBills = (viewMode = 'slips') => {
    const sourceList = selectedOrderIds.size > 0
      ? filteredOrders.filter((o) => selectedOrderIds.has(o.id))
      : filteredOrders;

    if (sourceList.length === 0) {
      showToast?.('No orders available to generate bills.', 'error');
      return;
    }

    // Ensure all have billId, consignmentId, and tracking preview
    const prepared = sourceList.map((o) => {
      if (o.billId) return o;
      const shortRef = (o.orderNumber || o.id).replace('VP-', '').slice(-5).toUpperCase();
      return {
        ...o,
        billId: `VP-BILL-2026-${shortRef}`,
        consignmentId: o.consignmentId || `VP-PKG-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        trackingNumber: o.trackingNumber || `DELH-VP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        shippingCourier: o.shippingCourier || 'Delhivery Express',
      };
    });

    setPrintingOrders(prepared);
    setPrintViewTab(viewMode);
  };

  // Export All Bills to CSV
  const handleExportBillsCSV = () => {
    const sourceList = selectedOrderIds.size > 0
      ? filteredOrders.filter((o) => selectedOrderIds.has(o.id))
      : filteredOrders;

    if (sourceList.length === 0) {
      showToast?.('No orders to export.', 'info');
      return;
    }

    const headers = [
      'Order Number',
      'Delivery Bill ID',
      'Parcel Box ID',
      'Order Date',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Delivery Address',
      'City',
      'State',
      'Pincode',
      'Courier Partner',
      'AWB Tracking Number',
      'Total Items',
      'Items Detail',
      'Total Amount (INR)',
      'Fulfillment Status',
      'Payment Status',
    ];

    const rows = sourceList.map((o) => {
      const billId = o.billId || `VP-BILL-2026-${(o.orderNumber || '').replace('VP-', '').slice(-5)}`;
      const boxId = o.consignmentId || `VP-PKG-${(o.orderNumber || '').replace('VP-', '')}`;
      const itemsDesc = (o.items || []).map((it) => `${it.productTitle} (${it.quantity})`).join('; ');
      const addr = o.shippingAddress || {};
      const fullAddr = `${addr.addressLine1 || addr.streetLine1 || ''} ${addr.addressLine2 || addr.streetLine2 || ''}`.trim();

      return [
        `"${o.orderNumber || ''}"`,
        `"${billId}"`,
        `"${boxId}"`,
        `"${formatDate(o.createdAt)}"`,
        `"${addr.fullName || 'Guest Devotee'}"`,
        `"${o.guestPhone || addr.phone || ''}"`,
        `"${o.guestEmail || addr.email || ''}"`,
        `"${fullAddr.replace(/"/g, '""')}"`,
        `"${addr.city || ''}"`,
        `"${addr.state || ''}"`,
        `"${addr.postalCode || ''}"`,
        `"${o.shippingCourier || 'Delhivery Express'}"`,
        `"${o.trackingNumber || 'PENDING'}"`,
        o.items?.length || 0,
        `"${itemsDesc.replace(/"/g, '""')}"`,
        o.grandTotal || 0,
        `"${o.status || 'PAID'}"`,
        `"PAID (Verified)"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VedaPavitra-Delivery-Bills-Manifest-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.(`Exported delivery bill manifest for ${sourceList.length} orders!`, 'success');
  };


  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const shouldGenBill = editStatus === 'PROCESSING' || editStatus === 'SHIPPED' || editStatus === 'PAID';
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          shippingCourier: editCourier,
          trackingNumber: editTracking,
          generateBill: shouldGenBill,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      showToast?.(`Order ${selectedOrder.orderNumber} updated to ${editStatus}!`, 'success');
      setSelectedOrder(data.order);
      setOrders((prev) =>
        prev.map((o) => (o.id === data.order.id ? data.order : o))
      );
    } catch (err) {
      showToast?.(err.message || 'Error updating order', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getCleanPhone = (order) => {
    const raw =
      order?.shippingAddress?.phone ||
      order?.guestPhone ||
      order?.phone ||
      '';
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length === 10) return `91${digits}`;
    if (digits.startsWith('0') && digits.length === 11) return `91${digits.slice(1)}`;
    return digits;
  };

  const getWhatsAppDispatchMessage = (order) => {
    const name = order.shippingAddress?.fullName || 'Devotee';
    const trackingLink = `${window.location.origin}/track-order?query=${encodeURIComponent(order.orderNumber)}`;

    return (
      `Namaste ${name} ji 🙏,\n\n` +
      `Warm spiritual blessings from *VedaPavitra*! 🪔\n\n` +
      `Your sacred pooja samagri order *${order.orderNumber}* has been sanctified & dispatched!\n\n` +
      `📦 *Consignment Box ID:* ${order.consignmentId || 'VP-PKG-2026'}\n` +
      `📜 *Delivery Bill Reference:* ${order.billId || 'VP-BILL-2026'}\n` +
      `🚚 *Courier Partner:* ${order.shippingCourier || 'Delhivery Express'}\n` +
      `📍 *Tracking AWB:* ${order.trackingNumber || 'Assigned in Transit'}\n\n` +
      `✨ *Live Devotee Parcel Tracking:*\n` +
      `${trackingLink}\n\n` +
      `May the divine fragrance bring peace, harmony, and spiritual prosperity to your home.\n\n` +
      `_Team VedaPavitra • Pure Vedic Samagri_\n` +
      `_Support: care@vedapavitra.com_`
    );
  };

  const handleSendWhatsAppNotification = async (order) => {
    const cleanPhone = getCleanPhone(order);
    const message = getWhatsAppDispatchMessage(order);

    if (!cleanPhone) {
      showToast?.('Customer phone number is missing for this order', 'error');
      return;
    }

    try {
      await fetch(`/api/admin/orders/${order.id}/whatsapp-dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const nowIso = new Date().toISOString();
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, whatsappNotifiedAt: nowIso, whatsappRecipient: cleanPhone } : o))
      );
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder((prev) => ({ ...prev, whatsappNotifiedAt: nowIso, whatsappRecipient: cleanPhone }));
      }
    } catch (err) {
      console.warn('Logging dispatch error:', err);
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast?.(`WhatsApp dispatch window opened for ${order.orderNumber}!`, 'success');
  };

  const handleCopyWhatsAppMessage = (order) => {
    const message = getWhatsAppDispatchMessage(order);
    navigator.clipboard?.writeText(message);
    showToast?.('WhatsApp dispatch message copied to clipboard!', 'success');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
      o.guestEmail?.toLowerCase().includes(q) ||
      o.guestPhone?.includes(q);
    return matchesStatus && matchesSearch;
  });

  const unacceptedCount = filteredOrders.filter((o) => !o.billId && o.status !== 'CANCELLED').length;
  const billedCount = filteredOrders.filter((o) => o.billId).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
            Orders & Fulfillment Pipeline
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            Batch accept customer orders, generate all parcel bills at once, print dispatch manifests, and manage delivery slips.
          </p>
        </div>

        <button
          onClick={loadOrdersList}
          className="btn btn-secondary"
          style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      {/* Batch Operations Bar */}
      <div
        style={{
          backgroundColor: '#1C1917',
          color: '#FAF7F2',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: '1px solid rgba(200, 130, 42, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(200, 130, 42, 0.2)',
              color: '#FCD34D',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            ⚡ Warehouse Bulk Pipeline
          </div>
          <span style={{ fontSize: '0.82rem', color: '#D6D3D1' }}>
            {selectedOrderIds.size > 0 ? (
              <span>
                <strong style={{ color: '#FCD34D' }}>{selectedOrderIds.size}</strong> of {filteredOrders.length} selected
              </span>
            ) : (
              <span>
                {filteredOrders.length} visible ({unacceptedCount} unbilled, {billedCount} ready for dispatch)
              </span>
            )}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Accept All / Accept Selected Orders Button */}
          <button
            type="button"
            disabled={isBatchUpdating || (selectedOrderIds.size === 0 && unacceptedCount === 0)}
            onClick={handleBatchAcceptOrders}
            style={{
              backgroundColor: isBatchUpdating ? '#78716C' : '#C8822A',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 15px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: isBatchUpdating || (selectedOrderIds.size === 0 && unacceptedCount === 0) ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(200, 130, 42, 0.35)',
              transition: 'all 0.2s',
            }}
            title="Batch accept all pending orders and generate their delivery bills and parcel IDs"
          >
            <CheckCircle2 size={15} />
            <span>
              {isBatchUpdating
                ? 'Accepting Orders...'
                : selectedOrderIds.size > 0
                ? `Accept Selected (${selectedOrderIds.size})`
                : `Accept All Orders (${unacceptedCount || filteredOrders.length})`}
            </span>
          </button>

          {/* Generate & Print All Bills at Once */}
          <button
            type="button"
            onClick={() => handlePrintAllBills('slips')}
            disabled={filteredOrders.length === 0}
            style={{
              backgroundColor: '#292524',
              color: '#FAF7F2',
              border: '1px solid #78716C',
              borderRadius: '8px',
              padding: '9px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            title="Generate & print all delivery bill slips at once with barcodes, addresses, and manifest"
          >
            <Printer size={15} color="#E09C48" />
            <span>
              {selectedOrderIds.size > 0
                ? `Print Selected Bills (${selectedOrderIds.size})`
                : `Generate All Bills (${filteredOrders.length})`}
            </span>
          </button>

          {/* Master Manifest Sheet Button */}
          <button
            type="button"
            onClick={() => handlePrintAllBills('manifest')}
            disabled={filteredOrders.length === 0}
            style={{
              backgroundColor: '#292524',
              color: '#FAF7F2',
              border: '1px solid #78716C',
              borderRadius: '8px',
              padding: '9px 13px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="View & print single-sheet consolidated dispatch manifest table"
          >
            <FileText size={15} color="#A8A29E" />
            <span>All Bills Manifest</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportBillsCSV}
            disabled={filteredOrders.length === 0}
            style={{
              backgroundColor: '#292524',
              color: '#FAF7F2',
              border: '1px solid #78716C',
              borderRadius: '8px',
              padding: '9px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
            title="Export CSV of all generated bills with addresses & tracking numbers"
          >
            <Download size={14} color="#A8A29E" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #EAE3D6',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: filterStatus === st ? '1px solid #C8822A' : '1px solid #EAE3D6',
                backgroundColor: filterStatus === st ? '#C8822A' : '#FFF',
                color: filterStatus === st ? '#FFF' : '#44403C',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#A8A29E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, name, phone..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #D6D3D1',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #EAE3D6',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#78716C' }}>
            <Package size={40} color="#C8822A" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
              No orders found
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              Orders will appear here as customers complete checkout on the storefront.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF7F2', textAlign: 'left', borderBottom: '1px solid #EAE3D6' }}>
                  <th style={{ width: '42px', padding: '14px 12px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      aria-label="Select all orders"
                      checked={selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleToggleSelectAll}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#C8822A' }}
                    />
                  </th>
                  <th style={{ padding: '14px 14px' }}>Order Number</th>
                  <th style={{ padding: '14px 14px' }}>Date</th>
                  <th style={{ padding: '14px 14px' }}>Customer</th>
                  <th style={{ padding: '14px 14px' }}>Total Amount</th>
                  <th style={{ padding: '14px 14px' }}>Status</th>
                  <th style={{ padding: '14px 14px' }}>Delivery Bill & Parcel ID</th>
                  <th style={{ padding: '14px 14px' }}>Courier / Tracking</th>
                  <th style={{ padding: '14px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F5F1EB', backgroundColor: selectedOrderIds.has(order.id) ? '#FFFBEB' : 'transparent' }}>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        aria-label={`Select order ${order.orderNumber}`}
                        checked={selectedOrderIds.has(order.id)}
                        onChange={() => handleToggleSelectOrder(order.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#C8822A' }}
                      />
                    </td>
                    <td style={{ padding: '14px 14px', fontWeight: 600, color: '#1C1917' }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ padding: '14px 14px', color: '#78716C', fontSize: '0.8rem' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#1C1917' }}>
                        {order.shippingAddress?.fullName || 'Guest Devotee'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#78716C' }}>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                      </div>
                    </td>
                    <td style={{ padding: '14px 14px', fontWeight: 700, color: '#1C1917' }}>
                      {formatPrice(order.grandTotal)}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontWeight: 600,
                          backgroundColor:
                            order.status === 'DELIVERED'
                              ? '#DCFCE7'
                              : order.status === 'SHIPPED'
                              ? '#E0E7FF'
                              : order.status === 'CANCELLED'
                              ? '#FEE2E2'
                              : '#FEF3C7',
                          color:
                            order.status === 'DELIVERED'
                              ? '#166534'
                              : order.status === 'SHIPPED'
                              ? '#3730A3'
                              : order.status === 'CANCELLED'
                              ? '#991B1B'
                              : '#92400E',
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      {order.billId ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={13} color="#C8822A" />
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#C8822A', fontSize: '0.82rem' }}>
                              {order.billId}
                            </span>
                          </div>
                          {order.consignmentId && (
                            <span style={{ fontSize: '0.72rem', color: '#78716C', fontFamily: 'monospace', display: 'block' }}>
                              Box: {order.consignmentId}
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAcceptOrder(order)}
                          className="btn btn-primary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.72rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <CheckCircle2 size={12} /> Accept & Gen Bill
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '14px 14px', fontSize: '0.8rem', color: '#57534E' }}>
                      {order.trackingNumber ? (
                        <div>
                          <div>{order.shippingCourier || 'Delhivery'}</div>
                          <span style={{ fontFamily: 'monospace', color: '#C8822A', fontWeight: 600 }}>
                            {order.trackingNumber}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#A8A29E' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {order.billId ? (
                          <button
                            type="button"
                            onClick={() => handlePrintIndividualBill(order)}
                            title="Print delivery slip to attach to parcel"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 10px',
                              fontSize: '0.75rem',
                              backgroundColor: '#FAF0E4',
                              border: '1px solid #E8D5BF',
                              borderRadius: '6px',
                              color: '#8C5816',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            <Printer size={13} /> Bill
                          </button>
                        ) : null}

                        {/* 1-Click WhatsApp Button in table */}
                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppNotification(order)}
                          title={
                            order.whatsappNotifiedAt
                              ? `WhatsApp sent on ${formatDate(order.whatsappNotifiedAt)}. Click to send again.`
                              : '1-Click Notify Devotee on WhatsApp'
                          }
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            backgroundColor: order.whatsappNotifiedAt ? '#F0FDF4' : '#DCFCE7',
                            border: `1px solid ${order.whatsappNotifiedAt ? '#86EFAC' : '#4ADE80'}`,
                            borderRadius: '6px',
                            color: '#15803D',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          <MessageCircle size={13} color="#16A34A" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleOpenOrder(order)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail & Status Update Drawer / Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#FFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #EAE3D6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', margin: 0 }}>
                  Order {selectedOrder.orderNumber}
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#78716C' }}>
                  Placed on {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B635B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              {/* Delivery Bill & Parcel ID Card */}
              <div
                style={{
                  backgroundColor: selectedOrder.billId ? '#F0FDF4' : '#FFFBEB',
                  border: `1px solid ${selectedOrder.billId ? '#BBF7D0' : '#FDE68A'}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color={selectedOrder.billId ? '#16A34A' : '#D97706'} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: selectedOrder.billId ? '#166534' : '#92400E' }}>
                      {selectedOrder.billId ? 'Delivery Bill & Consignment Box' : 'Pending Order Acceptance'}
                    </span>
                  </div>
                  {selectedOrder.billId && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      READY FOR DISPATCH
                    </span>
                  )}
                </div>

                {selectedOrder.billId ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '10px 0 14px' }}>
                      <div style={{ backgroundColor: '#FFF', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Delivery Bill ID</div>
                        <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#166534', fontSize: '0.85rem' }}>{selectedOrder.billId}</div>
                      </div>
                      <div style={{ backgroundColor: '#FFF', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Parcel Box ID</div>
                        <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>{selectedOrder.consignmentId || 'VP-PKG-GEN'}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePrintIndividualBill(selectedOrder)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#166534',
                        color: '#FFF',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(22,101,52,0.2)',
                      }}
                    >
                      <Printer size={16} /> Print Delivery Slip & Parcel Label
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.82rem', color: '#78350F', margin: '0 0 12px', lineHeight: 1.4 }}>
                      Accepting this order automatically generates a sacred Bill ID, Consignment Parcel identifier, and prepares the printable dispatch manifest for the delivery parcel.
                    </p>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleAcceptOrder(selectedOrder)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#C8822A',
                        color: '#FFF',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <CheckCircle2 size={16} /> {isUpdating ? 'Accepting Order...' : 'Accept Order & Issue Delivery Bill'}
                    </button>
                  </div>
                )}
              </div>

              {/* 1-Click WhatsApp Dispatch Card */}
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#25D366',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                      }}
                    >
                      <MessageCircle size={16} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#166534' }}>
                        1-Click WhatsApp Dispatch Notification
                      </span>
                    </div>
                  </div>

                  {selectedOrder.whatsappNotifiedAt ? (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        border: '1px solid #86EFAC',
                      }}
                    >
                      ✓ SENT {formatDate(selectedOrder.whatsappNotifiedAt)}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      READY TO SEND
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#166534', margin: '0 0 10px', lineHeight: 1.4 }}>
                  Send an auspicious order dispatch update directly to devotee on WhatsApp with live tracking link and consignment details.
                </p>

                {/* Recipient Phone info */}
                <div
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid #DCFCE7',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#4B5563' }}>
                    Recipient Phone: <strong>+{getCleanPhone(selectedOrder) || 'No phone recorded'}</strong>
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
                    {selectedOrder.shippingAddress?.fullName || 'Devotee'}
                  </span>
                </div>

                {/* Message preview snippet */}
                <div
                  style={{
                    backgroundColor: '#DCFCE7',
                    borderLeft: '3px solid #16A34A',
                    padding: '8px 12px',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '0.75rem',
                    color: '#14532D',
                    marginBottom: '14px',
                    fontFamily: 'monospace',
                    lineHeight: 1.4,
                  }}
                >
                  &ldquo;Namaste {selectedOrder.shippingAddress?.fullName || 'Devotee'} ji 🙏, Warm spiritual blessings from VedaPavitra! Order *{selectedOrder.orderNumber}* has been sanctified & dispatched...&rdquo;
                </div>

                {/* Action buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppNotification(selectedOrder)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      backgroundColor: '#25D366',
                      color: '#FFF',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(37, 211, 102, 0.35)',
                    }}
                  >
                    <Send size={15} />
                    <span>Send on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyWhatsAppMessage(selectedOrder)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 12px',
                      backgroundColor: '#FFF',
                      color: '#166534',
                      border: '1px solid #86EFAC',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Copy size={14} />
                    <span>Copy Text</span>
                  </button>
                </div>
              </div>

              {/* Status Update Form */}
              <form
                onSubmit={handleUpdateStatus}
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #EAE3D6',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1C1917', marginBottom: '14px' }}>
                  Update Fulfillment Status
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Status Stage
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.85rem',
                        backgroundColor: '#FFF',
                      }}
                    >
                      <option value="PAID">PAID (Order Confirmed)</option>
                      <option value="PROCESSING">PROCESSING (Packing in Atelier)</option>
                      <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                      <option value="DELIVERED">DELIVERED (Fulfilled)</option>
                      <option value="CANCELLED">CANCELLED (Refunded)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      value={editCourier}
                      onChange={(e) => setEditCourier(e.target.value)}
                      placeholder="e.g. Delhivery Express, BlueDart"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      AWB / Tracking Number
                    </label>
                    <input
                      type="text"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      placeholder="e.g. DELH-9876543210"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                  >
                    {isUpdating ? 'Saving Changes...' : 'Save & Update Tracking'}
                  </button>
                </div>
              </form>

              {/* Order Items Snapshot */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1C1917', marginBottom: '12px' }}>
                  Items in this Order ({selectedOrder.items?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        border: '1px solid #EAE3D6',
                        borderRadius: '8px',
                        backgroundColor: item.isGift ? '#FFFBEB' : '#FFF',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=""
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1917' }}>
                            {item.productTitle} {item.isGift && <span style={{ color: '#D97706', fontSize: '0.75rem' }}>(Free Gift)</span>}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#78716C' }}>
                            {item.variantTitle} × {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {item.isGift ? 'FREE' : formatPrice(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '8px', border: '1px solid #EAE3D6' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                  Delivery Destination
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#44403C', lineHeight: 1.5 }}>
                  <strong>{selectedOrder.shippingAddress?.fullName}</strong><br />
                  {selectedOrder.shippingAddress?.addressLine1}<br />
                  {selectedOrder.shippingAddress?.addressLine2 && <>{selectedOrder.shippingAddress?.addressLine2}<br /></>}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}<br />
                  Phone: {selectedOrder.guestPhone || selectedOrder.shippingAddress?.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Delivery Bills & Master Consignment Packing Slips Modal */}
      {printingOrders.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
          className="delivery-slip-modal-backdrop"
        >
          {/* Print Specific CSS with multi-page slip breaks */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-delivery-bills-container, #printable-delivery-bills-container * {
                visibility: visible !important;
              }
              #printable-delivery-bills-container {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #000000 !important;
                box-shadow: none !important;
              }
              .bill-page-slip {
                page-break-after: always !important;
                break-after: page !important;
                margin: 0 0 24px 0 !important;
                padding: 24px !important;
                border: 2px solid #000 !important;
                background: #ffffff !important;
                box-shadow: none !important;
              }
              .bill-page-slip:last-child {
                page-break-after: auto !important;
                break-after: auto !important;
              }
              .manifest-sheet-page {
                padding: 16px !important;
                background: #ffffff !important;
                color: #000000 !important;
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
              maxWidth: printViewTab === 'manifest' ? '980px' : '820px',
              width: '100%',
              maxHeight: '94vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              transition: 'max-width 0.2s ease',
            }}
          >
            {/* Modal Actions Header (Non-Printable) */}
            <div
              className="no-print"
              style={{
                padding: '16px 24px',
                backgroundColor: '#1C1917',
                color: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid rgba(200, 130, 42, 0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(200, 130, 42, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Printer size={18} color="#E09C48" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                    {printingOrders.length === 1
                      ? `Delivery Bill: ${printingOrders[0].orderNumber}`
                      : `Batch Delivery Bills (${printingOrders.length} Orders at Once)`}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#A8A29E' }}>
                    {printingOrders.length === 1
                      ? 'Print and attach to the exterior parcel box'
                      : 'All parcel bills generated at once. Each prints cleanly on its own sheet.'}
                  </span>
                </div>
              </div>

              {/* View Switcher Tabs (Parcel Slips vs Master Manifest Table) */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#292524',
                  padding: '3px',
                  borderRadius: '8px',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPrintViewTab('slips')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: printViewTab === 'slips' ? '#C8822A' : 'transparent',
                    color: printViewTab === 'slips' ? '#FFF' : '#A8A29E',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <FileText size={13} />
                  <span>Parcel Slips ({printingOrders.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintViewTab('manifest')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: printViewTab === 'manifest' ? '#C8822A' : 'transparent',
                    color: printViewTab === 'manifest' ? '#FFF' : '#A8A29E',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <List size={13} />
                  <span>Master Manifest Sheet</span>
                </button>
              </div>

              {/* Header Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(200, 130, 42, 0.4)',
                  }}
                >
                  <Printer size={15} />
                  <span>{printViewTab === 'slips' ? `Print All Bills (${printingOrders.length})` : 'Print Manifest Sheet'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportBillsCSV}
                  style={{
                    backgroundColor: '#292524',
                    color: '#FAF7F2',
                    border: '1px solid #78716C',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  title="Export CSV of all generated bills"
                >
                  <Download size={14} />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintingOrders([])}
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

            {/* The Actual Printable Container */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                backgroundColor: '#F8F6F0',
                flex: 1,
              }}
            >
              <div id="printable-delivery-bills-container">
                {printViewTab === 'manifest' ? (
                  /* ======================================================== */
                  /* Consolidated Master Manifest Table Sheet View            */
                  /* ======================================================== */
                  <div
                    className="manifest-sheet-page"
                    style={{
                      backgroundColor: '#FFF',
                      padding: '28px',
                      borderRadius: '12px',
                      border: '1.5px solid #292524',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      color: '#1C1917',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {/* Manifest Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom: '2px solid #1C1917',
                        paddingBottom: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'Georgia, serif',
                              fontSize: '1.5rem',
                              fontWeight: 800,
                              letterSpacing: '-0.02em',
                              color: '#1C1917',
                            }}
                          >
                            VEDAPAVITRA
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              border: '1px solid #C8822A',
                              color: '#C8822A',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Sacred Vedic Atelier
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#57534E', lineHeight: 1.4 }}>
                          Warehouse Daily Outward Dispatch Manifest & Courier Handover Log Sheet<br />
                          Shri Kashi Vishwanath Marg, Varanasi, Uttar Pradesh - 221001 | GSTIN: 09AABCV1234F1Z8
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            backgroundColor: '#1C1917',
                            color: '#FFF',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            letterSpacing: '0.05em',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Official Dispatch Manifest
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#44403C' }}>
                          Generated: <strong>{formatDate(new Date().toISOString())}</strong>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#166534', fontWeight: 600 }}>
                          Status: ALL VERIFIED & CONSECRATED
                        </div>
                      </div>
                    </div>

                    {/* Summary KPI Badges */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px',
                        backgroundColor: '#FAF7F2',
                        border: '1.5px solid #D6D3D1',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '18px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                          Total Parcels
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#1C1917' }}>
                          {printingOrders.length} Boxes
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                          Total Manifest Value
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#C8822A' }}>
                          {formatPrice(printingOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0))}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                          Courier Logistics Partner
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 700, color: '#1C1917' }}>
                          Delhivery Express
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                          Purity Assurance
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>
                          ✓ Gangajal Consecrated
                        </span>
                      </div>
                    </div>

                    {/* Consolidated Table */}
                    <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#1C1917', color: '#FFF', textAlign: 'left' }}>
                            <th style={{ padding: '7px 8px', borderRadius: '4px 0 0 0' }}>#</th>
                            <th style={{ padding: '7px 8px' }}>Order #</th>
                            <th style={{ padding: '7px 8px' }}>Delivery Bill ID</th>
                            <th style={{ padding: '7px 8px' }}>Box ID</th>
                            <th style={{ padding: '7px 8px' }}>Recipient & Phone</th>
                            <th style={{ padding: '7px 8px' }}>Destination</th>
                            <th style={{ padding: '7px 8px' }}>AWB Tracking</th>
                            <th style={{ padding: '7px 8px', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '7px 8px', textAlign: 'center', borderRadius: '0 4px 0 0' }}>Agent Sign</th>
                          </tr>
                        </thead>
                        <tbody>
                          {printingOrders.map((ord, idx) => {
                            const bId = ord.billId || `VP-BILL-2026-${(ord.orderNumber || ord.id).replace('VP-', '').slice(-5).toUpperCase()}`;
                            const cId = ord.consignmentId || `VP-PKG-${(ord.orderNumber || ord.id).replace('VP-', '').toUpperCase()}`;
                            const trk = ord.trackingNumber || `DELH-VP-${(ord.orderNumber || ord.id).replace('VP-', '')}`;
                            const addr = ord.shippingAddress || {};
                            return (
                              <tr key={ord.id || idx} style={{ borderBottom: '1px solid #EAE3D6' }}>
                                <td style={{ padding: '7px 8px', color: '#78716C' }}>{idx + 1}</td>
                                <td style={{ padding: '7px 8px', fontWeight: 700, color: '#1C1917' }}>{ord.orderNumber}</td>
                                <td style={{ padding: '7px 8px', fontFamily: 'monospace', color: '#C8822A', fontWeight: 700 }}>{bId}</td>
                                <td style={{ padding: '7px 8px', fontFamily: 'monospace', color: '#44403C' }}>{cId}</td>
                                <td style={{ padding: '7px 8px' }}>
                                  <div style={{ fontWeight: 600, color: '#1C1917' }}>{addr.fullName || 'Guest Devotee'}</div>
                                  <div style={{ fontSize: '0.7rem', color: '#78716C' }}>{ord.guestPhone || addr.phone || '-'}</div>
                                </td>
                                <td style={{ padding: '7px 8px', fontSize: '0.72rem', color: '#57534E' }}>
                                  {addr.city || 'City'}, {addr.state || 'State'} - {addr.postalCode || ''}
                                </td>
                                <td style={{ padding: '7px 8px', fontFamily: 'monospace', fontSize: '0.74rem', color: '#1C1917' }}>
                                  {trk}
                                </td>
                                <td style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, color: '#1C1917' }}>
                                  {formatPrice(ord.grandTotal)}
                                </td>
                                <td style={{ padding: '7px 8px', textAlign: 'center', borderLeft: '1px dashed #D6D3D1' }}>
                                  <div style={{ borderBottom: '1px solid #94A3B8', width: '60px', height: '14px', margin: '0 auto' }} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Handover Verification Sign-off Block */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        border: '1.5px solid #D6D3D1',
                        borderRadius: '8px',
                        padding: '14px 18px',
                        backgroundColor: '#FAF7F2',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#78716C', marginBottom: '4px' }}>
                          DISPATCHED BY (ATELIER FULFILLMENT DESK)
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C1917' }}>
                          VedaPavitra Consecration Center, Varanasi
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#57534E', marginTop: '4px' }}>
                          Consecrated under sacred Gandhashastra guidelines.<br />
                          Sign: __________________________ Date: _____________
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#C8822A', marginBottom: '4px' }}>
                          RECEIVED BY COURIER LOGISTICS PARTNER
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C1917' }}>
                          Delhivery Express Authorized Pickup Agent
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#57534E', marginTop: '4px' }}>
                          Agent Name / Badge: _______________________________<br />
                          Signature: ______________________ Time: _____________
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ======================================================== */
                  /* Multi-Order Parcel Slips View (Each with Page Break)     */
                  /* ======================================================== */
                  printingOrders.map((ord, oIdx) => {
                    const billId = ord.billId || `VP-BILL-2026-${(ord.orderNumber || ord.id).replace('VP-', '').slice(-5).toUpperCase()}`;
                    const consignmentId = ord.consignmentId || `VP-PKG-${(ord.orderNumber || ord.id).replace('VP-', '').toUpperCase()}`;
                    const courier = ord.shippingCourier || 'Delhivery Express';
                    const trackingNumber = ord.trackingNumber || `DELH-VP-${(ord.orderNumber || ord.id).replace('VP-', '')}`;
                    const addr = ord.shippingAddress || {};
                    const isLast = oIdx === printingOrders.length - 1;

                    return (
                      <div
                        key={ord.id || oIdx}
                        className="bill-page-slip"
                        style={{
                          backgroundColor: '#FFF',
                          padding: '30px',
                          borderRadius: '12px',
                          border: '1.5px solid #292524',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                          color: '#1C1917',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          marginBottom: isLast ? 0 : '28px',
                        }}
                      >
                        {/* Header Section */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            borderBottom: '2px solid #1C1917',
                            paddingBottom: '18px',
                            marginBottom: '18px',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontFamily: 'Georgia, serif',
                                  fontSize: '1.55rem',
                                  fontWeight: 800,
                                  letterSpacing: '-0.02em',
                                  color: '#1C1917',
                                }}
                              >
                                VEDAPAVITRA
                              </span>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  border: '1px solid #C8822A',
                                  color: '#C8822A',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Sacred Vedic Atelier
                              </span>
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#57534E', lineHeight: 1.4 }}>
                              Vedic Heritage Artisans & Sacred Consecrations<br />
                              Shri Kashi Vishwanath Marg, Varanasi, Uttar Pradesh - 221001<br />
                              GSTIN: 09AABCV1234F1Z8 | support@vedapavitra.com
                            </p>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                display: 'inline-block',
                                padding: '5px 11px',
                                backgroundColor: '#1C1917',
                                color: '#FFF',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                letterSpacing: '0.06em',
                                borderRadius: '4px',
                                marginBottom: '5px',
                                textTransform: 'uppercase',
                              }}
                            >
                              Delivery Bill & Manifest
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#44403C' }}>
                              Date: <strong>{formatDate(ord.createdAt || new Date().toISOString())}</strong>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#44403C' }}>
                              Payment: <strong>PREPAID (Verified)</strong>
                            </div>
                          </div>
                        </div>

                        {/* Tracking & Parcel Identifiers Box */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            backgroundColor: '#FAF7F2',
                            border: '1.5px solid #D6D3D1',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '18px',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                              Delivery Bill No.
                            </span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 800, color: '#9B3828' }}>
                              {billId}
                            </span>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                              Parcel Box ID
                            </span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 800, color: '#1C1917' }}>
                              {consignmentId}
                            </span>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: '#78716C', display: 'block' }}>
                              Courier & AWB Tracking
                            </span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 700, color: '#1C1917' }}>
                              {courier}: {trackingNumber}
                            </span>
                          </div>
                        </div>

                        {/* Simulated Barcode for Box Attachment */}
                        <div
                          style={{
                            border: '1px dashed #A8A29E',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            backgroundColor: '#FFF',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.68rem', color: '#78716C', fontWeight: 700, textTransform: 'uppercase' }}>
                              Consignment Barcode (Scan for Inwarding / Handover)
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'stretch',
                                gap: '2px',
                                height: '34px',
                                margin: '5px 0 3px',
                              }}
                              aria-label="Parcel Barcode"
                            >
                              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 4, 3, 2, 1, 3, 4, 1, 2, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4].map((w, bIdx) => (
                                <div
                                  key={bIdx}
                                  style={{
                                    width: `${w * 2}px`,
                                    backgroundColor: bIdx % 2 === 0 ? '#1C1917' : '#FFF',
                                  }}
                                />
                              ))}
                            </div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.2em', color: '#44403C', fontWeight: 700 }}>
                              *{consignmentId}*
                            </span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                              <ShieldCheck size={14} /> GANGAJAL CONSECRATED
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#78716C', maxWidth: '180px', marginTop: '2px' }}>
                              Pure brass & sacred pooja samagri. Handle with respectful care.
                            </div>
                          </div>
                        </div>

                        {/* Routing: From and To addresses */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '18px',
                            border: '1.5px solid #EAE3D6',
                            borderRadius: '8px',
                            padding: '14px',
                            marginBottom: '20px',
                          }}
                        >
                          <div style={{ borderRight: '1px solid #EAE3D6', paddingRight: '14px' }}>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#78716C', marginBottom: '4px' }}>
                              DISPATCH FROM (ATELIER)
                            </div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1C1917' }}>
                              VedaPavitra Consecration Center
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#44403C', lineHeight: 1.4, marginTop: '2px' }}>
                              Dashashwamedh Ghat Marg, Kashi<br />
                              Varanasi, Uttar Pradesh - 221001<br />
                              Authorized Dispatcher: Pandit R. K. Shastri
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#C8822A', marginBottom: '4px' }}>
                              SHIP & DELIVER TO (RECIPIENT)
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1917' }}>
                              {addr.fullName || 'Valued Devotee'}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#1C1917', lineHeight: 1.4, marginTop: '2px' }}>
                              {addr.addressLine1 || addr.streetLine1}<br />
                              {(addr.addressLine2 || addr.streetLine2) && <>{addr.addressLine2 || addr.streetLine2}<br /></>}
                              <strong style={{ fontSize: '0.86rem' }}>
                                {addr.city}, {addr.state} - {addr.postalCode}
                              </strong><br />
                              <span style={{ fontWeight: 600 }}>Phone: {ord.guestPhone || addr.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Manifest Table */}
                        <div style={{ marginBottom: '18px' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#44403C', marginBottom: '6px' }}>
                            Package Contents & Manifest Summary
                          </div>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#1C1917', color: '#FFF' }}>
                                <th style={{ padding: '7px 9px', textAlign: 'left', borderRadius: '4px 0 0 0' }}>#</th>
                                <th style={{ padding: '7px 9px', textAlign: 'left' }}>Sacred Item</th>
                                <th style={{ padding: '7px 9px', textAlign: 'center' }}>Variant</th>
                                <th style={{ padding: '7px 9px', textAlign: 'center' }}>Qty</th>
                                <th style={{ padding: '7px 9px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ord.items?.map((item, iIdx) => (
                                <tr key={iIdx} style={{ borderBottom: '1px solid #EAE3D6' }}>
                                  <td style={{ padding: '8px 9px', color: '#78716C' }}>{iIdx + 1}</td>
                                  <td style={{ padding: '8px 9px', fontWeight: 600, color: '#1C1917' }}>
                                    {item.productTitle} {item.isGift && <span style={{ color: '#D97706', fontSize: '0.7rem' }}>(Complimentary Gift)</span>}
                                  </td>
                                  <td style={{ padding: '8px 9px', textAlign: 'center', color: '#57534E' }}>{item.variantTitle || 'Standard'}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                                  <td style={{ padding: '8px 9px', textAlign: 'right', fontWeight: 700 }}>
                                    {item.isGift ? 'FREE' : formatPrice(item.totalPrice)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Financial Summary & Sanctification Signoff */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', alignItems: 'flex-start' }}>
                          <div style={{ border: '1px solid #E8D5BF', borderRadius: '8px', padding: '10px 12px', backgroundColor: '#FDFCF9' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C8822A', marginBottom: '3px' }}>
                              Atelier Consecration & Seal of Purity
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#6B635B', margin: 0, lineHeight: 1.4 }}>
                              This parcel contains consecrated items from sacred traditions. Inspected, sanctified with pure Gangajal, and dispatched under strict Vedic guidelines.
                            </p>
                            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '6px', borderTop: '1px dashed #D6D3D1' }}>
                              <div>
                                <div style={{ fontSize: '0.66rem', color: '#78716C' }}>Packed by: Team Kashi Atelier</div>
                                <div style={{ fontSize: '0.66rem', color: '#78716C' }}>Order Ref: {ord.orderNumber}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.82rem', color: '#1C1917', fontWeight: 700 }}>
                                  Om Namah Shivaya
                                </div>
                                <div style={{ fontSize: '0.64rem', color: '#78716C' }}>Authorized Signatory</div>
                              </div>
                            </div>
                          </div>

                          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '8px', padding: '12px 14px', border: '1px solid #EAE3D6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#57534E', marginBottom: '4px' }}>
                              <span>Items Subtotal:</span>
                              <span>{formatPrice(ord.subtotal || ord.grandTotal)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#57534E', marginBottom: '4px' }}>
                              <span>Sacred Courier Delivery:</span>
                              <span style={{ color: '#166534', fontWeight: 600 }}>FREE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#57534E', marginBottom: '6px' }}>
                              <span>Taxes & Duties (GST incl.):</span>
                              <span>₹0.00 (All Incl.)</span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.95rem',
                                fontWeight: 800,
                                color: '#1C1917',
                                borderTop: '1.5px solid #1C1917',
                                paddingTop: '6px',
                              }}
                            >
                              <span>Total Paid:</span>
                              <span style={{ color: '#C8822A' }}>{formatPrice(ord.grandTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
