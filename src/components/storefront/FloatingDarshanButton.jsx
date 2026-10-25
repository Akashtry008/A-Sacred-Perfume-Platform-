import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';
import InteractiveSacred3DDiya from './InteractiveSacred3DDiya';

export default function FloatingDarshanButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Darshan Action Button (Positioned at bottom right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-darshan-btn"
        aria-label="Open 3D Sacred Akhand Diya Darshan"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 45,
          backgroundColor: '#1C1917',
          color: '#FAF7F2',
          border: '1.5px solid #C8822A',
          borderRadius: '30px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(200, 130, 42, 0.4), 0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'rgba(200, 130, 42, 0.25)',
            color: '#F59E0B',
            animation: 'pulseGlow 2.5s infinite',
          }}
        >
          <Flame size={16} />
        </span>
        <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FEF08A', display: 'block' }}>
            Akhand Darshan
          </span>
          <span style={{ fontSize: '0.65rem', color: '#D6C7B2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            3D Living Diya
          </span>
        </div>
      </button>

      {/* Full Modal Immersive 3D Darshan */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 8, 7, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.25s ease-out',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '980px',
              maxHeight: '92vh',
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #EAE3D6',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 30,
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FAF7F2',
                border: '1px solid #EAE3D6',
                color: '#1C1917',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              aria-label="Close 3D Darshan"
            >
              <X size={20} />
            </button>

            <InteractiveSacred3DDiya />
          </div>
        </div>
      )}
    </>
  );
}
