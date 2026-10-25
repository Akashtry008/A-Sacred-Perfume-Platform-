import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { db } from '@/lib/db';
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Vedic Wisdom & Gandhashastra Journal | VedaPavitra',
  description: 'Explore insightful essays on Gandhashastra, Vedic rituals, bambooless incense science, and sacred living.',
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(() => db.getBlogs());

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      })
      .catch((err) => console.warn('Could not fetch live blogs, using local cache:', err));
  }, []);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Vedic Wisdom Journal</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#C8822A',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Sacred Knowledge & Ritual Guides
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.75rem', margin: '0 0 16px', color: '#1C1917' }}>
            The Gandhashastra Journal
          </h1>
          <p style={{ color: '#6B635B', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Authentic insights into ancient Vedic aroma treatises, temple traditions, and health-conscious spiritual rituals for contemporary Indian households.
          </p>
        </div>

        {/* Featured Article (First Blog) */}
        {blogs.length > 0 && (
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              border: '1px solid #EAE3D6',
              overflow: 'hidden',
              marginBottom: '48px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
            }}
          >
            <div style={{ position: 'relative', minHeight: '340px' }}>
              <img
                src={blogs[0].coverImage}
                alt={blogs[0].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: '#C8822A',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '6px 12px',
                  borderRadius: '20px',
                }}
              >
                Featured Essay
              </span>
            </div>

            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#78716C', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {formatDate(blogs[0].publishedAt)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} /> {blogs[0].authorName}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.75rem',
                  lineHeight: 1.3,
                  color: '#1C1917',
                  marginBottom: '16px',
                }}
              >
                <Link
                  href={`/blogs/${blogs[0].slug}`}
                  style={{ color: '#1C1917', textDecoration: 'none' }}
                >
                  {blogs[0].title}
                </Link>
              </h2>

              <p style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {blogs[0].excerpt}
              </p>

              <div>
                <Link
                  href={`/blogs/${blogs[0].slug}`}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}
                >
                  Read Full Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {blogs.slice(1).map((blog) => (
            <article
              key={blog.id}
              style={{
                backgroundColor: '#FFF',
                borderRadius: '14px',
                border: '1px solid #EAE3D6',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#78716C', marginBottom: '8px' }}>
                  <span style={{ color: '#C8822A', fontWeight: 600 }}>{blog.category}</span>
                  <span>•</span>
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>

                <h3
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '1.25rem',
                    color: '#1C1917',
                    lineHeight: 1.4,
                    marginBottom: '10px',
                    flex: '0 0 auto',
                  }}
                >
                  <Link
                    href={`/blogs/${blog.slug}`}
                    style={{ color: '#1C1917', textDecoration: 'none' }}
                  >
                    {blog.title}
                  </Link>
                </h3>

                <p style={{ color: '#6B635B', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  {blog.excerpt}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #F5F1EB',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> {blog.authorName}
                  </span>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#C8822A',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Read More &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
