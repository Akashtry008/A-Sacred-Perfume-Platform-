import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useParams } from 'react-router-dom';
import { db } from '@/lib/db';
import { Calendar, User, ArrowLeft, Tag, Share2, Heart, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = db.getBlogBySlug(slug);

  if (!blog) {
    return { title: 'Article Not Found | VedaPavitra' };
  }

  return {
    title: `${blog.title} | VedaPavitra Journal`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [{ url: blog.coverImage }],
    },
  };
}

export default function BlogPostPage({ params }) {
  const routerParams = useParams();
  const slug = params?.slug || routerParams?.slug;
  const [blog, setBlog] = useState(() => db.getBlogBySlug(slug));
  const [isLoading, setIsLoading] = useState(!blog);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blogs/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.blog) {
          setBlog(data.blog);
        }
      })
      .catch((err) => console.warn('Could not fetch live article:', err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#1C1917' }}>Loading Sacred Article...</h2>
        <p style={{ color: '#78716C', marginTop: '8px' }}>Retrieving Vedic wisdom from temple archives...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#1C1917' }}>Article Not Found</h2>
        <p style={{ color: '#78716C', marginTop: '8px' }}>The requested shastra or guide could not be located.</p>
        <Link href="/blogs" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Return to Devotional Journal</Link>
      </div>
    );
  }

  const allBlogs = db.getBlogs();
  const relatedBlogs = allBlogs.filter((b) => (b.id !== blog.id && b.slug !== blog.slug)).slice(0, 2);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt;{' '}
          <Link href="/blogs" style={{ color: '#1C1917' }}>Journal</Link> &gt;{' '}
          <span>{blog.title}</span>
        </div>

        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#C8822A',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Back to all articles
          </Link>
        </div>

        {/* Article Header */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#C8822A',
                fontWeight: 600,
                backgroundColor: '#FAF0E4',
                padding: '4px 10px',
                borderRadius: '16px',
              }}
            >
              {blog.category}
            </span>
          </div>

          <h1
            className="heading-display"
            style={{ fontSize: '2.5rem', lineHeight: 1.25, color: '#1C1917', margin: '0 0 16px' }}
          >
            {blog.title}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '0.875rem',
              color: '#6B635B',
              paddingBottom: '20px',
              borderBottom: '1px solid #EAE3D6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="#C8822A" />
              <span>{blog.authorName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#C8822A" />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #EAE3D6',
          }}
        >
          <img
            src={blog.coverImage}
            alt={blog.title}
            style={{ width: '100%', maxHeight: '460px', objectFit: 'cover' }}
          />
        </div>

        {/* Article Body */}
        <article
          style={{
            backgroundColor: '#FFF',
            borderRadius: '16px',
            border: '1px solid #EAE3D6',
            padding: '48px 40px',
            lineHeight: 1.85,
            color: '#332E2B',
            fontSize: '1.05rem',
            marginBottom: '48px',
          }}
        >
          {/* Excerpt callout */}
          <div
            style={{
              backgroundColor: '#FAF7F2',
              borderLeft: '4px solid #C8822A',
              padding: '20px 24px',
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: '#44403C',
              marginBottom: '36px',
            }}
          >
            &ldquo;{blog.excerpt}&rdquo;
          </div>

          {/* Render article sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {blog.content.split('##').map((section, idx) => {
              if (!section.trim()) return null;
              if (idx === 0) {
                // Intro paragraphs
                const paragraphs = section.split('\n\n').filter((p) => p.trim() && !p.startsWith('# '));
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {paragraphs.map((para, pIdx) => (
                      <p key={pIdx} style={{ margin: 0 }}>
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                );
              }

              const lines = section.trim().split('\n');
              const heading = lines[0].trim();
              const contentLines = lines.slice(1).join('\n').trim();

              return (
                <div key={idx} style={{ marginTop: '16px' }}>
                  <h2
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.6rem',
                      color: '#1C1917',
                      marginBottom: '12px',
                      marginTop: 0,
                    }}
                  >
                    {heading}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {contentLines.split('\n\n').map((block, bIdx) => {
                      if (block.startsWith('- ')) {
                        return (
                          <ul key={bIdx} style={{ paddingLeft: '24px', margin: 0 }}>
                            {block.split('\n').map((li, lIdx) => (
                              <li key={lIdx} style={{ marginBottom: '6px' }}>
                                {li.replace(/^- /, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={bIdx} style={{ margin: 0 }}>
                          {block.trim()}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div
              style={{
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid #F5F1EB',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <Tag size={16} color="#78716C" />
              <span style={{ fontSize: '0.8125rem', color: '#78716C', marginRight: '4px' }}>Topics:</span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#F5F1EB',
                    color: '#57534E',
                    padding: '4px 10px',
                    borderRadius: '12px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sacred Offering CTA Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
            color: '#FAF7F2',
            borderRadius: '16px',
            padding: '36px',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
            border: '1px solid #C8822A40',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#FAF7F2', marginBottom: '8px' }}>
              Experience the Purity in Your Own Puja
            </h3>
            <p style={{ color: '#D6D3D1', fontSize: '0.875rem', margin: 0 }}>
              Upgrade your home sanctuary with 100% charcoal-free, bambooless Vedic incense handcrafted from real flowers and natural herbs.
            </p>
          </div>
          <Link
            href="/collections/bambooless-incense"
            className="btn btn-primary"
            style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}
          >
            Explore Sacred Agarbatti
          </Link>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1C1917', marginBottom: '20px' }}>
              Further Vedic Readings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.slug}`}
                  style={{
                    textDecoration: 'none',
                    backgroundColor: '#FFF',
                    borderRadius: '12px',
                    border: '1px solid #EAE3D6',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '20px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#C8822A', fontWeight: 600 }}>{rel.category}</span>
                    <h4 style={{ fontSize: '1.05rem', color: '#1C1917', margin: '6px 0 8px', lineHeight: 1.4 }}>
                      {rel.title}
                    </h4>
                    <span style={{ fontSize: '0.8125rem', color: '#C8822A', fontWeight: 600 }}>
                      Read essay &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
