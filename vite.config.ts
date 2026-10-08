import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function mapUploadPlugin(): Plugin {
  return {
    name: 'map-upload-handler',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/__upload_official_map' && req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks);
              const targets = [
                path.resolve(process.cwd(), 'src/assets/images/mapa_oficial_festival_incluarte_v2.jpg'),
                path.resolve(process.cwd(), 'public/fotos/mapa_oficial_festival_incluarte_v2.jpg'),
                path.resolve(process.cwd(), 'public/fotos/00_mapa_oficial.jpg'),
              ];
              for (const target of targets) {
                fs.mkdirSync(path.dirname(target), { recursive: true });
                fs.writeFileSync(target, buffer);
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, size: buffer.length }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mapUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
