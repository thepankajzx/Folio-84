// =========================================================================
// TIME MACHINE // ADVANCED HISTORICAL & DUAL-COMMODITY COMPARISON ENGINE
// =========================================================================

const TM_ASSETS = {
    g: { 
        name: 'Gold 24K (999)', short: 'Gold 24K', unit: '₹/10g', field: 'g', 
        colorLight: '#B45309', colorDark: '#FBBF24',
        activePill: 'bg-amber-100 dark:bg-[#2b1f0c] text-amber-950 dark:text-amber-200 border-2 border-amber-500 dark:border-amber-400 font-extrabold shadow-sm ring-1 ring-amber-500/40',
        dot: '#FBBF24'
    },
    g22: { 
        name: 'Gold 22K (916)', short: 'Gold 22K', unit: '₹/10g', field: 'g22', 
        colorLight: '#C2410C', colorDark: '#FB923C',
        activePill: 'bg-orange-100 dark:bg-[#2c170a] text-orange-950 dark:text-orange-200 border-2 border-orange-500 dark:border-orange-400 font-extrabold shadow-sm ring-1 ring-orange-500/40',
        dot: '#FB923C'
    },
    sv: { 
        name: 'Silver 10g (.999)', short: 'Silver 10g', unit: '₹/10g', field: 'sv', 
        colorLight: '#059669', colorDark: '#10B981',
        activePill: 'bg-emerald-100 dark:bg-[#0b291d] text-emerald-950 dark:text-emerald-200 border-2 border-emerald-500 dark:border-emerald-400 font-extrabold shadow-sm ring-1 ring-emerald-500/40',
        dot: '#10B981'
    },
    svKg: { 
        name: 'Silver 1kg Bar', short: 'Silver 1kg', unit: '₹/kg', field: 'sv', multiplier: 100, 
        colorLight: '#0284C7', colorDark: '#38BDF8',
        activePill: 'bg-sky-100 dark:bg-[#0b2436] text-sky-950 dark:text-sky-200 border-2 border-sky-500 dark:border-sky-400 font-extrabold shadow-sm ring-1 ring-sky-500/40',
        dot: '#38BDF8'
    },
    gi: { 
        name: 'Intl Gold (₹/10g)', short: 'Intl Gold', unit: '₹/10g', field: 'gi', 
        colorLight: '#6D28D9', colorDark: '#A78BFA',
        activePill: 'bg-purple-100 dark:bg-[#251336] text-purple-950 dark:text-purple-200 border-2 border-purple-500 dark:border-purple-400 font-extrabold shadow-sm ring-1 ring-purple-500/40',
        dot: '#A78BFA'
    },
    si: { 
        name: 'Intl Silver (₹/10g)', short: 'Intl Silver', unit: '₹/10g', field: 'si', 
        colorLight: '#D97706', colorDark: '#F59E0B',
        activePill: 'bg-yellow-100 dark:bg-[#2c2409] text-yellow-950 dark:text-yellow-200 border-2 border-yellow-500 dark:border-yellow-400 font-extrabold shadow-sm ring-1 ring-yellow-500/40',
        dot: '#F59E0B'
    },
    xau: { 
        name: 'Spot Gold XAU ($)', short: 'Spot XAU', unit: '$/oz', field: 'xau', 
        colorLight: '#7C3AED', colorDark: '#C084FC',
        activePill: 'bg-violet-100 dark:bg-[#251336] text-violet-950 dark:text-violet-200 border-2 border-violet-500 dark:border-violet-400 font-extrabold shadow-sm ring-1 ring-violet-500/40',
        dot: '#C084FC'
    },
    xag: { 
        name: 'Spot Silver XAG ($)', short: 'Spot XAG', unit: '$/oz', field: 'xag', 
        colorLight: '#2563EB', colorDark: '#60A5FA',
        activePill: 'bg-blue-100 dark:bg-[#0c1f3d] text-blue-950 dark:text-blue-200 border-2 border-blue-500 dark:border-blue-400 font-extrabold shadow-sm ring-1 ring-blue-500/40',
        dot: '#60A5FA'
    },
    usd: { 
        name: 'USD / INR Rate', short: 'USD/INR', unit: '₹/$', field: 'usd', 
        colorLight: '#4F46E5', colorDark: '#818CF8',
        activePill: 'bg-indigo-100 dark:bg-[#151c38] text-indigo-950 dark:text-indigo-200 border-2 border-indigo-500 dark:border-indigo-400 font-extrabold shadow-sm ring-1 ring-indigo-500/40',
        dot: '#818CF8'
    }
};

function getAssetColor(assetKey) {
    let isDark = true;
    try {
        isDark = typeof document !== 'undefined' && document.documentElement && document.documentElement.classList.contains('dark');
    } catch (e) {}
    const meta = TM_ASSETS[assetKey] || TM_ASSETS.g;
    return isDark ? (meta.colorDark || '#FBBF24') : (meta.colorLight || '#B45309');
}

let IS_TM_EXPANDED = false;
let tmComparisonMode = 'dual'; // 'single' | 'dual'
let tmPrimaryAsset = 'g'; // Default primary
let tmSecondaryAsset = 'sv'; // Default secondary for dual mode
let tmActivePairPreset = 'g-sv'; // 'g-sv' | 'g-svKg' | 'g-g22' | 'g-xau' | 'sv-xag' | 'g-usd'
let tmActiveView = 'curve'; // 'curve' | 'bar' | 'lollipop' | 'timeline' | 'slope' | 'delta' | 'table'
let tmShowAllTags = false;
let tmTargetBenchmark = '';

let tmDates = [
    { id: 'tm-d-0', date: '2026-11-20', isAnchor: true },
    { id: 'tm-d-1', date: '2021-11-20', isAnchor: false },
    { id: 'tm-d-2', date: '2016-11-21', isAnchor: false },
    { id: 'tm-d-3', date: '2011-11-21', isAnchor: false },
    { id: 'tm-d-4', date: '2008-10-24', isAnchor: false }
];
let tmDateCounter = 5;

// Expose state on window for debugging & tests
try {
    window.IS_TM_EXPANDED = IS_TM_EXPANDED;
    window.tmComparisonMode = tmComparisonMode;
    window.tmDates = tmDates;
} catch (e) {}

function toggleTimeMachineSection() {
    IS_TM_EXPANDED = !IS_TM_EXPANDED;
    const body = document.getElementById('bodyTimeMachine');
    const lbl = document.getElementById('lblToggleTM');
    const icon = document.getElementById('iconToggleTM');
    if (!body) return;
    if (IS_TM_EXPANDED) {
        body.classList.remove('hidden');
        if (lbl) lbl.textContent = 'Collapse Comparison';
        if (icon) icon.style.transform = 'rotate(180deg)';
        renderTimeMachine();
    } else {
        body.classList.add('hidden');
        if (lbl) lbl.textContent = 'Compare Multiples';
        if (icon) icon.style.transform = 'rotate(0deg)';
    }
}

function getSessionForDate(targetDate) {
    if (!DATA || !DATA.length) return null;
    const exact = DATA.find(r => r.d === targetDate && r.g !== null);
    if (exact) return { session: exact, isExact: true, requestedDate: targetDate };
    
    let prior = null;
    for (let i = DATA.length - 1; i >= 0; i--) {
        const r = DATA[i];
        if (r.d <= targetDate && r.g !== null) {
            prior = r;
            break;
        }
    }
    if (prior) return { session: prior, isExact: false, requestedDate: targetDate };
    const earliest = DATA.find(r => r.g !== null);
    return { session: earliest || DATA[0], isExact: false, requestedDate: targetDate };
}

function getYearsAgoDate(baseDateStr, years) {
    const d = new Date(baseDateStr + 'T12:00:00Z');
    d.setUTCFullYear(d.getUTCFullYear() - years);
    return d.toISOString().split('T')[0];
}

function formatShortDate(iso) {
    if (!iso) return 'No Date';
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const mIdx = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
    return `${parts[2]} ${months[mIdx]} '${parts[0].slice(2)}`;
}

function formatFullDate(iso) {
    if (!iso) return 'Select Date';
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const mIdx = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
    return `${parts[2]} ${months[mIdx]} ${parts[0]}`;
}

function formatAssetVal(val, assetKey) {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    if (assetKey === 'xau' || assetKey === 'xag') return usd2.format(val);
    if (assetKey === 'sv' || assetKey === 'usd' || assetKey === 'gi' || assetKey === 'si') return inr2.format(val);
    return inr.format(Math.round(val));
}

function formatShortAssetVal(val, assetKey) {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    if (assetKey === 'xau' || assetKey === 'xag') return '$' + Number(val).toFixed(0);
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + 'L';
    if (val >= 1000) return '₹' + (val / 1000).toFixed(1) + 'k';
    return '₹' + Math.round(val);
}

function getAssetValueForSession(session, assetKey) {
    if (!session) return null;
    if (assetKey === 'g22') {
        if (typeof session.g22 === 'number' && session.g22 > 0) return session.g22;
        if (typeof session.g === 'number' && session.g > 0) return Math.round(session.g * 0.916);
        return null;
    }
    const meta = TM_ASSETS[assetKey] || TM_ASSETS.g;
    let val = session[meta.field];
    if (val === null || val === undefined || isNaN(val)) return null;
    if (meta.multiplier) val = val * meta.multiplier;
    return val;
}

// Normalized Data Series for the selected Mode (Single vs Dual)
function getComparisonDataset() {
    const isDual = tmComparisonMode === 'dual';
    const rawAssetA = TM_ASSETS[tmPrimaryAsset] || TM_ASSETS.g;
    const rawAssetB = isDual ? (TM_ASSETS[tmSecondaryAsset] || TM_ASSETS.sv) : null;
    const assetA = Object.assign({}, rawAssetA, { color: getAssetColor(tmPrimaryAsset) });
    const assetB = rawAssetB ? Object.assign({}, rawAssetB, { color: getAssetColor(tmSecondaryAsset) }) : null;

    const points = [];
    tmDates.forEach((dItem, idx) => {
        const sInfo = getSessionForDate(dItem.date);
        if (!sInfo || !sInfo.session) return;
        const session = sInfo.session;

        const valA = getAssetValueForSession(session, tmPrimaryAsset);
        const valB = isDual ? getAssetValueForSession(session, tmSecondaryAsset) : null;

        points.push({
            index: idx,
            id: dItem.id,
            isAnchor: dItem.isAnchor,
            requestedDate: dItem.date,
            date: session.d,
            shortDate: formatShortDate(session.d),
            fullDate: formatFullDate(session.d),
            isExact: sInfo.isExact,
            valA: valA,
            valAStr: formatAssetVal(valA, tmPrimaryAsset),
            valB: valB,
            valBStr: isDual ? formatAssetVal(valB, tmSecondaryAsset) : null
        });
    });

    return {
        isDual: isDual,
        assetA: assetA,
        assetAKey: tmPrimaryAsset,
        assetB: assetB,
        assetBKey: tmSecondaryAsset,
        points: points
    };
}

// Main Time Machine Render Entry
function renderTimeMachine() {
    try {
        window.IS_TM_EXPANDED = IS_TM_EXPANDED;
        window.tmComparisonMode = tmComparisonMode;
        window.tmDates = tmDates;
    } catch (e) {}

    const body = document.getElementById('bodyTimeMachine');
    if (!body || !DATA.length) return;

    // Anchor synchronization with latest trading date
    const latest = getLatestValidSession(DATA);
    if (latest && tmDates[0] && tmDates[0].isAnchor && (!tmDates[0].date || tmDates[0].date > latest.session.d)) {
        tmDates[0].date = latest.session.d;
    }

    renderTimeMachineHeaderControls();
    renderTimeMachineCards();
    renderTimeMachineHighlightStrip();
    renderTimeMachineVisualStage();
}

// 1. Render Header Toolbars (Single vs Dual Mode Switcher, Individual Pills, Pair Pills, Counts, Eras)
function renderTimeMachineHeaderControls() {
    const modeSwitchContainer = document.getElementById('tmModeSwitcher');
    const assetPillsContainer = document.getElementById('tmAssetPillsContainer');
    const countContainer = document.getElementById('tmCountPillsContainer');
    if (!modeSwitchContainer || !assetPillsContainer || !countContainer) return;

    // Mode Switcher Buttons (Distinct Vibrant Dual vs Single Styling)
    modeSwitchContainer.innerHTML = `
        <div class="inline-flex p-0.5 rounded-lg bg-slate-200 dark:bg-[#0E1724] border border-slate-300 dark:border-[#243447]">
            <button type="button" onclick="setComparisonMode('dual')" class="px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${tmComparisonMode === 'dual' ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 text-slate-950 shadow-sm' : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'}">
                ⚖️ Two Commodities (Dual Lines)
            </button>
            <button type="button" onclick="setComparisonMode('single')" class="px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${tmComparisonMode === 'single' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'}">
                🎯 Single Commodity (1 Curve)
            </button>
        </div>
    `;

    // Asset Selection Pills (Individual Multi-Colors for every commodity)
    if (tmComparisonMode === 'single') {
        const singlePills = [
            { key: 'g', label: 'Gold 24K', icon: '🟡' },
            { key: 'g22', label: 'Gold 22K', icon: '🟠' },
            { key: 'sv', label: 'Silver 10g', icon: '🟢' },
            { key: 'svKg', label: 'Silver 1kg', icon: '⚪' },
            { key: 'xau', label: 'Spot XAU', icon: '🟣' },
            { key: 'xag', label: 'Spot XAG', icon: '🔵' },
            { key: 'usd', label: 'USD/INR', icon: '💵' }
        ];

        assetPillsContainer.innerHTML = `
            <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-[#64748B] uppercase tracking-wider mr-1">SELECT ASSET:</span>
                ${singlePills.map(p => {
                    const meta = TM_ASSETS[p.key] || TM_ASSETS.g;
                    const isActive = tmPrimaryAsset === p.key;
                    const activeClass = isActive 
                        ? meta.activePill 
                        : 'bg-white dark:bg-[#142030] text-slate-600 dark:text-[#94A3B8] border-slate-200 dark:border-[#243447] hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white';
                    return `
                        <button type="button" onclick="setSingleAsset('${p.key}')" class="px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-all ${activeClass}">
                            <span>${p.icon}</span>
                            <span>${meta.short}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        const dualPairs = [
            { 
                id: 'g-sv', label: 'Gold 24K vs Silver 10g', a: 'g', b: 'sv', icon: '⚖️',
                activeClass: 'bg-emerald-50 dark:bg-[#102a24] text-emerald-950 dark:text-emerald-200 border-2 border-emerald-500 dark:border-emerald-400 font-extrabold shadow-sm ring-1 ring-emerald-500/40',
                badgeA: 'bg-amber-400', badgeB: 'bg-emerald-400'
            },
            { 
                id: 'g-svKg', label: 'Gold 24K vs Silver 1kg', a: 'g', b: 'svKg', icon: '⚪',
                activeClass: 'bg-sky-50 dark:bg-[#0c2838] text-sky-950 dark:text-sky-200 border-2 border-sky-500 dark:border-sky-400 font-extrabold shadow-sm ring-1 ring-sky-500/40',
                badgeA: 'bg-amber-400', badgeB: 'bg-sky-400'
            },
            { 
                id: 'g-g22', label: 'Gold 24K vs Gold 22K', a: 'g', b: 'g22', icon: '💎',
                activeClass: 'bg-amber-50 dark:bg-[#2b1f0c] text-amber-950 dark:text-amber-200 border-2 border-amber-500 dark:border-amber-400 font-extrabold shadow-sm ring-1 ring-amber-500/40',
                badgeA: 'bg-amber-400', badgeB: 'bg-orange-400'
            },
            { 
                id: 'g-xau', label: 'Gold 24K vs Spot XAU', a: 'g', b: 'xau', icon: '🌐',
                activeClass: 'bg-purple-50 dark:bg-[#251336] text-purple-950 dark:text-purple-200 border-2 border-purple-500 dark:border-purple-400 font-extrabold shadow-sm ring-1 ring-purple-500/40',
                badgeA: 'bg-amber-400', badgeB: 'bg-purple-400'
            },
            { 
                id: 'sv-xag', label: 'Silver vs Spot XAG', a: 'sv', b: 'xag', icon: '🌐',
                activeClass: 'bg-teal-50 dark:bg-[#0b282c] text-teal-950 dark:text-teal-200 border-2 border-teal-500 dark:border-teal-400 font-extrabold shadow-sm ring-1 ring-teal-500/40',
                badgeA: 'bg-emerald-400', badgeB: 'bg-blue-400'
            },
            { 
                id: 'xau-xag', label: 'Spot XAU vs Spot XAG', a: 'xau', b: 'xag', icon: '🌍',
                activeClass: 'bg-violet-50 dark:bg-[#201538] text-violet-950 dark:text-violet-200 border-2 border-violet-500 dark:border-violet-400 font-extrabold shadow-sm ring-1 ring-violet-500/40',
                badgeA: 'bg-purple-400', badgeB: 'bg-blue-400'
            },
            { 
                id: 'g-usd', label: 'Gold 24K vs USD/INR', a: 'g', b: 'usd', icon: '💵',
                activeClass: 'bg-indigo-50 dark:bg-[#151c38] text-indigo-950 dark:text-indigo-200 border-2 border-indigo-500 dark:border-indigo-400 font-extrabold shadow-sm ring-1 ring-indigo-500/40',
                badgeA: 'bg-amber-400', badgeB: 'bg-indigo-400'
            }
        ];

        assetPillsContainer.innerHTML = `
            <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-[#64748B] uppercase tracking-wider mr-1">SELECT PAIR:</span>
                ${dualPairs.map(p => {
                    const isActive = tmActivePairPreset === p.id;
                    const activeClass = isActive 
                        ? p.activeClass 
                        : 'bg-white dark:bg-[#142030] text-slate-600 dark:text-[#94A3B8] border-slate-200 dark:border-[#243447] hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white';
                    return `
                        <button type="button" onclick="setDualPair('${p.id}', '${p.a}', '${p.b}')" class="px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-all ${activeClass}">
                            <span class="flex items-center gap-1">
                                <span class="w-2.5 h-2.5 rounded-full ring-1 ring-black/20 ${p.badgeA}"></span>
                                <span class="w-2.5 h-2.5 rounded-full ring-1 ring-black/20 ${p.badgeB}"></span>
                            </span>
                            <span>${p.label}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Checkpoints Count Pills (2..10)
    let pillsHtml = '';
    for (let n = 2; n <= 10; n++) {
        const isActive = tmDates.length === n;
        const activeClass = isActive 
            ? 'bg-[#FF4E00] text-white border-[#FF4E00] font-bold shadow-sm'
            : 'bg-white dark:bg-[#142030] text-slate-600 dark:text-[#94A3B8] border-slate-200 dark:border-[#243447] hover:border-slate-300 dark:hover:border-slate-600';
        pillsHtml += `
            <button type="button" onclick="setCheckpointsCount(${n})" class="w-6 h-6 rounded-md text-[11px] font-mono border flex items-center justify-center transition-all ${activeClass}">
                ${n}
            </button>
        `;
    }
    countContainer.innerHTML = pillsHtml;

    const addBtn = document.getElementById('tmAddSlotBtn');
    if (addBtn) addBtn.disabled = tmDates.length >= 10;
}

// 2. Render Checkpoint Cards Grid
function renderTimeMachineCards() {
    const container = document.getElementById('tmCardsContainer');
    if (!container || !DATA.length) return;

    const dataset = getComparisonDataset();
    const isDual = dataset.isDual;
    const assetA = dataset.assetA;
    const assetB = dataset.assetB;
    const points = dataset.points;

    const anchorPt = points.find(p => p.isAnchor) || points[0];
    const latest = getLatestValidSession(DATA);
    const maxDate = latest ? latest.session.d : '2026-11-20';
    const minDate = DATA[0] ? DATA[0].d : '2006-01-01';

    let cardsHtml = '';

    points.forEach((pt, idx) => {
        const isAnchor = pt.isAnchor;
        const snapNotice = !pt.isExact 
            ? `<div class="text-[9px] font-mono text-amber-500/90 truncate mt-0.5">⚡ Snapped to ${pt.date}</div>` 
            : '';

        let metricsHtml = '';

        if (isAnchor) {
            metricsHtml = `
                <div class="pt-2 border-t border-slate-200 dark:border-[#243447] flex items-center justify-between text-xs font-mono">
                    <span style="color: ${assetA.color}" class="font-bold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${assetA.color}"></span>
                        <span>Primary Baseline</span>
                    </span>
                    <span class="text-[10px] text-slate-500 dark:text-[#94A3B8]">Anchor (1.0x)</span>
                </div>
            `;
        } else if (anchorPt && anchorPt.valA && pt.valA) {
            const pPastA = pt.valA;
            const pAnchorA = anchorPt.valA;
            const diffA = pAnchorA - pPastA;
            const pctA = ((pAnchorA - pPastA) / pPastA) * 100;
            const multA = pAnchorA / pPastA;

            const dAnchor = new Date(anchorPt.date);
            const dPast = new Date(pt.date);
            const years = Math.max(0.08, (dAnchor - dPast) / (1000 * 60 * 60 * 24 * 365.25));
            const cagrA = (Math.pow(pAnchorA / pPastA, 1 / years) - 1) * 100;

            const signA = diffA >= 0 ? '+' : '';
            const colorA = diffA >= 0 ? 'text-emerald-500' : 'text-rose-500';

            if (!isDual) {
                metricsHtml = `
                    <div class="pt-2 border-t border-slate-200 dark:border-[#243447] space-y-1 text-xs font-mono">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">Growth to Now:</span>
                            <span class="${colorA} font-bold">${signA}${pctA.toFixed(1)}%</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-500 dark:text-[#94A3B8] text-[11px]">Cash Delta:</span>
                            <span class="font-bold text-slate-900 dark:text-[#F1F5F9]">${signA}${formatAssetVal(diffA, tmPrimaryAsset)}</span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-dashed border-slate-200 dark:border-[#243447]/60">
                            <span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px]">${multA.toFixed(1)}x Multiple</span>
                            <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">${signA}${cagrA.toFixed(2)}% CAGR</span>
                        </div>
                    </div>
                `;
            } else {
                let dualMetrics = '';
                if (anchorPt.valB && pt.valB) {
                    const diffB = anchorPt.valB - pt.valB;
                    const pctB = ((anchorPt.valB - pt.valB) / pt.valB) * 100;
                    const signB = diffB >= 0 ? '+' : '';
                    const colorB = diffB >= 0 ? 'text-emerald-500' : 'text-rose-500';
                    const ratio = pt.valB > 0 ? (pt.valA / pt.valB).toFixed(2) : '-';

                    dualMetrics = `
                        <div class="pt-2 border-t border-slate-200 dark:border-[#243447] space-y-1 text-xs font-mono">
                            <div class="flex items-center justify-between">
                                <span class="text-[11px]" style="color:${assetA.color}">${assetA.short}:</span>
                                <span class="${colorA} font-bold">${signA}${pctA.toFixed(1)}% (${multA.toFixed(1)}x)</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-[11px]" style="color:${assetB.color}">${assetB.short}:</span>
                                <span class="${colorB} font-bold">${signB}${pctB.toFixed(1)}%</span>
                            </div>
                            <div class="flex items-center justify-between pt-1 border-t border-dashed border-slate-200 dark:border-[#243447]/60">
                                <span class="text-slate-500 dark:text-[#94A3B8] text-[10px]">Ratio (${assetA.short}/${assetB.short}):</span>
                                <span class="font-bold text-amber-500 text-[10px]">${ratio}x</span>
                            </div>
                        </div>
                    `;
                }
                metricsHtml = dualMetrics;
            }
        }

        const borderStyle = isAnchor 
            ? 'border-2' 
            : 'border border-slate-200 dark:border-[#243447] hover:border-slate-300 dark:hover:border-slate-600';
        const cardInlineStyle = isAnchor ? `style="border-color: ${assetA.color}"` : '';

        let priceSectionHtml = '';
        if (!isDual) {
            priceSectionHtml = `
                <div>
                    <div class="flex items-baseline justify-between gap-1">
                        <span class="text-lg sm:text-2xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] leading-tight truncate">
                            ${pt.valAStr}
                        </span>
                        <span class="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0E1724] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#243447] flex-shrink-0">
                            ${assetA.unit}
                        </span>
                    </div>
                    ${snapNotice}
                </div>
            `;
        } else {
            priceSectionHtml = `
                <div class="space-y-1.5">
                    <div class="p-2 rounded-lg bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] flex items-center justify-between">
                        <span class="text-[11px] font-mono font-bold" style="color: ${assetA.color}">${assetA.short}</span>
                        <span class="text-base sm:text-lg font-extrabold font-num text-slate-900 dark:text-[#F1F5F9]">${pt.valAStr}</span>
                    </div>
                    <div class="p-2 rounded-lg bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] flex items-center justify-between">
                        <span class="text-[11px] font-mono font-bold" style="color: ${assetB.color}">${assetB.short}</span>
                        <span class="text-base sm:text-lg font-extrabold font-num text-slate-900 dark:text-[#F1F5F9]">${pt.valBStr}</span>
                    </div>
                    ${snapNotice}
                </div>
            `;
        }

        cardsHtml += `
            <div class="bg-white dark:bg-[#142030] ${borderStyle} rounded-xl p-3 sm:p-3.5 space-y-2.5 transition-all shadow-sm relative group" ${cardInlineStyle}>
                <div class="flex items-center justify-between gap-1 text-[10px] font-mono">
                    ${isAnchor ? `
                        <span class="px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1" style="color: ${assetA.color}; background-color: ${assetA.color}18;">
                            <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${assetA.color}"></span>
                            <span>Anchor Baseline</span>
                        </span>
                        <span class="text-[10px] font-mono text-slate-400">Milestone #1</span>
                    ` : `
                        <div class="flex items-center justify-between w-full">
                            <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] font-bold uppercase">
                                Milestone #${idx + 1}
                            </span>
                            <button type="button" onclick="removeDateSlot('${pt.id}')" title="Remove this date point" class="text-slate-400 hover:text-rose-500 font-bold px-1.5 py-0.5 rounded transition-colors text-xs">
                                ✕
                            </button>
                        </div>
                    `}
                </div>

                <div class="space-y-1.5">
                    <input type="date" value="${pt.requestedDate}" min="${minDate}" max="${maxDate}" onchange="updateDateSlot('${pt.id}', this.value)" class="w-full text-xs font-mono bg-slate-100 dark:bg-[#0E1724] text-slate-700 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#243447] rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer font-bold">
                    
                    <!-- Quick Era Chips -->
                    <div class="flex items-center gap-1 pt-0.5 flex-wrap">
                        <button type="button" onclick="setDateSlotOffsetYears('${pt.id}', 0)" class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-500 dark:text-[#94A3B8] border border-slate-200 dark:border-[#243447]">Today</button>
                        <button type="button" onclick="setDateSlotOffsetYears('${pt.id}', 1)" class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-500 dark:text-[#94A3B8] border border-slate-200 dark:border-[#243447]">-1Y</button>
                        <button type="button" onclick="setDateSlotOffsetYears('${pt.id}', 3)" class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-500 dark:text-[#94A3B8] border border-slate-200 dark:border-[#243447]">-3Y</button>
                        <button type="button" onclick="setDateSlotOffsetYears('${pt.id}', 5)" class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-500 dark:text-[#94A3B8] border border-slate-200 dark:border-[#243447]">-5Y</button>
                        <button type="button" onclick="setDateSlotOffsetYears('${pt.id}', 10)" class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0E1724] hover:bg-slate-200 dark:hover:bg-[#1A283B] text-slate-500 dark:text-[#94A3B8] border border-slate-200 dark:border-[#243447]">-10Y</button>
                    </div>
                </div>

                ${priceSectionHtml}
                ${metricsHtml}
            </div>
        `;
    });

    container.innerHTML = cardsHtml;
}

// 3. Render Highlight Strip
function renderTimeMachineHighlightStrip() {
    const strip = document.getElementById('tmHighlightStrip');
    if (!strip) return;

    const dataset = getComparisonDataset();
    const points = dataset.points;
    if (points.length < 2) {
        strip.innerHTML = '';
        return;
    }

    const assetA = dataset.assetA;
    let minPtA = points[0];
    points.forEach(p => {
        if (p.valA && (!minPtA.valA || p.valA < minPtA.valA)) minPtA = p;
    });

    let maxJumpA = { diff: 0, pct: 0, from: points[0], to: points[0] };
    for (let i = 1; i < points.length; i++) {
        if (points[i - 1].valA && points[i].valA) {
            const prev = points[i - 1].valA;
            const curr = points[i].valA;
            const diff = curr - prev;
            const pct = prev > 0 ? (diff / prev) * 100 : 0;
            if (i === 1 || diff > maxJumpA.diff) {
                maxJumpA = { diff, pct, from: points[i - 1], to: points[i] };
            }
        }
    }

    const first = points[0];
    const last = points[points.length - 1];
    const totalDiffA = (last.valA && first.valA) ? last.valA - first.valA : 0;
    const totalPctA = (first.valA && first.valA > 0) ? (totalDiffA / first.valA) * 100 : 0;

    let dualSubtitle = '';
    if (dataset.isDual && dataset.assetB && last.valB && first.valB) {
        const totalDiffB = last.valB - first.valB;
        const totalPctB = first.valB > 0 ? (totalDiffB / first.valB) * 100 : 0;
        dualSubtitle = `<span>${dataset.assetB.short}: <strong>${totalDiffB >= 0 ? '+' : ''}${formatShortAssetVal(totalDiffB, dataset.assetBKey)}</strong> (${totalPctB >= 0 ? '+' : ''}${totalPctB.toFixed(1)}%)</span>`;
    } else {
        dualSubtitle = `<span>${first.shortDate} → ${last.shortDate}</span>`;
    }

    strip.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3 flex flex-col justify-between">
                <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span class="flex items-center gap-1.5 font-bold uppercase">
                        <span class="text-amber-500 font-bold">▼</span>
                        <span>Lowest Rate Milestone</span>
                    </span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-bold">${assetA.short}</span>
                </div>
                <div class="text-lg sm:text-xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] my-1">
                    ${minPtA.valAStr}
                </div>
                <div class="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] truncate">
                    <span>Recorded on <strong>${minPtA.fullDate}</strong></span>
                </div>
            </div>

            <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3 flex flex-col justify-between">
                <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span class="flex items-center gap-1.5 font-bold uppercase">
                        <span class="text-emerald-500 font-bold">⚡</span>
                        <span>Largest Single Step Jump</span>
                    </span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded ${maxJumpA.diff >= 0 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'} font-bold">
                        ${maxJumpA.pct >= 0 ? '+' : ''}${maxJumpA.pct.toFixed(1)}%
                    </span>
                </div>
                <div class="text-lg sm:text-xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] my-1">
                    ${maxJumpA.diff >= 0 ? '+' : ''}${formatAssetVal(maxJumpA.diff, tmPrimaryAsset)}
                </div>
                <div class="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] truncate">
                    <span>${maxJumpA.from.shortDate} → ${maxJumpA.to.shortDate}</span>
                </div>
            </div>

            <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3 flex flex-col justify-between">
                <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#94A3B8]">
                    <span class="flex items-center gap-1.5 font-bold uppercase">
                        <span class="text-blue-500 font-bold">📈</span>
                        <span>Total Range Expansion</span>
                    </span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded ${totalDiffA >= 0 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'} font-bold">
                        ${totalPctA >= 0 ? '+' : ''}${totalPctA.toFixed(1)}%
                    </span>
                </div>
                <div class="text-lg sm:text-xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9] my-1">
                    ${totalDiffA >= 0 ? '+' : ''}${formatAssetVal(totalDiffA, tmPrimaryAsset)}
                </div>
                <div class="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] truncate">
                    ${dualSubtitle}
                </div>
            </div>
        </div>
    `;
}

// 4. Render Visual Views Suite
function renderTimeMachineVisualStage() {
    const stage = document.getElementById('tmVisualStage');
    const tabsContainer = document.getElementById('tmViewTabsContainer');
    if (!stage || !tabsContainer) return;

    const views = [
        { id: 'curve', label: 'Growth Curve', icon: '📈', activeClass: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-500/25 ring-1 ring-amber-400/40' },
        { id: 'bar', label: 'Bar Compare', icon: '📊', activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold border-emerald-400 shadow-sm shadow-emerald-500/25 ring-1 ring-emerald-400/40' },
        { id: 'lollipop', label: 'Lollipop', icon: '🍭', activeClass: 'bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold border-purple-400 shadow-sm shadow-purple-500/25 ring-1 ring-purple-400/40' },
        { id: 'timeline', label: 'Timeline', icon: '⏳', activeClass: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold border-sky-400 shadow-sm shadow-sky-500/25 ring-1 ring-sky-400/40' },
        { id: 'slope', label: 'Slopegraph', icon: '📐', activeClass: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold border-cyan-400 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-400/40' },
        { id: 'delta', label: 'Delta Cards', icon: '🎴', activeClass: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold border-rose-400 shadow-sm shadow-rose-500/25 ring-1 ring-rose-400/40' },
        { id: 'table', label: 'Ledger Table', icon: '📋', activeClass: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold border-indigo-400 shadow-sm shadow-indigo-500/25 ring-1 ring-indigo-400/40' }
    ];

    tabsContainer.innerHTML = views.map(v => {
        const isActive = tmActiveView === v.id;
        const activeClass = isActive
            ? v.activeClass
            : 'bg-slate-100 dark:bg-[#0E1724] text-slate-600 dark:text-[#94A3B8] border-slate-200 dark:border-[#243447] hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white';
        return `
            <button type="button" onclick="setTimeMachineView('${v.id}')" class="px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-all ${activeClass}">
                <span>${v.icon}</span>
                <span>${v.label}</span>
            </button>
        `;
    }).join('');

    const isCartesian = ['curve', 'bar', 'lollipop'].includes(tmActiveView);
    const tagBtn = document.getElementById('tmToggleTagsBtn');
    const benchBox = document.getElementById('tmBenchmarkControl');
    if (tagBtn) tagBtn.classList.toggle('hidden', !isCartesian);
    if (benchBox) benchBox.classList.toggle('hidden', !isCartesian);

    const dataset = getComparisonDataset();
    if (dataset.points.length < 2) {
        stage.innerHTML = `
            <div class="text-center py-8 text-xs font-mono text-slate-500">
                At least 2 active milestones required to render visual comparison.
            </div>
        `;
        return;
    }

    switch (tmActiveView) {
        case 'curve':
            stage.innerHTML = buildCartesianSVG(dataset, 'curve');
            break;
        case 'bar':
            stage.innerHTML = buildCartesianSVG(dataset, 'bar');
            break;
        case 'lollipop':
            stage.innerHTML = buildCartesianSVG(dataset, 'lollipop');
            break;
        case 'timeline':
            stage.innerHTML = buildTimelineHTML(dataset);
            break;
        case 'slope':
            stage.innerHTML = buildSlopegraphSVG(dataset);
            break;
        case 'delta':
            stage.innerHTML = buildDeltaCardsHTML(dataset);
            break;
        case 'table':
            stage.innerHTML = buildTableHTML(dataset);
            break;
        default:
            stage.innerHTML = buildCartesianSVG(dataset, 'curve');
    }
}

// 4A, 4B, 4C: Stretched Responsive Cartesian SVG (Growth Curve, Bar Compare, Lollipop with Dual Series Support)
function buildCartesianSVG(dataset, chartType) {
    const isDual = dataset.isDual;
    const assetA = dataset.assetA;
    const assetB = dataset.assetB;
    const points = dataset.points;
    const n = points.length;

    // Expansive 1100x450 viewBox with generous margin padding so text never overlaps bars or lines
    const W = 1100;
    const H = 450;
    const padL = 88; // shifted left: ample room for ₹1.42L, text-anchor="end" at padL - 14
    const padR = isDual ? 88 : 44; // shifted right: ample room for right Y-axis text
    const padT = 62;
    const padB = 46;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Series A Scaling
    const valsA = points.map(p => p.valA).filter(v => v !== null && !isNaN(v));
    const targetVal = Number(tmTargetBenchmark);
    const hasTarget = !isNaN(targetVal) && targetVal > 0;
    if (hasTarget) valsA.push(targetVal);

    let minA = Math.min(...valsA);
    let maxA = Math.max(...valsA);
    if (chartType === 'bar') {
        minA = Math.max(0, minA * 0.7);
    } else {
        const padRangeA = (maxA - minA) * 0.16 || maxA * 0.15 || 1000;
        minA = Math.max(0, minA - padRangeA);
        maxA = maxA + padRangeA;
    }
    if (maxA <= minA) maxA = minA + 1000;

    const yOfA = val => padT + plotH - ((val - minA) / (maxA - minA)) * plotH;

    // Series B Scaling (Dual Y-Axis for perfect trajectory visualization)
    let minB = 0, maxB = 100;
    let yOfB = () => 0;
    if (isDual) {
        const valsB = points.map(p => p.valB).filter(v => v !== null && !isNaN(v));
        minB = Math.min(...valsB);
        maxB = Math.max(...valsB);
        if (chartType === 'bar') {
            minB = Math.max(0, minB * 0.7);
        } else {
            const padRangeB = (maxB - minB) * 0.16 || maxB * 0.15 || 100;
            minB = Math.max(0, minB - padRangeB);
            maxB = maxB + padRangeB;
        }
        if (maxB <= minB) maxB = minB + 100;
        yOfB = val => padT + plotH - ((val - minB) / (maxB - minB)) * plotH;
    }

    // Geometry Calculation: Strict separation between axis numbers and bars/points
    const slotW = plotW / Math.max(n, 1);
    const curveInsetX = Math.min(65, Math.max(45, plotW * 0.08));
    const xOf = idx => {
        if (chartType === 'bar') {
            return padL + (idx + 0.5) * slotW;
        }
        if (n === 1) return padL + plotW / 2;
        return padL + curveInsetX + (idx / (n - 1)) * (plotW - 2 * curveInsetX);
    };

    // Horizontal Gridlines & Y-Axis Labels (Shifted safely to the left and right)
    let gridSvg = '';
    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
        const vA = minA + (t / ticks) * (maxA - minA);
        const y = yOfA(vA);
        gridSvg += `
            <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="currentColor" class="text-slate-200 dark:text-[#243447]" stroke-width="1" />
            <text x="${padL - 14}" y="${y + 4}" text-anchor="end" class="fill-slate-700 dark:fill-[#94A3B8]" font-size="11" font-family="monospace" font-weight="700">${formatShortAssetVal(vA, dataset.assetAKey)}</text>
        `;
        if (isDual) {
            const vB = minB + (t / ticks) * (maxB - minB);
            gridSvg += `
                <text x="${W - padR + 14}" y="${y + 4}" text-anchor="start" style="fill: ${assetB.color}" font-size="11" font-family="monospace" font-weight="700">${formatShortAssetVal(vB, dataset.assetBKey)}</text>
            `;
        }
    }

    // Optional Target Benchmark Line
    let targetSvg = '';
    if (hasTarget) {
        const ty = yOfA(targetVal);
        targetSvg = `
            <line x1="${padL}" y1="${ty}" x2="${W - padR}" y2="${ty}" stroke="#10B981" stroke-width="1.8" stroke-dasharray="6 4" />
            <rect x="${W - padR - 120}" y="${ty - 18}" width="120" height="18" rx="4" fill="#10B981" />
            <text x="${W - padR - 60}" y="${ty - 5}" text-anchor="middle" fill="#ffffff" font-size="10" font-family="monospace" font-weight="700">Target ${formatShortAssetVal(targetVal, dataset.assetAKey)}</text>
        `;
    }

    // Smart Tag Indices (Auto dense fit or all)
    const visibleTags = new Set();
    if (tmShowAllTags || n <= 6) {
        points.forEach((_, idx) => visibleTags.add(idx));
    } else {
        let minIdx = 0;
        let maxIdx = 0;
        points.forEach((p, idx) => {
            if (p.valA < points[minIdx].valA) minIdx = idx;
            if (p.valA > points[maxIdx].valA) maxIdx = idx;
        });
        visibleTags.add(0);
        visibleTags.add(minIdx);
        visibleTags.add(maxIdx);
        visibleTags.add(n - 1);
    }

    const defsSvg = `
        <defs>
            <linearGradient id="tmAreaGradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${assetA.color}" stop-opacity="${isDual ? '0.25' : '0.35'}" />
                <stop offset="85%" stop-color="${assetA.color}" stop-opacity="0.03" />
                <stop offset="100%" stop-color="${assetA.color}" stop-opacity="0" />
            </linearGradient>
            ${isDual && assetB ? `
                <linearGradient id="tmAreaGradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${assetB.color}" stop-opacity="0.22" />
                    <stop offset="85%" stop-color="${assetB.color}" stop-opacity="0.02" />
                    <stop offset="100%" stop-color="${assetB.color}" stop-opacity="0" />
                </linearGradient>
            ` : ''}
            <linearGradient id="tmBarGradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${assetA.color}" stop-opacity="1" />
                <stop offset="100%" stop-color="${assetA.color}" stop-opacity="0.75" />
            </linearGradient>
            ${isDual && assetB ? `
                <linearGradient id="tmBarGradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${assetB.color}" stop-opacity="1" />
                    <stop offset="100%" stop-color="${assetB.color}" stop-opacity="0.75" />
                </linearGradient>
            ` : ''}
            <filter id="tmBarShadow" x="-8%" y="-8%" width="116%" height="116%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity="0.25" />
            </filter>
        </defs>
    `;

    let marksSvg = '';
    let pillsSvg = '';
    let xAxisSvg = '';
    const baseY = padT + plotH;

    // Growth Curve Rendering
    if (chartType === 'curve') {
        // Curve A (Primary Asset)
        const ptsA = points.map((p, idx) => `${xOf(idx)},${yOfA(p.valA)}`).join(' ');
        const areaA = `${xOf(0)},${baseY} ${ptsA} ${xOf(n - 1)},${baseY}`;
        marksSvg += `
            <polygon points="${areaA}" fill="url(#tmAreaGradA)" />
            <polyline points="${ptsA}" fill="none" stroke="${assetA.color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        `;

        // Curve B (Secondary Asset)
        if (isDual && assetB) {
            const ptsB = points.map((p, idx) => `${xOf(idx)},${yOfB(p.valB)}`).join(' ');
            marksSvg += `
                <polyline points="${ptsB}" fill="none" stroke="${assetB.color}" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round" stroke-linejoin="round" />
            `;
        }
    }

    // Bar / Lollipop / Vertex Dots
    const barW = isDual ? Math.min(30, Math.max(12, slotW * 0.22)) : Math.min(50, Math.max(16, slotW * 0.44));

    points.forEach((pt, idx) => {
        const cx = xOf(idx);
        const cyA = yOfA(pt.valA);
        const cyB = isDual ? yOfB(pt.valB) : 0;

        // X-Axis Date
        xAxisSvg += `
            <text x="${cx}" y="${baseY + 22}" text-anchor="middle" class="fill-slate-800 dark:fill-[#94A3B8]" font-size="11" font-family="monospace" font-weight="700">${pt.shortDate}</text>
        `;

        if (chartType === 'bar') {
            if (!isDual) {
                marksSvg += `
                    <rect x="${cx - barW / 2}" y="${cyA}" width="${barW}" height="${Math.max(4, baseY - cyA)}" rx="6" fill="url(#tmBarGradA)" stroke="${assetA.color}" stroke-width="1.2" filter="url(#tmBarShadow)" />
                `;
            } else {
                marksSvg += `
                    <rect x="${cx - barW - 3}" y="${cyA}" width="${barW}" height="${Math.max(4, baseY - cyA)}" rx="5" fill="url(#tmBarGradA)" stroke="${assetA.color}" stroke-width="1.2" filter="url(#tmBarShadow)" />
                    <rect x="${cx + 3}" y="${cyB}" width="${barW}" height="${Math.max(4, baseY - cyB)}" rx="5" fill="url(#tmBarGradB)" stroke="${assetB.color}" stroke-width="1.2" filter="url(#tmBarShadow)" />
                `;
            }
        } else if (chartType === 'lollipop') {
            if (!isDual) {
                marksSvg += `
                    <line x1="${cx}" y1="${baseY}" x2="${cx}" y2="${cyA}" stroke="${assetA.color}" stroke-width="2.5" />
                    <circle cx="${cx}" cy="${cyA}" r="6.5" fill="${assetA.color}" stroke="#0E1724" stroke-width="2" />
                    <circle cx="${cx}" cy="${cyA}" r="2" fill="#ffffff" />
                `;
            } else {
                marksSvg += `
                    <line x1="${cx - 6}" y1="${baseY}" x2="${cx - 6}" y2="${cyA}" stroke="${assetA.color}" stroke-width="2.2" />
                    <circle cx="${cx - 6}" cy="${cyA}" r="6" fill="${assetA.color}" stroke="#0E1724" stroke-width="2" />
                    <circle cx="${cx - 6}" cy="${cyA}" r="2" fill="#ffffff" />
                    <line x1="${cx + 6}" y1="${baseY}" x2="${cx + 6}" y2="${cyB}" stroke="${assetB.color}" stroke-width="2.2" />
                    <circle cx="${cx + 6}" cy="${cyB}" r="6" fill="${assetB.color}" stroke="#0E1724" stroke-width="2" />
                    <circle cx="${cx + 6}" cy="${cyB}" r="2" fill="#ffffff" />
                `;
            }
        } else {
            // Curve Vertex Dots
            marksSvg += `
                <circle cx="${cx}" cy="${cyA}" r="6.5" fill="${assetA.color}" stroke="#0E1724" stroke-width="2.5" />
                <circle cx="${cx}" cy="${cyA}" r="2.5" fill="#ffffff" />
            `;
            if (isDual && assetB) {
                marksSvg += `
                    <circle cx="${cx}" cy="${cyB}" r="6" fill="${assetB.color}" stroke="#0E1724" stroke-width="2.5" />
                    <circle cx="${cx}" cy="${cyB}" r="2" fill="#ffffff" />
                `;
            }
        }

        // Direct Callout Tags with Safe Margin Clamping and Multi-Color Badges
        if (visibleTags.has(idx)) {
            const staggerOffset = (idx % 2 === 1 && n >= 5) ? 14 : 0;
            const pillW = isDual ? 120 : 96;
            const pillH = isDual ? 38 : 28;
            // Clamped within plot boundary to NEVER touch or cross padL / padR
            const pillX = Math.max(padL + 6, Math.min(W - padR - pillW - 6, cx - pillW / 2));
            const topAnchorY = isDual ? Math.min(cyA, cyB) : cyA;
            const isNearTop = topAnchorY < (padT + 30);
            const pillY = isNearTop 
                ? (topAnchorY + 14 + staggerOffset) 
                : Math.max(8, topAnchorY - pillH - 8 - staggerOffset);
            const pointerY = isNearTop ? pillY : (pillY + pillH);

            if (!isDual) {
                pillsSvg += `
                    <line x1="${cx}" y1="${isNearTop ? (cyA + 4) : (cyA - 4)}" x2="${cx}" y2="${pointerY}" stroke="${assetA.color}" stroke-width="1.2" stroke-opacity="0.7" />
                    <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="7" class="fill-white dark:fill-[#0E1724]" stroke="${assetA.color}" stroke-width="1.6" filter="url(#tmBarShadow)" />
                    <text x="${pillX + pillW / 2}" y="${pillY + 12}" text-anchor="middle" class="fill-slate-900 dark:fill-[#F1F5F9]" font-size="10.5" font-family="monospace" font-weight="800">${pt.valAStr}</text>
                    <text x="${pillX + pillW / 2}" y="${pillY + 23}" text-anchor="middle" fill="${assetA.color}" font-size="9" font-family="monospace" font-weight="700">${assetA.short}</text>
                `;
            } else {
                pillsSvg += `
                    <line x1="${cx}" y1="${isNearTop ? (topAnchorY + 4) : (topAnchorY - 4)}" x2="${cx}" y2="${pointerY}" stroke="currentColor" class="text-slate-400 dark:text-[#243447]" stroke-width="1.2" />
                    <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="7" class="fill-white dark:fill-[#0E1724]" stroke="currentColor" class="text-slate-300 dark:text-[#243447]" stroke-width="1.5" filter="url(#tmBarShadow)" />
                    <g transform="translate(${pillX + 8}, ${pillY + 14})">
                        <circle cx="4" cy="-4" r="3" fill="${assetA.color}" />
                        <text x="12" y="0" fill="${assetA.color}" font-size="10.5" font-family="monospace" font-weight="800">${formatShortAssetVal(pt.valA, dataset.assetAKey)}</text>
                    </g>
                    <g transform="translate(${pillX + 8}, ${pillY + 29})">
                        <circle cx="4" cy="-4" r="3" fill="${assetB.color}" />
                        <text x="12" y="0" fill="${assetB.color}" font-size="10.5" font-family="monospace" font-weight="800">${formatShortAssetVal(pt.valB, dataset.assetBKey)}</text>
                    </g>
                `;
            }
        }
    });

    // Legend Header
    let legendHtml = `
        <div class="flex items-center justify-between gap-3 pb-2 text-xs font-mono font-bold">
            <div class="flex items-center gap-4 flex-wrap">
                <span class="inline-flex items-center gap-1.5" style="color: ${assetA.color}">
                    <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${assetA.color}"></span>
                    <span>${assetA.name}</span>
                </span>
                ${isDual ? `
                    <span class="inline-flex items-center gap-1.5" style="color: ${assetB.color}">
                        <span class="w-2.5 h-2.5 rounded-sm" style="background-color: ${assetB.color}"></span>
                        <span>${assetB.name} (Dual Y-Axis)</span>
                    </span>
                ` : ''}
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">Stretched Full-Width Canvas (${W}x${H})</span>
        </div>
    `;

    return `
        ${legendHtml}
        <div class="w-full overflow-x-auto">
            <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto min-w-[650px] max-h-[460px] block select-none">
                ${defsSvg}
                ${gridSvg}
                ${targetSvg}
                ${marksSvg}
                ${xAxisSvg}
                ${pillsSvg}
            </svg>
        </div>
    `;
}

// 4D: Timeline Journey View
function buildTimelineHTML(dataset) {
    const isDual = dataset.isDual;
    const assetA = dataset.assetA;
    const assetB = dataset.assetB;
    const points = dataset.points;

    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${points.map((pt, idx) => {
                const prev = idx > 0 ? points[idx - 1] : null;
                const stepDiffA = prev ? pt.valA - prev.valA : 0;
                const stepPctA = prev && prev.valA > 0 ? (stepDiffA / prev.valA) * 100 : 0;
                const signA = stepDiffA >= 0 ? '+' : '';
                const colorA = stepDiffA >= 0 ? 'text-emerald-500' : 'text-rose-500';

                let dualSection = '';
                if (isDual && assetB && pt.valB) {
                    const stepDiffB = prev ? pt.valB - prev.valB : 0;
                    const stepPctB = prev && prev.valB > 0 ? (stepDiffB / prev.valB) * 100 : 0;
                    const signB = stepDiffB >= 0 ? '+' : '';
                    const colorB = stepDiffB >= 0 ? 'text-emerald-500' : 'text-rose-500';
                    const ratio = pt.valB > 0 ? (pt.valA / pt.valB).toFixed(2) : '-';

                    dualSection = `
                        <div class="pt-2 border-t border-dashed border-slate-200 dark:border-[#243447]/60 space-y-1 text-xs font-mono">
                            <div class="flex items-center justify-between">
                                <span class="text-[11px]" style="color:${assetB.color}">${assetB.short}:</span>
                                <span class="font-bold text-slate-800 dark:text-[#F1F5F9]">${pt.valBStr}</span>
                            </div>
                            <div class="flex items-center justify-between text-[10px]">
                                <span class="text-slate-400">Step vs #${idx}:</span>
                                <span class="${colorB} font-bold">${signB}${stepPctB.toFixed(1)}%</span>
                            </div>
                            <div class="flex items-center justify-between text-[10px] pt-1">
                                <span class="text-slate-400">Ratio (A/B):</span>
                                <span class="font-bold text-amber-500">${ratio}x</span>
                            </div>
                        </div>
                    `;
                }

                return `
                    <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3.5 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono">
                            <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#142030] text-slate-700 dark:text-[#94A3B8] font-bold text-[10px]">
                                Milestone #${idx + 1}
                            </span>
                            <span class="font-bold text-slate-700 dark:text-[#F1F5F9]">${pt.fullDate}</span>
                        </div>
                        <div class="space-y-0.5">
                            <div class="text-lg font-extrabold font-num" style="color: ${assetA.color}">${pt.valAStr}</div>
                            <div class="text-[10px] font-mono text-slate-500">${assetA.name}</div>
                        </div>
                        <div class="pt-2 border-t border-slate-200 dark:border-[#243447] text-xs font-mono">
                            ${idx === 0 
                                ? `<span class="text-slate-400 text-[11px]">Primary Baseline Milestone (1.0x)</span>`
                                : `<div class="flex items-center justify-between">
                                    <span class="text-slate-500 text-[10px]">vs Step #${idx}:</span>
                                    <span class="${colorA} font-bold text-[11px]">${signA}${formatAssetVal(stepDiffA, dataset.assetAKey)} (${signA}${stepPctA.toFixed(1)}%)</span>
                                   </div>`
                            }
                        </div>
                        ${dualSection}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 4E: Slopegraph View (Earliest vs Latest)
function buildSlopegraphSVG(dataset) {
    const isDual = dataset.isDual;
    const assetA = dataset.assetA;
    const assetB = dataset.assetB;
    const points = dataset.points;
    const first = points[0];
    const last = points[points.length - 1];

    const W = 1000;
    const H = 320;
    const leftX = 220;
    const rightX = W - 220;
    const padT = 54;
    const padB = 44;
    const plotH = H - padT - padB;

    const diffA = last.valA - first.valA;
    const pctA = first.valA > 0 ? ((diffA / first.valA) * 100).toFixed(1) : '0.0';
    const signA = diffA >= 0 ? '+' : '';
    const colorA = diffA >= 0 ? '#10B981' : '#F43F5E';

    let dualSvg = '';
    if (isDual && assetB && last.valB && first.valB) {
        const diffB = last.valB - first.valB;
        const pctB = first.valB > 0 ? ((diffB / first.valB) * 100).toFixed(1) : '0.0';
        const signB = diffB >= 0 ? '+' : '';

        dualSvg = `
            <line x1="${leftX}" y1="${padT + plotH * 0.7}" x2="${rightX}" y2="${padT + (diffB >= 0 ? plotH * 0.4 : plotH * 0.9)}" stroke="${assetB.color}" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round" />
            <circle cx="${leftX}" cy="${padT + plotH * 0.7}" r="6.5" fill="${assetB.color}" stroke="#142030" stroke-width="2" />
            <circle cx="${rightX}" cy="${padT + (diffB >= 0 ? plotH * 0.4 : plotH * 0.9)}" r="6.5" fill="${assetB.color}" stroke="#142030" stroke-width="2" />

            <text x="${leftX - 16}" y="${padT + plotH * 0.7 + 4}" text-anchor="end" fill="${assetB.color}" font-size="12" font-family="monospace" font-weight="800">${assetB.short}: ${first.valBStr}</text>
            <text x="${rightX + 16}" y="${padT + (diffB >= 0 ? plotH * 0.4 : plotH * 0.9) + 4}" text-anchor="start" fill="${assetB.color}" font-size="12" font-family="monospace" font-weight="800">${assetB.short}: ${last.valBStr} (${signB}${pctB}%)</text>
        `;
    }

    return `
        <div class="w-full overflow-x-auto">
            <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto min-w-[620px] max-h-[340px] block select-none">
                <line x1="${leftX}" y1="${padT - 12}" x2="${leftX}" y2="${H - padB + 12}" stroke="currentColor" class="text-slate-300 dark:text-[#243447]" stroke-width="1.8" />
                <line x1="${rightX}" y1="${padT - 12}" x2="${rightX}" y2="${H - padB + 12}" stroke="currentColor" class="text-slate-300 dark:text-[#243447]" stroke-width="1.8" />

                <text x="${leftX}" y="24" text-anchor="middle" class="fill-slate-600 dark:fill-[#94A3B8]" font-size="12" font-family="monospace" font-weight="700">Baseline: ${first.fullDate}</text>
                <text x="${rightX}" y="24" text-anchor="middle" class="fill-slate-600 dark:fill-[#94A3B8]" font-size="12" font-family="monospace" font-weight="700">Latest: ${last.fullDate}</text>

                <line x1="${leftX}" y1="${padT + plotH * 0.6}" x2="${rightX}" y2="${padT + (diffA >= 0 ? plotH * 0.2 : plotH * 0.8)}" stroke="${assetA.color}" stroke-width="3.5" stroke-linecap="round" />
                <circle cx="${leftX}" cy="${padT + plotH * 0.6}" r="7" fill="${assetA.color}" stroke="#142030" stroke-width="2" />
                <circle cx="${rightX}" cy="${padT + (diffA >= 0 ? plotH * 0.2 : plotH * 0.8)}" r="7" fill="${assetA.color}" stroke="#142030" stroke-width="2" />

                <text x="${leftX - 16}" y="${padT + plotH * 0.6 + 4}" text-anchor="end" class="fill-slate-900 dark:fill-[#F1F5F9]" font-size="13" font-family="monospace" font-weight="800">${assetA.short}: ${first.valAStr}</text>
                <text x="${rightX + 16}" y="${padT + (diffA >= 0 ? plotH * 0.2 : plotH * 0.8) + 4}" text-anchor="start" class="fill-slate-900 dark:fill-[#F1F5F9]" font-size="13" font-family="monospace" font-weight="800">${assetA.short}: ${last.valAStr} (${signA}${pctA}%)</text>

                ${dualSvg}
            </svg>
        </div>
    `;
}

// 4F: Delta Cards View
function buildDeltaCardsHTML(dataset) {
    const isDual = dataset.isDual;
    const assetA = dataset.assetA;
    const assetB = dataset.assetB;
    const points = dataset.points;
    const base = points[0];

    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${points.map((pt, idx) => {
                const vsFirstA = pt.valA - base.valA;
                const vsFirstPctA = base.valA > 0 ? (vsFirstA / base.valA) * 100 : 0;
                const signA = vsFirstA >= 0 ? '+' : '';
                const colorA = vsFirstA >= 0 ? 'text-emerald-500' : 'text-rose-500';

                let dualBlock = '';
                if (isDual && assetB && pt.valB && base.valB) {
                    const vsFirstB = pt.valB - base.valB;
                    const vsFirstPctB = base.valB > 0 ? (vsFirstB / base.valB) * 100 : 0;
                    const signB = vsFirstB >= 0 ? '+' : '';
                    const colorB = vsFirstB >= 0 ? 'text-emerald-500' : 'text-rose-500';
                    const ratio = pt.valB > 0 ? (pt.valA / pt.valB).toFixed(2) : '-';

                    dualBlock = `
                        <div class="pt-2 border-t border-dashed border-slate-200 dark:border-[#243447]/60 space-y-1 text-xs font-mono">
                            <div class="flex items-center justify-between">
                                <span class="text-[11px]" style="color:${assetB.color}">${assetB.short}:</span>
                                <span class="font-bold text-slate-800 dark:text-[#F1F5F9]">${pt.valBStr}</span>
                            </div>
                            <div class="flex items-center justify-between text-[10px]">
                                <span class="text-slate-400">Delta vs Base:</span>
                                <span class="${colorB} font-bold">${signB}${vsFirstPctB.toFixed(1)}%</span>
                            </div>
                            <div class="flex items-center justify-between text-[10px] pt-0.5">
                                <span class="text-slate-400">Ratio:</span>
                                <span class="font-bold text-amber-500">${ratio}x</span>
                            </div>
                        </div>
                    `;
                }

                return `
                    <div class="bg-slate-50 dark:bg-[#0E1724] border border-slate-200 dark:border-[#243447] rounded-xl p-3.5 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono">
                            <span class="font-bold text-slate-800 dark:text-[#F1F5F9]">${pt.fullDate}</span>
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded border" style="color: ${assetA.color}; border-color: ${assetA.color}33; background-color: ${assetA.color}15;">
                                ${assetA.short}
                            </span>
                        </div>
                        <div class="text-xl font-extrabold font-num text-slate-900 dark:text-[#F1F5F9]">${pt.valAStr}</div>
                        
                        <div class="pt-2 border-t border-slate-200 dark:border-[#243447] space-y-1 text-xs font-mono">
                            ${idx === 0 
                                ? `<span class="text-slate-400 text-[11px]">Baseline Reference Point (0.0%)</span>`
                                : `
                                    <div class="flex items-center justify-between">
                                        <span class="text-slate-500 text-[11px]">vs 1st Date:</span>
                                        <span class="${colorA} font-bold">${signA}${formatAssetVal(vsFirstA, dataset.assetAKey)} (${signA}${vsFirstPctA.toFixed(1)}%)</span>
                                    </div>
                                `
                            }
                        </div>
                        ${dualBlock}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 4G: Ledger Table View
function buildTableHTML(dataset) {
    const isDual = dataset.isDual;
    const assetA = dataset.assetA;
    const assetB = dataset.assetB;
    const points = dataset.points;
    const base = points[0];

    return `
        <div class="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-[#243447]">
            <table class="w-full text-xs font-mono text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100 dark:bg-[#0E1724] border-b border-slate-200 dark:border-[#243447] text-slate-600 dark:text-[#94A3B8]">
                        <th class="p-3">#</th>
                        <th class="p-3">Date</th>
                        <th class="p-3" style="color:${assetA.color}">${assetA.name}</th>
                        <th class="p-3">Delta vs Base (A)</th>
                        ${isDual ? `
                            <th class="p-3" style="color:${assetB.color}">${assetB.name}</th>
                            <th class="p-3">Delta vs Base (B)</th>
                            <th class="p-3">Ratio (A/B)</th>
                        ` : `
                            <th class="p-3">Step Change</th>
                            <th class="p-3">Multiplier</th>
                        `}
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-[#243447] bg-white dark:bg-[#142030]">
                    ${points.map((pt, idx) => {
                        const diffA = pt.valA - base.valA;
                        const pctA = base.valA > 0 ? (diffA / base.valA) * 100 : 0;
                        const multA = base.valA > 0 ? (pt.valA / base.valA) : 1;
                        const prev = idx > 0 ? points[idx - 1] : null;
                        const stepDiffA = prev ? pt.valA - prev.valA : 0;

                        const signA = diffA >= 0 ? '+' : '';
                        const colorA = diffA >= 0 ? 'text-emerald-500' : 'text-rose-500';

                        let dualCols = '';
                        if (isDual && assetB && pt.valB && base.valB) {
                            const diffB = pt.valB - base.valB;
                            const pctB = base.valB > 0 ? (diffB / base.valB) * 100 : 0;
                            const signB = diffB >= 0 ? '+' : '';
                            const colorB = diffB >= 0 ? 'text-emerald-500' : 'text-rose-500';
                            const ratio = pt.valB > 0 ? (pt.valA / pt.valB).toFixed(2) + 'x' : '-';

                            dualCols = `
                                <td class="p-3 font-bold font-num" style="color:${assetB.color}">${pt.valBStr}</td>
                                <td class="p-3">
                                    ${idx === 0 
                                        ? `<span class="text-slate-400 font-bold">Baseline</span>`
                                        : `<span class="${colorB} font-bold">${signB}${pctB.toFixed(1)}%</span>`
                                    }
                                </td>
                                <td class="p-3 font-bold text-amber-500">${ratio}</td>
                            `;
                        } else {
                            dualCols = `
                                <td class="p-3">
                                    ${idx === 0 
                                        ? `—`
                                        : `<span class="text-slate-700 dark:text-[#94A3B8] font-bold">${stepDiffA >= 0 ? '+' : ''}${formatAssetVal(stepDiffA, dataset.assetAKey)}</span>`
                                    }
                                </td>
                                <td class="p-3">
                                    <span class="px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold text-[11px]">
                                        ${multA.toFixed(2)}x
                                    </span>
                                </td>
                            `;
                        }

                        return `
                            <tr class="hover:bg-slate-50 dark:hover:bg-[#1A283B] transition-colors">
                                <td class="p-3 font-bold text-slate-400">#${idx + 1}</td>
                                <td class="p-3 font-bold text-slate-800 dark:text-[#F1F5F9]">${pt.fullDate}</td>
                                <td class="p-3 font-bold font-num" style="color:${assetA.color}">${pt.valAStr}</td>
                                <td class="p-3">
                                    ${idx === 0 
                                        ? `<span class="text-slate-400 font-bold">Baseline</span>`
                                        : `<span class="${colorA} font-bold">${signA}${formatAssetVal(diffA, dataset.assetAKey)} (${signA}${pctA.toFixed(1)}%)</span>`
                                    }
                                </td>
                                ${dualCols}
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 5. Interactive Handlers
function setComparisonMode(mode) {
    tmComparisonMode = mode;
    renderTimeMachine();
}

function setSingleAsset(assetKey) {
    tmPrimaryAsset = assetKey;
    renderTimeMachine();
}

function setDualPair(pairId, assetA, assetB) {
    tmActivePairPreset = pairId;
    tmPrimaryAsset = assetA;
    tmSecondaryAsset = assetB;
    renderTimeMachine();
}

function setTimeMachineView(viewKey) {
    tmActiveView = viewKey;
    renderTimeMachineVisualStage();
}

function setCheckpointsCount(targetCount) {
    const latest = getLatestValidSession(DATA);
    const anchorDate = latest ? latest.session.d : '2026-11-20';
    while (tmDates.length < targetCount) {
        const yrsAgo = tmDates.length * 2.5;
        tmDates.push({
            id: 'tm-d-' + (++tmDateCounter),
            date: getYearsAgoDate(anchorDate, yrsAgo),
            isAnchor: false
        });
    }
    if (tmDates.length > targetCount) {
        tmDates = tmDates.slice(0, targetCount);
    }
    renderTimeMachine();
}

function addTimeMachineSlot() {
    if (tmDates.length >= 10) return;
    const latest = getLatestValidSession(DATA);
    const anchorDate = latest ? latest.session.d : '2026-11-20';
    const yrsAgo = tmDates.length * 2.5;
    tmDates.push({
        id: 'tm-d-' + (++tmDateCounter),
        date: getYearsAgoDate(anchorDate, yrsAgo),
        isAnchor: false
    });
    renderTimeMachine();
}

function removeDateSlot(id) {
    if (tmDates.length <= 2) return;
    tmDates = tmDates.filter(d => d.id !== id);
    renderTimeMachine();
}

function updateDateSlot(id, newDate) {
    const item = tmDates.find(d => d.id === id);
    if (item) {
        item.date = newDate;
        renderTimeMachine();
    }
}

function setDateSlotOffsetYears(id, years) {
    const latest = getLatestValidSession(DATA);
    const anchorDate = latest ? latest.session.d : '2026-11-20';
    const item = tmDates.find(d => d.id === id);
    if (item) {
        item.date = getYearsAgoDate(anchorDate, years);
        renderTimeMachine();
    }
}

function sortTimeMachineSlotsOldest() {
    tmDates.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    renderTimeMachine();
}

function toggleTimeMachineTagDensity() {
    tmShowAllTags = !tmShowAllTags;
    renderTimeMachineVisualStage();
}

function updateTimeMachineTargetBenchmark(val) {
    tmTargetBenchmark = val;
    renderTimeMachineVisualStage();
}

function applyTimeMachinePreset(type) {
    const latest = getLatestValidSession(DATA);
    const anchorDate = latest ? latest.session.d : '2026-11-20';

    if (type === '10y') {
        tmDates = [
            { id: 'tm-d-0', date: anchorDate, isAnchor: true },
            { id: 'tm-d-1', date: getYearsAgoDate(anchorDate, 3), isAnchor: false },
            { id: 'tm-d-2', date: getYearsAgoDate(anchorDate, 5), isAnchor: false },
            { id: 'tm-d-3', date: getYearsAgoDate(anchorDate, 7), isAnchor: false },
            { id: 'tm-d-4', date: getYearsAgoDate(anchorDate, 10), isAnchor: false }
        ];
    } else if (type === '5y') {
        tmDates = [
            { id: 'tm-d-0', date: anchorDate, isAnchor: true },
            { id: 'tm-d-1', date: getYearsAgoDate(anchorDate, 1), isAnchor: false },
            { id: 'tm-d-2', date: getYearsAgoDate(anchorDate, 2), isAnchor: false },
            { id: 'tm-d-3', date: getYearsAgoDate(anchorDate, 3), isAnchor: false },
            { id: 'tm-d-4', date: getYearsAgoDate(anchorDate, 5), isAnchor: false }
        ];
    } else if (type === '15y') {
        tmDates = [
            { id: 'tm-d-0', date: anchorDate, isAnchor: true },
            { id: 'tm-d-1', date: getYearsAgoDate(anchorDate, 5), isAnchor: false },
            { id: 'tm-d-2', date: getYearsAgoDate(anchorDate, 10), isAnchor: false },
            { id: 'tm-d-3', date: getYearsAgoDate(anchorDate, 15), isAnchor: false }
        ];
    } else if (type === 'covid') {
        tmDates = [
            { id: 'tm-d-0', date: anchorDate, isAnchor: true },
            { id: 'tm-d-1', date: '2020-08-07', isAnchor: false },
            { id: 'tm-d-2', date: '2020-03-24', isAnchor: false },
            { id: 'tm-d-3', date: '2019-12-31', isAnchor: false }
        ];
    } else if (type === '2008') {
        tmDates = [
            { id: 'tm-d-0', date: anchorDate, isAnchor: true },
            { id: 'tm-d-1', date: '2011-09-06', isAnchor: false },
            { id: 'tm-d-2', date: '2008-10-24', isAnchor: false },
            { id: 'tm-d-3', date: '2006-05-12', isAnchor: false }
        ];
    }
    renderTimeMachine();
}

function resetTimeMachine() {
    setComparisonMode('dual');
    setDualPair('g-sv', 'g', 'sv');
    applyTimeMachinePreset('10y');
}

// Backward-compatibility aliases
function applyTimeMachinePairPreset(presetKey) {
    if (presetKey === 'g-sv' || presetKey === 'g-s') setDualPair('g-sv', 'g', 'sv');
    else if (presetKey === 'g-svKg') setDualPair('g-svKg', 'g', 'svKg');
    else if (presetKey === 'g-g22' || presetKey === 'g24-g22') setDualPair('g-g22', 'g', 'g22');
    else if (presetKey === 'g-xau') setDualPair('g-xau', 'g', 'xau');
    else if (presetKey === 'sv-xag' || presetKey === 's-xag') setDualPair('sv-xag', 'sv', 'xag');
    else if (presetKey === 'g-usd' || presetKey === 'inr-usd') setDualPair('g-usd', 'g', 'usd');
    else if (presetKey === 'g-g') { setComparisonMode('single'); setSingleAsset('g'); }
    else if (presetKey === 's-s') { setComparisonMode('single'); setSingleAsset('sv'); }
    else { setDualPair('g-sv', 'g', 'sv'); }
}
function setTimeMachineSlotsCount(n) { setCheckpointsCount(n); }
function removeTimeMachineSlot(id) { removeDateSlot(id); }

// Expose on window for tests and console inspection
try {
    window.tmDates = tmDates;
    window.tmComparisonMode = tmComparisonMode;
    window.setComparisonMode = setComparisonMode;
    window.setSingleAsset = setSingleAsset;
    window.setDualPair = setDualPair;
    window.setCheckpointsCount = setCheckpointsCount;
    window.setTimeMachineView = setTimeMachineView;
    window.addTimeMachineSlot = addTimeMachineSlot;
    window.removeDateSlot = removeDateSlot;
    window.updateDateSlot = updateDateSlot;
    window.setDateSlotOffsetYears = setDateSlotOffsetYears;
    window.applyTimeMachinePreset = applyTimeMachinePreset;
    window.applyTimeMachinePairPreset = applyTimeMachinePairPreset;
    window.setTimeMachineSlotsCount = setTimeMachineSlotsCount;
    window.removeTimeMachineSlot = removeTimeMachineSlot;
    Object.defineProperty(window, 'tmSlots', {
        get: () => tmDates,
        configurable: true
    });
} catch (e) {}
