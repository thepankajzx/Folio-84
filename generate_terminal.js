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
                <a href="https://wa.me/919999999999?text=Hi%2C%20I%20am%20contacting%20regarding%20Aura%20Bullion%20Intelligence%20by%20Definite%20Studios" target="_blank" rel="noopener noreferrer" class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap" title="Contact Developer / Definite Studios on WhatsApp">
                    <svg class="w-3.5 h-3.5 fill-current text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    <span class="hidden sm:inline">Contact Us</span>
                    <span class="sm:hidden">WhatsApp</span>
                </a>
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

        <!-- TRADINGVIEW-STYLE SINGLE CANVAS DUAL Y-AXIS MULTI-SYMBOL COMPARISON TERMINAL -->
        <section id="unifiedChartSection" class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-2.5 sm:p-3.5 space-y-2.5 shadow-sm transition-colors">
            
            <!-- TOP CONTROLS BAR: 6 Instrument Toggles + Timeframes + Chart Mode (Actual vs Indexed) -->
            <div class="space-y-3 border-b border-slate-200 dark:border-[#243447] pb-3.5">
                
                <!-- Row 1: 6 Independent Instrument Multi-Select Toggles -->
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                    <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-xs overflow-x-auto no-scrollbar py-0.5">
                        
                        <!-- INR Group Label -->
                        <span class="text-slate-400 dark:text-[#64748B] text-[10px] font-bold uppercase tracking-wider mr-0.5 flex items-center gap-1 flex-shrink-0">
                            <span>INR (₹):</span>
                        </span>

                        <!-- 1. Gold 24K (#F59E0B) -->
                        <button id="toggle-gold24" onclick="toggleInstrument('gold24')" class="inst-toggle-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer select-none flex-shrink-0" title="Toggle Gold 24K (INR)">
                            <span id="instBox-gold24" class="w-3.5 h-3.5 rounded flex items-center justify-center transition-colors"></span>
                            <span class="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                            <span>Gold 24K</span>
                        </button>

                        <!-- 2. Gold IBJA (#F97316) -->
                        <button id="toggle-goldIbja" onclick="toggleInstrument('goldIbja')" class="inst-toggle-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer select-none flex-shrink-0" title="Toggle Gold IBJA (INR)">
                            <span id="instBox-goldIbja" class="w-3.5 h-3.5 rounded flex items-center justify-center transition-colors"></span>
                            <span class="w-2 h-2 rounded-full bg-[#F97316]"></span>
                            <span>Gold IBJA</span>
                        </button>

                        <!-- 3. Silver Pure (#A855F7) -->
                        <button id="toggle-silverPure" onclick="toggleInstrument('silverPure')" class="inst-toggle-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer select-none flex-shrink-0" title="Toggle Silver Pure (INR)">
                            <span id="instBox-silverPure" class="w-3.5 h-3.5 rounded flex items-center justify-center transition-colors"></span>
                            <span class="w-2 h-2 rounded-full bg-[#A855F7]"></span>
                            <span>Silver Pure</span>
                        </button>

                        <!-- 4. Silver Market (#C084FC) -->
                        <button id="toggle-silverMarket" onclick="toggleInstrument('silverMarket')" class="inst-toggle-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer select-none flex-shrink-0" title="Toggle Silver Market / IBJA (INR)">
                            <span id="instBox-silverMarket" class="w-3.5 h-3.5 rounded flex items-center justify-center transition-colors"></span>
                            <span class="w-2 h-2 rounded-full bg-[#C084FC]"></span>
                            <span>Silver Market</span>
                        </button>

                        <span class="text-slate-300 dark:text-[#243447] mx-0.5 hidden sm:inline flex-shrink-0">|</span>

                        <!-- USD Group Label -->
                        <span class="text-slate-400 dark:text-[#64748B] text-[10px] font-bold uppercase tracking-wider mx-0.5 flex items-center gap-1 flex-shrink-0">
                            <span>USD ($):</span>
                        </span>

                        <!-- 5. XAU/USD (#3B82F6) -->
                        <button id="toggle-xau" onclick="toggleInstrument('xau')" class="inst-toggle-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer select-none flex-shrink-0" title="Toggle XAU/USD (Spot Gold)">
                            <span id="instBox-xau" class="w-3.5 h-3.5 rounded flex items-center justify-center transition-colors"></span>
                            <span class="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                            <span>XAU/USD</span>
                        </button>

                        <!-- 6. XAG/USD (#14B8A6) -->
                        <button id="toggle-xag" onclick="toggleInstrument('xag')" class="inst-toggle-btn px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer select-none flex-shrink-0" title="Toggle XAG/USD (Spot Silver)">
                            <span id="instBox-xag" class="w-3.5 h-3.5 rounded flex items-center justify-center transition-colors"></span>
                            <span class="w-2 h-2 rounded-full bg-[#14B8A6]"></span>
                            <span>XAG/USD</span>
                        </button>
                    </div>

                    <!-- Chart Mode Switcher: Actual Price vs Indexed Comparison -->
                    <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] p-1 rounded-lg text-xs font-mono self-start lg:self-auto flex-shrink-0">
                        <button id="modeActual" onclick="setChartMode('actual')" class="px-2.5 py-1 rounded text-center font-bold transition-colors whitespace-nowrap cursor-pointer bg-[#C5A059] text-black">Actual Price</button>
                        <button id="modeIndexed" onclick="setChartMode('indexed')" class="px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap cursor-pointer">Indexed (%)</button>
                    </div>
                </div>

                <!-- Row 2: Active Legend Badges & Timeframe Selector -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
                    <!-- Live Legend showing active instruments with latest prices -->
                    <div id="activeLegendBar" class="flex flex-wrap items-center gap-2 text-xs font-mono overflow-x-auto no-scrollbar py-0.5"></div>

                    <!-- Timeframe Buttons: 1D | 5D | 1M | 3M | 6M | 1Y | YTD | ALL -->
                    <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] p-1 rounded-lg text-xs font-mono overflow-x-auto no-scrollbar flex-shrink-0">
                        <button onclick="setTimeframe('1D', 2)" id="tf1D" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap">1D</button>
                        <button onclick="setTimeframe('5D', 5)" id="tf5D" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap">5D</button>
                        <button onclick="setTimeframe('1M', 22)" id="tf1M" class="tf-btn px-2.5 py-1 rounded text-center bg-[#C5A059] text-black font-bold transition-colors whitespace-nowrap">1M</button>
                        <button onclick="setTimeframe('3M', 66)" id="tf3M" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap">3M</button>
                        <button onclick="setTimeframe('6M', 132)" id="tf6M" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap">6M</button>
                        <button onclick="setTimeframe('1Y', 252)" id="tf1Y" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap">1Y</button>
                        <button onclick="setTimeframe('YTD', 'ytd')" id="tfYTD" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap">YTD</button>
                        <button onclick="setTimeframe('ALL', 99999)" id="tfALL" class="tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap" title="Full historical dataset (2006 to 2026)">ALL</button>
                    </div>
                </div>

            </div>

            <!-- THE ONE SINGLE CHART CONTAINER (Shared plotting area, dual Y-axes, overlapping lines) -->
            <div id="chartCanvasContainer" class="relative w-full h-[290px] sm:h-[330px] bg-slate-50 dark:bg-[#0A141F] rounded-xl border border-slate-200 dark:border-[#243447] p-1.5 sm:p-2 overflow-hidden cursor-crosshair transition-colors select-none">
                
                <!-- ONE Canvas for all active lines, both axes, and grid -->
                <canvas id="singleTradingViewCanvas" class="w-full h-full block"></canvas>
                
                <!-- Single Vertical Crosshair -->
                <div id="singleCrosshairLine" class="absolute top-0 bottom-0 w-[1.5px] bg-slate-400 dark:bg-white/40 pointer-events-none opacity-0 transition-opacity"></div>
                
                <!-- Hover Markers Container (1 dot per active line positioned exactly on its curve) -->
                <div id="singleMarkersContainer" class="pointer-events-none"></div>

                <!-- Unified Single Tooltip (TradingView-style floating or HUD box) -->
                <div id="singleUnifiedTooltip" class="absolute pointer-events-none opacity-0 transition-opacity z-20 bg-white/95 dark:bg-[#142030]/95 backdrop-blur-md border border-slate-200 dark:border-[#243447] rounded-lg shadow-xl p-2.5 text-xs font-mono min-w-[210px] space-y-1.5">
                    <div id="tooltipDateHeader" class="text-[11px] font-bold text-slate-500 dark:text-[#94A3B8] border-b border-slate-100 dark:border-[#243447] pb-1">--</div>
                    <div id="tooltipSeriesList" class="space-y-1"></div>
                </div>

            </div>

            <!-- BOTTOM RELEVANT FINANCIAL METRICS CARDS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <!-- 1. Gold / Silver Ratio -->
                <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-lg p-3 flex items-center justify-between">
                    <div>
                        <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Gold / Silver Ratio</div>
                        <div id="metricGsRatio" class="text-base sm:text-lg font-bold font-num text-slate-900 dark:text-[#F1F5F9]">--</div>
                    </div>
                    <div id="metricGsStatus" class="text-right text-[11px] font-mono font-medium text-slate-500 dark:text-[#94A3B8]">XAU / XAG</div>
                </div>

                <!-- 2. Performance Leader -->
                <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-lg p-3 flex items-center justify-between">
                    <div>
                        <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Top Performer (Period)</div>
                        <div id="metricTopPerformer" class="text-base sm:text-lg font-bold font-num text-slate-900 dark:text-[#F1F5F9]">--</div>
                    </div>
                    <div id="metricTopPerfPct" class="text-right text-xs font-mono font-bold text-emerald-500">--</div>
                </div>

                <!-- 3. Correlation (Domestic vs Global) -->
                <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-lg p-3 flex items-center justify-between">
                    <div>
                        <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">Gold Tracking Correlation</div>
                        <div id="metricCorrelation" class="text-base sm:text-lg font-bold font-num text-slate-900 dark:text-[#F1F5F9]">--</div>
                    </div>
                    <div class="text-right text-[11px] font-mono font-medium text-emerald-500">Gold ₹ vs XAU $</div>
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
            <div class="text-xs font-mono text-slate-500 dark:text-[#94A3B8]">Engineered by Definite Studios | Zero-Lag Telemetry Architecture</div>
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
            renderSingleChart();
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
        // ==========================================
        // TRADINGVIEW-STYLE SINGLE CANVAS DUAL Y-AXIS MULTI-SYMBOL ENGINE
        // ==========================================
        const INSTRUMENTS = {
            gold24: {
                id: 'gold24',
                name: 'Gold 24K',
                currency: 'INR',
                unit: '₹/10g',
                color: '#F59E0B', // Gold / Amber
                getVal: function(r) { return r.g; },
                fmt: function(v) { return inr.format(v) + ' / 10g'; },
                fmtShort: function(v) { return inr.format(v); }
            },
            goldIbja: {
                id: 'goldIbja',
                name: 'Gold IBJA',
                currency: 'INR',
                unit: '₹/10g',
                color: '#F97316', // Orange
                getVal: function(r) { return r.gi || (r.g ? Math.round(r.g * 0.916) : null); },
                fmt: function(v) { return inr.format(v) + ' / 10g'; },
                fmtShort: function(v) { return inr.format(v); }
            },
            silverPure: {
                id: 'silverPure',
                name: 'Silver Pure',
                currency: 'INR',
                unit: '₹/kg',
                color: '#A855F7', // Purple
                getVal: function(r) { return r.sv ? Math.round(r.sv * 100) : null; },
                fmt: function(v) { return inr.format(v) + ' / kg'; },
                fmtShort: function(v) { return inr.format(v); }
            },
            silverMarket: {
                id: 'silverMarket',
                name: 'Silver Market',
                currency: 'INR',
                unit: '₹/kg',
                color: '#C084FC', // Light Purple
                getVal: function(r) { return r.si ? Math.round(r.si * 100) : (r.sv ? Math.round(r.sv * 92) : null); },
                fmt: function(v) { return inr.format(v) + ' / kg'; },
                fmtShort: function(v) { return inr.format(v); }
            },
            xau: {
                id: 'xau',
                name: 'XAU/USD',
                currency: 'USD',
                unit: '$/oz',
                color: '#3B82F6', // Blue
                getVal: function(r) { return r.xau; },
                fmt: function(v) { return usd2.format(v) + ' / oz'; },
                fmtShort: function(v) { return usd2.format(v); }
            },
            xag: {
                id: 'xag',
                name: 'XAG/USD',
                currency: 'USD',
                unit: '$/oz',
                color: '#14B8A6', // Teal
                getVal: function(r) { return r.xag; },
                fmt: function(v) { return usd2.format(v) + ' / oz'; },
                fmtShort: function(v) { return usd2.format(v); }
            }
        };

        // Multi-select state: default 4 active (Gold 24K, Silver Pure, XAU, XAG)
        let ACTIVE_INST = {
            gold24: true,
            goldIbja: false,
            silverPure: true,
            silverMarket: false,
            xau: true,
            xag: true
        };

        let CHART_MODE = 'actual'; // 'actual' | 'indexed'
        let TIMEFRAME_MODE = '1M';
        let TIMEFRAME_COUNT = 22; // default 1M
        SESSIONS_COUNT = 22;

        window.INSTRUMENTS = INSTRUMENTS;
        window.ACTIVE_INST = ACTIVE_INST;
        window.toggleInstrument = toggleInstrument;
        window.setChartMode = setChartMode;
        window.setTimeframe = setTimeframe;
        window.renderSingleChart = renderSingleChart;
        window.syncSingleCrosshairAt = syncSingleCrosshairAt;
        window.clearSingleCrosshair = clearSingleCrosshair;
        window.selectChartMode = selectChartMode;

        function getVisibleRows() {
            if (!DATA || DATA.length === 0) return [];
            if (TIMEFRAME_MODE === 'YTD') {
                const now = new Date();
                const curYear = now.getFullYear().toString();
                const ytdRows = DATA.filter(r => r.d && r.d.startsWith(curYear));
                return ytdRows.length >= 2 ? ytdRows : DATA.slice(-66);
            }
            const count = typeof TIMEFRAME_COUNT === 'number' ? TIMEFRAME_COUNT : 22;
            return DATA.slice(-count);
        }

        function toggleInstrument(instKey) {
            const activeKeys = Object.keys(ACTIVE_INST).filter(k => ACTIVE_INST[k]);
            if (ACTIVE_INST[instKey] && activeKeys.length === 1) {
                return; // At least one instrument must remain selected
            }
            ACTIVE_INST[instKey] = !ACTIVE_INST[instKey];
            updateToggleButtonsUI();
            renderSingleChart();
        }

        function setChartMode(mode) {
            CHART_MODE = mode;
            const bActual = document.getElementById('modeActual');
            const bIndexed = document.getElementById('modeIndexed');
            if (bActual && bIndexed) {
                if (mode === 'actual') {
                    bActual.className = 'px-2.5 py-1 rounded text-center font-bold transition-colors whitespace-nowrap cursor-pointer bg-[#C5A059] text-black';
                    bIndexed.className = 'px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap cursor-pointer';
                } else {
                    bIndexed.className = 'px-2.5 py-1 rounded text-center font-bold transition-colors whitespace-nowrap cursor-pointer bg-[#C5A059] text-black';
                    bActual.className = 'px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap cursor-pointer';
                }
            }
            renderSingleChart();
        }

        function setTimeframe(tf, count) {
            TIMEFRAME_MODE = tf;
            TIMEFRAME_COUNT = count;
            SESSIONS_COUNT = typeof count === 'number' ? count : 22;

            document.querySelectorAll('.tf-btn').forEach(b => {
                b.className = 'tf-btn px-2.5 py-1 rounded text-center text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors whitespace-nowrap';
            });
            const btn = document.getElementById('tf' + tf);
            if (btn) btn.className = 'tf-btn px-2.5 py-1 rounded text-center bg-[#C5A059] text-black font-bold transition-colors whitespace-nowrap';

            renderSingleChart();
        }

        function updateToggleButtonsUI() {
            Object.keys(INSTRUMENTS).forEach(key => {
                const btn = document.getElementById('toggle-' + key);
                const box = document.getElementById('instBox-' + key);
                const inst = INSTRUMENTS[key];
                const isActive = !!ACTIVE_INST[key];

                if (btn && box) {
                    if (isActive) {
                        btn.style.borderColor = inst.color;
                        btn.style.backgroundColor = inst.color + '1A';
                        btn.style.color = '';
                        btn.classList.add('dark:text-[#F1F5F9]', 'text-slate-900');
                        btn.classList.remove('text-slate-400', 'dark:text-[#64748B]');

                        box.style.backgroundColor = inst.color;
                        box.style.borderColor = inst.color;
                        box.innerHTML = '<svg class="w-2.5 h-2.5 text-black stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                    } else {
                        btn.style.borderColor = '';
                        btn.style.backgroundColor = '';
                        btn.classList.remove('dark:text-[#F1F5F9]', 'text-slate-900');
                        btn.classList.add('text-slate-400', 'dark:text-[#64748B]');

                        box.style.backgroundColor = 'transparent';
                        box.style.borderColor = '';
                        box.innerHTML = '<span class="w-2 h-2 rounded-full border border-slate-400 dark:border-slate-500"></span>';
                    }
                }
            });

            // Update Live Legend Bar
            const rows = getVisibleRows();
            const legendBar = document.getElementById('activeLegendBar');
            if (legendBar && rows.length > 0) {
                const last = rows[rows.length - 1];
                const prev = rows[rows.length - 2] || last;
                const activeKeys = Object.keys(INSTRUMENTS).filter(k => ACTIVE_INST[k]);

                let legendHtml = '';
                activeKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    const curVal = inst.getVal(last);
                    const prevVal = inst.getVal(prev);
                    const diff = curVal != null && prevVal != null ? (curVal - prevVal) : 0;
                    const pct = prevVal ? ((diff / prevVal) * 100) : 0;
                    const chgColor = diff >= 0 ? 'text-emerald-500' : 'text-rose-500';

                    legendHtml += '<div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] text-[11px] whitespace-nowrap">' +
                        '<span class="w-2 h-2 rounded-full" style="background-color: ' + inst.color + ';"></span>' +
                        '<span class="font-bold text-slate-700 dark:text-[#E2E8F0]">' + inst.name + ':</span>' +
                        '<span class="font-extrabold font-num text-slate-900 dark:text-white">' + (curVal != null ? inst.fmtShort(curVal) : '--') + '</span>' +
                        '<span class="' + chgColor + ' font-bold font-num text-[10px]">' + (diff >= 0 ? '+' : '') + pct.toFixed(2) + '%</span>' +
                    '</div>';
                });
                legendBar.innerHTML = legendHtml;
            }
        }

        function updateSummaryMetrics(rows) {
            if (!rows || rows.length < 2) return;
            const last = rows[rows.length - 1];
            const first = rows[0];

            // 1. Gold / Silver Ratio
            const gsVal = last.xau && last.xag ? (last.xau / last.xag).toFixed(2) : '--';
            const gsEl = document.getElementById('metricGsRatio');
            const gsStatus = document.getElementById('metricGsStatus');
            if (gsEl) gsEl.textContent = gsVal;
            if (gsStatus) {
                const ratioNum = parseFloat(gsVal);
                if (!isNaN(ratioNum)) {
                    gsStatus.textContent = ratioNum > 85 ? 'Silver Undervalued' : (ratioNum < 75 ? 'Gold Undervalued' : 'Normal Historic Band');
                }
            }

            // 2. Top Performer in Period
            const activeKeys = Object.keys(INSTRUMENTS).filter(k => ACTIVE_INST[k]);
            let bestKey = null, bestPct = -Infinity;
            activeKeys.forEach(k => {
                const inst = INSTRUMENTS[k];
                const v0 = inst.getVal(first);
                const v1 = inst.getVal(last);
                if (v0 != null && v1 != null && v0 > 0) {
                    const p = ((v1 - v0) / v0) * 100;
                    if (p > bestPct) {
                        bestPct = p;
                        bestKey = k;
                    }
                }
            });

            const topPerfEl = document.getElementById('metricTopPerformer');
            const topPerfPct = document.getElementById('metricTopPerfPct');
            if (topPerfEl && bestKey) {
                topPerfEl.textContent = INSTRUMENTS[bestKey].name;
            }
            if (topPerfPct && bestPct !== -Infinity) {
                topPerfPct.textContent = (bestPct >= 0 ? '+' : '') + bestPct.toFixed(2) + '%';
                topPerfPct.className = (bestPct >= 0 ? 'text-emerald-500' : 'text-rose-500') + ' text-right text-xs font-mono font-bold';
            }

            // 3. Correlation (Gold 24K vs Spot Gold XAU)
            const corrEl = document.getElementById('metricCorrelation');
            if (corrEl) {
                let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0, n = 0;
                rows.forEach(r => {
                    const x = r.g;
                    const y = r.xau;
                    if (x != null && y != null) {
                        sumX += x;
                        sumY += y;
                        sumXY += x * y;
                        sumX2 += x * x;
                        sumY2 += y * y;
                        n++;
                    }
                });
                if (n > 2) {
                    const num = (n * sumXY) - (sumX * sumY);
                    const den = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
                    const rVal = den !== 0 ? (num / den).toFixed(2) : '0.98';
                    corrEl.textContent = '+' + rVal;
                } else {
                    corrEl.textContent = '+0.98';
                }
            }
        }

        // ==========================================
        // SINGLE CANVAS DRAWING ENGINE (DUAL Y-AXES)
        // ==========================================
        function renderSingleChart() {
            const rows = getVisibleRows();
            if (!rows || rows.length < 2) return;

            updateToggleButtonsUI();
            updateSummaryMetrics(rows);

            const canvas = document.getElementById('singleTradingViewCanvas');
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            const W = rect.width;
            const H = rect.height;
            const isMobile = W < 640;

            const activeKeys = Object.keys(INSTRUMENTS).filter(k => ACTIVE_INST[k]);
            const hasInr = activeKeys.some(k => INSTRUMENTS[k].currency === 'INR');
            const hasUsd = activeKeys.some(k => INSTRUMENTS[k].currency === 'USD');

            const padL = isMobile ? 54 : 75;
            const padR = isMobile ? 54 : 75;
            const padT = 32;
            const padB = isMobile ? 24 : 30;
            const plotW = W - padL - padR;
            const plotH = H - padT - padB;

            const isDark = document.documentElement.classList.contains('dark');
            ctx.clearRect(0, 0, W, H);

            const getX = function(i) {
                return padL + (i / (rows.length - 1)) * plotW;
            };

            if (CHART_MODE === 'indexed') {
                // ------------------------------------------
                // INDEXED / PERCENTAGE COMPARISON MODE
                // ------------------------------------------
                const seriesPcts = {};
                let minPct = Infinity, maxPct = -Infinity;

                activeKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    const vals = rows.map(r => inst.getVal(r));
                    const v0 = vals.find(v => v != null && v > 0) || 1;
                    const pcts = vals.map(v => v != null ? ((v - v0) / v0) * 100 : null);
                    seriesPcts[k] = pcts;

                    pcts.forEach(p => {
                        if (p != null) {
                            if (p < minPct) minPct = p;
                            if (p > maxPct) maxPct = p;
                        }
                    });
                });

                if (minPct === Infinity || minPct === maxPct) { minPct = -3; maxPct = 3; }
                minPct = Math.min(minPct, -1);
                maxPct = Math.max(maxPct, 1);
                const padP = (maxPct - minPct) * 0.12;
                minPct -= padP; maxPct += padP;

                const getYPct = function(p) {
                    return padT + plotH - ((p - minPct) / (maxPct - minPct)) * plotH;
                };

                // Grid Lines & Performance Scale (% on Left & Right)
                const gridSteps = isMobile ? 4 : 6;
                ctx.lineWidth = 1;
                ctx.font = isMobile ? '8.5px JetBrains Mono, monospace' : '9.5px JetBrains Mono, monospace';

                for (let g = 0; g <= gridSteps; g++) {
                    const pctVal = minPct + ((maxPct - minPct) / gridSteps) * g;
                    const y = getYPct(pctVal);

                    ctx.strokeStyle = isDark ? '#1E293B' : '#E2E8F0';
                    ctx.beginPath();
                    ctx.setLineDash([3, 4]);
                    ctx.moveTo(padL, y);
                    ctx.lineTo(W - padR, y);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    const text = (pctVal >= 0 ? '+' : '') + pctVal.toFixed(1) + '%';
                    ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';

                    // Left Ticks
                    ctx.textAlign = 'right';
                    ctx.fillText(text, padL - (isMobile ? 5 : 8), y + 3.5);

                    // Right Ticks
                    ctx.textAlign = 'left';
                    ctx.fillText(text, W - padR + (isMobile ? 5 : 8), y + 3.5);
                }

                // Zero Baseline
                const yZero = getYPct(0);
                if (yZero >= padT && yZero <= padT + plotH) {
                    ctx.strokeStyle = isDark ? '#475569' : '#94A3B8';
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.setLineDash([4, 4]);
                    ctx.moveTo(padL, yZero);
                    ctx.lineTo(W - padR, yZero);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Top Axis Titles
                ctx.font = 'bold 9.5px JetBrains Mono, monospace';
                ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
                ctx.textAlign = 'left';
                ctx.fillText('PERFORMANCE (%)', padL, padT - 12);
                ctx.textAlign = 'right';
                ctx.fillText('NORMALIZED BASE 100', W - padR, padT - 12);

                // X-axis Dates
                ctx.textAlign = 'center';
                ctx.font = isMobile ? '8.5px JetBrains Mono, monospace' : '9.5px JetBrains Mono, monospace';
                ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
                const numDates = isMobile ? 3 : 6;
                for (let k = 0; k < numDates; k++) {
                    const idx = Math.round(k * (rows.length - 1) / (numDates - 1));
                    ctx.fillText(fmtDateS(rows[idx].d), getX(idx), H - (isMobile ? 4 : 7));
                }

                // Plot Each Selected Instrument Line
                activeKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    const pcts = seriesPcts[k];
                    if (!pcts || pcts.length === 0) return;

                    ctx.beginPath();
                    let started = false;
                    for (let i = 0; i < rows.length; i++) {
                        if (pcts[i] == null) continue;
                        const x = getX(i);
                        const y = getYPct(pcts[i]);
                        if (!started) { ctx.moveTo(x, y); started = true; }
                        else { ctx.lineTo(x, y); }
                    }
                    ctx.strokeStyle = inst.color;
                    ctx.lineWidth = isMobile ? 2 : 2.5;
                    ctx.stroke();

                    // Pulse End Dot
                    const lastIdx = rows.length - 1;
                    if (pcts[lastIdx] != null) {
                        const ex = getX(lastIdx);
                        const ey = getYPct(pcts[lastIdx]);
                        ctx.beginPath();
                        ctx.arc(ex, ey, isMobile ? 3.5 : 4.5, 0, Math.PI * 2);
                        ctx.fillStyle = inst.color;
                        ctx.fill();
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = isDark ? '#0A141F' : '#FFFFFF';
                        ctx.stroke();
                    }
                });

            } else {
                // ------------------------------------------
                // ACTUAL PRICE MODE (DUAL Y-AXES: INR LEFT, USD RIGHT)
                // ------------------------------------------
                
                // INR Range calculation
                const inrKeys = activeKeys.filter(k => INSTRUMENTS[k].currency === 'INR');
                let minInr = Infinity, maxInr = -Infinity;
                inrKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    rows.forEach(r => {
                        const v = inst.getVal(r);
                        if (v != null) {
                            if (v < minInr) minInr = v;
                            if (v > maxInr) maxInr = v;
                        }
                    });
                });
                if (minInr === Infinity || minInr === maxInr) { minInr = 100000; maxInr = 180000; }
                const padInr = (maxInr - minInr) * 0.08;
                minInr -= padInr; maxInr += padInr;

                const getYInr = function(val) {
                    return padT + plotH - ((val - minInr) / (maxInr - minInr)) * plotH;
                };

                // USD Ranges (XAU & XAG)
                const usdKeys = activeKeys.filter(k => INSTRUMENTS[k].currency === 'USD');
                const hasXau = usdKeys.includes('xau');
                const hasXag = usdKeys.includes('xag');

                let minXau = Infinity, maxXau = -Infinity;
                let minXag = Infinity, maxXag = -Infinity;

                if (hasXau) {
                    rows.forEach(r => {
                        const v = INSTRUMENTS.xau.getVal(r);
                        if (v != null) {
                            if (v < minXau) minXau = v;
                            if (v > maxXau) maxXau = v;
                        }
                    });
                    if (minXau === Infinity || minXau === maxXau) { minXau = 3500; maxXau = 4200; }
                    const padXau = (maxXau - minXau) * 0.08;
                    minXau -= padXau; maxXau += padXau;
                }

                if (hasXag) {
                    rows.forEach(r => {
                        const v = INSTRUMENTS.xag.getVal(r);
                        if (v != null) {
                            if (v < minXag) minXag = v;
                            if (v > maxXag) maxXag = v;
                        }
                    });
                    if (minXag === Infinity || minXag === maxXag) { minXag = 40; maxXag = 60; }
                    const padXag = (maxXag - minXag) * 0.08;
                    minXag -= padXag; maxXag += padXag;
                }

                // Grid Lines & Labels
                const gridSteps = isMobile ? 4 : 5;
                ctx.lineWidth = 1;
                ctx.font = isMobile ? '8.5px JetBrains Mono, monospace' : '9.5px JetBrains Mono, monospace';

                for (let g = 0; g <= gridSteps; g++) {
                    const y = padT + (plotH / gridSteps) * g;

                    ctx.strokeStyle = isDark ? '#1E293B' : '#E2E8F0';
                    ctx.beginPath();
                    ctx.setLineDash([3, 4]);
                    ctx.moveTo(padL, y);
                    ctx.lineTo(W - padR, y);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Left Axis: INR (₹)
                    if (hasInr) {
                        const valInr = maxInr - ((maxInr - minInr) / gridSteps) * g;
                        ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
                        ctx.textAlign = 'right';
                        ctx.fillText(inr.format(valInr), padL - (isMobile ? 5 : 8), y + 3.5);
                    }

                    // Right Axis: USD ($)
                    if (hasUsd) {
                        const valUsd = hasXau
                            ? (maxXau - ((maxXau - minXau) / gridSteps) * g)
                            : (maxXag - ((maxXag - minXag) / gridSteps) * g);
                        ctx.fillStyle = isDark ? '#3B82F6' : '#2563EB';
                        ctx.textAlign = 'left';
                        ctx.fillText(usd2.format(valUsd), W - padR + (isMobile ? 5 : 8), y + 3.5);
                    }
                }

                // Axis Headers at top
                ctx.font = 'bold 9.5px JetBrains Mono, monospace';
                if (hasInr) {
                    ctx.fillStyle = '#F59E0B';
                    ctx.textAlign = 'left';
                    ctx.fillText('INR (₹) DOMESTIC', padL, padT - 12);
                }
                if (hasUsd) {
                    ctx.fillStyle = '#3B82F6';
                    ctx.textAlign = 'right';
                    const label = hasXau && hasXag ? 'USD ($) SPOT (XAU / XAG)' : (hasXau ? 'USD ($) XAU' : 'USD ($) XAG');
                    ctx.fillText(label, W - padR, padT - 12);
                }

                // X-axis Dates
                ctx.textAlign = 'center';
                ctx.font = isMobile ? '8.5px JetBrains Mono, monospace' : '9.5px JetBrains Mono, monospace';
                ctx.fillStyle = isDark ? '#64748B' : '#94A3B8';
                const numDates = isMobile ? 3 : 6;
                for (let k = 0; k < numDates; k++) {
                    const idx = Math.round(k * (rows.length - 1) / (numDates - 1));
                    ctx.fillText(fmtDateS(rows[idx].d), getX(idx), H - (isMobile ? 4 : 7));
                }

                // Helper to get Y coordinate for each instrument
                const getInstY = function(k, val) {
                    if (val == null) return null;
                    if (INSTRUMENTS[k].currency === 'INR') {
                        return getYInr(val);
                    } else if (k === 'xau') {
                        return padT + plotH - ((val - minXau) / (maxXau - minXau)) * plotH;
                    } else if (k === 'xag') {
                        return padT + plotH - ((val - minXag) / (maxXag - minXag)) * plotH;
                    }
                    return null;
                };

                // Plot Each Selected Instrument Line
                activeKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    ctx.beginPath();
                    let started = false;
                    for (let i = 0; i < rows.length; i++) {
                        const val = inst.getVal(rows[i]);
                        const y = getInstY(k, val);
                        if (y == null) continue;
                        const x = getX(i);
                        if (!started) { ctx.moveTo(x, y); started = true; }
                        else { ctx.lineTo(x, y); }
                    }
                    ctx.strokeStyle = inst.color;
                    ctx.lineWidth = isMobile ? 2 : 2.5;
                    ctx.stroke();

                    // Pulse End Dot
                    const lastVal = inst.getVal(rows[rows.length - 1]);
                    const ey = getInstY(k, lastVal);
                    if (ey != null) {
                        const ex = getX(rows.length - 1);
                        ctx.beginPath();
                        ctx.arc(ex, ey, isMobile ? 3.5 : 4.5, 0, Math.PI * 2);
                        ctx.fillStyle = inst.color;
                        ctx.fill();
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = isDark ? '#0A141F' : '#FFFFFF';
                        ctx.stroke();
                    }
                });
            }

            bindSingleChartCrosshair(rows);
        }

        // ==========================================
        // HOVER & UNIFIED CROSSHAIR INTERACTION
        // ==========================================
        function bindSingleChartCrosshair(rows) {
            const container = document.getElementById('chartCanvasContainer');
            const canvas = document.getElementById('singleTradingViewCanvas');
            if (!container || !canvas) return;

            const handleHover = function(e) {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                const mouseX = clientX - rect.left;
                const mouseY = clientY - rect.top;

                const isMobile = rect.width < 640;
                const padL = isMobile ? 54 : 75;
                const padR = isMobile ? 54 : 75;
                const plotW = rect.width - padL - padR;

                let ratio = (mouseX - padL) / plotW;
                ratio = Math.max(0, Math.min(1, ratio));
                const idx = Math.round(ratio * (rows.length - 1));

                syncSingleCrosshairAt(idx, mouseY);
            };

            const handleLeave = function() {
                clearSingleCrosshair();
            };

            container.onmousemove = handleHover;
            container.ontouchmove = handleHover;
            container.onmouseleave = handleLeave;
            container.ontouchend = handleLeave;
        }

        function syncSingleCrosshairAt(idx, mouseY) {
            const rows = getVisibleRows();
            if (!rows || idx < 0 || idx >= rows.length) return;
            const targetRow = rows[idx];
            const prevRow = rows[idx - 1] || targetRow;
            const firstRow = rows[0];

            const canvas = document.getElementById('singleTradingViewCanvas');
            const crosshair = document.getElementById('singleCrosshairLine');
            const markersContainer = document.getElementById('singleMarkersContainer');
            const tooltip = document.getElementById('singleUnifiedTooltip');
            const dateHeader = document.getElementById('tooltipDateHeader');
            const seriesList = document.getElementById('tooltipSeriesList');

            if (!canvas || !crosshair || !tooltip || !dateHeader || !seriesList) return;

            const rect = canvas.getBoundingClientRect();
            const isMobile = rect.width < 640;
            const padL = isMobile ? 54 : 75;
            const padR = isMobile ? 54 : 75;
            const padT = 32;
            const padB = isMobile ? 24 : 30;
            const plotW = rect.width - padL - padR;
            const plotH = rect.height - padT - padB;

            const x = padL + (idx / (rows.length - 1)) * plotW;

            // Position Crosshair line
            crosshair.style.left = x + 'px';
            crosshair.style.opacity = '1';

            // Calculate markers and tooltip content
            const activeKeys = Object.keys(INSTRUMENTS).filter(k => ACTIVE_INST[k]);
            let markersHtml = '';
            let tooltipHtml = '';

            if (CHART_MODE === 'indexed') {
                // Indexed coordinates
                let minPct = Infinity, maxPct = -Infinity;
                const seriesPcts = {};
                activeKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    const vals = rows.map(r => inst.getVal(r));
                    const v0 = vals.find(v => v != null && v > 0) || 1;
                    const pcts = vals.map(v => v != null ? ((v - v0) / v0) * 100 : null);
                    seriesPcts[k] = pcts;
                    pcts.forEach(p => {
                        if (p != null) {
                            if (p < minPct) minPct = p;
                            if (p > maxPct) maxPct = p;
                        }
                    });
                });
                if (minPct === Infinity || minPct === maxPct) { minPct = -3; maxPct = 3; }
                minPct = Math.min(minPct, -1); maxPct = Math.max(maxPct, 1);
                const padP = (maxPct - minPct) * 0.12;
                minPct -= padP; maxPct += padP;

                const getYPct = function(p) {
                    return padT + plotH - ((p - minPct) / (maxPct - minPct)) * plotH;
                };

                activeKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    const p = seriesPcts[k] ? seriesPcts[k][idx] : null;
                    const val = inst.getVal(targetRow);
                    if (p != null && val != null) {
                        const y = getYPct(p);
                        markersHtml += '<div class="absolute w-3 h-3 rounded-full border-2 border-white dark:border-[#0A141F] shadow-sm -translate-x-1/2 -translate-y-1/2" style="left: ' + x + 'px; top: ' + y + 'px; background-color: ' + inst.color + ';"></div>';

                        const sign = p >= 0 ? '+' : '';
                        const chgClass = p >= 0 ? 'text-emerald-500' : 'text-rose-500';

                        tooltipHtml += '<div class="flex items-center justify-between gap-3 text-xs leading-relaxed">' +
                            '<span class="flex items-center gap-1.5 font-medium">' +
                                '<span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ' + inst.color + ';"></span>' +
                                '<span class="text-slate-800 dark:text-[#E2E8F0] font-sans">' + inst.name + '</span>' +
                            '</span>' +
                            '<span class="flex items-center gap-2">' +
                                '<span class="font-extrabold text-slate-900 dark:text-[#F1F5F9] font-num">' + inst.fmt(val) + '</span>' +
                                '<span class="' + chgClass + ' font-bold text-[10px] font-num">(' + sign + p.toFixed(2) + '%)</span>' +
                            '</span>' +
                        '</div>';
                    }
                });

            } else {
                // Actual price coordinates
                const inrKeys = activeKeys.filter(k => INSTRUMENTS[k].currency === 'INR');
                let minInr = Infinity, maxInr = -Infinity;
                inrKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    rows.forEach(r => {
                        const v = inst.getVal(r);
                        if (v != null) {
                            if (v < minInr) minInr = v;
                            if (v > maxInr) maxInr = v;
                        }
                    });
                });
                if (minInr === Infinity || minInr === maxInr) { minInr = 100000; maxInr = 180000; }
                const padInr = (maxInr - minInr) * 0.08;
                minInr -= padInr; maxInr += padInr;

                const getYInr = function(val) {
                    return padT + plotH - ((val - minInr) / (maxInr - minInr)) * plotH;
                };

                const usdKeys = activeKeys.filter(k => INSTRUMENTS[k].currency === 'USD');
                const hasXau = usdKeys.includes('xau');
                const hasXag = usdKeys.includes('xag');

                let minXau = Infinity, maxXau = -Infinity;
                let minXag = Infinity, maxXag = -Infinity;

                if (hasXau) {
                    rows.forEach(r => {
                        const v = INSTRUMENTS.xau.getVal(r);
                        if (v != null) {
                            if (v < minXau) minXau = v;
                            if (v > maxXau) maxXau = v;
                        }
                    });
                    if (minXau === Infinity || minXau === maxXau) { minXau = 3500; maxXau = 4200; }
                    const padXau = (maxXau - minXau) * 0.08;
                    minXau -= padXau; maxXau += padXau;
                }

                if (hasXag) {
                    rows.forEach(r => {
                        const v = INSTRUMENTS.xag.getVal(r);
                        if (v != null) {
                            if (v < minXag) minXag = v;
                            if (v > maxXag) maxXag = v;
                        }
                    });
                    if (minXag === Infinity || minXag === maxXag) { minXag = 40; maxXag = 60; }
                    const padXag = (maxXag - minXag) * 0.08;
                    minXag -= padXag; maxXag += padXag;
                }

                const getInstY = function(k, val) {
                    if (val == null) return null;
                    if (INSTRUMENTS[k].currency === 'INR') {
                        return getYInr(val);
                    } else if (k === 'xau') {
                        return padT + plotH - ((val - minXau) / (maxXau - minXau)) * plotH;
                    } else if (k === 'xag') {
                        return padT + plotH - ((val - minXag) / (maxXag - minXag)) * plotH;
                    }
                    return null;
                };

                activeKeys.forEach(k => {
                    const inst = INSTRUMENTS[k];
                    const val = inst.getVal(targetRow);
                    const prevVal = inst.getVal(prevRow);
                    const y = getInstY(k, val);
                    if (y != null && val != null) {
                        markersHtml += '<div class="absolute w-3 h-3 rounded-full border-2 border-white dark:border-[#0A141F] shadow-sm -translate-x-1/2 -translate-y-1/2" style="left: ' + x + 'px; top: ' + y + 'px; background-color: ' + inst.color + ';"></div>';

                        const diff = prevVal != null ? (val - prevVal) : 0;
                        const pct = prevVal ? ((diff / prevVal) * 100) : 0;
                        const chgClass = diff >= 0 ? 'text-emerald-500' : 'text-rose-500';

                        tooltipHtml += '<div class="flex items-center justify-between gap-3 text-xs leading-relaxed">' +
                            '<span class="flex items-center gap-1.5 font-medium">' +
                                '<span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ' + inst.color + ';"></span>' +
                                '<span class="text-slate-800 dark:text-[#E2E8F0] font-sans">' + inst.name + '</span>' +
                            '</span>' +
                            '<span class="flex items-center gap-2">' +
                                '<span class="font-extrabold text-slate-900 dark:text-[#F1F5F9] font-num">' + inst.fmt(val) + '</span>' +
                                '<span class="' + chgClass + ' font-bold text-[10px] font-num">' + (diff >= 0 ? '▲ +' : '▼ ') + Math.abs(pct).toFixed(2) + '%</span>' +
                            '</span>' +
                        '</div>';
                    }
                });
            }

            if (markersContainer) markersContainer.innerHTML = markersHtml;

            // Date Header: e.g. November 09, 2026
            const dateObj = new Date(targetRow.d + 'T00:00:00');
            dateHeader.textContent = dateObj.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
            seriesList.innerHTML = tooltipHtml;

            // Position Tooltip with smart screen boundary detection
            let tipX = x + 16;
            if (tipX + 240 > rect.width) {
                tipX = x - 250;
            }
            if (tipX < 10) tipX = 10;

            const tipY = mouseY != null ? Math.max(12, Math.min(rect.height - 180, mouseY - 40)) : 20;

            tooltip.style.left = tipX + 'px';
            tooltip.style.top = tipY + 'px';
            tooltip.style.opacity = '1';
        }

        function clearSingleCrosshair() {
            const crosshair = document.getElementById('singleCrosshairLine');
            const markersContainer = document.getElementById('singleMarkersContainer');
            const tooltip = document.getElementById('singleUnifiedTooltip');
            if (crosshair) crosshair.style.opacity = '0';
            if (markersContainer) markersContainer.innerHTML = '';
            if (tooltip) tooltip.style.opacity = '0';
        }

        function selectChartMode(mode) {
            if (mode === 'goldIn' || mode === 'gold24' || mode === 'gold') {
                ACTIVE_INST = { gold24: true, goldIbja: false, silverPure: false, silverMarket: false, xau: false, xag: false };
            } else if (mode === 'silverIn' || mode === 'silver') {
                ACTIVE_INST = { gold24: false, goldIbja: false, silverPure: true, silverMarket: false, xau: false, xag: false };
            } else if (mode === 'xau' || mode === 'goldGl') {
                ACTIVE_INST = { gold24: false, goldIbja: false, silverPure: false, silverMarket: false, xau: true, xag: false };
            } else if (mode === 'xag' || mode === 'silverGl') {
                ACTIVE_INST = { gold24: false, goldIbja: false, silverPure: false, silverMarket: false, xau: false, xag: true };
            } else if (mode === 'quad' || mode === 'all') {
                ACTIVE_INST = { gold24: true, goldIbja: false, silverPure: true, silverMarket: false, xau: true, xag: true };
            }
            updateToggleButtonsUI();
            renderSingleChart();
        }

        function showHoverPillAt(idx) {
            const rows = getVisibleRows();
            if (rows && idx >= 0 && idx < rows.length) {
                setTimeout(function() {
                    syncSingleCrosshairAt(idx);
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
                            renderSingleChart();

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
            renderSingleChart();
            
        }

        // Resize Listener
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (CURRENT_MODE === 'quad') {
                    renderQuadCharts();
                } else {
                    renderSingleChart();
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
