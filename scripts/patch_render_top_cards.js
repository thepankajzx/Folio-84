const fs = require('fs');

let term = fs.readFileSync('generate_terminal.js', 'utf8');

const startIdx = term.indexOf('function renderTopCards() {');
const endIdx = term.indexOf('// Render 52-Week Benchmark & Macro Stats');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `function renderTopCards() {
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
        }

        `;
  term = term.substring(0, startIdx) + replacement + term.substring(endIdx);
  fs.writeFileSync('generate_terminal.js', term, 'utf8');
  console.log('Successfully replaced renderTopCards in generate_terminal.js');
} else {
  console.error('Could not find start or end index');
}
