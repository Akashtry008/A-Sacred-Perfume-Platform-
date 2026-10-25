/**
 * flyAnimation.js
 * High-performance curved trajectory particle animation:
 * Animates a glowing particle from the clicked element/button
 * to the Header Wishlist icon or Header Cart icon.
 */

export function flyToDestination(source, type = 'cart') {
  if (typeof window === 'undefined' || !document) return;

  // 1. Locate Source Coordinates
  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (source) {
    const el = source.currentTarget || source.target || (source.nodeType ? source : null);
    if (el && el.getBoundingClientRect) {
      const rect = el.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    } else if (source.clientX && source.clientY) {
      startX = source.clientX;
      startY = source.clientY;
    }
  }

  // 2. Locate Destination Target in Header
  const targetId = type === 'wishlist' ? 'header-wishlist-btn' : 'header-cart-btn';
  const targetEl = document.getElementById(targetId) || document.querySelector(`[aria-label="${type === 'wishlist' ? 'Wishlist' : 'Shopping Cart'}"]`);

  if (!targetEl) return;

  const targetRect = targetEl.getBoundingClientRect();
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  // 3. Create Flying Particle Element
  const particle = document.createElement('div');
  particle.className = `flying-${type}-particle`;

  const isWishlist = type === 'wishlist';

  // Styling particle
  Object.assign(particle.style, {
    position: 'fixed',
    top: '0px',
    left: '0px',
    zIndex: '100000',
    pointerEvents: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isWishlist ? '#9B3828' : '#C8822A',
    color: '#FFF',
    boxShadow: isWishlist
      ? '0 0 16px rgba(155, 56, 40, 0.8), 0 0 32px rgba(200, 130, 42, 0.6)'
      : '0 0 16px rgba(200, 130, 42, 0.8), 0 0 32px rgba(234, 179, 8, 0.6)',
    transform: `translate3d(${startX - 16}px, ${startY - 16}px, 0)`,
    willChange: 'transform, opacity',
  });

  // SVG inside particle
  if (isWishlist) {
    particle.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFF" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    `;
  } else {
    particle.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    `;
  }

  document.body.appendChild(particle);

  // 4. Parabolic Flight Curve Animation via Web Animations API
  const dx = endX - startX;
  const dy = endY - startY;

  // Arc upward curve
  const arcHeight = -Math.min(120, Math.max(50, Math.abs(dy) * 0.4));

  const keyframes = [
    {
      transform: `translate3d(${startX - 16}px, ${startY - 16}px, 0) scale(0.6)`,
      opacity: 0.8,
    },
    {
      transform: `translate3d(${startX + dx * 0.35 - 16}px, ${startY + dy * 0.15 + arcHeight - 16}px, 0) scale(1.35)`,
      opacity: 1,
      offset: 0.35,
    },
    {
      transform: `translate3d(${startX + dx * 0.75 - 16}px, ${startY + dy * 0.65 + arcHeight * 0.3 - 16}px, 0) scale(1.1)`,
      opacity: 0.95,
      offset: 0.75,
    },
    {
      transform: `translate3d(${endX - 16}px, ${endY - 16}px, 0) scale(0.35)`,
      opacity: 0.1,
      offset: 1,
    },
  ];

  const animation = particle.animate(keyframes, {
    duration: 720,
    easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
    fill: 'forwards',
  });

  animation.onfinish = () => {
    particle.remove();

    // 5. Trigger Target Header Icon Bump / Pop Animation
    targetEl.classList.remove('header-icon-bump');
    void targetEl.offsetWidth; // Trigger DOM reflow
    targetEl.classList.add('header-icon-bump');

    setTimeout(() => {
      targetEl.classList.remove('header-icon-bump');
    }, 600);

    // 6. Spawn subtle golden burst ring at impact
    spawnImpactBurst(endX, endY, isWishlist ? '#9B3828' : '#C8822A');
  };
}

function spawnImpactBurst(x, y, color) {
  const burst = document.createElement('div');
  Object.assign(burst.style, {
    position: 'fixed',
    top: `${y - 18}px`,
    left: `${x - 18}px`,
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: `2px solid ${color}`,
    boxShadow: `0 0 12px ${color}`,
    pointerEvents: 'none',
    zIndex: '100000',
    transform: 'scale(0.4)',
    opacity: '1',
    animation: 'flyImpactBurst 0.45s ease-out forwards',
  });

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 450);
}
