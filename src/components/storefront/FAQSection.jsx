import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection({ faqs, title, subtitle }) {
  const [openId, setOpenId] = useState(faqs?.[0]?.id || null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'transparent' }} aria-labelledby="faq-heading">
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8822A', fontWeight: 600, marginBottom: '6px' }}>
            Got Questions?
          </p>
          <h2 id="faq-heading" className="heading-display" style={{ fontSize: '2.25rem' }}>
            {title || 'Frequently Asked Questions'}
          </h2>
          <p style={{ color: '#6B635B', fontSize: '0.95rem', marginTop: '6px' }}>
            {subtitle || 'Learn about our Vedic formulations, ingredients, and delivery'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  backgroundColor: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: '#1C1917',
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    color="#C8822A"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0,
                      marginLeft: '12px',
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 20px',
                      color: '#6B635B',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      borderTop: '1px solid #FAF7F2',
                      paddingTop: '12px',
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
