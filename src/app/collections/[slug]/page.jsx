import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useParams } from 'react-router-dom';
import { db } from '@/lib/db';
import CollectionBrowser from '@/components/storefront/CollectionBrowser';

export default function CollectionPage({ params }) {
  const routerParams = useParams();
  const slug = params?.slug || routerParams?.slug;

  const [colData, setColData] = useState(() => {
    const category = db.getCategoryBySlug(slug);
    const collection = db.getCollectionBySlug(slug);
    const name = category?.name || collection?.title || (slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Collection');
    const description = category?.description || collection?.description || 'Pure handcrafted Vedic formulations.';
    const bannerUrl = category?.bannerUrl || collection?.bannerUrl;
    const { products } = db.getProducts({
      categorySlug: category ? slug : undefined,
      collectionSlug: collection ? slug : undefined,
      limit: 100,
    });
    return { name, description, bannerUrl, products };
  });

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/collections/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.collection) {
          setColData({
            name: data.collection.title || data.collection.name,
            description: data.collection.description,
            bannerUrl: data.collection.heroImage || data.collection.bannerUrl,
            products: data.products || [],
          });
        }
      })
      .catch((e) => console.error('Error fetching collection from FastAPI:', e));
  }, [slug]);

  const { name, description, bannerUrl, products } = colData;

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt;{' '}
          <Link href="/collections" style={{ color: '#1C1917' }}>Collections</Link> &gt;{' '}
          <span style={{ color: '#C8822A', fontWeight: 500 }}>{name}</span>
        </div>

        {/* Hero Banner Header */}
        <div
          style={{
            backgroundColor: '#F6F1EA',
            borderRadius: '16px',
            border: '1px solid #EAE3D6',
            padding: '40px 32px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {bannerUrl && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40%',
                height: '100%',
                backgroundImage: `url(${bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.25,
                maskImage: 'linear-gradient(to left, black, transparent)',
                WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              VedaPavitra Collection
            </span>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', margin: '8px 0 12px', color: '#1C1917' }}>
              {name}
            </h1>
            <p style={{ color: '#6B635B', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              {description}
            </p>
          </div>
        </div>

        {/* Client Interactive Filter & Sorting Grid */}
        <CollectionBrowser initialProducts={products} title={name} />
      </div>
    </div>
  );
}
