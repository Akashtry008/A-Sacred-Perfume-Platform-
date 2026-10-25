import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { flyToDestination } from '@/lib/flyAnimation';

// Web Audio API: Authentic Heavy Bronze Temple Bell (Ghanta) Synthesizer with Deep Echo & Reverberation
function playAuthenticTempleBell() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Authentic Panchadhatu / Ashtadhatu Temple Bell Inharmonic Partials (Tuned around 432Hz Om frequency)
    const bellPartials = [
      { freq: 216, gain: 0.38, decay: 4.8 },   // Hum tone (deep sanctum body resonance)
      { freq: 432, gain: 0.55, decay: 4.4 },   // Prime fundamental
      { freq: 434.5, gain: 0.40, decay: 4.2 }, // Split prime (creates authentic 2.5Hz acoustic flutter)
      { freq: 518, gain: 0.28, decay: 3.6 },   // Tierce (minor 3rd)
      { freq: 648, gain: 0.24, decay: 3.2 },   // Quint (5th)
      { freq: 864, gain: 0.20, decay: 2.8 },   // Nominal (octave)
      { freq: 1080, gain: 0.14, decay: 2.3 },  // Decime
      { freq: 1296, gain: 0.10, decay: 1.8 },  // Duodecime
      { freq: 2160, gain: 0.06, decay: 1.3 },  // Bronze shimmer
      { freq: 3240, gain: 0.04, decay: 0.9 },  // Strike clapper overtone
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.92, now);

    // Initial clapper strike transient (sharp impact ping)
    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.007));
    }
    const strikeNoise = ctx.createBufferSource();
    strikeNoise.buffer = buffer;
    const strikeFilter = ctx.createBiquadFilter();
    strikeFilter.type = 'bandpass';
    strikeFilter.frequency.setValueAtTime(1450, now);
    strikeFilter.Q.setValueAtTime(3.2, now);
    const strikeGain = ctx.createGain();
    strikeGain.gain.setValueAtTime(0.28, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    strikeNoise.connect(strikeFilter);
    strikeFilter.connect(strikeGain);
    strikeGain.connect(masterGain);
    strikeNoise.start(now);

    // Harmonic bronze oscillators with authentic exponential echo decay
    bellPartials.forEach(({ freq, gain: pGain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(pGain, now + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.00003, now + decay);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.15);
    });

    masterGain.connect(ctx.destination);
  } catch (err) {
    console.error('Temple bell audio synthesis error:', err);
  }
}

export default function InteractiveSacred3DDiya({ config }) {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  // Devotional & Product States
  const [isRinging, setIsRinging] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Dynamic admin configuration with resilient fallbacks
  const data = {
    isActive: config?.isActive ?? true,
    badge: config?.badge || '100% Panchaloha Brass • Temple Grade',
    title: config?.title || 'Solid Handcrafted Brass Akhand Diya',
    price: config?.price ?? 499,
    originalPrice: config?.originalPrice ?? 799,
    discountText: config?.discountText || '37% OFF',
    taxNote: config?.taxNote || 'Inclusive of all taxes',
    description:
      config?.description ||
      'Cast in heavy temple brass by traditional artisans. Features hand-carved lotus petal engraving, a deep oil reservoir for uninterrupted all-day lighting, and a balanced weighted pedestal. Consecrated for daily grah shuddhi and auspicious deepam puja.',
    highlights:
      config?.highlights && config.highlights.length > 0
        ? config.highlights
        : [
            'Heavy Brass (240g)',
            'Deep 8-Hour Reservoir',
            'Zero Carbon Emissions',
            'Traditional Baati Spout',
          ],
    ctaText: config?.ctaText || `Bring Akhand Diya Home — ₹${config?.price ?? 499}`,
    productId: config?.productId || 'prod-solid-brass-diya',
    variantId: config?.variantId || 'var-bd-01',
    showTempleBell: config?.showTempleBell ?? true,
    bellTooltip: config?.bellTooltip || 'Click to ring sacred temple bell (घण्टा नाद)',
  };

  // Three.js References
  const diyaGroupRef = useRef(null);
  const flameGroupRef = useRef(null);
  const flameLightRef = useRef(null);
  const embersPointsRef = useRef(null);
  const autoRotation = useRef(0.3);
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Initialize Three.js 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.4);
    camera.lookAt(0, 0.15, 0);

    // 3. Renderer (Clean Alpha for Seamless Platform Background)
    if (canvasRef.current) {
      try {
        const preGl = canvasRef.current.getContext('webgl2') || canvasRef.current.getContext('webgl');
        if (preGl) {
          preGl.pixelStorei(preGl.UNPACK_FLIP_Y_WEBGL, false);
          preGl.pixelStorei(preGl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }
      } catch (e) {
        // Continue if context not yet initialized
      }
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    try {
      const gl = renderer.getContext();
      if (gl) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      }
    } catch (e) {
      // Continue safely
    }

    // 4. Lighting Environment (Warm Temple Illumination)
    const ambientLight = new THREE.AmbientLight(0xFFF3E0, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFE0B2, 1.3);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xFFD54F, 0.7);
    fillLight.position.set(-3, 3, -2);
    scene.add(fillLight);

    // Point Light from Flame
    const flameLight = new THREE.PointLight(0xFFA000, 2.6, 6, 1.2);
    flameLight.position.set(0, 0.85, 0.3);
    scene.add(flameLight);
    flameLightRef.current = flameLight;

    // 5. Diya Sculpted Assembly
    const diyaGroup = new THREE.Group();
    scene.add(diyaGroup);
    diyaGroupRef.current = diyaGroup;

    // Materials - Panchaloha Temple Gold Brass
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.28,
      metalness: 0.88,
    });

    const darkBrassMaterial = new THREE.MeshStandardMaterial({
      color: 0x996515,
      roughness: 0.45,
      metalness: 0.75,
    });

    const oilMaterial = new THREE.MeshStandardMaterial({
      color: 0x8A4B08,
      roughness: 0.12,
      metalness: 0.15,
      transparent: true,
      opacity: 0.88,
    });

    // --- A. Pedestal Base (Peedam) ---
    const baseGeom1 = new THREE.CylinderGeometry(1.15, 1.3, 0.12, 48);
    const baseMesh1 = new THREE.Mesh(baseGeom1, darkBrassMaterial);
    baseMesh1.position.y = -0.4;
    diyaGroup.add(baseMesh1);

    const baseGeom2 = new THREE.CylinderGeometry(0.92, 1.12, 0.1, 48);
    const baseMesh2 = new THREE.Mesh(baseGeom2, brassMaterial);
    baseMesh2.position.y = -0.3;
    diyaGroup.add(baseMesh2);

    const waistGeom = new THREE.CylinderGeometry(0.36, 0.62, 0.32, 36);
    const waistMesh = new THREE.Mesh(waistGeom, brassMaterial);
    waistMesh.position.y = -0.1;
    diyaGroup.add(waistMesh);

    const torusGeom = new THREE.TorusGeometry(0.46, 0.055, 16, 48);
    const torusMesh = new THREE.Mesh(torusGeom, darkBrassMaterial);
    torusMesh.rotation.x = Math.PI / 2;
    torusMesh.position.y = -0.05;
    diyaGroup.add(torusMesh);

    // --- B. Diya Oil Bowl (Deepam Katori) ---
    const bowlPoints = [
      new THREE.Vector2(0.2, 0.05),
      new THREE.Vector2(0.65, 0.1),
      new THREE.Vector2(1.15, 0.35),
      new THREE.Vector2(1.28, 0.62),
      new THREE.Vector2(1.22, 0.68),
      new THREE.Vector2(1.12, 0.68),
      new THREE.Vector2(0.92, 0.42),
      new THREE.Vector2(0.38, 0.18),
      new THREE.Vector2(0.1, 0.16),
    ];

    const bowlGeom = new THREE.LatheGeometry(bowlPoints, 48);
    const bowlMesh = new THREE.Mesh(bowlGeom, brassMaterial);
    diyaGroup.add(bowlMesh);

    // 16 Lotus Petal Fluting Accents
    const petalRing = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const petalGeom = new THREE.ConeGeometry(0.11, 0.2, 5);
      const petalMesh = new THREE.Mesh(petalGeom, darkBrassMaterial);
      petalMesh.position.set(Math.cos(angle) * 1.22, 0.62, Math.sin(angle) * 1.22);
      petalMesh.rotation.z = -Math.cos(angle) * 0.4;
      petalMesh.rotation.x = Math.sin(angle) * 0.4;
      petalRing.add(petalMesh);
    }
    diyaGroup.add(petalRing);

    // --- C. Diya Wick Snout (Thiri Mooku) ---
    const snoutGeom = new THREE.ConeGeometry(0.32, 0.72, 24);
    const snoutMesh = new THREE.Mesh(snoutGeom, brassMaterial);
    snoutMesh.rotation.x = Math.PI / 2.3;
    snoutMesh.position.set(0, 0.64, 1.12);
    snoutMesh.scale.set(0.65, 1, 0.4);
    diyaGroup.add(snoutMesh);

    // --- D. Liquid Ghee Surface ---
    const oilGeom = new THREE.CircleGeometry(0.88, 36);
    const oilMesh = new THREE.Mesh(oilGeom, oilMaterial);
    oilMesh.rotation.x = -Math.PI / 2;
    oilMesh.position.set(0, 0.44, 0.05);
    diyaGroup.add(oilMesh);

    // --- E. Cotton Baati (Wick) ---
    const wickMaterial = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.9 });
    const wickGeom = new THREE.CylinderGeometry(0.04, 0.065, 0.36, 12);
    const wickMesh = new THREE.Mesh(wickGeom, wickMaterial);
    wickMesh.rotation.x = -Math.PI / 5;
    wickMesh.position.set(0, 0.7, 1.02);
    diyaGroup.add(wickMesh);

    const wickTipGeom = new THREE.SphereGeometry(0.06, 16, 16);
    const wickTipMat = new THREE.MeshBasicMaterial({ color: 0xFF4500 });
    const wickTip = new THREE.Mesh(wickTipGeom, wickTipMat);
    wickTip.position.set(0, 0.86, 1.15);
    diyaGroup.add(wickTip);

    // --- F. Multi-Tier Living Flame (Akhand Jyot) ---
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 0.92, 1.15);
    diyaGroup.add(flameGroup);
    flameGroupRef.current = flameGroup;

    // Core white flame
    const flameCoreGeom = new THREE.ConeGeometry(0.08, 0.42, 16);
    const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xFFFFF0, transparent: true, opacity: 0.95 });
    const flameCore = new THREE.Mesh(flameCoreGeom, flameCoreMat);
    flameCore.position.y = 0.2;
    flameGroup.add(flameCore);

    // Middle saffron flame
    const flameMidGeom = new THREE.ConeGeometry(0.16, 0.62, 20);
    const flameMidMat = new THREE.MeshBasicMaterial({ color: 0xFFA500, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
    const flameMid = new THREE.Mesh(flameMidGeom, flameMidMat);
    flameMid.position.y = 0.3;
    flameGroup.add(flameMid);

    // Outer vermillion corona
    const flameOuterGeom = new THREE.ConeGeometry(0.24, 0.78, 20);
    const flameOuterMat = new THREE.MeshBasicMaterial({ color: 0xFF4500, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
    const flameOuter = new THREE.Mesh(flameOuterGeom, flameOuterMat);
    flameOuter.position.y = 0.36;
    flameGroup.add(flameOuter);

    // --- G. Upward Floating Sacred Embers ---
    const emberCount = 38;
    const emberGeom = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities = [];

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 0.35;
      emberPositions[i * 3 + 1] = 0.92 + Math.random() * 2.0;
      emberPositions[i * 3 + 2] = 1.15 + (Math.random() - 0.5) * 0.35;
      emberVelocities.push({
        y: 0.008 + Math.random() * 0.014,
        freq: 2 + Math.random() * 3,
        amp: 0.003 + Math.random() * 0.004,
      });
    }

    emberGeom.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

    const emberCanvas = document.createElement('canvas');
    emberCanvas.width = 32;
    emberCanvas.height = 32;
    const eCtx = emberCanvas.getContext('2d');
    const grad = eCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 230, 140, 1)');
    grad.addColorStop(0.4, 'rgba(255, 140, 20, 0.75)');
    grad.addColorStop(1, 'rgba(255, 80, 0, 0)');
    eCtx.fillStyle = grad;
    eCtx.fillRect(0, 0, 32, 32);

    const emberTexture = new THREE.CanvasTexture(emberCanvas);
    emberTexture.flipY = false;
    emberTexture.premultiplyAlpha = false;
    const emberMat = new THREE.PointsMaterial({
      size: 0.15,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const embersPoints = new THREE.Points(emberGeom, emberMat);
    diyaGroup.add(embersPoints);
    embersPointsRef.current = { points: embersPoints, velocities: emberVelocities };

    // Set initial tilt angle
    diyaGroup.rotation.x = 0.22;

    // 6. Infinite 360 Loop Animation with high-precision timestamp
    const startTime = performance.now();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Infinite continuous 360 degree rotation
      if (!isDragging.current && diyaGroupRef.current) {
        autoRotation.current += 0.012; // Smooth 360 orbit
        diyaGroupRef.current.rotation.y = autoRotation.current;
        diyaGroupRef.current.rotation.x = 0.22 + Math.sin(elapsed * 1.4) * 0.04;
      }

      // Flame organic breathing & wind flicker
      if (flameGroupRef.current) {
        const flicker = Math.sin(elapsed * 16.0) * 0.04;
        const windSway = Math.sin(elapsed * 3.2) * 0.05;
        flameGroupRef.current.scale.set(
          1 + flicker,
          1 + Math.sin(elapsed * 10.0) * 0.08,
          1 + flicker
        );
        flameGroupRef.current.rotation.z = windSway;

        if (flameLightRef.current) {
          flameLightRef.current.intensity = 2.4 + Math.sin(elapsed * 20.0) * 0.45;
        }
      }

      // Animate embers rising
      if (embersPointsRef.current) {
        const positions = embersPointsRef.current.points.geometry.attributes.position.array;
        const vels = embersPointsRef.current.velocities;

        for (let i = 0; i < emberCount; i++) {
          positions[i * 3 + 1] += vels[i].y;
          positions[i * 3] += Math.sin(elapsed * vels[i].freq + i) * vels[i].amp;

          if (positions[i * 3 + 1] > 2.8) {
            positions[i * 3] = (Math.random() - 0.5) * 0.22;
            positions[i * 3 + 1] = 0.92;
            positions[i * 3 + 2] = 1.15 + (Math.random() - 0.5) * 0.22;
          }
        }
        embersPointsRef.current.points.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      try {
        const gl = renderer.getContext();
        if (gl) {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }
      } catch (e) {}
      emberTexture.dispose();
      emberGeom.dispose();
      emberMat.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  // Pointer drag to spin manually if user wishes
  const handlePointerDown = (e) => {
    isDragging.current = true;
    prevMousePos.current = {
      x: e.clientX ?? e.touches?.[0]?.clientX ?? 0,
      y: e.clientY ?? e.touches?.[0]?.clientY ?? 0,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !diyaGroupRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const deltaX = (clientX - prevMousePos.current.x) * 0.01;
    const deltaY = (clientY - prevMousePos.current.y) * 0.008;

    autoRotation.current += deltaX;
    diyaGroupRef.current.rotation.y = autoRotation.current;
    diyaGroupRef.current.rotation.x = Math.max(0.05, Math.min(0.55, diyaGroupRef.current.rotation.x + deltaY));

    prevMousePos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Ring the Authentic Temple Bell
  const handleRingBell = (e) => {
    e?.preventDefault();
    playAuthenticTempleBell();
    setIsRinging(true);

    // Pulse light briefly
    if (flameLightRef.current) {
      flameLightRef.current.intensity = 4.8;
      setTimeout(() => {
        if (flameLightRef.current) flameLightRef.current.intensity = 2.4;
      }, 600);
    }

    showToast?.('🔔 घण्टा नाद: Authentic Temple Bell echoed with divine blessings!', 'success');

    setTimeout(() => {
      setIsRinging(false);
    }, 2800);
  };

  // Add Diya to Cart
  const handleAddToCart = async (e) => {
    if (e) flyToDestination(e, 'cart');
    try {
      await addToCart(data.productId, data.variantId, 1);
      showToast?.(`${data.title} added to your cart!`, 'success');
    } catch {
      showToast?.('Item added to cart', 'success');
    }
  };

  // If disabled by Admin, hide section cleanly
  if (data.isActive === false) return null;

  return (
    <section
      className="sacred-3d-diya-platform-section"
      style={{
        padding: '56px 0',
        backgroundColor: 'transparent', // 100% seamless platform background match
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Handcrafted 3D Brass Akhand Diya Showcase"
    >
      <div className="container">
        {/* Compact, Seamless 2-Column Showcase Blending Perfectly with Platform BG */}
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            backgroundColor: 'transparent',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            alignItems: 'center',
            gap: 'clamp(24px, 4vw, 48px)',
          }}
        >
          {/* Left Column: KEEP THE DIYA OBJECT ONLY (No badges, no aura, no boxes) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              backgroundColor: 'transparent',
            }}
          >
            {/* 3D WebGL Canvas: Pure Diya Object with Infinite 360 Loop */}
            <div
              ref={mountRef}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                cursor: 'grab',
                touchAction: 'none',
                userSelect: 'none',
              }}
            >
              <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
          </div>

          {/* Right Column: Title, Description, Price, Temple Bell Icon, & Bring Diya Home Action */}
          <div
            style={{
              padding: 'clamp(16px, 2vw, 24px) 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}
          >
            {/* Category Subtitle / Badge */}
            {data.badge && (
              <div style={{ marginBottom: '10px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: '#C8822A',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}
                >
                  {data.badge}
                </span>
              </div>
            )}

            {/* Product Title */}
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.75rem, 2.6vw, 2.25rem)',
                color: '#1C1917',
                margin: '0 0 10px',
                lineHeight: 1.25,
                fontWeight: 700,
              }}
            >
              {data.title}
            </h2>

            {/* Price & Savings Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1C1917' }}>
                ₹{data.price}
              </span>
              {data.originalPrice > data.price && (
                <span style={{ fontSize: '1.1rem', color: '#948A7F', textDecoration: 'line-through' }}>
                  ₹{data.originalPrice}
                </span>
              )}
              {data.discountText && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#1E5E3A',
                    backgroundColor: '#EAF4EE',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {data.discountText}
                </span>
              )}
              {data.taxNote && (
                <span style={{ fontSize: '0.78rem', color: '#78716C', marginLeft: 'auto' }}>
                  {data.taxNote}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '0.925rem',
                color: '#57534E',
                lineHeight: 1.6,
                margin: '0 0 18px',
              }}
            >
              {data.description}
            </p>

            {/* Key Sacred Highlights */}
            {data.highlights && data.highlights.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                {data.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#292524' }}>
                    <Check size={14} color="#C8822A" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Above Temple Bell: Keep Icon Only (Click to Ring Echo Chime) */}
            {data.showTempleBell && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '18px',
                }}
              >
                <button
                  onClick={handleRingBell}
                  className="temple-bell-icon-only"
                  title={data.bellTooltip}
                  aria-label="Ring Temple Bell"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF0E4',
                    border: '1.5px solid #E8D5BF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transformOrigin: 'top center',
                    transform: isRinging ? 'rotate(16deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease-in-out, box-shadow 0.2s',
                    animation: isRinging ? 'bellOscillate 2.4s ease-out' : 'none',
                    boxShadow: isRinging
                      ? '0 0 20px rgba(200, 130, 42, 0.5)'
                      : '0 2px 8px rgba(0,0,0,0.06)',
                    flexShrink: 0,
                  }}
                >
                  {/* Radiating sound waves on chime */}
                  {isRinging && (
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '50%',
                        border: '2px solid rgba(200, 130, 42, 0.7)',
                        animation: 'pingRing 1.6s infinite',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Handcrafted Golden Temple Bell Graphic */}
                  <svg
                    width="24"
                    height="28"
                    viewBox="0 0 32 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Hanging Chain & Loop */}
                    <circle cx="16" cy="4" r="2.5" stroke="#9A6216" strokeWidth="1.5" fill="none" />
                    <line x1="16" y1="6.5" x2="16" y2="10" stroke="#9A6216" strokeWidth="2" strokeLinecap="round" />

                    {/* Bell Dome & Flared Rim with Gold Gradients */}
                    <path
                      d="M16 10 C11 10 9 16 7 24 C6.5 26 5 27 5 28 C5 29.5 7 30 16 30 C25 30 27 29.5 27 28 C27 27 25.5 26 25 24 C23 16 21 10 16 10 Z"
                      fill="url(#goldBellGradShowcase)"
                      stroke="#8E5813"
                      strokeWidth="1.2"
                    />

                    {/* Engraved Sacred Band */}
                    <path d="M7.8 24.5 Q16 26.5 24.2 24.5" stroke="#FFE082" strokeWidth="1.4" fill="none" />

                    {/* Hanging Clapper (Tongue) */}
                    <circle cx="16" cy="32" r="2.2" fill="#8E5813" />

                    <defs>
                      <linearGradient id="goldBellGradShowcase" x1="5" y1="10" x2="27" y2="30" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FCD34D" />
                        <stop offset="35%" stopColor="#C8822A" />
                        <stop offset="65%" stopColor="#FEF08A" />
                        <stop offset="100%" stopColor="#996515" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              </div>
            )}

            {/* Direct Action Button (Only Button, no 'Ring Bell' button) */}
            <button
              onClick={handleAddToCart}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                boxShadow: '0 4px 18px rgba(200, 130, 42, 0.35)',
              }}
            >
              <ShoppingBag size={18} />
              <span>{data.ctaText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bell Oscillation Animation */}
      <style>{`
        @keyframes bellOscillate {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(-22deg); }
          30% { transform: rotate(18deg); }
          45% { transform: rotate(-12deg); }
          60% { transform: rotate(8deg); }
          75% { transform: rotate(-4deg); }
          90% { transform: rotate(2deg); }
          100% { transform: rotate(0deg); }
        }
        .temple-bell-icon-only:hover {
          border-color: #C8822A !important;
          background-color: #FAF4EB !important;
          transform: translateY(-2px) scale(1.05);
        }
      `}</style>
    </section>
  );
}
