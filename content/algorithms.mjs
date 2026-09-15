/**
 * Noi dung cum ALGORITHMS — Sua truc tiep file nay roi chay ./render.sh
 * Quy uoc: giai thich tieng Viet, giu nguyen thuat ngu tieng Anh.
 */

export const cover = {
  slug: 'algorithms',
  kicker: '( Cẩm nang )',
  title: 'Thuật Toán',
  sub: ['Toàn Tập ', { hl: 'Đầy Đủ' }],
  sub2: 'Từ Big-O đến Quy hoạch động',
  toc: [
    ['⏱️', 'Big-O & cách phân tích độ phức tạp', 'Junior'],
    ['↔️', 'Mảng · kỹ thuật two pointer', 'Junior'],
    ['🗺️', 'Hash map · đếm tần suất & nhóm', 'Junior'],
    ['🔤', 'Chuỗi · palindrome · anagram', 'Junior'],
    ['🪟', 'Sliding window · cửa sổ trượt', 'Mid'],
    ['🔀', 'Sorting & bẫy Array.sort của JS', 'Mid'],
    ['🔎', 'Binary search · tìm biên trái/phải', 'Mid'],
    ['🌲', 'Đệ quy · DFS · BFS · duyệt cây', 'Mid'],
    ['💾', 'Độ phức tạp bộ nhớ & call stack', 'Mid'],
    ['🧠', 'Quy hoạch động · memoization', 'Senior'],
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
  note: 'Thuật toán là <em>nhận dạng khuôn mẫu</em>, không phải học<br>thuộc. Nói độ phức tạp trước, gõ code sau. ♥',
};

export const cards = [
  {
    id: '01', level: 'junior', title: 'Big-O · cách phân tích độ phức tạp',
    questions: [
      'O(n log n) nghĩa là gì, bạn gặp nó ở đâu?',
      'includes đặt trong vòng for thì độ phức tạp bao nhiêu?',
    ],
    points: [
      '<b>Big-O</b> mô tả chi phí tăng thế nào khi <code>n</code> lớn. Bỏ hằng số và số hạng nhỏ: <code>3n + 100</code> vẫn là <b>O(n)</b>.',
      'Thang quen thuộc: <b>O(1)</b> tra Map · <b>O(log n)</b> binary search · <b>O(n)</b> quét một lượt · <b>O(n log n)</b> sort · <b>O(n²)</b> hai vòng lồng nhau.',
      'Vòng lặp <b>lồng nhau</b> thì <b>nhân</b> (n×n = O(n²)); vòng lặp <b>nối tiếp</b> thì <b>cộng</b>, mà cộng xong vẫn lấy số hạng lớn nhất: O(n)+O(n) = O(n).',
      '<b>Space complexity</b> chỉ đếm bộ nhớ <b>cấp phát thêm</b>, không tính mảng đầu vào. Đệ quy tốn O(chiều sâu) cho call stack dù không tạo mảng nào.',
      'Method mảng JS: <code>includes</code> · <code>indexOf</code> · <code>find</code> là <b>O(n)</b> · <code>sort</code> là <b>O(n log n)</b> · <code>push</code>/<code>pop</code> là O(1) · <code>shift</code>/<code>unshift</code> là <b>O(n)</b>.',
    ],
    code: `// ❌ O(n²): 2 vòng lồng nhau, n = 10.000 → ~50 triệu phép so sánh
function hasDup(a) {
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++)
      if (a[i] === a[j]) return true;
  return false;
}
// ✅ O(n) thời gian, đổi lại O(n) bộ nhớ — Set tra cứu O(1) trung bình
const hasDupFast = a => new Set(a).size !== a.length;
console.log(hasDup([1, 2, 3, 1]), hasDupFast([1, 2, 3, 1])); // true true

// ❌ includes là O(n); đặt trong vòng lặp → tổng O(n²)
const uniq = a => a.reduce((r, x) => r.includes(x) ? r : [...r, x], []);
// ✅ Set một lượt, O(n)
console.log(uniq([1, 2, 2]), [...new Set([1, 2, 2])]);`,
    trap: 'Bẫy đếm sai hay gặp nhất: “em quét mảng một lần nên O(n)”. Nhưng bên trong có <code>includes</code> hoặc <code>indexOf</code> — mỗi lần gọi đã quét lại cả mảng. Tổng thật là <b>O(n²)</b>. <code>[...r, x]</code> trong reduce cũng vậy.',
    tip: 'Phân biệt <b>trung bình</b> và <b>xấu nhất</b>: quicksort trung bình O(n log n) nhưng xấu nhất O(n²); tra Map trung bình O(1), xấu nhất O(n) khi hash đụng độ. Nói rõ mình đang nói trường hợp nào.',
  },
  {
    id: '02', level: 'junior', title: 'Mảng · kỹ thuật two pointer',
    questions: [
      'Two pointer dùng được khi nào?',
      'Two-sum trên mảng đã sắp xếp, làm sao tránh O(n²)?',
    ],
    points: [
      'Two pointer là hai chỉ số cùng chạy trên một mảng, thay cho hai vòng lặp lồng nhau. Hạ <b>O(n²)</b> xuống <b>O(n)</b> mà vẫn giữ <b>O(1)</b> bộ nhớ.',
      'Hai dạng: <b>hai đầu dồn vào giữa</b> (đảo mảng, palindrome, two-sum trên mảng đã sắp xếp) và <b>hai con trỏ cùng chiều</b> (loại trùng, tách chẵn lẻ tại chỗ).',
      'Điều kiện của kiểu dồn vào giữa: mảng phải <b>đã sắp xếp</b>. Tổng nhỏ hơn target → kéo <code>l</code> lên cho tổng tăng; lớn hơn → lùi <code>r</code>. Mỗi bước loại hẳn một biên.',
      'Loại trùng tại chỗ: con trỏ <b>chậm</b> giữ vị trí ghi, con trỏ <b>nhanh</b> quét; gặp giá trị mới thì ghi vào vị trí chậm rồi tăng. O(n) thời gian, O(1) bộ nhớ.',
      'Mảng chưa sắp xếp thì phải sort trước, mất <b>O(n log n)</b> — lúc đó hash map O(n) thường là lựa chọn tốt hơn.',
    ],
    code: `// Đảo mảng TẠI CHỖ — O(n) thời gian, O(1) bộ nhớ
const rev = a => { let l = 0, r = a.length - 1;
  while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; } return a; };
console.log(rev([1, 2, 3, 4]));                // [ 4, 3, 2, 1 ]

// Two-sum mảng ĐÃ SẮP XẾP — O(n), O(1) (brute force là O(n²))
function twoSumSorted(a, target) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === target) return [l, r];
    s < target ? l++ : r--;   // thiếu thì kéo trái, thừa thì lùi phải
  }
}
console.log(twoSumSorted([1, 3, 4, 6, 9], 7)); // [ 0, 3 ]`,
    trap: 'Bẫy kinh điển: đề two-sum yêu cầu trả về <b>index của mảng gốc</b>. Bạn sort để dùng two pointer thì index đã xáo trộn, trả ra sai hoàn toàn. Muốn sort thì phải mang index đi kèm, hoặc đổi sang hash map.',
    tip: 'Nói ra <b>invariant</b> của vòng lặp: “mọi cặp có tổng bằng target đều nằm trong đoạn <code>[l, r]</code>”, nên bỏ một biên là bỏ đúng những cặp chắc chắn sai. Chứng minh được điều này ăn điểm hơn hẳn đọc code.',
  },
  {
    id: '03', level: 'junior', title: 'Hash map · đếm tần suất & nhóm',
    questions: [
      'Giải two-sum trong O(n) như thế nào?',
      'Khi nào nên dùng Map thay cho Object thường?',
    ],
    points: [
      'Hash map đổi <b>bộ nhớ</b> lấy <b>tốc độ</b>: tốn thêm O(n) bộ nhớ để tra cứu O(1) trung bình, hạ rất nhiều bài từ O(n²) xuống O(n).',
      'Two-sum một lượt: vừa quét vừa lưu, mỗi phần tử hỏi “<b>số bù</b> <code>target - x</code> đã gặp chưa?”. Không cần sort nên <b>index gốc được giữ nguyên</b>.',
      'Đếm tần suất: <code>m.set(x, (m.get(x) ?? 0) + 1)</code>. Nhóm anagram: lấy chữ cái đã sắp xếp của từ làm <b>key</b> — <code>eat</code>, <code>tea</code>, <code>ate</code> cùng key <code>aet</code>.',
      'Dùng <b>Set</b> khi chỉ cần biết “có hay không”, <b>Map</b> khi cần gắn kèm giá trị. Cả hai <code>has</code>/<code>get</code>/<code>set</code> đều O(1) trung bình.',
      '<b>Map hơn Object</b> ở chỗ: key nhận mọi kiểu (không bị ép sang chuỗi), giữ đúng thứ tự chèn, có <code>size</code>, lặp trực tiếp được, và không dính key kế thừa.',
    ],
    code: `// two-sum mảng CHƯA sắp xếp — O(n) thời gian, O(n) bộ nhớ
function twoSum(nums, target) {
  const seen = new Map();                  // giá trị -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}
console.log(twoSum([2, 7, 11, 15], 9));    // [ 0, 1 ]

const o = {}; o[1] = 'số'; o['1'] = 'chuỗi';  // ❌ cùng MỘT key
console.log(o[1], Object.keys(o).length);     // chuỗi 1
const m = new Map([[1, 'số']]).set('1', 'chuỗi');
console.log(m.get(1), m.size);       // ✅ số 2 — Map tách thành 2 key`,
    trap: 'Bẫy Object: <code>o[1]</code> và <code>o["1"]</code> là <b>cùng một key</b> vì key của object luôn bị ép sang chuỗi — đếm số 1 và chuỗi "1" sẽ gộp làm một. Thêm nữa <code>"toString" in {}</code> trả về <b>true</b>, dễ đếm nhầm.',
    tip: 'Nhóm anagram tốn <b>O(n · k log k)</b> với k là độ dài từ, do phải sort từng từ. Nếu đề giới hạn 26 chữ cái thường, thay key sort bằng vector đếm 26 ô để hạ xuống <b>O(n · k)</b>.',
  },
  {
    id: '04', level: 'junior', title: 'Chuỗi · palindrome · anagram',
    questions: [
      'Kiểm tra hai chuỗi có phải anagram của nhau?',
      'Vì sao nối chuỗi trong vòng lặp hay bị chê?',
    ],
    points: [
      'Chuỗi trong JS <b>immutable</b>: không sửa được một ký tự tại chỗ. Mọi thao tác “đổi” đều tạo chuỗi mới, nên luôn tính thêm <b>O(n) bộ nhớ</b> cho kết quả.',
      'Đảo chuỗi: <code>[...s].reverse().join("")</code> — O(n). Dùng spread chứ đừng dùng <code>split("")</code>, vì spread tách theo code point nên emoji không bị vỡ.',
      'Palindrome: chuẩn hoá trước (thường hoá, bỏ ký tự không phải chữ/số), rồi <b>two pointer</b> từ hai đầu — O(n) thời gian và <b>O(1)</b> bộ nhớ nếu so sánh trực tiếp.',
      'Anagram: đúng khi <b>bảng tần suất ký tự</b> giống nhau — O(n) bằng một Map. Cách sort rồi so chuỗi cũng đúng nhưng chậm hơn: <b>O(n log n)</b>.',
      'Chuỗi con dài nhất không lặp ký tự là bài <b>sliding window</b> + Map lưu vị trí gần nhất — O(n) thời gian, O(k) bộ nhớ với k là số ký tự khác nhau.',
    ],
    code: `// Đảo chuỗi — O(n); chuỗi JS immutable nên bắt buộc tạo chuỗi mới
const rev = s => [...s].reverse().join('');
console.log(rev('algorithm'));                     // mhtirogla

// Palindrome: chuẩn hoá rồi two pointer — O(n) thời gian, O(1) bộ nhớ
function isPal(s, t = s.toLowerCase().replace(/[^a-z0-9]/g, '')) {
  for (let l = 0, r = t.length - 1; l < r; l++, r--)
    if (t[l] !== t[r]) return false;
  return true;
}
console.log(isPal('A man, a plan, a canal: Panama'));   // true

// Anagram: sắp xếp ký tự làm key — O(k log k) cho mỗi từ
const key = s => [...s].sort().join('');
console.log(key('listen') === key('silent'));      // true`,
    trap: 'Bẫy Unicode: <code>"👍".length</code> ra <b>2</b> chứ không phải 1, vì JS đếm theo UTF-16 code unit. <code>"👍".split("")</code> cắt emoji thành 2 surrogate rác, đảo xong là hỏng chữ. Dùng <code>[..."👍"]</code> mới đúng 1 phần tử.',
    tip: 'Về nối chuỗi trong vòng lặp: về mặt khái niệm mỗi lần <code>+=</code> tạo chuỗi mới nên là O(n²); thực tế V8 tối ưu bằng rope nên vẫn nhanh. Gom vào mảng rồi <code>join</code> một lần vẫn là cách an toàn và rõ ý hơn.',
  },
  {
    id: '05', level: 'mid', title: 'Sliding window · cửa sổ trượt',
    questions: [
      'Làm sao nhận ra một bài là sliding window?',
      'Hai vòng lặp lồng nhau mà vẫn O(n), vì sao?',
    ],
    points: [
      'Dấu hiệu nhận bài: đề nói về <b>đoạn con liên tiếp</b> (contiguous subarray/substring) kèm một điều kiện tối ưu — dài nhất, ngắn nhất, tổng lớn nhất.',
      '<b>Cửa sổ cố định</b> (biết trước k): trượt một bước = cộng phần tử mới bên phải, trừ phần tử vừa rời bên trái. <b>O(n)</b> thay vì O(n·k) như cách tính lại từ đầu.',
      '<b>Cửa sổ co giãn</b>: <code>right</code> luôn tiến để mở rộng; khi cửa sổ vi phạm điều kiện thì đẩy <code>left</code> lên cho tới khi hợp lệ trở lại.',
      'Vẫn là <b>O(n)</b> dù nhìn như hai vòng lồng nhau: mỗi con trỏ chỉ tiến, không lùi, tổng số bước tối đa 2n. Đây là <b>amortized analysis</b>.',
      'Bộ nhớ thường <b>O(1)</b> khi chỉ giữ một tổng, hoặc <b>O(k)</b> khi phải giữ bảng tần suất của các phần tử trong cửa sổ.',
    ],
    code: `// Cửa sổ CỐ ĐỊNH: tổng lớn nhất của k phần tử liên tiếp — O(n), O(1)
function maxSumK(a, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += a[i];
  let best = sum;
  for (let i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];            // thêm bên phải, bớt bên trái
    best = Math.max(best, sum);
  }
  return best;
}
console.log(maxSumK([2, 1, 5, 1, 3, 2], 3));   // 9

// ❌ tính lại tổng cho từng cửa sổ → O(n·k), làm thừa việc
// a.slice(i, i + k).reduce((x, y) => x + y, 0)`,
    trap: 'Câu vặn hay gặp: “có <code>while</code> lồng trong <code>for</code>, sao vẫn O(n)?” → vì <code>left</code> chỉ tiến, không bao giờ lùi. Tổng số lần dịch của cả hai con trỏ bị chặn bởi 2n, nên trung bình mỗi phần tử tốn chi phí hằng số.',
    tip: 'Phân biệt rõ với two pointer: sliding window luôn giữ một <b>đoạn liên tiếp</b> và quan tâm nội dung bên trong đoạn; two pointer kiểu hai đầu chỉ quan tâm cặp ở biên. Sliding window <b>không</b> đòi mảng đã sắp xếp.',
  },
  {
    id: '06', level: 'mid', title: 'Sorting · Binary search',
    questions: [
      '[10, 9, 1].sort() trả về gì?',
      'Binary search cần điều kiện gì mới dùng được?',
    ],
    points: [
      '<code>Array.prototype.sort</code> là <b>O(n log n)</b>. V8 cài bằng <b>TimSort</b>: ổn định (stable) và rất nhanh với dữ liệu đã gần sắp xếp.',
      'Nhớ nhanh: <b>merge sort</b> O(n log n) mọi trường hợp, tốn O(n) bộ nhớ, stable · <b>quicksort</b> trung bình O(n log n) nhưng xấu nhất <b>O(n²)</b> · bubble/insertion O(n²).',
      '<b>Binary search</b> chỉ đúng khi dữ liệu <b>đã sắp xếp</b>, hoặc rộng hơn là khi điều kiện có tính <b>đơn điệu</b>. Mỗi bước loại một nửa → <b>O(log n)</b>, O(1) bộ nhớ nếu viết bằng vòng lặp.',
      'Hai biến thể phải nhớ: <b>lower bound</b> = vị trí đầu tiên có giá trị ≥ x, <b>upper bound</b> = vị trí đầu tiên &gt; x. Hiệu hai cái chính là số lần x xuất hiện.',
      'Chỉ tìm <b>một</b> phần tử trong mảng chưa sắp xếp thì quét thẳng O(n) nhanh hơn là sort O(n log n) rồi mới binary search.',
    ],
    code: `// ❌ sort mặc định đổi phần tử sang CHUỖI rồi mới so sánh
console.log([10, 9, 1].sort());                // [ 1, 10, 9 ]
// ✅ với số phải truyền comparator
console.log([10, 9, 1].sort((a, b) => a - b)); // [ 1, 9, 10 ]

// Binary search tìm BIÊN TRÁI (vị trí đầu tiên >= x) — O(log n), O(1)
function lowerBound(a, x) {
  let lo = 0, hi = a.length;                   // hi là biên mở
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] < x) lo = mid + 1; else hi = mid;
  }
  return lo;
}
console.log(lowerBound([1, 2, 2, 2, 5], 2));   // 1`,
    trap: 'Bẫy số một của JS: <code>[10, 9, 1].sort()</code> ra <code>[1, 10, 9]</code>, vì mặc định sort đổi phần tử sang <b>chuỗi</b> rồi so theo UTF-16 — "10" đứng trước "9". Với số luôn phải truyền <code>(a, b) =&gt; a - b</code>.',
    tip: '<code>sort</code> sửa mảng <b>tại chỗ</b> và trả về chính mảng đó, không phải bản sao — muốn giữ bản gốc thì <code>[...a].sort()</code> hoặc <code>toSorted()</code> (ES2023). Nhắc đúng <code>toSorted</code> là điểm cộng.',
  },
  {
    id: '07', level: 'mid', title: 'Đệ quy · DFS · BFS · duyệt cây',
    questions: [
      'DFS và BFS khác nhau chỗ nào, khi nào chọn cái nào?',
      'Vì sao đệ quy sâu lại gây stack overflow?',
    ],
    points: [
      'Đệ quy cần đủ hai thứ: <b>base case</b> để thoát, và mỗi lần gọi phải <b>thu nhỏ bài toán</b>. Thiếu base case là <code>RangeError</code> — Maximum call stack size exceeded.',
      'Mỗi lần gọi đẩy một frame lên <b>call stack</b>. Node vỡ stack ở độ sâu cỡ chục nghìn. Cây lệch (skewed) sâu bằng số node → nên chuyển sang vòng lặp + stack thủ công.',
      '<b>DFS</b> dùng <b>stack</b> (<code>push</code>/<code>pop</code>), đi hết một nhánh mới quay lại. Bộ nhớ O(chiều cao cây). Hợp với: kiểm tra tồn tại đường đi, duyệt toàn bộ, backtracking.',
      '<b>BFS</b> dùng <b>queue</b>, quét xong tầng này mới sang tầng sau. Bộ nhớ O(bề rộng lớn nhất). Hợp với: <b>đường đi ngắn nhất</b> theo số bước, xử lý theo level.',
      'Duyệt cây nhị phân: <b>preorder</b> gốc-trái-phải · <b>inorder</b> trái-gốc-phải (với BST cho ra dãy <b>tăng dần</b>) · <b>postorder</b> trái-phải-gốc · <b>level order</b> chính là BFS.',
    ],
    code: `const T = { v: 1, k: [{ v: 2, k: [{ v: 4, k: [] }] }, { v: 3, k: [] }] };
// DFS = STACK, đi sâu trước — O(n) thời gian, O(chiều cao) bộ nhớ
function dfs(r, out = [], st = [r]) {
  while (st.length) {
    const n = st.pop(); out.push(n.v);
    for (let i = n.k.length - 1; i >= 0; i--) st.push(n.k[i]);
  }
  return out;
}
// BFS = QUEUE, quét từng tầng — O(n) thời gian, O(bề rộng) bộ nhớ
function bfs(r, out = [], q = [r]) {
  for (let i = 0; i < q.length; i++) out.push(q[i].v), q.push(...q[i].k);
  return out;
}
console.log(dfs(T).join(), bfs(T).join());   // 1,2,4,3  1,2,3,4`,
    trap: 'Bẫy hiệu năng ít người nói: viết BFS bằng <code>q.shift()</code>. <code>shift</code> phải dồn lại toàn bộ mảng nên là <b>O(n)</b>, biến BFS O(n) thành <b>O(n²)</b>. Thay bằng một con trỏ index chạy trên mảng, hoặc dùng deque.',
    tip: '<b>Tail call optimization</b> có trong chuẩn ES6 nhưng <b>V8 không cài</b> — nên trên Node và Chrome, viết đệ quy đuôi vẫn ăn call stack như thường. Biết chi tiết này cho thấy bạn đọc kỹ chứ không học thuộc.',
  },
  {
    id: '08', level: 'senior', title: 'Quy hoạch động · memoization',
    questions: [
      'Làm sao biết một bài nên giải bằng DP?',
      'Memoization và tabulation khác nhau ra sao?',
    ],
    points: [
      'Nhận diện DP qua hai dấu hiệu: <b>overlapping subproblems</b> (một bài con bị tính lại nhiều lần) và <b>optimal substructure</b> (lời giải tối ưu ghép từ lời giải tối ưu của bài con).',
      'Thiếu overlapping subproblems thì đó là <b>divide and conquer</b> (merge sort), không phải DP. Nếu chọn cục bộ luôn cho kết quả tối ưu thì dùng <b>greedy</b>, rẻ hơn nhiều.',
      '<b>Top-down (memoization)</b>: giữ nguyên đệ quy, thêm cache. Dễ viết, chỉ tính đúng những bài con thực sự cần, nhưng vẫn tốn call stack.',
      '<b>Bottom-up (tabulation)</b>: vòng lặp điền bảng từ base case đi lên. Không lo vỡ stack và thường nhanh hơn vì bỏ được chi phí gọi hàm.',
      'Leo cầu thang chính là Fibonacci: đệ quy trần <b>O(2^n)</b>, thêm memo còn <b>O(n)</b>. Vì mỗi bước chỉ cần 2 giá trị liền trước, bỏ mảng dp đi là còn <b>O(1) bộ nhớ</b>.',
    ],
    code: `// Leo cầu thang bottom-up, giữ 2 biến — O(n) thời gian, O(1) bộ nhớ
function climb(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;                        // f(1) = 1, f(2) = 2
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
// Coin change: ít xu nhất — O(amt · số loại xu), O(amt) bộ nhớ
function coinChange(coins, amt) {
  const dp = Array(amt + 1).fill(Infinity); dp[0] = 0;
  for (let i = 1; i <= amt; i++) for (const c of coins)
    if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
  return dp[amt] === Infinity ? -1 : dp[amt];
}
console.log(climb(10), coinChange([1, 5, 6, 9], 11));   // 89 2`,
    trap: 'Bẫy coin change: tham lam “lấy đồng lớn nhất trước” là <b>sai</b>. Với <code>coins = [1, 5, 6, 9]</code> và số tiền <b>11</b>, greedy ra 9+1+1 = 3 đồng, còn đáp án đúng là 5+6 = <b>2 đồng</b>. Greedy chỉ đúng với vài bộ mệnh giá đặc biệt.',
    tip: 'Trình bày DP theo đúng 4 bước: định nghĩa <b>trạng thái</b> (<code>dp[i]</code> nghĩa là gì) → <b>công thức truy hồi</b> → <b>base case</b> → <b>thứ tự duyệt</b>. Nói xong 4 bước rồi mới gõ code, người phỏng vấn theo được ngay.',
  },
];
