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
            overflow-x: clip;
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

        /* Hide scrollbar for clean horizontal pill bars on mobile */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
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

    <!-- TOP NAVIGATION BAR (CLEAN, 100% UNCLUTTERED, NO SIDEBAR, MOBILE OPTIMIZED) -->
    <header class="sticky top-0 z-50 bg-white/95 dark:bg-[#0E1724]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#243447] px-3 sm:px-6 py-2 sm:py-2.5 transition-colors">
        <div class="max-w-[1720px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
            
            <!-- Brand & Live Sync Indicator -->
            <div class="flex items-center gap-2 sm:gap-4 min-w-0">
                <a href="index.html" class="flex items-center gap-2 group min-w-0" title="Return to Portfolio">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#FF4E00] to-[#C5A059] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                        <div class="w-full h-full bg-[#0E1724] rounded-[6px] flex items-center justify-center p-0.5 overflow-hidden">
                            <img src="favicon.svg?v=3" alt="Definite Studios" class="w-full h-full object-contain">
                        </div>
                    </div>
                    <div class="flex flex-col min-w-0">
                        <div class="flex items-center gap-1.5 leading-tight">
                            <span class="font-headline font-bold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-[#F1F5F9] truncate">AURA BULLION</span>
                            <span class="text-[8px] sm:text-[9px] font-mono font-bold text-[#FF4E00] bg-[#FF4E00]/10 px-1 py-0.2 rounded border border-[#FF4E00]/25 flex-shrink-0">LIVE</span>
                        </div>
                        <span class="text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] hidden xs:block truncate">DEFINITE STUDIOS · PRECIOUS METALS</span>
                    </div>
                </a>

                <!-- Google Sheet Data Sync Status -->
                <div class="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-[#243447]">
                    <span id="statusDot" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span id="headerSyncStatus" class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">GOOGLE SHEET SYNCED</span>
                    <span class="text-[11px] font-mono text-slate-500 dark:text-[#94A3B8]" id="headerTimestamp">18-Nov-2026 Session Verified</span>
                </div>
            </div>

            <!-- Right Controls: Sync Button, Settings, Day/Night Toggle, Portfolio Return -->
            <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button onclick="fetchSheetData(true)" class="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm" title="Sync latest rates from Google Sheet">
                    <svg id="syncIcon" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M2.5 11.5a10 10 0 0 1 18.8-4.3M21.5 12.5a10 10 0 0 1-18.8 4.3"/></svg>
                    <span class="hidden md:inline">Sync Sheet</span>
                </button>

                <!-- Sheet Settings Drawer Toggle -->
                <button onclick="toggleSettingsModal()" class="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-xs transition-colors shadow-sm" title="Sheet API Settings">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>

                <!-- Day / Night Theme Mode Toggle (Instant, Flawless) -->
                <button onclick="toggleTheme()" id="themeBtn" class="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-600 dark:text-[#94A3B8] hover:text-amber-500 border border-slate-200 dark:border-[#243447] text-xs transition-colors shadow-sm" title="Toggle Day / Night Mode">
                    <svg id="moonIcon" class="w-3.5 h-3.5 hidden dark:block text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    <svg id="sunIcon" class="w-3.5 h-3.5 block dark:hidden text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                </button>

                <!-- Back to Portfolio -->
                <a href="index.html" class="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#FF4E00] hover:bg-[#FF6B2B] text-white text-xs font-mono font-bold flex items-center gap-1 shadow-md shadow-[#FF4E00]/20 transition-all flex-shrink-0">
                    <span class="hidden sm:inline">Portfolio</span>
                    <span class="sm:hidden text-[11px]">Folio</span>
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/></svg>
                </a>
            </div>

        </div>
    </header>

    <!-- MAIN VIEWPORT (CLEAN, 100% UNCLUTTERED, NO NOTICE BANNER) -->
    <main class="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 flex-1 w-full">

        <!-- PRIMARY KPI RATE TILES (24K GOLD, 22K JEWELLERY GOLD, SILVER 10G & 1KG) -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
            
            <!-- Tile 1: Gold 24K (999 Pure Bullion) -->
            <div onclick="selectChartMode('goldIn')" id="cardTileGoldIn" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border-2 border-[#C5A059] rounded-xl p-2.5 sm:p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#C5A059]"></div>
                <div class="flex justify-between items-center text-[10px] sm:text-xs font-mono mb-1">
                    <span class="text-[#C5A059] font-bold uppercase tracking-wider flex items-center gap-1 truncate">
                        <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C5A059] flex-shrink-0"></span>
                        <span class="truncate">GOLD 24K</span>
                    </span>
                    <span class="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1 sm:px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447] flex-shrink-0">₹/10g</span>
                </div>
                <div class="space-y-0.5 sm:space-y-1">
                    <div class="text-lg sm:text-2xl lg:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] leading-tight truncate" id="cardGoldPrice">
                        ₹1,30,078
                    </div>
                    <div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGoldChg">
                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">
                            <span>▼ -₹3,936</span>
                            <span>(-2.94%)</span>
                        </span>
                    </div>
                </div>
                <div class="mt-2 pt-1.5 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span class="truncate">999 Pure IBJA</span>
                    <span class="text-[#C5A059] font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">Chart →</span>
                </div>
            </div>

            <!-- Tile 2: Gold 22K (916 Jewellery Standard) -->
            <div onclick="selectChartMode('gold22')" id="cardTileGold22" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] hover:border-amber-500 rounded-xl p-2.5 sm:p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                <div class="flex justify-between items-center text-[10px] sm:text-xs font-mono mb-1">
                    <span class="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1 truncate">
                        <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                        <span class="truncate">GOLD 22K</span>
                    </span>
                    <span class="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1 sm:px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447] flex-shrink-0">₹/10g</span>
                </div>
                <div class="space-y-0.5 sm:space-y-1">
                    <div class="text-lg sm:text-2xl lg:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] leading-tight truncate" id="cardGold22Price">
                        ₹1,19,238
                    </div>
                    <div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGold22Chg">
                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">
                            <span>▼ -₹3,608</span>
                            <span>(-2.94%)</span>
                        </span>
                    </div>
                </div>
                <div class="mt-2 pt-1.5 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span class="truncate">916 Hallmark</span>
                    <span class="text-amber-600 dark:text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">Chart →</span>
                </div>
            </div>

            <!-- Tile 3: Silver 10g (.999 Fine) -->
            <div onclick="selectChartMode('silverIn')" id="cardTileSilverIn" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] hover:border-[#20C7A6] rounded-xl p-2.5 sm:p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#20C7A6]"></div>
                <div class="flex justify-between items-center text-[10px] sm:text-xs font-mono mb-1">
                    <span class="text-[#20C7A6] font-bold uppercase tracking-wider flex items-center gap-1 truncate">
                        <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#20C7A6] flex-shrink-0"></span>
                        <span class="truncate">SILVER 10G</span>
                    </span>
                    <span class="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1 sm:px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447] flex-shrink-0">₹/10g</span>
                </div>
                <div class="space-y-0.5 sm:space-y-1">
                    <div class="text-lg sm:text-2xl lg:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] leading-tight truncate" id="cardSilverPrice">
                        ₹1,552
                    </div>
                    <div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverChg">
                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">
                            <span>▼ -₹66</span>
                            <span>(-4.08%)</span>
                        </span>
                    </div>
                </div>
                <div class="mt-2 pt-1.5 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span class="truncate">.999 Fine</span>
                    <span class="text-[#20C7A6] font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">Chart →</span>
                </div>
            </div>

            <!-- Tile 4: Silver 1kg (Bar Standard) -->
            <div onclick="selectChartMode('silverIn')" id="cardTileSilverKg" class="rate-card cursor-pointer bg-white dark:bg-[#142030] hover:bg-slate-50 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] hover:border-[#20C7A6] rounded-xl p-2.5 sm:p-3.5 transition-all relative overflow-hidden group shadow-sm">
                <div class="absolute top-0 left-0 right-0 h-1 bg-[#20C7A6]"></div>
                <div class="flex justify-between items-center text-[10px] sm:text-xs font-mono mb-1">
                    <span class="text-[#20C7A6] font-bold uppercase tracking-wider flex items-center gap-1 truncate">
                        <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#20C7A6] flex-shrink-0"></span>
                        <span class="truncate">SILVER 1KG</span>
                    </span>
                    <span class="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1 sm:px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447] flex-shrink-0">₹/kg</span>
                </div>
                <div class="space-y-0.5 sm:space-y-1">
                    <div class="text-lg sm:text-2xl lg:text-3xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] leading-tight truncate" id="cardSilverKgPrice">
                        ₹1,55,200
                    </div>
                    <div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverKgChg">
                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">
                            <span>▼ -₹6,600</span>
                            <span>(-4.08%)</span>
                        </span>
                    </div>
                </div>
                <div class="mt-2 pt-1.5 border-t border-slate-200 dark:border-[#243447] flex justify-between text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span class="truncate">1kg Bar</span>
                    <span class="text-[#20C7A6] font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">Chart →</span>
                </div>
            </div>

        </section>

        <!-- UNIFIED MULTI-CHART TERMINAL (PREMIUM TICK SELECTOR - SINGLE WRAPPER) -->
        <section id="unifiedChartSection" class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-3 sm:p-5 space-y-4 shadow-sm transition-colors">
            <!-- Top Controls Bar -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#243447] pb-3">
                <!-- Left: Premium Tick Multi-Select Asset Buttons -->
                <div class="flex flex-wrap items-center gap-2 font-mono text-xs overflow-x-auto no-scrollbar py-0.5">
                    <!-- Gold 24K -->
                    <button id="tick-gold24" onclick="toggleAssetChart('gold24')" class="asset-tick-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-[#243447] bg-slate-50 dark:bg-[#0E1724] text-slate-700 dark:text-[#E2E8F0] whitespace-nowrap flex-shrink-0 cursor-pointer" title="Toggle India Gold 24K">
                        <span id="tickBox-gold24" class="tick-box w-4 h-4 rounded flex items-center justify-center transition-colors bg-[#C5A059] text-black">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                        <span>INDIA GOLD 24K</span>
                    </button>

                    <!-- Silver .999 -->
                    <button id="tick-silver" onclick="toggleAssetChart('silver')" class="asset-tick-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-[#243447] bg-slate-50 dark:bg-[#0E1724] text-slate-700 dark:text-[#E2E8F0] whitespace-nowrap flex-shrink-0 cursor-pointer" title="Toggle Silver .999">
                        <span id="tickBox-silver" class="tick-box w-4 h-4 rounded flex items-center justify-center transition-colors bg-[#20C7A6] text-black">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span class="w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                        <span>SILVER .999</span>
                    </button>

                    <!-- Spot Gold (XAU) -->
                    <button id="tick-xau" onclick="toggleAssetChart('xau')" class="asset-tick-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-[#243447] bg-slate-50 dark:bg-[#0E1724] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap flex-shrink-0 cursor-pointer" title="Toggle Spot Gold (XAU)">
                        <span id="tickBox-xau" class="tick-box w-4 h-4 rounded flex items-center justify-center transition-colors bg-transparent">
                            <span class="w-2 h-2 rounded-full border border-slate-400 dark:border-slate-500"></span>
                        </span>
                        <span class="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                        <span>SPOT GOLD (XAU)</span>
                    </button>

                    <!-- Spot Silver (XAG) -->
                    <button id="tick-xag" onclick="toggleAssetChart('xag')" class="asset-tick-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-[#243447] bg-slate-50 dark:bg-[#0E1724] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap flex-shrink-0 cursor-pointer" title="Toggle Spot Silver (XAG)">
                        <span id="tickBox-xag" class="tick-box w-4 h-4 rounded flex items-center justify-center transition-colors bg-transparent">
                            <span class="w-2 h-2 rounded-full border border-slate-400 dark:border-slate-500"></span>
                        </span>
                        <span class="w-2 h-2 rounded-full bg-[#FF8A65]"></span>
                        <span>SPOT SILVER (XAG)</span>
                    </button>

                    <!-- Dynamic Comparison Badge (e.g. 'SILVER 999 vs XAG' or 'GOLD 24K vs XAU') -->
                    <span id="comparisonTag" class="hidden sm:inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#CBD5E1] bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447]"></span>
                </div>

                <!-- Right: Timeframe Range Buttons -->
                <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] p-1 rounded-lg text-xs font-mono w-full lg:w-auto overflow-x-auto no-scrollbar">
                    <button onclick="setTimeframe('10D', 10)" id="tf10D" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0">10D</button>
                    <button onclick="setTimeframe('1M', 22)" id="tf1M" class="tf-btn px-2.5 py-1 rounded text-center bg-[#C5A059] text-black font-bold transition-colors whitespace-nowrap flex-shrink-0">1M</button>
                    <button onclick="setTimeframe('3M', 66)" id="tf3M" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0">3M</button>
                    <button onclick="setTimeframe('6M', 132)" id="tf6M" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0">6M</button>
                    <button onclick="setTimeframe('1Y', 252)" id="tf1Y" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0">1Y</button>
                    <button onclick="setTimeframe('3Y', 756)" id="tf3Y" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0">3Y</button>
                    <button onclick="setTimeframe('5Y', 1260)" id="tf5Y" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0">5Y</button>
                    <button onclick="setTimeframe('10Y', 2520)" id="tf10Y" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0">10Y</button>
                    <button onclick="setTimeframe('MAX', 99999)" id="tfMAX" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0" title="Full historical dataset (2006 to 2026)">ALL (2006–Now)</button>
                </div>
            </div>

            <!-- Single Wrapper: Active Chart Panes Container -->
            <div id="activeChartsContainer" class="space-y-4">
                
                <!-- Pane: India Gold 24K -->
                <div id="pane-gold24" class="chart-pane space-y-1.5">
                    <div class="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-[#1E293B] text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                            <span class="font-bold text-slate-900 dark:text-[#F1F5F9] tracking-wider text-[11px] sm:text-xs">INDIA GOLD 24K (INR)</span>
                        </div>
                        <div id="headerRate-gold24" class="flex items-center gap-2 text-[11px] sm:text-xs">
                            <span id="rateVal-gold24" class="font-extrabold text-slate-900 dark:text-[#F1F5F9] font-num">--</span>
                            <span id="rateChg-gold24" class="font-bold font-num text-[10px] sm:text-[11px]">--</span>
                        </div>
                    </div>
                    <div id="wrap-gold24" class="chart-canvas-wrap relative w-full h-[220px] bg-slate-50 dark:bg-[#0A141F] rounded-xl border border-slate-200 dark:border-[#243447] p-1.5 sm:p-2 overflow-hidden cursor-crosshair transition-colors">
                        <canvas id="canvas-gold24" class="w-full h-full block"></canvas>
                        <div id="crosshair-gold24" class="absolute top-0 bottom-0 w-[1.5px] bg-slate-400 dark:bg-white/40 pointer-events-none opacity-0 transition-opacity"></div>
                        <div id="dot-gold24" class="absolute w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0A141F] bg-[#C5A059] shadow-sm pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity"></div>
                    </div>
                </div>

                <!-- Pane: Silver .999 -->
                <div id="pane-silver" class="chart-pane space-y-1.5">
                    <div class="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-[#1E293B] text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#20C7A6]"></span>
                            <span class="font-bold text-slate-900 dark:text-[#F1F5F9] tracking-wider text-[11px] sm:text-xs">SILVER .999 (INR)</span>
                        </div>
                        <div id="headerRate-silver" class="flex items-center gap-2 text-[11px] sm:text-xs">
                            <span id="rateVal-silver" class="font-extrabold text-slate-900 dark:text-[#F1F5F9] font-num">--</span>
                            <span id="rateChg-silver" class="font-bold font-num text-[10px] sm:text-[11px]">--</span>
                        </div>
                    </div>
                    <div id="wrap-silver" class="chart-canvas-wrap relative w-full h-[220px] bg-slate-50 dark:bg-[#0A141F] rounded-xl border border-slate-200 dark:border-[#243447] p-1.5 sm:p-2 overflow-hidden cursor-crosshair transition-colors">
                        <canvas id="canvas-silver" class="w-full h-full block"></canvas>
                        <div id="crosshair-silver" class="absolute top-0 bottom-0 w-[1.5px] bg-slate-400 dark:bg-white/40 pointer-events-none opacity-0 transition-opacity"></div>
                        <div id="dot-silver" class="absolute w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0A141F] bg-[#20C7A6] shadow-sm pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity"></div>
                    </div>
                </div>

                <!-- Pane: Spot Gold (XAU) -->
                <div id="pane-xau" class="chart-pane space-y-1.5 hidden">
                    <div class="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-[#1E293B] text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#A78BFA]"></span>
                            <span class="font-bold text-slate-900 dark:text-[#F1F5F9] tracking-wider text-[11px] sm:text-xs">SPOT GOLD XAU (USD)</span>
                        </div>
                        <div id="headerRate-xau" class="flex items-center gap-2 text-[11px] sm:text-xs">
                            <span id="rateVal-xau" class="font-extrabold text-slate-900 dark:text-[#F1F5F9] font-num">--</span>
                            <span id="rateChg-xau" class="font-bold font-num text-[10px] sm:text-[11px]">--</span>
                        </div>
                    </div>
                    <div id="wrap-xau" class="chart-canvas-wrap relative w-full h-[220px] bg-slate-50 dark:bg-[#0A141F] rounded-xl border border-slate-200 dark:border-[#243447] p-1.5 sm:p-2 overflow-hidden cursor-crosshair transition-colors">
                        <canvas id="canvas-xau" class="w-full h-full block"></canvas>
                        <div id="crosshair-xau" class="absolute top-0 bottom-0 w-[1.5px] bg-slate-400 dark:bg-white/40 pointer-events-none opacity-0 transition-opacity"></div>
                        <div id="dot-xau" class="absolute w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0A141F] bg-[#A78BFA] shadow-sm pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity"></div>
                    </div>
                </div>

                <!-- Pane: Spot Silver (XAG) -->
                <div id="pane-xag" class="chart-pane space-y-1.5 hidden">
                    <div class="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-[#1E293B] text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#FF8A65]"></span>
                            <span class="font-bold text-slate-900 dark:text-[#F1F5F9] tracking-wider text-[11px] sm:text-xs">SPOT SILVER XAG (USD)</span>
                        </div>
                        <div id="headerRate-xag" class="flex items-center gap-2 text-[11px] sm:text-xs">
                            <span id="rateVal-xag" class="font-extrabold text-slate-900 dark:text-[#F1F5F9] font-num">--</span>
                            <span id="rateChg-xag" class="font-bold font-num text-[10px] sm:text-[11px]">--</span>
                        </div>
                    </div>
                    <div id="wrap-xag" class="chart-canvas-wrap relative w-full h-[220px] bg-slate-50 dark:bg-[#0A141F] rounded-xl border border-slate-200 dark:border-[#243447] p-1.5 sm:p-2 overflow-hidden cursor-crosshair transition-colors">
                        <canvas id="canvas-xag" class="w-full h-full block"></canvas>
                        <div id="crosshair-xag" class="absolute top-0 bottom-0 w-[1.5px] bg-slate-400 dark:bg-white/40 pointer-events-none opacity-0 transition-opacity"></div>
                        <div id="dot-xag" class="absolute w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0A141F] bg-[#FF8A65] shadow-sm pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity"></div>
                    </div>
                </div>

            </div>
        </section>

        <!-- 52-WEEK BENCHMARK & MACRO RANGE INTELLIGENCE (COLLAPSIBLE ACCORDION - DEFAULT COLLAPSED) -->
        <section class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-3 sm:p-4 shadow-sm transition-colors space-y-3">
            <div class="flex items-center justify-between gap-2 cursor-pointer select-none" onclick="toggle52WeekSection()">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#C5A059] flex-shrink-0"></span>
                    <div>
                        <h3 class="font-headline font-bold text-sm sm:text-base text-slate-900 dark:text-[#F1F5F9] flex items-center gap-2 flex-wrap">
                            <span>52-Week Benchmark &amp; Macro Range</span>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold">Macro Insights</span>
                        </h3>
                        <p class="text-[11px] text-slate-500 dark:text-[#94A3B8] hidden sm:block">Annual High / Low Extremes · Market Drawdown Analytics</p>
                    </div>
                </div>
                
                <button type="button" id="btnToggle52W" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] text-xs font-mono font-bold text-slate-700 dark:text-[#F1F5F9] transition-all flex-shrink-0">
                    <span id="lblToggle52W">View Range</span>
                    <span id="iconToggle52W" class="text-[#C5A059] transition-transform duration-200">▼</span>
                </button>
            </div>

            <!-- Collapsible Body (Default Hidden) -->
            <div id="body52Week" class="hidden grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100 dark:border-[#243447]/60">
                <!-- 52W Card 1: Gold 24K -->
                <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3.5 space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-mono">
                        <span class="font-bold text-[#C5A059] flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                            GOLD 24K (999 PURE)
                        </span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap" id="stat52WGoldATHDiff">-28.01% from Peak</span>
                    </div>
                    
                    <div class="space-y-1.5">
                        <div class="flex justify-between items-baseline text-xs font-mono">
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">52W Low: <b class="text-slate-900 dark:text-white" id="stat52WGoldLow">₹1,30,078</b></span>
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">52W High: <b class="text-[#C5A059]" id="stat52WGoldHigh">₹1,80,673</b></span>
                        </div>
                        <!-- Range Meter Bar -->
                        <div class="w-full bg-slate-200 dark:bg-[#1A283B] h-2.5 rounded-full overflow-hidden p-0.5">
                            <div id="stat52WGoldMeter" class="bg-gradient-to-r from-emerald-500 via-amber-500 to-[#C5A059] h-full rounded-full transition-all" style="width: 10%;"></div>
                        </div>
                        <div class="flex justify-between text-[10px] font-mono text-slate-400">
                            <span id="stat52WGoldCurrent">Current: ₹1,30,078</span>
                            <span id="stat52WGoldSpread">52W Range: ₹50,595</span>
                        </div>
                    </div>
                </div>

                <!-- 52W Card 2: Gold 22K (916 Jewellery) -->
                <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3.5 space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-mono">
                        <span class="font-bold text-amber-500 flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                            GOLD 22K (916 JEWELLERY)
                        </span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap" id="stat52WGold22ATHDiff">-28.01% from Peak</span>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex justify-between items-baseline text-xs font-mono">
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">52W Low: <b class="text-slate-900 dark:text-white" id="stat52WGold22Low">₹1,19,238</b></span>
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">52W High: <b class="text-amber-500" id="stat52WGold22High">₹1,65,617</b></span>
                        </div>
                        <!-- Range Meter Bar -->
                        <div class="w-full bg-slate-200 dark:bg-[#1A283B] h-2.5 rounded-full overflow-hidden p-0.5">
                            <div id="stat52WGold22Meter" class="bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400 h-full rounded-full transition-all" style="width: 10%;"></div>
                        </div>
                        <div class="flex justify-between text-[10px] font-mono text-slate-400">
                            <span id="stat52WGold22Current">Current: ₹1,19,238</span>
                            <span id="stat52WGold22Spread">52W Range: ₹46,379</span>
                        </div>
                    </div>
                </div>

                <!-- 52W Card 3: Silver .999 -->
                <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3.5 space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-mono">
                        <span class="font-bold text-[#20C7A6] flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-[#20C7A6]"></span>
                            SILVER (.999 / 1KG BAR)
                        </span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap" id="stat52WSilverATHDiff">-59.50% from Peak</span>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex justify-between items-baseline text-xs font-mono">
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">52W Low: <b class="text-slate-900 dark:text-white" id="stat52WSilverLow">₹1,552</b></span>
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">52W High: <b class="text-[#20C7A6]" id="stat52WSilverHigh">₹3,832</b></span>
                        </div>
                        <!-- Range Meter Bar -->
                        <div class="w-full bg-slate-200 dark:bg-[#1A283B] h-2.5 rounded-full overflow-hidden p-0.5">
                            <div id="stat52WSilverMeter" class="bg-gradient-to-r from-emerald-500 via-amber-500 to-[#20C7A6] h-full rounded-full transition-all" style="width: 5%;"></div>
                        </div>
                        <div class="flex justify-between text-[10px] font-mono text-slate-400">
                            <span id="stat52WSilverCurrent">Current: ₹1,552/10g</span>
                            <span id="stat52WSilverSpread">52W Range: ₹2,280/10g</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- DAILY HISTORY AUDIT LEDGER -->
        <section class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-3 sm:p-5 space-y-3 shadow-sm transition-colors">
            
            <!-- Header Bar: Title on Left, Controls all in One Row on Right -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-slate-200 dark:border-[#243447] pb-2.5">
                <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
                    <h3 class="font-headline font-bold text-sm sm:text-base text-slate-900 dark:text-[#F1F5F9] whitespace-nowrap">Daily History</h3>
                </div>
                
                <!-- Filter & Sorting Controls in ONE SLEEK LINE -->
                <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono">
                    <!-- Period Filter -->
                    <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-lg px-2 py-1 shadow-sm">
                        <span class="text-slate-500 dark:text-[#94A3B8] font-semibold text-[10px] flex-shrink-0">PERIOD:</span>
                        <select id="tblPeriodSelect" onchange="changeTablePeriod(this.value)" class="bg-transparent text-slate-900 dark:text-[#F1F5F9] font-bold outline-none cursor-pointer text-xs">
                            <option value="1M" class="bg-white dark:bg-[#0E1724]">1 Month</option>
                            <option value="3M" class="bg-white dark:bg-[#0E1724]">3 Months</option>
                            <option value="6M" class="bg-white dark:bg-[#0E1724]">6 Months</option>
                            <option value="1Y" class="bg-white dark:bg-[#0E1724]">1 Year</option>
                            <option value="ALL" selected class="bg-white dark:bg-[#0E1724] text-[#C5A059] font-bold">All History</option>
                        </select>
                    </div>

                    <!-- Sort Dropdown -->
                    <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-lg px-2 py-1 shadow-sm">
                        <span class="text-slate-500 dark:text-[#94A3B8] font-semibold text-[10px] flex-shrink-0">SORT:</span>
                        <select id="tblSortSelect" onchange="changeTableSort(this.value)" class="bg-transparent text-slate-900 dark:text-[#F1F5F9] font-bold outline-none cursor-pointer text-xs">
                            <option value="date-desc" class="bg-white dark:bg-[#0E1724]">Date: Newest First</option>
                            <option value="date-asc" class="bg-white dark:bg-[#0E1724]">Date: Oldest First</option>
                            <option value="gold24-desc" class="bg-white dark:bg-[#0E1724]">Gold 24K: High → Low</option>
                            <option value="gold24-asc" class="bg-white dark:bg-[#0E1724]">Gold 24K: Low → High</option>
                            <option value="gold22-desc" class="bg-white dark:bg-[#0E1724]">Gold 22K: High → Low</option>
                            <option value="gold22-asc" class="bg-white dark:bg-[#0E1724]">Gold 22K: Low → High</option>
                            <option value="silver10-desc" class="bg-white dark:bg-[#0E1724]">Silver: High → Low</option>
                            <option value="silver10-asc" class="bg-white dark:bg-[#0E1724]">Silver: Low → High</option>
                            <option value="gchg-asc" class="bg-white dark:bg-[#0E1724] text-rose-500 font-bold">Max Drop First</option>
                        </select>
                    </div>

                    <!-- Session Volatility Filter Buttons -->
                    <div class="flex items-center gap-1">
                        <button onclick="filterAuditTable('all')" id="tblFilterAll" class="px-2.5 py-1 rounded bg-[#C5A059] text-black font-bold transition-colors text-xs">All</button>
                        <button onclick="filterAuditTable('volatile')" id="tblFilterVol" class="px-2.5 py-1 rounded text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1A283B] border border-slate-200 dark:border-[#243447] transition-colors text-xs flex items-center gap-1 font-bold">
                            <svg class="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            <span>Volatile</span>
                        </button>
                        <button onclick="downloadCSV()" class="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] flex items-center gap-1 transition-colors text-xs font-bold" title="Export CSV">
                            <span>CSV</span>
                            <svg class="w-3 h-3 text-slate-500 dark:text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Secondary Bar: Left = Columns Toggles, Right = Quick Views -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pt-1 text-xs font-mono border-b border-slate-100 dark:border-[#243447]/60 pb-2.5">
                <!-- LEFT: Column Toggles -->
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <span class="text-slate-400 dark:text-[#64748B] text-[10px] font-bold uppercase tracking-wider mr-1 flex-shrink-0">Columns:</span>
                    <button onclick="toggleColumn('g24')" id="btn-col-g24" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-[#C5A059]/20 text-slate-900 dark:text-white border-[#C5A059] whitespace-nowrap flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                        <span>24K</span>
                    </button>
                    <button onclick="toggleColumn('g22')" id="btn-col-g22" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-amber-500/20 text-slate-900 dark:text-white border-amber-500 whitespace-nowrap flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>22K</span>
                    </button>
                    <button onclick="toggleColumn('gchg')" id="btn-col-gchg" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-rose-500/20 text-slate-900 dark:text-white border-rose-500 whitespace-nowrap flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Gold Δ%</span>
                    </button>
                    <button onclick="toggleColumn('s10')" id="btn-col-s10" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-[#20C7A6]/20 text-slate-900 dark:text-white border-[#20C7A6] whitespace-nowrap flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#20C7A6]"></span>
                        <span>Silver 10g</span>
                    </button>
                    <button onclick="toggleColumn('s1k')" id="btn-col-s1k" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-[#20C7A6]/20 text-slate-900 dark:text-white border-[#20C7A6] whitespace-nowrap flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#20C7A6]"></span>
                        <span>Silver 1kg</span>
                    </button>
                    <button onclick="toggleColumn('schg')" id="btn-col-schg" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-rose-500/20 text-slate-900 dark:text-white border-rose-500 whitespace-nowrap flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Silver Δ%</span>
                    </button>
                    <button onclick="toggleColumn('mov')" id="btn-col-mov" class="px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 bg-slate-200 dark:bg-slate-700/60 text-slate-900 dark:text-white border-slate-400 whitespace-nowrap flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>Status</span>
                    </button>
                </div>

                <!-- RIGHT: Quick Views -->
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-shrink-0">
                    <span class="text-slate-400 dark:text-[#64748B] text-[10px] font-bold uppercase tracking-wider mr-1 flex-shrink-0">Quick Views:</span>
                    <button onclick="quickColumnFilter('all')" id="qf-all" class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#C5A059] text-black transition-all whitespace-nowrap flex-shrink-0">All Metrics</button>
                    <button onclick="quickColumnFilter('g24')" id="qf-g24" class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] transition-all whitespace-nowrap flex-shrink-0">Gold 24K</button>
                    <button onclick="quickColumnFilter('g22')" id="qf-g22" class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] transition-all whitespace-nowrap flex-shrink-0">Gold 22K (916)</button>
                    <button onclick="quickColumnFilter('silver')" id="qf-silver" class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] transition-all whitespace-nowrap flex-shrink-0">Silver Only</button>
                </div>
            </div>

            <div id="tableContainer" class="overflow-x-auto  rounded-lg border border-slate-900 dark:border-[#243447] shadow-sm relative scrollbar-thin">
                <table class="w-full text-left text-xs font-mono border-collapse" id="auditTable">
                    <thead id="auditTableHead" class="bg-[#090D16] text-white border-b-2 border-[#C5A059] shadow-md">
                        <tr class="uppercase text-[11px] font-bold tracking-wider text-white">
                            <th onclick="toggleSort('date')" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Date">
                                <div class="flex items-center gap-1">
                                    <span>DATE</span>
                                    <span id="sort-icon-date" class="text-[#C5A059]">▼</span>
                                </div>
                            </th>
                            <th id="th-g24" onclick="toggleSort('gold24')" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Gold 24K">
                                <div class="flex items-center justify-end gap-1">
                                    <span>GOLD 24K (₹/10G)</span>
                                    <span id="sort-icon-gold24" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-g22" onclick="toggleSort('gold22')" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group text-amber-300" title="Click to sort by Gold 22K (916)">
                                <div class="flex items-center justify-end gap-1">
                                    <span>GOLD 22K (₹/10G)</span>
                                    <span id="sort-icon-gold22" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-gchg" onclick="toggleSort('gchg')" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Gold Change %">
                                <div class="flex items-center justify-end gap-1">
                                    <span>GOLD Δ%</span>
                                    <span id="sort-icon-gchg" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-s10" onclick="toggleSort('silver10')" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group text-[#20C7A6]" title="Click to sort by Silver 10g">
                                <div class="flex items-center justify-end gap-1">
                                    <span>SILVER (₹/10G)</span>
                                    <span id="sort-icon-silver10" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-s1k" onclick="toggleSort('silver1k')" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group text-[#20C7A6]" title="Click to sort by Silver 1kg">
                                <div class="flex items-center justify-end gap-1">
                                    <span>SILVER (₹/KG)</span>
                                    <span id="sort-icon-silver1k" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-schg" onclick="toggleSort('schg')" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 text-right cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap select-none group" title="Click to sort by Silver Change %">
                                <div class="flex items-center justify-end gap-1">
                                    <span>SILVER Δ%</span>
                                    <span id="sort-icon-schg" class="text-slate-400 opacity-60">⇅</span>
                                </div>
                            </th>
                            <th id="th-mov" class="sticky top-0 bg-[#090D16] z-20 py-2.5 px-3 text-center whitespace-nowrap select-none">
                                <span>MARKET MOVEMENT</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="auditTableBody" class="divide-y divide-slate-100 dark:divide-[#243447]/50 text-slate-900 dark:text-[#F1F5F9]">
                        <!-- Populated by JavaScript -->
                    </tbody>
                </table>
            </div>

            <!-- Complete Non-Lagging Pagination Bar & Year Jump Controls -->
            <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-[#243447]">
                <div id="tblPaginationControls" class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-[#94A3B8]">
                    <div class="flex flex-wrap items-center gap-2">
                        <span>Showing</span>
                        <span class="font-bold text-slate-900 dark:text-[#F1F5F9]" id="tblPageRange">1–50</span>
                        <span>of</span>
                        <span class="font-bold text-[#C5A059]" id="tblTotalCount">5,255</span>
                        <span>sessions</span>
                        <span class="text-slate-400 dark:text-[#64748B]">|</span>
                        <label class="flex items-center gap-1">
                            <span>Per Page:</span>
                            <select id="tblPageSizeSelect" onchange="changeTablePageSize(this.value)" class="bg-slate-100 dark:bg-[#142030] border border-slate-200 dark:border-[#243447] text-slate-900 dark:text-[#F1F5F9] rounded px-1.5 py-0.5 font-bold focus:outline-none">
                                <option value="25">25</option>
                                <option value="50" selected>50</option>
                                <option value="100">100</option>
                            </select>
                        </label>
                    </div>

                    <div class="flex items-center gap-1">
                        <button onclick="goToTablePage(1)" id="btnPageFirst" class="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#94A3B8] disabled:opacity-40 font-bold border border-slate-200 dark:border-[#243447] transition-all" title="First Page">⏮ First</button>
                        <button onclick="goToTablePage(TABLE_CURRENT_PAGE - 1)" id="btnPagePrev" class="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#94A3B8] disabled:opacity-40 font-bold border border-slate-200 dark:border-[#243447] transition-all" title="Previous Page">◀ Prev</button>
                        
                        <div class="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447]">
                            <span>Page</span>
                            <input id="tblPageInput" type="number" min="1" max="106" value="1" onchange="goToTablePage(parseInt(this.value, 10))" class="w-12 text-center bg-white dark:bg-[#142030] border border-slate-300 dark:border-[#243447] rounded font-bold text-slate-900 dark:text-white px-1 py-0.5 text-xs focus:outline-none focus:border-[#C5A059]">
                            <span>of <b id="tblTotalPages" class="text-slate-900 dark:text-white">106</b></span>
                        </div>

                        <button onclick="goToTablePage(TABLE_CURRENT_PAGE + 1)" id="btnPageNext" class="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#94A3B8] disabled:opacity-40 font-bold border border-slate-200 dark:border-[#243447] transition-all" title="Next Page">Next ▶</button>
                        <button onclick="goToTablePage(TABLE_TOTAL_PAGES)" id="btnPageLast" class="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#142030] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#94A3B8] disabled:opacity-40 font-bold border border-slate-200 dark:border-[#243447] transition-all" title="Last Page (2006)">Last ⏭</button>
                    </div>
                </div>

                <!-- Quick Year Jump Pills -->
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px] font-mono">
                    <span class="text-slate-400 dark:text-[#64748B] text-[10px] font-bold uppercase tracking-wider flex-shrink-0">Jump To Year:</span>
                    <button onclick="jumpToYear('2026')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2026</button>
                    <button onclick="jumpToYear('2025')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2025</button>
                    <button onclick="jumpToYear('2024')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2024</button>
                    <button onclick="jumpToYear('2022')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2022</button>
                    <button onclick="jumpToYear('2020')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2020 (Covid)</button>
                    <button onclick="jumpToYear('2016')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2016</button>
                    <button onclick="jumpToYear('2012')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2012</button>
                    <button onclick="jumpToYear('2008')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2008 (GFC)</button>
                    <button onclick="jumpToYear('2006')" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#142030] hover:bg-[#C5A059] hover:text-black border border-slate-200 dark:border-[#243447] transition-all font-bold whitespace-nowrap flex-shrink-0">2006 (Base)</button>
                </div>
            </div>
</section>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-slate-200 dark:border-[#243447] py-5 text-center text-xs font-mono text-slate-500 dark:text-[#94A3B8] bg-white dark:bg-[#0E1724] transition-colors">
        <div class="max-w-[1720px] mx-auto px-4 space-y-1">
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
                <input id="inputEndpointUrl" type="text" class="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#142030] border border-slate-200 dark:border-[#243447] text-emerald-600 dark:text-emerald-400 font-mono text-xs focus:outline-none focus:border-[#C5A059]" value="https://script.google.com/macros/s/AKfycbw4t4KddiEYdBtT7uigKfiAQk-a6QqiWfXizdB9CMX1zypIgOzW_KVK32OG2epncK7vKg/exec">
                
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

        let APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4t4KddiEYdBtT7uigKfiAQk-a6QqiWfXizdB9CMX1zypIgOzW_KVK32OG2epncK7vKg/exec';
        let DATA = [];
        window.APPS_SCRIPT_URL = APPS_SCRIPT_URL;
        window.DATA = DATA;

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
        let TABLE_PERIOD = 'ALL'; // '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL'
        let TABLE_PAGE_SIZE = 50; // 25 | 50 | 100
        let TABLE_CURRENT_PAGE = 1;
        let TABLE_TOTAL_PAGES = 1;
        let TABLE_PAGINATED_ROWS = [];
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
            window.DATA = DATA = enrichRows(SNAPSHOT.slice());
            renderTopCards();
            render52WeekStats();
            updateColButtonStyles();
            updateSortDropdownAndIcons();
            renderAuditTable();
            renderCurrentCharts();
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
                <span class=\"text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap\">vs \${inr.format((prev.sv || 0) * 100)}</span>
            \`;
        }

        // Render 52-Week Benchmark & Macro Stats
        let IS_52W_EXPANDED = false;
        function toggle52WeekSection() {
            IS_52W_EXPANDED = !IS_52W_EXPANDED;
            const body = document.getElementById("body52Week");
            const lbl = document.getElementById("lblToggle52W");
            const icon = document.getElementById("iconToggle52W");
            if (!body) return;
            if (IS_52W_EXPANDED) {
                body.classList.remove("hidden");
                if (lbl) lbl.textContent = "Hide Range";
                if (icon) icon.style.transform = "rotate(180deg)";
            } else {
                body.classList.add("hidden");
                if (lbl) lbl.textContent = "View Range";
                if (icon) icon.style.transform = "rotate(0deg)";
            }
        }

        function render52WeekStats() {
            if (!DATA.length) return;
            const gVals = DATA.map(r => r.g).filter(Boolean);
            const g22Vals = DATA.map(r => r.g22).filter(Boolean);
            const sVals = DATA.map(r => r.sv).filter(Boolean);

            const g52High = Math.max(...gVals);
            const g52Low = Math.min(...gVals);
            const g2252High = Math.max(...g22Vals);
            const g2252Low = Math.min(...g22Vals);
            const s52High = Math.max(...sVals);
            const s52Low = Math.min(...sVals);

            const last = DATA[DATA.length - 1];

            // 1. Gold 24K 52W
            const gATHDiff = (((last.g - g52High) / g52High) * 100).toFixed(2);
            const gSpread = g52High - g52Low;
            const gPosPct = Math.max(3, Math.min(100, Math.round(((last.g - g52Low) / gSpread) * 100)));

            const elGHigh = document.getElementById('stat52WGoldHigh');
            const elGLow = document.getElementById('stat52WGoldLow');
            const elGDiff = document.getElementById('stat52WGoldATHDiff');
            const elGMeter = document.getElementById('stat52WGoldMeter');
            const elGCurr = document.getElementById('stat52WGoldCurrent');
            const elGSpread = document.getElementById('stat52WGoldSpread');

            if (elGHigh) elGHigh.textContent = inr.format(g52High);
            if (elGLow) elGLow.textContent = inr.format(g52Low);
            if (elGDiff) elGDiff.textContent = gATHDiff + '% from Peak';
            if (elGMeter) elGMeter.style.width = gPosPct + '%';
            if (elGCurr) elGCurr.textContent = 'Current: ' + inr.format(last.g);
            if (elGSpread) elGSpread.textContent = '52W Range: ' + inr.format(gSpread);

            // 2. Gold 22K 52W
            const g22ATHDiff = (((last.g22 - g2252High) / g2252High) * 100).toFixed(2);
            const g22Spread = g2252High - g2252Low;
            const g22PosPct = Math.max(3, Math.min(100, Math.round(((last.g22 - g2252Low) / g22Spread) * 100)));

            const elG22High = document.getElementById('stat52WGold22High');
            const elG22Low = document.getElementById('stat52WGold22Low');
            const elG22Diff = document.getElementById('stat52WGold22ATHDiff');
            const elG22Meter = document.getElementById('stat52WGold22Meter');
            const elG22Curr = document.getElementById('stat52WGold22Current');
            const elG22Spread = document.getElementById('stat52WGold22Spread');

            if (elG22High) elG22High.textContent = inr.format(g2252High);
            if (elG22Low) elG22Low.textContent = inr.format(g2252Low);
            if (elG22Diff) elG22Diff.textContent = g22ATHDiff + '% from Peak';
            if (elG22Meter) elG22Meter.style.width = g22PosPct + '%';
            if (elG22Curr) elG22Curr.textContent = 'Current: ' + inr.format(last.g22);
            if (elG22Spread) elG22Spread.textContent = '52W Range: ' + inr.format(g22Spread);

            // 3. Silver 52W
            const sATHDiff = (((last.sv - s52High) / s52High) * 100).toFixed(2);
            const sSpread = s52High - s52Low;
            const sPosPct = Math.max(3, Math.min(100, Math.round(((last.sv - s52Low) / sSpread) * 100)));

            const elSHigh = document.getElementById('stat52WSilverHigh');
            const elSLow = document.getElementById('stat52WSilverLow');
            const elSDiff = document.getElementById('stat52WSilverATHDiff');
            const elSMeter = document.getElementById('stat52WSilverMeter');
            const elSCurr = document.getElementById('stat52WSilverCurrent');
            const elSSpread = document.getElementById('stat52WSilverSpread');

            if (elSHigh) elSHigh.textContent = inr2.format(s52High) + ' (' + inr.format(s52High * 100) + '/kg)';
            if (elSLow) elSLow.textContent = inr2.format(s52Low) + ' (' + inr.format(s52Low * 100) + '/kg)';
            if (elSDiff) elSDiff.textContent = sATHDiff + '% from Peak';
            if (elSMeter) elSMeter.style.width = sPosPct + '%';
            if (elSCurr) elSCurr.textContent = 'Current: ' + inr2.format(last.sv);
            if (elSSpread) elSSpread.textContent = '52W Range: ' + inr2.format(sSpread);
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

            const mobSel = document.getElementById('tblMobileViewSelect');
            if (mobSel && mobSel.value !== preset) {
                mobSel.value = preset;
            }

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

        // Period Filter & Pagination Handlers
        function changeTablePeriod(val) {
            TABLE_PERIOD = val;
            TABLE_LIMIT = 50; // Reset chunk to 50
            const sel = document.getElementById("tblPeriodSelect");
            if (sel && sel.value !== val) sel.value = val;
            renderAuditTable();
        }

        function loadMoreTableRows() {
            TABLE_LIMIT += 50;
            renderAuditTable();
        }

        // Render Audit Table with Volatility Highlighting, Sorting, Period Filter & Bounded Rendering
        function renderAuditTable() {
            const tbody = document.getElementById("auditTableBody");
            if (!tbody) return;

            let rows = DATA.slice();

            // 1. Period Slicing
            if (TABLE_PERIOD === "1M") rows = rows.slice(-22);
            else if (TABLE_PERIOD === "3M") rows = rows.slice(-66);
            else if (TABLE_PERIOD === "6M") rows = rows.slice(-132);
            else if (TABLE_PERIOD === "1Y") rows = rows.slice(-252);
            else if (TABLE_PERIOD === "3Y") rows = rows.slice(-756);
            else if (TABLE_PERIOD === "5Y") rows = rows.slice(-1260);

            // 2. Volatility Filtering
            if (TABLE_FILTER === "volatile") {
                rows = rows.filter(r => r.isVolatile);
            }

            // 3. Sorting
            if (TABLE_SORT === "date-desc") {
                rows.sort((a, b) => b.d.localeCompare(a.d));
            } else if (TABLE_SORT === "date-asc") {
                rows.sort((a, b) => a.d.localeCompare(b.d));
            } else if (TABLE_SORT === "gold24-desc") {
                rows.sort((a, b) => (b.g || 0) - (a.g || 0));
            } else if (TABLE_SORT === "gold24-asc") {
                rows.sort((a, b) => (a.g || 0) - (b.g || 0));
            } else if (TABLE_SORT === "gold22-desc") {
                rows.sort((a, b) => (b.g22 || 0) - (a.g22 || 0));
            } else if (TABLE_SORT === "gold22-asc") {
                rows.sort((a, b) => (a.g22 || 0) - (b.g22 || 0));
            } else if (TABLE_SORT === "silver10-desc") {
                rows.sort((a, b) => (b.sv || 0) - (a.sv || 0));
            } else if (TABLE_SORT === "silver10-asc") {
                rows.sort((a, b) => (a.sv || 0) - (b.sv || 0));
            } else if (TABLE_SORT === "silver1k-desc") {
                rows.sort((a, b) => ((b.sv || 0) * 100) - ((a.sv || 0) * 100));
            } else if (TABLE_SORT === "silver1k-asc") {
                rows.sort((a, b) => ((a.sv || 0) * 100) - ((b.sv || 0) * 100));
            } else if (TABLE_SORT === "gchg-asc") {
                rows.sort((a, b) => (a.gChg || 0) - (b.gChg || 0));
            } else if (TABLE_SORT === "gchg-desc") {
                rows.sort((a, b) => (b.gChg || 0) - (a.gChg || 0));
            } else if (TABLE_SORT === "schg-asc") {
                rows.sort((a, b) => (a.sChg || 0) - (b.sChg || 0));
            } else if (TABLE_SORT === "schg-desc") {
                rows.sort((a, b) => (b.sChg || 0) - (a.sChg || 0));
            }

            const totalCount = rows.length;
            TABLE_TOTAL_PAGES = Math.max(1, Math.ceil(totalCount / TABLE_PAGE_SIZE));
            TABLE_CURRENT_PAGE = Math.max(1, Math.min(TABLE_CURRENT_PAGE, TABLE_TOTAL_PAGES));

            const startIdx = (TABLE_CURRENT_PAGE - 1) * TABLE_PAGE_SIZE;
            const endIdx = Math.min(startIdx + TABLE_PAGE_SIZE, totalCount);
            const displayRows = rows.slice(startIdx, endIdx);

            // Update Pagination UI elements
            const elRange = document.getElementById("tblPageRange");
            const elTot = document.getElementById("tblTotalCount");
            const elPageInput = document.getElementById("tblPageInput");
            const elTotalPages = document.getElementById("tblTotalPages");
            const btnFirst = document.getElementById("btnPageFirst");
            const btnPrev = document.getElementById("btnPagePrev");
            const btnNext = document.getElementById("btnPageNext");
            const btnLast = document.getElementById("btnPageLast");

            if (elRange) elRange.textContent = totalCount > 0 ? (startIdx + 1) + '–' + endIdx : '0';
            if (elTot) elTot.textContent = totalCount.toLocaleString('en-IN');
            if (elPageInput) { elPageInput.value = TABLE_CURRENT_PAGE; elPageInput.max = TABLE_TOTAL_PAGES; }
            if (elTotalPages) elTotalPages.textContent = TABLE_TOTAL_PAGES;

            if (btnFirst) btnFirst.disabled = (TABLE_CURRENT_PAGE <= 1);
            if (btnPrev) btnPrev.disabled = (TABLE_CURRENT_PAGE <= 1);
            if (btnNext) btnNext.disabled = (TABLE_CURRENT_PAGE >= TABLE_TOTAL_PAGES);
            if (btnLast) btnLast.disabled = (TABLE_CURRENT_PAGE >= TABLE_TOTAL_PAGES);

            // Render Rows (Bounded to 50 rows, 100% Zero-Lag DOM)
            tbody.innerHTML = displayRows.map(r => {
                const gColor = r.gChg < 0 ? "text-rose-600 dark:text-rose-400" : r.gChg > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-[#94A3B8]";
                const sColor = r.sChg < 0 ? "text-rose-600 dark:text-rose-400" : r.sChg > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-[#94A3B8]";
                const gArrow = r.gChg < 0 ? "▼" : r.gChg > 0 ? "▲" : "•";
                const sArrow = r.sChg < 0 ? "▼" : r.sChg > 0 ? "▲" : "•";
                const isVol = r.isVolatile;

                let moveBadge = '<span class="text-slate-400 dark:text-[#64748B] text-[10px]">Normal</span>';
                if (r.isExtreme) {
                    moveBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap inline-flex items-center gap-1"><svg class="w-2.5 h-2.5 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg><span>EXTREME SHOCK</span></span>';
                } else if (r.isVolatile) {
                    moveBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap inline-flex items-center gap-1"><svg class="w-2.5 h-2.5 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg><span>HIGH VOLATILITY</span></span>';
                }

                return \`
                    <tr class="hover:bg-slate-100/70 dark:hover:bg-[#1A283B]/50 transition-colors \${isVol ? "volatile-row" : ""}">
                        <td class="py-2.5 px-3 font-bold text-[#C5A059] whitespace-nowrap">\${fmtDate(r.d)}</td>
                        \${VISIBLE_COLS.g24 ? \`<td class="py-2.5 px-3 text-right font-bold font-num whitespace-nowrap">\${inr.format(r.g)}</td>\` : ""}
                        \${VISIBLE_COLS.g22 ? \`<td class="py-2.5 px-3 text-right font-num text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">\${inr.format(r.g22)}</td>\` : ""}
                        \${VISIBLE_COLS.gchg ? \`<td class="py-2.5 px-3 text-right font-num font-bold \${gColor} whitespace-nowrap">\${gArrow} \${Math.abs(r.gChg).toFixed(2)}%</td>\` : ""}
                        \${VISIBLE_COLS.s10 ? \`<td class="py-2.5 px-3 text-right font-bold font-num whitespace-nowrap">\${inr2.format(r.sv)}</td>\` : ""}
                        \${VISIBLE_COLS.s1k ? \`<td class="py-2.5 px-3 text-right font-num font-bold whitespace-nowrap">\${inr.format(r.sv * 100)}</td>\` : ""}
                        \${VISIBLE_COLS.schg ? \`<td class="py-2.5 px-3 text-right font-num font-bold \${sColor} whitespace-nowrap">\${sArrow} \${Math.abs(r.sChg).toFixed(2)}%</td>\` : ""}
                        \${VISIBLE_COLS.mov ? \`<td class="py-2.5 px-3 text-center">\${moveBadge}</td>\` : ""}
                    </tr>
                \`;
            }).join("");
            updateStickyHeader();
        }

        // Sticky Header Synchronization (Keeps Table Header Pinned Under Top Nav While Rows Scroll)
        let stickyRafId = null;
        function updateStickyHeader() {
            if (stickyRafId) cancelAnimationFrame(stickyRafId);
            stickyRafId = requestAnimationFrame(() => {
                const thead = document.getElementById("auditTableHead");
                const table = document.getElementById("auditTable");
                const nav = document.querySelector("header");
                if (!thead || !table) return;

                const navHeight = nav ? nav.offsetHeight : 52;
                const rect = table.getBoundingClientRect();
                const theadHeight = thead.offsetHeight || 38;
                const ths = thead.querySelectorAll("th");

                // Check if table rows are currently scrolling under the top navbar
                if (rect.top < navHeight && rect.bottom > (navHeight + theadHeight)) {
                    const maxOffset = rect.height - theadHeight;
                    const offset = Math.min(navHeight - rect.top, maxOffset);
                    for (let i = 0; i < ths.length; i++) {
                        ths[i].style.transform = 'translateY(' + offset + 'px)';
                        ths[i].style.zIndex = "30";
                        ths[i].style.boxShadow = "0 2px 4px rgba(0,0,0,0.35)";
                    }
                } else {
                    for (let i = 0; i < ths.length; i++) {
                        ths[i].style.transform = "";
                        ths[i].style.boxShadow = "";
                    }
                }
            });
        }

        window.addEventListener("scroll", updateStickyHeader, { passive: true });
        window.addEventListener("resize", updateStickyHeader, { passive: true });

        // Pagination Navigation Handlers
        function goToTablePage(page) {
            TABLE_CURRENT_PAGE = Math.max(1, Math.min(page, TABLE_TOTAL_PAGES));
            renderAuditTable();
            const tblWrap = document.getElementById("tableContainer");
            if (tblWrap) tblWrap.scrollTop = 0;
        }

        function changeTablePageSize(size) {
            TABLE_PAGE_SIZE = parseInt(size, 10) || 50;
            TABLE_CURRENT_PAGE = 1;
            renderAuditTable();
        }

        function jumpToYear(targetYear) {
            if (!DATA || !DATA.length) return;
            // Rows are sorted descending by default in table (latest 2026 first)
            let foundIdx = -1;
            for (let i = 0; i < DATA.length; i++) {
                // If table is date-desc:
                const r = DATA[DATA.length - 1 - i]; // Reverse order
                if (r && r.d.startsWith(targetYear)) {
                    foundIdx = i;
                    break;
                }
            }
            if (foundIdx !== -1) {
                TABLE_CURRENT_PAGE = Math.floor(foundIdx / TABLE_PAGE_SIZE) + 1;
                renderAuditTable();
                const tblWrap = document.getElementById("tableContainer");
                if (tblWrap) tblWrap.scrollTop = 0;
            }
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
                // ==========================================
                // ==========================================
        // UNIFIED MULTI-CHART TERMINAL ENGINE (TICK SELECTOR)
        // ==========================================
        const ASSETS_CONFIG = {
            gold24: { key: 'g', name: 'INDIA GOLD 24K', unit: 'INR', color: '#C5A059', fmt: function(v) { return inr.format(v); } },
            silver: { key: 'sv', name: 'SILVER .999', unit: 'INR', color: '#20C7A6', fmt: function(v) { return inr2.format(v); } },
            xau:    { key: 'xau', name: 'SPOT GOLD XAU', unit: 'USD', color: '#A78BFA', fmt: function(v) { return usd2.format(v); } },
            xag:    { key: 'xag', name: 'SPOT SILVER XAG', unit: 'USD', color: '#FF8A65', fmt: function(v) { return usd2.format(v); } }
        };

        let ACTIVE_ASSETS = {
            gold24: true,
            silver: true,
            xau: false,
            xag: false
        };

        SESSIONS_COUNT = 22; // default 1M
        window.ACTIVE_ASSETS = ACTIVE_ASSETS;
        window.ASSETS_CONFIG = ASSETS_CONFIG;
        window.toggleAssetChart = toggleAssetChart;
        window.setTimeframe = setTimeframe;
        window.renderCurrentCharts = renderCurrentCharts;
        window.syncUnifiedHoverAt = syncUnifiedHoverAt;
        window.clearUnifiedHover = clearUnifiedHover;
        window.selectChartMode = selectChartMode;

        function toggleAssetChart(assetKey) {
            const activeKeys = Object.keys(ACTIVE_ASSETS).filter(function(k) { return ACTIVE_ASSETS[k]; });
            if (ACTIVE_ASSETS[assetKey] && activeKeys.length === 1) {
                return; // At least one chart must remain active
            }
            ACTIVE_ASSETS[assetKey] = !ACTIVE_ASSETS[assetKey];
            updateTickButtonsUI();
            renderCurrentCharts();
        }

        function updateTickButtonsUI() {
            Object.keys(ASSETS_CONFIG).forEach(function(key) {
                const btn = document.getElementById('tick-' + key);
                const box = document.getElementById('tickBox-' + key);
                const cfg = ASSETS_CONFIG[key];
                const isActive = !!ACTIVE_ASSETS[key];

                if (btn && box) {
                    if (isActive) {
                        btn.style.borderColor = cfg.color;
                        btn.style.backgroundColor = cfg.color + '1A';
                        box.style.backgroundColor = cfg.color;
                        box.style.color = '#000000';
                        box.innerHTML = '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                    } else {
                        btn.style.borderColor = '';
                        btn.style.backgroundColor = '';
                        box.style.backgroundColor = 'transparent';
                        box.style.color = 'transparent';
                        box.innerHTML = '<span class="w-2 h-2 rounded-full border border-slate-400 dark:border-slate-500"></span>';
                    }
                }
            });

            // Dynamic Comparison Badge (e.g. 'SILVER 999 vs XAG' or 'GOLD 24K vs XAU')
            const compTag = document.getElementById('comparisonTag');
            if (compTag) {
                const active = Object.keys(ACTIVE_ASSETS).filter(function(k) { return ACTIVE_ASSETS[k]; });
                if (active.length === 2) {
                    if (ACTIVE_ASSETS.gold24 && ACTIVE_ASSETS.xau) {
                        compTag.textContent = 'GOLD 24K vs XAU';
                        compTag.classList.remove('hidden');
                    } else if (ACTIVE_ASSETS.silver && ACTIVE_ASSETS.xag) {
                        compTag.textContent = 'SILVER 999 vs XAG';
                        compTag.classList.remove('hidden');
                    } else if (ACTIVE_ASSETS.gold24 && ACTIVE_ASSETS.silver) {
                        compTag.textContent = 'INDIA: GOLD 24K & SILVER';
                        compTag.classList.remove('hidden');
                    } else if (ACTIVE_ASSETS.xau && ACTIVE_ASSETS.xag) {
                        compTag.textContent = 'GLOBAL: XAU & XAG';
                        compTag.classList.remove('hidden');
                    } else {
                        compTag.textContent = active.map(function(k) { return ASSETS_CONFIG[k].name.replace('INDIA ', '').replace('SPOT ', ''); }).join(' vs ');
                        compTag.classList.remove('hidden');
                    }
                } else if (active.length === 3) {
                    compTag.textContent = active.map(function(k) { return ASSETS_CONFIG[k].name.replace('INDIA ', '').replace('SPOT ', ''); }).join(' + ');
                    compTag.classList.remove('hidden');
                } else if (active.length === 4) {
                    compTag.textContent = 'ALL 4 METALS';
                    compTag.classList.remove('hidden');
                } else {
                    compTag.classList.add('hidden');
                }
            }
        }

        function setTimeframe(tf, count) {
            SESSIONS_COUNT = count;
            document.querySelectorAll('.tf-btn').forEach(function(b) {
                b.className = 'tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap flex-shrink-0';
            });
            const btn = document.getElementById('tf' + tf);
            if (btn) btn.className = 'tf-btn px-2.5 py-1 rounded text-center bg-[#C5A059] text-black font-bold transition-colors whitespace-nowrap flex-shrink-0';
            renderCurrentCharts();
        }

        function selectChartMode(mode) {
            if (mode === 'goldIn' || mode === 'gold24' || mode === 'gold') {
                ACTIVE_ASSETS = { gold24: true, silver: false, xau: false, xag: false };
            } else if (mode === 'silverIn' || mode === 'silver') {
                ACTIVE_ASSETS = { gold24: false, silver: true, xau: false, xag: false };
            } else if (mode === 'xau' || mode === 'goldGl') {
                ACTIVE_ASSETS = { gold24: false, silver: false, xau: true, xag: false };
            } else if (mode === 'xag' || mode === 'silverGl') {
                ACTIVE_ASSETS = { gold24: false, silver: false, xau: false, xag: true };
            } else if (mode === 'quad' || mode === 'all') {
                ACTIVE_ASSETS = { gold24: true, silver: true, xau: true, xag: true };
            }
            updateTickButtonsUI();
            renderCurrentCharts();
        }

        function renderCurrentCharts() {
            const rows = DATA.slice(-SESSIONS_COUNT);
            if (!rows || rows.length < 2) return;

            const last = rows[rows.length - 1];
            const prev = rows[rows.length - 2] || last;

            const activeKeys = Object.keys(ASSETS_CONFIG).filter(function(k) { return ACTIVE_ASSETS[k]; });
            const count = activeKeys.length;

            let canvasHeight = '220px';
            if (count === 1) canvasHeight = '320px';
            else if (count === 2) canvasHeight = '220px';
            else if (count === 3) canvasHeight = '180px';
            else if (count >= 4) canvasHeight = '160px';

            Object.keys(ASSETS_CONFIG).forEach(function(key) {
                const pane = document.getElementById('pane-' + key);
                const wrap = document.getElementById('wrap-' + key);
                const canvas = document.getElementById('canvas-' + key);
                const valEl = document.getElementById('rateVal-' + key);
                const chgEl = document.getElementById('rateChg-' + key);
                const cfg = ASSETS_CONFIG[key];

                if (!pane || !wrap || !canvas) return;

                if (ACTIVE_ASSETS[key]) {
                    pane.classList.remove('hidden');
                    wrap.style.height = canvasHeight;

                    const diff = last[cfg.key] - (prev[cfg.key] || last[cfg.key]);
                    const pct = prev[cfg.key] ? ((diff / prev[cfg.key]) * 100) : 0;
                    if (valEl) valEl.textContent = cfg.fmt(last[cfg.key]);
                    if (chgEl) {
                        chgEl.className = (diff >= 0 ? 'text-emerald-500' : 'text-rose-500') + ' font-bold font-num text-[10px] sm:text-[11px]';
                        chgEl.textContent = (diff >= 0 ? '▲ +' : '▼ ') + Math.abs(pct).toFixed(2) + '%';
                    }

                    drawSingleAssetChart(canvas, rows, cfg);
                } else {
                    pane.classList.add('hidden');
                }
            });

            bindUnifiedCrosshairs(rows);
            updateTickButtonsUI();
        }

        function drawSingleAssetChart(canvas, rows, cfg) {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            const W = rect.width;
            const H = rect.height;
            const isMobile = W < 500;
            const padL = isMobile ? 48 : 65;
            const padR = isMobile ? 12 : 20;
            const padT = 16;
            const padB = isMobile ? 22 : 26;
            const plotW = W - padL - padR;
            const plotH = H - padT - padB;

            const isDark = document.documentElement.classList.contains('dark');
            ctx.clearRect(0, 0, W, H);

            const values = rows.map(function(r) { return r[cfg.key]; }).filter(function(v) { return v != null; });
            let minVal = Math.min.apply(null, values);
            let maxVal = Math.max.apply(null, values);
            if (minVal === maxVal) { minVal -= 1; maxVal += 1; }

            const padRange = (maxVal - minVal) * 0.08;
            minVal -= padRange;
            maxVal += padRange;

            const getX = function(i) { return padL + (i / (rows.length - 1)) * plotW; };
            const getY = function(val) { return padT + plotH - ((val - minVal) / (maxVal - minVal)) * plotH; };

            // 1. Grid Lines and Left Y-Axis Values
            const gridLines = isMobile ? 3 : 4;
            ctx.lineWidth = 1;
            ctx.font = isMobile ? '8.5px JetBrains Mono, monospace' : '9.5px JetBrains Mono, monospace';

            for (let g = 0; g <= gridLines; g++) {
                const y = padT + (plotH / gridLines) * g;
                const val = maxVal - ((maxVal - minVal) / gridLines) * g;

                ctx.strokeStyle = isDark ? '#1E293B' : '#E2E8F0';
                ctx.beginPath();
                ctx.setLineDash([3, 4]);
                ctx.moveTo(padL, y);
                ctx.lineTo(W - padR, y);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
                ctx.textAlign = 'right';
                ctx.fillText(cfg.fmt(val), padL - (isMobile ? 4 : 8), y + 3);
            }

            // 2. X-axis Dates
            ctx.textAlign = 'center';
            ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
            ctx.font = isMobile ? '8.5px JetBrains Mono, monospace' : '9.5px JetBrains Mono, monospace';
            const numDates = isMobile ? 3 : 6;
            for (let k = 0; k < numDates; k++) {
                const idx = Math.round(k * (rows.length - 1) / (numDates - 1));
                const x = getX(idx);
                ctx.fillText(fmtDateS(rows[idx].d), x, H - (isMobile ? 4 : 7));
            }

            // 3. Area Gradient Fill
            const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
            grad.addColorStop(0, cfg.color + (isDark ? '28' : '18'));
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

            // 4. Line Stroke
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(rows[0][cfg.key]));
            for (let i = 1; i < rows.length; i++) {
                ctx.lineTo(getX(i), getY(rows[i][cfg.key]));
            }
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = isMobile ? 2 : 2.5;
            ctx.stroke();

            // 5. End Pulse Dot
            const lastX = getX(rows.length - 1);
            const lastY = getY(rows[rows.length - 1][cfg.key]);
            ctx.beginPath();
            ctx.arc(lastX, lastY, isMobile ? 3.5 : 4.5, 0, Math.PI * 2);
            ctx.fillStyle = cfg.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = isDark ? '#0A141F' : '#FFFFFF';
            ctx.stroke();
        }

        function bindUnifiedCrosshairs(rows) {
            const activeKeys = Object.keys(ASSETS_CONFIG).filter(function(k) { return ACTIVE_ASSETS[k]; });

            activeKeys.forEach(function(key) {
                const wrap = document.getElementById('wrap-' + key);
                const canvas = document.getElementById('canvas-' + key);
                if (!wrap || !canvas) return;

                const handleHover = function(e) {
                    const rect = canvas.getBoundingClientRect();
                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                    const mouseX = clientX - rect.left;
                    const isMobile = rect.width < 500;
                    const padL = isMobile ? 48 : 65;
                    const padR = isMobile ? 12 : 20;
                    const plotW = rect.width - padL - padR;

                    let ratio = (mouseX - padL) / plotW;
                    ratio = Math.max(0, Math.min(1, ratio));
                    const idx = Math.round(ratio * (rows.length - 1));
                    syncUnifiedHoverAt(idx);
                };

                const handleLeave = function() {
                    clearUnifiedHover();
                };

                wrap.onmousemove = handleHover;
                wrap.ontouchmove = handleHover;
                wrap.onmouseleave = handleLeave;
                wrap.ontouchend = handleLeave;
            });
        }

        function syncUnifiedHoverAt(idx) {
            const rows = DATA.slice(-SESSIONS_COUNT);
            if (!rows || idx < 0 || idx >= rows.length) return;
            const targetRow = rows[idx];
            const prevRow = rows[idx - 1] || targetRow;

            const activeKeys = Object.keys(ASSETS_CONFIG).filter(function(k) { return ACTIVE_ASSETS[k]; });

            activeKeys.forEach(function(key) {
                const cfg = ASSETS_CONFIG[key];
                const canvas = document.getElementById('canvas-' + key);
                const line = document.getElementById('crosshair-' + key);
                const dot = document.getElementById('dot-' + key);
                const valEl = document.getElementById('rateVal-' + key);
                const chgEl = document.getElementById('rateChg-' + key);

                if (!canvas || !line || !dot) return;

                const rect = canvas.getBoundingClientRect();
                const isMobile = rect.width < 500;
                const padL = isMobile ? 48 : 65;
                const padR = isMobile ? 12 : 20;
                const padT = 16;
                const padB = isMobile ? 22 : 26;
                const plotW = rect.width - padL - padR;
                const plotH = rect.height - padT - padB;

                const values = rows.map(function(r) { return r[cfg.key]; }).filter(function(v) { return v != null; });
                let minVal = Math.min.apply(null, values);
                let maxVal = Math.max.apply(null, values);
                if (minVal === maxVal) { minVal -= 1; maxVal += 1; }
                const padRange = (maxVal - minVal) * 0.08;
                minVal -= padRange;
                maxVal += padRange;

                const ptX = padL + (idx / (rows.length - 1)) * plotW;
                const ptY = padT + plotH - ((targetRow[cfg.key] - minVal) / (maxVal - minVal)) * plotH;

                line.style.left = ptX + 'px';
                line.style.opacity = '0.7';

                dot.style.left = ptX + 'px';
                dot.style.top = ptY + 'px';
                dot.style.opacity = '1';

                const diff = targetRow[cfg.key] - (prevRow[cfg.key] || targetRow[cfg.key]);
                const pct = prevRow[cfg.key] ? ((diff / prevRow[cfg.key]) * 100) : 0;

                if (valEl) {
                    valEl.textContent = cfg.fmt(targetRow[cfg.key]);
                }
                if (chgEl) {
                    chgEl.className = (diff >= 0 ? 'text-emerald-500' : 'text-rose-500') + ' font-bold font-num text-[10px] sm:text-[11px]';
                    chgEl.textContent = (diff >= 0 ? '▲ +' : '▼ ') + Math.abs(pct).toFixed(2) + '% (' + fmtDateS(targetRow.d) + ')';
                }
            });
        }

        function clearUnifiedHover() {
            const rows = DATA.slice(-SESSIONS_COUNT);
            if (!rows || rows.length === 0) return;
            const last = rows[rows.length - 1];
            const prev = rows[rows.length - 2] || last;

            const activeKeys = Object.keys(ASSETS_CONFIG).filter(function(k) { return ACTIVE_ASSETS[k]; });

            activeKeys.forEach(function(key) {
                const cfg = ASSETS_CONFIG[key];
                const line = document.getElementById('crosshair-' + key);
                const dot = document.getElementById('dot-' + key);
                const valEl = document.getElementById('rateVal-' + key);
                const chgEl = document.getElementById('rateChg-' + key);

                if (line) line.style.opacity = '0';
                if (dot) dot.style.opacity = '0';

                const diff = last[cfg.key] - (prev[cfg.key] || last[cfg.key]);
                const pct = prev[cfg.key] ? ((diff / prev[cfg.key]) * 100) : 0;

                if (valEl) valEl.textContent = cfg.fmt(last[cfg.key]);
                if (chgEl) {
                    chgEl.className = (diff >= 0 ? 'text-emerald-500' : 'text-rose-500') + ' font-bold font-num text-[10px] sm:text-[11px]';
                    chgEl.textContent = (diff >= 0 ? '▲ +' : '▼ ') + Math.abs(pct).toFixed(2) + '%';
                }
            });
        }

        function showHoverPillAt(idx) {
            const rows = DATA.slice(-SESSIONS_COUNT);
            if (rows && idx >= 0 && idx < rows.length) {
                setTimeout(function() {
                    syncUnifiedHoverAt(idx);
                }, 50);
            }
        }

        // --- FETCH SHEET DATA ---
        async function fetchSheetData(isManual = false) {
            const icon = document.getElementById('syncIcon');
            if (icon) icon.classList.add('animate-spin');

            try {
                const fetchUrl = isManual ? APPS_SCRIPT_URL : (APPS_SCRIPT_URL + '?limit=100');
                const res = await fetch(fetchUrl, { method: 'GET', mode: 'cors' });
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
                                    gi: r.intlGoldPer10g || base.gi,
                                    si: r.intlSilverPer10g || base.si,
                                    xau: r.xauUsd || r['XAU/USD Spot'] || base.xau,
                                    xag: r.xagUsd || r['XAG/USD Spot'] || base.xag,
                                    fx: r.usdInr || r['USD/INR Rate'] || base.fx
                                };
                            });
                            window.DATA = DATA = enrichRows(Object.values(byDate).sort((a, b) => a.d.localeCompare(b.d)));
                            renderTopCards();
                            render52WeekStats();
                            renderAuditTable();
                            renderCurrentCharts();

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
            renderCurrentCharts();
            
        }

        // Resize Listener
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (CURRENT_MODE === 'quad') {
                    renderQuadCharts();
                } else {
                    renderCurrentCharts();
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
            if (hashMode) {
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
