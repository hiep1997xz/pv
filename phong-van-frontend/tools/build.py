#!/usr/bin/env python3
"""
Sinh các trang HTML bộ đề phỏng vấn từ dữ liệu trong ./data/*.py

Mỗi file dữ liệu khai báo một biến SET (dict). Xem data/bo-01-*.py làm mẫu.
Chạy:  python3 tools/build.py
"""
from pathlib import Path
import html as _html

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

NOTE_ICON = {"warn": "⚠️", "star": "⭐", "red": "🔴", "info": "💡"}
NOTE_WORD = {"warn": "Lưu ý", "star": "Điểm ăn tiền", "red": "Cảnh báo", "info": "Mẹo"}


# ---------------------------------------------------------------- nạp dữ liệu
def load_sets():
    """Đọc mọi data/*.py, mỗi file phải định nghĩa SET."""
    sets = []
    for path in sorted(DATA.glob("*.py")):
        ns = {}
        exec(compile(path.read_text(encoding="utf-8"), str(path), "exec"), ns)
        if "SET" not in ns:
            raise SystemExit(f"{path.name}: thiếu biến SET")
        s = ns["SET"]
        s["_file"] = path.name
        s["total"] = sum(len(sec["questions"]) for sec in s.get("sections", []))
        if s.get("prebuilt"):
            s["total"] = s.get("total_override", s["total"])
        sets.append(s)
    sets.sort(key=lambda x: x["code"])
    return sets


# ------------------------------------------------------------------ mảnh HTML
def render_note(note):
    if not note:
        return ""
    kind = note.get("type", "warn")
    body = note["text"]
    if not body.lstrip().startswith("<"):
        body = f"<p><strong>{NOTE_WORD.get(kind, 'Lưu ý')}:</strong> {body}</p>"
    return (
        '<div class="note">'
        f'<span class="note__icon" aria-hidden="true">{NOTE_ICON.get(kind, "⚠️")}</span>'
        f"<div>{body}</div>"
        "</div>"
    )


def render_question(q, num):
    prompt = ""
    if q.get("prompt"):
        prompt = (
            '<div class="prompt">'
            '<span class="prompt__label">Đề bài người phỏng vấn đưa ra</span>'
            f'{q["prompt"]}'
            "</div>"
        )
    label = q.get("label", "Gợi ý trả lời")
    return f"""      <details class="qa">
        <summary class="qa__q">
          <span class="qa__id">Q{num}</span>
          <span class="qa__text">{q["q"]}</span>
          <span class="qa__chev" aria-hidden="true">▸</span>
        </summary>
        <div class="qa__a">
          {prompt}
          <span class="answer-label">{label}</span>
          <blockquote>{q["a"]}</blockquote>
          {render_note(q.get("note"))}
          <button class="mark" type="button"><span class="mark__box" aria-hidden="true">✓</span>Đã thuộc</button>
        </div>
      </details>
"""


def render_sections(sections):
    out, toc, num = [], [], 0
    for i, sec in enumerate(sections):
        sid = f"s{i}"
        toc.append(
            f'      <li><a href="#{sid}"><span class="toc__num">{i:02d}</span> {sec["title"]}</a></li>'
        )
        qs = ""
        for q in sec["questions"]:
            num += 1
            qs += render_question(q, num)
        out.append(f"""    <section class="section" id="{sid}">
      <div class="section__head">
        <span class="section__num">{i:02d}</span>
        <h2 class="section__title">{sec["title"]}</h2>
        <span class="section__count">{len(sec["questions"])} câu</span>
      </div>
{qs}    </section>
""")
    return "\n".join(out), "\n".join(toc), num


def level_tag(level):
    cls = {
        "Middle": "tag--mid",
        "Senior": "tag--senior",
        "System Design": "tag--design",
    }.get(level, "")
    return f'<span class="tag {cls}">{level}</span>'


def topbar(title, sub, home=False):
    back = "" if home else '<a class="btn" href="index.html">← Trang chủ</a>'
    return f"""<header class="topbar">
  {back}
  <div class="topbar__brand">
    <span class="topbar__title">{title}</span>
    <span class="topbar__sub">{sub}</span>
  </div>
  <div class="search">
    <input type="search" id="searchInput" placeholder="Tìm câu hỏi…" aria-label="Tìm câu hỏi theo từ khoá">
  </div>
  <button class="btn" id="toggleAll" type="button" aria-label="Mở hoặc đóng tất cả câu trả lời">
    <span aria-hidden="true">⇕</span><span class="btn__label">Mở tất cả</span>
  </button>
  <button class="btn btn--icon" id="themeBtn" type="button" aria-label="Đổi chế độ sáng/tối" title="Đổi chế độ sáng/tối">
    <span aria-hidden="true" id="themeIcon">◐</span>
  </button>
</header>"""


FAVICON = ("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' "
           "viewBox='0 0 100 100'><text y='.9em' font-size='90'>{}</text></svg>")


def page_shell(*, title, desc, icon, body, set_id, prefix=""):
    return f"""<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{_html.escape(desc, quote=True)}">
<link rel="icon" href="{FAVICON.format(icon)}">
<link rel="stylesheet" href="{prefix}css/styles.css">
</head>
<body data-set="{set_id}">
<div class="progress"><div class="progress__bar" id="progressBar"></div></div>
{body}
<script src="{prefix}js/app.js"></script>
</body>
</html>
"""


# ------------------------------------------------------------- trang bộ đề
def build_set_page(s, prev, nxt):
    sections_html, toc_html, total = render_sections(s["sections"])

    nav = ['<div class="setnav">']
    if prev:
        nav.append(f'<a class="btn" href="{prev["slug"]}.html">← {prev["code"]}. {prev["short"]}</a>')
    nav.append('<span class="setnav__spacer"></span>')
    nav.append('<a class="btn" href="index.html">Tất cả bộ đề</a>')
    if nxt:
        nav.append(f'<a class="btn" href="{nxt["slug"]}.html">{nxt["code"]}. {nxt["short"]} →</a>')
    nav.append("</div>")
    nav_html = "\n  ".join(nav)

    metas = [level_tag(s["level"]),
             f'<span class="pill">{s["duration"]}</span>',
             f'<span class="pill">{s["format"]}</span>',
             f'<span class="pill pill--accent">{total} câu</span>']
    for extra in s.get("stack", []):
        metas.append(f'<span class="pill">{extra}</span>')

    body = f"""{topbar(f'{s["code"]}. {s["short"]}', s["subtitle"])}

<div class="layout">
  <nav class="toc" aria-label="Mục lục">
    <p class="toc__label">Nội dung</p>
    <ul class="toc__list">
{toc_html}
    </ul>
    <p class="toc__label" style="margin-top:20px">Tiến độ bộ này</p>
    <p style="margin:0 0 0 10px;font-size:.82rem;color:var(--text-muted)">
      Đã thuộc <strong id="knownCount" style="color:var(--ok)">0</strong> / <span id="totalCount">0</span> câu
    </p>
    <button class="btn" id="resetBtn" type="button" style="margin:12px 0 0 10px">Xoá tiến độ</button>
  </nav>

  <main class="content">
    <p class="crumb"><a href="index.html">Bộ phỏng vấn</a> <span aria-hidden="true">›</span> {s["code"]}. {s["short"]}</p>

    <div class="hero">
      <h1>{s["icon"]} {s["title"]}</h1>
      <p>{s["intro"]}</p>
      <div class="hero__meta">{"".join(metas)}</div>
    </div>

{sections_html}
    <p class="empty" id="emptyState" hidden>Không tìm thấy câu hỏi nào khớp từ khoá.</p>

    {nav_html}
  </main>
</div>

<footer class="footer">
  {s["code"]}. {s["short"]} — bộ phỏng vấn soạn theo CV <strong>Hà Tiến Hiệp</strong> ·
  Tiến độ lưu trong <code>localStorage</code> riêng cho từng bộ đề.
</footer>"""

    return page_shell(title=f'{s["code"]}. {s["short"]} — Bộ phỏng vấn FE',
                      desc=s["subtitle"], icon=s["icon"], body=body,
                      set_id=s["id"]), total


# --------------------------------------------------------------- trang chủ
def build_hub(sets):
    cards = []
    for s in sets:
        cards.append(f"""        <a class="setcard" href="{s["slug"]}.html" data-set="{s["id"]}" data-total="{s["total"]}">
          <div class="setcard__top">
            <span class="setcard__icon" aria-hidden="true">{s["icon"]}</span>
            <span>
              <span class="setcard__code">BỘ {s["code"]}</span>
              <span class="setcard__name">{s["short"]}</span>
            </span>
          </div>
          <p class="setcard__desc">{s["subtitle"]}</p>
          <div class="setcard__meta">{level_tag(s["level"])}<span class="tag">{s["total"]} câu</span><span class="tag">{s["duration"]}</span></div>
          <div class="setcard__bar"><div class="setcard__fill"></div></div>
          <span class="setcard__stat">0/{s["total"]} câu đã thuộc</span>
        </a>""")

    grand = sum(s["total"] for s in sets)

    plan = [
        ("Ngày 1", "Bộ 00 (tổng hợp) + Bộ 01 (sơ loại) — lấy lại phản xạ, sửa timeline CV."),
        ("Ngày 2", "Bộ 03 + Bộ 04 — đào sâu 2 dự án lớn nhất. Nói to thành tiếng, bấm đồng hồ."),
        ("Ngày 3", "Bộ 05 (AI/RAG) + Bộ 02 (live coding) — mở editor gõ thật, không copy."),
        ("Ngày 4", "Bộ 06 (System Design FE) — vẽ ra giấy, mỗi đề 20 phút."),
        ("Ngày 5", "Bộ 07 (System Design hệ thống) — tập nói cấu trúc 5 bước."),
        ("Ngày 6", "Bộ 08 (Senior/kiến trúc) + Bộ 09 (công ty Nhật)."),
        ("Ngày 7", "Bộ 10 (manager/culture fit) + chốt số liệu lương, ôn lại câu đã tick."),
    ]
    plan_html = "\n".join(
        f'        <li><span class="plan__day">{d}</span><span>{t}</span></li>' for d, t in plan
    )

    body = f"""{topbar('Bộ phỏng vấn Frontend', 'Hà Tiến Hiệp · 11 bộ đề · ' + str(grand) + ' câu', home=True)}

<div class="layout" style="grid-template-columns:minmax(0,1fr)">
  <main class="content" style="max-width:1080px">

    <div class="hero">
      <h1>Bộ đề luyện phỏng vấn Frontend</h1>
      <p>
        Soạn theo CV của <strong>Hà Tiến Hiệp</strong> — hơn 5 năm React/Next.js, dự án thị trường Nhật
        (AMELA) và sản phẩm y tế / AI-RAG (IniSoft). Mỗi bộ mô phỏng một <strong>vòng phỏng vấn thật</strong>
        khác nhau: sơ loại, live coding, đào sâu từng dự án trong CV, System Design, vòng kiến trúc Senior,
        và vòng manager. Chọn một bộ, bấm vào câu hỏi để xem gợi ý trả lời.
      </p>
      <div class="hero__meta">
        <span class="pill pill--accent">{grand} câu hỏi</span>
        <span class="pill">11 bộ đề</span>
        <span class="pill">2 bộ System Design</span>
        <span class="pill">3 bộ đào sâu dự án CV</span>
        <span class="pill">Tiến độ lưu riêng từng bộ</span>
      </div>
    </div>

    <div class="overall">
      <span class="overall__num" id="overallNum">0%</span>
      <span class="overall__txt" id="overallTxt">Chưa tick câu nào. Bấm "Đã thuộc" ở mỗi câu để theo dõi tiến độ.</span>
      <div class="overall__bar"><div class="overall__fill" id="overallFill"></div></div>
    </div>

    <div class="section__head">
      <span class="section__num">↓</span>
      <h2 class="section__title">Chọn bộ đề</h2>
      <span class="section__count">{len(sets)} bộ</span>
    </div>

    <div class="hubgrid">
{chr(10).join(cards)}
    </div>

    <div class="section__head">
      <span class="section__num">7d</span>
      <h2 class="section__title">Lịch luyện gợi ý — 7 ngày</h2>
    </div>
    <ul class="plan">
{plan_html}
    </ul>

    <div class="section__head">
      <span class="section__num">!</span>
      <h2 class="section__title">Cách luyện cho hiệu quả</h2>
    </div>
    <div class="prose">
      <ul class="checklist">
        <li><strong>Đọc câu hỏi, che đáp án, nói to thành tiếng trước</strong> — đọc hiểu thì tưởng mình biết, nói ra mới biết mình bí ở đâu.</li>
        <li><strong>Bấm đồng hồ</strong>: câu giới thiệu ≤ 90 giây, câu kỹ thuật 2–3 phút, System Design 15–20 phút.</li>
        <li><strong>Tự ghi âm 3 câu mỗi ngày</strong> rồi nghe lại — bạn sẽ tự phát hiện chỗ lan man và câu "à, ờ".</li>
        <li><strong>Đáp án ở đây là khung, không phải kịch bản.</strong> Thay số liệu và ví dụ bằng cái thật của bạn; interviewer phát hiện ngay câu học thuộc.</li>
        <li><strong>Câu nào không chắc thì đừng tick "Đã thuộc"</strong> — để quay lại. Tick chỉ khi đã nói trôi không cần nhìn.</li>
        <li><strong>Với System Design: luôn hỏi lại làm rõ yêu cầu trước khi vẽ.</strong> Nhảy vào giải pháp ngay là lỗi bị trừ điểm nhiều nhất.</li>
      </ul>
    </div>

    <div class="section__head">
      <span class="section__num">⚑</span>
      <h2 class="section__title">3 việc phải làm trước khi đi phỏng vấn</h2>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Việc</th><th>Vì sao</th></tr></thead>
        <tbody>
          <tr><td><strong>Sửa timeline dự án trong CV</strong> — Offerwall (01/2023–12/2024) đang overlap với ENAS và WAS</td><td>Người đọc CV kỹ sẽ hỏi ngay và nghi CV phóng đại. Ghi rõ <em>(maintain)</em> hoặc chỉnh lại ngày.</td></tr>
          <tr><td><strong>Chuẩn bị số liệu testing thật</strong> — coverage bao nhiêu, test những gì, có E2E chưa</td><td>CV nhắc Vitest + RTL nên chắc chắn bị hỏi. Không có số là mất điểm tin cậy.</td></tr>
          <tr><td><strong>Thêm số đo định lượng vào CV</strong> — giảm bundle bao nhiêu %, load từ mấy giây xuống mấy giây</td><td>CV hiện toàn "built", "developed" — không có impact đo được.</td></tr>
        </tbody>
      </table>
    </div>

  </main>
</div>

<footer class="footer">
  {len(sets)} bộ đề · {grand} câu · soạn theo CV <strong>Hà Tiến Hiệp</strong> — Frontend Developer ·
  Toàn bộ chạy offline, tiến độ lưu trong <code>localStorage</code> máy bạn.
</footer>"""

    return page_shell(title="Bộ đề luyện phỏng vấn Frontend — Hà Tiến Hiệp",
                      desc="11 bộ đề phỏng vấn Frontend: sơ loại, live coding, đào sâu dự án, System Design, Senior, manager.",
                      icon="🎯", body=body, set_id="hub")


# ------------------------------------------------------------------- chạy
def main():
    sets = load_sets()
    built = 0
    for i, s in enumerate(sets):
        if s.get("prebuilt"):
            continue
        prev = sets[i - 1] if i > 0 else None
        nxt = sets[i + 1] if i + 1 < len(sets) else None
        html_out, total = build_set_page(s, prev, nxt)
        (ROOT / f'{s["slug"]}.html').write_text(html_out, encoding="utf-8")
        print(f'  ✓ {s["slug"]}.html — {total} câu')
        built += 1

    (ROOT / "index.html").write_text(build_hub(sets), encoding="utf-8")
    print(f'  ✓ index.html — trang chủ, {len(sets)} bộ')
    print(f"\n✅ Sinh {built} trang bộ đề + trang chủ. Tổng {sum(s['total'] for s in sets)} câu.")


if __name__ == "__main__":
    main()
