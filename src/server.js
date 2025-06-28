import http from 'node:http';
import { serverConfig } from './config.js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const server = http.createServer(async (req, res) => {
  console.log(`So‘rov: ${req.method} ${req.url}`);

  if (req.method.toUpperCase() !== 'GET') {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 405;
    return res.end('Faqat GET so‘rovlari qabul qilinadi');
  }

  try {
    let url = req.url.trim().toLowerCase();
    let filePath = path.join(process.cwd(), 'image', url === '/' ? 'index.html' : url);
    let file = await readFile(filePath);

    let contentType = 'text/plain';
    if (filePath.endsWith('.html')) contentType = 'text/html';
    else if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (filePath.endsWith('.css')) contentType = 'text/css';
    else if (filePath.endsWith('.js')) contentType = 'application/javascript';

    res.setHeader('Content-Type', contentType);
    res.statusCode = 200;
    return res.end(file);
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = err.code === 'ENOENT' ? 404 : 500;
    return res.end(err.code === 'ENOENT' ? 'Fayl topilmadi' : 'Server xatosi: ' + err.message);
  }
});

const { PORT = 8000 } = serverConfig;
server.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
  import('open').then(({ default: open }) => {
    open(`http://localhost:${PORT}`);
  }).catch(err => console.error('Brauzerni ochishda xato:', err));
});