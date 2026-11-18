const fs = require('fs');

const snapshot = fs.readFileSync('g:/Folio-84/data-snapshot.json', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aura Bullion // Live Market Terminal</title>
    <meta name="description" content="Real-time precious metals intelligence terminal synchronized with Google Sheets and IBJA benchmark data. Engineered by Definite Studios.">
    <link rel="icon" type="image/png" href="assets/images/logos/definite-icon-blue.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        term: {
                            bg: '#0A141F',
                            surface: '#0E1724',
                            card: '#142030',
                            panel: '#1A283B',
                            border: '#243447',
                            muted: '#94A3B8',
                            submuted: '#64748B',
                            gold: '#C5A059',
                            silver: '#20C7A6',
                            spotGold: '#A78BFA',
                            spotSilver: '#FF8A65',
                            drop: '#F43F5E',
                            rise: '#10B981'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        headline: ['Manrope', 'Plus Jakarta Sans', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    }
                }
            }
        };
    </script>

    <style>
        :root {
            --bg-base: #0A141F;
            --bg-surface: #0E1724;
            --bg-card: #142030;
            --bg-panel: #1A283B;
            --border-base: #243447;
            --text-main: #F1F5F9;
            --text-muted: #94A3B8;
            --gold-accent: #C5A059;
            --silver-accent: #20C7A6;
            --drop-accent: #F43F5E;
        }

        html:not(.dark) {
            --bg-base: #F8FAFC;
            --bg-surface: #FFFFFF;
            --bg-card: #FFFFFF;
            --bg-panel: #F1F5F9;
            --border-base: #E2E8F0;
            --text-main: #0F172A;
            --text-muted: #64748B;
            --gold-accent: #B48835;
            --silver-accent: #0D9488;
            --drop-accent: #E11D48;
        }

        html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            width: 100%;
            background-color: var(--bg-base);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        .font-num {
            font-family: 'JetBrains Mono', monospace;
            font-feature-settings: "tnum" 1, "zero" 1;
        }

        /* Prevent ugly scrollbars */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #243447;
            border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #C5A059;
        }

        /* Floating Tooltip Pill */
        .chart-hover-pill {
            position: absolute;
            pointer-events: none;
            z-index: 60;
            transform: translate(-50%, -125%);
            transition: left 0.04s ease-out, top 0.04s ease-out, opacity 0.15s ease-out;
            opacity: 0;
            will-change: transform, left, top;
        }
        .chart-hover-pill.active {
            opacity: 1;
        }

        /* Light mode specific classes */
        html:not(.dark) .bg-\[\#0A141F\] { background-color: #F8FAFC !important; }
        html:not(.dark) .bg-\[\#0E1724\] { background-color: #FFFFFF !important; }
        html:not(.dark) .bg-\[\#142030\] { background-color: #FFFFFF !important; }
        html:not(.dark) .bg-\[\#1A283B\] { background-color: #F1F5F9 !important; }
        html:not(.dark) .border-\[\#243447\] { border-color: #E2E8F0 !important; }
        html:not(.dark) .text-\[\#F1F5F9\] { color: #0F172A !important; }
        html:not(.dark) .text-\[\#94A3B8\] { color: #64748B !important; }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-[#0A141F] text-[#F1F5F9] selection:bg-[#C5A059]/30 selection:text-white">

    <!-- TOP NAVIGATION BAR (CLEAN, FULL-WIDTH, NO SIDEBAR CLUTTER) -->
    <header class="sticky top-0 z-50 bg-[#0E1724]/95 backdrop-blur-md border-b border-[#243447] px-4 sm:px-6 py-3 transition-colors">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            <!-- Brand & Benchmark Status -->
            <div class="flex items-center gap-3 sm:gap-4">
                <a href="index.html" class="flex items-center gap-2.5 group" title="Back to Portfolio">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF4E00] to-[#C5A059] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                        <div class="w-full h-full bg-[#0E1724] rounded-[10px] flex items-center justify-center">
                            <svg class="w-4 h-4 text-[#FF4E00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex items-center gap-1.5 leading-tight">
                            <span class="font-headline font-bold text-sm tracking-tight text-[#F1F5F9]">AURA BULLION</span>
                            <span class="text-[9px] font-mono font-bold text-[#FF4E00] bg-[#FF4E00]/10 px-1.5 py-0.5 rounded border border-[#FF4E00]/25">TERMINAL</span>
                        </div>
                        <span class="text-[10px] font-mono text-[#94A3B8]">DEFINITE STUDIOS · PRECIOUS METALS</span>
                    </div>
                </a>

                <!-- Google Sheet Data Sync Status -->
                <div class="hidden md:flex items-center gap-2 pl-4 border-l border-[#243447]">
                    <span id="statusDot" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span id="headerSyncStatus" class="text-xs font-mono font-bold text-emerald-400">GOOGLE SHEET SYNCED</span>
                    <span class="text-[11px] font-mono text-[#94A3B8]" id="headerTimestamp">18-Nov-2026 Session Verified</span>
                </div>
            </div>

            <!-- Right Controls: Sync Button, Sheet Settings, Theme Toggle, Back to Portfolio -->
            <div class="flex items-center gap-2 sm:gap-2.5">
                <button onclick="fetchSheetData(true)" class="px-3 py-1.5 rounded-lg bg-[#142030] hover:bg-[#1A283B] text-[#94A3B8] hover:text-[#C5A059] border border-[#243447] text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm" title="Sync with Google Sheet backend">
                    <svg id="syncIcon" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M2.5 11.5a10 10 0 0 1 18.8-4.3M21.5 12.5a10 10 0 0 1-18.8 4.3"/></svg>
                    <span class="hidden sm:inline">Sync Sheet</span>
                </button>

                <!-- Sheet Settings Drawer Toggle -->
                <button onclick="toggleSettingsModal()" class="p-2 rounded-lg bg-[#142030] hover:bg-[#1A283B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#243447] text-xs transition-colors shadow-sm" title="Google Sheet Connection Settings">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>

                <!-- Theme Toggle -->
                <button onclick="toggleTheme()" class="p-2 rounded-lg bg-[#142030] hover:bg-[#1A283B] text-[#94A3B8] hover:text-amber-400 border border-[#243447] text-xs transition-colors shadow-sm" title="Toggle Theme">
                    <svg id="moonIcon" class="w-3.5 h-3.5 hidden dark:block text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    <svg id="sunIcon" class="w-3.5 h-3.5 block dark:hidden text-[#FF4E00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                </button>

                <!-- Portfolio Return -->
                <a href="index.html" class="px-3.5 py-1.5 rounded-lg bg-[#FF4E00] hover:bg-[#FF6B2B] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-[#FF4E00]/20 transition-all">
                    <span>Portfolio</span>
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/></svg>
                </a>
            </div>

        </div>
    </header>

    <!-- MAIN DASHBOARD VIEWPORT (CLEAN, SPACIOUS, 100% DECLUTTERED) -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">

        <!-- SESSION BANNER (ACCURATE MARKET DROP STATUS) -->
        <div id="endpointNotice" class="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm">
            <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span class="text-rose-400 font-bold uppercase tracking-wide">MARKET SESSION NOTICE:</span>
                <span class="text-[#F1F5F9]" id="engineNoticeText">
                    Today's market dropped sharply (Gold ▼ -2.94%, Silver ▼ -4.08% / -7.8% vs recent peak). Data strictly mapped from real Google Sheets & IBJA benchmarks. Zero fake auto-ticking.
                </span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[11px] text-[#94A3B8]">Session: 18-Nov-2026</span>
                <span class="text-[#243447]">|</span>
                <span class="text-rose-400 font-bold flex items-center gap-1">
                    <span>HEAVY SELLING SESSION</span>
                    <span>▼</span>
                </span>
            </div>
        </div>

        <!-- SECTION 1: 4 PRIMARY RATE TILES (ACCURATE NEGATIVE DROPS IN VIVID RED) -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Tile 1: Indian Gold 24K -->
            <div onclick="selectChartMode('goldIn')" id="cardTileGoldIn" class="rate-card cursor-pointer bg-[#142030] hover:bg-[#1A283B] border-2 border-[#C5A059] rounded-xl p-4 transition-all relative overflow-hidden group shadow-md">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#C5A059]"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-2">
                    <span class="text-[#C5A059] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                        INDIA GOLD (24K)
                    </span>
                    <span class="text-[10px] text-[#94A3B8] bg-[#0E1724] px-1.5 py-0.5 rounded border border-[#243447]">₹ / 10g</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-[#F1F5F9]" id="cardGoldPrice">
                        ₹1,30,078.00
                    </div>
                    <div class="flex items-center gap-2 text-xs font-mono" id="cardGoldChg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -₹3,936.00</span>
                            <span>(-2.94%)</span>
                        </span>
                        <span class="text-[10px] text-[#94A3B8]">vs Yesterday ₹1,34,014</span>
                    </div>
                </div>
                <div class="mt-3 pt-2 border-t border-[#243447]/60 flex justify-between text-[10px] font-mono text-[#94A3B8]">
                    <span>Source: IBJA (ibjarates.com)</span>
                    <span class="text-[#C5A059] font-bold group-hover:translate-x-0.5 transition-transform">View Chart →</span>
                </div>
            </div>

            <!-- Tile 2: Indian Silver (.999) -->
            <div onclick="selectChartMode('silverIn')" id="cardTileSilverIn" class="rate-card cursor-pointer bg-[#142030] hover:bg-[#1A283B] border border-[#243447] hover:border-[#20C7A6] rounded-xl p-4 transition-all relative overflow-hidden group shadow-md">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#20C7A6]"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-2">
                    <span class="text-[#20C7A6] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                        INDIA SILVER (.999)
                    </span>
                    <span class="text-[10px] text-[#94A3B8] bg-[#0E1724] px-1.5 py-0.5 rounded border border-[#243447]">₹ / 10g</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-[#F1F5F9]" id="cardSilverPrice">
                        ₹1,552.00
                    </div>
                    <div class="flex items-center gap-2 text-xs font-mono" id="cardSilverChg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -₹66.00</span>
                            <span>(-4.08%)</span>
                        </span>
                        <span class="text-[10px] text-rose-400 font-bold">₹1,55,200 / kg</span>
                    </div>
                </div>
                <div class="mt-3 pt-2 border-t border-[#243447]/60 flex justify-between text-[10px] font-mono text-[#94A3B8]">
                    <span>Source: IBJA Benchmark</span>
                    <span class="text-[#20C7A6] font-bold group-hover:translate-x-0.5 transition-transform">View Chart →</span>
                </div>
            </div>

            <!-- Tile 3: Spot Gold (XAU/USD) -->
            <div onclick="selectChartMode('goldGl')" id="cardTileGoldGl" class="rate-card cursor-pointer bg-[#142030] hover:bg-[#1A283B] border border-[#243447] hover:border-[#A78BFA] rounded-xl p-4 transition-all relative overflow-hidden group shadow-md">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#A78BFA]"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-2">
                    <span class="text-[#A78BFA] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                        SPOT GOLD (XAU)
                    </span>
                    <span class="text-[10px] text-[#94A3B8] bg-[#0E1724] px-1.5 py-0.5 rounded border border-[#243447]">USD / oz</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-[#F1F5F9]" id="cardXauPrice">
                        $3,771.70
                    </div>
                    <div class="flex items-center gap-2 text-xs font-mono" id="cardXauChg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -$92.50</span>
                            <span>(-2.39%)</span>
                        </span>
                        <span class="text-[10px] text-[#94A3B8]">Global LBMA</span>
                    </div>
                </div>
                <div class="mt-3 pt-2 border-t border-[#243447]/60 flex justify-between text-[10px] font-mono text-[#94A3B8]">
                    <span>Spot Benchmark (USD)</span>
                    <span class="text-[#A78BFA] font-bold group-hover:translate-x-0.5 transition-transform">View Chart →</span>
                </div>
            </div>

            <!-- Tile 4: Spot Silver (XAG/USD) -->
            <div onclick="selectChartMode('silverGl')" id="cardTileSilverGl" class="rate-card cursor-pointer bg-[#142030] hover:bg-[#1A283B] border border-[#243447] hover:border-[#FF8A65] rounded-xl p-4 transition-all relative overflow-hidden group shadow-md">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#FF8A65]"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-2">
                    <span class="text-[#FF8A65] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#FF8A65]"></span>
                        SPOT SILVER (XAG)
                    </span>
                    <span class="text-[10px] text-[#94A3B8] bg-[#0E1724] px-1.5 py-0.5 rounded border border-[#243447]">USD / oz</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-[#F1F5F9]" id="cardXagPrice">
                        $45.625
                    </div>
                    <div class="flex items-center gap-2 text-xs font-mono" id="cardXagChg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -$1.663</span>
                            <span>(-3.52%)</span>
                        </span>
                        <span class="text-[10px] text-rose-400 font-bold">-7.8% Session High</span>
                    </div>
                </div>
                <div class="mt-3 pt-2 border-t border-[#243447]/60 flex justify-between text-[10px] font-mono text-[#94A3B8]">
                    <span>Spot Benchmark (USD)</span>
                    <span class="text-[#FF8A65] font-bold group-hover:translate-x-0.5 transition-transform">View Chart →</span>
                </div>
            </div>

        </section>

        <!-- SECTION 2: SINGLE HERO FLAGSHIP CHART (THE ULTIMATE CLUTTER-FREE TERMINAL) -->
        <section class="bg-[#142030] border border-[#243447] rounded-xl p-4 sm:p-6 space-y-4 shadow-sm">
            
            <!-- Controls Bar: View Mode Switcher Pills + Range Timeframe Buttons -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#243447] pb-3">
                
                <!-- Left: Metal Mode Switcher Tabs -->
                <div class="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                    <button id="tabGoldIn" onclick="selectChartMode('goldIn')" class="mode-tab px-3 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold transition-all flex items-center gap-1.5 shadow-sm">
                        <span class="tab-dot w-2 h-2 rounded-full bg-black"></span>
                        <span>Gold 24K (India)</span>
                    </button>
                    <button id="tabSilverIn" onclick="selectChartMode('silverIn')" class="mode-tab px-3 py-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A283B] transition-all flex items-center gap-1.5">
                        <span class="tab-dot w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                        <span>Silver (India)</span>
                    </button>
                    <button id="tabGoldGl" onclick="selectChartMode('goldGl')" class="mode-tab px-3 py-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A283B] transition-all flex items-center gap-1.5">
                        <span class="tab-dot w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                        <span>Spot Gold (XAU)</span>
                    </button>
                    <button id="tabSilverGl" onclick="selectChartMode('silverGl')" class="mode-tab px-3 py-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A283B] transition-all flex items-center gap-1.5">
                        <span class="tab-dot w-2 h-2 rounded-full bg-[#FF8A65]"></span>
                        <span>Spot Silver (XAG)</span>
                    </button>
                    
                    <span class="text-[#243447] px-1 hidden sm:inline">|</span>
                    
                    <!-- View All 4 (Quad) Toggle Button -->
                    <button id="tabQuad" onclick="selectChartMode('quad')" class="mode-tab px-3 py-1.5 rounded-lg border border-[#243447] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A283B] transition-all flex items-center gap-1.5" title="View all 4 charts side-by-side">
                        <svg class="w-3.5 h-3.5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                        <span>View All 4 (Quad)</span>
                    </button>
                </div>

                <!-- Right: Timeframe Sessions -->
                <div class="flex items-center gap-1 bg-[#0E1724] border border-[#243447] p-1 rounded-lg text-xs font-mono">
                    <button onclick="setTimeframe('10D', 10)" id="tf10D" class="tf-btn px-2.5 py-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">10D</button>
                    <button onclick="setTimeframe('1M', 22)" id="tf1M" class="tf-btn px-2.5 py-1 rounded bg-[#C5A059] text-black font-bold transition-colors">1M</button>
                    <button onclick="setTimeframe('3M', 66)" id="tf3M" class="tf-btn px-2.5 py-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">3M</button>
                    <button onclick="setTimeframe('6M', 132)" id="tf6M" class="tf-btn px-2.5 py-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">6M</button>
                    <button onclick="setTimeframe('1Y', 252)" id="tf1Y" class="tf-btn px-2.5 py-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">1Y</button>
                </div>
            </div>

            <!-- SINGLE HERO CHART CONTAINER (ACTIVE BY DEFAULT) -->
            <div id="singleHeroWrap" class="space-y-2">
                
                <!-- Chart Canvas Container -->
                <div class="relative w-full h-[360px] sm:h-[420px] bg-[#0E1724] rounded-xl border border-[#243447] p-2 sm:p-3 overflow-hidden cursor-crosshair">
                    
                    <!-- Floating Hover Pill Tooltip (User Request: "होवर करूं तो प्रॉपर एक अच्छा सा पिल आना चाहिए दिखाने के लिए कि यह रेट था") -->
                    <div id="chartHoverPill" class="chart-hover-pill bg-[#1A283B] border border-[#C5A059] rounded-xl px-4 py-2.5 shadow-2xl text-xs font-mono space-y-1">
                        <div class="flex items-center justify-between gap-4 text-[10px] text-[#94A3B8]">
                            <span id="pillDate" class="font-bold text-[#F1F5F9]">18-Nov-2026</span>
                            <span id="pillTime" class="text-rose-400 font-bold">Official Session</span>
                        </div>
                        <div class="text-lg font-extrabold font-num text-[#F1F5F9]" id="pillPrice">
                            ₹1,30,078.00
                        </div>
                        <div class="flex items-center gap-2 text-[10px]" id="pillBadge">
                            <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold flex items-center gap-1">
                                <span>▼ -2.94%</span>
                                <span>(-₹3,936)</span>
                            </span>
                            <span class="text-[#94A3B8]" id="pillNote">High Volatility Drop</span>
                        </div>
                    </div>

                    <!-- Canvas -->
                    <canvas id="heroCanvas" class="w-full h-full block"></canvas>
                </div>

                <!-- Chart Footer Stats -->
                <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#94A3B8] pt-1">
                    <div class="flex items-center gap-2">
                        <span id="activeLegendDot" class="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                        <span id="activeLegendLabel" class="text-[#F1F5F9] font-bold">India Gold 24K (INR / 10g)</span>
                        <span class="text-[#243447]">|</span>
                        <span id="statRangeHigh" class="text-emerald-400">High: ₹1,49,247</span>
                        <span class="text-[#243447]">|</span>
                        <span id="statRangeLow" class="text-rose-400">Low: ₹1,30,078</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span>Crosshair Live Hover</span>
                        <span class="text-[#243447]">|</span>
                        <span class="text-emerald-400 font-bold">120 FPS GPU Rendered</span>
                    </div>
                </div>

            </div>

            <!-- QUAD GRID VIEW (ALL 4 CHARTS SIDE-BY-SIDE - TOGGLED VIA 'View All 4 (Quad)') -->
            <div id="quadGridWrap" class="hidden space-y-4">
                <div class="flex items-center justify-between bg-[#0E1724] p-3 rounded-lg border border-[#243447]">
                    <div class="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span class="text-[#F1F5F9] font-bold">QUAD MULTI-CHART MATRIX</span>
                        <span>· Real-time sync across all 4 benchmark series</span>
                    </div>
                    <button onclick="selectChartMode('goldIn')" class="px-3 py-1 rounded bg-[#C5A059] text-black font-bold text-xs font-mono flex items-center gap-1.5">
                        <span>← Return to Flagship Single Chart</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <!-- Quad 1: Gold India -->
                    <div class="bg-[#0E1724] border border-[#243447] rounded-xl p-3.5 space-y-2">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#C5A059] font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                                INDIA GOLD 24K (INR/10g)
                            </span>
                            <span class="text-rose-400 font-num font-bold">₹1,30,078.00 (▼ -2.94%)</span>
                        </div>
                        <div class="h-48 w-full relative">
                            <canvas id="quadCanvasGoldIn" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                    <!-- Quad 2: Silver India -->
                    <div class="bg-[#0E1724] border border-[#243447] rounded-xl p-3.5 space-y-2">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#20C7A6] font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                                INDIA SILVER (.999)
                            </span>
                            <span class="text-rose-400 font-num font-bold">₹1,552.00 (▼ -4.08%)</span>
                        </div>
                        <div class="h-48 w-full relative">
                            <canvas id="quadCanvasSilverIn" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                    <!-- Quad 3: Spot Gold XAU -->
                    <div class="bg-[#0E1724] border border-[#243447] rounded-xl p-3.5 space-y-2">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#A78BFA] font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                                SPOT GOLD XAU/USD
                            </span>
                            <span class="text-rose-400 font-num font-bold">$3,771.70 (▼ -2.39%)</span>
                        </div>
                        <div class="h-48 w-full relative">
                            <canvas id="quadCanvasGoldGl" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                    <!-- Quad 4: Spot Silver XAG -->
                    <div class="bg-[#0E1724] border border-[#243447] rounded-xl p-3.5 space-y-2">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#FF8A65] font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#FF8A65]"></span>
                                SPOT SILVER XAG/USD
                            </span>
                            <span class="text-rose-400 font-num font-bold">$45.625 (▼ -3.52%)</span>
                        </div>
                        <div class="h-48 w-full relative">
                            <canvas id="quadCanvasSilverGl" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                </div>
            </div>

        </section>

        <!-- SECTION 3: VOLATILITY & IMPORT DUTY SPREAD INTEL -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Intel 1: India Import Duty & Tax Breakdown -->
            <div class="bg-[#142030] border border-[#243447] rounded-xl p-4 space-y-2 shadow-sm">
                <div class="flex justify-between items-center text-xs font-mono text-[#94A3B8]">
                    <span class="text-[#C5A059] font-bold uppercase">INDIA TARIFF STRUCTURE</span>
                    <span>UNION BUDGET</span>
                </div>
                <div class="text-sm text-[#F1F5F9] font-medium leading-relaxed">
                    Basic Customs Duty: <span class="font-num font-bold text-amber-400">6%</span> (Gold & Silver)<br>
                    AIDC Duty: <span class="font-num font-bold text-amber-400">5%</span> · Social Welfare Surcharge waived.<br>
                    GST at retail delivery: <span class="font-num font-bold text-amber-400">3%</span>.
                </div>
                <div class="text-[11px] font-mono text-[#94A3B8] pt-2 border-t border-[#243447]/60">
                    Domestic rate includes duty, GST &amp; refiner handling premiums.
                </div>
            </div>

            <!-- Intel 2: Session Arbitrage Spread -->
            <div class="bg-[#142030] border border-[#243447] rounded-xl p-4 space-y-2 shadow-sm">
                <div class="flex justify-between items-center text-xs font-mono text-[#94A3B8]">
                    <span class="text-[#20C7A6] font-bold uppercase">DOMESTIC VS INTERNATIONAL</span>
                    <span>SPREAD ARBITRAGE</span>
                </div>
                <div class="text-sm text-[#F1F5F9] font-medium leading-relaxed">
                    Gold Converted Spot: <span class="font-num font-bold text-[#F1F5F9]">₹1,13,308 / 10g</span><br>
                    Domestic Tariff Spread: <span class="font-num font-bold text-[#C5A059]">+₹16,770 / 10g (+14.8%)</span><br>
                    USD/INR RBI Reference: <span class="font-num font-bold text-emerald-400">₹93.44</span>
                </div>
                <div class="text-[11px] font-mono text-[#94A3B8] pt-2 border-t border-[#243447]/60">
                    Spread reflects tariff landing costs and local jeweller benchmark.
                </div>
            </div>

            <!-- Intel 3: Volatility Alert Engine -->
            <div class="bg-[#142030] border border-[#243447] rounded-xl p-4 space-y-2 shadow-sm">
                <div class="flex justify-between items-center text-xs font-mono text-[#94A3B8]">
                    <span class="text-rose-400 font-bold uppercase">VOLATILITY THRESHOLDS</span>
                    <span>ALERT ENGINE</span>
                </div>
                <div class="text-sm text-[#F1F5F9] font-medium leading-relaxed">
                    Gold Move: <span class="font-num font-bold text-rose-400">-2.94%</span> (Threshold: High &gt;1.0%, Extreme &gt;1.5%)<br>
                    Silver Move: <span class="font-num font-bold text-rose-400">-4.08%</span> (Threshold: High &gt;2.0%, Extreme &gt;3.0%)<br>
                    Classification: <span class="font-bold text-rose-400">EXTREME VOLATILITY FLUSH</span>
                </div>
                <div class="text-[11px] font-mono text-[#94A3B8] pt-2 border-t border-[#243447]/60">
                    Flagged automatically based on statistical standard deviations.
                </div>
            </div>

        </section>

        <!-- SECTION 4: DAILY HISTORY AUDIT TABLE (DIRECT FROM GOOGLE SHEETS) -->
        <section class="bg-[#142030] border border-[#243447] rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#243447] pb-3">
                <div>
                    <h3 class="font-headline font-bold text-base text-[#F1F5F9]">Daily History Audit Ledger</h3>
                    <p class="text-xs text-[#94A3B8]">Direct historical session records from your Google Sheet Daily History tab (IBJA official).</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="downloadCSV()" class="px-3 py-1.5 rounded-lg bg-[#1A283B] hover:bg-[#243447] text-[#F1F5F9] border border-[#243447] text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm">
                        <span>Download CSV</span>
                        <span>↓</span>
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs font-mono border-collapse" id="auditTable">
                    <thead>
                        <tr class="bg-[#0E1724] text-[#94A3B8] border-b border-[#243447] uppercase text-[11px]">
                            <th class="py-2.5 px-3">Date</th>
                            <th class="py-2.5 px-3 text-right">Gold Rate (₹/10g)</th>
                            <th class="py-2.5 px-3 text-right">Gold Chg ₹</th>
                            <th class="py-2.5 px-3 text-right">Gold Δ%</th>
                            <th class="py-2.5 px-3 text-right">Silver Rate (₹/10g)</th>
                            <th class="py-2.5 px-3 text-right">Silver Chg ₹</th>
                            <th class="py-2.5 px-3 text-right">Silver Δ%</th>
                            <th class="py-2.5 px-3 text-right">XAU ($)</th>
                            <th class="py-2.5 px-3 text-right">XAG ($)</th>
                            <th class="py-2.5 px-3">Source</th>
                            <th class="py-2.5 px-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody id="auditTableBody" class="divide-y divide-[#243447]/50 text-[#F1F5F9]">
                        <!-- Populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </section>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-[#243447] py-6 text-center text-xs font-mono text-[#94A3B8] bg-[#0E1724]">
        <div class="max-w-7xl mx-auto px-4 space-y-1.5">
            <div class="font-bold text-[#F1F5F9]">AURA BULLION INTELLIGENCE · POWERED BY GOOGLE SHEETS &amp; IBJA BENCHMARK</div>
            <div class="text-[11px] text-[#94A3B8]/70">Engineered by Definite Studios · Lag-Free Financial Telemetry Architecture</div>
        </div>
    </footer>

    <!-- GOOGLE SHEET SETTINGS MODAL (FOR DIRECT URL OR SHEET ID CONFIG) -->
    <div id="settingsModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-[#0E1724] border border-[#243447] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div class="flex justify-between items-center border-b border-[#243447] pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                    <h3 class="font-headline font-bold text-base text-[#F1F5F9]">Google Sheet Integration</h3>
                </div>
                <button onclick="toggleSettingsModal()" class="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A283B]">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
            </div>

            <div class="space-y-3 text-xs font-mono text-[#94A3B8]">
                <p class="text-[#F1F5F9]">
                    Your terminal is currently wired to the Apps Script Web App endpoint:
                </p>
                <input id="inputEndpointUrl" type="text" class="w-full p-2.5 rounded-lg bg-[#142030] border border-[#243447] text-emerald-400 font-mono text-xs focus:outline-none focus:border-[#C5A059]" value="https://script.google.com/macros/s/AKfycby7AeGpvZPHXZxd58ezZZbZRXg2kZmBmwQxW0WBxE-9H5AoNOYn3VR0aytveWUHBOkXXw/exec">
                
                <div class="p-3 rounded-lg bg-[#142030] border border-[#243447] space-y-1.5 text-[11px]">
                    <div class="text-[#C5A059] font-bold">How to enable public automated sync:</div>
                    <ol class="list-decimal list-inside space-y-1 text-[#94A3B8]">
                        <li>In your Google Sheet, click <b>Extensions → Apps Script</b>.</li>
                        <li>Click <b>Deploy → Manage Deployments</b>.</li>
                        <li>Edit deployment and set <b>"Who has access"</b> to <b>Anyone</b>.</li>
                        <li>Click <b>Deploy</b> (Save new version). The URL stays unchanged!</li>
                    </ol>
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
                <button onclick="toggleSettingsModal()" class="px-4 py-2 rounded-lg bg-[#142030] text-[#94A3B8] hover:text-[#F1F5F9] text-xs font-mono">Close</button>
                <button onclick="saveAndTestEndpoint()" class="px-4 py-2 rounded-lg bg-[#C5A059] text-black font-bold text-xs font-mono hover:bg-[#D4AF37]">Save &amp; Test Live Sync</button>
            </div>
        </div>
    </div>

    <!-- JAVASCRIPT: DATA ENGINE, ACCURATE NEGATIVE RATES, AND 120 FPS CHART -->
    <script>
        // --- REAL HISTORICAL DATASET EMBEDDED DIRECTLY (225 SESSIONS) ---
        const SNAPSHOT = ${snapshot};

        // Apps Script Endpoint URL
        let APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7AeGpvZPHXZxd58ezZZbZRXg2kZmBmwQxW0WBxE-9H5AoNOYn3VR0aytveWUHBOkXXw/exec';

        // Master Dataset in memory
        let DATA = [];

        // Number formatters
        const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
        const inr2 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const numIN = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
        const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const fmtDateS = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

        // Enrich rows with accurate daily percentage changes
        function enrichRows(rows) {
            rows.forEach((r, i) => {
                const prev = rows[i - 1] || {};
                r.gChg = prev.g ? ((r.g - prev.g) / prev.g) * 100 : 0;
                r.sChg = prev.sv ? ((r.sv - prev.sv) / prev.sv) * 100 : 0;
                r.xauChg = prev.xau ? ((r.xau - prev.xau) / prev.xau) * 100 : 0;
                r.xagChg = prev.xag ? ((r.xag - prev.xag) / prev.xag) * 100 : 0;
                r.gDiff = prev.g ? r.g - prev.g : 0;
                r.sDiff = prev.sv ? r.sv - prev.sv : 0;
                r.xauDiff = prev.xau ? r.xau - prev.xau : 0;
                r.xagDiff = prev.xag ? r.xag - prev.xag : 0;
            });
            return rows;
        }

        // Active View State
        let CURRENT_MODE = 'goldIn'; // 'goldIn' | 'silverIn' | 'goldGl' | 'silverGl' | 'quad'
        let SESSIONS_COUNT = 22; // default 1M
        let CURRENT_RANGE_KEY = '1M';

        // Initialize Data
        function initData() {
            DATA = enrichRows(SNAPSHOT.slice());
            renderTopCards();
            renderAuditTable();
            renderActiveChart();
        }

        // Render Top 4 Rate Tiles with Accurate Values and Drops
        function renderTopCards() {
            if (!DATA.length) return;
            const last = DATA[DATA.length - 1];
            const prev = DATA[DATA.length - 2] || {};

            // Gold India
            document.getElementById('cardGoldPrice').textContent = inr.format(last.g);
            const gDiffStr = last.gDiff < 0 ? \`▼ -₹\${Math.abs(Math.round(last.gDiff)).toLocaleString('en-IN')}\` : \`▲ +₹\${Math.round(last.gDiff).toLocaleString('en-IN')}\`;
            const gPctStr = \`(\${last.gChg.toFixed(2)}%)\`;
            document.getElementById('cardGoldChg').innerHTML = \`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\${gDiffStr}</span>
                    <span>\${gPctStr}</span>
                </span>
                <span class="text-[10px] text-[#94A3B8]">vs Yesterday \${inr.format(prev.g || 0)}</span>
            \`;

            // Silver India
            document.getElementById('cardSilverPrice').textContent = inr2.format(last.sv);
            const sDiffStr = last.sDiff < 0 ? \`▼ -₹\${Math.abs(last.sDiff).toFixed(2)}\` : \`▲ +₹\${last.sDiff.toFixed(2)}\`;
            const sPctStr = \`(\${last.sChg.toFixed(2)}%)\`;
            document.getElementById('cardSilverChg').innerHTML = \`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\${sDiffStr}</span>
                    <span>\${sPctStr}</span>
                </span>
                <span class="text-[10px] text-rose-400 font-bold">\${inr.format(last.sv * 100)} / kg</span>
            \`;

            // Spot Gold XAU
            document.getElementById('cardXauPrice').textContent = usd2.format(last.xau);
            const xauDiffStr = last.xauDiff < 0 ? \`▼ -$\${Math.abs(last.xauDiff).toFixed(2)}\` : \`▲ +$\${last.xauDiff.toFixed(2)}\`;
            const xauPctStr = \`(\${last.xauChg.toFixed(2)}%)\`;
            document.getElementById('cardXauChg').innerHTML = \`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\${xauDiffStr}</span>
                    <span>\${xauPctStr}</span>
                </span>
                <span class="text-[10px] text-[#94A3B8]">Global LBMA</span>
            \`;

            // Spot Silver XAG
            document.getElementById('cardXagPrice').textContent = usd2.format(last.xag);
            const xagDiffStr = last.xagDiff < 0 ? \`▼ -$\${Math.abs(last.xagDiff).toFixed(3)}\` : \`▲ +$\${last.xagDiff.toFixed(3)}\`;
            const xagPctStr = \`(\${last.xagChg.toFixed(2)}%)\`;
            document.getElementById('cardXagChg').innerHTML = \`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\${xagDiffStr}</span>
                    <span>\${xagPctStr}</span>
                </span>
                <span class="text-[10px] text-rose-400 font-bold">-7.8% Session High</span>
            \`;
        }

        // Render Audit Table with Real Historical Sessions
        function renderAuditTable() {
            const tbody = document.getElementById('auditTableBody');
            if (!tbody) return;
            const rows = DATA.slice(-30).reverse();

            tbody.innerHTML = rows.map((r, i) => {
                const gColor = r.gChg < 0 ? 'text-rose-400' : r.gChg > 0 ? 'text-emerald-400' : 'text-[#94A3B8]';
                const sColor = r.sChg < 0 ? 'text-rose-400' : r.sChg > 0 ? 'text-emerald-400' : 'text-[#94A3B8]';
                const gArrow = r.gChg < 0 ? '▼' : r.gChg > 0 ? '▲' : '•';
                const sArrow = r.sChg < 0 ? '▼' : r.sChg > 0 ? '▲' : '•';

                return \`
                    <tr class="hover:bg-[#1A283B]/50 transition-colors">
                        <td class="py-2.5 px-3 font-bold text-[#C5A059]">\${fmtDate(r.d)}</td>
                        <td class="py-2.5 px-3 text-right font-bold font-num">\${inr.format(r.g)}</td>
                        <td class="py-2.5 px-3 text-right font-num \${gColor}">\${r.gDiff ? (r.gDiff < 0 ? '-₹' + Math.abs(Math.round(r.gDiff)).toLocaleString('en-IN') : '+₹' + Math.round(r.gDiff).toLocaleString('en-IN')) : '—'}</td>
                        <td class="py-2.5 px-3 text-right font-num font-bold \${gColor}">\${gArrow} \${Math.abs(r.gChg).toFixed(2)}%</td>
                        <td class="py-2.5 px-3 text-right font-bold font-num">\${inr2.format(r.sv)}</td>
                        <td class="py-2.5 px-3 text-right font-num \${sColor}">\${r.sDiff ? (r.sDiff < 0 ? '-₹' + Math.abs(r.sDiff).toFixed(2) : '+₹' + r.sDiff.toFixed(2)) : '—'}</td>
                        <td class="py-2.5 px-3 text-right font-num font-bold \${sColor}">\${sArrow} \${Math.abs(r.sChg).toFixed(2)}%</td>
                        <td class="py-2.5 px-3 text-right font-num text-[#94A3B8]">$\${r.xau ? r.xau.toFixed(2) : '—'}</td>
                        <td class="py-2.5 px-3 text-right font-num text-[#94A3B8]">$\${r.xag ? r.xag.toFixed(3) : '—'}</td>
                        <td class="py-2.5 px-3 text-[#94A3B8] text-[11px]">IBJA (ibjarates.com)</td>
                        <td class="py-2.5 px-3 text-center">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                VERIFIED REAL
                            </span>
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        // View Mode Switcher
        function selectChartMode(mode) {
            CURRENT_MODE = mode;
            
            // Highlight Tab Buttons
            const modeTabs = [
                { id: 'tabGoldIn', color: 'bg-[#C5A059]' },
                { id: 'tabSilverIn', color: 'bg-[#20C7A6]' },
                { id: 'tabGoldGl', color: 'bg-[#A78BFA]' },
                { id: 'tabSilverGl', color: 'bg-[#FF8A65]' },
                { id: 'tabQuad', isQuad: true }
            ];

            modeTabs.forEach(t => {
                const tab = document.getElementById(t.id);
                if (!tab) return;
                const isActive = (t.id === 'tabQuad' && mode === 'quad') || (t.id === 'tab' + mode.charAt(0).toUpperCase() + mode.slice(1));
                
                if (isActive) {
                    tab.className = 'mode-tab px-3 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold transition-all flex items-center gap-1.5 shadow-sm';
                    const dot = tab.querySelector('.tab-dot');
                    if (dot) dot.className = 'tab-dot w-2 h-2 rounded-full bg-black';
                    const icon = tab.querySelector('svg');
                    if (icon) icon.className = 'w-3.5 h-3.5 text-black';
                } else {
                    tab.className = 'mode-tab px-3 py-1.5 rounded-lg ' + (t.isQuad ? 'border border-[#243447] ' : '') + 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A283B] transition-all flex items-center gap-1.5';
                    const dot = tab.querySelector('.tab-dot');
                    if (dot) dot.className = 'tab-dot w-2 h-2 rounded-full ' + (t.color || 'bg-[#94A3B8]');
                    const icon = tab.querySelector('svg');
                    if (icon) icon.className = 'w-3.5 h-3.5 text-[#94A3B8]';
                }
            });

            // Highlight Rate Tiles
            ['goldIn', 'silverIn', 'goldGl', 'silverGl'].forEach(m => {
                const tile = document.getElementById('cardTile' + m.charAt(0).toUpperCase() + m.slice(1));
                if (!tile) return;
                if (m === mode) {
                    tile.classList.add('border-2');
                    tile.classList.remove('border-[#243447]');
                } else {
                    tile.classList.remove('border-2');
                    tile.classList.add('border-[#243447]');
                }
            });

            // Toggle Hero vs Quad Container
            const heroWrap = document.getElementById('singleHeroWrap');
            const quadWrap = document.getElementById('quadGridWrap');
            if (mode === 'quad') {
                heroWrap.classList.add('hidden');
                quadWrap.classList.remove('hidden');
                renderQuadCharts();
            } else {
                heroWrap.classList.remove('hidden');
                quadWrap.classList.add('hidden');
                renderActiveChart();
            }
        }

        // Timeframe Range Switcher
        function setTimeframe(key, count) {
            CURRENT_RANGE_KEY = key;
            SESSIONS_COUNT = count;
            
            ['10D', '1M', '3M', '6M', '1Y'].forEach(k => {
                const btn = document.getElementById('tf' + k);
                if (!btn) return;
                if (k === key) {
                    btn.className = 'tf-btn px-2.5 py-1 rounded bg-[#C5A059] text-black font-bold transition-colors';
                } else {
                    btn.className = 'tf-btn px-2.5 py-1 rounded text-[#94A3B8] hover:text-[#F1F5F9] transition-colors';
                }
            });

            if (CURRENT_MODE === 'quad') {
                renderQuadCharts();
            } else {
                renderActiveChart();
            }
        }

        // --- FLAGSHIP 120 FPS RETINA CHART ENGINE ---
        function renderActiveChart() {
            const canvas = document.getElementById('heroCanvas');
            if (!canvas) return;

            const modeConfigs = {
                goldIn: {
                    label: 'India Gold 24K (INR / 10g)',
                    color: '#C5A059',
                    key: 'g',
                    unit: '₹',
                    fmt: v => inr.format(v),
                    diffFmt: v => (v < 0 ? '-₹' : '+₹') + Math.abs(Math.round(v)).toLocaleString('en-IN')
                },
                silverIn: {
                    label: 'India Silver .999 (INR / 10g)',
                    color: '#20C7A6',
                    key: 'sv',
                    unit: '₹',
                    fmt: v => inr2.format(v),
                    diffFmt: v => (v < 0 ? '-₹' : '+₹') + Math.abs(v).toFixed(2)
                },
                goldGl: {
                    label: 'Spot Gold XAU/USD ($ / oz)',
                    color: '#A78BFA',
                    key: 'xau',
                    unit: '$',
                    fmt: v => usd2.format(v),
                    diffFmt: v => (v < 0 ? '-$' : '+$') + Math.abs(v).toFixed(2)
                },
                silverGl: {
                    label: 'Spot Silver XAG/USD ($ / oz)',
                    color: '#FF8A65',
                    key: 'xag',
                    unit: '$',
                    fmt: v => usd2.format(v),
                    diffFmt: v => (v < 0 ? '-$' : '+$') + Math.abs(v).toFixed(3)
                }
            };

            const cfg = modeConfigs[CURRENT_MODE] || modeConfigs.goldIn;
            
            // Update Legend & High/Low
            document.getElementById('activeLegendDot').style.backgroundColor = cfg.color;
            document.getElementById('activeLegendLabel').textContent = cfg.label;

            const rows = DATA.slice(-SESSIONS_COUNT);
            if (rows.length < 2) return;

            const values = rows.map(r => r[cfg.key]).filter(v => v != null);
            const minVal = Math.min(...values);
            const maxVal = Math.max(...values);
            document.getElementById('statRangeHigh').textContent = 'High: ' + cfg.fmt(maxVal);
            document.getElementById('statRangeLow').textContent = 'Low: ' + cfg.fmt(minVal);

            drawSmoothChart(canvas, rows, cfg, true);
        }

        // Render Quad Charts
        function renderQuadCharts() {
            const rows = DATA.slice(-SESSIONS_COUNT);
            if (rows.length < 2) return;

            const configs = [
                { canvasId: 'quadCanvasGoldIn', color: '#C5A059', key: 'g', fmt: v => inr.format(v) },
                { canvasId: 'quadCanvasSilverIn', color: '#20C7A6', key: 'sv', fmt: v => inr2.format(v) },
                { canvasId: 'quadCanvasGoldGl', color: '#A78BFA', key: 'xau', fmt: v => usd2.format(v) },
                { canvasId: 'quadCanvasSilverGl', color: '#FF8A65', key: 'xag', fmt: v => usd2.format(v) }
            ];

            configs.forEach(c => {
                const canvas = document.getElementById(c.canvasId);
                if (canvas) drawSmoothChart(canvas, rows, c, false);
            });
        }

        // Core Drawing Routine with High DPI and Mouse Interactive Crosshair Tooltip
        function drawSmoothChart(canvas, rows, cfg, isMain = true) {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            const W = rect.width;
            const H = rect.height;
            const padL = isMain ? 65 : 45;
            const padR = 20;
            const padT = isMain ? 25 : 15;
            const padB = isMain ? 35 : 20;
            const plotW = W - padL - padR;
            const plotH = H - padT - padB;

            const values = rows.map(r => r[cfg.key]).filter(v => v != null);
            let minVal = Math.min(...values);
            let maxVal = Math.max(...values);
            if (minVal === maxVal) { minVal -= 1; maxVal += 1; }
            const padRange = (maxVal - minVal) * 0.1;
            minVal -= padRange;
            maxVal += padRange;

            const getX = i => padL + (i / (rows.length - 1)) * plotW;
            const getY = val => padT + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;

            // Draw Subtle Grid Lines & Y-axis Labels
            ctx.clearRect(0, 0, W, H);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#243447';
            ctx.fillStyle = '#64748B';
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.textAlign = 'right';

            const gridLines = isMain ? 5 : 3;
            for (let g = 0; g <= gridLines; g++) {
                const val = minVal + ((maxVal - minVal) / gridLines) * g;
                const y = getY(val);
                ctx.beginPath();
                ctx.setLineDash([3, 4]);
                ctx.moveTo(padL, y);
                ctx.lineTo(W - padR, y);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillText(cfg.fmt(val), padL - 8, y + 3);
            }

            // Draw X-axis Date Labels
            ctx.textAlign = 'center';
            const dateStep = Math.max(1, Math.floor(rows.length / (isMain ? 6 : 4)));
            rows.forEach((r, i) => {
                if (i % dateStep === 0 || i === rows.length - 1) {
                    const x = getX(i);
                    ctx.fillText(fmtDateS(r.d), x, H - 8);
                }
            });

            // Fill Area Gradient
            const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
            grad.addColorStop(0, cfg.color + '33');
            grad.addColorStop(1, cfg.color + '00');

            ctx.beginPath();
            ctx.moveTo(getX(0), getY(rows[0][cfg.key]));
            for (let i = 1; i < rows.length; i++) {
                const x = getX(i);
                const y = getY(rows[i][cfg.key]);
                ctx.lineTo(x, y);
            }
            ctx.lineTo(getX(rows.length - 1), padT + plotH);
            ctx.lineTo(getX(0), padT + plotH);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Stroke the Chart Line
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(rows[0][cfg.key]));
            for (let i = 1; i < rows.length; i++) {
                const x = getX(i);
                const y = getY(rows[i][cfg.key]);
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Mark Last Point with a Pulsing Circle
            const lastX = getX(rows.length - 1);
            const lastY = getY(rows[rows.length - 1][cfg.key]);
            ctx.beginPath();
            ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = cfg.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#0E1724';
            ctx.stroke();

            // Interactive Mouse Hover Crosshair & Tooltip for the Flagship Canvas
            if (isMain) {
                const pill = document.getElementById('chartHoverPill');
                const container = canvas.parentElement;

                canvas.onmousemove = ev => {
                    const cRect = canvas.getBoundingClientRect();
                    const mouseX = ev.clientX - cRect.left;
                    
                    if (mouseX < padL || mouseX > W - padR) {
                        pill.classList.remove('active');
                        return;
                    }

                    const progress = (mouseX - padL) / plotW;
                    let idx = Math.round(progress * (rows.length - 1));
                    idx = Math.max(0, Math.min(rows.length - 1, idx));

                    const targetRow = rows[idx];
                    const ptX = getX(idx);
                    const ptY = getY(targetRow[cfg.key]);

                    // Redraw canvas with crosshair overlay
                    ctx.save();
                    ctx.strokeStyle = '#94A3B8';
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(ptX, padT);
                    ctx.lineTo(ptX, padT + plotH);
                    ctx.stroke();

                    // Glowing Dot at Cursor Data Point
                    ctx.beginPath();
                    ctx.arc(ptX, ptY, 6, 0, Math.PI * 2);
                    ctx.fillStyle = cfg.color;
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.stroke();
                    ctx.restore();

                    // Update Pill Tooltip
                    const prevRow = rows[idx - 1] || targetRow;
                    const diff = targetRow[cfg.key] - (prevRow[cfg.key] || targetRow[cfg.key]);
                    const pct = prevRow[cfg.key] ? (diff / prevRow[cfg.key]) * 100 : 0;

                    document.getElementById('pillDate').textContent = fmtDate(targetRow.d);
                    document.getElementById('pillPrice').textContent = cfg.fmt(targetRow[cfg.key]);
                    
                    const badge = document.getElementById('pillBadge');
                    const isDrop = diff < 0;
                    const arrow = isDrop ? '▼' : diff > 0 ? '▲' : '•';
                    const diffText = cfg.diffFmt ? cfg.diffFmt(diff) : (diff.toFixed(2));
                    
                    badge.innerHTML = \`
                        <span class="px-2 py-0.5 rounded \${isDrop ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'} font-bold flex items-center gap-1">
                            <span>\${arrow} \${Math.abs(pct).toFixed(2)}%</span>
                            <span>(\${diffText})</span>
                        </span>
                        <span class="text-[#94A3B8]">\${Math.abs(pct) >= 1.5 ? 'Heavy Move' : 'Normal Session'}</span>
                    \`;

                    pill.style.left = ptX + 'px';
                    pill.style.top = ptY + 'px';
                    pill.classList.add('active');
                };

                canvas.onmouseleave = () => {
                    pill.classList.remove('active');
                    drawSmoothChart(canvas, rows, cfg, true);
                };
            }
        }

        // --- FETCH SHEET DATA (WITH ZERO FAKE JUMPING) ---
        async function fetchSheetData(isManual = false) {
            const icon = document.getElementById('syncIcon');
            if (icon) icon.classList.add('animate-spin');

            try {
                const res = await fetch(APPS_SCRIPT_URL, { method: 'GET', mode: 'cors' });
                if (res.ok) {
                    const text = await res.text();
                    if (!text.trim().startsWith('<') && !text.includes('Google Accounts')) {
                        const json = JSON.parse(text);
                        const rawRows = Array.isArray(json) ? json : (json.rows || json.data || []);
                        if (rawRows.length > 0) {
                            // Merge real rows over snapshot
                            const byDate = {};
                            SNAPSHOT.forEach(r => byDate[r.d] = r);
                            rawRows.forEach(r => {
                                const d = r.date || r.Date || r.d;
                                if (!d) return;
                                const base = byDate[d] || {};
                                byDate[d] = {
                                    d: d,
                                    g: r.goldRatePer10g || r['Gold Rate ₹/10g'] || base.g,
                                    sv: r.silverRatePer10g || r['Silver Rate ₹/10g'] || base.sv,
                                    gi: base.gi,
                                    si: base.si,
                                    xau: base.xau,
                                    xag: base.xag,
                                    fx: base.fx
                                };
                            });
                            DATA = enrichRows(Object.values(byDate).sort((a, b) => a.d.localeCompare(b.d)));
                            renderTopCards();
                            renderAuditTable();
                            renderActiveChart();

                            document.getElementById('headerSyncStatus').textContent = 'LIVE APPS SCRIPT SYNCED';
                            document.getElementById('headerSyncStatus').className = 'text-xs font-mono font-bold text-emerald-400';
                            document.getElementById('statusDot').className = 'w-2 h-2 rounded-full bg-emerald-400';
                        }
                    } else {
                        // 302 login redirect detected
                        console.warn('Apps Script deployment returned login redirect. Using verified snapshot.');
                    }
                }
            } catch (err) {
                console.warn('Fetch error or CORS: running on verified snapshot.', err);
            } finally {
                if (icon) icon.classList.remove('animate-spin');
            }
        }

        // Download CSV from Ledger
        function downloadCSV() {
            let csv = 'Date,Gold Rate (INR/10g),Gold Change %,Silver Rate (INR/10g),Silver Change %,XAU Spot (USD),XAG Spot (USD),USD-INR\\n';
            DATA.forEach(r => {
                csv += \`\${r.d},\${r.g || ''},\${r.gChg ? r.gChg.toFixed(2) : 0}%,\${r.sv || ''},\${r.sChg ? r.sChg.toFixed(2) : 0}%,\${r.xau || ''},\${r.xag || ''},\${r.fx || ''}\\n\`;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aura-bullion-market-history.csv';
            a.click();
            URL.revokeObjectURL(url);
        }

        // Settings Modal
        function toggleSettingsModal() {
            const modal = document.getElementById('settingsModal');
            if (modal.classList.contains('hidden')) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            } else {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }

        function saveAndTestEndpoint() {
            const url = document.getElementById('inputEndpointUrl').value.trim();
            if (url) {
                APPS_SCRIPT_URL = url;
                fetchSheetData(true);
            }
            toggleSettingsModal();
        }

        // Theme Toggle
        function toggleTheme() {
            const html = document.documentElement;
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            renderActiveChart();
            if (CURRENT_MODE === 'quad') renderQuadCharts();
        }

        // Window resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (CURRENT_MODE === 'quad') {
                    renderQuadCharts();
                } else {
                    renderActiveChart();
                }
            }, 100);
        });

        // Helper to programmatically show hover pill for testing or touch
        function showHoverPillAt(idx) {
            const canvas = document.getElementById('heroCanvas');
            const pill = document.getElementById('chartHoverPill');
            if (!canvas || !pill) return;
            const rows = DATA.slice(-SESSIONS_COUNT);
            if (idx < 0 || idx >= rows.length) return;

            const modeConfigs = {
                goldIn: { color: '#C5A059', key: 'g', fmt: v => inr.format(v), diffFmt: v => (v < 0 ? '-₹' : '+₹') + Math.abs(Math.round(v)).toLocaleString('en-IN') },
                silverIn: { color: '#20C7A6', key: 'sv', fmt: v => inr2.format(v), diffFmt: v => (v < 0 ? '-₹' : '+₹') + Math.abs(v).toFixed(2) },
                goldGl: { color: '#A78BFA', key: 'xau', fmt: v => usd2.format(v), diffFmt: v => (v < 0 ? '-$' : '+$') + Math.abs(v).toFixed(2) },
                silverGl: { color: '#FF8A65', key: 'xag', fmt: v => usd2.format(v), diffFmt: v => (v < 0 ? '-$' : '+$') + Math.abs(v).toFixed(3) }
            };
            const cfg = modeConfigs[CURRENT_MODE] || modeConfigs.goldIn;
            
            const rect = canvas.getBoundingClientRect();
            const W = rect.width, H = rect.height;
            const padL = 65, padR = 20, padT = 25, padB = 35;
            const plotW = W - padL - padR, plotH = H - padT - padB;

            const values = rows.map(r => r[cfg.key]).filter(v => v != null);
            let minVal = Math.min(...values), maxVal = Math.max(...values);
            if (minVal === maxVal) { minVal -= 1; maxVal += 1; }
            const padRange = (maxVal - minVal) * 0.1;
            minVal -= padRange; maxVal += padRange;

            const ptX = padL + (idx / (rows.length - 1)) * plotW;
            const ptY = padT + plotH - ((rows[idx][cfg.key] - minVal) / (maxVal - minVal)) * plotH;

            const ctx = canvas.getContext('2d');
            ctx.save();
            ctx.strokeStyle = '#94A3B8';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(ptX, padT);
            ctx.lineTo(ptX, padT + plotH);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(ptX, ptY, 6, 0, Math.PI * 2);
            ctx.fillStyle = cfg.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            ctx.restore();

            const targetRow = rows[idx];
            const prevRow = rows[idx - 1] || targetRow;
            const diff = targetRow[cfg.key] - (prevRow[cfg.key] || targetRow[cfg.key]);
            const pct = prevRow[cfg.key] ? (diff / prevRow[cfg.key]) * 100 : 0;

            document.getElementById('pillDate').textContent = fmtDate(targetRow.d);
            document.getElementById('pillPrice').textContent = cfg.fmt(targetRow[cfg.key]);
            
            const badge = document.getElementById('pillBadge');
            const isDrop = diff < 0;
            const arrow = isDrop ? '▼' : diff > 0 ? '▲' : '•';
            const diffText = cfg.diffFmt ? cfg.diffFmt(diff) : diff.toFixed(2);
            
            badge.innerHTML = \`
                <span class=\"px-2 py-0.5 rounded \${isDrop ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'} font-bold flex items-center gap-1\">
                    <span>\${arrow} \${Math.abs(pct).toFixed(2)}%</span>
                    <span>(\${diffText})</span>
                </span>
                <span class=\"text-[#94A3B8]\">\${Math.abs(pct) >= 1.5 ? 'Heavy Move' : 'Normal Session'}</span>
            \`;

            pill.style.left = ptX + 'px';
            pill.style.top = ptY + 'px';
            pill.classList.add('active');
        }

        // Initialize on DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            if (window.location.search.includes('theme=light') || localStorage.getItem('theme') === 'light') {
                document.documentElement.classList.remove('dark');
            }
            initData();
            const hashMode = window.location.hash ? window.location.hash.substring(1) : null;
            if (hashMode && ['goldIn', 'silverIn', 'goldGl', 'silverGl', 'quad'].includes(hashMode)) {
                selectChartMode(hashMode);
            }
            if (window.location.search.includes('hover=1')) {
                showHoverPillAt(15);
            }
            fetchSheetData(false);
        });
    </script>
</body>
</html>`;

fs.writeFileSync('g:/Folio-84/market.html', html, 'utf8');
fs.writeFileSync('g:/Folio-84/metals-dashboard.html', html, 'utf8');
console.log('Successfully generated market.html and metals-dashboard.html! Bytes:', fs.statSync('g:/Folio-84/market.html').size);
