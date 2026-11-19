const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testLiveProduction() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9257',
    '--no-first-run',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9257/json', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      const targets = JSON.parse(d);
      const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
      await new Promise(r => ws.onopen = r);

      function send(method, params = {}) {
        return new Promise(resolve => {
          const id = Math.floor(Math.random() * 1e6);
          const onm = (e) => {
            const m = JSON.parse(e.data);
            if (m.id === id) {
              ws.removeEventListener('message', onm);
              resolve(m.result);
            }
          };
          ws.addEventListener('message', onm);
          ws.send(JSON.stringify({ id, method, params }));
        });
      }

      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });

      console.log('Navigating to live production: https://folio-84-prod.web.app/market.html');
      await send('Page.navigate', { url: 'https://folio-84-prod.web.app/market.html?v=' + Date.now() });
      await new Promise(r => setTimeout(r, 3500));

      const evalRes = await send('Runtime.evaluate', {
        expression: `({
          headerTimestamp: document.getElementById('headerTimestamp')?.textContent.trim(),
          headerSyncStatus: document.getElementById('headerSyncStatus')?.textContent.trim(),
          cardGoldPrice: document.getElementById('cardGoldPrice')?.textContent.trim(),
          cardGoldChg: document.getElementById('cardGoldChg')?.textContent.trim().replace(/\\s+/g, ' '),
          cardGold22Price: document.getElementById('cardGold22Price')?.textContent.trim(),
          cardGold22Chg: document.getElementById('cardGold22Chg')?.textContent.trim().replace(/\\s+/g, ' '),
          cardSilverPrice: document.getElementById('cardSilverPrice')?.textContent.trim(),
          cardSilverChg: document.getElementById('cardSilverChg')?.textContent.trim().replace(/\\s+/g, ' '),
          dataLength: window.DATA?.length,
          lastDataRow: window.DATA?.[window.DATA.length - 1]
        })`,
        returnByValue: true
      });

      console.log('LIVE PRODUCTION DOM RESULT:', JSON.stringify(evalRes.result.value, null, 2));

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const artifactPath = path.join('C:\\Users\\user\\.gemini\\antigravity\\brain\\0daa185f-7551-4331-a3d1-5b9c4770ac3c', 'live_prod_market_verified.png');
      fs.writeFileSync(artifactPath, Buffer.from(shot.data, 'base64'));
      console.log('Live production screenshot saved to:', artifactPath);

      try { ws.close(); } catch(e){}
      try { chrome.kill(); } catch(e){}
      process.exit(0);
    });
  });
}
testLiveProduction();
