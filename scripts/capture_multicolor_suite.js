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
    '--remote-debugging-port=9345',
    'https://folio-84-prod.web.app/market'
  ]);
  
  await sleep(4000);
  const list = await getJson('http://127.0.0.1:9345/json');
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

  // Scroll to Time Machine Controls
  await send('Runtime.evaluate', {
    expression: "document.getElementById('timeMachineSection').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  // 2. Capture Multi-colored Dual Pair Controls & Checkpoints Grid (Dark Theme)
  let shotControlsDark = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_multicolor_dual_pairs_dark.png'), Buffer.from(shotControlsDark.data, 'base64'));
  console.log('Saved verified_multicolor_dual_pairs_dark.png');

  // 3. Scroll to Visual Charts Stage (Growth Curve - Dark Theme)
  await send('Runtime.evaluate', {
    expression: "document.getElementById('tmHighlightStrip').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  let shotCurveDark = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_multicolor_curve_dark.png'), Buffer.from(shotCurveDark.data, 'base64'));
  console.log('Saved verified_multicolor_curve_dark.png');

  // 4. Switch to Bar Compare (Dark Theme)
  await send('Runtime.evaluate', { expression: "setTimeMachineView('bar');" });
  await sleep(1000);

  let shotBarDark = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_multicolor_bar_dark.png'), Buffer.from(shotBarDark.data, 'base64'));
  console.log('Saved verified_multicolor_bar_dark.png');

  // 5. Switch to Single Commodity Mode (Silver 10g)
  await send('Runtime.evaluate', { expression: "setComparisonMode('single'); setSingleAsset('sv');" });
  await sleep(1000);
  await send('Runtime.evaluate', {
    expression: "document.getElementById('timeMachineSection').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  let shotSingleDark = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_multicolor_single_mode_dark.png'), Buffer.from(shotSingleDark.data, 'base64'));
  console.log('Saved verified_multicolor_single_mode_dark.png');

  // 6. Switch to Day Theme (Light)
  await send('Runtime.evaluate', { expression: 'toggleTheme();' });
  await sleep(1500);

  let shotSingleLight = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_multicolor_single_mode_day.png'), Buffer.from(shotSingleLight.data, 'base64'));
  console.log('Saved verified_multicolor_single_mode_day.png');

  // 7. In Day Theme: Switch back to Dual Mode and view Growth Curve
  await send('Runtime.evaluate', { expression: "setComparisonMode('dual'); setDualPair('g-sv', 'g', 'sv'); setTimeMachineView('curve');" });
  await sleep(1000);
  await send('Runtime.evaluate', {
    expression: "document.getElementById('tmHighlightStrip').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1000);

  let shotCurveDay = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_multicolor_curve_day.png'), Buffer.from(shotCurveDay.data, 'base64'));
  console.log('Saved verified_multicolor_curve_day.png');

  // 8. In Day Theme: View Bar Compare
  await send('Runtime.evaluate', { expression: "setTimeMachineView('bar');" });
  await sleep(1000);

  let shotBarDay = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_multicolor_bar_day.png'), Buffer.from(shotBarDay.data, 'base64'));
  console.log('Saved verified_multicolor_bar_day.png');

  try { ws.close(); } catch(e){}
  try { edge.kill(); } catch(e){}
  console.log('All verification captures completed successfully!');
  process.exit(0);
}

capture();
