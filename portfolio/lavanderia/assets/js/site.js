/* =========================================================================
   Lavanderia Central Barueri — comportamento do site
   Sem jQuery, sem bibliotecas. ~2 KB.
   ========================================================================= */
(function () {
  'use strict';

  /* --- Menu mobile ------------------------------------------------------ */
  var botao = document.getElementById('alternar-menu');
  var nav = document.getElementById('nav-principal');

  if (botao && nav) {
    botao.addEventListener('click', function () {
      var aberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', String(!aberto));
      botao.setAttribute('aria-label', aberto ? 'Abrir menu de navegação' : 'Fechar menu de navegação');
      nav.classList.toggle('aberto', !aberto);
      document.body.style.overflow = !aberto ? 'hidden' : '';
    });

    // fecha ao navegar ou ao apertar Esc
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) fecharMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('aberto')) {
        fecharMenu();
        botao.focus();
      }
    });
    // volta ao normal se a janela crescer com o menu aberto
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1040) fecharMenu();
    });
  }

  function fecharMenu() {
    if (!nav || !botao) return;
    nav.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu de navegação');
    document.body.style.overflow = '';
  }

  /* --- Mega-menu de serviços -------------------------------------------- */
  /* O item "Serviços" é um botão: abre e fecha o painel, nunca navega. */
  var botaoSub = document.querySelector('.botao-submenu');
  var itemSub = botaoSub && botaoSub.closest('.tem-submenu');

  var tempoFechar = null;
  var ATRASO_FECHAR = 320; // dá tempo de atravessar o vão até o painel

  if (botaoSub && itemSub) {
    var ehDesktop = function () {
      return window.innerWidth > 1100 && window.matchMedia('(hover: hover)').matches;
    };

    botaoSub.addEventListener('click', function (e) {
      e.stopPropagation();
      cancelarFechamento();
      alternarSubmenu(!itemSub.classList.contains('aberto'));
    });

    /* Intenção de hover.
       O painel é filho do cabeçalho no DOM, mas fica desenhado abaixo dele.
       Por isso observamos a entrada/saída do CABEÇALHO inteiro, e não do
       item <li>: assim o vão entre o botão e o painel nunca conta como
       "saiu do menu", e o painel não foge do ponteiro. */
    botaoSub.addEventListener('mouseenter', function () {
      if (!ehDesktop()) return;
      cancelarFechamento();
      alternarSubmenu(true);
    });

    var cab = cabecalhoEl();
    if (cab) {
      cab.addEventListener('mouseenter', cancelarFechamento);
      cab.addEventListener('mouseleave', function () {
        if (ehDesktop()) agendarFechamento();
      });
    }

    // sair do cabeçalho pela lateral, direto para o corpo da página, fecha
    document.addEventListener('mousemove', function (e) {
      if (!ehDesktop() || !itemSub.classList.contains('aberto')) return;
      if (!cab || cab.contains(e.target)) return;
      agendarFechamento();
    }, { passive: true });

    // teclado: abre ao focar, fecha ao sair do conjunto
    itemSub.addEventListener('focusin', function () {
      cancelarFechamento();
      if (ehDesktop()) alternarSubmenu(true);
    });
    itemSub.addEventListener('focusout', function (e) {
      if (!itemSub.contains(e.relatedTarget)) alternarSubmenu(false);
    });

    document.addEventListener('click', function (e) {
      if (itemSub.classList.contains('aberto') && !itemSub.contains(e.target)) {
        alternarSubmenu(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && itemSub.classList.contains('aberto')) {
        alternarSubmenu(false);
        botaoSub.focus();
      }
    });

    itemSub.addEventListener('click', function (e) {
      if (e.target.closest('.submenu a')) alternarSubmenu(false);
    });

    window.addEventListener('resize', function () { alternarSubmenu(false); });
  }

  function cabecalhoEl() { return document.querySelector('.cabecalho'); }

  function agendarFechamento() {
    cancelarFechamento();
    tempoFechar = setTimeout(function () { alternarSubmenu(false); }, ATRASO_FECHAR);
  }

  function cancelarFechamento() {
    if (tempoFechar) { clearTimeout(tempoFechar); tempoFechar = null; }
  }

  function alternarSubmenu(abrir) {
    if (!itemSub || !botaoSub) return;
    itemSub.classList.toggle('aberto', abrir);
    botaoSub.setAttribute('aria-expanded', String(abrir));
  }

  /* --- Sombra no cabeçalho ao rolar ------------------------------------- */
  var cabecalho = document.querySelector('.cabecalho');
  if (cabecalho) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        cabecalho.classList.toggle('rolado', window.scrollY > 12);
        ticking = false;
      });
    }, { passive: true });
  }

  /* --- Revelação progressiva de blocos ---------------------------------- */
  var alvos = document.querySelectorAll('.revelar');
  if (alvos.length && 'IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var filhos = entrada.target.children;
        for (var i = 0; i < filhos.length; i++) {
          filhos[i].style.transitionDelay = Math.min(i * 70, 420) + 'ms';
        }
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    alvos.forEach(function (alvo) { observador.observe(alvo); });
  } else {
    alvos.forEach(function (alvo) { alvo.classList.add('visivel'); });
  }

  /* --- Conversão do Google Ads nos cliques de WhatsApp ------------------ */
  /* Mantém o evento de conversão AW-639183653 que já existia no site antigo,
     agora aplicado automaticamente a todo link marcado com [data-conversao]. */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-conversao]');
    if (!link || typeof window.gtag !== 'function') return;
    window.gtag('event', 'conversion', {
      send_to: 'AW-639183653/844qCIfHoLcDEKXW5LAC',
    });
  });

  /* --- Um <details> aberto por vez dentro de cada FAQ ------------------- */
  document.querySelectorAll('.faq').forEach(function (faq) {
    faq.addEventListener('toggle', function (e) {
      var alvo = e.target;
      if (alvo.tagName !== 'DETAILS' || !alvo.open) return;
      faq.querySelectorAll('details[open]').forEach(function (d) {
        if (d !== alvo) d.open = false;
      });
    }, true);
  });
})();
