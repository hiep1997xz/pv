SET = {
    "id": "bo-09",
    "code": "09",
    "slug": "bo-09-cong-ty-nhat",
    "short": "Công ty Nhật / Outsourcing",
    "title": "Công ty Nhật & môi trường outsourcing",
    "subtitle": "3,5 năm ở AMELA làm 5 dự án thị trường Nhật là lợi thế lớn khi ứng tuyển công ty Nhật hoặc outsourcing. Bộ này khai thác đúng vốn đó.",
    "level": "Middle",
    "duration": "40–50 phút",
    "format": "Quy trình & giao tiếp",
    "icon": "🗾",
    "stack": ["Spec", "BrSE", "Estimate", "QA", "Hou-Ren-Sou"],
    "intro": "Công ty Nhật và công ty outsourcing hỏi khác hẳn công ty product Việt Nam: họ quan tâm <strong>bạn có làm việc được với quy trình chặt và khách khó tính không</strong>, hơn là bạn biết bao nhiêu framework. Vốn 3,5 năm dự án Nhật của bạn là thứ nhiều ứng viên không có — hãy khai thác triệt để.",
    "sections": [
        {
            "title": "Quy trình & spec",
            "questions": [
                {
                    "q": "Quy trình làm việc với khách Nhật của bạn diễn ra thế nào? Ai là BrSE, ai là comtor?",
                    "a": """<p>Mô hình em quen ở AMELA:</p>
<pre class="code"><code>Khách Nhật (PO/PM)
     │  họp định kỳ, spec bằng tiếng Nhật
     ▼
BrSE (Bridge SE)  ── hiểu cả nghiệp vụ lẫn kỹ thuật, dịch spec + đàm phán
     │
     ├── Comtor (communicator) ── dịch thuần ngôn ngữ, không quyết kỹ thuật
     │
     ▼
Team dev VN (PM/Leader → dev → QA)</code></pre>
<p><strong>Vai trò em (dev):</strong> nhận spec đã dịch, đọc kỹ, <strong>đặt câu hỏi khi chưa rõ</strong> (qua BrSE, bằng ticket trên Redmine/Backlog), estimate, làm, tự test, đẩy QA, rồi release theo lịch.</p>
<p><strong>Ba điều em học được về cách vận hành này:</strong></p>
<ol>
<li><strong>Câu hỏi phải viết đúng cách mới nhận được câu trả lời dứt khoát.</strong> Hỏi mở ("chỗ này làm thế nào ạ?") thì vòng hỏi-đáp qua 2 lớp dịch mất 2 ngày. Em luôn viết dạng: <em>"Em hiểu yêu cầu là A. Nếu đúng, em sẽ làm theo cách X vì lý do Y. Trường hợp Z thì spec chưa nói, em đề xuất làm B. Anh/chị confirm giúp em."</em> — Khách chỉ cần trả lời "OK" hoặc sửa một điểm.</li>
<li><strong>Kèm screenshot/ảnh chụp màn hình cho mọi câu hỏi về UI.</strong> Mô tả bằng chữ qua 2 lớp dịch là nguồn hiểu nhầm số một.</li>
<li><strong>Ghi lại mọi confirm vào ticket</strong>, không confirm miệng trong họp. Sau 3 tháng không ai nhớ, và khi có tranh cãi về "spec có nói thế không" thì ticket là bằng chứng.</li>
</ol>""",
                },
                {
                    "q": "Bạn nhận spec và thấy nó sai/thiếu/mâu thuẫn. Bạn làm gì?",
                    "a": """<p><strong>Nguyên tắc: không tự ý quyết, nhưng cũng không dừng chờ.</strong> Đây là điểm cân bằng quan trọng nhất khi làm outsourcing.</p>
<ol>
<li><strong>Phân loại mức độ trước.</strong> Là <em>thiếu chi tiết nhỏ</em> (message lỗi chưa có), <em>mâu thuẫn</em> (trang A nói khác trang B), hay <em>sai nghiệp vụ</em> (làm đúng spec sẽ ra kết quả sai)? Ba loại xử lý khác nhau.</li>
<li><strong>Tự tìm trước khi hỏi.</strong> Tra lại spec các màn liên quan, xem màn hình tương tự đã làm trước đó, xem hệ thống cũ nếu có. Rất nhiều câu hỏi tự trả lời được, và hỏi những thứ đã có trong tài liệu làm giảm uy tín của mình.</li>
<li><strong>Hỏi kèm đề xuất, không hỏi trống.</strong> "Spec màn X nói bắt buộc nhập, nhưng màn Y lại cho để trống. Em đề xuất theo màn Y vì [lý do nghiệp vụ]. Anh confirm giúp em." — Khách Nhật rất ngại quyết định mở; cho họ một lựa chọn cụ thể để gật thì nhanh hơn nhiều.</li>
<li><strong>Không dừng công việc.</strong> Em làm tiếp phần không phụ thuộc câu hỏi đó, và <strong>ghi rõ giả định đang dùng</strong> trong ticket. Nếu sau này khách trả lời khác thì sửa — nhưng ít nhất không mất 2 ngày ngồi chờ.</li>
<li><strong>Nếu là sai nghiệp vụ nghiêm trọng</strong> — làm đúng spec sẽ gây hậu quả — thì escalate ngay cho BrSE/leader, không chỉ ghi ticket. Và nói bằng tác động, không bằng phán xét: "Nếu làm theo spec này thì trường hợp [cụ thể] sẽ ra số sai, ảnh hưởng tới [ai]."</li>
</ol>
<p><strong>Điều em tránh tuyệt đối:</strong> tự sửa theo ý mình rồi không nói. Với khách Nhật thì "làm khác spec mà không confirm" nghiêm trọng hơn cả "làm sai" — vì nó phá vỡ niềm tin vào quy trình.</p>""",
                    "note": {"type": "star", "text": "Ý số 4 — <em>\"không dừng chờ, ghi rõ giả định, làm tiếp\"</em> — là thứ phân biệt dev chủ động với dev thụ động. Rất nên nhấn mạnh."},
                },
                {
                    "q": "Bạn estimate thế nào? Nếu estimate sai và sắp trễ thì sao?",
                    "a": """<p><strong>Cách em estimate:</strong></p>
<ol>
<li><strong>Chia nhỏ tới mức ≤ 1 ngày.</strong> Task 5 ngày thì estimate luôn sai; task nửa ngày thì khá chính xác. Nếu không chia nhỏ được thì nghĩa là chưa hiểu rõ yêu cầu — đó đã là tín hiệu.</li>
<li><strong>Tính đủ, không chỉ tính code.</strong> Nhiều người estimate 2 ngày cho phần code rồi quên: đọc spec, hỏi/chờ confirm, tự test, sửa bug QA trả về, code review, merge. Thực tế phần "code" thường chỉ chiếm 50–60%.</li>
<li><strong>Đưa khoảng, không đưa một số</strong> khi còn ẩn số: "3–5 ngày, phụ thuộc vào việc API có sẵn hay phải chờ BE."</li>
<li><strong>Nêu rõ giả định và phụ thuộc</strong>: "Estimate này giả định API xong trước thứ 4 và design không đổi."</li>
</ol>
<p><strong>Khi thấy sắp trễ — quan trọng nhất là THỜI ĐIỂM báo:</strong></p>
<ul>
<li><strong>Báo ngay khi nhận ra, không chờ tới deadline.</strong> Trễ báo trước 5 ngày thì còn xoay được (cắt scope, thêm người, dời lịch); trễ báo vào đúng ngày deadline thì không ai làm gì được, và đó mới là lỗi thật. Ở môi trường Nhật, <strong>報連相 (Hou-Ren-Sou — báo cáo, liên lạc, bàn bạc)</strong> là văn hoá cốt lõi: báo sớm được coi trọng hơn là cố gắng tự gồng.</li>
<li><strong>Báo kèm phương án</strong>, không chỉ báo vấn đề: "Task này sẽ trễ 2 ngày vì [lý do cụ thể]. Em đề xuất: (a) cắt phần X sang sprint sau — em nghĩ đây là phương án tốt nhất vì X ít người dùng; (b) em làm thêm giờ 2 hôm; (c) nhờ [tên] hỗ trợ phần Y. Anh chọn giúp em."</li>
<li><strong>Nói rõ đã làm được bao nhiêu %</strong> và phần còn lại là gì — "còn 20%" mà 20% đó là phần khó nhất thì phải nói.</li>
</ul>
<p><strong>Sau đó:</strong> ghi lại vì sao estimate sai để lần sau tốt hơn. Em nhận ra mình hay ước lượng thiếu ở phần tích hợp API và phần sửa bug QA — nên giờ em nhân hệ số cho hai phần đó.</p>""",
                },
                {
                    "q": "QA Nhật raise bug về một chi tiết rất nhỏ (lệch 2px, sai một chữ). Bạn phản ứng thế nào?",
                    "a": """<p><strong>Em fix, và không tranh luận về việc nó có đáng hay không.</strong></p>
<p>Lý do — và đây là điều em thật sự học được khi làm thị trường Nhật:</p>
<ol>
<li><strong>Với khách Nhật, chi tiết nhỏ là tín hiệu về chất lượng tổng thể.</strong> Họ nghĩ: nếu 2px này sai mà không ai để ý, thì những thứ không nhìn thấy được (logic, bảo mật) chắc cũng vậy. Đó là một cách đánh giá hợp lý, không phải soi mói.</li>
<li><strong>Lỗi chính tả tiếng Nhật thì không nhỏ chút nào.</strong> Sai một ký tự kanji có thể đổi hẳn nghĩa, hoặc dùng sai mức độ lịch sự (敬語) là thất lễ với người dùng cuối. Em không đánh giá được mức độ nghiêm trọng của lỗi ngôn ngữ, nên em tin QA/BrSE.</li>
<li><strong>Chi phí fix thường rất nhỏ</strong> so với chi phí tranh luận qua 2 lớp dịch.</li>
</ol>
<p><strong>Nhưng em không im lặng fix mọi thứ.</strong> Nếu bug nhỏ đến với số lượng lớn và lặp lại, em sẽ xử lý phần gốc thay vì fix từng cái:</p>
<ul>
<li><strong>Lệch pixel lặp lại</strong> → vấn đề là design token không khớp Figma. Em đề xuất chốt spacing/typography thành token và dùng plugin so sánh với design, thay vì mỗi màn chỉnh tay.</li>
<li><strong>Sai text lặp lại</strong> → vấn đề là quy trình bàn giao bản dịch. Em đề xuất file dịch do phía Nhật quản lý trực tiếp, dev chỉ import — dev không nên gõ tay tiếng Nhật.</li>
<li><strong>Nếu một bug thật sự không đáng fix ngay</strong> (ví dụ ảnh hưởng 0 người dùng nhưng tốn 2 ngày), em không từ chối — em <em>báo cáo tác động và chi phí</em> rồi để PO/BrSE quyết định thứ tự ưu tiên. Quyết định đó không phải của em.</li>
</ul>
<p><strong>Điều em tuyệt đối không làm:</strong> phản hồi kiểu "cái này không phải bug" hoặc "user không để ý đâu". Kể cả khi đúng, cách nói đó làm hỏng quan hệ với QA và với khách.</p>""",
                },
            ],
        },
        {
            "title": "Ngôn ngữ, văn hoá & thực tế",
            "questions": [
                {
                    "q": "Trình độ tiếng Nhật/tiếng Anh của bạn thế nào? Bạn làm việc trực tiếp với khách được không?",
                    "a": """<p><strong>Trả lời trung thực và cụ thể — đừng tự nâng level.</strong> Khung trả lời:</p>
<p>"Tiếng Nhật của em ở mức <em>[N3/N4/giao tiếp cơ bản/chỉ đọc được thuật ngữ kỹ thuật — chọn đúng mức thật của bạn]</em>. Em <strong>đọc</strong> được spec kỹ thuật và tên màn hình/field tiếng Nhật vì đã làm 5 dự án Nhật trong 3,5 năm, nhưng em <strong>chưa</strong> họp trực tiếp với khách bằng tiếng Nhật — ở AMELA luôn có BrSE và comtor.</p>
<p>Tiếng Anh của em đủ để đọc tài liệu kỹ thuật, viết commit/ticket/tài liệu, và trao đổi bằng văn bản. Nói thì em còn cần thời gian để trôi chảy.</p>
<p>Nếu vị trí này yêu cầu làm việc trực tiếp với khách, em xin được biết cụ thể là ở mức nào — đọc/viết hay họp nói — để em nói rõ mình đáp ứng được đến đâu và cần bao lâu để bù."</p>
<p><strong>Rồi chuyển sang thứ bạn thật sự mạnh:</strong> "Cái em có là <em>hiểu cách làm việc với khách Nhật</em>: cách viết câu hỏi để nhận được confirm dứt khoát, thói quen ghi mọi thứ vào ticket, báo sớm khi có rủi ro, và tỉ mỉ về chi tiết. Nhiều bạn giỏi tiếng nhưng phải mất vài tháng mới quen được nhịp này."</p>""",
                    "note": {"type": "red", "text": "<strong>Đừng khai vống trình độ ngoại ngữ.</strong> Nhiều công ty Nhật kiểm tra ngay trong buổi phỏng vấn bằng cách chuyển sang tiếng Nhật giữa chừng. Khai đúng + nêu lợi thế bù lại là chiến lược tốt hơn nhiều."},
                },
                {
                    "q": "Làm outsourcing 3,5 năm — bạn không chán khi không được quyết định sản phẩm à?",
                    "a": """<p>Đây là câu thăm dò động lực, và cũng là dịp để bạn nói về định hướng. Trả lời thành thật nhưng không tiêu cực:</p>
<p>"Có những phần em thấy thiếu, và cũng có những phần em học được mà làm product không có.</p>
<p><strong>Cái em học được từ outsourcing:</strong> làm với spec chặt chẽ và tiêu chuẩn chất lượng cao; đi qua nhiều domain khác nhau trong thời gian ngắn — tuyển dụng, quảng cáo, SaaS marketing, đặt lịch y tế — nên em học được cách <em>nhanh chóng hiểu một nghiệp vụ lạ</em>, đó là kỹ năng rất có giá; và em được tiếp xúc nhiều loại kiến trúc thay vì một codebase suốt 3 năm.</p>
<p><strong>Cái em thấy thiếu:</strong> không thấy được số liệu người dùng thật, nên không biết thứ mình làm có được dùng không và có tốt lên không. Và ít khi được ở lại đủ lâu để thấy hậu quả của quyết định kỹ thuật của chính mình — dự án bàn giao xong là hết.</p>
<p><strong>Đó chính là lý do em muốn chuyển sang môi trường product.</strong> Em muốn được nhìn thấy chỉ số, được đề xuất dựa trên dữ liệu, và được sống với codebase mình xây đủ lâu để học từ nó. Ở IniSoft hiện tại em đã được own module end-to-end và gần hơn với sản phẩm, nhưng em muốn đi xa hơn theo hướng đó."</p>
<p><em>(Nếu đang phỏng vấn một công ty outsourcing thì đảo lại: nhấn phần bạn học được, và nói bạn muốn làm sâu hơn về kỹ thuật/quy trình, muốn lên vai trò lead hoặc BrSE-kỹ thuật.)</em></p>""",
                },
                {
                    "q": "Kể về một lần bạn phải làm việc với người khó — đồng nghiệp, QA, hoặc khách.",
                    "a": """<p>Dùng STAR và <strong>không được nói xấu ai</strong>. Mẫu (thay bằng chuyện thật của bạn):</p>
<p><strong>Situation:</strong> "Ở một dự án Nhật, có một bạn QA raise rất nhiều ticket mà phần lớn em thấy là do hiểu sai spec chứ không phải bug. Mỗi ticket em phải giải thích lại, mất khoảng 30 phút, và tuần nào cũng vậy. Bắt đầu có căng thẳng giữa hai bên."</p>
<p><strong>Task:</strong> "Em cần giảm số ticket sai mà không làm bạn ấy cảm thấy bị chê là làm kém."</p>
<p><strong>Action:</strong> "Em không phản hồi kiểu 'cái này không phải bug' trên ticket nữa — cách đó chỉ tạo đối đầu. Thay vào đó em xin 30 phút ngồi cùng bạn ấy, hỏi bạn ấy đang test theo tài liệu nào. Hoá ra bạn ấy dùng bản spec cũ hơn bản em nhận, vì bản cập nhật không được gửi cho QA. Vấn đề là <em>quy trình</em>, không phải con người.</p>
<p>Em đề xuất hai thứ: (1) BrSE gửi mọi bản cập nhật spec cho cả dev và QA cùng lúc; (2) trước mỗi feature, em viết một đoạn ngắn 5 dòng mô tả 'màn này làm gì, case đặc biệt là gì' gắn vào ticket cho QA đọc trước khi test."</p>
<p><strong>Result:</strong> "Số ticket sai giảm rõ rệt sau 2 sprint. Và quan trọng hơn, bạn QA bắt đầu hỏi em trước khi raise những case nghi ngờ, nên bọn em xử lý nhanh hơn nhiều. Quan hệ làm việc tốt hẳn lên."</p>
<p><strong>Bài học:</strong> "Khi thấy ai đó 'khó', thường là có một khoảng lệch thông tin mà cả hai không biết. Hỏi trước, kết luận sau. Và sửa quy trình bền hơn sửa từng vụ việc."</p>""",
                    "note": {"type": "warn", "text": "Câu này <strong>chắc chắn có</strong> ở mọi buổi phỏng vấn. Chuẩn bị sẵn một chuyện thật theo STAR, kết thúc bằng kết quả tích cực và bài học. Không bao giờ để người kia thành nhân vật phản diện."},
                },
                {
                    "q": "Công ty chúng tôi làm theo mô hình Agile/Scrum. Trải nghiệm Scrum thật của bạn ra sao?",
                    "a": """<p>Trả lời thật, kể cả khi trải nghiệm không lý tưởng — vì ai cũng biết Scrum thực tế khác sách:</p>
<p>"Em đã làm Scrum ở cả hai công ty, sprint 1–2 tuần. Các nghi thức có đủ: sprint planning, daily standup, review, retrospective. Ở vai trò dev em tham gia estimate (planning poker ở một dự án), nhận task, và báo cáo tiến độ hằng ngày.</p>
<p><strong>Thực tế em thấy:</strong></p>
<ul>
<li><strong>Daily chạy tốt</strong> khi nó là nơi nêu blocker, và trở nên vô nghĩa khi nó biến thành báo cáo tiến độ cho quản lý. Em cố gắng luôn nói rõ blocker chứ không chỉ 'hôm qua em làm X, hôm nay em làm Y'.</li>
<li><strong>Retro là nghi thức dễ bị bỏ nhất</strong> nhưng có giá trị nhất — khi nó dẫn tới <em>hành động cụ thể có người chịu trách nhiệm</em>. Retro mà chỉ liệt kê 'cần cải thiện giao tiếp' rồi thôi thì lần sau không ai muốn dự.</li>
<li><strong>Với dự án outsourcing thì Scrum thường không thuần</strong>: scope và deadline do khách chốt từ đầu, nên thực chất gần waterfall có sprint bên trong. Em không coi đó là vấn đề — quan trọng là nhịp làm việc và việc phát hiện rủi ro sớm, không phải làm đúng sách.</li>
</ul>
<p><strong>Cái em đóng góp được:</strong> em chủ động cập nhật trạng thái task để board phản ánh đúng thực tế (board sai thì mọi thứ dựa trên nó đều sai), chia task nhỏ để tiến độ nhìn thấy được, và raise rủi ro sớm trong daily thay vì để tới cuối sprint."</p>
<p>Rồi hỏi lại: "Ở team mình sprint dài bao nhiêu, và ai là người quyết định đưa gì vào sprint ạ?"</p>""",
                },
            ],
        },
    ],
}
