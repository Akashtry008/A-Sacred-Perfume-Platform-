import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { Menu, Search, User, Heart, ShoppingBag, X } from 'lucide-react';
import MegaMenu from './MegaMenu';
import MobileMenuDrawer from './MobileMenuDrawer';
import PredictiveSearchDropdown from './PredictiveSearchDropdown';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandName, setBrandName] = useState('VedaPavitra');
  const [brandTagline, setBrandTagline] = useState('Pure Vedic Samagri');
  const [logoWidth, setLogoWidth] = useState(180);
  const [logoHeight, setLogoHeight] = useState(44);

  const { itemCount, openDrawer } = useCart();
  const { wishlistIds } = useWishlist();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.brandLogo) setBrandLogo(data.brandLogo);
          if (data.brandName) setBrandName(data.brandName);
          if (data.brandTagline) setBrandTagline(data.brandTagline);
          if (data.logoWidth) setLogoWidth(Number(data.logoWidth) || 180);
          if (data.logoHeight) setLogoHeight(Number(data.logoHeight) || 44);
        }
      })
      .catch(() => {});
  }, []);

  // Close search overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container header-inner">
          {/* Mobile Hamburger & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="action-btn mobile-menu-trigger"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="site-logo" style={{ textDecoration: 'none' }}>
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  style={{
                    maxHeight: `${logoHeight}px`,
                    width: `${logoWidth}px`,
                    maxWidth: 'min(65vw, 320px)',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : (
                <>
                  <div className="logo-symbol">{brandName ? brandName.charAt(0) : 'V'}</div>
                  <div className="logo-text">
                    <h1>{brandName}</h1>
                    <p>{brandTagline}</p>
                  </div>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Primary Navigation */}
          <nav className="header-nav">
            <div className="nav-item-dropdown">
              <Link href="/collections" className="nav-link has-dropdown">
                Pooja Shop
              </Link>
              <MegaMenu />
            </div>

            <Link href="/collections/bestsellers" className="nav-link">
              Bestsellers
            </Link>

            <Link href="/collections/curated-puja-combos" className="nav-link">
              Combos
            </Link>

            <Link href="/pages/about-us" className="nav-link">
              Our Mission
            </Link>

            <Link href="/pages/wholesale" className="nav-link">
              Wholesale
            </Link>

            <Link href="/blogs" className="nav-link">
              Journal
            </Link>
          </nav>

          {/* Header Action Icons */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="action-btn"
              aria-label="Search products"
              style={{
                backgroundColor: isSearchOpen ? '#FAF0E4' : 'transparent',
                color: isSearchOpen ? '#C8822A' : 'inherit',
                borderRadius: '50%',
              }}
            >
              <Search size={20} />
            </button>

            {/* Account Icon */}
            <Link href="/account" className="action-btn" aria-label="Customer Account">
              <User size={20} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/account/wishlist"
              id="header-wishlist-btn"
              className="action-btn"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistIds.length > 0 && (
                <span className="badge-counter">{wishlistIds.length}</span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              id="header-cart-btn"
              onClick={openDrawer}
              className="action-btn"
              aria-label="Shopping Cart"
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="badge-counter">{itemCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Predictive Search Overlay Bar */}
        {isSearchOpen && (
          <div
            style={{
              position: 'relative',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: '#FFF',
              padding: '16px 0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div className="container">
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Search size={20} color="#C8822A" />
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="Search for Chandan Incense, Cow Ghee Havan Cups, Pure Attar, Shastras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    backgroundColor: 'transparent',
                    fontFamily: 'inherit',
                    color: '#1C1917',
                  }}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#78716C',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.875rem' }}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  style={{ color: '#78716C', padding: '8px', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Close
                </button>
              </form>
            </div>

            {/* Live Predictive Floating Dropdown */}
            <PredictiveSearchDropdown
              query={searchQuery}
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSelectSearch={(term) => setSearchQuery(term)}
            />
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
