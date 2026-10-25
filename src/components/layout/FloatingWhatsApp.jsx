import React, { useState } from 'react';
import { Handshake, MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '919876543210';
  const prefilledMessage = encodeURIComponent(
    'Namaste VedaPavitra, I am interested in your pure bambooless incense and Vedic havan cups. Please guide me.'
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            left: '68px',
            backgroundColor: '#1C1917',
            color: '#FAF7F2',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: '1px solid #25D366',
            pointerEvents: 'none',
          }}
        >
          Chat with Pandit Ji on WhatsApp
        </div>
      )}
      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${prefilledMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect with VedaPavitra on WhatsApp"
        title="Connect with VedaPavitra on WhatsApp"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isHovered
            ? '0 10px 28px rgba(37, 211, 102, 0.55)'
            : '0 6px 20px rgba(37, 211, 102, 0.4)',
          position: 'relative',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
          textDecoration: 'none',
        }}
      >
        {/* Pulsing ring */}
        <span
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(37, 211, 102, 0.6)',
            animation: 'pingRing 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Handshake & Chat Icon Combination */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Handshake size={28} />
          <span
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-6px',
              backgroundColor: '#128C7E',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFF',
            }}
          >
            <MessageCircle size={10} color="#FFF" />
          </span>
        </div>
      </a>
    </div>
  );
}
