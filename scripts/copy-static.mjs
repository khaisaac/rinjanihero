import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), '.next/static');
const destPublic = path.join(process.cwd(), 'public/_next/static');
const destRoot = path.join(process.cwd(), '_next/static');
const standaloneDestDot = path.join(process.cwd(), '.next/standalone/.next/static');
const standaloneDestRoot = path.join(process.cwd(), '.next/standalone/_next/static');
const standalonePublicDest = path.join(process.cwd(), '.next/standalone/public');

try {
  // 1. Mirror static assets into public/_next/static and _next/static for Hostinger LiteSpeed (hcdn) / cPanel reverse proxy
  if (fs.existsSync(src)) {
    fs.mkdirSync(destPublic, { recursive: true });
    fs.cpSync(src, destPublic, { recursive: true });
    console.log('✔ Copied .next/static -> public/_next/static for Hostinger LiteSpeed CDN proxy.');

    fs.mkdirSync(destRoot, { recursive: true });
    fs.cpSync(src, destRoot, { recursive: true });
    console.log('✔ Copied .next/static -> _next/static for direct LiteSpeed root lookup.');
  }

  // 2. Mirror static assets and public folder into .next/standalone/ for Node.js container / cPanel app
  if (fs.existsSync('.next/standalone') && fs.existsSync(src)) {
    if (!fs.existsSync(standaloneDestDot)) fs.mkdirSync(standaloneDestDot, { recursive: true });
    fs.cpSync(src, standaloneDestDot, { recursive: true });
    console.log('✔ Copied .next/static -> .next/standalone/.next/static');

    if (!fs.existsSync(standaloneDestRoot)) fs.mkdirSync(standaloneDestRoot, { recursive: true });
    fs.cpSync(src, standaloneDestRoot, { recursive: true });
    console.log('✔ Copied .next/static -> .next/standalone/_next/static');

    if (fs.existsSync('public')) {
      if (!fs.existsSync(standalonePublicDest)) fs.mkdirSync(standalonePublicDest, { recursive: true });
      fs.cpSync('public', standalonePublicDest, { recursive: true });
      console.log('✔ Copied public -> .next/standalone/public');
    }
  }
} catch (err) {
  console.error('Warning during copy-static:', err);
}
