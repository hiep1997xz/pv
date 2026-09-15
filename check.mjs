/**
 * check.mjs — Kiem tra noi dung trong content/*.mjs co dung spec khong.
 * Dung: node check.mjs [slug]
 */
import { readdirSync } from 'node:fs';

const LIMITS = {
  coverTitle: 14, tocText: 42, tocMin: 10, tocMax: 12,
  cardTitle: 46, question: 62, point: 175, trap: 250, tip: 240,
  pointsMin: 4, pointsMax: 5, codeLines: 15, inlineCode: 30,
};
const LEVELS = ['junior', 'mid', 'senior'];
const RANK = { junior: 0, mid: 1, senior: 2 };

/**
 * Be rong hien thi cua mot dong code, tinh theo o chu don cach.
 *
 * So do thuc te trong trinh duyet (font Noto Sans Mono 18px):
 *   1 o chu            = 10.80px
 *   vung code kha dung = 832px - 36px padding = 796px  ->  73.7 o chu
 *   emoji mau (✅ ❌)   = 2.08 o chu, khong phai 1
 *   ky tu khung va chu co dau (│ ─ → ▼ ⚠ đ ế) = dung 1 o chu
 *
 * Neu chi dung String.length thi dong co emoji se tran ma checker khong bat.
 */
const CELL_LIMIT = 73.5;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2700}-\u{27BF}\u{2705}\u{274C}]/u;
const ZERO = /[\u{FE00}-\u{FE0F}\u{200D}]/u;
const width = (line) =>
  [...line].reduce((w, ch) => w + (ZERO.test(ch) ? 0 : EMOJI.test(ch) ? 2.08 : 1), 0);

/** Doi thuc the HTML ve ky tu that de dem dung do dai hien thi */
const decode = (s) => String(s)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&');

/** Bo the HTML roi doi thuc the, de dem dung so ky tu nguoi doc nhin thay */
const strip = (s) => decode(String(s).replace(/<[^>]+>/g, ''));

let errors = 0;
const only = process.argv[2];

/** Bao loi kem duong dan truong de sua cho nhanh */
const bad = (where, msg) => { console.log(`  ✗ ${where}: ${msg}`); errors++; };

function checkCover(c, slug, where) {
  if (c.slug !== slug) bad(where, `cover.slug = "${c.slug}" nhung ten file la "${slug}"`);
  if (c.title.length > LIMITS.coverTitle) bad(where, `cover.title dai ${c.title.length} > ${LIMITS.coverTitle}`);
  if (!Array.isArray(c.toc) || c.toc.length < LIMITS.tocMin || c.toc.length > LIMITS.tocMax)
    bad(where, `cover.toc phai co ${LIMITS.tocMin}-${LIMITS.tocMax} muc, dang co ${c.toc?.length}`);
  c.toc?.forEach(([, text], i) => {
    if (strip(text).length > LIMITS.tocText) bad(where, `toc[${i}] dai ${strip(text).length} > ${LIMITS.tocText}: "${text}"`);
  });
  if (c.sticky?.length !== 4) bad(where, `cover.sticky phai co 4 muc`);
  if (c.chips?.length !== 5) bad(where, `cover.chips phai co 5 muc`);
  for (const f of ['kicker', 'sub', 'sub2', 'note']) if (!c[f]) bad(where, `thieu cover.${f}`);
}

function checkCard(card, i, where) {
  const at = `${where} the ${card.id ?? `#${i}`}`;
  const expected = String(i + 1).padStart(2, '0');
  if (card.id !== expected) bad(at, `id phai la "${expected}"`);
  if (!LEVELS.includes(card.level)) bad(at, `level "${card.level}" khong hop le`);
  if (strip(card.title).length > LIMITS.cardTitle) bad(at, `title dai ${strip(card.title).length} > ${LIMITS.cardTitle}`);

  if (card.questions?.length !== 2) bad(at, `phai co dung 2 cau hoi, dang co ${card.questions?.length}`);
  card.questions?.forEach((q, k) => {
    if (!q.trim().endsWith('?')) bad(at, `cau hoi ${k + 1} phai ket thuc bang "?"`);
    if (strip(q).length > LIMITS.question) bad(at, `cau hoi ${k + 1} dai ${strip(q).length} > ${LIMITS.question}`);
  });

  const n = card.points?.length ?? 0;
  if (n < LIMITS.pointsMin || n > LIMITS.pointsMax)
    bad(at, `points phai co ${LIMITS.pointsMin}-${LIMITS.pointsMax} y, dang co ${n}`);

  for (const [field, limit] of [['trap', LIMITS.trap], ['tip', LIMITS.tip]]) {
    if (!card[field]) { bad(at, `thieu ${field}`); continue; }
    if (strip(card[field]).length > limit) bad(at, `${field} dai ${strip(card[field]).length} > ${limit}`);
  }
  // Hop da co nhan san ("⚠ Bẫy phỏng vấn:" / "💬 Nói thêm để ghi điểm:")
  // nen phan chu khong duoc lap lai nhan mot lan nua
  const PREFIX = /^\s*(Bẫy( phỏng vấn)?|Mẹo( ghi điểm)?|Nói thêm|Ghi điểm|Lưu ý)\s*[::]/i;
  for (const k of ['trap', 'tip'])
    if (PREFIX.test(strip(card[k] ?? '')))
      bad(at, `${k} mo dau bang tien to lap voi nhan hop, cat bo di`);

  // Kiem tra HTML trong cac truong van ban
  for (const field of ['points', 'trap', 'tip']) {
    const vals = Array.isArray(card[field]) ? card[field] : [card[field]];
    vals.forEach((v, k) => {
      const tag = `${field}${Array.isArray(card[field]) ? `[${k}]` : ''}`;
      if (typeof v !== 'string') return;
      if (field === 'points' && strip(v).length > LIMITS.point)
        bad(at, `${tag} dai ${strip(v).length} > ${LIMITS.point}`);
      for (const m of v.matchAll(/<code>(.*?)<\/code>/g)) {
        const len = decode(m[1]).length;   // dem theo ky tu hien thi, khong tinh &lt; &gt;
        if (len > LIMITS.inlineCode) bad(at, `${tag}: <code> dai ${len} > ${LIMITS.inlineCode}: "${m[1]}"`);
      }
      for (const m of v.matchAll(/<(\/?)([a-zA-Z]+)/g))
        if (!['b', 'code', 'em', 'br'].includes(m[2].toLowerCase()))
          bad(at, `${tag}: the <${m[2]}> khong duoc phep (chi <b> <code> <em> <br>)`);
    });
  }

  if (typeof card.code !== 'string') { bad(at, `thieu code`); return; }
  const lines = card.code.split('\n');
  if (lines.length > LIMITS.codeLines) bad(at, `code ${lines.length} dong > ${LIMITS.codeLines}`);
  lines.forEach((l, k) => {
    const w = width(l);
    if (w > CELL_LIMIT) bad(at, `code dong ${k + 1} rong ${w.toFixed(1)} o chu > ${CELL_LIMIT}`);
  });
}

const files = readdirSync('content').filter((f) => f.endsWith('.mjs') && (!only || f === `${only}.mjs`));
if (!files.length) { console.log(`Khong tim thay content/${only}.mjs`); process.exit(1); }

for (const file of files) {
  const slug = file.replace(/\.mjs$/, '');
  const before = errors;
  let mod;
  try { mod = await import(`./content/${file}`); }
  catch (e) { bad(slug, `khong import duoc: ${e.message}`); continue; }

  const { cover, cards } = mod;
  if (!cover || !cards) { bad(slug, 'thieu export cover hoac cards'); continue; }
  checkCover(cover, slug, slug);
  if (cards.length < 6) bad(slug, `chi co ${cards.length} the, toi thieu 6`);
  cards.forEach((c, i) => checkCard(c, i, slug));

  let prev = -1;
  cards.forEach((c) => {
    if (RANK[c.level] < prev) bad(`${slug} the ${c.id}`, `level "${c.level}" thut lui, phai tang dan theo id`);
    prev = Math.max(prev, RANK[c.level] ?? prev);
  });

  console.log(errors === before ? `✓ ${slug}: ${cards.length} the — dat` : `✗ ${slug}: ${errors - before} loi`);
}

console.log(errors ? `\n${errors} loi can sua.` : '\nTat ca dat spec.');
process.exit(errors ? 1 : 0);
