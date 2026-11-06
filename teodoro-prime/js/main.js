(function () {
  'use strict';
  var WA = window.WA_NUM || '5512981770381';
  var waLink = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };

  /* Cabeçalho sólido ao rolar */
  var header = document.querySelector('.site-header');
  var onScroll = function () { header.classList.toggle('is-solid', window.scrollY > 40); };
  if (header) { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); }

  /* Menu mobile */
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    var setMenu = function (open) {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    document.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }


  /* Imagens adiadas (slides 2 a 4): carregam depois que a página abriu */
  var hydrate = function (root) {
    (root || document).querySelectorAll('img[data-src]').forEach(function (im) {
      im.srcset = im.dataset.srcset; im.src = im.dataset.src;
      im.removeAttribute('data-src'); im.removeAttribute('data-srcset');
    });
  };
  var idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 1200); };
  if (document.readyState === 'complete') idle(function () { hydrate(); });
  else window.addEventListener('load', function () { idle(function () { hydrate(); }); });

  /* Mapa: troca a foto pelo Google Maps só quando a pessoa clica */
  document.querySelectorAll('.map-facade').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.createElement('iframe');
      f.title = 'Mapa: Teodoro Prime Garden';
      f.src = a.dataset.embed;
      f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      f.style.cssText = 'width:100%;height:100%;min-height:inherit;border:0;display:block';
      a.replaceWith(f);
    });
  });

  /* Carrossel principal */
  var car = document.querySelector('.carousel');
  if (car) {
    var slides = car.querySelectorAll('.slide');
    var dots = car.querySelectorAll('.carousel__dots button');
    var DUR = 6000, idx = 0, timer = null, paused = false;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    car.style.setProperty('--dur', DUR + 'ms');
    var go = function (n) {
      idx = (n + slides.length) % slides.length;
      hydrate(slides[idx]);
      slides.forEach(function (s, i) {
        var on = i === idx;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', !on);
        s.querySelectorAll('a, button').forEach(function (el) { on ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1'); });
      });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === idx); });
      restart();
    };
    var restart = function () {
      clearTimeout(timer);
      car.classList.remove('is-running');
      if (paused || reduce) return;
      void car.offsetWidth; /* reinicia a barra de progresso */
      car.classList.add('is-running');
      timer = setTimeout(function () { go(idx + 1); }, DUR);
    };
    car.querySelector('.carousel__next').addEventListener('click', function () { go(idx + 1); });
    car.querySelector('.carousel__prev').addEventListener('click', function () { go(idx - 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    car.addEventListener('mouseenter', function () { paused = true; restart(); });
    car.addEventListener('mouseleave', function () { paused = false; restart(); });
    car.addEventListener('focusin', function (e) { var fv = false; try { fv = e.target.matches(':focus-visible'); } catch (_) {} if (fv) { paused = true; restart(); } });
    car.addEventListener('focusout', function () { paused = false; restart(); });
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') go(idx + 1);
      if (e.key === 'ArrowLeft') go(idx - 1);
    });
    var x0 = null;
    car.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    car.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    document.addEventListener('visibilitychange', function () { paused = document.hidden; restart(); });
    go(0);
  }

  /* Ano no rodapé */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Carrossel de destaques */
  var rail = document.getElementById('rail');
  document.querySelectorAll('[data-rail]').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = rail.querySelector('.flower');
      var step = card ? card.getBoundingClientRect().width + 20 : 300;
      rail.scrollBy({ left: step * Number(b.dataset.rail), behavior: 'smooth' });
    });
  });

  /* Filtro do catálogo (com #categoria na URL) */
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    var products = document.querySelectorAll('.product');
    var apply = function (f) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.filter === f); });
      products.forEach(function (p) { p.hidden = !(f === 'todos' || p.dataset.cat === f); });
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        apply(c.dataset.filter);
        history.replaceState(null, '', c.dataset.filter === 'todos' ? location.pathname : '#' + c.dataset.filter);
      });
    });
    var fromHash = function () {
      var h = location.hash.slice(1);
      apply(document.querySelector('.chip[data-filter="' + h + '"]') ? h : 'todos');
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lastFocus;
    var close = function () { lb.classList.remove('is-open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
    document.querySelectorAll('[data-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var im = btn.querySelector('img');
        lastFocus = btn;
        document.getElementById('lb-img').src = im.currentSrc || im.src;
        document.getElementById('lb-img').alt = im.alt;
        document.getElementById('lb-title').textContent = btn.dataset.name;
        document.getElementById('lb-cat').textContent = btn.dataset.catLabel;
        document.getElementById('lb-wa').href = waLink('Olá! Vi no site: ' + btn.dataset.name + '. Tem disponível? Qual o valor?');
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lb.querySelector('.lightbox__close').focus();
      });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('is-open')) close(); });
  }

  /* Formulário → WhatsApp */
  var form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['nome', 'assunto'].forEach(function (n) {
        var el = form.elements[n];
        var bad = !el.value.trim();
        el.closest('.field').classList.toggle('invalid', bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;
      var v = function (n) { return form.elements[n].value.trim(); };
      var msg = 'Olá! Vim pelo site.\n\n*Nome:* ' + v('nome') +
        (v('cidade') ? '\n*Cidade:* ' + v('cidade') : '') +
        '\n*Assunto:* ' + v('assunto') +
        (v('mensagem') ? '\n*Mensagem:* ' + v('mensagem') : '');
      window.open(waLink(msg), '_blank', 'noopener');
    });
    form.querySelectorAll('input, select').forEach(function (el) {
      el.addEventListener('input', function () { el.closest('.field').classList.remove('invalid'); });
    });
  }
})();
