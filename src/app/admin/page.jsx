import React from 'react';
import Link from '@/components/common/Link';
import { db } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Users, AlertTriangle, ArrowRight, Package, CheckCircle2, Clock } from 'lucide-react';

export const metadata = {
  title: 'Executive Store Overview | VedaPavitra Admin',
};

export default function AdminOverviewPage() {
  const metrics = db.getAdminMetrics();
  const allOrders = db.getOrders();
  const products = db.getAllProductsAdmin();

  // Find low stock variants
  const lowStockItems = products
    .flatMap((p) =>
      p.variants.map((v) => ({
        productId: p.id,
        productTitle: p.title,
        variantTitle: v.title,
        sku: v.sku,
        stockQuantity: v.stockQuantity,
      }))
    )
    .filter((v) => v.stockQuantity <= 25)
    .slice(0, 5);

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="heading-display" style={{ fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
          Store Performance Overview
        </h1>
        <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
          Real-time metrics, live fulfillment queue, and inventory alerts.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {/* Gross Revenue */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
              Gross Revenue
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>
            {formatPrice(metrics.totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 500 }}>
            +18.4% compared to previous month
          </div>
        </div>

        {/* Total Orders */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Orders
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#FAF0E4',
                color: '#C8822A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>
            {metrics.totalOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B635B' }}>
            All-time customer transactions
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
              Average Order Value
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#E0E7FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>
            {formatPrice(metrics.averageOrderValue || 749)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B635B' }}>
            Free gift threshold: ₹599
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase' }}>
              Low Stock Alerts
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#B45309', marginBottom: '4px' }}>
            {metrics.lowStockCount || lowStockItems.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#B45309' }}>
            Variants with &le; 25 units remaining
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Inventory Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Recent Orders Section */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#1C1917', margin: 0 }}>
              Recent Customer Orders
            </h2>
            <Link
              href="/admin/orders"
              style={{
                fontSize: '0.8125rem',
                color: '#C8822A',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          {allOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#78716C', fontSize: '0.875rem' }}>
              No orders placed yet. Place an order from the storefront to see it here!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF7F2', textAlign: 'left', borderBottom: '1px solid #EAE3D6' }}>
                    <th style={{ padding: '10px 12px' }}>Order #</th>
                    <th style={{ padding: '10px 12px' }}>Customer</th>
                    <th style={{ padding: '10px 12px' }}>Amount</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.slice(0, 6).map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F5F1EB' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>
                        <Link href={`/admin/orders?search=${order.orderNumber}`} style={{ color: '#C8822A', textDecoration: 'none' }}>
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{order.shippingAddress?.fullName || 'Guest Customer'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C' }}>{order.guestEmail || 'customer@vedapavitra.com'}</div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{formatPrice(order.grandTotal)}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            backgroundColor:
                              order.status === 'DELIVERED'
                                ? '#DCFCE7'
                                : order.status === 'SHIPPED'
                                ? '#E0E7FF'
                                : '#FEF3C7',
                            color:
                              order.status === 'DELIVERED'
                                ? '#166534'
                                : order.status === 'SHIPPED'
                                ? '#3730A3'
                                : '#92400E',
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#78716C', fontSize: '0.75rem' }}>
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock & Operational Actions Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Low Stock Widget */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', margin: 0 }}>
                Inventory Need Attention
              </h3>
              <Link href="/admin/products" style={{ fontSize: '0.78rem', color: '#C8822A', textDecoration: 'none' }}>
                Manage All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lowStockItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #EAE3D6',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1C1917' }}>
                      {item.productTitle}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#78716C' }}>
                      {item.variantTitle} ({item.sku})
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: item.stockQuantity <= 10 ? '#DC2626' : '#D97706',
                    }}
                  >
                    {item.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operations Widget */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', marginBottom: '16px' }}>
              Quick Storefront Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/admin/orders"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF7F2',
                  color: '#1C1917',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <span>Fulfill & Ship Orders</span>
                <ArrowRight size={14} color="#C8822A" />
              </Link>
              <Link
                href="/admin/promotions"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF7F2',
                  color: '#1C1917',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <span>Manage Coupons & Offers</span>
                <ArrowRight size={14} color="#C8822A" />
              </Link>
              <Link
                href="/admin/products"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF7F2',
                  color: '#1C1917',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <span>Adjust Stock Quantities</span>
                <ArrowRight size={14} color="#C8822A" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 📐 Master Storefront Media Dimensions & Fixed Size Upload Specs */}
      <div
        style={{
          marginTop: '36px',
          backgroundColor: '#FFF',
          border: '1.5px solid #EAE3D6',
          borderRadius: '16px',
          padding: '24px 28px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.3rem' }}>📐</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#1C1917' }}>
                Storefront Media Dimensions & Fixed Size Upload Guidelines
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.825rem', color: '#6B635B' }}>
                Adhere strictly to these exact pixel dimensions when uploading photos to preserve razor-sharp visuals and layout harmony.
              </p>
            </div>
          </div>
          <span
            style={{
              backgroundColor: '#FAF0E4',
              color: '#C8822A',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Admin Quality Standard
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EAE3D6', textAlign: 'left', color: '#78716C', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Asset Category</th>
                <th style={{ padding: '12px 14px' }}>Required Fixed Dimensions</th>
                <th style={{ padding: '12px 14px' }}>Aspect Ratio</th>
                <th style={{ padding: '12px 14px' }}>Max Size & Format</th>
                <th style={{ padding: '12px 14px' }}>Storefront Placement</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Manage</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F5F1EB' }}>
                <td style={{ padding: '14px', fontWeight: 600, color: '#1C1917' }}>
                  🖼️ Homepage Hero Slider
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#9B3828' }}>
                  1920 × 800 px
                </td>
                <td style={{ padding: '14px', color: '#6B635B' }}>16:9 / 12:5 Widescreen</td>
                <td style={{ padding: '14px', color: '#6B635B' }}>&lt; 2.0 MB • WebP / JPG</td>
                <td style={{ padding: '14px', color: '#78716C' }}>Main Storefront Header Carousel</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <Link href="/admin/banners" style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}>
                    Edit Banners →
                  </Link>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F5F1EB', backgroundColor: '#FAF8F5' }}>
                <td style={{ padding: '14px', fontWeight: 600, color: '#1C1917' }}>
                  🎁 Festive Hamper Box Feature
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#C8822A' }}>
                  1000 × 1000 px <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#78716C' }}>(or 1200×1200)</span>
                </td>
                <td style={{ padding: '14px', color: '#6B635B' }}>1:1 Perfect Square</td>
                <td style={{ padding: '14px', color: '#6B635B' }}>&lt; 2.5 MB • WebP / JPG</td>
                <td style={{ padding: '14px', color: '#78716C' }}>Homepage Mid-Section Sacred Hamper</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <Link href="/admin/banners" style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}>
                    Edit Hamper →
                  </Link>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F5F1EB' }}>
                <td style={{ padding: '14px', fontWeight: 600, color: '#1C1917' }}>
                  🏷️ Reserved Seasonal Strip Banner
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#9B3828' }}>
                  1920 × 450 px
                </td>
                <td style={{ padding: '14px', color: '#6B635B' }}>4.2:1 Panoramic Strip</td>
                <td style={{ padding: '14px', color: '#6B635B' }}>&lt; 2.0 MB • WebP / JPG</td>
                <td style={{ padding: '14px', color: '#78716C' }}>Reserved Mid-Page Festival Offer</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <Link href="/admin/banners" style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}>
                    Manage Strips →
                  </Link>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F5F1EB' }}>
                <td style={{ padding: '14px', fontWeight: 600, color: '#1C1917' }}>
                  📦 Product Catalog Photos
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#1C1917' }}>
                  800 × 800 px
                </td>
                <td style={{ padding: '14px', color: '#6B635B' }}>1:1 Perfect Square</td>
                <td style={{ padding: '14px', color: '#6B635B' }}>&lt; 1.5 MB • WebP / JPG / PNG</td>
                <td style={{ padding: '14px', color: '#78716C' }}>Product Grids & Details Page</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <Link href="/admin/products" style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}>
                    Manage Products →
                  </Link>
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F5F1EB', backgroundColor: '#FAF8F5' }}>
                <td style={{ padding: '14px', fontWeight: 600, color: '#1C1917' }}>
                  🗂️ Collection Thumbnails
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#1C1917' }}>
                  600 × 750 px <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#78716C' }}>(or 800×800)</span>
                </td>
                <td style={{ padding: '14px', color: '#6B635B' }}>4:5 Portrait / 1:1</td>
                <td style={{ padding: '14px', color: '#6B635B' }}>&lt; 1.5 MB • WebP / JPG</td>
                <td style={{ padding: '14px', color: '#78716C' }}>Category Grids & Navigation Menus</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <Link href="/admin/collections" style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}>
                    Manage Collections →
                  </Link>
                </td>
              </tr>

              <tr>
                <td style={{ padding: '14px', fontWeight: 600, color: '#1C1917' }}>
                  🌅 Collection Header Banners
                </td>
                <td style={{ padding: '14px', fontWeight: 800, color: '#9B3828' }}>
                  1600 × 500 px
                </td>
                <td style={{ padding: '14px', color: '#6B635B' }}>3.2:1 Wide Banner</td>
                <td style={{ padding: '14px', color: '#6B635B' }}>&lt; 2.0 MB • WebP / JPG</td>
                <td style={{ padding: '14px', color: '#78716C' }}>Collection Category Landing Pages</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <Link href="/admin/collections" style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}>
                    Manage Collections →
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
