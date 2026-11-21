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
    '--remote-debugging-port=9266',
    'https://folio-84-prod.web.app/market'
  ]);
  
  await sleep(3500);
  const list = await getJson('http://127.0.0.1:9266/json');
  const target = list.find(t => t.type === 'page');
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

  // 1. Expand Time Machine
  await send('Runtime.evaluate', { expression: `toggleTimeMachineSection();` });
  await sleep(1500);

  const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0daa185f-7551-4331-a3d1-5b9c4770ac3c';

  // Screenshot 1: Dual Line Growth Curve (Gold vs Silver) across full width
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('tmHighlightStrip');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await sleep(1500);
  let shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_dual_line_comparison.png'), Buffer.from(shot1.data, 'base64'));
  console.log('Saved verified_dual_line_comparison.png');

  // Screenshot 2: Bar Compare (Grouped Bars for Gold & Silver)
  await send('Runtime.evaluate', { expression: `setTimeMachineView('bar');` });
  await sleep(1200);
  let shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_bar_compare_grouped.png'), Buffer.from(shot2.data, 'base64'));
  console.log('Saved verified_bar_compare_grouped.png');

  // Screenshot 3: Header Controls & Checkpoint Cards Grid
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('timeMachineSection');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await sleep(1200);
  let shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_tm_controls_and_cards.png'), Buffer.from(shot3.data, 'base64'));
  console.log('Saved verified_tm_controls_and_cards.png');

  try { ws.close(); } catch(e){}
  try { edge.kill(); } catch(e){}
  process.exit(0);
}

capture();
