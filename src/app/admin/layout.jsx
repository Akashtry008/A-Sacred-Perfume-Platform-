import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Box,
  Image as ImageIcon,
  Layers,
  CreditCard,
  Tag,
  ExternalLink,
  ShieldCheck,
  Flame,
  Menu,
  X,
  HelpCircle,
  Star,
  Users,
  BookOpen,
  Sliders,
  MessageSquare,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { href: '/admin', label: 'Overview & KPIs', icon: LayoutDashboard },
    { href: '/admin/customizer', label: 'Platform & Sections', icon: Sliders },
    { href: '/admin/communications', label: 'Communications & Policies', icon: MessageSquare },
    { href: '/admin/orders', label: 'Orders & Tracking', icon: Package },
    { href: '/admin/products', label: 'Catalog & Inventory', icon: Box },
    { href: '/admin/banners', label: 'Banners & Posters', icon: ImageIcon },
    { href: '/admin/blogs', label: 'Sacred Journal & Blogs', icon: BookOpen },
    { href: '/admin/collections', label: 'Collections Manager', icon: Layers },
    { href: '/admin/payments', label: 'Payments & Audits', icon: CreditCard },
    { href: '/admin/promotions', label: 'Coupons & Gifts', icon: Tag },
    { href: '/admin/faqs', label: 'FAQs & Support', icon: HelpCircle },
    { href: '/admin/testimonials', label: 'Testimonials & Reviews', icon: Star },
    { href: '/admin/users', label: 'Devotees & Activity Log', icon: Users },
  ];

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F8F6F0',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90,
          }}
        />
      )}

      {/* Admin Sidebar - Locked at viewport with limited internal scroll without visible scrollbar */}
      <style>{`
        .admin-sidebar, .admin-sidebar-nav, .admin-sidebar * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .admin-sidebar::-webkit-scrollbar,
        .admin-sidebar-nav::-webkit-scrollbar,
        .admin-sidebar *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
      <aside
        style={{
          width: '270px',
          backgroundColor: '#1C1917',
          color: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #292524',
          flexShrink: 0,
          height: '100vh',
          maxHeight: '100vh',
          zIndex: 100,
          transition: 'transform 0.3s ease',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className={`admin-sidebar ${isSidebarOpen ? 'admin-sidebar-mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #292524', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Flame size={18} color="#E09C48" />
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#FAF7F2' }}>
                VedaPavitra
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={13} color="#16A34A" />
              <span style={{ fontSize: '0.72rem', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Operations Console
              </span>
            </div>
          </div>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} style={{ color: '#D6D3D1', padding: '4px' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items - Scrollbar hidden */}
        <nav
          className="admin-sidebar-nav no-scrollbar"
          style={{
            padding: '20px 12px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#C8822A' : 'transparent',
                  color: isActive ? '#FFF' : '#D6D3D1',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <Icon size={18} color={isActive ? '#FFF' : '#A8A29E'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Link back to Storefront */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #292524' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FEF08A',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: '#292524',
              border: '1px solid rgba(200, 130, 42, 0.4)',
            }}
          >
            <span>Return to Storefront</span>
            <ExternalLink size={14} color="#E09C48" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Top Navbar */}
        <header
          style={{
            height: '68px',
            backgroundColor: '#FFF',
            borderBottom: '1px solid #EAE3D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(16px, 3vw, 36px)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{ display: 'none', color: '#1C1917' }}
              className="admin-hamburger-btn"
              aria-label="Open Admin Menu"
            >
              <Menu size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                Online & Accepting Orders
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: '0.8125rem',
                color: '#C8822A',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Live Site</span>
              <ExternalLink size={13} />
            </Link>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1C1917' }}>Store Administrator</div>
              <div style={{ fontSize: '0.75rem', color: '#78716C' }}>care@vedapavitra.com</div>
            </div>

            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FAF0E4',
                color: '#C8822A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: '1px solid #E8D5BF',
              }}
            >
              VP
            </div>
          </div>
        </header>

        {/* Children Body */}
        <div style={{ padding: 'clamp(20px, 3vw, 40px)', flex: 1, width: '100%' }}>{children}</div>
      </main>
    </div>
  );
}
