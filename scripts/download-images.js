import fs from 'node:fs';
import https from 'node:https';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '..', 'public', 'product-images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const ids = [
  'p-sh-001','p-sh-003',
  'p-ce-001','p-ce-002','p-ce-003',
  'p-cu-001','p-cu-002','p-cu-003',
  'p-li-001','p-li-002','p-li-003',
  'p-po-001','p-po-002','p-po-003',
  'p-ro-001','p-ro-002','p-ro-003',
  'p-ac-001','p-ac-002','p-ac-003'
];
const images = ids.map(id => ({ url: `https://picsum.photos/seed/${encodeURIComponent(id)}/800/800.jpg`, file: `${id}.jpg` }));

for (const img of images) {
  const filePath = path.join(outDir, img.file);
  console.log('Baixando:', img.file);
  https
    .get(img.url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          const file = fs.createWriteStream(filePath);
          res2.pipe(file);
          file.on('finish', () => {
            console.log('✔ Salvo:', img.file);
            file.close();
          });
        }).on('error', (err) => {
          console.error('Erro ao seguir redirect', img.file, err);
        });
        return;
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        console.log('✔ Salvo:', img.file);
        file.close();
      });
    })
    .on('error', (err) => {
      console.error('Erro ao baixar', img.file, err);
    });
}