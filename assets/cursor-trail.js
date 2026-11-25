/**
 * =========================================================================
 * DEFINITE STUDIOS // ULTRA-FAST 120 FPS CURSOR SYMBOL EMITTER
 * =========================================================================
 * Ultra-responsive, zero-lag HTML5 Canvas particle engine with live Studio sync.
 * Decoupled mouse-tracking, 1x optimized rasterization, zero shadowBlur GPU penalty,
 * and an expanded 36+ premium geometric & creator glyph library.
 * Fully supports bi-directional presets & icons applied from /studio.
 * =========================================================================
 */
(function() {
    'use strict';

    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    // 36+ Curated Distinct Premium Symbols (Default Main Page Suite)
    const DEFAULT_SYMBOLS = [
        '✦', '✧', '★', '☆', '◆', '◇', '⬡', '⬢',
        '◈', '⟡', '⚡', '▶', '▲', '▼', '◀', '●',
        '◉', '◎', '✕', '✚', '↗', '↘', '➜', '➔',
        '⌘', '⌥', '※', '✶', '✸', '✹', '✺', '∞',
        '∆', '∇', '✓', '§'
    ];

    // Curated Graphic Design & Creator Suite Glyphs (Design tools, Bauhaus primitives, sparkles & vectors)
    const GRAPHICS_SYMBOLS = [
        '✦', '★', '⚡', '⟡', '◈', '◆', '⬡', '⬢',
        '✎', '✂', '✜', '✿', '※', '✶', '✹', '✺',
        '⌘', '⌥', '▲', '●', '■', '↗', '∞', '∆', '◎', '☆', '✧'
    ];

    // Dynamic resolution based on page context or explicit override
    function resolveSymbols() {
        if (typeof window !== 'undefined' && window.__CURSOR_SYMBOLS__ && Array.isArray(window.__CURSOR_SYMBOLS__)) {
            return window.__CURSOR_SYMBOLS__;
        }
        const isGraphics = typeof window !== 'undefined' && (
            (window.location && window.location.pathname && window.location.pathname.toLowerCase().includes('graphic')) ||
            (document.title && document.title.toLowerCase().includes('graphic')) ||
            (document.body && (document.body.classList.contains('graphics-vault') || document.body.dataset.cursorType === 'graphics')) ||
            (window.__CURSOR_MODE__ === 'graphics')
        );
        return isGraphics ? GRAPHICS_SYMBOLS : DEFAULT_SYMBOLS;
    }

    const SYMBOLS = resolveSymbols();

    // High-contrast vibrant brand palette
    const DEFAULT_PALETTE = [
        '#FF4E00', // Signature Electric Orange
        '#FF6B2B', // Vibrant Amber
        '#FFD700', // Cyber Gold
        '#A855F7', // Electric Violet
        '#06B6D4', // Cyan Spark
        '#FFFFFF'  // Frost White
    ];

    // Studio Configuration & Dynamic Custom Emitter State
    let activeConfig = null;
    let customSprites = []; // Array of Image objects from Studio
    let activePalette = [...DEFAULT_PALETTE];
    let customPhysics = {
        size: 13,
        gravity: 0,
        drift: 1,
        life: 28,
        burst: true,
        tumble3d: false
    };

    function loadSavedConfig() {
        try {
            const raw = localStorage.getItem('definite_cursor_config');
            if (raw) {
                const cfg = JSON.parse(raw);
                if (cfg && (cfg.icons || cfg.palette || cfg.physics)) {
                    activeConfig = cfg;
                    if (Array.isArray(cfg.palette) && cfg.palette.length) {
                        activePalette = cfg.palette;
                    }
                    if (cfg.physics) {
                        customPhysics.size = cfg.physics.size || 14;
                        // Support full range of gravity including Zero-G (0), Float (< 0), and Fall (> 0)
                        if (cfg.physics.gravity !== undefined) {
                            customPhysics.gravity = cfg.physics.gravity * 0.045;
                        } else {
                            customPhysics.gravity = 0;
                        }
                        customPhysics.drift = cfg.physics.drift !== undefined ? cfg.physics.drift : 1;
                        customPhysics.life = Math.max(16, Math.min(60, Math.round((cfg.physics.life || 450) / 16.6)));
                        customPhysics.burst = cfg.physics.burst !== false;
                        customPhysics.tumble3d = Boolean(cfg.physics.tumble3d);
                    }
                    if (Array.isArray(cfg.icons) && cfg.icons.length) {
                        const sprites = [];
                        cfg.icons.forEach(ic => {
                            if (ic.src) {
                                const img = new Image();
                                img.decoding = 'async';
                                img.src = ic.src;
                                sprites.push(img);
                            }
                        });
                        customSprites = sprites;
                    }
                    return;
                }
            }
        } catch(e) {}
        activeConfig = null;
        customSprites = [];
        activePalette = [...DEFAULT_PALETTE];
        customPhysics = { size: 13, gravity: 0, drift: 1, life: 28, burst: true, tumble3d: false };
    }

    loadSavedConfig();
    window.addEventListener('storage', function(e) {
        if (e.key === 'definite_cursor_config') {
            loadSavedConfig();
        }
    });

    const POOL_SIZE = 60;
    const MIN_DISTANCE = 11; // 11px distance trigger for fast, fluid emission
    const MIN_DIST_SQ = MIN_DISTANCE * MIN_DISTANCE;

    let canvas, ctx;
    let width = 0, height = 0;
    let isRunning = false;
    let isEnabled = true;
    let lastSymbolIdx = -1;

    // Dirty Bounding-Box Clearing: Eliminates 98% of full-screen clearRect bandwidth
    let prevClearX = 0, prevClearY = 0, prevClearW = 0, prevClearH = 0;
    let hasPrevClear = false;

    // Decoupled Mouse State (Zero thread blocking on mousemove)
    let mouseX = -999, mouseY = -999;
    let lastSpawnX = -999, lastSpawnY = -999;
    let mouseActive = false;

    // Pre-allocated Object Pool (Zero Garbage Collection)
    const pool = new Array(POOL_SIZE);
    for (let i = 0; i < POOL_SIZE; i++) {
        pool[i] = {
            active: false,
            symbol: '✦',
            img: null,
            color: '#FF4E00',
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            rot: 0,
            vRot: 0,
            pitch: 0,
            yaw: 0,
            pitchSpin: 0,
            yawSpin: 0,
            tumble3d: false,
            size: 12,
            age: 0,
            maxAge: 28
        };
    }

    function initCanvas() {
        if (document.getElementById('cursor-symbol-canvas')) return;
        canvas = document.createElement('canvas');
        canvas.id = 'cursor-symbol-canvas';
        canvas.setAttribute('aria-hidden', 'true');

        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '99990',
            opacity: '1',
            willChange: 'transform',
            transform: 'translateZ(0)',
            transition: 'opacity 0.25s ease'
        });

        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    function getNextSymbol() {
        let idx = Math.floor(Math.random() * SYMBOLS.length);
        if (idx === lastSymbolIdx) {
            idx = (idx + 1) % SYMBOLS.length;
        }
        lastSymbolIdx = idx;
        return SYMBOLS[idx];
    }

    function spawnParticle(x, y, moveAngle, isBurst) {
        let p = pool.find(item => !item.active);
        if (!p) {
            p = pool.reduce((oldest, cur) => cur.age > oldest.age ? cur : oldest, pool[0]);
        }

        p.active = true;

        if (customSprites.length > 0) {
            p.img = customSprites[Math.floor(Math.random() * customSprites.length)];
            p.symbol = null;
        } else {
            p.img = null;
            p.symbol = getNextSymbol();
        }

        p.color = activePalette[Math.floor(Math.random() * activePalette.length)];

        // Position at cursor with subtle micro-spread
        p.x = x + (Math.random() * 8 - 4);
        p.y = y + (Math.random() * 8 - 4);

        if (isBurst) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (2.2 + Math.random() * 3.8) * (customPhysics.drift || 1);
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
        } else {
            // Responsive snappy physics: drift outwards & slightly upwards
            const angle = moveAngle !== undefined 
                ? moveAngle + (Math.random() - 0.5) * 1.8 
                : Math.random() * Math.PI * 2;
            const speed = (1.0 + Math.random() * 2.2) * (customPhysics.drift || 1);

            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed - (customPhysics.gravity === 0 ? 0 : 0.4);
        }

        p.rot = (Math.random() - 0.5) * 0.5;
        p.vRot = (Math.random() - 0.5) * 0.08;

        p.tumble3d = customPhysics.tumble3d;
        p.pitch = Math.random() * Math.PI * 2;
        p.yaw = Math.random() * Math.PI * 2;
        p.pitchSpin = (Math.random() - 0.5) * 0.12;
        p.yawSpin = (Math.random() - 0.5) * 0.12;

        p.size = customPhysics.size * (0.85 + Math.random() * 0.3);
        p.age = 0;
        p.maxAge = customPhysics.life + Math.floor(Math.random() * 8);

        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(renderLoop);
        }
    }

    function triggerClickBurst(e) {
        if (!isEnabled || !customPhysics.burst) return;
        // Don't burst on input/textarea/select
        const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        const bx = e.clientX;
        const by = e.clientY;
        const burstCount = 12;
        for (let i = 0; i < burstCount; i++) {
            spawnParticle(bx, by, undefined, true);
        }
    }

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseActive = true;

        if (!isRunning && isEnabled) {
            isRunning = true;
            requestAnimationFrame(renderLoop);
        }
    }

    function renderLoop() {
        if (!isRunning) return;

        // Check if mouse moved enough to spawn a new particle
        if (mouseActive && isEnabled && mouseX >= 0 && mouseY >= 0) {
            const dx = mouseX - lastSpawnX;
            const dy = mouseY - lastSpawnY;
            const distSq = dx * dx + dy * dy;

            if (distSq >= MIN_DIST_SQ) {
                const moveAngle = Math.atan2(dy, dx) + Math.PI; // trail behind movement
                spawnParticle(mouseX, mouseY, moveAngle);
                
                // If moved very fast, spawn an extra particle for seamless trail
                if (distSq > MIN_DIST_SQ * 4) {
                    spawnParticle((mouseX + lastSpawnX) * 0.5, (mouseY + lastSpawnY) * 0.5, moveAngle);
                }

                lastSpawnX = mouseX;
                lastSpawnY = mouseY;
            }
        }

        // Surgical Dirty-Rect Clearing
        if (hasPrevClear) {
            ctx.clearRect(prevClearX, prevClearY, prevClearW, prevClearH);
            hasPrevClear = false;
        }

        let activeCount = 0;
        let minX = 999999, minY = 999999, maxX = -999999, maxY = -999999;

        for (let i = 0; i < POOL_SIZE; i++) {
            const p = pool[i];
            if (!p.active) continue;

            p.age++;
            if (p.age >= p.maxAge) {
                p.active = false;
                continue;
            }

            activeCount++;

            // Physics update
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vRot;
            p.vy += customPhysics.gravity;
            p.vx *= 0.94; // Snappy deceleration
            p.vy *= 0.94;

            // Track bounding box of all active particles
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;

            const progress = p.age / p.maxAge;
            
            // Clean linear alpha fade
            const alpha = progress < 0.12 
                ? (progress / 0.12) 
                : Math.max(0, 1 - progress);

            // Scale progression
            const scale = progress < 0.15 
                ? (0.8 + (progress / 0.15) * 0.3) 
                : Math.max(0.4, 1.1 - (progress * 0.65));

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);

            if (p.tumble3d) {
                p.pitch += p.pitchSpin;
                p.yaw += p.yawSpin;
                ctx.scale(Math.cos(p.yaw) * scale, Math.cos(p.pitch) * scale);
            } else {
                ctx.scale(scale, scale);
            }

            ctx.globalAlpha = alpha * 0.95;

            if (p.img && p.img.complete && p.img.naturalWidth) {
                const s = p.size;
                ctx.drawImage(p.img, -s / 2, -s / 2, s, s);
            } else {
                ctx.font = `600 ${p.size}px "Segoe UI Symbol", "Apple Color Emoji", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = p.color;
                ctx.fillText(p.symbol || '✦', 0, 0);
            }

            ctx.restore();
        }

        // Cache dirty bounding box with 36px padding for next frame clearing
        if (activeCount > 0) {
            const pad = 40;
            prevClearX = Math.max(0, Math.floor(minX - pad));
            prevClearY = Math.max(0, Math.floor(minY - pad));
            prevClearW = Math.min(width - prevClearX, Math.ceil(maxX - minX + pad * 2));
            prevClearH = Math.min(height - prevClearY, Math.ceil(maxY - minY + pad * 2));
            hasPrevClear = true;
        }

        if (activeCount > 0 || mouseActive) {
            mouseActive = false;
            requestAnimationFrame(renderLoop);
        } else {
            isRunning = false;
            if (hasPrevClear) {
                ctx.clearRect(prevClearX, prevClearY, prevClearW, prevClearH);
                hasPrevClear = false;
            } else {
                ctx.clearRect(0, 0, width, height);
            }
        }
    }

    // Toggle and Customization APIs
    window.__TOGGLE_CURSOR_TRAIL__ = function(enable) {
        isEnabled = enable !== undefined ? !!enable : !isEnabled;
        if (canvas) {
            canvas.style.opacity = isEnabled ? '1' : '0';
        }
        return isEnabled;
    };

    window.__LOAD_CURSOR_CONFIG__ = loadSavedConfig;
    window.__RESET_CURSOR_CONFIG__ = function() {
        try {
            localStorage.removeItem('definite_cursor_config');
            loadSavedConfig();
        } catch(e) {}
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCanvas();
            window.addEventListener('mousemove', onMouseMove, { passive: true });
            window.addEventListener('pointerdown', triggerClickBurst, { passive: true });
        });
    } else {
        initCanvas();
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('pointerdown', triggerClickBurst, { passive: true });
    }
})();
