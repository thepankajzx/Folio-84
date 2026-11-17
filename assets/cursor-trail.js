/**
 * =========================================================================
 * DEFINITE STUDIOS // HIGH-PERFORMANCE CURSOR SYMBOL EMITTER
 * =========================================================================
 * Ultra-lightweight, 120 FPS HTML5 Canvas particle emitter.
 * Emits small, crisp, premium geometric & creator symbols on mouse move.
 * Features:
 * - Zero GC allocation via fixed Object Pool (60 particles)
 * - Distance-throttled emission (>=18px) to eliminate clustering
 * - Automatic sleep mode when mouse is idle (0% CPU/GPU overhead)
 * - Retina/HiDPI display crispness via DevicePixelRatio
 * - Completely disabled on touch / mobile devices
 * =========================================================================
 */
(function() {
    'use strict';

    // Touch device & reduced motion guard
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    // Curated high-end symbols (Small, sleek, geometric & creator craft)
    const SYMBOLS = [
        '✦', // Sparkle / Precision
        '★', // Star
        '▲', // Growth Delta
        '●', // Dot
        '▶', // Play / Video Hook
        '⌘', // Command / Craft
        '⚡', // Electric Energy
        '↗', // High-CTR Conversion Vector
        '✕', // Crosshair Grid
        '※'  // Reference Glyph
    ];

    // Definite Studios Refined Palette (Brand Orange, Cyber Gold, Electric Violet, Ice White)
    const PALETTE = [
        '#FF4E00', // Signature Electric Orange
        '#FF6B2B', // Vivid Amber
        '#FFD700', // Cyber Gold
        '#8B5CF6', // Electric Violet (from reference aesthetic)
        '#00E5FF', // Neon Cyan
        '#FFFFFF'  // Crisp White
    ];

    // Settings
    const POOL_SIZE = 50;
    const MIN_DISTANCE_SQ = 18 * 18; // 18px minimum move between spawns
    const MAX_PARTICLE_AGE = 45; // ~0.75 seconds at 60fps

    // Canvas & Context
    let canvas, ctx;
    let width = 0, height = 0, dpr = 1;
    let isRunning = false;
    let lastX = -999, lastY = -999;
    let isEnabled = true;

    // Pre-allocated Particle Object Pool (Zero GC garbage collection)
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
            scale: 1,
            size: 12,
            age: 0,
            maxAge: MAX_PARTICLE_AGE
        };
    }

    function initCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'cursor-symbol-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        
        // Canvas styles: absolute top overlay, ignores all pointer clicks
        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '99990',
            opacity: '1',
            transition: 'opacity 0.4s ease'
        });

        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d', { alpha: true });
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
    }

    function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
        width = window.innerWidth;
        height = window.innerHeight;
        
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
    }

    function spawnParticle(x, y) {
        // Find first inactive slot or steal oldest
        let p = pool.find(item => !item.active);
        if (!p) {
            // Find oldest active particle
            p = pool.reduce((oldest, current) => current.age > oldest.age ? current : oldest, pool[0]);
        }

        p.active = true;
        p.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        p.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        
        // Position with tiny natural jitter (-5 to +5px)
        p.x = x + (Math.random() * 10 - 5);
        p.y = y + (Math.random() * 10 - 5);
        
        // Drift physics: subtle float upward and outward
        p.vx = (Math.random() - 0.5) * 1.4;
        p.vy = -Math.random() * 1.3 - 0.3; // Gentle upward drift
        
        p.rot = (Math.random() - 0.5) * 0.4;
        p.vRot = (Math.random() - 0.5) * 0.04;
        
        // Small, delicate size (11px to 13px)
        p.size = 11 + Math.random() * 2.5;
        p.scale = 0.75;
        p.age = 0;
        p.maxAge = 40 + Math.floor(Math.random() * 12);

        // Start animation loop if asleep
        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(renderLoop);
        }
    }

    function onMouseMove(e) {
        if (!isEnabled) return;
        const x = e.clientX;
        const y = e.clientY;

        const dx = x - lastX;
        const dy = y - lastY;
        const distSq = dx * dx + dy * dy;

        if (distSq >= MIN_DISTANCE_SQ) {
            spawnParticle(x, y);
            lastX = x;
            lastY = y;
        }
    }

    function renderLoop() {
        if (!isRunning) return;

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

            // Physics step
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vRot;
            p.vx *= 0.98; // gentle friction
            p.vy *= 0.98;

            // Normalized life (0 = start, 1 = end)
            const progress = p.age / p.maxAge;
            
            // Opacity: quick fade in (first 15%), smooth ease-out fade away
            let alpha = progress < 0.15 
                ? (progress / 0.15) 
                : Math.max(0, 1 - Math.pow(progress, 1.4));

            // Scale: subtle pop in then gentle shrink
            let scale = progress < 0.2 
                ? (0.7 + (progress / 0.2) * 0.4) 
                : Math.max(0.35, 1.1 - (progress * 0.75));

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(scale, scale);

            // Crisp font rendering
            ctx.font = `bold ${p.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Subtle glow
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.globalAlpha = alpha * 0.88;
            ctx.fillStyle = p.color;

            ctx.fillText(p.symbol, 0, 0);
            ctx.restore();
        }

        // Auto-sleep when no particles are left
        if (activeCount > 0) {
            requestAnimationFrame(renderLoop);
        } else {
            isRunning = false;
            ctx.clearRect(0, 0, width, height);
        }
    }

    // Expose toggle API
    window.__TOGGLE_CURSOR_TRAIL__ = function(enable) {
        isEnabled = enable !== undefined ? !!enable : !isEnabled;
        if (canvas) {
            canvas.style.opacity = isEnabled ? '1' : '0';
        }
        return isEnabled;
    };

    // Initialize when DOM is ready
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
