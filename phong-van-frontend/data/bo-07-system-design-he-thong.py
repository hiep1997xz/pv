SET = {
    "id": "bo-07",
    "code": "07",
    "slug": "bo-07-system-design-he-thong",
    "short": "System Design — Hệ thống",
    "title": "System Design — Hệ thống (full-stack)",
    "subtitle": "Đề rộng hơn bộ 06: có cả BE, database, hàng đợi, cache. Bạn là FE nên không cần sâu như backend engineer — nhưng phải nói được kiến trúc tổng và biết ranh giới hiểu biết của mình.",
    "level": "System Design",
    "duration": "60 phút · 2 đề",
    "format": "Kiến trúc tổng thể",
    "icon": "🏗️",
    "stack": ["Kiến trúc", "DB", "Queue", "Realtime", "Scale"],
    "intro": "Vì bạn là FE, kỳ vọng ở đây là: <strong>nói đúng kiến trúc tổng, đề xuất được contract API, biết đâu là phần khó của BE, và trung thực về chỗ mình chưa sâu</strong>. Trả lời \"em không phải backend nên không biết\" là mất điểm; trả lời vờ như biết rồi bị đào cũng mất điểm. Cách đúng: trình bày được kiến trúc + nêu rõ giả định + nói thẳng chỗ cần backend engineer quyết.",
    "sections": [
        {
            "title": "Đề thiết kế",
            "questions": [
                {
                    "q": "Thiết kế hệ thống RAG hỏi đáp tài liệu (như Bidding Assistant) cho 10.000 người dùng.",
                    "prompt": """<p>Doanh nghiệp upload hàng chục nghìn tài liệu (DOCX/PDF). Người dùng chat hỏi bằng tiếng Việt, hệ thống trả lời dựa trên tài liệu và trích dẫn nguồn. 10.000 user, cao điểm ~200 câu hỏi/phút.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại</strong>
<ul>
<li>Độ chính xác quan trọng đến mức nào — sai có gây hậu quả pháp lý không? (đấu thầu thì CÓ → phải có citation và phải dám nói "không biết")</li>
<li>Multi-tenant không? Tài liệu công ty A tuyệt đối không được lộ sang công ty B?</li>
<li>Độ trễ chấp nhận được: 2 giây tới token đầu tiên, hay 10 giây cũng được?</li>
<li>Dùng LLM API bên ngoài (Claude/GPT) hay self-host? (ảnh hưởng chi phí, bảo mật dữ liệu, và pháp lý)</li>
<li>Ngân sách token/tháng bao nhiêu?</li>
</ul>
</li>

<li><strong>Kiến trúc tổng</strong>
<pre class="code"><code>          ┌──────────── Admin CMS (React) ─── upload, quản lý
          │
Client ───┼──── API Gateway ──── Auth / rate limit / tenant resolve
(Flutter) │           │
          │           ├── Ingest Service ──┐
          │           │                    ├─ Object Storage (S3/RustFS)  file gốc
          │           │                    ├─ Parse worker (queue)        DOCX/PDF -&gt; text
          │           │                    ├─ Chunk + Embed worker        -&gt; vector
          │           │                    └─ Qdrant (vector DB)          + payload metadata
          │           │                       PostgreSQL                  metadata, quyền, log
          │           │
          └───────────┴── Query Service ──── embed câu hỏi
                                          ── Qdrant search (filter theo tenant!)
                                          ── rerank (tuỳ chọn)
                                          ── LLM (streaming SSE về client)
                                          ── ghi log Q&A + feedback</code></pre>
</li>

<li><strong>Pha ingest — hàng đợi là bắt buộc</strong>
<ul>
<li>Parse + embed là <strong>chậm và tốn tiền</strong> → không làm trong HTTP request. Dùng queue (Redis/RabbitMQ/SQS) + worker scale riêng.</li>
<li><strong>Trạng thái theo từng tài liệu</strong>: <code>uploaded → parsing → chunking → embedding → indexed | failed</code>. Lưu trong PostgreSQL, FE poll (đây là phần em đã làm thật).</li>
<li><strong>Idempotent</strong>: worker crash giữa đường thì job chạy lại phải không tạo chunk trùng — dùng <code>documentId + chunkIndex</code> làm khoá upsert vào Qdrant.</li>
<li><strong>Chunking là quyết định chất lượng lớn nhất</strong>: cắt theo cấu trúc tài liệu (mục/khoản/bảng) thay vì cắt cứng theo ký tự, overlap ~10–15% để không mất ngữ cảnh ở biên. Với hồ sơ đấu thầu có bảng thì bảng nên giữ nguyên khối, cắt giữa bảng là mất nghĩa hoàn toàn.</li>
<li><strong>Re-index khi đổi model embedding</strong>: vector của model cũ và mới không so sánh được. Phải version collection và re-embed toàn bộ — đây là chi phí thật cần tính trước.</li>
</ul>
</li>

<li><strong>Pha query — và tối ưu chi phí</strong>
<ul>
<li><strong>Filter tenant TRƯỚC khi search</strong>, không filter sau. Qdrant hỗ trợ filter theo payload — đây là điểm bảo mật quan trọng nhất của hệ thống này. Filter sau khi search nghĩa là có lúc trả về 0 kết quả dù có tài liệu, và có nguy cơ rò rỉ nếu code sai.</li>
<li><strong>Hybrid search</strong> (vector + BM25 keyword): vector giỏi ngữ nghĩa nhưng hay bỏ sót mã số/số hiệu thông tư. Đấu thầu đầy mã số → hybrid tốt hơn rõ rệt.</li>
<li><strong>Cache</strong>: (1) cache embedding của câu hỏi (nhiều người hỏi giống nhau); (2) cache câu trả lời cho câu hỏi phổ biến — nhưng phải cache <em>theo tenant</em> và có TTL, vì tài liệu thay đổi.</li>
<li><strong>Rate limit theo user và theo tenant</strong> — LLM tính tiền theo token, một user spam có thể đốt ngân sách cả tháng.</li>
<li><strong>Ngưỡng tương đồng</strong>: nếu kết quả tốt nhất dưới ngưỡng thì trả lời "không tìm thấy tài liệu liên quan" thay vì để LLM bịa. Với nghiệp vụ pháp lý, bịa tệ hơn im lặng.</li>
<li><strong>Streaming SSE</strong> về client để cảm giác nhanh — token đầu tiên trong ~1–2 giây dù câu trả lời mất 10 giây.</li>
</ul>
</li>

<li><strong>Scale với 200 câu/phút</strong>
<ul>
<li><strong>Nút cổ chai là LLM</strong>, không phải Qdrant hay DB. 200 req/phút ≈ 3.3 req/giây — Qdrant xử lý thừa sức, nhưng LLM API có rate limit và tính tiền.</li>
<li>Giải: hàng đợi có <strong>độ ưu tiên</strong>, hiện vị trí chờ nếu quá tải, và <strong>ngân sách token theo tenant</strong>.</li>
<li>Qdrant: bật quantization để giảm RAM nếu vector nhiều; replica cho HA.</li>
<li>Worker ingest và worker query <strong>scale độc lập</strong> — upload 1.000 tài liệu không được làm chậm người đang chat.</li>
</ul>
</li>

<li><strong>Chỗ em nói thẳng là chưa sâu</strong>
<p>"Việc chọn model embedding cụ thể, tuning tham số HNSW của Qdrant, và chiến lược rerank thì em chưa làm — đó là phần đồng nghiệp AI của em quyết. Em hiểu vai trò từng thành phần và làm được phần contract API + CMS + quan sát pipeline, nhưng em không nhận là mình tuning được vector DB."</p>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Điểm đánh đổi lớn nhất của RAG là <em>chất lượng retrieval quyết định mọi thứ</em>, và nó khó đo. Em sẽ đầu tư ngay từ đầu vào một <strong>eval set</strong> — 100 câu hỏi có đáp án đúng do chuyên gia đấu thầu soạn — để mỗi lần đổi chunking hay đổi model đều đo được là tốt lên hay xấu đi. Không có eval set thì mọi việc tối ưu chỉ là cảm giác."</p>""",
                    "note": {"type": "star", "text": "Ý \"eval set\" ở cuối là thứ rất ít ứng viên FE nói ra. Nó cho thấy bạn nghĩ như người làm sản phẩm AI thật, không chỉ nối API."},
                },
                {
                    "q": "Thiết kế hệ thống đặt lịch khám chống double-booking (như WAS — nha khoa Nhật).",
                    "prompt": """<p>Phòng khám có nhiều bác sĩ, nhiều ghế. Bệnh nhân đặt online; lễ tân cũng đặt trên hệ thống. Không được để 2 người đặt cùng một slot. Có gửi SMS nhắc. 500 phòng khám dùng chung hệ thống.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại</strong>
<ul>
<li>Một slot là 1 bác sĩ hay 1 ghế, hay cần cả hai cùng rảnh? (quyết định độ phức tạp của ràng buộc)</li>
<li>Có cho overbooking có kiểm soát không? (một số phòng khám cố tình overbook vì hay có người huỷ)</li>
<li>Đặt cần duyệt hay xác nhận ngay?</li>
<li>Múi giờ: tất cả ở Nhật hay nhiều nước?</li>
<li>Bệnh nhân có được huỷ/đổi không, hạn chót bao lâu?</li>
</ul>
</li>

<li><strong>Mô hình dữ liệu — đây là phần quyết định</strong>
<pre class="code"><code>clinic            { id, timezone, settings }
resource          { id, clinicId, type: 'doctor'|'chair', name }
working_hours     { resourceId, weekday, startTime, endTime }
time_off          { resourceId, startAt, endAt, reason }
appointment       { id, clinicId, resourceIds[], startAt, endAt,
                    status, patientId, version }

-- Lưu MỌI thời điểm dạng timestamptz (UTC).
-- Giờ làm việc lưu dạng local time + timezone của clinic
-- (vì 9:00 sáng là 9:00 sáng, kể cả khi đổi giờ mùa).</code></pre>
<p><strong>Quyết định quan trọng: KHÔNG tạo sẵn bảng "slot".</strong> Sinh slot trống <em>khi query</em> từ giờ làm việc trừ đi appointment và time_off. Tạo sẵn slot cho 500 phòng khám × 365 ngày × nhiều resource là hàng chục triệu dòng phải maintain, và đổi giờ làm việc là phải sinh lại hết.</p>
</li>

<li><strong>Chống double-booking — trái tim của bài này</strong>
<p><strong>Nguyên tắc: ràng buộc phải ở tầng DATABASE, không phải ở application code.</strong> Kiểm tra "slot còn trống không" rồi insert là <strong>race condition kinh điển</strong> — hai request cùng check thấy trống, cùng insert.</p>
<pre class="code"><code>-- PostgreSQL: dùng exclusion constraint với range type
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointment
  ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    resource_id WITH =,
    tstzrange(start_at, end_at) WITH &amp;&amp;      -- && = giao nhau
  )
  WHERE (status IN ('confirmed', 'pending'));</code></pre>
<p>Với ràng buộc này, DB <strong>từ chối</strong> lệnh insert thứ hai — không cần lock thủ công, không có cửa sổ race. Application chỉ cần bắt lỗi unique violation và trả 409.</p>
<p>Các cách khác và vì sao kém hơn:</p>
<ul>
<li><strong>Check rồi insert</strong>: sai, có race condition.</li>
<li><strong><code>SELECT … FOR UPDATE</code></strong> trên resource: đúng nhưng serialize toàn bộ đặt lịch của bác sĩ đó, và phải nhớ lock đúng thứ tự để tránh deadlock khi cần nhiều resource.</li>
<li><strong>Distributed lock (Redis)</strong>: thêm một thành phần có thể lỗi, và vẫn cần ràng buộc DB làm chốt cuối. Chỉ dùng khi DB không hỗ trợ.</li>
</ul>
</li>

<li><strong>Phía Frontend</strong>
<ul>
<li><strong>Slot khả dụng phải "tươi"</strong>: <code>staleTime</code> rất ngắn (~10–15s), refetch khi focus. Hiện slot cũ là làm bệnh nhân bấm rồi bị từ chối.</li>
<li><strong>Xử lý 409 cho đẹp</strong>: không hiện "Có lỗi xảy ra" mà "Rất tiếc, slot 14:00 vừa có người đặt. Các slot gần nhất còn trống: 14:30, 15:00" — <em>BE trả kèm gợi ý</em>, đây là contract cần thống nhất từ đầu.</li>
<li><strong>Không optimistic update</strong> cho việc đặt lịch — hiện "đã đặt" rồi rút lại là trải nghiệm tệ nhất.</li>
<li><strong>Hold tạm thời (tuỳ chọn)</strong>: giữ slot 5 phút trong lúc bệnh nhân điền thông tin, có countdown hiện rõ. Giảm rất nhiều trường hợp mất slot giữa luồng. Cần cron/TTL dọn hold hết hạn.</li>
<li><strong>Calendar cho lễ tân</strong>: view theo ngày/tuần × resource, kéo thả để đổi giờ (kéo thả cũng phải qua cùng validate + 409), và <strong>trên mobile phải xử lý touch event riêng</strong> — đây chính là phần em làm ở WAS.</li>
<li><strong>Múi giờ</strong>: luôn hiển thị theo timezone của <em>phòng khám</em>, không theo máy bệnh nhân, và ghi rõ trên UI ("giờ Nhật (JST)"). Bệnh nhân đang đi công tác nước ngoài mà thấy giờ theo máy là đặt sai.</li>
</ul>
</li>

<li><strong>SMS nhắc hẹn</strong>
<ul>
<li><strong>Không gửi trong request</strong>: đẩy vào queue có scheduled time (24h trước hẹn).</li>
<li><strong>Huỷ hẹn phải huỷ job</strong> — nếu không, bệnh nhân đã huỷ vẫn nhận SMS nhắc, phòng khám sẽ bị phàn nàn.</li>
<li><strong>Idempotency</strong>: đảm bảo không gửi 2 lần cùng một nhắc (lưu <code>reminder_sent_at</code>).</li>
<li>Xử lý gửi thất bại (số sai, hết quota) → log + thông báo cho lễ tân, không im lặng.</li>
</ul>
</li>

<li><strong>Multi-tenant 500 phòng khám</strong>
<ul>
<li>Mọi query scope theo <code>clinicId</code> từ token — <strong>không nhận từ FE</strong>. Postgres Row Level Security là lớp bảo vệ thứ hai tốt nếu dùng được.</li>
<li>Index: <code>(resource_id, start_at)</code> là index quan trọng nhất; phân vùng bảng appointment theo tháng nếu dữ liệu lớn.</li>
<li>Cấu hình riêng từng phòng khám (giờ làm, độ dài slot, chính sách huỷ) → bảng settings, không hard-code.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Em chọn sinh slot lúc query thay vì tạo sẵn — đổi lại là query phức tạp hơn và phải cẩn thận về index. Nếu sau này cần hiển thị lịch trống của cả 500 phòng khám trên một trang tìm kiếm thì em sẽ thêm một <strong>read model</strong> (bảng tổng hợp slot trống, cập nhật qua event) để đọc nhanh — nhưng chỉ khi đo được là cần, không làm trước."</p>""",
                },
                {
                    "q": "Thiết kế hệ thống thông báo (notification) realtime cho HMS bệnh viện.",
                    "prompt": """<p>Bác sĩ gửi đơn thuốc → dược sĩ phải biết ngay. Có cảnh báo tồn kho, cảnh báo chỉ số bệnh nhân bất thường. Cần cả in-app, email, và có thể SMS cho ca nguy cấp. ~200 người dùng nội bộ.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại</strong>
<ul>
<li>"Ngay" là bao nhiêu giây? (5 giây hay 1 giây — khác nhau về kiến trúc)</li>
<li>Có cần đảm bảo <em>chắc chắn đến</em> không? (cảnh báo y tế thì CÓ → không thể chỉ dựa vào realtime, phải có fallback)</li>
<li>Người dùng có nhiều thiết bị/nhiều tab không?</li>
<li>Có cần đọc lại thông báo cũ, đánh dấu đã đọc?</li>
</ul>
</li>

<li><strong>Chọn cơ chế vận chuyển — và biện luận</strong>
<div class="table-wrap"><table>
<thead><tr><th>Cách</th><th>Khi nào dùng</th><th>Nhược điểm</th></tr></thead>
<tbody>
<tr><td><strong>Polling</strong> 10–30s</td><td>Đơn giản nhất, đủ cho hầu hết nghiệp vụ nội bộ</td><td>Trễ tới 30s; tốn request nếu nhiều user</td></tr>
<tr><td><strong>SSE</strong></td><td>Server→client một chiều — <strong>đúng nhu cầu của notification</strong>. Tự reconnect, đi qua HTTP thường</td><td>Giới hạn 6 connection/domain trên HTTP1.1 (HTTP2 thì hết vấn đề)</td></tr>
<tr><td><strong>WebSocket</strong></td><td>Cần hai chiều (chat, collaborative editing)</td><td>Phải quản lý connection, sticky session sau LB, heartbeat, reconnect logic</td></tr>
</tbody></table></div>
<p><strong>Em chọn SSE</strong> cho hệ thống này: notification là một chiều, 200 user là quy mô nhỏ, và SSE đơn giản hơn WebSocket rõ rệt về vận hành. Chọn WebSocket ở đây là over-engineering.</p>
</li>

<li><strong>Kiến trúc</strong>
<pre class="code"><code>Nguồn sự kiện (đơn thuốc submit, tồn kho thấp, chỉ số bất thường)
   │
   ├──&gt; ghi notification vào PostgreSQL  ◄── NGUỒN SỰ THẬT
   │     { id, userId, type, payload, readAt, createdAt }
   │
   └──&gt; publish lên Redis Pub/Sub
          │
          └──&gt; SSE endpoint (mỗi instance subscribe) ──&gt; client đang mở

   └──&gt; queue email/SMS cho loại cần escalate</code></pre>
<p><strong>Điểm cốt lõi phải nói: DB là nguồn sự thật, realtime chỉ là kênh giao nhanh.</strong> Client mất kết nối 5 phút thì khi nối lại chỉ cần <code>GET /notifications?since=...</code> là có đủ — không mất gì. Nếu chỉ dựa vào push thì mất kết nối là mất thông báo, và với cảnh báo y tế thì không thể chấp nhận.</p>
<p><strong>Vì sao cần Redis Pub/Sub:</strong> có nhiều instance BE sau load balancer; user kết nối SSE vào instance 1 nhưng sự kiện phát sinh ở instance 2. Pub/Sub để mọi instance đều nhận và đẩy cho client của mình.</p>
</li>

<li><strong>Phía Frontend</strong>
<pre class="code"><code>// SSE + đồng bộ với React Query cache
useEffect(() =&gt; {
  const es = new EventSource('/api/notifications/stream', { withCredentials: true });

  es.onmessage = (e) =&gt; {
    const notif = JSON.parse(e.data);

    // cập nhật cache, không refetch cả list
    queryClient.setQueryData(['notifications'], (old) =&gt;
      old ? { ...old, items: [notif, ...old.items], unread: old.unread + 1 } : old
    );

    // invalidate dữ liệu liên quan: có đơn mới -&gt; danh sách chờ duyệt phải mới
    if (notif.type === 'PRESCRIPTION_SUBMITTED') {
      queryClient.invalidateQueries({ queryKey: ['prescriptions', 'pending'] });
    }
  };

  es.onerror = () =&gt; { /* EventSource tự reconnect; chỉ cần hiện trạng thái */ };

  return () =&gt; es.close();
}, [queryClient]);</code></pre>
<ul>
<li><strong>Bắt lại khoảng trống khi reconnect</strong>: dùng <code>Last-Event-ID</code> header của SSE, hoặc đơn giản là refetch list khi <code>onopen</code> — đảm bảo không lọt thông báo.</li>
<li><strong>Nhiều tab</strong>: mỗi tab một SSE là hơi tốn. Giải pháp gọn: <code>BroadcastChannel</code> để các tab chia sẻ, hoặc chấp nhận vì chỉ 200 user. Nói được cả hai lựa chọn.</li>
<li><strong>Đã đọc phải đồng bộ giữa tab</strong> — đọc ở tab A thì tab B phải mất badge.</li>
<li><strong>Không spam</strong>: gom thông báo cùng loại ("3 đơn thuốc chờ duyệt" thay vì 3 dòng), và <strong>không</strong> dùng browser notification/âm thanh cho mọi loại — chỉ cho cảnh báo nguy cấp, nếu không người ta sẽ tắt hết.</li>
</ul>
</li>

<li><strong>Escalation cho ca nguy cấp — phần nghiệp vụ y tế</strong>
<ul>
<li>Cảnh báo chỉ số bệnh nhân bất thường <strong>không thể chỉ là in-app</strong>. Nếu không ai xác nhận trong N phút → escalate: SMS cho bác sĩ trực → gọi điện → thông báo trưởng khoa.</li>
<li>Cần <strong>acknowledge</strong>: ai đã xem, lúc nào, và đã xử lý chưa. Lưu vào audit log.</li>
<li>Đây là yêu cầu <em>nghiệp vụ</em> chứ không phải kỹ thuật — em sẽ hỏi rất rõ với PO và bộ phận y tế, vì thiết kế sai ở đây có hậu quả thật.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Nếu là em, em sẽ <strong>bắt đầu bằng polling 15 giây</strong> — làm trong một ngày, không thêm hạ tầng, và với 200 user nội bộ thì gần như không ai phân biệt được với realtime. Chỉ khi có yêu cầu cụ thể đòi dưới 5 giây thì em mới thêm SSE + Redis. Thêm Redis Pub/Sub ngay từ đầu là thêm một thứ có thể sập lúc 2 giờ sáng mà chưa có ai cần."</p>""",
                    "note": {"type": "star", "text": "Câu cuối là ví dụ mẫu của tư duy Senior: <strong>giải pháp đơn giản nhất đủ dùng trước, phức tạp khi có bằng chứng cần</strong>. Interviewer nghe câu này sẽ tin bạn không đốt tiền công ty."},
                },
                {
                    "q": "Thiết kế hệ thống tracking + chống gian lận cho Offer Wall quảng cáo.",
                    "prompt": """<p>User tải app qua offer wall và nhận điểm. Bạn phải đo chính xác: xem wall, click offer, cài app, hoàn thành nhiệm vụ. Có người gian lận (bot, cài rồi xoá, click farm) — hệ thống phải phát hiện. Cao điểm 5.000 event/giây.</p>""",
                    "a": """<ol class="steps">
<li><strong>Hỏi lại</strong>
<ul>
<li>Ai trả tiền và trả theo cái gì — install, hay hành động trong app? (quyết định đo cái gì là quan trọng)</li>
<li>Có dùng MMP (AppsFlyer/Adjust) làm nguồn attribution không? (thường là có, và đó là nguồn sự thật cho install)</li>
<li>Mức thất thoát chấp nhận được là bao nhiêu %? (chống gian lận 100% là không thể)</li>
<li>Cần báo cáo realtime hay báo cáo hàng giờ là đủ?</li>
</ul>
</li>

<li><strong>Mô hình event và luồng thu</strong>
<pre class="code"><code>Client (offer wall) ──&gt; Collector (edge, chỉ nhận và đẩy vào stream)
                            │
                            ├──&gt; Kafka / Kinesis  ── buffer, không mất event
                            │        │
                            │        ├──&gt; Stream processor: dedupe, enrich, rule gian lận
                            │        │         │
                            │        │         ├──&gt; ClickHouse / BigQuery  (analytics)
                            │        │         └──&gt; PostgreSQL            (điểm, giao dịch)
                            │        │
                            │        └──&gt; Data lake (raw, để điều tra và replay)
                            │
MMP postback ───────────────┴──&gt; nguồn sự thật cho INSTALL

event { eventId(uuid client), type, userId, offerId, wallId,
        ts_client, ts_server, ip, ua, deviceId, signature }</code></pre>
<p><strong>Ba quyết định:</strong></p>
<ul>
<li><strong>Collector phải cực mỏng</strong> — chỉ validate hình thức rồi đẩy vào stream, trả 200 ngay. Mọi xử lý nặng làm ở downstream. 5.000 event/giây thì collector không được làm gì chậm.</li>
<li><strong>Luôn dùng <code>ts_server</code> cho nghiệp vụ</strong>, <code>ts_client</code> chỉ để tham khảo — đồng hồ client sai hoặc bị sửa cố ý.</li>
<li><strong>Giữ raw event</strong> trong data lake: khi phát hiện gian lận mới, phải replay lại dữ liệu cũ để đánh giá thiệt hại.</li>
</ul>
</li>

<li><strong>Chống gian lận — nhiều lớp, không có viên đạn bạc</strong>
<ul>
<li><strong>Lớp 1 — Ký request.</strong> Event thưởng điểm phải có <strong>server-to-server callback</strong> từ nhà quảng cáo hoặc MMP, có signature (HMAC). <strong>Không bao giờ tin client nói "tôi đã hoàn thành nhiệm vụ"</strong> — đây là lỗ hổng cơ bản nhất và cũng là lỗi hay gặp nhất.</li>
<li><strong>Lớp 2 — Dedupe.</strong> <code>eventId</code> do client sinh + idempotency ở processor; và giới hạn một <code>(userId, offerId)</code> chỉ được thưởng một lần.</li>
<li><strong>Lớp 3 — Rule heuristic</strong> (chạy trong stream processor): quá nhiều install từ một IP/subnet; thời gian từ click đến install quá ngắn (dưới ~10 giây là không thể tải xong app); device fingerprint trùng lặp bất thường; user mới tạo mà hoàn thành 50 offer; phân bố thời gian quá đều (dấu hiệu bot).</li>
<li><strong>Lớp 4 — Giữ điểm (holding period).</strong> Điểm vào trạng thái <code>pending</code>, chỉ <code>confirmed</code> sau N giờ/ngày và sau khi đối soát với nhà quảng cáo. Đây là biện pháp <strong>hiệu quả nhất và đơn giản nhất</strong>: gian lận thường bị phát hiện ở khâu đối soát, và ta chưa trả điểm.</li>
<li><strong>Lớp 5 — Đối soát định kỳ</strong> với báo cáo của nhà quảng cáo, thu hồi điểm đã cấp sai (clawback), và khoá tài khoản tái phạm.</li>
</ul>
<p><strong>Phần FE (việc của em):</strong> gửi event đầy đủ và đúng thời điểm, không gửi trùng (dedupe phía client khi retry), không để logic thưởng điểm ở client, hiển thị rõ trạng thái điểm <em>pending</em> vs <em>đã cộng</em> để user không hiểu sai, và làm dashboard cho admin xem tỉ lệ nghi vấn theo wall/offer.</p>
</li>

<li><strong>5.000 event/giây</strong>
<ul>
<li>Collector: stateless, autoscale, để sau CDN/edge.</li>
<li><strong>Batch từ client</strong>: gom event trong 1–2 giây rồi gửi một request, dùng <code>navigator.sendBeacon</code> cho event lúc rời trang (không bị hủy khi unload).</li>
<li><strong>Analytics DB phải là columnar</strong> (ClickHouse/BigQuery), không phải PostgreSQL. 5.000 event/giây = ~13 tỉ event/tháng; query <code>GROUP BY</code> trên Postgres ở quy mô đó là không khả thi.</li>
<li><strong>Bảng tổng hợp sẵn</strong> (pre-aggregate theo giờ/ngày × wall × offer) cho dashboard 7 tab — không query raw mỗi lần mở báo cáo.</li>
</ul>
</li>
</ol>
<p><strong>Trade-off cuối:</strong> "Chống gian lận là cuộc đua không có đích — mỗi rule mình thêm thì kẻ gian thích nghi. Nên em ưu tiên hai thứ trước: (1) <strong>server-to-server callback có ký</strong>, vì nó chặn được loại gian lận rẻ nhất và phổ biến nhất; (2) <strong>holding period</strong>, vì nó chuyển rủi ro từ 'mất tiền' thành 'chậm trả điểm'. Machine learning phát hiện bất thường thì để sau, khi đã có đủ dữ liệu gắn nhãn — làm ML trước khi có nhãn là vô ích."</p>""",
                },
            ],
        },
    ],
}
