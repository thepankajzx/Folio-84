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

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let contentType = 'text/html';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.css')) contentType = 'text/css';
    if (filePath.endsWith('.png')) contentType = 'image/png';
    if (filePath.endsWith('.webp')) contentType = 'image/webp';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8099, async () => {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9348',
    'http://localhost:8099'
  ]);

  await sleep(4000);
  const list = await getJson('http://127.0.0.1:9348/json');
  const target = list.find(t => t.url && t.url.includes('8099'));
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

  await sleep(2000);

  // Close notice modal if present
  await send('Runtime.evaluate', {
    expression: `
      const notice = document.getElementById('desktop-view-notice');
      if (notice) notice.remove();
    `
  });
  await sleep(1000);

  // Scroll to section 02 (#design)
  await send('Runtime.evaluate', {
    expression: "document.getElementById('design').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await sleep(1500);

  const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0daa185f-7551-4331-a3d1-5b9c4770ac3c';
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(brainDir, 'verified_index_no_living_engine.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved verified_index_no_living_engine.png');

  try { ws.close(); } catch(e){}
  try { edge.kill(); } catch(e){}
  server.close();
  process.exit(0);
});
