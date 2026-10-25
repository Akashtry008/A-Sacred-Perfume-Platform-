import React, { useState, useEffect } from 'react';
import HeroSlider from '@/components/storefront/HeroSlider';
import CategoryGrid from '@/components/storefront/CategoryGrid';
import BestsellersSection from '@/components/storefront/BestsellersSection';
import SeasonalBannerStrip from '@/components/storefront/SeasonalBannerStrip';
import InteractiveSacred3DDiya from '@/components/storefront/InteractiveSacred3DDiya';
import PoojaSamagriBuilder from '@/components/storefront/PoojaSamagriBuilder';
import ThreeDStoryPinning from '@/components/storefront/ThreeDStoryPinning';
import FragranceExplorerWheel from '@/components/storefront/FragranceExplorerWheel';
import PromoBannerSection from '@/components/storefront/PromoBannerSection';
import PhilosophySection from '@/components/storefront/PhilosophySection';
import TestimonialsSection from '@/components/storefront/TestimonialsSection';
import FAQSection from '@/components/storefront/FAQSection';
import { db } from '@/lib/db';

export default function HomePage() {
  const [categories, setCategories] = useState(() => {
    try {
      return db.getCategories() || [];
    } catch {
      return [];
    }
  });
  const [bestsellerProducts, setBestsellerProducts] = useState(() => {
    try {
      const res = db.getProducts({ limit: 4 });
      const prods = res?.products || res || [];
      const best = prods.filter((p) => p.isBestseller);
      return best.length > 0 ? best.slice(0, 4) : prods.slice(0, 4);
    } catch {
      return [];
    }
  });
  const [banners, setBanners] = useState(() => {
    try {
      const data = db.getBannersAdmin ? db.getBannersAdmin() : {};
      return {
        slides: data.slides || [],
        promoBanner: data.promoBanner || {},
        seasonalBanners: data.seasonalBanners || [],
        diyaShowcase: data.diyaShowcase || (db.getDiyaShowcaseAdmin ? db.getDiyaShowcaseAdmin() : null),
      };
    } catch {
      return { slides: [], promoBanner: {}, seasonalBanners: [], diyaShowcase: null };
    }
  });
  const [faqs, setFaqs] = useState(() => {
    try {
      return (db.getFAQs ? db.getFAQs() : []).slice(0, 4);
    } catch {
      return [];
    }
  });
  const [reviews, setReviews] = useState(() => {
    try {
      return (db.getReviews ? db.getReviews() : []).slice(0, 3);
    } catch {
      return [];
    }
  });

  const [activeSections, setActiveSections] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    // Fetch live site settings for customized copy and headlines
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch((e) => console.error('Settings fetch error:', e));

    // Fetch live active storefront sections
    fetch('/api/sections')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.sections) {
          setActiveSections(data.sections);
        }
      })
      .catch((e) => console.error('Sections fetch error:', e));

    // Fetch live storefront data from FastAPI + MongoDB backend
    fetch('/api/products?isBestseller=true&limit=4')
      .then((r) => r.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setBestsellerProducts(data.products);
        } else {
          fetch('/api/products?limit=4')
            .then((r2) => r2.json())
            .then((d2) => {
              if (d2.products) setBestsellerProducts(d2.products);
            });
        }
      })
      .catch((e) => console.error('Products fetch error:', e));

    fetch('/api/collections')
      .then((r) => r.json())
      .then((data) => {
        if (data.collections) setCategories(data.collections);
      })
      .catch((e) => console.error('Collections fetch error:', e));

    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setBanners({
            slides: data.slides || [],
            promoBanner: data.promoBanner || {},
            hampers: data.hampers || data.promoBanner?.hampers || [],
            seasonalBanners: data.seasonalBanners || [],
            diyaShowcase: data.diyaShowcase || null,
          });
        }
      })
      .catch((e) => console.error('Banners fetch error:', e));

    fetch('/api/faqs')
      .then((r) => r.json())
      .then((data) => {
        if (data.faqs) setFaqs(data.faqs.slice(0, 4));
      })
      .catch((e) => console.error('FAQs fetch error:', e));

    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews.slice(0, 3));
      })
      .catch((e) => console.error('Reviews fetch error:', e));
  }, []);

  const isSectionActive = (key) => {
    if (!activeSections) return true; // Default to visible while loading
    const sec = activeSections.find((s) => s.id === key || s.key === key);
    if (!sec) return true;
    return Boolean(sec.isEnabled && !sec.isDeleted);
  };

  const rawSlides = banners.slides && banners.slides.length > 0 ? banners.slides : [];
  const activeSlides = rawSlides.filter((s) => s.isActive !== false);
  const slides = activeSlides.length > 0 ? activeSlides : (rawSlides.length > 0 ? rawSlides : [
    {
      id: 'slide-1',
      badge: '100% Natural & Charcoal-Free',
      heading: 'Mini Vedic Yajna For Daily Grah Shuddhi',
      subheading: 'Handcrafted Desi Cow Dung & Ghee Havan Cups. Bring Temple Sanctity Home In 15 Minutes.',
      ctaText: 'Shop Havan Cups',
      ctaLink: '/collections/organic-havan-cups',
      secondaryCtaText: 'Complete Combos',
      secondaryCtaLink: '/collections/curated-puja-combos',
      desktopImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'slide-2',
      badge: 'Authentic Gandhashastra Vidhi',
      heading: 'Experience The Purest Devotional Fragrance',
      subheading: '100% Bambooless Agarbatti, Organic Cow Ghee Havan Cups & Sacred Natural Attars.',
      ctaText: 'Explore Sacred Catalog',
      ctaLink: '/collections',
      secondaryCtaText: 'View Bestsellers',
      secondaryCtaLink: '/collections/bestsellers',
      desktopImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1600&q=80',
    },
  ]);

  const formattedSlides = slides.map((s, idx) => {
    if (idx === 0 && siteSettings?.heroMainHeading) {
      return {
        ...s,
        heading: siteSettings.heroMainHeading || s.heading,
        subheading: siteSettings.heroSubheading || s.subheading,
        badge: siteSettings.heroBadge || s.badge,
        ctaText: siteSettings.heroPrimaryCtaText || s.ctaText,
        secondaryCtaText: siteSettings.heroSecondaryCtaText || s.secondaryCtaText,
      };
    }
    return s;
  });

  return (
    <>
      {/* 1. Hero Carousel (Auto-rotates every 2s, arrows removed) */}
      {isSectionActive('hero_slider') && <HeroSlider slides={formattedSlides} />}

      {/* 2. Categories Ritual Grid */}
      {isSectionActive('rituals_grid') && (
        <CategoryGrid
          categories={categories}
          title={siteSettings?.ritualsTitle || 'Explore By Sacred Ritual'}
          subtitle={siteSettings?.ritualsSubtitle || 'Pure formulations created for every devotional moment of your day'}
        />
      )}

      {/* 3. Bestsellers Showcase */}
      {isSectionActive('bestsellers') && (
        <BestsellersSection
          products={bestsellerProducts}
          title={siteSettings?.bestsellersTitle || 'Pure Handcrafted Bestsellers'}
          subtitle={siteSettings?.bestsellersSubtitle || 'Loved by over 10,000+ devotees across India for daily puja and meditation'}
        />
      )}

      {/* 4. Reserved Mid-Page Seasonal & Festival Strip Banner (Admin Managed) */}
      {isSectionActive('seasonal_strip') && <SeasonalBannerStrip banners={banners.seasonalBanners} />}

      {/* 5. Signature 3D Experience: Interactive Sacred Brass Akhand Diya & Living Jyot Darshan */}
      {isSectionActive('interactive_3d_diya') && <InteractiveSacred3DDiya config={banners.diyaShowcase} />}

      {/* 6. Interactive Pooja Samagri Kit Builder (Configurator) */}
      {isSectionActive('samagri_builder') && <PoojaSamagriBuilder />}

      {/* 7. 3D Devotional Journey: Storytelling with Screen Pinning & 360 Product Movement */}
      {isSectionActive('three_d_story') && <ThreeDStoryPinning />}

      {/* 8. Gandhashastra Fragrance & Mood Explorer Wheel */}
      {isSectionActive('fragrance_wheel') && <FragranceExplorerWheel />}

      {/* 9. Promotional Hamper Feature */}
      {isSectionActive('promotional_hampers') && (
        <PromoBannerSection
          content={banners.promoBanner}
          hampers={banners.hampers || banners.promoBanner?.hampers}
        />
      )}

      {/* 10. Vedic Philosophy & Gau Seva */}
      {isSectionActive('vedic_philosophy') && (
        <PhilosophySection
          title={siteSettings?.philosophyTitle || 'Restoring Sanctity To The Sacred Daily Puja'}
          content={siteSettings?.philosophyContent || 'Our sacred commitment to preserving ancient Gandhashastra, supporting indigenous cow sanctuaries, and purifying homes.'}
        />
      )}

      {/* 11. Testimonials: Overlapping cards deck with 3D hover highlight */}
      {isSectionActive('devotee_testimonials') && (
        <TestimonialsSection
          reviews={reviews}
          title={siteSettings?.testimonialsTitle || 'Over 10,000+ Sacred Households Sanctified'}
          subtitle={siteSettings?.testimonialsSubtitle || 'Hear from temple priests, families, and yoga practitioners who elevated their daily puja.'}
        />
      )}

      {/* 12. FAQ Accordion */}
      {isSectionActive('faqs_accordion') && (
        <FAQSection
          faqs={faqs}
          title={siteSettings?.faqsTitle || 'Frequently Asked Questions'}
          subtitle={siteSettings?.faqsSubtitle || 'Everything you need to know about our ingredients, delivery, and puja vidhi'}
        />
      )}
    </>
  );
}
