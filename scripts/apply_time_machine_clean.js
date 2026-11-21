const fs = require('fs');
const path = require('path');

const genPath = path.join(__dirname, '../generate_terminal.js');
let genContent = fs.readFileSync(genPath, 'utf8');

const clientJsPath = path.join(__dirname, 'time_machine_client.js');
const clientJs = fs.readFileSync(clientJsPath, 'utf8');

// Escape backticks and ${ for embedding inside the template literal
const clientJsEscaped = clientJs
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

// 1. Time Machine Collapsible Accordion HTML Section
const timeMachineHtml = `<!-- TIME MACHINE // ADVANCED HISTORICAL & CROSS-ASSET COMPARISON ENGINE (COLLAPSIBLE ACCORDION - DEFAULT COLLAPSED) -->
        <section id="timeMachineSection" class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-3 sm:p-4 shadow-sm transition-colors space-y-3">
            
            <!-- Accordion Header Bar -->
            <div class="flex items-center justify-between gap-2 cursor-pointer select-none" onclick="toggleTimeMachineSection()">
                <div class="flex items-center gap-2.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#C5A059] flex-shrink-0"></span>
                    <div>
                        <h3 class="font-headline font-bold text-sm sm:text-base text-slate-900 dark:text-[#F1F5F9] flex items-center gap-2 flex-wrap">
                            <span>Historical Comparison Engine &amp; Growth Analytics</span>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 font-semibold">20-Year Archive (2006–2026)</span>
                        </h3>
                        <p class="text-[11px] text-slate-500 dark:text-[#94A3B8] hidden sm:block">Compare prices across 2 to 10 historical dates · 7 visual growth views · Multi-asset CAGR</p>
                    </div>
                </div>
                <button type="button" class="text-xs font-mono font-bold text-[#C5A059] flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#C5A059]/10 hover:bg-[#C5A059]/20 transition-all border border-[#C5A059]/20">
                    <span id="lblToggleTM">Compare Multiples</span>
                    <svg id="iconToggleTM" class="w-3.5 h-3.5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
            </div>

            <!-- Accordion Body (default collapsed/hidden) -->
            <div id="bodyTimeMachine" class="hidden space-y-4 pt-3 border-t border-slate-200 dark:border-[#243447]">
                
                <!-- Top Toolbars: Single vs Dual Mode Switcher, Individual & Pair Pills, Time Presets, Date Counts -->
                <div class="space-y-2.5 bg-slate-50 dark:bg-[#0E1724] p-3 rounded-xl border border-slate-200 dark:border-[#243447]">
                    <!-- Row 1: Mode Switcher & Checkpoints Count (2..10) -->
                    <div class="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-[#243447]/60">
                        <div id="tmModeSwitcher">
                            <!-- Injected via renderTimeMachineHeaderControls() -->
                        </div>
                        
                        <!-- Checkpoint Counts (2..10) -->
                        <div class="flex items-center gap-1.5 font-mono text-xs">
                            <span class="text-[10px] font-bold text-slate-400 dark:text-[#64748B] uppercase tracking-wider mr-0.5">POINTS:</span>
                            <div id="tmCountPillsContainer" class="flex items-center gap-1">
                                <!-- Injected via renderTimeMachineHeaderControls() -->
                            </div>
                            <button type="button" id="tmAddSlotBtn" onclick="addTimeMachineSlot()" class="px-2.5 py-1 rounded-md bg-[#FF4E00] hover:bg-[#FF6B2B] text-white font-bold text-[10px] flex items-center gap-1 transition-all ml-1">
                                <span>+ Add</span>
                            </button>
                            <button type="button" onclick="sortTimeMachineSlotsOldest()" title="Sort chronological oldest to newest" class="px-2 py-1 rounded-md bg-slate-200 dark:bg-[#142030] hover:bg-slate-300 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] text-[10px] font-semibold border border-slate-300 dark:border-[#243447] flex items-center gap-1">
                                <span>Sort ⏳</span>
                            </button>
                        </div>
                    </div>

                    <!-- Row 2: Asset Selection Pills (Single Asset vs Dual Pair) -->
                    <div id="tmAssetPillsContainer" class="pt-0.5">
                        <!-- Injected via renderTimeMachineHeaderControls() -->
                    </div>

                    <!-- Row 3: Time Era Presets -->
                    <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-[#243447]/60">
                        <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-[#64748B] uppercase tracking-wider mr-1">ERAS:</span>
                        <button type="button" onclick="applyTimeMachinePreset('10y')" class="px-2.5 py-1 rounded-md bg-white dark:bg-[#142030] hover:bg-slate-100 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-[10.5px] font-mono font-semibold transition-all shadow-xs">10Y Ago</button>
                        <button type="button" onclick="applyTimeMachinePreset('5y')" class="px-2.5 py-1 rounded-md bg-white dark:bg-[#142030] hover:bg-slate-100 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-[10.5px] font-mono font-semibold transition-all shadow-xs">5Y Ago</button>
                        <button type="button" onclick="applyTimeMachinePreset('15y')" class="px-2.5 py-1 rounded-md bg-white dark:bg-[#142030] hover:bg-slate-100 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-[10.5px] font-mono font-semibold transition-all shadow-xs">15Y Ago</button>
                        <button type="button" onclick="applyTimeMachinePreset('covid')" class="px-2.5 py-1 rounded-md bg-white dark:bg-[#142030] hover:bg-slate-100 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-[10.5px] font-mono font-semibold transition-all shadow-xs">COVID Low</button>
                        <button type="button" onclick="applyTimeMachinePreset('2008')" class="px-2.5 py-1 rounded-md bg-white dark:bg-[#142030] hover:bg-slate-100 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] text-[10.5px] font-mono font-semibold transition-all shadow-xs">2008 Crisis</button>
                        <button type="button" onclick="resetTimeMachine()" title="Reset to default comparison" class="p-1 rounded-md bg-white dark:bg-[#142030] hover:bg-slate-100 dark:hover:bg-[#1A283B] text-slate-500 border border-slate-200 dark:border-[#243447] transition-all ml-auto">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                    </div>
                </div>

                <!-- Active Checkpoint Cards Grid -->
                <div id="tmCardsContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <!-- Injected via renderTimeMachineCards() -->
                </div>

                <!-- Highlight Summary Strip (Lowest, Largest Jump, Total Change) -->
                <div id="tmHighlightStrip">
                    <!-- Injected via renderTimeMachineHighlightStrip() -->
                </div>

                <!-- Visual Comparison Views Suite -->
                <div class="bg-white dark:bg-[#142030] border border-slate-200 dark:border-[#243447] rounded-xl p-3 sm:p-4 space-y-3 shadow-xs">
                    
                    <!-- Views Toolbar -->
                    <div class="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200 dark:border-[#243447] pb-3">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-[#64748B] uppercase tracking-wider mr-1">VIEW:</span>
                            <div id="tmViewTabsContainer" class="flex flex-wrap items-center gap-1.5">
                                <!-- Injected via renderTimeMachineVisualStage() -->
                            </div>
                        </div>

                        <div class="flex items-center gap-2 font-mono text-xs">
                            <!-- Benchmark Target Line Input -->
                            <div id="tmBenchmarkControl" class="flex items-center gap-1 bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] px-2 py-1 rounded-lg text-[11px]">
                                <span class="text-slate-400">Target ₹:</span>
                                <input type="number" id="tmTargetBenchmarkInput" placeholder="e.g. 150000" oninput="updateTimeMachineTargetBenchmark(this.value)" class="w-20 bg-transparent text-slate-900 dark:text-[#F1F5F9] font-bold outline-none border-b border-slate-300 dark:border-slate-600 focus:border-[#C5A059]">
                            </div>

                            <!-- Smart Fit Tags Toggle -->
                            <button type="button" id="tmToggleTagsBtn" onclick="toggleTimeMachineTagDensity()" class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-700 dark:text-[#94A3B8] border border-slate-200 dark:border-[#243447] text-[10.5px] font-semibold transition-all">
                                Smart Tags
                            </button>
                        </div>
                    </div>

                    <!-- Visual Stage (Single screen, high-density SVG / HTML) -->
                    <div id="tmVisualStage" class="w-full">
                        <!-- Injected via renderTimeMachineVisualStage() -->
                    </div>
                </div>

            </div>
        </section>

        `;

// 2. Exact HTML replacement by locating the start and end tokens
const htmlStartToken = '<!-- TIME MACHINE //';
const htmlEndToken = '<!-- 52-WEEK BENCHMARK & MACRO RANGE INTELLIGENCE';

const idxHtmlStart = genContent.indexOf(htmlStartToken);
const idxHtmlEnd = genContent.indexOf(htmlEndToken);

if (idxHtmlStart === -1 || idxHtmlEnd === -1) {
    throw new Error(`Could not find HTML boundaries: start=${idxHtmlStart}, end=${idxHtmlEnd}`);
}

genContent = genContent.substring(0, idxHtmlStart) + timeMachineHtml + genContent.substring(idxHtmlEnd);

// 3. Exact JS replacement by locating the start and end tokens
const jsStartToken = '// =========================================================================\r\n// TIME MACHINE //';
const jsStartTokenLF = '// =========================================================================\n// TIME MACHINE //';
let idxJsStart = genContent.indexOf(jsStartToken);
if (idxJsStart === -1) idxJsStart = genContent.indexOf(jsStartTokenLF);

const jsEndToken = '// Render Top 4 KPI Cards';
const idxJsEnd = genContent.indexOf(jsEndToken);

if (idxJsStart === -1 || idxJsEnd === -1) {
    throw new Error(`Could not find JS boundaries: start=${idxJsStart}, end=${idxJsEnd}`);
}

genContent = genContent.substring(0, idxJsStart) + clientJsEscaped + '\n\n        ' + genContent.substring(idxJsEnd);

fs.writeFileSync(genPath, genContent, 'utf8');
console.log('Successfully updated Time Machine in generate_terminal.js via deterministic slice replacement!');
