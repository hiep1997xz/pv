SET = {
    "id": "bo-01",
    "code": "01",
    "slug": "bo-01-so-loai",
    "short": "Vòng sơ loại",
    "title": "Vòng sơ loại — HR + Tech screen",
    "subtitle": "Vòng đầu tiên, thường qua điện thoại hoặc Google Meet. HR hỏi động lực và lương, rồi một tech lead hỏi nhanh vài câu để loại người nói quá.",
    "level": "Middle",
    "duration": "30–45 phút",
    "format": "Call sơ loại",
    "icon": "📞",
    "stack": ["JS core", "CSS", "HTTP", "Git"],
    "intro": "Vòng này <strong>không</strong> đào sâu. Mục đích của họ là: (1) xác nhận CV không phóng đại, (2) xem bạn nói có mạch lạc không, (3) chốt lương và thời gian onboard trước khi tốn thời gian của cả team. Trả lời gọn — mỗi câu 1–2 phút, đừng lan man.",
    "sections": [
        {
            "title": "HR & động lực",
            "questions": [
                {
                    "q": "Bạn giới thiệu bản thân trong 60 giây và cho biết vì sao ứng tuyển vị trí này?",
                    "a": """<p>Em là Hiệp, Frontend Developer hơn 5 năm, mạnh nhất về React/Next.js + TypeScript. 3,5 năm đầu ở AMELA làm 5 dự án cho thị trường Nhật — job matching, quảng cáo, SaaS form marketing, hệ thống đặt lịch nha khoa. Từ 02/2025 em ở IniSoft, own end-to-end module: design Figma, code FE, viết cả BE Node/FastAPI khi cần, và tự dựng Jenkins CI/CD.</p>
<p>Về vì sao ứng tuyển: <em>[chèn 1–2 câu cụ thể về công ty — sản phẩm gì, vì sao bạn quan tâm]</em>. Em muốn làm sản phẩm có quy mô người dùng lớn hơn để va vào bài toán performance và kiến trúc thật, thay vì chỉ admin CMS nội bộ.</p>""",
                    "note": {"type": "red", "text": "Phần <em>vì sao ứng tuyển</em> bắt buộc phải cụ thể về công ty đó. Trả lời chung chung kiểu \"em thấy công ty có môi trường tốt\" là dấu hiệu bạn rải CV — HR trừ điểm ngay."},
                },
                {
                    "q": "Mức lương mong muốn của bạn là bao nhiêu?",
                    "a": """<p>Cách trả lời an toàn nhất, theo thứ tự ưu tiên:</p>
<ol>
<li><strong>Hỏi ngược trước (nếu HR chưa nói range):</strong> "Dạ trước khi em nói con số, anh/chị cho em biết budget của vị trí này khoảng bao nhiêu và JD nghiêng về Middle hay Senior không? Em muốn đưa con số đúng với scope công việc."</li>
<li><strong>Nếu bị ép nói trước:</strong> đưa <em>khoảng</em>, không đưa một số. "Với kinh nghiệm hiện tại và scope em đang làm — own module end-to-end, cả FE lẫn một phần BE và CI/CD — em kỳ vọng khoảng <strong>X – X+20%</strong>. Con số cuối em linh động tuỳ scope và phúc lợi."</li>
<li><strong>Neo bằng giá trị, không bằng lương cũ:</strong> nếu bị hỏi lương hiện tại, bạn có quyền không nói chi tiết: "Em xin phép không tiết lộ chính xác, nhưng kỳ vọng của em cho vị trí mới là khoảng X."</li>
</ol>
<p>Chuẩn bị trước 3 con số: <strong>mong muốn</strong> (nói ra), <strong>sàn</strong> (ngưỡng từ chối, không nói ra), và <strong>số bạn sẽ chốt nếu có thêm phúc lợi tốt</strong>.</p>""",
                    "note": {"type": "warn", "text": "Khảo giá thị trường trước (ITviec salary report, hỏi bạn bè cùng level). Nói một con số thấp hơn budget là mất tiền vĩnh viễn — công ty sẽ không tự nâng lên."},
                },
                {
                    "q": "Bạn cần bao lâu để onboard? Đang có offer nào khác không?",
                    "a": """<p>Trả lời thẳng và cụ thể: "Em cần báo trước <strong>30 ngày</strong> theo hợp đồng, nên nếu chốt trong tháng này thì em có thể bắt đầu từ <em>[ngày cụ thể]</em>."</p>
<p>Về offer khác — <strong>đừng bịa</strong>. Nếu có thật thì nói có, không cần nêu tên công ty và con số: "Em đang ở vòng cuối một chỗ nữa, nên nếu bên mình có timeline dự kiến thì em rất cảm ơn." Câu này vừa trung thực vừa tạo áp lực thời gian một cách tự nhiên.</p>
<p>Nếu không có offer nào thì đừng bịa ra để làm giá — HR hỏi thêm 2 câu là lộ, và mất niềm tin thì không lấy lại được.</p>""",
                },
                {
                    "q": "Công ty có thời điểm phải OT gấp cho release. Bạn thấy thế nào?",
                    "a": """<p>Không nên trả lời cực đoan ở cả hai đầu. Khung trả lời:</p>
<p>"Em làm dự án Nhật nhiều năm nên em hiểu có những mốc release không thể trượt, và những lúc đó em sẵn sàng đẩy thêm. Cái em quan tâm là OT có phải là <strong>ngoại lệ</strong> hay là <strong>mặc định</strong>. Nếu là ngoại lệ do lý do rõ ràng thì hoàn toàn bình thường. Nếu OT xảy ra mọi sprint thì thường vấn đề nằm ở estimate hoặc scope, và em muốn giúp xử lý phần gốc đó — em thường ước lượng có buffer và raise sớm khi thấy sprint quá tải, để không phải bù bằng OT."</p>
<p>Rồi hỏi lại: "Thực tế ở team mình, trung bình một quý có mấy đợt phải OT ạ?" — câu trả lời của họ cho bạn biết rất nhiều.</p>""",
                    "note": {"type": "info", "text": "Đây cũng là câu để BẠN đánh giá công ty. Nếu HR nói \"ở đây OT là văn hoá\" thì bạn đã có thông tin cần biết."},
                },
            ],
        },
        {
            "title": "Tech screen nhanh",
            "questions": [
                {
                    "q": "Đoạn code này log ra thứ tự nào? Giải thích event loop.",
                    "a": """<p>Thứ tự: <code>1 → 4 → 3 → 2</code>.</p>
<ul>
<li><code>console.log(1)</code> và <code>console.log(4)</code> chạy đồng bộ trước — hết call stack đã.</li>
<li>Sau đó engine vét <strong>microtask queue</strong>: <code>Promise.then</code> và <code>queueMicrotask</code> nằm ở đây → log <code>3</code>.</li>
<li>Cuối cùng mới tới <strong>macrotask</strong>: <code>setTimeout</code> (dù delay 0) → log <code>2</code>.</li>
</ul>
<p>Điểm cần nói thêm: microtask queue được vét <strong>cạn hoàn toàn</strong> sau mỗi macrotask, nên nếu một microtask lại schedule microtask khác thì nó chạy luôn trong vòng đó — đây là lý do một vòng lặp <code>Promise</code> vô hạn có thể treo UI mà <code>setTimeout</code> thì không.</p>
<p>Liên hệ thực tế: <code>await</code> trong React event handler nghĩa là phần sau <code>await</code> chạy ở microtask — nên <code>setState</code> trước và sau <code>await</code> có thể không được batch chung ở React 17 (React 18 thì automatic batching đã lo).</p>""",
                    "prompt": """<pre class="code"><code>console.log(1);
setTimeout(() =&gt; console.log(2), 0);
Promise.resolve().then(() =&gt; console.log(3));
console.log(4);</code></pre>""",
                },
                {
                    "q": "Đoạn <code>setInterval</code> này luôn log số 0. Vì sao và sửa thế nào?",
                    "a": """<p>Đây là <strong>stale closure</strong>. <code>useEffect</code> với deps <code>[]</code> chỉ chạy một lần, nên callback của <code>setInterval</code> capture <code>count</code> ở giá trị lần render đầu — mãi mãi là <code>0</code>. Mỗi giây nó tính <code>setCount(0 + 1)</code> = luôn 1.</p>
<p>Ba cách sửa, tốt dần:</p>
<ol>
<li><strong>Functional update</strong> — tốt nhất cho case này: <code>setCount(c =&gt; c + 1)</code>. React đưa giá trị mới nhất vào <code>c</code>, không cần đọc biến ngoài.</li>
<li><strong>Thêm vào deps</strong>: <code>[count]</code> — chạy đúng nhưng clear/tạo lại interval mỗi giây, không nên.</li>
<li><strong>Ref giữ giá trị mới nhất</strong>: <code>const latest = useRef(count); latest.current = count;</code> rồi đọc <code>latest.current</code> trong interval. Dùng khi cần đọc nhiều giá trị, không chỉ setState.</li>
</ol>
<p>Và luôn nhớ <code>return () =&gt; clearInterval(id)</code> trong cleanup — thiếu là leak, và trong React 18 StrictMode dev sẽ chạy effect 2 lần nên bug lộ ra ngay.</p>""",
                    "prompt": """<pre class="code"><code>const [count, setCount] = useState(0);

useEffect(() =&gt; {
  const id = setInterval(() =&gt; {
    console.log(count);        // luôn in ra 0
    setCount(count + 1);
  }, 1000);
  return () =&gt; clearInterval(id);
}, []);</code></pre>""",
                    "note": {"type": "star", "text": "Câu này gần như chắc chắn xuất hiện ở tech screen React. Nói được từ khoá <strong>stale closure</strong> là qua."},
                },
                {
                    "q": "Flexbox vs Grid — khi nào dùng cái nào? Và vì sao <code>position: sticky</code> của tôi không chạy?",
                    "a": """<p><strong>Chọn layout:</strong></p>
<ul>
<li><strong>Flex</strong> cho layout <em>một chiều</em>: thanh toolbar, hàng nút, list card tự wrap, căn giữa. Kích thước item do nội dung quyết định.</li>
<li><strong>Grid</strong> cho layout <em>hai chiều</em>: dashboard, bảng phức tạp, layout trang (sidebar + content). Bạn định nghĩa khung trước, item xếp vào.</li>
<li>Thực tế em dùng lẫn: Grid cho khung trang, Flex cho từng khối bên trong.</li>
</ul>
<p><strong><code>position: sticky</code> không chạy</strong> — theo thứ tự hay gặp nhất:</p>
<ol>
<li><strong>Thiếu <code>top</code>/<code>bottom</code></strong>: sticky không có ngưỡng thì không dính. Phải có <code>top: 0</code> (hoặc giá trị khác).</li>
<li><strong>Cha có <code>overflow: hidden/auto/scroll</code></strong>: sticky bị giới hạn trong cha đó, nếu cha không scroll thì không thấy hiệu ứng. Đây là nguyên nhân số 1.</li>
<li><strong>Cha không cao hơn element</strong>: sticky chỉ dính được trong phạm vi cha. Cha cao đúng bằng nó thì không có chỗ mà dính.</li>
<li><strong>Cha là flex và element bị stretch</strong>: thêm <code>align-self: flex-start</code>.</li>
</ol>
<p>Ở dự án admin em làm, sidebar sticky bị hỏng đúng vì wrapper có <code>overflow-x: auto</code> để cho bảng scroll ngang — em phải tách phần scroll ngang xuống riêng cái bảng.</p>""",
                },
                {
                    "q": "Tôi set <code>z-index: 9999</code> mà modal vẫn bị che. Giải thích.",
                    "a": """<p><code>z-index</code> chỉ so sánh được <strong>trong cùng một stacking context</strong>. Nếu modal nằm trong một stacking context mà bản thân context đó có z-index thấp hơn phần tử che nó, thì 9999 bên trong cũng vô nghĩa — giống như học sinh giỏi nhất của lớp yếu vẫn xếp sau lớp mạnh.</p>
<p>Những thứ <strong>tạo stacking context mới</strong> (hay bị bỏ qua): <code>transform</code>, <code>filter</code>, <code>opacity</code> nhỏ hơn 1, <code>will-change</code>, <code>position: fixed/sticky</code>, <code>isolation: isolate</code>, <code>contain: paint</code>, và <code>z-index</code> khác <code>auto</code> trên element đã positioned.</p>
<p>Ví dụ kinh điển: card có <code>transform: translateY(-2px)</code> khi hover → tạo context mới → dropdown bên trong card bị card bên cạnh che.</p>
<p><strong>Cách xử đúng:</strong> render modal/dropdown qua <strong>portal</strong> ra thẳng <code>document.body</code> (<code>createPortal</code>), thoát khỏi mọi context của cây cha. Đây là lý do Ant Design và mọi UI lib đều portal modal/tooltip/select ra body. Ngoài ra nên quản lý z-index bằng một thang bậc thống nhất trong design token (dropdown 1000, modal 1100, toast 1200) thay vì mỗi người tự đặt số.</p>""",
                },
                {
                    "q": "CORS là gì? Lỗi CORS thì FE sửa hay BE sửa?",
                    "a": """<p>CORS là cơ chế của <strong>browser</strong>: khi trang ở origin A gọi API ở origin B (khác scheme/host/port), browser chỉ cho JS đọc response nếu server B trả về header cho phép — <code>Access-Control-Allow-Origin</code>.</p>
<p>Với request "không đơn giản" (method PUT/DELETE/PATCH, có header custom như <code>Authorization</code>, content-type <code>application/json</code>), browser gửi trước một <strong>preflight <code>OPTIONS</code></strong> để hỏi phép; server phải trả <code>Allow-Origin</code>, <code>Allow-Methods</code>, <code>Allow-Headers</code>, và <code>Allow-Credentials</code> nếu dùng cookie.</p>
<p><strong>Ai sửa: gần như luôn là BE</strong> (hoặc gateway/nginx) — phải cấu hình header. FE không thể tự vá, vì đó là chính sách bảo mật của browser, không phải bug của code FE.</p>
<p>Những gì FE làm được:</p>
<ul>
<li>Dev local: dùng <strong>proxy</strong> của Vite/Next (<code>server.proxy</code>) để request đi cùng origin — cách em dùng hằng ngày.</li>
<li>Nếu dùng cookie: phải <code>withCredentials: true</code> ở FE <em>và</em> server phải set <code>Allow-Credentials: true</code> với <code>Allow-Origin</code> là origin cụ thể (không được dùng <code>*</code>).</li>
<li>Đọc được header custom từ response thì server phải khai báo <code>Access-Control-Expose-Headers</code> — hay quên khi cần đọc <code>X-Total-Count</code> cho phân trang.</li>
</ul>""",
                    "note": {"type": "warn", "text": "Đừng bao giờ đề xuất \"tắt CORS bằng extension Chrome\" hay <code>--disable-web-security</code> làm giải pháp. Nói thế là mất điểm ngay — đó chỉ là hack tạm trên máy bạn."},
                },
                {
                    "q": "401 vs 403 vs 422 vs 409 — khác nhau thế nào? Request nào thì FE nên tự retry?",
                    "a": """<div class="table-wrap"><table>
<thead><tr><th>Mã</th><th>Nghĩa</th><th>FE làm gì</th></tr></thead>
<tbody>
<tr><td><strong>401</strong></td><td>Chưa xác thực / token hết hạn</td><td>Thử refresh token 1 lần, thất bại thì logout + về trang login</td></tr>
<tr><td><strong>403</strong></td><td>Đã xác thực nhưng <em>không có quyền</em></td><td>Hiện trang/thông báo 403. <strong>Không</strong> logout, không retry</td></tr>
<tr><td><strong>404</strong></td><td>Không tồn tại</td><td>Empty state, không retry</td></tr>
<tr><td><strong>409</strong></td><td>Xung đột trạng thái — bản ghi đã bị người khác sửa, hoặc trùng dữ liệu</td><td>Hiện thông báo, cho user reload dữ liệu mới rồi làm lại. Không retry ngầm</td></tr>
<tr><td><strong>422</strong></td><td>Dữ liệu sai nghiệp vụ (validation phía server)</td><td>Map lỗi từng field vào form, không retry</td></tr>
<tr><td><strong>429</strong></td><td>Quá nhiều request</td><td>Retry có backoff, tôn trọng <code>Retry-After</code></td></tr>
<tr><td><strong>5xx</strong></td><td>Lỗi server</td><td>Retry với exponential backoff, tối đa 2–3 lần</td></tr>
</tbody></table></div>
<p><strong>Nguyên tắc retry:</strong> chỉ retry lỗi <em>tạm thời</em> (network, 429, 5xx) và chỉ với request <strong>idempotent</strong> — GET thì thoải mái, POST tạo đơn thì <strong>không</strong>, vì retry có thể tạo 2 bản ghi. Nếu buộc phải retry POST thì cần idempotency key do FE sinh và BE tôn trọng.</p>
<p>TanStack Query mặc định retry 3 lần — em luôn cấu hình lại: không retry 4xx, chỉ retry 5xx/network. Ở PSY HMS (y tế) em còn tắt retry cho mutation ghi dữ liệu để tránh tạo trùng đơn thuốc.</p>""",
                },
                {
                    "q": "<code>git merge</code> vs <code>git rebase</code>? Bạn đã push rồi mà muốn sửa commit thì làm sao?",
                    "a": """<ul>
<li><strong>merge</strong>: giữ nguyên lịch sử, tạo một commit merge. An toàn, lịch sử thật nhưng rối khi nhiều nhánh.</li>
<li><strong>rebase</strong>: viết lại các commit của nhánh bạn lên đầu nhánh đích → lịch sử thẳng, dễ đọc. Đổi lại là <strong>đổi hash commit</strong>.</li>
</ul>
<p><strong>Quy ước em dùng:</strong> <code>git pull --rebase</code> để cập nhật nhánh feature của mình (lịch sử sạch), nhưng merge (hoặc squash merge) khi đưa feature vào <code>develop</code> để giữ ngữ cảnh của MR. <strong>Không bao giờ rebase nhánh chung</strong> mà người khác đang làm trên đó — đổi hash là cả team gặp conflict.</p>
<p><strong>Đã push rồi mà muốn sửa:</strong></p>
<ul>
<li>Sửa commit cuối trên nhánh <em>riêng của mình</em>: <code>git commit --amend</code> rồi <code>git push --force-with-lease</code>. Dùng <code>--force-with-lease</code> chứ không phải <code>--force</code> — nó từ chối nếu có ai đã push thêm, tránh xoá mất việc của người khác.</li>
<li>Nhánh <strong>chung</strong> (main/develop): không rewrite. Sửa bằng <code>git revert &lt;sha&gt;</code> — tạo commit mới đảo ngược, lịch sử vẫn tiến về phía trước.</li>
<li><code>reset --hard</code> chỉ dùng local, và nhớ <code>git reflog</code> là phao cứu sinh khi reset sai.</li>
</ul>""",
                },
                {
                    "q": "debounce vs throttle khác gì? Trong dự án bạn dùng ở đâu?",
                    "a": """<ul>
<li><strong>debounce</strong>: dồn nhiều lần gọi thành một, chỉ chạy <em>sau khi im lặng</em> N ms. Dùng khi bạn chỉ quan tâm trạng thái cuối.</li>
<li><strong>throttle</strong>: đảm bảo chạy <em>tối đa 1 lần mỗi</em> N ms, kể cả sự kiện liên tục. Dùng khi cần cập nhật đều đặn trong lúc đang diễn ra.</li>
</ul>
<p>Thực tế trong dự án em:</p>
<ul>
<li><strong>debounce 300–400ms</strong>: ô search bệnh nhân và tra danh mục thuốc ở PSY, mission search ở Offerwall — không debounce là mỗi keystroke một request.</li>
<li><strong>debounce dài hơn (~800ms)</strong>: autosave bản nháp form builder ở ENAS.</li>
<li><strong>throttle ~16–50ms</strong>: xử lý <code>scroll</code> cho infinite scroll của offer wall, và cập nhật vị trí khi kéo thả block trong Template Builder — cần mượt theo frame nên throttle, debounce sẽ bị giật.</li>
<li><strong>Không tự viết nữa nếu có sẵn</strong>: với search em thường để React Query + <code>keepPreviousData</code> lo, chỉ debounce giá trị input; và với scroll thì ưu tiên <code>IntersectionObserver</code> thay vì listen scroll — browser tối ưu sẵn, không cần throttle.</li>
</ul>""",
                },
            ],
        },
    ],
}
