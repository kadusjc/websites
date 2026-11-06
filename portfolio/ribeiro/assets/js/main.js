/* Ribeiro Móveis e Colchões — interações da landing page (sem dependências) */
(() => {
  'use strict';
  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const WA = '5512988014039';

  /* ---------- Preloader ---------- */
  const finishLoad = () => {
    doc.classList.add('is-loaded');
    try { sessionStorage.setItem('rb-visited', '1'); } catch (e) {}
  };
  if (doc.classList.contains('skip-preload') || reduced) finishLoad();
  else setTimeout(finishLoad, 1250);

  /* ---------- Analytics (dataLayer para GA4 / GTM / Meta Pixel) ---------- */
  window.dataLayer = window.dataLayer || [];
  const track = (event, params = {}) => {
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === 'function') window.gtag('event', event, params);
    if (typeof window.fbq === 'function' && event === 'whatsapp_click') window.fbq('track', 'Contact');
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { location: el.dataset.loc || '' });
  });

  /* ---------- Header: estado ao rolar + esconder ao descer ---------- */
  const header = $('[data-header]');
  const waFloat = $('.wa-float');
  const actionbar = $('.actionbar');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    const menuOpen = doc.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > 500 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove('is-hidden');
    const show = y > innerHeight * 0.6;
    waFloat && waFloat.classList.toggle('is-visible', show);
    actionbar && actionbar.classList.toggle('is-visible', show);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (waFloat) setTimeout(() => { waFloat.classList.add('is-hinting'); setTimeout(() => waFloat.classList.remove('is-hinting'), 4000); }, 9000);

  /* ---------- Menu mobile ---------- */
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    doc.classList.toggle('menu-open', open);
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); document.body.style.overflow = 'hidden'; }
    else { menu.classList.remove('is-open'); document.body.style.overflow = ''; setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 700); }
  };
  $$('ol li', menu).forEach((li, i) => li.firstElementChild.style.setProperty('--i', i));
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && doc.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });

  /* ---------- Nav ativa conforme a seção ---------- */
  const current = location.pathname.split('/').pop();
  $$('.nav a, .menu a').forEach((a) => {
    if (current && a.getAttribute('href') === current) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); }
  });
  const navLinks = $$('.nav a').filter((a) => a.getAttribute('href').startsWith('#'));
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navIO.observe(s));

  /* ---------- Título do hero: palavras em cascata ---------- */
  $$('[data-split]').forEach((el) => {
    const walk = (node, out) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) out.appendChild(document.createTextNode(' '));
            else { const w = document.createElement('span'); w.className = 'split-w'; const i = document.createElement('span'); i.textContent = part; w.appendChild(i); out.appendChild(w); }
          });
        } else if (n.nodeType === 1) {
          const clone = n.cloneNode(false); walk(n, clone); out.appendChild(clone);
        }
      });
    };
    const frag = document.createDocumentFragment();
    walk(el, frag);
    el.textContent = '';
    el.appendChild(frag);
    $$('.split-w > span', el).forEach((s, i) => s.style.setProperty('--wd', `${0.08 + i * 0.07}s`));
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    setTimeout(() => el.classList.add('is-in'), doc.classList.contains('is-loaded') ? 50 : 900);
  });

  /* ---------- Revelações ao rolar ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal, .reveal-clip, .reveal-scale').forEach((el) => revealIO.observe(el));

  /* ---------- Contadores ---------- */
  const fmt = new Intl.NumberFormat('pt-BR');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      if (reduced) return;
      const t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
        el.textContent = fmt.format(v) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------- Parallax, manifesto e scroll horizontal (um único rAF) ---------- */
  const parallaxEls = reduced ? [] : $$('.parallax');
  const words = [];
  $$('[data-words]').forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    words.push(...$$('.w', el).map((w) => ({ w, host: el })));
  });
  const hs = $('[data-hscroll]');
  const track_ = hs && $('[data-htrack]', hs);
  const hprog = hs && $('[data-hprogress]', hs);
  const hsMQ = matchMedia('(min-width: 900px) and (min-height: 560px)');
  let hsOn = false, hsDist = 0;
  const setupHS = () => {
    if (!hs) return;
    hsOn = hsMQ.matches && !reduced;
    doc.classList.toggle('hs-enabled', hsOn);
    if (!hsOn) { hs.style.removeProperty('--hs-h'); track_.style.removeProperty('--hx'); return; }
    hsDist = Math.max(0, track_.scrollWidth - innerWidth);
    hs.style.setProperty('--hs-h', `${innerHeight + hsDist}px`);
  };
  if (hs) {
    setupHS();
    hsMQ.addEventListener('change', setupHS);
    addEventListener('resize', () => { clearTimeout(setupHS.t); setupHS.t = setTimeout(setupHS, 150); });
    addEventListener('load', setupHS);
    const vp = $('.showcase__viewport', hs);
    vp.addEventListener('scroll', () => { if (!hsOn) hprog.style.setProperty('--hp', (vp.scrollLeft / Math.max(1, vp.scrollWidth - vp.clientWidth)).toFixed(3)); }, { passive: true });
  }
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    parallaxEls.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      img.style.setProperty('--py', `${(p * -6).toFixed(2)}%`);
    });
    if (words.length) {
      const host = words[0].host.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.85 - host.top) / (host.height + vh * 0.35)));
      const lit = Math.round(p * words.length);
      words.forEach(({ w }, i) => w.classList.toggle('on', i < lit));
    }
    if (hsOn) {
      const r = hs.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, hsDist)));
      track_.style.setProperty('--hx', `${(-p * hsDist).toFixed(1)}px`);
      hprog.style.setProperty('--hp', p.toFixed(3));
    }
  };
  const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', requestFrame, { passive: true });
  addEventListener('resize', requestFrame);
  frame();

  /* ---------- Vídeos: carregar e tocar só quando visíveis ---------- */
  const loadVideo = (v) => {
    if (v.dataset.loaded) return;
    const src = v.dataset.src || (v.querySelector('source[data-src]') || {}).dataset?.src;
    if (!src) return;
    const s = v.querySelector('source[data-src]');
    if (s) { s.src = src; } else { v.src = src; }
    v.load();
    v.dataset.loaded = '1';
  };
  const saveData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  const vidIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) {
        if (saveData || reduced) return;
        loadVideo(v);
        const p = v.play(); if (p) p.catch(() => {});
      } else if (!v.paused) v.pause();
    });
  }, { threshold: 0.35 });
  const heroVideo = $('[data-hero-video]');
  if (heroVideo) addEventListener('load', () => vidIO.observe(heroVideo));
  $$('.reel video').forEach((v) => vidIO.observe(v));

  /* ---------- Trilho de vídeos: botões ---------- */
  const rail = $('[data-rail]');
  if (rail) {
    const by = (dir) => rail.scrollBy({ left: dir * Math.min(rail.clientWidth * 0.8, 640), behavior: reduced ? 'auto' : 'smooth' });
    $('[data-rail-prev]').addEventListener('click', () => by(-1));
    $('[data-rail-next]').addEventListener('click', () => by(1));
  }

  /* ---------- Abas de sofás (ARIA tabs) ---------- */
  $$('[data-tabs]').forEach((root) => {
    const tabs = $$('[role="tab"]', root);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = $('#' + t.getAttribute('aria-controls'));
        panel.hidden = !on; panel.classList.toggle('is-active', on);
      });
      $$('[data-panel-img]', root).forEach((f) => f.classList.toggle('is-active', f.dataset.panelImg === tab.dataset.tab));
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ---------- Hotspots do roupeiro ---------- */
  const hotspots = $$('.hotspot');
  hotspots.forEach((h) => {
    const tip = h.nextElementSibling;
    tip.style.setProperty('--x', h.style.getPropertyValue('--x'));
    tip.style.setProperty('--y', h.style.getPropertyValue('--y'));
    h.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = h.getAttribute('aria-expanded') !== 'true';
      hotspots.forEach((o) => o.setAttribute('aria-expanded', 'false'));
      h.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', () => hotspots.forEach((o) => o.setAttribute('aria-expanded', 'false')));

  /* ---------- Botões magnéticos ---------- */
  if (finePointer && !reduced) {
    $$('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- Lightbox (galeria + vídeos) ---------- */
  const lb = $('[data-lightbox]');
  const stage = $('[data-lb-stage]', lb);
  const cap = $('[data-lb-caption]', lb);
  const items = $$('[data-gallery] a');
  let idx = 0, lastFocus = null;
  const showImg = (i) => {
    idx = (i + items.length) % items.length;
    const a = items[idx];
    stage.innerHTML = '';
    const img = new Image();
    img.src = a.getAttribute('href');
    img.alt = a.querySelector('img').alt;
    stage.appendChild(img);
    cap.textContent = `${a.dataset.caption || ''} · ${idx + 1}/${items.length}`;
  };
  const openLB = () => { lastFocus = document.activeElement; lb.showModal(); document.body.style.overflow = 'hidden'; };
  const closeLB = () => { lb.close(); };
  lb.addEventListener('close', () => { stage.innerHTML = ''; lb.classList.remove('is-video'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); });
  items.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); lb.classList.remove('is-video'); showImg(i); openLB(); }));
  $('[data-lb-close]', lb).addEventListener('click', closeLB);
  $('[data-lb-prev]', lb).addEventListener('click', () => showImg(idx - 1));
  $('[data-lb-next]', lb).addEventListener('click', () => showImg(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target === stage) closeLB(); });
  lb.addEventListener('keydown', (e) => {
    if (lb.classList.contains('is-video')) return;
    if (e.key === 'ArrowRight') showImg(idx + 1);
    if (e.key === 'ArrowLeft') showImg(idx - 1);
  });
  let tx = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (tx === null || lb.classList.contains('is-video')) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) showImg(idx + (dx < 0 ? 1 : -1));
  });
  $$('[data-reel]').forEach((btn) => btn.addEventListener('click', () => {
    lb.classList.add('is-video');
    stage.innerHTML = '';
    const v = document.createElement('video');
    Object.assign(v, { src: btn.dataset.reel, controls: true, autoplay: true, loop: true, muted: true, playsInline: true });
    v.setAttribute('playsinline', '');
    stage.appendChild(v);
    cap.innerHTML = '';
    cap.append(btn.dataset.title || '');
    if (btn.dataset.ig) {
      const a = document.createElement('a');
      a.href = btn.dataset.ig; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Ver com áudio no Instagram';
      cap.appendChild(a);
    }
    openLB();
    track('video_open', { video: btn.dataset.title });
  }));

  /* ---------- Horário: aberto agora? (fuso de São Paulo) ---------- */
  const HOURS = { 0: null, 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19], 6: [9, 16] };
  const DAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const updateStatus = () => {
    let now;
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      now = { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), h: +get('hour') % 24 + +get('minute') / 60 };
    } catch (e) { const d = new Date(); now = { d: d.getDay(), h: d.getHours() + d.getMinutes() / 60 }; }
    const today = HOURS[now.d];
    const open = !!today && now.h >= today[0] && now.h < today[1];
    let text;
    if (open) text = `Aberto agora · até ${today[1]}h`;
    else {
      let d = now.d, label;
      if (today && now.h < today[0]) label = `hoje às ${today[0]}h`;
      else {
        for (let i = 1; i <= 7; i++) { d = (now.d + i) % 7; if (HOURS[d]) break; }
        label = (d === (now.d + 1) % 7 ? 'amanhã' : DAYS[d]) + ` às ${HOURS[d][0]}h`;
      }
      text = `Fechado · abre ${label}`;
    }
    $$('[data-open-status]').forEach((el) => {
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-closed', !open);
      el.lastElementChild.textContent = text;
    });
    const lbl = $('[data-open-label]');
    if (lbl) lbl.textContent = open ? `Aberto agora · até ${today[1]}h` : 'Seg a Sex 9h–19h';
    $$('tr[data-days]').forEach((tr) => tr.classList.toggle('is-today', tr.dataset.days.split(',').includes(String(now.d))));
  };
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Mapa sob demanda (performance + privacidade) ---------- */
  const mapBtn = $('[data-map-load]');
  const loadMap = () => {
    if (!mapBtn.isConnected) return;
    const f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=Ribeiro+M%C3%B3veis+e+Colch%C3%B5es,+Av.+Andr%C3%B4meda,+528+-+Jardim+Sat%C3%A9lite,+S%C3%A3o+Jos%C3%A9+dos+Campos+-+SP&z=16&output=embed';
    f.title = 'Mapa: Ribeiro Móveis e Colchões, Av. Andrômeda, 528, São José dos Campos';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.allowFullscreen = true;
    $('[data-map]').appendChild(f);
    mapBtn.remove();
  };
  if (mapBtn) {
    mapBtn.addEventListener('click', () => { loadMap(); track('map_open'); });
    const mapIO = new IntersectionObserver((en) => { if (en[0].isIntersecting) { loadMap(); mapIO.disconnect(); } }, { rootMargin: '300px 0px' });
    mapIO.observe($('[data-map]'));
  }

  /* ---------- Orçamento → WhatsApp ---------- */
  const form = $('[data-quote]');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const itens = fd.getAll('item');
    const nome = String(fd.get('nome') || '').trim();
    const local = String(fd.get('local') || '').trim();
    const err = $('[data-quote-error]');
    if (!itens.length || !nome) { err.hidden = false; (nome ? form.querySelector('input[name=item]') : form.nome).focus(); return; }
    err.hidden = true;
    const msg = [
      `Olá, Ribeiro Móveis! Meu nome é ${nome}.`,
      `Vim pelo site e tenho interesse em: ${itens.join(', ')}.`,
      local ? `Sou de: ${local}.` : '',
      `${fd.get('pref')}.`,
    ].filter(Boolean).join('\n');
    track('quote_submit', { items: itens.join('|') });
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Chegou até aqui sem erro: desliga o fallback do <head> que revela tudo */
  window.rbReady = true;
})();
