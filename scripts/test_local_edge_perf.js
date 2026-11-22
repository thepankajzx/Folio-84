const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8099;
const DEBUG_PORT = 9247;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Simple static HTTP server for accurate testing
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join('g:\\Folio-84', reqPath.replace(/\//g, path.sep));

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

async function runLocalEdgeBenchmark() {
  await new Promise(r => server.listen(PORT, r));
  console.log(`Local test server running at http://localhost:${PORT}`);

  console.log('\n=== RUNNING EDGE DESKTOP HARDWARE ACCELERATED BENCHMARK ===');
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--window-size=1920,1080'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  const httpGet = (url) => new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  try {
    const targets = await httpGet(`http://localhost:${DEBUG_PORT}/json`);
    const target = targets.find(t => t.type === 'page') || targets[0];

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(parsed.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    const consoleLogs = [];
    const errors = [];
    ws.addEventListener('message', (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.method === 'Runtime.consoleAPICalled') {
        const text = parsed.params.args.map(a => a.value || a.description).join(' ');
        consoleLogs.push(`[CONSOLE ${parsed.params.type}] ${text}`);
      }
      if (parsed.method === 'Runtime.exceptionThrown') {
        errors.push(`[EXCEPTION] ${parsed.params.exceptionDetails.text} ${parsed.params.exceptionDetails.exception.description}`);
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Performance.enable');

    const navStart = Date.now();
    await send('Page.navigate', { url: `http://localhost:${PORT}/index.html` });
    await new Promise(r => setTimeout(r, 4500));
    const navDuration = Date.now() - navStart;

    const metrics = await send('Performance.getMetrics');
    const metricMap = {};
    metrics.metrics.forEach(m => metricMap[m.name] = m.value);

    const diag = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          hasThree: typeof window.THREE !== 'undefined',
          hasDovaCanvas: !!document.getElementById('dova-canvas'),
          hasSvgAvatar: !!document.querySelector('.dova-svg-bot'),
          cursorTrailCanvas: !!document.getElementById('cursor-symbol-canvas'),
          capsTabs: !!document.getElementById('caps-track-tab-ai'),
          errors: window.__errors || []
        };
      })()`,
      returnByValue: true
    });

    console.log('DOM & Graphics Diagnostics:', diag.result.value);
    console.log('Navigation & Hydration Duration:', navDuration, 'ms');
    console.log('Script Duration:', (metricMap.ScriptDuration * 1000).toFixed(1), 'ms');
    console.log('Layout Duration:', (metricMap.LayoutDuration * 1000).toFixed(1), 'ms');
    console.log('Task Duration:', (metricMap.TaskDuration * 1000).toFixed(1), 'ms');
    console.log('JS Heap Used Size:', (metricMap.JSHeapUsedSize / (1024 * 1024)).toFixed(2), 'MB');
    console.log('Total Console Logs:', consoleLogs.length);
    consoleLogs.forEach(l => console.log(' ', l));
    console.log('Total Exceptions:', errors.length);
    errors.forEach(e => console.error(' ', e));

    ws.close();
    edge.kill();

    // Now test with software rendering
    console.log('\n=== RUNNING EDGE SOFTWARE FALLBACK BENCHMARK (--disable-gpu --disable-gpu-compositing) ===');
    const DEBUG_PORT_SW = 9248;
    const edgeSw = spawn(edgePath, [
      '--headless=new',
      `--remote-debugging-port=${DEBUG_PORT_SW}`,
      '--window-size=1920,1080',
      '--disable-gpu',
      '--disable-gpu-compositing'
    ]);

    await new Promise(r => setTimeout(r, 2200));
    const swTargets = await httpGet(`http://localhost:${DEBUG_PORT_SW}/json`);
    const swTarget = swTargets.find(t => t.type === 'page') || swTargets[0];
    const swWs = new WebSocket(swTarget.webSocketDebuggerUrl);
    await new Promise(r => swWs.onopen = r);

    let swId = 1;
    const swSend = (method, params = {}) => new Promise((resolve) => {
      const msgId = swId++;
      const handler = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === msgId) {
          swWs.removeEventListener('message', handler);
          resolve(parsed.result);
        }
      };
      swWs.addEventListener('message', handler);
      swWs.send(JSON.stringify({ id: msgId, method, params }));
    });

    await swSend('Page.enable');
    await swSend('Runtime.enable');
    await swSend('Performance.enable');

    await swSend('Page.navigate', { url: `http://localhost:${PORT}/index.html` });
    await new Promise(r => setTimeout(r, 4500));

    const swMetrics = await swSend('Performance.getMetrics');
    const swMetricMap = {};
    swMetrics.metrics.forEach(m => swMetricMap[m.name] = m.value);

    const swDiag = await swSend('Runtime.evaluate', {
      expression: `(() => {
        return {
          hasSvgAvatar: !!document.querySelector('.dova-svg-bot'),
          hasDovaCanvas: !!document.getElementById('dova-canvas'),
          hasThree: typeof window.THREE !== 'undefined'
        };
      })()`,
      returnByValue: true
    });

    console.log('Software Fallback Diagnostic:', swDiag.result.value);
    console.log('Software Script Duration:', (swMetricMap.ScriptDuration * 1000).toFixed(1), 'ms');
    console.log('Software Layout Duration:', (swMetricMap.LayoutDuration * 1000).toFixed(1), 'ms');
    console.log('Software Task Duration:', (swMetricMap.TaskDuration * 1000).toFixed(1), 'ms');

    swWs.close();
    edgeSw.kill();
    server.close();
    process.exit(0);
  } catch(e) {
    console.error('Benchmark failed:', e);
    try { edge.kill(); } catch(x){}
    server.close();
    process.exit(1);
  }
}

runLocalEdgeBenchmark();
