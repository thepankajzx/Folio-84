const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('data-snapshot.json', 'utf8'));

const TM_ASSETS = {
    g: { name: 'Gold 24K (999)', short: 'Gold 24K', unit: '₹/10g', field: 'g' },
    g22: { name: 'Gold 22K (916)', short: 'Gold 22K', unit: '₹/10g', field: 'g22' }
};

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
    return val;
}

function getSessionForDate(targetDate) {
    const exact = snap.find(r => r.d === targetDate && r.g !== null);
    if (exact) return { session: exact, isExact: true, requestedDate: targetDate };
    let prior = null;
    for (let i = snap.length - 1; i >= 0; i--) {
        const r = snap[i];
        if (r.d <= targetDate && r.g !== null) {
            prior = r;
            break;
        }
    }
    return { session: prior, isExact: false, requestedDate: targetDate };
}

const testDates = ['2026-11-20', '2021-11-20', '2016-11-21', '2011-11-21', '2008-10-24'];
console.log('--- 22K Gold Values Across All User Test Milestones ---');
testDates.forEach((d, idx) => {
    const s = getSessionForDate(d);
    const val = getAssetValueForSession(s.session, 'g22');
    console.log(`Milestone #${idx+1} (${d}): session date=${s.session.d}, 22K val=₹${val ? val.toLocaleString('en-IN') : 'N/A'}`);
});
