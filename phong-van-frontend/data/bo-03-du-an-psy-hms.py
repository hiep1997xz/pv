SET = {
    "id": "bo-03",
    "code": "03",
    "slug": "bo-03-du-an-psy-hms",
    "short": "Đào sâu PSY HMS",
    "title": "Đào sâu dự án — Phần mềm quản lý bệnh nhân tâm thần (PSY HMS)",
    "subtitle": "Vòng đào sâu 1 dự án: người phỏng vấn chọn dự án lớn nhất trong CV rồi hỏi đến khi bạn hết biết. Đây là vòng quyết định level của bạn.",
    "level": "Middle",
    "duration": "45–60 phút",
    "format": "Deep dive 1 dự án",
    "icon": "🏥",
    "stack": ["React 18", "AntD 5", "TanStack Query", "Zustand", "FastAPI", "pnpm monorepo"],
    "intro": "Dự án trong CV: HMS cho bệnh viện tâm thần, team 10 người, 02/2025–03/2026. Module: EMR chuẩn Bộ Y tế, kê đơn có duyệt nhiều bước, kho dược, RBAC 6 role, danh mục ICD-10 + 3.321 đơn vị hành chính, dashboard báo cáo MOH. <strong>Đây là dự án dài nhất và phức tạp nhất trong CV bạn — chắc chắn bị đào.</strong> Nguyên tắc vàng: nói được <em>quyết định</em> và <em>vì sao</em>, không chỉ liệt kê tính năng.",
    "sections": [
        {
            "title": "Kiến trúc & quyết định kỹ thuật",
            "questions": [
                {
                    "q": "Vẽ cho tôi kiến trúc frontend của dự án. Vì sao chọn pnpm monorepo mà không phải một repo đơn?",
                    "a": """<p><strong>Cấu trúc</strong> (vừa nói vừa vẽ):</p>
<pre class="code"><code>apps/
  web/              React 18 + Vite — ứng dụng chính
packages/
  ui/               component dùng chung, wrap Ant Design 5
  api-client/       lớp gọi API + type sinh từ schema FastAPI
  domain/           type nghiệp vụ, hằng số, rule validate thuần
  utils/            format ngày/số, helper không phụ thuộc React
backend/            FastAPI (Python)</code></pre>
<p><strong>Vì sao monorepo:</strong></p>
<ol>
<li><strong>Type dùng chung giữa nhiều app.</strong> Dự án có web chính và có phần báo cáo/portal tách riêng; type nghiệp vụ (bệnh nhân, đơn thuốc, phiếu điều dưỡng) phải giống nhau tuyệt đối. Copy type sang 2 repo là chắc chắn lệch sau 2 tháng.</li>
<li><strong>Đổi một lần, thấy lỗi ngay.</strong> Sửa type trong <code>domain</code> thì <code>tsc</code> của mọi app đỏ lên lập tức — thay vì merge repo A xong 1 tuần sau repo B mới vỡ.</li>
<li><strong>pnpm cụ thể</strong>: dùng symlink + content-addressable store nên tiết kiệm đĩa và <code>install</code> nhanh hơn nhiều; và nó <em>strict</em> — package không khai báo dependency thì không import được, chặn được phantom dependency mà npm/yarn hay để lọt.</li>
</ol>
<p><strong>Trade-off em thừa nhận:</strong> monorepo làm CI phức tạp hơn (phải xác định đổi package nào thì build lại app nào), và setup ban đầu tốn thời gian. Với team 10 người và 2 app thì đáng; với 1 app duy nhất thì em sẽ không dùng monorepo — đó là over-engineering.</p>""",
                    "note": {"type": "star", "text": "Nói được <strong>trade-off và khi nào KHÔNG nên dùng</strong> là dấu hiệu rõ nhất của Middle+. Ứng viên yếu chỉ kể ưu điểm."},
                },
                {
                    "q": "Vì sao chọn Vite + React Router thay vì Next.js, khi CV bạn nhiều kinh nghiệm Next?",
                    "a": """<p>Vì đây là <strong>hệ thống nội bộ bệnh viện</strong>, và Next.js giải quyết những bài toán mà dự án này không có:</p>
<ul>
<li><strong>Không cần SEO</strong> — sau login mới vào được, Google không bao giờ crawl.</li>
<li><strong>Không cần SSR để first-paint nhanh</strong> — user là bác sĩ/điều dưỡng mở app một lần đầu buổi rồi dùng cả ngày. Thời gian load lần đầu 2 giây không phải vấn đề; điều họ cần là <em>điều hướng giữa các màn siêu nhanh</em>, mà SPA làm tốt hơn.</li>
<li><strong>Triển khai đơn giản hơn</strong> — build ra static, serve bằng nginx trong Docker. Không cần Node server chạy thường trú, không cần lo scaling SSR. Bệnh viện deploy on-premise nên càng ít thành phần vận hành càng tốt.</li>
<li><strong>Vite dev nhanh hơn rõ rệt</strong> — HMR gần như tức thì, quan trọng khi làm form phức tạp phải thử lại hàng trăm lần trong ngày.</li>
</ul>
<p><strong>Khi nào em sẽ chọn Next cho dự án này?</strong> Nếu có thêm portal cho bệnh nhân tra cứu kết quả (cần SEO + first-paint nhanh trên mạng yếu), hoặc nếu cần server-side để giấu token/logic. Lúc đó em sẽ tách riêng một app Next trong monorepo, không đổi cả web nội bộ.</p>""",
                },
                {
                    "q": "TanStack Query + Zustand — bạn phân chia dữ liệu nào ở đâu? Auth token lưu ở đâu?",
                    "a": """<p><strong>Phân chia:</strong></p>
<div class="table-wrap"><table>
<thead><tr><th>Loại dữ liệu</th><th>Ở đâu</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Danh sách bệnh nhân, đơn thuốc, tồn kho, danh mục</td><td>TanStack Query</td><td>Là server state — cần cache, dedupe, invalidate sau mutation</td></tr>
<tr><td>Thông tin user + permission matrix</td><td>Zustand (nạp 1 lần sau login)</td><td>Cần đọc đồng bộ ở guard/menu khắp nơi, không muốn là async query</td></tr>
<tr><td>Trạng thái UI form nhiều bước, tab đang mở, filter</td><td>Zustand hoặc URL param</td><td>Client state thuần</td></tr>
<tr><td>Filter của bảng</td><td><strong>URL search param</strong></td><td>Để bác sĩ copy link gửi đồng nghiệp là thấy đúng bộ lọc — yêu cầu nghiệp vụ thật</td></tr>
</tbody></table></div>
<p><strong>Auth token:</strong> đây là câu hỏi bảo mật, em trả lời theo thứ tự ưu tiên:</p>
<ol>
<li><strong>Lý tưởng: httpOnly cookie</strong> + <code>Secure</code> + <code>SameSite=Lax</code>, kèm CSRF token. JS không đọc được token nên XSS không lấy được.</li>
<li><strong>Thực tế dự án này:</strong> access token ngắn hạn giữ <em>trong memory</em> (Zustand, không persist), refresh token trong httpOnly cookie. Reload trang thì gọi <code>/refresh</code> lấy access token mới.</li>
<li><strong>Không dùng <code>localStorage</code> cho token</strong> — bất kỳ XSS nào là mất token và nó tồn tại vĩnh viễn. Dữ liệu bệnh án thì rủi ro này không chấp nhận được.</li>
</ol>
<p>Thêm một điểm nghiệp vụ y tế: hệ thống có <strong>auto-logout sau thời gian không hoạt động</strong> — máy tính ở phòng khám dùng chung, bác sĩ đứng lên là phải khoá. Em làm bằng cách theo dõi activity, hiện cảnh báo trước 1 phút, và đồng bộ giữa các tab qua <code>storage</code> event để không bị một tab giữ session sống mãi.</p>""",
                },
            ],
        },
        {
            "title": "Nghiệp vụ khó",
            "questions": [
                {
                    "q": "Phiếu điều dưỡng chuẩn Bộ Y tế — kể cụ thể cái khó nhất bạn gặp và cách giải.",
                    "a": """<p>Cái khó nhất không phải số lượng field, mà là <strong>form phải giống bản giấy đến từng ô</strong> — vì điều dưỡng đã quen tay 20 năm, và vì phiếu in ra phải khớp mẫu MOH để thanh tra. Nên em không được tự do thiết kế lại UX.</p>
<p><strong>Bốn vấn đề và cách xử:</strong></p>
<ol>
<li><strong>Performance</strong> — hàng trăm input trên một phiếu. Giải: <code>react-hook-form</code> uncontrolled (gõ không re-render form), chia phiếu thành section collapse, mỗi section là component riêng có <code>memo</code>, chỉ <code>useWatch</code> đúng field cần theo dõi thay vì <code>watch()</code> toàn form.</li>
<li><strong>Validation phụ thuộc lẫn nhau</strong> — ví dụ mạch/huyết áp có ngưỡng cảnh báo khác nhau theo tuổi và theo chẩn đoán; có trường chỉ bắt buộc khi trường khác được tick. Giải: rule validate viết thành <em>hàm thuần</em> trong package <code>domain</code> (test được bằng unit test, không cần render), form chỉ gọi vào. Không nhét <code>if</code> nghiệp vụ vào JSX.</li>
<li><strong>Bảng theo dõi theo giờ</strong> — phiếu chức năng sống là ma trận giờ × chỉ số, điều dưỡng ghi nhiều lần trong ngày. Giải: dùng <code>useFieldArray</code>, mỗi cột (mốc giờ) là một row trong field array; key theo id sinh lúc tạo, không dùng index — nếu dùng index thì xoá một mốc giờ là dữ liệu dính sai cột.</li>
<li><strong>In ấn</strong> — phải ra đúng khổ A4/A5 khớp mẫu. Giải: một stylesheet <code>@media print</code> riêng với <code>@page { size: A4; margin: ... }</code>, ẩn toàn bộ chrome của app, dùng <code>break-inside: avoid</code> cho từng block để không cắt giữa bảng. Đây là phần tốn thời gian một cách bất ngờ — em phải in thử rất nhiều lần vì mỗi browser render print khác nhau.</li>
</ol>""",
                    "note": {"type": "warn", "text": "Nếu bạn chưa làm phần in, đừng nhận. Hãy nói phần bạn làm và thừa nhận phần đồng nghiệp làm — họ sẽ đào tiếp và lộ ngay."},
                },
                {
                    "q": "Kê đơn có duyệt nhiều bước. Bạn mô hình hoá workflow đó ở FE thế nào?",
                    "a": """<p>Em mô hình hoá thành <strong>state machine</strong> khai báo, không phải một rừng <code>if</code>:</p>
<pre class="code"><code>// domain/prescription-workflow.ts
export const STATUS = {
  DRAFT:     'draft',
  SUBMITTED: 'submitted',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  DISPENSED: 'dispensed',   // đã cấp phát ở kho dược
  CANCELLED: 'cancelled',
};

// Ai được làm gì, và chuyển sang trạng thái nào
export const TRANSITIONS = {
  draft:     [{ action: 'submit',  to: 'submitted', permission: 'prescription:create' }],
  submitted: [{ action: 'approve', to: 'approved',  permission: 'prescription:approve' },
              { action: 'reject',  to: 'rejected',  permission: 'prescription:approve' }],
  approved:  [{ action: 'dispense', to: 'dispensed', permission: 'inventory:dispense' }],
  rejected:  [{ action: 'revise',  to: 'draft',     permission: 'prescription:create' }],
};

export function allowedActions(status, can) {
  return (TRANSITIONS[status] ?? []).filter(t =&gt; can(t.permission));
}</code></pre>
<p><strong>Lợi ích:</strong> UI chỉ render nút từ <code>allowedActions(status, can)</code> — không có chỗ nào hard-code "nếu là bác sĩ và trạng thái submitted thì hiện nút duyệt". Thêm một bước duyệt mới (ví dụ trưởng khoa duyệt trước dược sĩ) là thêm entry vào bảng, không sửa component. Và bảng này test được bằng unit test thuần.</p>
<p><strong>Ba điểm khó thực tế:</strong></p>
<ul>
<li><strong>BE là nguồn sự thật.</strong> FE có state machine để hiện UI đúng, nhưng BE phải validate lại transition — nếu không, gọi API trực tiếp là duyệt được đơn của chính mình.</li>
<li><strong>Đơn bị người khác xử lý trong lúc mình đang xem.</strong> FE gửi kèm <code>version</code>/<code>updatedAt</code> mà mình đã đọc; BE trả <strong>409 Conflict</strong> nếu đã đổi. Em hiện dialog "Đơn này vừa được [ai] [làm gì]. Tải lại để xem bản mới nhất" — tuyệt đối không ghi đè im lặng.</li>
<li><strong>Thông báo</strong>: bác sĩ gửi đơn → dược sĩ phải biết. Em làm in-app notification, poll theo <code>refetchInterval</code> cho danh sách chờ duyệt (đủ dùng, đơn giản hơn WebSocket cho hệ thống nội bộ quy mô này).</li>
</ul>""",
                },
                {
                    "q": "Kho dược: nhập/xuất/kiểm kê, theo lô và nồng độ. Phần FE khó ở đâu?",
                    "a": """<p>Ba cái khó, đều là <strong>đúng số liệu</strong> chứ không phải UI:</p>
<ol>
<li><strong>Đơn vị quy đổi.</strong> Thuốc nhập theo thùng/hộp, xuất theo viên/ống; có loại theo nồng độ (mg/ml) nên còn nhân thể tích. Bài học em rút ra: <strong>mọi phép tính quy đổi và làm tròn phải ở BE</strong>, FE chỉ hiển thị. Nếu FE tự tính thì số trên màn hình và số trong DB sẽ lệch, và với thuốc thì lệch là chuyện lớn. FE chỉ validate <em>hình thức</em> (số dương, không quá tồn khả dụng theo số BE trả).</li>
<li><strong>Chọn lô khi xuất.</strong> Không phải cứ chọn thuốc là xong — phải chọn lô, và nghiệp vụ ưu tiên FEFO (hết hạn trước xuất trước). FE gợi ý lô theo thứ tự hết hạn, cảnh báo đỏ lô sắp hết hạn, và <strong>chặn</strong> lô đã hết hạn. Nhưng quyết định cuối vẫn do dược sĩ, nên là gợi ý + cảnh báo, không phải khoá cứng.</li>
<li><strong>Kiểm kê là form rất dài và không được mất dữ liệu.</strong> Dược sĩ đếm thực tế cả trăm mặt hàng, làm giữa buổi có thể bị gọi đi. Em làm autosave bản nháp (debounce ~1s, lưu <code>localStorage</code> + đồng bộ lên server theo phiên kiểm kê), cảnh báo khi rời trang mà chưa lưu, và hiện rõ "lệch" giữa số hệ thống và số đếm được để người ta tập trung vào dòng lệch.</li>
</ol>
<p><strong>Một sai lầm em đã mắc và sửa:</strong> ban đầu em hiện tồn kho từ cache React Query với <code>staleTime</code> 5 phút cho mượt. Nhưng hai dược sĩ xuất cùng lúc thì người sau thấy số cũ và xuất quá tồn. Em sửa: tồn kho là dữ liệu <strong>không được cache lâu</strong> — <code>staleTime: 0</code>, refetch khi focus, và BE là chốt cuối kiểm tra tồn tại thời điểm ghi (trả 409 nếu không đủ). Cache cho tiện thì được, cache cho số liệu tiền/thuốc thì không.</p>""",
                    "note": {"type": "star", "text": "Câu \"một sai lầm em đã mắc và sửa\" là thứ interviewer thích nhất. Chuẩn bị sẵn 2–3 câu chuyện kiểu này cho mỗi dự án."},
                },
                {
                    "q": "3.321 đơn vị hành chính + ICD-10 + danh mục thuốc. Xử lý danh mục lớn ở FE thế nào?",
                    "a": """<p><strong>Phân loại trước theo kích thước và tần suất đổi:</strong></p>
<ul>
<li><strong>Đơn vị hành chính (3.321 bản ghi, gần như không đổi)</strong>: tải một lần, <code>staleTime: Infinity</code>, lưu cache bền (em dùng persist của React Query vào IndexedDB, có gắn version để khi BE cập nhật danh mục thì invalidate). Select thì <strong>không</strong> render hết — dùng select có search phía client trên cấu trúc đã index sẵn (Map tỉnh → huyện → xã, build một lần trong <code>useMemo</code>).</li>
<li><strong>ICD-10 (hàng chục nghìn mã)</strong>: <strong>không</strong> tải hết về client. Dùng select <em>async search</em> — gõ ≥ 2 ký tự, debounce 300ms, BE trả top 20. Kèm cache theo <code>queryKey: ['icd10', keyword]</code> nên gõ lại từ khoá cũ là có ngay.</li>
<li><strong>Danh mục thuốc</strong>: tương tự ICD-10 nhưng thêm phần "thuốc hay dùng của bác sĩ này" tải sẵn để chọn nhanh — tối ưu theo hành vi thật, bác sĩ kê 80% đơn từ ~30 loại thuốc.</li>
</ul>
<p><strong>Ba kỹ thuật cụ thể:</strong></p>
<ol>
<li><strong>Bỏ dấu khi tìm</strong>: bác sĩ gõ "ha noi" phải ra "Hà Nội". Em chuẩn hoá NFD + bỏ dấu ở cả hai phía khi so khớp.</li>
<li><strong>Virtualize dropdown</strong>: Ant Design Select có <code>virtual</code> sẵn, nhưng phải bật và phải cẩn thận khi có custom <code>optionRender</code> — em từng bị treo dropdown vì render option nặng.</li>
<li><strong>Hiển thị giá trị đã lưu khi danh mục chưa tải</strong>: bản ghi cũ trỏ tới mã ICD đã bị ngừng dùng → select không tìm thấy label → hiện mã trơ trọi. Em xử bằng cách BE trả kèm label đã snapshot lúc lưu, FE ưu tiên label đó. Bài học: <strong>dữ liệu lịch sử phải giữ nhãn tại thời điểm ghi</strong>, không join lại danh mục hiện tại — vì danh mục y tế thay đổi theo quy định.</li>
</ol>""",
                },
            ],
        },
        {
            "title": "Chất lượng & vận hành",
            "questions": [
                {
                    "q": "CV ghi bạn viết unit test với Vitest + RTL. Test những gì? Coverage bao nhiêu?",
                    "a": """<p><strong>Trả lời trung thực và cụ thể</strong> — đây là chỗ dễ bị bắt nói quá:</p>
<p>"Coverage toàn dự án khoảng <em>[số thật của bạn]</em>%, không phải 80%. Em ưu tiên test theo rủi ro chứ không chạy theo con số:</p>
<ul>
<li><strong>Test nhiều nhất: hàm thuần trong <code>domain</code>/<code>utils</code></strong> — rule validate phiếu điều dưỡng, tính ngưỡng cảnh báo chỉ số sinh tồn, quy đổi đơn vị hiển thị, bảng transition của workflow đơn thuốc, hàm kiểm tra quyền. Đây là chỗ sai thì hậu quả nặng nhất và test lại dễ nhất — không cần render gì.</li>
<li><strong>Test custom hook</strong> bằng <code>renderHook</code>: <code>useCan</code>, hook xử lý form nhiều bước.</li>
<li><strong>Test component ở mức hành vi</strong> với RTL: form submit hợp lệ/không hợp lệ, nút bị disable đúng theo quyền, empty/error state. Em query theo <code>role</code> và <code>label</code>, không theo class — để refactor UI không vỡ test.</li>
<li><strong>Không test</strong>: layout, snapshot cả component lớn (vỡ liên tục, không nói lên điều gì), và code sinh tự động.</li>
</ul>
<p><strong>Thiếu sót em thừa nhận:</strong> dự án <em>chưa có E2E</em>. Với hệ thống y tế thì đáng ra phải có Playwright chạy các luồng quan trọng — kê đơn → duyệt → cấp phát, và xuất kho. Em đã đề xuất nhưng chưa được ưu tiên vì áp lực tính năng. Nếu được làm lại, em sẽ đẩy E2E cho đúng 3–4 luồng sinh tử ngay từ đầu thay vì để cuối."</p>""",
                    "note": {"type": "red", "text": "<strong>Tuyệt đối không bịa con số coverage.</strong> Họ chỉ cần hỏi \"test file nào nhiều nhất?\" hoặc \"mock FastAPI thế nào?\" là lộ. Số thật + lý do ưu tiên + thừa nhận thiếu E2E = đáng tin hơn 80% bịa."},
                },
                {
                    "q": "Hai điều dưỡng mở cùng một phiếu và sửa cùng lúc. Chuyện gì xảy ra?",
                    "a": """<p>Đây là bài toán <strong>concurrent edit</strong>, và câu trả lời đúng bắt đầu bằng "phụ thuộc vào mức độ nghiêm trọng của nghiệp vụ":</p>
<p><strong>Cách dự án làm — optimistic concurrency control:</strong></p>
<ol>
<li>Khi GET phiếu, BE trả kèm <code>version</code> (hoặc <code>updatedAt</code>).</li>
<li>Khi PUT, FE gửi lại <code>version</code> đã đọc.</li>
<li>BE so: nếu version trong DB đã khác → trả <strong>409 Conflict</strong> kèm bản mới nhất, <strong>không ghi</strong>.</li>
<li>FE hiện dialog: "Phiếu này vừa được [Điều dưỡng B] cập nhật lúc [giờ]. Bạn muốn xem bản mới / xem thay đổi / ghi đè?" — và ghi rõ trường nào khác nhau nếu làm được.</li>
</ol>
<p><strong>Vì sao không chọn cách khác:</strong></p>
<ul>
<li><strong>Last-write-wins (ghi đè im lặng)</strong>: đơn giản nhất nhưng <strong>không thể chấp nhận trong y tế</strong> — mất chỉ số bệnh nhân mà không ai biết.</li>
<li><strong>Pessimistic lock (khoá phiếu khi ai đó mở)</strong>: an toàn nhưng gây tắc — điều dưỡng mở rồi đi cấp cứu, phiếu khoá 2 tiếng. Nếu dùng thì phải có timeout và cho phép admin cướp lock. Em có đề xuất cách này cho <em>một số phiếu</em> nghiêm trọng nhất.</li>
<li><strong>CRDT / merge tự động kiểu Google Docs</strong>: đúng về kỹ thuật nhưng quá tốn cho nghiệp vụ này, và với dữ liệu y tế thì <em>merge tự động là nguy hiểm</em> — cần con người quyết định.</li>
</ul>
<p><strong>Giảm xung đột từ gốc (phần thực tế nhất):</strong> chia phiếu thành các <strong>section lưu độc lập</strong> theo người phụ trách và theo mốc giờ, thay vì một phiếu khổng lồ lưu một lần. Hai điều dưỡng ghi hai mốc giờ khác nhau thì không đụng nhau. Thiết kế dữ liệu đúng thì giảm 90% xung đột trước khi cần tới cơ chế xử lý xung đột.</p>""",
                },
                {
                    "q": "Audit log cho hệ thống y tế — FE cần đảm bảo gì?",
                    "a": """<p>Nguyên tắc đầu tiên: <strong>audit log phải ghi ở BE, không phải FE.</strong> FE gọi API thì BE tự ghi ai, làm gì, khi nào, trên bản ghi nào. Nếu để FE gửi event log thì chỉ cần user tắt JS hoặc gọi API trực tiếp là không có log — vô nghĩa cho mục đích thanh tra.</p>
<p><strong>Phần FE thực sự chịu trách nhiệm:</strong></p>
<ul>
<li><strong>Gửi đủ ngữ cảnh</strong> để BE ghi log có ý nghĩa: lý do thay đổi (với sửa bệnh án đã ký thì bắt buộc nhập lý do), tham chiếu bản ghi, và id thiết bị/phiên nếu nghiệp vụ cần.</li>
<li><strong>Giao diện tra cứu log</strong>: filter theo user / hành động / khoảng thời gian / bản ghi; phân trang server-side (log là bảng lớn nhất hệ thống); export CSV cho thanh tra.</li>
<li><strong>Hiển thị diff dễ đọc</strong>: log thô là JSON before/after, không ai đọc được. Em render thành bảng "Trường — Giá trị cũ — Giá trị mới", và map tên trường kỹ thuật sang nhãn nghiệp vụ tiếng Việt.</li>
<li><strong>Không log dữ liệu nhạy cảm ra console</strong> — em tắt mọi <code>console.log</code> ở production qua cấu hình build, và Sentry/error reporting phải <strong>scrub</strong> thông tin bệnh nhân trước khi gửi đi. Đây là điểm quan trọng: gửi stack trace kèm tên và chẩn đoán của bệnh nhân lên dịch vụ bên thứ ba là vi phạm.</li>
<li><strong>Audit log là read-only ở UI</strong> — không có nút sửa/xoá, kể cả cho system admin.</li>
</ul>""",
                },
                {
                    "q": "Nếu được làm lại dự án này từ đầu, bạn làm khác gì?",
                    "a": """<p>Bốn điều cụ thể (câu này họ đánh giá <strong>khả năng tự phản tỉnh</strong>, nên phải thật):</p>
<ol>
<li><strong>Có E2E cho 3–4 luồng sinh tử ngay từ sprint đầu</strong>, không để cuối. Luồng kê đơn → duyệt → cấp phát, và xuất kho. Mỗi lần refactor em đều phải test tay lại toàn bộ, rất tốn và vẫn sót.</li>
<li><strong>Chốt contract API bằng OpenAPI và sinh type tự động ngay từ đầu.</strong> Ban đầu em viết type tay theo tài liệu, BE đổi shape thì FE vỡ lúc runtime chứ không phải lúc build. Sau này mới sinh từ schema FastAPI — đáng ra làm từ ngày một.</li>
<li><strong>Thiết kế dữ liệu phiếu theo section độc lập từ đầu</strong>, không phải một object khổng lồ. Em phải refactor giữa dự án khi gặp bài toán concurrent edit và performance form — nếu chia đúng từ đầu thì tránh được cả hai.</li>
<li><strong>Thống nhất một thư viện form duy nhất.</strong> Dự án có chỗ dùng Ant Design Form, chỗ dùng react-hook-form vì mỗi người làm mỗi kiểu. Hai mô hình validate khác nhau nên khó tái sử dụng field component, và người mới vào bị rối. Đáng ra phải có ADR chốt từ tuần đầu.</li>
</ol>
<p>Một điều em <strong>giữ nguyên</strong>: đưa rule nghiệp vụ ra hàm thuần trong package <code>domain</code>. Đó là quyết định đúng nhất — nó làm phần khó nhất của dự án (validate y tế) test được và không bị dính vào React.</p>""",
                    "note": {"type": "star", "text": "Đây thường là câu cuối của vòng deep dive và là câu để lại ấn tượng. Trả lời được 3–4 điểm cụ thể + 1 điểm giữ nguyên = rất mạnh."},
                },
            ],
        },
    ],
}
