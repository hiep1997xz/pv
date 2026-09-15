/**
 * Noi dung cum JAVASCRIPT — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'javascript',
  kicker: '( Cẩm nang )',
  title: 'JavaScript',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Nền tảng cho mọi vòng phỏng vấn',
  toc: [
    ['🧱', 'Kiểu dữ liệu · value vs reference', 'Junior'],
    ['🪜', 'Hoisting · TDZ · scope', 'Junior'],
    ['⚖️', 'Coercion · == vs === · falsy', 'Junior'],
    ['🔒', 'Closure & private state', 'Junior'],
    ['🎯', 'this · call / apply / bind · arrow', 'Mid'],
    ['🧬', 'Prototype · kế thừa · class', 'Mid'],
    ['🔁', 'Event loop · macrotask · microtask', 'Mid'],
    ['⏳', 'Promise · async/await · xử lý lỗi', 'Mid'],
    ['🎚️', 'Debounce vs Throttle', 'Mid'],
    ['📦', 'ES Module · CommonJS · tree-shaking', 'Mid'],
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
  note: 'Hiểu <em>cơ chế</em> chạy của ngôn ngữ, đừng học thuộc<br>đáp án — người ta luôn hỏi vặn thêm một tầng. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Kiểu dữ liệu · value vs reference',
    questions: [
      'Primitive và object khác nhau thế nào khi gán biến?',
      'Copy một object lồng nhau sao cho an toàn?',
    ],
    points: [
      '7 <b>primitive</b>: string, number, boolean, null, undefined, symbol, bigint — lưu theo <b>value</b>. Object / array / function lưu theo <b>reference</b>: biến chỉ giữ địa chỉ.',
      'Gán primitive là copy giá trị, hai biến độc lập. Gán object là copy <b>địa chỉ</b> — hai biến trỏ cùng một vùng nhớ, sửa bên này thì bên kia đổi theo.',
      '<code>===</code> với object so sánh địa chỉ chứ không so nội dung, nên <code>{a:1} === {a:1}</code> là <b>false</b>. Muốn so nội dung phải tự duyệt hoặc dùng thư viện.',
      'Spread <code>{...obj}</code> và <code>Object.assign</code> chỉ copy <b>nông (shallow)</b> — đúng một tầng. Object lồng bên trong vẫn dùng chung reference với bản gốc.',
      'Deep clone: <code>structuredClone(obj)</code> (Node 17+, mọi browser hiện đại). Nó không copy được function; còn <code>JSON.stringify</code> thì mất <code>undefined</code> và biến Date thành string.',
    ],
    code: `const a = { x: 1, deep: { y: 2 } };

// ❌ spread chỉ copy 1 tầng: deep vẫn chung reference
const b = { ...a };
b.deep.y = 99;
console.log(a.deep.y);        // 99 — a bị sửa theo

// ✅ structuredClone cắt đứt mọi tầng
const c = structuredClone(a);
c.deep.y = 7;
console.log(a.deep.y);        // 99 — a không đổi

console.log({ x: 1 } === { x: 1 });   // false: khác địa chỉ`,
    trap: 'Câu vặn hay gặp: <code>const</code> có làm object bất biến không? → <b>Không</b>. <code>const</code> chỉ khoá việc <b>gán lại biến</b>; <code>obj.x = 2</code> và <code>arr.push(1)</code> vẫn chạy bình thường.',
    tip: '<code>Object.freeze</code> cũng chỉ đóng băng một tầng. Và khi truyền object vào hàm: sửa <b>thuộc tính</b> thì ảnh hưởng ra ngoài, nhưng <b>gán lại</b> cả tham số thì không — vì JS luôn truyền theo value.',
  },
  {
    id: '02', level: 'junior', title: 'Hoisting · TDZ · scope',
    questions: [
      'var, let, const khác nhau ở những điểm nào?',
      'TDZ là gì và vì sao let lại có TDZ?',
    ],
    points: [
      '<b>Hoisting</b>: engine quét scope lúc compile và cấp chỗ cho mọi khai báo trước khi chạy. <code>var</code> được gán sẵn <code>undefined</code>; <code>let</code>/<code>const</code> cũng hoisted nhưng <b>chưa khởi tạo</b>.',
      '<b>TDZ</b> (temporal dead zone) là khoảng từ đầu block tới dòng khai báo. Chạm vào biến trong đó ném <code>ReferenceError</code>, khác hẳn việc nhận <code>undefined</code>.',
      '<code>var</code> là <b>function scope</b> nên rò ra khỏi <code>if</code>/<code>for</code>; <code>let</code>/<code>const</code> là <b>block scope</b>. <code>const</code> chỉ cấm gán lại, không cấm sửa nội dung object.',
      '<b>Function declaration</b> hoisted cả thân hàm nên gọi trước khi khai báo vẫn chạy. <b>Function expression</b> gán vào <code>var</code> thì gọi sớm sẽ báo <code>is not a function</code>.',
      'Gán biến chưa khai báo (<code>x = 1</code>) tạo <b>biến toàn cục ngầm</b> ở sloppy mode. <code>&#39;use strict&#39;</code> và ES module chặn việc này bằng <code>ReferenceError</code>.',
    ],
    code: `console.log(typeof a);   // "undefined" — var hoisted, gán sẵn undefined
var a = 1;

sayHi();                 // ✅ chạy được: declaration hoisted cả thân hàm
function sayHi() { console.log('hi'); }

try { console.log(b); }  // ❌ ReferenceError: Cannot access 'b'
catch (e) { console.log(e.name); }
let b = 2;

if (true) { var v = 1; let l = 2; }
console.log(v);          // 1 — var rò ra ngoài block
console.log(typeof l);   // "undefined" — l chết theo block`,
    trap: '<code>typeof x</code> với biến <b>chưa khai báo</b> trả về <code>&quot;undefined&quot;</code>, không ném lỗi. Nhưng nếu <code>x</code> khai báo bằng <code>let</code> ở dưới thì <code>typeof x</code> <b>vẫn ném ReferenceError</b> — ngoại lệ duy nhất của typeof.',
    tip: 'Nhấn rằng hoisting <b>không phải</b> "di chuyển code lên trên". Đó chỉ là hệ quả của việc engine tạo binding trước khi thực thi — <code>var</code> có giá trị khởi tạo, <code>let</code> thì chưa.',
  },
  {
    id: '03', level: 'junior', title: 'Coercion · == vs === · falsy',
    questions: [
      'Kể 7 giá trị falsy trong JavaScript?',
      'Vì sao [] == false nhưng if([]) lại chạy vào trong?',
    ],
    points: [
      '7 <b>falsy</b>: <code>false</code>, <code>0</code> (và <code>-0</code>), <code>0n</code>, <code>&#39;&#39;</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Còn lại truthy hết — kể cả <code>[]</code>, <code>{}</code>, <code>&#39;0&#39;</code>, <code>&#39;false&#39;</code>.',
      '<code>===</code> không ép kiểu. <code>==</code> khác type thì quy về number, object thì quy về primitive qua <code>valueOf</code>/<code>toString</code>; riêng <code>null</code> và <code>undefined</code> chỉ bằng nhau, không bằng gì khác.',
      'Vì sao <code>[] == false</code>: <code>false</code> → <code>0</code>, <code>[]</code> → <code>&#39;&#39;</code> → <code>0</code>, thành <code>0 == 0</code>. Còn <code>if ([])</code> là ToBoolean — mảng là object nên luôn truthy. Hai phép hoàn toàn khác nhau.',
      '<code>NaN !== NaN</code>. Kiểm tra bằng <code>Number.isNaN(x)</code> hoặc <code>Object.is(x, NaN)</code>. <code>Object.is</code> giống <code>===</code> trừ hai chỗ: <code>NaN</code> bằng <code>NaN</code>, và <code>+0</code> khác <code>-0</code>.',
      'Toán tử <code>+</code> mà có một vế là string thì <b>nối chuỗi</b>; <code>-</code>, <code>*</code>, <code>/</code> luôn ép về number. Nên <code>&#39;5&#39; + 3</code> ra <code>&#39;53&#39;</code> còn <code>&#39;5&#39; - 3</code> ra <code>2</code>.',
    ],
    code: `console.log('5' + 3);        // '53' — có string thì + là nối chuỗi
console.log('5' - 3);        // 2    — dấu trừ luôn ép về number

console.log([] == false);    // true — [] → '' → 0, false → 0
console.log('' == 0);        // true — '' cũng ép về 0
console.log(Boolean([]));    // true — mảng là object, luôn truthy

console.log(null == undefined);   // true
console.log(null == 0);           // ❌ false — null chỉ bằng undefined
console.log(null >= 0);           // ✅ true  — >= lại ép null thành 0

console.log(NaN === NaN);         // false
console.log(Number.isNaN(NaN));   // ✅ true
console.log(Object.is(+0, -0));   // false — Object.is phân biệt 0 âm`,
    trap: 'Ác nhất là chỗ này: <code>null == 0</code> là <b>false</b> nhưng <code>null &gt;= 0</code> là <b>true</b>. Vì <code>==</code> có luật riêng cho <code>null</code>/<code>undefined</code>, còn toán tử so sánh thì ép <code>null</code> về <code>0</code>.',
    tip: 'Luôn dùng <code>===</code>. Ngoại lệ được chấp nhận rộng rãi là <code>x == null</code> để bắt gọn cả hai. Và nếu muốn <code>0</code> hay <code>&#39;&#39;</code> vẫn đi qua thì dùng <code>??</code> chứ đừng dùng <code>||</code>.',
  },
  {
    id: '04', level: 'junior', title: 'Closure & private state',
    questions: [
      'Closure là gì, cho ví dụ bạn từng dùng thật?',
      'Vòng lặp với var in ra gì, vì sao, sửa thế nào?',
    ],
    points: [
      '<b>Closure</b> = hàm + môi trường lexical nơi nó được <b>định nghĩa</b>. Hàm nhớ scope lúc khai báo chứ không phải lúc gọi. Thực tế mọi hàm trong JS đều là closure.',
      'Biến bị closure giữ vẫn <b>sống</b> sau khi hàm cha đã return — đó chính là cách tạo <b>private state</b> mà bên ngoài không có đường chạm vào.',
      'Vòng lặp kinh điển: <code>var</code> chỉ có <b>một binding</b> dùng chung cho cả vòng lặp nên callback in ra giá trị cuối. <code>let</code> tạo <b>binding mới mỗi lần lặp</b> nên in đúng.',
      'Ứng dụng thật hay kể trong phỏng vấn: counter, hàm <code>once</code>, memoize giữ <code>cache</code>, debounce/throttle giữ <code>timer</code>, module pattern bằng IIFE, currying.',
      '<b>Rò rỉ bộ nhớ</b>: closure giữ tham chiếu tới cả scope chứ không riêng biến nó dùng, nên vô tình giữ sống DOM node hay mảng lớn. Quên <code>removeEventListener</code> là ca hay gặp.',
    ],
    code: `// ❌ var: một binding dùng chung → in 3, 3, 3
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);

// ✅ let: mỗi vòng lặp một binding riêng → in 0, 1, 2
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);

// private state: count không có đường nào chạm từ bên ngoài
function makeCounter() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}
const c = makeCounter();
c.inc(); c.inc();
console.log(c.count, c.get());   // undefined 2`,
    trap: 'Hỏi vặn: chỉ đổi <code>var</code> thành <code>let</code> sao lại đúng? Vì mỗi vòng lặp <code>let</code> tạo binding mới, callback đóng vào binding riêng của nó. Trước ES6 phải bọc IIFE để tự tạo scope.',
    tip: 'Đưa ví dụ nghề nghiệp thay vì định nghĩa suông: debounce giữ <code>timer</code>, memoize giữ <code>cache</code>, <code>once</code> giữ cờ <code>called</code>. Người phỏng vấn muốn nghe bạn đã dùng closure để giải quyết việc gì.',
  },
  {
    id: '05', level: 'mid', title: 'this · call/apply/bind · arrow',
    questions: [
      'Xác định this trong một hàm dựa vào cái gì?',
      'Vì sao truyền method làm callback thì mất this?',
    ],
    points: [
      '<code>this</code> xác định lúc <b>gọi</b>, không phải lúc khai báo. 4 quy tắc ưu tiên giảm dần: <code>new</code> → <code>call</code>/<code>apply</code>/<code>bind</code> → gọi qua object <code>o.f()</code> → gọi trơn.',
      'Gọi trơn: strict mode cho <code>this = undefined</code>, sloppy mode cho <code>globalThis</code>. Class body và ES module <b>luôn strict</b>, nên lỗi thường hiện ra dưới dạng <code>TypeError</code>.',
      '<b>Arrow không có this riêng</b> — nó lấy <code>this</code> của scope bao ngoài lúc định nghĩa. Vì thế <code>call</code>/<code>bind</code> không đổi được <code>this</code> của arrow.',
      'Tách <code>o.f</code> ra biến, hay truyền vào <code>setTimeout</code>/<code>addEventListener</code>, là mất luôn object gọi. Sửa bằng <code>f.bind(o)</code> hoặc bọc arrow <code>() =&gt; o.f()</code>.',
      '<code>call(o, a, b)</code> gọi ngay với danh sách tham số, <code>apply(o, [a, b])</code> gọi ngay với mảng, <code>bind(o)</code> <b>không gọi</b> mà trả về hàm mới đã khoá <code>this</code>.',
    ],
    code: `class Counter {
  n = 0;
  incBad() { this.n++; }          // method nằm trên prototype
  incOk = () => { this.n++; };    // class field arrow: this khoá vào c
}
const c = new Counter();
const bad = c.incBad, ok = c.incOk;

// ❌ tách khỏi object → this = undefined (class luôn strict)
try { bad(); } catch (e) { console.log(e.name); }   // TypeError

ok();                       // ✅ arrow giữ nguyên this
c.incBad.call(c);           // ✅ ép this bằng call
setTimeout(c.incBad.bind(c), 0);   // ✅ bind trả về hàm mới
console.log(c.n);           // 2 — sau timeout thành 3`,
    trap: 'Rất khó tìm: cùng một lỗi mất <code>this</code> mà hai nơi biểu hiện khác nhau. Trong class (strict) nó ném <code>TypeError</code> ngay; trong hàm thường sloppy mode <code>this</code> thành <code>globalThis</code> nên code <b>âm thầm</b> ghi biến toàn cục.',
    tip: 'Arrow không chỉ thiếu <code>this</code>: nó cũng không có <code>arguments</code>, không có <code>prototype</code>, không gọi được bằng <code>new</code>, và không làm generator được. Kể đủ danh sách này là điểm cộng rõ.',
  },
  {
    id: '06', level: 'mid', title: 'Prototype · kế thừa · class',
    questions: [
      'Prototype chain hoạt động như thế nào?',
      '__proto__ và prototype khác nhau chỗ nào?',
    ],
    points: [
      'Mỗi object có liên kết ẩn tới một object khác. Đọc thuộc tính mà không thấy thì đi tiếp lên trên cho tới khi gặp, hoặc chạm <code>null</code> là dừng. Đó là <b>prototype chain</b>.',
      '<code>prototype</code> là thuộc tính của <b>hàm constructor</b>, chứa object sẽ làm prototype cho instance. <code>__proto__</code> (chuẩn: <code>getPrototypeOf</code>) là <b>liên kết thật</b> của một object.',
      '<code>class</code> là <b>syntactic sugar</b> quanh function + prototype: method nằm trên <code>Class.prototype</code>, dùng chung cho mọi instance. Tạo 10.000 instance không nhân bản 10.000 hàm.',
      'Nhưng class <b>không chỉ</b> là đường cú pháp: thân class luôn strict, bắt buộc gọi bằng <code>new</code>, method không enumerable, và khai báo không dùng được trước khi chạy tới.',
      '<code>extends</code> nối chain; <code>super.m()</code> gọi method lớp cha; trong constructor phải <code>super()</code> trước khi đụng <code>this</code>. <code>instanceof</code> kiểm tra prototype có nằm trên chain không.',
    ],
    code: `class Animal {
  speak() { return 'noise'; }
}
class Dog extends Animal {
  speak() { return super.speak() + ' + woof'; }  // gọi lên lớp cha
}
const d = new Dog();

console.log(d.speak());                  // 'noise + woof'
console.log(d instanceof Animal);        // true — đi theo chain
console.log(Object.getPrototypeOf(d) === Dog.prototype);   // ✅ true
console.log(d.hasOwnProperty('speak'));  // ❌ false — của prototype
console.log(Dog.prototype.hasOwnProperty('speak'));        // ✅ true
// gắn prototype cho object mà không cần constructor:
const o = Object.create({ hi: () => 'hi' });`,
    trap: 'Hỏi vặn: gán <code>obj.__proto__</code> lúc chạy để "kế thừa động" được không? → Chạy được, nhưng V8 khuyến cáo <b>không</b> làm vậy. Cần đặt prototype thì dùng <code>Object.create</code> hoặc <code>setPrototypeOf</code> ngay lúc khởi tạo.',
    tip: 'Phân biệt rành mạch: dữ liệu riêng của từng instance gán trong <code>constructor</code> hoặc class field, còn hành vi dùng chung đặt trên <code>prototype</code>. Đó là lý do method không nên viết dưới dạng class field arrow nếu không cần khoá <code>this</code>.',
  },
  {
    id: '07', level: 'mid', title: 'Event loop · macrotask · microtask',
    questions: [
      'setTimeout(fn, 0) có chạy ngay lập tức không?',
      'Thứ tự in của setTimeout và Promise.then là gì?',
    ],
    points: [
      'JS chạy <b>một luồng</b> với một call stack. Việc bất đồng bộ do host (browser / Node) lo; xong thì callback được xếp vào <b>queue</b> chứ không chen ngang stack đang chạy.',
      'Vòng lặp: chạy hết call stack → <b>vét sạch microtask queue</b> → (browser) render một frame → lấy <b>đúng một</b> macrotask chạy → quay lại vét microtask.',
      '<b>Microtask</b>: <code>.then/.catch/.finally</code>, phần sau <code>await</code>, <code>queueMicrotask</code>, <code>MutationObserver</code>. <b>Macrotask</b>: <code>setTimeout</code>, <code>setInterval</code>, I/O, event handler.',
      'Microtask luôn chạy <b>trước</b> macrotask kế tiếp. Microtask sinh ra microtask mới phải chạy hết trong cùng lượt vét — đệ quy microtask sẽ treo tab, đệ quy <code>setTimeout</code> thì không.',
      '<code>setTimeout(fn, 0)</code> nghĩa là "xếp hàng sớm nhất có thể", không phải "chạy ngay": phải đợi stack rỗng và đợi microtask xong. Browser còn kẹp tối thiểu 4ms khi lồng quá 5 tầng.',
    ],
    code: `console.log('1');
setTimeout(() => console.log('2'), 0);            // macrotask
Promise.resolve().then(() => console.log('3'));   // microtask
queueMicrotask(() => console.log('4'));           // microtask

(async () => {
  console.log('5');     // thân async chạy ĐỒNG BỘ tới await đầu tiên
  await null;
  console.log('6');     // phần sau await = microtask
})();

console.log('7');

// ✅ Thứ tự in thật:  1  5  7  3  4  6  2
// ❌ Đáp án sai hay gặp: 1 5 7 2 3 4 6 (tưởng timeout 0 chạy trước)`,
    trap: 'Rất nhiều người nói <code>await</code> làm cả hàm thành bất đồng bộ từ dòng đầu. Sai — thân hàm <code>async</code> chạy <b>đồng bộ</b> tới <code>await</code> đầu tiên, phần còn lại mới thành microtask. Và <code>async</code> không tạo thread mới.',
    tip: 'Nếu ứng tuyển backend Node: mỗi phase của event loop Node đều vét microtask, <code>process.nextTick</code> có queue riêng chạy <b>trước cả</b> promise microtask, còn <code>setImmediate</code> nằm ở phase khác <code>setTimeout</code>.',
  },
  {
    id: '08', level: 'mid', title: 'Promise · async/await · xử lý lỗi',
    questions: [
      'Promise.all và allSettled khác nhau thế nào?',
      'Xử lý lỗi với async/await sao cho đúng?',
    ],
    points: [
      'Promise có 3 trạng thái: pending → fulfilled hoặc rejected. Chuyển <b>đúng một lần</b> rồi khoá vĩnh viễn. <code>then</code> luôn trả về promise mới nên chain được.',
      '<code>async</code> luôn trả về promise. <code>await</code> chỉ tạm dừng <b>hàm đó</b>, không chặn luồng chính. <code>try/catch</code> quanh <code>await</code> bắt được reject; thiếu <code>await</code> thì lỗi rơi ra ngoài <code>try</code>.',
      '<code>Promise.all</code> reject ngay khi <b>một</b> cái hỏng (fail-fast) — các cái còn lại vẫn chạy nhưng kết quả bị bỏ. <code>allSettled</code> luôn resolve, trả mảng <code>{status, value}</code>.',
      '<code>race</code> theo cái <b>xong trước</b>, kể cả khi cái đó reject. <code>any</code> lấy cái <b>fulfilled</b> đầu tiên, hỏng hết mới ném <code>AggregateError</code>.',
      'Tuần tự vs song song: <code>await a(); await b();</code> chạy nối tiếp. Hai việc độc lập thì gom vào <code>Promise.all</code> để chạy cùng lúc — đây là câu hỏi tối ưu rất hay bị hỏi.',
    ],
    code: `// ❌ tuần tự: 200ms, dù hai việc chẳng liên quan gì nhau
const u1 = await getUser();
const p1 = await getPosts();

// ✅ song song: 100ms
const [u2, p2] = await Promise.all([getUser(), getPosts()]);

// ❌ thiếu await → reject lọt ra ngoài, thành unhandled rejection
try { run(); } catch (e) { console.log('không bắt được'); }

// ✅ có await thì reject mới rơi đúng vào catch
try { await run(); } catch (e) { console.log(e.message); }

const rs = await Promise.allSettled([getUser(), getPosts()]);
console.log(rs.map(r => r.status));   // ['fulfilled', 'rejected']`,
    trap: 'Sai lầm phổ biến nhất: <code>arr.forEach(async ...)</code>. <code>forEach</code> không đợi promise nên hàm chạy tiếp ngay, lỗi bên trong thành unhandled rejection. Phải dùng <code>for...of</code> + <code>await</code>, hoặc <code>Promise.all(arr.map(f))</code>.',
    tip: 'Promise bị reject mà không ai <code>catch</code> → Node hiện tại mặc định <b>kill process</b>, browser thì log <code>unhandledrejection</code>. Luôn đóng chain bằng <code>catch</code>, và bắt sự kiện toàn cục để log lại những ca lọt lưới.',
  },
  {
    id: '09', level: 'mid', title: 'Debounce vs Throttle',
    questions: [
      'Debounce và throttle khác nhau ở chỗ nào?',
      'Search box gõ liên tục thì nên dùng cái nào?',
    ],
    points: [
      '<b>Debounce</b>: dồn nhiều lần gọi thành <b>một</b>, chỉ chạy sau khi đã <b>im lặng</b> đủ <code>delay</code>. Gõ liên tục thì không chạy lần nào cho tới lúc ngừng gõ.',
      '<b>Throttle</b>: cho chạy <b>tối đa một lần mỗi khoảng</b>, gọi bao nhiêu cũng vậy. Kéo scroll 10 giây với <code>gap = 200ms</code> thì chạy khoảng 50 lần, đều đặn.',
      'Chọn theo câu hỏi: "có cần phản hồi <b>trong lúc</b> đang diễn ra không?" Cần → throttle (scroll, resize, mousemove). Chỉ cần <b>kết quả cuối</b> → debounce (search box, autosave).',
      '<code>leading</code> = chạy ngay ở lần gọi đầu, <code>trailing</code> = chạy thêm lần cuối sau khi ngừng. Debounce mặc định trailing; throttle thường bật cả hai để không mất sự kiện cuối.',
      'Luôn trả về hàm <code>cancel</code> và gọi nó khi unmount hoặc rời trang. Timer còn treo sẽ chạy trên component đã chết và giữ closure không cho GC thu hồi.',
    ],
    code: `function debounce(fn, delay = 300) {
  let t;
  const run = (...a) => {
    clearTimeout(t);  t = setTimeout(() => fn(...a), delay);
  };
  run.cancel = () => clearTimeout(t);      // nhớ gọi khi unmount
  return run;                              // im lặng đủ delay mới chạy
}
function throttle(fn, gap = 300) {
  let last = 0;
  return (...a) => {
    if (Date.now() - last < gap) return;   // ✅ tối đa 1 lần mỗi gap
    last = Date.now(); fn(...a);
  };
}`,
    trap: 'Lỗi kinh điển: tạo hàm debounce <b>bên trong</b> render hoặc bên trong handler. Mỗi lần gọi là một closure mới với <code>t</code> riêng, <code>clearTimeout</code> chẳng huỷ được gì và hàm vẫn chạy đủ số lần. Phải tạo <b>một lần duy nhất</b>.',
    tip: 'Với search box nên ghép debounce cùng <code>AbortController</code>: debounce giảm số request, abort chặn response cũ về muộn ghi đè lên kết quả mới. Thiếu vế thứ hai vẫn còn race condition.',
  },
  {
    id: '10', level: 'mid', title: 'ES Module · CommonJS · tree-shaking',
    questions: [
      'Vì sao ESM tree-shake được còn CommonJS thì không?',
      'import và require khác nhau ở những điểm nào?',
    ],
    points: [
      '<code>import</code>/<code>export</code> là <b>tĩnh</b>: phải ở top-level, tên xác định lúc compile. <code>require</code> là <b>lời gọi hàm</b> chạy lúc runtime, đường dẫn còn ghép chuỗi được.',
      'Vì tĩnh nên bundler dựng được đồ thị phụ thuộc và <b>cắt bỏ export không ai dùng</b> (tree-shaking). Với CJS, <code>exports</code> là object thường, sửa được lúc chạy nên bundler không dám cắt.',
      'ESM dùng <b>live binding</b>: biến import trỏ tới ô nhớ trong module gốc, giá trị đổi thì bên import thấy ngay. <code>require</code> thì <b>copy giá trị</b> tại thời điểm gọi.',
      'ESM luôn strict, được phân giải trước khi chạy, load bất đồng bộ, có top-level <code>await</code>. CJS load đồng bộ, có <code>__dirname</code> và <code>module.exports</code>.',
      '<code>import()</code> động trả về promise → code-splitting, nạp theo route. Circular dependency: ESM chịu được vì binding phân giải trước (có thể dính TDZ), CJS trả về <code>exports</code> dang dở.',
    ],
    code: `// m.mjs
export let count = 0;
export function inc() { count++; }

// main.mjs — live binding: biến import trỏ vào ô nhớ của module gốc
import { count, inc } from './m.mjs';
console.log(count);     // 0
inc();
console.log(count);     // ✅ 1 — thấy ngay giá trị mới

// CommonJS: destructuring copy giá trị ngay lúc require
const { count: c, inc: i } = require('./m.cjs');
i();
console.log(c);         // ❌ 0 — c là bản copy, không bao giờ đổi
const heavy = await import('./heavy.mjs');   // dynamic, tách bundle`,
    trap: 'Tình huống thực chiến: <code>import</code> được <b>hoisted</b> — mọi module phụ thuộc chạy xong trước dòng code đầu tiên của file. Nên đặt một lệnh cấu hình kiểu <code>dotenv.config()</code> phía trên các <code>import</code> sẽ <b>không ăn</b>; với <code>require</code> thì lại ăn.',
    tip: 'Tree-shaking chỉ thực sự hiệu quả khi package khai báo <code>"sideEffects": false</code> và ship kèm bản ESM. Import cả namespace bằng <code>import * as _</code>, hoặc dùng package chỉ có bản CJS, là bundle phình ngay.',
  },
];
