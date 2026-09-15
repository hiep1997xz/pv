/**
 * build.mjs — Sinh HTML tu du lieu trong content/*.mjs
 * Chay: node build.mjs   (hoac dung ./render.sh de build + xuat PNG luon)
 */
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src';
mkdirSync(SRC, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Mot regex duy nhat cho chuoi, comment va tu khoa.
 *
 * Phai quet MOT LUOT va dung THU TU nay:
 *  - Chuoi dung truoc comment: neu khong, `'https://x'` se bi cat tu dau `//`
 *    va nua sau chuoi bien thanh comment.
 *  - Comment dung truoc tu khoa: chu trong comment khong duoc to mau tu khoa.
 *  - Tu khoa khong duoc dung trong duong dan: `/var/lib` la thu muc, khong phai
 *    tu khoa `var`. Nen loai tru khi lien ke voi / . - hoac ky tu chu.
 *  - Khong duoc replace nhieu lan chong nhau: to chuoi truoc roi quet tu khoa sau
 *    se to trung chu "class" nam trong the <span class="s"> vua chen.
 */
const TOKEN =
  /(`[^`]*`|'[^']*'|"[^"]*")|(\/\/.*)|(?<![\w/.-])(const|let|var|function|return|if|else|export|import|from|new|await|async|class|type|interface)(?![\w/.-])/g;

/** Khoi code co ky tu ve khung (┌ ─ │ └ ├ ...) thi la so do, can line-height rieng */
const isDiagram = (code) => /[─-╿]/.test(code);

/** Chu thich doi chieu sai/dung duoc to do/xanh cho de phan biet */
const commentClass = (text) =>
  text.includes('❌') ? 'c bad' : text.includes('✅') ? 'c good' : 'c';

/** To mau code: escape HTML truoc, roi quet mot luot duy nhat */
function highlight(raw) {
  return esc(raw).replace(TOKEN, (_, str, cmt, kw) => {
    if (str) return `<span class="s">${str}</span>`;
    if (cmt) return `<span class="${commentClass(cmt)}">${cmt}</span>`;
    return `<span class="k">${kw}</span>`;
  });
}

/**
 * Script chay trong trang sau khi font tai xong:
 *  1. Ha co chu muc luc neu no dam vao hop ghi chu ben phai (chi anh bia)
 *  2. Thu nho noi dung neu tran day trang co kho co dinh (chi anh bia)
 *  3. Bao chieu cao that ra ngoai qua <title> de render.sh cat anh cho dung
 */
const FIT_SCRIPT = `<script>
document.fonts.ready.then(function () {
  var page = document.querySelector('.page');
  var box = document.querySelector('.body');
  var fit = document.querySelector('.fit');

  var toc = document.querySelector('.toc');
  var sticky = document.querySelector('.sticky');
  if (toc && sticky) {
    var sr = sticky.getBoundingClientRect();
    for (var fs = 25; fs >= 19; fs--) {
      toc.style.fontSize = fs + 'px';
      var hit = Array.prototype.some.call(toc.querySelectorAll('li'), function (li) {
        var r = li.getBoundingClientRect();
        return r.right > sr.left - 18 && r.bottom > sr.top && r.top < sr.bottom;
      });
      if (!hit) break;
    }
  }

  if (page.classList.contains('fixed') && box && fit) {
    var cs = getComputedStyle(box);
    var avail = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var h = fit.scrollHeight;
    if (h > avail) {
      var sc = avail / h;
      fit.style.transformOrigin = 'top left';
      fit.style.transform = 'scale(' + sc + ')';
      fit.style.width = (100 / sc) + '%';
    }
  }

  // Tu soi loi bo cuc roi bao ra ngoai qua <title> — de render.sh in canh bao.
  // Do that trong trinh duyet, chinh xac hon la doan qua so cot trong nguon.
  var warn = [];

  document.querySelectorAll('pre.code').forEach(function (pre) {
    if (pre.scrollWidth > pre.clientWidth + 1) warn.push('code-tran-ngang');
  });

  if (fit && fit.style.transform) {
    var sc = parseFloat(fit.style.transform.replace(/[^0-9.]/g, ''));
    if (sc < 0.94) warn.push('noi-dung-bi-thu-nho-' + Math.round(sc * 100) + '%');
  }

  var pw = page.getBoundingClientRect().width;
  page.querySelectorAll('.body *').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.width && (r.right > pw + 1 || r.left < -1)) warn.push('tran-le');
  });

  document.title = 'H=' + Math.ceil(page.getBoundingClientRect().height)
    + (warn.length ? ';WARN=' + Array.from(new Set(warn)).join(',') : '');
});
<\/script>`;

/* ---------------------------------------------------------------
   Logo tung cum — ve bang SVG, dat o khoang trong duoi-trai anh bia.
   Moi hinh ve trong he toa do -150..150 de dung chung khung.
   --------------------------------------------------------------- */
const MARKS = {
  react: ['#1A56DB', `
    <g fill="none" stroke="currentColor" stroke-width="9">
      <ellipse rx="128" ry="49"/>
      <ellipse rx="128" ry="49" transform="rotate(60)"/>
      <ellipse rx="128" ry="49" transform="rotate(120)"/>
    </g>
    <circle r="22" fill="currentColor"/>`],

  nextjs: ['#111827', `
    <circle r="124" fill="none" stroke="currentColor" stroke-width="11"/>
    <path d="M-46 62 V-62 L46 62 V-62" fill="none" stroke="currentColor"
          stroke-width="15" stroke-linecap="square"/>`],

  javascript: ['#B45309', `
    <rect x="-118" y="-118" width="236" height="236" rx="34"
          fill="none" stroke="currentColor" stroke-width="11"/>
    <text x="0" y="46" text-anchor="middle" fill="currentColor"
          font-family="Be Vietnam Pro" font-weight="800" font-size="118">JS</text>`],

  typescript: ['#1D4ED8', `
    <rect x="-118" y="-118" width="236" height="236" rx="34"
          fill="none" stroke="currentColor" stroke-width="11"/>
    <text x="0" y="46" text-anchor="middle" fill="currentColor"
          font-family="Be Vietnam Pro" font-weight="800" font-size="118">TS</text>`],

  algorithms: ['#7C3AED', `
    <path d="M0 -60 L-75 20 M0 -60 L75 20 M-75 20 L-118 100 M-75 20 L-32 100"
          fill="none" stroke="currentColor" stroke-width="9"/>
    <g fill="currentColor">
      <circle cy="-88" r="28"/><circle cx="-75" cy="20" r="26"/>
      <circle cx="75" cy="20" r="26"/><circle cx="-118" cy="100" r="22"/>
      <circle cx="-32" cy="100" r="22"/>
    </g>`],

  'system-design': ['#0F766E', `
    <g fill="none" stroke="currentColor" stroke-width="10">
      <rect x="-90" y="-128" width="180" height="62" rx="12"/>
      <rect x="-90" y="-31" width="180" height="62" rx="12"/>
      <rect x="-90" y="66" width="180" height="62" rx="12"/>
      <path d="M0 -66 V-31 M0 31 V66"/>
    </g>
    <g fill="currentColor">
      <path d="M-11 -40 L11 -40 L0 -24 Z"/><path d="M-11 57 L11 57 L0 73 Z"/>
    </g>`],

  practical: ['#15803D', `
    <g fill="currentColor">
      ${[0, 45, 90, 135].map((a) => `<rect x="-19" y="-134" width="38" height="70" rx="9" transform="rotate(${a})"/><rect x="-19" y="64" width="38" height="70" rx="9" transform="rotate(${a})"/>`).join('')}
    </g>
    <circle r="82" fill="none" stroke="currentColor" stroke-width="22"/>
    <circle r="30" fill="none" stroke="currentColor" stroke-width="13"/>`],

  debugging: ['#BE123C', `
    <g fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round">
      <circle cx="-26" cy="-32" r="86"/>
      <path d="M38 34 L118 116"/>
    </g>
    <path d="M-58 -64 L6 0 M6 -64 L-58 0" stroke="currentColor"
          stroke-width="11" stroke-linecap="round"/>`],

  docker: ['#0B72C4', `
    <g fill="currentColor">
      <rect x="-116" y="-28" width="36" height="34" rx="4"/>
      <rect x="-74"  y="-28" width="36" height="34" rx="4"/>
      <rect x="-32"  y="-28" width="36" height="34" rx="4"/>
      <rect x="-74"  y="-68" width="36" height="34" rx="4"/>
      <rect x="-32"  y="-68" width="36" height="34" rx="4"/>
      <rect x="-32"  y="-108" width="36" height="34" rx="4"/>
      <path d="M-140 16 H92 v16 a42 42 0 0 1 -42 42 H-98 a42 42 0 0 1 -42 -42 Z"/>
      <path d="M92 4 l54 -26 v78 l-54 -24 Z"/>
    </g>`],

  architecture: ['#4338CA', `
    <g stroke="currentColor" stroke-width="9" fill="none" stroke-linejoin="round">
      <path d="M0 -122 L124 -62 L0 -2 L-124 -62 Z"/>
      <path d="M-124 -4 L0 56 L124 -4"/>
      <path d="M-124 54 L0 114 L124 54"/>
    </g>`],
};

/** Boc hinh cua cum vao the <svg> dat tuyet doi tren trang */
const MARK = (slug, x, y, size) => {
  const entry = MARKS[slug];
  if (!entry) return '';
  const [color, inner] = entry;
  return `
  <svg width="${size}" height="${size}" viewBox="-150 -150 300 300"
       style="position:absolute;left:${x}px;top:${y}px;color:${color};opacity:.30;z-index:1">
    ${inner}
  </svg>`;
};

const shell = (title, css, inner, fixed = false) => `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="stylesheet" href="../assets/paper.css">
<link rel="stylesheet" href="../assets/card.css">
<style>${css}</style></head>
<body><div class="page${fixed ? ' fixed' : ''}">
  <div class="holes">${'<i></i>'.repeat(24)}</div>
  ${inner}
</div>${FIT_SCRIPT}</body></html>`;

/* ----------------------------- ANH BIA ----------------------------- */
function renderCover(c) {
  const sub = c.sub.map((p) => (typeof p === 'string' ? p : `<span class="hl">${p.hl}</span>`)).join('');
  const toc = c.toc
    .map(([ic, text, lv]) => `<li><span class="ic">${ic}</span>${text} <small>· ${lv}</small></li>`)
    .join('\n      ');
  const chips = c.chips
    .map(([t, bg], i) => `<span class="chip" style="background:${bg};transform:rotate(${i % 2 ? 1.6 : -1.8}deg)">${t}</span>`)
    .join('\n    ');
  const sticky = c.sticky.map((s) => `<div><span class="ok">✓</span> ${s}</div>`).join('');

  return shell(`${c.title} — Toàn tập`, '', `
  <div class="tape" style="top:-14px;left:330px;transform:rotate(-2.4deg)"></div>
  ${MARK(c.slug, 246, 918, 286)}
  <div class="body"><div class="fit">
    <div class="cover-kicker cursive" style="font-size:34px">${c.kicker}</div>
    <div class="cover-title"><b>${c.title}</b></div>
    <div class="cover-sub">${sub}</div>
    <div class="cover-sub2"><span class="under-red">${c.sub2}</span></div>
    <ul class="toc">
      ${toc}
    </ul>
  </div></div>
  <div class="cover-note">~ ${c.note}</div>
  <div class="sticky" style="right:44px;bottom:398px;width:318px">${sticky}</div>
  <div class="chips" style="bottom:88px">
    ${chips}
  </div>`, true);
}

/* --------------------------- THE NOI DUNG --------------------------- */
const LEVEL = { junior: 'JUNIOR', mid: 'MIDDLE', senior: 'SENIOR' };

function renderCard(card, topic, total) {
  const qs = card.questions.map((q) => `<div class="q"><i>?</i><span>${q}</span></div>`).join('\n      ');
  const pts = card.points.map((p) => `<li>${p}</li>`).join('\n      ');

  return shell(`${topic} ${card.id} — ${card.title}`, '', `
  <div class="body"><div class="fit">
    <div class="card-head">
      <span class="badge topic">${topic}</span>
      <span class="badge ${card.level}">${LEVEL[card.level]}</span>
      <span class="card-no">${card.id} / ${String(total).padStart(2, '0')}</span>
    </div>
    <div class="sec" style="font-size:31px;color:var(--ink);margin-bottom:16px">${card.title}</div>
    <div class="q-box">
      ${qs}
    </div>
    <div class="sec">💡 Trả lời</div>
    <ul class="pts">
      ${pts}
    </ul>
    <pre class="code${isDiagram(card.code) ? ' diagram' : ''}">${highlight(card.code)}</pre>
    <div class="notes">
      <div class="note trap"><b>⚠ Bẫy phỏng vấn:</b> ${card.trap}</div>
      <div class="note tip"><b>💬 Nói thêm để ghi điểm:</b> ${card.tip}</div>
    </div>
  </div></div>`);
}

/* ------------------------------ CHAY ------------------------------ */
const modules = readdirSync('content').filter((f) => f.endsWith('.mjs'));
let count = 0;
const gallery = [];

for (const file of modules) {
  const { cover, cards } = await import('./' + join('content', file));
  writeFileSync(join(SRC, `${cover.slug}-00-cover.html`), renderCover(cover));
  gallery.push({ group: cover.title, items: [`${cover.slug}-00-cover`, ...cards.map((c) => `${cover.slug}-${c.id}`)] });
  count++;
  for (const card of cards) {
    writeFileSync(join(SRC, `${cover.slug}-${card.id}.html`), renderCard(card, cover.title, cards.length));
    count++;
  }
  console.log(`✓ ${cover.slug}: 1 bìa + ${cards.length} thẻ`);
}

/* Trang xem nhanh toan bo anh - mo out/index.html bang trinh duyet */
mkdirSync('out', { recursive: true });
writeFileSync('out/index.html', `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cẩm nang phỏng vấn — Xem nhanh</title>
<style>
  body{margin:0;padding:28px;background:#EDEAE2;font:15px system-ui,sans-serif;color:#16325C}
  h1{font-size:23px;margin:0 0 6px} p.hint{color:#5B6B84;margin:0 0 26px}
  h2{font-size:19px;margin:30px 0 14px;padding-bottom:7px;border-bottom:2px solid #C9D4E6}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
  figure{margin:0;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 9px rgba(0,0,0,.13)}
  img{display:block;width:100%}
  figcaption{padding:9px 12px;font-size:13px;color:#5B6B84}
</style></head><body>
<h1>Cẩm nang phỏng vấn — xem nhanh</h1>
<p class="hint">Bấm vào ảnh để mở kích thước gốc. Sửa nội dung trong <code>content/*.mjs</code> rồi chạy <code>./render.sh</code>.</p>
${gallery.map((g) => `<h2>${g.group}</h2>\n<div class="grid">${g.items
    .map((n) => `<figure><a href="${n}.png"><img src="${n}.png" alt="${n}" loading="lazy"></a><figcaption>${n}.png</figcaption></figure>`)
    .join('')}</div>`).join('\n')}
</body></html>`);

console.log(`→ Đã sinh ${count} file HTML trong ${SRC}/ · trang xem nhanh: out/index.html`);
