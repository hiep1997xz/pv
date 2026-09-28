/**
 * Noi dung cum NODE + DB — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 * Stack tham chieu: Node.js + TypeScript + PostgreSQL (pg / Prisma / ioredis).
 */

export const cover = {
  slug: 'node-db',
  kicker: '( Cẩm nang )',
  title: 'Node + DB',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Câu hỏi thực tế khi đi làm',
  toc: [
    ['🔌', 'Connection pool · rò rỉ connection', 'Junior'],
    ['🧰', 'ORM · Query Builder · SQL thuần', 'Mid'],
    ['➕', 'N+1 query: dấu hiệu & cách sửa', 'Mid'],
    ['🔐', 'Transaction & bẫy quên await', 'Mid'],
    ['📦', 'Migration & seed lúc deploy', 'Mid'],
    ['🔎', 'Đọc EXPLAIN · đánh index đúng chỗ', 'Mid'],
    ['🧪', 'Test trên DB thật, không mock', 'Mid'],
    ['⚡', 'Cache Redis: key, TTL, stampede', 'Senior'],
    ['🚚', 'Bulk insert · cursor · timeout', 'Senior'],
    ['🏁', 'Race condition & idempotency', 'Senior'],
    ['🐞', 'Bẫy hay gặp khi làm việc với DB', 'All'],
    ['💬', 'Câu hỏi thật theo từng cấp độ', 'All'],
  ],
  sticky: ['Giải thích dễ hiểu', 'Có code thật', 'Bẫy phỏng vấn', 'Câu trả lời mẫu'],
  chips: [
    ['Khái niệm', '#DCE9FF'],
    ['Code mẫu', '#D6F5E3'],
    ['Bẫy thường gặp', '#FFDCD4'],
    ['Câu hỏi thật', '#FFE9C7'],
    ['Mẹo ghi điểm', '#F3DDFF'],
  ],
  note: 'Phần lớn sự cố production nằm ở <em>tầng dữ liệu</em>,<br>không phải ở logic. Kể chuyện thật, đừng đọc lý thuyết. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Connection pool · Rò rỉ connection',
    questions: [
      'App chạy vài tiếng rồi mọi request treo, nghi gì đầu tiên?',
      'Pool size nên đặt bao nhiêu và dựa vào đâu?',
    ],
    points: [
      'Mở một connection tới Postgres là TCP handshake + xác thực + fork một process phía server — tốn hàng chục ms. <b>Pool</b> giữ sẵn N connection, query xong thì <b>trả lại</b> chứ không đóng.',
      'Pool size <b>không phải càng to càng tốt</b>. Mỗi connection là một process của Postgres; tổng pool của <b>mọi</b> instance phải nhỏ hơn <code>max_connections</code>. Khởi đầu cỡ <b>số core × 2</b> rồi đo.',
      '<b>Connection leak</b>: lấy bằng <code>pool.connect()</code> nhưng nhánh throw không gọi <code>release()</code> → pool cạn dần, request sau xếp hàng rồi timeout. Luôn <code>release()</code> trong <code>finally</code>.',
      '<code>connectionTimeoutMillis</code> = chờ mượn connection bao lâu thì bỏ cuộc (chống treo vô hạn). <code>idleTimeoutMillis</code> = connection rảnh bao lâu thì đóng, trả tài nguyên lại cho DB.',
      'Serverless: mỗi instance có pool riêng, scale lên 200 instance là 200 pool → nổ <code>max_connections</code> ngay. Đặt <b>PgBouncer</b> ở giữa để gom lại thành một pool chung.',
    ],
    code: `// pg — một Pool dùng chung cả app: import { Pool } from 'pg'
export const pool = new Pool({
  max: 20,                    // tổng mọi instance < max_connections
  idleTimeoutMillis: 30_000,      // connection rảnh 30s thì đóng
  connectionTimeoutMillis: 5_000, // chờ mượn quá 5s thì báo lỗi
});

// ❌ throw ở giữa → connection này không bao giờ quay về pool
const c = await pool.connect();
await c.query('UPDATE ...');   // câu này ném lỗi là rò rỉ luôn
c.release();

// ✅ release trong finally, chạy cả khi throw
const c2 = await pool.connect();
try { await c2.query('UPDATE ...'); } finally { c2.release(); }`,
    trap: 'Quên <code>release()</code> ở nhánh lỗi là bug kinh điển: chạy dev không thấy gì, lên production vài giờ thì mọi request treo ở <code>connectionTimeoutMillis</code>. Dấu hiệu nhận ra: <code>pool.idleCount</code> về 0 còn <code>pool.waitingCount</code> tăng đều.',
    tip: 'Query đơn lẻ thì dùng thẳng <code>pool.query()</code> — <code>pg</code> tự mượn và tự trả connection, không thể rò rỉ. Chỉ cần <code>pool.connect()</code> khi làm transaction hoặc khi nhiều câu bắt buộc đi trên cùng một connection.',
  },
  {
    id: '02', level: 'mid', title: 'ORM · Query Builder · SQL thuần',
    questions: [
      'Dự án của bạn chọn ORM hay SQL thuần, vì sao?',
      'ORM có khi nào sinh ra SQL tệ không?',
    ],
    points: [
      '<b>ORM</b> (Prisma, TypeORM): bảng thành object, có type và migration sẵn — nhanh cho CRUD. <b>Query builder</b> (Drizzle, Knex): mỏng hơn, vẫn nghĩ bằng SQL. <b>Driver</b> (<code>pg</code>): SQL trần.',
      'Chọn theo <b>hình dạng query</b>: CRUD và quan hệ đơn giản → ORM. Report, aggregate nhiều tầng, window function, CTE → viết SQL thẳng. Đừng ép ORM diễn tả thứ nó không diễn tả nổi.',
      'ORM sinh SQL kém ở đâu: Prisma mặc định <b>tách quan hệ thành nhiều query riêng</b> rồi ghép ở tầng app chứ không JOIN; <code>findMany</code> lấy hết cột nên kéo cả cột text nặng.',
      'Bắt buộc phải có <b>đường thoát</b> để viết raw query: <code>prisma.$queryRaw</code>, <code>db.execute()</code> của Drizzle, hay <code>pool.query</code>. Chọn ORM nào cũng nên thử trước xem viết raw có dễ không.',
      'Raw query <b>vẫn phải tham số hoá</b>. <code>$queryRaw</code> dạng tagged template tự bind giá trị; còn <code>$queryRawUnsafe</code> hay nối chuỗi là mở toang cửa cho SQL injection.',
    ],
    code: `// Prisma: tagged template tự bind tham số → an toàn
const rows = await prisma.$queryRaw\`
  SELECT u.id, u.email, count(o.id) AS orders
  FROM users u LEFT JOIN orders o ON o.user_id = u.id
  WHERE u.created_at > \${from} GROUP BY u.id, u.email\`;

// ❌ nối chuỗi: email = "' OR 1=1 --" là lộ sạch bảng users
await prisma.$queryRawUnsafe(
  \`SELECT * FROM users WHERE email = '\${email}'\`);

// ✅ pg: placeholder $1, giá trị đi đường riêng, không vào câu lệnh
await pool.query('SELECT id FROM users WHERE email = $1', [email]);`,
    trap: 'Câu vặn quen thuộc: “ORM có chống SQL injection không?” → Chống <b>khi bạn dùng API của nó</b>. Vừa chuyển sang <code>$queryRawUnsafe</code>, hay nối chuỗi trong <code>whereRaw</code> của Knex, là mất sạch lớp bảo vệ đó.',
    tip: 'Đừng trả lời cụt lủn “ORM chậm”. Nói cụ thể: bật log SQL, lấy đúng câu ORM sinh ra đem chạy <code>EXPLAIN ANALYZE</code>. Chậm vì thiếu index hay vì ORM sinh sai câu là hai vấn đề hoàn toàn khác nhau.',
  },
  {
    id: '03', level: 'mid', title: 'N+1 query · Phát hiện và sửa',
    questions: [
      'API list chậm dần khi dữ liệu lớn, kiểm tra gì trước?',
      'Làm sao chứng minh được code đang bị N+1?',
    ],
    points: [
      'Dấu hiệu: một request bắn ra hàng trăm query gần giống hệt nhau, chỉ khác giá trị id. Thời gian phản hồi tăng <b>tuyến tính</b> theo số dòng — 10 dòng thì mượt, 500 dòng thì treo.',
      'Nguyên nhân luôn giống nhau: lấy danh sách xong rồi <code>for</code> / <code>map</code> qua từng phần tử và query tiếp <b>bên trong vòng lặp</b>. 1 query cha + N query con.',
      'Cách sửa: <b>eager load</b> (<code>include</code> của Prisma, <code>relations</code> của TypeORM), hoặc tự gom id rồi bắn <b>một</b> câu <code>WHERE id IN (...)</code> và ghép lại bằng <code>Map</code> ở tầng app.',
      'GraphQL không sửa được bằng eager load vì resolver chạy theo từng field riêng lẻ → dùng <b>DataLoader</b>: gom các key phát sinh trong cùng một tick rồi bắn một query batch duy nhất.',
      '<b>Cách phát hiện: bật log SQL rồi đếm</b>. Prisma dùng <code>log: [\'query\']</code>, <code>pg</code> thì bọc <code>pool.query</code>. Có số đếm mới nói được “trước 312 query, sau 2 query” — đó mới là câu trả lời ăn điểm.',
    ],
    code: `// ❌ N+1: 1 query lấy posts + 100 query lấy từng author
const posts = await prisma.post.findMany({ take: 100 });
for (const p of posts) {
  p.author = await prisma.user.findUnique({ where: { id: p.userId } });
}

// ✅ cách 1 — eager load, để Prisma tự gom quan hệ
await prisma.post.findMany({ take: 100, include: { author: true } });
// ✅ cách 2 — tự gom id, một câu IN rồi ghép bằng Map
const ids = [...new Set(posts.map(p => p.userId))];
const users = await prisma.user.findMany({
  where: { id: { in: ids } },
});
const byId = new Map(users.map(u => [u.id, u]));
posts.forEach(p => { p.author = byId.get(p.userId); });`,
    trap: 'Bẫy ngược: gộp hết vào một câu JOIN nhiều bảng one-to-many cùng lúc làm <b>bung số dòng</b> (10 post × 50 comment = 500 dòng) rồi phải dedupe ở app. Nhiều khi hai query <code>IN</code> riêng lại nhanh hơn một JOIN to.',
    tip: 'Chốt bằng con số. Có thể đếm query ngay trong CI: nghe event query của Prisma, cho test fail nếu một endpoint vượt ngưỡng. Như vậy N+1 không lẻn lại được sau mỗi lần refactor.',
  },
  {
    id: '04', level: 'mid', title: 'Transaction · Bẫy quên await',
    questions: [
      'Trừ kho xong thì tạo đơn lỗi, dữ liệu sẽ ra sao?',
      'Vì sao transaction commit mà vẫn thiếu bản ghi?',
    ],
    points: [
      'Nhiều thao tác phải cùng thành hoặc cùng huỷ thì bọc vào một transaction. Với <code>pg</code>: <code>BEGIN</code> / <code>COMMIT</code> / <code>ROLLBACK</code> phải chạy trên <b>cùng một client</b>, không phải trên pool.',
      'Prisma: <code>prisma.$transaction(...)</code> nhận callback — throw bên trong thì tự <code>ROLLBACK</code>, chạy hết thì tự <code>COMMIT</code>. Không cần bắt lỗi rồi rollback bằng tay.',
      '<b>Phải truyền <code>tx</code> xuyên qua các tầng service</b>. Hàm con vẫn gọi <code>prisma</code> toàn cục là nó chạy <b>ngoài</b> transaction — rollback không đụng tới nó. Cho <code>tx</code> vào tham số của mọi repository.',
      'Bẫy <b>quên <code>await</code></b>: gọi hàm async trong callback mà không await → callback kết thúc sớm, Prisma commit trước khi thao tác đó chạy xong, và lỗi văng ra thành unhandled rejection.',
      'Transaction <b>không được ôm lời gọi API bên ngoài</b> (thanh toán, gửi mail). Bên kia chậm 5 giây là giữ lock 5 giây, giam một connection. Gọi trước, hoặc đẩy qua queue sau commit.',
    ],
    code: `// Prisma: throw trong callback → tự ROLLBACK cả cụm
await prisma.$transaction(async (tx) => {
  const it = await tx.item.update({
    where: { id },
    data: { stock: { decrement: qty } },
  });
  if (it.stock < 0) throw new Error('hết hàng');  // rollback tất cả

  // ❌ quên await → transaction commit xong order mới chạy
  tx.order.create({ data: { itemId: id, qty } });

  // ✅ có await → lỗi ở đây mới kéo được cả cụm rollback
  await tx.order.create({ data: { itemId: id, qty } });
});
// ✅ gọi API thanh toán SAU commit, đừng để bên trong transaction`,
    trap: 'Quên một chữ <code>await</code> trong <code>$transaction</code> là lỗi tàn nhẫn nhất: test vẫn pass, log không báo gì, chỉ thỉnh thoảng thiếu bản ghi con trên production. Bật rule <code>no-floating-promises</code> của typescript-eslint cho máy bắt hộ.',
    tip: 'Về <b>isolation level</b>: Postgres mặc định là <code>Read Committed</code>. Bài toán đọc-rồi-ghi cần <code>Serializable</code> hoặc <code>SELECT ... FOR UPDATE</code>. Và transaction nào cũng nên có timeout — giữ lock lâu là khoá cả bảng.',
  },
  {
    id: '05', level: 'mid', title: 'Migration & Seed khi deploy',
    questions: [
      'Migration chạy ở bước nào trong quy trình deploy?',
      'Sửa migration đã chạy trên production được không?',
    ],
    points: [
      'Công cụ: <code>prisma migrate deploy</code>, <code>drizzle-kit migrate</code>, <code>knex migrate:latest</code>, <code>node-pg-migrate</code>. Cái nào cũng giữ một bảng lịch sử để không chạy lại migration cũ.',
      'Chạy migration ở <b>một job riêng trong pipeline</b>, xong mới cho pod mới nhận traffic. <b>Không</b> gọi trong <code>app.listen()</code>: 4 instance khởi động cùng lúc là 4 tiến trình cùng <code>ALTER TABLE</code>.',
      '<b>Không bao giờ sửa migration đã chạy trên production.</b> Lịch sử và checksum lệch thì công cụ hoặc báo lỗi, hoặc tệ hơn là bỏ qua âm thầm. Sai thì viết một migration mới đè lên.',
      'Migration phải <b>tương thích ngược</b> với code đang chạy, vì lúc rollout code cũ và mới sống chung vài phút. Đổi tên cột = thêm cột mới → ghi cả hai → chuyển đọc → xoá cột cũ.',
      '<b>Seed</b> chia hai loại: dữ liệu tham chiếu (role, config) chạy mọi môi trường; dữ liệu giả chỉ ở dev/test. Test phải chạy trên <b>Postgres thật</b> — mock DB thì không kiểm tra được gì.',
    ],
    code: `// ❌ src/main.ts — 4 pod khởi động cùng lúc = 4 lần ALTER TABLE
await migrateOnBoot();
app.listen(3000);

// ✅ một job riêng trong pipeline, xong mới rollout pod mới
//   deploy.sh:
//     npx prisma migrate deploy    # 1 job duy nhất, chờ chạy xong
//     kubectl rollout restart deploy/api

// ✅ đổi tên cột an toàn: 3 lần deploy, không lần nào gãy code cũ
// 1) ALTER TABLE users ADD COLUMN full_name text;  (code cũ vẫn chạy)
// 2) app ghi cả name lẫn full_name + backfill dữ liệu cũ
// 3) app đọc full_name → deploy → ALTER TABLE users DROP COLUMN name;`,
    trap: 'Chạy migration lúc app khởi động với nhiều instance: hai tiến trình cùng vào một migration, một cái chết vì “relation already exists” rồi crash-loop, hoặc hai cái khoá bảng lẫn nhau. Sự cố 2 giờ sáng thường bắt đầu đúng từ đây.',
    tip: 'Từ Postgres 11, <code>ADD COLUMN</code> có <code>DEFAULT</code> không còn viết lại cả bảng nữa. Nhưng <code>CREATE INDEX</code> vẫn khoá ghi — dùng <code>CREATE INDEX CONCURRENTLY</code>, và nhớ là nó <b>không chạy được bên trong transaction</b>.',
  },
  {
    id: '06', level: 'senior', title: 'Cache Redis ở mức code',
    questions: [
      'Cache-aside viết trong Node thế nào cho đúng?',
      'Sửa dữ liệu rồi mà user vẫn thấy bản cũ, vì sao?',
    ],
    points: [
      'Cache-aside: <code>GET</code> key → trúng thì <code>JSON.parse</code> trả luôn; trượt thì query DB, <code>SET</code> kèm <code>EX</code> rồi trả. Redis chết thì <b>bỏ qua cache, đi thẳng DB</b> — đừng để lỗi Redis giết request.',
      '<b>Key</b> luôn có namespace và version: <code>app:v2:user:123:profile</code>. Đổi cấu trúc dữ liệu thì tăng lên <code>v3</code>, toàn bộ key cũ thành rác rồi tự bị eviction — không phải đi xoá tay.',
      '<b>Luôn có TTL</b>, và cộng thêm jitter ngẫu nhiên để một loạt key không hết hạn cùng một giây. Key không TTL là chỗ để dữ liệu sai nằm lại vĩnh viễn.',
      '<b>Ghi thì xoá key, đừng chỉ đợi TTL.</b> Xoá (<code>DEL</code>) an toàn hơn ghi đè, vì hai request ghi song song có thể set nhầm thứ tự. Và phải xoá <b>sau khi</b> commit, không phải trước.',
      'Khi <b>không</b> nên cache: dữ liệu đổi liên tục (TTL ngắn hơn khoảng cách hai lần đọc thì hit rate gần 0), hoặc query vốn đã 2ms — thêm Redis chỉ là thêm một round-trip mạng.',
    ],
    code: `// ioredis — cache-aside + khoá chống stampede
const KEY = (id: string) => \`app:v2:user:\${id}\`;  // namespace + version
async function getUser(id: string) {
  const hit = await redis.get(KEY(id));
  if (hit) return JSON.parse(hit);
  // ✅ SET NX: chỉ 1 request đi DB, số còn lại chờ rồi đọc lại cache
  const ok = await redis.set(\`lock:\${KEY(id)}\`, '1', 'EX', 5, 'NX');
  if (!ok) { await sleep(50); return getUser(id); }

  const u = await db.user.findUnique({ where: { id } });
  const ttl = 300 + Math.floor(Math.random() * 60);  // jitter chống dồn
  await redis.set(KEY(id), JSON.stringify(u), 'EX', ttl);
  return u;
}
// ✅ ghi xong thì XOÁ key, và phải xoá SAU khi commit transaction`,
    trap: 'Xoá cache <b>trước</b> khi commit là bẫy tinh vi: giữa lúc xoá và lúc commit, một request khác đọc DB thấy giá trị <b>cũ</b> rồi nạp ngược vào cache. Dữ liệu sai nằm đó tới hết TTL mà không ai hiểu vì sao.',
    tip: 'Đo <b>hit rate</b> trước khi quyết định giữ cache — hit rate thấp thì cache chỉ cộng thêm độ trễ và thêm một chỗ để dữ liệu sai lệch. Redis cũng phải có <code>maxmemory</code> và policy <code>allkeys-lru</code>, nếu không sẽ OOM.',
  },
  {
    id: '07', level: 'senior', title: 'Bulk insert · Cursor · Read replica',
    questions: [
      'Import 100k dòng mà Node hết RAM thì xử lý sao?',
      'Query nặng giữ connection cả phút, chặn bằng gì?',
    ],
    points: [
      '<b>Bulk insert</b>: insert từng dòng trong vòng lặp là N round-trip và N transaction ngầm. Gộp thành lô 500–1000 dòng bằng <code>createMany</code>. File thật lớn thì dùng <code>COPY</code>.',
      'Đừng <code>findMany()</code> cả bảng vào RAM. Duyệt bằng <b>cursor</b> (<code>WHERE id &gt; $last ORDER BY id</code>) hoặc stream từng dòng. <code>OFFSET</code> lớn vẫn bắt Postgres đọc rồi vứt bỏ đúng ngần ấy dòng.',
      'Đặt <b><code>statement_timeout</code></b> cho connection của web app (vài giây) để một query đi lạc không giam connection mãi. Job nền thì cấu hình riêng, dài hơn — không dùng chung một giá trị.',
      '<b>Retry có exponential backoff + jitter</b>, nhưng chỉ retry thao tác <b>idempotent</b> và lỗi <b>tạm thời</b> (mất kết nối, deadlock). Retry một <code>INSERT</code> đơn hàng là tạo ra hai đơn.',
      '<b>Read replica</b>: pool thứ hai trỏ vào replica, route query chỉ-đọc sang đó. Bẫy <b>replication lag</b>: ghi xong đọc ngay từ replica sẽ không thấy — vừa ghi thì phải đọc từ primary.',
    ],
    code: `// ❌ pg: 100k round-trip, mỗi dòng một transaction ngầm
for (const r of rows)
  await pool.query('INSERT INTO t(a,b) VALUES ($1,$2)', [r.a, r.b]);
// ✅ Prisma: chia lô 1000 dòng, một câu lệnh cho cả lô
for (const lo of chunk(rows, 1000))
  await prisma.t.createMany({ data: lo, skipDuplicates: true });

// ✅ duyệt bảng lớn bằng cursor — RAM không phình theo số dòng
let last = 0;
for (;;) {
  const { rows: page } = await pool.query(
    'SELECT * FROM t WHERE id > $1 ORDER BY id LIMIT 1000', [last]);
  if (!page.length) break;
  last = page[page.length - 1].id;   // OFFSET lớn thì vẫn đọc rồi bỏ
}`,
    trap: 'Retry mù là bẫy lớn nhất: request timeout <b>không</b> có nghĩa là DB chưa ghi. Rất có thể <code>INSERT</code> đã thành công, chỉ là response không về kịp — retry xong thành hai đơn hàng. Chỉ retry khi thao tác idempotent hoặc có unique key chặn.',
    tip: 'Về replication lag: “read your own writes” là ràng buộc <b>nghiệp vụ</b>, không phải chi tiết kỹ thuật. Sau khi user ghi, route request của chính user đó về primary trong vài giây; phần còn lại vẫn đọc từ replica.',
  },
  {
    id: '08', level: 'senior', title: 'Race condition · Idempotency',
    questions: [
      'Hai request cùng trừ tiền một lúc thì chuyện gì xảy ra?',
      'User bấm nút thanh toán hai lần, chặn thế nào?',
    ],
    points: [
      '<b>Lost update</b>: hai request cùng đọc <code>balance</code> ra 100, cùng trừ 30, cùng ghi 70. Trừ hai lần mà chỉ mất 30. Mọi vòng đọc-sửa-ghi ở tầng app đều có khe hở này.',
      'Cách rẻ nhất là để DB tự tính: <code>SET balance = balance - $2</code> kèm điều kiện <code>WHERE balance &gt;= $2</code>. Một câu, nguyên tử, xong. Xem <code>rowCount</code> bằng 0 là biết không đủ tiền.',
      '<b>Pessimistic</b>: <code>SELECT ... FOR UPDATE</code> trong transaction khoá dòng lại, request thứ hai phải chờ. Đúng nhưng giảm throughput, và dễ deadlock nếu khoá nhiều dòng khác thứ tự.',
      '<b>Optimistic</b>: thêm cột <code>version</code>, update với <code>WHERE id = $1 AND version = $2</code>. <code>rowCount</code> bằng 0 nghĩa là có người sửa trước → đọc lại rồi thử lại. Hợp khi tranh chấp hiếm xảy ra.',
      '<b>Unique constraint</b> là chốt chặn cuối và là chốt duy nhất đáng tin. Kiểm tra “đã tồn tại chưa” bằng <code>SELECT</code> rồi mới <code>INSERT</code> vẫn thua race — cứ <code>INSERT</code> rồi bắt mã lỗi <code>23505</code>.',
    ],
    code: `// ❌ đọc rồi ghi ở tầng app: 2 request song song mất 1 lần trừ
const a = await tx.acc.findUnique({ where: { id } });
await tx.acc.update({ where: { id }, data: { balance: a.balance - n } });

// ✅ pg: để Postgres tự tính — một câu nguyên tử, khỏi cần khoá
const r = await pool.query(
  'UPDATE acc SET balance = balance - $2 WHERE id=$1 AND balance >= $2',
  [id, n]);
if (!r.rowCount) throw new Error('số dư không đủ');

// ✅ idempotency key: lần bấm thứ hai đụng unique index rồi dừng
const p = await pool.query(
  'INSERT INTO pay(key,order_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
  [idemKey, orderId]);
if (!p.rowCount) return ketQuaCu(idemKey);   // trùng key = đã xử lý`,
    trap: 'Kiểm tra bằng <code>SELECT</code> rồi mới <code>INSERT</code> không bao giờ đúng: hai request cùng <code>SELECT</code> thấy trống, cùng <code>INSERT</code>, ra hai bản ghi. Chỉ unique constraint trong DB mới chặn nổi — code ở tầng app thì không.',
    tip: 'Idempotency key nên do <b>client sinh</b> (một UUID gắn với lần bấm nút) và gửi qua header, chứ không phải server tự đoán. Lưu luôn <b>kết quả</b> của lần xử lý đầu, để lần gọi lại trả về đúng response cũ thay vì trả lỗi.',
  },
];
