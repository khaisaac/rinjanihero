import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), '.next/static');
const dest = path.join(process.cwd(), 'public/_next/static');
const standaloneDest = path.join(process.cwd(), '.next/standalone/.next/static');
const standalonePublicDest = path.join(process.cwd(), '.next/standalone/public');

try {
  // 1. Mirror static assets into public/_next/static for Hostinger LiteSpeed (hcdn) reverse proxy
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
    console.log('✔ Copied .next/static -> public/_next/static for Hostinger LiteSpeed CDN proxy.');
  }

  // 2. Mirror static assets and public folder into .next/standalone/ for Node.js container
  if (fs.existsSync('.next/standalone') && fs.existsSync(src)) {
    if (!fs.existsSync(standaloneDest)) fs.mkdirSync(standaloneDest, { recursive: true });
    fs.cpSync(src, standaloneDest, { recursive: true });
    console.log('✔ Copied .next/static -> .next/standalone/.next/static');

    if (fs.existsSync('public')) {
      if (!fs.existsSync(standalonePublicDest)) fs.mkdirSync(standalonePublicDest, { recursive: true });
      fs.cpSync('public', standalonePublicDest, { recursive: true });
      console.log('✔ Copied public -> .next/standalone/public');
    }
  }
} catch (err) {
  console.error('Warning during copy-static:', err);
}
