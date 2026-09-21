const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const selfsigned = require('selfsigned');
const compression = require('compression');

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

app.use(compression());

// Servir la build estática de Vite PWA
const DIST_DIR = path.join(__dirname, 'dist');
app.use(express.static(DIST_DIR, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('sw.js') || filePath.endsWith('manifest.webmanifest') || filePath.endsWith('manifest.json')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Fallback SPA compatible con Express 5
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

async function start() {
  try {
    const certDir = path.join(__dirname, '.certs');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    const certPath = path.join(certDir, 'cert.pem');
    const keyPath = path.join(certDir, 'key.pem');

    let key, cert;
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      key = fs.readFileSync(keyPath, 'utf8');
      cert = fs.readFileSync(certPath, 'utf8');
    } else {
      console.log('[GorilApp] Generando certificado SSL para PWA móvil...');
      const pems = await selfsigned.generate([{ name: 'commonName', value: 'gorilapp' }], {
        days: 3650,
        keySize: 2048,
        extensions: [
          { name: 'subjectAltName', altNames: [{ type: 2, value: 'localhost' }, { type: 2, value: 'jamesnas' }] }
        ]
      });
      key = pems.private;
      cert = pems.cert;
      fs.writeFileSync(keyPath, key, 'utf8');
      fs.writeFileSync(certPath, cert, 'utf8');
    }

    http.createServer(app).listen(HTTP_PORT, '0.0.0.0', () => {
      console.log(`[GorilApp] Servidor HTTP escuchando en http://0.0.0.0:${HTTP_PORT}`);
    });

    https.createServer({ key, cert }, app).listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`[GorilApp] Servidor HTTPS escuchando en https://0.0.0.0:${HTTPS_PORT} (Permite instalar PWA y WakeLock)`);
    });
  } catch (err) {
    console.error('[GorilApp] Error iniciando servidores:', err);
  }
}

start();
