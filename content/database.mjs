/**
 * Noi dung cum DATABASE — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 * Mac dinh PostgreSQL. Cum nay ban o muc THIET KE SCHEMA va VAN HANH,
 * khong lap lai phan chon DB / sharding / read replica cua cum system-design.
 */

export const cover = {
  slug: 'database',
  kicker: '( Cẩm nang )',
  title: 'Database',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Thiết kế schema & vận hành',
  toc: [
    ['🔑', 'Chuẩn hoá · Khoá chính · Khoá ngoại', 'Junior'],
    ['🧮', 'Kiểu dữ liệu · tiền · thời gian · jsonb', 'Junior'],
    ['🔗', 'Mô hình hoá 1-1 · 1-n · n-n', 'Mid'],
    ['🗑️', 'Soft delete & cột audit', 'Mid'],
    ['📊', 'Phi chuẩn hoá & materialized view', 'Mid'],
    ['🚚', 'Migration an toàn trên production', 'Mid'],
    ['🛡️', 'Ràng buộc: NOT NULL · UNIQUE · CHECK', 'Mid'],
    ['🧬', 'Replication & replication lag', 'Senior'],
    ['💾', 'Backup · khôi phục · PITR', 'Senior'],
    ['🧩', 'Khi nào không dùng quan hệ · CAP', 'Senior'],
    ['🐞', 'Bẫy phỏng vấn hay gặp nhất', 'All'],
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
  note: 'Code sai thì <em>sửa rồi deploy</em> — schema sai thì<br>phải migrate cả núi dữ liệu. Nghĩ kỹ trước. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Chuẩn hoá · Khoá chính · Khoá ngoại',
    questions: [
      'Chuẩn hoá 1NF, 2NF, 3NF nói gọn là gì?',
      'Nên dùng ID tự tăng hay UUID làm khoá chính?',
    ],
    points: [
      '<b>1NF</b>: mỗi ô một giá trị, đừng nhét <code>"a,b,c"</code> vào một cột. <b>2NF</b>: cột thường phải phụ thuộc <b>cả</b> khoá chính. <b>3NF</b>: cột thường không phụ thuộc cột thường khác.',
      'Mục đích thật của chuẩn hoá: <b>mỗi sự thật chỉ lưu một chỗ</b>, sửa một nơi là xong, không có hai bản sao lệch nhau. Cái giá phải trả là query phải join nhiều hơn.',
      '<b>PK tự tăng</b> (<code>identity</code>, <code>bigserial</code>): 8 byte, ghi tuần tự nên index gọn — nhưng đoán được và lộ quy mô. <b>UUID</b> không đoán được, sinh được ở client, đổi lại 16 byte.',
      '<b>FK</b> giữ <b>toàn vẹn tham chiếu</b>: không tạo được dòng con trỏ tới cha không tồn tại, và không xoá được cha khi con còn treo. Đây là thứ tầng app không tự đảm bảo nổi.',
      '<code>ON DELETE CASCADE</code> xoá cha là con bay theo — tiện nhưng phá dữ liệu âm thầm. <code>RESTRICT</code> chặn lại, bắt bạn xử lý tay. Mặc định nên chọn <code>RESTRICT</code>.',
    ],
    code: `CREATE TABLE users (
  id     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email  text NOT NULL UNIQUE
);

CREATE TABLE orders (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  bigint NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total    numeric(12,2) NOT NULL
);

// ❌ CASCADE: xoá 1 user là bay sạch đơn hàng, sổ sách hết đối soát
//   user_id bigint REFERENCES users(id) ON DELETE CASCADE
// ✅ RESTRICT: muốn xoá user thì phải xử lý đơn hàng trước đã`,
    trap: '<code>ON DELETE CASCADE</code> qua nhiều tầng bảng: xoá một tenant kéo cascade xuống hàng chục bảng con, khoá lâu và <b>không hoàn tác được</b>. Đường lui duy nhất là restore backup.',
    tip: 'Chọn UUID thì nói luôn cái giá: <b>UUIDv4</b> ngẫu nhiên nên mỗi lần chèn rơi vào một trang B-tree khác nhau — index phân mảnh, cache kém. <b>UUIDv7</b> nhúng timestamp ở đầu nên chèn gần như tuần tự, giữ lại được ưu điểm của ID tăng dần.',
  },
  {
    id: '02', level: 'junior', title: 'Kiểu dữ liệu · Tiền · Thời gian · jsonb',
    questions: [
      'Vì sao không được dùng float để lưu tiền?',
      'timestamptz khác timestamp ở chỗ nào?',
    ],
    points: [
      '<b>Tiền tuyệt đối không dùng float</b>. <code>float8</code> là nhị phân, không biểu diễn chính xác 0.1 — cộng dồn là lệch. Dùng <code>numeric(12,2)</code>, hoặc <code>bigint</code> theo đơn vị nhỏ nhất.',
      '<code>timestamptz</code> là <b>thời điểm tuyệt đối</b> (lưu UTC, hiển thị theo timezone của session). <code>timestamp</code> không timezone — chỉ là ngày giờ trần, hai server khác múi giờ hiểu khác nhau.',
      '<code>text</code> thay <code>varchar(n)</code>: ở Postgres hai kiểu lưu y hệt nhau, <code>varchar(n)</code> không nhanh hơn, chỉ là <code>text</code> kèm một ràng buộc độ dài mà sau này muốn nới ra thì phải <code>ALTER</code>.',
      '<code>jsonb</code> thay <code>json</code>: <code>json</code> giữ nguyên văn bản gốc nên phải parse lại mỗi lần đọc. <code>jsonb</code> đã parse sẵn thành nhị phân — truy vấn nhanh, index được bằng GIN.',
      '<b>enum</b> gọn và nhanh nhưng thêm giá trị phải <code>ALTER TYPE</code>, bỏ giá trị thì rất phiền, và không gắn được thuộc tính kèm theo. Tập giá trị hay đổi → <b>bảng tra</b> + FK.',
    ],
    code: `CREATE TABLE payments (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount      numeric(12,2) NOT NULL,   // hoặc bigint, đơn vị xu
  currency    char(3) NOT NULL,
  meta        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

// ❌ float là nhị phân: cộng dồn lệch xu, đối soát không khớp
SELECT 0.1::float8 + 0.2::float8;    // 0.30000000000000004
// ✅ numeric tính đúng theo hệ thập phân
SELECT 0.1::numeric + 0.2::numeric;  // 0.3`,
    trap: 'Lưu tiền bằng <code>float</code> thì lỗi chỉ lộ sau vài tháng: tổng báo cáo lệch với cổng thanh toán vài nghìn đồng, không truy được dòng nào sai. Sửa thì phải đổi kiểu cột và migrate lại toàn bộ bảng giao dịch.',
    tip: '<code>timestamptz</code> <b>không lưu</b> timezone gốc, nó chỉ lưu một thời điểm. Nếu nghiệp vụ cần biết user đặt lịch ở múi giờ nào (báo thức, lịch họp lặp lại) thì phải lưu thêm một cột <code>text</code> chứa tên vùng, ví dụ <code>Asia/Ho_Chi_Minh</code>.',
  },
  {
    id: '03', level: 'mid', title: 'Mô hình hoá · Soft delete · Cột audit',
    questions: [
      'Quan hệ n-n bạn mô hình hoá thế nào?',
      'Soft delete phải trả giá bằng những gì?',
    ],
    points: [
      '<b>1-1</b> mặc định gộp chung một bảng; chỉ tách khi cột hiếm dùng, nặng, hoặc khác vòng đời quyền truy cập — và bảng tách phải có <code>UNIQUE</code> trên cột FK, nếu không nó thành 1-n.',
      '<b>1-n</b>: FK nằm ở bảng "nhiều". Đừng nhét mảng id vào bảng "một" — mảng thì không có FK, không ràng buộc được, và join ra rất xấu.',
      '<b>n-n</b>: bảng nối với PK tổ hợp <code>(post_id, tag_id)</code>. Bảng nối gần như luôn mọc thêm cột riêng (<code>role</code>, <code>added_at</code>), nên coi nó là một thực thể thật ngay từ đầu.',
      '<b>Soft delete</b> (<code>deleted_at</code>) có hai cái giá: <b>mọi</b> query phải nhớ lọc <code>IS NULL</code>, quên một chỗ là dữ liệu đã xoá hiện lại; và <code>UNIQUE</code> phải đổi thành <b>partial index</b>.',
      '<b>Cột audit</b> <code>created_at</code> / <code>updated_at</code> đặt <code>DEFAULT now()</code> ở DB. <code>updated_at</code> nên do <b>trigger</b> cập nhật — đừng tin mọi đường ghi đều nhớ set nó.',
    ],
    code: `CREATE TABLE post_tags (
  post_id  bigint NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id   bigint NOT NULL REFERENCES tags(id),
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

// ❌ soft delete làm UNIQUE hỏng: user cũ không đăng ký lại được
CREATE UNIQUE INDEX users_email ON users (email);

// ✅ partial index: chỉ ép duy nhất trên các dòng còn sống
CREATE UNIQUE INDEX users_email_live
  ON users (email) WHERE deleted_at IS NULL;`,
    trap: 'Quên <code>WHERE deleted_at IS NULL</code> ở một query báo cáo hay một endpoint mới là dữ liệu đã xoá quay lại màn hình khách hàng. Đây là loại bug không test nào bắt được, vì code vẫn chạy đúng — chỉ là trả thừa dòng.',
    tip: 'Cách chống quên: tạo một <b>view</b> chỉ chứa dòng còn sống rồi bắt tầng app đọc view thay vì bảng gốc. Và hỏi ngược lại chính mình: có thật sự cần soft delete không, hay chỉ cần bảng archive kèm audit log là đủ?',
  },
  {
    id: '04', level: 'mid', title: 'Phi chuẩn hoá · Counter · Materialized view',
    questions: [
      'Khi nào bạn cố ý phi chuẩn hoá dữ liệu?',
      'Lưu cột đếm sẵn thì rủi ro ở đâu?',
    ],
    points: [
      'Quy tắc: <b>chuẩn hoá trước, phi chuẩn hoá sau — và chỉ khi có số đo</b>. Phải thấy query chậm thật trên <code>EXPLAIN ANALYZE</code> rồi mới đổi tính đúng đắn lấy tốc độ đọc.',
      'Nhân bản có chủ đích: chép <code>product_name</code> và <code>unit_price</code> vào <code>order_items</code>. Đây không phải tối ưu tốc độ mà là <b>ảnh chụp lịch sử</b> — giá đổi sau này không được làm sai hoá đơn cũ.',
      '<b>Counter</b> (<code>comment_count</code>) tránh được <code>COUNT(*)</code> mỗi lần đọc, nhưng phải cập nhật trong <b>cùng transaction</b> với việc chèn comment, và phải dùng phép cộng chứ không đọc-rồi-ghi-đè.',
      '<b>Materialized view</b> lưu sẵn kết quả một query nặng thành bảng. Dữ liệu <b>cũ</b> cho tới lúc <code>REFRESH</code>; bản thường khoá đọc lúc refresh, bản <code>CONCURRENTLY</code> thì cần unique index.',
      'Mọi dữ liệu nhân bản đều phải có đường <b>hàn gắn</b>: một job định kỳ so counter với <code>COUNT(*)</code> thật rồi sửa lệch. Không có job đó thì sai số tồn tại vĩnh viễn và không ai biết.',
    ],
    code: `// ✅ counter cộng dồn, nằm cùng transaction với việc chèn comment
BEGIN;
INSERT INTO comments (post_id, body) VALUES (42, 'hay');
UPDATE posts SET comment_count = comment_count + 1 WHERE id = 42;
COMMIT;

// ❌ đọc trước rồi ghi đè: hai transaction song song đè nhau, mất 1
UPDATE posts SET comment_count = 11 WHERE id = 42;

// ✅ job hàn gắn chạy đêm, kéo mọi chỗ đã trôi lệch về đúng
UPDATE posts p SET comment_count = c.n
FROM (SELECT post_id, count(*) n FROM comments GROUP BY 1) c
WHERE c.post_id = p.id AND p.comment_count <> c.n;`,
    trap: 'Counter trôi lệch là lỗi kinh điển: cập nhật ngoài transaction, hoặc ghi đè bằng giá trị vừa đọc nên hai request song song đè nhau. Vài tháng sau bài hiện "12 bình luận" mà mở ra chỉ có 9 — và không ai biết sai từ lúc nào.',
    tip: 'Trước khi phi chuẩn hoá, thử hết các cách rẻ hơn đã: thêm đúng index, viết lại query, dùng covering index. Phi chuẩn hoá là lựa chọn cuối vì nó thêm vĩnh viễn một chỗ có thể sai lệch — và chỗ đó sẽ lệch.',
  },
  {
    id: '05', level: 'mid', title: 'Migration an toàn trên production',
    questions: [
      'Đổi tên một cột mà không downtime thì làm sao?',
      'Migration nào không rollback được?',
    ],
    points: [
      '<b>Expand-contract</b>: mở rộng trước (thêm cột mới, tương thích ngược), ghi cả hai, backfill, chuyển đọc sang cột mới, rồi mới <b>contract</b> (xoá cột cũ) ở một release sau.',
      'Nguyên tắc gốc: mỗi bước phải chạy được với <b>cả code cũ lẫn code mới</b>. Lúc rolling deploy, hai bản chạy song song trong nhiều phút — đổi tên cột một phát là bản cũ chết ngay.',
      'Thêm cột <code>NOT NULL</code> không <code>DEFAULT</code> lên bảng đã có dữ liệu là <b>fail ngay</b>. Cách an toàn chung: thêm cột nullable → backfill theo lô → mới thêm ràng buộc.',
      'Tạo index trên bảng đang chạy phải dùng <code>CREATE INDEX CONCURRENTLY</code>: không khoá ghi, chạy lâu hơn, <b>không chạy trong transaction</b>, fail thì để lại index <code>INVALID</code> phải drop tay.',
      'Không rollback được: <code>DROP COLUMN</code>, <code>DROP TABLE</code>, và mọi phép đổi kiểu làm mất thông tin. Tách chúng thành release riêng, chạy sau khi bản mới đã sống ổn vài ngày.',
    ],
    code: `┌──────────────────────────────────────────────────────────────┐
│ Đổi tên cột không downtime — expand ▸ migrate ▸ contract     │
├──────────────────────────────────────────────────────────────┤
│ 1 ▸ ADD COLUMN full_name text      (nullable, chưa dùng)     │
│ 2 ▸ deploy code ghi CẢ HAI cột     (đọc vẫn ở cột cũ)        │
│ 3 ▸ backfill theo lô 5k dòng       (đừng UPDATE cả bảng)     │
│ 4 ▸ deploy code ĐỌC cột mới        (ghi vẫn cả hai cột)      │
│ 5 ▸ theo dõi vài ngày              (vẫn còn đường lùi)       │
│ 6 ▸ DROP COLUMN name               (contract, hết lùi)       │
└──────────────────────────────────────────────────────────────┘
// ✅ tạo index trên bảng đang chạy, không chặn ghi
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);
// ❌ CONCURRENTLY không chạy được bên trong một transaction`,
    trap: 'Câu vặn hay gặp: "thêm cột <code>NOT NULL DEFAULT</code> lên bảng 50 triệu dòng thì sao?" Postgres từ 11 chỉ ghi metadata nên nhanh; bản cũ hơn <b>viết lại toàn bộ bảng</b> và giữ <code>ACCESS EXCLUSIVE</code> — mọi đọc và ghi treo hàng chục phút.',
    tip: 'Đặt <code>lock_timeout</code> ngắn cho session chạy migration: không lấy được khoá thì fail nhanh rồi thử lại. Hàng đợi khoá ở Postgres chặn dây chuyền — một lệnh <code>ALTER</code> đang chờ sẽ giữ luôn mọi query xếp sau nó.',
  },
  {
    id: '06', level: 'mid', title: 'Ràng buộc · Toàn vẹn ở tầng DB',
    questions: [
      'Vì sao ràng buộc phải đặt ở DB, không chỉ ở app?',
      'CHECK và unique partial index dùng khi nào?',
    ],
    points: [
      'DB là <b>hàng rào cuối</b>. App có nhiều bản chạy song song, có job nền, có script import chạy tay, có người vào <code>psql</code> sửa trực tiếp — validate ở app chỉ bảo vệ đúng một đường vào.',
      '<b>Race condition</b>: kiểm tra "email tồn tại chưa" ở app rồi mới <code>INSERT</code> là sai kinh điển — hai request cùng lúc đều thấy chưa tồn tại. Chỉ <code>UNIQUE</code> ở DB mới chặn nổi vì nó nguyên tử.',
      '<code>NOT NULL</code> nên là mặc định. Cột nullable bắt mọi query phải xử lý <code>NULL</code> và làm hỏng so sánh: <code>status &lt;&gt; \'paid\'</code> <b>không</b> trả về dòng có <code>status</code> là <code>NULL</code>.',
      '<code>CHECK</code> cho quy tắc gói gọn trong một dòng: <code>total &gt; 0</code>, <code>status IN (...)</code>, <code>ends_at &gt; starts_at</code>. Rẻ, chạy ngay lúc ghi, và tự tài liệu hoá schema cho người sau.',
      '<b>Unique partial index</b> cho quy tắc có điều kiện: mỗi user chỉ một địa chỉ mặc định, mỗi phòng chỉ một booking đang hoạt động. Ép ở app là chắc chắn sẽ lọt.',
    ],
    code: `ALTER TABLE orders
  ADD CONSTRAINT orders_total_positive CHECK (total > 0),
  ADD CONSTRAINT orders_status_valid
    CHECK (status IN ('pending', 'paid', 'cancelled'));

// ✅ mỗi user chỉ một địa chỉ mặc định — ép ở DB, không ở app
CREATE UNIQUE INDEX one_default_address
  ON addresses (user_id) WHERE is_default;

// ❌ kiểm tra ở app rồi mới ghi: hai request song song cùng lọt
//   SELECT 1 FROM users WHERE email = $1;  → rỗng thì INSERT
// ✅ để DB chặn, app bắt lỗi unique_violation (SQLSTATE 23505)`,
    trap: 'Chỉ validate ở tầng app thì sớm muộn cũng có dữ liệu bẩn: email trùng do hai request vào cùng lúc, đơn hàng <code>total = 0</code> do một script import chạy tay. Lúc phát hiện đã hàng nghìn dòng, và thêm ràng buộc vào bảng bẩn sẽ fail.',
    tip: 'Thêm ràng buộc vào bảng lớn đang chạy thì dùng <code>NOT VALID</code>: <code>ADD CONSTRAINT ... NOT VALID</code> có hiệu lực ngay với dòng mới mà không quét cả bảng, sau đó chạy <code>VALIDATE CONSTRAINT</code> — bước này không chặn đọc ghi.',
  },
  {
    id: '07', level: 'senior', title: 'Replication · Backup · Khôi phục',
    questions: [
      'Replication lag gây ra lỗi gì ở tầng ứng dụng?',
      'Point-in-time recovery hoạt động thế nào?',
    ],
    points: [
      '<b>Async replication</b> (mặc định): primary commit xong là trả lời ngay, WAL đẩy sang replica sau. Primary chết đột ngột thì giao dịch chưa kịp sang replica <b>mất hẳn</b> — đó là RPO.',
      '<b>Read-your-own-write</b>: user vừa sửa profile, màn hình kế tiếp đọc ở replica đang lag, thấy dữ liệu cũ, tưởng lưu hỏng. Xử lý: ghim user vừa ghi vào primary trong vài giây.',
      '<b>Failover</b> là promote replica thành primary. Phải chốt trước: ai quyết định, chống <b>split-brain</b> ra sao, app đổi endpoint kiểu gì. Chưa diễn tập thì sự cố sẽ thành sự cố to hơn.',
      '<b>PITR</b> = base backup + chuỗi WAL liên tục, cho phép tua về <b>đúng một mốc thời gian</b>, ví dụ một phút trước lệnh <code>DELETE</code> chạy nhầm. Replica không làm được việc này.',
      '<b>Backup chưa thử khôi phục thì coi như chưa có backup.</b> Phải restore thử định kỳ vào môi trường riêng, bấm giờ, rồi ghi lại con số RTO thật — chứ không phải số trong tài liệu.',
    ],
    code: `┌─────────────────────────┬───────────────────┬─────────────────┐
│ Sự cố                   │ Replica           │ Backup          │
├─────────────────────────┼───────────────────┼─────────────────┤
│ Mất ổ đĩa, chết node    │ cứu được          │ cứu được        │
│ DELETE nhầm, DROP TABLE │ xoá theo ngay     │ cứu được (PITR) │
│ Dữ liệu hỏng âm thầm    │ nhân bản luôn lỗi │ cứu được        │
│ Xoá nhầm cả cụm         │ mất sạch          │ nếu để offsite  │
└─────────────────────────┴───────────────────┴─────────────────┘
// ✅ PITR: base backup + WAL liên tục → tua về đúng mốc
//   recovery_target_time = '2026-03-14 09:59:00+07'
// ▸ RPO = chấp nhận mất bao nhiêu dữ liệu
// ▸ RTO = bao lâu thì hệ thống sống lại được`,
    trap: '"Bên em có replica rồi nên không cần backup" là câu trượt. Replica nhân bản luôn cả lệnh <code>DELETE</code> nhầm, chỉ chậm hơn vài trăm mili giây. Và backup chưa từng restore thử thì đêm sự cố mới biết nó hỏng từ ba tháng trước.',
    tip: 'Nói được cặp số <b>RPO</b> và <b>RTO</b> rồi suy ngược ra kiến trúc: RPO gần 0 thì buộc phải có synchronous replication (đổi lại latency ghi tăng, replica chết là ghi treo); RTO vài phút thì phải có replica sẵn sàng promote, restore từ backup không kịp.',
  },
  {
    id: '08', level: 'senior', title: 'Khi nào không dùng quan hệ · CAP',
    questions: [
      'Khi nào bạn chọn NoSQL thay vì PostgreSQL?',
      'Phát biểu định lý CAP cho đúng là thế nào?',
    ],
    points: [
      '<b>Document</b> (MongoDB, DynamoDB): dữ liệu luôn đọc và ghi trọn một tài liệu theo một khoá, hình dạng mỗi bản ghi khác nhau. Hỏng khi bắt đầu cần join và transaction nhiều bảng.',
      '<b>Key-value</b> (Redis): tra theo khoá, latency dưới mili giây, có TTL sẵn. Hợp với cache, session, rate limit, leaderboard — không phải chỗ giữ nguồn sự thật.',
      '<b>Wide-column</b> (Cassandra, ScyllaDB): ghi cực lớn, phân tán nhiều vùng. Phải thiết kế query <b>trước</b> rồi mới dựng bảng theo partition key — không có join, không transaction rộng.',
      '<b>Search engine</b> (Elasticsearch): full-text, tìm mờ, facet, xếp hạng theo độ liên quan. Luôn là <b>bản sao phái sinh</b> đồng bộ từ DB chính, không bao giờ là nguồn sự thật.',
      '<b>CAP chỉ nói về lúc có network partition</b>: cụm bị chia đôi thì chọn nhất quán (từ chối phục vụ) hay sẵn sàng (trả dữ liệu có thể cũ). Không partition thì không phải chọn gì.',
    ],
    code: `┌───────────────────────┬──────────────────────────────────────┐
│ Bài toán              │ Hợp với                              │
├───────────────────────┼──────────────────────────────────────┤
│ Đọc trọn 1 tài liệu   │ document store — schema mỗi bản khác │
│ Tra theo khoá, có TTL │ key-value — cache, session, counter  │
│ Ghi rất lớn, đa vùng  │ wide-column — query thiết kế trước   │
│ Tìm mờ, xếp liên quan │ search engine — bản sao phái sinh    │
│ Còn lại               │ PostgreSQL                           │
└───────────────────────┴──────────────────────────────────────┘
// ✅ CAP chỉ bàn tới LÚC CÁC NODE MẤT LIÊN LẠC với nhau:
// ▸ chọn C: từ chối phục vụ để không trả dữ liệu sai
// ▸ chọn A: vẫn trả lời, chấp nhận dữ liệu có thể cũ
// ❌ "MongoDB là AP nên nhanh hơn" — CAP không nói gì về tốc độ`,
    trap: 'Đa số dự án chọn NoSQL vì lý do sai: "dữ liệu lớn", "schema linh hoạt", "scale tốt hơn". Sáu tháng sau phải tự join ở tầng app, tự giữ nhất quán giữa các collection, và không có transaction để dựa vào.',
    tip: 'Câu trả lời ăn điểm là <b>polyglot persistence</b>: Postgres giữ nguồn sự thật, Redis làm cache, Elasticsearch làm tìm kiếm — mỗi thứ một việc. Nói luôn cái giá: phải có đường đồng bộ và phải sống chung với các bản sao trễ nhau.',
  },
];
