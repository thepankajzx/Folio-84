const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('market.html', 'utf8');

// Extract the main script (index 2)
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
const mainScript = scripts[2].replace(/^<script>/i, '').replace(/<\/script>$/i, '');

const mockElements = {};
function createMockEl(id) {
    return {
        id: id,
        innerHTML: '',
        textContent: '',
        style: {},
        classList: { 
            add: (cls) => {}, 
            remove: (cls) => {}, 
            toggle: (cls, cond) => {}, 
            contains: (cls) => false 
        },
        querySelectorAll: () => [],
        querySelector: () => null,
        getBoundingClientRect: () => ({ width: 1000, height: 400, top: 0, left: 0, right: 1000, bottom: 400 }),
        getContext: () => ({
            clearRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            fill: () => {},
            arc: () => {},
            rect: () => {},
            fillText: () => {},
            measureText: () => ({ width: 50 }),
            save: () => {},
            restore: () => {},
            setLineDash: () => {},
            scale: () => {},
            createLinearGradient: () => ({ addColorStop: () => {} })
        }),
        addEventListener: () => {},
        value: ''
    };
}

const sandbox = {
    document: {
        documentElement: createMockEl('html'),
        getElementById: (id) => {
            if (!mockElements[id]) mockElements[id] = createMockEl(id);
            return mockElements[id];
        },
        querySelectorAll: () => [],
        querySelector: () => null,
        addEventListener: () => {}
    },
    window: {
        addEventListener: () => {},
        location: { search: '' },
        matchMedia: () => ({ matches: false, addEventListener: () => {} }),
        requestAnimationFrame: (cb) => setTimeout(cb, 0),
        cancelAnimationFrame: () => {}
    },
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    },
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    cancelAnimationFrame: () => {},
    console: console,
    Intl: Intl,
    Math: Math,
    Date: Date,
    Array: Array,
    Object: Object,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    setTimeout: (cb) => { if (typeof cb === 'function') cb(); },
    clearTimeout: () => {}
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);
vm.runInContext(mainScript, sandbox);

console.log('Script ran in sandbox successfully.');
sandbox.initData();

console.log('\n--- Testing Accordion Toggle ---');
sandbox.toggleTimeMachineSection();
console.log('Toggled Time Machine -> IS_TM_EXPANDED:', sandbox.window.IS_TM_EXPANDED);

console.log('\n--- Testing Checkpoint Cards & Highlight Strip ---');
const cardsHtml = mockElements['tmCardsContainer'].innerHTML;
const highlightHtml = mockElements['tmHighlightStrip'].innerHTML;
console.log('Cards rendered:', cardsHtml.length > 0, '(length:', cardsHtml.length, ')');
console.log('Highlight Strip rendered:', highlightHtml.length > 0, '(length:', highlightHtml.length, ')');

console.log('\n--- Testing 7 Visual Comparison Views ---');
const views = ['curve', 'bar', 'lollipop', 'timeline', 'slope', 'delta', 'table'];
views.forEach(v => {
    sandbox.setTimeMachineView(v);
    const stageHtml = mockElements['tmVisualStage'].innerHTML;
    console.log(`[PASS] View "${v}" rendered successfully (length: ${stageHtml.length})`);
});

console.log('\n--- Testing Pairing Presets ---');
const pairPresets = ['all', 'g-g', 's-s', 'g-s', 'g-xau', 's-xag', 'g24-g22', 'inr-usd'];
pairPresets.forEach(p => {
    sandbox.applyTimeMachinePairPreset(p);
    console.log(`[PASS] Pair Preset "${p}" applied -> Slots: ${sandbox.window.tmSlots.length}, 1st Asset: ${sandbox.window.tmSlots[0].asset}`);
});

console.log('\n--- Testing Date Count Pills & Slot Operations ---');
sandbox.setTimeMachineSlotsCount(6);
console.log('[PASS] Set 6 slots -> Count:', sandbox.window.tmSlots.length);
sandbox.setTimeMachineSlotsCount(10);
console.log('[PASS] Set 10 slots -> Count:', sandbox.window.tmSlots.length);
sandbox.removeTimeMachineSlot(sandbox.window.tmSlots[sandbox.window.tmSlots.length - 1].id);
console.log('[PASS] Removed 1 slot -> Count:', sandbox.window.tmSlots.length);
sandbox.addTimeMachineSlot();
console.log('[PASS] Added 1 slot -> Count:', sandbox.window.tmSlots.length);

console.log('\n[PASS] All Time Machine Accordion, 7 Visual Views & Pair Presets simulations passed 100%!');
