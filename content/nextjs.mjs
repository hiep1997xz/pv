/**
 * Noi dung cum NEXT.JS (App Router, Next 14/15) — sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'nextjs',
  kicker: '( Cẩm nang )',
  title: 'Next.js',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Từ App Router đến Production',
  toc: [
    ['🗂️', 'App Router · Cấu trúc thư mục', 'Junior'],
    ['🧩', 'Server vs Client Component', 'Junior'],
    ['📡', 'Data fetching & revalidate', 'Mid'],
    ['⚙️', 'SSR · SSG · ISR · Streaming', 'Mid'],
    ['🚀', 'Route Handler & Server Actions', 'Mid'],
    ['🛡️', 'Middleware · Auth · Redirect', 'Mid'],
    ['🧠', '4 tầng cache của Next.js', 'Senior'],
    ['⚡', 'Tối ưu · Core Web Vitals · SEO', 'Senior'],
    ['🐞', 'Error boundary & not-found', 'Mid'],
    ['🧪', 'Testing App Router', 'Mid'],
    ['☁️', 'Deploy · self-host · runtime', 'Senior'],
    ['💬', 'Bẫy phỏng vấn Next.js hay gặp', 'All'],
  ],
  sticky: ['Giải thích dễ hiểu', 'Có code thật', 'Bẫy phỏng vấn', 'Câu trả lời mẫu'],
  chips: [
    ['Khái niệm', '#DCE9FF'],
    ['Code mẫu', '#D6F5E3'],
    ['Bẫy thường gặp', '#FFDCD4'],
    ['Câu hỏi thật', '#FFE9C7'],
    ['Mẹo ghi điểm', '#F3DDFF'],
  ],
  note: 'Next 15 đã <em>đổi mặc định cache</em> so với 14 —<br>trả lời nhớ nói rõ mình theo bản nào. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'App Router · Cấu trúc thư mục',
    questions: [
      'App Router khác Pages Router ở những điểm nào?',
      'Route group và dynamic segment dùng khi nào?',
    ],
    points: [
      'Mỗi folder trong <code>app/</code> là một URL segment. Chỉ file tên đặc biệt mới thành route: <code>page.tsx</code> (UI) và <code>route.ts</code> (API). File khác chỉ là colocation, không lộ ra URL.',
      '<code>layout.tsx</code> bọc mọi route con và <b>giữ nguyên state khi điều hướng</b>, không remount. Root layout bắt buộc có <code>&lt;html&gt;</code> và <code>&lt;body&gt;</code>.',
      '<code>loading.tsx</code> là Suspense boundary tự động cho segment; <code>error.tsx</code> là Error Boundary (<b>bắt buộc</b> Client Component); <code>not-found.tsx</code> hiện khi gọi <code>notFound()</code>.',
      '<code>(marketing)</code> là <b>route group</b>: gom file và chia layout nhưng <b>không thêm vào URL</b>. Folder bắt đầu bằng <code>_</code> là private, hoàn toàn không routable.',
      'Dynamic segment: <code>[id]</code> một đoạn, <code>[...slug]</code> catch-all, <code>[[...slug]]</code> optional. Next 15: <code>params</code> là Promise, phải <code>await</code> trước khi đọc.',
    ],
    code: `app/
  layout.tsx            // root layout: bắt buộc có <html> và <body>
  (marketing)/          // route group — KHÔNG xuất hiện trong URL
    page.tsx            // ✅ /
  blog/
    layout.tsx          // bọc mọi route con của /blog
    loading.tsx         // Suspense boundary tự động
    [slug]/
      page.tsx          // ✅ /blog/hello
      _components/      // private folder: không routable

// Next 15: params là Promise
export default async function Page({ params }) {
  const { slug } = await params;
}`,
    trap: '<code>error.tsx</code> KHÔNG bắt được lỗi ném từ <code>layout.tsx</code> cùng cấp, vì boundary nằm bên trong layout đó. Lỗi ở root layout phải dùng <code>global-error.tsx</code> — và file này phải tự render thẻ html, body.',
    tip: 'Layout không nhận được <code>pathname</code>. Cần biết route hiện tại thì tách một Client Component nhỏ dùng <code>usePathname()</code>, đừng gắn <code>use client</code> cho cả layout.',
  },
  {
    id: '02', level: 'junior', title: 'Server Component vs Client Component',
    questions: [
      'Khi nào bắt buộc phải thêm "use client"?',
      'Client Component có chạy trên server không?',
    ],
    points: [
      'Trong App Router mọi component <b>mặc định là Server Component</b>: chạy trên server, không vào JS bundle, viết <code>async</code> được, đọc DB và secret trực tiếp.',
      'Server Component <b>không có</b> state, effect, event handler và API trình duyệt. Cần một trong số đó mới thêm <code>use client</code>.',
      '<code>use client</code> không có nghĩa "render ở client" mà là <b>đánh dấu ranh giới</b>: từ file đó trở xuống, mọi import đều thành Client Component và bị đóng gói vào bundle.',
      'Client Component vẫn được <b>prerender ra HTML trên server</b> rồi hydrate ở browser. Nó chạy cả hai nơi, không phải chỉ client.',
      'Props qua ranh giới phải <b>serialize được</b>: không truyền function (trừ Server Action), class instance hay Symbol. Muốn con vẫn là Server Component thì truyền qua <code>children</code>.',
    ],
    code: `// ❌ import Server Component vào file client → nó bị kéo vào bundle
'use client';
import Heavy from './heavy-chart';
export default function Tabs() { return <div><Heavy /></div>; }

// ✅ nhận Server Component qua children → Heavy vẫn chạy trên server
'use client';
export function Tabs({ children }) {
  const [open, setOpen] = useState(false);
  return <div onClick={() => setOpen(!open)}>{children}</div>;
}

// page.tsx là Server Component — nó quyết định children là gì
<Tabs><Heavy /></Tabs>`,
    trap: 'Câu vặn kinh điển: "Server Component có render lại khi state đổi không?" → <b>Không</b>. Nó không có state và chỉ chạy trên server. Muốn dữ liệu mới phải <code>router.refresh()</code> hoặc revalidate rồi điều hướng.',
    tip: 'Đặt <code>use client</code> càng sâu trong cây càng tốt. Gắn ở root layout là kéo cả app vào bundle — chỉ lá nào thật sự cần tương tác mới đánh dấu.',
  },
  {
    id: '03', level: 'mid', title: 'Data fetching · revalidate',
    questions: [
      'Next 15 còn cache fetch mặc định nữa không?',
      'revalidateTag và revalidatePath khác nhau ra sao?',
    ],
    points: [
      'Fetch ngay trong Server Component bằng <code>async/await</code>, không cần <code>useEffect</code>. Hai component cùng cần một dữ liệu thì cứ gọi lại — <b>request memoization</b> dedupe trong một lần render.',
      '<b>Next 14</b>: <code>fetch</code> mặc định là <code>force-cache</code>. <b>Next 15 đổi mặc định sang không cache</b> — muốn cache phải khai báo rõ <code>cache: \'force-cache\'</code> hoặc <code>next.revalidate</code>.',
      'Revalidate theo thời gian: <code>next: { revalidate: 60 }</code> cho một fetch, hoặc <code>export const revalidate</code> cho cả segment.',
      'Revalidate theo tag: gắn <code>next: { tags: [...] }</code> rồi gọi <code>revalidateTag()</code> lúc dữ liệu đổi. Chính xác hơn xoá theo path vì tag đi theo dữ liệu, không theo URL.',
      'Gọi DB qua ORM/SDK thì <b>không</b> đi qua Data Cache. Muốn cache và gắn tag cho loại này thì bọc bằng <code>unstable_cache</code>.',
    ],
    code: `// Next 15: fetch KHÔNG còn cache mặc định
const a = await fetch(url);        // ❌ đi mạng lại mỗi request

// ✅ cache + tự làm mới sau 60 giây
const b = await fetch(url, { next: { revalidate: 60 } });

// ✅ cache + gắn tag để sau này xoá đúng phần cần xoá
const c = await fetch(url, { next: { tags: ['posts'] } });

// Server Action: ghi xong thì xoá đúng tag đó
'use server';
export async function createPost(data) {
  await db.post.create({ data });
  revalidateTag('posts');
}`,
    trap: 'Nâng 14 lên 15 mà quên đọc changelog: trang đang static bỗng gọi API mỗi request, hoá đơn API tăng vọt. Chiều ngược lại, người quen Next 15 sang dự án Next 14 lại thấy dữ liệu cũ dai dẳng vì fetch bị cache mặc định.',
    tip: '<code>revalidatePath</code> xoá theo đường dẫn, <code>revalidateTag</code> xoá mọi fetch mang tag đó dù nằm ở route nào. Dự án thật nên đặt tag theo entity (<code>posts</code>, <code>post:12</code>) để xoá đúng phần cần xoá.',
  },
  {
    id: '04', level: 'mid', title: 'SSR · SSG · ISR · Streaming',
    questions: [
      'Next quyết định static hay dynamic dựa vào cái gì?',
      'generateStaticParams dùng để làm gì?',
    ],
    points: [
      'Không còn <code>getServerSideProps</code>. Next <b>tự suy ra</b>: route chỉ dùng dữ liệu cache được thì render <b>static</b> lúc build; chạm vào dynamic API thì render <b>dynamic</b> mỗi request.',
      'Dynamic API gồm <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code>, <code>draftMode()</code>. Next 15 chúng là async, phải <code>await</code>. Ép tay bằng <code>export const dynamic</code>.',
      '<b>ISR</b> = static + <code>revalidate</code>: trả bản cũ ngay, nền dựng lại bản mới (stale-while-revalidate). Không phải build lại cả site.',
      '<code>generateStaticParams</code> liệt kê trước các <code>[slug]</code> cần prerender. Param ngoài danh sách vẫn render on-demand, trừ khi đặt <code>dynamicParams = false</code> → trả 404.',
      '<b>Streaming</b>: <code>loading.tsx</code> hoặc <code>&lt;Suspense&gt;</code> cho phép gửi shell HTML ra trước, phần chậm đẩy xuống sau — TTFB không còn phụ thuộc query chậm nhất.',
    ],
    code: `// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getTopPosts();
  return posts.map(p => ({ slug: p.slug }));  // ✅ prerender lúc build
}
export const revalidate = 3600;    // ISR: làm mới mỗi giờ
export const dynamicParams = true; // slug lạ vẫn render on-demand

// Streaming: shell ra ngay, phần chậm chờ sau
export default function Page() {
  return <main>
    <Header />
    <Suspense fallback={<Skeleton />}><SlowFeed /></Suspense>
  </main>;
}`,
    trap: 'Lỗi rất hay gặp: bọc <code>&lt;Suspense&gt;</code> nhưng lại <code>await</code> ngay ở component cha rồi mới truyền kết quả xuống → cha bị chặn, streaming thành vô nghĩa. Phần <code>await</code> phải nằm <b>bên trong</b> component đặt dưới Suspense.',
    tip: '<b>Partial Prerendering</b> ghép cả hai: shell static phục vụ từ CDN, lỗ dynamic stream vào cùng một response. Đây vẫn là tính năng experimental — nói rõ "chưa stable" để khỏi hớ khi bị hỏi sâu.',
  },
  {
    id: '05', level: 'mid', title: 'Route Handler · Server Actions',
    questions: [
      'Khi nào dùng Server Action, khi nào dùng Route Handler?',
      'Server Action có an toàn hơn API route không?',
    ],
    points: [
      '<b>Route Handler</b> (<code>app/api/*/route.ts</code>) là HTTP endpoint thật: webhook, OAuth callback, client bên ngoài, CORS, custom method. Next 15 GET handler <b>không cache mặc định</b>.',
      '<b>Server Action</b> (<code>use server</code>) là hàm chạy trên server, gọi thẳng từ component, luôn là <b>POST</b>. Hợp cho mutation nội bộ app, kèm <code>revalidateTag</code> và <code>redirect</code>.',
      'Gắn vào <code>form action={fn}</code> thì form <b>submit được cả khi JS chưa tải xong</b> (progressive enhancement) — điểm mà Route Handler không có.',
      '<code>useFormStatus()</code> (react-dom) đọc trạng thái pending của form cha; <code>useActionState()</code> (React 19) giữ giá trị action trả về để hiện lỗi validate.',
      'Server Action <b>được compile thành một endpoint công khai</b>. Auth và validate input phải nằm <b>trong thân hàm</b>, không phải ở chỗ gọi nó.',
    ],
    code: `'use server';
export async function updateName(prev, formData) {
  const user = await auth();      // ✅ check quyền NGAY trong action
  if (!user) return { error: 'Bạn chưa đăng nhập' };

  // ✅ validate ở server, không tin dữ liệu gửi lên
  const input = Schema.safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: 'Tên không hợp lệ' };

  await db.user.update({ where: { id: user.id }, data: input.data });
  revalidatePath('/profile');
  return { ok: true };
}
// ❌ chỉ ẩn nút trên UI rồi tin là an toàn — endpoint vẫn gọi được`,
    trap: 'Hỏi vặn: "Server Action chạy trên server thì khỏi validate chứ?" → Sai. Next sinh một endpoint POST cho mỗi action, ai cũng bắn request thẳng vào được. Ẩn nút, disable form hay check ở Client Component đều không tính là bảo mật.',
    tip: '<code>redirect()</code> hoạt động bằng cách ném exception. Bọc nó trong <code>try/catch</code> là bị nuốt mất và redirect không chạy — luôn đặt <code>redirect()</code> sau khối try, khi mọi việc đã xong.',
  },
  {
    id: '06', level: 'mid', title: 'Middleware · Auth · Redirect',
    questions: [
      'Đặt auth check ở middleware đã đủ an toàn chưa?',
      'redirect và rewrite khác nhau ở chỗ nào?',
    ],
    points: [
      '<code>middleware.ts</code> đặt ở gốc project, chạy <b>trước mọi request khớp <code>matcher</code></b> và chạy trên <b>Edge runtime</b> — không có đủ Node API, không hợp để gọi DB nặng.',
      '<code>matcher</code> phải viết chặt, loại <code>_next/static</code>, ảnh, favicon. Middleware nằm trên đường đi của mọi request: chậm 50ms là toàn site chậm 50ms.',
      'Middleware chỉ nên làm <b>optimistic check</b>: đọc cookie session, thiếu thì đẩy về <code>/login</code>. Không giải mã nặng, không query DB, không check quyền chi tiết.',
      '<b>Authorization thật</b> phải đặt sát dữ liệu: trong Server Component, Data Access Layer hoặc Server Action. Middleware chỉ là lớp lọc tiện tay, không phải lớp bảo vệ.',
      '<code>NextResponse.redirect</code> đổi URL trên trình duyệt (3xx). <code>NextResponse.rewrite</code> giữ nguyên URL nhưng phục vụ nội dung từ path khác — dùng cho A/B test, multi-tenant.',
    ],
    code: `// middleware.ts
export function middleware(req) {
  const token = req.cookies.get('session')?.value;   // chỉ đọc cookie
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();    // ✅ optimistic check, không query DB
}

export const config = {
  // ❌ '/:path*' → middleware chạy cả trên ảnh, font, _next/static
  // ✅ loại trừ tài nguyên tĩnh khỏi middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,
    trap: 'Sai lầm nặng: coi middleware là lớp bảo mật duy nhất. Nó chỉ thấy cookie, không biết quyền trên từng bản ghi — user A vẫn mở được <code>/orders/id-cua-B</code>. Quyền phải được kiểm tra ngay tại chỗ truy vấn dữ liệu.',
    tip: 'Muốn truyền dữ liệu từ middleware xuống route thì clone request headers rồi đưa vào <code>NextResponse.next()</code>. Ghi thẳng vào <code>req.headers</code> không có tác dụng.',
  },
  {
    id: '07', level: 'senior', title: '4 tầng cache của Next.js',
    questions: [
      'Next có mấy tầng cache, mỗi tầng nằm ở đâu?',
      'revalidateTag xoá được những tầng cache nào?',
    ],
    points: [
      '<b>1. Request Memoization</b> — sống trong <b>một lần render của một request</b>. Dedupe <code>fetch</code> GET trùng URL để nhiều component cùng gọi mà chỉ đi mạng một lần. Render xong là mất.',
      '<b>2. Data Cache</b> — trên <b>server</b>, <b>sống qua nhiều request và qua cả deploy</b>. Chứa kết quả fetch đã opt-in cache. Xoá bằng hết hạn <code>revalidate</code>, <code>revalidateTag</code> hoặc <code>revalidatePath</code>.',
      '<b>3. Full Route Cache</b> — server giữ HTML + RSC Payload của route static. Route dynamic không có tầng này. Data Cache revalidate thì HTML dựng lại; deploy mới là xoá sạch.',
      '<b>4. Router Cache</b> — nằm trong <b>bộ nhớ trình duyệt</b>, theo phiên, giữ RSC Payload theo segment để back/forward mượt. Bấm F5 là mất sạch.',
      'Xoá Router Cache bằng <code>router.refresh()</code>, hoặc Server Action có gọi <code>revalidateTag</code>/<code>revalidatePath</code>. Next 15 hạ mặc định <code>staleTimes.dynamic</code> về 0.',
    ],
    code: `// Tầng            Ở đâu     Sống bao lâu       Xoá bằng
// 1 Request Memo    server    1 lần render       tự hết
// 2 Data Cache      server    qua nhiều request  revalidateTag/Path
// 3 Full Route      server    tới khi revalidate revalidate, deploy
// 4 Router Cache    browser   phiên làm việc     refresh(), F5

// Server Action: xoá tầng 2 + 3, đồng thời báo client bỏ tầng 4
'use server';
export async function publish(id) {
  await db.post.publish(id);
  revalidateTag('posts');     // Data Cache + Full Route Cache
  revalidatePath('/blog');    // thêm: xoá theo đúng path
}`,
    trap: 'Bẫy hay gặp nhất: sửa dữ liệu, gọi <code>revalidateTag</code> trong Route Handler, server đã có bản mới nhưng user bấm Back vẫn thấy bản cũ. Vì Router Cache nằm ở browser — gọi từ Server Action hoặc <code>router.refresh()</code> mới xử lý được.',
    tip: 'Next 15 đổi mặc định hai chỗ: <code>fetch</code> không còn cache, và <code>staleTimes.dynamic</code> về 0 nên page segment không được tái dùng từ Router Cache nữa. Nói rõ mình trả lời theo bản nào là ghi điểm ngay.',
  },
  {
    id: '08', level: 'senior', title: 'Tối ưu · Core Web Vitals · SEO',
    questions: [
      'Bạn làm gì để cải thiện LCP của một trang Next?',
      'generateMetadata khác metadata tĩnh ở chỗ nào?',
    ],
    points: [
      '<code>next/image</code> tự sinh srcset, lazy-load, và <b>giữ chỗ theo width/height nên không gây CLS</b>. Ảnh LCP phải đặt <code>priority</code>; dùng <code>fill</code> thì bắt buộc khai <code>sizes</code>.',
      '<code>next/font</code> <b>self-host</b> font lúc build: không request sang Google, và tự sinh fallback có <code>size-adjust</code> nên chữ không nhảy khi font tải xong.',
      '<b>INP</b> đã thay FID từ 2024, đo độ trễ phản hồi tương tác. Cách giảm: bớt JS phía client, <code>next/dynamic</code> cho phần nặng, đẩy logic về Server Component.',
      'Soi bundle bằng <code>@next/bundle-analyzer</code> trước khi tối ưu. Thủ phạm quen mặt: import cả gói lodash, icon pack, thư viện chart nằm trong Client Component.',
      'SEO: <code>export const metadata</code> cho trang tĩnh, <code>generateMetadata()</code> async cho tiêu đề theo dữ liệu. Thêm <code>app/sitemap.ts</code>, <code>app/robots.ts</code> để sinh file tự động.',
    ],
    code: `// ✅ ảnh LCP: ưu tiên tải, có kích thước nên không nhảy layout
<Image src={hero} alt={title} width={1200} height={630} priority />

// ❌ dùng fill mà quên sizes → trình duyệt tải biến thể quá to
<Image src={cover} fill />
// ✅ khai báo sizes để trình duyệt chọn đúng biến thể
<Image src={cover} fill sizes="(max-width: 768px) 100vw, 50vw" />

// SEO động: tiêu đề theo từng bài viết
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);   // cùng fetch với page → dedupe
  return { title: post.title, openGraph: { images: [post.cover] } };
}`,
    trap: 'Hỏi vặn: "dùng <code>next/image</code> là hết CLS chứ?" → Không. Để <code>fill</code> mà container không có chiều cao xác định thì vẫn nhảy. Và <code>priority</code> chỉ dành cho ảnh trong viewport đầu — rải khắp nơi là tranh băng thông, LCP còn tệ hơn.',
    tip: '<code>generateMetadata</code> chỉ chạy được trong Server Component. Nếu nó và page cùng gọi một <code>fetch</code>, request memoization gộp lại thành một lần — không cần truyền dữ liệu qua lại.',
  },
];
