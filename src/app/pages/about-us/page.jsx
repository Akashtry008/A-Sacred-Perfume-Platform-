import React from 'react';
import Link from '@/components/common/Link';
import { ShieldCheck, Heart, Award, Flame, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Our Mission & Vedic Purity Standard | VedaPavitra',
  description: 'Learn about VedaPavitra, our Gandhashastra heritage, and why we craft 100% bambooless agarbatti and organic havan cups.',
};

export default function AboutUsPage() {
  return (
    <div style={{ padding: '48px 0 88px', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Our Sacred Mission</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', fontWeight: 600 }}>
            Vedic Heritage & Gandhashastra
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.75rem', margin: '8px 0 16px' }}>
            Reviving The True Sacred Science of Gandha
          </h1>
          <p style={{ color: '#6B635B', fontSize: '1.15rem', lineHeight: 1.7 }}>
            Born from a deep devotion to Vedic rituals, VedaPavitra was created to eliminate harmful charcoal and bamboo cores from Indian places of worship.
          </p>
        </div>

        {/* Feature Hero Image */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '48px', border: '1px solid #EAE3D6' }}>
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=80"
            alt="Vedic puja flame"
            style={{ width: '100%', height: '380px', objectFit: 'cover' }}
          />
        </div>

        {/* Narrative Section 1 */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '40px', marginBottom: '32px', lineHeight: 1.8, color: '#332E2B' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.65rem', marginBottom: '16px', color: '#1C1917' }}>
            Why Bamboo Is Forbidden (Vamsha Raksha)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            In Sanatana Dharma, bamboo (Vamsha) represents progeny, lineage continuity, and generative growth. According to traditional texts such as the Bhavishya Purana, burning bamboo is regarded as spiritually inauspicious.
          </p>
          <p>
            When modern commercial agarbatti factories coat cheap bamboo sticks in waste charcoal powder and synthetic perfume oils, they produce heavy black smoke laden with carbon monoxide and acrolein. At VedaPavitra, we refuse this compromise. Every stick is molded with pure botanical resins and holy tree gums without a single sliver of bamboo.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '10px', padding: '24px' }}>
            <Flame size={28} color="#C8822A" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Zero Toxic Soot</h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', lineHeight: 1.6 }}>
              No eye irritation or coughing during long meditation and daily evening sandhya.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '10px', padding: '24px' }}>
            <Award size={28} color="#C8822A" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Desi Cow Ghee</h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Our havan cups use pure indigenous Desi cow dung and A2 cow ghee for atmospheric shuddhi.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', borderRadius: '10px', padding: '24px' }}>
            <Heart size={28} color="#9B3828" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Gau Mata Seva</h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Every purchase directly sponsors nutritious fodder and sanctuary for rescued old cows.
            </p>
          </div>
        </div>

        {/* Narrative Section 2: Women Artisans */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '40px', lineHeight: 1.8, color: '#332E2B', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.65rem', marginBottom: '16px', color: '#1C1917' }}>
            Handcrafted by Traditional Women Artisans
          </h2>
          <p>
            Our formulations are blended in small sacred batches in Sahibabad, Uttar Pradesh by traditional rural women artisans who have inherited herbal blending traditions across generations. By eliminating heavy machinery and chemical accelerators, each stick is hand-rolled with meditative mindfulness and respect for the deities.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/collections" className="btn-primary" style={{ padding: '14px 32px' }}>
            Explore Our Sacred Offerings <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
