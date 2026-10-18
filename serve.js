#!/usr/bin/env node
// Servidor estático local para desenvolvimento.
// Em produção os sites são hospedados no GitHub Pages; este script só serve localmente.
//
// Uso:
//   node serve.js             -> serve websites/index.html e todas as subpastas em http://localhost:3000
//   PORT=8080 node serve.js   -> muda a porta

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function serveFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  // Impede sair da pasta raiz (ex.: /../../etc/passwd)
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      // Igual ao GitHub Pages: pasta sem barra final redireciona
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' + url.search });
        return res.end();
      }
      const index = path.join(filePath, 'index.html');
      return fs.access(index, (e) =>
        e ? send(res, 404, 'Not found') : serveFile(req, res, index)
      );
    }

    if (!err && stat.isFile()) return serveFile(req, res, filePath);

    // Tenta "/pagina" -> "/pagina.html" (GitHub Pages também faz isso)
    const htmlPath = filePath + '.html';
    fs.access(htmlPath, (e) => {
      if (!e) return serveFile(req, res, htmlPath);
      // 404.html customizado, se existir
      const notFound = path.join(ROOT, '404.html');
      fs.readFile(notFound, (e2, data) =>
        e2 ? send(res, 404, 'Not found') : send(res, 404, data, MIME['.html'])
      );
    });
  });
});

server.listen(PORT, () => {
  console.log(`Servindo ${ROOT}`);
  console.log(`http://localhost:${PORT}/`);
});
