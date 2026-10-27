import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Save,
  Eye,
  Flame,
  Bell,
  Volume2,
  Check,
  ShoppingBag,
  EyeOff,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import ImageUploadField from '@/components/admin/ImageUploadField';
import VideoUploadField from '@/components/admin/VideoUploadField';
import { db } from '@/lib/db';
import { getAdminAuthHeaders } from '@/lib/utils';

export default function AdminBannersPage() {
  const { showToast } = useToast();
  const [slides, setSlides] = useState([]);
  const [promoBanner, setPromoBanner] = useState(null);
  const [hampers, setHampers] = useState([]);
  const [activeHamperIndex, setActiveHamperIndex] = useState(0);
  const [seasonalBanners, setSeasonalBanners] = useState([]);
  const [diyaShowcase, setDiyaShowcase] = useState({
    id: 'diya_showcase',
    isActive: true,
    badge: '100% Panchaloha Brass • Temple Grade',
    title: 'Solid Handcrafted Brass Akhand Diya',
    price: 499,
    originalPrice: 799,
    discountText: '37% OFF',
    taxNote: 'Inclusive of all taxes',
    description:
      'Cast in heavy temple brass by traditional artisans. Features hand-carved lotus petal engraving, a deep oil reservoir for uninterrupted all-day lighting, and a balanced weighted pedestal. Consecrated for daily grah shuddhi and auspicious deepam puja.',
    highlights: [
      'Heavy Brass (240g)',
      'Deep 8-Hour Reservoir',
      'Zero Carbon Emissions',
      'Traditional Baati Spout',
    ],
    ctaText: 'Bring Akhand Diya Home — ₹499',
    productId: 'prod-solid-brass-diya',
    variantId: 'var-bd-01',
    showTempleBell: true,
    bellTooltip: 'Click to ring sacred temple bell (घण्टा नाद)',
  });
  const [isSavingDiya, setIsSavingDiya] = useState(false);
  const [isBellRingingPreview, setIsBellRingingPreview] = useState(false);
  const [brandSettings, setBrandSettings] = useState({
    brandName: 'VedaPavitra',
    brandTagline: 'Pure Vedic Samagri & Devotional Essentials',
    brandLogo: '',
    brandEmblem: '',
    announcementText: '✦ Free Sacred Ganga Jal with orders above ₹999 | Pure Temple Organic ✦',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBannersAndSettings();
  }, []);

  const loadBannersAndSettings = async () => {
    try {
      setIsLoading(true);
      const [bannersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/banners', { headers: getAdminAuthHeaders() }),
        fetch('/api/admin/settings', { headers: getAdminAuthHeaders() }),
      ]);

      if (bannersRes.ok) {
        const data = await bannersRes.json();
        const slidesData = data.slides || data.banners?.slides || [];
        const promoData = data.promoBanner || data.banners?.promoBanner || null;
        const seasonalData = data.seasonalBanners || data.banners?.seasonalBanners || [];
        setSlides(slidesData);
        setSeasonalBanners(seasonalData);
        if (data.diyaShowcase) {
          setDiyaShowcase((prev) => ({
            ...prev,
            ...data.diyaShowcase,
            highlights: data.diyaShowcase.highlights || prev.highlights,
          }));
        } else {
          try {
            const localDiya = db.getDiyaShowcaseAdmin?.();
            if (localDiya) {
              setDiyaShowcase((prev) => ({
                ...prev,
                ...localDiya,
                highlights: localDiya.highlights || prev.highlights,
              }));
            }
          } catch {}
        }
        let loadedHampers = data.hampers || [];
        if (!loadedHampers.length && promoData?.hampers?.length) {
          loadedHampers = promoData.hampers;
        } else if (!loadedHampers.length && promoData) {
          loadedHampers = [promoData];
        }

        if (loadedHampers.length > 0) {
          const normalized = loadedHampers.map((h, idx) => ({
            id: h.id || `hamper-${idx + 1}`,
            badge: h.badge || 'SACRED FESTIVE GIFTING',
            heading: h.heading || 'The Sampoorna Vedic Puja Hamper',
            subheading: h.subheading || 'A grand, sacred monthly assortment of Pure Royal Mysore Sandalwood Agarbatti, Gir Cow Ghee Havan Cups, Kashmiri Kesar Chandan Dhoop, and a Handcrafted Heavy Solid Brass Diya.',
            price: h.price || '₹999',
            comparePrice: h.comparePrice || '₹1,350',
            offerPrice: h.offerPrice || h.price || 'Special Festive Price: ₹999 (Save 26%)',
            ctaText: h.ctaText || 'Claim Festive Hamper',
            ctaLink: h.ctaLink || '/products/sampoorna-vedic-daily-puja-combo-box',
            imageUrl: h.imageUrl || h.image || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
            image: h.image || h.imageUrl || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
            features: h.features || [
              '40x Mysore Sandalwood Sticks',
              '12x Cow Ghee Havan Cups',
              'Solid Brass Diya Included',
            ],
            isActive: h.isActive !== false,
          }));
          setHampers(normalized);
          setPromoBanner(normalized[0]);
        } else {
          const defaultHampers = [{
            id: 'hamper-1',
            badge: 'SACRED FESTIVE GIFTING',
            heading: 'The Sampoorna Vedic Puja Hamper',
            subheading: 'A grand, sacred monthly assortment of Pure Royal Mysore Sandalwood Agarbatti, Gir Cow Ghee Havan Cups, Kashmiri Kesar Chandan Dhoop, and a Handcrafted Heavy Solid Brass Diya.',
            price: '₹999',
            comparePrice: '₹1,350',
            offerPrice: 'Special Festive Price: ₹999 (Save 26%)',
            ctaText: 'Claim Festive Hamper',
            ctaLink: '/products/sampoorna-vedic-daily-puja-combo-box',
            imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
            features: [
              '40x Mysore Sandalwood Sticks',
              '12x Cow Ghee Havan Cups',
              'Solid Brass Diya Included',
            ],
            isActive: true,
          }];
          setHampers(defaultHampers);
          setPromoBanner(defaultHampers[0]);
        }
      }

      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData) {
          setBrandSettings((prev) => ({ ...prev, ...sData }));
        }
      }
    } catch (e) {
      console.error('Failed to load banners and settings:', e);
      try {
        const localDiya = db.getDiyaShowcaseAdmin?.();
        if (localDiya) {
          setDiyaShowcase((prev) => ({
            ...prev,
            ...localDiya,
            highlights: localDiya.highlights || prev.highlights,
          }));
        }
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlideChange = (index, field, value) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        badge: 'NEW SACRED ARRIVAL',
        heading: 'Handcrafted Sandalwood Dhoop',
        subheading: 'Infused with ancient Kashmiri kesar and organic A2 cow ghee.',
        ctaText: 'Shop New Arrivals',
        ctaLink: '/collections/bambooless-incense-sticks',
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1920&q=80',
      },
    ]);
  };

  const handleDeleteSlide = (index) => {
    if (slides.length <= 1) {
      showToast?.('At least one hero banner is required.', 'error');
      return;
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  // Seasonal Strip Banners Handlers
  const handleAddSeasonalBanner = () => {
    setSeasonalBanners([
      ...seasonalBanners,
      {
        id: `sb-${Date.now()}`,
        badge: 'SPECIAL FESTIVE OFFER',
        heading: 'Divine Festive Samagri Collection',
        subheading: 'Sanctify your home with authentic Shastra-certified havan cups and incense.',
        ctaText: 'Explore Collection',
        ctaLink: '/collections/curated-puja-combos',
        imageUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1920&q=80',
        isActive: true,
      },
    ]);
  };

  const handleSeasonalChange = (index, field, value) => {
    const updated = [...seasonalBanners];
    updated[index] = { ...updated[index], [field]: value };
    setSeasonalBanners(updated);
  };

  const handleDeleteSeasonal = (index) => {
    setSeasonalBanners(seasonalBanners.filter((_, i) => i !== index));
    showToast?.('Seasonal banner deleted.', 'info');
  };

  // Diya Showcase Handlers
  const handleDiyaChange = (field, value) => {
    setDiyaShowcase((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'price' || field === 'originalPrice') {
        const p = Number(field === 'price' ? value : prev.price);
        const op = Number(field === 'originalPrice' ? value : prev.originalPrice);
        if (op > p && p > 0) {
          const pct = Math.round(((op - p) / op) * 100);
          updated.discountText = `${pct}% OFF`;
        }
        if (field === 'price') {
          updated.ctaText = `Bring Akhand Diya Home — ₹${p}`;
        }
      }
      return updated;
    });
  };

  const handleHighlightChange = (index, value) => {
    const updatedHighlights = [...(diyaShowcase.highlights || [])];
    updatedHighlights[index] = value;
    setDiyaShowcase((prev) => ({ ...prev, highlights: updatedHighlights }));
  };

  const handleAddHighlight = () => {
    setDiyaShowcase((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), 'Sacred Vedic Feature'],
    }));
  };

  const handleDeleteHighlight = (index) => {
    setDiyaShowcase((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  const handleSaveDiyaOnly = async () => {
    setIsSavingDiya(true);
    try {
      const res = await fetch('/api/admin/diya-showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diyaShowcase),
      });
      try {
        db.updateDiyaShowcaseAdmin?.(diyaShowcase);
      } catch {}
      if (res.ok) {
        showToast?.('3D Sacred Brass Akhand Diya showcase updated successfully!', 'success');
      } else {
        showToast?.('3D showcase updated locally.', 'info');
      }
    } catch (e) {
      try {
        db.updateDiyaShowcaseAdmin?.(diyaShowcase);
        showToast?.('3D showcase updated locally.', 'info');
      } catch {
        showToast?.('Failed to save 3D Diya showcase', 'error');
      }
    } finally {
      setIsSavingDiya(false);
    }
  };

  const testBellAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const bellPartials = [
        { freq: 216, gain: 0.38, decay: 4.8 },
        { freq: 432, gain: 0.55, decay: 4.4 },
        { freq: 434.5, gain: 0.40, decay: 4.2 },
        { freq: 518, gain: 0.28, decay: 3.6 },
        { freq: 648, gain: 0.24, decay: 3.2 },
        { freq: 864, gain: 0.20, decay: 2.8 },
      ];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.85, now);
      masterGain.connect(ctx.destination);
      bellPartials.forEach(({ freq, gain: pGain, decay }) => {
        const osc = ctx.createOscillator();
        const gNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gNode.gain.setValueAtTime(0, now);
        gNode.gain.linearRampToValueAtTime(pGain, now + 0.008);
        gNode.gain.exponentialRampToValueAtTime(0.00003, now + decay);
        osc.connect(gNode);
        gNode.connect(masterGain);
        osc.start(now);
        osc.stop(now + decay + 0.15);
      });
      setIsBellRingingPreview(true);
      showToast?.('🔔 Sanctum Temple Bell chime echoed!', 'success');
      setTimeout(() => setIsBellRingingPreview(false), 2400);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHamper = () => {
    const newIdx = hampers.length + 1;
    const newHamper = {
      id: `hamper-${Date.now()}`,
      badge: 'EXCLUSIVE FESTIVE HAMPER',
      heading: `Vedic Puja Hamper #${newIdx}`,
      subheading: 'Curated sacred assortment of artisanal brassware, organic dhoop, and pure desi cow ghee essentials.',
      price: '₹1,299',
      comparePrice: '₹1,799',
      offerPrice: 'Special Festive Price: ₹1,299 (Save 28%)',
      ctaText: 'Claim Festive Hamper',
      ctaLink: '/collections/curated-puja-combos',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      features: [
        'Desi Gir Cow Ghee Havan Cups (Pack of 12)',
        'Temple Grade Solid Brass Diya',
        'Kashmiri Kesar Agarbatti Sticks',
      ],
      isActive: true,
    };
    const updated = [...hampers, newHamper];
    setHampers(updated);
    setActiveHamperIndex(updated.length - 1);
    setPromoBanner(updated[0]);
    showToast?.(`Hamper #${newIdx} added! Configure its details and click Save Changes above.`, 'success');
  };

  const handleDeleteHamper = (indexToDelete) => {
    if (hampers.length <= 1) {
      showToast?.('At least one hamper must remain configured.', 'error');
      return;
    }
    const updated = hampers.filter((_, i) => i !== indexToDelete);
    setHampers(updated);
    setActiveHamperIndex(Math.max(0, indexToDelete - 1));
    setPromoBanner(updated[0]);
    showToast?.('Hamper removed.', 'info');
  };

  const handleHamperChange = (field, value) => {
    const updated = [...hampers];
    if (!updated[activeHamperIndex]) return;
    updated[activeHamperIndex] = { ...updated[activeHamperIndex], [field]: value };
    if (field === 'imageUrl') {
      updated[activeHamperIndex].image = value;
    }
    setHampers(updated);
    if (activeHamperIndex === 0) {
      setPromoBanner(updated[0]);
    }
  };

  const handleHamperFeatureChange = (fIndex, value) => {
    const updated = [...hampers];
    if (!updated[activeHamperIndex]) return;
    const feats = [...(updated[activeHamperIndex].features || [])];
    feats[fIndex] = value;
    updated[activeHamperIndex].features = feats;
    setHampers(updated);
    if (activeHamperIndex === 0) setPromoBanner(updated[0]);
  };

  const handleAddHamperFeature = () => {
    const updated = [...hampers];
    if (!updated[activeHamperIndex]) return;
    const feats = [...(updated[activeHamperIndex].features || []), 'New Sacred Item Included'];
    updated[activeHamperIndex].features = feats;
    setHampers(updated);
    if (activeHamperIndex === 0) setPromoBanner(updated[0]);
  };

  const handleDeleteHamperFeature = (fIndex) => {
    const updated = [...hampers];
    if (!updated[activeHamperIndex]) return;
    const feats = (updated[activeHamperIndex].features || []).filter((_, i) => i !== fIndex);
    updated[activeHamperIndex].features = feats;
    setHampers(updated);
    if (activeHamperIndex === 0) setPromoBanner(updated[0]);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payloadHampers = (hampers && hampers.length > 0)
        ? hampers.map((h, idx) => ({
            ...h,
            id: h.id || `hamper-${idx + 1}`,
            image: h.imageUrl || h.image || '',
            imageUrl: h.imageUrl || h.image || '',
          }))
        : (promoBanner ? [{ ...promoBanner, image: promoBanner.imageUrl || promoBanner.image || '' }] : []);

      const payloadPromo = payloadHampers.length > 0
        ? { ...payloadHampers[0], hampers: payloadHampers }
        : null;

      const [bannersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/banners', {
          method: 'POST',
          headers: getAdminAuthHeaders(),
          body: JSON.stringify({
            slides,
            promoBanner: payloadPromo,
            hampers: payloadHampers,
            seasonalBanners,
            diyaShowcase,
          }),
        }),
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: getAdminAuthHeaders(),
          body: JSON.stringify(brandSettings),
        }),
      ]);

      try {
        db.updateBannersAdmin?.({
          slides,
          promoBanner: payloadPromo,
          seasonalBanners,
          diyaShowcase,
        });
        db.updateDiyaShowcaseAdmin?.(diyaShowcase);
      } catch {}

      if (!bannersRes.ok || !settingsRes.ok) throw new Error('Failed to update storefront media');
      showToast?.('All banners, hampers, 3D showcase & brand assets saved successfully!', 'success');
    } catch (e) {
      showToast?.(e.message || 'Error saving banners', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#6B635B' }}>Loading storefront media assets...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
            Storefront Banners, Posters & Brand Media
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            Upload direct fixed-size images from your device or paste links for hero slides, festive hamper box posters, seasonal strips, and brand logos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleAddSlide}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Hero Slide
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save Live Store Media'}
          </button>
        </div>
      </div>

      {/* 📐 Official Media Specifications & Fixed Dimensions Guide Card */}
      <div
        style={{
          backgroundColor: '#FFFBF5',
          border: '1.5px solid #F3DFC1',
          borderRadius: '16px',
          padding: '22px 26px',
          marginBottom: '36px',
          boxShadow: '0 4px 20px rgba(200, 130, 42, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.35rem' }}>📐</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#9B3828' }}>
            Storefront Media Fixed Resolution & Upload Guide
          </h3>
          <span
            style={{
              backgroundColor: '#C8822A',
              color: '#FFF',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Fixed Sizes Specified
          </span>
        </div>
        <p style={{ margin: '0 0 18px', fontSize: '0.875rem', color: '#6B635B', lineHeight: 1.5 }}>
          Upload high-resolution images directly matching the exact pixel dimensions below. Our direct device uploader automatically tests image dimensions and warns if the aspect ratio differs:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Brand Logo Guide */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1.5px solid #EAE3D6',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>🏷️ Brand Logo & Emblem</span>
              <span style={{ backgroundColor: '#FAF0E4', color: '#C8822A', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                Header & Favicon
              </span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#9B3828', marginBottom: '4px' }}>
              240 × 60 px <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#78716C' }}>(Header)</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#C8822A', marginBottom: '6px' }}>
              512 × 512 px <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#78716C' }}>(Favicon/Emblem)</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#57534E', lineHeight: 1.5 }}>
              <li><strong>Format:</strong> Transparent PNG or vector SVG recommended.</li>
              <li><strong>Padding:</strong> Leave small breathing space around logo letters.</li>
            </ul>
          </div>

          {/* Hero Slider Guide */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1.5px solid #EAE3D6',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>🖼️ Homepage Hero Slider</span>
              <span style={{ backgroundColor: '#FAF0E4', color: '#C8822A', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                16:9 / 12:5 Wide
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9B3828', marginBottom: '6px' }}>
              1920 × 800 px <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#78716C' }}>(Fixed Size)</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#57534E', lineHeight: 1.5 }}>
              <li><strong>Safe Area:</strong> Focal subject within center 800 × 800 px for mobile phones.</li>
              <li><strong>Formats:</strong> WebP, JPG, or PNG (Recommended &lt; 2.5 MB).</li>
            </ul>
          </div>

          {/* Festive Hamper Box Poster Guide */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1.5px solid #EAE3D6',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>🎁 Festive Hamper Box</span>
              <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                1:1 Perfect Square
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#C8822A', marginBottom: '6px' }}>
              1000 × 1000 px <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#78716C' }}>(Fixed Size)</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#57534E', lineHeight: 1.5 }}>
              <li><strong>Framing:</strong> Keep complete gift box centered with ~10% edge padding.</li>
              <li><strong>Aspect:</strong> Exactly 1:1 square to fit homepage grid and mobile screen.</li>
            </ul>
          </div>

          {/* Reserved Seasonal Strip Banner Guide */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1.5px solid #EAE3D6',
              borderRadius: '12px',
              padding: '16px 18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>🏷️ Seasonal Banner Strip</span>
              <span style={{ backgroundColor: '#FAF0E4', color: '#9B3828', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                4.2:1 Panoramic
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9B3828', marginBottom: '6px' }}>
              1920 × 450 px <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#78716C' }}>(Fixed Size)</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#57534E', lineHeight: 1.5 }}>
              <li><strong>Slot:</strong> Mid-homepage panoramic strip for festivals and rituals.</li>
              <li><strong>Safe Area:</strong> Text overlay sits on left, artwork on right.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================================== */}
      {/* 1. BRAND IDENTITY & LOGO UPLOAD SECTION */}
      {/* ============================================================================== */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1.5px solid #EAE3D6',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          marginBottom: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Flame size={20} color="#C8822A" />
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', margin: 0 }}>
            Brand Identity, Header Logo & Emblem
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6B635B', margin: '0 0 20px' }}>
          Upload high-resolution brand logo files directly from your computer to sanctify your storefront header and favicon.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Header Logo Upload */}
          <div style={{ backgroundColor: '#FAF9F6', padding: '18px', borderRadius: '12px', border: '1px solid #EAE3D6' }}>
            <ImageUploadField
              label="Storefront Header Logo"
              recommendedWidth={240}
              recommendedHeight={60}
              aspectRatioText="4:1 Horizontal"
              value={brandSettings.brandLogo}
              onChange={(url) => setBrandSettings({ ...brandSettings, brandLogo: url })}
              helperText="Transparent PNG or SVG recommended. Displays prominently in the top navigation bar."
            />
          </div>

          {/* Favicon / Emblem Upload */}
          <div style={{ backgroundColor: '#FAF9F6', padding: '18px', borderRadius: '12px', border: '1px solid #EAE3D6' }}>
            <ImageUploadField
              label="Brand Emblem & Favicon Icon"
              recommendedWidth={512}
              recommendedHeight={512}
              aspectRatioText="1:1 High-Res Square"
              value={brandSettings.brandEmblem}
              onChange={(url) => setBrandSettings({ ...brandSettings, brandEmblem: url })}
              helperText="Square emblem used for browser tab favicon, mobile bookmarks, and PWA icon."
            />
          </div>
        </div>

        {/* Brand Name & Tagline Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
              Brand Name
            </label>
            <input
              type="text"
              value={brandSettings.brandName || ''}
              onChange={(e) => setBrandSettings({ ...brandSettings, brandName: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
              Brand Subtitle / Tagline
            </label>
            <input
              type="text"
              value={brandSettings.brandTagline || ''}
              onChange={(e) => setBrandSettings({ ...brandSettings, brandTagline: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================================== */}
      {/* 2. HERO CAROUSEL SLIDES CUSTOMIZATION */}
      {/* ============================================================================== */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '16px' }}>
          Homepage Hero Carousel Slides ({slides.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#C8822A',
                    backgroundColor: '#FAF0E4',
                    padding: '4px 12px',
                    borderRadius: '14px',
                    textTransform: 'uppercase',
                  }}
                >
                  Hero Slide #{idx + 1}
                </span>

                <button
                  onClick={() => handleDeleteSlide(idx)}
                  style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                >
                  <Trash2 size={15} /> Remove
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={slide.badge || ''}
                      onChange={(e) => handleSlideChange(idx, 'badge', e.target.value)}
                      placeholder="e.g. 100% NATURAL & CHARCOAL-FREE"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Main Heading *
                    </label>
                    <input
                      type="text"
                      value={slide.heading || ''}
                      onChange={(e) => handleSlideChange(idx, 'heading', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Subheading / Body *
                    </label>
                    <textarea
                      rows={2}
                      value={slide.subheading || ''}
                      onChange={(e) => handleSlideChange(idx, 'subheading', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                        Primary Button Text
                      </label>
                      <input
                        type="text"
                        value={slide.ctaText || ''}
                        onChange={(e) => handleSlideChange(idx, 'ctaText', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                        Button Target Link
                      </label>
                      <input
                        type="text"
                        value={slide.ctaLink || ''}
                        onChange={(e) => handleSlideChange(idx, 'ctaLink', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Special Offer / Deal Highlight Tag
                    </label>
                    <input
                      type="text"
                      value={slide.offerTag || ''}
                      onChange={(e) => handleSlideChange(idx, 'offerTag', e.target.value)}
                      placeholder="e.g. Free Pure Ganga Jal on Orders ₹999+"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Media Format Toggle: Image vs Video Banner */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      Media Presentation Mode
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button
                        type="button"
                        onClick={() => handleSlideChange(idx, 'mediaType', 'image')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: slide.mediaType !== 'video' ? '1.5px solid #C8822A' : '1px solid #D6D3D1',
                          backgroundColor: slide.mediaType !== 'video' ? '#FAF0E4' : '#FFF',
                          color: slide.mediaType !== 'video' ? '#C8822A' : '#57534E',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        🖼️ Static Photo Banner
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSlideChange(idx, 'mediaType', 'video')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: slide.mediaType === 'video' ? '1.5px solid #C8822A' : '1px solid #D6D3D1',
                          backgroundColor: slide.mediaType === 'video' ? '#FAF0E4' : '#FFF',
                          color: slide.mediaType === 'video' ? '#C8822A' : '#57534E',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        🎬 Video Background Banner
                      </button>
                    </div>
                  </div>

                  {/* Video Upload Field if Video Banner selected */}
                  {slide.mediaType === 'video' && (
                    <VideoUploadField
                      label="Hero Video Background (MP4 / WebM)"
                      value={slide.videoUrl || ''}
                      onChange={(url) => handleSlideChange(idx, 'videoUrl', url)}
                      maxSizeMB={35}
                      helperText="Allowed: MP4, WebM (Max 35MB). Loops automatically and muted in hero background."
                    />
                  )}

                  {/* Direct Image Upload Field with Fixed Size */}
                  <ImageUploadField
                    label={slide.mediaType === 'video' ? "Poster Fallback Image (Shown while video loads)" : "Hero Slide Background Image"}
                    recommendedWidth={1920}
                    recommendedHeight={800}
                    aspectRatioText="16:9 / 12:5 Widescreen"
                    value={slide.imageUrl || ''}
                    onChange={(url) => handleSlideChange(idx, 'imageUrl', url)}
                    helperText="Upload 1920 × 800 px image directly from your computer. Mobile focal area is centered."
                    required
                  />
                </div>

                {/* Live Preview Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>
                      Live Banner Preview
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#78716C' }}>Ratio 16:9</span>
                  </div>
                  <div
                    style={{
                      height: '240px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#1C1917',
                    }}
                  >
                    {slide.imageUrl && (
                      <img
                        src={slide.imageUrl}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, rgba(28,25,23,0.9) 0%, rgba(28,25,23,0.4) 100%)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#FFF',
                      }}
                    >
                      {slide.badge && (
                        <div style={{ fontSize: '0.65rem', color: '#FEF08A', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                          {slide.badge}
                        </div>
                      )}
                      <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', margin: '0 0 6px', color: '#FFF' }}>
                        {slide.heading || 'Banner Heading'}
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#D6D3D1', margin: '0 0 10px', lineHeight: 1.4 }}>
                        {slide.subheading?.slice(0, 90)}...
                      </p>
                      <div>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#C8822A', color: '#FFF', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                          {slide.ctaText || 'Shop Now'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================================== */}
      {/* 3. PROMOTIONAL FESTIVE HAMPER POSTER SECTION (MULTI-HAMPER CUSTOMIZATION) */}
      {/* ============================================================================== */}
      {(hampers.length > 0 || promoBanner) && (() => {
        const currHamper = hampers[activeHamperIndex] || promoBanner || {};
        return (
          <div
            id="festive-hampers"
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              marginBottom: '40px',
            }}
          >
            {/* Header with Title and Add Hamper Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '20px',
                borderBottom: '1px solid #F5F1EB',
                paddingBottom: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.25rem' }}>🎁</span>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', margin: 0 }}>
                    Homepage Festive Gift Hampers & Combo Boxes
                  </h2>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    {hampers.length} {hampers.length === 1 ? 'Hamper' : 'Hampers'} Active
                  </span>
                </div>
                <p style={{ color: '#78716C', fontSize: '0.85rem', margin: 0 }}>
                  Curate sacred gift combos, festive boxes, and celebration packages featured on the homepage.
                </p>
              </div>

              {/* ADD ANOTHER HAMPER BUTTON */}
              <button
                type="button"
                onClick={handleAddHamper}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(200, 130, 42, 0.25)',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} /> Add Another Hamper
              </button>
            </div>

            {/* Hamper Selector Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '14px',
                marginBottom: '20px',
                borderBottom: '1px solid #F5F1EB',
              }}
            >
              {hampers.map((hamper, idx) => {
                const isSelected = idx === activeHamperIndex;
                return (
                  <div
                    key={hamper.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid #C8822A' : '1px solid #EAE3D6',
                      backgroundColor: isSelected ? '#FEF9F0' : '#FAF7F2',
                      padding: '6px 10px',
                      gap: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveHamperIndex(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: isSelected ? '#C8822A' : '#44403C',
                        }}
                      >
                        Hamper #{idx + 1}: {hamper.heading?.slice(0, 24) || 'Sacred Hamper'}
                        {hamper.heading?.length > 24 ? '...' : ''}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#78716C' }}>
                        {hamper.price || '₹999'} • {hamper.badge || 'FESTIVE'}
                      </span>
                    </button>

                    {hampers.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHamper(idx);
                        }}
                        title="Delete this hamper"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#DC2626',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '4px',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Hamper Editor Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase' }}>
                    Editing Hamper #{activeHamperIndex + 1}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#78716C' }}>
                    ID: {currHamper.id || `hamper-${activeHamperIndex + 1}`}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Badge Tag (e.g. SACRED FESTIVE GIFTING)
                  </label>
                  <input
                    type="text"
                    value={currHamper.badge || ''}
                    onChange={(e) => handleHamperChange('badge', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Hamper Title / Package Name
                  </label>
                  <input
                    type="text"
                    value={currHamper.heading || ''}
                    onChange={(e) => handleHamperChange('heading', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Description Body
                  </label>
                  <textarea
                    rows={3}
                    value={currHamper.subheading || ''}
                    onChange={(e) => handleHamperChange('subheading', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Selling Price (e.g. ₹999)
                    </label>
                    <input
                      type="text"
                      value={currHamper.price || ''}
                      onChange={(e) => handleHamperChange('price', e.target.value)}
                      placeholder="₹999"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      MRP / Compare Price (e.g. ₹1,350)
                    </label>
                    <input
                      type="text"
                      value={currHamper.comparePrice || ''}
                      onChange={(e) => handleHamperChange('comparePrice', e.target.value)}
                      placeholder="₹1,350"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Offer Note / Special Highlight Text
                  </label>
                  <input
                    type="text"
                    value={currHamper.offerPrice || ''}
                    onChange={(e) => handleHamperChange('offerPrice', e.target.value)}
                    placeholder="e.g. Special Festive Price: ₹999 (Save 26%)"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Hamper Highlights / Items List */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#44403C' }}>
                      Hamper Box Contents & Highlights
                    </label>
                    <button
                      type="button"
                      onClick={handleAddHamperFeature}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#C8822A',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(currHamper.features || []).map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleHamperFeatureChange(fIdx, e.target.value)}
                          placeholder="e.g. 40x Mysore Sandalwood Sticks"
                          style={{
                            flex: 1,
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #D6D3D1',
                            fontSize: '0.8rem',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteHamperFeature(fIdx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Button CTA Text
                    </label>
                    <input
                      type="text"
                      value={currHamper.ctaText || ''}
                      onChange={(e) => handleHamperChange('ctaText', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                      Button Target Link
                    </label>
                    <input
                      type="text"
                      value={currHamper.ctaLink || ''}
                      onChange={(e) => handleHamperChange('ctaLink', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Media Format Toggle: Image vs Video Poster */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                    Hamper Poster Format
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button
                      type="button"
                      onClick={() => handleHamperChange('mediaType', 'image')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: currHamper.mediaType !== 'video' ? '1.5px solid #C8822A' : '1px solid #D6D3D1',
                        backgroundColor: currHamper.mediaType !== 'video' ? '#FAF0E4' : '#FFF',
                        color: currHamper.mediaType !== 'video' ? '#C8822A' : '#57534E',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      🖼️ Static Box Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHamperChange('mediaType', 'video')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: currHamper.mediaType === 'video' ? '1.5px solid #C8822A' : '1px solid #D6D3D1',
                        backgroundColor: currHamper.mediaType === 'video' ? '#FAF0E4' : '#FFF',
                        color: currHamper.mediaType === 'video' ? '#C8822A' : '#57534E',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      🎬 Video Box Showcase
                    </button>
                  </div>
                </div>

                {/* Video Upload if Video Poster */}
                {currHamper.mediaType === 'video' && (
                  <VideoUploadField
                    label="Festive Box Showcase Video"
                    value={currHamper.videoUrl || ''}
                    onChange={(url) => handleHamperChange('videoUrl', url)}
                    maxSizeMB={35}
                    helperText="Allowed: MP4, WebM (Max 35MB). Loops automatically in the grand hamper showcase."
                  />
                )}

                {/* Direct Hamper Image Upload Field */}
                <ImageUploadField
                  label={currHamper.mediaType === 'video' ? `Hamper #${activeHamperIndex + 1} Poster / Fallback Image` : `Hamper #${activeHamperIndex + 1} Box Poster Image`}
                  recommendedWidth={1000}
                  recommendedHeight={1000}
                  aspectRatioText="1:1 Perfect Square"
                  value={currHamper.imageUrl || currHamper.image || ''}
                  onChange={(url) => handleHamperChange('imageUrl', url)}
                  helperText="Upload 1000 × 1000 px photo of festive hamper box with ~10% edge padding."
                  required
                />
              </div>

              {/* Right Column: Live Poster Preview */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>
                    Hamper #{activeHamperIndex + 1} Live Preview
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 600 }}>1:1 Square</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    maxHeight: '340px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1.5px solid #EAE3D6',
                    backgroundColor: '#141210',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {(currHamper.imageUrl || currHamper.image) ? (
                    <img
                      src={currHamper.imageUrl || currHamper.image}
                      alt="Hamper preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: '#78716C', fontSize: '0.8rem' }}>No Hamper Image Uploaded</span>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      insetInline: 0,
                      padding: '16px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      color: '#FFF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#FEF08A', fontWeight: 700, letterSpacing: '0.05em' }}>
                        {currHamper.badge || 'FESTIVE HAMPER'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#FCD34D', fontWeight: 800 }}>
                        {currHamper.price || '₹999'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFF' }}>
                      {currHamper.heading || 'Hamper Title'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============================================================================== */}
      {/* 4. RESERVED SEASONAL STRIP BANNERS */}
      {/* ============================================================================== */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #EAE3D6',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          marginBottom: '40px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', margin: 0 }}>
                Reserved Seasonal & Festival Banner Strips
              </h2>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#FAF0E4', color: '#9B3828', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                {seasonalBanners.length} Available
              </span>
            </div>
            <p style={{ color: '#6B635B', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Reserved panoramic banner slot on the homepage for Navratri, Diwali, Maha Shivratri, and seasonal festivals.
            </p>
          </div>

          <button
            onClick={handleAddSeasonalBanner}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Seasonal Strip
          </button>
        </div>

        {seasonalBanners.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#FAFAF9', borderRadius: '12px', border: '1px dashed #D6D3D1' }}>
            <p style={{ margin: '0 0 12px', color: '#78716C', fontSize: '0.9rem' }}>
              No seasonal banner strips created yet. Add one to activate this reserved space on the live homepage!
            </p>
            <button onClick={handleAddSeasonalBanner} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              + Create First Seasonal Banner
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {seasonalBanners.map((sb, idx) => (
              <div
                key={sb.id || idx}
                style={{
                  backgroundColor: '#FAFAF9',
                  border: '1.5px solid #EAE3D6',
                  borderRadius: '14px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#9B3828',
                        backgroundColor: '#FAF0E4',
                        padding: '4px 12px',
                        borderRadius: '14px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Seasonal Strip #{idx + 1}
                    </span>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#44403C', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={sb.isActive !== false}
                        onChange={(e) => handleSeasonalChange(idx, 'isActive', e.target.checked)}
                      />
                      <span>Active on Live Storefront</span>
                    </label>
                  </div>

                  <button
                    onClick={() => handleDeleteSeasonal(idx)}
                    style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                  >
                    <Trash2 size={15} /> Delete Banner
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>
                  {/* Form fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                        Badge Text (e.g. AUSPICIOUS OFFER)
                      </label>
                      <input
                        type="text"
                        value={sb.badge || ''}
                        onChange={(e) => handleSeasonalChange(idx, 'badge', e.target.value)}
                        placeholder="e.g. AUSPICIOUS MAHOTSAV OFFER"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                        Main Heading *
                      </label>
                      <input
                        type="text"
                        value={sb.heading || ''}
                        onChange={(e) => handleSeasonalChange(idx, 'heading', e.target.value)}
                        placeholder="e.g. Devi Pujan Samagri & Akhand Jyot Collection"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                        Subheading / Description Body
                      </label>
                      <textarea
                        rows={2}
                        value={sb.subheading || ''}
                        onChange={(e) => handleSeasonalChange(idx, 'subheading', e.target.value)}
                        placeholder="e.g. Pure Cow Ghee Diyas, Kashmiri Kesar Chandan & 100% Bamboo-Free Fragrances..."
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                          Special Festival Offer / Price Tag
                        </label>
                        <input
                          type="text"
                          value={sb.offerPrice || ''}
                          onChange={(e) => handleSeasonalChange(idx, 'offerPrice', e.target.value)}
                          placeholder="e.g. Flat 25% Off + Free Gangajal"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                          Festival Muhurat / Valid Tithi
                        </label>
                        <input
                          type="text"
                          value={sb.validUntil || ''}
                          onChange={(e) => handleSeasonalChange(idx, 'validUntil', e.target.value)}
                          placeholder="e.g. Valid until Navratri Ashtami"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={sb.ctaText || ''}
                          onChange={(e) => handleSeasonalChange(idx, 'ctaText', e.target.value)}
                          placeholder="e.g. Explore Festival Offer"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                          Button Target Link
                        </label>
                        <input
                          type="text"
                          value={sb.ctaLink || ''}
                          onChange={(e) => handleSeasonalChange(idx, 'ctaLink', e.target.value)}
                          placeholder="e.g. /collections/curated-puja-combos"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    {/* Media Format Toggle: Image vs Video Strip */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                        Strip Presentation Format
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <button
                          type="button"
                          onClick={() => handleSeasonalChange(idx, 'mediaType', 'image')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: sb.mediaType !== 'video' ? '1.5px solid #C8822A' : '1px solid #D6D3D1',
                            backgroundColor: sb.mediaType !== 'video' ? '#FAF0E4' : '#FFF',
                            color: sb.mediaType !== 'video' ? '#C8822A' : '#57534E',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          🖼️ Static Strip Image
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSeasonalChange(idx, 'mediaType', 'video')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: sb.mediaType === 'video' ? '1.5px solid #C8822A' : '1px solid #D6D3D1',
                            backgroundColor: sb.mediaType === 'video' ? '#FAF0E4' : '#FFF',
                            color: sb.mediaType === 'video' ? '#C8822A' : '#57534E',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          🎬 Video Strip Banner
                        </button>
                      </div>
                    </div>

                    {/* Video Upload if Video Banner Strip */}
                    {sb.mediaType === 'video' && (
                      <VideoUploadField
                        label="Seasonal Panoramic Video Strip"
                        value={sb.videoUrl || ''}
                        onChange={(url) => handleSeasonalChange(idx, 'videoUrl', url)}
                        maxSizeMB={35}
                        helperText="Allowed: MP4, WebM (Max 35MB). Loops smoothly across mid-homepage strip."
                      />
                    )}

                    {/* Direct Seasonal Image Upload Field */}
                    <ImageUploadField
                      label={sb.mediaType === 'video' ? "Poster / Fallback Panoramic Photo" : "Seasonal Panoramic Strip Photo"}
                      recommendedWidth={1920}
                      recommendedHeight={450}
                      aspectRatioText="4.2:1 Panoramic Strip"
                      value={sb.imageUrl || ''}
                      onChange={(url) => handleSeasonalChange(idx, 'imageUrl', url)}
                      helperText="Upload 1920 × 450 px panoramic strip directly from device."
                      required
                    />
                  </div>

                  {/* Live Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>
                        Live Strip Preview
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#78716C' }}>1920 × 450 px</span>
                    </div>

                    <div
                      style={{
                        height: '180px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#1C1917',
                        border: '1px solid #EAE3D6',
                      }}
                    >
                      {sb.imageUrl && (
                        <img
                          src={sb.imageUrl}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, rgba(20,18,16,0.92) 0%, rgba(20,18,16,0.7) 60%, rgba(20,18,16,0.2) 100%)',
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          color: '#FFF',
                        }}
                      >
                        {sb.badge && (
                          <div style={{ fontSize: '0.62rem', color: '#FCD34D', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                            {sb.badge}
                          </div>
                        )}
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', margin: '0 0 4px', color: '#FFF' }}>
                          {sb.heading || 'Seasonal Heading'}
                        </h4>
                        <p style={{ fontSize: '0.7rem', color: '#E7DEC8', margin: '0 0 8px', lineHeight: 1.3 }}>
                          {sb.subheading?.slice(0, 85)}...
                        </p>
                        <div>
                          <span style={{ fontSize: '0.72rem', backgroundColor: '#C8822A', color: '#FFF', padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>
                            {sb.ctaText || 'Explore Offer'} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================================== */}
      {/* 5. SIGNATURE 3D SACRED BRASS AKHAND DIYA SHOWCASE MANAGER */}
      {/* ============================================================================== */}
      <div
        id="3d-diya"
        style={{
          backgroundColor: '#FFF',
          border: '1.5px solid #C8822A',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(200, 130, 42, 0.08)',
          marginBottom: '40px',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF0E4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C8822A',
                }}
              >
                <Flame size={20} />
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.45rem', color: '#1C1917', margin: 0 }}>
                Signature 3D Sacred Brass Akhand Diya Showcase
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B635B' }}>
              Configure live storefront visibility, pricing, Vedic description, 4 sacred highlights, and interactive temple bell echo sound.
            </p>
          </div>

          {/* Visibility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: diyaShowcase.isActive ? '#EAF4EE' : '#F5F5F4',
                color: diyaShowcase.isActive ? '#1E5E3A' : '#78716C',
                border: diyaShowcase.isActive ? '1px solid #BBF7D0' : '1px solid #E7E5E4',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: diyaShowcase.isActive ? '#16A34A' : '#A8A29E',
                }}
              />
              {diyaShowcase.isActive ? 'Active on Storefront' : 'Hidden on Storefront'}
            </span>

            <button
              type="button"
              onClick={() => handleDiyaChange('isActive', !diyaShowcase.isActive)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: diyaShowcase.isActive ? '#FEF2F2' : '#F0FDF4',
                color: diyaShowcase.isActive ? '#991B1B' : '#166534',
                border: diyaShowcase.isActive ? '1px solid #FECACA' : '1px solid #BBF7D0',
                transition: 'all 0.2s',
              }}
            >
              {diyaShowcase.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{diyaShowcase.isActive ? 'Hide from Storefront' : 'Publish to Storefront'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Editor, Right Live Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: '32px' }}>
          {/* Left Column: Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Tagline / Subtitle */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                Vedic Category Tag / Subtitle
              </label>
              <input
                type="text"
                value={diyaShowcase.badge || ''}
                onChange={(e) => handleDiyaChange('badge', e.target.value)}
                placeholder="e.g. 100% Panchaloha Brass • Temple Grade"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                Showcase Heading / Product Title
              </label>
              <input
                type="text"
                value={diyaShowcase.title || ''}
                onChange={(e) => handleDiyaChange('title', e.target.value)}
                placeholder="e.g. Solid Handcrafted Brass Akhand Diya"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>

            {/* Pricing Row: Offer Price, Regular Price, Discount Tag, Tax Note */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Offer Price (₹)
                </label>
                <input
                  type="number"
                  value={diyaShowcase.price ?? 499}
                  onChange={(e) => handleDiyaChange('price', Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.9rem', fontWeight: 700, color: '#1C1917' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Strike Price (₹)
                </label>
                <input
                  type="number"
                  value={diyaShowcase.originalPrice ?? 799}
                  onChange={(e) => handleDiyaChange('originalPrice', Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.9rem', color: '#78716C' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Discount Tag
                </label>
                <input
                  type="text"
                  value={diyaShowcase.discountText || ''}
                  onChange={(e) => handleDiyaChange('discountText', e.target.value)}
                  placeholder="e.g. 37% OFF"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Tax Note
                </label>
                <input
                  type="text"
                  value={diyaShowcase.taxNote || ''}
                  onChange={(e) => handleDiyaChange('taxNote', e.target.value)}
                  placeholder="e.g. Inclusive of all taxes"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                Sacred Craftsmanship Description
              </label>
              <textarea
                rows={3}
                value={diyaShowcase.description || ''}
                onChange={(e) => handleDiyaChange('description', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', lineHeight: 1.5 }}
              />
            </div>

            {/* Sacred Highlights (4 bullet points) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#44403C' }}>
                  Sacred Specifications & Highlights (Checkmarks)
                </label>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#C8822A',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={13} /> Add Feature
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(diyaShowcase.highlights || []).map((highlight, hIdx) => (
                  <div key={hIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#C8822A', flexShrink: 0 }}>
                      <Check size={16} />
                    </span>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(hIdx, e.target.value)}
                      placeholder={`Feature ${hIdx + 1}`}
                      style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.82rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(hIdx)}
                      title="Remove feature"
                      style={{ color: '#EF4444', padding: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalog Linking & CTA Button */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Linked Product ID
                </label>
                <input
                  type="text"
                  value={diyaShowcase.productId || ''}
                  onChange={(e) => handleDiyaChange('productId', e.target.value)}
                  placeholder="prod-solid-brass-diya"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Linked Variant ID
                </label>
                <input
                  type="text"
                  value={diyaShowcase.variantId || ''}
                  onChange={(e) => handleDiyaChange('variantId', e.target.value)}
                  placeholder="var-bd-01"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={diyaShowcase.ctaText || ''}
                  onChange={(e) => handleDiyaChange('ctaText', e.target.value)}
                  placeholder="Bring Akhand Diya Home — ₹499"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Sacred Temple Bell Settings & Audio Test */}
            <div
              style={{
                backgroundColor: '#FAF7F2',
                borderRadius: '10px',
                padding: '14px 16px',
                border: '1px solid #EAE3D6',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#1C1917' }}>
                  <input
                    type="checkbox"
                    checked={diyaShowcase.showTempleBell !== false}
                    onChange={(e) => handleDiyaChange('showTempleBell', e.target.checked)}
                    style={{ accentColor: '#C8822A', width: '16px', height: '16px' }}
                  />
                  <span>Enable Sacred Temple Bell Chime (घण्टा नाद)</span>
                </label>

                <button
                  type="button"
                  onClick={testBellAudio}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#FAF0E4',
                    border: '1px solid #E8D5BF',
                    color: '#9A6216',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Volume2 size={14} />
                  <span>Test Chime</span>
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6B635B', marginBottom: '3px' }}>
                  Bell Icon Tooltip / Hover Label
                </label>
                <input
                  type="text"
                  value={diyaShowcase.bellTooltip || ''}
                  onChange={(e) => handleDiyaChange('bellTooltip', e.target.value)}
                  placeholder="Click to ring sacred temple bell (घण्टा नाद)"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* Dedicated Save Button */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleSaveDiyaOnly}
                disabled={isSavingDiya}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#C8822A',
                  color: '#FFF',
                  padding: '11px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: isSavingDiya ? 'not-allowed' : 'pointer',
                  opacity: isSavingDiya ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(200, 130, 42, 0.3)',
                }}
              >
                {isSavingDiya ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{isSavingDiya ? 'Saving 3D Showcase...' : 'Save 3D Diya Showcase'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Storefront Card Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live Storefront Section Preview
              </span>
              <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600, backgroundColor: '#EAF4EE', padding: '2px 8px', borderRadius: '4px' }}>
                Real-Time Preview
              </span>
            </div>

            {/* Card Preview Container */}
            <div
              style={{
                backgroundColor: '#FAF7F2',
                border: '1.5px solid #EAE3D6',
                borderRadius: '16px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'minmax(140px, 1fr) 1.5fr',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              {/* Left Diya Mockup Visual */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '260px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(200, 130, 42, 0.22) 0%, rgba(254, 240, 138, 0.12) 40%, transparent 70%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.2rem', lineHeight: 1 }}>🪔</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9A6216', marginTop: '6px' }}>
                      3D Continuous 360°
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Preview */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {diyaShowcase.badge && (
                  <span style={{ color: '#C8822A', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {diyaShowcase.badge}
                  </span>
                )}

                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#1C1917', margin: '0 0 6px', fontWeight: 700, lineHeight: 1.25 }}>
                  {diyaShowcase.title || 'Brass Akhand Diya'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1917' }}>
                    ₹{diyaShowcase.price ?? 499}
                  </span>
                  {(diyaShowcase.originalPrice > diyaShowcase.price) && (
                    <span style={{ fontSize: '0.9rem', color: '#948A7F', textDecoration: 'line-through' }}>
                      ₹{diyaShowcase.originalPrice}
                    </span>
                  )}
                  {diyaShowcase.discountText && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1E5E3A', backgroundColor: '#EAF4EE', padding: '2px 6px', borderRadius: '4px' }}>
                      {diyaShowcase.discountText}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.78rem', color: '#57534E', lineHeight: 1.5, margin: '0 0 12px' }}>
                  {diyaShowcase.description?.slice(0, 140)}...
                </p>

                {/* Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '14px' }}>
                  {(diyaShowcase.highlights || []).slice(0, 4).map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#292524' }}>
                      <Check size={12} color="#C8822A" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Bell Icon in Preview */}
                {diyaShowcase.showTempleBell !== false && (
                  <div style={{ marginBottom: '12px' }}>
                    <button
                      type="button"
                      onClick={testBellAudio}
                      title={diyaShowcase.bellTooltip}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#FAF0E4',
                        border: '1.5px solid #E8D5BF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transform: isBellRingingPreview ? 'rotate(16deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <Bell size={18} color="#9A6216" />
                    </button>
                  </div>
                )}

                {/* Button in Preview */}
                <button
                  type="button"
                  style={{
                    backgroundColor: '#C8822A',
                    color: '#FFF',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(200, 130, 42, 0.3)',
                  }}
                >
                  <ShoppingBag size={14} />
                  <span>{diyaShowcase.ctaText || 'Bring Akhand Diya Home'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
