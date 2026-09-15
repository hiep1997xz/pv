# Cẩm nang ôn phỏng vấn — bộ ảnh học tập

Sinh ảnh PNG kiểu sổ tay giấy kẻ ô để ôn phỏng vấn. Nội dung là chữ thật do trình duyệt render
nên dấu tiếng Việt chuẩn 100%, sửa được, và render lại trong vài giây.

## Chạy

```bash
./render.sh              # render toàn bộ
./render.sh react-05     # chỉ render file khớp tên
node check.mjs           # kiểm tra nội dung có đúng spec không
node check.mjs javascript # kiểm tra 1 cụm
xdg-open out/index.html  # xem nhanh tất cả ảnh
```

## Các cụm

| Cụm | File nội dung | Thẻ | Phạm vi |
|---|---|---|---|
| ReactJS | `content/react.mjs` | 8 | Props/State → Concurrent, RSC |
| Next.js | `content/nextjs.mjs` | 8 | App Router → 4 tầng cache, SEO |
| JavaScript | `content/javascript.mjs` | 10 | Closure, `this`, event loop, ESM |
| TypeScript | `content/typescript.mjs` | 8 | `unknown` → conditional type, `infer` |
| Thuật toán | `content/algorithms.mjs` | 8 | Big-O → quy hoạch động |
| System Design | `content/system-design.mjs` | 8 | Khung trả lời → News Feed |
| Thực chiến | `content/practical.mjs` | 8 | Infinite scroll → feature flag |
| Debug & Fix | `content/debugging.mjs` | 8 | Hydration, leak, CORS, race |
| Kiến trúc FE | `content/architecture.mjs` | 6 | Thư mục, test, monorepo, CI/CD |
| Docker | `content/docker.mjs` | 8 | Container/VM → bảo mật production |

**Tổng: 80 thẻ + 10 bìa = 90 ảnh.**

## Cấu trúc

```
content/react.mjs     ← NỘI DUNG — sửa ở đây (mỗi cụm 1 file)
content/SPEC.md       ← spec viết nội dung + ràng buộc độ dài
check.mjs             ← kiểm tra nội dung tự động, chạy trước khi render
assets/paper.css      ← nền giấy kẻ ô, lỗ đóng, đường lề đỏ
assets/card.css       ← hộp câu hỏi, gạch đầu dòng, khối code, hộp bẫy/mẹo
assets/fonts/         ← Be Vietnam Pro + Caveat (nhúng cục bộ, không cần mạng)
build.mjs             ← nội dung → HTML
crop.mjs              ← cắt PNG về đúng khổ (Chrome headless vẽ thiếu 87px cuối khung)
render.sh             ← build + xuất PNG
src/                  ← HTML trung gian (tự sinh, đừng sửa tay)
out/                  ← ẢNH PNG + trang xem nhanh index.html
```

## Thêm một cụm mới

Chép `content/react.mjs` thành `content/<slug>.mjs`, đổi `cover.slug` và `cover.title`,
viết lại `cards`. `build.mjs` tự quét mọi file `.mjs` trong `content/`.
Đọc `content/SPEC.md` để biết ràng buộc, và thêm logo cho cụm mới vào `MARKS` trong `build.mjs`.

Cấu trúc một thẻ:

```js
{
  id: '01',                    // số thứ tự, cũng là tên file
  level: 'junior',             // junior | mid | senior — đổi màu nhãn
  title: 'Tiêu đề thẻ',
  questions: ['Câu hỏi 1?', 'Câu hỏi 2?'],
  points: ['Ý trả lời, cho phép <b>đậm</b> và <code>code</code>'],
  code: `// code mẫu, tự tô màu`,
  trap: 'Bẫy phỏng vấn thường gặp',
  tip: 'Nói thêm gì để ghi điểm',
}
```

## Khổ ảnh

- Bìa: 1080×1350 cố định (tỉ lệ 4:5)
- Thẻ nội dung: rộng 1080, **cao tự co theo nội dung** — không thừa khoảng trắng, không cắt chữ
- Xuất ở 2x (2160px ngang) nên in ra vẫn nét

## Ghi chú kỹ thuật

- Chrome headless chỉ vẽ được `window_height − 87px`; `render.sh` render dư rồi `crop.mjs` cắt lại.
- Chiều cao thẻ đo bằng một lượt `--dump-dom`: trang tự ghi `H=<số>` vào `<title>`.
- Font `Caveat` không có bộ dấu tiếng Việt → chỉ dùng cho chữ không dấu (class `.cursive`).
