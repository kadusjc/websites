## Portofólio de Clientes

Repositório público no github para servir de hospedagem e apresentação de portfólio da empresa - FerreiroCorrêa Software.
Ficam hospedados em: https://kadusjc.github.io/websites/

## Páginas de serviço (SEO, GEO e AEO)

As páginas de serviço (`/criacao-de-sites/`, `/sites-alta-performance/` etc.) são **geradas**, não editadas à mão:

- Layout compartilhado (topo, rodapé, "quem faz", dados estruturados): `scripts/gerar-paginas.js`
- Conteúdo de cada página: `scripts/paginas/<slug>.json`
- Gerar tudo (páginas + `sitemap.xml` + lista do `llms.txt`): `npm run gerar`

Analytics: Google Tag Manager `GTM-KG3FCRBX` com Consent Mode v2 e aviso de cookies em `assets/analytics.js` (usado por todas as páginas).
