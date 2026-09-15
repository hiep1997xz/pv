# Spec viết nội dung một cụm

Mỗi cụm là **một file** `content/<slug>.mjs`. `build.mjs` tự quét mọi `.mjs` trong thư mục này.

**Trước khi viết, đọc `content/react.mjs`** — đó là bản mẫu chuẩn, bám sát nó.
**Viết xong, chạy `node check.mjs`** — phải PASS mới coi là xong.

## Khung file

```js
export const cover = { slug, kicker, title, sub, sub2, toc, sticky, chips, note };
export const cards = [ { id, level, title, questions, points, code, trap, tip }, ... ];
```

## Quy tắc nội dung

- **Ngôn ngữ**: giải thích bằng tiếng Việt, **giữ nguyên thuật ngữ tiếng Anh**
  (hydration, reconciliation, closure, sharding...). Không dịch thuật ngữ.
- **Giọng văn**: trực tiếp, như người đi làm giải thích cho đồng nghiệp. Không sáo rỗng,
  không "hãy cùng tìm hiểu". Ưu tiên câu ngắn.
- **Mục tiêu**: người đọc trả lời được câu hỏi đó trong phòng phỏng vấn. Giải thích **vì sao**,
  không chỉ **là gì**.
- **Cấm bịa**: không chắc thì bỏ ý đó. Sai một chi tiết kỹ thuật là hại người đọc.

## Ràng buộc từng trường

### `cover`
| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `slug` | string | Trùng tên file, chữ thường, gạch ngang |
| `kicker` | string | Luôn là `'( Cẩm nang )'` |
| `title` | string | ≤ 14 ký tự (chữ to trên bìa) |
| `sub` | array | `['Toàn Tập ', { hl: 'Đầy Đủ' }]` — giữ nguyên |
| `sub2` | string | Dòng định vị, vd `'Từ Junior đến Senior'` |
| `toc` | array | 10–12 mục `[emoji, 'Tên mục', 'Junior'\|'Mid'\|'Senior'\|'All']`, tên ≤ 42 ký tự |
| `sticky` | array | 4 chuỗi ngắn — copy nguyên từ `react.mjs` |
| `chips` | array | 5 cặp `[nhãn, mã màu]` — copy nguyên từ `react.mjs` |
| `note` | string | 1–2 dòng, cho phép `<em>` và `<br>`, kết bằng ` ♥` |

### `cards`
| Trường | Ràng buộc |
|---|---|
| `id` | `'01'`, `'02'`... liên tục, không nhảy số |
| `level` | `'junior'` \| `'mid'` \| `'senior'` — xếp tăng dần theo id |
| `title` | ≤ 46 ký tự, phân tách bằng ` · ` |
| `questions` | Đúng **2** câu, mỗi câu ≤ 62 ký tự, kết bằng `?`. Là câu hỏi **thật** người phỏng vấn hay hỏi |
| `points` | **4–5** ý, mỗi ý ≤ 175 ký tự (không tính thẻ HTML) |
| `code` | ≤ **15 dòng**, mỗi dòng ≤ **73 ô chữ**. Emoji `✅`/`❌` tính 2.08 ô. Code chạy được, không giả lập |
| `trap` | ≤ 250 ký tự. Lỗi/bẫy cụ thể, hoặc câu hỏi vặn lại hay gặp |
| `tip` | ≤ 240 ký tự. Ý nói thêm để ghi điểm. **Không mở đầu bằng "Nói thêm"/"Mẹo ghi điểm"** (nhãn hộp đã có sẵn) |

## HTML được dùng trong `points` / `trap` / `tip`

- `<b>…</b>` nhấn mạnh · `<code>…</code>` tên hàm, từ khoá · `<em>…</em>` (chỉ trong `note`)
- Dấu ngoặc nhọn **phải escape**: `&lt;Tabs&gt;` — viết `<Tabs>` sẽ vỡ layout
- `<code>` là **nowrap**: nội dung bên trong ≤ 30 ký tự, nếu dài hơn thì tách thành nhiều `<code>`

## Khối `code`

- Là template literal. Bên trong phải escape: backtick → `` \` `` và `${` → `\${`
- Chú thích dùng `//`, **mở đầu bằng `❌` hoặc `✅`** khi đối chiếu sai/đúng — bộ render tự tô đỏ/xanh
- Chú thích viết tiếng Việt có dấu bình thường
- Trần 73 ô là số đo thật: vùng code rộng 796px, mỗi ô 10.80px. Khối code không tự xuống dòng nên tràn là bị cắt mất chữ.
- `./render.sh` tự đo lại trong trình duyệt và in cảnh báo `⚠ code-tran-ngang` nếu còn sót

## Tự kiểm tra

```bash
node check.mjs              # kiểm tra toàn bộ
node check.mjs javascript   # kiểm tra 1 cụm
./render.sh javascript      # xuất ảnh để xem thật
```
