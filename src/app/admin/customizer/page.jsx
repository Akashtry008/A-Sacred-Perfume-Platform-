import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Image as ImageIcon,
  Layers,
  Palette,
  ShieldCheck,
  Save,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import ImageUploadField from '@/components/admin/ImageUploadField';
import Link from '@/components/common/Link';

export default function AdminCustomizerPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('branding'); // branding | sections | theme | commerce
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    brandName: 'VedaPavitra',
    brandTagline: 'Pure Vedic Samagri & Devotional Essentials',
    brandLogo: '',
    logoWidth: 180,
    logoHeight: 44,
    brandEmblem: '',
    announcementText: '✦ Free Sacred Ganga Jal with orders above ₹999 | Pure Temple Organic ✦',
    announcementEnabled: true,
    announcementBgColor: '#1C1917',
    announcementTextColor: '#FAF7F2',
    primaryColor: '#C8822A',
    accentColor: '#9B3828',
    freeShippingThreshold: 499,
    flatShippingFee: 50,
    codEnabled: true,
    contactPhone: '+91 (0120) 489-7200',
    contactEmail: 'care@vedapavitra.com',
    whatsappNumber: '919876543210',
    registeredAddress: 'VedaPavitra Vedic Wellness, Plot 42, Udyog Vihar, Sahibabad, Ghaziabad, UP - 201010',
    gstin: '07AABCU9603R1ZM',
    instagram: 'https://instagram.com/vedapavitra',
    youtube: 'https://youtube.com/@vedapavitra',
    // Platform Headlines, Texts and Descriptions
    heroMainHeading: 'Mini Vedic Yajna For Daily Grah Shuddhi',
    heroSubheading: 'Handcrafted Desi Cow Dung & Ghee Havan Cups. Bring Temple Sanctity Home In 15 Minutes.',
    heroBadge: '100% Natural & Charcoal-Free',
    heroPrimaryCtaText: 'Shop Havan Cups',
    heroSecondaryCtaText: 'Complete Combos',
    ritualsTitle: 'Explore By Sacred Ritual',
    ritualsSubtitle: 'Pure formulations created for every devotional moment of your day',
    bestsellersTitle: 'Pure Handcrafted Bestsellers',
    bestsellersSubtitle: 'Loved by over 10,000+ devotees across India for daily puja and meditation',
    samagriBuilderTitle: 'Interactive Pooja & Ritual Samagri Builder',
    samagriBuilderSubtitle: 'Select your upcoming sacred ritual or occasion. We calculate the exact Shastra-prescribed Vedic items, apply bundle savings, and pack everything in a sanctified gold box.',
    philosophyTitle: 'Restoring Sanctity To The Sacred Daily Puja',
    philosophyContent: 'Our sacred commitment to preserving ancient Gandhashastra, supporting indigenous cow sanctuaries, and purifying homes.',
    testimonialsTitle: 'Over 10,000+ Sacred Households Sanctified',
    testimonialsSubtitle: 'Hear from temple priests, families, and yoga practitioners who elevated their daily puja.',
    faqsTitle: 'Frequently Asked Questions',
    faqsSubtitle: 'Everything you need to know about our ingredients, delivery, and puja vidhi',
    footerAboutText: 'Preserving ancient Gandhashastra wisdom with 100% pure botanical and charcoal-free devotional essentials.',
    copyrightNotice: '© 2026 VedaPavitra. All Rights Reserved. Preserving Vedic Sanctity.',
  });

  // Sections State
  const [sections, setSections] = useState([]);
  const [isResettingSections, setIsResettingSections] = useState(false);
  const [deleteTargetSection, setDeleteTargetSection] = useState(null);

  // Admin Authentication Headers
  const getAdminHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vedapavitra_token') : null;
    return {
      'Content-Type': 'application/json',
      'X-Dev-Admin': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Load Settings and Sections
  const loadData = async () => {
    setIsLoading(true);
    try {
      const headers = getAdminHeaders();
      const [settingsRes, sectionsRes] = await Promise.all([
        fetch('/api/admin/settings', { headers }),
        fetch('/api/admin/sections', { headers }),
      ]);

      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData) {
          setSettings((prev) => ({
            ...prev,
            ...sData,
            logoWidth: Number(sData.logoWidth) || 180,
            logoHeight: Number(sData.logoHeight) || 44,
          }));
        }
      }

      if (sectionsRes.ok) {
        const secData = await sectionsRes.json();
        if (secData.sections) {
          setSections(secData.sections);
        }
      }
    } catch (err) {
      console.error('Error loading customization data:', err);
      showToast?.('Failed to load settings from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Settings
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const data = await res.json();
        showToast?.('Platform customizations saved successfully!', 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast?.(errData.detail || 'Failed to save settings', 'error');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast?.('Network error while saving settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Section Visibility
  const handleToggleSection = async (section) => {
    const updatedStatus = !section.isEnabled;
    const updatedSections = sections.map((s) =>
      s.id === section.id ? { ...s, isEnabled: updatedStatus } : s
    );
    setSections(updatedSections);

    try {
      const res = await fetch(`/api/admin/sections/${section.id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ isEnabled: updatedStatus }),
      });
      if (res.ok) {
        showToast?.(
          `Section '${section.title}' ${updatedStatus ? 'enabled' : 'hidden'} on storefront`,
          'success'
        );
      }
    } catch (err) {
      console.error('Error toggling section:', err);
      showToast?.('Failed to update section visibility', 'error');
    }
  };

  // Delete Section Permanently
  const handleConfirmDeleteSection = async () => {
    if (!deleteTargetSection) return;
    try {
      const res = await fetch(`/api/admin/sections/${deleteTargetSection.id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        setSections((prev) => prev.filter((s) => s.id !== deleteTargetSection.id));
        showToast?.(`Section '${deleteTargetSection.title}' deleted from platform`, 'success');
      } else {
        showToast?.('Failed to delete section', 'error');
      }
    } catch (err) {
      console.error('Error deleting section:', err);
      showToast?.('Network error deleting section', 'error');
    } finally {
      setDeleteTargetSection(null);
    }
  };

  // Move Section Up/Down
  const handleMoveSection = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    // Reassign sortOrder
    const updatedWithOrder = newSections.map((s, idx) => ({
      ...s,
      sortOrder: idx + 1,
    }));
    setSections(updatedWithOrder);

    // Persist each changed order
    try {
      await Promise.all(
        updatedWithOrder.map((s) =>
          fetch(`/api/admin/sections/${s.id}`, {
            method: 'PUT',
            headers: getAdminHeaders(),
            body: JSON.stringify({ sortOrder: s.sortOrder }),
          })
        )
      );
      showToast?.('Section order updated', 'success');
    } catch (err) {
      console.error('Error updating section order:', err);
    }
  };

  // Reset All Sections to Factory Defaults
  const handleResetSections = async () => {
    if (!window.confirm('Reset all storefront sections back to default layout? This restores all factory sections.')) {
      return;
    }
    setIsResettingSections(true);
    try {
      const res = await fetch('/api/admin/sections/reset', {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
        showToast?.('All storefront sections restored to default!', 'success');
      }
    } catch (err) {
      console.error('Error resetting sections:', err);
      showToast?.('Failed to reset sections', 'error');
    } finally {
      setIsResettingSections(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <RefreshCw className="animate-spin" size={32} color="#C8822A" />
        <p style={{ color: '#78716C', fontFamily: 'Georgia, serif' }}>Loading Platform Customizer...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ backgroundColor: '#FAF0E4', padding: '8px', borderRadius: '10px', color: '#C8822A' }}>
              <Sliders size={22} />
            </div>
            <h1 className="heading-display" style={{ fontSize: '1.85rem', margin: 0, color: '#1C1917' }}>
              Platform Customizer & Theme Control
            </h1>
          </div>
          <p style={{ color: '#6B635B', fontSize: '0.92rem', margin: 0 }}>
            Fine-tune brand identity, resize logos, delete or toggle storefront sections, and manage platform theme.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={loadData}
            style={{
              padding: '10px 16px',
              backgroundColor: '#FFF',
              border: '1px solid #D6D3D1',
              borderRadius: '8px',
              color: '#44403C',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={15} />
            <span>Reload</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            style={{
              padding: '10px 20px',
              backgroundColor: '#C8822A',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(200, 130, 42, 0.3)',
            }}
          >
            {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save Platform Settings</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          borderBottom: '2px solid #EAE3D6',
          marginBottom: '28px',
          paddingBottom: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'branding' ? '3px solid #C8822A' : '3px solid transparent',
            color: activeTab === 'branding' ? '#C8822A' : '#78716C',
            fontWeight: activeTab === 'branding' ? 700 : 600,
            fontSize: '0.925rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <ImageIcon size={18} />
          <span>Brand Identity & Logo Customizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'sections' ? '3px solid #C8822A' : '3px solid transparent',
            color: activeTab === 'sections' ? '#C8822A' : '#78716C',
            fontWeight: activeTab === 'sections' ? 700 : 600,
            fontSize: '0.925rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <Layers size={18} />
          <span>Storefront Sections Manager ({sections.filter((s) => s.isEnabled && !s.isDeleted).length} Active)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'theme' ? '3px solid #C8822A' : '3px solid transparent',
            color: activeTab === 'theme' ? '#C8822A' : '#78716C',
            fontWeight: activeTab === 'theme' ? 700 : 600,
            fontSize: '0.925rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <Palette size={18} />
          <span>Theme & Announcement Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('commerce')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'commerce' ? '3px solid #C8822A' : '3px solid transparent',
            color: activeTab === 'commerce' ? '#C8822A' : '#78716C',
            fontWeight: activeTab === 'commerce' ? 700 : 600,
            fontSize: '0.925rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <ShieldCheck size={18} />
          <span>Commerce Rules & Business Contacts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('copy')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'copy' ? '3px solid #C8822A' : '3px solid transparent',
            color: activeTab === 'copy' ? '#C8822A' : '#78716C',
            fontWeight: activeTab === 'copy' ? 700 : 600,
            fontSize: '0.925rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <BookOpen size={18} />
          <span>Platform Copy & Text Content</span>
        </button>
      </div>

      {/* TAB 1: Brand Identity & Logo Customizer */}
      {activeTab === 'branding' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Logo Adjustments Form */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={20} color="#C8822A" />
              <span>Store Logo & Dimensions</span>
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6B635B', marginBottom: '20px' }}>
              Upload your brand logo and adjust its exact pixel width and height on the storefront header and footer.
            </p>

            {/* Logo Image Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '8px' }}>
                Logo Image (Upload File or Direct URL)
              </label>
              <ImageUploadField
                value={settings.brandLogo}
                onChange={(url) => setSettings({ ...settings, brandLogo: url })}
                label="Store Header & Brand Logo"
                aspectHint="Recommended: Transparent PNG or SVG (300 x 80 px)"
              />
            </div>

            {/* Logo Width Slider & Input */}
            <div style={{ marginBottom: '20px', backgroundColor: '#FDFCF9', padding: '16px', borderRadius: '10px', border: '1px solid #EAE3D6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#292524' }}>
                  Adjustable Logo Width: <span style={{ color: '#C8822A' }}>{settings.logoWidth}px</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    min="40"
                    max="360"
                    value={settings.logoWidth}
                    onChange={(e) => setSettings({ ...settings, logoWidth: Number(e.target.value) || 180 })}
                    style={{
                      width: '64px',
                      padding: '4px 8px',
                      border: '1px solid #D6D3D1',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#78716C' }}>px</span>
                </div>
              </div>
              <input
                type="range"
                min="40"
                max="360"
                step="4"
                value={settings.logoWidth}
                onChange={(e) => setSettings({ ...settings, logoWidth: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#C8822A', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#A8A29E', marginTop: '4px' }}>
                <span>40px (Icon)</span>
                <span>180px (Standard)</span>
                <span>360px (Hero Wide)</span>
              </div>
            </div>

            {/* Logo Height Slider & Input */}
            <div style={{ marginBottom: '24px', backgroundColor: '#FDFCF9', padding: '16px', borderRadius: '10px', border: '1px solid #EAE3D6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#292524' }}>
                  Adjustable Logo Max-Height: <span style={{ color: '#C8822A' }}>{settings.logoHeight}px</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    min="20"
                    max="140"
                    value={settings.logoHeight}
                    onChange={(e) => setSettings({ ...settings, logoHeight: Number(e.target.value) || 44 })}
                    style={{
                      width: '64px',
                      padding: '4px 8px',
                      border: '1px solid #D6D3D1',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#78716C' }}>px</span>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="140"
                step="2"
                value={settings.logoHeight}
                onChange={(e) => setSettings({ ...settings, logoHeight: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#C8822A', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#A8A29E', marginTop: '4px' }}>
                <span>20px (Compact)</span>
                <span>44px (Standard Header)</span>
                <span>140px (Grand Heritage)</span>
              </div>
            </div>

            {/* Store Name & Tagline */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Brand / Store Name
              </label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #D6D3D1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.brandTagline}
                onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #D6D3D1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* Live Preview Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Light Mode Header Preview */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Live Storefront Header Preview (Light Mode)
                </span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  Real-time
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #EAE3D6',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {settings.brandLogo ? (
                    <img
                      src={settings.brandLogo}
                      alt={settings.brandName}
                      style={{
                        width: `${settings.logoWidth}px`,
                        maxHeight: `${settings.logoHeight}px`,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#FAF0E4',
                          border: '1px solid #E8D5BF',
                          color: '#C8822A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        {settings.brandName?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.15rem', color: '#1C1917', lineHeight: 1.1 }}>
                          {settings.brandName}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#78716C', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {settings.brandTagline}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EAE3D6' }} />
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EAE3D6' }} />
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#C8822A' }} />
                </div>
              </div>
            </div>

            {/* Dark Mode Footer Preview */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                Live Storefront Footer Preview (Dark Mode)
              </span>

              <div
                style={{
                  backgroundColor: '#1C1917',
                  color: '#FAF7F2',
                  borderRadius: '10px',
                  padding: '24px',
                  border: '1px solid #292524',
                }}
              >
                {settings.brandLogo ? (
                  <img
                    src={settings.brandLogo}
                    alt={settings.brandName}
                    style={{
                      width: `${settings.logoWidth}px`,
                      maxHeight: `${settings.logoHeight}px`,
                      objectFit: 'contain',
                      display: 'block',
                      marginBottom: '12px',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                    }}
                  />
                ) : (
                  <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.25rem', color: '#FAF7F2', marginBottom: '4px' }}>
                    {settings.brandName}
                  </div>
                )}
                <p style={{ color: '#A8A29E', fontSize: '0.82rem', margin: '0 0 12px', maxWidth: '320px', lineHeight: 1.5 }}>
                  Preserving ancient Gandhashastra wisdom with 100% pure botanical and charcoal-free devotional essentials.
                </p>
                <div style={{ fontSize: '0.75rem', color: '#78716C' }}>
                  © {new Date().getFullYear()} {settings.brandName}. All Rights Reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Storefront Sections Manager */}
      {activeTab === 'sections' && (
        <div>
          {/* Action Ribbon */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#1C1917', fontSize: '0.95rem' }}>
                Storefront Layout Architecture & Section Removal
              </div>
              <div style={{ fontSize: '0.825rem', color: '#6B635B' }}>
                Toggle any section on/off, permanently delete sections you don't want, or reorder their sequence on the homepage.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleResetSections}
                disabled={isResettingSections}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #D6D3D1',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#44403C',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RotateCcw size={14} />
                <span>Restore All Factory Sections</span>
              </button>
            </div>
          </div>

          {/* Sections List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sections
              .filter((s) => !s.isDeleted)
              .map((section, idx, arr) => {
                return (
                  <div
                    key={section.id || section.key}
                    style={{
                      backgroundColor: section.isEnabled ? '#FFFFFF' : '#F9F8F6',
                      border: `1px solid ${section.isEnabled ? '#EAE3D6' : '#E7E5E4'}`,
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      transition: 'all 0.2s ease',
                      boxShadow: section.isEnabled ? '0 2px 6px rgba(0,0,0,0.02)' : 'none',
                      opacity: section.isEnabled ? 1 : 0.65,
                    }}
                  >
                    {/* Left: Sequence and Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 320px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: section.isEnabled ? '#FAF0E4' : '#E7E5E4',
                          color: section.isEnabled ? '#C8822A' : '#78716C',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1C1917' }}>
                            {section.title}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              backgroundColor: section.isEnabled ? '#DCFCE7' : '#F3F4F6',
                              color: section.isEnabled ? '#15803D' : '#6B7280',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                            }}
                          >
                            {section.isEnabled ? 'Live on Store' : 'Hidden'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#A8A29E', backgroundColor: '#F5F5F4', padding: '2px 6px', borderRadius: '4px' }}>
                            {section.category || 'Storefront'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.825rem', color: '#6B635B', margin: 0 }}>
                          {section.subtitle || section.key}
                        </p>
                      </div>
                    </div>

                    {/* Right: Controls (Reorder, Toggle, Delete) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#FFF',
                          border: '1px solid #D6D3D1',
                          borderRadius: '6px',
                          color: idx === 0 ? '#D6D3D1' : '#44403C',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        }}
                        title="Move Section Up"
                      >
                        <ArrowUp size={15} />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === arr.length - 1}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#FFF',
                          border: '1px solid #D6D3D1',
                          borderRadius: '6px',
                          color: idx === arr.length - 1 ? '#D6D3D1' : '#44403C',
                          cursor: idx === arr.length - 1 ? 'not-allowed' : 'pointer',
                        }}
                        title="Move Section Down"
                      >
                        <ArrowDown size={15} />
                      </button>

                      {/* Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => handleToggleSection(section)}
                        style={{
                          padding: '7px 14px',
                          backgroundColor: section.isEnabled ? '#FEF3C7' : '#F5F5F4',
                          border: `1px solid ${section.isEnabled ? '#FDE68A' : '#D6D3D1'}`,
                          color: section.isEnabled ? '#92400E' : '#57534E',
                          borderRadius: '6px',
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {section.isEnabled ? <ToggleRight size={18} color="#C8822A" /> : <ToggleLeft size={18} color="#78716C" />}
                        <span>{section.isEnabled ? 'Enabled' : 'Disabled'}</span>
                      </button>

                      {/* Delete Section Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteTargetSection(section)}
                        style={{
                          padding: '7px 12px',
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FECACA',
                          borderRadius: '6px',
                          color: '#DC2626',
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                        title="Permanently remove this section from the platform"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Deleted Sections Recovery Notice */}
          {sections.some((s) => s.isDeleted) && (
            <div
              style={{
                marginTop: '24px',
                padding: '16px 20px',
                backgroundColor: '#FEF2F2',
                borderRadius: '10px',
                border: '1px solid #FCA5A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color="#DC2626" />
                <span style={{ fontSize: '0.875rem', color: '#991B1B' }}>
                  {sections.filter((s) => s.isDeleted).length} section(s) currently marked as deleted from the platform.
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetSections}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Restore Deleted Sections
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Theme & Announcement Colors */}
      {activeTab === 'theme' && (
        <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={20} color="#C8822A" />
            <span>Theme Colors & Announcement Strip</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            {/* Primary Sacred Color */}
            <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '10px', border: '1px solid #EAE3D6' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '8px' }}>
                Primary Sacred Color (Gold / Saffron)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={settings.primaryColor || '#C8822A'}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={settings.primaryColor || '#C8822A'}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Accent Terracotta Color */}
            <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '10px', border: '1px solid #EAE3D6' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '8px' }}>
                Accent Color (Terracotta / Crimson)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={settings.accentColor || '#9B3828'}
                  onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                  style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }}
                />
                <input
                  type="text"
                  value={settings.accentColor || '#9B3828'}
                  onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          </div>

          {/* Announcement Bar Customizer */}
          <div style={{ borderTop: '1px solid #EAE3D6', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C1917', marginBottom: '14px' }}>
              Top Announcement Bar Content & Styling
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#292524', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.announcementEnabled !== false}
                  onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#C8822A' }}
                />
                <span>Enable Top Announcement Bar</span>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Announcement Message
              </label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem' }}
                placeholder="✦ Free Sacred Ganga Jal on orders above ₹999 ✦"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#44403C', marginBottom: '6px' }}>
                  Bar Background Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={settings.announcementBgColor || '#1C1917'}
                    onChange={(e) => setSettings({ ...settings, announcementBgColor: e.target.value })}
                    style={{ width: '38px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={settings.announcementBgColor || '#1C1917'}
                    onChange={(e) => setSettings({ ...settings, announcementBgColor: e.target.value })}
                    style={{ flex: 1, padding: '7px 10px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#44403C', marginBottom: '6px' }}>
                  Text Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={settings.announcementTextColor || '#FAF7F2'}
                    onChange={(e) => setSettings({ ...settings, announcementTextColor: e.target.value })}
                    style={{ width: '38px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={settings.announcementTextColor || '#FAF7F2'}
                    onChange={(e) => setSettings({ ...settings, announcementTextColor: e.target.value })}
                    style={{ flex: 1, padding: '7px 10px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Commerce Rules & Business Contacts */}
      {activeTab === 'commerce' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Shipping & Payment Rules */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#C8822A" />
              <span>Shipping & Payment Thresholds</span>
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#78716C' }}>Orders equal or above this amount receive free pan-India courier delivery.</span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Standard Flat Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={settings.flatShippingFee}
                onChange={(e) => setSettings({ ...settings, flatShippingFee: Number(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#292524', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.codEnabled !== false}
                  onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#C8822A' }}
                />
                <span>Enable Cash On Delivery (COD) Checkout Option</span>
              </label>
            </div>
          </div>

          {/* Business & Support Contacts */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={20} color="#C8822A" />
              <span>Official Devotee Support Channels</span>
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Support WhatsApp Number (International format e.g. 919876543210)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Support Email Address
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Customer Care Helpline Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#292524', marginBottom: '6px' }}>
                Registered Office Address & GSTIN
              </label>
              <input
                type="text"
                value={settings.registeredAddress}
                onChange={(e) => setSettings({ ...settings, registeredAddress: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '8px' }}
                placeholder="Full registered address"
              />
              <input
                type="text"
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D6D3D1', borderRadius: '8px', fontSize: '0.9rem' }}
                placeholder="GSTIN Number (e.g. 07AABCU9603R1ZM)"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Platform Copy, Headlines & Descriptions */}
      {activeTab === 'copy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header notice */}
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#1C1917', fontSize: '0.98rem' }}>
                Storefront Copy & Content Management
              </div>
              <div style={{ fontSize: '0.825rem', color: '#6B635B' }}>
                Customize all headlines, subheadings, devotional descriptions, and CTA button labels displayed across the platform.
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              style={{
                padding: '9px 18px',
                backgroundColor: '#C8822A',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: isSaving ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(200, 130, 42, 0.3)',
              }}
            >
              <Save size={15} />
              <span>{isSaving ? 'Sanctifying...' : 'Save All Copy'}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
            {/* Card 1: Hero Carousel Section */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#C8822A" />
                <span>Hero Banner & Main Visual Copy</span>
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Top Badge / Tagline
                </label>
                <input
                  type="text"
                  value={settings.heroBadge || ''}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Main Hero Headline
                </label>
                <input
                  type="text"
                  value={settings.heroMainHeading || ''}
                  onChange={(e) => setSettings({ ...settings, heroMainHeading: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Hero Subheading / Devotional Description
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubheading || ''}
                  onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settings.heroPrimaryCtaText || ''}
                    onChange={(e) => setSettings({ ...settings, heroPrimaryCtaText: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settings.heroSecondaryCtaText || ''}
                    onChange={(e) => setSettings({ ...settings, heroSecondaryCtaText: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Rituals & Bestsellers Sections */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#C8822A" />
                <span>Rituals Grid & Bestsellers Titles</span>
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Rituals Grid Title
                </label>
                <input
                  type="text"
                  value={settings.ritualsTitle || ''}
                  onChange={(e) => setSettings({ ...settings, ritualsTitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Rituals Grid Subtitle
                </label>
                <input
                  type="text"
                  value={settings.ritualsSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, ritualsSubtitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Bestsellers Section Title
                </label>
                <input
                  type="text"
                  value={settings.bestsellersTitle || ''}
                  onChange={(e) => setSettings({ ...settings, bestsellersTitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Bestsellers Subtitle
                </label>
                <input
                  type="text"
                  value={settings.bestsellersSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, bestsellersSubtitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Card 3: Philosophy & Gau Seva Copy */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#C8822A" />
                <span>Philosophy & Vedic Commitment Copy</span>
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Philosophy Section Title
                </label>
                <input
                  type="text"
                  value={settings.philosophyTitle || ''}
                  onChange={(e) => setSettings({ ...settings, philosophyTitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Philosophy Statement / Description
                </label>
                <textarea
                  rows={4}
                  value={settings.philosophyContent || ''}
                  onChange={(e) => setSettings({ ...settings, philosophyContent: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem', lineHeight: 1.6 }}
                />
              </div>
            </div>

            {/* Card 4: Devotee Testimonials & FAQs */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#C8822A" />
                <span>Testimonials & FAQ Headlines</span>
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Devotee Testimonials Title
                </label>
                <input
                  type="text"
                  value={settings.testimonialsTitle || ''}
                  onChange={(e) => setSettings({ ...settings, testimonialsTitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  Devotee Testimonials Subtitle
                </label>
                <input
                  type="text"
                  value={settings.testimonialsSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, testimonialsSubtitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  FAQs Accordion Title
                </label>
                <input
                  type="text"
                  value={settings.faqsTitle || ''}
                  onChange={(e) => setSettings({ ...settings, faqsTitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                  FAQs Subtitle
                </label>
                <input
                  type="text"
                  value={settings.faqsSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, faqsSubtitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Card 5: Footer Brand Narrative & Copyright */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#1C1917', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#C8822A" />
                <span>Footer Brand Narrative & Copyright Text</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                    Footer Brand Description / About Blurb
                  </label>
                  <textarea
                    rows={3}
                    value={settings.footerAboutText || ''}
                    onChange={(e) => setSettings({ ...settings, footerAboutText: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem', lineHeight: 1.5 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={settings.copyrightNotice || ''}
                    onChange={(e) => setSettings({ ...settings, copyrightNotice: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D6D3D1', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '12px' }}
                  />
                  <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                    This text appears at the absolute bottom of every page across the storefront.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete Section */}
      {deleteTargetSection && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setDeleteTargetSection(null)}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '14px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid #EAE3D6',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                Delete Section from Platform?
              </h3>
            </div>

            <p style={{ color: '#57534E', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Are you sure you want to delete <strong>"{deleteTargetSection.title}"</strong>? It will be removed immediately from the live storefront. You can restore default sections anytime using the 'Restore Factory Sections' button.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteTargetSection(null)}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #D6D3D1',
                  borderRadius: '8px',
                  fontWeight: 600,
                  color: '#44403C',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSection}
                style={{
                  padding: '9px 18px',
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Yes, Delete Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
