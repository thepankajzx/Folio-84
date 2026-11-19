const fs = require('fs');

let termCode = fs.readFileSync('generate_terminal.js', 'utf8');
termCode = termCode.replace(/\r\n/g, '\n');

// 1. Update static header timestamp
termCode = termCode.replace(
  'id="headerTimestamp">18-Nov-2026 Session Verified</span>',
  'id="headerTimestamp">19-Nov-2026 Session Verified</span>'
);

// 2. Update initial static cards to 19-Nov values
// Gold 24K: 129,531 (+5,789, +4.68%)
termCode = termCode.replace(
  `id="cardGoldPrice">\n                        ₹1,30,078`,
  `id="cardGoldPrice">\n                        ₹1,29,531`
);
termCode = termCode.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGoldChg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹3,936</span>\n                            <span>(-2.94%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGoldChg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹5,789</span>\n                            <span>(+4.68%)</span>\n                        </span>\n                    </div>`
);

// Gold 22K: 118,737 (+5,307, +4.68%)
termCode = termCode.replace(
  `id="cardGold22Price">\n                        ₹1,19,238`,
  `id="cardGold22Price">\n                        ₹1,18,737`
);
termCode = termCode.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGold22Chg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹3,608</span>\n                            <span>(-2.94%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGold22Chg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹5,307</span>\n                            <span>(+4.68%)</span>\n                        </span>\n                    </div>`
);

// Silver 10g: 1604.39 (+123.49, +8.34%)
termCode = termCode.replace(
  `id="cardSilverPrice">\n                        ₹1,552`,
  `id="cardSilverPrice">\n                        ₹1,604.39`
);
termCode = termCode.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverChg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹66</span>\n                            <span>(-4.08%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverChg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹123.49</span>\n                            <span>(+8.34%)</span>\n                        </span>\n                    </div>`
);

// Silver 1kg: 160,439 (+12,349, +8.34%)
termCode = termCode.replace(
  `id="cardSilverKgPrice">\n                        ₹1,55,200`,
  `id="cardSilverKgPrice">\n                        ₹1,60,439`
);
termCode = termCode.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverKgChg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹6,589</span>\n                            <span>(-4.08%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverKgChg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹12,349</span>\n                            <span>(+8.34%)</span>\n                        </span>\n                    </div>`
);

// 3. Update initData to check localStorage cache
const oldInitData = `        function initData() {
            window.DATA = DATA = enrichRows(SNAPSHOT.slice());
            renderTopCards();
            render52WeekStats();
            updateColButtonStyles();
            updateSortDropdownAndIcons();
            renderAuditTable();
            renderSingleChart();
        }`;

const newInitData = `        function initData() {
            let rowsToUse = SNAPSHOT.slice();
            try {
                const cached = localStorage.getItem('AURA_BULLION_DATA_CACHE');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length >= SNAPSHOT.length) {
                        const byDate = {};
                        SNAPSHOT.forEach(r => byDate[r.d] = r);
                        parsed.forEach(r => { if (r && r.d) byDate[r.d] = Object.assign({}, byDate[r.d] || {}, r); });
                        rowsToUse = Object.values(byDate).sort((a, b) => a.d.localeCompare(b.d));
                    }
                }
            } catch (e) {
                console.warn('Cache load error', e);
            }
            window.DATA = DATA = enrichRows(rowsToUse);
            renderTopCards();
            render52WeekStats();
            updateColButtonStyles();
            updateSortDropdownAndIcons();
            renderAuditTable();
            renderSingleChart();
        }`;

if (termCode.includes(oldInitData)) {
  termCode = termCode.replace(oldInitData, newInitData);
  console.log('Replaced initData successfully');
} else {
  console.log('Warning: oldInitData not found in generate_terminal.js');
}

// 4. Update renderTopCards to dynamically color badges and update header date
const oldRenderTopCards = `        // Render Top 4 KPI Cards
        function renderTopCards() {
            if (!DATA.length) return;
            const last = DATA[DATA.length - 1];
            const prev = DATA[DATA.length - 2] || {};

            // 1. Gold 24K
            document.getElementById('cardGoldPrice').textContent = inr.format(last.g);
            const gDiffStr = last.gDiff < 0 ? \\\`▼ -₹\\\${Math.abs(Math.round(last.gDiff)).toLocaleString('en-IN')}\\\` : \\\`▲ +₹\\\${Math.round(last.gDiff).toLocaleString('en-IN')}\\\`;
            const gPctStr = \\\`(\\\${last.gChg.toFixed(2)}%)\\\`;
            document.getElementById('cardGoldChg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${gDiffStr}</span>
                    <span>\\\${gPctStr}</span>
                </span>
                <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs \\\${inr.format(prev.g || 0)}</span>
            \\\`;

            // 2. Gold 22K (916 Jewellery Standard)
            document.getElementById('cardGold22Price').textContent = inr.format(last.g22);
            const g22DiffStr = last.g22Diff < 0 ? \\\`▼ -₹\\\${Math.abs(Math.round(last.g22Diff)).toLocaleString('en-IN')}\\\` : \\\`▲ +₹\\\${Math.round(last.g22Diff).toLocaleString('en-IN')}\\\`;
            const g22PctStr = \\\`(\\\${last.g22Chg.toFixed(2)}%)\\\`;
            document.getElementById('cardGold22Chg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${g22DiffStr}</span>
                    <span>\\\${g22PctStr}</span>
                </span>
                <span class="text-[10px] text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">Retail Jewellery</span>
            \\\`;

            // 3. Silver 10g
            document.getElementById('cardSilverPrice').textContent = inr2.format(last.sv);
            const sDiffStr = last.sDiff < 0 ? \\\`▼ -₹\\\${Math.abs(last.sDiff).toFixed(2)}\\\` : \\\`▲ +₹\\\${last.sDiff.toFixed(2)}\\\`;
            const sPctStr = \\\`(\\\${last.sChg.toFixed(2)}%)\\\`;
            document.getElementById('cardSilverChg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${sDiffStr}</span>
                    <span>\\\${sPctStr}</span>
                </span>
                <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs \\\${inr2.format(prev.sv || 0)}</span>
            \\\`;

            // 4. Silver 1kg
            document.getElementById('cardSilverKgPrice').textContent = inr.format(last.sv * 100);
            const sKgDiff = last.sDiff * 100;
            const sKgDiffStr = sKgDiff < 0 ? \\\`▼ -₹\\\${Math.abs(Math.round(sKgDiff)).toLocaleString('en-IN')}\\\` : \\\`▲ +₹\\\${Math.round(sKgDiff).toLocaleString('en-IN')}\\\`;
            document.getElementById('cardSilverKgChg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${sKgDiffStr}</span>
                    <span>\\\${sPctStr}</span>
                </span>
                <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs \\\${inr.format((prev.sv || 0) * 100)}</span>
            \\\`;
        }`;

const newRenderTopCards = `        // Render Top 4 KPI Cards
        function renderTopCards() {
            if (!DATA.length) return;
            const last = DATA[DATA.length - 1];
            const prev = DATA[DATA.length - 2] || {};

            // Dynamic header date
            const headerTs = document.getElementById('headerTimestamp');
            if (headerTs && last.d) {
                const parts = last.d.split('-');
                const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                const dFormatted = \\\`\\\${parseInt(parts[2], 10)}-\\\${monthNames[parseInt(parts[1], 10) - 1]}-\\\${parts[0]}\\\`;
                headerTs.textContent = \\\`\\\${dFormatted} Session Verified\\\`;
            }

            // 1. Gold 24K
            document.getElementById('cardGoldPrice').textContent = inr.format(last.g);
            const gDiffStr = last.gDiff < 0 ? \\\`▼ -₹\\\${Math.abs(Math.round(last.gDiff)).toLocaleString('en-IN')}\\\` : \\\`▲ +₹\\\${Math.round(last.gDiff).toLocaleString('en-IN')}\\\`;
            const gPctStr = \\\`(\\\${last.gChg >= 0 ? '+' : ''}\\\${last.gChg.toFixed(2)}%)\\\`;
            const gColorClass = last.gDiff < 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
            document.getElementById('cardGoldChg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded \\\${gColorClass} font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${gDiffStr}</span>
                    <span>\\\${gPctStr}</span>
                </span>
                <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs \\\${inr.format(prev.g || 0)}</span>
            \\\`;

            // 2. Gold 22K (916 Jewellery Standard)
            document.getElementById('cardGold22Price').textContent = inr.format(last.g22);
            const g22DiffStr = last.g22Diff < 0 ? \\\`▼ -₹\\\${Math.abs(Math.round(last.g22Diff)).toLocaleString('en-IN')}\\\` : \\\`▲ +₹\\\${Math.round(last.g22Diff).toLocaleString('en-IN')}\\\`;
            const g22PctStr = \\\`(\\\${last.g22Chg >= 0 ? '+' : ''}\\\${last.g22Chg.toFixed(2)}%)\\\`;
            const g22ColorClass = last.g22Diff < 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
            document.getElementById('cardGold22Chg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded \\\${g22ColorClass} font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${g22DiffStr}</span>
                    <span>\\\${g22PctStr}</span>
                </span>
                <span class="text-[10px] text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">Retail Jewellery</span>
            \\\`;

            // 3. Silver 10g
            document.getElementById('cardSilverPrice').textContent = inr2.format(last.sv);
            const sDiffStr = last.sDiff < 0 ? \\\`▼ -₹\\\${Math.abs(last.sDiff).toFixed(2)}\\\` : \\\`▲ +₹\\\${last.sDiff.toFixed(2)}\\\`;
            const sPctStr = \\\`(\\\${last.sChg >= 0 ? '+' : ''}\\\${last.sChg.toFixed(2)}%)\\\`;
            const sColorClass = last.sDiff < 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
            document.getElementById('cardSilverChg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded \\\${sColorClass} font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${sDiffStr}</span>
                    <span>\\\${sPctStr}</span>
                </span>
                <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs \\\${inr2.format(prev.sv || 0)}</span>
            \\\`;

            // 4. Silver 1kg
            document.getElementById('cardSilverKgPrice').textContent = inr.format(last.sv * 100);
            const sKgDiff = last.sDiff * 100;
            const sKgDiffStr = sKgDiff < 0 ? \\\`▼ -₹\\\${Math.abs(Math.round(sKgDiff)).toLocaleString('en-IN')}\\\` : \\\`▲ +₹\\\${Math.round(sKgDiff).toLocaleString('en-IN')}\\\`;
            const sKgColorClass = sKgDiff < 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
            document.getElementById('cardSilverKgChg').innerHTML = \\\`
                <span class="px-2 py-0.5 rounded \\\${sKgColorClass} font-bold whitespace-nowrap flex items-center gap-1">
                    <span>\\\${sKgDiffStr}</span>
                    <span>\\\${sPctStr}</span>
                </span>
                <span class="text-[10px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">vs \\\${inr.format((prev.sv || 0) * 100)}</span>
            \\\`;
        }`;

if (termCode.includes(oldRenderTopCards)) {
  termCode = termCode.replace(oldRenderTopCards, newRenderTopCards);
  console.log('Replaced renderTopCards successfully');
} else {
  console.log('Warning: oldRenderTopCards not found in generate_terminal.js');
}

// 5. Update fetchSheetData to save to localStorage and show clear indicators
const oldFetchSheetData = `        async function fetchSheetData(isManual = false) {
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
        }`;

const newFetchSheetData = `        async function fetchSheetData(isManual = false) {
            const icon = document.getElementById('syncIcon');
            if (icon) icon.classList.add('animate-spin');
            const syncStatus = document.getElementById('headerSyncStatus');
            if (syncStatus) {
                syncStatus.textContent = isManual ? 'SYNCING SHEET...' : 'CHECKING LIVE...';
                syncStatus.className = 'text-xs font-mono font-bold text-amber-500 animate-pulse';
            }

            try {
                const fetchUrl = isManual ? (APPS_SCRIPT_URL + '?limit=100&refresh=1') : (APPS_SCRIPT_URL + '?limit=100');
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
                            const sortedList = Object.values(byDate).sort((a, b) => a.d.localeCompare(b.d));
                            try {
                                localStorage.setItem('AURA_BULLION_DATA_CACHE', JSON.stringify(sortedList));
                            } catch (e) {}

                            window.DATA = DATA = enrichRows(sortedList);
                            renderTopCards();
                            render52WeekStats();
                            renderAuditTable();
                            renderSingleChart();

                            if (syncStatus) {
                                syncStatus.textContent = 'LIVE SHEET SYNCED';
                                syncStatus.className = 'text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400';
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('Using verified snapshot.', err);
                if (syncStatus) {
                    syncStatus.textContent = 'USING LOCAL SNAPSHOT';
                    syncStatus.className = 'text-xs font-mono font-bold text-slate-500';
                }
            } finally {
                if (icon) icon.classList.remove('animate-spin');
            }
        }`;

if (termCode.includes(oldFetchSheetData)) {
  termCode = termCode.replace(oldFetchSheetData, newFetchSheetData);
  console.log('Replaced fetchSheetData successfully');
} else {
  console.log('Warning: oldFetchSheetData not found in generate_terminal.js');
}

fs.writeFileSync('generate_terminal.js', termCode, 'utf8');
console.log('Updated generate_terminal.js successfully!');
