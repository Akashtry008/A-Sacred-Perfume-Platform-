import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/lib/db';
import ProductDetailView from '@/components/storefront/ProductDetailView';

export default function ProductPage({ params }) {
  const routerParams = useParams();
  const slug = params?.slug || routerParams?.slug;

  const [productData, setProductData] = useState(() => {
    const local = db.getProductBySlug(slug);
    if (!local) return null;
    const { products: all } = db.getProducts({ limit: 50 });
    const rel = all.filter((p) => p.id !== local.id);
    const rev = db.getReviewsForProduct(local.id);
    return { product: local, relatedProducts: rel, reviews: rev };
  });

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProductData(data);
        }
      })
      .catch((e) => console.error('Error fetching product from FastAPI:', e));
  }, [slug]);

  if (!productData || !productData.product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', marginBottom: '16px' }}>Sacred Product Not Found</h2>
        <p style={{ color: '#6B635B', marginBottom: '24px' }}>The Vedic formulation you are looking for may have been relocated.</p>
        <a href="/collections" className="btn btn-primary">Explore All Collections</a>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={productData.product}
      relatedProducts={productData.relatedProducts || []}
      reviews={productData.reviews || []}
    />
  );
}
