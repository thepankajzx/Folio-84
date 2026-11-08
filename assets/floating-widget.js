/**
 * 3D Interactive AI Bot (DOVA - True Orange Edition)
 * Tailored for Pankaj's Portfolio (Folio-84)
 * 
 * Features:
 * - Full Procedural 3D Robot Mesh built with Three.js (Auto-loads from CDN)
 * - Brand Theme: Rich, saturated DEEP ORANGE (#FF3B00 / #FF4500) with clearcoat gloss
 * - Clean character: Badge/pill text removed, pure 3D robot floating seamlessly
 * - Viewport position: Docked higher above the Back-to-Top arrow (bottom: 86px; right: 22px)
 * - Compact footprint: 100px × 108px
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
  // 1. INJECT STYLESHEET FOR 3D BOT (COMPACT & SLEEK)
  // -------------------------------------------------------------
  const styleEl = document.createElement('style');
  styleEl.id = 'dova-orange-bot-styles';
  styleEl.textContent = `
    /* DOVA 3D Floating Character Container - Compact & Elevated */
    #dova-widget-container {
      position: fixed;
      bottom: 86px;
      right: 22px;
      width: 100px;
      height: 108px;
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
      filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5));
    }
    #dova-widget-container:active {
      cursor: grabbing;
      transform: scale(0.96);
    }
    #dova-canvas {
      width: 100px;
      height: 108px;
      display: block;
      pointer-events: auto;
    }

    @media (max-width: 480px) {
      #dova-widget-container {
        bottom: 80px;
        right: 14px;
        transform: scale(0.90);
        transform-origin: bottom right;
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
  function ensureDovaElements() {
    let container = document.getElementById("dova-widget-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "dova-widget-container";
      container.title = "3D AI Assistant (Drag anywhere, Click to chat)";
      container.innerHTML = `<canvas id="dova-canvas"></canvas>`;
      document.body.appendChild(container);
    } else {
      // Remove any lingering pill if present
      const pill = container.querySelector('.dova-badge-pill');
      if (pill) pill.remove();
    }
    return container;
  }

  // -------------------------------------------------------------
  // 4. THREE.JS 3D RIG & PROCEDURAL MESH (RICH DEEP ORANGE)
  // -------------------------------------------------------------
  let dovaTrigger360Spin = null;

  function initDovaThree(THREE) {
    const canvas = document.getElementById('dova-canvas');
    const container = document.getElementById('dova-widget-container');
    if (!canvas || !container) return;

    // Viewport with ample top headroom
    const width = 100;
    const height = 108;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.38, 10.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02; // Controlled exposure so orange doesn't wash out into yellow

    // Studio Lighting - warm, balanced intensities
    const ambientLight = new THREE.AmbientLight(0xfff0e6, 0.60);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ee, 1.15);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    // Deep fiery orange rim light
    const rimLight = new THREE.SpotLight(0xff3300, 3.0);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Rich orange upward bounce
    const bounceLight = new THREE.PointLight(0xff4500, 1.4, 12);
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
    // TRUE SATURATED ORANGE MATERIALS (#FF3B00 / #FF4500)
    // -----------------------------------------------------------
    const orangeChassisMat = new THREE.MeshPhysicalMaterial({
      color: 0xff3b00, // Deep, unmistakable brand orange
      emissive: 0x330b00,
      roughness: 0.20,
      metalness: 0.06,
      clearcoat: 0.90,
      clearcoatRoughness: 0.08
    });

    const accentOrangeMat = new THREE.MeshPhysicalMaterial({
      color: 0xff5500, // Rich warm orange accent (no yellow!)
      emissive: 0x3d0e00,
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 1.0
    });

    const darkMatteBlackMat = new THREE.MeshPhysicalMaterial({
      color: 0x181a20,
      roughness: 0.35,
      metalness: 0.30,
      clearcoat: 0.30
    });

    const screenBlackMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070c,
      roughness: 0.06,
      metalness: 0.10,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });

    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4d8e2,
      roughness: 0.24,
      metalness: 0.88
    });

    // Glowing Eye Canvas Textures
    function createEyeTexture(glow = '#ff4500', outer = '#ff2200') {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 125);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.50, '#ffffff');
      grad.addColorStop(0.72, glow);
      grad.addColorStop(0.92, outer + '77');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(128, 128, 125, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }

    function createHappyEyeTexture(glow = '#ff4500') {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = glow;
      ctx.shadowBlur = 28;
      ctx.lineWidth = 34;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(128, 155, 65, Math.PI * 1.15, Math.PI * 1.85, false);
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

    const antennaLight = new THREE.PointLight(0xff3b00, 0.8, 4);
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
      c.width = 1024; c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (chestLogoImg.complete && chestLogoImg.naturalWidth > 0) {
        const logoSize = 820;
        ctx.drawImage(chestLogoImg, (1024 - logoSize) / 2, (1024 - logoSize) / 2, logoSize, logoSize);
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

    // Pointer Tracking
    window.addEventListener('mousemove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);
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

        const w = dovaContainer.offsetWidth || 100;
        const h = dovaContainer.offsetHeight || 108;
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
        const w = dovaContainer.offsetWidth || 100;
        const h = dovaContainer.offsetHeight || 108;
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
    // THREE.JS INITIALIZATION WITH CDN AUTO-LOAD
    // -----------------------------------------------------------
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
