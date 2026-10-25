import React from 'react';
import { Flame, ShieldCheck, Award, Truck } from 'lucide-react';

const ICON_MAP = {
  Flame,
  ShieldCheck,
  Award,
  Truck,
};

export default function TrustBar({ badges }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="trust-bar" role="region" aria-label="Brand Guarantees">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {badges.map((b, idx) => {
            const Icon = ICON_MAP[b.icon] || Award;
            return (
              <div key={idx} className="trust-item">
                <div className="trust-icon-box">
                  <Icon size={24} />
                </div>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
