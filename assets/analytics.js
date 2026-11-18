/* Tag do Google (GA4 G-3GDR6SCKG6) + Google Consent Mode v2 + aviso de cookies (LGPD)
   Arquivo único, usado por todas as páginas do site:
     <script src="/assets/analytics.js" defer></script>

   - Antes de carregar a tag, todo armazenamento de estatística e publicidade
     começa NEGADO (Consent Mode v2). Só é liberado quando o visitante clica em
     "Aceitar". A escolha fica salva no navegador (localStorage "fc-lgpd").
   - Eventos enviados direto ao GA4 (marque os dois primeiros como evento-chave):
       generate_lead   -> envio do briefing de orçamento (#brief)
       whatsapp_click  -> clique em qualquer link do WhatsApp
       phone_click     -> clique em link de telefone
       portfolio_open  -> abertura de uma proposta do portfólio
*/
(function () {
  var GTM_ID = 'GTM-N635HSF4'; // tag do Google ligada ao fluxo de dados do GA4
  var KEY = 'fc-lgpd';
  var VERSAO = 2; // aumente se mudar a política: o aviso volta a aparecer para todos

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function lerEscolha() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      return c && c.v === VERSAO ? c : null;
    } catch (e) { return null; }
  }
  function salvarEscolha(aceitou) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSAO, analytics: aceitou, at: new Date().toISOString() })); } catch (e) {}
  }

  var escolha = lerEscolha();
  var liberado = !!(escolha && escolha.analytics);

  // 1) Consentimento padrão (antes do GTM)
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: liberado ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);

  // 2) Tag do Google (mesmo código das "Instruções para instalação" do GA4)
  gtag('js', new Date());
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
  document.head.appendChild(s);

  function aplicar(aceitou) {
    salvarEscolha(aceitou);
    gtag('consent', 'update', { analytics_storage: aceitou ? 'granted' : 'denied' });
  }

  // 3) Aviso de cookies
  function montarAviso() {
    var aviso = document.getElementById('lgpd');
    if (!aviso) {
      // páginas de serviço: cria o aviso (o estilo está em /assets/servicos.css)
      aviso = document.createElement('div');
      aviso.className = 'lgpd';
      aviso.id = 'lgpd';
      aviso.setAttribute('role', 'region');
      aviso.setAttribute('aria-label', 'Aviso de privacidade e cookies');
      aviso.hidden = true;
      aviso.innerHTML =
        '<p><strong>Sua privacidade</strong>Usamos cookies de estatística (Google Analytics) só se você permitir, para entender quais páginas ajudam mais. Nada de publicidade. Saiba mais na <a href="/#privacidade">Política de Privacidade</a>.</p>' +
        '<div class="lgpd__row"><button class="btn btn-p" type="button" data-consent-ok>Aceitar</button><button class="btn btn-o" type="button" data-consent-no>Recusar</button></div>';
      document.body.appendChild(aviso);
    }
    function fechar() { aviso.hidden = true; }
    aviso.querySelectorAll('[data-consent-ok]').forEach(function (b) { b.addEventListener('click', function () { aplicar(true); fechar(); }); });
    aviso.querySelectorAll('[data-consent-no]').forEach(function (b) { b.addEventListener('click', function () { aplicar(false); fechar(); }); });
    // qualquer link/botão com data-cookie-prefs reabre o aviso
    document.querySelectorAll('[data-cookie-prefs]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); aviso.hidden = false; });
    });
    if (!escolha) setTimeout(function () { aviso.hidden = false; }, 900);
  }

  // 4) Eventos de conversão
  function rastrear() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var texto = (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 80);
      if (/wa\.me|whatsapp\.com/.test(href)) {
        gtag('event', 'whatsapp_click', { link_url: href.split('?')[0], link_text: texto });
      } else if (href.indexOf('tel:') === 0) {
        gtag('event', 'phone_click', { link_text: texto });
      } else if (href.indexOf('portfolio/') !== -1) {
        gtag('event', 'portfolio_open', { portfolio_item: a.getAttribute('data-n') || href });
      }
    }, true);
    var brief = document.getElementById('brief');
    if (brief) {
      brief.addEventListener('submit', function () {
        var tipo = brief.querySelector('input[name="tipo"]:checked');
        gtag('event', 'generate_lead', { lead_source: 'briefing_whatsapp', project_type: tipo ? tipo.value : '' });
      }, true);
    }
  }

  function iniciar() { montarAviso(); rastrear(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
