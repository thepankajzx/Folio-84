const https = require('https');
const fs = require('fs');
const { URL } = require('url');

const targetUrl = 'https://script.google.com/macros/s/AKfycbw4t4KddiEYdBtT7uigKfiAQk-a6QqiWfXizdB9CMX1zypIgOzW_KVK32OG2epncK7vKg/exec';
const rows = JSON.parse(fs.readFileSync('scripts/sheet_rows_calibrated.json', 'utf8'));

console.log('Total rows to upload into Google Sheet:', rows.length);
console.log('First row:', rows[0]);
console.log('Last row:', rows[rows.length - 1]);

function postData(urlStr, payload) {
  return new Promise((resolve, reject) => {
    const postPayload = JSON.stringify(payload);
    const u = new URL(urlStr);

    const options = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postPayload)
      }
    };

    console.log(`Sending POST to ${options.hostname}${options.path} (payload ${Math.round(postPayload.length / 1024)} KB)...`);
    const req = https.request(options, (res) => {
      console.log('POST Response status:', res.statusCode);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Following 302 redirect to:', res.headers.location.slice(0, 100));
        // Follow redirect using GET (standard Apps Script echo redirect)
        https.get(res.headers.location, (redirectRes) => {
          let data = '';
          redirectRes.on('data', chunk => data += chunk);
          redirectRes.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch(e) {
              resolve({ raw: data });
            }
          });
        }).on('error', reject);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve({ raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(postPayload);
    req.end();
  });
}

(async () => {
  try {
    const res = await postData(targetUrl, {
      action: 'bulkInsert',
      replaceAll: true,
      rows: rows
    });
    console.log('Upload result:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Upload failed:', err);
  }
})();
