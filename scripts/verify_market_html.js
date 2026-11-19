const fs = require('fs');
const market = fs.readFileSync('market.html', 'utf8');

const snapIdx = market.indexOf('const SNAPSHOT =');
const snapEnd = market.indexOf(';', snapIdx);
const snapStr = market.substring(snapIdx + 17, snapEnd);
const snap = JSON.parse(snapStr);
console.log('SNAPSHOT total entries:', snap.length);
console.log('SNAPSHOT last entry:', JSON.stringify(snap[snap.length - 1], null, 2));

const tsMatch = market.match(/id="headerTimestamp">([^<]+)<\/span>/);
console.log('Header timestamp:', tsMatch ? tsMatch[1] : 'NOT FOUND');

const gMatch = market.match(/id="cardGoldPrice">\s*([^<\s]+)/);
console.log('Card Gold:', gMatch ? gMatch[1] : 'NOT FOUND');

const svMatch = market.match(/id="cardSilverPrice">\s*([^<\s]+)/);
console.log('Card Silver:', svMatch ? svMatch[1] : 'NOT FOUND');

const cacheIdx = market.indexOf('AURA_BULLION_DATA_CACHE');
console.log('LocalStorage Cache implemented?', cacheIdx !== -1);
