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

async function run() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9299',
    'https://folio-84-prod.web.app/market'
  ]);
  await sleep(4000);
  const list = await getJson('http://127.0.0.1:9299/json');
  const target = list.find(t => t.url && t.url.includes('folio-84-prod.web.app'));
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
    height: 1100,
    deviceScaleFactor: 1.5,
    mobile: false
  });
  await sleep(3000);

  // Ensure expanded
  await send('Runtime.evaluate', {
    expression: `
      if (!window.IS_TM_EXPANDED) {
        toggleTimeMachineSection();
      }
      const sec = document.getElementById('timeMachineSection');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await sleep(2000);

  const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0daa185f-7551-4331-a3d1-5b9c4770ac3c';
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_tm_top_controls.png'), Buffer.from(shot1.data, 'base64'));
  console.log('Saved verified_tm_top_controls.png');

  // Switch to single mode
  await send('Runtime.evaluate', {
    expression: `
      setComparisonMode('single');
      const sec = document.getElementById('timeMachineSection');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await sleep(1500);
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_single_commodity_mode.png'), Buffer.from(shot2.data, 'base64'));
  console.log('Saved verified_single_commodity_mode.png');

  try { ws.close(); } catch(e){}
  try { edge.kill(); } catch(e){}
  process.exit(0);
}
run();
