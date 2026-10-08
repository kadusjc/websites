# SEO do site da Ribeiro Móveis e Colchões

Guia de operação do site: o que já está pronto, o que falta, quais sites
usar e o que configurar em cada um. Tudo que precisar ser trocado no
futuro está aqui.

- Pasta: `bot/public/ribeiro/`
- Domínio planejado: `https://www.ribeiromoveisecolchoes.com.br`
- Hoje no ar em: `https://souabia.com/ribeiro/` (provisório)
- Última auditoria: 23/09/2026

---

## 0. Dados da loja (NAP): usar exatamente assim em todo lugar

| Campo | Valor |
|---|---|
| Nome | Ribeiro Móveis e Colchões |
| Endereço | Av. Andrômeda, 528 – Jardim Satélite, São José dos Campos – SP, 12230-001 |
| Referência | Em frente à portaria do Vale Sul Shopping |
| Telefone | (12) 3916-1053 |
| WhatsApp | (12) 98801-4039 · https://wa.me/5512988014039 |
| Horário | Seg–sex 9h–19h · Sáb 9h–16h · Dom fechado |
| Instagram | https://www.instagram.com/ribeiromoveisecolchoes/ |
| Facebook | https://www.facebook.com/RIBEIROMOVEISECOLCHOES/ |
| Threads | https://www.threads.net/@ribeiromoveisecolchoes |

O Google compara nome, endereço e telefone entre o site, o Maps e os
diretórios. Qualquer divergência (vírgula, abreviação, telefone antigo)
diminui a confiança na ficha. **Endereço antigo que precisa sumir:** Rua
Félicio Jabbur Nasser, 540 / (12) 98141-2721 (aparece no Facebook e no
guiafacil.com).

---

## 1. As páginas do site

13 arquivos HTML, 12 indexáveis:

| Arquivo | Busca-alvo |
|---|---|
| `index.html` | loja de móveis São José dos Campos / móveis SJC |
| `sofas-sao-jose-dos-campos.html` | sofá retrátil SJC / sofá reclinável / sofá orgânico |
| `mesas-de-jantar-sao-jose-dos-campos.html` | mesa de jantar SJC / cadeiras / banquetas |
| `guarda-roupas-sao-jose-dos-campos.html` | guarda-roupa planejado SJC / roupeiro |
| `moveis-sob-medida-sao-jose-dos-campos.html` | móveis sob medida SJC / painel ripado |
| `colchoes-sao-jose-dos-campos.html` | colchões São José dos Campos |
| `poltronas-e-area-externa-sao-jose-dos-campos.html` | poltronas / móveis área externa SJC |
| `guia-de-compra.html` | hub dos guias |
| `guia-como-escolher-sofa-retratil.html` | como escolher sofá retrátil |
| `guia-tamanho-ideal-mesa-de-jantar.html` | tamanho ideal mesa de jantar |
| `guia-como-escolher-guarda-roupa.html` | como escolher guarda-roupa |
| `guia-painel-para-tv-medidas.html` | altura painel TV |
| `politica-de-privacidade.html` | — |
| `404.html` | — (noindex) |

Arquivos de apoio: `robots.txt`, `sitemap.xml` (13 URLs, com imagens e
vídeos), `site.webmanifest`, `llms.txt`, `humans.txt`, `favicon.*`,
`icon-*.png`, `apple-touch-icon.png`, `assets/` (css, js, fontes, img WebP
480/900, vídeos mp4 + pôster). Tamanho total: cerca de 6,6 MB.

---

## 2. O que já está pronto (auditoria de 23/09/2026)

| Área | Situação |
|---|---|
| `<title>` | Único por página, 52–65 caracteres, sem duplicatas ✅ |
| `meta description` | Única, 90–159 caracteres ✅ |
| `<h1>` | Exatamente 1 por página, headings hierárquicos ✅ |
| `canonical` | Em todas as páginas ✅. Aponta para o domínio definitivo, que **ainda não existe** (ver §3) |
| `meta robots` | `index, follow, max-image-preview:large, max-snippet:-1` (+ `max-video-preview` onde há vídeo) ✅ |
| Open Graph + Twitter Card | Em todas as páginas de conteúdo, imagem `assets/img/og-ribeiro-moveis.jpg` ✅ |
| Dados estruturados (JSON-LD) | `FurnitureStore`/`LocalBusiness` (endereço, geo, horário, telefones, `sameAs`, `hasMap`, `priceRange`), `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `ItemList`, `VideoObject`, `Article`, `CollectionPage`. Todos os blocos passam em `JSON.parse` ✅ |
| Imagens | 136 `<img>`, 100% com `alt` descritivo, WebP com `srcset` 480/900, nomes com palavra-chave, lazy-load ✅ |
| Performance | Fontes auto-hospedadas com `preload`, sem dependências externas, lazy-load de vídeo e mapa ✅ |
| SEO local | NAP igual em todas as páginas, meta geo, referência ao Vale Sul Shopping e ao Jardim Satélite, mapa, rotas no Google Maps e no Waze ✅ |
| Conversão | WhatsApp com mensagem pré-preenchida por produto, orçamento rápido, botão flutuante, barra Ligar/WhatsApp/Rota no celular, status "aberto agora" ✅ |
| Eventos no `dataLayer` | `whatsapp_click`, `phone_click`, `route_click`, `quote_submit`, `video_open`, `map_open` ✅. Ainda sem GA4 para receber esses eventos (ver §5.3) |
| IA / buscadores | `llms.txt` com o resumo da loja ✅ |
| Servidor atual | gzip/brotli ativo, HTML `max-age=0`, imagens com 30 dias de cache ✅ |

---

## 3. Problemas em aberto

| # | Problema | Impacto | Onde resolver |
|---|---|---|---|
| 1 | **O domínio `ribeiromoveisecolchoes.com.br` não resolve** (sem DNS, com ou sem `www`). Canonical, sitemap, OG, schema e `llms.txt` apontam para ele. | **Crítico.** Nada indexa enquanto isso não for resolvido | §4 |
| 2 | O site responde em `souabia.com/ribeiro/`, dentro do site da Bia, com canonical para um domínio morto. O Google pode tratar as páginas como duplicadas ou quebradas e misturar com a Bia | Alto | §4.3 |
| 3 | `robots.txt` desta pasta não vale nada em `souabia.com/ribeiro/`, porque crawler só lê o da raiz do host | Médio | Resolve sozinho no domínio próprio |
| 4 | **Este `SEO.md` também é público** (`souabia.com/ribeiro/SEO.md` responde 200; o mesmo vale para `vertice/SEO.md`) | Baixo | §4.3 |
| 5 | Sem GA4/GTM e sem verificação do Search Console (tags comentadas no `<head>` do `index.html`) | Alto (sem medição) | §5 |
| 6 | NAP antigo no Facebook e no guiafacil.com | Alto para o SEO local | §6.2 |
| 7 | Sem banner de cookies (necessário quando o GA4 for instalado, pela LGPD) | Médio | §5.3 |

---

## 4. Fase 1 — Colocar no domínio próprio (primeiro de tudo)

### 4.1 Registrar o domínio: https://registro.br

- [ ] Pesquisar `ribeiromoveisecolchoes.com.br`. Se estiver livre, registrar
  no **CNPJ da loja**, para a loja ser a dona do domínio (cerca de R$ 40 por ano).
- [ ] Se o domínio final for outro, trocar em todos os arquivos de uma vez:
  ```bash
  cd bot/public/ribeiro
  grep -rl "https://www.ribeiromoveisecolchoes.com.br" . \
    | xargs sed -i "s#https://www.ribeiromoveisecolchoes.com.br#https://www.NOVO-DOMINIO#g"
  ```
  Um canonical apontando para um domínio diferente do publicado impede a
  indexação correta.

### 4.2 Hospedagem

O site é 100% estático e não precisa do servidor da Bia.

| Opção | Prós | Contras |
|---|---|---|
| **Cloudflare Pages** (recomendado) | Grátis, CDN com pontos no Brasil, HTTPS automático, 404 e redirects nativos, cabeçalhos via `_headers` | Exige apontar o DNS para a Cloudflare |
| Netlify / Vercel | Grátis, simples | CDN no Brasil pior |
| Continuar no Railway (Bia), roteando por `Host` | Nada novo para administrar | Acopla a loja ao deploy da Bia, e um bug na Bia derruba a loja |

**Passo a passo no Cloudflare (https://dash.cloudflare.com):**

- [ ] *Add a site* → informar o domínio → plano Free. No registro.br, trocar os
  servidores DNS para os 2 nameservers que a Cloudflare indicar (propaga em algumas horas).
- [ ] *Workers & Pages → Create → Pages*: fazer upload da pasta `bot/public/ribeiro/`
  ou conectar o repositório com diretório de saída `bot/public/ribeiro`.
- [ ] *Custom domains*: adicionar `www.ribeiromoveisecolchoes.com.br` **e** `ribeiromoveisecolchoes.com.br`.
- [ ] *Rules → Redirect Rules*: redirecionar com 301 `ribeiromoveisecolchoes.com.br/*` →
  `https://www.ribeiromoveisecolchoes.com.br/${1}` (preservar query string).
- [ ] *SSL/TLS*: modo **Full (strict)**. *Edge Certificates*: **Always Use HTTPS** e
  **HSTS** ligados (este último depois de 1 semana estável).
- [ ] *Speed*: Brotli ligado (padrão).
- [ ] Criar o arquivo `_headers` nesta pasta:
  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /*.html
    Cache-Control: public, max-age=0, must-revalidate
  /SEO.md
    X-Robots-Tag: noindex
  ```
- [ ] O `404.html` na raiz já é usado automaticamente pelo Pages como página de erro,
  com status 404 real.
- [ ] Não publicar `SEO.md`: excluir no upload ou apagar da pasta de saída.

### 4.3 Tirar o site de dentro da Bia

- [ ] **Agora** (enquanto o domínio não sai): adicionar `Disallow: /ribeiro/` em
  `bot/public/robots.txt` da Bia, para o Google não indexar pela URL errada.
- [ ] **Quando o domínio estiver no ar:** redirecionar com 301 `souabia.com/ribeiro/*` →
  `https://www.ribeiromoveisecolchoes.com.br/*` em `bot/src/server.js`, antes do
  `express.static`. Isso preserva qualquer link que já exista.
- [ ] Bloquear `*.md` no `express.static` da Bia (hoje `SEO.md` e `vertice/SEO.md`
  são servidos publicamente).

### 4.4 Validação

```bash
curl -sI http://ribeiromoveisecolchoes.com.br/          | grep -iE '^(HTTP|location)'   # 301 → https://www...
curl -sI https://ribeiromoveisecolchoes.com.br/sofas-sao-jose-dos-campos.html | grep -iE '^(HTTP|location)'  # 301 → www
curl -sI https://www.ribeiromoveisecolchoes.com.br/     | grep -iE '^(HTTP|cache)'      # 200
curl -sI https://www.ribeiromoveisecolchoes.com.br/nao-existe | head -1                 # 404
curl -s  https://www.ribeiromoveisecolchoes.com.br/robots.txt
curl -s  https://www.ribeiromoveisecolchoes.com.br/sitemap.xml | grep -c '<loc>'        # 13
curl -sI https://www.ribeiromoveisecolchoes.com.br/SEO.md | head -1                     # 404
curl -sI https://souabia.com/ribeiro/ | grep -iE '^(HTTP|location)'                    # 301 → domínio novo
```

**Critério de saída:** todas as variações (http/https, com/sem www) caem em
`https://www.ribeiromoveisecolchoes.com.br/...` com um único 301.

---

## 5. Fase 2 — Ferramentas de busca e medição (dia 1 com o domínio no ar)

Use sempre a **conta Google da loja** (ex.: `ribeiromoveis...@gmail.com`) e
adicione você como administrador. Não use a sua conta pessoal: se a
parceria acabar, a loja fica sem acesso.

### 5.1 Google Search Console: https://search.google.com/search-console

- [ ] *Adicionar propriedade → Domínio* → `ribeiromoveisecolchoes.com.br` → copiar o
  registro TXT e criar no DNS da Cloudflare (*DNS → Add record → TXT*, nome `@`).
  Esse tipo cobre http, https e www de uma vez.
  - Alternativa: *Prefixo de URL*, colando o código na meta
    `google-site-verification`, que já está comentada no `<head>` do `index.html`.
- [ ] *Sitemaps* → enviar `sitemap.xml`.
- [ ] *Inspeção de URL* → *Solicitar indexação* da home e das 6 categorias
  (limite de cerca de 10 por dia; os guias no dia seguinte).
- [ ] *Configurações → Usuários e permissões*: adicionar você como Proprietário.
- [ ] Após 7 dias: *Páginas* (as 12 URLs indexadas?) e *Melhorias* (Breadcrumb,
  FAQ e Vídeos sem erros).

### 5.2 Bing Webmaster Tools: https://www.bing.com/webmasters

- [ ] *Import from Google Search Console* (1 clique, já traz o sitemap).
  O Bing alimenta o ChatGPT Search, o Copilot e o DuckDuckGo.
- [ ] IndexNow: ligar na Cloudflare em *Caching → Configuration → Crawler Hints*.
  O Bing passa a ser avisado sozinho quando uma página mudar.

### 5.3 Google Analytics 4 + Tag Manager

- [ ] **https://analytics.google.com** → criar a propriedade "Ribeiro Móveis",
  fuso América/São Paulo, moeda BRL → *Fluxo de dados Web* com o domínio → anotar o
  ID `G-XXXXXXX`.
- [ ] **https://tagmanager.google.com** → criar um contêiner *Web* → copiar os 2 snippets
  (um no `<head>`, outro logo após o `<body>`) e colar em **todas as 13 páginas**.
  O local está marcado com comentário no `<head>` do `index.html`; as outras
  páginas precisam receber o mesmo trecho.
- [ ] No GTM:
  - Tag *Google Tag* com o ID `G-XXXXXXX`, acionador *Initialization – All Pages*.
  - Para cada evento abaixo: acionador *Evento personalizado* com o nome exato e
    tag *Evento do GA4* com o mesmo nome.

    | Evento (`dataLayer`) | Quando dispara | Evento-chave? |
    |---|---|---|
    | `whatsapp_click` | Clique em qualquer link do WhatsApp | ✅ |
    | `phone_click` | Clique em "Ligar" | ✅ |
    | `route_click` | Clique em rota (Maps/Waze) | ✅ |
    | `quote_submit` | Envio do orçamento rápido | ✅ |
    | `video_open` | Abrir um vídeo | — |
    | `map_open` | Carregar o mapa | — |

  - *Enviar* → publicar a versão.
- [ ] GA4 → *Administrador → Eventos*: marcar os 4 eventos-chave como **eventos-chave**
  (conversões). Eles aparecem cerca de 24 h após o primeiro disparo.
- [ ] GA4 → *Administrador → Links de produtos → Search Console*: vincular.
- [ ] **LGPD:** com GA4, adicionar um banner de consentimento. Opções: CookieYes
  (https://www.cookieyes.com, grátis até 1 domínio) instalado pelo GTM, com o
  *Consent Mode v2* ligado. A política de privacidade já existe em
  `politica-de-privacidade.html`; ela deve citar o GA4 depois da instalação.
- [ ] Opcional: **Meta Pixel** (https://business.facebook.com/events_manager) via GTM,
  para anúncios no Instagram. O `main.js` já dispara `Contact` no clique do
  WhatsApp quando o Pixel está presente.

### 5.4 Validações de qualidade

- [ ] **https://pagespeed.web.dev**: testar a home e `sofas-sao-jose-dos-campos.html` no
  **celular**. Metas: LCP < 2,5 s · INP < 200 ms · CLS < 0,1. Anotar abaixo.
- [ ] **https://search.google.com/test/rich-results**: testar a home, uma categoria e um guia.
  Deve reconhecer LocalBusiness, FAQ, Breadcrumb, Vídeo e Artigo.
- [ ] **https://validator.schema.org**: conferir o `FurnitureStore` sem erros.
- [ ] **https://www.opengraph.xyz**: conferir a prévia do link (WhatsApp, Facebook).

| Data | Página | LCP | INP | CLS | Nota mobile |
|---|---|---|---|---|---|
| | `/` | | | | |
| | `/sofas-sao-jose-dos-campos.html` | | | | |

---

## 6. Fase 3 — SEO local (é o que mais traz cliente para a loja)

### 6.1 Google Business Profile: https://business.google.com

É ele que coloca a loja no **mapa** e no bloco local ("loja de móveis perto de mim").

- [ ] Procurar "Ribeiro Móveis e Colchões" e **reivindicar** a ficha (pode existir uma
  criada automaticamente) ou criar uma. Verificação por vídeo (mostrando fachada,
  placa e interior), por telefone ou por carta.
- [ ] **Nome:** `Ribeiro Móveis e Colchões`, sem palavras-chave extras (isso é motivo de suspensão).
- [ ] **Endereço e telefone:** exatamente como no §0.
- [ ] **Categoria principal:** Loja de móveis. **Adicionais:** Loja de colchões, Loja de sofás
  e Loja de móveis sob medida (usar as que existirem na lista).
- [ ] **Horário:** seg–sex 9h–19h, sáb 9h–16h. Cadastrar os **horários especiais** de feriados.
- [ ] **Site** com UTM, para aparecer separado no GA4:
  `https://www.ribeiromoveisecolchoes.com.br/?utm_source=google&utm_medium=organic&utm_campaign=gbp`
- [ ] **WhatsApp / Chat:** ativar com (12) 98801-4039.
- [ ] **Atributos:** estacionamento no local, entrega, formas de pagamento (cartão e parcelamento).
- [ ] **Descrição** (pronta para colar):
  > A Ribeiro Móveis e Colchões é uma loja de móveis em São José dos Campos, em frente à portaria do Vale Sul Shopping. Trabalhamos com sofás retráteis, reclináveis e orgânicos, mesas de jantar, cadeiras, banquetas e poltronas, colchões premium, guarda-roupas, painéis para TV e móveis sob medida. Atendimento personalizado, preço justo, garantia, parcelamento no cartão, estacionamento no local e entrega e montagem cortesia. Fale com a gente pelo WhatsApp (12) 98801-4039.
- [ ] **Produtos:** cadastrar as 6 categorias do site, com foto e botão *Saiba mais*
  levando para a página correspondente.
- [ ] **Fotos:** no início, pelo menos 10 (logo, capa, fachada, entrada, showroom, equipe
  e produtos). Depois, fotos novas **todo mês**. Pode usar as de `assets/img/`.
- [ ] **Vídeos:** subir os reels de `assets/video/`.
- [ ] **Postagens:** 1 por semana (novidade, produto em destaque, condição especial),
  reaproveitando o Instagram.
- [ ] **Avaliações**, o fator local mais forte:
  - *Pedir avaliações* → copiar o link curto.
  - QR Code (https://www.qr-code-generator.com) impresso no balcão e na nota.
  - Mensagem padrão no WhatsApp **após a entrega**.
  - Responder **todas**, inclusive as negativas, em até 48 h.
  - Meta: 50 avaliações em 3 meses.
- [ ] **Perguntas e respostas:** cadastrar as perguntas do FAQ do site.
- [ ] Adicionar você como *Gerente* em *Pessoas e acesso*.

### 6.2 Outros mapas, redes e diretórios (mesmo NAP do §0 em todos)

| Site | O que fazer |
|---|---|
| **Apple Business Connect**: https://businessconnect.apple.com | Reivindicar a loja no Apple Maps (usuários de iPhone e da Siri) |
| **Bing Places**: https://www.bingplaces.com | *Import from Google Business Profile* |
| **Waze**: https://ads.waze.com (Waze Local, grátis) | Marcar o local e o horário da loja |
| **Facebook** da loja | **Corrigir o endereço e o telefone antigos**, horário, link do site com `?utm_source=facebook` |
| **Instagram** | Bio com endereço, botão de rota e link do site com `?utm_source=instagram` |
| **Threads** | Link do site na bio |
| **WhatsApp Business** | Perfil com endereço, horário, site e catálogo |
| **guiafacil.com** | **Corrigir o endereço antigo** ou pedir a remoção |
| Guia Mais, Apontador, Solutudo, Cybo, Encontra SJC | Cadastrar ou corrigir |
| **Reclame Aqui**: https://www.reclameaqui.com.br | Criar o perfil gratuito da empresa (confiança e backlink) |

### 6.3 Links locais (backlinks)

- [ ] Site do **Vale Sul Shopping** (lista de lojas do entorno ou parceiros), se houver.
- [ ] Arquitetos e designers de interiores de SJC: parceria com link "onde comprar".
- [ ] Fornecedores e marcas de colchões e sofás com página de "revendedores".
- [ ] Imprensa local: O Vale, Meon, Band Vale. Pauta sugerida: loja em frente ao shopping,
  entrega e montagem cortesia.
- [ ] Associação comercial (ACI SJC) e CDL, se a loja for associada.

---

## 7. Fase 4 — Conteúdo contínuo (a partir do mês 2)

Meta: **2 guias por mês**.

**Como criar um guia novo:**
1. Duplicar um `guia-*.html` existente com nome em palavras-chave, ex.:
   `guia-sofa-retratil-ou-sofa-cama.html`.
2. Trocar `<title>` (≤ 65 caracteres), `meta description` (≤ 160), `canonical`, `og:*`,
   `<h1>`, texto e o JSON-LD (`Article.headline`, `datePublished`, `dateModified`,
   `BreadcrumbList`).
3. Adicionar a URL em `sitemap.xml` (com `lastmod` = data de publicação),
   `guia-de-compra.html` e `llms.txt`.
4. Linkar o guia a partir da categoria relacionada, e vice-versa.
5. Search Console → *Inspeção de URL* → solicitar indexação.

**Pautas sugeridas:**
- Sofá retrátil ou sofá cama: qual escolher?
- Como escolher colchão de casal
- Tendências de sala de jantar (madeira, palhinha, bouclê)
- Móveis para varanda pequena
- Como organizar o guarda-roupa por categorias
- Painel ripado: combinações de cores
- Quanto custa um guarda-roupa planejado em São José dos Campos

**Regras:**
- Mudar o `lastmod` do sitemap **só** nas páginas que realmente mudaram.
  `lastmod` que muda sem mudança de conteúdo faz o Google parar de confiar no campo.
- Postar os vídeos também no **YouTube Shorts**, com "São José dos Campos" no
  título e o link do site na descrição.
- Mudou endereço, telefone ou horário? Atualizar **no mesmo dia**: todas as páginas
  (rodapé + JSON-LD), `llms.txt`, Business Profile e todos os diretórios do §6.2.

---

## 8. Acompanhamento mensal

| Fonte | Indicador |
|---|---|
| Search Console | Impressões, cliques, CTR e posição média por página. Acompanhar: "loja de móveis são josé dos campos", "sofá retrátil são josé dos campos", "colchões são josé dos campos", "mesa de jantar sjc" |
| Business Profile | Visualizações no Maps e na Busca, cliques em Ligar, Rota e Site, nº de avaliações e nota média |
| GA4 | Usuários orgânicos e eventos-chave (`whatsapp_click`, `phone_click`, `route_click`, `quote_submit`) por página |
| Loja | Perguntar no atendimento: "como conheceu a loja?" |

**Expectativa realista:** indexação em 1 a 3 semanas. Ganhos consistentes em buscas
locais entre 2 e 6 meses, e dependem mais das **avaliações** e da atividade no
Business Profile do que do próprio site.

---

## 9. Resumo: contas e sites necessários

| # | Site | Para quê | Fase |
|---|---|---|---|
| 1 | https://registro.br | Registrar o domínio (no CNPJ da loja) | 1 |
| 2 | https://dash.cloudflare.com | DNS, hospedagem (Pages), HTTPS, redirects, IndexNow | 1 |
| 3 | https://search.google.com/search-console | Indexação e relatório de buscas | 2 |
| 4 | https://www.bing.com/webmasters | Bing, ChatGPT Search, Copilot | 2 |
| 5 | https://analytics.google.com | Medição | 2 |
| 6 | https://tagmanager.google.com | Instalar as tags e os eventos | 2 |
| 7 | https://www.cookieyes.com | Banner de cookies (LGPD) | 2 |
| 8 | https://pagespeed.web.dev · https://search.google.com/test/rich-results · https://validator.schema.org | Validar performance e dados estruturados | 2 |
| 9 | https://business.google.com | Mapa e bloco local (**o mais importante**) | 3 |
| 10 | https://businessconnect.apple.com | Apple Maps | 3 |
| 11 | https://www.bingplaces.com | Bing Maps | 3 |
| 12 | https://ads.waze.com | Waze | 3 |
| 13 | Facebook, Instagram, Threads, WhatsApp Business | Corrigir o NAP e colocar o link do site | 3 |
| 14 | guiafacil, Guia Mais, Apontador, Solutudo, Reclame Aqui | Citações locais | 3 |
| 15 | https://business.facebook.com (opcional) | Meta Pixel | 2 |
| 16 | YouTube (canal da loja) | Shorts com os vídeos | 4 |

### Ordem de execução

1. Registrar o domínio → Cloudflare → publicar → validar (§4.4)
2. `Disallow: /ribeiro/` na Bia, depois o 301 da Bia para o domínio novo
3. Search Console + sitemap + pedir indexação
4. Business Profile (em paralelo com o item 3, pois a verificação demora dias)
5. GA4 + GTM + banner de cookies
6. Bing, Apple, Waze e correção do Facebook e do guiafacil
7. Rotina: avaliações toda semana, 1 post por semana no GBP, 2 guias por mês, relatório mensal
