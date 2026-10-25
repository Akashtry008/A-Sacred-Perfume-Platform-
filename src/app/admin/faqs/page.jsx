import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, Save, X, Folder } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminFAQsPage() {
  const { showToast, showAlert } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Rituals & Usage',
    order: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
      }
    } catch (err) {
      showToast('Error loading FAQs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Rituals & Usage',
      order: faqs.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'Rituals & Usage',
      order: faq.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('Question and answer cannot be blank', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingFaq ? `/api/admin/faqs/${editingFaq.id}` : '/api/admin/faqs';
      const method = editingFaq ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to save FAQ');

      showToast(editingFaq ? 'FAQ updated successfully!' : 'New FAQ published!', 'success');
      setIsModalOpen(false);
      loadFaqs();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (faq) => {
    showAlert({
      title: 'Delete FAQ Confirmation',
      message: `Are you sure you want to permanently delete FAQ: "${faq.question}"?`,
      type: 'warning',
      confirmText: 'Delete FAQ',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/faqs/${faq.id}`, { method: 'DELETE' });
          if (res.ok) {
            setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
            showToast('FAQ deleted successfully', 'info');
          } else {
            showToast('Failed to delete FAQ', 'error');
          }
        } catch (e) {
          showToast('Network error while deleting FAQ', 'error');
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
            Knowledge Base
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', margin: '4px 0 0', color: '#1C1917' }}>
            Frequently Asked Questions & Ritual Guides
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Manage the sacred knowledge displayed to devotees on the storefront and RAG assistant.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Add New FAQ
        </button>
      </div>

      {/* FAQs List */}
      {isLoading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#C8822A', fontSize: '0.9rem' }}>
          Loading FAQs from database...
        </div>
      ) : faqs.length === 0 ? (
        <div style={{ padding: '48px 24px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', textAlign: 'center' }}>
          <HelpCircle size={36} color="#A8A29E" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#6B635B', fontSize: '0.9rem', marginBottom: '16px' }}>
            No FAQs recorded yet. Click below to add your first ritual FAQ.
          </p>
          <button onClick={handleOpenCreate} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
            + Create First FAQ
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, index) => (
            <div
              key={faq.id || index}
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: 'var(--shadow-card-classic)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#FDF6EC',
                      color: '#C8822A',
                      border: '1px solid #E8D5BF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Folder size={11} /> {faq.category || 'Rituals & Usage'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#8C827A' }}>
                    Order: #{faq.order || index + 1}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', margin: '0 0 8px', color: '#1C1917' }}>
                  {faq.question}
                </h3>

                <p style={{ color: '#57534E', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>
                  {faq.answer}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => handleOpenEdit(faq)}
                  style={{
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #D6CEBE',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#44403C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Edit FAQ"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(faq)}
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#DC2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Delete FAQ"
                >
                  <Trash2 size={15} />
                </button>
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
                {editingFaq ? 'Edit Ritual FAQ' : 'Add New FAQ'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why is 100% bambooless agarbatti prescribed?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                  Answer *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide detailed, authentic Gandhashastra / product explanation..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  >
                    <option value="Rituals & Usage">Rituals & Usage</option>
                    <option value="Ingredients & Vidhi">Ingredients & Vidhi</option>
                    <option value="Health & Purity">Health & Purity</option>
                    <option value="Shipping & Orders">Shipping & Orders</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D6CEBE', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
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
                  <Save size={15} /> {isSubmitting ? 'Saving...' : editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
