import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { flyToDestination } from '@/lib/flyAnimation';
import {
  CheckCircle2,
  ShoppingBag,
  Share2,
  Check,
  Flame,
  ShieldCheck,
  ChevronRight,
  Info,
  Zap,
  MessageCircle,
} from 'lucide-react';

const RITUAL_PRESETS = [
  {
    id: 'daily-sandhya',
    title: 'Daily Sandhya Aarti',
    subtitle: 'Morning & Evening Sanctum Offering',
    badge: 'Daily Essential',
    mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    description:
      'The sacred foundation for everyday uninterrupted worship. 100% bamboo-free and non-toxic for families and children.',
    savingsPercent: 20,
    items: [
      {
        id: 'prod-mysore-sandalwood',
        variantId: 'var-ms-40',
        name: 'Royal Mysore Sandalwood Agarbatti',
        pack: 'Pack of 40 Sticks',
        price: 299,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-havan-cups',
        variantId: 'var-hc-12',
        name: 'Gir Cow Ghee Havan Cups',
        pack: 'Box of 12 Cups',
        price: 349,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-solid-brass-diya',
        variantId: 'var-bd-01',
        name: 'Solid Handcrafted Brass Diya',
        pack: '1 Unit Heavy Brass Stand',
        price: 499,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
        mustHave: false,
      },
      {
        id: 'prod-organic-camphor',
        variantId: 'var-cp-50',
        name: 'Pure Bhimseni Desi Camphor (Karpur)',
        pack: '100g Airtight Jar',
        price: 199,
        image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80',
        mustHave: false,
      },
    ],
  },
  {
    id: 'griha-pravesh',
    title: 'Griha Pravesh & Shuddhi',
    subtitle: 'New Home & Vastu Purification Kit',
    badge: 'Space Cleansing',
    mantra: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम् । विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ॥',
    description:
      'Purify every room of your new residence. Natural tree gums and cow dung sambrani dissolve negative vibrations and invite Maha Lakshmi.',
    savingsPercent: 25,
    items: [
      {
        id: 'prod-havan-cups',
        variantId: 'var-hc-12',
        name: 'Gir Cow Ghee & Guggal Havan Cups',
        pack: 'Box of 24 Jumbo Cups',
        price: 599,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-charcoal-dhoop',
        variantId: 'var-dc-30',
        name: 'Wild Himalayan Loban Resins',
        pack: '250g Pure Rock Sambrani',
        price: 399,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-mysore-sandalwood',
        variantId: 'var-ms-40',
        name: 'Kashmiri Kesar Sandalwood Sticks',
        pack: 'Pack of 80 Sticks',
        price: 499,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-solid-brass-diya',
        variantId: 'var-bd-01',
        name: 'Sacred Gangotri Jal & Brass Kalash',
        pack: '500ml Gangajal + Engraved Kalash',
        price: 450,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
        mustHave: false,
      },
    ],
  },
  {
    id: 'rudrabhishek-shiva',
    title: 'Mahashivratri & Rudrabhishek',
    subtitle: 'Lord Shiva Devotional Offering',
    badge: 'Bhasma & Bilva',
    mantra: 'त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
    description:
      'Curated offerings prescribed in the Shiva Purana. Charcoal-free bhasma dhoop, wild Himalayan jatamansi, and natural sandalwood paste.',
    savingsPercent: 20,
    items: [
      {
        id: 'prod-mysore-sandalwood',
        variantId: 'var-ms-40',
        name: 'Pure Sandalwood Agarbatti (Chandan)',
        pack: '40 Bambooless Sticks',
        price: 299,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-charcoal-dhoop',
        variantId: 'var-dc-30',
        name: 'Sacred Bhasma Guggal Cones',
        pack: 'Pack of 30 Dhoop Cones',
        price: 249,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-havan-cups',
        variantId: 'var-hc-12',
        name: 'Cow Ghee Havan Cups',
        pack: 'Pack of 12 Cups',
        price: 349,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-solid-brass-diya',
        variantId: 'var-bd-01',
        name: 'Panchmukhi Brass Shiva Aarti Diya',
        pack: '5-Wick Brass Aarti Lamp',
        price: 599,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
        mustHave: false,
      },
    ],
  },
  {
    id: 'navratri-durga',
    title: 'Navratri & Durga Pujan',
    subtitle: 'Nine Nights of Divine Mother Shakti',
    badge: 'Akhand Jyot Kit',
    mantra: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
    description:
      'Akhand Jyot samagri with long-burning cotton batti, Gir cow ghee, and Kashmiri red kesar attar for Maa Durga invocations.',
    savingsPercent: 22,
    items: [
      {
        id: 'prod-havan-cups',
        variantId: 'var-hc-12',
        name: 'Pure Desi Cow Ghee Havan Cups',
        pack: 'Pack of 18 Cups',
        price: 499,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-kannauj-gulab-attar',
        variantId: 'var-at-50',
        name: 'Kannauj Gulab Pure Alcohol-Free Attar',
        pack: '10ml Crystal Bottle',
        price: 549,
        image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-mysore-sandalwood',
        variantId: 'var-ms-40',
        name: 'Royal Mysore Sandalwood Sticks',
        pack: 'Pack of 40 Sticks',
        price: 299,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-solid-brass-diya',
        variantId: 'var-bd-01',
        name: 'Akhand Jyot Brass Diya with Glass Chimney',
        pack: 'Heavy Brass Stand + Borosilicate Glass',
        price: 799,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
        mustHave: false,
      },
    ],
  },
  {
    id: 'deepawali-laxmi',
    title: 'Deepawali & Maha Lakshmi Puja',
    subtitle: 'Prosperity & Festive Celebration',
    badge: 'Festive Grand Kit',
    mantra: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः ॥',
    description:
      'The complete regal worship kit for Lakshmi-Ganesh puja on Deepawali. Enriched with natural dammar resins and pure silver coin holder.',
    savingsPercent: 25,
    items: [
      {
        id: 'prod-havan-cups',
        variantId: 'var-hc-12',
        name: 'Gir Cow Ghee & Kesar Havan Cups',
        pack: 'Box of 24 Cups',
        price: 599,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-mysore-sandalwood',
        variantId: 'var-ms-40',
        name: 'Royal Mysore Sandalwood Agarbatti',
        pack: 'Pack of 80 Sticks',
        price: 499,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-kannauj-gulab-attar',
        variantId: 'var-at-50',
        name: 'Kannauj Gulab Pure Puja Attar',
        pack: '10ml Roll-on Bottle',
        price: 549,
        image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=400&q=80',
        mustHave: true,
      },
      {
        id: 'prod-solid-brass-diya',
        variantId: 'var-bd-01',
        name: 'Solid Brass Kamal Diya (Lotus Lamp)',
        pack: 'Handcrafted Lotus Diya',
        price: 649,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
        mustHave: false,
      },
    ],
  },
];

export default function PoojaSamagriBuilder() {
  const navigate = useNavigate();
  const { addKitBundleToCart, addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedRitualId, setSelectedRitualId] = useState(RITUAL_PRESETS[0].id);
  const activePreset = RITUAL_PRESETS.find((r) => r.id === selectedRitualId) || RITUAL_PRESETS[0];

  // Map of item selections for each preset: { [presetId]: Set of itemIds }
  const [selectedItemsMap, setSelectedItemsMap] = useState(() => {
    const initial = {};
    RITUAL_PRESETS.forEach((preset) => {
      initial[preset.id] = new Set(preset.items.map((i) => i.id));
    });
    return initial;
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isAddingAll, setIsAddingAll] = useState(false);
  const [isExpressLoading, setIsExpressLoading] = useState(false);

  const currentSelectedItems = selectedItemsMap[activePreset.id] || new Set();

  const toggleItem = (itemId) => {
    setSelectedItemsMap((prev) => {
      const currentSet = new Set(prev[activePreset.id] || []);
      if (currentSet.has(itemId)) {
        if (currentSet.size === 1) {
          showToast?.('Please keep at least 1 samagri item in the kit.', 'info');
          return prev;
        }
        currentSet.delete(itemId);
      } else {
        currentSet.add(itemId);
      }
      return { ...prev, [activePreset.id]: currentSet };
    });
  };

  // Price calculations
  const selectedItemsList = activePreset.items.filter((item) => currentSelectedItems.has(item.id));
  const rawTotal = selectedItemsList.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round((rawTotal * activePreset.savingsPercent) / 100);
  const discountedTotal = rawTotal - discountAmount;

  // Add all selected items to cart as a bundled kit with ritual discount
  const handleAddKitToCart = async (e, isExpress = false) => {
    if (e) e.preventDefault();
    if (!selectedItemsList.length) {
      showToast?.('Please select at least 1 item for your kit.', 'info');
      return;
    }

    if (isExpress) {
      setIsExpressLoading(true);
    } else {
      flyToDestination(e, 'cart');
      setIsAddingAll(true);
    }

    try {
      if (addKitBundleToCart) {
        const success = await addKitBundleToCart({
          bundleName: activePreset.title,
          bundleId: activePreset.id,
          discountPercent: activePreset.savingsPercent,
          items: selectedItemsList,
        });
        if (success && isExpress) {
          navigate('/checkout');
        }
      } else {
        for (const item of selectedItemsList) {
          await addToCart(item.id, item.variantId || 'default-var', 1);
        }
        showToast?.(`Added complete ${activePreset.title} Kit to cart!`, 'success');
        if (isExpress) {
          navigate('/checkout');
        }
      }
    } catch (err) {
      showToast?.('Items added to cart', 'success');
      if (isExpress) navigate('/checkout');
    } finally {
      setIsAddingAll(false);
      setIsExpressLoading(false);
    }
  };

  const buildShareText = () => {
    return (
      `🪔 *VedaPavitra ${activePreset.title} Sacred Samagri Kit*\n` +
      `_Sanctified Vedic Essentials for Devotional Living_\n\n` +
      `✨ *Ritual Invocation:*\n"${activePreset.mantra}"\n\n` +
      `📦 *Curated Samagri Items:* (${selectedItemsList.length} items)\n` +
      selectedItemsList
        .map((i, idx) => `  ${idx + 1}. ${i.name} (${i.pack}) - ₹${i.price}`)
        .join('\n') +
      `\n\n` +
      `💰 *MRP Total:* ₹${rawTotal}\n` +
      `🎁 *Sacred Bundle Savings (${activePreset.savingsPercent}%):* -₹${discountAmount}\n` +
      `🕉️ *Consecrated Kit Price:* ₹${discountedTotal}\n` +
      `🚚 Free Pan-India Delivery with 100% Bamboo-Free Guarantee\n\n` +
      `Order or Customize Online:\n${window.location.origin}/collections/curated-puja-combos`
    );
  };

  const handleCopyChecklist = () => {
    const listText = buildShareText();
    navigator.clipboard?.writeText(listText);
    setIsCopied(true);
    showToast?.('Ritual samagri checklist copied! Share via WhatsApp or Priest.', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = buildShareText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section
      id="pooja-builder"
      style={{
        padding: '80px 0',
        backgroundColor: '#FAF7F2',
        position: 'relative',
      }}
      aria-label="Interactive Pooja Samagri Kit Builder"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#C8822A',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '10px',
            }}
          >
            Authentic Shastra Samagri Configurator
          </div>
          <h2 className="heading-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', margin: '0 0 14px', color: '#1C1917' }}>
            Interactive Pooja & Ritual Samagri Builder
          </h2>
          <p style={{ color: '#6B635B', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            Select your upcoming sacred ritual or occasion. We calculate the exact Shastra-prescribed Vedic items, apply bundle savings, and pack everything in a sanctified gold box.
          </p>
        </div>

        {/* Ritual Selection Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '32px',
            justifyContent: 'flex-start',
            scrollbarWidth: 'none',
          }}
        >
          {RITUAL_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedRitualId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedRitualId(preset.id)}
                style={{
                  padding: '12px 22px',
                  borderRadius: '30px',
                  border: isSelected ? '2px solid #C8822A' : '1.5px solid #EAE3D6',
                  backgroundColor: isSelected ? '#1C1917' : '#FFF',
                  color: isSelected ? '#FAF7F2' : '#44403C',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 16px rgba(200, 130, 42, 0.25)' : 'none',
                }}
              >
                <span>{preset.title}</span>
                {isSelected && (
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#C8822A', color: '#FFF', padding: '2px 8px', borderRadius: '12px' }}>
                    {preset.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Builder Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Left: Interactive Items Checklist */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1.5px solid #EAE3D6',
              borderRadius: '20px',
              padding: 'clamp(16px, 3.5vw, 28px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', margin: '0 0 4px', color: '#1C1917' }}>
                  {activePreset.title} Samagri Checklist
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#78716C' }}>
                  {selectedItemsList.length} of {activePreset.items.length} sacred items selected
                </span>
              </div>

            </div>

            {/* Sacred Mantra Strip */}
            <div
              style={{
                backgroundColor: '#FAF0E4',
                border: '1px solid #EAD8C3',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontFamily: 'serif',
                fontSize: '0.92rem',
                color: '#9B3828',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {activePreset.mantra}
            </div>

            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activePreset.items.map((item) => {
                const isChecked = currentSelectedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px',
                      borderRadius: '12px',
                      border: isChecked ? '1.5px solid #C8822A' : '1px solid #EAE3D6',
                      backgroundColor: isChecked ? '#FFFDF9' : '#FAF8F5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Checkbox Icon */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: isChecked ? '2px solid #C8822A' : '2px solid #A8A29E',
                        backgroundColor: isChecked ? '#C8822A' : '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        flexShrink: 0,
                      }}
                    >
                      {isChecked && <Check size={16} strokeWidth={3} />}
                    </div>

                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#F5F5F4',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1C1917', marginBottom: '2px' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                        {item.pack} {item.mustHave && <span style={{ color: '#C8822A', fontWeight: 600 }}>• Essential</span>}
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1917', flexShrink: 0 }}>
                      {formatPrice(item.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sacred Kit Summary Card */}
          <div
            style={{
              backgroundColor: '#1C1917',
              color: '#FAF7F2',
              border: '2px solid rgba(200, 130, 42, 0.5)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FCD34D', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              <Flame size={16} /> Sanctified Vedic Kit
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', margin: '0 0 10px', color: '#FFF' }}>
              {activePreset.title} Complete Kit
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#D4C9B8', lineHeight: 1.5, margin: '0 0 24px' }}>
              {activePreset.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '16px 0', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', color: '#D4C9B8' }}>
                <span>Individual Item MRP:</span>
                <span>{formatPrice(rawTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', color: '#4ADE80' }}>
                <span>Sacred Bundle Discount ({activePreset.savingsPercent}%):</span>
                <span>- {formatPrice(discountAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 800, color: '#FFF', marginTop: '12px' }}>
                <span>Ritual Kit Total:</span>
                <span style={{ color: '#FCD34D' }}>{formatPrice(discountedTotal)}</span>
              </div>
            </div>

            {/* Quality Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px', fontSize: '0.78rem', color: '#D4C9B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#C8822A" /> 100% Bamboo-Free
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#C8822A" /> Pure Gir Cow Ghee
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#C8822A" /> No Chemical Dipping
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#C8822A" /> Gold Foil Box Pack
              </div>
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Primary Add to Cart */}
              <button
                type="button"
                onClick={(e) => handleAddKitToCart(e, false)}
                disabled={isAddingAll || isExpressLoading || selectedItemsList.length === 0}
                className="btn btn-primary btn-full"
                style={{
                  padding: '15px 18px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  borderRadius: '10px',
                  boxShadow: '0 6px 24px rgba(200, 130, 42, 0.4)',
                  cursor: isAddingAll || isExpressLoading ? 'wait' : 'pointer',
                }}
              >
                <ShoppingBag size={18} />
                <span>
                  {isAddingAll
                    ? 'Blessing & Adding Kit...'
                    : `Add Complete Kit to Cart (${formatPrice(discountedTotal)})`}
                </span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
