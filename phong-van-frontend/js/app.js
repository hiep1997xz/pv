/* ==========================================================================
   app.js — tương tác cho bộ phỏng vấn
   Tính năng: đổi theme, tìm kiếm, mở/đóng tất cả, tick "đã thuộc" (localStorage),
              vạch tiến độ, highlight mục lục theo vị trí cuộn
   Trang vẫn đọc được đầy đủ nếu JS bị tắt.
   ========================================================================== */
(function () {
  'use strict';

  var SET_ID     = document.body.getAttribute('data-set') || 'tong-hop';
  var STORE_KEY  = 'pv-fe-known-v1:' + SET_ID;   // tiến độ riêng cho từng bộ đề
  var THEME_KEY  = 'pv-fe-theme-v1';             // theme dùng chung mọi trang

  /* --- localStorage an toàn (private mode / chặn cookie có thể throw) ----- */
  var store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); }
      catch (e) { /* bỏ qua — tính năng lưu chỉ là tiện lợi */ }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); } catch (e) {}
    }
  };

  /* --- DOM refs ---------------------------------------------------------- */
  var cards       = Array.prototype.slice.call(document.querySelectorAll('.qa'));
  var searchInput = document.getElementById('searchInput');
  var toggleAllEl = document.getElementById('toggleAll');
  var themeBtn    = document.getElementById('themeBtn');
  var themeIcon   = document.getElementById('themeIcon');
  var resetBtn    = document.getElementById('resetBtn');
  var progressBar = document.getElementById('progressBar');
  var knownCountEl= document.getElementById('knownCount');
  var totalCountEl= document.getElementById('totalCount');
  var emptyState  = document.getElementById('emptyState');
  var sections    = Array.prototype.slice.call(document.querySelectorAll('.section'));
  var tocLinks    = Array.prototype.slice.call(document.querySelectorAll('.toc__list a'));

  /* ====================================================================== */
  /* 1. Theme sáng / tối                                                    */
  /* ====================================================================== */
  var ICONS = { light: '☀', dark: '☾', system: '◐' };

  function applyTheme(mode) {
    if (mode === 'light' || mode === 'dark') {
      document.documentElement.setAttribute('data-theme', mode);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (themeIcon) themeIcon.textContent = ICONS[mode] || ICONS.system;
  }

  var savedTheme = store.get(THEME_KEY, 'system');
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      // vòng: system → light → dark → system
      var order = ['system', 'light', 'dark'];
      var next  = order[(order.indexOf(savedTheme) + 1) % order.length];
      savedTheme = next;
      applyTheme(next);
      store.set(THEME_KEY, next);
    });
  }

  /* ====================================================================== */
  /* 2. Đánh dấu "đã thuộc"                                                 */
  /* ====================================================================== */
  var known = store.get(STORE_KEY, []);
  if (!Array.isArray(known)) known = [];

  function cardId(card) {
    var el = card.querySelector('.qa__id');
    return el ? el.textContent.trim() : '';
  }

  function refreshProgress() {
    var total = cards.length;
    var done  = cards.filter(function (c) { return c.classList.contains('is-known'); }).length;

    if (knownCountEl) knownCountEl.textContent = String(done);
    if (totalCountEl) totalCountEl.textContent = String(total);
    if (progressBar)  progressBar.style.width = total ? (done / total * 100) + '%' : '0';
  }

  function setKnown(card, isKnown) {
    var id = cardId(card);
    card.classList.toggle('is-known', isKnown);

    var btn = card.querySelector('.mark');
    if (btn) {
      btn.setAttribute('aria-pressed', isKnown ? 'true' : 'false');
      btn.lastChild.textContent = isKnown ? 'Đã thuộc ✓' : 'Đã thuộc';
    }

    var at = known.indexOf(id);
    if (isKnown && at === -1) known.push(id);
    if (!isKnown && at !== -1) known.splice(at, 1);

    store.set(STORE_KEY, known);
    refreshProgress();
  }

  cards.forEach(function (card) {
    var id  = cardId(card);
    var btn = card.querySelector('.mark');

    if (known.indexOf(id) !== -1) card.classList.add('is-known');

    if (btn) {
      btn.setAttribute('aria-pressed', card.classList.contains('is-known') ? 'true' : 'false');
      if (card.classList.contains('is-known')) btn.lastChild.textContent = 'Đã thuộc ✓';

      btn.addEventListener('click', function () {
        setKnown(card, !card.classList.contains('is-known'));
      });
    }
  });

  refreshProgress();

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      known = [];
      store.remove(STORE_KEY);
      cards.forEach(function (card) { setKnown(card, false); });
      refreshProgress();
    });
  }

  /* ====================================================================== */
  /* 3. Mở / đóng tất cả                                                    */
  /* ====================================================================== */
  var allOpen = false;

  function setAll(open) {
    allOpen = open;
    cards.forEach(function (card) {
      if (!card.hidden) card.open = open;
    });
    if (toggleAllEl) {
      var label = toggleAllEl.querySelector('.btn__label');
      if (label) label.textContent = open ? 'Đóng tất cả' : 'Mở tất cả';
    }
  }

  if (toggleAllEl) {
    toggleAllEl.addEventListener('click', function () { setAll(!allOpen); });
  }

  /* ====================================================================== */
  /* 4. Tìm kiếm                                                            */
  /* ====================================================================== */
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')  // bỏ dấu tiếng Việt để tìm "kien truc" ra "kiến trúc"
      .replace(/đ/g, 'd');
  }

  function runSearch(raw) {
    var term = normalize(raw.trim());
    var anyVisible = false;

    cards.forEach(function (card) {
      var hit = term === '' || normalize(card.textContent).indexOf(term) !== -1;
      card.hidden = !hit;
      if (hit) anyVisible = true;
      // đang tìm thì tự mở để thấy ngay chỗ khớp
      if (term !== '' && hit) card.open = true;
      if (term === '') card.open = allOpen;
    });

    // ẩn section không còn câu nào khớp (giữ lại section chữ thuần: s10, s11)
    sections.forEach(function (sec) {
      var secCards = Array.prototype.slice.call(sec.querySelectorAll('.qa'));
      if (secCards.length === 0) {
        sec.hidden = term !== '';          // phần văn bản chỉ ẩn khi đang tìm
        return;
      }
      sec.hidden = secCards.every(function (c) { return c.hidden; });
    });

    if (emptyState) emptyState.hidden = !(term !== '' && !anyVisible);
  }

  if (searchInput) {
    var timer = null;
    searchInput.addEventListener('input', function (e) {
      var value = e.target.value;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { runSearch(value); }, 120);
    });

    // Esc để xoá từ khoá
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        runSearch('');
      }
    });
  }

  /* ====================================================================== */
  /* 5. Highlight mục lục theo vị trí cuộn                                  */
  /* ====================================================================== */
  if ('IntersectionObserver' in window && tocLinks.length) {
    var linkFor = {};
    tocLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-80px 0px -65% 0px', threshold: 0 });

    sections.forEach(function (sec) { observer.observe(sec); });
  }

  /* ====================================================================== */
  /* 6. Phím tắt: "/" focus ô tìm kiếm                                      */
  /* ====================================================================== */
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing && searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  /* ====================================================================== */
  /* 7. Trang chủ: đổ tiến độ vào từng thẻ bộ đề                            */
  /* ====================================================================== */
  var setCards = Array.prototype.slice.call(document.querySelectorAll('.setcard[data-set]'));

  if (setCards.length) {
    var grandTotal = 0, grandDone = 0;

    setCards.forEach(function (card) {
      var id    = card.getAttribute('data-set');
      var total = parseInt(card.getAttribute('data-total'), 10) || 0;
      var list  = store.get('pv-fe-known-v1:' + id, []);
      var done  = Array.isArray(list) ? list.length : 0;
      if (done > total) done = total;

      grandTotal += total;
      grandDone  += done;

      var fill = card.querySelector('.setcard__fill');
      var stat = card.querySelector('.setcard__stat');
      if (fill) fill.style.width = total ? (done / total * 100) + '%' : '0';
      if (stat) stat.textContent = done + '/' + total + ' câu đã thuộc';
    });

    var oNum  = document.getElementById('overallNum');
    var oTxt  = document.getElementById('overallTxt');
    var oFill = document.getElementById('overallFill');
    var pct   = grandTotal ? Math.round(grandDone / grandTotal * 100) : 0;

    if (oNum)  oNum.textContent = pct + '%';
    if (oTxt)  oTxt.textContent = 'Bạn đã thuộc ' + grandDone + ' / ' + grandTotal +
                                 ' câu trên tổng ' + setCards.length + ' bộ đề.';
    if (oFill) oFill.style.width = pct + '%';
  }
})();
