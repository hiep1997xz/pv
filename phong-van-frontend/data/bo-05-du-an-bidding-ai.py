SET = {
    "id": "bo-05",
    "code": "05",
    "slug": "bo-05-du-an-bidding-ai",
    "short": "Đào sâu Bidding Assistant (AI/RAG)",
    "title": "Đào sâu dự án — Trợ lý đấu thầu AI (RAG)",
    "subtitle": "Dự án mới nhất và là điểm bán tốt nhất của bạn hiện tại: hệ thống RAG thật. Vòng này quyết định bạn có được xếp vào nhóm làm được sản phẩm AI hay không.",
    "level": "Middle",
    "duration": "45–60 phút",
    "format": "Deep dive + AI",
    "icon": "🤖",
    "stack": ["React 19", "Vite", "TanStack Query", "shadcn/ui", "ReactFlow", "TipTap", "Qdrant", "Express"],
    "intro": "Dự án trong CV: RAG 3 phần — app Flutter (chat), AI backend Python + Qdrant, và <strong>Admin CMS (phần của bạn)</strong>. CMS gồm: dashboard ApexCharts, quản lý tài liệu upload/parse DOCX+PDF lên RustFS, editor quy trình đấu thầu bằng ReactFlow, RBAC theo tổ chức/phòng ban, FAQ, banner, app settings, API keys, audit log, i18next, device whitelist. <strong>Điểm mạnh:</strong> AI đang là thứ mọi công ty tuyển. <strong>Điểm yếu cần lấp:</strong> bạn làm CMS chứ chưa làm chat UI — phải nói được bạn hiểu phần đó thế nào.",
    "sections": [
        {
            "title": "Hiểu hệ thống RAG",
            "questions": [
                {
                    "q": "Giải thích RAG cho tôi như thể tôi là PO không biết kỹ thuật. Rồi giải thích lại cho tôi như một engineer.",
                    "a": """<p><strong>Cho PO:</strong> "Bình thường hỏi ChatGPT về hồ sơ đấu thầu của công ty mình thì nó không biết, vì nó chưa từng đọc tài liệu của mình — và nếu bắt trả lời thì nó sẽ bịa. RAG giải quyết bằng cách: trước khi hỏi AI, hệ thống đi tìm trong kho tài liệu của mình ra vài đoạn liên quan nhất, dán vào câu hỏi rồi mới đưa cho AI. AI trả lời dựa trên đúng đoạn đó và chỉ ra được nó lấy từ tài liệu nào, trang nào. Nên câu trả lời đúng theo tài liệu công ty và kiểm chứng được."</p>
<p><strong>Cho engineer — hai pha:</strong></p>
<pre class="code"><code>PHA 1 — INGEST (offline, phần CMS của em feed vào)
  upload DOCX/PDF -&gt; lưu RustFS (S3-compatible)
    -&gt; parse ra text + metadata (tài liệu, trang, mục)
    -&gt; chunking: cắt thành đoạn ~500-1000 token, có overlap
    -&gt; embedding: mỗi chunk -&gt; vector (model embedding)
    -&gt; upsert vào Qdrant kèm payload { docId, page, section, text }

PHA 2 — QUERY (online, app Flutter)
  câu hỏi -&gt; embedding
    -&gt; Qdrant similarity search (top-k, thường k=5-20)
    -&gt; (tuỳ chọn) rerank lại bằng cross-encoder cho chính xác hơn
    -&gt; nhồi các chunk vào prompt làm context
    -&gt; LLM sinh câu trả lời + trích dẫn nguồn từ metadata</code></pre>
<p><strong>Ba điểm quyết định chất lượng RAG</strong> (nói được là ghi điểm):</p>
<ol>
<li><strong>Chunking</strong> — cắt sai là hỏng cả hệ thống. Cắt cứng theo số ký tự sẽ cắt giữa bảng hoặc giữa câu. Với hồ sơ đấu thầu (có mục, khoản, bảng biểu) thì nên cắt theo cấu trúc tài liệu và giữ overlap để không mất ngữ cảnh ở biên.</li>
<li><strong>Retrieval quality &gt; model xịn.</strong> Nếu retrieve sai đoạn thì LLM tốt tới đâu cũng trả lời sai. Hybrid search (vector + keyword BM25) thường tốt hơn chỉ vector, đặc biệt với thuật ngữ chính xác kiểu mã hiệu, số hiệu thông tư — vector search hay bỏ sót mã số.</li>
<li><strong>Metadata là thứ tạo ra trích dẫn.</strong> Nếu ingest không lưu docId/page thì không bao giờ trích dẫn được, và người dùng không tin được câu trả lời.</li>
</ol>""",
                    "note": {"type": "star", "text": "Khả năng giải thích <strong>hai tầng</strong> (cho PO và cho engineer) là kỹ năng của người sắp lên Senior. Luyện câu này trước — nó áp dụng được cho mọi chủ đề."},
                },
                {
                    "q": "Phần bạn làm là CMS, không phải chat. Vậy bạn đóng góp gì vào chất lượng câu trả lời của AI?",
                    "a": """<p>Câu này là cơ hội chứ không phải bẫy — vì <strong>chất lượng RAG phụ thuộc rất nhiều vào khâu ingest</strong>, mà đó chính là phần em làm.</p>
<p><strong>Bốn đóng góp cụ thể:</strong></p>
<ol>
<li><strong>Chất lượng dữ liệu đầu vào.</strong> CMS là cửa duy nhất đưa tài liệu vào hệ thống. Em làm phần validate: chặn file scan không có text layer (parse ra rỗng thì chunk rỗng, embedding vô nghĩa, và AI sẽ không tìm thấy gì), cảnh báo file quá lớn, và hiện rõ trạng thái parse thất bại kèm lý do thay vì fail âm thầm.</li>
<li><strong>Metadata và phân loại.</strong> Document Types cho phép gắn loại tài liệu (thông tư, mẫu hồ sơ, hướng dẫn nội bộ). Metadata này đi vào payload Qdrant nên phía query có thể <strong>filter trước khi search</strong> — hỏi về thông tư thì chỉ tìm trong nhóm thông tư, giảm nhiễu đáng kể.</li>
<li><strong>Vòng phản hồi.</strong> FAQ module cho admin thấy câu hỏi người dùng hay hỏi; nếu một câu hỏi lặp lại mà AI trả lời kém thì admin biết cần bổ sung tài liệu nào. Đó là cách hệ thống tự tốt lên mà không cần train model.</li>
<li><strong>Quan sát được pipeline.</strong> Em làm màn hình trạng thái từng tài liệu (<code>pending → processing → indexed → failed</code>) và cho retry. Trước đó không ai biết tài liệu nào chưa vào index, nên có tình trạng "đã upload rồi mà AI bảo không biết" — hoá ra parse fail từ hôm trước.</li>
</ol>
<p><strong>Và nói thật phần mình chưa làm:</strong> "Phần chat UI và prompt engineering thì đồng nghiệp làm trên Flutter, em không làm. Em hiểu kiến trúc và những thách thức của phần đó — em nói được nếu anh muốn — nhưng em không nhận là mình đã implement."</p>""",
                    "note": {"type": "red", "text": "Đây là cách xử lý đúng khi CV nghe \"to\" hơn phần bạn làm: <strong>nhận đúng phần mình làm, chứng minh mình hiểu phần còn lại, không nhận vơ</strong>. Nhận vơ rồi bị đào 2 câu là mất toàn bộ niềm tin."},
                },
                {
                    "q": "Nếu giao bạn làm chat UI cho hệ thống này, bạn thiết kế thế nào? Streaming ra sao?",
                    "a": """<p><strong>Kiến trúc streaming:</strong> dùng <strong>SSE</strong> (Server-Sent Events) hoặc <code>fetch</code> + <code>ReadableStream</code>, không dùng WebSocket — vì luồng chỉ một chiều server→client, SSE đơn giản hơn, tự reconnect, và đi qua proxy/HTTP2 dễ hơn.</p>
<pre class="code"><code>async function streamAnswer(question, { signal, onToken, onCitations }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
    signal,                                  // để bấm "Dừng" huỷ được
  });

  if (!res.ok || !res.body) throw new Error('HTTP ' + res.status);

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE: các event cách nhau bằng dòng trống
    const events = buffer.split('\\n\\n');
    buffer = events.pop() ?? '';              // phần chưa đủ giữ lại cho vòng sau

    for (const evt of events) {
      const line = evt.replace(/^data: /m, '');
      if (line === '[DONE]') return;
      const payload = JSON.parse(line);
      if (payload.type === 'token')     onToken(payload.text);
      if (payload.type === 'citations') onCitations(payload.items);
    }
  }
}</code></pre>
<p><strong>Bảy quyết định UX/kỹ thuật</strong> em sẽ làm:</p>
<ol>
<li><strong>Buffer chưa hoàn chỉnh.</strong> Chunk từ network có thể cắt giữa một event JSON — phải giữ phần dư lại (như code trên). Đây là bug số 1 khi tự làm streaming.</li>
<li><strong>Nút Dừng</strong> bằng <code>AbortController</code>, và vẫn <strong>giữ lại phần đã sinh</strong> — user dừng vì đã đủ thông tin, xoá đi là tệ.</li>
<li><strong>Trích dẫn</strong> hiện thành chip <code>[1] [2]</code> bấm được, mở panel/sheet hiện đúng đoạn văn bản gốc + tên tài liệu + trang. Đây là thứ tạo niềm tin — không có citation thì user không dám dùng câu trả lời cho hồ sơ đấu thầu thật.</li>
<li><strong>Không auto-scroll cứng.</strong> Chỉ auto-scroll khi user đang ở đáy; nếu họ scroll lên đọc lại thì đừng kéo xuống, thay vào đó hiện nút "↓ tin mới".</li>
<li><strong>Render markdown an toàn</strong> — LLM trả markdown, phải sanitize (DOMPurify) trước khi render HTML, và render <em>tăng dần</em> mà không nhấp nháy. Mẹo: parse markdown theo block đã hoàn chỉnh, block cuối đang gõ thì render dạng text thô.</li>
<li><strong>Trạng thái rõ ràng</strong>: <em>đang tìm tài liệu</em> → <em>đang soạn câu trả lời</em> → <em>xong</em>. Retrieval mất 1–2 giây trước khi có token đầu tiên; không có indicator thì user tưởng treo.</li>
<li><strong>Không tìm thấy gì thì phải nói không biết.</strong> Nếu retrieval trả về điểm tương đồng quá thấp, UI nên hiện "Không tìm thấy tài liệu liên quan" thay vì để LLM bịa. Với nghiệp vụ đấu thầu thì bịa một con số là gây hậu quả pháp lý.</li>
</ol>""",
                },
            ],
        },
        {
            "title": "Pipeline tài liệu & CMS",
            "questions": [
                {
                    "q": "Upload tài liệu 200MB, parse mất 3 phút. Thiết kế UX và kỹ thuật cho luồng này.",
                    "a": """<p><strong>Nguyên tắc: tách upload (đồng bộ, có progress) khỏi xử lý (async, theo job).</strong></p>
<pre class="code"><code>1. FE validate: extension + MIME + size trước khi gửi
2. FE xin presigned PUT URL từ BE
3. FE upload TRỰC TIẾP lên RustFS (không qua app server)
   - hiện % qua onUploadProgress
   - AbortController để cancel
   - file lớn: multipart, chia 5-10MB/part, retry từng part
4. Upload xong -&gt; FE gọi BE "confirm" -&gt; BE tạo job parse
5. FE poll trạng thái document qua React Query refetchInterval
   pending -&gt; parsing -&gt; embedding -&gt; indexed | failed
6. indexed: badge xanh. failed: badge đỏ + lý do + nút retry</code></pre>
<pre class="code"><code>// Poll thông minh: chỉ poll khi còn việc đang chạy
const { data } = useQuery({
  queryKey: ['document', id],
  queryFn:  () =&gt; getDocument(id),
  refetchInterval: (query) =&gt; {
    const status = query.state.data?.status;
    return ['pending', 'parsing', 'embedding'].includes(status) ? 3000 : false;
  },
});</code></pre>
<p><strong>Quyết định UX quan trọng:</strong></p>
<ul>
<li><strong>Không block user 3 phút.</strong> Upload xong là đóng modal, tài liệu xuất hiện trong bảng với badge "Đang xử lý". Họ đi làm việc khác, quay lại thấy xong. Ép chờ modal là thiết kế sai.</li>
<li><strong>Upload nhiều file cùng lúc</strong>: hàng đợi, giới hạn 3 concurrent (nhiều hơn là tranh băng thông, chậm tất cả), hiện progress từng file và tổng.</li>
<li><strong>Đóng tab giữa lúc upload</strong>: cảnh báo <code>beforeunload</code>. Nhưng quan trọng hơn — vì đã presigned + multipart nên có thể <strong>resume</strong>; nếu chưa làm resume thì ít nhất phải cho upload lại mà không tạo bản ghi rác.</li>
<li><strong>Phân biệt 2 loại lỗi rõ ràng</strong>: lỗi upload (mạng, hết quota, presigned URL hết hạn) → retry upload; lỗi parse (file hỏng, PDF scan không có text, mật khẩu bảo vệ) → retry không giúp gì, phải thông báo user xử lý file. Gộp thành "Có lỗi xảy ra" là làm user bế tắc.</li>
</ul>
<p><strong>Bảo mật cần nói:</strong> validate ở FE chỉ là UX — BE phải verify content type thật bằng magic number (đổi <code>.exe</code> thành <code>.pdf</code> quá dễ), quét virus nếu nghiệp vụ yêu cầu, và presigned URL phải có TTL ngắn + giới hạn content-length để không ai dùng nó upload file 10GB.</p>""",
                },
                {
                    "q": "Editor quy trình đấu thầu bằng ReactFlow. Validate graph thế nào? Lưu dữ liệu ra sao?",
                    "a": """<p><strong>Tách rõ hai thứ: dữ liệu nghiệp vụ và dữ liệu hiển thị.</strong></p>
<pre class="code"><code>{
  // nghiệp vụ — cái BE và app mobile quan tâm
  stages: [{ id, name, groupId, order, requiredDocs: [...] }],
  edges:  [{ id, source, target, condition }],

  // hiển thị — chỉ để mở lại editor đúng như lúc lưu
  layout: { "stage-1": { x: 120, y: 40 }, ... }
}</code></pre>
<p>Nếu trộn toạ độ vào dữ liệu nghiệp vụ thì API nghiệp vụ bị nhiễm thông tin UI, và đổi cách vẽ là phải migrate dữ liệu — em từng thấy dự án khác mắc lỗi này.</p>
<p><strong>Validate graph — viết thành hàm thuần trong domain, không nhét vào component:</strong></p>
<pre class="code"><code>// Phát hiện cycle bằng DFS 3 màu
function findCycle(nodes, edges) {
  const adj = new Map(nodes.map(n =&gt; [n.id, []]));
  for (const e of edges) adj.get(e.source)?.push(e.target);

  const state = new Map();          // undefined | 'visiting' | 'done'

  function dfs(id, path) {
    if (state.get(id) === 'visiting') return [...path, id];   // gặp lại -&gt; cycle
    if (state.get(id) === 'done') return null;

    state.set(id, 'visiting');
    for (const next of adj.get(id) ?? []) {
      const cycle = dfs(next, [...path, id]);
      if (cycle) return cycle;
    }
    state.set(id, 'done');
    return null;
  }

  for (const n of nodes) {
    const cycle = dfs(n.id, []);
    if (cycle) return cycle;
  }
  return null;
}</code></pre>
<p><strong>Bộ rule validate em áp dụng:</strong></p>
<ol>
<li><strong>Không có cycle</strong> — quy trình đấu thầu phải kết thúc được. Khi phát hiện thì <strong>highlight đúng các node trong vòng lặp</strong> trên canvas, không chỉ hiện toast "Quy trình không hợp lệ".</li>
<li><strong>Không có node cô lập</strong> — trừ node bắt đầu, mọi node phải có ít nhất một cạnh vào.</li>
<li><strong>Đúng một node bắt đầu</strong>, ít nhất một node kết thúc (không có cạnh ra).</li>
<li><strong>Không có node không thể tới được</strong> từ node bắt đầu (BFS từ start, so với tập node).</li>
<li><strong>Điều kiện rẽ nhánh phải phủ hết</strong> — nếu một node có nhiều cạnh ra có điều kiện thì phải có nhánh mặc định, không thì luồng bị kẹt lúc chạy thật.</li>
</ol>
<p><strong>Chi tiết kỹ thuật ReactFlow:</strong> validate <strong>khi lưu</strong> chứ không mỗi lần kéo (kéo giữa các bước thì graph tạm thời không hợp lệ là bình thường, cảnh báo liên tục rất khó chịu); hiện danh sách lỗi ở panel bên cạnh, bấm vào là focus tới node tương ứng; và undo/redo dùng snapshot như builder — ReactFlow có <code>onNodesChange</code>/<code>onEdgesChange</code> nên gom thay đổi rồi commit.</p>""",
                },
                {
                    "q": "TipTap rich-text editor — bạn lưu nội dung dạng gì? HTML hay JSON? Sanitize ở đâu?",
                    "a": """<p><strong>Lưu JSON (ProseMirror doc), không lưu HTML.</strong> Lý do:</p>
<ul>
<li>JSON là <strong>cấu trúc</strong>, không phải cách trình bày — render ra HTML cho web, ra widget cho Flutter, ra plain text cho ingest vào vector DB, đều từ cùng một nguồn.</li>
<li>Query được: tìm mọi document có ảnh, đếm số heading, extract text để làm search index.</li>
<li>Không có nguy cơ HTML bẩn lọt vào DB. Nếu lưu HTML thì mỗi lần render là mỗi lần phải tin vào việc sanitize đã đúng.</li>
<li>Đổi cách render (đổi class CSS, đổi component) không cần migrate dữ liệu.</li>
</ul>
<p><strong>Ngoại lệ:</strong> em lưu <em>thêm</em> một bản plain text (hoặc HTML) đã render để phục vụ tìm kiếm và preview nhanh — nhưng nó là <strong>derived data</strong>, sinh lại được từ JSON, không phải nguồn sự thật.</p>
<p><strong>Sanitize — nguyên tắc: sanitize ở CẢ HAI ĐẦU, và BE là chốt bắt buộc.</strong></p>
<ol>
<li><strong>Lúc paste (FE)</strong>: user copy từ Word/web vào là mang theo cả <code>&lt;style&gt;</code>, <code>&lt;script&gt;</code>, inline style rác. TipTap có <code>transformPastedHTML</code> — em lọc ở đó, chỉ giữ mark được phép.</li>
<li><strong>Lúc lưu (BE)</strong>: validate JSON theo schema — chỉ cho phép node/mark trong danh sách trắng. Đây là chốt thật, vì FE có thể bị bypass bằng gọi API trực tiếp.</li>
<li><strong>Lúc render</strong>: nếu buộc phải render HTML (ví dụ nội dung cũ đã lưu dạng HTML) thì DOMPurify trước khi <code>dangerouslySetInnerHTML</code>. Không bao giờ tin dữ liệu trong DB là sạch — nó có thể được ghi vào từ trước khi có rule sanitize.</li>
</ol>
<p><strong>Hai chi tiết thực tế:</strong> (1) TipTap khá nặng nên phải lazy-load, chỉ import extension dùng thật, không import cả <code>StarterKit</code> nếu chỉ cần bold/italic/link; (2) ảnh trong editor phải upload lên RustFS và lưu URL, <strong>không</strong> lưu base64 vào JSON — base64 làm document phình lên hàng MB và làm chậm mọi query.</p>""",
                },
                {
                    "q": "API Keys management và device whitelist login. Bạn xử lý bảo mật ở FE thế nào?",
                    "a": """<p><strong>API Keys:</strong></p>
<ul>
<li><strong>Hiện key đầy đủ đúng một lần</strong> lúc tạo, kèm dòng chữ rõ ràng "Hãy lưu lại ngay, key sẽ không hiện lại". Sau đó chỉ hiện prefix (<code>sk_live_a3f9…</code>). BE lưu <strong>hash</strong> của key, không lưu plaintext — giống mật khẩu.</li>
<li><strong>Có nút copy</strong> nhưng không có nút "hiện lại" — vì không thể hiện lại nếu BE làm đúng.</li>
<li><strong>Metadata cần có</strong>: tên/mô tả (để biết key này dùng cho việc gì), ngày tạo, <em>lần dùng cuối</em>, scope quyền, ngày hết hạn. Lần dùng cuối rất quan trọng: nó cho admin biết key nào bỏ đi được.</li>
<li><strong>Revoke phải tức thì</strong> và có xác nhận rõ tác động ("Ứng dụng nào đang dùng key này sẽ ngừng hoạt động").</li>
<li><strong>Không log key</strong> ra console/Sentry/analytics. Em thêm scrub rule cho error reporting vì stack trace có lúc chứa header.</li>
</ul>
<p><strong>Device whitelist login (cho app mobile):</strong></p>
<p>Đây là cơ chế chỉ cho phép thiết bị đã được admin phê duyệt đăng nhập — phù hợp nghiệp vụ đấu thầu vì tài liệu thuộc loại nội bộ.</p>
<ul>
<li>App gửi <strong>device fingerprint</strong> (device id của OS, không phải tự sinh từ thông tin dễ giả) kèm request login. BE đối chiếu whitelist.</li>
<li><strong>CMS (phần em làm)</strong>: danh sách thiết bị chờ duyệt / đã duyệt / bị chặn; thông tin thiết bị (model, OS, user gắn với nó, lần đăng nhập cuối, IP); nút duyệt/chặn; và audit log cho mọi hành động duyệt.</li>
<li><strong>Điểm phải nói rõ</strong>: đây là <strong>kiểm soát truy cập, không phải xác thực</strong> — device id không phải secret, có thể bị giả trên máy đã root. Nó làm tăng rào cản và tạo dấu vết audit, nhưng <em>không thay thế</em> việc xác thực người dùng và phân quyền ở BE. Nếu ai nói device whitelist là đủ bảo mật thì đó là hiểu sai.</li>
<li><strong>UX quan trọng</strong>: khi bị chặn, app phải hiện thông báo rõ ("Thiết bị chưa được phê duyệt, liên hệ quản trị viên") chứ không phải "Sai mật khẩu" — user sẽ đổi mật khẩu 5 lần vô ích rồi gọi support.</li>
</ul>""",
                },
                {
                    "q": "Multi-tenant: Organizations / Departments / Users. Bạn thiết kế UI và phân quyền thế nào?",
                    "a": """<p><strong>Mô hình dữ liệu (FE cần hiểu để làm UI đúng):</strong></p>
<pre class="code"><code>Organization (tenant)
  └── Department (cây, có thể lồng nhiều cấp)
        └── User (thuộc 1 department, có 1..n role)

Tài liệu / FAQ / setting: gắn scope theo org, và có thể giới hạn theo department</code></pre>
<p><strong>Ba quyết định UI:</strong></p>
<ol>
<li><strong>Cây phòng ban</strong>: dùng tree component có kéo thả để đổi cấp. Cái khó là <strong>chặn di chuyển node vào chính con của nó</strong> (tạo cycle) — phải validate trước khi cho drop, và hiện rõ vì sao không được. Xoá phòng ban có user thì không cho xoá thẳng, phải bắt chuyển user đi trước hoặc chọn phòng ban tiếp nhận.</li>
<li><strong>Quyền có thể thừa kế theo cây</strong>: quyền cấp phòng ban cha áp xuống con. UI phải hiển thị rõ quyền nào là <em>trực tiếp</em>, quyền nào là <em>thừa kế</em> (và từ đâu) — nếu không admin sẽ không hiểu vì sao user có quyền mà mình không gán.</li>
<li><strong>Isolation giữa tenant là việc của BE.</strong> FE không được là nơi lọc dữ liệu theo org — mọi query phải được BE scope theo tenant của token. Nếu FE truyền <code>orgId</code> lên và BE tin, thì đổi <code>orgId</code> trong request là đọc được dữ liệu công ty khác. Đây là lỗ bảo mật nghiêm trọng nhất của hệ thống multi-tenant và em luôn xác nhận điểm này với BE.</li>
</ol>
<p><strong>Về UX quản lý user số lượng lớn:</strong> bảng user phải server-side pagination + search + filter theo phòng ban/role/trạng thái; có <strong>bulk action</strong> (gán role cho nhiều user, vô hiệu hoá hàng loạt) vì admin onboard cả phòng 30 người một lúc; và import CSV có <strong>preview + báo lỗi từng dòng trước khi commit</strong> — import 200 user rồi mới báo "lỗi dòng 57" và rollback hết là trải nghiệm rất tệ.</p>""",
                },
            ],
        },
    ],
}
