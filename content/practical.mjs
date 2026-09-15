/**
 * Noi dung cum PRACTICAL — Bai toan thuc chien hay gap khi di lam.
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'practical',
  kicker: '( Cẩm nang )',
  title: 'Thực Chiến',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Bài toán hay gặp khi đi làm',
  toc: [
    ['♾️', 'Infinite scroll · Cursor pagination', 'Junior'],
    ['🪟', 'Virtualization & giữ vị trí cuộn', 'Junior'],
    ['🧾', 'Form phức tạp · Validate bằng zod', 'Mid'],
    ['🔐', 'Auth · Access token & Refresh token', 'Mid'],
    ['📤', 'Upload file lớn · Chunk · Resume', 'Mid'],
    ['🛰️', 'Realtime: WebSocket · SSE · Polling', 'Mid'],
    ['🌍', 'i18n · Ngày giờ · Tiền tệ', 'Mid'],
    ['📊', 'Bảng 10.000 dòng · Server-side', 'Senior'],
    ['🧭', 'Giữ trạng thái bảng trên URL', 'Senior'],
    ['🐞', 'Error boundary · Sentry', 'Senior'],
    ['🚩', 'Feature flag · Kill switch', 'Senior'],
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
  note: 'Phỏng vấn thực chiến hỏi <em>bạn làm thế nào</em>,<br>không hỏi định nghĩa. Kể được cái bẫy đã dính là ăn điểm. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Infinite scroll · Virtualization',
    questions: [
      'Dùng IntersectionObserver hay sự kiện scroll?',
      'Vì sao phân trang bằng offset lại bị trùng item?',
    ],
    points: [
      '<b>IntersectionObserver</b> theo dõi một sentinel ở cuối danh sách. Callback chạy ngoài luồng scroll nên không cần throttle và không gây layout thrashing như <code>onScroll</code>.',
      '<b>Cursor pagination</b>: gửi con trỏ của item cuối (vd <code>created_at + id</code>) thay vì vị trí tuyệt đối. Dữ liệu mới chèn vào không làm lệch các trang sau.',
      '<b>Virtualization</b> là chuyện khác: infinite scroll lo <b>tải thêm</b>, virtualization lo <b>chỉ render phần nhìn thấy</b>. Cần khi DOM node phình lên hàng nghìn hoặc mỗi dòng nặng.',
      'Giữ vị trí cuộn: chỉ <b>nối vào cuối</b> mảng, key ổn định theo id. Chèn vào đầu hoặc thay cả mảng là trình duyệt nhảy cuộn.',
      'Luôn có trạng thái <b>đang tải</b>, <b>hết dữ liệu</b> và <b>lỗi + nút thử lại</b>. Thiếu cờ hết dữ liệu là observer bắn request vô hạn.',
    ],
    code: `// ❌ offset: có bài mới chèn lên đầu → trang 2 lặp lại item trang 1
api.feed({ offset: page * 20, limit: 20 });

// ✅ cursor: neo vào item cuối, dữ liệu mới không phá trang sau
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => api.feed({ cursor: pageParam, limit: 20 }),
  initialPageParam: null as string | null,
  getNextPageParam: (last) => last.nextCursor ?? undefined,
});

const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting && hasNextPage) fetchNextPage();
}, { rootMargin: '400px' });   // tải trước khi chạm đáy 400px
io.observe(sentinelRef.current!);`,
    trap: 'Offset hỏng khi dữ liệu đổi giữa hai lần gọi: thêm 1 bài lên đầu thì item thứ 20 bị đẩy xuống 21 → trang 2 trả <b>lại đúng item đó</b>. Xoá 1 bài thì ngược lại, có item <b>bị nhảy mất</b>, không ai nhìn thấy.',
    tip: 'Cursor phải sắp xếp trên cột <b>duy nhất và không đổi</b>. Sắp theo <code>created_at</code> đơn thuần mà hai bản ghi trùng giây là lặp hoặc sót — ghép thêm <code>id</code> làm tie-breaker.',
  },
  {
    id: '02', level: 'mid', title: 'Form phức tạp · Validate · Autosave',
    questions: [
      'Form 50 trường: controlled hay uncontrolled?',
      'Lỗi validate từ server map vào field thế nào?',
    ],
    points: [
      '<b>Controlled</b>: mỗi phím gõ là một lần set state → re-render cả form. <b>Uncontrolled</b> (react-hook-form <code>register</code>) giữ giá trị trong ref, chỉ render lại field có lỗi.',
      'Validate theo <b>schema</b> (zod) thay vì rải rác <code>if</code>: một nguồn sự thật, suy ra được kiểu TypeScript bằng <code>z.infer</code>, và dùng lại được ở server.',
      'Field lồng nhau và mảng động: tên field dạng <code>items.0.qty</code>, thêm/xoá dòng bằng <code>useFieldArray</code>. Key của dòng phải là id riêng, không phải index.',
      '<b>Autosave</b>: debounce 500–1000ms, chỉ gửi khi form <b>dirty</b> và đã hợp lệ, kèm version của bản ghi để server từ chối khi có người khác sửa trước.',
      'Chặn rời trang: <code>beforeunload</code> cho tab/refresh, blocker của router cho điều hướng trong app. Hai cái này <b>không thay thế nhau</b>.',
    ],
    code: `const schema = z.object({
  email: z.string().email(),
  items: z.array(z.object({ qty: z.number().int().min(1) })).min(1),
});
type Form = z.infer<typeof schema>;
// ✅ uncontrolled: gõ phím không re-render cả form 50 trường
const { register, setError, handleSubmit } = useForm<Form>({
  resolver: zodResolver(schema),
});
async function onSubmit(v: Form) {
  const r = await api.save(v);          // 422 = lỗi nghiệp vụ từ server
  // ✅ map lỗi về đúng field thay vì toast chung chung
  r.errors?.forEach((e) =>
    setError(e.field as keyof Form, { message: e.msg }));
}`,
    trap: 'Autosave debounce mà không huỷ request cũ: gõ nhanh rồi dừng, hai bản lưu chạy song song, bản <b>cũ</b> về sau đè lên bản mới. Cần <code>AbortController</code> hoặc version/updatedAt để server chặn ghi đè.',
    tip: 'Validate ở client chỉ là UX, server vẫn phải validate lại — dùng chung đúng một schema zod cho cả hai phía là điểm cộng lớn. Lỗi trả về nên có <code>field</code> + <code>message</code> theo chuẩn để map thẳng.',
  },
  {
    id: '03', level: 'mid', title: 'Auth · Access token & Refresh token',
    questions: [
      'Lưu access token ở localStorage có an toàn không?',
      'Nhiều request cùng dính 401 thì refresh ra sao?',
    ],
    points: [
      'Cookie <b>httpOnly + Secure + SameSite</b>: JS không đọc được nên XSS không lấy được token ra ngoài. <code>localStorage</code> thì mọi script trên trang, kể cả thư viện bên thứ ba, đều đọc được.',
      'Access token sống ngắn (5–15 phút), refresh token sống dài và nên <b>rotate</b> mỗi lần dùng. Server phát hiện refresh token cũ bị dùng lại thì thu hồi cả phiên.',
      '<b>Refresh ngầm</b>: interceptor bắt 401 → gọi <code>/auth/refresh</code> → phát lại request cũ. Bắt buộc có cờ <code>_retry</code> để không lặp vô hạn khi refresh cũng 401.',
      'Gộp refresh bằng <b>single-flight</b>: giữ một promise dùng chung, mọi request 401 cùng chờ promise đó rồi mới chạy lại.',
      'Đăng xuất nhiều tab: phát tín hiệu qua <code>BroadcastChannel</code> hoặc sự kiện <code>storage</code>. Dùng cookie thì phải chống CSRF: SameSite=Lax/Strict, thêm CSRF token cho request cross-site.',
    ],
    code: `let refreshing: Promise<unknown> | null = null;

api.interceptors.response.use(undefined, async (err) => {
  const req = err.config;
  if (err.response?.status !== 401 || req._retry) throw err;
  req._retry = true;                      // ✅ chỉ thử lại đúng 1 lần
  // ✅ gộp N request 401 vào 1 lần refresh (single-flight)
  refreshing ??= api
    .post('/auth/refresh')
    .finally(() => { refreshing = null; });

  await refreshing;
  return api(req);                        // phát lại request cũ
});`,
    trap: 'Không gộp refresh là bug khó chịu nhất: 8 request song song cùng 401 → bắn 8 lần refresh. Với refresh token rotation, lần đầu đổi token xong thì 7 lần sau cầm token đã cũ → server coi là tái sử dụng và <b>đá user ra</b> ngẫu nhiên.',
    tip: 'Đừng nói httpOnly cookie là miễn nhiễm XSS. Kẻ tấn công tuy không đọc được token nhưng vẫn <b>gọi API thay mặt user</b> ngay trên tab đó. httpOnly chỉ chặn việc mang token đi nơi khác.',
  },
  {
    id: '04', level: 'mid', title: 'Upload file lớn · Chunk · Resume',
    questions: [
      'Upload file 5GB đi qua app server có vấn đề gì?',
      'Mất mạng giữa chừng thì upload tiếp thế nào?',
    ],
    points: [
      '<b>Presigned URL</b>: server chỉ ký URL, browser <code>PUT</code> thẳng lên S3. App server không phải gánh 5GB body, không đụng giới hạn body size của proxy.',
      '<b>Multipart upload</b>: chia chunk 5–10MB, mỗi part một presigned URL, xong gọi complete kèm danh sách <b>ETag</b> theo đúng thứ tự part.',
      '<b>Resume</b>: lưu <code>uploadId</code> và các part đã xong (IndexedDB) hoặc hỏi lại server danh sách part. Đứt mạng thì chỉ gửi lại phần thiếu, không làm lại từ đầu.',
      'Tiến độ: <code>XMLHttpRequest</code> có <code>upload.onprogress</code>, <code>fetch</code> thực tế chưa dùng được (cần request stream + HTTP/2, hỗ trợ chưa đều). Tổng tiến độ = cộng byte của các part.',
      'Song song <b>có giới hạn</b> 3–4 part, nhiều hơn là nghẽn băng thông và dễ timeout. Giới hạn dung lượng và kiểm MIME <b>ở server</b> — client chỉ là UX.',
    ],
    code: `const CHUNK = 8 * 1024 * 1024;              // 8MB mỗi part
const limit = pLimit(3);                    // ✅ tối đa 3 part song song
const { uploadId, urls } = await api.start(file.name, file.size);

const etags = await Promise.all(
  urls.map((url, i) => limit(async () => {
    if (done.has(i)) return done.get(i)!;   // ✅ bỏ part đã xong
    const blob = file.slice(i * CHUNK, (i + 1) * CHUNK);
    const r = await fetch(url, { method: 'PUT', body: blob });
    const tag = r.headers.get('ETag')!;
    done.set(i, tag);                       // lưu lại để lần sau bỏ qua
    return tag;
  })),
);
await api.complete(uploadId, etags);`,
    trap: 'Upload thẳng lên S3 thì server <b>không nhìn thấy nội dung file</b> lúc upload. Chỉ chặn bằng <code>accept</code> và <code>file.type</code> ở client là vô nghĩa — đổi đuôi là qua. Phải ràng buộc content-length trong policy và quét MIME thật sau khi upload xong.',
    tip: 'Presigned URL nên hết hạn ngắn (5–15 phút) và ký kèm <code>Content-Type</code>. File chỉ được đánh dấu hợp lệ sau khi job nền kiểm magic bytes và quét virus — trước đó đừng cho hiển thị công khai.',
  },
  {
    id: '05', level: 'mid', title: 'Realtime · WebSocket · SSE · Polling',
    questions: [
      'Khi nào chọn SSE thay vì WebSocket?',
      'Mất kết nối 30 giây thì làm sao không mất tin nhắn?',
    ],
    points: [
      '<b>Polling</b> hợp khi dữ liệu đổi chậm và trễ vài giây chấp nhận được. Đơn giản nhất, không phải nuôi kết nối — đừng vội chê.',
      '<b>SSE</b> một chiều server → client, chạy trên HTTP thường: tự reconnect sẵn, có <code>Last-Event-ID</code>, qua proxy dễ. Hợp notification, feed, tiến độ job.',
      '<b>WebSocket</b> hai chiều, độ trễ thấp, hợp chat và collab. Đổi lại phải tự làm reconnect, heartbeat, auth và scale khó hơn hẳn.',
      'Reconnect phải có <b>exponential backoff + jitter</b>, không thì server vừa sống lại là cả vạn client đập vào cùng lúc. <b>Heartbeat</b> ping/pong để phát hiện kết nối đã chết.',
      'Đồng bộ lại sau mất kết nối: mỗi message có <code>seq</code>/id, reconnect thì gửi id cuối đã nhận để server bù phần thiếu. Client phải <b>dedupe</b> vì giao hàng là at-least-once.',
    ],
    code: `let retry = 0, lastId = '';
function connect() {
  const ws = new WebSocket(\`\${URL}?since=\${lastId}\`);  // bù phần thiếu
  ws.onopen = () => { retry = 0; };
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (seen.has(m.id)) return;      // ✅ dedupe: at-least-once
    seen.add(m.id); lastId = m.id; push(m);
  };
  // ❌ reconnect ngay lập tức → cả vạn client đập vào server vừa sống
  ws.onclose = () => {
    const ms = Math.min(30_000, 2 ** retry++ * 1000);
    setTimeout(connect, ms * (0.5 + Math.random()));  // ✅ có jitter
  };
}`,
    trap: 'Scale WebSocket qua nhiều server: không sticky session thì reconnect rơi sang node khác, mà danh sách subscribe nằm trong RAM node cũ → client kết nối thành công nhưng <b>im lặng mãi mãi</b>. Cần Redis pub/sub để fan-out giữa các node.',
    tip: 'SSE hay bị proxy buffer lại làm message kẹt — tắt <code>proxy_buffering</code> của Nginx hoặc gửi header <code>X-Accel-Buffering: no</code>. Load balancer cũng thường cắt kết nối idle sau 60s, đó là lý do thật sự cần heartbeat.',
  },
  {
    id: '06', level: 'mid', title: 'i18n · Ngày giờ · Tiền tệ',
    questions: [
      'Vì sao phải lưu UTC thay vì giờ người dùng?',
      'Số nhiều của tiếng Anh và tiếng Ả Rập xử lý sao?',
    ],
    points: [
      'Tách chuỗi khỏi code theo key + namespace. <b>Không nối chuỗi thủ công</b> vì trật tự từ mỗi ngôn ngữ mỗi khác — dùng interpolation có tên: <code>t(&#39;hi&#39;, { name })</code>.',
      'Số nhiều theo <code>Intl.PluralRules</code> hoặc cú pháp ICU: tiếng Việt 1 dạng, tiếng Anh 2, tiếng Ả Rập 6. Tự viết <code>n &gt; 1 ? ... : ...</code> là sai ngay khi thêm ngôn ngữ.',
      '<code>Intl.DateTimeFormat</code> và <code>Intl.NumberFormat</code> lo giúp thứ tự ngày/tháng, dấu phân cách, ký hiệu tiền theo locale. Tự ghép chuỗi là tự chuốc bug.',
      'Lưu <b>UTC</b> (<code>timestamptz</code> / ISO 8601) ở DB, chỉ đổi sang timezone người dùng ở tầng hiển thị. Sự kiện lặp trong tương lai phải lưu kèm tên IANA vì offset đổi theo DST.',
      'Chia nhỏ gói ngôn ngữ: lazy-load theo locale và namespace, đừng bundle cả 20 ngôn ngữ. Tiền tệ lưu <b>số nguyên đơn vị nhỏ nhất</b> để tránh sai số float.',
    ],
    code: `// ❌ tự ghép: sai thứ tự ngày/tháng và dấu phân cách theo locale
//    \`\${d.getDate()}/\${d.getMonth() + 1} — \${(n / 100).toFixed(2)}đ\`

// ✅ để Intl lo, chỉ truyền locale + timezone của người dùng
new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium', timeStyle: 'short', timeZone: user.tz,
}).format(new Date(iso));        // iso luôn là UTC lấy từ server

new Intl.NumberFormat(locale, {
  style: 'currency', currency: 'VND',
}).format(amountInMinorUnit / 100);

// ❌ n > 1 ? 'items' : 'item'  →  vỡ với tiếng Ả Rập (6 dạng)
// ✅ t('cart.items', { count: n })  →  ICU plural lo phần còn lại`,
    trap: '<code>new Date(&#39;2024-03-10&#39;)</code> là <b>UTC</b> nửa đêm; thêm phần giờ <code>&#39;2024-03-10T00:00:00&#39;</code> thì lại thành giờ <b>local</b>. Người ở GMT+7 nhìn cùng một chuỗi ra hai ngày khác nhau — lỗi lệch một ngày kinh điển.',
    tip: 'Tạo formatter <b>một lần</b> rồi tái dùng, gọi <code>Intl.DateTimeFormat</code> trong vòng lặp 1000 dòng là chậm thấy rõ. Có <code>Intl.RelativeTimeFormat</code> cho “3 ngày trước”. Nhớ test layout với tiếng Đức (chuỗi dài hơn) và ngôn ngữ RTL.',
  },
  {
    id: '07', level: 'senior', title: 'Bảng 10.000 dòng · Server-side · URL',
    questions: [
      'Bảng 10.000 dòng thì sort và filter đặt ở đâu?',
      'Chọn nhiều dòng qua nhiều trang thì lưu thế nào?',
    ],
    points: [
      'Sort/filter/paginate <b>ở server</b>. Client-side chỉ đúng khi toàn bộ dữ liệu đã nằm sẵn ở client; tải 10.000 dòng là vài MB JSON, riêng khâu parse đã chặn main thread.',
      '<b>Virtualization</b> dòng (TanStack Virtual, react-window) chỉ render khoảng 30 dòng trong viewport cộng overscan. Cần chiều cao dòng ổn định hoặc đo động.',
      'Ô tìm kiếm: debounce ~300ms <b>và</b> huỷ request cũ bằng <code>AbortController</code>. Giữ dữ liệu trang trước trong lúc chờ để bảng không nhấp nháy.',
      'Đẩy page/sort/filter lên <b>URL query</b>: F5, share link, nút back đều giữ nguyên trạng thái. Đây là thứ hay bị quên nhất và rất dễ ghi điểm.',
      'Chọn qua nhiều trang: giữ <code>Set</code> id đã chọn, thêm cờ “chọn tất cả theo filter” rồi gửi <b>điều kiện filter</b> cho server thay vì 10.000 id. Export lớn thì đẩy sang job nền.',
    ],
    code: `const [sp] = useSearchParams();        // ✅ state bảng nằm trên URL
const q = { page: +(sp.get('page') ?? 1), sort: sp.get('sort') ?? 'id',
            search: sp.get('q') ?? '' };

const { data } = useQuery({
  queryKey: ['rows', q],
  queryFn: ({ signal }) => api.rows(q, { signal }),  // ✅ huỷ request cũ
  placeholderData: keepPreviousData,   // v5 — không nhấp nháy khi đổi
});

// ❌ tải hết 10.000 dòng rồi sort ở client → chặn main thread
// ✅ chọn nhiều trang: giữ id, "chọn tất cả" thì gửi filter cho server
const [picked] = useState<Set<string>>(new Set());
const payload = allMatching ? { filter: q } : { ids: [...picked] };`,
    trap: 'Debounce nhưng quên huỷ request cũ: gõ “abc” bắn 3 request, response của “ab” về <b>sau</b> “abc” → bảng hiển thị kết quả không khớp ô tìm kiếm. Phải huỷ bằng <code>AbortController</code> hoặc bỏ qua response có query key cũ.',
    tip: 'Sort ở server phải <b>ổn định</b>: thêm <code>id</code> làm tie-breaker, không thì hai bản ghi cùng giá trị sẽ nhảy qua lại và item bị trùng hoặc mất giữa các trang. Virtualization cũng phá <code>Ctrl+F</code> và bản in — cần đường export.',
  },
  {
    id: '08', level: 'senior', title: 'Error tracking · Log · Feature flag',
    questions: [
      'Lỗi chỉ xảy ra ở production thì điều tra thế nào?',
      'Deploy tính năng mới mà chưa dám bật cho tất cả?',
    ],
    points: [
      '<b>Error boundary theo tầng</b>: một boundary ở route để giữ layout, thêm boundary quanh từng widget để một khối hỏng không làm trắng cả trang.',
      'Gom lỗi về <b>Sentry</b> kèm release version, user id, breadcrumb. Upload <b>source map</b> lúc build để đọc được stack trace của bundle đã minify.',
      '<b>Correlation id</b>: frontend sinh id cho mỗi request (<code>X-Request-Id</code>), backend log kèm id đó → nối được một luồng từ cú click đến query DB. Gắn luôn id vào tag của Sentry.',
      'Phân biệt <b>lỗi người dùng</b> (400/422, nhập sai) với <b>lỗi hệ thống</b> (5xx, TypeError). Ném hết vào Sentry thì alert nhiễu, lỗi thật bị chìm và không ai còn nhìn dashboard.',
      '<b>Feature flag</b>: rollout theo % user, tắt tức thì không cần deploy (kill switch), tách release khỏi deploy. Flag phải có hạn dọn, để lâu code thành mê cung <code>if</code>.',
    ],
    code: `Sentry.init({
  dsn, release: import.meta.env.VITE_RELEASE,  // khớp với source map
  tracesSampleRate: 0.1,
  beforeSend(ev) {
    // ✅ lỗi nghiệp vụ (422) là bình thường, đừng làm nhiễu alert
    return ev.tags?.kind === 'user' ? null : ev;
  },
});

api.interceptors.request.use((c) => {
  c.headers['X-Request-Id'] = crypto.randomUUID();  // nối log FE ↔ BE
  return c;
});
// ✅ kill switch: tắt ngay, không cần deploy lại
{flags.newCheckout ? <NewCheckout /> : <OldCheckout />}`,
    trap: 'Error boundary bắt được ít hơn bạn tưởng: lỗi ném trong <code>onClick</code>, trong <code>setTimeout</code> hay trong promise không await đều <b>lọt ra ngoài</b>. Không đăng ký <code>onerror</code> và <code>unhandledrejection</code> thì Sentry trắng trơn trong khi app đang hỏng.',
    tip: 'Đừng deploy file <code>.map</code> cạnh bundle trên CDN — lộ nguyên source; upload riêng cho Sentry rồi xoá. Flag đọc một lần lúc mount thì đổi giữa chừng user sẽ thấy UI nửa cũ nửa mới, nên tính sẵn cách làm mới hoặc remount.',
  },
];
