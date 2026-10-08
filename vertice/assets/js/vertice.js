(function(){
  'use strict';
  var WA = '5534999927666';

  /* ---------- origem da visita ----------
     Guarda os UTMs da primeira página aberta na sessão. Sem isso o lead
     chega no WhatsApp sem dizer de qual campanha veio, e não dá para
     saber quanto custou. Fica em sessionStorage porque o clique no
     anúncio traz o UTM só na primeira URL — daí em diante ele some. */
  var ORIGEM = (function(){
    var CHAVE = 'vertice:origem';
    try{
      var q = new URLSearchParams(location.search), achou = {};
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid']
        .forEach(function(k){ if(q.get(k)) achou[k] = q.get(k); });
      if(Object.keys(achou).length){
        if(!achou.utm_source && achou.gclid)  achou.utm_source = 'google';
        if(!achou.utm_source && achou.fbclid) achou.utm_source = 'meta';
        sessionStorage.setItem(CHAVE, JSON.stringify(achou));
        return achou;
      }
      var salvo = sessionStorage.getItem(CHAVE);
      if(salvo) return JSON.parse(salvo);
      if(document.referrer && document.referrer.indexOf(location.host) === -1){
        return {utm_source: new URL(document.referrer).hostname, utm_medium: 'referral'};
      }
    }catch(_){}
    return {};
  })();

  function resumoOrigem(){
    var p = [];
    if(ORIGEM.utm_source)   p.push(ORIGEM.utm_source);
    if(ORIGEM.utm_medium)   p.push(ORIGEM.utm_medium);
    if(ORIGEM.utm_campaign) p.push(ORIGEM.utm_campaign);
    return p.join(' / ');
  }

  /* ---------- medição de conversão ----------
     Envia o evento para o Google Analytics / Google Ads se a tag existir,
     e não faz nada se não existir. Para ativar, cole a tag do gtag.js no
     <head> — os eventos já saem prontos daqui.

     Usa gtag OU dataLayer, nunca os dois: com GTM instalado encaminhando
     para o GA4, mandar nos dois canais contava cada conversão duas vezes.

     Eventos:
       clique_whatsapp — só cliques que abrem mesmo uma conversa (wa.me)
       clique_cta      — botão interno que leva para o formulário/contato
       ligar           — clique no telefone
       gerar_lead      — formulário enviado (a conversão que vale) */
  function track(evento, dados){
    var d = Object.assign({}, ORIGEM, dados || {});
    if(typeof window.gtag === 'function') window.gtag('event', evento, d);
    else (window.dataLayer = window.dataLayer || []).push(Object.assign({event: evento}, d));
  }

  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-cta]');
    if(!el) return;
    var href = el.getAttribute('href') || '';
    var evento = href.indexOf('wa.me') > -1 ? 'clique_whatsapp'
               : href.indexOf('tel:')  === 0 ? 'ligar'
               : 'clique_cta';
    track(evento, {origem: el.getAttribute('data-cta'), destino: href});
  });

  /* Carimba a origem e o botão de saída em cada link do WhatsApp. Sem isso
     a conversa chega sem dizer de onde veio, e não dá para saber qual
     campanha (ou qual botão) pagou por ela. */
  (function(){
    var selo = resumoOrigem();
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="wa.me/"]'), function(a){
      if(a.closest('.form-ok')) return;            /* o de resgate é montado no envio */
      var de = a.getAttribute('data-cta');
      var rodape = (de ? 'botão: ' + de : '') + (selo ? (de ? ' · ' : '') + 'origem: ' + selo : '');
      if(!rodape) return;
      try{
        var u = new URL(a.href);
        var t = u.searchParams.get('text') || 'Olá! Vim pelo site da Vértice e gostaria de um orçamento de paisagismo.';
        u.searchParams.set('text', t + '\n\n(' + rodape + ')');
        a.href = u.toString();
      }catch(_){}
    });
  })();

  /* ---------- header sólido ao rolar + barra mobile ---------- */
  var hdr = document.getElementById('hdr'), mbar = document.getElementById('mbar'), ticking = false;
  function onScroll(){
    var y = window.scrollY;
    if(hdr)  hdr.classList.toggle('solid', y > 24);
    if(mbar) mbar.classList.toggle('show', y > 520);
    ticking = false;
  }
  addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  onScroll();

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById('burger'), mnav = document.getElementById('mnav');
  if(burger && mnav){
  burger.addEventListener('click', function(){
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
    mnav.classList.toggle('open', !open);
  });
  mnav.addEventListener('click', function(e){
    if(e.target.closest('a')){
      mnav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    }
  });
  }

  /* ---------- reveal on scroll ---------- */
  var revs = document.querySelectorAll('.rev');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.05});
    revs.forEach(function(el){ io.observe(el); });
    /* rede de segurança: nada pode ficar invisível por causa da animação */
    setTimeout(function(){ revs.forEach(function(el){ el.classList.add('in'); }); }, 2600);
  } else {
    revs.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- antes & depois ---------- */
  var ba = document.getElementById('ba');
  if(ba){
    var after = document.getElementById('ba-after'),
        handle = document.getElementById('ba-handle'),
        range = document.getElementById('ba-range');
    function setBA(v){
      v = Math.max(0, Math.min(100, v));
      after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
      handle.style.left = v + '%';
    }
    range.addEventListener('input', function(){ setBA(+range.value); });
    function fromEvent(e){
      var r = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      var v = (x / r.width) * 100;
      range.value = v; setBA(v);
    }
    var dragging = false;
    ba.addEventListener('pointerdown', function(e){ dragging = true; fromEvent(e); ba.setPointerCapture(e.pointerId); });
    ba.addEventListener('pointermove', function(e){ if(dragging) fromEvent(e); });
    ba.addEventListener('pointerup', function(){ dragging = false; });
    ba.addEventListener('pointercancel', function(){ dragging = false; });
    setBA(50);
  }

  /* ---------- galeria + lightbox ---------- */
  var figs = Array.prototype.slice.call(document.querySelectorAll('#gal figure'));
  var lb = document.getElementById('lb'), lbImg = document.getElementById('lb-img'), lbCap = document.getElementById('lb-cap');
  var idx = 0, lastFocus = null;
  if(lb && figs.length){
  function show(i){
    idx = (i + figs.length) % figs.length;
    var f = figs[idx], img = f.querySelector('img'), cap = f.querySelector('figcaption');
    /* data-full carrega a variante grande só quando a lightbox abre —
       a galeria em si continua servindo miniaturas leves */
    lbImg.src = f.getAttribute('data-full') || img.currentSrc || img.src;
    lbImg.alt = img.getAttribute('alt') || '';
    lbCap.textContent = cap ? cap.textContent : '';
  }
  function openLb(i){
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
  }
  function closeLb(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  figs.forEach(function(f, i){
    f.addEventListener('click', function(){ openLb(i); });
    f.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLb(i); } });
  });
  document.getElementById('lb-close').addEventListener('click', closeLb);
  document.getElementById('lb-prev').addEventListener('click', function(){ show(idx - 1); });
  document.getElementById('lb-next').addEventListener('click', function(){ show(idx + 1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
  addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLb();
    if(e.key === 'ArrowLeft') show(idx - 1);
    if(e.key === 'ArrowRight') show(idx + 1);
    /* prende o Tab dentro da lightbox enquanto ela está aberta */
    if(e.key === 'Tab'){
      var f = lb.querySelectorAll('button'),
          first = f[0], last = f[f.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });
  }

  /* ---------- máscara de telefone ---------- */
  var fone = document.getElementById('fone');
  if(fone) fone.addEventListener('input', function(){
    var d = fone.value.replace(/\D/g, '').slice(0, 11), out = '';
    if(d.length) out = '(' + d.slice(0, 2);
    if(d.length >= 3) out += ') ' + d.slice(2, d.length > 10 ? 7 : 6);
    if(d.length > 6) out += '-' + (d.length > 10 ? d.slice(7) : d.slice(6));
    fone.value = out;
  });

  /* ---------- envio: monta a mensagem e abre o WhatsApp ---------- */
  var form = document.getElementById('lead'), ok = document.getElementById('form-ok');
  function markErr(id, bad){
    var w = document.getElementById(id);
    if(w) w.classList.toggle('err', bad);
    return !bad;
  }
  if(form) form.addEventListener('submit', function(e){
    e.preventDefault();

    /* honeypot: robô preenche tudo, inclusive o campo escondido.
       Fingimos sucesso e não abrimos nada. */
    if(form['site-url'] && form['site-url'].value){ ok.classList.add('show'); return; }

    var nome = form.nome.value.trim(),
        tel  = form.fone.value.replace(/\D/g, ''),
        cid  = form.cidade.value.trim(),
        tipo = form.tipo.value,
        svc  = form.svc.value,
        obs  = form.obs.value.trim();

    var valid = true;
    valid = markErr('f-nome',  nome.length < 2) && valid;
    valid = markErr('f-fone',  tel.length < 10) && valid;
    valid = markErr('f-cidade',cid.length < 2)  && valid;
    valid = markErr('f-tipo',  !tipo)           && valid;
    valid = markErr('f-svc',   !svc)            && valid;
    if(!valid){
      var first = form.querySelector('.err input, .err select');
      if(first) first.focus();
      return;
    }

    var origem = resumoOrigem();
    var msg = 'Olá! Vim pelo site da Vértice.\n\n'
            + 'Nome: ' + nome + '\n'
            + 'WhatsApp: ' + form.fone.value + '\n'
            + 'Cidade: ' + cid + '\n'
            + 'Tipo de espaço: ' + tipo + '\n'
            + 'Preciso de: ' + svc
            + (obs ? '\n\nDetalhes: ' + obs : '')
            + (origem ? '\n\n(origem: ' + origem + ')' : '');

    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);

    track('gerar_lead', {origem:'formulario', tipo_espaco:tipo, servico:svc, cidade:cid});

    /* O link de resgate recebe a mensagem já montada ANTES de tentar abrir.
       Navegador embutido do Instagram costuma bloquear window.open — sem
       isso o cliente via "Pronto!", achava que tinha enviado, e o lead
       sumia sem deixar registro. */
    var resgate = ok.querySelector('a');
    if(resgate) resgate.href = url;
    ok.classList.add('show');

    var aba = window.open(url, '_blank', 'noopener');
    if(!aba || aba.closed || typeof aba.closed === 'undefined'){
      /* bloqueado: avisa de verdade em vez de fingir que deu certo */
      ok.classList.add('bloqueado');
      track('whatsapp_bloqueado', {origem:'formulario'});
    }
    if(resgate) resgate.focus();
  });
  if(form) form.addEventListener('input', function(e){
    var f = e.target.closest('.field');
    if(f) f.classList.remove('err');
  });

  var yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
})();
