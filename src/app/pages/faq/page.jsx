import React, { useState, useMemo } from 'react';
import Link from '@/components/common/Link';
import { Search, ChevronDown, HelpCircle, MessageSquare, Phone, Mail } from 'lucide-react';
import { INITIAL_FAQS } from '@/lib/seed-data';

const EXTENDED_FAQS = [
  ...INITIAL_FAQS,
  {
    id: 'faq-5',
    category: 'Products',
    question: 'How do I ignite and use Organic Havan Cups safely?',
    answer:
      'Hold the top rim of the havan cup with a brass tongs or place it directly in the complimentary clay/ceramic dish provided. Light the upper rim with a match or lighter until it catches flame for 10-15 seconds. Gently blow out the active flame, allowing the organic sambrani and loban embers to release holy smoke.',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'faq-6',
    category: 'Purity & Shastras',
    question: 'Are your fragrances made from natural essential oils or chemical boosters?',
    answer:
      'Every VedaPavitra recipe is formulated using authentic hydro-distilled natural essential oils, crushed tree bark, temple flower petals (upcycled marigold and rose), and certified desi cow ghee. We strictly do not use DEP (diethyl phthalate) chemical fixatives or petroleum derivatives.',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'faq-7',
    category: 'Shipping',
    question: 'Do you deliver to remote PIN codes and rural temple locations across India?',
    answer:
      'Yes, we ship to over 19,000+ PIN codes across India via Delhivery, BlueDart, and India Post Speed Post. Delivery typically takes 2-3 business days for metros and 4-6 business days for interior districts.',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 'faq-8',
    category: 'Orders & Payments',
    question: 'What payment modes are accepted during online checkout?',
    answer:
      'We accept all major Indian payment methods through our secure 256-bit encrypted gateway: UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards (Visa, Mastercard, RuPay), Netbanking across 50+ Indian banks, and Cash on Delivery (COD) for eligible orders.',
    sortOrder: 8,
    isActive: true,
  },
];

export default function FAQPage() {
  const [faqsList, setFaqsList] = useState(EXTENDED_FAQS);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(['faq-1', 'faq-2']);

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.faqs) {
          setFaqsList(data.faqs);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['ALL', 'Purity & Shastras', 'Products', 'Shipping', 'Orders & Payments', 'Replacements', 'Rituals & Usage'];

  const filteredFaqs = useMemo(() => {
    return faqsList.filter((faq) => {
      const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqsList, activeCategory, searchQuery]);

  const toggleAccordion = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Frequently Asked Questions</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#C8822A',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Help & Knowledge Hub
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.5rem', margin: '0 0 12px', color: '#1C1917' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: '#6B635B', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to know about our sacred Vedic formulations, Gandhashastra purity benchmarks, and shipping timelines.
          </p>
        </div>

        {/* Live Search Bar */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <Search
            size={20}
            color="#A8A29E"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. bamboo, havan cups, shipping, ingredients)..."
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '12px',
              border: '1px solid #D6D3D1',
              fontSize: '0.95rem',
              backgroundColor: '#FFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '0.8125rem',
                color: '#6B635B',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '32px',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '24px',
                fontSize: '0.85rem',
                fontWeight: 500,
                border: activeCategory === cat ? '1px solid #C8822A' : '1px solid #EAE3D6',
                backgroundColor: activeCategory === cat ? '#C8822A' : '#FFF',
                color: activeCategory === cat ? '#FFF' : '#44403C',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <HelpCircle size={40} color="#C8822A" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#1C1917', marginBottom: '8px' }}>No answers found</h3>
            <p style={{ color: '#6B635B', fontSize: '0.9rem', marginBottom: '20px' }}>
              We could not find any question matching &quot;{searchQuery}&quot;. Have a specific query?
            </p>
            <Link href="/pages/contact" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
              Contact Our Care Team
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid #EAE3D6',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s ease',
                    boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.04)' : 'none',
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          color: '#C8822A',
                          fontWeight: 600,
                          marginBottom: '4px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {faq.category}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1C1917', margin: 0, lineHeight: 1.4 }}>
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      size={20}
                      color="#6B635B"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 24px 22px',
                        color: '#44403C',
                        fontSize: '0.925rem',
                        lineHeight: 1.7,
                        borderTop: '1px solid #F5F1EB',
                        paddingTop: '16px',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Us Card */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '16px',
            padding: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#1C1917', marginBottom: '6px' }}>
              Still have questions about our Vedic offerings?
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', margin: 0 }}>
              Our dedicated spiritual seva counselors are available Monday to Saturday, 9:00 AM – 7:00 PM IST.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/pages/contact"
              className="btn btn-secondary"
              style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Mail size={16} /> Contact Us
            </Link>
            <a
              href="https://wa.me/919876543210?text=Namaste%20VedaPavitra,%20I%20have%20a%20question%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageSquare size={16} /> WhatsApp Seva
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
