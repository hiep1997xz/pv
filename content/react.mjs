/**
 * Noi dung cum REACT — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'react',
  kicker: '( Cẩm nang )',
  title: 'ReactJS',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Từ Junior đến Senior',
  toc: [
    ['📦', 'Component · Props · State', 'Junior'],
    ['🎣', 'Hooks toàn tập & quy tắc dùng', 'Junior'],
    ['🔄', 'Cơ chế re-render & batching', 'Junior'],
    ['🧬', 'Virtual DOM · Reconciliation · key', 'Mid'],
    ['⚡', 'Tối ưu: memo / useMemo / useCallback', 'Mid'],
    ['🗂️', 'Quản lý state · Context · React Query', 'Mid'],
    ['🧩', 'Custom hook & Design patterns', 'Senior'],
    ['🌐', 'React 18/19 · Suspense · Server Component', 'Senior'],
    ['🛡️', 'Error boundary & xử lý lỗi', 'Mid'],
    ['🧪', 'Testing với React Testing Library', 'Mid'],
    ['🐞', 'Bẫy phỏng vấn hay gặp nhất', 'All'],
    ['💬', 'Câu hỏi thật theo từng cấp độ', 'All'],
  ],
  sticky: ['Giải thích dễ hiểu', 'Có code thật', 'Bẫy phỏng vấn', 'Câu trả lời mẫu'],
  chips: [
    ['Khái niệm', '#DCE9FF'],
    ['Code mẫu', '#D6F5E3'],
    ['Bẫy thường gặp', '#FFDCD4'],
    ['Câu hỏi thật', '#FFE9C7'],
    ['Mẹo ghi điểm', '#F3DDFF'],
  ],
  note: 'Hiểu <em>cơ chế</em>, đừng học vẹt — phỏng vấn hỏi<br>“vì sao”, không hỏi “là gì”. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Component · Props · State',
    questions: [
      'Props và State khác nhau ở điểm nào?',
      'Vì sao không được sửa trực tiếp props?',
    ],
    points: [
      '<b>Props</b> = dữ liệu cha truyền xuống, <b>chỉ đọc</b>. Con muốn đổi thì gọi callback báo ngược lên cha.',
      '<b>State</b> = dữ liệu riêng của component. Gọi hàm set → React lên lịch <b>re-render</b>.',
      'Component phải <b>thuần (pure)</b>: cùng props đầu vào luôn cho ra cùng UI, không sửa biến bên ngoài lúc render.',
      '<b>Lifting state up</b>: đặt state ở component cha thấp nhất mà vẫn bao được mọi nơi cần dùng.',
    ],
    code: `// ❌ SAI: sửa thẳng props (mutate) — cha không biết, UI lệch
function Item({ todo }) {
  todo.done = true;
  return <li>{todo.text}</li>;
}

// ✅ ĐÚNG: báo ngược lên cha, cha đổi state
function Item({ todo, onToggle }) {
  return <li onClick={() => onToggle(todo.id)}>{todo.text}</li>;
}`,
    trap: 'Hỏi tiếp thường gặp: “state cha đổi thì con có re-render không?” → <b>Có</b>, mặc định toàn bộ cây con re-render, trừ khi bọc <code>React.memo</code>.',
    tip: 'Nhắc <b>unidirectional data flow</b> và <b>single source of truth</b>: dữ liệu chảy một chiều cha → con, mỗi mẩu dữ liệu chỉ có một chỗ làm chủ.',
  },
  {
    id: '02', level: 'junior', title: 'useState & cơ chế re-render',
    questions: [
      'Gọi setCount(count + 1) ba lần, kết quả tăng mấy?',
      'setState là đồng bộ hay bất đồng bộ?',
    ],
    points: [
      'Hàm set <b>không gán ngay</b>, nó <b>lên lịch</b> render mới. Biến <code>count</code> là ảnh chụp (snapshot) của lần render hiện tại — đã bị “đóng băng”.',
      '<b>Automatic batching</b>: nhiều lần set trong cùng một sự kiện gộp lại thành một lần render. React 18 gộp cả trong <code>setTimeout</code>/<code>promise</code>, React 17 thì không.',
      'Cần dựa trên giá trị mới nhất → dùng <b>updater function</b>: <code>setCount(c =&gt; c+1)</code>.',
      'State phải <b>immutable</b>: tạo object/array mới. <code>push</code>, <code>splice</code>, gán <code>obj.x=1</code> đều không kích hoạt render.',
    ],
    code: `const [count, setCount] = useState(0);

// ❌ cả 3 dòng đều đọc count = 0  →  kết quả: 1
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);

// ✅ mỗi lần nhận giá trị mới nhất  →  kết quả: 3
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);`,
    trap: 'Bẫy kinh điển: <code>console.log(count)</code> ngay sau <code>setCount</code> in ra gì? → Vẫn <b>giá trị cũ</b>, vì biến đó thuộc về lần render hiện tại chứ không phải lần render kế tiếp.',
    tip: 'Về <b>immutable</b>: <code>setItems([...items, x])</code> thay vì <code>items.push(x)</code> — React so sánh bằng tham chiếu <code>Object.is</code>, mảng cũ thì coi như không đổi.',
  },
  {
    id: '03', level: 'junior', title: 'useEffect dùng cho đúng',
    questions: [
      'Dependency array hoạt động ra sao?',
      'Khi nào KHÔNG nên dùng useEffect?',
    ],
    points: [
      '<code>[]</code> chạy một lần sau mount · <code>[a, b]</code> chạy lại khi a hoặc b đổi (so sánh <code>Object.is</code>) · bỏ trống thì chạy sau <b>mọi</b> lần render.',
      'Hàm <code>return</code> trong effect là <b>cleanup</b>: chạy trước lần effect kế tiếp và khi unmount. Dùng để huỷ timer, huỷ subscribe, huỷ request.',
      'Effect chỉ để <b>đồng bộ với hệ thống bên ngoài</b> (fetch, subscribe, DOM, timer). Dữ liệu <b>suy ra được</b> từ state/props thì tính thẳng lúc render — đừng nhét vào effect.',
      'Fetch trong effect bắt buộc chống <b>race condition</b> bằng cờ <code>ignore</code> hoặc <code>AbortController</code>.',
    ],
    code: `useEffect(() => {
  let ignore = false;                    // cờ chống race condition
  fetch(\`/api/user/\${id}\`)
    .then(r => r.json())
    .then(d => { if (!ignore) setUser(d); });

  return () => { ignore = true; };       // cleanup khi id đổi / unmount
}, [id]);`,
    trap: 'Thiếu cleanup là trượt: đổi <code>id</code> nhanh → response <b>cũ</b> về sau response <b>mới</b> → màn hình hiện dữ liệu của user trước đó.',
    tip: 'Nhắc <b>StrictMode</b> ở React 18 cố tình chạy effect 2 lần trong dev để lộ effect thiếu cleanup — đó là tính năng, không phải bug.',
  },
  {
    id: '04', level: 'mid', title: 'Virtual DOM · Reconciliation · key',
    questions: [
      'Virtual DOM hoạt động thế nào?',
      'Vì sao không nên dùng index làm key?',
    ],
    points: [
      '<b>VDOM</b> là cây object mô tả UI. Mỗi lần render dựng cây mới, React <b>diff</b> với cây cũ rồi chỉ vá đúng phần khác vào DOM thật.',
      'Thuật toán diff dựa trên 2 giả định: khác <b>type</b> thẻ → huỷ cả cây con dựng lại; cùng cha thì dùng <b>key</b> để ghép node cũ với node mới.',
      '<b>key</b> phải <b>ổn định</b> và <b>duy nhất giữa các anh em ruột</b> — lấy <code>id</code> từ dữ liệu, không lấy <code>Math.random()</code>.',
      'Dùng index: chèn/xoá/sắp xếp làm index lệch → React tái dùng <b>nhầm</b> node → state nội bộ (chữ trong input, focus, animation) dính sai hàng.',
    ],
    code: `// ❌ thêm phần tử vào đầu danh sách → chữ trong input lệch hàng
{todos.map((t, i) => <TodoRow key={i} todo={t} />)}

// ✅ key gắn liền với dữ liệu, xáo trộn thế nào cũng đúng
{todos.map(t => <TodoRow key={t.id} todo={t} />)}`,
    trap: 'Chỉ nói “index gây bug” là chưa đủ điểm. Phải chỉ rõ <b>bug gì</b>: React ghép nhầm node cũ với item mới nên <b>state nội bộ và DOM node bị gán sai hàng</b>.',
    tip: 'Nêu ngoại lệ để thể hiện hiểu sâu: index <b>chấp nhận được</b> khi danh sách tĩnh, không thêm/xoá/sắp xếp, và item không giữ state riêng.',
  },
  {
    id: '05', level: 'mid', title: 'memo · useMemo · useCallback',
    questions: [
      'Ba thứ này khác nhau chỗ nào?',
      'Khi nào KHÔNG nên dùng chúng?',
    ],
    points: [
      '<code>React.memo</code> bọc <b>component</b>: props không đổi (so sánh <b>nông</b>) thì bỏ qua re-render.',
      '<code>useMemo</code> nhớ <b>GIÁ TRỊ</b> trả về của một phép tính nặng. <code>useCallback</code> nhớ chính <b>HÀM</b>, giữ tham chiếu không đổi giữa các lần render.',
      'Phải dùng <b>kết hợp</b>: truyền object/array/hàm tạo inline làm props thì <code>React.memo</code> <b>vô hiệu</b>, vì tham chiếu mới mỗi lần render.',
      'Tối ưu có giá: tốn bộ nhớ và tốn thời gian so sánh deps. <b>Đo bằng React Profiler trước</b>, đừng bọc bừa cho “chắc ăn”.',
    ],
    code: `const Row = React.memo(function Row({ item, onPick }) { /* ... */ });

// ❌ mỗi render tạo hàm mới → props đổi → React.memo vô dụng
items.map(i => <Row key={i.id} item={i} onPick={() => pick(i.id)} />)

// ✅ tham chiếu ổn định → Row thật sự được bỏ qua
const onPick = useCallback(id => pick(id), []);
items.map(i => <Row key={i.id} item={i} onPick={onPick} />)`,
    trap: 'Hỏi ngược hay gặp: bọc <code>useMemo</code> cho phép tính nhẹ có lợi không? → <b>Không</b>, còn chậm hơn vì phải so sánh deps và giữ giá trị cũ trong bộ nhớ.',
    tip: 'Nhắc <b>React Compiler</b> (React 19) tự động chèn memo hoá lúc build — xu hướng là bớt tối ưu bằng tay. Biết điều này là rất được điểm.',
  },
  {
    id: '06', level: 'mid', title: 'Quản lý state · Context · Server state',
    questions: [
      'Khi nào cần Redux / Zustand?',
      'Context có thay được state manager không?',
    ],
    points: [
      'Chia rõ 2 loại: <b>server state</b> (dữ liệu từ API — cần cache, refetch, đồng bộ) và <b>client state</b> (UI: modal, tab, form).',
      '<b>Server state → React Query / SWR</b>. Tự lo cache, dedupe request, stale-while-revalidate, retry. Nhét vào Redux là tự viết lại một cái cache tệ hơn.',
      '<b>Client state</b>: đơn giản thì <code>useState</code> + lifting up; phức tạp/chia sẻ rộng thì Zustand, Jotai, Redux Toolkit.',
      '<b>Context KHÔNG phải state manager</b> — nó chỉ là đường truyền dữ liệu chống prop drilling. Mọi consumer re-render khi <code>value</code> đổi, và không có selector.',
      'Context hợp với giá trị <b>ít thay đổi</b>: theme, ngôn ngữ, user đã đăng nhập.',
    ],
    code: `// ❌ gom state đổi liên tục vào 1 Context → cả cây re-render
<AppContext.Provider value={{ user, cart, theme, mousePos }}>

// ✅ tách Context theo tần suất thay đổi
<ThemeContext.Provider value={theme}>
  <UserContext.Provider value={user}>`,
    trap: 'Trả lời “dự án lớn thì dùng Redux” là <b>mất điểm ngay</b>. Người phỏng vấn muốn nghe bạn phân biệt được <b>server state</b> và <b>client state</b>.',
    tip: 'Tách Context thành <b>state context</b> và <b>dispatch context</b> riêng — component chỉ cần dispatch sẽ không re-render khi state đổi.',
  },
  {
    id: '07', level: 'senior', title: 'Custom hook & Design patterns',
    questions: [
      'Khi nào nên tách ra custom hook?',
      'Compound component giải quyết vấn đề gì?',
    ],
    points: [
      'Custom hook tái sử dụng <b>LOGIC có state</b>, không tái sử dụng UI. Quy tắc: tên bắt đầu bằng <code>use</code>, và có gọi hook khác bên trong.',
      'Mỗi component gọi hook nhận <b>một state độc lập</b> — hook <b>không</b> chia sẻ state giữa các component. Đây là chỗ hay bị hiểu nhầm nhất.',
      '<b>Compound component</b>: cha giữ state, các con lấy qua Context → API dùng linh hoạt như <code>&lt;Tabs&gt;</code> + <code>&lt;Tabs.List/&gt;</code> + <code>&lt;Tabs.Panel/&gt;</code>.',
      '<b>Headless</b> (Radix, Headless UI): tách hành vi + accessibility ra khỏi giao diện, người dùng tự style hoàn toàn.',
      '<b>HOC</b> và <b>render props</b> là pattern thời trước hooks — cần biết để đọc code cũ và trả lời câu so sánh.',
    ],
    code: `function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);     // huỷ timer cũ mỗi lần gõ phím
  }, [value, delay]);

  return v;
}`,
    trap: '“Hai component cùng gọi <code>useCounter()</code> thì dùng chung số đếm chứ?” → <b>KHÔNG</b>. Mỗi lần gọi tạo một state riêng biệt.',
    tip: 'Nêu tiêu chí tách hook cho rõ ràng: khi logic lặp ở <b>2 chỗ trở lên</b>, hoặc khi component phình to vì phải quản lý side effect.',
  },
  {
    id: '08', level: 'senior', title: 'React 18/19 · Concurrent · RSC',
    questions: [
      'useTransition dùng để làm gì?',
      'Server Component khác Client Component chỗ nào?',
    ],
    points: [
      '<b>Concurrent rendering</b>: React có thể <b>tạm dừng hoặc bỏ</b> một lần render đang dở để ưu tiên việc gấp hơn (gõ phím) → UI không bị đơ.',
      '<code>useTransition</code> đánh dấu update là <b>không gấp</b>: ô input cập nhật ngay, danh sách nặng render sau. <code>isPending</code> để hiện trạng thái chờ.',
      '<code>useDeferredValue</code> hoãn một <b>GIÁ TRỊ</b> thay vì một update — dùng khi bạn không sở hữu hàm set (ví dụ value đến từ props).',
      '<b>Suspense</b>: khai báo trạng thái chờ ngay trên cây UI, ghép với <code>lazy()</code> để chia nhỏ bundle.',
      '<b>Server Component</b> chạy trên server, <b>không vào bundle</b>, truy cập DB trực tiếp, nhưng <b>không có</b> state / effect / event handler. Client Component có <code>"use client"</code>.',
    ],
    code: `const [isPending, startTransition] = useTransition();

function onChange(e) {
  setText(e.target.value);                 // gấp: ô input phản hồi ngay
  startTransition(() => {
    setResults(search(e.target.value));    // không gấp: có thể bị ngắt
  });
}`,
    trap: 'Đừng nói “Server Component để render nhanh hơn”. Ý chính là <b>giảm lượng JS gửi xuống client</b> và <b>lấy dữ liệu sát nguồn</b>, bỏ được một vòng round-trip API.',
    tip: 'Kể thêm React 19: <code>use()</code>, <b>form Actions</b>, <code>useOptimistic</code>, <b>React Compiler</b>. Nhắc đúng tên là ghi điểm senior ngay.',
  },
];
