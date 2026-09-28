/**
 * Noi dung cum NODEJS — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'nodejs',
  kicker: '( Cẩm nang )',
  title: 'Node.js',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Backend từ cơ bản đến production',
  toc: [
    ['🔁', 'Event loop phía Node · các phase', 'Junior'],
    ['📦', 'Module · Config · Biến môi trường', 'Junior'],
    ['🧯', 'Async & xử lý lỗi cho đúng chỗ', 'Mid'],
    ['🌐', 'HTTP server · Middleware · Validate', 'Mid'],
    ['🔐', 'Authentication & Authorization', 'Mid'],
    ['🚰', 'Stream · Backpressure · File lớn', 'Mid'],
    ['🧵', 'cluster · worker_threads · Stateless', 'Senior'],
    ['🛑', 'Graceful shutdown & Health check', 'Senior'],
    ['📈', 'Hiệu năng · Memory leak · Profiling', 'Senior'],
    ['🪵', 'Logging · Correlation id · Timeout', 'Senior'],
    ['🐞', 'Bẫy phỏng vấn Node hay gặp nhất', 'All'],
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
  note: 'Node không phải <em>đa luồng nên khỏi lo</em> — một luồng<br>chạy JS, chặn nó là chặn cả server. Nhớ được là qua nửa buổi. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Event loop phía Node · các phase',
    questions: [
      'setImmediate và setTimeout(fn, 0) khác nhau chỗ nào?',
      'process.nextTick chạy trước hay sau Promise.then?',
    ],
    points: [
      'Mỗi vòng lặp đi qua các phase theo thứ tự cố định: <b>timers</b> → pending callbacks → idle/prepare → <b>poll</b> → <b>check</b> → close callbacks, rồi quay lại từ đầu.',
      '<code>setTimeout</code> chạy ở phase <b>timers</b>, <code>setImmediate</code> ở phase <b>check</b>. Đang trong một I/O callback (tức đang ở phase poll) thì <code>setImmediate</code> <b>luôn</b> chạy trước.',
      'Ở top level thứ tự cặp đó <b>không bảo đảm</b>: còn tuỳ lúc event loop tới phase timers thì 1ms đã trôi qua chưa. Script 2 dòng chạy 100 lần sẽ ra cả hai thứ tự.',
      '<code>process.nextTick</code> có queue riêng và được vét <b>trước</b> microtask của Promise. Cả hai queue đều vét sau mỗi callback, không phải chỉ vét giữa các phase.',
      'Node chỉ có <b>một luồng</b> chạy JS. Một vòng <code>for</code> nặng hay <code>JSON.parse</code> file 50MB là <b>chặn cả server</b> — mọi request khác nằm chờ, kể cả health check.',
    ],
    code: `const fs = require('node:fs');      // .cjs — output thật ở dưới
setTimeout(() => console.log('timeout'), 0);     // phase timers
setImmediate(() => console.log('immediate'));    // phase check
// ❌ ở top level thứ tự cặp trên KHÔNG bảo đảm, đừng dựa vào nó

fs.readFile(__filename, () => {                  // callback ở phase poll
  setTimeout(() => console.log('t2'), 0);
  setImmediate(() => console.log('i2'));
  // ✅ trong I/O callback: i2 LUÔN chạy trước t2
});

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// ✅ ba dòng trên in ra:  sync  →  nextTick  →  promise`,
    trap: 'Nhiều người tưởng “Node bất đồng bộ nên không bao giờ bị chặn”. Sai: chỉ <b>I/O</b> mới bất đồng bộ, code JS của bạn vẫn chạy một luồng. Một vòng lặp nặng làm p99 của <b>mọi</b> endpoint khác tăng theo.',
    tip: 'Chi tiết ghi điểm: ở <b>top level của file ESM</b>, <code>nextTick</code> lại chạy <b>sau</b> <code>Promise.then</code>, vì việc đánh giá module ESM vốn đã nằm trong một promise job. Trong CommonJS và trong mọi callback thì nextTick vẫn trước.',
  },
  {
    id: '02', level: 'junior', title: 'Module · Cấu hình · Biến môi trường',
    questions: [
      'CommonJS và ESM khác nhau ra sao khi chạy trong Node?',
      'Config đọc từ env thì validate ở đâu và lúc nào?',
    ],
    points: [
      '<b>CommonJS</b>: <code>require</code> đồng bộ, nạp lúc chạy, <code>module.exports</code> là object sửa được. <b>ESM</b>: <code>import</code> tĩnh, phân tích lúc parse, binding là <b>live</b> và chỉ đọc.',
      'Node chọn loại theo đuôi file và <code>"type"</code> trong package.json: <code>.mjs</code> luôn ESM, <code>.cjs</code> luôn CommonJS, <code>.js</code> thì theo <code>"type": "module"</code> có hay không.',
      'ESM <code>import</code> được CommonJS; chiều ngược lại phải dùng <code>await import()</code>. Trong ESM không có <code>__dirname</code> — thay bằng <code>import.meta.dirname</code>.',
      'Trường <code>"exports"</code> khai báo <b>điểm vào công khai</b> của package và <b>chặn</b> import sâu vào file nội bộ, nhờ vậy đổi cấu trúc thư mục không làm vỡ người dùng.',
      'Đọc env <b>một lần</b> lúc khởi động, validate rồi <code>Object.freeze</code>. Thiếu biến thì <b>thoát ngay</b> (fail fast) — thà chết lúc deploy còn hơn 500 lúc 2 giờ sáng.',
    ],
    code: `// package.json: { "type": "module", "exports": "./src/index.js" }
const need = ['DATABASE_URL', 'JWT_SECRET'];
const missing = need.filter((k) => !process.env[k]);

if (missing.length) {
  console.error('Thiếu biến môi trường: ' + missing.join(', '));
  process.exit(1);        // ✅ fail fast, chết ngay lúc khởi động
}

export const config = Object.freeze({
  port: Number(process.env.PORT ?? 3000),
  dbUrl: process.env.DATABASE_URL,
  isProd: process.env.NODE_ENV === 'production',
});
// ❌ rải process.env khắp code → thiếu biến, vào nhánh đó mới nổ`,
    trap: 'File <code>.env</code> chỉ dành cho máy local và <b>không bao giờ</b> commit; production dùng secret của nền tảng. Hỏi vặn hay gặp: “lỡ commit rồi thì sao?” → xoá khỏi repo là chưa đủ, phải <b>rotate</b> toàn bộ key đã lộ.',
    tip: 'Gom mọi biến vào <b>một module config duy nhất</b>: chỉ chỗ đó biết tên biến, test thì thay config rất dễ, và lỗi thiếu biến lộ ra ngay lúc boot. Từ Node 20 đã có <code>--env-file</code> sẵn, không cần dotenv nữa.',
  },
  {
    id: '03', level: 'mid', title: 'Async · Lỗi · Error middleware',
    questions: [
      'Vì sao try/catch không bắt được lỗi trong callback?',
      'Gặp uncaughtException thì nên xử lý thế nào?',
    ],
    points: [
      '<code>try/catch</code> chỉ bao được phần chạy <b>đồng bộ</b> bên trong nó. Callback của <code>setTimeout</code> hay của stream chạy ở tick sau, lúc đó stack cũ đã tan — lỗi bay thẳng ra ngoài.',
      'Với <code>async/await</code> thì <code>try/catch</code> lại bắt được, nhưng bắt buộc phải có <code>await</code>. Quên <code>await</code> là promise reject lọt ra thành <code>unhandledRejection</code>.',
      'Express 4 <b>không</b> tự bắt promise reject trong handler: phải <code>.catch(next)</code> hoặc bọc bằng một hàm wrapper. Express 5 thì bắt được, nên hỏi rõ phiên bản trước khi trả lời.',
      'Error middleware của Express phải khai báo <b>đủ 4 tham số</b> <code>(err, req, res, next)</code> — thiếu một cái là Express coi nó như middleware thường và không bao giờ gọi tới.',
      '<code>uncaughtException</code> nghĩa là process đang ở trạng thái <b>không xác định</b>. Đúng bài: ghi log, đóng kết nối, rồi <code>process.exit(1)</code> để orchestrator dựng lại bản sạch.',
    ],
    code: `// ❌ try/catch không với tới callback chạy ở tick sau
try {
  setTimeout(() => { throw new Error('boom'); }, 0);
} catch (e) { console.log('không bao giờ vào đây'); }

// ✅ error middleware của Express: bắt buộc đủ 4 tham số
app.use((err, req, res, next) => {
  logger.error({ err, reqId: req.id });
  res.status(err.status ?? 500).json({ error: 'Lỗi hệ thống' });
});
process.on('unhandledRejection', (reason) => { throw reason; });
process.on('uncaughtException', (err) => {
  logger.fatal({ err });
  process.exit(1);     // ✅ ghi log rồi THOÁT, không chạy tiếp
});`,
    trap: 'Tưởng bắt <code>uncaughtException</code> rồi chạy tiếp là app “sống sót”. Không — nó chỉ giấu lỗi: kết nối có thể đang treo, biến đang dở dang, rò rỉ tích dần. Restart sạch luôn an toàn hơn chạy tiếp trong trạng thái hỏng.',
    tip: 'Phân biệt <b>operational error</b> (DB timeout, input sai — xử lý rồi trả lỗi cho client) với <b>programmer error</b> (đọc thuộc tính của <code>undefined</code> — để nó nổ và restart). Trộn hai loại này là nguồn gốc của bug khó tìm.',
  },
  {
    id: '04', level: 'mid', title: 'HTTP server · Middleware · Validate',
    questions: [
      'Thứ tự đăng ký middleware ảnh hưởng thế nào?',
      'Khi nào trả 401, khi nào 403, khi nào 422?',
    ],
    points: [
      'Middleware là một <b>chuỗi</b> chạy đúng theo thứ tự <code>app.use</code>. Không gọi <code>next()</code> mà cũng không trả response thì request <b>treo</b> tới khi client timeout.',
      'Parse body phải đăng ký <b>trước</b> route, error middleware phải đăng ký <b>sau cùng</b>. Đặt nhầm chỗ là <code>req.body</code> thành <code>undefined</code>, hoặc lỗi không ai bắt.',
      'Validate ở <b>biên</b> bằng schema (zod, Valibot): từ handler trở vào coi như dữ liệu đã sạch và đúng kiểu. Luôn đặt <code>limit</code> cho body để chặn payload khổng lồ.',
      'Status code: <b>400</b> body sai cú pháp · <b>401</b> chưa đăng nhập · <b>403</b> đã đăng nhập nhưng không đủ quyền · <b>404</b> không tồn tại · <b>409</b> xung đột · <b>422</b> đúng cú pháp nhưng sai nghiệp vụ.',
      '<b>CORS</b> là cơ chế của <b>trình duyệt</b> nhưng phải sửa ở <b>server</b> bằng header. Liệt kê origin cụ thể; đã bật <code>credentials</code> thì <b>không được</b> để origin là <code>*</code>.',
    ],
    code: `const app = express();
app.use(express.json({ limit: '100kb' }));  // ✅ parse body TRƯỚC route

const Body = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
});

app.post('/users', async (req, res) => {
  const p = Body.safeParse(req.body);
  if (!p.success) return res.status(400).json(p.error.issues);
  if (await exists(p.data.email)) return res.status(409).end();
  res.status(201).json(await create(p.data));
});
app.use(errorHandler);     // ✅ error middleware đăng ký SAU CÙNG`,
    trap: 'Câu vặn hay gặp: “thêm <code>cors()</code> rồi mà trình duyệt vẫn chặn?” → thường là request <b>preflight</b> <code>OPTIONS</code> bị một route khác hoặc auth middleware nuốt trước, nên header CORS không kịp gắn vào response.',
    tip: 'So sánh Express với <b>Fastify</b>: Fastify nhanh hơn chủ yếu nhờ tuần tự hoá JSON theo schema đã biên dịch sẵn, và validate bằng JSON Schema là một phần của framework chứ không phải thư viện gắn thêm.',
  },
  {
    id: '05', level: 'mid', title: 'Authentication & Authorization',
    questions: [
      'Session và JWT khác nhau, chọn cái nào và vì sao?',
      'Vì sao không được hash mật khẩu bằng SHA-256?',
    ],
    points: [
      '<b>Session</b>: server giữ trạng thái, thu hồi tức thì bằng cách xoá bản ghi. <b>JWT</b>: stateless, server chỉ kiểm chữ ký — đổi lại <b>rất khó thu hồi</b> trước khi token hết hạn.',
      'Cách làm thực tế: access token sống ngắn (5–15 phút) cộng refresh token dài hạn <b>lưu trong DB</b> để thu hồi được. Đăng xuất là xoá refresh token, không xoá được access token.',
      'Lưu token trong cookie <code>httpOnly</code> kèm <code>Secure</code> và <code>SameSite</code> — JS không đọc được nên XSS khó lấy. Để ở <code>localStorage</code> thì một lỗ XSS là mất sạch.',
      'Mật khẩu phải hash bằng thuật toán <b>chậm có chủ đích</b>: bcrypt, scrypt hoặc argon2, và có <b>salt</b> riêng từng người. SHA-256 thiết kế để nhanh, GPU dò hàng tỉ mật khẩu mỗi giây.',
      'Phân quyền kiểm ở <b>server</b>, trên từng request — ẩn nút trên UI chỉ là trang trí. Endpoint đăng nhập phải có <b>rate limit</b> theo cả IP lẫn tài khoản để chặn dò mật khẩu.',
    ],
    code: `// ❌ SHA-256 quá nhanh → GPU dò hàng tỉ mật khẩu mỗi giây
const bad = createHash('sha256').update(pw).digest('hex');

// ✅ bcrypt tự sinh salt riêng; cost 12 = chậm có chủ đích
const hash = await bcrypt.hash(pw, 12);
const ok = await bcrypt.compare(pw, user.passwordHash);

const access = jwt.sign({ sub: user.id, role: user.role },
  process.env.JWT_SECRET, { expiresIn: '15m' });

res.cookie('rt', refreshToken, {   // ✅ JS phía client không đọc được
  httpOnly: true, secure: true, sameSite: 'strict', path: '/auth',
});`,
    trap: 'Bẫy kinh điển: nhét <code>role</code> vào JWT rồi tin nó mãi. Hạ quyền một user xong, token cũ vẫn mang <code>role: "admin"</code> cho tới lúc hết hạn. Thao tác nhạy cảm phải tra lại quyền trong DB, đừng đọc từ payload.',
    tip: 'Nhắc <b>timing attack</b>: khi email không tồn tại vẫn nên chạy một lần so sánh hash giả rồi trả đúng một thông báo chung “sai email hoặc mật khẩu” — tránh để kẻ tấn công dò ra email nào có thật trong hệ thống.',
  },
  {
    id: '06', level: 'mid', title: 'Stream · Backpressure · File lớn',
    questions: [
      'Backpressure trong stream là gì và ai lo chuyện đó?',
      'Vì sao nên dùng pipeline thay cho chuỗi .pipe()?',
    ],
    points: [
      'Bốn loại: <b>Readable</b> (nguồn), <b>Writable</b> (đích), <b>Duplex</b> (hai chiều, ví dụ socket), <b>Transform</b> (duplex có biến đổi, ví dụ gzip hoặc parse CSV).',
      '<b>Backpressure</b>: khi đích ghi chậm hơn nguồn đọc, <code>write()</code> trả về <code>false</code>, nguồn phải ngừng đọc và chờ sự kiện <code>drain</code>. Bỏ qua tín hiệu này là dữ liệu dồn hết trong RAM.',
      '<code>fs.readFile</code> nạp <b>toàn bộ</b> file vào một Buffer. File 2GB thì vừa đụng trần heap, vừa chặn event loop lúc cấp phát, và chỉ vài request song song là hết RAM máy.',
      '<code>pipeline()</code> lo <b>lỗi</b> và <b>dọn dẹp</b>: một khâu hỏng thì mọi stream trong chuỗi bị destroy. Chuỗi <code>.pipe()</code> thì nguồn <b>vẫn mở</b> khi đích lỗi, rò dần file descriptor.',
      'Bản trong <code>stream/promises</code> cho phép <code>await pipeline(...)</code>, ghép với <code>try/catch</code> như code bình thường. Truyền thêm <code>signal</code> để huỷ khi client ngắt kết nối.',
    ],
    code: `import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

// ❌ readFile (fs/promises) nạp cả 2GB vào Buffer → đụng trần heap
const buf = await readFile('big.csv');
res.end(buf);

// ✅ chảy theo từng chunk, RAM gần như không đổi dù file to cỡ nào
try {
  await pipeline(createReadStream('big.csv'), createGzip(),
                 createWriteStream('big.csv.gz'));
} catch (err) {
  // pipeline đã destroy sạch mọi stream trong chuỗi trước khi ném ra
}`,
    trap: 'Hỏi vặn: “<code>.pipe()</code> có lo backpressure không?” → <b>Có</b>, backpressure thì <code>.pipe()</code> lo được. Thứ nó <b>không</b> lo là <b>lỗi</b>: đích hỏng thì nguồn không được đóng, file descriptor rò dần tới lúc cạn.',
    tip: 'Trong HTTP, <code>req</code> là Readable còn <code>res</code> là Writable — upload lớn thì cho <code>pipeline</code> nối thẳng <code>req</code> sang <code>createWriteStream</code>, khỏi giữ file trong RAM. Tăng <code>highWaterMark</code> khi throughput quan trọng hơn độ trễ.',
  },
  {
    id: '07', level: 'senior', title: 'Scale · cluster · Graceful shutdown',
    questions: [
      'cluster và worker_threads khác nhau thế nào?',
      'Graceful shutdown gồm những bước nào theo thứ tự?',
    ],
    points: [
      '<code>cluster</code> fork ra <b>nhiều process</b>, mỗi process một event loop và một vùng nhớ riêng, cùng chia tải trên một cổng. Dùng để tận dụng hết nhân CPU cho tải <b>I/O-bound</b>.',
      '<code>worker_threads</code> tạo <b>thread</b> trong cùng process, chia sẻ được bộ nhớ qua <code>SharedArrayBuffer</code>. Dùng cho việc <b>CPU-bound</b>: resize ảnh, nén, hash, tính toán nặng.',
      'Chọn sai là mất điểm: việc nặng CPU mà chỉ fork thêm process thì từng process vẫn đơ; việc I/O mà tạo thread thì tốn công vô ích, vì I/O đã bất đồng bộ sẵn.',
      'App phải <b>stateless</b>: session, cache, hàng đợi job đẩy ra Redis hay DB. Giữ trong RAM thì mỗi worker một bản khác nhau, scale lên 3 pod là user đăng nhập lúc được lúc không.',
      '<b>Graceful shutdown</b> khi nhận <code>SIGTERM</code>: (1) health check trả fail, (2) ngừng nhận kết nối mới, (3) đợi request đang chạy xong, (4) đóng pool DB, (5) hết deadline thì thoát cứng.',
    ],
    code: `import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
if (cluster.isPrimary) {
  for (let i = 0; i < availableParallelism(); i++) cluster.fork();
  cluster.on('exit', () => cluster.fork());  // worker chết thì dựng lại
} else {
  const server = app.listen(3000);
  process.on('SIGTERM', () => {
    ready = false;                  // ✅ readiness fail trước vài giây
    server.close(async () => {      // ngừng nhận kết nối mới
      await pool.end(); process.exit(0);   // đóng pool DB rồi thoát
    });
    setTimeout(() => process.exit(1), 15_000).unref();  // deadline
  });
}`,
    trap: 'Bỏ qua <code>SIGTERM</code> thì Kubernetes chờ hết grace period rồi <code>SIGKILL</code>: request đang dở bị cắt ngang, transaction treo. Trong Docker, tiến trình Node còn phải là <b>PID 1</b> hoặc có init, không thì signal chẳng tới nơi.',
    tip: 'Phân biệt <b>liveness</b> (process còn sống — hỏng thì restart) với <b>readiness</b> (sẵn sàng nhận traffic — hỏng thì chỉ rút khỏi load balancer). Để liveness gọi thẳng vào DB là sai: một hiccup của DB sẽ restart cả cụm.',
  },
  {
    id: '08', level: 'senior', title: 'Hiệu năng · Memory leak · Quan sát',
    questions: [
      'App chậm mà CPU thấp, bạn tìm nguyên nhân thế nào?',
      'Memory leak trong Node thường đến từ đâu?',
    ],
    points: [
      'Đo trước, tối ưu sau. Bốn số cần nhìn: <b>event loop lag</b>, p95/p99 theo từng endpoint, RSS và heap used, số kết nối đang xếp hàng chờ trong pool DB.',
      '<code>monitorEventLoopDelay</code> cho biết event loop bị giữ bao lâu. p99 lag vài trăm ms nghĩa là có việc đồng bộ nặng — thường là <code>JSON.parse</code>, regex tham lam, hoặc vòng lặp trên mảng to.',
      'Nguồn leak hay gặp: cache toàn cục chỉ thêm không xoá, <code>emitter.on</code> đăng ký lại mỗi request mà quên <code>off</code>, closure giữ tham chiếu tới object lớn, timer không <code>clearInterval</code>.',
      'Bắt leak bằng <b>heap snapshot</b>: chụp hai lần cách nhau rồi so phần tăng thêm trong Chrome DevTools. <code>v8.writeHeapSnapshot()</code> chụp được ngay trên production, không cần dựng lại.',
      '<b>Structured logging</b> (JSON) kèm <b>correlation id</b> đi theo request qua mọi service. Dùng <code>AsyncLocalStorage</code> để khỏi phải nhét id vào chữ ký của mọi hàm.',
    ],
    code: `import { monitorEventLoopDelay } from 'node:perf_hooks';
import { AsyncLocalStorage } from 'node:async_hooks';
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
setInterval(() => {
  console.log({ lagP99ms: +(h.percentile(99) / 1e6).toFixed(1) });
  h.reset();
}, 10_000).unref();

const als = new AsyncLocalStorage();   // correlation id đi theo request
app.use((req, res, next) =>
  als.run({ reqId: req.get('x-request-id') ?? randomUUID() }, next));

// ✅ mọi lời gọi ra ngoài đều phải có hạn, nếu không sẽ treo vô hạn
await fetch(url, { signal: AbortSignal.timeout(3000) });`,
    trap: 'Đừng nói “RSS tăng là leak”. V8 chỉ gom rác khi thấy cần, RSS lên rồi phẳng ra là bình thường. Leak thật là heap used <b>sau full GC</b> vẫn tăng đều qua nhiều giờ — ép GC rồi mới đo thì kết luận mới đứng được.',
    tip: '<code>AbortSignal.timeout</code> là cách ngắn nhất để mọi lời gọi ra ngoài đều có hạn. Thiếu timeout thì một dependency chậm sẽ giữ hết kết nối trong pool và kéo sập cả những endpoint chẳng liên quan gì tới nó.',
  },
];
