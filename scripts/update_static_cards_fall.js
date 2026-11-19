const fs = require('fs');

let term = fs.readFileSync('generate_terminal.js', 'utf8');

// Replace cardGoldChg static HTML:
term = term.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGoldChg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹5,789</span>\n                            <span>(+4.68%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGoldChg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹1,633</span>\n                            <span>(-1.25%)</span>\n                        </span>\n                    </div>`
);

// Replace cardGold22Chg static HTML:
term = term.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGold22Chg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹5,307</span>\n                            <span>(+4.68%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardGold22Chg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹1,497</span>\n                            <span>(-1.25%)</span>\n                        </span>\n                    </div>`
);

// Replace cardSilverChg static HTML:
term = term.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverChg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹123.49</span>\n                            <span>(+8.34%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverChg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹32.94</span>\n                            <span>(-2.01%)</span>\n                        </span>\n                    </div>`
);

// Replace cardSilverKgChg static HTML:
term = term.replace(
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverKgChg">\n                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▲ +₹12,349</span>\n                            <span>(+8.34%)</span>\n                        </span>\n                    </div>`,
  `<div class="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs font-mono" id="cardSilverKgChg">\n                        <span class="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap flex items-center gap-0.5">\n                            <span>▼ -₹3,294</span>\n                            <span>(-2.01%)</span>\n                        </span>\n                    </div>`
);

fs.writeFileSync('generate_terminal.js', term, 'utf8');
console.log('generate_terminal.js cards updated to reflect true IBJA fall!');
