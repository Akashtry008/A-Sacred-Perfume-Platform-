import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Sparkles,
  RefreshCw,
  FileText,
  Tag,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { formatDate } from '@/lib/utils';

const CATEGORY_OPTIONS = [
  'Vedic Shastras',
  'Gandhashastra',
  'Pooja Vidhi & Rituals',
  'Spiritual Wellness',
  'Auspicious Festivals & Muhurats',
  'Gau Seva & Purity',
];

const DEFAULT_AUTHORS = [
  'Pandit Devendra Vidhyalankar',
  'Dr. Anuradha Sharma (BAMS)',
  'Acharya Ramananda Shastri',
  'VedaPavitra Research Council',
];

export default function AdminBlogsPage() {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Vedic Shastras',
    authorName: 'Pandit Devendra Vidhyalankar',
    readingTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    excerpt: '',
    content: '',
    tags: 'Bambooless, Agarbatti, Pooja Vidhi',
    isPublished: true,
  });

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch blogs from live API
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      } else {
        // Fallback to public API
        const fallbackRes = await fetch('/api/blogs?all=true');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setBlogs(fallbackData.blogs || []);
        }
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      showToast?.('Unable to load articles from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filtered Articles
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'PUBLISHED' && b.isPublished) ||
      (selectedStatus === 'DRAFT' && !b.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentBlogId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Vedic Shastras',
      authorName: 'Pandit Devendra Vidhyalankar',
      readingTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      excerpt: '',
      content: '',
      tags: 'Bambooless, Agarbatti, Pooja Vidhi',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (blog) => {
    setIsEditing(true);
    setCurrentBlogId(blog.id || blog._id);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Vedic Shastras',
      authorName: blog.authorName || 'Pandit Devendra Vidhyalankar',
      readingTime: blog.readingTime || '5 min read',
      coverImage: blog.coverImage || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
      isPublished: blog.isPublished ?? true,
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug when title changes (if in create mode)
  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, title: val, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  // Save (Create or Update)
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast?.('Please enter an article title', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      let res;
      if (isEditing && currentBlogId) {
        res = await fetch(`/api/admin/blogs/${currentBlogId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showToast?.(
          isEditing
            ? 'Article updated successfully in sacred journal!'
            : 'New article published to Vedic Wisdom Journal!',
          'success'
        );
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        const err = await res.json();
        showToast?.(err.detail || 'Failed to save article', 'error');
      }
    } catch (err) {
      console.error('Save article error:', err);
      showToast?.('Server error while saving article', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Publish Status
  const handleTogglePublish = async (blog) => {
    const newStatus = !blog.isPublished;
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id || blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (res.ok) {
        showToast?.(
          newStatus ? 'Article is now Live on Storefront' : 'Article moved to Drafts',
          'success'
        );
        setBlogs((prev) =>
          prev.map((b) => ((b.id || b._id) === (blog.id || blog._id) ? { ...b, isPublished: newStatus } : b))
        );
      } else {
        showToast?.('Failed to update status', 'error');
      }
    } catch (err) {
      showToast?.('Error toggling publication status', 'error');
    }
  };

  // Confirm Delete
  const handleDeleteBlog = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${deleteTarget.id || deleteTarget._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast?.('Article deleted permanently from database', 'info');
        setBlogs((prev) => prev.filter((b) => (b.id || b._id) !== (deleteTarget.id || deleteTarget._id)));
        setDeleteTarget(null);
      } else {
        showToast?.('Failed to delete article', 'error');
      }
    } catch (err) {
      showToast?.('Server error during deletion', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats calculation
  const totalArticles = blogs.length;
  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const draftCount = totalArticles - publishedCount;
  const uniqueCategories = new Set(blogs.map((b) => b.category)).size;

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8822A', marginBottom: '4px' }}>
            <BookOpen size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              VedaPavitra Shastras & Knowledge Portal
            </span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', color: '#1C1917', margin: 0 }}>
            Sacred Articles & Devotional Journal CMS
          </h1>
          <p style={{ color: '#78716C', fontSize: '0.9rem', margin: '6px 0 0' }}>
            Publish essays on Gandhashastra, Vedic rituals, festival timings, and pure bambooless incense philosophy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchBlogs}
            disabled={isLoading}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFF',
              border: '1px solid #D6D3D1',
              color: '#44403C',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin-icon' : ''} />
            Refresh
          </button>

          <button
            onClick={handleOpenCreate}
            id="admin-create-blog-btn"
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(200, 130, 42, 0.35)',
            }}
          >
            <Plus size={18} />
            Write Sacred Article
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #E7E5E4',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#78716C', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Articles
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C1917', marginTop: '4px' }}>
            {totalArticles}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#A8A29E', marginTop: '2px' }}>
            Across all Shastra disciplines
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #E7E5E4',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#15803D', textTransform: 'uppercase', fontWeight: 600 }}>
            Published & Live
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
            {publishedCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '2px' }}>
            Accessible to all devotees online
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #E7E5E4',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#C8822A', textTransform: 'uppercase', fontWeight: 600 }}>
            Drafts / In Review
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C8822A', marginTop: '4px' }}>
            {draftCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#A8A29E', marginTop: '2px' }}>
            Hidden from public storefront
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #E7E5E4',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#4F46E5', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Categories
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4F46E5', marginTop: '4px' }}>
            {uniqueCategories}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#A8A29E', marginTop: '2px' }}>
            Vedic & ritual guide topics
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          backgroundColor: '#FFF',
          border: '1px solid #E7E5E4',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 300px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F5F5F4',
              borderRadius: '8px',
              padding: '8px 12px',
              flex: 1,
            }}
          >
            <Search size={18} color="#78716C" />
            <input
              type="text"
              placeholder="Search by article title, author, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} color="#78716C" />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#78716C', fontWeight: 600 }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #D6D3D1',
                fontSize: '0.85rem',
                backgroundColor: '#FFF',
                outline: 'none',
              }}
            >
              <option value="ALL">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#78716C', fontWeight: 600 }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #D6D3D1',
                fontSize: '0.85rem',
                backgroundColor: '#FFF',
                outline: 'none',
              }}
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div
        style={{
          backgroundColor: '#FFF',
          borderRadius: '12px',
          border: '1px solid #E7E5E4',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#78716C' }}>
            <RefreshCw size={28} className="spin-icon" style={{ margin: '0 auto 12px' }} />
            <p>Loading sacred articles from MongoDB database...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#78716C' }}>
            <BookOpen size={36} color="#C8822A" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#1C1917', margin: '0 0 6px' }}>No Articles Found</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.88rem' }}>
              {searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL'
                ? 'Try adjusting your search criteria or filter options.'
                : 'Begin by writing your first authentic Vedic shastra article.'}
            </p>
            <button onClick={handleOpenCreate} className="btn btn-primary" style={{ padding: '8px 18px' }}>
              <Plus size={16} /> Write First Article
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FBF9F5', borderBottom: '1px solid #E7E5E4', color: '#57534E' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Article</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Author / Pandit</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Reading Time</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => {
                  const blogId = blog.id || blog._id;
                  return (
                    <tr
                      key={blogId}
                      style={{
                        borderBottom: '1px solid #F5F5F4',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FCFBF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Title & Thumbnail */}
                      <td style={{ padding: '14px 18px', maxWidth: '340px' }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <div
                            style={{
                              width: '64px',
                              height: '48px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              backgroundColor: '#E7E5E4',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={blog.coverImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80'}
                              alt={blog.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                color: '#1C1917',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {blog.title}
                            </div>
                            <div
                              style={{
                                fontSize: '0.78rem',
                                color: '#A8A29E',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginTop: '2px',
                              }}
                            >
                              /blogs/{blog.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#FAF0E4',
                            color: '#C8822A',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '16px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {blog.category || 'General'}
                        </span>
                      </td>

                      {/* Author */}
                      <td style={{ padding: '14px 18px', color: '#44403C' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} color="#78716C" />
                          <span>{blog.authorName || 'VedaPavitra Pandit'}</span>
                        </div>
                      </td>

                      {/* Reading Time */}
                      <td style={{ padding: '14px 18px', color: '#78716C' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="#A8A29E" />
                          <span>{blog.readingTime || '5 min read'}</span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td style={{ padding: '14px 18px' }}>
                        <button
                          onClick={() => handleTogglePublish(blog)}
                          title="Click to toggle publish status"
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '14px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: blog.isPublished ? '#DCFCE7' : '#F5F5F4',
                            color: blog.isPublished ? '#15803D' : '#78716C',
                          }}
                        >
                          {blog.isPublished ? (
                            <>
                              <CheckCircle2 size={12} /> Published
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} /> Draft
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {/* Live preview link */}
                          <Link
                            href={`/blogs/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on Devotional Journal"
                            style={{
                              padding: '6px',
                              color: '#78716C',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                            }}
                          >
                            <ExternalLink size={16} />
                          </Link>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(blog)}
                            title="Edit Article"
                            style={{
                              border: 'none',
                              backgroundColor: '#FAF7F2',
                              color: '#C8822A',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setDeleteTarget(blog)}
                            title="Delete Article"
                            style={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#EF4444',
                              padding: '6px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              border: '1px solid #E7E5E4',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E7E5E4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FAF7F2',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                  {isEditing ? 'Edit Sacred Shastra Article' : 'Draft New Vedic Journal Article'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#78716C' }}>
                  Provide authentic references and sacred guidance for devotees.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#78716C',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveBlog} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Vedic Science: Why Bamboo Sticks Should Never Be Burned in Agarbatti"
                  value={formData.title}
                  onChange={handleTitleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Slug & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                    URL Slug
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#F5F5F4',
                      border: '1px solid #D6D3D1',
                      borderRadius: '8px',
                      padding: '0 12px',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: '#78716C' }}>/blogs/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#FFF',
                    }}
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author & Reading Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                    Author / Pandit Name
                  </label>
                  <input
                    type="text"
                    list="author-suggestions"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  <datalist id="author-suggestions">
                    {DEFAULT_AUTHORS.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <ImageUploadField
                  label="Article Header / Cover Image"
                  recommendedWidth={1200}
                  recommendedHeight={800}
                  aspectRatioText="3:2 Landscape"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  helperText="Use authentic temple or puja imagery. High quality 1200x800 recommended."
                />
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                  Short Excerpt / Devotional Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="A concise 2-sentence summary introducing the spiritual essence of the article..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Full Article Content */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C1917' }}>
                    Article Body (Markdown Supported) *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#78716C' }}>
                    Supports # Heading, ## Subheading, - Bullets, **Bold**
                  </span>
                </div>
                <textarea
                  required
                  rows={10}
                  placeholder="# Enter sacred title&#10;&#10;Write the full scriptural guidance here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    outline: 'none',
                    fontFamily: 'Consolas, Monaco, monospace',
                  }}
                />
              </div>

              {/* Devotional Tags */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                  Spiritual Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Bambooless, Agarbatti, Pooja Vidhi, Gandhashastra, Havan"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Publish Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#FAF7F2',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid #EAE3D6',
                }}
              >
                <input
                  type="checkbox"
                  id="modal-publish-check"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#C8822A' }}
                />
                <label htmlFor="modal-publish-check" style={{ cursor: 'pointer', fontSize: '0.875rem', color: '#1C1917' }}>
                  <strong>Publish Live to Devotee Journal immediately</strong>
                  <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                    If unchecked, article will remain saved as an internal Draft.
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    backgroundColor: '#FFF',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(200, 130, 42, 0.4)',
                  }}
                >
                  {isSaving ? 'Sanctifying & Saving...' : isEditing ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '14px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#1C1917', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
              Delete Article?
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#78716C', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This
              action removes it from MongoDB and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  backgroundColor: '#FFF',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                Keep Article
              </button>
              <button
                onClick={handleDeleteBlog}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFF',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
