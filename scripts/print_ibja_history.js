const fs = require('fs');
const html = fs.readFileSync('scratch/ibja_dump.html', 'utf8');

function getJson(name) {
  const idx = html.indexOf(`name="${name}"`);
  const valIdx = html.indexOf('value="', idx);
  const valEnd = html.indexOf('"', valIdx + 7);
  return JSON.parse(html.substring(valIdx + 7, valEnd).replace(/&quot;/g, '"'));
}

const gold = getJson('HdnGold');
const silver = getJson('HdnSilver');

console.log('--- RECENT IBJA CLOSING SESSIONS ---');
const n = 10;
const goldRecent = gold.labels.slice(-n);
for (let i = 0; i < goldRecent.length; i++) {
  const label = gold.labels[gold.labels.length - n + i];
  const g999 = gold.purity999[gold.purity999.length - n + i];
  const g916 = gold.purity916[gold.purity916.length - n + i];
  const sRate = silver.silverRate[silver.silverRate.length - n + i];
  
  let gChg = '';
  let sChg = '';
  if (i > 0) {
    const prevG = gold.purity999[gold.purity999.length - n + i - 1];
    const prevS = silver.silverRate[silver.silverRate.length - n + i - 1];
    const diffG = g999 - prevG;
    const diffS = sRate - prevS;
    gChg = `${diffG >= 0 ? '+' : ''}${diffG} (${((diffG/prevG)*100).toFixed(2)}%)`;
    sChg = `${diffS >= 0 ? '+' : ''}${diffS} (${((diffS/prevS)*100).toFixed(2)}%)`;
  }
  console.log(`${label} | Gold 999: ₹${g999} [${gChg || 'BASE'}] | Gold 916: ₹${g916} | Silver: ₹${sRate}/kg [${sChg || 'BASE'}]`);
}
