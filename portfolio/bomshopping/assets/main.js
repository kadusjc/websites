// Ajuste aqui os contatos reais
const WHATSAPP = '5512999999999';
const EMAIL = 'contato@bomshopping.com.br';

const LOGO = `<svg viewBox="0 0 48 48" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#1a56ff"/><stop offset=".6" stop-color="#0091ff"/><stop offset="1" stop-color="#ffc400"/></linearGradient></defs><path d="M10 16h28l-2.6 24.2A4 4 0 0 1 31.4 44H16.6a4 4 0 0 1-4-3.8L10 16Z" fill="url(#lg)"/><path d="M17 16v-3a7 7 0 0 1 14 0v3" stroke="url(#lg)" stroke-width="3.2" stroke-linecap="round"/><path d="m20 25-4 5 4 5M28 25l4 5-4 5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const WA_ICON = `<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.5 6.5 0 0 0 1.3 3.4 14.6 14.6 0 0 0 5.6 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.7-.4Z"/></svg>`;
const PAGES = [['index.html','Home'],['quem-somos.html','Quem Somos'],['ecommerce.html','E-commerce'],['servicos.html','Serviços'],['produtos.html','Produtos'],['faq.html','FAQ']];
const here = location.pathname.split('/').pop() || 'index.html';
const wa = (t = 'Olá! Vim pelo site da Bomshopping e gostaria de saber mais.') => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;

document.body.insertAdjacentHTML('afterbegin', `<header id="hd"><div class="wrap nav">
<a href="index.html" class="logo">${LOGO}<span><b>bom</b>shopping</span></a>
<button class="burger" aria-label="Menu" onclick="document.querySelector('.menu').classList.toggle('open')">☰</button>
<nav class="menu">${PAGES.map(([h, t]) => `<a href="${h}" class="${h === here ? 'on' : ''}">${t}</a>`).join('')}<a href="contato.html" class="btn p">Fale Conosco</a></nav></div></header>`);

document.body.insertAdjacentHTML('beforeend', `<footer><div class="wrap"><div class="fg">
<div><a href="index.html" class="logo">${LOGO}<span><b>bom</b>shopping</span></a><p>Soluções de TI na Web aplicadas ao seu negócio. Desde 2001 transformando ideias em software.</p></div>
<div><h4>Empresa</h4><a href="quem-somos.html">Quem Somos</a><a href="faq.html">FAQ</a><a href="contato.html">Contato</a></div>
<div><h4>Soluções</h4><a href="ecommerce.html">Plataforma E-commerce</a><a href="servicos.html">Serviços</a><a href="produtos.html">Produtos</a><a href="servicos.html#analytics">Data Analytics</a></div>
<div><h4>Fale com a gente</h4><a href="${wa()}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:${EMAIL}">${EMAIL}</a><a href="contato.html">Solicitar orçamento</a></div>
</div><div class="copy"><span>© ${new Date().getFullYear()} Bomshopping — Soluções de TI na Web</span><span>Feito com ♥ desde 2001</span></div></div></footer>
<a class="wa" href="${wa()}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_ICON}</a>`);

document.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa || undefined); a.target = '_blank'; a.rel = 'noopener'; });
document.querySelectorAll('[data-mail]').forEach(a => { a.href = 'mailto:' + EMAIL; a.textContent ||= EMAIL; });

const hd = document.getElementById('hd');
addEventListener('scroll', () => hd.classList.toggle('s', scrollY > 30), { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });

document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x', e.clientX - r.left + 'px'); c.style.setProperty('--y', e.clientY - r.top + 'px');
}));

document.querySelectorAll('[data-count]').forEach(el => {
  const end = +el.dataset.count, suf = el.dataset.suf || '';
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    let t0; const step = t => { t0 ??= t; const p = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(end * (1 - (1 - p) ** 3)) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }).observe(el);
});

const form = document.getElementById('form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const msg = `Olá! Sou ${d.nome} (${d.email}${d.tel ? ', ' + d.tel : ''}).\nInteresse: ${d.assunto}\n\n${d.msg}`;
  open(e.submitter?.value === 'mail' ? `mailto:${EMAIL}?subject=${encodeURIComponent('Contato pelo site — ' + d.assunto)}&body=${encodeURIComponent(msg)}` : wa(msg), '_blank');
});

const prog = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'prog' }));
addEventListener('scroll', () => prog.style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + '%', { passive: true });

document.querySelectorAll('[data-rotate]').forEach(el => {
  const words = el.dataset.rotate.split(','); let w = 0, i = words[0].length, del = true;
  const tick = () => {
    const word = words[w];
    i += del ? -1 : 1; el.textContent = word.slice(0, i);
    if (del && i === 0) { del = false; w = (w + 1) % words.length; }
    else if (!del && i === words[w].length) { del = true; return setTimeout(tick, 2200); }
    setTimeout(tick, del ? 45 : 85);
  };
  setTimeout(tick, 2500);
});

// loja demo: simula compras e notificações
document.querySelectorAll('.shop').forEach(shop => {
  const prods = shop.querySelectorAll('.prod'), em = shop.querySelector('.cart em');
  const toast = shop.querySelector('.toast.live');
  const orders = [['Pix aprovado', 'Pedido #1048 · R$ 299,90'], ['Cartão aprovado', 'Pedido #1049 · R$ 189,00'], ['Frete calculado', 'Entrega em 2 dias úteis'], ['Estoque atualizado', '12 unidades restantes']];
  let n = 0;
  setInterval(() => {
    const p = prods[n % prods.length];
    p.classList.add('hit'); setTimeout(() => p.classList.remove('hit'), 900);
    em.textContent = ++n; em.classList.add('pop'); setTimeout(() => em.classList.remove('pop'), 300);
    if (toast) {
      const [t, s] = orders[n % orders.length];
      toast.querySelector('b').textContent = t; toast.querySelector('small').textContent = s;
      toast.style.animation = 'none'; toast.offsetWidth; toast.style.animation = '';
    }
  }, 2600);
});

// terminal animado no topo das subpáginas
const TERM = {
  'quem-somos.html': ['$ git log --reverse | head -1', '<y>2001</y> · primeiro commit da Bomshopping', '$ clientes --pais', '<ok>✓</ok> Brasil inteiro', '$ foco --principal', '<k>negócio</k> do cliente'],
  'servicos.html': ['$ bomshopping servicos --listar', '<ok>✓</ok> sites  <ok>✓</ok> sistemas  <ok>✓</ok> e-commerce', '<ok>✓</ok> marketing  <ok>✓</ok> analytics', '$ bomshopping orcamento --novo', '<y>→</y> fale com a gente'],
  'produtos.html': ['$ npm install @bomshopping/erp', '<ok>✓</ok> atendimento  <ok>✓</ok> vendas', '<ok>✓</ok> estoque  <ok>✓</ok> finanças  <ok>✓</ok> crm', '$ bomshopping deploy --saas', '<y>ready to go</y> 🚀'],
  'faq.html': ['$ bomshopping ajuda', '<k>?</k> modelo SaaS · prazos · suporte', '$ bomshopping duvida --resolver', '<ok>✓</ok> respondido'],
  'contato.html': ['$ bomshopping contato --novo', '<k>→</k> whatsapp · e-mail', '$ aguardando sua mensagem', '<ok>✓</ok> resposta rápida'],
};
const ph = document.querySelector('.ph .wrap');
if (ph && TERM[here] && !document.getElementById('form')) {
  const t = ph.appendChild(Object.assign(document.createElement('div'), { className: 'term', ariaHidden: 'true', innerHTML: '<div class="dots"><i></i><i></i><i></i></div>' }));
  const fmt = s => s.replace(/<(\w+)>(.*?)<\/\1>/g, '<span class="$1">$2</span>');
  let li = 0;
  const line = () => {
    if (li >= TERM[here].length) return;
    const src = TERM[here][li++], p = t.appendChild(document.createElement('p'));
    if (!src.startsWith('$')) { p.innerHTML = fmt(src); return setTimeout(line, 500); }
    let c = 0; const type = () => { p.textContent = src.slice(0, ++c); c < src.length ? setTimeout(type, 40) : setTimeout(line, 350); }; type();
  };
  setTimeout(line, 800);
}
