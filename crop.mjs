/**
 * crop.mjs — Cat bot phan trang trang duoi day anh PNG.
 *
 * Vi sao can: Chrome headless tao khung anh dung bang --window-size, nhung vung
 * thuc su duoc ve chi la (window - 87px). Nen ta render du chieu cao roi cat lai
 * cho dung kho mong muon. Chi dung zlib co san cua Node, khong cai them thu vien.
 *
 * Dung: node crop.mjs <file.png> <soDongGiuLai>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return (buf) => {
    let c = -1;
    for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(CRC(body), body.length + 4);
  return out;
};

/** Go filter cua PNG de lay pixel tho */
function unfilter(raw, w, h, bpp) {
  const stride = w * bpp;
  const out = Buffer.alloc(stride * h);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[p++];
    const line = raw.subarray(p, p + stride);
    p += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 0xff;
    }
  }
  return out;
}

const [file, keepStr] = process.argv.slice(2);
const keep = Number(keepStr);
const d = readFileSync(file);

let pos = 8, idat = [], w = 0, h = 0, bitDepth = 0, colorType = 0;
while (pos < d.length) {
  const len = d.readUInt32BE(pos);
  const type = d.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') {
    w = d.readUInt32BE(pos + 8); h = d.readUInt32BE(pos + 12);
    bitDepth = d[pos + 16]; colorType = d[pos + 17];
  } else if (type === 'IDAT') idat.push(d.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
if (bitDepth !== 8) throw new Error(`Chi ho tro anh 8-bit, gap ${bitDepth}-bit`);
const bpp = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
if (!bpp) throw new Error(`Khong ho tro colorType ${colorType}`);
if (keep >= h) { console.log(`  (bo qua ${file}: da dung kho)`); process.exit(0); }

const px = unfilter(inflateSync(Buffer.concat(idat)), w, h, bpp);
const stride = w * bpp;

// Dong goi lai voi filter 0 (None) cho don gian
const body = Buffer.alloc((stride + 1) * keep);
for (let y = 0; y < keep; y++) {
  body[y * (stride + 1)] = 0;
  px.copy(body, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(keep, 4);
ihdr[8] = 8; ihdr[9] = colorType;

writeFileSync(file, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(body, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]));
