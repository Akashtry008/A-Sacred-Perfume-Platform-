import React, { useState, useRef } from 'react';
import { Video, UploadCloud, Trash2, CheckCircle2, AlertTriangle, Play, Pause, Film } from 'lucide-react';

/**
 * VideoUploadField
 * Reusable Admin video uploader with file size verification (e.g. 35MB limit),
 * format validation, instant video preview player, and URL/Upload toggle.
 */
export default function VideoUploadField({
  label = 'Product Hover Video (Optional)',
  value = '',
  onChange,
  maxSizeMB = 35,
  helperText = 'Allowed: MP4, WebM, MOV. Plays infinitely and automatically when devotees hover over this card.',
  required = false,
}) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadError('');

    // 1. Check file size
    if (file.size > maxSizeBytes) {
      const selectedMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`File size (${selectedMB} MB) exceeds specified limit of ${maxSizeMB} MB. Please compress or trim the video.`);
      return;
    }

    // 2. Check extension
    const allowed = ['.mp4', '.webm', '.mov', '.ogg', '.m4v'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      setUploadError(`Invalid video format (${ext}). Supported formats: MP4, WebM, MOV.`);
      return;
    }

    setFileDetails({
      name: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
    });

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with server status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.url) {
        onChange?.(data.url);
      } else {
        throw new Error(data.message || 'Server did not return a valid video URL');
      }
    } catch (err) {
      console.warn('Video upload error, saving local object fallback:', err);
      // Create local object URL for preview and inform user
      try {
        const localUrl = URL.createObjectURL(file);
        onChange?.(localUrl);
        setUploadError('Uploaded locally. For production deployment, ensure file is stored on CDN or /uploads.');
      } catch (e) {
        setUploadError(err.message || 'Failed to upload video file.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRemove = () => {
    onChange?.('');
    setUploadError('');
    setFileDetails(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Header with Title and Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#44403C', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Film size={15} color="#C8822A" />
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>

        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F5F5F4', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              padding: '3px 10px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'upload' ? '#FFF' : 'transparent',
              color: mode === 'upload' ? '#C8822A' : '#78716C',
              fontWeight: mode === 'upload' ? 600 : 400,
              boxShadow: mode === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              padding: '3px 10px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'url' ? '#FFF' : 'transparent',
              color: mode === 'url' ? '#C8822A' : '#78716C',
              fontWeight: mode === 'url' ? 600 : 400,
              boxShadow: mode === 'url' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Direct URL
          </button>
        </div>
      </div>

      {/* Upload Zone / URL Input */}
      {mode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #D6D3D1',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
            backgroundColor: '#FAFAF9',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C8822A')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#D6D3D1')}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/ogg"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />

          <UploadCloud size={24} style={{ color: '#C8822A', margin: '0 auto 6px' }} />
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1C1917' }}>
            {isUploading ? 'Uploading video to server...' : 'Click or Drag to Upload Video'}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#78716C', marginTop: '2px' }}>
            Max Size: <strong>{maxSizeMB} MB</strong> • Formats: MP4, WebM, MOV
          </div>
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="https://example.com/videos/mysore-chandan-flame.mp4"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #D6D3D1',
              fontSize: '0.85rem',
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#DC2626', fontSize: '0.775rem' }}>
          <AlertTriangle size={14} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Video Preview and Removal */}
      {value && (
        <div
          style={{
            marginTop: '12px',
            backgroundColor: '#1C1917',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#FAF7F2',
          }}
        >
          <div style={{ position: 'relative', width: '100px', height: '65px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#000', flexShrink: 0 }}>
            <video
              ref={videoRef}
              src={value}
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={togglePlay}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: 'none',
                color: '#FFF',
                cursor: 'pointer',
              }}
              aria-label="Play/Pause Video Preview"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.785rem', fontWeight: 600, color: '#FEF3C7', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#10B981" /> Video Active & Linked
            </div>
            <div style={{ fontSize: '0.72rem', color: '#A8A29E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value}
            </div>
            {fileDetails && (
              <div style={{ fontSize: '0.7rem', color: '#D4C9B8', marginTop: '2px' }}>
                Size: {fileDetails.sizeMB} MB
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRemove}
            style={{
              padding: '6px 10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#F87171',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Trash2 size={13} /> Remove Video
          </button>
        </div>
      )}

      {/* Helper notice */}
      <div style={{ fontSize: '0.725rem', color: '#78716C', marginTop: '6px' }}>
        {helperText}
      </div>
    </div>
  );
}
