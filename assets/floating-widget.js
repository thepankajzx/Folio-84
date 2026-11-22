/**
 * 3D Interactive AI Bot (DOVA - True Brand Orange #FF4E00 Edition)
 * Tailored for Pankaj's Portfolio (Folio-84)
 * 
 * Features:
 * - Full Procedural 3D Robot Mesh built with Three.js (Auto-loads from CDN)
 * - True Brand Orange (#FF4E00) with LinearToneMapping to completely eliminate yellow hue shift
 * - Compact & delicate footprint (78px × 86px)
 * - Elevated docking (bottom: 104px; right: 26px) with 36px clearance above Back-to-Top arrow
 * - Non-overlapping layout: Copilot interface opens cleanly above the 3D bot
 * - Interactive Features:
 *   - Mouse-tracking gaze (eyes follow cursor)
 *   - Natural eyelid blinking cycles (every 2.5 - 4.5s)
 *   - Antenna spring inertia physics on drag & tilt
 *   - 360° Pirouette spin on click/tap with happy eyes and sound chirp
 *   - Drag-and-drop movement anywhere across viewport
 *   - Seamless trigger for website's existing Pankaj AI Copilot chat box (#agy-chat-box)
 * - 100% Transparent backdrop (zero boxy artifacts or ground shadows)
 */

(function () {
  'use strict';

  if (window.__DOVA_3D_BOT_INITIALIZED__) return;
  window.__DOVA_3D_BOT_INITIALIZED__ = true;

  // -------------------------------------------------------------
  // 1. INJECT STYLESHEET FOR 3D BOT (COMPACT & ELEVATED)
  // -------------------------------------------------------------
  const styleEl = document.createElement('style');
  styleEl.id = 'dova-orange-bot-styles';
  styleEl.textContent = `
    /* DOVA 3D Floating Character Container - Perfectly Coaxial Above Back-to-Top Arrow */
    #dova-widget-container {
      position: fixed;
      bottom: 84px;
      right: 7px;
      width: 78px;
      height: 86px;
      z-index: 999995;
      user-select: none;
      touch-action: none;
      cursor: grab;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: auto;
      filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45));
    }
    #dova-widget-container:active {
      cursor: grabbing;
      transform: scale(0.95);
    }
    #dova-canvas {
      width: 78px;
      height: 86px;
      display: block;
      pointer-events: auto;
    }

    @media (max-width: 480px) {
      #dova-widget-container {
        bottom: 80px;
        right: 7px;
        transform: scale(0.88);
        transform-origin: bottom center;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // -------------------------------------------------------------
  // 2. AUDIO SYNTHESIS CHIRPS (Web Audio API)
  // -------------------------------------------------------------
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playRobotChirp(type = 'happy') {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.035, now);

      if (type === 'happy') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(1080, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(1620, now + 0.24);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.33);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch (e) {
      // Audio context may be restricted before user interaction
    }
  }

  // -------------------------------------------------------------
  // 3. INJECT DOM ELEMENTS IF NOT IN HTML (CLEAN BOT ONLY)
  // -------------------------------------------------------------

  function getDovaMobileSVG() {
    return `
      <svg viewBox="0 0 78 86" width="78" height="86" fill="none" xmlns="http://www.w3.org/2000/svg" class="dova-svg-bot pointer-events-auto cursor-pointer" style="filter: drop-shadow(0 6px 14px rgba(255, 78, 0, 0.35));">
        <defs>
          <linearGradient id="dovaOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF6B2B" />
            <stop offset="100%" stop-color="#FF4E00" />
          </linearGradient>
          <linearGradient id="dovaDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E222D" />
            <stop offset="100%" stop-color="#080A0E" />
          </linearGradient>
          <filter id="dovaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Antenna Stalk & Glowing Core -->
        <line x1="39" y1="12" x2="39" y2="4" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="39" cy="3.5" r="3.2" fill="#FF4E00" stroke="#FFD700" stroke-width="0.8" />

        <!-- Head Chassis -->
        <rect x="15" y="11" width="48" height="40" rx="14" fill="url(#dovaOrangeGrad)" stroke="#FF8533" stroke-width="1.2" />
        <!-- Side Pods -->
        <rect x="11.5" y="24" width="4.5" height="14" rx="2.25" fill="#1E293B" stroke="#334155" stroke-width="0.8" />
        <rect x="62" y="24" width="4.5" height="14" rx="2.25" fill="#1E293B" stroke="#334155" stroke-width="0.8" />

        <!-- Visor Face Shield -->
        <rect x="20" y="17" width="38" height="26" rx="8" fill="url(#dovaDarkGrad)" stroke="#111827" stroke-width="1" />

        <!-- Vibrant Glowing Cyan Eyes -->
        <circle cx="30.5" cy="30" r="3.6" fill="#00F0FF" filter="url(#dovaGlow)" />
        <circle cx="47.5" cy="30" r="3.6" fill="#00F0FF" filter="url(#dovaGlow)" />

        <!-- Torso, Arms & Core Badge -->
        <rect x="22" y="52" width="34" height="22" rx="7" fill="url(#dovaOrangeGrad)" stroke="#FF7A00" stroke-width="1" />
        <rect x="31" y="57" width="16" height="12" rx="3.5" fill="#111827" />
        <circle cx="39" cy="63" r="2.8" fill="#00F0FF" filter="url(#dovaGlow)" />
        <rect x="13.5" y="54" width="7" height="16" rx="3.5" fill="#FF4E00" />
        <rect x="57.5" y="54" width="7" height="16" rx="3.5" fill="#FF4E00" />
      </svg>
    `;
  }

  function ensureDovaElements() {
    let container = document.getElementById("dova-widget-container");
    const isMobile = (window.innerWidth < 768) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    if (!container) {
      container = document.createElement("div");
      container.id = "dova-widget-container";
      container.title = "AI Assistant (Drag anywhere, Click to chat)";
      if (isMobile) {
        container.innerHTML = getDovaMobileSVG();
      } else {
        container.innerHTML = `<canvas id="dova-canvas"></canvas>`;
      }
      document.body.appendChild(container);
    } else {
      const pill = container.querySelector('.dova-badge-pill');
      if (pill) pill.remove();
      if (isMobile && !container.querySelector('.dova-svg-bot')) {
        container.innerHTML = getDovaMobileSVG();
      }
    }
    return container;
  }

  // -------------------------------------------------------------
  // 4. THREE.JS 3D RIG & PROCEDURAL MESH (TRUE BRAND ORANGE #FF4E00)
  // -------------------------------------------------------------
  let dovaTrigger360Spin = null;

  function initDovaThree(THREE) {
    const canvas = document.getElementById('dova-canvas');
    const container = document.getElementById('dova-widget-container');
    if (!canvas || !container) return;

    // Fast WebGL Capability & Software Fallback Check
    let glTest = null;
    try {
      glTest = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch (e) {}

    if (!glTest) {
      console.warn('[DOVA] WebGL not available, falling back to 0-CPU vector SVG');
      container.innerHTML = getDovaMobileSVG();
      return;
    }

    const dbgExt = glTest.getExtension('WEBGL_debug_renderer_info');
    if (dbgExt) {
      const rendStr = (glTest.getParameter(dbgExt.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
      const isSoftware = rendStr.includes('basic render') ||
                         rendStr.includes('swiftshader') ||
                         rendStr.includes('software') ||
                         rendStr.includes('llvmpipe');
      if (isSoftware) {
        console.info('[DOVA] Software WebGL detected (' + rendStr + '), falling back to vector SVG avatar for fluid 60fps performance');
        container.innerHTML = getDovaMobileSVG();
        return;
      }
    }

    // Viewport with generous top headroom and compact size
    const width = 78;
    const height = 86;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.38, 11.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.warn('[DOVA] WebGLRenderer creation failed, falling back to vector avatar:', err);
      container.innerHTML = getDovaMobileSVG();
      return;
    }

    // WebGL Context Loss & Restoration Handling
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('[DOVA] WebGL context lost. Gracefully falling back to vector SVG avatar');
      isLoopRunning = false;
      container.innerHTML = getDovaMobileSVG();
    }, false);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    // Linear tone mapping prevents the notorious ACES highlight shift to yellow
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Studio Lighting - warm balanced intensities
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.70);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0e8, 1.0);
    keyLight.position.set(3, 6, 4);
    scene.add(keyLight);

    // Deep fiery orange rim light
    const rimLight = new THREE.SpotLight(0xff3800, 2.8);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Rich orange upward bounce
    const bounceLight = new THREE.PointLight(0xff4e00, 1.5, 12);
    bounceLight.position.set(0, -3.5, 3);
    scene.add(bounceLight);

    // Rounded Box Geometry Helper
    function createRoundedBox(w, h, d, radius, smoothness = 8) {
      const shape = new THREE.Shape();
      const eps = 0.00001;
      const r = radius - eps;
      shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
      shape.absarc(eps, h - r * 2, eps, Math.PI, Math.PI / 2, true);
      shape.absarc(w - r * 2, h - r * 2, eps, Math.PI / 2, 0, true);
      shape.absarc(w - r * 2, eps, eps, 0, -Math.PI / 2, true);

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: d - radius * 2,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: r,
        bevelThickness: radius,
        curveSegments: smoothness
      });
      geo.center();
      return geo;
    }

    // -----------------------------------------------------------
    // TRUE BRAND ORANGE MATERIALS (#FF4E00 - OPTIMIZED STANDARD SHADERS)
    // -----------------------------------------------------------
    const orangeChassisMat = new THREE.MeshStandardMaterial({
      color: 0xff4e00, // Exact brand orange
      emissive: 0x441200,
      roughness: 0.30,
      metalness: 0.12
    });

    const accentOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff3800, // Deep rich orange accent trim
      emissive: 0x330800,
      roughness: 0.25,
      metalness: 0.10
    });

    const darkMatteBlackMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.35,
      metalness: 0.25
    });

    const screenBlackMat = new THREE.MeshStandardMaterial({
      color: 0x05070c,
      roughness: 0.08,
      metalness: 0.15
    });

    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4d8e2,
      roughness: 0.24,
      metalness: 0.88
    });

    // Glowing Eye Canvas Textures (Optimized 128x128 resolution for 8px on-screen eye)
    function createEyeTexture(glow = '#ff4e00', outer = '#ff2200') {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 15, 64, 64, 62);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.50, '#ffffff');
      grad.addColorStop(0.72, glow);
      grad.addColorStop(0.92, outer + '77');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 62, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }

    function createHappyEyeTexture(glow = '#ff4e00') {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 128;
      const ctx = c.getContext('2d');
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = glow;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 17;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(64, 78, 32, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
      return new THREE.CanvasTexture(c);
    }

    const normalEyeTex = createEyeTexture();
    const happyEyeTex = createHappyEyeTexture();

    const leftEyeMat = new THREE.MeshBasicMaterial({ map: normalEyeTex, transparent: true, depthWrite: false });
    const rightEyeMat = new THREE.MeshBasicMaterial({ map: normalEyeTex, transparent: true, depthWrite: false });

    // Root Group
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // 1. HEAD GROUP
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.35, 0);
    robotRoot.add(headGroup);

    const headMesh = new THREE.Mesh(createRoundedBox(2.75, 2.15, 1.75, 0.48, 8), orangeChassisMat);
    headMesh.position.set(0, 0.85, 0);
    headGroup.add(headMesh);

    const bezelMesh = new THREE.Mesh(createRoundedBox(2.12, 1.54, 1.45, 0.32, 6), accentOrangeMat);
    bezelMesh.position.set(0, 0.85, 0.22);
    headGroup.add(bezelMesh);

    const screenMesh = new THREE.Mesh(createRoundedBox(1.92, 1.36, 1.25, 0.25, 6), screenBlackMat);
    screenMesh.position.set(0, 0.85, 0.34);
    headGroup.add(screenMesh);

    // Eyes Rig
    const eyesRig = new THREE.Group();
    eyesRig.position.set(0, 0.82, 0.985);
    headGroup.add(eyesRig);

    const eyeGeo = new THREE.PlaneGeometry(0.68, 0.68);
    const leftEye = new THREE.Mesh(eyeGeo, leftEyeMat);
    leftEye.position.set(-0.42, 0, 0);
    eyesRig.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, rightEyeMat);
    rightEye.position.set(0.42, 0, 0);
    eyesRig.add(rightEye);

    // Ears
    const earGeo = createRoundedBox(0.45, 0.86, 0.72, 0.2, 5);
    const leftEar = new THREE.Mesh(earGeo, darkMatteBlackMat);
    leftEar.position.set(-1.38, 0.82, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, darkMatteBlackMat);
    rightEar.position.set(1.38, 0.82, 0);
    headGroup.add(rightEar);

    // Antenna
    const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.24, 24), darkMatteBlackMat);
    antennaBase.position.set(0, 1.95, 0);
    headGroup.add(antennaBase);

    const antennaPivot = new THREE.Group();
    antennaPivot.position.set(0, 2.05, 0);
    headGroup.add(antennaPivot);

    const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.105, 0.48, 16), darkMatteBlackMat);
    antennaStem.position.set(0, 0.22, 0);
    antennaPivot.add(antennaStem);

    const bulbMat = orangeChassisMat.clone();
    const antennaBulb = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), bulbMat);
    antennaBulb.position.set(0, 0.62, 0);
    antennaPivot.add(antennaBulb);

    const antennaLight = new THREE.PointLight(0xff4e00, 0.8, 4);
    antennaLight.position.set(0, 0.62, 0);
    antennaPivot.add(antennaLight);

    // 2. TORSO & INJECTED CHEST LOGO
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.75, 0);
    robotRoot.add(torsoGroup);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 0.35, 24), darkMatteBlackMat);
    neckMesh.position.set(0, 0.98, 0);
    torsoGroup.add(neckMesh);

    const torsoGeo = createRoundedBox(1.62, 1.58, 1.26, 0.44, 8);
    const posAttr = torsoGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      if (y < 0) {
        const factor = 1 + (y / 1.58) * 0.26;
        posAttr.setX(i, posAttr.getX(i) * factor);
        posAttr.setZ(i, posAttr.getZ(i) * factor);
      }
    }
    torsoGeo.computeVertexNormals();

    const torsoMesh = new THREE.Mesh(torsoGeo, orangeChassisMat);
    torsoMesh.position.set(0, 0.12, 0);
    torsoGroup.add(torsoMesh);

    // Front Chest Decal Plane
    const frontBrandGeo = new THREE.PlaneGeometry(1.18, 1.02);
    const frontBrandMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const frontBrandMesh = new THREE.Mesh(frontBrandGeo, frontBrandMat);
    frontBrandMesh.position.set(0, 0.14, 0.638);
    torsoGroup.add(frontBrandMesh);

    // Injected Chest Logo (SVG clean render)
    const chestLogoImg = new Image();
    chestLogoImg.crossOrigin = 'anonymous';
    chestLogoImg.src = window.__DOVA_LOGO_URL__ || '/assets/dova-chest-logo.svg';
    chestLogoImg.onerror = function () {
      if (chestLogoImg.src !== '/assets/dova-chest-logo.svg') {
        chestLogoImg.src = '/assets/dova-chest-logo.svg';
      }
    };

    function updateChestTexture() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (chestLogoImg.complete && chestLogoImg.naturalWidth > 0) {
        const logoSize = 205;
        ctx.drawImage(chestLogoImg, (256 - logoSize) / 2, (256 - logoSize) / 2, logoSize, logoSize);
      }

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      if (frontBrandMat.map) frontBrandMat.map.dispose();
      frontBrandMat.map = tex;
      frontBrandMat.needsUpdate = true;
    }
    chestLogoImg.onload = updateChestTexture;
    updateChestTexture();

    // 3. ARTICULATED SEGMENTED ARMS
    function createArm(isLeft) {
      const side = isLeft ? -1 : 1;
      const shoulderPivot = new THREE.Group();
      shoulderPivot.position.set(side * 0.86, 0.24, 0.14);
      torsoGroup.add(shoulderPivot);

      const socketMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), darkMatteBlackMat);
      socketMesh.position.set(side * 0.04, 0, 0);
      shoulderPivot.add(socketMesh);

      const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.22, 0.42, 20), silverMetalMat);
      seg1.position.set(side * 0.25, -0.10, 0.04);
      seg1.rotation.z = side * 1.15;
      shoulderPivot.add(seg1);

      const elbowPivot = new THREE.Group();
      elbowPivot.position.set(side * 0.45, -0.19, 0.08);
      shoulderPivot.add(elbowPivot);

      const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.38, 20), silverMetalMat);
      seg2.position.set(side * 0.18, -0.12, 0.08);
      seg2.rotation.z = side * 0.88;
      elbowPivot.add(seg2);

      const wristPivot = new THREE.Group();
      wristPivot.position.set(side * 0.38, -0.26, 0.14);
      elbowPivot.add(wristPivot);

      const cuffGeo = new THREE.SphereGeometry(0.31, 20, 20);
      cuffGeo.scale(1.05, 0.82, 1.05);
      const cuffMesh = new THREE.Mesh(cuffGeo, darkMatteBlackMat);
      cuffMesh.rotation.z = side * 0.75;
      wristPivot.add(cuffMesh);

      const knuckleMesh = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 20), accentOrangeMat);
      knuckleMesh.position.set(side * 0.16, -0.15, 0.04);
      wristPivot.add(knuckleMesh);

      // Pincer Claws
      const clawGroup = new THREE.Group();
      clawGroup.position.set(side * 0.22, -0.22, 0.05);
      clawGroup.rotation.z = side * 0.65;
      wristPivot.add(clawGroup);

      function createPincerFinger(isUpper) {
        const fingerPivot = new THREE.Group();
        const dir = isUpper ? 1 : -1;
        const arcShape = new THREE.Shape();
        arcShape.absarc(0, 0, 0.28, 0, Math.PI * 0.72, false);
        arcShape.absarc(0, 0, 0.15, Math.PI * 0.72, 0, true);
        const fingerGeo = new THREE.ExtrudeGeometry(arcShape, { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 });
        fingerGeo.center();
        const fingerMesh = new THREE.Mesh(fingerGeo, silverMetalMat);
        fingerMesh.position.set(dir * 0.12, -0.14, 0);
        fingerMesh.rotation.z = dir === 1 ? -0.45 : 2.35;
        if (!isUpper) fingerMesh.scale.x = -1;
        fingerPivot.add(fingerMesh);
        return fingerPivot;
      }

      clawGroup.add(createPincerFinger(true));
      clawGroup.add(createPincerFinger(false));

      return { shoulder: shoulderPivot, elbow: elbowPivot, wrist: wristPivot, claw: clawGroup };
    }

    const leftArm = createArm(true);
    const rightArm = createArm(false);

    // -------------------------------------------------------------
    // ANIMATION LOOP, 360 SPIN & EYE BLINKING
    // -------------------------------------------------------------
    const clock = new THREE.Clock();
    const pointer = { x: 0, y: 0 };
    let currentAction = 'idle';
    let actionTimer = 0;

    // 360 Spin State
    let isSpinning = false;
    let spinProgress = 0;
    let spinStartYaw = 0;

    // Eye Blinking State Machine
    let blinkTimer = 0;
    let isBlinking = false;
    let nextBlinkInterval = 2.8;

    // Periodic Idle Animations State Machine (tilts head or spins every 7-9s)
    let idleActionTimer = 0;
    let nextIdleActionInterval = 7.5;

    // Antenna Spring Physics
    let antennaAngleX = 0, antennaAngleZ = 0;
    let antennaVelX = 0, antennaVelZ = 0;

    function trigger360Spin() {
      isSpinning = true;
      spinProgress = 0;
      spinStartYaw = robotRoot.rotation.y;
      currentAction = 'spin';
      actionTimer = 0;
      antennaVelZ += 0.55;
      leftEyeMat.map = happyEyeTex; leftEyeMat.needsUpdate = true;
      rightEyeMat.map = happyEyeTex; rightEyeMat.needsUpdate = true;
      playRobotChirp('happy');
    }

    dovaTrigger360Spin = trigger360Spin;
    window.__dovaTrigger360Spin = trigger360Spin;

    // Pointer Tracking with Idle Throttle Detection
    let lastUserActivity = performance.now();
    let lastRenderTime = 0;

    window.addEventListener('mousemove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      lastUserActivity = performance.now();
    }, { passive: true });

    let isPageHidden = false;
    let isLoopRunning = true;
    document.addEventListener('visibilitychange', () => {
      isPageHidden = document.hidden;
      if (!isPageHidden && !isLoopRunning) {
        isLoopRunning = true;
        lastUserActivity = performance.now();
        requestAnimationFrame(animate);
      }
    });

    let isScrollingFast = false;
    let scrollFastTimer = null;
    window.addEventListener('scroll', () => {
      isScrollingFast = true;
      lastUserActivity = performance.now();
      clearTimeout(scrollFastTimer);
      scrollFastTimer = setTimeout(() => {
        isScrollingFast = false;
      }, 120);
    }, { passive: true });

    function animate(currentTime) {
      if (isPageHidden) {
        isLoopRunning = false;
        return;
      }
      isLoopRunning = true;
      requestAnimationFrame(animate);

      // Skip heavy 3D rendering pass while user is rapidly scrolling page
      if (isScrollingFast) return;

      // Intelligent Idle Throttling: If idle for >4s, throttle to 30 FPS to preserve GPU
      const isIdle = !isSpinning && (performance.now() - lastUserActivity > 4000);
      if (isIdle && currentTime && (currentTime - lastRenderTime < 33)) {
        return;
      }
      lastRenderTime = currentTime || performance.now();
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // 1. Natural Floating Hover (zero ground shadow)
      const hoverY = Math.sin(t * 2.4) * 0.10;
      robotRoot.position.y = hoverY;

      // 2. Visible Natural Eye Blinking Cycles
      blinkTimer += dt;
      if (blinkTimer > nextBlinkInterval && !isBlinking && currentAction === 'idle') {
        isBlinking = true;
        blinkTimer = 0;
        nextBlinkInterval = 2.6 + Math.random() * 2.4;
      }
      if (isBlinking) {
        const blinkDuration = 0.22;
        const p = Math.min(blinkTimer / blinkDuration, 1.0);
        const scaleY = Math.max(0.06, 1.0 - Math.sin(p * Math.PI) * 0.94);
        leftEye.scale.y = scaleY;
        rightEye.scale.y = scaleY;
        if (p >= 1.0) {
          isBlinking = false;
          leftEye.scale.y = 1.0;
          rightEye.scale.y = 1.0;
          blinkTimer = 0;
        }
      } else if (currentAction === 'idle') {
        leftEye.scale.y = 1.0;
        rightEye.scale.y = 1.0;
      }

      // 3. Eye Pupil Tracking toward Pointer
      const targetEyeX = THREE.MathUtils.clamp(pointer.x * 0.16, -0.18, 0.18);
      const targetEyeY = THREE.MathUtils.clamp(pointer.y * 0.12, -0.14, 0.14);
      eyesRig.position.x = THREE.MathUtils.lerp(eyesRig.position.x, targetEyeX, 0.15);
      eyesRig.position.y = THREE.MathUtils.lerp(eyesRig.position.y, 0.82 + targetEyeY, 0.15);

      // 4. Spring Antenna Physics
      const stiffness = 0.18;
      const damping = 0.86;
      antennaVelX += (-antennaAngleX * stiffness);
      antennaVelZ += (-antennaAngleZ * stiffness);
      antennaVelX *= damping;
      antennaVelZ *= damping;
      antennaAngleX += antennaVelX;
      antennaAngleZ += antennaVelZ;
      antennaPivot.rotation.x = antennaAngleX + Math.cos(t * 3.2) * 0.04;
      antennaPivot.rotation.z = antennaAngleZ + Math.sin(t * 2.8) * 0.06;

      // 5. Periodic Idle Attention Animations (Tilts head or spins every 7-9s)
      idleActionTimer += dt;
      if (idleActionTimer > nextIdleActionInterval && currentAction === 'idle' && !isSpinning) {
        idleActionTimer = 0;
        nextIdleActionInterval = 7.0 + Math.random() * 4.0;
        if (Math.random() > 0.5) {
          currentAction = 'headTilt';
          actionTimer = 0;
          antennaVelZ += 0.4;
          playRobotChirp('chirp');
        } else {
          trigger360Spin();
        }
      }

      // Default Idle targets: ARMS REST CALMLY AT SIDES
      let targetHeadX = -pointer.y * 0.25 + Math.sin(t * 1.5) * 0.02;
      let targetHeadY = pointer.x * 0.42 + Math.cos(t * 1.1) * 0.03;
      let targetHeadZ = -pointer.x * 0.1;

      let targetTorsoX = -pointer.y * 0.08;
      let targetTorsoY = pointer.x * 0.18;
      let targetTorsoZ = 0;

      let lShoulderZ = 0;
      let rShoulderZ = 0;
      let rShoulderX = 0, rShoulderY = 0, rElbowX = 0, rElbowZ = 0;

      // 6. Action Handlers: 360 Spin & Head Tilt
      if (isSpinning) {
        spinProgress += dt * 1.8; // ~1.1s full 360 rotation
        if (spinProgress >= 1.0) {
          isSpinning = false;
          spinProgress = 1.0;
          currentAction = 'idle';
          robotRoot.rotation.y = (spinStartYaw + Math.PI * 2) % (Math.PI * 2);
          leftEyeMat.map = normalEyeTex; leftEyeMat.needsUpdate = true;
          rightEyeMat.map = normalEyeTex; rightEyeMat.needsUpdate = true;
        } else {
          const ease = spinProgress < 0.5 ? 2 * spinProgress * spinProgress : -1 + (4 - 2 * spinProgress) * spinProgress;
          robotRoot.rotation.y = spinStartYaw + Math.PI * 2 * ease;

          const armLift = Math.sin(spinProgress * Math.PI) * 0.45;
          lShoulderZ = -armLift;
          rShoulderZ = armLift;
        }
      } else if (currentAction === 'headTilt') {
        actionTimer += dt;
        if (actionTimer > 2.0) {
          currentAction = 'idle';
        } else {
          targetHeadZ = Math.sin(actionTimer * 4.2) * 0.24;
          targetHeadX = -0.12 + Math.sin(actionTimer * 6.0) * 0.10;
        }
      } else {
        robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0, 0.08);
      }

      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadX, 0.1);
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadY, 0.1);
      headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetHeadZ, 0.1);

      torsoGroup.rotation.x = THREE.MathUtils.lerp(torsoGroup.rotation.x, targetTorsoX, 0.08);
      torsoGroup.rotation.y = THREE.MathUtils.lerp(torsoGroup.rotation.y, targetTorsoY, 0.08);
      torsoGroup.rotation.z = THREE.MathUtils.lerp(torsoGroup.rotation.z, targetTorsoZ, 0.08);

      leftArm.shoulder.rotation.z = THREE.MathUtils.lerp(leftArm.shoulder.rotation.z, lShoulderZ, 0.12);
      rightArm.shoulder.rotation.x = THREE.MathUtils.lerp(rightArm.shoulder.rotation.x, rShoulderX, 0.12);
      rightArm.shoulder.rotation.y = THREE.MathUtils.lerp(rightArm.shoulder.rotation.y, rShoulderY, 0.12);
      rightArm.shoulder.rotation.z = THREE.MathUtils.lerp(rightArm.shoulder.rotation.z, rShoulderZ, 0.12);
      rightArm.elbow.rotation.x = THREE.MathUtils.lerp(rightArm.elbow.rotation.x, rElbowX, 0.12);
      rightArm.elbow.rotation.z = THREE.MathUtils.lerp(rightArm.elbow.rotation.z, rElbowZ, 0.12);

      renderer.render(scene, camera);
    }
    animate();

    window.__dovaAddAntennaInertia = (dx, dy) => {
      antennaVelX += dy * 0.015;
      antennaVelZ += dx * 0.015;
    };
  }

  // -------------------------------------------------------------
  // 5. DRAG ENGINE & TOGGLE EXISTING CHAT MODAL
  // -------------------------------------------------------------
  function initWidgetInteraction() {
    const dovaContainer = ensureDovaElements();

    function triggerSiteChatToggle(e) {
      if (e && e.stopPropagation) e.stopPropagation();

      // Trigger 360 spin
      if (dovaTrigger360Spin) dovaTrigger360Spin();

      // Check for global or existing chat handler
      if (typeof window.toggleAgyChat === 'function') {
        window.toggleAgyChat(e);
        return;
      }

      const box = document.getElementById("agy-chat-box");
      if (!box) return;

      if (box.classList.contains("agy-open")) {
        box.classList.remove("agy-open");
        box.classList.add("agy-closing");
        setTimeout(() => box.classList.remove("agy-closing"), 220);
      } else {
        box.classList.remove("agy-closing");
        box.classList.add("agy-open");
      }
    }

    // -----------------------------------------------------------
    // DRAGGABLE ENGINE (Moves 3D bot anywhere on screen)
    // -----------------------------------------------------------
    let isDragging = false;
    let hasMoved = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      const evt = e.touches ? e.touches[0] : e;
      isDragging = true;
      hasMoved = false;
      startX = evt.clientX;
      startY = evt.clientY;

      const rect = dovaContainer.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      dovaContainer.style.transition = 'none';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const evt = e.touches ? e.touches[0] : e;
      const dx = evt.clientX - startX;
      const dy = evt.clientY - startY;

      if (Math.hypot(dx, dy) > 5) {
        hasMoved = true;
        if (e.cancelable) e.preventDefault();

        if (window.__dovaAddAntennaInertia) {
          window.__dovaAddAntennaInertia(dx, dy);
        }

        const w = dovaContainer.offsetWidth || 78;
        const h = dovaContainer.offsetHeight || 86;
        const maxLeft = window.innerWidth - w - 8;
        const maxTop = window.innerHeight - h - 8;

        const clampedLeft = Math.max(8, Math.min(maxLeft, initialLeft + dx));
        const clampedTop = Math.max(8, Math.min(maxTop, initialTop + dy));

        dovaContainer.style.position = 'fixed';
        dovaContainer.style.left = clampedLeft + 'px';
        dovaContainer.style.top = clampedTop + 'px';
        dovaContainer.style.bottom = 'auto';
        dovaContainer.style.right = 'auto';
      }
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      dovaContainer.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

      if (!hasMoved) {
        // Clean tap/click -> 360 spin + toggle chat
        triggerSiteChatToggle(e);
      }
    }

    dovaContainer.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);

    dovaContainer.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
    document.addEventListener('touchcancel', onPointerUp);

    window.addEventListener('resize', () => {
      if (dovaContainer.style.left && dovaContainer.style.left !== 'auto') {
        const w = dovaContainer.offsetWidth || 78;
        const h = dovaContainer.offsetHeight || 86;
        const maxLeft = window.innerWidth - w - 8;
        const maxTop = window.innerHeight - h - 8;
        const curLeft = parseInt(dovaContainer.style.left, 10);
        const curTop = parseInt(dovaContainer.style.top, 10);
        if (curLeft > maxLeft) dovaContainer.style.left = maxLeft + 'px';
        if (curTop > maxTop) dovaContainer.style.top = maxTop + 'px';
      }
    });

    // Close when clicking outside chat window
    document.addEventListener("click", (e) => {
      const box = document.getElementById("agy-chat-box");
      if (box && box.classList.contains("agy-open") && !box.contains(e.target) && !dovaContainer.contains(e.target)) {
        box.classList.remove("agy-open");
        box.classList.add("agy-closing");
        setTimeout(() => box.classList.remove("agy-closing"), 220);
      }
    });

    // -----------------------------------------------------------
    // THREE.JS INITIALIZATION WITH CDN AUTO-LOAD (DESKTOP ONLY)
    // -----------------------------------------------------------
    const isMobile = (window.innerWidth < 768) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    if (isMobile) {
      // Mobile uses crisp SVG avatar: 0% CPU, 0% GPU, zero scroll lag
      return;
    }

    if (window.THREE) {
      initDovaThree(window.THREE);
    } else {
      const s = document.createElement('script');
      s.src = window.__THREE_JS_URL__ || 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = () => {
        if (window.THREE) initDovaThree(window.THREE);
      };
      s.onerror = () => {
        console.warn('Three.js failed to load from primary CDN');
      };
      document.head.appendChild(s);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidgetInteraction);
  } else {
    initWidgetInteraction();
  }
})();
