const fs = require('fs');

let src = fs.readFileSync('thumbnails.html', 'utf8');

// 1. Update Title and Meta Tags
src = src.replace(
    '<title>Definite Studios // Creative Vault - High Retention YouTube Thumbnail Packaging</title>',
    '<title>Definite Studios // Graphic Design & Visual Performance Vault</title>'
);

// 1b. Fix Hero Section top padding for mobile navbar clearance
src = src.replace(
    'id="hero-section" class="min-h-screen pt-8 sm:pt-10 pb-8 flex flex-col justify-center relative overflow-hidden"',
    'id="hero-section" class="min-h-screen pt-28 sm:pt-24 md:pt-12 pb-8 flex flex-col justify-center relative overflow-hidden"'
);

// 1c. Add scroll-mt-28 md:scroll-mt-8 to all sections for anchor scroll clearance
src = src.replace(/<section id="sec-([^"]+)" class="([^"]*)"/g, (match, id, classes) => {
    if (!classes.includes('scroll-mt-')) {
        return `<section id="sec-${id}" class="scroll-mt-28 md:scroll-mt-8 ${classes}"`;
    }
    return match;
});

// 1d. Set eager loading for top mosaic sections in renderMosaicWall
src = src.replace(
    `const makeTile = (item) => {
                const tileBg = item.niche === 'logos' ? 'bg-white' : 'bg-black';
                const tile = document.createElement('div');`,
    `const makeTile = (item) => {
                const tileBg = item.niche === 'logos' ? 'bg-white' : 'bg-black';
                const isEager = containerId === 'mosaic-ads-branding' || containerId === 'mosaic-posters' || containerId === 'mosaic-deepseek';
                const loadAttr = isEager ? 'eager' : 'lazy';
                const tile = document.createElement('div');`
);
src = src.replace(
    'loading="lazy" decoding="async"',
    'loading="${loadAttr}" decoding="async"'
);

// 2. Add Mobile Graphics Nav and update vertical dock class
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
                <button onclick="openWhatsAppModal()" class="px-2.5 py-1 rounded-full bg-[#25D366] text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer">
                    <span>Scope</span>
                    <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
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

src = src.replace('<main id="specification-grid"', mobileNavHtml + '\n    <main id="specification-grid"');

// 3. Update #vertical-dock to be hidden on mobile (< 768px): hidden md:block
src = src.replace('<nav class="frost-dock" id="vertical-dock"', '<nav class="frost-dock hidden md:block" id="vertical-dock"');

// 4. Update vertical dock items to reflect the new alternating order
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
                <svg class="dock-wa-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span class="dock-tooltip">WhatsApp</span>
            </button>
        </div>`;

const dockStart = src.indexOf('<div class="dock-track">');
const dockEnd = src.indexOf('</nav>', dockStart);
src = src.substring(0, dockStart) + newDockItemsHtml + '\n    ' + src.substring(dockEnd);

// 5. Extract and reorder sections in specification-grid
const mainGridStart = src.indexOf('<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-6 sm:pt-8 space-y-12">');
const mainGridEnd = src.indexOf('</div>\n    </main>', mainGridStart);

if (mainGridStart === -1 || mainGridEnd === -1) {
    console.error('Could not find main grid markers');
    process.exit(1);
}

const gridContent = src.substring(mainGridStart, mainGridEnd);

function extractSection(id) {
    const startTag = `<section id="${id}"`;
    const sIdx = gridContent.indexOf(startTag);
    if (sIdx === -1) throw new Error('Section ' + id + ' not found');
    const endTag = '</section>';
    const eIdx = gridContent.indexOf(endTag, sIdx);
    if (eIdx === -1) throw new Error('Closing section for ' + id + ' not found');
    return gridContent.substring(sIdx, eIdx + endTag.length);
}

const secAdsBranding = extractSection('sec-ads-branding');
const secPosters = extractSection('sec-posters');
const secConceptLab = extractSection('sec-concept-lab');
const secEducation = extractSection('sec-education');
const secLogos = extractSection('sec-logos');
const secAdsFinance = extractSection('sec-ads-finance');
const secFitness = extractSection('sec-fitness');
const secFinance = extractSection('sec-finance');
const secBooks = extractSection('sec-books');

const reorderedGridHtml = `<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-6 sm:pt-8 space-y-12">
            <!-- 1. PERSONAL BRAND & AUTHORITY PAID ADS -->
            ${secAdsBranding}

            <!-- 2. COMMERCIAL POSTERS & MUSIC SINGLES -->
            ${secPosters}

            <!-- 3. AI BATTLE & CONCEPT EXPLORATION -->
            ${secConceptLab}

            <!-- 4. EDUCATION & EDTECH PACKAGING -->
            ${secEducation}

            <!-- 5. BRAND IDENTITY, INSIGNIAS & MERCH SYSTEMS -->
            ${secLogos}

            <!-- 6. TRADING & FINANCE PAID ADS -->
            ${secAdsFinance}

            <!-- 7. FITNESS & SUPPLEMENTS PACKAGING -->
            ${secFitness}

            <!-- 8. TRADING & INSTITUTIONAL FINANCE PACKAGING -->
            ${secFinance}

            <!-- 9. E-BOOK COVERS & DIGITAL PUBLISHING -->
            ${secBooks}
        `;

src = src.substring(0, mainGridStart) + reorderedGridHtml + src.substring(mainGridEnd);

// 6. Update gallerySectionIds array in script
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

src = src.replace(oldGalleryIds, newGalleryIds);

// 7. Add mobile pill sync to updateActiveOnScroll
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

src = src.replace(oldActiveCode, newActiveCode);

// Add updateMobilePills function
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

// Write to graphics.html
fs.writeFileSync('graphics.html', src, 'utf8');
console.log('Successfully written graphics.html');

// Also update thumbnails.html with the identical content
fs.writeFileSync('thumbnails.html', src, 'utf8');
console.log('Successfully mirrored to thumbnails.html');
