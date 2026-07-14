import fs from 'fs';
import path from 'path';

const publicNext = path.join(process.cwd(), 'public/_next');

try {
  if (fs.existsSync(publicNext)) {
    fs.rmSync(publicNext, { recursive: true, force: true });
    console.log('✔ [pre-build] Cleaned public/_next before next build.');
  }
} catch (err) {
  console.error('Warning during pre-build clean:', err);
}
