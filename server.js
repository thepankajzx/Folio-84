const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
    if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
        filePath += '.html';
    }
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error: ' + err.code);
            }
        } else {
            const headers = { 'Content-Type': contentType };
            if (extname === '.html') {
                headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0';
                headers['Pragma'] = 'no-cache';
                headers['Expires'] = '0';
            }
            res.writeHead(200, headers);
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
