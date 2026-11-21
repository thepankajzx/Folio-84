const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

async function capture() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9346',
    'https://folio-84-prod.web.app/market'
  ]);
  
  await sleep(4000);
  const list = await getJson('http://127.0.0.1:9346/json');
  const target = list.find(t => t.url && t.url.includes('folio-84-prod.web.app'));
  if (!target) {
    console.error('Target tab not found:', list);
    process.exit(1);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((res) => {
      const id = Math.floor(Math.random() * 1e6);
      const onm = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) { ws.removeEventListener('message', onm); res(m.result); }
      };
      ws.addEventListener('message', onm);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1.5,
    mobile: false
  });

  await sleep(2500);

  const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0daa185f-7551-4331-a3d1-5b9c4770ac3c';

  // 1. Expand Time Machine
  await send('Runtime.evaluate', { expression: 'if (!window.IS_TM_EXPANDED) toggleTimeMachineSection();' });
  await sleep(1500);

  // 2. Select Single Commodity Mode and Gold 22K
  await send('Runtime.evaluate', { expression: "setComparisonMode('single'); setSingleAsset('g22');" });
  await sleep(1500);

  // Scroll to Cards Grid
  await send('Runtime.evaluate', {
    expression: "document.getElementById('timeMachineSection').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  // Capture 22K Milestones (replacing the previous N/A screenshot!)
  let shot22KCards = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_gold_22k_milestones_no_na.png'), Buffer.from(shot22KCards.data, 'base64'));
  console.log('Saved verified_gold_22k_milestones_no_na.png');

  // 3. Scroll to Visual Charts Stage (Growth Curve for 22K)
  await send('Runtime.evaluate', {
    expression: "document.getElementById('tmHighlightStrip').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  let shot22KCurve = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_gold_22k_curve.png'), Buffer.from(shot22KCurve.data, 'base64'));
  console.log('Saved verified_gold_22k_curve.png');

  // 4. Switch to Dual Mode: Gold 24K vs Gold 22K
  await send('Runtime.evaluate', { expression: "setComparisonMode('dual'); setDualPair('g-g22', 'g', 'g22');" });
  await sleep(1500);

  await send('Runtime.evaluate', {
    expression: "document.getElementById('timeMachineSection').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  let shotDual24v22Cards = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_dual_gold24_vs_gold22_cards.png'), Buffer.from(shotDual24v22Cards.data, 'base64'));
  console.log('Saved verified_dual_gold24_vs_gold22_cards.png');

  // 5. Dual Growth Curve (Gold 24K vs Gold 22K)
  await send('Runtime.evaluate', {
    expression: "document.getElementById('tmHighlightStrip').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  let shotDual24v22Curve = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_dual_gold24_vs_gold22_curve.png'), Buffer.from(shotDual24v22Curve.data, 'base64'));
  console.log('Saved verified_dual_gold24_vs_gold22_curve.png');

  try { ws.close(); } catch(e){}
  try { edge.kill(); } catch(e){}
  console.log('All 22K verification captures completed successfully!');
  process.exit(0);
}

capture();
