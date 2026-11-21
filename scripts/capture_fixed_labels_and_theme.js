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
    '--remote-debugging-port=9344',
    'https://folio-84-prod.web.app/market'
  ]);
  
  await sleep(4000);
  const list = await getJson('http://127.0.0.1:9344/json');
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
    height: 1000,
    deviceScaleFactor: 1.5,
    mobile: false
  });

  await sleep(2500);

  const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0daa185f-7551-4331-a3d1-5b9c4770ac3c';

  // 1. Capture Header Navbar without Settings Button
  let shotNav = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_navbar_no_settings.png'), Buffer.from(shotNav.data, 'base64'));
  console.log('Saved verified_navbar_no_settings.png');

  // 2. Expand Time Machine
  await send('Runtime.evaluate', { expression: 'if (!window.IS_TM_EXPANDED) toggleTimeMachineSection();' });
  await sleep(1500);

  // 3. Switch to Bar Compare view and scroll to it
  await send('Runtime.evaluate', { expression: "setTimeMachineView('bar');" });
  await sleep(1000);
  await send('Runtime.evaluate', {
    expression: "document.getElementById('tmHighlightStrip').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1500);

  let shotBarDark = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_fixed_bar_compare_dark.png'), Buffer.from(shotBarDark.data, 'base64'));
  console.log('Saved verified_fixed_bar_compare_dark.png');

  // 4. Switch to Day (Light) Theme and capture Bar Compare
  await send('Runtime.evaluate', { expression: 'toggleTheme();' });
  await sleep(1500);

  let shotBarLight = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_fixed_bar_compare_day_theme.png'), Buffer.from(shotBarLight.data, 'base64'));
  console.log('Saved verified_fixed_bar_compare_day_theme.png');

  // 5. Switch to Growth Curve in Day Theme
  await send('Runtime.evaluate', { expression: "setTimeMachineView('curve');" });
  await sleep(1500);

  let shotCurveLight = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_fixed_curve_day_theme.png'), Buffer.from(shotCurveLight.data, 'base64'));
  console.log('Saved verified_fixed_curve_day_theme.png');

  try { ws.close(); } catch(e){}
  try { edge.kill(); } catch(e){}
  process.exit(0);
}

capture();
