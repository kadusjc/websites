(function () {
  'use strict';
  var WA = '5518997127070';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var fmt = function (n, d) { return n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  function abrirWA(msg) { window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener'); }

  /* ---------- cabeçalho e menu ---------- */
  var hd = $('#hd'), nav = $('#nav'), mb = $('.mb');
  function rolou() { hd.classList.toggle('solido', scrollY > 40 || nav.classList.contains('aberto')); }
  addEventListener('scroll', rolou, { passive: true }); rolou();
  function menu(abre) {
    nav.classList.toggle('aberto', abre);
    mb.setAttribute('aria-expanded', abre);
    mb.setAttribute('aria-label', abre ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('trava', abre);
    document.body.classList.toggle('menu', abre);
    document.body.classList.toggle('menu', abre);
    rolou();
  }
  mb.addEventListener('click', function () { menu(!nav.classList.contains('aberto')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('aberto')) { menu(false); mb.focus(); } });
  addEventListener('resize', function () { if (innerWidth > 980 && nav.classList.contains('aberto')) menu(false); });

  /* link ativo no menu conforme a seção visível */
  if ('IntersectionObserver' in window) {
    var links = $$('#nav a');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) io.observe(s); });
  }

  /* ---------- dados de aço (massa nominal NBR 7480) ---------- */
  var BIT = [
    { d: 4.2, pol: '', ca: 'CA-60', kg: 0.109, uso: 'Estribos pequenos e telas' },
    { d: 5.0, pol: '3/16"', ca: 'CA-60', kg: 0.154, uso: 'Estribos de vigas e pilares' },
    { d: 6.3, pol: '1/4"', ca: 'CA-50', kg: 0.245, uso: 'Estribos e lajes' },
    { d: 8.0, pol: '5/16"', ca: 'CA-50', kg: 0.395, uso: 'Vigas e pilares de casas' },
    { d: 10.0, pol: '3/8"', ca: 'CA-50', kg: 0.617, uso: 'Vigas, pilares e sapatas' },
    { d: 12.5, pol: '1/2"', ca: 'CA-50', kg: 0.963, uso: 'Peças com mais carga' },
    { d: 16.0, pol: '5/8"', ca: 'CA-50', kg: 1.578, uso: 'Estruturas maiores' },
    { d: 20.0, pol: '3/4"', ca: 'CA-50', kg: 2.466, uso: 'Conforme projeto' },
    { d: 25.0, pol: '1"', ca: 'CA-50', kg: 3.853, uso: 'Conforme projeto' }
  ];
  var mm = function (d) { return fmt(d, 1) + ' mm'; };

  /* tabela de bolso */
  $('#tb-bit').innerHTML = BIT.map(function (b) {
    return '<tr><th scope="row">' + mm(b.d) + '</th><td>' + (b.pol ? b.pol.replace('"', '”') : '–') + '</td><td>' + b.ca +
      '</td><td>' + fmt(b.kg, 3) + '</td><td>' + fmt(b.kg * 12, 2) + ' kg</td><td>' + b.uso + '</td></tr>';
  }).join('');

  /* ---------- calculadora ---------- */
  var box = $('#bitolas');
  box.innerHTML = BIT.map(function (b, i) {
    return '<label><input type="radio" name="bit" value="' + i + '"' + (b.d === 8 ? ' checked' : '') + '><span><b>' +
      fmt(b.d, 1) + '</b><small>' + (b.pol ? b.pol.replace('"', '”') : b.ca) + '</small></span></label>';
  }).join('');
  var inComp = $('#comp'), inQtd = $('#qtd');
  var atual = null;

  function num(v) { return parseFloat(String(v).replace(',', '.')); }
  function calcular() {
    var b = BIT[+$('input[name=bit]:checked').value];
    var L = num(inComp.value), q = Math.round(num(inQtd.value));
    var ok = L > 0 && L <= 12 && q > 0;
    if (!ok) {
      $('#r-kg').textContent = '–'; $('#r-m').textContent = '–'; $('#r-b').textContent = '–';
      $('#r-txt').textContent = 'Use um comprimento entre 0,10 e 12 m e pelo menos 1 peça.';
      $('#b12').innerHTML = ''; $('#r-sobra').textContent = ''; atual = null; return;
    }
    var m = L * q, kg = m * b.kg;
    var porBarra = Math.floor(12 / L + 1e-9);
    var barras = Math.ceil(q / porBarra);
    var sobra = 12 - porBarra * L;
    var sobraTotal = barras * 12 - m;
    $('#r-kg').textContent = fmt(kg, kg < 100 ? 1 : 0);
    $('#r-m').textContent = fmt(m, m < 100 ? 2 : 0) + ' m';
    $('#r-b').textContent = fmt(barras);
    $('#r-ca').textContent = b.ca;
    $('#r-txt').textContent = 'Cada barra de 12 m dá ' + porBarra + (porBarra === 1 ? ' peça' : ' peças') + ' de ' + fmt(L, 2) + ' m.';
    var seg = '', n = Math.min(porBarra, 120);
    for (var i = 0; i < n; i++) seg += '<i style="flex:' + L + '"></i>';
    if (sobra > 0.005) seg += '<s style="flex:' + sobra + '"></s>';
    $('#b12').innerHTML = seg;
    $('#r-sobra').textContent = sobraTotal > 0.01
      ? 'Cortando na obra, sobrariam cerca de ' + fmt(sobraTotal, 2) + ' m de ponta (' + fmt(sobraTotal * b.kg, 1) + ' kg).'
      : 'Corte sem sobra: as peças fecham certinho nas barras.';
    atual = { d: b.d, ca: b.ca, L: L, q: q, kg: kg };
  }
  box.addEventListener('change', calcular);
  inComp.addEventListener('input', calcular);
  inQtd.addEventListener('input', calcular);
  $$('[data-q]').forEach(function (bt) {
    bt.addEventListener('click', function () {
      var v = Math.max(1, (Math.round(num(inQtd.value)) || 0) + +bt.dataset.q);
      inQtd.value = v; calcular();
    });
  });
  calcular();

  /* ---------- lista de ferros ---------- */
  var CHAVE = 'fumiya-lista';
  var lista = { itens: [], nome: '', rec: 'Retirar na loja', end: '', obs: '' };
  try { var salvo = JSON.parse(localStorage.getItem(CHAVE)); if (salvo && salvo.itens) lista = Object.assign(lista, salvo); } catch (e) {}
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) {} }
  function descr(it) { return it.q + (it.q === 1 ? ' peça' : ' peças') + ' de ' + fmt(it.L, 2) + ' m, Ø ' + mm(it.d) + ' ' + it.ca; }

  var fab = $('#lista-fab'), painel = $('#lista');
  function desenhar() {
    var n = lista.itens.length, kg = 0;
    $('#itens').innerHTML = lista.itens.map(function (it, i) {
      kg += it.kg;
      return '<li><b>Ø ' + mm(it.d) + ' ' + it.ca + '</b><small>' + it.q + ' × ' + fmt(it.L, 2) + ' m, ' + fmt(it.kg, 1) +
        ' kg</small><button type="button" data-rm="' + i + '" aria-label="Remover ' + descr(it) + '">Remover</button></li>';
    }).join('');
    $('#vazio').hidden = n > 0;
    $('#lista-kg').textContent = fmt(kg, 1) + ' kg';
    $('#lista-n').textContent = n;
    fab.hidden = n === 0;
  }
  $('#itens').addEventListener('click', function (e) {
    var i = e.target.getAttribute('data-rm');
    if (i === null) return;
    lista.itens.splice(+i, 1); salvar(); desenhar();
    if (!lista.itens.length) $('#l-nome').focus();
  });

  var toastT;
  function toast(t) {
    var el = $('#toast'); el.textContent = t; el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2600);
  }
  $('#add').addEventListener('click', function () {
    if (!atual) { toast('Confira o comprimento e a quantidade antes de adicionar.'); return; }
    lista.itens.push(atual); salvar(); desenhar();
    fab.classList.remove('pulsa'); void fab.offsetWidth; fab.classList.add('pulsa');
    toast('Adicionado: ' + descr(atual) + '.');
  });

  /* campos do pedido */
  var lNome = $('#l-nome'), lEnd = $('#l-end'), lObs = $('#l-obs');
  lNome.value = lista.nome; lEnd.value = lista.end; lObs.value = lista.obs;
  $$('input[name=rec]').forEach(function (r) { r.checked = r.value === lista.rec; });
  function mostraEnd() { $$('.end').forEach(function (el) { el.hidden = lista.rec !== 'Entrega na obra'; }); }
  mostraEnd();
  painel.addEventListener('input', function (e) {
    if (e.target === lNome) lista.nome = lNome.value;
    else if (e.target === lEnd) lista.end = lEnd.value;
    else if (e.target === lObs) lista.obs = lObs.value;
    else if (e.target.name === 'rec') { lista.rec = e.target.value; mostraEnd(); }
    salvar();
  });
  $('#enviar').addEventListener('click', function () {
    if (!lista.itens.length && !lista.obs.trim()) { toast('Adicione pelo menos um item ou escreva nas observações.'); return; }
    var kg = lista.itens.reduce(function (s, it) { return s + it.kg; }, 0);
    var msg = 'Olá, Fumiya! ' + (lista.nome.trim() ? 'Meu nome é ' + lista.nome.trim() + '. ' : '') + 'Quero orçamento desta lista de ferros:\n\n';
    lista.itens.forEach(function (it) { msg += '• ' + descr(it) + '\n'; });
    if (lista.itens.length) msg += '\nPeso estimado: ' + fmt(kg, 1) + ' kg\n';
    if (lista.obs.trim()) msg += '\nObservações: ' + lista.obs.trim() + '\n';
    msg += '\n' + lista.rec + (lista.rec === 'Entrega na obra' && lista.end.trim() ? ': ' + lista.end.trim() : '') + '.';
    abrirWA(msg);
  });
  $('#limpar').addEventListener('click', function () {
    lista.itens = []; lista.obs = ''; lObs.value = ''; salvar(); desenhar(); toast('Lista esvaziada.');
  });

  /* ---------- painéis (lista e privacidade) ---------- */
  var origem = null;
  function abrir(p, de) {
    origem = de || document.activeElement;
    $$('.painel').forEach(function (o) { o.hidden = true; });
    p.hidden = false; document.body.classList.add('trava');
    var foco = p.querySelector('.x'); if (foco) foco.focus();
  }
  function fechar(p) {
    p.hidden = true; document.body.classList.remove('trava');
    if (origem && origem.focus) origem.focus();
  }
  fab.addEventListener('click', function () { abrir(painel, fab); });
  $$('[data-abre]').forEach(function (b) { b.addEventListener('click', function () { abrir($('#' + b.dataset.abre), b); }); });
  $$('.painel').forEach(function (p) {
    p.addEventListener('click', function (e) { if (e.target === p || e.target.hasAttribute('data-fecha')) fechar(p); });
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fechar(p);
      if (e.key !== 'Tab') return;
      var f = $$('a[href],button:not([hidden]),input:not([hidden]),textarea,select', p).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  });

  /* ---------- formulário de contato ---------- */
  $('#f').addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('#n').value.trim();
    $('#n-erro').hidden = !!nome;
    if (!nome) { $('#n').focus(); return; }
    var msg = 'Olá! Meu nome é ' + nome + '. Preciso de: ' + $('#p').value + '.';
    var extra = $('#m').value.trim();
    if (extra) msg += ' Detalhes: ' + extra;
    abrirWA(msg);
  });

  desenhar();
  $('#y').textContent = new Date().getFullYear();
})();
