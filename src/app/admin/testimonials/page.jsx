import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit2, Trash2, Save, X, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminTestimonialsPage() {
  const { showToast, showAlert } = useToast();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    author: '',
    location: '',
    rating: 5,
    title: '',
    content: '',
    productName: 'Royal Mysore Sandalwood Bambooless Incense',
    verifiedBuyer: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      showToast('Error loading reviews', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingReview(null);
    setFormData({
      author: '',
      location: '',
      rating: 5,
      title: '',
      content: '',
      productName: 'Royal Mysore Sandalwood Bambooless Incense',
      verifiedBuyer: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rev) => {
    setEditingReview(rev);
    setFormData({
      author: rev.author || '',
      location: rev.location || '',
      rating: rev.rating || 5,
      title: rev.title || '',
      content: rev.content || '',
      productName: rev.productName || 'Royal Mysore Sandalwood Bambooless Incense',
      verifiedBuyer: rev.verifiedBuyer !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.content.trim()) {
      showToast('Author name and testimonial content are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingReview ? `/api/admin/reviews/${editingReview.id}` : '/api/admin/reviews';
      const method = editingReview ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to save testimonial');

      showToast(editingReview ? 'Testimonial updated!' : 'New testimonial published!', 'success');
      setIsModalOpen(false);
      loadReviews();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (rev) => {
    showAlert({
      title: 'Delete Testimonial Confirmation',
      message: `Are you sure you wish to delete the review by "${rev.author}"?`,
      type: 'warning',
      confirmText: 'Delete Review',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/reviews/${rev.id}`, { method: 'DELETE' });
          if (res.ok) {
            setReviews((prev) => prev.filter((r) => r.id !== rev.id));
            showToast('Testimonial removed successfully', 'info');
          } else {
            showToast('Failed to delete review', 'error');
          }
        } catch (e) {
          showToast('Network error while deleting review', 'error');
        }
      },
    });
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C8822A', fontWeight: 600 }}>
            Social Proof & Devotion
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', margin: '4px 0 0', color: '#1C1917' }}>
            Testimonials & Customer Reviews
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Add, update, and curate sacred feedback from verified Hindu households across India.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Add New Testimonial
        </button>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#C8822A', fontSize: '0.9rem' }}>
          Loading testimonials from database...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ padding: '48px 24px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', textAlign: 'center' }}>
          <Star size={36} color="#A8A29E" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#6B635B', fontSize: '0.9rem', marginBottom: '16px' }}>
            No testimonials recorded yet. Click below to add your first devotee review.
          </p>
          <button onClick={handleOpenCreate} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
            + Create First Testimonial
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
          {reviews.map((rev, index) => (
            <div
              key={rev.id || index}
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '12px',
                padding: '22px',
                boxShadow: 'var(--shadow-card-classic)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        color={i < (rev.rating || 5) ? '#F59E0B' : '#E5E7EB'}
                        fill={i < (rev.rating || 5) ? '#F59E0B' : 'none'}
                      />
                    ))}
                  </div>
                  {rev.verifiedBuyer && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#166534',
                        backgroundColor: '#DCFCE7',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  )}
                </div>

                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', margin: '0 0 6px', color: '#1C1917' }}>
                  {rev.title || 'Sacred Experience'}
                </h3>

                <p style={{ color: '#57534E', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 14px', fontStyle: 'italic' }}>
                  "{rev.content}"
                </p>

                <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '14px' }}>
                  Product: <strong style={{ color: '#1C1917' }}>{rev.productName || 'VedaPavitra Offering'}</strong>
                </div>
              </div>

              {/* Author & Action Footer */}
              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid #F5F1E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', display: 'block' }}>
                    {rev.author}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#8C827A', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={11} /> {rev.location || 'India'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenEdit(rev)}
                    style={{
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #D6CEBE',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      color: '#44403C',
                      cursor: 'pointer',
                    }}
                    title="Edit Testimonial"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(rev)}
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      color: '#DC2626',
                      cursor: 'pointer',
                    }}
                    title="Delete Testimonial"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(28, 25, 23, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              border: '1.5px solid #C8822A',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '560px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#1C1917',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(200, 130, 42, 0.3)',
              }}
            >
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#FAF7F2', fontSize: '1.15rem', margin: 0 }}>
                {editingReview ? 'Edit Devotee Testimonial' : 'Add New Testimonial'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acharya Vidhyadhar Joshi"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Varanasi, UP"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                    Rating (Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Mysore Sandalwood"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                  Headline / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unmatched temple sanctity in daily Sandhya Aarti"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
                  Devotee Experience / Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter devotee review..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="verifiedCheck"
                  checked={formData.verifiedBuyer}
                  onChange={(e) => setFormData({ ...formData, verifiedBuyer: e.target.checked })}
                />
                <label htmlFor="verifiedCheck" style={{ fontSize: '0.82rem', color: '#44403C', cursor: 'pointer' }}>
                  Display as "Verified Devotee Buyer"
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ padding: '8px 22px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={15} /> {isSubmitting ? 'Saving...' : editingReview ? 'Update Testimonial' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
