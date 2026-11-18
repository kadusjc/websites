#!/usr/bin/env node
// Avisa Bing, Yandex, Seznam, Naver e outros buscadores (protocolo IndexNow)
// que as URLs do sitemap.xml mudaram. O Bing alimenta o ChatGPT e o Copilot,
// então isso também ajuda no GEO. O Google NÃO usa IndexNow (para ele: Search Console).
//
// Uso (depois do push, quando o GitHub Pages já publicou):
//   npm run indexnow                 -> envia todas as URLs do sitemap
//   npm run indexnow -- /pagina/     -> envia só as URLs informadas
//
// A chave é o arquivo <chave>.txt na raiz do site (precisa estar publicado).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HOST = 'fcsoftware.com.br';
const SITE = `https://${HOST}`;

const chaveArq = fs.readdirSync(ROOT).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!chaveArq) throw new Error('arquivo de chave IndexNow (<32 hex>.txt) não encontrado na raiz');
const key = chaveArq.slice(0, -4);

const args = process.argv.slice(2);
const urls = args.length
  ? args.map((u) => (u.startsWith('http') ? u : SITE + u))
  : [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

(async () => {
  const chave = await fetch(`${SITE}/${chaveArq}`);
  if (!chave.ok || (await chave.text()).trim() !== key) {
    console.error(`✖ ${SITE}/${chaveArq} ainda não está publicado. Faça o push, espere o GitHub Pages e rode de novo.`);
    process.exit(1);
  }
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${chaveArq}`, urlList: urls }),
  });
  // 200 = recebido, 202 = recebido (chave ainda sendo validada)
  console.log(`${r.ok ? '✔' : '✖'} IndexNow: HTTP ${r.status} para ${urls.length} URL(s)`);
  if (!r.ok) console.log(await r.text());
  urls.forEach((u) => console.log('  ' + u));
  process.exit(r.ok ? 0 : 1);
})();
