/**
 * Noi dung cum SQL — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 * Cu phap mac dinh la PostgreSQL, cho nao MySQL khac thi noi ro.
 */

export const cover = {
  slug: 'sql',
  kicker: '( Cẩm nang )',
  title: 'SQL',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Từ truy vấn đến tối ưu',
  toc: [
    ['🔍', 'SELECT · WHERE · Bẫy NULL', 'Junior'],
    ['🔗', 'JOIN · Điều kiện ở ON hay ở WHERE', 'Junior'],
    ['📊', 'GROUP BY · HAVING · Aggregate', 'Junior'],
    ['🧩', 'Subquery · CTE · EXISTS', 'Mid'],
    ['⚡', 'Index · Đọc EXPLAIN ANALYZE', 'Mid'],
    ['🔐', 'Transaction · ACID · Isolation level', 'Mid'],
    ['🔒', 'Lock · Deadlock · FOR UPDATE', 'Mid'],
    ['🪟', 'Window function · PARTITION BY', 'Senior'],
    ['📄', 'Pagination · Keyset · Bài toán N+1', 'Senior'],
    ['🚀', 'Tối ưu truy vấn thực chiến', 'Senior'],
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
  note: 'SQL sai <em>không báo lỗi</em> — nó trả về<br>kết quả sai một cách rất im lặng. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'SELECT · WHERE · Bẫy NULL',
    questions: [
      'NULL = NULL trả về true hay false?',
      'Vì sao điều kiện “khác giá trị” lại bỏ sót dòng NULL?',
    ],
    points: [
      'NULL nghĩa là <b>không biết</b>, không phải 0 cũng không phải chuỗi rỗng. Mọi so sánh với NULL (<code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>) đều cho ra NULL, mà <code>WHERE</code> chỉ giữ dòng ra <b>true</b>.',
      'Nên <code>status &lt;&gt; \'paid\'</code> <b>bỏ sót sạch</b> các dòng <code>status IS NULL</code>. Muốn lấy đủ thì viết <code>IS DISTINCT FROM</code>, hoặc thêm <code>OR status IS NULL</code>.',
      'Kiểm tra NULL chỉ có một cách: <code>IS NULL</code> / <code>IS NOT NULL</code>. Viết <code>= NULL</code> không báo lỗi, chỉ lặng lẽ không khớp dòng nào.',
      '<code>COALESCE(a, b)</code> trả giá trị non-NULL đầu tiên — dùng để <b>hiển thị</b> giá trị thay thế, không phải để che chỗ dữ liệu bị thiếu.',
      '<code>ORDER BY</code> chạy xong mới tới <code>LIMIT</code>/<code>OFFSET</code>. Không có ORDER BY thì thứ tự dòng <b>không đảm bảo</b>; luôn thêm cột tie-break như <code>id</code> để phân trang không lặp dòng.',
    ],
    code: `-- ❌ mất sạch dòng email IS NULL, mà không báo lỗi gì
SELECT id, name FROM users WHERE email <> 'an@ex.com';

-- ✅ cách 1: nói rõ là muốn lấy cả dòng NULL
SELECT id, name FROM users
WHERE email IS DISTINCT FROM 'an@ex.com';

-- ✅ cách 2: không lọc mất dòng, chỉ đổi cách hiển thị
SELECT id, COALESCE(email, '(chưa có)') AS email
FROM users
ORDER BY name, id        -- id là tie-break, phân trang mới ổn định
LIMIT 20 OFFSET 0;`,
    trap: 'Đếm dòng <code>status &lt;&gt; \'paid\'</code> rồi cộng với số dòng <code>= \'paid\'</code> — tổng lại <b>nhỏ hơn</b> <code>COUNT(*)</code>. Phần hụt chính là các dòng NULL. SQL không báo lỗi, báo cáo cứ thế sai.',
    tip: '<code>IS DISTINCT FROM</code> coi hai NULL là bằng nhau, rất hợp khi viết điều kiện so dữ liệu cũ với dữ liệu mới. MySQL không có cú pháp này, thay bằng toán tử <code>&lt;=&gt;</code>.',
  },
  {
    id: '02', level: 'junior', title: 'JOIN · Điều kiện ở ON hay ở WHERE',
    questions: [
      'LEFT JOIN khác INNER JOIN ở chỗ nào?',
      'Đặt điều kiện ở ON và ở WHERE khác nhau ra sao?',
    ],
    points: [
      '<code>INNER JOIN</code> chỉ giữ dòng khớp cả hai bên. <code>LEFT JOIN</code> giữ toàn bộ bảng trái, bên phải không khớp thì điền NULL. <code>RIGHT JOIN</code> là ảnh gương, <code>FULL JOIN</code> giữ cả hai phía.',
      'Với LEFT JOIN, điều kiện lọc bảng phải đặt ở <code>ON</code> — nó được áp <b>trước khi ghép</b>, nên dòng trái không khớp vẫn còn lại kèm NULL.',
      'Cùng điều kiện đó chuyển sang <code>WHERE</code> thì áp <b>sau khi ghép</b>: dòng NULL bị loại, và LEFT JOIN <b>âm thầm biến thành INNER JOIN</b>.',
      'Join 1-n làm <b>nhân bản dòng</b> bên trái: một user có 3 order thì ra 3 dòng. Cộng tiền hay đếm trên kết quả này là tính trùng.',
      'Muốn tránh nhân bản thì gộp bảng con <b>trước</b> trong một CTE rồi mới join vào bảng chính, hoặc dùng <code>LEFT JOIN LATERAL</code>.',
    ],
    code: `-- ✅ điều kiện ở ON: user không có đơn paid vẫn còn trong kết quả
SELECT u.id, u.name, o.id AS order_id
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid';

-- ❌ cùng điều kiện nhưng để ở WHERE → LEFT hoá thành INNER
SELECT u.id, u.name, o.id AS order_id
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid';     -- mọi dòng o.* NULL bị loại sạch

-- ✅ anti-join: tìm user chưa từng đặt đơn nào
SELECT u.id FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
    trap: 'Bạn LEFT JOIN để giữ mọi user, rồi thêm <code>WHERE o.status = \'paid\'</code> cho gọn — user không có đơn biến mất hết mà không có lỗi nào. Ngoại lệ duy nhất được đặt ở WHERE là <code>o.id IS NULL</code>, đó chính là mẫu anti-join.',
    tip: 'Join 1-n rồi <code>SUM()</code> là cộng trùng tiền. Gộp bảng con trong <b>CTE</b> trước (một dòng một user) rồi mới <code>LEFT JOIN</code> vào — vừa đúng số, vừa dễ đọc hơn subquery lồng.',
  },
  {
    id: '03', level: 'junior', title: 'GROUP BY · HAVING · Aggregate',
    questions: [
      'WHERE và HAVING khác nhau thế nào?',
      'COUNT(*) khác COUNT(cot) ở điểm nào?',
    ],
    points: [
      'Thứ tự chạy thật: <code>FROM</code> → <code>WHERE</code> → <code>GROUP BY</code> → <code>HAVING</code> → <code>SELECT</code> → <code>ORDER BY</code> → <code>LIMIT</code>. Nhớ đúng thứ tự này là gỡ được gần hết câu hỏi về GROUP BY.',
      '<code>WHERE</code> lọc <b>từng dòng trước khi gộp</b>, <code>HAVING</code> lọc <b>từng nhóm sau khi gộp</b>. Điều kiện không đụng hàm tổng hợp thì để ở WHERE — lọc sớm, nhóm ít đi, nhanh hơn.',
      '<code>COUNT(*)</code> đếm mọi dòng. <code>COUNT(cot)</code> <b>bỏ qua NULL</b> của cột đó. <code>SUM</code>, <code>AVG</code>, <code>MAX</code> cũng bỏ qua NULL — nên <code>AVG</code> là chia cho số dòng có giá trị, không phải tổng số dòng.',
      'Cột nằm trong <code>SELECT</code> mà không có trong <code>GROUP BY</code> và không bọc hàm tổng hợp thì PostgreSQL <b>báo lỗi</b>. MySQL tắt <code>ONLY_FULL_GROUP_BY</code> sẽ trả bừa một giá trị bất kỳ trong nhóm.',
      'Alias đặt ở SELECT dùng được trong <code>GROUP BY</code> và <code>ORDER BY</code>, nhưng <b>không</b> dùng được trong <code>WHERE</code> và <code>HAVING</code> — vì hai chỗ đó chạy trước SELECT.',
    ],
    code: `-- ❌ LEFT JOIN + COUNT(*) → user không có đơn nào vẫn ra 1
SELECT u.name, COUNT(*) AS so_don
FROM users u LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.name;

-- ✅ đếm cột của bảng phải, NULL bị bỏ qua → đúng 0
SELECT u.name, COUNT(o.id) AS so_don
FROM users u LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.name;

-- WHERE lọc dòng trước khi gộp, HAVING lọc nhóm sau khi gộp
SELECT user_id, SUM(amount) AS tong
FROM orders
WHERE status = 'paid'
GROUP BY user_id HAVING SUM(amount) > 200;`,
    trap: '<code>LEFT JOIN</code> rồi <code>COUNT(*)</code> trả về <b>1</b> cho nhóm không có bản ghi nào, vì dòng toàn NULL vẫn là một dòng. Phải đếm đúng cột bên phải, <code>COUNT(o.id)</code>, mới ra <b>0</b>. Kiểu sai này rất khó phát hiện.',
    tip: 'Cần vừa đếm vừa lọc thì dùng <code>FILTER</code>: <code>COUNT(*) FILTER (WHERE ...)</code> — gọn hơn nhiều so với <code>SUM(CASE WHEN ... THEN 1 END)</code>. MySQL không có FILTER, phải quay lại kiểu CASE.',
  },
  {
    id: '04', level: 'mid', title: 'Subquery · CTE · EXISTS',
    questions: [
      'IN, EXISTS và JOIN thì nên chọn cái nào?',
      'Vì sao NOT IN với subquery hay trả về rỗng?',
    ],
    points: [
      '<code>WITH</code> (CTE) đặt tên cho một bước trung gian, giúp truy vấn nhiều tầng đọc được. Từ PostgreSQL 12, CTE thường được <b>inline</b> vào kế hoạch; muốn chặn thì ghi <code>AS MATERIALIZED</code>.',
      '<b>Correlated subquery</b> tham chiếu bảng ngoài nên bị chạy lại theo từng dòng. Hợp với <code>EXISTS</code> (tìm thấy là dừng), rất tệ nếu nhét vào <code>SELECT</code> của bảng lớn.',
      '<code>EXISTS</code> chỉ hỏi “có hay không”, không quan tâm subquery trả về gì, và <b>an toàn với NULL</b>. <code>IN</code> thì so khớp giá trị nên dính NULL.',
      '<code>NOT IN (SELECT ...)</code> mà danh sách chứa <b>một</b> NULL là <b>luôn trả về rỗng</b>: <code>x &lt;&gt; NULL</code> ra NULL, không bao giờ true. Không lỗi, không cảnh báo.',
      'Đổi sang <code>NOT EXISTS</code> hoặc anti-join <code>LEFT JOIN ... IS NULL</code> là hết bẫy. Hai cách đó cho kết quả đúng kể cả khi cột có NULL.',
    ],
    code: `-- ❌ chỉ cần 1 dòng orders.user_id là NULL → kết quả luôn RỖNG
SELECT u.id FROM users u
WHERE u.id NOT IN (SELECT o.user_id FROM orders o);

-- ✅ NOT EXISTS không quan tâm NULL, luôn đúng
SELECT u.id FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- ✅ hoặc anti-join bằng CTE, kế hoạch thường tương đương
WITH da_dat AS (SELECT DISTINCT user_id FROM orders)
SELECT u.id FROM users u
LEFT JOIN da_dat d ON d.user_id = u.id
WHERE d.user_id IS NULL;`,
    trap: 'Bẫy chết người nhất của SQL: <code>NOT IN (SELECT cot ...)</code> gặp đúng <b>một</b> NULL trong danh sách là trả về <b>rỗng</b> — im lặng, không báo lỗi. Dev nhìn kết quả 0 dòng rồi kết luận “không có dữ liệu” và đóng ticket.',
    tip: '<code>NOT IN</code> chỉ an toàn khi cột con có ràng buộc <code>NOT NULL</code>, mà bảng thật thì hiếm khi chắc được điều đó. Nên mặc định cứ dùng <code>NOT EXISTS</code> là xong, khỏi phải nhớ ngoại lệ.',
  },
  {
    id: '05', level: 'mid', title: 'Index · Đọc EXPLAIN ANALYZE',
    questions: [
      'Index (a, b) có phục vụ được WHERE b = ? không?',
      'Vì sao bọc hàm lên cột lại làm mất index?',
    ],
    points: [
      '<b>B-tree</b> là loại index mặc định, phục vụ <code>=</code>, khoảng <code>&lt;</code> <code>&gt;</code> <code>BETWEEN</code> và cả <code>ORDER BY</code>. Cột chọn lọc kém (chỉ vài giá trị khác nhau) thì đánh index gần như vô ích.',
      '<b>Quy tắc tiền tố trái</b>: index <code>(a, b, c)</code> phục vụ <code>WHERE a</code>, <code>WHERE a AND b</code>, <code>WHERE a AND b AND c</code> — nhưng <b>không</b> phục vụ <code>WHERE b</code> đứng một mình.',
      'Bọc hàm lên cột là index <b>chết</b>: <code>WHERE lower(email) = ...</code> rơi về Seq Scan. Cứu bằng <b>expression index</b>: <code>CREATE INDEX ...</code> đánh thẳng lên <code>(lower(email))</code>.',
      '<b>Covering index</b>: index chứa đủ mọi cột câu lệnh cần → PostgreSQL đọc thẳng từ index, kế hoạch hiện <code>Index Only Scan</code>, khỏi chạm bảng. Gắn thêm cột phụ bằng <code>INCLUDE (...)</code>.',
      'Đọc <code>EXPLAIN ANALYZE</code>: <code>Seq Scan</code> là quét cả bảng, <code>Index Scan</code> là dò index. So <code>rows=</code> (ước lượng) với <code>actual rows=</code> (thật) — lệch nhiều là thống kê đã cũ.',
    ],
    code: `EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@ex.com';
-- ✅ Index Scan using idx_users_email   (actual rows=1)

-- ❌ bọc hàm lên cột → Seq Scan, quét trọn bảng
SELECT 1 FROM users WHERE lower(email) = 'a@ex.com';

-- ✅ expression index cứu đúng câu ở trên
CREATE INDEX idx_users_email_lower ON users (lower(email));

-- composite index: thứ tự cột quyết định tất cả
CREATE INDEX idx_u_city_name ON users (city, name);
-- ✅ WHERE city = 'HN'                → dùng được
-- ✅ WHERE city = 'HN' AND name = 'x' → dùng được
-- ❌ WHERE name = 'x'                 → bỏ qua index, Seq Scan`,
    trap: 'Đánh index rồi vẫn chậm thì soi ba thứ: điều kiện có bọc hàm lên cột không, cột lọc có phải <b>tiền tố trái</b> của composite index không, và kiểu dữ liệu hai vế có khớp không — ép kiểu ngầm cũng đủ làm planner bỏ index.',
    tip: 'Index không miễn phí: mỗi <code>INSERT</code>/<code>UPDATE</code> phải cập nhật <b>mọi</b> index của bảng. Trước khi thêm cái mới, dọn cái thừa — soi <code>pg_stat_user_indexes</code>, cột <code>idx_scan</code> bằng 0 là chưa ai dùng.',
  },
  {
    id: '06', level: 'mid', title: 'Transaction · ACID · Isolation level',
    questions: [
      'Bốn mức isolation chống được những hiện tượng nào?',
      'Mức isolation mặc định của PostgreSQL là gì?',
    ],
    points: [
      '<b>ACID</b>: Atomicity (ăn cả hoặc ngã về không), Consistency (không phá ràng buộc), Isolation (transaction không giẫm chân nhau), Durability (commit xong là còn, kể cả mất điện).',
      'Ba hiện tượng theo chuẩn: <b>dirty read</b> đọc dữ liệu chưa commit · <b>non-repeatable read</b> đọc lại cùng một dòng ra giá trị khác · <b>phantom read</b> chạy lại cùng câu lọc thì có thêm dòng.',
      'Bốn mức tăng dần: <code>READ UNCOMMITTED</code> → <code>READ COMMITTED</code> → <code>REPEATABLE READ</code> → <code>SERIALIZABLE</code>. Càng cao càng an toàn, đổi lại càng hay phải chờ hoặc bị huỷ transaction.',
      'PostgreSQL mặc định <b>READ COMMITTED</b>; MySQL InnoDB mặc định <b>REPEATABLE READ</b>. PostgreSQL không có READ UNCOMMITTED thật — khai báo mức đó thì vẫn chạy như READ COMMITTED.',
      '<code>REPEATABLE READ</code> của PostgreSQL dựa trên snapshot nên chặn luôn cả phantom read, chặt hơn chuẩn. Đổi lại, ghi đè dòng người khác vừa sửa sẽ nhận lỗi <code>could not serialize access</code>.',
    ],
    code: `BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT bal FROM acc WHERE id = 1;    -- đọc ra 100
-- lúc này transaction khác UPDATE rồi COMMIT, bal chỉ còn 80
UPDATE acc SET bal = bal - 10 WHERE id = 1;
-- ❌ ERROR: could not serialize access due to concurrent update
ROLLBACK;                            -- app phải tự retry lại

-- ✅ READ COMMITTED (mặc định): mỗi câu lệnh thấy bản mới nhất
BEGIN;
UPDATE acc SET bal = bal - 10 WHERE id = 1;   -- tính trên bal mới
COMMIT;`,
    trap: '<b>Lost update</b>: đọc <code>bal</code> về biến trong app, trừ trong code rồi <code>UPDATE ... SET bal = 90</code>. Hai request chạy song song thì bản ghi sau đè bản trước, tiền bốc hơi. Sửa bằng <code>SET bal = bal - 10</code> ngay trong SQL, hoặc khoá dòng bằng <code>FOR UPDATE</code>.',
    tip: 'Isolation cao không thay được khoá. <code>SERIALIZABLE</code> ở PostgreSQL có thể huỷ transaction bất kỳ lúc nào với mã lỗi <code>40001</code>, nên chọn mức này thì app <b>bắt buộc</b> phải có vòng retry.',
  },
  {
    id: '07', level: 'mid', title: 'Lock · Deadlock · SELECT FOR UPDATE',
    questions: [
      'Deadlock xảy ra khi nào và phòng bằng cách nào?',
      'SELECT ... FOR UPDATE dùng để làm gì?',
    ],
    points: [
      '<code>UPDATE</code>/<code>DELETE</code> tự khoá <b>từng dòng</b> nó chạm tới, giữ tới lúc <code>COMMIT</code> hoặc <code>ROLLBACK</code>. Nhờ MVCC, ở PostgreSQL <b>đọc không chặn ghi, ghi không chặn đọc</b>.',
      '<code>SELECT ... FOR UPDATE</code> khoá trước những dòng sắp sửa, buộc transaction khác phải chờ. Đây là <b>pessimistic lock</b>, dùng khi đọc-rồi-ghi phải nguyên tử: trừ kho, trừ số dư.',
      '<code>FOR UPDATE NOWAIT</code> báo lỗi ngay thay vì chờ. <code>FOR UPDATE SKIP LOCKED</code> bỏ qua dòng đang bị khoá — đây là mẫu chuẩn để nhiều worker cùng lấy job từ một bảng queue.',
      '<b>Deadlock</b> sinh ra khi hai transaction khoá <b>ngược thứ tự nhau</b>: A giữ dòng 1 chờ dòng 2, B giữ dòng 2 chờ dòng 1. PostgreSQL phát hiện sau <code>deadlock_timeout</code> (1s) rồi huỷ một bên.',
      'Phòng deadlock: luôn khoá theo <b>một thứ tự cố định</b> (ví dụ id tăng dần), giữ transaction <b>thật ngắn</b>, và đặt <code>lock_timeout</code> để không treo vô hạn.',
    ],
    code: `-- ❌ A: UPDATE ... id = 1   rồi   UPDATE ... id = 2
-- ❌ B: UPDATE ... id = 2   rồi   UPDATE ... id = 1  (ngược thứ tự)
-- ERROR: deadlock detected  (PostgreSQL huỷ hẳn một bên)

-- ✅ luôn khoá theo một thứ tự cố định: id nhỏ trước
BEGIN;  -- transaction càng ngắn thì càng khó đụng deadlock
SELECT bal FROM acc WHERE id = 1 FOR UPDATE;
SELECT bal FROM acc WHERE id = 2 FOR UPDATE;
UPDATE acc SET bal = bal - 10 WHERE id = 1;
UPDATE acc SET bal = bal + 10 WHERE id = 2;
COMMIT;

-- ✅ nhiều worker lấy job mà không giẫm chân nhau
SELECT * FROM jobs WHERE status = 'queued'
ORDER BY id LIMIT 10 FOR UPDATE SKIP LOCKED;`,
    trap: 'Deadlock <b>không</b> chữa được bằng cách tăng timeout — nó là vòng chờ khép kín, chờ bao lâu cũng không thoát. PostgreSQL huỷ một bên nên app buộc phải bắt lỗi và <b>retry</b>. Nguyên nhân gần như luôn là hai đoạn code khoá theo thứ tự khác nhau.',
    tip: 'Một thói quen thực chiến đáng kể ra: đừng gọi API bên ngoài khi transaction đang mở. Một request HTTP chậm 5 giây là 5 giây giữ khoá, đủ để cả hệ thống xếp hàng chờ sau lưng nó.',
  },
  {
    id: '08', level: 'senior', title: 'Window function · PARTITION BY',
    questions: [
      'ROW_NUMBER, RANK, DENSE_RANK khác nhau ra sao?',
      'Lấy bản ghi mới nhất của mỗi nhóm bằng cách nào?',
    ],
    points: [
      'Window function tính trên một “cửa sổ” các dòng liên quan nhưng <b>không gộp dòng lại</b> — khác hẳn <code>GROUP BY</code>. Số dòng đầu ra đúng bằng số dòng đầu vào.',
      'Khi giá trị bằng nhau (100, 100, 90, 80): <code>ROW_NUMBER</code> ra 1-2-3-4 (không bao giờ trùng) · <code>RANK</code> ra 1-1-3-4 (nhảy số) · <code>DENSE_RANK</code> ra 1-1-2-3 (không nhảy).',
      '<code>PARTITION BY</code> chia dòng thành nhóm rồi đánh số lại từ đầu trong mỗi nhóm. <code>ORDER BY</code> nằm trong <code>OVER()</code> quyết định thứ tự đánh số, độc lập với ORDER BY của cả câu.',
      'Lấy bản ghi mới nhất mỗi nhóm: <code>ROW_NUMBER()</code> với <code>PARTITION BY user_id</code> và <code>ORDER BY created_at DESC</code>, rồi lọc <code>rn = 1</code> ở tầng ngoài.',
      'Running total là <code>SUM(x) OVER (ORDER BY id)</code>. Khung mặc định là <code>RANGE</code> nên các dòng <b>bằng nhau</b> ở cột ORDER BY bị cộng gộp chung một lượt — cần chính xác từng dòng thì ghi rõ <code>ROWS</code>.',
    ],
    code: `-- điểm 100, 100, 90, 80 cho ra ba kiểu thứ hạng khác nhau:
-- ROW_NUMBER → 1 2 3 4 · RANK → 1 1 3 4 · DENSE_RANK → 1 1 2 3

-- ✅ lấy đơn hàng mới nhất của từng user
SELECT user_id, id, created_at FROM (
  SELECT o.*, ROW_NUMBER() OVER (
           PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM orders o
) x WHERE rn = 1;

-- ❌ WHERE ROW_NUMBER() OVER (...) = 1  → lỗi, window chạy SAU WHERE

-- running total — ghi rõ ROWS để không cộng gộp dòng bằng nhau
SELECT id, SUM(amount) OVER (ORDER BY id ROWS UNBOUNDED PRECEDING)
FROM orders;`,
    trap: 'Lọc ngay cùng tầng là hỏng cả hai đường: <code>WHERE rn = 1</code> báo <code>column "rn" does not exist</code>, còn nhét thẳng hàm vào WHERE thì báo <code>not allowed in WHERE</code>. Window function chạy <b>sau</b> WHERE nên bắt buộc bọc thêm một tầng subquery hoặc CTE.',
    tip: 'PostgreSQL có <code>DISTINCT ON (user_id)</code> lấy dòng đầu của mỗi nhóm, ngắn hơn ROW_NUMBER nhiều; ghép với <code>ORDER BY user_id</code>, <code>created_at DESC</code> là ra bản ghi mới nhất. MySQL không có cú pháp này.',
  },
  {
    id: '09', level: 'senior', title: 'Pagination · Keyset · Bài toán N+1',
    questions: [
      'Vì sao OFFSET càng lớn thì truy vấn càng chậm?',
      'N+1 query là gì, xử lý thế nào?',
    ],
    points: [
      '<code>OFFSET n</code> vẫn phải <b>đọc rồi vứt đi</b> n dòng đầu. Trang 1 nhanh, trang 5000 quét gần hết bảng — chi phí tăng tuyến tính theo số trang, không có cách nào nhảy cóc.',
      'OFFSET còn bị <b>lệch dữ liệu</b>: giữa hai lần gọi mà có dòng mới chèn vào thì trang sau lặp lại dòng đã hiện, hoặc bỏ sót dòng. Sắp xếp theo <code>created_at DESC</code> là dính ngay.',
      '<b>Keyset (cursor) pagination</b>: nhớ giá trị cuối trang trước rồi lọc <code>(created_at, id)</code> <code>&lt; (:last_at, :last_id)</code>. Dùng thẳng index, trang nào cũng nhanh như trang một.',
      'Đánh đổi: keyset <b>không nhảy thẳng tới trang N</b> và không hiện được tổng số trang. Hợp với feed cuộn vô hạn, không hợp với bảng admin cần bấm số trang.',
      '<b>N+1</b>: 1 query lấy 100 user, rồi vòng lặp bắn thêm 100 query lấy order. Gộp còn 2 query bằng <code>WHERE user_id = ANY($1)</code> rồi nhóm lại ở app, hoặc 1 query <code>JOIN</code>.',
    ],
    code: `-- ❌ OFFSET lớn: vẫn phải đọc rồi vứt 100000 dòng đầu
SELECT id, created_at FROM feed
ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 100000;

-- ✅ keyset: bám vào giá trị cuối cùng của trang trước
SELECT id, created_at FROM feed
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC LIMIT 20;
-- index phục vụ đúng câu này: (created_at DESC, id DESC)

-- ❌ N+1: 1 query users rồi 100 query orders trong vòng lặp
-- for (u of users) SELECT * FROM orders WHERE user_id = u.id;

-- ✅ gộp thành 1 query, app tự nhóm lại theo user_id
SELECT * FROM orders WHERE user_id = ANY($1);`,
    trap: 'Feed sắp xếp theo thời gian mà phân trang bằng <code>OFFSET</code>: giữa hai lần tải có bài mới đăng, mọi thứ bị đẩy xuống một bậc, trang sau <b>hiện lại</b> đúng bài người dùng vừa đọc. Trên máy dev gần như không tái hiện được.',
    tip: 'Bỏ luôn <code>COUNT(*)</code> đếm tổng ở mỗi lần phân trang — trên bảng lớn nó quét cả bảng, thường tốn hơn chính câu lấy dữ liệu. Chỉ cần biết “còn trang sau không” thì lấy <code>LIMIT 21</code> rồi trả về 20.',
  },
  {
    id: '10', level: 'senior', title: 'Tối ưu truy vấn thực chiến',
    questions: [
      'Một query chậm, bạn bắt đầu điều tra từ đâu?',
      'SELECT * thì có vấn đề gì?',
    ],
    points: [
      'Luôn bắt đầu bằng <code>EXPLAIN (ANALYZE, BUFFERS)</code> — đo trước, sửa sau. Đoán chỗ nghẽn rồi đánh index bừa là cách nhanh nhất để vừa mất thời gian vừa làm chậm phần ghi.',
      '<code>SELECT *</code> kéo cả cột <code>text</code>/<code>jsonb</code> không dùng tới, tốn I/O và băng thông, đồng thời <b>phá luôn Index Only Scan</b>. Thêm hay đổi cột về sau cũng làm vỡ code đang dựa vào thứ tự cột.',
      'Insert từng dòng trong vòng lặp là mỗi dòng một round-trip và một lần commit. Gộp nhiều dòng vào <b>một</b> <code>INSERT ... VALUES</code>, khối lượng lớn thì dùng <code>COPY</code>.',
      'Thống kê lỗi thời làm planner chọn sai kế hoạch. So <code>rows=</code> với <code>actual rows=</code>, lệch cả chục lần thì chạy <code>ANALYZE ten_bang</code> — nhiều khi chỉ cần thế là hết chậm.',
      'Index thừa làm <b>chậm ghi</b>: mỗi INSERT/UPDATE phải cập nhật mọi index. Soi <code>pg_stat_user_indexes</code>, cái nào <code>idx_scan = 0</code> sau vài tuần chạy thật là ứng viên để xoá.',
    ],
    code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM users WHERE city = 'HN' ORDER BY id LIMIT 20;
-- so rows= (ước lượng) với actual rows= — lệch nhiều là thống kê cũ
ANALYZE users;

-- ❌ N dòng = N round-trip, N lần commit
-- INSERT INTO t (a, b) VALUES (1, 2);   -- lặp lại 10000 lần

-- ✅ gộp một lệnh, nhanh hơn hàng chục lần
INSERT INTO t (a, b) VALUES (1, 2), (3, 4), (5, 6);

-- index nào chưa ai đụng tới thì xoá cho phần ghi nhẹ lại
SELECT relname, indexrelname, idx_scan
FROM pg_stat_user_indexes ORDER BY idx_scan;`,
    trap: 'Chậm không phải lúc nào cũng vì thiếu index. Gặp nhiều nhất là thống kê lỗi thời: planner tưởng bảng có 100 dòng nên chọn Seq Scan, thực tế 10 triệu dòng. Chạy <code>ANALYZE</code> xong là nhanh ngay, không cần thêm index nào.',
    tip: 'Nêu rõ thứ tự ưu tiên khi tối ưu: sửa câu truy vấn → đánh đúng index → giảm số round-trip → cuối cùng mới tới cache và nâng cấu hình máy. Nhảy thẳng sang cache là che bug chứ không phải sửa bug.',
  },
];
