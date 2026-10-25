import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { Layers, Plus, Edit, Trash2, CheckCircle2, RefreshCw, X, Save, Edit2, ExternalLink } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { db } from '@/lib/db';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function AdminCollectionsPage() {
  const { showToast } = useToast();
  const [collections, setCollections] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [newCol, setNewCol] = useState({
    title: '',
    slug: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80',
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const res = await fetch('/api/admin/collections');
      if (res.ok) {
        const data = await res.json();
        if (data.collections && data.collections.length > 0) {
          setCollections(data.collections);
          return;
        }
      }
      const local = db.getCollections ? db.getCollections() : [];
      setCollections(local);
    } catch {
      const local = db.getCollections ? db.getCollections() : [];
      setCollections(local);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCol),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create collection');

      showToast?.('Collection created successfully!', 'success');
      setCollections([...collections, data.collection]);
      setIsCreating(false);
      setNewCol({
        title: '',
        slug: '',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80',
      });
    } catch (err) {
      showToast?.(err.message || 'Error creating collection', 'error');
    }
  };

  const handleOpenEdit = (col) => {
    setEditingCollection({
      id: col.id || col.slug,
      title: col.title || '',
      slug: col.slug || '',
      description: col.description || '',
      imageUrl: col.imageUrl || '',
      bannerUrl: col.bannerUrl || '',
    });
  };

  const handleSaveEditCollection = async (e) => {
    e.preventDefault();
    if (!editingCollection) return;
    setIsUpdating(true);

    try {
      const colId = editingCollection.id || editingCollection.slug;
      const res = await fetch(`/api/admin/collections/${colId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCollection),
      });

      if (!res.ok) throw new Error('Failed to update collection');
      const data = await res.json();

      setCollections((prev) =>
        prev.map((c) => ((c.id === colId || c.slug === colId) ? data.collection || editingCollection : c))
      );
      showToast?.(`"${editingCollection.title}" updated successfully!`, 'success');
      setEditingCollection(null);
    } catch (err) {
      showToast?.(err.message || 'Error updating collection', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCollection = async (colId, title) => {
    if (!window.confirm(`Are you sure you want to delete collection "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/collections/${colId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete collection');

      setCollections((prev) => prev.filter((c) => c.id !== colId && c.slug !== colId));
      showToast?.(`"${title}" deleted successfully`, 'success');
    } catch (err) {
      showToast?.(err.message || 'Error deleting collection', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
            Collections & Categories Management
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            Configure and edit all collection parameters, card thumbnails (600 × 750 px), and panoramic banners (1600 × 500 px).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> {isCreating ? 'Cancel' : 'Add New Collection'}
          </button>
        </div>
      </div>

      {/* 📐 Collections Media Specifications Guide Banner */}
      <div
        style={{
          backgroundColor: '#FFFBF5',
          border: '1.5px solid #F3DFC1',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          boxShadow: '0 2px 10px rgba(200, 130, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
          <span style={{ fontSize: '1.25rem' }}>🗂️</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917' }}>Card Thumbnail:</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C8822A', backgroundColor: '#FAF0E4', padding: '2px 6px', borderRadius: '4px' }}>
                600 × 750 px (4:5)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6B635B', marginTop: '2px' }}>
              Displayed on category grid cards and navigation menus.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
          <span style={{ fontSize: '1.25rem' }}>🌅</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917' }}>Collection Header Banner:</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9B3828', backgroundColor: '#FAF0E4', padding: '2px 6px', borderRadius: '4px' }}>
                1600 × 500 px (3.2:1)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6B635B', marginTop: '2px' }}>
              Wide panoramic header photo at the top of collection pages.
            </div>
          </div>
        </div>
      </div>

      {/* CREATE COLLECTION DRAWER */}
      {isCreating && (
        <div
          style={{
            backgroundColor: '#FFF',
            border: '2px solid #C8822A',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#1C1917', marginBottom: '16px' }}>
            Create New Spiritual Collection
          </h2>
          <form onSubmit={handleCreateCollection} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCol.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setNewCol({ ...newCol, title, slug });
                  }}
                  placeholder="e.g. Pure Bambooless Incense Sticks"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={newCol.slug}
                  onChange={(e) => setNewCol({ ...newCol, slug: e.target.value })}
                  placeholder="bambooless-incense-sticks"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                rows={2}
                value={newCol.description}
                onChange={(e) => setNewCol({ ...newCol, description: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <ImageUploadField
                  label="Collection Card Thumbnail"
                  recommendedWidth={600}
                  recommendedHeight={750}
                  aspectRatioText="4:5 Portrait"
                  value={newCol.imageUrl}
                  onChange={(url) => setNewCol({ ...newCol, imageUrl: url })}
                  helperText="Upload 600 × 750 px portrait image shown on category grid cards."
                  required
                />
              </div>

              <div>
                <ImageUploadField
                  label="Collection Page Hero Banner"
                  recommendedWidth={1600}
                  recommendedHeight={500}
                  aspectRatioText="3.2:1 Wide Header"
                  value={newCol.bannerUrl}
                  onChange={(url) => setNewCol({ ...newCol, bannerUrl: url })}
                  helperText="Upload 1600 × 500 px wide banner displayed at top of category page."
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                Create Collection
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT COLLECTION MODAL */}
      {editingCollection && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(28, 25, 23, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCollection(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              border: '1.5px solid #C8822A',
              boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', margin: 0, color: '#1C1917' }}>
                  Configure Collection: {editingCollection.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#78716C' }}>Edit title, description, thumbnail (600 × 750 px), and banner (1600 × 500 px)</span>
              </div>
              <button onClick={() => setEditingCollection(null)} style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCollection} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCollection.title}
                    onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCollection.slug}
                    onChange={(e) => setEditingCollection({ ...editingCollection, slug: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Description / Sacred Intent
                </label>
                <textarea
                  rows={2}
                  value={editingCollection.description}
                  onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <ImageUploadField
                    label="Collection Card Thumbnail"
                    recommendedWidth={600}
                    recommendedHeight={750}
                    aspectRatioText="4:5 Portrait"
                    value={editingCollection.imageUrl}
                    onChange={(url) => setEditingCollection({ ...editingCollection, imageUrl: url })}
                    helperText="Upload 600 × 750 px portrait image shown on cards."
                    required
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Collection Page Hero Banner"
                    recommendedWidth={1600}
                    recommendedHeight={500}
                    aspectRatioText="3.2:1 Wide Header"
                    value={editingCollection.bannerUrl}
                    onChange={(url) => setEditingCollection({ ...editingCollection, bannerUrl: url })}
                    helperText="Upload 1600 × 500 px wide banner displayed at top of category page."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button type="submit" disabled={isUpdating} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                  {isUpdating ? 'Saving Updates...' : 'Save Collection Changes'}
                </button>
                <button type="button" onClick={() => setEditingCollection(null)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {collections.map((col) => (
          <div
            key={col.id || col.slug}
            style={{
              backgroundColor: '#FFF',
              border: '1.5px solid #EAE3D6',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Banner Preview Area */}
            <div style={{ height: '140px', position: 'relative', overflow: 'hidden', backgroundColor: '#1C1917' }}>
              <img
                src={col.bannerUrl || col.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80'}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(28,25,23,0.85) 0%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '16px',
                }}
              >
                <div>
                  <h3 style={{ color: '#FFF', margin: '0 0 2px', fontSize: '1.15rem', fontFamily: 'Georgia, serif' }}>
                    {col.title}
                  </h3>
                  <div style={{ color: '#FEF08A', fontSize: '0.75rem', fontWeight: 600 }}>
                    /{col.slug}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ color: '#6B635B', fontSize: '0.85rem', margin: '0 0 16px', lineHeight: 1.5, minHeight: '40px' }}>
                {col.description || 'No description provided.'}
              </p>

              {/* Action Buttons */}
              <div
                style={{
                  paddingTop: '14px',
                  borderTop: '1px solid #F5F1EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Configure collection parameters"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(col.id || col.slug, col.title)}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #FCA5A5',
                      backgroundColor: '#FEF2F2',
                      color: '#991B1B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Delete collection"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <Link
                  href={`/collections/${col.slug}`}
                  target="_blank"
                  className="btn btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ExternalLink size={12} /> View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
