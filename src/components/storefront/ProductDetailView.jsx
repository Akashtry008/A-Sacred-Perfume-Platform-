import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Award,
  ChevronDown,
  CheckCircle2,
  MapPin,
  Share2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { flyToDestination } from '@/lib/flyAnimation';
import ProductCard from './ProductCard';

export default function ProductDetailView({ product, relatedProducts, reviews: initialReviews }) {
  const navigate = useNavigate();
  const { addToCart, isLoading } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  // Active Variant State
  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0] || {};
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [quantity, setQuantity] = useState(1);

  // Active Gallery Image
  const images = product.images || [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // PIN code checker state
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState(null);

  // Accordion Tab state
  const [openTab, setOpenTab] = useState('description');

  // Reviews state
  const [reviews, setReviews] = useState(initialReviews || []);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, title: '', body: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Frequently bought together bundle state
  const [bundleIncluded, setBundleIncluded] = useState(true);
  const bundleAddon = relatedProducts?.[0];

  const discount = calculateDiscount(selectedVariant.price, selectedVariant.compareAtPrice);
  const isSaved = isWishlisted(product.id);

  const handleAddToCart = async (e) => {
    if (e) flyToDestination(e, 'cart');
    if (!selectedVariant.id) return;
    await addToCart(product.id, selectedVariant.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant.id) return;
    await addToCart(product.id, selectedVariant.id, quantity);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          navigate('/checkout');
          return;
        }
      }
    } catch (e) {}
    navigate('/account/login?redirect=/checkout');
  };

  const checkPinCode = (e) => {
    e.preventDefault();
    if (!pinCode || pinCode.length !== 6 || !/^\d+$/.test(pinCode)) {
      setPinStatus({ success: false, message: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }
    setPinStatus({
      success: true,
      message: `Delivery available for PIN ${pinCode}! Estimated dispatch within 24 hrs (Transit: 2-3 business days).`,
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.body) {
      showToast('Please fill in your name and review', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          reviewerName: reviewForm.name,
          rating: Number(reviewForm.rating),
          title: reviewForm.title,
          body: reviewForm.body,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        showToast('Review submitted with sacred thanks!', 'success');
        setIsReviewModalOpen(false);
        setReviewForm({ name: '', rating: 5, title: '', body: '' });
      } else {
        showToast(data.error?.message || 'Submission failed', 'error');
      }
    } catch {
      showToast('Review submitted!', 'success');
      setIsReviewModalOpen(false);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  return (
    <div style={{ padding: '24px 0 80px' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt;{' '}
          <Link href="/collections" style={{ color: '#1C1917' }}>Collections</Link> &gt;{' '}
          <span style={{ color: '#C8822A', fontWeight: 500 }}>{product.title}</span>
        </div>

        {/* Top Split Section: Gallery & Buying Box */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(24px, 4vw, 48px)',
            marginBottom: '64px',
          }}
        >
          {/* Gallery Side */}
          <div>
            {/* Main Stage Image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                backgroundColor: '#F6F1EA',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #EAE3D6',
                marginBottom: '16px',
              }}
            >
              <img
                src={images[activeImageIndex]?.url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80'}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.badgeText && (
                <span className="product-badge" style={{ top: '16px', left: '16px', fontSize: '0.75rem', padding: '6px 12px' }}>
                  {product.badgeText}
                </span>
              )}

              <button
                onClick={handleShare}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1C1917',
                  cursor: 'pointer',
                }}
                aria-label="Share product"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid #C8822A' : '1px solid #EAE3D6',
                      padding: '2px',
                      backgroundColor: '#FFF',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img.url} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Action Column */}
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8822A', fontWeight: 600 }}>
              {product.brand || 'VedaPavitra'}
            </span>

            <h1 className="heading-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', margin: '6px 0 10px', lineHeight: 1.2 }}>
              {product.title}
            </h1>

            {product.subtitle && (
              <p style={{ color: '#6B635B', fontSize: '1rem', marginBottom: '16px' }}>
                {product.subtitle}
              </p>
            )}

            {/* Rating Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#D48B28' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#D48B28" />
                ))}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{product.ratingAverage || 4.9}</span>
              <span style={{ color: '#6B635B', fontSize: '0.875rem' }}>
                ({reviews.length || product.ratingCount || 100} verified reviews)
              </span>
            </div>

            {/* Pricing Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                padding: '16px 0',
                borderTop: '1px solid #EAE3D6',
                borderBottom: '1px solid #EAE3D6',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1917' }}>
                {formatPrice(selectedVariant.price)}
              </span>

              {selectedVariant.compareAtPrice && (
                <span style={{ fontSize: '1.1rem', color: '#948A7F', textDecoration: 'line-through' }}>
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}

              {discount > 0 && (
                <span className="discount-badge" style={{ fontSize: '0.8125rem', padding: '4px 8px' }}>
                  SAVE {discount}%
                </span>
              )}

              <span style={{ fontSize: '0.75rem', color: '#6B635B', marginLeft: 'auto' }}>
                Inclusive of all taxes
              </span>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: '#1C1917' }}>
                  Select Pack Size: <span style={{ color: '#C8822A' }}>{selectedVariant.title}</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #C8822A' : '1px solid #D4C9B8',
                          backgroundColor: isSelected ? '#FDF6EC' : '#FFF',
                          color: isSelected ? '#C8822A' : '#1C1917',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {isSelected && <CheckCircle2 size={14} color="#C8822A" />}
                        {v.title} — {formatPrice(v.price)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Urgency */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.875rem', color: '#1E5E3A' }}>
              <CheckCircle2 size={16} />
              <span>In Stock — Ready for sacred dispatch today from NCR warehouse</span>
            </div>

            {/* Quantity Stepper & CTAs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div className="cart-stepper" style={{ height: '48px', padding: '0 8px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '32px', height: '100%', fontSize: '1.1rem' }}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span style={{ fontSize: '1rem', minWidth: '32px', textAlign: 'center' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '32px', height: '100%', fontSize: '1.1rem' }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={(e) => handleAddToCart(e)}
                disabled={isLoading}
                className="btn-primary"
                style={{ flex: 1, minWidth: '160px', height: '48px', fontSize: '1rem' }}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-secondary"
                style={{
                  flex: 1,
                  minWidth: '160px',
                  height: '48px',
                  fontSize: '1rem',
                  backgroundColor: '#1C1917',
                  color: '#FFF',
                  borderColor: '#1C1917',
                }}
              >
                Buy Now
              </button>

              <button
                onClick={(e) => {
                  if (!isSaved) {
                    flyToDestination(e, 'wishlist');
                  }
                  toggleWishlist(product.id, product.title);
                }}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  border: '1px solid #D4C9B8',
                  backgroundColor: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={20} fill={isSaved ? '#9B3828' : 'none'} color={isSaved ? '#9B3828' : '#1C1917'} />
              </button>
            </div>

            {/* Indian PIN Code Delivery Transit Checker */}
            <div
              style={{
                backgroundColor: '#FAF8F5',
                border: '1px solid #EAE3D6',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                <MapPin size={16} color="#C8822A" /> Check Delivery Estimate
              </div>

              <form onSubmit={checkPinCode} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D4C9B8',
                    backgroundColor: '#FFF',
                    fontSize: '0.875rem',
                  }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8125rem' }}>
                  Check
                </button>
              </form>

              {pinStatus && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    marginTop: '8px',
                    color: pinStatus.success ? '#1E5E3A' : '#9B3828',
                    fontWeight: 500,
                  }}
                >
                  {pinStatus.message}
                </p>
              )}
            </div>

            {/* Purity Highlights Box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#44403C' }}>
                <ShieldCheck size={16} color="#C8822A" /> 100% Bambooless Core
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#44403C' }}>
                <ShieldCheck size={16} color="#C8822A" /> Zero Black Charcoal
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#44403C' }}>
                <Truck size={16} color="#C8822A" /> Free Shipping &gt; ₹499
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#44403C' }}>
                <Award size={16} color="#C8822A" /> Pure Sacred Resins
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed / Accordion Product Details */}
        <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '12px', overflow: 'hidden', marginBottom: '64px' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid #EAE3D6', backgroundColor: '#FAF8F5', overflowX: 'auto' }}>
            {[
              { id: 'description', label: 'Description & Vidhi' },
              { id: 'ingredients', label: 'Sacred Ingredients' },
              { id: 'benefits', label: 'Spiritual Benefits' },
              { id: 'shipping', label: 'Shipping & Replacement' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOpenTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  borderBottom: openTab === tab.id ? '2px solid #C8822A' : 'none',
                  color: openTab === tab.id ? '#C8822A' : '#6B635B',
                  backgroundColor: openTab === tab.id ? '#FFF' : 'transparent',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '32px', lineHeight: 1.8, color: '#44403C', fontSize: '0.95rem' }}>
            {openTab === 'description' && (
              <div>
                <p style={{ marginBottom: '16px' }}>{product.description}</p>
                {product.usageGuide && (
                  <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#FDF6EC', borderRadius: '8px' }}>
                    <h4 style={{ fontWeight: 600, color: '#C8822A', marginBottom: '6px' }}>Vidhi / Burning Instructions:</h4>
                    <p>{product.usageGuide}</p>
                  </div>
                )}
              </div>
            )}

            {openTab === 'ingredients' && (
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '8px', color: '#1C1917' }}>Pure Botanical Composition:</h4>
                <p>{product.ingredients || 'Hand-blended natural resins, dried flower extracts, botanical joss powder, and essential oils.'}</p>
              </div>
            )}

            {openTab === 'benefits' && (
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '8px', color: '#1C1917' }}>Prana & Spiritual Elevation:</h4>
                <p>{product.benefits || 'Promotes deep mental tranquility, clears room static, and sanctifies prayer spaces without respiratory distress.'}</p>
              </div>
            )}

            {openTab === 'shipping' && (
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '8px', color: '#1C1917' }}>Pan-India Fulfillment Guarantee:</h4>
                <p>
                  All orders are dispatched in eco-friendly protective packaging within 24 hours. Because pooja samagri is sacred, opened packs cannot be returned, but if any item reaches you damaged, we dispatch a 100% free courier replacement within 24 hours of receiving your photo on care@vedapavitra.com.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        {bundleAddon && (
          <div
            style={{
              backgroundColor: '#FAF8F5',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '28px',
              marginBottom: '64px',
            }}
          >
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '16px' }}>
              Frequently Bought Together
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={images[0]?.url}
                  alt={product.title}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '1.2rem', color: '#6B635B' }}>+</span>
                <img
                  src={bundleAddon.images?.[0]?.url}
                  alt={bundleAddon.title}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '220px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={bundleIncluded}
                    onChange={(e) => setBundleIncluded(e.target.checked)}
                    style={{ accentColor: '#C8822A', width: '16px', height: '16px' }}
                  />
                  <span>
                    Include <strong>{bundleAddon.title}</strong> ({formatPrice(bundleAddon.variants?.[0]?.price)})
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8125rem', color: '#6B635B', display: 'block' }}>Bundle Total:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#C8822A' }}>
                    {formatPrice(selectedVariant.price + (bundleIncluded ? bundleAddon.variants?.[0]?.price || 0 : 0))}
                  </span>
                </div>

                <button
                  onClick={async (e) => {
                    flyToDestination(e, 'cart');
                    await addToCart(product.id, selectedVariant.id, 1);
                    if (bundleIncluded && bundleAddon.variants?.[0]?.id) {
                      await addToCart(bundleAddon.id, bundleAddon.variants[0].id, 1);
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                >
                  Add Both to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div style={{ marginBottom: '64px' }} id="reviews-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 className="heading-display" style={{ fontSize: '2rem' }}>
                Customer Reflections & Reviews
              </h3>
              <p style={{ color: '#6B635B', fontSize: '0.9rem' }}>
                Based on {reviews.length} authentic devotee evaluations
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.875rem' }}
            >
              Write a Review
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  backgroundColor: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '10px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '2px', color: '#D48B28' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#D48B28" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#948A7F' }}>
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN') : 'Recently'}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', color: '#1C1917' }}>
                  {rev.title}
                </h4>

                <p style={{ color: '#6B635B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>
                  {rev.body}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{rev.reviewerName}</span>
                  {rev.isVerified && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#1E5E3A', fontWeight: 500 }}>
                      <CheckCircle2 size={13} /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h3 className="heading-display" style={{ fontSize: '2rem', marginBottom: '24px' }}>
              Frequently Paired Sacred Samagri
            </h3>
            <div className="grid-3">
              {relatedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', marginBottom: '8px' }}>
              Share Your Experience
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', marginBottom: '20px' }}>
              Reviewing: <strong>{product.title}</strong>
            </p>

            <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D4C9B8' }}
                >
                  <option value={5}>5 Stars — Divine & Exceeded Expectations</option>
                  <option value={4}>4 Stars — Very Good & Pure</option>
                  <option value={3}>3 Stars — Average</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acharya Ramanand"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D4C9B8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Review Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. True Chandan fragrance without choking smoke"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D4C9B8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Review Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe burning time, aroma notes, and pooja experience..."
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D4C9B8' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
