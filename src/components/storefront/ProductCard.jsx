import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { flyToDestination } from '@/lib/flyAnimation';

export default function ProductCard({ product }) {
  const { addToCart, isLoading } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Selected variant state for interactive pill selection
  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0] || {};
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const discount = calculateDiscount(selectedVariant.price, selectedVariant.compareAtPrice);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTilting, setIsTilting] = useState(false);
  const isSaved = isWishlisted(product.id);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 10, y: x * 10 });
    setIsTilting(true);
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsTilting(false);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant.id) return;
    flyToDestination(e, 'cart');
    await addToCart(product.id, selectedVariant.id, 1);
  };

  return (
    <div
      className="product-card"
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      onTouchMove={handleCardMouseMove}
      onTouchEnd={handleCardMouseLeave}
      style={{
        transform: isTilting
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isTilting ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Media & Badges */}
      <div
        className="product-card-media"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/products/${product.slug}`}>
          <img
            src={hovered ? secondaryImage : primaryImage}
            alt={product.title}
            loading="lazy"
          />
        </Link>

        {/* 3D Holographic Gold Specular Sheen */}
        {isTilting && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${105 + tilt.y * 3}deg, rgba(255, 255, 255, 0) 30%, rgba(254, 240, 138, 0.22) 50%, rgba(200, 130, 42, 0.25) 55%, transparent 70%)`,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              zIndex: 3,
            }}
          />
        )}

        {product.badgeText && (
          <span className="product-badge">{product.badgeText}</span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isSaved) {
              flyToDestination(e, 'wishlist');
            }
            toggleWishlist(product.id, product.title);
          }}
          className={`wishlist-toggle-btn ${isSaved ? 'active' : ''}`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isSaved ? '#9B3828' : 'none'} color={isSaved ? '#9B3828' : '#1C1917'} />
        </button>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <span className="product-card-category">{product.brand || 'VedaPavitra'}</span>

        <h3 className="product-card-title">
          <Link href={`/products/${product.slug}`}>{product.title}</Link>
        </h3>

        {/* Rating */}
        <div className="product-card-rating">
          <div style={{ display: 'flex', alignItems: 'center', color: '#D48B28' }}>
            <Star size={14} fill="#D48B28" />
          </div>
          <span style={{ fontWeight: 600, color: '#1C1917' }}>{product.ratingAverage || 4.9}</span>
          <span>({product.ratingCount || 100})</span>
        </div>

        {/* Variant Selector Pills if more than 1 variant */}
        {product.variants && product.variants.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                style={{
                  fontSize: '0.6875rem',
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  border: selectedVariant.id === v.id ? '1.5px solid #C8822A' : '1px solid #EAE3D6',
                  backgroundColor: selectedVariant.id === v.id ? '#FDF6EC' : '#FFF',
                  color: selectedVariant.id === v.id ? '#C8822A' : '#6B635B',
                  fontWeight: selectedVariant.id === v.id ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}

        {/* Price Row */}
        <div className="product-card-price-row">
          <span className="current-price">{formatPrice(selectedVariant.price)}</span>
          {selectedVariant.compareAtPrice && (
            <span className="compare-price">{formatPrice(selectedVariant.compareAtPrice)}</span>
          )}
          {discount > 0 && (
            <span className="discount-badge">{discount}% OFF</span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isLoading || selectedVariant.stockQuantity <= 0}
          className="btn-primary btn-full"
          style={{ fontSize: '0.875rem', padding: '10px' }}
        >
          <ShoppingBag size={16} />
          {selectedVariant.stockQuantity <= 0 ? 'Out of Stock' : 'Quick Add'}
        </button>
      </div>
    </div>
  );
}
