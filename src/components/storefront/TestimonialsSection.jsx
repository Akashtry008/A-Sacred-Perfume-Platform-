import React, { useState } from 'react';
import { Star, ShieldCheck, Heart, Quote } from 'lucide-react';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Pandit Radheshyam Shastri',
    city: 'Varanasi, UP',
    rating: 5,
    verified: true,
    title: 'Authentic temple fragrance without harsh smoke',
    comment:
      'In our Mandir daily puja, ordinary black agarbatti caused severe eye stinging and black soot on the deities. VedaPavitra Mysore Sandalwood burns cleanly with sweet, divine aroma. Truly compliant with Gandhashastra scriptures.',
    productTitle: 'Royal Mysore Sandalwood Agarbatti',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    angle: -5,
  },
  {
    id: 'rev-2',
    author: 'Meenakshi Iyer',
    city: 'Bengaluru, KA',
    rating: 5,
    verified: true,
    title: 'The easiest way to do daily havan in a high-rise flat',
    comment:
      'Living in an apartment in Bengaluru, a traditional havan is hard to conduct daily. These organic cups burn for 15 minutes and produce sacred, soothing aroma without triggering false smoke alarms. Highly recommended!',
    productTitle: 'Desi Cow Ghee Havan Cups',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    angle: -1.5,
  },
  {
    id: 'rev-3',
    author: 'Sunita Mehra',
    city: 'New Delhi',
    rating: 5,
    verified: true,
    title: 'No synthetic perfume headache',
    comment:
      'I am asthmatic and had stopped lighting incense completely for 3 years. A friend gifted me VedaPavitra and for the first time in years, our evening prayers smell sacred and pure without a single cough or headache.',
    productTitle: 'Sampoorna Vedic Puja Hamper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    angle: 1.5,
  },
  {
    id: 'rev-4',
    author: 'Col. Vikramaditya Rathore',
    city: 'Jaipur, RJ',
    rating: 5,
    verified: true,
    title: 'Exceptional gifting quality for Griha Pravesh',
    comment:
      'Ordered 5 boxes for family during Diwali and housewarming. The packaging, brass stand, and purity of products reflect supreme care and Vedic heritage. Every guest inquired where we procured it.',
    productTitle: 'Kashmiri Kesar Chandan Incense',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    angle: 5,
  },
];

export default function TestimonialsSection({ reviews, title, subtitle }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Normalize reviews from MongoDB or default list
  const displayReviews = (reviews && reviews.length >= 1)
    ? reviews.slice(0, 4).map((r, i) => ({
        id: r.id || r._id || `rev-${i}`,
        author: r.reviewerName || r.author || DEFAULT_REVIEWS[i % DEFAULT_REVIEWS.length].author,
        comment: r.body || r.comment || r.content || DEFAULT_REVIEWS[i % DEFAULT_REVIEWS.length].comment,
        title: r.title || DEFAULT_REVIEWS[i % DEFAULT_REVIEWS.length].title,
        city: r.city || r.location || DEFAULT_REVIEWS[i % DEFAULT_REVIEWS.length].city,
        productTitle: r.productTitle || r.productName || DEFAULT_REVIEWS[i % DEFAULT_REVIEWS.length].productTitle,
        rating: r.rating || 5,
        verified: r.isVerified ?? r.verified ?? r.verifiedBuyer ?? true,
        avatar: r.avatar || DEFAULT_REVIEWS[i % DEFAULT_REVIEWS.length].avatar,
        angle: DEFAULT_REVIEWS[i % DEFAULT_REVIEWS.length].angle,
      }))
    : DEFAULT_REVIEWS;

  return (
    <section
      className="testimonials-overlapping-section"
      style={{
        padding: '96px 0',
        backgroundColor: '#FAF7F2',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Devotee Testimonials & Reflections"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: '#1C1917',
              lineHeight: 1.2,
              marginBottom: '14px',
            }}
          >
            {title || 'Over 10,000+ Sacred Households Sanctified'}
          </h2>
          <p style={{ color: '#6B635B', fontSize: '1rem', lineHeight: 1.6 }}>
            {subtitle || 'Hear from temple priests, families, and yoga practitioners who elevated their daily puja with our charcoal-free Vedic formulations.'}
          </p>
        </div>

        {/* 3D Overlapping Deck of Testimonial Cards */}
        <div
          className="testimonials-deck-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            perspective: '1400px',
            padding: '50px 16px',
            minHeight: '480px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {displayReviews.map((review, idx) => {
            const isHovered = hoveredIdx === idx;
            const hasHover = hoveredIdx !== null;
            const baseAngle = review.angle ?? (idx === 0 ? -5 : idx === 1 ? -1.5 : idx === 2 ? 1.5 : 5);
            const zIndex = isHovered ? 40 : 10 + idx;

            return (
              <div
                key={review.id || idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  flex: '0 0 350px',
                  maxWidth: '350px',
                  minHeight: '380px',
                  marginLeft: idx === 0 ? 0 : '-54px', // Authentic card deck overlap!
                  zIndex: zIndex,
                  backgroundColor: isHovered ? '#FFFFFF' : '#FDFDFD',
                  borderRadius: '20px',
                  border: isHovered ? '2px solid #C8822A' : '1px solid #EAE3D6',
                  padding: '32px 28px',
                  boxShadow: isHovered
                    ? '0 32px 70px rgba(200, 130, 42, 0.28), 0 10px 28px rgba(35, 25, 15, 0.12)'
                    : '0 12px 32px rgba(35, 25, 15, 0.08)',
                  transform: isHovered
                    ? 'translateY(-36px) scale(1.10) rotate(0deg) translateZ(60px)'
                    : hasHover
                    ? `rotate(${baseAngle * 0.7}deg) scale(0.95)`
                    : `rotate(${baseAngle}deg)`,
                  opacity: hasHover && !isHovered ? 0.55 : 1,
                  filter: hasHover && !isHovered ? 'blur(0.5px)' : 'none',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Gold Watermark Quote Icon */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '22px',
                    opacity: isHovered ? 0.35 : 0.15,
                    color: '#C8822A',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <Quote size={38} />
                </div>

                {/* Stars Rating & Content */}
                <div>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < (review.rating || 5) ? '#F59E0B' : '#E5E7EB'}
                        color={i < (review.rating || 5) ? '#F59E0B' : '#E5E7EB'}
                      />
                    ))}
                  </div>

                  {/* Review Title */}
                  <h4
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.1rem',
                      color: isHovered ? '#C8822A' : '#1C1917',
                      marginBottom: '12px',
                      lineHeight: 1.35,
                      fontWeight: 700,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    "{review.title}"
                  </h4>

                  {/* Review Comment */}
                  <p
                    style={{
                      color: '#57534E',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                    }}
                  >
                    {review.comment}
                  </p>
                </div>

                {/* Author Info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderTop: '1px solid #F5F0E8',
                    paddingTop: '16px',
                  }}
                >
                  <img
                    src={review.avatar}
                    alt={review.author}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(200, 130, 42, 0.35)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h5
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#1C1917',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {review.author}
                      </h5>
                      {review.verified && <ShieldCheck size={14} color="#16A34A" style={{ flexShrink: 0 }} />}
                    </div>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#78716C',
                        margin: '2px 0 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {review.city} • <span style={{ color: '#C8822A', fontWeight: 600 }}>{review.productTitle}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
