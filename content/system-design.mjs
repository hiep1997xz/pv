/**
 * Noi dung cum SYSTEM DESIGN — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 * Truong `code` o cum nay chu yeu la so do ASCII / bang so sanh dang text.
 */

export const cover = {
  slug: 'system-design',
  kicker: '( Cẩm nang )',
  title: 'System Design',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Khung trả lời & bài thiết kế thật',
  toc: [
    ['🧭', 'Khung trả lời 4 bước', 'Mid'],
    ['📐', 'Ước lượng QPS · dung lượng · băng thông', 'Mid'],
    ['⚖️', 'Load balancer · app stateless', 'Mid'],
    ['🗃️', 'Cache nhiều tầng · CDN · invalidation', 'Mid'],
    ['💾', 'Chọn DB · index · read replica', 'Mid'],
    ['🔪', 'Sharding & cái giá phải trả', 'Mid'],
    ['📬', 'Message queue · xử lý bất đồng bộ', 'Senior'],
    ['🚦', 'Rate limit · idempotency · retry', 'Senior'],
    ['📰', 'Bài thật: thiết kế News Feed', 'Senior'],
    ['🧱', 'Kiến trúc frontend quy mô lớn', 'Senior'],
    ['🐞', 'Bẫy hay mắc khi vẽ kiến trúc', 'All'],
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
  note: 'Hỏi trước, <em>vẽ sau</em> — không rõ yêu cầu thì<br>kiến trúc nào cũng sai. Nói ra <em>đánh đổi</em>. ♥',
};

export const cards = [
  {
    id: '01', level: 'mid', title: 'Khung trả lời · Ước lượng quy mô',
    questions: [
      'Thiết kế hệ thống rút gọn link, bạn bắt đầu từ đâu?',
      'Ước lượng QPS và dung lượng lưu trữ thế nào?',
    ],
    points: [
      '<b>Bước 1 — làm rõ yêu cầu</b>: ai dùng, chức năng nào bắt buộc, bao nhiêu user, đọc nhiều hay ghi nhiều, yêu cầu latency, chấp nhận trễ vài giây hay phải đúng ngay.',
      '<b>Bước 2 — ước lượng</b>: số request mỗi ngày chia cho 86 400 giây ra QPS trung bình; peak thường lấy gấp 2–3 lần. Luôn nói rõ đây là <b>ước lượng</b>, không phải số đo thật.',
      '<b>Bước 3 — thiết kế cao mức</b>: chốt API chính và data model trước, rồi mới vẽ các khối client → LB → service → cache → DB và luồng dữ liệu đi qua chúng.',
      '<b>Bước 4 — đi sâu 1–2 điểm</b>: người phỏng vấn thường chỉ định chỗ cần đào (sinh ID ngắn, chống hot key…). Mỗi lựa chọn phải kèm <b>đánh đổi</b>, đừng chỉ nêu phương án.',
      'Nói to mọi <b>giả định</b> của bạn. Bị sửa giả định là chuyện bình thường; im lặng tự quyết rồi vẽ một hệ thống sai đề mới là mất điểm.',
    ],
    code: `┌───────────────────────────────────────────────────────────────┐
│ 45 phút phỏng vấn nên chia thế nào                            │
├───────────────────────────────────────────────────────────────┤
│ 1 ▸ Làm rõ yêu cầu        5-8 phút   hỏi trước, đừng vẽ       │
│ 2 ▸ Ước lượng quy mô      ~5 phút    QPS, GB/năm, băng thông  │
│ 3 ▸ Thiết kế cao mức      ~15 phút   API, khối, luồng dữ liệu │
│ 4 ▸ Đi sâu 1-2 điểm       ~10 phút   nói rõ đánh đổi          │
│ 5 ▸ Bottleneck, mở rộng   ~5 phút    tự chỉ ra điểm yếu       │
└───────────────────────────────────────────────────────────────┘
// ví dụ cách nhẩm, nhớ nói rõ "đây là ước lượng"
10 triệu request/ngày ÷ 86 400 ≈ 115 QPS trung bình
peak ≈ 2-3 lần ≈ 300 QPS
1 record 500 byte × 10 triệu/ngày ≈ 5 GB/ngày ≈ 1.8 TB/năm`,
    trap: 'Lỗi số một: nghe đề xong vẽ ngay. Không hỏi câu nào tức là bạn đang thiết kế cho một hệ thống tưởng tượng. Bắt buộc hỏi: quy mô user, đọc hay ghi nặng hơn, latency mong muốn, phạm vi chức năng.',
    tip: 'Viết phần ước lượng ra bảng theo chuỗi DAU → QPS → GB/năm. Sai số lớn không sao; người phỏng vấn chấm <b>cách suy luận</b> và việc bạn dám ra con số, không chấm độ chính xác.',
  },
  {
    id: '02', level: 'mid', title: 'Scale · Load balancer · Stateless',
    questions: [
      'Scale ngang khác scale dọc ở điểm nào?',
      'Vì sao app server bắt buộc phải stateless?',
    ],
    points: [
      '<b>Vertical</b> = nâng cấu hình một máy: nhanh, không đụng code, nhưng có trần phần cứng và vẫn là <b>một điểm chết duy nhất</b>. <b>Horizontal</b> = thêm máy: không trần, đổi lại phải lo state.',
      '<b>Stateless</b> nghĩa là app không giữ dữ liệu phiên trong RAM tiến trình. Request rơi vào máy nào cũng xử lý được → thêm máy, rút máy, deploy hay máy chết đều không mất phiên.',
      'Session đặt ở <b>store dùng chung</b> (Redis) hoặc gói vào <b>JWT</b> phía client. JWT khỏi tra cứu nhưng khó thu hồi trước hạn — phải có TTL ngắn kèm refresh token, hoặc danh sách chặn.',
      '<b>Sticky session</b> ghim user vào một máy: dễ làm nhưng tải lệch, máy chết là mất phiên, auto-scale không rút được máy cũ. Coi nó là giải pháp tạm, không phải kiến trúc.',
      '<b>Health check</b>: LB gọi <code>/health</code> định kỳ, fail vài lần liên tiếp thì rút máy khỏi pool. Thuật toán hay dùng: round robin, least connections, consistent hashing.',
    ],
    code: `              ┌────────────┐
 client ─────▸│     LB     │  // health check, fail 3 lần → rút
              └─────┬──────┘
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌───────┐   ┌───────┐   ┌───────┐  // app stateless: không giữ
    │ app 1 │   │ app 2 │   │ app 3 │  // session trong RAM tiến trình
    └───┬───┘   └───┬───┘   └───┬───┘
        └───────────┼───────────┘
                    ▼
          ┌──────────────────┐
          │  Redis  session  │  // ✅ state dùng chung, máy nào
          └──────────────────┘  //    cũng đọc được phiên của user`,
    trap: 'Đừng trả lời “cứ thêm server là scale được”. Câu vặn ngay sau đó: <b>session đang nằm ở đâu?</b> Nếu session nằm trong RAM từng app thì thêm máy = user bị đăng xuất ngẫu nhiên khi LB đổi đích.',
    tip: 'Tách rõ phần <b>stateless</b> (app) và phần <b>stateful</b> (DB, Redis, file). Scale phần stateless là chuyện dễ; cái khó luôn nằm ở phần stateful — chủ động nói ra chỗ đó là ghi điểm.',
  },
  {
    id: '03', level: 'mid', title: 'Cache nhiều tầng · CDN',
    questions: [
      'Cache-aside và write-through khác nhau ra sao?',
      'Cache stampede là gì, chống bằng cách nào?',
    ],
    points: [
      'Đi từ gần user ra xa: <b>browser cache</b> → <b>CDN</b> → cache trong tiến trình app → <b>Redis</b> dùng chung → DB. Tầng nào chặn được request thì tầng sau đỡ tải bấy nhiêu.',
      '<b>Cache-aside</b>: app đọc cache, miss thì đọc DB rồi ghi ngược lại cache. Đơn giản và phổ biến nhất; nhược điểm là request miss đầu tiên phải chịu trọn độ trễ của DB.',
      '<b>Write-through</b> ghi cache và DB cùng lúc → dữ liệu luôn khớp, ghi chậm hơn. <b>Write-back</b> ghi cache trước rồi flush sau → ghi nhanh nhưng mất dữ liệu nếu cache chết.',
      'Invalidation có hai kiểu: để <b>TTL</b> tự hết hạn (đơn giản, chấp nhận stale trong khoảng TTL) hoặc <b>chủ động xoá key</b> khi ghi. Xoá key an toàn hơn là cập nhật key tại chỗ.',
      '<b>CDN</b> cho ảnh, JS, CSS: nhúng hash vào tên file rồi cache thật lâu với <code>immutable</code>. Riêng HTML để TTL ngắn, vì chính HTML là thứ trỏ tới tên file mới.',
    ],
    code: `browser → CDN → cache in-app → Redis → DB  // càng ra xa càng đắt

// ❌ 10k request cùng miss một key vừa hết hạn → dồn hết vào DB
const v = await redis.get(k);
if (!v) return db.query(k);

// ✅ ioredis: SET key val EX 5 NX — chỉ 1 request đi DB, còn lại chờ
const lock = await redis.set(\`lock:\${k}\`, '1', 'EX', 5, 'NX');
if (!lock) return thuLai(50);            // khoá đang có người giữ
const fresh = await db.query(k);
await redis.set(k, fresh, 'EX', 300 + Math.floor(Math.random() * 60));`,
    trap: 'Nói “thêm cache cho nhanh” mà bỏ qua invalidation là mất điểm. Câu vặn quen thuộc: key hết hạn đúng lúc traffic cao thì sao? → <b>cache stampede</b>, hàng nghìn request cùng lúc đổ thẳng xuống DB.',
    tip: 'Đưa ra chỉ số đo được: <b>hit rate</b>. Hit rate thấp thì cache gần như vô ích mà vẫn cộng thêm một round-trip. Nói kèm TTL, dung lượng bộ nhớ và chính sách eviction (LRU).',
  },
  {
    id: '04', level: 'mid', title: 'Chọn DB · Index · Sharding',
    questions: [
      'Chọn SQL hay NoSQL dựa trên tiêu chí nào?',
      'Sharding theo key nào, đánh đổi những gì?',
    ],
    points: [
      'Chọn theo <b>hình dạng truy vấn</b> và mức nhất quán, không theo mốt. Cần transaction, join, ràng buộc → SQL. Ghi cực lớn, schema linh hoạt, luôn truy vấn theo một key → NoSQL.',
      '<b>Index</b> đổi ghi lấy đọc: duyệt B-tree thay vì full scan nên đọc nhanh, nhưng mỗi index phải cập nhật theo từng lần ghi và tốn dung lượng. Index thừa hại chẳng kém thiếu index.',
      '<b>Read replica</b> gánh tải đọc, nhưng có <b>replication lag</b>: vừa ghi xong đọc ngay ở replica có thể ra dữ liệu cũ. Trường hợp user đọc lại chính thứ mình vừa ghi thì ép đọc ở primary.',
      '<b>Sharding</b> chia dữ liệu theo key: hash để phân bố đều, range để truy vấn theo khoảng. Key phải có <b>cardinality cao</b> và được truy cập đều, nếu không sẽ sinh <b>hot shard</b>.',
      'Cái giá của sharding: join cross-shard coi như không làm được, transaction nhiều shard rất khó, thêm/bớt shard phải resharding. Chỉ shard khi một máy không gánh nổi.',
    ],
    code: `┌─────────────────────┬─────────────────────┬───────────────────────────┐
│ Nhu cầu chính       │ Chọn                │ Vì sao                    │
├─────────────────────┼─────────────────────┼───────────────────────────┤
│ transaction, join   │ PostgreSQL, MySQL   │ ACID, ràng buộc, khoá FK  │
│ ghi lớn theo 1 key  │ Cassandra, DynamoDB │ ghi phân tán, schema mềm  │
│ tìm kiếm full-text  │ Elasticsearch       │ inverted index            │
│ phân tích, thống kê │ ClickHouse          │ lưu theo cột, quét nhanh  │
│ quan hệ nhiều tầng  │ Neo4j               │ duyệt cạnh, khỏi join lồng│
└─────────────────────┴─────────────────────┴───────────────────────────┘
// ✅ shard theo user_id băm ra: đều tay, dữ liệu 1 user nằm 1 chỗ
// ❌ shard theo created_at: shard của tháng hiện tại thành hot shard
// thứ tự nên làm: index ▸ cache ▸ read replica ▸ cuối cùng mới shard`,
    trap: 'Hai câu mất điểm ngay: “dữ liệu lớn nên dùng NoSQL” và “shard từ đầu cho chắc”. Một Postgres cấu hình tử tế gánh được rất nhiều. Nêu đúng thứ tự leo thang: index → cache → read replica → mới tới sharding.',
    tip: 'Nói được <b>composite index</b> khớp tiền tố từ trái sang: index <code>(a, b)</code> phục vụ truy vấn lọc theo <code>a</code>, hoặc theo <code>a</code> và <code>b</code>, nhưng không dùng được nếu chỉ lọc theo <code>b</code>.',
  },
  {
    id: '05', level: 'senior', title: 'Message queue · Xử lý bất đồng bộ',
    questions: [
      'Khi nào nên đẩy việc sang message queue?',
      'At-least-once và exactly-once khác nhau chỗ nào?',
    ],
    points: [
      'Dùng queue cho việc <b>nặng</b>, <b>chậm</b> hoặc <b>được phép trễ</b>: gửi mail, resize ảnh, xuất báo cáo, gọi bên thứ ba. Request trả <code>202 Accepted</code> ngay, worker làm phần còn lại.',
      'Queue còn để <b>giảm chấn</b>: traffic tăng đột biến thì queue phình ra thay vì DB gục. Nhưng queue dài nghĩa là người dùng chờ lâu — phải giám sát <b>consumer lag</b> và cảnh báo sớm.',
      '<b>At-least-once</b> là mặc định thực tế: ack sau khi xử lý xong, worker chết giữa chừng thì message được giao lại → <b>có thể trùng</b>. Vì vậy consumer bắt buộc phải <b>idempotent</b>.',
      '<b>Exactly-once</b> đầu-cuối gần như không tồn tại. Thứ người ta gọi là exactly-once thường là at-least-once cộng khử trùng theo message id. Nói thẳng điều này rất ghi điểm.',
      '<b>DLQ</b> hứng message fail quá số lần retry để không chặn queue chính — phải có alert và công cụ replay. <b>Backpressure</b>: giới hạn prefetch, không kéo message vô hạn về worker.',
    ],
    code: `// ❌ đồng bộ: user ngồi chờ hết mọi việc mới thấy phản hồi
POST /order ─▸ ghi DB ─▸ gọi payment ─▸ gửi mail ─▸ 200  (ví dụ 3.5s)

// ✅ bất đồng bộ: trả về ngay, việc nặng đẩy sang worker
POST /order ─▸ ghi DB ─▸ push 'order.mail' ─▸ 202      (ví dụ 80ms)
                              │
                              ▼
                     ┌────────────────┐
                     │  worker: mail  │──▸ DLQ   // fail quá 3 lần
                     └────────────────┘

// consumer idempotent: message giao lại lần hai cũng vô hại
if (await daXuLy(msg.id)) return ack(msg);
await xuLy(msg); await ghiNhan(msg.id); return ack(msg);`,
    trap: 'Trả lời “dùng Kafka là có exactly-once” là sập bẫy. Hỏi vặn ngay: worker xử lý xong nhưng chết <b>trước khi ack</b> thì sao? → message được giao lại, khách bị trừ tiền hai lần nếu consumer không idempotent.',
    tip: 'Phân biệt queue và log: RabbitMQ hay SQS lấy message ra là mất, hợp với task. Kafka giữ log theo <b>offset</b>, nhiều consumer group đọc lại được — hợp với event streaming và nhu cầu replay.',
  },
  {
    id: '06', level: 'senior', title: 'Rate limit · Idempotency · Retry',
    questions: [
      'Token bucket khác sliding window ở điểm nào?',
      'Làm sao để API thanh toán không trừ tiền hai lần?',
    ],
    points: [
      '<b>Token bucket</b>: bucket chứa N token, đổ lại r token mỗi giây, mỗi request tiêu 1 token. Cho phép <b>burst</b> tới N mà vẫn giữ tốc độ trung bình r. Nhẹ, mỗi key chỉ lưu 2 con số.',
      '<b>Fixed window</b> dễ làm nhưng thủng ở mép: dồn request vào cuối phút này và đầu phút sau, trong ~1 giây có thể lọt gấp đôi hạn mức. <b>Sliding window</b> chính xác hơn, tốn bộ nhớ hơn.',
      'Đặt ở đâu: CDN hoặc WAF chặn tấn công lớp mạng, API gateway chặn theo API key, service chặn theo nghiệp vụ. Vượt hạn mức thì trả <b>429</b> kèm header <code>Retry-After</code>.',
      '<b>Idempotency key</b>: client sinh UUID gửi kèm request tạo đơn hay thanh toán. Server lưu key cùng kết quả; key trùng thì trả lại kết quả cũ chứ không thực hiện lần hai.',
      'Retry phải có <b>exponential backoff + jitter</b> và giới hạn số lần. Chỉ retry lỗi tạm thời (timeout, 5xx, 429); lỗi 4xx thì retry bao nhiêu lần cũng vẫn sai, chỉ tốn thêm tải.',
    ],
    code: `// ✅ backoff mũ + jitter: các client không retry cùng một nhịp
async function goiLai(fn, max = 3) {
  for (let i = 0; i < max; i++) {
    try { return await fn(); }
    catch (e) {
      if (e.status < 500 && e.status !== 429) throw e;  // 4xx: bỏ luôn
      const base = 2 ** i * 100;                        // 100, 200, 400
      await nghi(base + Math.random() * base);          // jitter
    }
  }
  throw new Error('hết lượt retry, mở circuit breaker');
}
// ❌ retry đều tay, không jitter: dịch vụ vừa hồi phục đã bị
// cả ngàn client đập lại cùng lúc → sập tiếp (retry storm)`,
    trap: 'Retry mù là nguyên nhân kinh điển gây sập dây chuyền: service chậm → client retry → tải tự nhân lên nhiều lần → service chết hẳn. Thiếu jitter thì mọi client cùng thức dậy tại một mốc thời gian.',
    tip: 'Nhắc <b>circuit breaker</b>: tỉ lệ lỗi vượt ngưỡng thì mở mạch, fail nhanh một lúc rồi chuyển sang nửa mở để thăm dò. Ghép với <code>Retry-After</code> ở 429 để client biết chờ bao lâu thay vì đoán.',
  },
  {
    id: '07', level: 'senior', title: 'Thiết kế News Feed',
    questions: [
      'Fan-out on write hay on read, bạn chọn cái nào?',
      'Người có 10 triệu follower đăng bài thì xử lý sao?',
    ],
    points: [
      '<b>Fan-out on write</b>: đăng bài là ghi ngay vào feed cache của từng follower. Đọc feed cực nhanh vì chỉ một lần đọc, nhưng một bài của người 1 triệu follower thành 1 triệu lần ghi.',
      '<b>Fan-out on read</b>: lúc đọc mới gom bài của những người đang follow rồi trộn lại. Ghi rất nhẹ, đọc nặng và chậm. Hợp với user follow ít người hoặc hệ thống ghi nhiều hơn đọc.',
      '<b>Kiểu lai</b> là câu trả lời thực dụng: fan-out on write cho user thường, còn <b>celebrity</b> thì không fan-out — lúc đọc mới trộn bài của họ vào. Đây là cách gỡ bài toán hot key.',
      'Phân trang bằng <b>cursor</b> (id hoặc timestamp của item cuối), không dùng <code>OFFSET</code>: bài mới chèn lên đầu làm offset lệch → trang sau bị lặp item hoặc nhảy cóc mất item.',
      'Feed lưu ở Redis dạng list hoặc sorted set, mỗi user chỉ giữ vài trăm item gần nhất, cũ hơn thì đọc từ DB. Ranking tính điểm rồi sắp lại, và nên tách khỏi đường đọc nóng.',
    ],
    code: `// ✅ lai: user thường fan-out lúc ghi, celebrity trộn lúc đọc
POST /post ─┬─ follower ít  ─▸ ghi feed:<uid> cho từng follower
            └─ celebrity    ─▸ không fan-out, chỉ lưu bảng posts
GET  /feed ──▸ đọc feed:<me> ─▸ trộn bài celebrity ─▸ rank ─▸ trả

// ❌ OFFSET: bài mới chèn lên đầu → trang sau trùng hoặc nhảy cóc
SELECT id, body FROM posts ORDER BY id DESC LIMIT 20 OFFSET 40;

// ✅ cursor: neo vào id của item cuối trang trước, chèn thêm vẫn đúng
SELECT id, body FROM posts WHERE id < :last ORDER BY id DESC LIMIT 20;`,
    trap: 'Chọn một chiều rồi bảo vệ tới cùng là mất điểm. Người phỏng vấn sẽ hỏi “tài khoản 10 triệu follower đăng bài thì sao?” — chỉ fan-out on write là ghi 10 triệu bản cho một bài. Câu trả lời đúng là kiểu lai.',
    tip: 'Ra con số để biện minh cho cache, nói rõ là giả định: giả sử 100 triệu DAU, mỗi người mở feed 10 lần/ngày ≈ 1 tỷ lượt đọc/ngày ≈ 11 000 QPS trung bình, peak gấp 2–3 lần.',
  },
  {
    id: '08', level: 'senior', title: 'Kiến trúc frontend quy mô lớn',
    questions: [
      'Khi nào micro-frontend thật sự đáng dùng?',
      'BFF giải quyết vấn đề gì cho team frontend?',
    ],
    points: [
      '<b>Micro-frontend</b> chỉ đáng khi nhiều team cần <b>deploy độc lập</b> trên cùng một sản phẩm. Với một team thì nó chỉ thêm việc: nhiều pipeline, trùng dependency, khó debug xuyên app.',
      '<b>Module federation</b> (Webpack 5, Rspack) cho phép app này nạp bundle app kia lúc chạy, chia sẻ dependency. React phải khai báo <b>singleton</b>, nếu không sẽ có hai bản React cùng lúc.',
      '<b>Design system</b> dùng chung là điều kiện bắt buộc: token màu và khoảng cách, component headless, phát hành theo <b>semver</b>. Thiếu nó thì mỗi micro-frontend một kiểu giao diện.',
      '<b>BFF</b> — mỗi loại client một backend riêng, gộp nhiều service thành đúng payload màn hình cần. Client hết gọi N+1, và frontend đổi payload không phải chờ team backend.',
      'Versioning: thêm field thì tương thích ngược; xoá hoặc đổi nghĩa field là <b>breaking</b> → ra <code>/v2</code>, chạy song song. Rollout bằng <b>feature flag</b> + canary, tách deploy khỏi release.',
    ],
    code: `              ┌───────────────┐
 web    ─────▸│   BFF (web)   │──┐   // mỗi client một payload riêng
              └───────────────┘  │
                                 ├──▸ user-svc ▸ order-svc ▸ price-svc
              ┌───────────────┐  │
 mobile ─────▸│ BFF (mobile)  │──┘   // client gọi 1 lần, hết N+1
              └───────────────┘

// ✅ module federation (Webpack 5): remote + React để singleton
remotes: { cart: 'cart@https://cdn.example.com/cart/remoteEntry.js' },
shared:  { react: { singleton: true, requiredVersion: '^18.3.0' } },

// ✅ tách deploy khỏi release: bật dần bằng cờ, tắt cờ là rollback
if (flags.on('checkout-v2', user)) return <CheckoutV2 />;
return <CheckoutV1 />;            // rollout 1% ▸ 10% ▸ 100%`,
    trap: 'Đề xuất micro-frontend cho một team 5 người là mất điểm ngay: chi phí build, chia sẻ state, trùng dependency lớn hơn hẳn lợi ích. Tiêu chí thật là <b>số team cần deploy độc lập</b>, không phải codebase to.',
    tip: 'Nêu chỉ số thay vì cảm tính: LCP, INP, kích thước bundle, tỉ lệ lỗi JS. Mọi thay đổi kiến trúc frontend nên chứng minh được bằng một trong các số đó, đo trên người dùng thật bằng RUM.',
  },
];
