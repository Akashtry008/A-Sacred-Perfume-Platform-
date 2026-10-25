import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertTriangle, Trash2, ExternalLink, Loader2 } from 'lucide-react';

/**
 * ImageUploadField
 * Reusable Admin image uploader that specifies required fixed dimensions,
 * checks uploaded image resolution, and supports both direct device upload and URL paste.
 *
 * @param {string} label - Input label (e.g. "Product Image", "Hero Slide", "Brand Logo")
 * @param {number} recommendedWidth - Expected width in pixels (e.g. 800, 1920, 1000, 240)
 * @param {number} recommendedHeight - Expected height in pixels (e.g. 800, 800, 1000, 60)
 * @param {string} aspectRatioText - Aspect ratio description (e.g. "1:1 Square", "16:9 Widescreen")
 * @param {string} value - Current image URL
 * @param {function} onChange - Callback function(url)
 * @param {string} helperText - Optional advice (e.g. "Transparent PNG recommended")
 * @param {boolean} required - Whether image is required
 */
export default function ImageUploadField({
  label = 'Upload Image',
  recommendedWidth = 800,
  recommendedHeight = 800,
  aspectRatioText = '1:1 Square',
  value = '',
  onChange,
  helperText = '',
  required = false,
  previewHeight = 120,
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [detectedDims, setDetectedDims] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'

  // Measure dimensions of an image
  const inspectDimensions = (src) => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      setDetectedDims({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = src;
  };

  // Inspect existing value on initial load or change
  React.useEffect(() => {
    if (value) {
      inspectDimensions(value);
    } else {
      setDetectedDims(null);
    }
  }, [value]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadError('');
    setIsUploading(true);

    try {
      // 1. Measure local dimensions first
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = () => {
          setDetectedDims({ width: img.naturalWidth, height: img.naturalHeight });
          resolve();
        };
        img.onerror = () => resolve();
        img.src = objectUrl;
      });

      // 2. Upload to server via FormData
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.url) {
        onChange?.(data.url);
      } else {
        throw new Error(data.message || 'Server did not return image URL');
      }
    } catch (err) {
      console.warn('Direct upload error, attempting base64 fallback:', err);
      // Fallback: Convert to Base64 data URL so admin is never blocked
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const b64 = reader.result;
          // Try base64 endpoint
          try {
            const b64Res = await fetch('/api/admin/upload-base64', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: b64, filename: file.name }),
            });
            const b64Data = await b64Res.json();
            if (b64Data.success && b64Data.url) {
              onChange?.(b64Data.url);
              return;
            }
          } catch (e) {
            // If even that fails, save the data URL directly
            onChange?.(b64);
          }
        };
        reader.readAsDataURL(file);
      } catch (fallbackErr) {
        setUploadError('Failed to upload image. Please try entering a direct image URL.');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // Determine dimension match status
  const getDimensionStatus = () => {
    if (!detectedDims) return null;
    const { width: w, height: h } = detectedDims;

    const isExact = w === recommendedWidth && h === recommendedHeight;
    const targetRatio = recommendedWidth / recommendedHeight;
    const actualRatio = w / h;
    const ratioDiff = Math.abs(targetRatio - actualRatio);

    if (isExact) {
      return {
        type: 'exact',
        text: `✓ Exact Dimension: ${w} × ${h} px`,
        color: '#15803D',
        bg: '#DCFCE7',
      };
    }
    if (ratioDiff < 0.05) {
      return {
        type: 'match_ratio',
        text: `✓ Aspect Ratio Matched: ${w} × ${h} px (Scales cleanly to ${recommendedWidth}×${recommendedHeight})`,
        color: '#15803D',
        bg: '#DCFCE7',
      };
    }
    return {
      type: 'warning',
      text: `⚠️ Uploaded: ${w} × ${h} px (Target is ${recommendedWidth} × ${recommendedHeight} px)`,
      color: '#B45309',
      bg: '#FEF3C7',
    };
  };

  const dimStatus = getDimensionStatus();

  return (
    <div style={{ marginBottom: '14px' }}>
      {/* Header with Dimension Specification Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#292524', margin: 0 }}>
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>

        {/* Required Fixed Size Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#9B3828',
              backgroundColor: '#FAF0E4',
              border: '1px solid #F3DFC1',
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.02em',
            }}
          >
            📏 Fixed Size: {recommendedWidth} × {recommendedHeight} px ({aspectRatioText})
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setMode('upload')}
          style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: mode === 'upload' ? 700 : 500,
            backgroundColor: mode === 'upload' ? '#C8822A' : '#F5F5F4',
            color: mode === 'upload' ? '#FFF' : '#78716C',
            transition: 'all 0.15s ease',
          }}
        >
          Direct Device Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: mode === 'url' ? 700 : 500,
            backgroundColor: mode === 'url' ? '#C8822A' : '#F5F5F4',
            color: mode === 'url' ? '#FFF' : '#78716C',
            transition: 'all 0.15s ease',
          }}
        >
          Image URL / Link
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Device Upload Drag-and-Drop Box */}
      {mode === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging ? '2px dashed #C8822A' : '1.5px dashed #D6D3D1',
            backgroundColor: isDragging ? '#FFFBF5' : '#FAFAF9',
            borderRadius: '10px',
            padding: '16px 20px',
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
        >
          {isUploading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#C8822A' }}>
              <Loader2 size={20} className="animate-spin" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Uploading & optimizing image on server...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FAF0E4',
                  color: '#C8822A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadCloud size={20} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1C1917' }}>
                Click to browse device or drag image here
              </div>
              <div style={{ fontSize: '0.72rem', color: '#78716C' }}>
                Accepts PNG, JPG, WebP, SVG • Exact target: <strong>{recommendedWidth} × {recommendedHeight} px</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image URL Input */}
      {mode === 'url' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={`Paste image URL (e.g. /uploads/... or https://...)`}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #D6D3D1',
              fontSize: '0.85rem',
              backgroundColor: '#FFF',
            }}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange?.('')}
              className="btn btn-secondary"
              style={{ padding: '0 10px', fontSize: '0.8rem', color: '#DC2626' }}
              title="Clear Image"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px' }}>
          {uploadError}
        </div>
      )}

      {/* Live Preview & Verification Badge */}
      {value && (
        <div
          style={{
            marginTop: '8px',
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Thumbnail preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #D6D3D1',
                backgroundColor: '#F5F5F4',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={value}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#1C1917',
                  maxWidth: '240px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={value}
              >
                {value.startsWith('/uploads/') ? value.replace('/uploads/', '') : value.slice(0, 35) + '...'}
              </div>
              {/* Dimension Status Badge */}
              {dimStatus && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: dimStatus.color,
                    backgroundColor: dimStatus.bg,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    marginTop: '2px',
                  }}
                >
                  {dimStatus.text}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.75rem',
                color: '#C8822A',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#FAF0E4',
              }}
            >
              <ExternalLink size={13} /> View Full
            </a>
            <button
              type="button"
              onClick={() => onChange?.('')}
              style={{
                border: 'none',
                background: 'none',
                color: '#991B1B',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
              title="Remove image"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <div style={{ fontSize: '0.72rem', color: '#78716C', marginTop: '4px' }}>
          ℹ️ {helperText}
        </div>
      )}
    </div>
  );
}
