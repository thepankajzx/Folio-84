const http = require('http');
function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}
const { spawn } = require('child_process');
const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9333',
  'https://folio-84-prod.web.app/market'
]);
setTimeout(async () => {
  const list = await getJson('http://127.0.0.1:9333/json');
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
  await new Promise(r => setTimeout(r, 2000));
  await send('Runtime.evaluate', { expression: 'if (!window.IS_TM_EXPANDED) toggleTimeMachineSection();' });
  await new Promise(r => setTimeout(r, 1000));
  await send('Runtime.evaluate', { expression: "setComparisonMode('single');" });
  await new Promise(r => setTimeout(r, 1000));
  await send('Runtime.evaluate', { expression: "document.getElementById('timeMachineSection').scrollIntoView({ behavior: 'instant', block: 'start' });" });
  await new Promise(r => setTimeout(r, 1000));
  const html = await send('Runtime.evaluate', { expression: "document.getElementById('tmAssetPillsContainer').innerHTML" });
  console.log('SINGLE MODE PILLS:', JSON.stringify(html));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = require('fs');
  const path = require('path');
  const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0daa185f-7551-4331-a3d1-5b9c4770ac3c';
  fs.writeFileSync(path.join(brainDir, 'verified_single_commodity_mode_clean.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved verified_single_commodity_mode_clean.png');

  ws.close();
  edge.kill();
  process.exit(0);
}, 3000);
