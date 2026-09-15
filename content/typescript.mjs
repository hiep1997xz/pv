/**
 * Noi dung cum TYPESCRIPT — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'typescript',
  kicker: '( Cẩm nang )',
  title: 'TypeScript',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Từ cơ bản đến type nâng cao',
  toc: [
    ['🧭', 'Vì sao TypeScript · strict mode', 'Junior'],
    ['🕳️', 'any vs unknown vs never', 'Junior'],
    ['🧱', 'interface vs type · union · intersection', 'Junior'],
    ['🧬', 'Generic · ràng buộc extends', 'Mid'],
    ['🧰', 'Utility types dùng thật trong dự án', 'Mid'],
    ['🔍', 'Narrowing · type guard', 'Mid'],
    ['🎛️', 'Discriminated union · exhaustive', 'Mid'],
    ['⚛️', 'TypeScript trong React', 'Mid'],
    ['🔑', 'keyof · typeof · indexed access', 'Senior'],
    ['🗺️', 'Mapped type · template literal', 'Senior'],
    ['🪄', 'Conditional types · infer', 'Senior'],
    ['🐞', 'Bẫy phỏng vấn hay gặp nhất', 'All'],
  ],
  sticky: ['Giải thích dễ hiểu', 'Có code thật', 'Bẫy phỏng vấn', 'Câu trả lời mẫu'],
  chips: [
    ['Khái niệm', '#DCE9FF'],
    ['Code mẫu', '#D6F5E3'],
    ['Bẫy thường gặp', '#FFDCD4'],
    ['Câu hỏi thật', '#FFE9C7'],
    ['Mẹo ghi điểm', '#F3DDFF'],
  ],
  note: 'Type là <em>công cụ</em>, không phải mục tiêu — đủ<br>chặt để yên tâm, đủ đơn giản để người sau đọc. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Vì sao TS · any vs unknown vs never',
    questions: [
      'TypeScript giúp gì mà JavaScript không tự làm được?',
      'any và unknown khác nhau chỗ nào?',
    ],
    points: [
      'TS là lớp kiểm tra <b>lúc compile</b>. Build xong type bị <b>xoá sạch</b>, runtime chỉ còn JS thuần — nên type <b>không</b> kiểm chứng được dữ liệu API lúc chạy.',
      'Giá trị thật: bắt lỗi sớm, autocomplete, refactor an toàn, type là tài liệu sống. Bật <code>strict</code> mới có <code>strictNullChecks</code> — thứ chặn nhiều bug nhất.',
      '<code>any</code> tắt mọi kiểm tra và <b>lây lan</b>: gán any sang biến khác là mất type ở đó luôn. <code>unknown</code> nhận mọi giá trị nhưng bắt <b>narrow</b> trước khi dùng.',
      '<code>never</code> là <b>tập rỗng</b>, không giá trị nào thuộc kiểu này. Gặp ở hàm luôn throw, vòng lặp vô tận, và ở nhánh <b>exhaustive check</b>.',
      'Muốn chắc dữ liệu runtime đúng type thì phải validate thật bằng Zod / io-ts rồi lấy type ra bằng <code>z.infer</code> — đừng tin mỗi <code>as</code>.',
    ],
    code: `function handle(res: unknown) {
  // ❌ any: tắt hết kiểm tra, compile im lặng, runtime mới nổ
  const a = res as any;
  a.data.items.map((x: any) => x.id);

  // ✅ unknown: buộc narrow trước khi đụng vào
  if (typeof res === 'object' && res !== null && 'data' in res) {
    console.log(res.data);
  }
}

// never: hàm không bao giờ trả về giá trị
function fail(msg: string): never { throw new Error(msg); }`,
    trap: 'Câu vặn hay gặp: “type có chặn được API trả sai dữ liệu không?” → <b>Không</b>. Type bay hết sau khi compile. Và <code>as</code> chỉ là lời hứa với compiler, nó không kiểm tra gì cả — sai là nổ lúc runtime.',
    tip: 'Kể lộ trình siết dần: bật <code>strict</code> trước, rồi thêm <b>noUncheckedIndexedAccess</b> để truy cập mảng ra kèm <code>undefined</code>. Dùng <code>unknown</code> ở biên hệ thống, <code>any</code> chỉ khi gỡ code cũ và phải kèm comment.',
  },
  {
    id: '02', level: 'junior', title: 'interface vs type · union · intersection',
    questions: [
      'Khi nào dùng interface, khi nào dùng type?',
      'Field optional khác field kiểu undefined ra sao?',
    ],
    points: [
      '<code>interface</code> mô tả hình dạng object và <b>merge được</b>: khai trùng tên thì gộp lại. <code>type</code> là bí danh cho <b>mọi</b> kiểu — union, tuple, primitive, mapped type.',
      'Chỉ <code>type</code> viết được union. Cả hai đều mở rộng được: interface dùng <code>extends</code>, type dùng intersection <code>&amp;</code>.',
      'Quy ước thực dụng: object và props thì <code>interface</code>, còn lại dùng <code>type</code>. Thư viện public nên để interface cho người dùng <b>augment</b> được.',
      '<b>Union</b> là “một trong”, <b>intersection</b> là “gộp tất cả”. Union của object chỉ cho đụng field <b>chung</b>, muốn dùng field riêng phải narrow trước.',
      '<code>a?: string</code> nghĩa là <b>được phép vắng key</b>. <code>a: string|undefined</code> thì <b>bắt buộc truyền key</b>, chỉ là giá trị được phép undefined. <code>readonly</code> chặn ghi lúc compile.',
    ],
    code: `// interface trùng tên thì merge — type trùng tên thì báo lỗi
interface User { id: string }
interface User { name: string }   // ✅ gộp thành { id, name }

type Status = 'idle' | 'loading' | 'done';   // chỉ type làm được
type Log = { msg: string } & { at: number }; // intersection: gộp cả 2

// ❌ chưa narrow thì không đụng được field riêng của nhánh
function f(v: string | string[]) { return v.toUpperCase(); }

// ✅ narrow xong mới dùng
function g(v: string | string[]) {
  return typeof v === 'string' ? v.toUpperCase() : v.join(',');
}`,
    trap: '<b>Declaration merging</b> diễn ra âm thầm: hai <code>interface</code> trùng tên trong cùng scope sẽ gộp lại, không một cảnh báo nào; hai <code>type</code> trùng tên thì lỗi ngay. Khá nhiều người tưởng interface cũng báo lỗi.',
    tip: 'Nêu <b>excess property check</b>: gán object literal thẳng vào biến có type thì field thừa bị báo lỗi, nhưng đi vòng qua một biến trung gian thì lọt. Đó là lý do “field thừa chẳng ai bắt”.',
  },
  {
    id: '03', level: 'mid', title: 'Generic · ràng buộc extends · suy luận kiểu',
    questions: [
      'Generic giải quyết gì mà any không làm được?',
      'Khi nào một hàm KHÔNG cần generic?',
    ],
    points: [
      'Generic giữ <b>mối liên hệ</b> giữa đầu vào và đầu ra. <code>any</code> làm mất type ở đầu ra; generic thì truyền <code>number</code> vào là nhận <code>number</code> ra.',
      'TS <b>tự suy luận</b> type param từ đối số, hiếm khi phải viết tay. Chỉ viết rõ khi suy luận ra hẹp/rộng không như ý.',
      '<b>Ràng buộc</b> bằng <code>extends</code>: <code>&lt;T extends { id: string }&gt;</code> cho phép dùng field trong thân hàm mà vẫn giữ nguyên type gốc của caller.',
      '<b>Default type param</b> <code>&lt;T = string&gt;</code> để caller bỏ qua. Generic dùng được cả trong interface và class, như <code>Map&lt;K, V&gt;</code> hay <code>Array&lt;T&gt;</code>.',
      '<b>Không cần generic</b> khi type param chỉ xuất hiện <b>đúng một lần</b> trong signature — lúc đó nó là <code>any</code> trá hình, thay bằng union hoặc kiểu cụ thể.',
    ],
    code: `// ❌ any: nhận gì cũng được, trả về any — mất sạch type
function firstAny(arr: any[]): any { return arr[0]; }

// ✅ generic: type đầu ra bám theo đầu vào
function first<T>(arr: T[]): T | undefined { return arr[0]; }
const n = first([1, 2, 3]);       // n: number | undefined

// ràng buộc extends để đụng được field bên trong
function byId<T extends { id: string }>(list: T[], id: string) {
  return list.find(x => x.id === id);    // trả về T | undefined
}

// ❌ generic thừa: T chỉ xuất hiện một lần
function log<T>(x: T) { console.log(x); }`,
    trap: '<code>arr[0]</code> của <code>T[]</code> được TS coi là <code>T</code> chứ không phải <code>T | undefined</code> — mảng rỗng là nổ lúc runtime mà compiler vẫn im. Bật <b>noUncheckedIndexedAccess</b> mới có undefined trong type.',
    tip: 'Phân biệt hai vai của <code>extends</code>: trong generic là <b>ràng buộc</b>, trong conditional type là <b>phép so khớp</b>. Cùng một từ khoá, hai nghĩa khác nhau — hỏi tới là lộ ngay ai chỉ học thuộc.',
  },
  {
    id: '04', level: 'mid', title: 'Utility types dùng thật trong dự án',
    questions: [
      'Partial, Pick, Omit khác nhau chỗ nào?',
      'ReturnType lấy được kiểu trả về bằng cách nào?',
    ],
    points: [
      'Nhóm sửa field: <code>Partial&lt;T&gt;</code> cho mọi field optional, <code>Required&lt;T&gt;</code> ngược lại, <code>Readonly&lt;T&gt;</code> khoá ghi. Dùng nhiều nhất là <code>Partial</code> cho payload update.',
      'Nhóm chọn field: <code>Pick&lt;T, K&gt;</code> giữ những field liệt kê, <code>Omit&lt;T, K&gt;</code> bỏ chúng đi. Hay dùng để dựng type cho props UI từ type model.',
      '<code>Record&lt;K, V&gt;</code> dựng object có key cố định, ví dụ <code>Record&lt;Role, Perm&gt;</code> — thêm role mới mà quên khai là TS báo lỗi ngay.',
      'Nhóm lọc union: <code>Exclude&lt;T, U&gt;</code> bỏ nhánh khớp U, <code>Extract&lt;T, U&gt;</code> giữ nhánh khớp, <code>NonNullable&lt;T&gt;</code> bỏ null và undefined.',
      'Nhóm rút kiểu từ hàm: <code>ReturnType&lt;typeof f&gt;</code>, <code>Parameters&lt;typeof f&gt;</code>, <code>Awaited&lt;T&gt;</code> mở Promise. Rất hợp để type hoá kết quả API mà khỏi khai lại.',
    ],
    code: `type User = { id: string; name: string; email: string; age: number };

type UserPatch = Partial<Omit<User, 'id'>>;  // payload update
type UserCard = Pick<User, 'id' | 'name'>;   // props cho UI

type Role = 'admin' | 'editor' | 'viewer';
const perms: Record<Role, string[]> = {
  admin: ['*'], editor: ['write'], viewer: ['read'],  // thiếu 1 → lỗi
};

async function getUser(id: string) { return { id, name: 'a' }; }
type Fetched = Awaited<ReturnType<typeof getUser>>;

type Oops = Omit<User, 'emial'>;   // ❌ gõ sai key vẫn compile trót lọt
type Nope = Pick<User, 'emial'>;   // ✅ Pick gạch đỏ ngay: TS2344`,
    trap: '<code>Omit</code> có lỗ hổng: key truyền vào <b>không</b> bị ràng buộc theo <code>keyof T</code>, nên gõ sai tên field vẫn compile trót lọt và type ra thừa field. <code>Pick</code> thì báo <code>TS2344</code>. Đổi tên field xong nhớ rà lại mọi chỗ Omit.',
    tip: '<code>Partial</code> chỉ nông <b>một tầng</b>, object lồng bên trong vẫn bắt buộc đủ field. Cần sâu thì tự viết mapped type đệ quy — đừng tưởng <code>Partial</code> lo hết cho mình.',
  },
  {
    id: '05', level: 'mid', title: 'Narrowing · type guard · discriminated union',
    questions: [
      'Type guard tự viết khác gì typeof thường?',
      'Làm sao để switch báo lỗi khi thêm case mới?',
    ],
    points: [
      'TS narrow tự động qua <code>typeof</code> (primitive), <code>instanceof</code> (class), <code>in</code> (có field), so sánh literal, và <code>Array.isArray</code>.',
      'Type guard tự viết trả về <code>x is Foo</code>. TS <b>tin</b> lời khai đó chứ không kiểm chứng — logic bên trong sai thì narrow sai mà compiler vẫn im.',
      '<b>Discriminated union</b>: mỗi nhánh có chung một field literal (<code>kind</code>, <code>type</code>, <code>status</code>), nhờ đó <code>switch</code> trên field ấy narrow được từng nhánh.',
      '<b>Exhaustive check</b>: ở nhánh <code>default</code> gán giá trị vào một biến kiểu <code>never</code>. Thêm nhánh mới mà quên xử lý là <b>lỗi compile</b>, không phải bug lặng lẽ.',
      '<b>Assertion function</b> <code>asserts x is T</code>: ném lỗi nếu sai, sau lời gọi thì narrow cho cả phần còn lại. Nếu gán vào biến thì phải khai type tường minh.',
    ],
    code: `type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'rect'; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2;
    case 'rect':   return s.w * s.h;
    default: {
      // ✅ thêm kind mới mà quên case → dòng dưới lỗi compile
      const _never: never = s;
      return _never;
    }
  }
}`,
    trap: 'Type guard chỉ là <b>lời hứa</b>: khai <code>x is User</code> nhưng bên trong mới kiểm <code>!!x</code> thì TS vẫn tin tuyệt đối. Narrow sai kiểu này không có một cảnh báo nào, bug lòi ra tận runtime.',
    tip: 'Truthiness narrowing có bẫy với số và chuỗi: <code>if (count)</code> loại luôn <code>0</code>, <code>if (s)</code> loại luôn chuỗi rỗng. Với <code>number|undefined</code> thì phải so sánh <code>!== undefined</code> mới đúng.',
  },
  {
    id: '06', level: 'mid', title: 'TypeScript trong React',
    questions: [
      'Kiểu props và children viết thế nào cho đúng?',
      'Vì sao nhiều team khuyên tránh React.FC?',
    ],
    points: [
      'Props khai bằng <code>type</code> hoặc <code>interface</code> rồi nhận thẳng qua tham số. <code>children</code> khai <code>React.ReactNode</code> — kiểu rộng nhất, nhận string, number, JSX, mảng, null.',
      '<b>Tránh <code>React.FC</code></b>: từ <b>@types/react 18</b> nó không còn tự thêm <code>children</code> nữa, nhưng vẫn vướng khi viết component generic. Khai kiểu tham số trực tiếp gọn hơn.',
      '<code>useState</code> tự suy kiểu từ giá trị khởi tạo. Khởi tạo rỗng hoặc null thì phải chỉ rõ type param: <code>useState&lt;User[]&gt;([])</code>.',
      'Với <b>@types/react 18</b>, <code>useRef&lt;T&gt;(null)</code> dành cho ref DOM và <code>current</code> là read-only; muốn ô nhớ tự ghi thì khai <code>useRef&lt;T|null&gt;(null)</code>.',
      'Event handler dùng type có sẵn: <code>React.ChangeEvent</code>, <code>React.MouseEvent</code>. Viết handler <b>inline</b> ngay trong JSX thì TS tự suy kiểu cho <code>e</code>, khỏi khai gì.',
    ],
    code: `type Props = {
  title: string;
  children?: React.ReactNode;       // string, JSX, mảng, null...
  onPick: (id: string) => void;
};

function Panel({ title, children, onPick }: Props) {
  const [users, setUsers] = useState<User[]>([]);  // ❌ thiếu → never[]
  const inputRef = useRef<HTMLInputElement>(null); // ref DOM

  // e được suy kiểu tự động vì handler viết inline
  return <input ref={inputRef} onChange={e => onPick(e.target.value)} />;
}`,
    trap: '<code>useState([])</code> suy ra <code>never[]</code> nên thêm phần tử vào là lỗi ngay; <code>useState(null)</code> ra đúng kiểu <code>null</code> nên gán giá trị khác cũng lỗi. Khởi tạo rỗng thì luôn tự khai type param.',
    tip: 'Component generic viết bằng hàm thường là được: <code>function List&lt;T&gt;()</code>. Nhưng arrow function trong file <code>.tsx</code> phải viết <code>&lt;T,&gt;</code> có dấu phẩy, không thì TS hiểu nhầm là JSX tag.',
  },
  {
    id: '07', level: 'senior', title: 'keyof · typeof · indexed access · mapped',
    questions: [
      'keyof và typeof kết hợp với nhau thế nào?',
      'Mapped type dùng để làm gì trong thực tế?',
    ],
    points: [
      '<code>keyof T</code> cho ra <b>union các key</b> của T. <code>typeof obj</code> ở vị trí type thì rút type từ một <b>giá trị</b> đang có — khác hẳn <code>typeof</code> lúc runtime.',
      'Ghép hai thứ lại: <code>keyof typeof config</code> lấy đúng danh sách key của object thật, khỏi phải khai lại union chuỗi bằng tay rồi quên đồng bộ.',
      '<b>Indexed access</b> <code>T[K]</code> lấy type của field. <code>T[keyof T]</code> ra union mọi giá trị, <code>Arr[number]</code> ra type phần tử của mảng hoặc tuple.',
      '<b>Mapped type</b> <code>[K in keyof T]</code> duyệt từng key để dựng type mới. Có modifier <code>readonly</code> và <code>?</code>, gỡ bằng <code>-readonly</code> và <code>-?</code>.',
      '<b>Template literal type</b> ghép chuỗi ngay ở tầng type: từ <code>click</code> dựng ra <code>onClick</code>. Ghép với mapped type và <code>as</code> để <b>đổi tên key</b> lúc map.',
    ],
    code: `const config = { host: 'localhost', port: 5432, ssl: false };

type Key = keyof typeof config;    // 'host' | 'port' | 'ssl'
type Val = (typeof config)[Key];   // string | number | boolean

// mapped type: gỡ readonly và gỡ optional của mọi field
type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };

// đổi tên key ngay lúc map bằng as + template literal
type Handlers<T> = {
  [K in keyof T as \`on\${Capitalize<K & string>}\`]: (v: T[K]) => void;
};

// Handlers<{ id: string }>  →  { onId: (v: string) => void }`,
    trap: 'Đừng lẫn hai <code>typeof</code>: ở vị trí giá trị nó trả chuỗi lúc runtime, ở vị trí type nó rút type lúc compile. Và <code>keyof</code> trên object có index signature <code>string</code> sẽ ra <code>string | number</code>, không phải union key cụ thể.',
    tip: 'Thói quen đáng kể trong phỏng vấn: khai object config trước rồi lấy union key bằng <code>keyof typeof</code>, thay vì gõ lại union chuỗi. Thêm <code>as const</code> để giá trị giữ nguyên literal type.',
  },
  {
    id: '08', level: 'senior', title: 'Conditional types · infer · khi nào quá đà',
    questions: [
      'Distributive conditional type nghĩa là gì?',
      'infer dùng để làm gì, cho một ví dụ?',
    ],
    points: [
      '<code>T extends U ? X : Y</code> là <code>if</code> ở tầng type. Chữ <code>extends</code> ở đây nghĩa là “gán được vào”, không phải kế thừa class.',
      '<b>Distributive</b>: khi T là <b>naked type param</b> và nhận vào một union, điều kiện chạy <b>từng nhánh</b> rồi hợp kết quả lại. <code>Exclude</code> hoạt động đúng nhờ vậy.',
      'Muốn <b>tắt</b> distributive thì bọc tuple: <code>[T] extends [U]</code>. Dùng khi cần xét cả union như một khối, ví dụ kiểm tra một type có phải <code>never</code> không.',
      '<code>infer</code> đặt một ô trống để TS điền type vào khi khớp mẫu — đây là cơ sở của <code>ReturnType</code>, <code>Parameters</code> và <code>Awaited</code>.',
      '<b>Khi nào là quá đà</b>: type khó hiểu hơn code nó bảo vệ, thông báo lỗi dài mấy chục dòng, đồng đội không sửa nổi. Lúc đó khai type tường minh còn rẻ hơn nhiều.',
    ],
    code: `// tự viết lại ReturnType
type MyReturn<T> = T extends (...a: any[]) => infer R ? R : never;
type A = MyReturn<() => string>;    // string

// tự viết lại Awaited (bản rút gọn, mở Promise lồng nhau)
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;
type B = MyAwaited<Promise<Promise<number>>>;   // number

// distributive: chạy từng nhánh của union rồi hợp lại
type NoStr<T> = T extends string ? never : T;
type C = NoStr<string | number | boolean>;      // number | boolean

// ❌ bọc tuple là tắt distributive → xét cả union một khối
type D = [string | number] extends [string] ? 1 : 0;   // 0`,
    trap: 'Distributive cắn ngược: tự viết <code>T extends null ? never : T</code> rồi truyền <code>never</code> vào sẽ nhận lại <code>never</code>, vì union rỗng phân phối ra rỗng. Nhiều người tưởng đó là bug của TS thay vì đúng quy tắc.',
    tip: 'Nêu giới hạn thật: conditional type đệ quy có <b>depth limit</b>, vượt là TS bắn <code>TS2589</code> — “Type instantiation is excessively deep and possibly infinite”. Gặp lỗi đó thì đơn giản hoá type, đừng lách bằng <code>any</code>.',
  },
];
