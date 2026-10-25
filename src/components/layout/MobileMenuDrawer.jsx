import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { X, ChevronDown, ChevronRight, Phone, MessageSquare } from 'lucide-react';

const DEFAULT_MOBILE_CATEGORIES = [
  { title: 'Bambooless Incense Sticks', href: '/collections/bambooless-incense-sticks' },
  { title: 'Organic Havan Cups', href: '/collections/organic-havan-cups' },
  { title: 'Charcoal-Free Dhoop Cones', href: '/collections/charcoal-free-dhoop-cones' },
  { title: 'Alcohol-Free Attar Sprays', href: '/collections/alcohol-free-attar-sprays' },
  { title: 'Curated Combos & Gift Sets', href: '/collections/curated-puja-combos' },
];

export default function MobileMenuDrawer({ isOpen, onClose }) {
  const [isShopExpanded, setIsShopExpanded] = useState(true);
  const [categories, setCategories] = useState(DEFAULT_MOBILE_CATEGORIES);

  useEffect(() => {
    fetch('/api/collections')
      .then((r) => r.json())
      .then((data) => {
        if (data.collections && data.collections.length > 0) {
          setCategories(
            data.collections.map((c) => ({
              title: c.title || c.name,
              href: `/collections/${c.slug}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 100,
        display: 'flex',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '85%',
          maxWidth: '340px',
          height: '100%',
          backgroundColor: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
          animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #EAE3D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C8822A, #9B3828)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontFamily: 'Georgia, serif',
                fontWeight: 'bold',
              }}
            >
              V
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 600 }}>
              VedaPavitra
            </span>
          </div>

          <button onClick={onClose} style={{ padding: '4px', color: '#6B635B' }} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Pooja Shop with Accordion */}
          <div>
            <button
              onClick={() => setIsShopExpanded(!isShopExpanded)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1C1917',
              }}
            >
              <span>Pooja Shop</span>
              {isShopExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {isShopExpanded && (
              <div
                style={{
                  paddingLeft: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: '2px solid #EAE3D6',
                  marginLeft: '4px',
                  marginBottom: '12px',
                }}
              >
                {categories.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={onClose}
                    style={{ fontSize: '0.875rem', color: '#44403C' }}
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/collections/bestsellers"
            onClick={onClose}
            style={{ display: 'block', padding: '12px 0', fontSize: '1rem', fontWeight: 600, color: '#1C1917' }}
          >
            Bestsellers
          </Link>

          <Link
            href="/pages/about-us"
            onClick={onClose}
            style={{ display: 'block', padding: '12px 0', fontSize: '1rem', fontWeight: 500, color: '#44403C' }}
          >
            About Our Mission
          </Link>

          <Link
            href="/blogs"
            onClick={onClose}
            style={{ display: 'block', padding: '12px 0', fontSize: '1rem', fontWeight: 500, color: '#44403C' }}
          >
            Vedic Blogs & Vidhi
          </Link>

          <Link
            href="/pages/wholesale"
            onClick={onClose}
            style={{ display: 'block', padding: '12px 0', fontSize: '1rem', fontWeight: 500, color: '#44403C' }}
          >
            Wholesale / Bulk Orders
          </Link>

          <Link
            href="/pages/contact"
            onClick={onClose}
            style={{ display: 'block', padding: '12px 0', fontSize: '1rem', fontWeight: 500, color: '#44403C' }}
          >
            Help & Contact
          </Link>
        </div>

        {/* Footer Support CTAs */}
        <div style={{ padding: '20px', borderTop: '1px solid #EAE3D6', backgroundColor: '#F5EFEB' }}>
          <p style={{ fontSize: '0.75rem', color: '#6B635B', textTransform: 'uppercase', marginBottom: '10px' }}>
            Customer Support
          </p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
              color: '#1E5E3A',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            <MessageSquare size={16} /> WhatsApp: +91 98765 43210
          </a>
          <p style={{ fontSize: '0.8125rem', color: '#6B635B' }}>
            Mon - Sat: 10:00 AM – 7:00 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}
