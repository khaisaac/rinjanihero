import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), '.next/static');
const publicNext = path.join(process.cwd(), 'public/_next');
const standaloneDest = path.join(process.cwd(), '.next/standalone/.next/static');
const standalonePublicDest = path.join(process.cwd(), '.next/standalone/public');

try {
  // 1. Remove public/_next if it exists to prevent Next.js internal /_next routing conflict
  if (fs.existsSync(publicNext)) {
    fs.rmSync(publicNext, { recursive: true, force: true });
    console.log('✔ Removed public/_next to prevent Next.js internal static route conflict.');
  }

  // 2. Mirror static assets and public folder directly into .next/standalone/ for Hostinger Node.js container
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
