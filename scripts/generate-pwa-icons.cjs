const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Ensure output directory exists
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function createPng(width, height, getPixelRgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Non-interlaced
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[offset++] = 0; // No filter
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      scanlines[offset++] = r;
      scanlines[offset++] = g;
      scanlines[offset++] = b;
      scanlines[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw Salora Brand Icon (Burgundy background, glowing pink gradient core, stylized 'S' & sparkle)
function generateSaloraIcon(size, isMaskable = false) {
  return createPng(size, size, (x, y, w, h) => {
    const nx = (x / w) * 2 - 1; // -1 to 1
    const ny = (y / h) * 2 - 1; // -1 to 1
    const dist = Math.sqrt(nx * nx + ny * ny);

    // Background: Gradient from #3A0524 to #5B0638
    const t = (nx + ny + 2) / 4;
    let r = Math.round(58 + (91 - 58) * t);
    let g = Math.round(5 + (6 - 5) * t);
    let b = Math.round(36 + (56 - 36) * t);
    let a = 255;

    if (!isMaskable) {
      // Rounded squircle mask for normal icons
      const cornerRadius = 0.85;
      const squircleDist = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);
      if (squircleDist > 1.0) {
        return [0, 0, 0, 0];
      }
    }

    // Inner glowing ring
    if (dist > 0.65 && dist < 0.78) {
      const ringAlpha = Math.sin(((dist - 0.65) / 0.13) * Math.PI);
      r = Math.min(255, Math.round(r + 180 * ringAlpha));
      g = Math.min(255, Math.round(g + 20 * ringAlpha));
      b = Math.min(255, Math.round(b + 90 * ringAlpha));
    }

    // Center S shape rendering (Stylized S ribbon)
    // S curves between y=-0.45 and y=0.45
    const inS = (
      // Top loop
      (ny >= -0.42 && ny <= -0.15 && Math.abs(nx) <= 0.35 && !(ny > -0.32 && nx > 0.05 && ny < -0.15)) ||
      // Diagonal spine
      (Math.abs(nx * 0.9 + ny * 0.85) < 0.14 && ny >= -0.25 && ny <= 0.25) ||
      // Bottom loop
      (ny >= 0.15 && ny <= 0.42 && Math.abs(nx) <= 0.35 && !(ny < 0.32 && nx < -0.05 && ny > 0.15))
    );

    if (inS) {
      // Vibrant pink-to-gold luxury gradient
      const st = (ny + 0.5);
      r = Math.round(245 - 30 * st);
      g = Math.round(30 + 100 * st);
      b = Math.round(120 + 40 * (1 - st));
    }

    // Little Sparkle / Star at top-right
    const dx = nx - 0.42;
    const dy = ny - (-0.42);
    const starDist = Math.abs(dx * dy);
    if (starDist < 0.003 && Math.abs(dx) < 0.12 && Math.abs(dy) < 0.12) {
      r = 255;
      g = 240;
      b = 245;
    }

    return [r, g, b, a];
  });
}

// Generate PNG icons
const icon192 = generateSaloraIcon(192, false);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);

const icon512 = generateSaloraIcon(512, false);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);

const iconMaskable = generateSaloraIcon(512, true);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.png'), iconMaskable);

const appleTouchIcon = generateSaloraIcon(180, true);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleTouchIcon);

console.log('✅ Generated 192x192, 512x512, maskable, and apple-touch-icon PNGs');
