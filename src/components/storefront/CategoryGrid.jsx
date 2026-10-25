import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { ArrowRight } from 'lucide-react';

function CategoryBox({ cat }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 10, y: x * 10 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <Link
      href={`/collections/${cat.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
      style={{
        position: 'relative',
        height: '190px', // Small, compact box size as requested
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'block',
        textDecoration: 'none',
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        border: isHovered ? '1.5px solid #C8822A' : '1px solid #EAE3D6',
        boxShadow: isHovered
          ? '0 4px 8px -2px rgba(28, 25, 23, 0.08), 0 20px 42px -6px rgba(28, 25, 23, 0.18), 0 10px 22px -3px rgba(200, 130, 42, 0.24), 0 0 0 1.5px rgba(200, 130, 42, 0.45)'
          : '0 2px 5px -1px rgba(28, 25, 23, 0.07), 0 8px 20px -3px rgba(28, 25, 23, 0.08), 0 14px 28px -6px rgba(200, 130, 42, 0.06), 0 0 0 1px rgba(200, 130, 42, 0.14)',
      }}
    >
      <img
        src={cat.imageUrl}
        alt={cat.name}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
      />
      {/* Dark Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(28, 25, 23, 0.88) 0%, rgba(28, 25, 23, 0.35) 60%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '20px 22px',
          color: '#FAF7F2',
          transform: 'translateZ(20px)',
        }}
      >
        <h3
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.15rem',
            margin: '0 0 4px',
            color: '#FAF7F2',
            fontWeight: 600,
          }}
        >
          {cat.name}
        </h3>
        <p
          style={{
            fontSize: '0.78rem',
            color: '#E09C48',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: 600,
            margin: 0,
            transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
          }}
        >
          Explore Collection <ArrowRight size={13} />
        </p>
      </div>
    </Link>
  );
}

export default function CategoryGrid({ categories, title, subtitle }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section style={{ padding: '56px 0', backgroundColor: '#FAF7F2' }} aria-labelledby="cat-heading">
      <div className="container">
        {/* Header - circled pill badge removed as requested */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <h2
            id="cat-heading"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.85rem, 3vw, 2.35rem)',
              color: '#1C1917',
              marginBottom: '10px',
            }}
          >
            {title || 'Explore By Sacred Ritual'}
          </h2>
          <p style={{ color: '#6B635B', fontSize: '0.975rem', lineHeight: 1.5, margin: 0 }}>
            {subtitle || 'Pure formulations created for every devotional moment of your day'}
          </p>
        </div>

        {/* Small, compact 3D interactive boxes grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {categories.map((cat) => (
            <CategoryBox key={cat.id || cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
