/**
 * Noi dung cum DEBUGGING — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'debugging',
  kicker: '( Cẩm nang )',
  title: 'Debug & Fix',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Lỗi thường gặp & cách xử lý',
  toc: [
    ['♾️', 'useEffect chạy vô hạn · dependency', 'Junior'],
    ['🌐', 'CORS · preflight · credentials', 'Junior'],
    ['💧', 'Hydration mismatch trong Next.js', 'Mid'],
    ['🕰️', 'Stale closure · đọc phải giá trị cũ', 'Mid'],
    ['🧹', 'Memory leak · cleanup · heap snapshot', 'Mid'],
    ['🏁', 'Race condition fetch · double submit', 'Mid'],
    ['📦', 'Bundle phình · tải chậm · code split', 'Senior'],
    ['📐', 'Layout shift · z-index · overflow', 'Senior'],
    ['🔍', 'Đọc lỗi & khoanh vùng nguyên nhân', 'All'],
    ['🛠️', 'DevTools: Network · Performance · Memory', 'All'],
    ['🧯', 'Phòng bệnh: lint, cleanup, budget', 'All'],
  ],
  sticky: ['Giải thích dễ hiểu', 'Có code thật', 'Bẫy phỏng vấn', 'Câu trả lời mẫu'],
  chips: [
    ['Khái niệm', '#DCE9FF'],
    ['Code mẫu', '#D6F5E3'],
    ['Bẫy thường gặp', '#FFDCD4'],
    ['Câu hỏi thật', '#FFE9C7'],
    ['Mẹo ghi điểm', '#F3DDFF'],
  ],
  note: 'Đọc kỹ <em>thông báo lỗi</em> trước khi sửa — nửa thời gian<br>debug mất vì đoán mò thay vì đọc. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'useEffect chạy vô hạn',
    questions: [
      'Vì sao useEffect của bạn chạy đi chạy lại không dừng?',
      'Dependency là object thì React so sánh kiểu gì?',
    ],
    points: [
      'Dấu hiệu: tab đơ, tab Network bắn request liên tục, console báo <b>Maximum update depth exceeded</b>.',
      'Nguyên nhân số một: dependency là <b>object hoặc hàm tạo mới mỗi render</b>. React so bằng <code>Object.is</code>, tham chiếu mới thì luôn "khác" → effect chạy lại → setState → render → lặp.',
      'Nguyên nhân số hai: <code>setState</code> <b>vô điều kiện</b> ngay trong effect không có dependency array — render nào cũng kích hoạt render tiếp theo.',
      'Sửa: dữ liệu <b>suy ra được</b> từ state/props thì tính thẳng lúc render. Object cần ổn định thì <code>useMemo</code>, hàm thì <code>useCallback</code>, hằng số thì đưa ra ngoài component.',
      'Phòng: bật <code>react-hooks/exhaustive-deps</code>. Nó chỉ đúng dependency còn thiếu, chỗ nào bạn phải "tắt lint" thường chính là chỗ thiết kế sai.',
    ],
    code: `// ❌ options là object mới mỗi render → effect chạy lại vô hạn
const options = { page, size: 20 };
useEffect(() => { load(options); }, [options]);

// ✅ phụ thuộc vào giá trị nguyên thuỷ, dựng object bên trong
useEffect(() => { load({ page, size: 20 }); }, [page]);

// ❌ setState vô điều kiện, không có deps → render → effect → ...
useEffect(() => { setTotal(items.length * 2); });

// ✅ suy ra được từ props/state thì tính thẳng khi render
const total = items.length * 2;`,
    trap: 'Cách sửa sai hay gặp: xoá bớt dependency cho "hết chạy lại". Vòng lặp im thật, nhưng effect bắt đầu đọc giá trị cũ — bạn vừa đổi một bug lộ liễu lấy một bug <b>stale closure</b> khó thấy hơn nhiều.',
    tip: 'Khoanh vùng nhanh: <code>console.log</code> từng phần tử deps qua 2 lần render, so bằng <code>Object.is</code> — cái nào <code>false</code> liên tục là thủ phạm. React DevTools Profiler cũng chỉ ra vì sao component render lại.',
  },
  {
    id: '02', level: 'junior', title: 'CORS · preflight · credentials',
    questions: [
      'Vì sao Postman gọi được mà trình duyệt báo lỗi CORS?',
      'Khi nào trình duyệt gửi preflight OPTIONS?',
    ],
    points: [
      'Lỗi luôn có dạng <b>blocked by CORS policy</b>. Request <b>vẫn tới server</b> và server vẫn xử lý — trình duyệt chỉ chặn không cho JS đọc response.',
      'Trình duyệt gửi <b>preflight</b> <code>OPTIONS</code> khi request không "đơn giản": method ngoài GET/POST/HEAD, có header tự đặt (vd <code>Authorization</code>), hoặc <code>Content-Type: application/json</code>.',
      'Quyết định nằm ở header server trả về: <b>Access-Control-Allow-Origin</b>, <b>-Allow-Methods</b>, <b>-Allow-Headers</b>. Preflight trả 204 kèm <b>Access-Control-Max-Age</b> để trình duyệt cache lại.',
      'Gửi cookie (<code>credentials: "include"</code>) thì <b>không được</b> dùng <code>*</code> — phải ghi rõ đúng một origin và thêm <b>Access-Control-Allow-Credentials: true</b>. Dùng <code>*</code> là trình duyệt chặn thẳng.',
      'CORS là cơ chế <b>của trình duyệt</b>. Postman, curl, server-to-server không kiểm tra nên vẫn chạy ngon — đừng lấy đó làm bằng chứng "API không lỗi".',
    ],
    code: `// ❌ vô ích: đây là header của RESPONSE, client không tự cấp
fetch(url, { headers: { 'Access-Control-Allow-Origin': '*' } });

// ✅ sửa ở server — app/api/data/route.ts (Next.js)
const cors = {
  'Access-Control-Allow-Origin': 'https://app.example.com',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function GET() {
  return Response.json({ ok: true }, { headers: cors });
}
// ✅ preflight OPTIONS trả 204 kèm đúng bộ header trên
export const OPTIONS = () =>
  new Response(null, { status: 204, headers: cors });`,
    trap: 'Hiểu nhầm số một: tưởng sửa được ở phía client. Thêm header vào request, đặt <code>mode: "no-cors"</code> hay tắt CORS bằng extension đều vô ích — <code>no-cors</code> trả response opaque, đọc body ra rỗng. Chỉ server hoặc proxy mới sửa được.',
    tip: 'Trong Next.js có đường vòng chính thống: gọi qua <b>route handler</b> ở <code>app/api/*</code>, hoặc khai <code>rewrites</code> trong <code>next.config.js</code>. Request đi từ server nên không dính CORS, lại giấu được API key.',
  },
  {
    id: '03', level: 'mid', title: 'Hydration mismatch · Next.js SSR',
    questions: [
      'Hydration mismatch là gì và vì sao nó nguy hiểm?',
      'Kể vài nguyên nhân khiến HTML server khác client?',
    ],
    points: [
      'React báo <b>Hydration failed because the initial UI does not match what was rendered on the server</b>, overlay của Next.js in kèm diff giữa hai bên.',
      'Nguyên nhân 1 — giá trị thay đổi theo thời gian hoặc ngẫu nhiên: <code>Date.now()</code>, <code>Math.random()</code>, <code>toLocaleString()</code> (phụ thuộc múi giờ và locale của máy chạy).',
      'Nguyên nhân 2 — đụng API chỉ có ở client ngay lúc render: <code>window</code>, <code>document</code>, <code>localStorage</code>. Server không có chúng nên HTML hai bên lệch nhau.',
      'Nguyên nhân 3 — HTML lồng sai, React cảnh báo <b>validateDOMNesting</b>: thẻ <code>&lt;div&gt;</code> nằm trong <code>&lt;p&gt;</code>, <code>&lt;a&gt;</code> lồng <code>&lt;a&gt;</code>. Trình duyệt tự nắn lại cây DOM, thành ra khác cây React dựng.',
      'Sửa: phần chỉ có ở client đẩy vào <code>useEffect</code> · <code>suppressHydrationWarning</code> chỉ đặt đúng node text đó · component cần <code>window</code> thì <code>dynamic(..., { ssr: false })</code>.',
    ],
    code: `// ❌ server render 20:00, client hydrate 20:01 → HTML lệch
function Clock() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}

// ✅ lần render đầu giống server, điền giá trị thật sau mount
function Clock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return <span suppressHydrationWarning>{time ?? '--:--:--'}</span>;
}

// ✅ component bắt buộc có window thì tắt hẳn SSR
const Chart = dynamic(() => import('./Chart'), { ssr: false });`,
    trap: 'React <b>không</b> vá riêng chỗ lệch. Gặp mismatch nó bỏ HTML của server rồi render lại toàn bộ cây từ client — mất sạch lợi ích SSR và màn hình nháy một nhịp. <code>suppressHydrationWarning</code> chỉ tắt cảnh báo cho node đó, không sửa nguyên nhân.',
    tip: 'Tránh cờ <code>mounted</code> rải khắp nơi: <code>useSyncExternalStore</code> có tham số <code>getServerSnapshot</code> riêng cho lần render ở server, nên dữ liệu ngoài React vẫn khớp hai bên mà không cần render hai lần bằng tay.',
  },
  {
    id: '04', level: 'mid', title: 'Stale closure · đọc phải giá trị cũ',
    questions: [
      'setInterval đếm 0 rồi 1 xong đứng im, vì sao?',
      'Vì sao handler đọc ra state cũ dù UI đã cập nhật?',
    ],
    points: [
      'Dấu hiệu: hàm đọc ra <b>giá trị của lần render trước</b> — timer đếm mãi không nhích, event listener lọc theo filter cũ, callback gửi đi tham số đã lỗi thời.',
      'Nguyên nhân: mỗi lần render là <b>một bộ biến mới</b>. Hàm đăng ký ở lần render nào thì <b>closure</b> giữ mãi biến của lần render đó. Closure không tự nhìn thấy state mới.',
      'Deps <code>[]</code> khiến effect chỉ chạy một lần, nên listener/timer bên trong vĩnh viễn nhìn ảnh chụp (snapshot) đầu tiên.',
      'Sửa 1 — giá trị mới suy từ giá trị cũ: dùng <b>updater function</b> <code>setX(prev =&gt; ...)</code>. React truyền vào state mới nhất, không phụ thuộc closure.',
      'Sửa 2 — cần đọc nhiều state/props: <code>useRef</code> giữ bản mới nhất, cập nhật <code>ref.current</code> trong effect không deps; hoặc khai đủ deps và chấp nhận đăng ký lại.',
    ],
    code: `// ❌ interval tạo 1 lần, closure giữ count = 0 mãi mãi
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);

// ✅ updater function luôn nhận giá trị mới nhất
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);

// ✅ cần đọc nhiều giá trị trong callback → giữ qua ref
const latest = useRef(filters);
useEffect(() => { latest.current = filters; });`,
    trap: 'Câu vặn hay gặp: "thêm vào deps là xong chứ gì?". Với <code>setInterval</code> thì thêm deps làm timer bị <b>huỷ và tạo lại</b> mỗi lần state đổi, nhịp đếm lệch hẳn. Muốn giữ đúng một timer thì phải dùng updater function hoặc ref.',
    tip: '<code>useRef</code> không gây re-render nên rất hợp để giữ "giá trị mới nhất". Nhưng đừng đọc <code>ref.current</code> lúc render để dựng UI: React không render lại khi ref đổi, màn hình sẽ đứng yên với dữ liệu cũ.',
  },
  {
    id: '05', level: 'mid', title: 'Memory leak · thiếu cleanup',
    questions: [
      'Trang dùng lâu thì chậm dần, bạn nghi vấn ở đâu?',
      'Làm sao chứng minh được là có memory leak?',
    ],
    points: [
      'Dấu hiệu: dùng càng lâu càng ì, heap trong DevTools tăng đều sau mỗi lần vào/ra cùng một trang và <b>không tụt xuống</b> sau khi chạy GC.',
      'Nguyên nhân: đăng ký mà không gỡ — <code>addEventListener</code>, <code>setInterval</code>, WebSocket, subscription của store, <code>IntersectionObserver</code>, <code>ResizeObserver</code>.',
      'Closure trong callback còn sống sẽ giữ luôn tham chiếu tới object lớn hoặc DOM node đã bị gỡ khỏi trang (<b>detached DOM</b>), nên GC không thu hồi được.',
      'Sửa: mọi effect có đăng ký đều phải <code>return</code> cleanup, và gỡ <b>đúng tham chiếu đã đăng ký</b> — truyền hàm inline vào <code>removeEventListener</code> thì gỡ hụt vì đó là hàm khác.',
      'Đo: tab Memory → chụp <b>heap snapshot</b> trước và sau khi lặp thao tác vài lần, so hai snapshot ở chế độ <b>Comparison</b>, lọc từ khoá "Detached" để tìm DOM còn bị giữ.',
    ],
    code: `// ❌ không gỡ listener → mount lại là chồng thêm một cái nữa
useEffect(() => {
  window.addEventListener('resize', () => setW(window.innerWidth));
}, []);

// ✅ cleanup gỡ đúng tham chiếu đã đăng ký
useEffect(() => {
  const onResize = () => setW(window.innerWidth);
  const id = setInterval(tick, 1000);
  window.addEventListener('resize', onResize);
  return () => {
    window.removeEventListener('resize', onResize);
    clearInterval(id);
  };
}, []);`,
    trap: 'Cảnh báo setState trên component đã unmount chỉ bắt được một kiểu leak. Listener chồng nhau, timer còn chạy, WebSocket chưa đóng thì <b>không sinh ra cảnh báo nào</b> — trang vẫn chạy đúng, chỉ ì dần. Console im không có nghĩa là sạch.',
    tip: '<b>StrictMode</b> ở dev cố tình mount → unmount → mount lại. Effect nào thiếu cleanup lộ ra ngay: hai listener, hai interval, hai WebSocket. Thấy "chạy hai lần" thì đi sửa cleanup, đừng tắt StrictMode cho đỡ ồn.',
  },
  {
    id: '06', level: 'mid', title: 'Race condition khi fetch',
    questions: [
      'Gõ tìm kiếm nhanh lại ra kết quả của từ khoá cũ, vì sao?',
      'Chống double submit form thì làm ở client hay server?',
    ],
    points: [
      'Dấu hiệu: ô search gõ nhanh, kết quả hiển thị lại là của từ khoá trước đó; bấm chuyển tab liên tục thì dữ liệu tab cũ nhấp nháy đè lên tab mới.',
      'Nguyên nhân: mỗi lần tham số đổi là một request mới, nhưng <b>response về không theo thứ tự gửi</b>. Request cũ về sau sẽ ghi đè state của request mới.',
      'Sửa tối thiểu: cờ <code>ignore</code> trong effect, cleanup đặt <code>ignore = true</code> — response cũ về vẫn bị bỏ qua, không cần huỷ request.',
      'Tốt hơn: <code>AbortController</code> huỷ hẳn request cũ, đỡ tốn băng thông và kết nối. Nhớ bỏ qua <code>AbortError</code>, đó là hành vi mong muốn chứ không phải lỗi.',
      'Cùng một gốc là <b>double submit</b>: bấm gửi hai lần tạo hai đơn. Khoá nút bằng <code>isSubmitting</code> ở client, nhưng phải có <b>idempotency key</b> ở server mới chắc.',
    ],
    code: `// ❌ gõ nhanh: response của "ab" về sau "abc" → hiện sai kết quả
useEffect(() => {
  fetch(\`/api/search?q=\${q}\`).then(r => r.json()).then(setList);
}, [q]);

// ✅ AbortController: huỷ request cũ khi q đổi hoặc unmount
useEffect(() => {
  const ac = new AbortController();
  fetch(\`/api/search?q=\${q}\`, { signal: ac.signal })
    .then(r => r.json())
    .then(setList)
    .catch(e => { if (e.name !== 'AbortError') setErr(e); });

  return () => ac.abort();
}, [q]);`,
    trap: 'Chỉ debounce ô input là chưa đủ. Debounce giảm <b>số lượng</b> request chứ không quyết định <b>thứ tự</b> response — mạng chậm một nhịp là request cuối vẫn có thể về trước. Phải có <code>ignore</code> hoặc <code>abort</code> mới chắc.',
    tip: 'React Query / SWR lo sẵn việc này: cache theo <b>query key</b>, tự dedupe request trùng và chỉ nhận kết quả của key đang active. Trả lời "dùng React Query" thì phải nói kèm <b>vì sao nó an toàn</b>, không thì thành học vẹt.',
  },
  {
    id: '07', level: 'senior', title: 'Bundle phình · trang tải chậm',
    questions: [
      'Bundle 3MB, bạn bắt đầu điều tra từ đâu?',
      'Vì sao import một hàm lodash lại kéo cả thư viện?',
    ],
    points: [
      'Đo trước khi sửa: <b>@next/bundle-analyzer</b> xem chunk nào to và vì sao · <b>Lighthouse</b> cho LCP/TBT · tab <b>Coverage</b> của DevTools chỉ ra bao nhiêu phần trăm JS tải về mà không hề chạy.',
      'Nguyên nhân: import cả thư viện thay vì đúng phần cần · <code>moment</code> kéo theo toàn bộ locale · <code>lodash</code> bản CommonJS không tree-shake được.',
      'Không code splitting: mọi màn hình nằm chung một bundle, người dùng mở trang chủ vẫn phải tải code của trang admin. Ảnh gốc vài MB và font tải muộn cũng làm trang đứng hình.',
      'Sửa: <code>next/dynamic</code> cho phần nặng ít dùng (editor, chart, modal) · đổi sang <code>date-fns</code>/<code>dayjs</code> · import đúng đường dẫn con · <code>next/image</code> và <code>next/font</code> để preload và chừa chỗ sẵn.',
      'Chốt bằng <b>performance budget</b> trong CI: đặt ngưỡng kích thước cho từng chunk, vượt thì fail build. Không có budget thì vài sprint sau bundle lại phình như cũ.',
    ],
    code: `// ❌ kéo nguyên lodash và toàn bộ locale của moment vào client
import _ from 'lodash';
import moment from 'moment';

// ✅ lấy đúng hàm cần, đổi sang thư viện tree-shake được
import debounce from 'lodash-es/debounce';
import { format } from 'date-fns';

// ✅ tách chunk riêng: chỉ tải khi người dùng thật sự mở
const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
  loading: () => <Skeleton />,
});

// đo: ANALYZE=true next build  (@next/bundle-analyzer)`,
    trap: 'Bẫy kinh điển: <code>import { debounce }</code> từ <code>"lodash"</code> vẫn kéo cả gói, vì <code>lodash</code> là CommonJS nên bundler không tree-shake được. Phải dùng <code>lodash-es</code> hoặc import thẳng <code>lodash/debounce</code>.',
    tip: 'Phân biệt <b>kích thước</b> và <b>thứ tự tải</b>: chia nhỏ mà chunk vẫn nằm trên critical path thì thời gian tương tác không nhanh hơn. Ưu tiên preload font và ảnh LCP, hoãn analytics, và đo <b>TBT</b>/<b>INP</b> thay vì chỉ nhìn tổng KB.',
  },
  {
    id: '08', level: 'senior', title: 'Layout shift · z-index · overflow',
    questions: [
      'CLS cao thì bạn tìm nguyên nhân bằng cách nào?',
      'Đặt z-index 9999 rồi mà vẫn bị che, vì sao?',
    ],
    points: [
      'Đo CLS: Lighthouse cho số trong phòng lab, thư viện <code>web-vitals</code> gửi số thật từ người dùng, còn Performance panel chỉ đúng phần tử nào đã dịch chuyển.',
      'Dịch chuyển đến từ: ảnh và iframe <b>không đặt width/height</b> nên cao 0 rồi đột ngột giãn · font swap đổi metric chữ · banner chèn động phía trên nội dung.',
      'Sửa: luôn khai kích thước hoặc <code>aspect-ratio</code> · <code>next/font</code> tự khớp metric chữ fallback · chừa sẵn chỗ bằng skeleton <b>đúng kích thước thật</b>, không phải skeleton cho có.',
      '<code>z-index</code> chỉ so sánh được <b>trong cùng một stacking context</b>. Cha có <code>transform</code>, <code>filter</code>, <code>opacity</code> nhỏ hơn 1, hay <code>position: fixed</code> là tạo context mới — con nằm trọn trong đó.',
      '<code>overflow: hidden</code> ở cha cắt cụt dropdown, tooltip; lồng nhiều vùng cuộn thì scroll bị kẹt. Gọn nhất: render qua <code>createPortal</code> ra <code>body</code>, định vị bằng Floating UI.',
    ],
    code: `// ❌ ảnh không khai kích thước → nội dung nhảy khi ảnh tải xong
<img src="/banner.jpg" alt="" />

// ✅ chừa chỗ trước: next/image bắt buộc width/height hoặc fill
<Image src="/banner.jpg" alt="" width={1200} height={400} />

// ❌ .card tạo stacking context mới → tooltip 9999 vẫn bị che
// .card    { opacity: .99 }
// .tooltip { z-index: 9999 }
// .header  { position: sticky; z-index: 10 }

// ✅ đẩy tooltip ra ngoài cây, thoát cả stacking context lẫn overflow
createPortal(<Tooltip />, document.body);`,
    trap: 'Hiểu nhầm kinh điển: tưởng <code>z-index: 9999</code> thì luôn nổi lên trên. Nếu cha đã nằm trong một stacking context thấp hơn thì cả cây con bị nhốt trong đó, số to đến mấy cũng vô nghĩa. Mở tab Layers hoặc Computed để truy ra cha nào tạo context.',
    tip: 'Bẫy ngầm: <code>overflow: hidden</code> không chỉ cắt hình, nó còn biến phần tử thành scroll container và làm hỏng <code>position: sticky</code> của con. Gặp sticky "không chịu dính", đi ngược lên cha tìm <code>overflow</code> trước tiên.',
  },
];
