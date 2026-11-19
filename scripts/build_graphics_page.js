const fs = require('fs');

let src = fs.readFileSync('thumbnails.html', 'utf8');

// 1. Fix populateCarousels() to ensure loading="eager" is always used for marquee
src = src.replace(/loading="\$\{loadAttr\}"/g, 'loading="eager"');

// 1b. Update Title
src = src.replace(
    '<title>High-CTR YouTube Packaging & Visual Vault // Definite Studios</title>',
    '<title>Definite Studios // Graphic Design & Visual Performance Vault</title>'
);
src = src.replace(
    '<title>Definite Studios // Creative Vault - High Retention YouTube Thumbnail Packaging</title>',
    '<title>Definite Studios // Graphic Design & Visual Performance Vault</title>'
);

// 1c. Fix Hero Section top padding for mobile navbar clearance
src = src.replace(
    'id="hero-section" class="min-h-screen pt-8 sm:pt-10 pb-8 flex flex-col justify-center relative overflow-hidden"',
    'id="hero-section" class="min-h-screen pt-28 sm:pt-24 md:pt-12 pb-8 flex flex-col justify-center relative overflow-hidden"'
);

// 1d. Add scroll-mt-28 md:scroll-mt-8 to all sections for anchor scroll clearance
src = src.replace(/<section id="sec-([^"]+)" class="([^"]*)"/g, (match, id, classes) => {
    if (!classes.includes('scroll-mt-')) {
        return `<section id="sec-${id}" class="scroll-mt-28 md:scroll-mt-8 ${classes}"`;
    }
    return match;
});

// 1e. Correctly inject loadAttr ONLY into makeTile in renderMosaicWall
const oldMakeTile = `            const makeTile = (item) => {
                const tileBg = item.niche === 'logos' ? 'bg-white' : 'bg-black';
                const tile = document.createElement('div');
                tile.className = \`relative \${aspectClass} rounded-2xl overflow-hidden group cursor-pointer \${tileBg} border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#FF4E00]/60 dark:hover:border-[#FF4E00]/60 transition-all duration-300 hover:-translate-y-1\`;
                tile.onclick = () => openModal(item);

                tile.innerHTML = \`
                    <img src="\${item.img}" alt="\${item.title}" loading="eager" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />`;

const newMakeTile = `            const makeTile = (item) => {
                const tileBg = item.niche === 'logos' ? 'bg-white' : 'bg-black';
                const isEager = containerId === 'mosaic-ads-branding' || containerId === 'mosaic-posters' || containerId === 'mosaic-deepseek';
                const loadAttr = 'eager';
                const tile = document.createElement('div');
                tile.className = \`relative \${aspectClass} rounded-2xl overflow-hidden group cursor-pointer \${tileBg} border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#FF4E00]/60 dark:hover:border-[#FF4E00]/60 transition-all duration-300 hover:-translate-y-1\`;
                tile.onclick = () => openModal(item);

                tile.innerHTML = \`
                    <img src="\${item.img}" alt="\${item.title}" loading="\${loadAttr}" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />`;

if (src.includes(oldMakeTile)) {
    src = src.replace(oldMakeTile, newMakeTile);
}

// 1f. Make WhatsApp Scope Modal compact, elegant and proportioned on mobile
const compactModalHtml = `    <!-- =========================================================================
         BESPOKE GRAPHIC DESIGN SCOPE & WHATSAPP REQUIREMENT MODAL (COMPACT LUXURY)
         ========================================================================= -->
    <div id="whatsapp-scope-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5" onclick="closeWhatsAppModalOnBackdrop(event)">
        <div class="relative w-full max-w-lg max-h-[84vh] overflow-y-auto theme-glass rounded-2xl border border-black/10 dark:border-white/15 p-4 sm:p-5 shadow-2xl space-y-3" onclick="event.stopPropagation()">
            
            <!-- Compact Header -->
            <div class="flex items-start justify-between gap-3 pb-2.5 border-b border-black/10 dark:border-white/10">
                <div>
                    <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF4E00]/10 border border-[#FF4E00]/25 text-[#FF4E00] text-[9px] font-mono font-bold tracking-wider uppercase mb-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                        Studio WhatsApp // Bespoke Scope
                    </div>
                    <h3 class="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                        Tell us what you want to build.
                    </h3>
                    <p class="text-[10px] font-mono text-slate-500 dark:text-white/50 mt-0.5">
                        Select design services. We'll format your brief and open WhatsApp directly.
                    </p>
                </div>
                <button type="button" onclick="closeWhatsAppModal()" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white/70 hover:bg-[#FF4E00] hover:text-white dark:hover:bg-[#FF4E00] transition-colors shrink-0 text-xs" aria-label="Close dialog">
                    ✕
                </button>
            </div>

            <!-- Compact Service Selection Grid -->
            <div class="space-y-1.5">
                <span class="block font-mono text-[10px] font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider">
                    Select Services (Click multiple)
                </span>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    
                    <button type="button" class="scope-chip is-active flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="YouTube Packaging & High-CTR Thumbnails">
                        <div class="w-5 h-5 rounded bg-orange-500/10 flex items-center justify-center text-[#FF4E00] shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="4"/><polygon points="10 8 16 12 10 16 10 8" fill="#FFF"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">YouTube Packaging</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Thumbnails</span>
                        </div>
                    </button>

                    <button type="button" class="scope-chip flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="Paid Performance & Ad Creatives">
                        <div class="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 18-5v12L3 14v-3z"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">Paid Ads</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Meta/Google</span>
                        </div>
                    </button>

                    <button type="button" class="scope-chip flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="Brand Identity, Logos & Visual Systems">
                        <div class="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">Brand Identity</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Logos/Guides</span>
                        </div>
                    </button>

                    <button type="button" class="scope-chip flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="Social Media Content & Carousels">
                        <div class="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="3"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">Social Media</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Carousels</span>
                        </div>
                    </button>

                    <button type="button" class="scope-chip flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="Posters, Key Visuals & Album Singles">
                        <div class="w-5 h-5 rounded bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">Posters & Covers</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Music/Singles</span>
                        </div>
                    </button>

                    <button type="button" class="scope-chip flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="3D Product Staging & CGI Mockups">
                        <div class="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">3D Staging</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Product Renders</span>
                        </div>
                    </button>

                    <button type="button" class="scope-chip flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="Website Visuals & SaaS Vector Graphics">
                        <div class="w-5 h-5 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">SaaS & Web</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Vector Art</span>
                        </div>
                    </button>

                    <button type="button" class="scope-chip flex items-center gap-2 p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-left transition-all" onclick="toggleServiceChip(this)" data-service="Custom / Bespoke Creative Scope">
                        <div class="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                        </div>
                        <div class="min-w-0">
                            <span class="font-mono text-[10px] font-bold text-slate-900 dark:text-white block truncate leading-tight">Custom Scope</span>
                            <span class="text-[8px] font-mono text-slate-500 dark:text-white/50 block truncate">Bespoke Design</span>
                        </div>
                    </button>

                </div>
            </div>

            <!-- Compact Client Info & Timeline -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                    <label for="scope-name" class="block font-mono text-[10px] font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider mb-1">Your Name / Brand</label>
                    <input id="scope-name" type="text" placeholder="e.g. Alex // @Channel" class="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#FF4E00]">
                </div>
                <div>
                    <label for="scope-timeline" class="block font-mono text-[10px] font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider mb-1">Target Timeline</label>
                    <select id="scope-timeline" class="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#FF4E00]">
                        <option value="Immediate (1-3 Days)">⚡ Immediate (1-3 Days)</option>
                        <option value="Within 1 Week">Within 1 Week</option>
                        <option value="Flexible / Planning">Flexible / Planning</option>
                        <option value="Monthly Retainer Desk">Monthly Retainer Desk</option>
                    </select>
                </div>
            </div>

            <!-- Compact Project Scope Notes -->
            <div>
                <label for="scope-notes" class="block font-mono text-[10px] font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider mb-1">Brief / Scope Details</label>
                <textarea id="scope-notes" rows="2" placeholder="Tell us about the project: target niche, visual references, deliverables count..." class="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#FF4E00] resize-none"></textarea>
            </div>

            <!-- Action Button: Send via WhatsApp -->
            <div class="pt-2 border-t border-black/10 dark:border-white/10 flex items-center gap-2">
                <button type="button" onclick="sendScopeViaWhatsApp()" class="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/25 transition-all hover:scale-[1.01] active:scale-95">
                    <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.074-2.074-.497-1.761-.73-2.883-2.518-2.97-2.635-.088-.116-.717-.954-.717-1.821s.45-1.296.611-1.472c.162-.176.353-.221.47-.221.118 0 .235.002.338.007.108.006.252-.041.396.306.148.358.508 1.238.552 1.328.045.089.075.194.015.313-.059.12-.089.194-.177.299-.089.104-.188.233-.269.313-.089.088-.182.185-.078.363.104.179.462.763.992 1.235.683.608 1.258.797 1.437.886.178.089.283.075.388-.045.106-.12.454-.528.575-.708.121-.179.243-.149.409-.089.167.06 1.058.499 1.239.589.182.09.303.134.348.209.045.075.045.434-.099.839z"/></svg>
                    <span>Launch WhatsApp Scope →</span>
                </button>
                <button type="button" onclick="closeWhatsAppModal()" class="px-3 py-2.5 rounded-xl font-mono text-xs text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white transition-colors">
                    Cancel
                </button>
            </div>

        </div>
    </div>`;

const mStart = src.indexOf('<!-- =========================================================================\n         BESPOKE GRAPHIC DESIGN SCOPE');
const mEnd = src.indexOf('<!-- =========================================================================\n         DATA & MARQUEE ENGINE SCRIPT');
if (mStart !== -1 && mEnd !== -1) {
    src = src.substring(0, mStart) + compactModalHtml + '\n\n    ' + src.substring(mEnd);
}

// 2. Add Mobile Graphics Nav with Official WhatsApp Button & Icon
const mobileNavHtml = `
    <!-- =========================================================================
         MOBILE LUXURY FLOATING NAVIGATION (Screens < 768px)
         Clean, Unobtrusive Top Bar + Swipeable Category Pill Strip
         ========================================================================= -->
    <header id="mobile-graphics-nav" class="md:hidden fixed top-2.5 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-50 rounded-2xl theme-glass border border-black/10 dark:border-white/10 shadow-xl backdrop-blur-xl p-2.5 space-y-2 transition-all">
        <!-- Top Row: Identity & Quick Actions -->
        <div class="flex items-center justify-between px-1">
            <button onclick="scrollToTop()" class="flex items-center gap-2 group text-left cursor-pointer">
                <div class="w-6 h-6 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 p-0.5 shrink-0">
                    <img src="assets/images/logos/definite-icon-blue.png" alt="Definite" class="w-full h-full object-cover rounded-full">
                </div>
                <div class="leading-none">
                    <span class="font-display font-extrabold text-xs tracking-tight text-slate-900 dark:text-white block">DEFINITE</span>
                    <span class="text-[9px] font-mono text-[#FF4E00] font-bold tracking-wider">GRAPHICS VAULT</span>
                </div>
            </button>

            <div class="flex items-center gap-1.5">
                <a href="index.html" class="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-mono font-bold text-slate-700 dark:text-white/80 hover:text-[#FF4E00] flex items-center gap-1 transition-colors" title="Back to Main Portfolio">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Home</span>
                </a>
                <button onclick="toggleTheme()" class="p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/80 hover:text-[#FF4E00] transition-colors cursor-pointer" aria-label="Toggle Theme">
                    <svg id="sun-icon-m" class="w-3.5 h-3.5 hidden dark:block text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    <svg id="moon-icon-m" class="w-3.5 h-3.5 block dark:hidden text-slate-800" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </button>
                <button onclick="openWhatsAppModal()" class="px-2.5 py-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Chat on WhatsApp">
                    <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.074-2.074-.497-1.761-.73-2.883-2.518-2.97-2.635-.088-.116-.717-.954-.717-1.821s.45-1.296.611-1.472c.162-.176.353-.221.47-.221.118 0 .235.002.338.007.108.006.252-.041.396.306.148.358.508 1.238.552 1.328.045.089.075.194.015.313-.059.12-.089.194-.177.299-.089.104-.188.233-.269.313-.089.088-.182.185-.078.363.104.179.462.763.992 1.235.683.608 1.258.797 1.437.886.178.089.283.075.388-.045.106-.12.454-.528.575-.708.121-.179.243-.149.409-.089.167.06 1.058.499 1.239.589.182.09.303.134.348.209.045.075.045.434-.099.839z"/></svg>
                    <span>WhatsApp</span>
                </button>
            </div>
        </div>

        <!-- Row 2: Swipeable Horizontal Category Pill Track -->
        <div id="mobile-pill-track" class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 text-[11px] font-mono">
            <button onclick="scrollToSection('sec-ads-branding')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-ads-branding">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Personal Ads
            </button>
            <button onclick="scrollToSection('sec-posters')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-posters">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Posters
            </button>
            <button onclick="scrollToSection('sec-concept-lab')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-concept-lab">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> AI Battle
            </button>
            <button onclick="scrollToSection('sec-education')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-education">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FF4E00]"></span> Education
            </button>
            <button onclick="scrollToSection('sec-logos')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-logos">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Brand Logos
            </button>
            <button onclick="scrollToSection('sec-ads-finance')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-ads-finance">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Trading Ads
            </button>
            <button onclick="scrollToSection('sec-fitness')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-fitness">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Fitness
            </button>
            <button onclick="scrollToSection('sec-finance')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-finance">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Institutional
            </button>
            <button onclick="scrollToSection('sec-books')" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-books">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> E-Books
            </button>
            <button onclick="scrollToPricing()" class="mob-cat-pill shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-[#FF4E00] font-semibold transition-all flex items-center gap-1 cursor-pointer" data-target="sec-pricing">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Pricing
            </button>
        </div>
    </header>
`;

if (!src.includes('id="mobile-graphics-nav"')) {
    src = src.replace('<main id="specification-grid"', mobileNavHtml + '\n    <main id="specification-grid"');
} else {
    // Replace existing mobile nav
    const navStart = src.indexOf('<header id="mobile-graphics-nav"');
    const navEnd = src.indexOf('</header>', navStart) + 9;
    src = src.substring(0, navStart) + mobileNavHtml.trim() + src.substring(navEnd);
}

// 3. Update #vertical-dock to be hidden on mobile (< 768px): hidden md:block
src = src.replace('<nav class="frost-dock" id="vertical-dock"', '<nav class="frost-dock hidden md:block" id="vertical-dock"');

// 4. Update vertical dock items to reflect the alternating order
const newDockItemsHtml = `        <div class="dock-track">
            <div class="dock-active" id="dockActive" aria-hidden="true"></div>

            <!-- Item 0: Definite Studios Logo (Hero Section) -->
            <button onclick="scrollToTop()" class="dock-item is-active group relative" data-section="hero-section" title="Definite Studios // Graphics Vault" aria-label="Vault Top">
                <div class="dock-logo-wrap">
                    <img src="assets/images/logos/definite-icon-blue.png" alt="Definite Studios" class="w-full h-full object-cover">
                </div>
                <span class="dock-tooltip">Vault Top</span>
            </button>

            <!-- Item 1: Main Portfolio Home Button -->
            <a href="index.html" class="dock-item group relative" title="Definite Studios // Main Portfolio" aria-label="Main Portfolio Home">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span class="dock-tooltip">Main Portfolio</span>
            </a>

            <!-- Item 2: Day / Night Theme Toggle -->
            <button id="theme-toggle" onclick="toggleTheme()" class="dock-item group relative" aria-label="Toggle Theme" title="Toggle Theme">
                <svg id="sun-icon" class="w-4 h-4 hidden dark:block text-amber-300 group-hover:rotate-45 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                <svg id="moon-icon" class="w-4 h-4 block dark:hidden text-slate-800 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                <span class="dock-tooltip">Toggle Theme</span>
            </button>

            <!-- Item 3: 3-Line Moving Vault -->
            <button class="dock-item group relative" data-section="vault-carousels" onclick="scrollToCarousel()" title="3-Line Moving Vault" aria-label="Moving Vault">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="3.5" rx="1"/>
                    <rect x="3" y="10.25" width="18" height="3.5" rx="1"/>
                    <rect x="3" y="16.5" width="18" height="3.5" rx="1"/>
                </svg>
                <span class="dock-tooltip">Moving Vault</span>
            </button>

            <!-- 1. Personal Brand Paid Ads -->
            <button class="dock-item group relative" data-section="sec-ads-branding" aria-label="Personal Brand Paid Ads">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                <span class="dock-tooltip">Personal Ads</span>
            </button>

            <!-- 2. Posters & Music Singles -->
            <button class="dock-item group relative" data-section="sec-posters" aria-label="Posters & Singles">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                </svg>
                <span class="dock-tooltip">Posters &amp; Art</span>
            </button>

            <!-- 3. AI Battle Concept Lab -->
            <button class="dock-item group relative" data-section="sec-concept-lab" aria-label="AI Battle & Concepts">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span class="dock-tooltip">AI Battle</span>
            </button>

            <!-- 4. Education Category -->
            <button class="dock-item group relative" data-section="sec-education" aria-label="Education Packaging">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m2 9 10-5 10 5-10 5L2 9Z"/>
                    <path d="M6 11v5c3.5 2.7 8.5 2.7 12 0v-5"/>
                    <path d="M22 9v6"/>
                </svg>
                <span class="dock-tooltip">Education</span>
            </button>

            <!-- 5. Brand Identity & Logos -->
            <button class="dock-item group relative" data-section="sec-logos" aria-label="Logos & Brand Identity">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m12 19 7-7 3 3-7 7-3-3z"/>
                    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                    <path d="m2 2 7.586 7.586"/>
                    <circle cx="11" cy="11" r="2"/>
                </svg>
                <span class="dock-tooltip">Brand Logos</span>
            </button>

            <!-- 6. Trading & Finance Paid Ads -->
            <button class="dock-item group relative" data-section="sec-ads-finance" aria-label="Trading Paid Ads">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m3 11 18-5v12L3 14v-3z"/>
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
                </svg>
                <span class="dock-tooltip">Trading Ads</span>
            </button>

            <!-- 7. Fitness & Gym -->
            <button class="dock-item group relative" data-section="sec-fitness" aria-label="Fitness Packaging">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 4v16M18 4v16M2 8v8M22 8v8M2 12h20"/>
                </svg>
                <span class="dock-tooltip">Fitness</span>
            </button>

            <!-- 8. Trading & Finance Packaging -->
            <button class="dock-item group relative" data-section="sec-finance" aria-label="Finance & Institutional Packaging">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 20V16M8 20V11M13 20V14M18 20V8"/>
                    <path d="m3 12 6-6 4 3 7-7M17 2h3v3"/>
                </svg>
                <span class="dock-tooltip">Institutional</span>
            </button>

            <!-- 9. E-Book Covers & Digital Publishing -->
            <button class="dock-item group relative" data-section="sec-books" aria-label="E-Book Packaging">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                    <path d="M6 6h10"/>
                    <path d="M6 10h10"/>
                </svg>
                <span class="dock-tooltip">E-Book Covers</span>
            </button>

            <!-- 10. Pricing & Retainers ($) -->
            <button class="dock-item group relative" data-section="sec-pricing" onclick="scrollToPricing()" aria-label="Pricing & Retainers">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <line x1="12" y1="2" x2="12" y2="22"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span class="dock-tooltip">Pricing</span>
            </button>

            <!-- 11. WhatsApp Bespoke Scope -->
            <button class="dock-item dock-wa-item group relative" data-section="conversion-cta" onclick="openWhatsAppModal()" aria-label="Request Design Scope">
                <svg class="dock-wa-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.074-2.074-.497-1.761-.73-2.883-2.518-2.97-2.635-.088-.116-.717-.954-.717-1.821s.45-1.296.611-1.472c.162-.176.353-.221.47-.221.118 0 .235.002.338.007.108.006.252-.041.396.306.148.358.508 1.238.552 1.328.045.089.075.194.015.313-.059.12-.089.194-.177.299-.089.104-.188.233-.269.313-.089.088-.182.185-.078.363.104.179.462.763.992 1.235.683.608 1.258.797 1.437.886.178.089.283.075.388-.045.106-.12.454-.528.575-.708.121-.179.243-.149.409-.089.167.06 1.058.499 1.239.589.182.09.303.134.348.209.045.075.045.434-.099.839z"/></svg>
                <span class="dock-tooltip">WhatsApp</span>
            </button>
        </div>`;

const dockStart = src.indexOf('<div class="dock-track">');
const dockEnd = src.indexOf('</nav>', dockStart);
if (dockStart !== -1 && dockEnd !== -1) {
    src = src.substring(0, dockStart) + newDockItemsHtml + '\n    ' + src.substring(dockEnd);
}

// 5. Update gallerySectionIds array in script
const oldGalleryIds = `const gallerySectionIds = [
            'sec-education',
            'sec-finance',
            'sec-fitness',
            'sec-posters',
            'sec-logos',
            'sec-ads-finance',
            'sec-ads-branding',
            'sec-books'
        ];`;

const newGalleryIds = `const gallerySectionIds = [
            'sec-ads-branding',
            'sec-posters',
            'sec-concept-lab',
            'sec-education',
            'sec-logos',
            'sec-ads-finance',
            'sec-fitness',
            'sec-finance',
            'sec-books'
        ];`;

if (src.includes(oldGalleryIds)) {
    src = src.replace(oldGalleryIds, newGalleryIds);
}

// 6. Update mobile pill sync in updateActiveOnScroll
const oldActiveCode = `            if (activeIdx >= 0) {
                setActiveDockItem(activeIdx);
            }`;

const newActiveCode = `            if (activeIdx >= 0) {
                setActiveDockItem(activeIdx);
                const activeSec = dockSections[activeIdx];
                if (activeSec && activeSec.id) {
                    updateMobilePills(activeSec.id);
                }
            }`;

if (src.includes(oldActiveCode)) {
    src = src.replace(oldActiveCode, newActiveCode);
}

// Add updateMobilePills function if not present
if (!src.includes('function updateMobilePills(')) {
    const helperFunc = `
        function updateMobilePills(activeId) {
            const pills = document.querySelectorAll('.mob-cat-pill');
            const track = document.getElementById('mobile-pill-track');
            pills.forEach(pill => {
                const isActive = pill.dataset.target === activeId;
                if (isActive) {
                    pill.classList.add('bg-[#FF4E00]/15', 'border-[#FF4E00]', 'text-[#FF4E00]', 'dark:text-[#FF4E00]');
                    pill.classList.remove('bg-black/5', 'dark:bg-white/5', 'text-slate-700', 'dark:text-white/70');
                    if (track) {
                        const pillLeft = pill.offsetLeft;
                        const pillWidth = pill.offsetWidth;
                        const trackScroll = track.scrollLeft;
                        const trackWidth = track.offsetWidth;
                        if (pillLeft < trackScroll || (pillLeft + pillWidth) > (trackScroll + trackWidth)) {
                            track.scrollTo({ left: Math.max(0, pillLeft - 30), behavior: 'smooth' });
                        }
                    }
                } else {
                    pill.classList.remove('bg-[#FF4E00]/15', 'border-[#FF4E00]', 'text-[#FF4E00]', 'dark:text-[#FF4E00]');
                    pill.classList.add('bg-black/5', 'dark:bg-white/5', 'text-slate-700', 'dark:text-white/70');
                }
            });
        }
`;
    src = src.replace('function scrollToSection(secId) {', helperFunc + '\n        function scrollToSection(secId) {');
}

// Write to graphics.html
fs.writeFileSync('graphics.html', src, 'utf8');
console.log('Successfully written graphics.html');

// Also update thumbnails.html with identical content
fs.writeFileSync('thumbnails.html', src, 'utf8');
console.log('Successfully mirrored to thumbnails.html');
