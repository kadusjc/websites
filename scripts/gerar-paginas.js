#!/usr/bin/env node
// Gera as páginas de serviço estáticas (HTML puro, ótimo para Google e para IAs)
// a partir de UM layout compartilhado (este arquivo) + o conteúdo de cada página
// em scripts/paginas/<slug>.json.
//
// Também regenera o sitemap.xml e a lista de páginas do llms.txt.
//
// Uso:  npm run gerar      (ou: node scripts/gerar-paginas.js)
//
// Para criar uma página nova: copie um JSON de scripts/paginas/, mude o "slug"
// e o conteúdo, adicione o slug em ORDEM abaixo e rode o comando.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://fcsoftware.com.br';
const WA_NUM = '5512991359134';
const HOJE = new Date().toISOString().slice(0, 10);

// Ordem das páginas no rodapé, no sitemap e no llms.txt
const ORDEM = [
  'criacao-de-sites',
  'sites-alta-performance',
  'sites-com-gerenciador-de-conteudo',
  'sistemas-sob-medida',
  'desenvolvimento-de-sistemas-corporativos',
  'solucoes-inteligencia-artificial',
  'agente-de-ia-whatsapp',
  'desenvolvimento-de-sistemas-com-ia',
  'seo-geo-aeo',
];
// Páginas que aparecem no menu do topo (o rodapé mostra todas)
const MENU_TOPO = [
  'criacao-de-sites',
  'sistemas-sob-medida',
  'solucoes-inteligencia-artificial',
  'agente-de-ia-whatsapp',
  'seo-geo-aeo',
];

const paginas = ORDEM.map((slug) => {
  const p = JSON.parse(fs.readFileSync(path.join(__dirname, 'paginas', `${slug}.json`), 'utf8'));
  if (p.slug !== slug) throw new Error(`slug diferente em ${slug}.json`);
  return p;
});
const porSlug = Object.fromEntries(paginas.map((p) => [p.slug, p]));

// ---------- utilitários ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const texto = (html) => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const url = (slug) => `${SITE}/${slug}/`;
const wa = (msg) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const dataBR = (iso) => {
  const m = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const [a, mes, d] = iso.split('-').map(Number);
  return `${d} de ${m[mes - 1]} de ${a}`;
};

const ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.04c0-5.23 4.26-9.49 9.5-9.49a9.43 9.43 0 0 1 6.71 2.78 9.43 9.43 0 0 1 2.78 6.72c0 5.23-4.26 9.48-9.49 9.48zm8.08-17.56A11.36 11.36 0 0 0 12.04.6C5.74.6.62 5.72.62 12.01c0 2.01.53 3.97 1.52 5.7L.53 23.6l6.04-1.58a11.4 11.4 0 0 0 5.46 1.39h.01c6.29 0 11.41-5.12 11.41-11.41 0-3.05-1.19-5.91-3.34-8.07z"/></svg>';

// ---------- blocos compartilhados ----------
const AREAS = [
  { '@type': 'Country', name: 'Brasil' },
  { '@type': 'Place', name: 'Mundo (atendimento remoto)' },
  { '@type': 'AdministrativeArea', name: 'Vale do Paraíba' },
  { '@type': 'City', name: 'São José dos Campos' },
  { '@type': 'City', name: 'Taubaté' },
  { '@type': 'City', name: 'Jacareí' },
  { '@type': 'City', name: 'Caçapava' },
  { '@type': 'City', name: 'Pindamonhangaba' },
];

function jsonLd(p) {
  const pg = url(p.slug);
  const graph = [
    {
      '@type': 'Service',
      '@id': `${pg}#service`,
      name: p.servico.nome,
      serviceType: p.servico.tipo,
      description: p.description,
      url: pg,
      provider: { '@id': `${SITE}/#org` },
      areaServed: AREAS,
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: `https://wa.me/${WA_NUM}`, availableLanguage: ['pt-BR', 'en'] },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: p.servico.nome,
        itemListElement: p.entregas.cards.map((c) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: texto(c.titulo), description: texto(c.texto) },
        })),
      },
    },
    {
      '@type': ['ProfessionalService', 'Organization'],
      '@id': `${SITE}/#org`,
      name: 'Ferreiro Corrêa Software',
      alternateName: ['FC Software', 'Ferreiro Correa Software'],
      url: `${SITE}/`,
      logo: `${SITE}/logo.svg`,
      image: `${SITE}/img/og.jpg`,
      telephone: '+55-12-99135-9134',
      email: 'kadusjc1984@gmail.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Caçapava', addressRegion: 'SP', addressCountry: 'BR' },
      founder: { '@type': 'Person', '@id': `${SITE}/#founder`, name: 'Carlos Eduardo Ferreiro Corrêa' },
      sameAs: ['https://github.com/kadusjc', 'https://www.linkedin.com/in/eng-carlos-eduardo-ferreiro-corr%C3%AAa-9606963a'],
    },
    {
      '@type': 'WebPage',
      '@id': `${pg}#page`,
      url: pg,
      name: p.title,
      description: p.description,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': `${SITE}/#site` },
      about: { '@id': `${pg}#service` },
      primaryImageOfPage: `${SITE}/img/og.jpg`,
      author: { '@id': `${SITE}/#founder` },
      reviewedBy: { '@id': `${SITE}/#founder` },
      datePublished: p.dataPublicacao || p.dataModificacao,
      dateModified: p.dataModificacao,
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.ans', '.facts', 'details'] },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: texto(p.migalha), item: pg },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: p.faq.map((f) => ({
        '@type': 'Question',
        name: texto(f.pergunta),
        acceptedAnswer: { '@type': 'Answer', text: texto(f.resposta) },
      })),
    },
  ];
  // escapa "</" para não fechar o <script> por acidente
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/<\//g, '<\\/');
}

const head = (p) => {
  const pg = url(p.slug);
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title>
<script src="/assets/analytics.js" defer></script>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${pg}">
<link rel="alternate" hreflang="pt-BR" href="${pg}"><link rel="alternate" hreflang="x-default" href="${pg}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="theme-color" content="#07090a">
<meta name="author" content="Carlos Eduardo Ferreiro Corrêa">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Ferreiro Corrêa Software">
<meta property="og:url" content="${pg}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${SITE}/img/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Ferreiro Corrêa Software: ${esc(texto(p.servico.nome))}">
<meta property="article:modified_time" content="${p.dataModificacao}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.description)}"><meta name="twitter:image" content="${SITE}/img/og.jpg">
<meta name="geo.region" content="BR-SP"><meta name="geo.placename" content="Caçapava"><meta name="geo.position" content="-23.0995;-45.7076"><meta name="ICBM" content="-23.0995, -45.7076">
<link rel="icon" href="/logo.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="text/plain" title="LLMs" href="/llms.txt">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/servicos.css">
<script type="application/ld+json">${jsonLd(p)}</script>
</head>`;
};

const header = (p) => `<header class="top"><div class="wrap">
 <a href="/" aria-label="Ferreiro Corrêa Software, página inicial"><img src="/logo.svg" alt="Ferreiro Corrêa Software" width="127" height="56"></a>
 <nav aria-label="Serviços">${MENU_TOPO.map((s) => `<a href="/${s}/"${s === p.slug ? ' aria-current="page"' : ''}>${porSlug[s].menu}</a>`).join('')}</nav>
 <a class="btn btn-p" href="/#orcamento">Pedir orçamento</a>
</div></header>`;

const resumo = (p) =>
  p.resumo && p.resumo.length
    ? `
 <section><div class="wrap">
  <span class="eyebrow">Em resumo</span>
  <h2>${p.resumoTitulo || `${texto(p.migalha)}: o essencial`}</h2>
  <dl class="facts">${p.resumo.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
 </div></section>`
    : '';

const detalhes = (p) =>
  [].concat(p.detalhes || []).map((d) => `
 <section><div class="wrap prose">
  <span class="eyebrow">${d.eyebrow}</span>
  <h2>${d.h2}</h2>
  ${d.html}
 </div></section>`).join('');

const PASSOS = [
  ['Diagnóstico', 'Uma conversa rápida para entender seu negócio, seu cliente e o objetivo do projeto.'],
  ['Proposta', 'Escopo e valor fechados, sem surpresas no meio do caminho.'],
  ['Desenvolvimento', 'Entregas e prévias para você acompanhar e validar cada etapa.'],
  ['Lançamento e evolução', 'Publicação, configuração e acompanhamento para o projeto continuar crescendo.'],
];

const quemFaz = (p) => `
 <section><div class="wrap who">
  <aside class="idc"><h3>Eng. Carlos Eduardo Ferreiro Corrêa</h3><p class="r">Fundador · Engenheiro de Computação</p>
   <ul><li>Mais de 20 anos em engenharia de software</li><li>Sistemas para Embraer, Azul, Gol, TAM e Polishop</li><li>Pós em Engenharia de Software com IA Aplicada</li><li>Sun Certified Java Programmer</li><li>Autor do livro “React JS: Guia Completo para o Desenvolvedor Front-End”</li></ul></aside>
  <div class="prose"><span class="eyebrow">Quem faz o seu projeto</span><h2>Você fala direto com o engenheiro</h2>
   <p>Na Ferreiro Corrêa Software, quem conversa com você é quem desenha e programa. Sem repasse e sem telefone sem fio: a mesma pessoa que entende o seu negócio é a que escreve o código.</p>
   <p>Essa experiência vem de duas décadas em sistemas críticos de pagamentos, aviação, telemetria e e-commerce, e hoje também de engenharia full stack para uma empresa de software dos Estados Unidos. Somos de <b>Caçapava/SP</b>, no Vale do Paraíba, e atendemos clientes em todo o Brasil e no exterior, de forma 100% remota.</p>
   <p><a href="/#sobre">Conheça a trajetória completa →</a></p>
   <p class="upd">Conteúdo escrito e revisado pelo Eng. Carlos Eduardo Ferreiro Corrêa · atualizado em <time datetime="${p.dataModificacao}">${dataBR(p.dataModificacao)}</time></p></div>
 </div></section>`;

const footer = () => `<footer><div class="wrap"><span>© ${HOJE.slice(0, 4)} Ferreiro Corrêa Software · Caçapava/SP · <a href="tel:+5512991359134">(12) 99135-9134</a></span>
 <nav aria-label="Rodapé"><a href="/">Início</a>${paginas.map((x) => `<a href="/${x.slug}/">${x.menu}</a>`).join('')}<a href="/#orcamento">Orçamento</a><a href="/#privacidade">Privacidade</a><button type="button" data-cookie-prefs>Preferências de cookies</button></nav></div></footer>`;

function pagina(p) {
  const link = wa(p.whatsapp);
  return `<!doctype html>
<html lang="pt-BR">
${head(p)}
<body>
<a class="skip" href="#main">Pular para o conteúdo</a>
${header(p)}
<main id="main">
 <section class="hero"><div class="wrap">
  <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a> › <span aria-current="page">${p.migalha}</span></nav>
  <h1>${p.h1}</h1>
  <p class="ans">${p.resposta}</p>
  <div class="cta"><a class="btn btn-p" href="${link}" target="_blank" rel="noopener">${ICON_WA}Falar com o engenheiro</a><a class="btn btn-g" href="/#trabalhos">Ver trabalhos</a></div>
 </div></section>${resumo(p)}
 <section><div class="wrap">
  <span class="eyebrow">${p.entregas.eyebrow}</span>
  <h2>${p.entregas.h2}</h2>
  <div class="grid">${p.entregas.cards.map((c) => `<div class="card"><h3>${c.titulo}</h3><p>${c.texto}</p></div>`).join('')}</div>
 </div></section>${detalhes(p)}
 <section><div class="wrap">
  <span class="eyebrow">Como funciona</span>
  <h2>Da conversa à entrega, sem dor de cabeça</h2>
  <ol class="steps">${PASSOS.map(([b, s]) => `<li><div><b>${b}</b><span>${s}</span></div></li>`).join('')}</ol>
 </div></section>${quemFaz(p)}
 <section><div class="wrap">
  <span class="eyebrow">Dúvidas frequentes</span>
  <h2>${p.faqTitulo}</h2>
  ${p.faq.map((f) => `<details><summary>${f.pergunta}</summary><p>${f.resposta}</p></details>`).join('')}
 </div></section>
 <section><div class="wrap">
  <div class="final"><h2>Vamos conversar sobre o seu projeto?</h2><p>Conte o que você precisa e receba uma proposta clara, com escopo e valor fechados.</p>
   <div class="cta"><a class="btn btn-p" href="${link}" target="_blank" rel="noopener">${ICON_WA}Chamar no WhatsApp</a><a class="btn btn-g" href="/#orcamento">Preencher briefing</a></div></div>
  <p class="eyebrow" style="margin-top:40px">Serviços relacionados</p><div class="rel">${p.relacionados.map((s) => `<a href="/${s}/">${porSlug[s].menu} →</a>`).join('')}</div>
 </div></section>
</main>
${footer()}
<a class="wa" href="${link}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${ICON_WA}</a>
</body>
</html>
`;
}

// ---------- gera as páginas ----------
for (const p of paginas) {
  for (const s of p.relacionados) if (!porSlug[s]) throw new Error(`${p.slug}: relacionado inexistente "${s}"`);
  const dir = path.join(ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pagina(p));
  console.log(`✔ /${p.slug}/`);
}

// ---------- sitemap.xml ----------
const homeMod = fs.statSync(path.join(ROOT, 'index.html')).mtime.toISOString().slice(0, 10);
const linhas = [
  `<url><loc>${SITE}/</loc><lastmod>${homeMod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  ...paginas.map((p) => `<url><loc>${url(p.slug)}</loc><lastmod>${p.dataModificacao}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`),
];
fs.writeFileSync(
  path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${linhas.join('\n')}\n</urlset>\n`
);
console.log('✔ sitemap.xml');

// ---------- llms.txt (só a seção "Páginas de serviço") ----------
const llmsPath = path.join(ROOT, 'llms.txt');
const llms = fs.readFileSync(llmsPath, 'utf8');
const secao = `## Páginas de serviço\n\n${paginas.map((p) => `- [${texto(p.servico.nome)}](${url(p.slug)}): ${p.description}`).join('\n')}\n\n`;
const novo = llms.replace(/## Páginas de serviço\n[\s\S]*?(?=\n## )/, secao.trimEnd() + '\n');
if (novo === llms && !llms.includes(secao.trim())) console.warn('⚠ llms.txt: seção "## Páginas de serviço" não encontrada');
fs.writeFileSync(llmsPath, novo);
console.log('✔ llms.txt');
