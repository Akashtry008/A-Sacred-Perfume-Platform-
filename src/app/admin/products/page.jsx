import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { Search, Plus, Edit, Check, X, Box, AlertTriangle, RefreshCw, Trash2, Image as ImageIcon, Edit2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { db } from '@/lib/db';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVariant, setEditingVariant] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // New Product Modal State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    subtitle: '',
    price: 299,
    compareAtPrice: 399,
    packSize: 'Pack of 40 Sticks',
    fragrance: 'Mysore Sandalwood',
    stockQuantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    shortDesc: '100% bambooless devotional agarbatti.',
    category: 'cat-incense',
    isBestseller: false,
  });

  // Edit Existing Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          return;
        }
      }
      const local = db.getAllProductsAdmin ? db.getAllProductsAdmin() : [];
      setProducts(local);
    } catch {
      const local = db.getAllProductsAdmin ? db.getAllProductsAdmin() : [];
      setProducts(local);
    }
  };

  const handleToggleBestseller = async (productId, currentVal) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBestseller: !currentVal }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isBestseller: !currentVal } : p))
        );
        showToast?.('Bestseller status updated', 'success');
      }
    } catch (e) {
      showToast?.('Failed to update product', 'error');
    }
  };

  const handleSaveStock = async (productId, variantId) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          stockQuantity: Number(newStock),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.product : p))
        );
        showToast?.('Inventory updated successfully', 'success');
        setEditingVariant(null);
      }
    } catch (e) {
      showToast?.('Failed to save stock', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showToast?.(`"${title}" deleted from catalog`, 'success');
      }
    } catch (e) {
      showToast?.('Failed to delete product', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          categoryIds: [newProd.category],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      showToast?.(`"${newProd.title}" added to catalog!`, 'success');
      setProducts([data.product, ...products]);
      setIsAddingProduct(false);
      setNewProd({
        title: '',
        subtitle: '',
        price: 299,
        compareAtPrice: 399,
        packSize: 'Pack of 40 Sticks',
        fragrance: 'Mysore Sandalwood',
        stockQuantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        shortDesc: '100% bambooless devotional agarbatti.',
        category: 'cat-incense',
        isBestseller: false,
      });
    } catch (err) {
      showToast?.(err.message || 'Error creating product', 'error');
    }
  };

  const handleOpenEditProduct = (prod) => {
    const primaryVariant = prod.variants?.[0] || {};
    setEditingProduct({
      id: prod.id,
      title: prod.title || '',
      subtitle: prod.subtitle || '',
      shortDesc: prod.shortDesc || '',
      description: prod.description || prod.shortDesc || '',
      price: primaryVariant.price || 299,
      compareAtPrice: primaryVariant.compareAtPrice || 399,
      packSize: primaryVariant.title || 'Pack of 40 Sticks',
      stockQuantity: primaryVariant.stockQuantity || 100,
      fragrance: prod.fragrance || 'Mysore Sandalwood',
      category: prod.categoryIds?.[0] || 'cat-incense',
      imageUrl: prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      isBestseller: prod.isBestseller || false,
    });
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdatingProduct(true);

    try {
      const payload = {
        title: editingProduct.title,
        subtitle: editingProduct.subtitle,
        shortDesc: editingProduct.shortDesc,
        description: editingProduct.description,
        fragrance: editingProduct.fragrance,
        categoryIds: [editingProduct.category],
        isBestseller: editingProduct.isBestseller,
        images: [{ url: editingProduct.imageUrl, altText: editingProduct.title }],
        variants: [
          {
            id: `v-${editingProduct.id}-1`,
            title: editingProduct.packSize,
            price: Number(editingProduct.price),
            compareAtPrice: Number(editingProduct.compareAtPrice),
            stockQuantity: Number(editingProduct.stockQuantity),
            sku: `SKU-${editingProduct.id.toUpperCase()}`,
          },
        ],
      };

      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update product');
      const data = await res.json();

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? data.product || { ...p, ...payload } : p))
      );
      showToast?.(`"${editingProduct.title}" updated successfully!`, 'success');
      setEditingProduct(null);
    } catch (err) {
      showToast?.(err.message || 'Error updating product', 'error');
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const filtered = products.filter((p) =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.slug || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '2rem', margin: '0 0 6px', color: '#1C1917' }}>
            Catalog Products & Inventory Manager
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem', margin: 0 }}>
            Configure all products with title, descriptions, prices, compare prices, fragrances, stock, and fixed 800 × 800 px direct uploads.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Sacred Product
          </button>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#A8A29E' }} />
          <input
            type="text"
            placeholder="Search products by title, scent, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              borderRadius: '8px',
              border: '1px solid #D6D3D1',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <button onClick={loadProducts} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {isAddingProduct && (
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
            if (e.target === e.currentTarget) setIsAddingProduct(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              border: '1.5px solid #C8822A',
              boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', margin: 0, color: '#1C1917' }}>
                  Create New Sacred Product
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#78716C' }}>Fixed media target: 800 × 800 px</span>
              </div>
              <button onClick={() => setIsAddingProduct(false)} style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  placeholder="e.g. Royal Mysore Sandalwood Dhoop Sticks"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Subtitle / Vidhi Heading
                </label>
                <input
                  type="text"
                  value={newProd.subtitle}
                  onChange={(e) => setNewProd({ ...newProd, subtitle: e.target.value })}
                  placeholder="e.g. 100% Charcoal-Free Bamboo-Free Agarbatti"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Compare At / Regular Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProd.compareAtPrice}
                    onChange={(e) => setNewProd({ ...newProd, compareAtPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Pack Size / Variant
                  </label>
                  <input
                    type="text"
                    value={newProd.packSize}
                    onChange={(e) => setNewProd({ ...newProd, packSize: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProd.stockQuantity}
                    onChange={(e) => setNewProd({ ...newProd, stockQuantity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Fragrance / Scent
                  </label>
                  <input
                    type="text"
                    value={newProd.fragrance}
                    onChange={(e) => setNewProd({ ...newProd, fragrance: e.target.value })}
                    placeholder="e.g. Kashmiri Kesar Chandan"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', backgroundColor: '#FFF' }}
                  >
                    <option value="cat-incense">Bambooless Incense Sticks</option>
                    <option value="cat-dhoop">Vedic Dhoop Cones</option>
                    <option value="cat-sambrani">Pure Sambrani & Havan Cups</option>
                    <option value="cat-ghee-diyas">Cow Ghee Diyas & Wicks</option>
                    <option value="curated-puja-combos">Curated Puja Combos & Hampers</option>
                  </select>
                </div>
              </div>

              {/* Direct Image Upload Field */}
              <ImageUploadField
                label="Product Image Photo"
                recommendedWidth={800}
                recommendedHeight={800}
                aspectRatioText="1:1 Square"
                value={newProd.imageUrl}
                onChange={(url) => setNewProd({ ...newProd, imageUrl: url })}
                helperText="Upload 800 × 800 px high-contrast square photo directly from your device."
                required
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Description / Shastra Vidhi
                </label>
                <textarea
                  rows={3}
                  value={newProd.shortDesc}
                  onChange={(e) => setNewProd({ ...newProd, shortDesc: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="prod-bestseller"
                  checked={newProd.isBestseller}
                  onChange={(e) => setNewProd({ ...newProd, isBestseller: e.target.checked })}
                />
                <label htmlFor="prod-bestseller" style={{ fontSize: '0.85rem', color: '#292524', cursor: 'pointer' }}>
                  Highlight as Storefront Bestseller
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                  Create Product
                </button>
                <button type="button" onClick={() => setIsAddingProduct(false)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EXISTING PRODUCT MODAL */}
      {editingProduct && (
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
            if (e.target === e.currentTarget) setEditingProduct(null);
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
                  Configure Product: {editingProduct.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#78716C' }}>Edit title, price, descriptions, stock and upload 800 × 800 px photo</span>
              </div>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Subtitle / Vidhi Heading
                </label>
                <input
                  type="text"
                  value={editingProduct.subtitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Compare At Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.compareAtPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Pack Size / Variant Name
                  </label>
                  <input
                    type="text"
                    value={editingProduct.packSize}
                    onChange={(e) => setEditingProduct({ ...editingProduct, packSize: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Live Stock Inventory
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockQuantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Fragrance
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fragrance}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fragrance: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', backgroundColor: '#FFF' }}
                  >
                    <option value="cat-incense">Bambooless Incense Sticks</option>
                    <option value="cat-dhoop">Vedic Dhoop Cones</option>
                    <option value="cat-sambrani">Pure Sambrani & Havan Cups</option>
                    <option value="cat-ghee-diyas">Cow Ghee Diyas & Wicks</option>
                    <option value="curated-puja-combos">Curated Puja Combos & Hampers</option>
                  </select>
                </div>
              </div>

              {/* Direct Image Upload Field */}
              <ImageUploadField
                label="Product Image Photo"
                recommendedWidth={800}
                recommendedHeight={800}
                aspectRatioText="1:1 Square"
                value={editingProduct.imageUrl}
                onChange={(url) => setEditingProduct({ ...editingProduct, imageUrl: url })}
                helperText="Upload 800 × 800 px direct square photo. Inspects resolution automatically."
                required
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403C', marginBottom: '4px' }}>
                  Description / Agamic Details
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="edit-prod-bestseller"
                  checked={editingProduct.isBestseller}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                />
                <label htmlFor="edit-prod-bestseller" style={{ fontSize: '0.85rem', color: '#292524', cursor: 'pointer' }}>
                  Highlight as Storefront Bestseller
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" disabled={isUpdatingProduct} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                  {isUpdatingProduct ? 'Saving Updates...' : 'Save Product Changes'}
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1.5px solid #EAE3D6',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', textAlign: 'left', borderBottom: '1px solid #EAE3D6' }}>
                <th style={{ padding: '14px 16px' }}>Product & Image</th>
                <th style={{ padding: '14px 16px' }}>Variants & Live Stock</th>
                <th style={{ padding: '14px 16px' }}>Base Price</th>
                <th style={{ padding: '14px 16px' }}>Rating</th>
                <th style={{ padding: '14px 16px' }}>Bestseller</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #F5F1EB' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80'}
                        alt=""
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #EAE3D6' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1C1917' }}>{prod.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C' }}>/{prod.slug}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(prod.variants || []).map((v) => {
                        const isEditingThis =
                          editingVariant?.productId === prod.id && editingVariant?.variantId === v.id;

                        return (
                          <div key={v.id} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#57534E' }}>{v.title}:</span>
                            {isEditingThis ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                  type="number"
                                  value={newStock}
                                  onChange={(e) => setNewStock(e.target.value)}
                                  style={{
                                    width: '60px',
                                    padding: '2px 4px',
                                    fontSize: '0.8rem',
                                    border: '1px solid #C8822A',
                                    borderRadius: '4px',
                                  }}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveStock(prod.id, v.id)}
                                  disabled={isSaving}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#16A34A',
                                    padding: 0,
                                  }}
                                  title="Save"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingVariant(null)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#DC2626',
                                    padding: 0,
                                  }}
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: v.stockQuantity <= 10 ? '#DC2626' : '#1C1917',
                                  }}
                                >
                                  {v.stockQuantity} units
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingVariant({ productId: prod.id, variantId: v.id });
                                    setNewStock(String(v.stockQuantity));
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#C8822A',
                                    padding: 0,
                                  }}
                                  title="Edit inventory stock"
                                >
                                  <Edit size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {formatPrice(prod.variants?.[0]?.price || 0)}
                  </td>

                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#78716C' }}>
                    ★ {prod.ratingAverage || 4.9} ({prod.ratingCount || 1})
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleToggleBestseller(prod.id, prod.isBestseller)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: prod.isBestseller ? '#FEF3C7' : '#F5F5F4',
                        color: prod.isBestseller ? '#B45309' : '#78716C',
                      }}
                    >
                      {prod.isBestseller ? '★ Bestseller' : 'Standard'}
                    </button>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Edit all product parameters"
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        PDP
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.title)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
