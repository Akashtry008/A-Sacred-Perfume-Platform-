import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import ProductCard from './ProductCard';

export default function CollectionBrowser({ initialProducts, categoryName, categoryDescription }) {
  const [selectedFragrance, setSelectedFragrance] = useState('');
  const [selectedPackSize, setSelectedPackSize] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState('bestselling');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Derive unique filter options
  const fragrances = useMemo(() => {
    const set = new Set();
    initialProducts.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.fragrance) set.add(v.fragrance);
      });
    });
    return Array.from(set);
  }, [initialProducts]);

  const packSizes = useMemo(() => {
    const set = new Set();
    initialProducts.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.packSize) set.add(v.packSize);
      });
    });
    return Array.from(set);
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedFragrance) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.fragrance?.toLowerCase() === selectedFragrance.toLowerCase())
      );
    }

    if (selectedPackSize) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.packSize?.toLowerCase() === selectedPackSize.toLowerCase())
      );
    }

    if (inStockOnly) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.stockQuantity > 0)
      );
    }

    result = result.filter((p) =>
      p.variants?.some((v) => v.price <= maxPrice)
    );

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestselling':
      default:
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return result;
  }, [initialProducts, selectedFragrance, selectedPackSize, inStockOnly, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedFragrance('');
    setSelectedPackSize('');
    setInStockOnly(false);
    setMaxPrice(1500);
  };

  const hasActiveFilters = selectedFragrance || selectedPackSize || inStockOnly || maxPrice < 1500;

  return (
    <div>
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          >
            <SlidersHorizontal size={16} /> Filters
            {hasActiveFilters && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C8822A' }} />
            )}
          </button>

          <span style={{ fontSize: '0.875rem', color: '#6B635B' }}>
            Showing <strong>{filteredProducts.length}</strong> products
          </span>
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="sort-select" style={{ fontSize: '0.875rem', color: '#6B635B' }}>
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#FFF',
              fontSize: '0.875rem',
              color: '#1C1917',
              cursor: 'pointer',
            }}
          >
            <option value="bestselling">Featured / Bestsellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Launches</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: '#6B635B' }}>Active filters:</span>
          {selectedFragrance && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FDF6EC',
                border: '1px solid #E8D5BF',
                color: '#C8822A',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Fragrance: {selectedFragrance}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedFragrance('')} />
            </span>
          )}

          {selectedPackSize && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FDF6EC',
                border: '1px solid #E8D5BF',
                color: '#C8822A',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Pack: {selectedPackSize}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedPackSize('')} />
            </span>
          )}

          {inStockOnly && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#EAF4EE',
                border: '1px solid #C2E2CD',
                color: '#1E5E3A',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              In Stock Only
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)} />
            </span>
          )}

          <button
            onClick={clearFilters}
            style={{ fontSize: '0.75rem', color: '#9B3828', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
            No products match the selected filters
          </h3>
          <p style={{ color: '#6B635B', marginBottom: '20px' }}>
            Try widening your price limit or clearing active fragrance filters.
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Slide-out Filter Drawer */}
      {isFilterDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-start',
          }}
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              height: '100%',
              backgroundColor: '#FFF',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Filter Catalog</h3>
              <button onClick={() => setIsFilterDrawerOpen(false)} style={{ color: '#6B635B' }} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            {/* Fragrance Filter */}
            {fragrances.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1C1917', marginBottom: '12px' }}>
                  Fragrance Note
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {fragrances.map((f) => (
                    <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="fragrance"
                        checked={selectedFragrance === f}
                        onChange={() => setSelectedFragrance(selectedFragrance === f ? '' : f)}
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Pack Size Filter */}
            {packSizes.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1C1917', marginBottom: '12px' }}>
                  Pack Size
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {packSizes.map((p) => (
                    <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="packSize"
                        checked={selectedPackSize === p}
                        onChange={() => setSelectedPackSize(selectedPackSize === p ? '' : p)}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Slider */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1C1917' }}>
                  Maximum Price
                </h4>
                <span style={{ fontWeight: 600, color: '#C8822A', fontSize: '0.875rem' }}>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#C8822A', cursor: 'pointer' }}
              />
            </div>

            {/* Availability */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#C8822A' }}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Drawer Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button
                onClick={clearFilters}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.875rem' }}
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.875rem' }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
