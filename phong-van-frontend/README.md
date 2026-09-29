# Bộ đề luyện phỏng vấn Frontend — Hà Tiến Hiệp

11 bộ đề, **115 câu hỏi + gợi ý trả lời**, soạn theo CV (`Cv-Ha-Tien-Hiep-FE.pdf`).
Mỗi bộ mô phỏng một **vòng phỏng vấn thật** khác nhau.

## Mở

```bash
xdg-open index.html
```

Không cần build, không cần cài gì, chạy offline hoàn toàn.
(Nếu dùng Live Server / `python3 -m http.server` thì mở `index.html` — đừng mở thẳng file bộ đề.)

## Danh sách bộ đề

| Bộ | Tên | Câu | Mô phỏng vòng nào |
|----|-----|-----|-------------------|
| 00 | Tổng hợp nền tảng | 32 | Xuyên suốt — React, Next, state, kiến trúc, perf, TS, CI/CD |
| 01 | Vòng sơ loại | 12 | Call 30–45' với HR + tech screen nhanh |
| 02 | Live coding | 9 | Share screen gõ thật: hook, race condition, a11y, tìm bug |
| 03 | Đào sâu **PSY HMS** | 11 | Grilling dự án y tế trong CV |
| 04 | Đào sâu **ENAS + Offerwall** | 10 | Grilling 2 dự án builder thị trường Nhật |
| 05 | Đào sâu **Bidding Assistant** | 8 | Grilling dự án AI/RAG |
| 06 | **System Design — Frontend** | 5 đề | Vẽ bảng 20'/đề: form builder, dashboard, offline, theming, API layer |
| 07 | **System Design — Hệ thống** | 4 đề | RAG scale, chống double-booking, notification, chống gian lận |
| 08 | Vòng Senior — kiến trúc | 8 | Monorepo, micro-FE, design system, migration, observability |
| 09 | Công ty Nhật / Outsourcing | 8 | Spec, BrSE, estimate, QA Nhật, Hou-Ren-Sou |
| 10 | Vòng cuối — Manager | 8 | Culture fit, thất bại, mentoring, **đàm phán lương** |

## Lịch luyện gợi ý — 7 ngày

| Ngày | Nội dung |
|------|----------|
| 1 | Bộ 00 + 01 — lấy lại phản xạ, **sửa timeline CV** |
| 2 | Bộ 03 + 04 — đào sâu 2 dự án lớn nhất, nói to, bấm giờ |
| 3 | Bộ 05 + 02 — mở editor gõ thật, không copy |
| 4 | Bộ 06 — System Design FE, vẽ ra giấy, mỗi đề 20' |
| 5 | Bộ 07 — System Design hệ thống, tập nói khung 5 bước |
| 6 | Bộ 08 + 09 |
| 7 | Bộ 10 + chốt số liệu lương, ôn lại câu đã tick |

## Cấu trúc thư mục

```
phong-van-frontend/
├── index.html              # trang chủ — chọn bộ đề, tiến độ tổng
├── bo-00-tong-hop.html     # viết tay, builder không sinh lại
├── bo-01..bo-10 *.html     # sinh từ data/ bằng tools/build.py
├── css/styles.css          # tokens, sáng/tối, responsive, print
├── js/app.js               # tìm kiếm, tick "đã thuộc", tiến độ, mục lục
├── data/*.py               # NỘI DUNG câu hỏi — sửa ở đây
└── tools/build.py          # sinh HTML từ data/
```

## Sửa nội dung

Sửa file trong `data/`, rồi chạy lại:

```bash
python3 tools/build.py
```

Mỗi file `data/*.py` khai báo một biến `SET`. Nội dung câu hỏi/đáp án là HTML fragment,
nên có thể dùng `<ul>`, `<pre class="code">`, `<div class="table-wrap">`, `<ol class="steps">` thoải mái.
Thêm bộ đề mới = thêm một file `data/bo-11-xxx.py` rồi build lại — trang chủ và nav tự cập nhật.

`bo-00-tong-hop.html` là file viết tay (`prebuilt: True` trong data), builder chỉ đọc metadata để hiện trên trang chủ.

## Tính năng

| Tính năng | Ghi chú |
|---|---|
| Ẩn/hiện đáp án | Dùng `<details>` — đọc được cả khi tắt JS |
| Tick "Đã thuộc" | `localStorage`, **tiến độ riêng từng bộ**, trang chủ hiện tổng % |
| Tìm kiếm | Bỏ dấu tiếng Việt (`kien truc` → `kiến trúc`). Phím tắt `/`, `Esc` để xoá |
| Mở/đóng tất cả | Nút ⇕ |
| Sáng / tối / theo hệ thống | Nút ◐, nhớ lựa chọn qua các trang |
| In ra PDF | `Ctrl+P` — đáp án tự mở, ẩn sidebar và nút |
| Responsive | Dùng được trên điện thoại |

## Cách luyện cho hiệu quả

- **Che đáp án, nói to thành tiếng trước.** Đọc hiểu thì tưởng mình biết; nói ra mới biết bí ở đâu.
- **Bấm đồng hồ**: giới thiệu ≤ 90 giây · câu kỹ thuật 2–3 phút · System Design 15–20 phút.
- **Ghi âm 3 câu mỗi ngày** rồi nghe lại — tự phát hiện chỗ lan man và câu "à, ờ".
- **Đáp án là khung, không phải kịch bản.** Thay số liệu và ví dụ bằng cái thật của bạn.
- **System Design: luôn hỏi lại làm rõ yêu cầu trước khi vẽ.** Nhảy vào giải pháp ngay là lỗi bị trừ điểm nhiều nhất.

## 3 việc phải làm trước khi đi phỏng vấn

1. **Sửa timeline dự án trong CV** — Offerwall (01/2023–12/2024) đang overlap với ENAS và WAS. Ghi rõ `(maintain)` hoặc chỉnh lại ngày. Xem **Bộ 01 · Q3**.
2. **Chuẩn bị số liệu testing thật** — coverage bao nhiêu, test những gì, có E2E chưa. Xem **Bộ 03 · Q9**.
3. **Thêm số đo định lượng vào CV** — giảm bundle bao nhiêu %, load từ mấy giây xuống mấy giây.
