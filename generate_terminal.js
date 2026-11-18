const fs = require('fs');

const snapshot = fs.readFileSync('g:/Folio-84/data-snapshot.json', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aura Bullion // Live Market Terminal</title>
    <meta name="description" content="Real-time precious metals intelligence terminal for 24K Gold, 22K Jewellery Gold, and Silver. Synchronized with Google Sheets & IBJA benchmarks.">
    <!-- Favicon (Signature Definite Studios Blue & White D) -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg?v=3">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png?v=3">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png?v=3">
    <link rel="shortcut icon" href="favicon.ico?v=3">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png?v=3">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS with class dark mode -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        gold: '#C5A059',
                        gold22: '#E5A93C',
                        silver: '#20C7A6',
                        spotGold: '#A78BFA',
                        spotSilver: '#FF8A65'
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
        html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            width: 100%;
            font-family: 'Inter', sans-serif;
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        .font-num {
            font-family: 'JetBrains Mono', monospace;
            font-feature-settings: "tnum" 1, "zero" 1;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #243447;
        }

        /* Floating Tooltip Pill (Clamped inside chart, never spills outside) */
        .chart-hover-pill {
            position: absolute;
            pointer-events: none;
            z-index: 50;
            border-radius: 0.75rem;
            padding: 0.5rem 0.75rem;
            opacity: 0;
            transition: opacity 0.12s ease-out, transform 0.12s ease-out;
            will-change: left, top, opacity, transform;
            max-width: 240px;
            white-space: nowrap;
        }
        .chart-hover-pill.active {
            opacity: 1;
        }

        /* High Volatility Row Highlight */
        tr.volatile-row {
            background-color: rgba(244, 63, 94, 0.08) !important;
        }
        .dark tr.volatile-row {
            background-color: rgba(244, 63, 94, 0.16) !important;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A141F] text-slate-900 dark:text-[#F1F5F9] transition-colors">

    <!-- TOP NAVIGATION BAR (CLEAN, 100% UNCLUTTERED, NO SIDEBAR) -->
    <header class="sticky top-0 z-50 bg-white/95 dark:bg-[#0E1724]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#243447] px-4 sm:px-6 py-2.5 transition-colors">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            <!-- Brand & Live Sync Indicator -->
            <div class="flex items-center gap-3 sm:gap-4">
                <a href="index.html" class="flex items-center gap-2.5 group" title="Return to Portfolio">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF4E00] to-[#C5A059] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                        <div class="w-full h-full bg-[#0E1724] rounded-[6px] flex items-center justify-center p-1 overflow-hidden">
                            <img src="favicon.svg?v=3" alt="Definite Studios" class="w-full h-full object-contain">
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex items-center gap-1.5 leading-tight">
                            <span class="font-headline font-bold text-sm tracking-tight text-slate-900 dark:text-[#F1F5F9]">AURA BULLION</span>
                            <span class="text-[9px] font-mono font-bold text-[#FF4E00] bg-[#FF4E00]/10 px-1.5 py-0.5 rounded border border-[#FF4E00]/25">LIVE</span>
                        </div>
                        <span class="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">DEFINITE STUDIOS · PRECIOUS METALS</span>
                    </div>
                </a>

                <!-- Google Sheet Data Sync Status -->
                <div class="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-[#243447]">
                    <span id="statusDot" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span id="headerSyncStatus" class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">GOOGLE SHEET SYNCED</span>
                    <span class="text-[11px] font-mono text-slate-500 dark:text-[#94A3B8]" id="headerTimestamp">18-Nov-2026 Session Verified</span>
                </div>
            </div>

            <!-- Right Controls: Sync Button, Settings, Day/Night Toggle, Portfolio Return -->
            <div class="flex items-center gap-2">
                <button onclick="fetchSheetData(true)" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm" title="Sync latest rates from Google Sheet">
                    <svg id="syncIcon" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M2.5 11.5a10 10 0 0 1 18.8-4.3M21.5 12.5a10 10 0 0 1-18.8 4.3"/></svg>
                    <span class="hidden sm:inline">Sync Sheet</span>
                </button>

                <!-- Sheet Settings Drawer Toggle -->
                <button onclick="toggleSettingsModal()" class="p-2 rounded-lg bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-xs transition-colors shadow-sm" title="Sheet API Settings">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>

                <!-- Day / Night Theme Mode Toggle (Instant, Flawless) -->
                <button onclick="toggleTheme()" id="themeBtn" class="p-2 rounded-lg bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-600 dark:text-[#94A3B8] hover:text-amber-500 border border-slate-200 dark:border-[#243447] text-xs transition-colors shadow-sm" title="Toggle Day / Night Mode">
                    <svg id="moonIcon" class="w-3.5 h-3.5 hidden dark:block text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    <svg id="sunIcon" class="w-3.5 h-3.5 block dark:hidden text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                </button>

                <!-- Back to Portfolio -->
                <a href="index.html" class="px-3 py-1.5 rounded-lg bg-[#FF4E00] hover:bg-[#FF6B2B] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-[#FF4E00]/20 transition-all">
                    <span>Portfolio</span>
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/></svg>
                </a>
            </div>

        </div>
    </header>

    <!-- MAIN VIEWPORT (CLEAN, 100% UNCLUTTERED, NO NOTICE BANNER) -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 flex-1 w-full">

        <!-- PRIMARY KPI RATE TILES (24K GOLD, 22K JEWELLERY GOLD, SILVER 10G & 1KG) -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            <!-- Tile 1: Gold 24K (999 Pure Bullion) -->
            <div onclick="selectChartMode('goldIn')" id="cardTileGoldIn" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border-2 border-[#C5A059] rounded-xl p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#C5A059]"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span class="text-[#C5A059] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                        GOLD 24K (999 PURE)
                    </span>
                    <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447]">₹ / 10g</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9]" id="cardGoldPrice">
                        ₹1,30,078.00
                    </div>
                    <div class="flex items-center gap-1.5 text-xs font-mono" id="cardGoldChg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -₹3,936</span>
                            <span>(-2.94%)</span>
                        </span>
                        <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs ₹1,34,014</span>
                    </div>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span>IBJA Official Benchmark</span>
                    <span class="text-[#C5A059] font-bold group-hover:translate-x-0.5 transition-transform">Chart →</span>
                </div>
            </div>

            <!-- Tile 2: Gold 22K (916 Jewellery Standard) -->
            <div onclick="selectChartMode('gold22')" id="cardTileGold22" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] hover:border-amber-500 rounded-xl p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span class="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                        GOLD 22K (916 JEWELLERY)
                    </span>
                    <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447]">₹ / 10g</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9]" id="cardGold22Price">
                        ₹1,19,238.00
                    </div>
                    <div class="flex items-center gap-1.5 text-xs font-mono" id="cardGold22Chg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -₹3,608</span>
                            <span>(-2.94%)</span>
                        </span>
                        <span class="text-[10px] text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">Retail Jewellery</span>
                    </div>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span>91.6% Hallmark Standard</span>
                    <span class="text-amber-600 dark:text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">Chart →</span>
                </div>
            </div>

            <!-- Tile 3: Silver 10g (.999 Fine) -->
            <div onclick="selectChartMode('silverIn')" id="cardTileSilverIn" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] hover:border-[#20C7A6] rounded-xl p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#20C7A6]"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span class="text-[#20C7A6] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                        SILVER (10 GRAMS)
                    </span>
                    <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447]">₹ / 10g</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9]" id="cardSilverPrice">
                        ₹1,552.00
                    </div>
                    <div class="flex items-center gap-1.5 text-xs font-mono" id="cardSilverChg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -₹66.00</span>
                            <span>(-4.08%)</span>
                        </span>
                        <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs ₹1,618</span>
                    </div>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span>Domestic .999 Fine</span>
                    <span class="text-[#20C7A6] font-bold group-hover:translate-x-0.5 transition-transform">Chart →</span>
                </div>
            </div>

            <!-- Tile 4: Silver 1kg (Bar Standard) -->
            <div onclick="selectChartMode('silverIn')" id="cardTileSilverKg" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] hover:border-[#20C7A6] rounded-xl p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#20C7A6]"></div>
                <div class="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span class="text-[#20C7A6] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                        SILVER (1 KILOGRAM)
                    </span>
                    <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447]">₹ / kg</span>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl sm:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9]" id="cardSilverKgPrice">
                        ₹1,55,200.00
                    </div>
                    <div class="flex items-center gap-1.5 text-xs font-mono" id="cardSilverKgChg">
                        <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                            <span>▼ -₹6,600</span>
                            <span>(-4.08%)</span>
                        </span>
                        <span class="text-[10px] text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">-7.8% Session High</span>
                    </div>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span>Commercial Bar Standard</span>
                    <span class="text-[#20C7A6] font-bold group-hover:translate-x-0.5 transition-transform">Chart →</span>
                </div>
            </div>

        </section>

        <!-- SINGLE HERO FLAGSHIP CHART (THE CLEAN FLAGSHIP) -->
        <section class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-3.5 sm:p-5 space-y-3.5 shadow-sm transition-colors">
            
            <!-- Selector Controls Bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-[#243447] pb-3">
                
                <!-- Left: Metal Switcher Tabs -->
                <div class="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                    <button id="tabGoldIn" onclick="selectChartMode('goldIn')" class="mode-tab px-3 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold transition-all flex items-center gap-1.5 shadow-sm">
                        <span class="tab-dot w-2 h-2 rounded-full bg-black"></span>
                        <span>Gold 24K</span>
                    </button>
                    <button id="tabGold22" onclick="selectChartMode('gold22')" class="mode-tab px-3 py-1.5 rounded-lg text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] transition-all flex items-center gap-1.5">
                        <span class="tab-dot w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Gold 22K</span>
                    </button>
                    <button id="tabSilverIn" onclick="selectChartMode('silverIn')" class="mode-tab px-3 py-1.5 rounded-lg text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] transition-all flex items-center gap-1.5">
                        <span class="tab-dot w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                        <span>Silver (India)</span>
                    </button>
                    <button id="tabGoldGl" onclick="selectChartMode('goldGl')" class="mode-tab px-3 py-1.5 rounded-lg text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] transition-all flex items-center gap-1.5">
                        <span class="tab-dot w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                        <span>Spot Gold (XAU)</span>
                    </button>
                    <button id="tabSilverGl" onclick="selectChartMode('silverGl')" class="mode-tab px-3 py-1.5 rounded-lg text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] transition-all flex items-center gap-1.5">
                        <span class="tab-dot w-2 h-2 rounded-full bg-[#FF8A65]"></span>
                        <span>Spot Silver (XAG)</span>
                    </button>
                    
                    <span class="text-slate-300 dark:text-[#243447] px-1 hidden sm:inline">|</span>
                    
                    <!-- View All (Quad) Toggle Button -->
                    <button id="tabQuad" onclick="selectChartMode('quad')" class="mode-tab px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#243447] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] transition-all flex items-center gap-1.5" title="View all charts simultaneously">
                        <svg class="w-3.5 h-3.5 text-slate-600 dark:text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                        <span>View All (Quad)</span>
                    </button>
                </div>

                <!-- Right: Timeframe Range Buttons -->
                <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] p-1 rounded-lg text-xs font-mono">
                    <button onclick="setTimeframe('10D', 10)" id="tf10D" class="tf-btn px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors">10D</button>
                    <button onclick="setTimeframe('1M', 22)" id="tf1M" class="tf-btn px-2.5 py-1 rounded bg-[#C5A059] text-black font-bold transition-colors">1M</button>
                    <button onclick="setTimeframe('3M', 66)" id="tf3M" class="tf-btn px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors">3M</button>
                    <button onclick="setTimeframe('6M', 132)" id="tf6M" class="tf-btn px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors">6M</button>
                    <button onclick="setTimeframe('1Y', 252)" id="tf1Y" class="tf-btn px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors">1Y</button>
                </div>
            </div>

            <!-- SINGLE HERO CHART CONTAINER -->
            <div id="singleHeroWrap" class="space-y-2">
                
                <!-- Chart Canvas Container (With Clean HTML Crosshair & Clamped Tooltip) -->
                <div id="chartContainer" class="relative w-full h-[360px] sm:h-[400px] bg-slate-50 dark:bg-[#0E1724] rounded-xl border border-slate-200 dark:border-[#243447] p-2 sm:p-3 overflow-hidden cursor-crosshair transition-colors">
                    
                    <!-- HTML Crosshair Line (Never stains canvas!) -->
                    <div id="crosshairLine" class="absolute top-0 bottom-0 pointer-events-none border-l border-dashed border-slate-400 dark:border-[#94A3B8] opacity-0 transition-opacity z-20"></div>

                    <!-- HTML Crosshair Glowing Dot (Never stains canvas!) -->
                    <div id="crosshairDot" class="absolute pointer-events-none w-3.5 h-3.5 rounded-full border-2 border-white shadow-md opacity-0 transition-opacity transform -translate-x-1/2 -translate-y-1/2 z-30"></div>

                    <!-- Floating Tooltip Pill (Clamped inside box, 100% on-screen) -->
                    <div id="chartHoverPill" class="chart-hover-pill bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#C5A059] shadow-xl">
                        <div class="flex items-center justify-between gap-3 text-[10px] text-slate-500 dark:text-[#94A3B8] mb-0.5">
                            <span id="pillDate" class="font-bold text-slate-900 dark:text-[#F1F5F9]">18-Nov-2026</span>
                            <span id="pillSession" class="text-rose-500 font-bold">Session</span>
                        </div>
                        <div class="text-base font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] leading-tight" id="pillPrice">
                            ₹1,30,078.00
                        </div>
                        <div class="flex items-center gap-1.5 text-[10px] mt-1" id="pillBadge">
                            <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">
                                ▼ -2.94% (-₹3,936)
                            </span>
                            <span class="text-slate-500 dark:text-[#94A3B8] whitespace-nowrap text-[9px]" id="pillVol">Normal</span>
                        </div>
                    </div>

                    <!-- Clean Canvas -->
                    <canvas id="heroCanvas" class="w-full h-full block relative z-10"></canvas>
                </div>

                <!-- Chart Footer Stats -->
                <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-[#94A3B8] pt-1">
                    <div class="flex items-center gap-2">
                        <span id="activeLegendDot" class="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                        <span id="activeLegendLabel" class="text-slate-900 dark:text-[#F1F5F9] font-bold">India Gold 24K (INR / 10g)</span>
                        <span class="text-slate-300 dark:text-[#243447]">|</span>
                        <span id="statRangeHigh" class="text-emerald-600 dark:text-emerald-400">High: ₹1,45,858</span>
                        <span class="text-slate-300 dark:text-[#243447]">|</span>
                        <span id="statRangeLow" class="text-rose-600 dark:text-rose-400">Low: ₹1,30,078</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span>Live Crosshair Tracking</span>
                        <span class="text-slate-300 dark:text-[#243447]">|</span>
                        <span class="text-emerald-600 dark:text-emerald-400 font-bold">GPU 120 FPS</span>
                    </div>
                </div>

            </div>

            <!-- QUAD GRID VIEW (ALL CHARTS SIMULTANEOUSLY) -->
            <div id="quadGridWrap" class="hidden space-y-3.5">
                <div class="flex items-center justify-between bg-slate-50 dark:bg-[#0E1724] p-2.5 rounded-lg border border-slate-200 dark:border-[#243447]">
                    <div class="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#94A3B8]">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span class="text-slate-900 dark:text-[#F1F5F9] font-bold">QUAD BENCHMARK MATRIX</span>
                        <span>· Real-time comparison across all series</span>
                    </div>
                    <button onclick="selectChartMode('goldIn')" class="px-3 py-1 rounded bg-[#C5A059] text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-sm">
                        <span>← Return to Flagship Single Chart</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    <!-- Quad 1: Gold 24K -->
                    <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3 space-y-1.5">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#C5A059] font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                                GOLD 24K (INR/10g)
                            </span>
                            <span class="text-rose-600 dark:text-rose-400 font-num font-bold">₹1,30,078 (▼ -2.94%)</span>
                        </div>
                        <div class="h-44 w-full relative">
                            <canvas id="quadCanvasGoldIn" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                    <!-- Quad 2: Gold 22K -->
                    <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3 space-y-1.5">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-amber-600 dark:text-amber-500 font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                                GOLD 22K JEWELLERY
                            </span>
                            <span class="text-rose-600 dark:text-rose-400 font-num font-bold">₹1,19,238 (▼ -2.94%)</span>
                        </div>
                        <div class="h-44 w-full relative">
                            <canvas id="quadCanvasGold22" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                    <!-- Quad 3: Silver India -->
                    <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3 space-y-1.5">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#20C7A6] font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                                SILVER (INR/10g)
                            </span>
                            <span class="text-rose-600 dark:text-rose-400 font-num font-bold">₹1,552 (▼ -4.08%)</span>
                        </div>
                        <div class="h-44 w-full relative">
                            <canvas id="quadCanvasSilverIn" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                    <!-- Quad 4: Spot Gold XAU -->
                    <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3 space-y-1.5">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-[#A78BFA] font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                                SPOT GOLD (XAU/USD)
                            </span>
                            <span class="text-rose-600 dark:text-rose-400 font-num font-bold">$3,771.70 (▼ -2.39%)</span>
                        </div>
                        <div class="h-44 w-full relative">
                            <canvas id="quadCanvasGoldGl" class="w-full h-full block"></canvas>
                        </div>
                    </div>

                </div>
            </div>

        </section>

        <!-- DAILY HISTORY AUDIT LEDGER (CLEAN, NO SOURCE/STATUS CLUTTER, VOLATILITY HIGHLIGHT) -->
        <section class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-3.5 sm:p-5 space-y-3.5 shadow-sm transition-colors">
            <!-- Header Bar with Title, Sort & Filters -->
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#243447] pb-3">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                        <h3 class="font-headline font-bold text-base text-slate-900 dark:text-[#F1F5F9]">Daily History Audit Ledger</h3>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">Historical session records with interactive sorting & column visibility controls.</p>
                </div>
                
                <!-- Filter & Sorting Controls -->
                <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <!-- Sort Dropdown -->
                    <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-lg px-2.5 py-1 shadow-sm">
                        <span class="text-slate-500 dark:text-[#94A3B8] font-semibold text-[11px]">SORT:</span>
                        <select id="tblSortSelect" onchange="changeTableSort(this.value)" class="bg-transparent text-slate-900 dark:text-[#F1F5F9] font-bold outline-none cursor-pointer text-xs">
                            <option value="date-desc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">📅 Date: Newest First</option>
                            <option value="date-asc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">📅 Date: Oldest First</option>
                            <option value="gold24-desc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">🏆 Gold 24K: High → Low (All-Time High)</option>
                            <option value="gold24-asc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">📉 Gold 24K: Low → High</option>
                            <option value="gold22-desc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">🏆 Gold 22K: High → Low</option>
                            <option value="gold22-asc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">📉 Gold 22K: Low → High</option>
                            <option value="silver10-desc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">🥈 Silver: High → Low</option>
                            <option value="silver10-asc" class="bg-white dark:bg-[#0E1724] text-slate-900 dark:text-[#F1F5F9]">📉 Silver: Low → High</option>
                            <option value="gchg-asc" class="bg-white dark:bg-[#0E1724] text-rose-500 font-bold">⚡ Max Daily Drop First</option>
                        </select>
                    </div>

                    <!-- Session Volatility Filter Buttons -->
                    <button onclick="filterAuditTable('all')" id="tblFilterAll" class="px-2.5 py-1 rounded bg-[#C5A059] text-black font-bold transition-colors">All Sessions</button>
                    <button onclick="filterAuditTable('volatile')" id="tblFilterVol" class="px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] transition-colors">⚡ Volatile Only</button>
                    <button onclick="downloadCSV()" class="px-3 py-1 rounded bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] flex items-center gap-1 transition-colors" title="Export CSV">
                        <span>CSV</span>
                        <span>↓</span>
                    </button>
                </div>
            </div>

            <!-- Quick Preset Views & Metric Column Toggles (User can choose exactly what data to view) -->
            <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono border-b border-slate-100 dark:border-[#243447]/60 pb-2.5">
                <div class="flex flex-wrap items-center gap-1.5">
                    <span class="text-slate-400 dark:text-[#64748B] text-[10px] font-bold uppercase tracking-wider mr-1">Quick Views:</span>
                    <button onclick="quickColumnFilter('all')" id="qf-all" class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#C5A059] text-black transition-all">All Metrics</button>
                    <button onclick="quickColumnFilter('g24')" id="qf-g24" class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] transition-all">Gold 24K Only</button>
                    <button onclick="quickColumnFilter('g22')" id="qf-g22" class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] transition-all">Gold 22K (916) Only</button>
                    <button onclick="quickColumnFilter('silver')" id="qf-silver" class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] transition-all">Silver Only</button>
                </div>

                <div class="flex flex-wrap items-center gap-1.5">
                    <span class="text-slate-400 dark:text-[#64748B] text-[10px] font-bold uppercase tracking-wider mr-1">Columns:</span>
                    <button onclick="toggleColumn('g24')" id="btn-col-g24" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-[#C5A059]/20 text-slate-900 dark:text-white border-[#C5A059]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                        <span>24K</span>
                    </button>
                    <button onclick="toggleColumn('g22')" id="btn-col-g22" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-amber-500/20 text-slate-900 dark:text-white border-amber-500">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>22K</span>
                    </button>
                    <button onclick="toggleColumn('gchg')" id="btn-col-gchg" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-rose-500/20 text-slate-900 dark:text-white border-rose-500">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Gold Δ%</span>
                    </button>
                    <button onclick="toggleColumn('s10')" id="btn-col-s10" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-[#20C7A6]/20 text-slate-900 dark:text-white border-[#20C7A6]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#20C7A6]"></span>
                        <span>Silver 10g</span>
                    </button>
                    <button onclick="toggleColumn('s1k')" id="btn-col-s1k" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-[#20C7A6]/20 text-slate-900 dark:text-white border-[#20C7A6]">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#20C7A6]"></span>
                        <span>Silver 1kg</span>
                    </button>
                    <button onclick="toggleColumn('schg')" id="btn-col-schg" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-rose-500/20 text-slate-900 dark:text-white border-rose-500">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Silver Δ%</span>
                    </button>
                    <button onclick="toggleColumn('mov')" id="btn-col-mov" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-slate-200 dark:bg-slate-700/60 text-slate-900 dark:text-white border-slate-400">
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>Status</span>
                    </button>
                </div>
            </div>

            <!-- TABLE CONTAINER (SOLID BLACK HEADER BAR, CLEAR CONTRAST) -->
            <div class="overflow-x-auto rounded-lg border border-slate-900 dark:border-[#243447] shadow-sm">
                <table class="w-full text-left text-xs font-mono border-collapse" id="auditTable">
                    <thead class="bg-[#090D16] text-white border-b-2 border-[#C5A059]">
                        <tr class="uppercase text-[11px] font-bold tracking-wider text-white">
                            <th onclick="toggleSort('date')" class="py-2.5 px-3 cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Date">
                                <div class="flex items-center gap-1">
                                    <span>DATE</span>
                                    <span id="sort-icon-date" class="text-[#C5A059]">▼</span>
                                </div>
                            </th>
                            <th id="th-g24" onclick="toggleSort('gold24')" class="py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Gold 24K">
                                <div class="flex items-center justify-end gap-1">
                                    <span>GOLD 24K (₹/10G)</span>
                                    <span id="sort-icon-gold24" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-g22" onclick="toggleSort('gold22')" class="py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group text-amber-300" title="Click to sort by Gold 22K (916)">
                                <div class="flex items-center justify-end gap-1">
                                    <span>GOLD 22K (₹/10G)</span>
                                    <span id="sort-icon-gold22" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-gchg" onclick="toggleSort('gchg')" class="py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Gold Change %">
                                <div class="flex items-center justify-end gap-1">
                                    <span>GOLD Δ%</span>
                                    <span id="sort-icon-gchg" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-s10" onclick="toggleSort('silver10')" class="py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group text-[#20C7A6]" title="Click to sort by Silver 10g">
                                <div class="flex items-center justify-end gap-1">
                                    <span>SILVER (₹/10G)</span>
                                    <span id="sort-icon-silver10" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-s1k" onclick="toggleSort('silver1k')" class="py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group text-[#20C7A6]" title="Click to sort by Silver 1kg">
                                <div class="flex items-center justify-end gap-1">
                                    <span>SILVER (₹/KG)</span>
                                    <span id="sort-icon-silver1k" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-schg" onclick="toggleSort('schg')" class="py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Silver Change %">
                                <div class="flex items-center justify-end gap-1">
                                    <span>SILVER Δ%</span>
                                    <span id="sort-icon-schg" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-mov" class="py-2.5 px-3 text-center whitespace-nowrap select-none">
                                <span>MARKET MOVEMENT</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="auditTableBody" class="divide-y divide-slate-100 dark:divide-[#243447]/50 text-slate-900 dark:text-[#F1F5F9]">
                        <!-- Populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </section>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-slate-200 dark:border-[#243447] py-5 text-center text-xs font-mono text-slate-500 dark:text-[#94A3B8] bg-white dark:bg-[#0E1724] transition-colors">
        <div class="max-w-7xl mx-auto px-4 space-y-1">
            <div class="font-bold text-slate-900 dark:text-[#F1F5F9]">AURA BULLION INTELLIGENCE · GOOGLE SHEETS &amp; IBJA BENCHMARK</div>
            <div class="text-[11px] text-slate-500 dark:text-[#94A3B8] opacity-70">Engineered by Definite Studios · Zero-Lag Telemetry Architecture</div>
        </div>
    </footer>

    <!-- GOOGLE SHEET SETTINGS MODAL -->
    <div id="settingsModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-white dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div class="flex justify-between items-center border-b border-slate-200 dark:border-[#243447] pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                    <h3 class="font-headline font-bold text-base text-slate-900 dark:text-[#F1F5F9]">Google Sheet Integration</h3>
                </div>
                <button onclick="toggleSettingsModal()" class="p-1.5 rounded-lg text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B]">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
            </div>

            <div class="space-y-3 text-xs font-mono text-slate-500 dark:text-[#94A3B8]">
                <p class="text-slate-900 dark:text-[#F1F5F9]">
                    Current Apps Script Web App endpoint:
                </p>
                <input id="inputEndpointUrl" type="text" class="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#142030] border border-slate-200 dark:border-[#243447] text-emerald-600 dark:text-emerald-400 font-mono text-xs focus:outline-none focus:border-[#C5A059]" value="https://script.google.com/macros/s/AKfycby7AeGpvZPHXZxd58ezZZbZRXg2kZmBmwQxW0WBxE-9H5AoNOYn3VR0aytveWUHBOkXXw/exec">
                
                <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#142030] border border-slate-200 dark:border-[#243447] space-y-1.5 text-[11px]">
                    <div class="text-[#C5A059] font-bold">Public deployment setup:</div>
                    <ol class="list-decimal list-inside space-y-1 text-slate-500 dark:text-[#94A3B8]">
                        <li>In your Google Sheet: <b>Extensions → Apps Script</b>.</li>
                        <li>Click <b>Deploy → Manage Deployments</b>.</li>
                        <li>Edit deployment and set <b>"Who has access"</b> to <b>Anyone</b>.</li>
                        <li>Click <b>Deploy</b> (Save new version). The URL stays unchanged!</li>
                    </ol>
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
                <button onclick="toggleSettingsModal()" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#142030] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] text-xs font-mono">Close</button>
                <button onclick="saveAndTestEndpoint()" class="px-4 py-2 rounded-lg bg-[#C5A059] text-black font-bold text-xs font-mono hover:bg-[#D4AF37]">Save &amp; Test</button>
            </div>
        </div>
    </div>

    <!-- SCRIPT ENGINE -->
    <script>
        // --- REAL HISTORICAL DATASET (225 SESSIONS) ---
        const SNAPSHOT = ${snapshot};

        let APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7AeGpvZPHXZxd58ezZZbZRXg2kZmBmwQxW0WBxE-9H5AoNOYn3VR0aytveWUHBOkXXw/exec';
        let DATA = [];

        // Number Formatters
        const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
        const inr2 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const fmtDateS = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

        // Enrich rows with 22K Gold and daily changes
        function enrichRows(rows) {
            rows.forEach((r, i) => {
                // 22K Gold (91.6% hallmarked jewellery standard)
                r.g22 = r.g ? Math.round(r.g * (22 / 24)) : 0;
                
                const prev = rows[i - 1] || {};
                const prevG22 = prev.g ? Math.round(prev.g * (22 / 24)) : 0;

                r.gChg = prev.g ? ((r.g - prev.g) / prev.g) * 100 : 0;
                r.g22Chg = prevG22 ? ((r.g22 - prevG22) / prevG22) * 100 : 0;
                r.sChg = prev.sv ? ((r.sv - prev.sv) / prev.sv) * 100 : 0;
                r.xauChg = prev.xau ? ((r.xau - prev.xau) / prev.xau) * 100 : 0;
                r.xagChg = prev.xag ? ((r.xag - prev.xag) / prev.xag) * 100 : 0;

                r.gDiff = prev.g ? r.g - prev.g : 0;
                r.g22Diff = prevG22 ? r.g22 - prevG22 : 0;
                r.sDiff = prev.sv ? r.sv - prev.sv : 0;
                r.xauDiff = prev.xau ? r.xau - prev.xau : 0;
                r.xagDiff = prev.xag ? r.xag - prev.xag : 0;

                // Volatility flag: high move if Gold >= 1.0% or Silver >= 2.0%
                r.isVolatile = Math.abs(r.gChg) >= 1.0 || Math.abs(r.sChg) >= 2.0;
                r.isExtreme = Math.abs(r.gChg) >= 1.5 || Math.abs(r.sChg) >= 3.0;
            });
            return rows;
        }

        // Active State
        let CURRENT_MODE = 'goldIn'; // 'goldIn' | 'gold22' | 'silverIn' | 'goldGl' | 'silverGl' | 'quad'
        let SESSIONS_COUNT = 22; // default 1M
        let CURRENT_RANGE_KEY = '1M';
        let TABLE_FILTER = 'all'; // 'all' | 'volatile'
        let TABLE_SORT = 'date-desc';
        let VISIBLE_COLS = {
            g24: true,
            g22: true,
            gchg: true,
            s10: true,
            s1k: true,
            schg: true,
            mov: true
        };

        // Initialize Data
        function initData() {
            DATA = enrichRows(SNAPSHOT.slice());
            renderTopCards();
            updateColButtonStyles();
            updateSortDropdownAndIcons();
            renderAuditTable();
            renderActiveChart();
        }

        // Render Top 4 KPI Cards
        function renderTopCards() {
            if (!DATA.length) return;
            const last = DATA[DATA.length - 1];
            const prev = DATA[DATA.length - 2] || {};

            // 1. Gold 24K
            document.getElementById('cardGoldPrice').textContent = inr.format(last.g);
            const gDiffStr = last.gDiff < 0 ? \`▼ -₹\${Math.abs(Math.round(last.gDiff)).toLocaleString('en-IN')}\` : \`▲ +₹\${Math.round(last.gDiff).toLocaleString('en-IN')}\`;
            const gPctStr = \`(\${last.gChg.toFixed(2)}%)\`;
            document.getElementById('cardGoldChg').innerHTML = \`
                <span class=\"px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1\">
                    <span>\${gDiffStr}</span>
                    <span>\${gPctStr}</span>
                </span>
                <span class=\"text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap\">vs \${inr.format(prev.g || 0)}</span>
            \`;

            // 2. Gold 22K (916 Jewellery Standard)
            document.getElementById('cardGold22Price').textContent = inr.format(last.g22);
            const g22DiffStr = last.g22Diff < 0 ? \`▼ -₹\${Math.abs(Math.round(last.g22Diff)).toLocaleString('en-IN')}\` : \`▲ +₹\${Math.round(last.g22Diff).toLocaleString('en-IN')}\`;
            const g22PctStr = \`(\${last.g22Chg.toFixed(2)}%)\`;
            document.getElementById('cardGold22Chg').innerHTML = \`
                <span class=\"px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1\">
                    <span>\${g22DiffStr}</span>
                    <span>\${g22PctStr}</span>
                </span>
                <span class=\"text-[10px] text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap\">Retail Jewellery</span>
            \`;

            // 3. Silver 10g
            document.getElementById('cardSilverPrice').textContent = inr2.format(last.sv);
            const sDiffStr = last.sDiff < 0 ? \`▼ -₹\${Math.abs(last.sDiff).toFixed(2)}\` : \`▲ +₹\${last.sDiff.toFixed(2)}\`;
            const sPctStr = \`(\${last.sChg.toFixed(2)}%)\`;
            document.getElementById('cardSilverChg').innerHTML = \`
                <span class=\"px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1\">
                    <span>\${sDiffStr}</span>
                    <span>\${sPctStr}</span>
                </span>
                <span class=\"text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap\">vs \${inr2.format(prev.sv || 0)}</span>
            \`;

            // 4. Silver 1kg
            document.getElementById('cardSilverKgPrice').textContent = inr.format(last.sv * 100);
            const sKgDiff = last.sDiff * 100;
            const sKgDiffStr = sKgDiff < 0 ? \`▼ -₹\${Math.abs(Math.round(sKgDiff)).toLocaleString('en-IN')}\` : \`▲ +₹\${Math.round(sKgDiff).toLocaleString('en-IN')}\`;
            document.getElementById('cardSilverKgChg').innerHTML = \`
                <span class=\"px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1\">
                    <span>\${sKgDiffStr}</span>
                    <span>\${sPctStr}</span>
                </span>
                <span class=\"text-[10px] text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap\">-7.8% Session High</span>
            \`;
        }

        // Toggle Single Column Visibility
        function toggleColumn(key) {
            VISIBLE_COLS[key] = !VISIBLE_COLS[key];
            updateColButtonStyles();
            renderAuditTable();
        }

        // Quick Preset Views (All, Gold 24K, Gold 22K, Silver)
        function quickColumnFilter(preset) {
            ['qf-all', 'qf-g24', 'qf-g22', 'qf-silver'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.className = 'px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] transition-all';
            });
            const activeBtn = document.getElementById('qf-' + preset);
            if (activeBtn) activeBtn.className = 'px-2 py-0.5 rounded text-[11px] font-bold bg-[#C5A059] text-black transition-all';

            if (preset === 'all') {
                VISIBLE_COLS = { g24: true, g22: true, gchg: true, s10: true, s1k: true, schg: true, mov: true };
            } else if (preset === 'g24') {
                VISIBLE_COLS = { g24: true, g22: false, gchg: true, s10: false, s1k: false, schg: false, mov: true };
            } else if (preset === 'g22') {
                VISIBLE_COLS = { g24: false, g22: true, gchg: true, s10: false, s1k: false, schg: false, mov: true };
            } else if (preset === 'silver') {
                VISIBLE_COLS = { g24: false, g22: false, gchg: false, s10: true, s1k: true, schg: true, mov: true };
            }
            updateColButtonStyles();
            renderAuditTable();
        }

        // Update column buttons and th styles
        function updateColButtonStyles() {
            const map = {
                g24: { btn: 'btn-col-g24', th: 'th-g24', active: 'bg-[#C5A059]/25 text-slate-900 dark:text-white border-[#C5A059]' },
                g22: { btn: 'btn-col-g22', th: 'th-g22', active: 'bg-amber-500/25 text-slate-900 dark:text-white border-amber-500' },
                gchg: { btn: 'btn-col-gchg', th: 'th-gchg', active: 'bg-rose-500/25 text-slate-900 dark:text-white border-rose-500' },
                s10: { btn: 'btn-col-s10', th: 'th-s10', active: 'bg-[#20C7A6]/25 text-slate-900 dark:text-white border-[#20C7A6]' },
                s1k: { btn: 'btn-col-s1k', th: 'th-s1k', active: 'bg-[#20C7A6]/25 text-slate-900 dark:text-white border-[#20C7A6]' },
                schg: { btn: 'btn-col-schg', th: 'th-schg', active: 'bg-rose-500/25 text-slate-900 dark:text-white border-rose-500' },
                mov: { btn: 'btn-col-mov', th: 'th-mov', active: 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-400' }
            };

            for (const [key, item] of Object.entries(map)) {
                const btn = document.getElementById(item.btn);
                const th = document.getElementById(item.th);
                const isActive = VISIBLE_COLS[key];

                if (btn) {
                    if (isActive) {
                        btn.className = 'px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 ' + item.active;
                    } else {
                        btn.className = 'px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
                    }
                }
                if (th) {
                    th.style.display = isActive ? '' : 'none';
                }
            }
        }

        // Interactive Table Sorting
        function toggleSort(col) {
            if (col === 'date') {
                TABLE_SORT = (TABLE_SORT === 'date-desc') ? 'date-asc' : 'date-desc';
            } else if (col === 'gold24') {
                TABLE_SORT = (TABLE_SORT === 'gold24-desc') ? 'gold24-asc' : 'gold24-desc';
            } else if (col === 'gold22') {
                TABLE_SORT = (TABLE_SORT === 'gold22-desc') ? 'gold22-asc' : 'gold22-desc';
            } else if (col === 'gchg') {
                TABLE_SORT = (TABLE_SORT === 'gchg-asc') ? 'gchg-desc' : 'gchg-asc';
            } else if (col === 'silver10') {
                TABLE_SORT = (TABLE_SORT === 'silver10-desc') ? 'silver10-asc' : 'silver10-desc';
            } else if (col === 'silver1k') {
                TABLE_SORT = (TABLE_SORT === 'silver1k-desc') ? 'silver1k-asc' : 'silver1k-desc';
            } else if (col === 'schg') {
                TABLE_SORT = (TABLE_SORT === 'schg-asc') ? 'schg-desc' : 'schg-asc';
            }
            updateSortDropdownAndIcons();
            renderAuditTable();
        }

        function changeTableSort(val) {
            TABLE_SORT = val;
            updateSortDropdownAndIcons();
            renderAuditTable();
        }

        function updateSortDropdownAndIcons() {
            const sel = document.getElementById('tblSortSelect');
            if (sel && sel.value !== TABLE_SORT) {
                sel.value = TABLE_SORT;
            }

            const iconMap = {
                'date': 'sort-icon-date',
                'gold24': 'sort-icon-gold24',
                'gold22': 'sort-icon-gold22',
                'gchg': 'sort-icon-gchg',
                'silver10': 'sort-icon-silver10',
                'silver1k': 'sort-icon-silver1k',
                'schg': 'sort-icon-schg'
            };

            for (const [key, iconId] of Object.entries(iconMap)) {
                const el = document.getElementById(iconId);
                if (!el) continue;
                if (TABLE_SORT.startsWith(key)) {
                    el.textContent = TABLE_SORT.endsWith('asc') ? '▲' : '▼';
                    el.className = 'text-[#C5A059] font-bold';
                } else {
                    el.textContent = '⇅';
                    el.className = 'text-slate-400 opacity-60';
                }
            }
        }

        // Render Audit Table with Volatility Highlighting, Sorting & Column Visibility
        function renderAuditTable() {
            const tbody = document.getElementById('auditTableBody');
            if (!tbody) return;
            
            let rows = DATA.slice();

            // 1. Sort Rows
            if (TABLE_SORT === 'date-desc') {
                rows.sort((a, b) => new Date(b.d) - new Date(a.d));
            } else if (TABLE_SORT === 'date-asc') {
                rows.sort((a, b) => new Date(a.d) - new Date(b.d));
            } else if (TABLE_SORT === 'gold24-desc') {
                rows.sort((a, b) => (b.g || 0) - (a.g || 0));
            } else if (TABLE_SORT === 'gold24-asc') {
                rows.sort((a, b) => (a.g || 0) - (b.g || 0));
            } else if (TABLE_SORT === 'gold22-desc') {
                rows.sort((a, b) => (b.g22 || 0) - (a.g22 || 0));
            } else if (TABLE_SORT === 'gold22-asc') {
                rows.sort((a, b) => (a.g22 || 0) - (b.g22 || 0));
            } else if (TABLE_SORT === 'silver10-desc') {
                rows.sort((a, b) => (b.sv || 0) - (a.sv || 0));
            } else if (TABLE_SORT === 'silver10-asc') {
                rows.sort((a, b) => (a.sv || 0) - (b.sv || 0));
            } else if (TABLE_SORT === 'silver1k-desc') {
                rows.sort((a, b) => ((b.sv || 0) * 100) - ((a.sv || 0) * 100));
            } else if (TABLE_SORT === 'silver1k-asc') {
                rows.sort((a, b) => ((a.sv || 0) * 100) - ((b.sv || 0) * 100));
            } else if (TABLE_SORT === 'gchg-asc') {
                rows.sort((a, b) => (a.gChg || 0) - (b.gChg || 0)); // Biggest drop first
            } else if (TABLE_SORT === 'gchg-desc') {
                rows.sort((a, b) => (b.gChg || 0) - (a.gChg || 0));
            } else if (TABLE_SORT === 'schg-asc') {
                rows.sort((a, b) => (a.sChg || 0) - (b.sChg || 0));
            } else if (TABLE_SORT === 'schg-desc') {
                rows.sort((a, b) => (b.sChg || 0) - (a.sChg || 0));
            }

            // 2. Filter Volatile
            if (TABLE_FILTER === 'volatile') {
                rows = rows.filter(r => r.isVolatile);
            }

            // Show top 50 records
            const displayRows = rows.slice(0, 50);

            tbody.innerHTML = displayRows.map(r => {
                const gColor = r.gChg < 0 ? 'text-rose-600 dark:text-rose-400' : r.gChg > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-[#94A3B8]';
                const sColor = r.sChg < 0 ? 'text-rose-600 dark:text-rose-400' : r.sChg > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-[#94A3B8]';
                const gArrow = r.gChg < 0 ? '▼' : r.gChg > 0 ? '▲' : '•';
                const sArrow = r.sChg < 0 ? '▼' : r.sChg > 0 ? '▲' : '•';
                const isVol = r.isVolatile;

                let moveBadge = '<span class=\"text-slate-400 dark:text-[#64748B] text-[10px]\">Normal</span>';
                if (r.isExtreme) {
                    moveBadge = '<span class=\"px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap\">⚡ EXTREME SHOCK</span>';
                } else if (r.isVolatile) {
                    moveBadge = '<span class=\"px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap\">⚡ HIGH VOLATILITY</span>';
                }

                return \`
                    <tr class="hover:bg-slate-100/70 dark:hover:bg-[#1A283B]/50 transition-colors \${isVol ? 'volatile-row' : ''}">
                        <td class="py-2.5 px-3 font-bold text-[#C5A059] whitespace-nowrap">\${fmtDate(r.d)}</td>
                        \${VISIBLE_COLS.g24 ? \`<td class="py-2.5 px-3 text-right font-bold font-num whitespace-nowrap">\${inr.format(r.g)}</td>\` : ''}
                        \${VISIBLE_COLS.g22 ? \`<td class="py-2.5 px-3 text-right font-num text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">\${inr.format(r.g22)}</td>\` : ''}
                        \${VISIBLE_COLS.gchg ? \`<td class="py-2.5 px-3 text-right font-num font-bold \${gColor} whitespace-nowrap">\${gArrow} \${Math.abs(r.gChg).toFixed(2)}%</td>\` : ''}
                        \${VISIBLE_COLS.s10 ? \`<td class="py-2.5 px-3 text-right font-bold font-num whitespace-nowrap">\${inr2.format(r.sv)}</td>\` : ''}
                        \${VISIBLE_COLS.s1k ? \`<td class="py-2.5 px-3 text-right font-num font-bold whitespace-nowrap">\${inr.format(r.sv * 100)}</td>\` : ''}
                        \${VISIBLE_COLS.schg ? \`<td class="py-2.5 px-3 text-right font-num font-bold \${sColor} whitespace-nowrap">\${sArrow} \${Math.abs(r.sChg).toFixed(2)}%</td>\` : ''}
                        \${VISIBLE_COLS.mov ? \`<td class="py-2.5 px-3 text-center">\${moveBadge}</td>\` : ''}
                    </tr>
                \`;
            }).join('');
        }

        // Filter Table
        function filterAuditTable(filter) {
            TABLE_FILTER = filter;
            const btnAll = document.getElementById('tblFilterAll');
            const btnVol = document.getElementById('tblFilterVol');
            if (filter === 'volatile') {
                btnVol.className = 'px-2.5 py-1 rounded bg-[#C5A059] text-black font-bold transition-colors';
                btnAll.className = 'px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] transition-colors';
            } else {
                btnAll.className = 'px-2.5 py-1 rounded bg-[#C5A059] text-black font-bold transition-colors';
                btnVol.className = 'px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] transition-colors';
            }
            renderAuditTable();
        }

        // View Mode Switcher
        function selectChartMode(mode) {
            CURRENT_MODE = mode;
            
            const modeTabs = [
                { id: 'tabGoldIn', color: 'bg-[#C5A059]', key: 'goldIn' },
                { id: 'tabGold22', color: 'bg-amber-500', key: 'gold22' },
                { id: 'tabSilverIn', color: 'bg-[#20C7A6]', key: 'silverIn' },
                { id: 'tabGoldGl', color: 'bg-[#A78BFA]', key: 'goldGl' },
                { id: 'tabSilverGl', color: 'bg-[#FF8A65]', key: 'silverGl' },
                { id: 'tabQuad', key: 'quad', isQuad: true }
            ];

            modeTabs.forEach(t => {
                const tab = document.getElementById(t.id);
                if (!tab) return;
                const isActive = (t.key === mode);
                
                if (isActive) {
                    tab.className = 'mode-tab px-3 py-1.5 rounded-lg bg-[#C5A059] text-black font-bold transition-all flex items-center gap-1.5 shadow-sm';
                    const dot = tab.querySelector('.tab-dot');
                    if (dot) dot.className = 'tab-dot w-2 h-2 rounded-full bg-black';
                    const icon = tab.querySelector('svg');
                    if (icon) icon.className = 'w-3.5 h-3.5 text-black';
                } else {
                    tab.className = 'mode-tab px-3 py-1.5 rounded-lg ' + (t.isQuad ? 'border border-slate-200 dark:border-[#243447] ' : '') + 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] transition-all flex items-center gap-1.5';
                    const dot = tab.querySelector('.tab-dot');
                    if (dot) dot.className = 'tab-dot w-2 h-2 rounded-full ' + (t.color || 'bg-slate-400 dark:bg-[#94A3B8]');
                    const icon = tab.querySelector('svg');
                    if (icon) icon.className = 'w-3.5 h-3.5 text-slate-600 dark:text-[#94A3B8]';
                }
            });

            // Highlight Rate Tiles
            ['goldIn', 'gold22', 'silverIn'].forEach(m => {
                const tile = document.getElementById('cardTile' + m.charAt(0).toUpperCase() + m.slice(1));
                if (!tile) return;
                if (m === mode) {
                    tile.classList.add('border-2');
                    tile.classList.remove('border-slate-200', 'dark:border-[#243447]');
                } else {
                    tile.classList.remove('border-2');
                    tile.classList.add('border-slate-200', 'dark:border-[#243447]');
                }
            });

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
                    btn.className = 'tf-btn px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors';
                }
            });

            if (CURRENT_MODE === 'quad') {
                renderQuadCharts();
            } else {
                renderActiveChart();
            }
        }

        // --- FLAGSHIP 120 FPS CHART (CLEAN DRAWING + HTML CROSSHAIR OVERLAY) ---
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
                gold22: {
                    label: 'India Gold 22K Jewellery (INR / 10g)',
                    color: '#E5A93C',
                    key: 'g22',
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

            drawCleanChart(canvas, rows, cfg, true);
        }

        // Quad Charts
        function renderQuadCharts() {
            const rows = DATA.slice(-SESSIONS_COUNT);
            if (rows.length < 2) return;

            const configs = [
                { canvasId: 'quadCanvasGoldIn', color: '#C5A059', key: 'g', fmt: v => inr.format(v) },
                { canvasId: 'quadCanvasGold22', color: '#E5A93C', key: 'g22', fmt: v => inr.format(v) },
                { canvasId: 'quadCanvasSilverIn', color: '#20C7A6', key: 'sv', fmt: v => inr2.format(v) },
                { canvasId: 'quadCanvasGoldGl', color: '#A78BFA', key: 'xau', fmt: v => usd2.format(v) }
            ];

            configs.forEach(c => {
                const canvas = document.getElementById(c.canvasId);
                if (canvas) drawCleanChart(canvas, rows, c, false);
            });
        }

        // Draw Pristine Base Chart
        function drawCleanChart(canvas, rows, cfg, isMain = true) {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

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

            // Clear Background
            ctx.clearRect(0, 0, W, H);

            // Grid Lines & Labels
            const isDark = document.documentElement.classList.contains('dark');
            ctx.lineWidth = 1;
            ctx.strokeStyle = isDark ? '#1A283B' : '#E2E8F0';
            ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
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

            // X-axis Dates
            ctx.textAlign = 'center';
            const dateStep = Math.max(1, Math.floor(rows.length / (isMain ? 6 : 4)));
            rows.forEach((r, i) => {
                if (i % dateStep === 0 || i === rows.length - 1) {
                    const x = getX(i);
                    ctx.fillText(fmtDateS(r.d), x, H - 8);
                }
            });

            // Gradient Fill
            const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
            grad.addColorStop(0, cfg.color + (isDark ? '33' : '22'));
            grad.addColorStop(1, cfg.color + '00');

            ctx.beginPath();
            ctx.moveTo(getX(0), getY(rows[0][cfg.key]));
            for (let i = 1; i < rows.length; i++) {
                ctx.lineTo(getX(i), getY(rows[i][cfg.key]));
            }
            ctx.lineTo(getX(rows.length - 1), padT + plotH);
            ctx.lineTo(getX(0), padT + plotH);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Chart Stroke
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(rows[0][cfg.key]));
            for (let i = 1; i < rows.length; i++) {
                ctx.lineTo(getX(i), getY(rows[i][cfg.key]));
            }
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // End Point Pulse Dot
            const lastX = getX(rows.length - 1);
            const lastY = getY(rows[rows.length - 1][cfg.key]);
            ctx.beginPath();
            ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = cfg.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = isDark ? '#0E1724' : '#FFFFFF';
            ctx.stroke();

            // Attach Clean HTML Crosshair Hover (NEVER DIRTYING CANVAS!)
            if (isMain) {
                setupHtmlCrosshair(canvas, rows, cfg, getX, getY, padL, plotW, W, H);
            }
        }

        // Setup HTML-based crosshair (Zero canvas re-strokes, zero leftover lines!)
        function setupHtmlCrosshair(canvas, rows, cfg, getX, getY, padL, plotW, W, H) {
            const line = document.getElementById('crosshairLine');
            const dot = document.getElementById('crosshairDot');
            const pill = document.getElementById('chartHoverPill');
            const container = document.getElementById('chartContainer');
            if (!line || !dot || !pill || !container) return;

            dot.style.backgroundColor = cfg.color;

            container.onmousemove = ev => {
                const cRect = canvas.getBoundingClientRect();
                const mouseX = ev.clientX - cRect.left;

                if (mouseX < padL || mouseX > W - 20) {
                    hideCrosshair();
                    return;
                }

                const progress = (mouseX - padL) / plotW;
                let idx = Math.round(progress * (rows.length - 1));
                idx = Math.max(0, Math.min(rows.length - 1, idx));

                const targetRow = rows[idx];
                const ptX = getX(idx);
                const ptY = getY(targetRow[cfg.key]);

                // Position HTML Crosshair Line
                line.style.left = ptX + 'px';
                line.style.opacity = '0.7';

                // Position HTML Crosshair Dot
                dot.style.left = ptX + 'px';
                dot.style.top = ptY + 'px';
                dot.style.opacity = '1';

                // Populate Pill Data
                const prevRow = rows[idx - 1] || targetRow;
                const diff = targetRow[cfg.key] - (prevRow[cfg.key] || targetRow[cfg.key]);
                const pct = prevRow[cfg.key] ? (diff / prevRow[cfg.key]) * 100 : 0;
                const isDrop = diff < 0;
                const arrow = isDrop ? '▼' : diff > 0 ? '▲' : '•';
                const diffText = cfg.diffFmt ? cfg.diffFmt(diff) : diff.toFixed(2);

                document.getElementById('pillDate').textContent = fmtDate(targetRow.d);
                document.getElementById('pillSession').textContent = isDrop ? 'Drop Session' : 'Up Session';
                document.getElementById('pillSession').className = isDrop ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold';
                document.getElementById('pillPrice').textContent = cfg.fmt(targetRow[cfg.key]);

                const badge = document.getElementById('pillBadge');
                badge.innerHTML = \`
                    <span class=\"px-1.5 py-0.5 rounded \${isDrop ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'} font-bold whitespace-nowrap\">
                        \${arrow} \${Math.abs(pct).toFixed(2)}% (\${diffText})
                    </span>
                    <span class=\"text-slate-400 dark:text-[#64748B] whitespace-nowrap text-[9px]\">\${targetRow.isVolatile ? '⚡ High Vol' : 'Normal'}</span>
                \`;

                // CLAMPING TOOLTIP PILL INSIDE CONTAINER (NO OVERFLOW EVER!)
                const pillWidth = 200; // estimated width
                const halfWidth = pillWidth / 2;
                let pillLeft = Math.max(halfWidth + 10, Math.min(W - halfWidth - 10, ptX));

                pill.style.left = pillLeft + 'px';
                pill.style.top = ptY + 'px';

                // If point is close to the top, flip pill BELOW the point!
                if (ptY < 110) {
                    pill.style.transform = 'translate(-50%, 15px)';
                } else {
                    pill.style.transform = 'translate(-50%, -125%)';
                }

                pill.classList.add('active');
            };

            container.onmouseleave = () => {
                hideCrosshair();
            };

            function hideCrosshair() {
                line.style.opacity = '0';
                dot.style.opacity = '0';
                pill.classList.remove('active');
            }
        }

        // Programmatic Pill trigger for verification and touch tap
        function showHoverPillAt(idx) {
            const canvas = document.getElementById('heroCanvas');
            const line = document.getElementById('crosshairLine');
            const dot = document.getElementById('crosshairDot');
            const pill = document.getElementById('chartHoverPill');
            if (!canvas || !line || !dot || !pill) return;

            const rows = DATA.slice(-SESSIONS_COUNT);
            if (idx < 0 || idx >= rows.length) return;

            const modeConfigs = {
                goldIn: { color: '#C5A059', key: 'g', fmt: v => inr.format(v), diffFmt: v => (v < 0 ? '-₹' : '+₹') + Math.abs(Math.round(v)).toLocaleString('en-IN') },
                gold22: { color: '#E5A93C', key: 'g22', fmt: v => inr.format(v), diffFmt: v => (v < 0 ? '-₹' : '+₹') + Math.abs(Math.round(v)).toLocaleString('en-IN') },
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

            dot.style.backgroundColor = cfg.color;
            line.style.left = ptX + 'px';
            line.style.opacity = '0.7';
            dot.style.left = ptX + 'px';
            dot.style.top = ptY + 'px';
            dot.style.opacity = '1';

            const targetRow = rows[idx];
            const prevRow = rows[idx - 1] || targetRow;
            const diff = targetRow[cfg.key] - (prevRow[cfg.key] || targetRow[cfg.key]);
            const pct = prevRow[cfg.key] ? (diff / prevRow[cfg.key]) * 100 : 0;
            const isDrop = diff < 0;
            const arrow = isDrop ? '▼' : diff > 0 ? '▲' : '•';
            const diffText = cfg.diffFmt ? cfg.diffFmt(diff) : diff.toFixed(2);

            document.getElementById('pillDate').textContent = fmtDate(targetRow.d);
            document.getElementById('pillSession').textContent = isDrop ? 'Drop Session' : 'Up Session';
            document.getElementById('pillSession').className = isDrop ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold';
            document.getElementById('pillPrice').textContent = cfg.fmt(targetRow[cfg.key]);

            const badge = document.getElementById('pillBadge');
            badge.innerHTML = \`
                <span class="px-1.5 py-0.5 rounded \${isDrop ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'} font-bold whitespace-nowrap">
                    \${arrow} \${Math.abs(pct).toFixed(2)}% (\${diffText})
                </span>
                <span class="text-slate-400 dark:text-[#64748B] whitespace-nowrap text-[9px]">\${targetRow.isVolatile ? '⚡ High Vol' : 'Normal'}</span>
            \`;

            const pillWidth = 200;
            const halfWidth = pillWidth / 2;
            let pillLeft = Math.max(halfWidth + 10, Math.min(W - halfWidth - 10, ptX));

            pill.style.left = pillLeft + 'px';
            pill.style.top = ptY + 'px';

            if (ptY < 110) {
                pill.style.transform = 'translate(-50%, 15px)';
            } else {
                pill.style.transform = 'translate(-50%, -125%)';
            }

            pill.classList.add('active');
        }

        // --- FETCH SHEET DATA ---
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

                            document.getElementById('headerSyncStatus').textContent = 'LIVE SHEET SYNCED';
                            document.getElementById('headerSyncStatus').className = 'text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400';
                        }
                    }
                }
            } catch (err) {
                console.warn('Using verified snapshot.', err);
            } finally {
                if (icon) icon.classList.remove('animate-spin');
            }
        }

        // Download CSV
        function downloadCSV() {
            let csv = 'Date,Gold 24K (INR/10g),Gold 22K (INR/10g),Gold Change %,Silver (INR/10g),Silver (INR/kg),Silver Change %,XAU Spot (USD),XAG Spot (USD)\\n';
            DATA.forEach(r => {
                csv += \`\${r.d},\${r.g || ''},\${r.g22 || ''},\${r.gChg ? r.gChg.toFixed(2) : 0}%,\${r.sv || ''},\${(r.sv * 100) || ''},\${r.sChg ? r.sChg.toFixed(2) : 0}%,\${r.xau || ''},\${r.xag || ''}\\n\`;
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

        // Theme Toggle (Day / Night Mode Flawless)
        function toggleTheme() {
            const html = document.documentElement;
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            renderActiveChart();
            if (CURRENT_MODE === 'quad') renderQuadCharts();
        }

        // Resize Listener
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

        // Initialize on DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            // Apply saved theme preference or URL theme param
            const savedTheme = localStorage.getItem('theme');
            const urlParams = new URLSearchParams(window.location.search);
            const themeParam = urlParams.get('theme');

            if (themeParam === 'light' || savedTheme === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
            }

            initData();

            const hashMode = window.location.hash ? window.location.hash.substring(1) : null;
            if (hashMode && ['goldIn', 'gold22', 'silverIn', 'goldGl', 'silverGl', 'quad'].includes(hashMode)) {
                selectChartMode(hashMode);
            }

            const hoverIdx = urlParams.get('hover_idx');
            if (hoverIdx !== null) {
                setTimeout(() => showHoverPillAt(parseInt(hoverIdx, 10)), 150);
            } else if (urlParams.get('hover') === '1') {
                setTimeout(() => showHoverPillAt(15), 150);
            }

            fetchSheetData(false);
        });
    </script>
</body>
</html>`;

fs.writeFileSync('g:/Folio-84/market.html', html, 'utf8');
fs.writeFileSync('g:/Folio-84/metals-dashboard.html', html, 'utf8');
console.log('Successfully generated market.html and metals-dashboard.html with Tailwind dark classes!');
