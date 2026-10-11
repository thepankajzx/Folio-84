const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/thepankajzx/Folio-84@main/';

// The 25 cards data
const allCards = [
  // EDUCATION (8)
  {
    category: 'education',
    img: 'assets/images/education/edu-my-first-book.webp',
    title: 'My First Book // SSC History',
    badge: 'EDTECH · BOOK LAUNCH',
    badgeClass: 'bg-amber-500/15 text-amber-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Curiosity-driven spotlight staging with velvet drape reveal and rapid revision hooks.',
    lightboxTitle: 'MY FIRST BOOK // SSC History Unveiled',
    lightboxDesc: 'Curiosity-driven spotlight staging with velvet drape reveal and rapid revision hooks.'
  },
  {
    category: 'education',
    img: 'assets/images/education/edu-big-billion-sale.webp',
    title: 'Big Billion Sale // 5.0 Launch',
    badge: 'COURSE · HIGH CONVERSION',
    badgeClass: 'bg-rose-500/15 text-rose-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Festive flash sale packaging with 3D gold typography and unboxed study material bundle.',
    lightboxTitle: 'BIG BILLION SALE // 5.0 Course Launch',
    lightboxDesc: 'Festive flash sale packaging with 3D gold typography and unboxed study material bundle.'
  },
  {
    category: 'education',
    img: 'assets/images/education/edu-alpha-2027-launch.webp',
    title: 'Alpha 2027 // Transformation',
    badge: 'STORYTELLING · VIRAL CTR',
    badgeClass: 'bg-emerald-500/15 text-emerald-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Split-screen emotional contrast driving massive empathy and click-through curiosity.',
    lightboxTitle: 'ALPHA 2027 // Fail to Selected Transformation',
    lightboxDesc: 'Split-screen emotional contrast driving massive empathy and click-through curiosity.'
  },
  {
    category: 'education',
    img: 'assets/images/education/edu-mindmap-boat-stream.webp',
    title: 'Boat & Stream // Mindmap',
    badge: 'MATHS · EPISODE 7',
    badgeClass: 'bg-cyan-500/15 text-cyan-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Visual physics breakdown paired with textbook branding for instant concept mastery.',
    lightboxTitle: 'BOAT & STREAM // Mindmap Series Ep. 7',
    lightboxDesc: 'Visual physics breakdown paired with textbook branding for instant concept mastery.'
  },
  {
    category: 'education',
    img: 'assets/images/education/edu-mindmap-geometry-circle.webp',
    title: 'Geometry Circle // Viren Sir',
    badge: 'GEOMETRY · 30-DAY CRASH',
    badgeClass: 'bg-sky-500/15 text-sky-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'High-retention typographic hierarchy engineered for competitive exam crash courses.',
    lightboxTitle: 'GEOMETRY CIRCLE // Mindmap Series Ep. 2',
    lightboxDesc: 'High-retention typographic hierarchy engineered for competitive exam crash courses.'
  },
  {
    category: 'education',
    img: 'assets/images/education/edu-mindmap-ratio-proportion.webp',
    title: 'Ratio & Proportion // Mindmap',
    badge: 'ARITHMETIC · EPISODE 10',
    badgeClass: 'bg-lime-500/15 text-lime-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Clean modular layout combining book endorsement with urgent exam syllabus completion.',
    lightboxTitle: 'RATIO & PROPORTION // Mindmap Series Ep. 10',
    lightboxDesc: 'Clean modular layout combining book endorsement with urgent exam syllabus completion.'
  },
  {
    category: 'education',
    img: 'assets/images/education/edu-sudarshana-series-launch.webp',
    title: 'Sudarshana Series // Lecture 2',
    badge: 'SPECIAL · 100 CONCEPTS',
    badgeClass: 'bg-yellow-500/15 text-yellow-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Iconic golden wheel motif symbolizing complete syllabus mastery and high retention.',
    lightboxTitle: 'SUDARSHANA SERIES // 100 Golden Concepts',
    lightboxDesc: 'Iconic golden wheel motif symbolizing complete syllabus mastery and high retention.'
  },
  {
    category: 'education',
    img: 'assets/images/education/edu-ssc-cgl-notification-out.webp',
    title: 'SSC CGL 2026 // Big Changes',
    badge: 'BREAKING NEWS · URGENCY',
    badgeClass: 'bg-red-500/15 text-red-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Instant-action alert framing with official document proof and tripartite breakdown badges.',
    lightboxTitle: 'SSC CGL 2026 // Major Notification Changes',
    lightboxDesc: 'Instant-action alert framing with official document proof and tripartite breakdown badges.'
  },

  // ALBUM COVERS (6)
  {
    category: 'album-covers',
    img: 'assets/images/album-covers/album-fuck-em-all.webp',
    title: 'Fuck \'Em All // Ankit Dhiman',
    badge: 'TRENDING · SPOTIFY #1',
    badgeClass: 'bg-rose-500/15 text-rose-400',
    aspect: 'aspect-square',
    ratioLabel: '1:1 Master',
    desc: 'High-energy album packaging featuring skull flame typography and explicit parental advisory layout.',
    lightboxTitle: 'FUCK \'EM ALL // Breaking Bad Album Cover',
    lightboxDesc: 'Defiant flame aesthetic, skeletal motif, and Spotify #1 trending single packaging designed by @thepankaj.z.'
  },
  {
    category: 'album-covers',
    img: 'assets/images/album-covers/album-rebirth.webp',
    title: 'Rebirth // Ankit Dhiman',
    badge: 'ALBUM · SPOTIFY #1',
    badgeClass: 'bg-red-500/15 text-red-400',
    aspect: 'aspect-square',
    ratioLabel: '1:1 Master',
    desc: 'Hyper-saturated electric skull visual hierarchy engineered for dark mode streaming platforms.',
    lightboxTitle: 'REBIRTH // Breaking Bad Album Cover',
    lightboxDesc: 'Hyper-saturated electric skull visual hierarchy engineered for dark mode streaming platforms designed by @thepankaj.z.'
  },
  {
    category: 'album-covers',
    img: 'assets/images/album-covers/album-santaflow.webp',
    title: 'Santaflow // Ankit Dhiman',
    badge: 'VIRAL · SPOTIFY #1',
    badgeClass: 'bg-emerald-500/15 text-emerald-400',
    aspect: 'aspect-square',
    ratioLabel: '1:1 Master',
    desc: 'Vibrant acid-green calavera portrait composition with distressed grunge typography.',
    lightboxTitle: 'SANTAFLOW // Breaking Bad Album Cover',
    lightboxDesc: 'Neon toxic green Day-of-the-Dead sugar skull illustration with smoke wisps designed by @thepankaj.z.'
  },
  {
    category: 'album-covers',
    img: 'assets/images/album-covers/album-badass.webp',
    title: 'Badass // Ankit Dhiman',
    badge: 'HIP-HOP · SPOTIFY #1',
    badgeClass: 'bg-red-500/15 text-red-400',
    aspect: 'aspect-square',
    ratioLabel: '1:1 Master',
    desc: 'Underground drill/trap cover art with bucket hat, balaclava detail and textured distress.',
    lightboxTitle: 'BADASS // Breaking Bad Album Cover',
    lightboxDesc: 'Tactical streetwear masked persona with cuban chain and diamond balaclava designed by @thepankaj.z.'
  },
  {
    category: 'album-covers',
    img: 'assets/images/album-covers/album-habibi-lips.webp',
    title: 'Habibi (Lips) // Ankit Dhiman',
    badge: 'SINGLE · TRENDING',
    badgeClass: 'bg-pink-500/15 text-pink-400',
    aspect: 'aspect-square',
    ratioLabel: '1:1 Master',
    desc: 'Sensory hyper-realistic lip illustration with gothic cassette nostalgia and media player controls.',
    lightboxTitle: 'HABIBI // Dripping Lips Edition Cover',
    lightboxDesc: 'High-gloss dripping latex lips with crimson tongue and atmospheric lightning designed by @thepankaj.z.'
  },
  {
    category: 'album-covers',
    img: 'assets/images/album-covers/album-habibi-ghost.webp',
    title: 'Habibi (Ghost) // Ankit Dhiman',
    badge: 'EDITION · STREAMING',
    badgeClass: 'bg-purple-500/15 text-purple-300',
    aspect: 'aspect-square',
    ratioLabel: '1:1 Master',
    desc: 'Clean vector ghost character paired with atmospheric cloud backdrop and cassette motifs.',
    lightboxTitle: 'HABIBI // Street Ghost Edition Cover',
    lightboxDesc: 'Minimalist cool ghost in shades over deep crimson thunderclouds designed by @thepankaj.z.'
  },

  // FINANCE (3)
  {
    category: 'finance',
    img: 'assets/images/finance/fin-batman-trading-strategy.webp',
    title: 'Batman Trading Strategy // Setup',
    badge: 'TRADING · 94% WIN RATE',
    badgeClass: 'bg-amber-500/15 text-amber-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Cinematic Batman cowl visual anchor paired with institutional order-flow candlestick charts.',
    lightboxTitle: 'BATMAN TRADING STRATEGY // High Win-Rate Setup',
    lightboxDesc: 'High-contrast cinematic branding combining dark knight symbolism with technical candlestick breakouts.'
  },
  {
    category: 'finance',
    img: 'assets/images/finance/fin-fastest-way-10k-month.webp',
    title: 'Fastest Way To $10,000/Mo',
    badge: 'WEALTH · HIGH CTR',
    badgeClass: 'bg-emerald-500/15 text-emerald-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Cash stack visual focal point with clean typography and high-curiosity contrast grading.',
    lightboxTitle: 'FASTEST WAY TO $10K/MO // Trading Roadmap',
    lightboxDesc: 'High-conversion monetary narrative visual engineered for finance and algorithmic trading creators.'
  },
  {
    category: 'finance',
    img: 'assets/images/finance/fin-working-people-trading-strategy.webp',
    title: 'Trading For 9-To-5 Workers',
    badge: 'PASSIVE · SWING SYSTEM',
    badgeClass: 'bg-cyan-500/15 text-cyan-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Corporate laptop lifestyle contrast with urgent green P&L alert badge for busy professionals.',
    lightboxTitle: '9-TO-5 TRADING SYSTEM // Strategy for Working Professionals',
    lightboxDesc: 'Clean corporate-to-trader transformation narrative engineered for working professional audiences.'
  },

  // FITNESS (6)
  {
    category: 'fitness',
    img: 'assets/images/fitness/fitness-steroids-vs-sarms.webp',
    title: 'Steroids vs SARMs // Raw Truth',
    badge: 'PHYSIQUE · VIRAL DEBATE',
    badgeClass: 'bg-red-500/15 text-red-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Dramatic biological contrast and high-retention thumbnail packaging for fitness educators.',
    lightboxTitle: 'STEROIDS VS SARMS // Chemical Truth Breakdown',
    lightboxDesc: 'Split-screen chemical compounds vs syringe clash with intense anatomical vascularity lighting.'
  },
  {
    category: 'fitness',
    img: 'assets/images/fitness/fitness-hypper-nation-supplements.webp',
    title: 'Hypper Nation Supplements',
    badge: 'BRAND · COMMERCIAL AD',
    badgeClass: 'bg-blue-500/15 text-blue-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Aggressive athletic lighting, heavy tub packaging showcase, and hardcore physique framing.',
    lightboxTitle: 'HYPPER NATION // Extreme Performance Supplements',
    lightboxDesc: 'High-energy performance supplement campaign designed for e-commerce and retail promotion.'
  },
  {
    category: 'fitness',
    img: 'assets/images/fitness/fitness-nutrition-108-brand-logo.webp',
    title: 'Nutrition 108 // Brand Identity',
    badge: 'IDENTITY · BRAND MARK',
    badgeClass: 'bg-amber-500/15 text-amber-400',
    aspect: 'aspect-square',
    ratioLabel: '1:1 Master',
    desc: 'Minimalist bull horn shield emblem with clean geometric typography for elite sports nutrition.',
    lightboxTitle: 'NUTRITION 108 // Premium Supplement Brand Identity',
    lightboxDesc: 'Vector brandmark and premium label identity engineered for sports supplement product lines.'
  },
  {
    category: 'fitness',
    img: 'assets/images/fitness/fitness-top-5-gainers-ronnie-kevin.webp',
    title: 'Top 5 Mass Gainers // Ronnie vs Kevin',
    badge: 'BODYBUILDING · TITAN CLASH',
    badgeClass: 'bg-yellow-500/15 text-yellow-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Mr. Olympia stage presence, thunderous lightning rim effects, and lab-certified rating cards.',
    lightboxTitle: 'TOP 5 MASS GAINERS // Ronnie Coleman & Kevin Levrone',
    lightboxDesc: 'Legendary Olympia titan packaging with high-contrast electric rim lighting and product rankings.'
  },
  {
    category: 'fitness',
    img: 'assets/images/fitness/fitness-independence-combo-sale.webp',
    title: 'Freedom From Fat // Independence Sale',
    badge: 'CAMPAIGN · FLASH SALE',
    badgeClass: 'bg-emerald-500/15 text-emerald-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Tricolor saffron-green energetic gradient typography with unboxed shaker and supplement combo.',
    lightboxTitle: 'FREEDOM FROM FAT // Independence Day Mega Deal',
    lightboxDesc: 'High-converting commercial festival campaign asset engineered for seasonal D2C revenue spikes.'
  },
  {
    category: 'fitness',
    img: 'assets/images/fitness/fitness-top-5-creatine-lab-tested.webp',
    title: 'Top 5 Creatines // Lab Tested',
    badge: 'SUPPLEMENTS · LAB TESTED',
    badgeClass: 'bg-cyan-500/15 text-cyan-400',
    aspect: 'aspect-video',
    ratioLabel: '16:9 4K',
    desc: 'Green check vs red cross trust badges with gold medal #1 award badge for consumer confidence.',
    lightboxTitle: 'TOP 5 CREATINE BRANDS // Lab Tested Purity Comparison',
    lightboxDesc: 'Consumer authority review graphic with trust verification icons and high CTR layout.'
  },

  // BOOK COVERS (2)
  {
    category: 'book-covers',
    img: 'assets/images/book-covers/book-beginners-guide-investing.webp',
    title: 'Beginner\'s Guide To Investing',
    badge: 'PUBLISHING · BESTSELLER',
    badgeClass: 'bg-emerald-500/15 text-emerald-400',
    aspect: 'aspect-[2/3]',
    ratioLabel: 'Portrait 2:3',
    desc: 'Minimalist emerald bull motif with crisp gold-embossed typography for retail investors.',
    lightboxTitle: 'BEGINNER\'S GUIDE TO INVESTING // Complete Wealth Handbook',
    lightboxDesc: 'Hardcover & Kindle e-book jacket design with sophisticated typography and bullion bull mascot.'
  },
  {
    category: 'book-covers',
    img: 'assets/images/book-covers/book-dummies-guide-investing.webp',
    title: 'Investing For Dummies // Practical Guide',
    badge: 'FINANCE · PRINT & EBOOK',
    badgeClass: 'bg-amber-500/15 text-amber-400',
    aspect: 'aspect-[2/3]',
    ratioLabel: 'Portrait 2:3',
    desc: 'Modernized bold typographic edition with clear step-by-step wealth creation messaging.',
    lightboxTitle: 'INVESTING FOR DUMMIES // Practical Financial Roadmap',
    lightboxDesc: 'Editorial cover art balancing approachable accessibility with authoritative financial pedigree.'
  }
];

// Top 10 Highlight Items for the Moving Carousel
const carouselHighlights = [
  allCards[8],  // Fuck 'Em All
  allCards[14], // Batman Trading
  allCards[0],  // My First Book
  allCards[17], // Steroids vs SARMs
  allCards[23], // Beginner's Guide To Investing
  allCards[9],  // Rebirth
  allCards[15], // Fastest Way to $10k/mo
  allCards[1],  // Big Billion Sale
  allCards[18], // Hypper Nation
  allCards[10], // Santaflow
  allCards[20], // Top 5 Mass Gainers
  allCards[19], // Nutrition 108 Brand Logo
];

// Helper to escape single quotes in JS strings
function escapeJs(str) {
  return str.replace(/'/g, "\\'");
}

// Generate Carousel HTML
function renderCarousel() {
  const renderItem = (item) => `
    <div class="design-carousel-card group relative w-[240px] sm:w-[280px] shrink-0 rounded-2xl overflow-hidden theme-card border border-black/10 dark:border-white/10 hover:border-[#FF4E00] transition-all hover:shadow-xl hover:shadow-[#FF4E00]/20 flex flex-col justify-between cursor-pointer" onclick="openLightbox('${CDN_PREFIX + item.img}', '${escapeJs(item.lightboxTitle)}', '${escapeJs(item.lightboxDesc)}')">
        <div class="${item.aspect} w-full overflow-hidden bg-slate-950 relative">
            <img src="${CDN_PREFIX + item.img}" alt="${item.title}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span class="text-[10px] font-mono text-white flex items-center gap-1 font-bold">
                    <svg class="w-3 h-3 text-[#FF4E00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    Full HD Preview
                </span>
            </div>
        </div>
        <div class="p-3 space-y-1">
            <div class="flex items-center justify-between text-[9.5px] font-mono">
                <span class="px-2 py-0.5 rounded-full ${item.badgeClass} font-bold">${item.badge}</span>
                <span class="text-slate-400">${item.ratioLabel}</span>
            </div>
            <h4 class="font-display text-xs font-bold text-slate-900 dark:text-[#F5F2ED] group-hover:text-[#FF4E00] transition-colors truncate">
                ${item.title}
            </h4>
        </div>
    </div>
  `;

  // Duplicate for seamless infinite wrapping
  const repeated = [...carouselHighlights, ...carouselHighlights].map(renderItem).join('\n');

  return `
                <!-- =========================================================================
                     MOVING SHOWCASE CAROUSEL (HIGHLIGHT REEL ACROSS ALL NICHES)
                     ========================================================================= -->
                <div class="space-y-3 pt-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4E00]/10 text-[#FF4E00] text-[10.5px] sm:text-xs font-mono font-bold tracking-wider uppercase border border-[#FF4E00]/20">
                                <span class="w-1.5 h-1.5 rounded-full bg-[#FF4E00] animate-pulse"></span>
                                Creative Highlights · Auto-Sliding Reel
                            </span>
                            <span class="text-slate-400 dark:text-white/20 hidden sm:inline">·</span>
                            <span class="text-[11px] font-mono text-slate-500 dark:text-white/50 hidden sm:inline">Continuous 60FPS loop · Hover to pause · Tap to inspect</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button onclick="scrollDesignCarousel(-1)" aria-label="Slide Left" class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#FF4E00] hover:text-white flex items-center justify-center transition-all cursor-pointer">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                            <button onclick="scrollDesignCarousel(1)" aria-label="Slide Right" class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#FF4E00] hover:text-white flex items-center justify-center transition-all cursor-pointer">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Carousel Track Container -->
                    <div id="design-carousel-wrapper" class="relative w-full overflow-hidden rounded-2xl py-3 group/dtrack border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-[#07070A]/50">
                        <div id="design-carousel-container" class="w-full overflow-x-hidden no-scrollbar px-3 sm:px-4" style="scroll-behavior: smooth;">
                            <div id="design-carousel-track" class="flex gap-3.5 sm:gap-4 w-max py-1 items-center">
${repeated}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- =========================================================================
                     NICHE FILTER PILLS & DYNAMIC REVEAL CONTROLLER
                     (Images show only when a niche pill is tapped - no massive dump)
                     ========================================================================= -->
                <div class="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="space-y-1">
                            <span class="text-[11px] font-mono uppercase tracking-wider text-[#FF4E00] font-bold">Select Creative Niche</span>
                            <p id="design-category-status" class="text-xs text-slate-600 dark:text-[#F5F2ED]/70 font-mono">
                                Showing <span class="font-bold text-slate-900 dark:text-white">Education</span> (8 works) · Tap any niche pill to switch views.
                            </p>
                        </div>
                        <div class="text-[11px] font-mono text-slate-400 dark:text-white/40">
                            Single-Niche Focus · Zero Clutter
                        </div>
                    </div>

                    <!-- Niche Selector Pills -->
                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        <button id="pill-education" onclick="filterDesignWorks('education', this)" class="design-filter-btn active px-4 py-2 rounded-full text-xs font-mono font-bold tracking-tight bg-[#FF4E00] text-white shadow-md shadow-[#FF4E00]/25 transition-all cursor-pointer">
                            Education (8)
                        </button>
                        <button id="pill-album-covers" onclick="filterDesignWorks('album-covers', this)" class="design-filter-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Album Covers (6)
                        </button>
                        <button id="pill-finance" onclick="filterDesignWorks('finance', this)" class="design-filter-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Finance &amp; Trading (3)
                        </button>
                        <button id="pill-fitness" onclick="filterDesignWorks('fitness', this)" class="design-filter-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Fitness &amp; Lifestyle (6)
                        </button>
                        <button id="pill-book-covers" onclick="filterDesignWorks('book-covers', this)" class="design-filter-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Book Covers (2)
                        </button>
                    </div>
                </div>

                <!-- RESPONSIVE HIGH-IMPACT GALLERY GRID (Filtered by Active Niche Pill) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 min-h-[300px]">
`;
}

// Generate Grid HTML for all 25 cards
function renderGridCards() {
  return allCards.map(c => `
                    <!-- ${c.title} (${c.category}) -->
                    <div class="design-work-card group relative rounded-2xl overflow-hidden theme-card border border-black/10 dark:border-white/10 hover:border-[#FF4E00] transition-all hover:shadow-2xl hover:shadow-[#FF4E00]/20 flex flex-col justify-between cursor-pointer" data-category="${c.category}" onclick="openLightbox('${CDN_PREFIX + c.img}', '${escapeJs(c.lightboxTitle)}', '${escapeJs(c.lightboxDesc)}')">
                        <div class="${c.aspect} w-full overflow-hidden bg-slate-950 relative">
                            <img src="${CDN_PREFIX + c.img}" alt="${c.title}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                <span class="text-[11px] font-mono text-white flex items-center gap-1.5 font-bold">
                                    <svg class="w-3.5 h-3.5 text-[#FF4E00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                                    Click to inspect in Full HD
                                </span>
                            </div>
                        </div>
                        <div class="p-4 space-y-1.5">
                            <div class="flex items-center justify-between text-[10px] font-mono">
                                <span class="px-2 py-0.5 rounded-full ${c.badgeClass} font-bold">${c.badge}</span>
                                <span class="text-slate-400">${c.ratioLabel}</span>
                            </div>
                            <h4 class="font-display text-sm font-bold text-slate-900 dark:text-[#F5F2ED] group-hover:text-[#FF4E00] transition-colors">
                                ${c.title}
                            </h4>
                            <p class="text-[11px] text-slate-500 dark:text-[#F5F2ED]/60 line-clamp-2">
                                ${c.desc}
                            </p>
                        </div>
                    </div>
  `).join('\n') + '\n                </div>';
}

const newDesignBlock = renderCarousel() + renderGridCards();

// Now locate the start and end of the block in index.html:
// Start: '<!-- CATEGORY FILTER PILLS -->'
// End: up to just before '<!-- Bottom Contextual Action Strip -->'

const startMarker = html.includes('<!-- CATEGORY FILTER PILLS -->') ? '<!-- CATEGORY FILTER PILLS -->' : '<!-- =========================================================================\n                     MOVING SHOWCASE CAROUSEL';
const endMarker = '<!-- Bottom Contextual Action Strip -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find markers in index.html!");
  process.exit(1);
}

// Replace the block
html = html.substring(0, startIndex) + newDesignBlock + '\n\n                ' + html.substring(endIndex);

const scriptStartIndex = html.includes('const designCategoryMeta =') ? html.indexOf('const designCategoryMeta =') : html.indexOf('function filterDesignWorks(category, btnEl) {');

if (scriptStartIndex === -1) {
  console.error("Could not find filterDesignWorks in index.html!");
  process.exit(1);
}

// Find close of filterDesignWorks function or replace the entire block inside <script>
const newScript = `// Category Metadata
  const designCategoryMeta = {
    'education': { name: 'Education', count: 8 },
    'album-covers': { name: 'Album Covers', count: 6 },
    'finance': { name: 'Finance & Trading', count: 3 },
    'fitness': { name: 'Fitness & Lifestyle', count: 6 },
    'book-covers': { name: 'Book Covers', count: 2 }
  };

  // Filter Design Works (Only shows cards of the clicked niche)
  function filterDesignWorks(category, btnEl) {
    document.querySelectorAll('.design-filter-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-[#FF4E00]', 'text-white', 'shadow-md', 'shadow-[#FF4E00]/25');
      btn.classList.add('theme-pressed', 'text-slate-700', 'dark:text-[#F5F2ED]/70');
    });
    if (btnEl) {
      btnEl.classList.add('active', 'bg-[#FF4E00]', 'text-white', 'shadow-md', 'shadow-[#FF4E00]/25');
      btnEl.classList.remove('theme-pressed', 'text-slate-700', 'dark:text-[#F5F2ED]/70');
    }

    const cards = document.querySelectorAll('.design-work-card');
    cards.forEach(card => {
      const cardCats = (card.getAttribute('data-category') || '').trim().split(/\\s+/);
      if (cardCats.includes(category)) {
        card.style.display = 'flex';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    const statusEl = document.getElementById('design-category-status');
    if (statusEl && designCategoryMeta[category]) {
      const info = designCategoryMeta[category];
      statusEl.innerHTML = 'Showing <span class="font-bold text-slate-900 dark:text-white">' + info.name + '</span> (' + info.count + ' works) · Tap any niche pill to switch views.';
    }
  }

  // Moving Showcase Reel (Continuous 60FPS loop with pause on hover)
  let designCarouselPaused = false;
  let designCarouselResumeTimer = null;

  function initDesignCarousel() {
    const container = document.getElementById('design-carousel-container');
    if (!container) return;

    container.addEventListener('mouseenter', () => { designCarouselPaused = true; });
    container.addEventListener('mouseleave', () => {
      if (!designCarouselResumeTimer) designCarouselPaused = false;
    });
    container.addEventListener('touchstart', () => { designCarouselPaused = true; }, { passive: true });
    container.addEventListener('touchend', () => {
      if (!designCarouselResumeTimer) designCarouselPaused = false;
    }, { passive: true });

    function autoScroll() {
      if (!designCarouselPaused && container) {
        container.scrollLeft += 0.85;
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0 && container.scrollLeft >= halfWidth) {
          container.scrollLeft = 0;
        }
      }
      requestAnimationFrame(autoScroll);
    }
    requestAnimationFrame(autoScroll);
  }

  function scrollDesignCarousel(direction) {
    const container = document.getElementById('design-carousel-container');
    if (!container) return;
    designCarouselPaused = true;
    clearTimeout(designCarouselResumeTimer);

    const step = window.innerWidth < 640 ? 260 : 320;
    const halfWidth = container.scrollWidth / 2;

    if (direction < 0 && container.scrollLeft <= 20 && halfWidth > 0) {
      container.scrollLeft = halfWidth;
    }

    container.scrollBy({ left: direction * step, behavior: 'smooth' });

    designCarouselResumeTimer = setTimeout(() => {
      designCarouselResumeTimer = null;
      if (halfWidth > 0 && container.scrollLeft >= halfWidth) {
        container.scrollLeft = container.scrollLeft - halfWidth;
      }
      designCarouselPaused = false;
    }, 3500);
  }

  // Auto-initialize carousel and default filter on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDesignCarousel();
      const defaultPill = document.getElementById('pill-education');
      if (defaultPill) filterDesignWorks('education', defaultPill);
    });
  } else {
    initDesignCarousel();
    const defaultPill = document.getElementById('pill-education');
    if (defaultPill) filterDesignWorks('education', defaultPill);
  }`;

// Find the lightbox code that starts after filterDesignWorks
const lightboxStart = '// HD Lightbox Controller';
const lightboxIndex = html.indexOf(lightboxStart);

if (lightboxIndex === -1) {
  console.error("Could not find HD Lightbox Controller in index.html!");
  process.exit(1);
}

// Replace the filterDesignWorks function area with newScript
html = html.substring(0, scriptStartIndex) + newScript + '\n\n  ' + html.substring(lightboxIndex);

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully rebuilt #design section in index.html!");
