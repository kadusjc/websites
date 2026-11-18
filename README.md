## Portofólio de Clientes

Repositório público no github para servir de hospedagem e apresentação de portfólio da empresa - FerreiroCorrêa Software.
Ficam hospedados em: https://kadusjc.github.io/websites/

## Páginas de serviço (SEO, GEO e AEO)

As páginas de serviço (`/criacao-de-sites/`, `/sites-alta-performance/` etc.) são **geradas**, não editadas à mão:

- Layout compartilhado (topo, rodapé, "quem faz", dados estruturados): `scripts/gerar-paginas.js`
- Conteúdo de cada página: `scripts/paginas/<slug>.json`
- Gerar tudo (páginas + `404.html` + `sitemap.xml` + `llms.txt` + `llms-full.txt`): `npm run gerar`
- Depois do push e da publicação no GitHub Pages, avisar Bing e outros buscadores (IndexNow): `npm run indexnow`

Analytics: tag do Google `GTM-N635HSF4` (GA4 `G-3GDR6SCKG6`) com Consent Mode v2 e aviso de cookies em `assets/analytics.js` (usado por todas as páginas). Conversões enviadas direto ao GA4: `generate_lead`, `whatsapp_click`, `phone_click`, `portfolio_open`.
