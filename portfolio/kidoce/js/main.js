(function () {
  'use strict';
  var WA = '551239238589';
  var KEY = 'kidoce-lista';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Horário ao vivo (fuso de São Paulo) ---------- */
  // 0=domingo ... 6=sábado; minutos desde 00:00
  var HOURS = { 1: [480, 1080], 2: [480, 1080], 3: [480, 1080], 4: [480, 1080], 5: [480, 1080], 6: [480, 825] };
  var DAY = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  function nowSP() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
      return { d: wd, m: Number(o.hour) * 60 + Number(o.minute) };
    } catch (e) { var n = new Date(); return { d: n.getDay(), m: n.getHours() * 60 + n.getMinutes() }; }
  }
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60; return h + 'h' + (mm ? String(mm).padStart(2, '0') : ''); }
  function updateStatus() {
    var t = nowSP(), el = $('[data-status]'), txt = $('[data-status-text]');
    var today = HOURS[t.d], msg, open = false;
    if (today && t.m >= today[0] && t.m < today[1]) {
      open = true; msg = 'Aberto agora · fecha às ' + fmt(today[1]);
    } else if (today && t.m < today[0]) {
      msg = 'Fechado agora · abre hoje às ' + fmt(today[0]);
    } else {
      var d = t.d, i = 0;
      do { d = (d + 1) % 7; i++; } while (!HOURS[d] && i < 7);
      msg = 'Fechado agora · abre ' + (i === 1 ? 'amanhã' : DAY[d]) + ' às ' + fmt(HOURS[d][0]);
    }
    if (el && txt) { txt.textContent = msg; el.classList.toggle('is-open', open); el.classList.toggle('is-closed', !open); }
    $$('#hours li').forEach(function (li) {
      li.classList.toggle('is-today', li.dataset.days.split(',').indexOf(String(t.d)) > -1);
    });
  }
  updateStatus(); setInterval(updateStatus, 60000);

  /* ---------- Menu mobile ---------- */
  var btn = $('.menu-btn'), nav = $('#menu');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
    $('use', btn).setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------- Lista (carrinho) ---------- */
  var state = { items: [], name: '', note: '' };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && saved.items) state = saved; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'); }
  function find(id) { for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) return state.items[i]; return null; }
  function addItem(name, qty, unit, step, replace) {
    var id = slug(name), it = find(id);
    if (it) { it.qty = replace ? qty : it.qty + qty; }
    else state.items.push({ id: id, name: name, qty: qty, unit: unit || '', step: step || 1 });
    save(); render();
  }
  function qtyLabel(it) {
    if (!it.unit) return it.qty + 'x';
    var q = it.unit === 'kg' ? String(it.qty).replace('.', ',') : it.qty;
    return q + ' ' + it.unit;
  }
  function message() {
    var lines = ['Olá, Ki Doce! Montei minha lista pelo site:', ''];
    state.items.forEach(function (it) {
      lines.push(it.unit ? '• ' + it.name + ': ' + qtyLabel(it) : '• ' + it.qty + 'x ' + it.name);
    });
    if (state.note.trim()) { lines.push('', 'Observações: ' + state.note.trim()); }
    if (state.name.trim()) { lines.push('', 'Nome: ' + state.name.trim()); }
    lines.push('', 'Vou retirar na loja. Pode confirmar disponibilidade e valores?');
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
  }
  function render() {
    var list = $('#cart-list'), count = state.items.length;
    list.innerHTML = '';
    state.items.forEach(function (it) {
      var li = document.createElement('li');
      li.innerHTML =
        '<span class="cart-name"></span>' +
        '<span class="qty"><button type="button" data-dec aria-label="Diminuir"><svg class="ico"><use href="#i-minus"/></svg></button>' +
        '<output></output>' +
        '<button type="button" data-inc aria-label="Aumentar"><svg class="ico"><use href="#i-plus"/></svg></button></span>';
      $('.cart-name', li).textContent = it.name;
      $('output', li).textContent = it.unit ? qtyLabel(it) : it.qty;
      $('[data-dec]', li).addEventListener('click', function () {
        it.qty = Math.round((it.qty - it.step) * 10) / 10;
        if (it.qty <= 0) state.items = state.items.filter(function (x) { return x !== it; });
        save(); render();
      });
      $('[data-inc]', li).addEventListener('click', function () {
        it.qty = Math.round((it.qty + it.step) * 10) / 10; save(); render();
      });
      list.appendChild(li);
    });
    $('#cart-empty').hidden = count > 0;
    $('#cart-count').textContent = count;
    $$('[data-count]').forEach(function (c) { c.textContent = count; });
    $('#cart-bar').hidden = count === 0;
    var send = $('#cart-send');
    send.href = count ? message() : '#';
    send.setAttribute('aria-disabled', count ? 'false' : 'true');
    send.style.opacity = count ? '' : '.5';
    $$('.add').forEach(function (b) {
      var inList = !!find(slug(b.dataset.add));
      b.classList.toggle('is-in', inList);
      b.lastChild.textContent = inList ? ' Na lista (+1)' : ' Adicionar';
    });
  }
  $('#cart-name').value = state.name || '';
  $('#cart-note').value = state.note || '';
  $('#cart-name').addEventListener('input', function (e) { state.name = e.target.value; save(); $('#cart-send').href = message(); });
  $('#cart-note').addEventListener('input', function (e) { state.note = e.target.value; save(); $('#cart-send').href = message(); });
  $('#cart-send').addEventListener('click', function (e) { if (!state.items.length) { e.preventDefault(); toast('Adicione algum item à lista primeiro'); } });
  $('#cart-clear').addEventListener('click', function () {
    state = { items: [], name: '', note: '' }; $('#cart-name').value = ''; $('#cart-note').value = '';
    try { localStorage.removeItem(KEY); } catch (e) {}
    render(); toast('Lista esvaziada');
  });
  $$('.add').forEach(function (b) {
    b.addEventListener('click', function () { addItem(b.dataset.add, 1); toast(b.dataset.add + ' na lista'); });
  });

  /* ---------- Gavetas e modal ---------- */
  var lastFocus;
  function openDlg(id) {
    var d = document.getElementById(id); if (!d) return;
    lastFocus = document.activeElement; d.hidden = false; document.body.style.overflow = 'hidden';
    var f = $('.icon-btn', d); if (f) f.focus();
  }
  function closeDlg(d) {
    d.hidden = true;
    if (!$$('.drawer').some(function (x) { return !x.hidden; })) document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openDlg(b.dataset.open); }); });
  $$('.drawer').forEach(function (d) {
    $$('[data-close]', d).forEach(function (c) { c.addEventListener('click', function () { closeDlg(d); }); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = $$('.drawer').filter(function (x) { return !x.hidden; }).pop();
    if (open) closeDlg(open); else if (nav && nav.classList.contains('open')) setMenu(false);
  });

  /* ---------- Filtros de produtos ---------- */
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('.chip').forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
      c.classList.add('is-on'); c.setAttribute('aria-pressed', 'true');
      var f = c.dataset.filter;
      $$('#pgrid .pcard').forEach(function (p) { p.hidden = !(f === 'todos' || p.dataset.cat === f); });
    });
  });

  /* ---------- Calculadora de festa ---------- */
  var n = 30, range = $('#calc-range');
  function up(x, s) { return Math.ceil(x / s) * s; }
  function calcItems() {
    return [
      { name: 'Forminhas para docinhos', qty: up(n * 6, 50), unit: 'un.', step: 50 },
      { name: 'Balas e gelatinas', qty: Math.max(0.5, up(n * 0.05, 0.5)), unit: 'kg', step: 0.5 },
      { name: 'Copos descartáveis', qty: up(n * 3, 50), unit: 'un.', step: 50 },
      { name: 'Pratinhos e garfinhos', qty: up(n * 2, 50), unit: 'un.', step: 50 },
      { name: 'Sacolinhas de lembrancinha', qty: up(n, 10), unit: 'un.', step: 10 }
    ];
  }
  function renderCalc() {
    $('#calc-n').textContent = n; range.value = n;
    $$('[data-calc-n]').forEach(function (e) { e.textContent = n; });
    var ul = $('#calc-list'); ul.innerHTML = '';
    calcItems().forEach(function (it) {
      var li = document.createElement('li');
      li.innerHTML = '<span></span><strong></strong>';
      li.firstChild.textContent = it.name;
      li.lastChild.textContent = qtyLabel(it);
      ul.appendChild(li);
    });
  }
  $$('[data-calc]').forEach(function (b) {
    b.addEventListener('click', function () { n = Math.min(200, Math.max(10, n + Number(b.dataset.calc))); renderCalc(); });
  });
  range.addEventListener('input', function () { n = Number(range.value); renderCalc(); });
  $('#calc-add').addEventListener('click', function () {
    calcItems().forEach(function (it) { addItem(it.name, it.qty, it.unit, it.step, true); });
    if (!/convidados/.test(state.note)) {
      state.note = (state.note ? state.note + '\n' : '') + 'Festa para ' + n + ' convidados.';
      $('#cart-note').value = state.note; save(); render();
    }
    toast('Itens da festa adicionados à lista');
    openDlg('cart');
  });

  renderCalc();
  render();
})();
