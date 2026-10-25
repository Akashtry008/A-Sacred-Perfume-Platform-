import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';

const DEFAULT_MESSAGES = [
  'FREE Pan-India Delivery on Sacred Orders Above ₹499',
  'Use Code VEDIC10 For 10% Off On All Bambooless Agarbatti',
  '100% Desi Cow Ghee & Charcoal-Free Vedic Samagri',
  'Special Gift: Free Discovery Trial Pack on Orders Above ₹599',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [customText, setCustomText] = useState('');
  const [bgColor, setBgColor] = useState('#1C1917');
  const [textColor, setTextColor] = useState('#FAF7F2');

  useEffect(() => {
    // Fetch settings and section status
    Promise.all([
      fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/sections').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([settingsData, sectionsData]) => {
        if (settingsData) {
          if (settingsData.announcementEnabled === false) {
            setIsEnabled(false);
          }
          if (settingsData.announcementText) {
            setCustomText(settingsData.announcementText);
          }
          if (settingsData.announcementBgColor) {
            setBgColor(settingsData.announcementBgColor);
          }
          if (settingsData.announcementTextColor) {
            setTextColor(settingsData.announcementTextColor);
          }
        }

        if (sectionsData && sectionsData.sections) {
          const annSec = sectionsData.sections.find((s) => s.id === 'announcement_bar' || s.key === 'announcement_bar');
          if (annSec && (!annSec.isEnabled || annSec.isDeleted)) {
            setIsEnabled(false);
          }
        }
      })
      .catch(() => {});
  }, []);

  const messages = customText ? [customText, ...DEFAULT_MESSAGES] : DEFAULT_MESSAGES;

  useEffect(() => {
    if (isPaused || !isEnabled) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused, isEnabled, messages.length]);

  if (!isEnabled) return null;

  return (
    <div
      className="announcement-bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Promotional Announcement"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderBottom: '1px solid rgba(200, 130, 42, 0.25)',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '0.8125rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 40,
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
        }}
      >
        <span
          key={currentIndex}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.5s ease',
            color: textColor,
            textAlign: 'center',
            paddingRight: '80px',
          }}
        >
          <span>{messages[currentIndex % messages.length]}</span>
        </span>

        <Link
          href="/track-order"
          style={{
            position: 'absolute',
            right: 0,
            color: '#FEF08A',
            fontSize: '0.72rem',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 700,
          }}
        >
          <span>Track</span> &rarr;
        </Link>
      </div>
    </div>
  );
}
