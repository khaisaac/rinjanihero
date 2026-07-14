import fs from 'fs';
import path from 'path';

const dirsToClean = [
  path.join(process.cwd(), '.next'),
  path.join(process.cwd(), 'public/_next')
];

try {
  for (const dir of dirsToClean) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✔ [pre-build] Cleaned stale build directory: ${path.basename(dir)}`);
    }
  }
} catch (err) {
  console.error('Warning during pre-build clean:', err);
}
