/**
 * Noi dung cum ARCHITECTURE — cach to chuc va van hanh mot du an FE lon.
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'architecture',
  kicker: '( Cẩm nang )',
  title: 'Kiến Trúc FE',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Cách tổ chức một dự án lớn',
  toc: [
    ['🗂️', 'Cấu trúc thư mục & feature-based', 'Mid'],
    ['🔗', 'Quy tắc phụ thuộc một chiều', 'Mid'],
    ['🧪', 'Chiến lược test & testing trophy', 'Mid'],
    ['🎯', 'Test hành vi, không test cài đặt', 'Mid'],
    ['🛡️', 'Bảo mật FE: XSS · CSRF · CSP', 'Mid'],
    ['🔐', 'Bí mật & phân quyền phía server', 'Mid'],
    ['📦', 'Monorepo: pnpm workspace · Turborepo', 'Senior'],
    ['🔖', 'Versioning với changesets', 'Senior'],
    ['🚀', 'CI/CD pipeline & fail fast', 'Senior'],
    ['📉', 'Performance budget · size-limit', 'Senior'],
    ['👀', 'Code review & convention', 'Senior'],
    ['📝', 'ADR: ghi lại quyết định kiến trúc', 'Senior'],
  ],
  sticky: ['Giải thích dễ hiểu', 'Có code thật', 'Bẫy phỏng vấn', 'Câu trả lời mẫu'],
  chips: [
    ['Khái niệm', '#DCE9FF'],
    ['Code mẫu', '#D6F5E3'],
    ['Bẫy thường gặp', '#FFDCD4'],
    ['Câu hỏi thật', '#FFE9C7'],
    ['Mẹo ghi điểm', '#F3DDFF'],
  ],
  note: 'Kiến trúc tốt là kiến trúc <em>dễ xoá</em> —<br>đổi một tính năng không phải đụng cả repo. ♥',
};

export const cards = [
  {
    id: '01', level: 'mid', title: 'Cấu trúc thư mục · Feature-based',
    questions: [
      'Bạn chia thư mục theo loại file hay theo tính năng?',
      'Barrel file có mặt trái gì không?',
    ],
    points: [
      'Chia theo <b>loại file</b> (<code>components/</code>, <code>hooks/</code>, <code>utils/</code>) hợp dự án nhỏ. Dự án lớn thì sửa một tính năng phải mở 5 thư mục xa nhau.',
      'Chia theo <b>tính năng</b>: mỗi feature là một thư mục tự chứa <code>api</code> + <code>ui</code> + <code>model</code>. Xoá tính năng = xoá một thư mục, không sót file mồ côi.',
      '<b>Phụ thuộc một chiều</b>: feature không import chéo nhau. Cần dùng chung thì đẩy xuống tầng <code>shared</code>/<code>entities</code>. Chặn bằng ESLint <code>import/no-restricted-paths</code>.',
      'Mỗi feature lộ ra <b>một cửa</b> là <code>index.ts</code> (public API). Bên ngoài import từ cửa đó, không thò tay vào file nội bộ.',
      '<b>Barrel file</b> tiện nhưng dễ kéo cả cụm vào bundle và gây <b>circular import</b>. Dùng ở ranh giới feature thôi, đừng rải khắp nơi.',
    ],
    code: `src/
├── app/              // routing, providers, khởi tạo toàn cục
├── features/
│   ├── cart/
│   │   ├── api/  ui/  model/
│   │   └── index.ts  // ✅ cửa duy nhất ra ngoài
│   └── checkout/
│       └── index.ts  // ❌ KHÔNG import '../cart/ui/CartRow'
├── entities/         // model dùng chung: user, product
└── shared/           // ui kit, lib, config — không biết feature nào cả

// Chiều phụ thuộc: app → features → entities → shared (một chiều)`,
    trap: 'Trả lời “dự án nào cũng nên feature-based” là hớ. Dự án 10 màn hình chia feature chỉ tạo thêm tầng rỗng. Tiêu chí thật là <b>số người sửa song song</b> và tần suất đụng nhau, không phải số dòng code.',
    tip: 'Nhắc <b>Feature-Sliced Design</b> làm tên gọi chuẩn cho mô hình tầng này. Và nêu quy tắc đặt tên nhất quán (kebab-case cho file, PascalCase cho component) — <code>git</code> trên macOS không phân biệt hoa thường, đổi tên dễ mất file.',
  },
  {
    id: '02', level: 'mid', title: 'Chiến lược test cho frontend',
    questions: [
      'Bạn phân bổ unit / integration / e2e như thế nào?',
      'Thế nào là test chi tiết cài đặt?',
    ],
    points: [
      '<b>Kim tự tháp</b> cổ điển: nhiều unit, ít e2e. Với frontend, <b>testing trophy</b> (Kent C. Dodds) hợp hơn — phần phình to là <b>integration</b>, vì bug thật hay nằm ở chỗ các mảnh ghép với nhau.',
      '<b>Unit</b> cho hàm thuần: reducer, format tiền, validate. <b>Integration</b> render cả màn hình, mock API ở ranh giới network. <b>e2e</b> chỉ vài luồng sinh tiền: đăng nhập, thanh toán.',
      'Test <b>hành vi</b>, không test cài đặt: assert cái người dùng thấy, không assert state nội bộ hay số lần hàm private được gọi. Refactor mà test vẫn xanh thì test mới có giá trị.',
      'Thứ tự ưu tiên query của <b>Testing Library</b>: <code>getByRole</code> → <code>getByLabelText</code> → <code>getByText</code>, cuối cùng mới <code>getByTestId</code>. Query theo role ép bạn viết markup accessible.',
      'Mock ở <b>ranh giới hệ thống</b> (network qua <b>MSW</b>), không mock module nội bộ. Mock càng sâu, test càng tách rời thực tế.',
    ],
    code: `// ❌ test cài đặt: đổi tên biến nội bộ là test đỏ ngay
expect(wrapper.state('isOpen')).toBe(true);
expect(mockFormatTien).toHaveBeenCalledTimes(3);

// ✅ test hành vi: thao tác theo role, assert thứ hiện trên màn hình
await user.click(screen.getByRole('button', { name: /Đặt hàng/ }));
expect(await screen.findByText('Đặt hàng thành công')).toBeVisible();

// ✅ mock ở ranh giới network bằng MSW — code thật giữ nguyên
const server = setupServer(
  http.get('/api/cart', () => HttpResponse.json({ items: [] }))
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());`,
    trap: 'Nói “mục tiêu là 100% coverage” là <b>mất điểm</b>. Coverage chỉ đo dòng code <b>được chạy qua</b>, không đo có assert đúng hay không — test rỗng vẫn cho 100%. Đặt ngưỡng ~80% cho business logic và nói rõ mình bỏ qua config, generated code.',
    tip: 'Câu chốt đắt giá: “viết test nào mà khi nó đỏ, tôi <b>tin là app thật sự hỏng</b>”. Test flaky còn hại hơn không có test vì team sẽ quen tay retry cho xanh rồi merge.',
  },
  {
    id: '03', level: 'mid', title: 'Bảo mật phía frontend',
    questions: [
      'XSS có mấy dạng và bạn chặn bằng cách nào?',
      'Ẩn nút “Xoá” với user thường đã đủ an toàn chưa?',
    ],
    points: [
      '<b>XSS</b> có 3 dạng: <b>stored</b> (payload nằm trong DB, bung ra với mọi người xem), <b>reflected</b> (payload đi theo URL), <b>DOM-based</b> (JS phía client tự nhét dữ liệu bẩn vào DOM).',
      'React <b>tự escape</b> nội dung trong JSX. Lỗ hổng mở ra khi dùng <code>dangerouslySetInnerHTML</code>, <code>innerHTML</code>, hoặc <code>href</code> nhận chuỗi <code>javascript:</code>. Cần render HTML thì <b>sanitize bằng DOMPurify</b>.',
      '<b>CSRF</b>: trình duyệt tự gửi cookie kèm request. Chặn bằng cookie <code>SameSite=Lax/Strict</code> + <code>HttpOnly</code> + <code>Secure</code>, và anti-CSRF token cho form đổi dữ liệu.',
      '<b>CSP</b> là lưới an toàn cuối: khai báo nguồn script hợp lệ, chặn inline script. Bật <code>report-only</code> trước để gom vi phạm rồi mới siết.',
      'Mọi thứ trong bundle là <b>công khai</b> — <code>VITE_*</code>, <code>NEXT_PUBLIC_*</code> lộ hết. Không để API secret ở đó. <b>Kiểm tra quyền phải ở server</b>: ẩn nút chỉ là UX, kẻ tấn công gọi thẳng API.',
    ],
    code: `// ❌ stored XSS: bình luận chứa <img onerror=...> chạy ngay
<div dangerouslySetInnerHTML={{ __html: comment.body }} />

// ✅ sanitize bằng DOMPurify rồi mới render
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(comment.body);
<div dangerouslySetInnerHTML={{ __html: clean }} />

// ❌ chỉ ẩn nút = bảo mật giả, kẻ tấn công gọi thẳng API
{user.isAdmin && <DeleteButton />}

// ✅ header do server trả về
Content-Security-Policy: default-src 'self'; script-src 'self'
Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax`,
    trap: 'Câu trả lời trượt hay gặp: “để token trong <code>localStorage</code> cho tiện”. Dính XSS là script đọc sạch token. Cookie <code>HttpOnly</code> thì JS không đọc được — đổi lại phải xử lý CSRF. Biết <b>trade-off</b> này mới là câu trả lời đủ.',
    tip: 'Nêu <b>defense in depth</b>: sanitize + CSP + <code>HttpOnly</code> cookie + kiểm tra quyền ở server, mỗi lớp bắt phần lớp trước sót. Thêm <code>npm audit</code> / Dependabot trong CI vì supply chain là đường vào hay bị bỏ quên nhất.',
  },
  {
    id: '04', level: 'senior', title: 'Monorepo · pnpm workspace · Turborepo',
    questions: [
      'Khi nào nên dùng monorepo, khi nào không?',
      'Turborepo giải quyết vấn đề gì mà workspace không làm được?',
    ],
    points: [
      'Monorepo đáng dùng khi nhiều app <b>dùng chung code</b> và <b>thay đổi cùng nhau</b>: đổi một component design system là sửa luôn mọi nơi dùng nó, trong <b>một PR duy nhất</b> (atomic change).',
      '<b>pnpm workspace</b> lo phần liên kết package nội bộ và chia sẻ node_modules. Chia thường thấy: <code>apps/*</code> cho ứng dụng, <code>packages/ui</code>, <code>packages/config</code> (eslint, tsconfig), <code>packages/utils</code>.',
      '<b>Turborepo</b> (hoặc Nx) lo chạy task: khai báo <b>pipeline</b> phụ thuộc, chạy song song, <b>cache</b> theo hash input — không đổi thì không build lại. Remote cache dùng chung cho team và CI.',
      'Mặt trái: CI dễ phình vì mỗi PR đụng nhiều package — phải lọc theo <b>affected</b>. Ranh giới sở hữu mờ đi, cần <b>CODEOWNERS</b>. Repo nặng dần, git thao tác chậm.',
      '<b>Đa repo</b> tốt hơn khi các team có <b>nhịp release độc lập</b>, stack khác nhau, hoặc yêu cầu phân quyền truy cập nghiêm ngặt.',
    ],
    code: `packages:                            # pnpm-workspace.yaml
  - "apps/*"
  - "packages/*"

// turbo.json — "^build" = build xong dependency rồi mới tới mình
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test":  { "dependsOn": ["build"] },
    "lint":  {}
  }
}

// ✅ chỉ chạy cho package đổi so với main → CI không phình
turbo run test --filter=...[origin/main]`,
    trap: 'Câu trả lời trừ điểm: “công ty lớn nên dùng monorepo”. Monorepo là công cụ giải quyết <b>chia sẻ code và thay đổi xuyên package</b>, không phải chuẩn mực quy mô. Ba app không liên quan nhau nhét chung repo chỉ tạo CI chậm và conflict vô nghĩa.',
    tip: 'Nêu <b>changesets</b> cho versioning: mỗi PR kèm một file changeset mô tả loại bump, CI gom lại tự bump version + sinh CHANGELOG + publish. Phân biệt thêm: <b>Nx</b> nhiều tính năng hơn Turborepo — generators, project graph, module boundaries.',
  },
  {
    id: '05', level: 'senior', title: 'CI/CD · Performance budget',
    questions: [
      'Pipeline CI của bạn gồm những bước nào, theo thứ tự?',
      'Làm sao chặn bundle phình to qua từng PR?',
    ],
    points: [
      'Thứ tự theo <b>fail fast</b>: rẻ chạy trước — lint, typecheck → unit/integration test → build → security scan → e2e trên bản build. Hỏng sớm thì biết sớm, khỏi đợi 15 phút.',
      '<b>Preview deployment</b> cho mỗi PR (Vercel, Netlify, namespace k8s riêng): reviewer bấm link xem thật, QA test trước khi merge. Đây là thứ nâng chất lượng review nhiều nhất.',
      '<b>Performance budget</b> phải là <b>gate tự động</b>, không phải lời nhắc: <code>size-limit</code> đặt ngưỡng KB gzip cho từng entry, vượt là fail PR. <b>Lighthouse CI</b> đặt ngưỡng LCP/CLS/INP.',
      'Build một lần, <b>promote artifact</b> qua các môi trường — không build lại cho production. Build lại là bạn deploy một thứ chưa ai test.',
      '<b>Blue-green</b> hoặc canary để rollback tức thì (đổi con trỏ). Điều kiện: <b>migration tương thích ngược</b> theo expand-contract — thêm cột trước, đọc cả cũ lẫn mới, xoá ở release sau.',
    ],
    code: `# .github/workflows/ci.yml — rẻ trước, đắt sau (fail fast)
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm lint && pnpm typecheck   # ~20s, chặn sớm
      - run: pnpm test -- --coverage
      - run: pnpm build
      - run: npx size-limit                # ❌ vượt ngưỡng = fail PR
      - run: npx lhci autorun              # Lighthouse CI

// .size-limit.json — ngân sách KB gzip cho từng entry
[{ "path": "dist/main.*.js", "limit": "170 KB" }]`,
    trap: 'Đừng nói “có cảnh báo khi bundle tăng”. Cảnh báo là thứ ai cũng lướt qua. Ngân sách chỉ có tác dụng khi nó <b>chặn merge</b>. Và đừng để <code>continue-on-error: true</code> ở bước test — bằng không có CI.',
    tip: 'Nói rõ ngưỡng đến từ đâu: budget nên suy từ <b>mục tiêu thời gian tải trên mạng 4G của người dùng thật</b> (dữ liệu RUM), không phải con số bịa. Thêm: tách <b>deploy</b> khỏi <b>release</b> bằng feature flag để rollback không cần redeploy.',
  },
  {
    id: '06', level: 'senior', title: 'Code review · Convention · ADR',
    questions: [
      'Bạn review code thì nhìn vào những gì trước tiên?',
      'Làm sao góp ý mà không làm đồng nghiệp khó chịu?',
    ],
    points: [
      '<b>PR nhỏ</b> là yếu tố số một: dưới ~400 dòng thì review thật, PR 2000 dòng chỉ nhận được “LGTM”. Một PR giải quyết một việc; refactor tách khỏi thay đổi hành vi.',
      'Review cái <b>máy không làm được</b>: đúng đắn của logic, <b>điều kiện biên</b> (rỗng, lỗi, loading, race), bảo mật, khả năng bảo trì. Format để <b>Prettier/ESLint</b> lo, đừng comment tay.',
      'Tự động hoá phần cơ học: <b>Prettier</b> + <b>ESLint</b> + <b>husky</b> + <b>lint-staged</b> chạy pre-commit, <b>commitlint</b> ép <b>conventional commits</b>, <b>CODEOWNERS</b> tự gán đúng người vào đúng thư mục.',
      'Góp ý: nhận xét <b>vào code, không vào người</b>; hỏi thay vì phán (“list rỗng thì sao?”); phân loại rõ <b>blocking</b> hay <b>nit</b> để biết cái nào phải sửa; khen đoạn viết tốt cũng là review.',
      '<b>ADR</b> (Architecture Decision Record): mỗi quyết định lớn ghi một file md ngắn — bối cảnh, lựa chọn, quyết định, hệ quả. Sáu tháng sau không ai phải đoán “vì sao chọn cái này”.',
    ],
    code: `# .github/CODEOWNERS — tự gán reviewer theo đường dẫn
/packages/ui/         @design-system
/apps/web/checkout/   @payments @security

# conventional commits — máy đọc được để sinh CHANGELOG
feat(cart): thêm mã giảm giá            // ✅ bump minor
fix(auth): chặn refresh token hết hạn   // ✅ bump patch
feat(api)!: bỏ endpoint /v1/orders      // ✅ major (dấu !)
sua loi                                 // ❌ không parse được

# .husky/pre-commit — máy lo format, người lo logic
npx lint-staged

# ADR: mỗi quyết định lớn một file, đánh số tăng dần
docs/adr/0007-chon-react-query-thay-redux.md`,
    trap: 'Hai kiểu reviewer đều bị trừ điểm: người duyệt mọi thứ trong 10 giây, và người bắt bẻ dấu phẩy rồi bỏ qua lỗi race condition. Nếu bạn để lại 30 comment về style, hãy nói thật: đó là dấu hiệu repo <b>thiếu Prettier</b>, không phải dev kém.',
    tip: 'Con số tham khảo hay được trích: review hiệu quả nhất khi PR dưới ~400 dòng và phiên review dưới ~60 phút — quá ngưỡng thì tỉ lệ phát hiện lỗi rơi mạnh. Thêm quy ước SLA review trong ngày để PR không nằm chờ làm cả team nghẽn.',
  },
];
