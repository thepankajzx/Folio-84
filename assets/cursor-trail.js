/**
 * =========================================================================
 * DEFINITE STUDIOS // ULTRA-FAST 120 FPS CURSOR SYMBOL EMITTER
 * =========================================================================
 * Ultra-responsive, zero-lag HTML5 Canvas particle engine.
 * Decoupled mouse-tracking, 1x optimized rasterization, zero shadowBlur GPU penalty,
 * and an expanded 36+ premium geometric & creator glyph library.
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
    const PALETTE = [
        '#FF4E00', // Signature Electric Orange
        '#FF6B2B', // Vibrant Amber
        '#FFD700', // Cyber Gold
        '#A855F7', // Electric Violet
        '#06B6D4', // Cyan Spark
        '#FFFFFF'  // Frost White
    ];

    const POOL_SIZE = 55;
    const MIN_DISTANCE = 11; // 11px distance trigger for fast, fluid emission
    const MIN_DIST_SQ = MIN_DISTANCE * MIN_DISTANCE;

    let canvas, ctx;
    let width = 0, height = 0;
    let isRunning = false;
    let isEnabled = true;
    let lastSymbolIdx = -1;

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
            color: '#FF4E00',
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            rot: 0,
            vRot: 0,
            size: 12,
            age: 0,
            maxAge: 28
        };
    }

    function initCanvas() {
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
        // Fast 1x resolution to guarantee zero GPU fill-rate lag on 4K/Retina displays
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function getNextSymbol() {
        let idx = Math.floor(Math.random() * SYMBOLS.length);
        if (idx === lastSymbolIdx) {
            idx = (idx + 1) % SYMBOLS.length;
        }
        lastSymbolIdx = idx;
        return SYMBOLS[idx];
    }

    function spawnParticle(x, y, moveAngle) {
        let p = pool.find(item => !item.active);
        if (!p) {
            p = pool.reduce((oldest, cur) => cur.age > oldest.age ? cur : oldest, pool[0]);
        }

        p.active = true;
        p.symbol = getNextSymbol();
        p.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

        // Position at cursor with subtle micro-spread
        p.x = x + (Math.random() * 8 - 4);
        p.y = y + (Math.random() * 8 - 4);

        // Responsive snappy physics: drift outwards & slightly upwards
        const angle = moveAngle !== undefined 
            ? moveAngle + (Math.random() - 0.5) * 1.8 
            : Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 2.2;

        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed - 0.7; // Gentle upward lift

        p.rot = (Math.random() - 0.5) * 0.5;
        p.vRot = (Math.random() - 0.5) * 0.08;

        // Small, crisp font size (10.5px to 13px)
        p.size = 11 + Math.random() * 2;
        p.age = 0;
        p.maxAge = 24 + Math.floor(Math.random() * 8); // Fast brisk lifecycle (0.4s)

        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(renderLoop);
        }
    }

    // Ultra-lightweight mouse event (Only updates numbers, 0.001ms execution)
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

        ctx.clearRect(0, 0, width, height);
        let activeCount = 0;

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
            p.vx *= 0.94; // Snappy deceleration
            p.vy *= 0.94;

            const progress = p.age / p.maxAge;
            
            // Clean linear alpha fade (Zero GPU raster shadowBlur penalty)
            const alpha = progress < 0.12 
                ? (progress / 0.12) 
                : Math.max(0, 1 - progress);

            // Subtle scale down
            const scale = progress < 0.15 
                ? (0.8 + (progress / 0.15) * 0.3) 
                : Math.max(0.4, 1.1 - (progress * 0.65));

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(scale, scale);

            ctx.font = `600 ${p.size}px "Segoe UI Symbol", "Apple Color Emoji", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = alpha * 0.92;
            ctx.fillStyle = p.color;

            ctx.fillText(p.symbol, 0, 0);
            ctx.restore();
        }

        // Keep loop running if active particles exist or mouse is moving
        if (activeCount > 0 || mouseActive) {
            mouseActive = false; // reset flag until next mousemove
            requestAnimationFrame(renderLoop);
        } else {
            isRunning = false;
            ctx.clearRect(0, 0, width, height);
        }
    }

    // Toggle API
    window.__TOGGLE_CURSOR_TRAIL__ = function(enable) {
        isEnabled = enable !== undefined ? !!enable : !isEnabled;
        if (canvas) {
            canvas.style.opacity = isEnabled ? '1' : '0';
        }
        return isEnabled;
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCanvas();
            window.addEventListener('mousemove', onMouseMove, { passive: true });
        });
    } else {
        initCanvas();
        window.addEventListener('mousemove', onMouseMove, { passive: true });
    }
})();
