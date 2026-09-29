SET = {
    "id": "bo-06",
    "code": "06",
    "slug": "bo-06-system-design-fe",
    "short": "System Design — Frontend",
    "title": "System Design — Frontend",
    "subtitle": "Vòng thiết kế: cho một đề mở, bạn có 20 phút vừa nói vừa vẽ. Họ chấm cách bạn hỏi lại, chia tầng, và nêu trade-off — không chấm bạn ra đúng một đáp án.",
    "level": "System Design",
    "duration": "60 phút · 2–3 đề",
    "format": "Vẽ bảng + nói",
    "icon": "📐",
    "stack": ["Kiến trúc FE", "State", "Performance", "Trade-off"],
    "intro": "<strong>Khung 5 bước dùng cho MỌI đề</strong>: (1) Hỏi lại làm rõ yêu cầu và giới hạn — 2–3 phút, đừng bỏ; (2) Chốt phạm vi: cái gì làm, cái gì để sau; (3) Thiết kế dữ liệu / state trước, UI sau; (4) Chia component và luồng dữ liệu; (5) Edge case, performance, và <em>nêu trade-off của chính lựa chọn mình</em>. Nhảy vào code ngay mà không hỏi lại là lỗi bị trừ điểm nhiều nhất.",
    "sections": [
        {
            "title": "Đề thiết kế",
            "questions": [
                {
                    "q": "Thiết kế một Form Builder kéo thả (như ENAS) từ con số không.",
                    "prompt": """<p>Khách hàng doanh nghiệp tự tạo form thu lead bằng kéo thả, nhúng vào website của họ. Yêu cầu: 15+ loại field, validation phức tạp, logic hiện/ẩn theo điều kiện, multi-step, đa ngôn ngữ, và form đã publish thì không được vỡ khi sửa.</p>
<p>Bạn có 20 phút. Vẽ kiến trúc.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại trước (2 phút)</strong>
<ul>
<li>Bao nhiêu khách / bao nhiêu form mỗi khách? (quyết định có cần optimize list hay không)</li>
<li>Form nhúng vào site khách bằng iframe hay script inline? (ảnh hưởng toàn bộ chiến lược CSS và bundle size)</li>
<li>Có cần nhiều người sửa cùng lúc không? (nếu có thì bài toán khác hoàn toàn — cần CRDT/OT)</li>
<li>Bundle của form public cần nhỏ cỡ nào? (nhúng vào site khách thì mỗi KB là tiền của họ)</li>
<li>Có cần offline / lưu nháp khi mất mạng?</li>
</ul>
</li>

<li><strong>Chốt phạm vi</strong>
<p>Làm: builder + renderer + versioning + i18n. Để sau: real-time collaboration, A/B testing, analytics chi tiết. Nói rõ điều này để họ biết bạn biết cắt scope.</p>
</li>

<li><strong>Thiết kế schema TRƯỚC — đây là quyết định quan trọng nhất</strong>
<pre class="code"><code>FormVersion {
  version: 2,
  locales: ['ja', 'en'],
  steps: [
    { id: 'step1', title: { ja: '基本情報', en: 'Basic info' },
      fields: ['f_name', 'f_email'] }
  ],
  fields: {
    f_name: {
      key: 'f_name',              // BẤT BIẾN, không bao giờ đổi
      type: 'text',
      label: { ja: 'お名前', en: 'Name' },
      rules: [{ kind: 'required' }, { kind: 'maxLength', value: 50 }],
      visibleWhen: null,
    },
    f_company: {
      key: 'f_company', type: 'text',
      visibleWhen: { field: 'f_type', op: 'eq', value: 'business' },
    },
  },
}</code></pre>
<p>Ba quyết định phải giải thích:</p>
<ul>
<li><strong><code>fields</code> là map, không phải array</strong> — tra cứu O(1) khi đánh giá <code>visibleWhen</code>, và thứ tự nằm ở <code>steps</code> nên đổi thứ tự không đụng vào field.</li>
<li><strong><code>key</code> bất biến</strong>: label đổi thoải mái, dữ liệu đã thu vẫn nối đúng. Dùng label làm khoá là sai chí tử.</li>
<li><strong><code>visibleWhen</code> là dữ liệu, không phải code</strong>: lưu được, so sánh được giữa các version, và không cần <code>eval</code>.</li>
</ul>
</li>

<li><strong>Kiến trúc 4 layer + registry</strong>
<pre class="code"><code>schema     ── nguồn sự thật, lưu DB
converter  ── schema -&gt; Zod (validate runtime + z.infer ra type)
             schema &lt;-&gt; API shape
engine     ── đánh giá visibleWhen, tính step hiện tại, tổng hợp lỗi
ui         ── FIELD_REGISTRY: { text, email, select, postal, file, ... }

Thêm field type = thêm 1 entry registry + 1 rule converter.
KHÔNG sửa engine.</code></pre>
<p>Builder và renderer public <strong>dùng chung engine + registry</strong>, chỉ khác wrapper (builder có overlay chọn/kéo, public thì không). Viết hai bản là chắc chắn lệch.</p>
</li>

<li><strong>Versioning — phần phân biệt người có kinh nghiệm</strong>
<ul>
<li><code>form</code> → nhiều <code>form_version</code>; <code>submission</code> trỏ tới <code>formVersionId</code>.</li>
<li>Không sửa version đã publish; luôn tạo version mới (giống migration DB).</li>
<li>Xem lead cũ thì render bằng schema version <em>của nó</em>.</li>
<li>Xoá field: ẩn khỏi form mới nhưng <strong>giữ dữ liệu cũ</strong>; cảnh báo rõ trước khi publish.</li>
</ul>
</li>

<li><strong>Performance & edge case</strong>
<ul>
<li><strong>Bundle của form public</strong>: code-split theo field type — form chỉ có text/email thì không tải code của file-upload và date-picker. Đây là yêu cầu thật vì nhúng vào site khách.</li>
<li><strong>CSS isolation</strong>: nhúng inline thì CSS của site khách sẽ phá form. Giải: Shadow DOM, hoặc CSS Modules với prefix rất riêng, hoặc iframe (an toàn nhất nhưng khó auto-resize và khó style theo brand khách).</li>
<li><strong>Form dài</strong>: uncontrolled (react-hook-form), tách mỗi step một component, chỉ <code>useWatch</code> field nào có field khác phụ thuộc.</li>
<li><strong><code>visibleWhen</code> vòng tròn</strong> (A hiện khi B, B hiện khi A): phải detect ở builder lúc lưu, không để runtime treo.</li>
<li><strong>Field bị ẩn thì validate không?</strong> Không — và phải <em>xoá giá trị</em> của nó khi ẩn, nếu không submit sẽ mang theo dữ liệu user không định gửi.</li>
<li><strong>Lưu nháp</strong> cho form dài: localStorage theo formVersionId, cảnh báo khi rời trang.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off tự nêu ở cuối:</strong> "Kiến trúc schema-driven này tốn chi phí ban đầu cao hơn hẳn so với code từng form bằng tay, và debug khó hơn vì một tầng gián tiếp. Nó chỉ đáng khi form là <em>sản phẩm</em> — khách tự tạo hàng nghìn form. Nếu chỉ có 5 form nội bộ thì em sẽ code tay, nhanh hơn và dễ đọc hơn."</p>""",
                    "note": {"type": "star", "text": "Đây là đề bạn <strong>đã làm thật</strong> ở ENAS. Nếu được chọn đề, chọn đề này. Nhưng đừng nói \"em đã làm rồi\" rồi kể lại — hãy <em>thiết kế lại</em> và chỉ ra chỗ bạn sẽ làm khác lần trước."},
                },
                {
                    "q": "Thiết kế dashboard realtime nhiều widget cho hệ thống bệnh viện.",
                    "prompt": """<p>20 widget: số bệnh nhân đang nằm, đơn thuốc chờ duyệt, tồn kho thuốc sắp hết, biểu đồ nhập/xuất viện 30 ngày, danh sách cảnh báo… Mỗi widget có tần suất cập nhật khác nhau. User có thể kéo thả sắp xếp và ẩn widget không cần.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại</strong>
<ul>
<li>"Realtime" là bao nhiêu giây? 1 giây hay 30 giây? (khác biệt hoàn toàn về kiến trúc)</li>
<li>Có bao nhiêu người xem cùng lúc? (20 người nội bộ thì poll là đủ; 10.000 người thì cần push)</li>
<li>Widget nào <em>thật sự</em> cần realtime, widget nào chỉ cần mở ra là đúng? (thường chỉ 2–3 cái cần)</li>
<li>Layout lưu theo user hay theo role?</li>
</ul>
</li>

<li><strong>Phân loại widget theo nhu cầu cập nhật — bước quan trọng nhất</strong>
<div class="table-wrap"><table>
<thead><tr><th>Nhóm</th><th>Ví dụ</th><th>Cách cập nhật</th></tr></thead>
<tbody>
<tr><td>Tĩnh trong ngày</td><td>Biểu đồ 30 ngày, báo cáo tháng</td><td>Fetch 1 lần, <code>staleTime</code> 10–30 phút</td></tr>
<tr><td>Cập nhật vừa</td><td>Số bệnh nhân đang nằm, tồn kho</td><td>Poll 30–60s, chỉ khi tab visible</td></tr>
<tr><td>Cần nhanh</td><td>Đơn thuốc chờ duyệt, cảnh báo nguy cấp</td><td>Poll 5–10s, hoặc SSE nếu BE hỗ trợ</td></tr>
</tbody></table></div>
<p>Nói thẳng: "Em <strong>không</strong> làm realtime cho cả 20 widget. 90% dashboard không cần — làm hết là tốn tài nguyên vô ích và khó vận hành."</p>
</li>

<li><strong>Kiến trúc dữ liệu</strong>
<pre class="code"><code>// Mỗi widget là một query độc lập -&gt; lỗi 1 widget không giết cả trang
function useWidgetData(widget) {
  return useQuery({
    queryKey: ['widget', widget.type, widget.params],
    queryFn:  () =&gt; fetchWidget(widget.type, widget.params),
    staleTime:       WIDGET_CONFIG[widget.type].staleTime,
    refetchInterval: WIDGET_CONFIG[widget.type].interval,
    refetchIntervalInBackground: false,   // tab ẩn thì ngừng poll
  });
}</code></pre>
<p><strong>Vì sao không gộp thành 1 API <code>/dashboard</code>:</strong> một widget chậm hoặc lỗi thì cả dashboard trắng; và không thể có tần suất refresh khác nhau. Ngược lại 20 request cùng lúc cũng không tốt → giải pháp giữa: <strong>BE cung cấp endpoint batch</strong> nhận danh sách widget, FE gom các widget cùng nhóm tần suất vào một request. Nêu được cả hai chiều là ghi điểm.</p>
</li>

<li><strong>Component & layout</strong>
<pre class="code"><code>&lt;DashboardGrid layout={userLayout} onLayoutChange={save}&gt;
  {visibleWidgets.map(w =&gt; (
    &lt;WidgetShell key={w.id} title={w.title} onHide={...}&gt;
      &lt;ErrorBoundary fallback={&lt;WidgetError onRetry={...} /&gt;}&gt;
        &lt;Suspense fallback={&lt;WidgetSkeleton /&gt;}&gt;
          &lt;WidgetRenderer widget={w} /&gt;     {/* registry theo type */}
        &lt;/Suspense&gt;
      &lt;/ErrorBoundary&gt;
    &lt;/WidgetShell&gt;
  ))}
&lt;/DashboardGrid&gt;</code></pre>
<ul>
<li><strong>ErrorBoundary từng widget</strong> — bắt buộc. Một widget lỗi không được làm trắng dashboard.</li>
<li><strong>Registry theo type</strong> — thêm widget mới không sửa core (giống form builder).</li>
<li><strong>Lazy-load chart lib</strong> — ApexCharts/Recharts rất nặng, chỉ tải khi có widget dạng chart trên layout.</li>
<li><strong>Layout lưu ở server theo user</strong>, có "reset về mặc định của role".</li>
</ul>
</li>

<li><strong>Performance & edge case</strong>
<ul>
<li><strong>Tab ẩn thì ngừng poll</strong> (<code>refetchIntervalInBackground: false</code>) — không thì 20 widget × 20 người poll suốt đêm.</li>
<li><strong>Kéo thả không được trigger refetch</strong>: layout đổi không nằm trong <code>queryKey</code>.</li>
<li><strong>Skeleton phải giữ đúng chiều cao</strong> widget, không thì layout nhảy (CLS) mỗi lần refresh.</li>
<li><strong>Dữ liệu cũ vs loading</strong>: dùng <code>isFetching</code> hiện spinner nhỏ ở góc widget và <strong>vẫn hiện số cũ</strong>, thay vì xoá trắng — bác sĩ đang đọc số thì không được làm nó biến mất.</li>
<li><strong>Múi giờ và mốc "hôm nay"</strong>: dashboard bệnh viện phải tính theo ngày làm việc, và ca đêm vắt qua nửa đêm — phải chốt định nghĩa với PO, không tự giả định.</li>
<li><strong>Quyền</strong>: widget phải filter theo permission — điều dưỡng không thấy widget doanh thu. Và filter ở BE, FE chỉ ẩn UI.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Em chọn polling thay vì WebSocket cho hệ thống nội bộ ~50 người vì đơn giản hơn nhiều khi vận hành: không cần quản lý connection, không cần lo reconnect, không cần sticky session sau load balancer. Nếu yêu cầu xuống dưới 1 giây hoặc lên hàng nghìn người xem thì em sẽ chuyển sang SSE (một chiều, nhẹ) trước khi nghĩ tới WebSocket."</p>""",
                },
                {
                    "q": "Thiết kế chiến lược offline-first cho app dùng trong bệnh viện.",
                    "prompt": """<p>Wifi bệnh viện chập chờn, có phòng không có tín hiệu. Điều dưỡng phải ghi được phiếu chăm sóc kể cả khi mất mạng, và dữ liệu không được mất. Thiết kế.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại — phần này quyết định độ phức tạp gấp 10 lần</strong>
<ul>
<li>Chỉ cần <em>ghi</em> offline, hay cần <em>đọc</em> toàn bộ bệnh án offline? (đọc offline nghĩa là phải sync dữ liệu bệnh nhân xuống máy — vấn đề bảo mật lớn)</li>
<li>Offline bao lâu: 5 phút hay cả buổi?</li>
<li>Thiết bị dùng chung hay cá nhân? (dùng chung thì <strong>không được</strong> cache dữ liệu bệnh nhân trên máy)</li>
<li>Hai người có thể sửa cùng bản ghi khi cả hai offline không?</li>
</ul>
<p>Với hệ thống y tế em <strong>sẽ đề xuất thu hẹp scope</strong>: chỉ offline cho việc <em>nhập liệu</em> mà điều dưỡng đang làm, không sync cả bệnh án. Đơn giản hơn nhiều và an toàn hơn nhiều.</p>
</li>

<li><strong>Kiến trúc 3 tầng</strong>
<pre class="code"><code>UI  ──&gt;  Local store (IndexedDB)  ──&gt;  Sync queue  ──&gt;  API
         ^ nguồn sự thật cho UI          ^ hàng đợi mutation

- Ghi: luôn ghi vào IndexedDB TRƯỚC, UI cập nhật ngay -&gt; không bao giờ mất
- Mutation đẩy vào queue, có trạng thái: pending | syncing | synced | conflict
- Online lại: xử lý queue theo thứ tự, từng cái một</code></pre>
<p>Công cụ: Dexie.js cho IndexedDB (API dễ hơn nhiều so với IndexedDB thuần), <code>navigator.onLine</code> + event <code>online</code>/<code>offline</code> để phát hiện (nhưng phải nhớ <code>onLine</code> chỉ báo có card mạng, không báo có internet — cần thêm health-check ping).</p>
</li>

<li><strong>Hàng đợi sync</strong>
<pre class="code"><code>SyncItem {
  id: uuid,               // sinh ở CLIENT -&gt; dùng làm idempotency key
  entity: 'nursing_note',
  op: 'create' | 'update',
  payload: {...},
  baseVersion: 12,        // version đã đọc, để BE detect conflict
  status: 'pending',
  attempts: 0,
  createdAt: ...,
}</code></pre>
<ul>
<li><strong>Client sinh UUID</strong> — cực kỳ quan trọng: gửi lại 3 lần thì BE nhận ra cùng một bản ghi, không tạo trùng. Không có cái này thì mất mạng lúc gửi = tạo 2 phiếu.</li>
<li><strong>Xử lý tuần tự theo entity</strong>, không parallel — tạo rồi update cùng bản ghi phải đúng thứ tự.</li>
<li><strong>Retry có backoff</strong>, giới hạn số lần, quá thì chuyển sang trạng thái cần người xử lý.</li>
</ul>
</li>

<li><strong>Xử lý xung đột — phần không được né</strong>
<p>Với dữ liệu y tế: <strong>không bao giờ merge tự động, không bao giờ ghi đè im lặng.</strong></p>
<ul>
<li>BE trả 409 kèm bản server hiện tại.</li>
<li>FE đưa item sang trạng thái <code>conflict</code>, hiện màn hình so sánh: "Bạn ghi mạch 80, [Điều dưỡng B] đã ghi 85 lúc 14:05. Chọn giá trị nào?"</li>
<li>Con người quyết định. Cả hai bản đều được ghi vào audit log.</li>
<li><strong>Giảm xung đột từ thiết kế dữ liệu</strong>: chia phiếu theo mốc giờ + người ghi, thì hai người ghi hai mốc khác nhau không đụng nhau. Đây là cách giải tốt nhất — tránh xung đột thay vì xử lý xung đột.</li>
</ul>
</li>

<li><strong>UX — quyết định thành bại</strong>
<ul>
<li><strong>Trạng thái phải luôn nhìn thấy</strong>: banner "Đang offline — 3 phiếu chờ gửi". Điều dưỡng phải <em>biết</em> dữ liệu chưa lên server, không được để họ tưởng đã xong.</li>
<li><strong>Từng bản ghi có badge</strong>: ☁️ đã đồng bộ / ⏳ chờ gửi / ⚠️ xung đột.</li>
<li><strong>Chặn hành động không thể offline</strong>: duyệt đơn thuốc, xuất kho — những thứ cần kiểm tra tồn/quyền tại thời điểm thực thi thì <strong>phải disable khi offline</strong> với lý do rõ ràng. Cho làm offline rồi fail lúc sync là tệ hơn không cho làm.</li>
<li><strong>Cảnh báo trước khi đóng tab</strong> khi còn item pending.</li>
</ul>
</li>

<li><strong>Bảo mật — điểm bắt buộc phải nêu</strong>
<ul>
<li>Dữ liệu bệnh nhân trong IndexedDB là <strong>dữ liệu y tế nằm trên máy dùng chung</strong>. Phải: chỉ lưu tối thiểu cần thiết, <strong>xoá sạch khi logout</strong>, xoá theo TTL, và cân nhắc mã hoá (dù khoá phải ở đâu đó nên chỉ giảm rủi ro chứ không triệt tiêu).</li>
<li>Không lưu token trong IndexedDB.</li>
<li>Phải thống nhất với bộ phận tuân thủ của bệnh viện — đây không phải quyết định kỹ thuật thuần.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Offline-first làm độ phức tạp tăng rất mạnh — mọi bug sync đều khó tái hiện. Nên em sẽ hỏi rất kỹ xem nó có thật sự cần không, hay vấn đề gốc là wifi bệnh viện và giải pháp đúng là lắp thêm access point. Nếu cần thật thì em làm offline cho <em>đúng một luồng</em> quan trọng nhất trước, không làm cho cả app."</p>""",
                    "note": {"type": "star", "text": "Câu cuối — <em>\"có khi giải pháp đúng là lắp thêm wifi\"</em> — là loại câu trả lời mà interviewer senior rất thích: bạn nghĩ về vấn đề, không chỉ về công nghệ."},
                },
                {
                    "q": "Thiết kế hệ thống theming + white-label cho SaaS multi-tenant.",
                    "prompt": """<p>Mỗi khách hàng doanh nghiệp muốn admin portal mang màu sắc và logo của họ; một số khách muốn dùng domain riêng. Có ~200 khách. Thiết kế phía frontend.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại</strong>
<ul>
<li>Khách chỉ đổi <em>màu và logo</em>, hay đổi được cả <em>layout</em>? (khác nhau một trời một vực)</li>
<li>Có cần dark mode song song với brand màu của khách không?</li>
<li>Domain riêng: chỉ subdomain (<code>acme.app.com</code>) hay cả custom domain (<code>portal.acme.jp</code>)?</li>
<li>Khách tự đổi theme trong settings, hay ta cấu hình cho họ?</li>
</ul>
</li>

<li><strong>Nền tảng: CSS custom properties, không phải build riêng cho từng khách</strong>
<pre class="code"><code>/* Token semantic, KHÔNG phải tên màu */
:root {
  --color-brand:        #3d5a99;
  --color-brand-text:   #ffffff;   /* chữ trên nền brand */
  --color-brand-subtle: #eaeff9;
  --radius-base:        8px;
  --font-brand:         'Inter', system-ui, sans-serif;
}</code></pre>
<p><strong>Vì sao không build riêng mỗi khách:</strong> 200 khách = 200 lần build + 200 artifact để deploy và vá bảo mật. Không khả thi. Một bundle + token runtime là đúng.</p>
<p><strong>Vì sao token phải semantic</strong> (<code>--color-brand</code>) chứ không phải mô tả (<code>--color-blue</code>): khách đổi sang màu đỏ thì biến tên <code>blue</code> thành vô nghĩa, và không ai dám sửa.</p>
</li>

<li><strong>Nạp theme — tránh flash màu mặc định</strong>
<pre class="code"><code>// Cách tốt nhất: server/edge biết tenant từ hostname và
// inline &lt;style&gt; token vào HTML ngay từ response đầu tiên.
// Không có SSR thì: chặn render app bằng một promise ngắn,
// nhưng phải có CSS mặc định neutral để không flash màu sai.

// Với Next App Router:
export default async function Layout({ children }) {
  const tenant = await getTenantFromHost();   // đọc từ headers()
  return (
    &lt;html&gt;
      &lt;head&gt;
        &lt;style&gt;{`:root{
          --color-brand:${tenant.brand};
          --color-brand-text:${pickReadableText(tenant.brand)};
        }`}&lt;/style&gt;
      &lt;/head&gt;
      &lt;body&gt;{children}&lt;/body&gt;
    &lt;/html&gt;
  );
}</code></pre>
</li>

<li><strong>Vấn đề khó nhất: tương phản chữ/nền (accessibility)</strong>
<p>Khách chọn màu brand vàng nhạt → chữ trắng trên nền vàng không đọc được. Đây là bài toán thật, không phải chi tiết nhỏ.</p>
<ul>
<li><strong>Tính toán, không đoán</strong>: từ màu brand, tính độ tương phản với trắng và đen (WCAG), chọn cái nào ≥ 4.5:1 → gán vào <code>--color-brand-text</code>.</li>
<li><strong>Sinh thang màu</strong> từ một màu gốc (hover, active, subtle background) bằng thuật toán (OKLCH dễ kiểm soát độ sáng hơn HSL), không bắt khách chọn 10 màu.</li>
<li><strong>Cảnh báo ngay trong UI chọn màu</strong>: "Màu này không đạt chuẩn tương phản, chữ sẽ khó đọc" + preview thật.</li>
</ul>
</li>

<li><strong>Tích hợp với UI library</strong>
<p>Dự án dùng Ant Design → dùng <code>ConfigProvider</code> với <code>theme.token</code>, và <strong>map token của mình vào token AntD</strong> chứ không override CSS class của AntD (class name đổi giữa các version là vỡ hết). Với Tailwind thì cấu hình color trỏ vào CSS variable: <code>brand: 'var(--color-brand)'</code>.</p>
</li>

<li><strong>Custom domain & edge case</strong>
<ul>
<li><strong>Nhận diện tenant</strong>: từ hostname (edge middleware) — không từ localStorage, vì người dùng có thể thuộc nhiều tenant.</li>
<li><strong>Custom domain</strong> cần: DNS CNAME hướng về ta, cấp SSL tự động (ACME/Let's Encrypt), và UI hướng dẫn + kiểm tra trạng thái DNS cho khách. Phần FE là màn hình "Thêm domain → hiện bản ghi cần tạo → nút kiểm tra → trạng thái (chờ DNS / chờ SSL / hoạt động)".</li>
<li><strong>Cookie và CORS</strong> phải tính theo domain: cookie <code>SameSite</code> và domain scope khác nhau giữa subdomain và custom domain.</li>
<li><strong>Logo</strong>: giới hạn kích thước/định dạng, và luôn có fallback — khách xoá logo thì không được để trống chỗ.</li>
<li><strong>Email và PDF xuất ra</strong> cũng phải theo brand — theming không chỉ là web. Đây là chỗ hay bị quên và khách sẽ phản hồi.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Em giới hạn khách chỉ đổi <em>token</em> (màu, logo, font, bán kính góc) chứ không đổi được layout. Cho đổi layout nghĩa là ta phải hỗ trợ 200 biến thể UI khác nhau — mọi tính năng mới phải test 200 lần. Giới hạn này làm khách hơi kém tự do nhưng giữ cho sản phẩm vận hành được."</p>""",
                },
                {
                    "q": "Thiết kế lớp data-fetching / API layer cho một app lớn 100+ màn hình.",
                    "prompt": """<p>Codebase 100+ màn hình, 3 team cùng làm, BE có ~200 endpoint. Hiện tại mỗi người gọi <code>axios</code> theo kiểu riêng, type viết tay, xử lý lỗi không nhất quán. Thiết kế lại.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại</strong>
<ul>
<li>BE có OpenAPI/Swagger không? (quyết định có sinh type tự động được hay không — đây là câu hỏi quan trọng nhất)</li>
<li>Có nhiều BE service hay một monolith?</li>
<li>Auth kiểu gì — token refresh, hay cookie?</li>
<li>Có yêu cầu offline / optimistic update không?</li>
</ul>
</li>

<li><strong>Kiến trúc 4 tầng, mỗi tầng một việc</strong>
<pre class="code"><code>packages/api-client/
  http.ts          ── 1 instance axios/fetch: baseURL, interceptor auth,
                      chuẩn hoá lỗi, retry, trace id
  generated/       ── type + client SINH TỪ OpenAPI (đừng viết tay)
  endpoints/       ── hàm mỏng theo domain: patients.list(), orders.approve()
  queries/         ── queryKey factory + useQuery/useMutation hook

apps/web/features/patients/
  components, hooks (dùng queries/ ở trên)</code></pre>
</li>

<li><strong>Chuẩn hoá lỗi — một lần, dùng khắp nơi</strong>
<pre class="code"><code>export class ApiError extends Error {
  constructor(
    public status,
    public code,          // mã nghiệp vụ từ BE, ví dụ 'INSUFFICIENT_STOCK'
    public fieldErrors,   // { email: 'đã tồn tại' } cho form
    message,
    public traceId,       // để đối chiếu log khi support
  ) { super(message); }
}

http.interceptors.response.use(undefined, (err) =&gt; {
  if (!err.response) throw new ApiError(0, 'NETWORK', null, 'Mất kết nối', null);

  const { status, data, headers } = err.response;

  if (status === 401) return handleRefreshAndRetryOnce(err);   // 1 lần duy nhất

  throw new ApiError(status, data?.code, data?.fieldErrors,
                     data?.message ?? 'Có lỗi xảy ra', headers['x-trace-id']);
});</code></pre>
<p><strong>Ba điểm phải nói:</strong></p>
<ul>
<li><strong>Refresh token chỉ retry một lần</strong> và phải <strong>gom các request đồng thời</strong> vào cùng một promise refresh — nếu không, 10 request 401 cùng lúc sẽ gọi refresh 10 lần và làm invalid lẫn nhau. Đây là bug rất hay gặp và rất khó debug.</li>
<li><strong>Mã lỗi nghiệp vụ, không parse message</strong>: <code>code === 'INSUFFICIENT_STOCK'</code> chứ không <code>message.includes('hết hàng')</code> — message là để hiển thị và sẽ được dịch.</li>
<li><strong><code>traceId</code></strong>: hiện ở dialog lỗi để user báo support, và gắn vào Sentry. Tiết kiệm rất nhiều thời gian debug production.</li>
</ul>
</li>

<li><strong>queryKey factory — chống lộn xộn khi 3 team cùng làm</strong>
<pre class="code"><code>export const patientKeys = {
  all:    ['patients'],
  lists:  () =&gt; [...patientKeys.all, 'list'],
  list:   (filters) =&gt; [...patientKeys.lists(), filters],
  details:() =&gt; [...patientKeys.all, 'detail'],
  detail: (id) =&gt; [...patientKeys.details(), id],
};

// invalidate mọi list mà không đụng detail
queryClient.invalidateQueries({ queryKey: patientKeys.lists() });</code></pre>
<p>Không có factory thì team A viết <code>['patients', filters]</code>, team B viết <code>['patient-list', filters]</code> → invalidate không ăn, cache trùng lặp, và không ai dám dọn. Đây là vấn đề <em>quy ước</em> quan trọng hơn kỹ thuật.</p>
</li>

<li><strong>Type: sinh, không viết tay</strong>
<ul>
<li>BE có OpenAPI → <code>openapi-typescript</code> sinh type, chạy trong CI. BE đổi shape thì <code>tsc</code> đỏ ngay ở PR, không phải vỡ lúc runtime.</li>
<li>Không có OpenAPI → đề xuất BE làm; trong lúc chờ thì validate runtime bằng <strong>Zod ở boundary</strong> và <code>z.infer</code> ra type — một nguồn duy nhất.</li>
<li><strong>Không dùng type sinh trực tiếp khắp UI</strong>: map sang type domain của mình ở tầng <code>endpoints</code>. Nếu không thì BE đổi tên field là phải sửa 80 file component.</li>
</ul>
</li>

<li><strong>Quy ước bắt buộc (phần làm nó thực sự chạy được với 3 team)</strong>
<ul>
<li><strong>Cấm gọi <code>axios</code>/<code>fetch</code> trực tiếp trong component</strong> — ESLint rule <code>no-restricted-imports</code>. Không có rule thì quy ước sẽ bị phá trong 2 sprint.</li>
<li><strong>Mặc định query config tập trung</strong>: <code>retry</code> chỉ cho 5xx, <code>staleTime</code> mặc định 30s, <code>refetchOnWindowFocus</code> tuỳ loại dữ liệu.</li>
<li><strong>Một tài liệu ADR</strong> ghi các quyết định trên, để người mới không hỏi lại và không ai tự ý đổi.</li>
<li><strong>Migration dần</strong>: không rewrite 100 màn hình một lần. Tạo hạ tầng mới, bắt buộc code mới dùng nó, và chuyển dần màn hình cũ khi có lý do sửa chúng.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Tầng gián tiếp này làm việc viết một API call đơn giản mất nhiều bước hơn, và người mới vào thấy hơi nặng. Đổi lại là nhất quán và an toàn khi có nhiều team. Với dự án 1 người 10 màn hình thì em <em>không</em> làm thế này — gọi React Query trực tiếp là đủ và tốt hơn."</p>""",
                },
            ],
        },
    ],
}
