const { spawn } = require('child_process');
const http = require('http');

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

async function test() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9311',
    'https://folio-84-prod.web.app/market'
  ]);
  await sleep(3500);
  const list = await getJson('http://127.0.0.1:9311/json');
  const target = list.find(t => t.url.includes('folio-84-prod.web.app'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((res) => {
      const id = Math.floor(Math.random() * 1e6);
      const onm = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) { ws.removeEventListener('message', onm); res(m); }
      };
      ws.addEventListener('message', onm);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sleep(2500);
  const r1 = await send('Runtime.evaluate', { expression: 'typeof setComparisonMode' });
  console.log('typeof setComparisonMode:', JSON.stringify(r1));

  const r2 = await send('Runtime.evaluate', { expression: "setComparisonMode('single'); tmComparisonMode;" });
  console.log('after setComparisonMode:', JSON.stringify(r2));

  const r3 = await send('Runtime.evaluate', { expression: "document.getElementById('tmAssetPillsContainer').innerHTML.substring(0, 150)" });
  console.log('asset pills html:', JSON.stringify(r3));

  ws.close();
  edge.kill();
  process.exit(0);
}
test();
