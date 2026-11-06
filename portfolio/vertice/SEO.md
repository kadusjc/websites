# SEO do site da Vértice

Guia de operação do site. Tudo que precisa ser trocado no futuro está aqui.

---

## 0. As páginas do site

15 arquivos HTML, 13 indexáveis:

| URL | Alvo de busca |
|---|---|
| `/` | paisagismo (marca + termo principal) |
| `/servicos/` | serviços de paisagismo |
| `/servicos/projeto-de-paisagismo/` | projeto de paisagismo |
| `/servicos/execucao-e-plantio/` | execução de jardim, plantio |
| `/servicos/manutencao-de-jardins/` | manutenção de jardins, contrato mensal |
| `/servicos/jardins-verticais/` | jardim vertical natural e preservado |
| `/servicos/grama-e-gramados/` | troca e recuperação de gramado |
| `/servicos/vasos-kokedamas-e-terrarios/` | kokedama, terrário, árvore em vaso |
| `/paisagismo-em-sao-paulo/` | paisagismo em São Paulo + 9 cidades |
| `/paisagismo-em-uberlandia/` | paisagismo em Uberlândia + 8 cidades |
| `/projetos/` | portfólio |
| `/sobre/` | autoridade da marca |
| `/contato/` | orçamento de paisagismo |
| `/404.html` | — (noindex) |
| `/index-claro.html` | — (noindex, variante de tema) |

Cada página tem title, description, canonical, Open Graph e dados
estruturados próprios. Ao todo são 12 BreadcrumbList, 10 FAQPage, 8 Service
e mais 12 entidades — o FAQPage é o que faz as perguntas aparecerem
expansíveis direto no resultado do Google.

**Estrutura de arquivos:**

```
vertice/
  index.html, index-claro.html, 404.html
  servicos/            index.html + 6 subpastas
  paisagismo-em-sao-paulo/   index.html
  paisagismo-em-uberlandia/  index.html
  projetos/  sobre/  contato/
  assets/css/estilo.css      ← CSS de TODAS as páginas
  assets/css/tema-claro.css  ← só sobrescreve cores
  assets/js/vertice.js       ← JS de TODAS as páginas
  assets/fonts/              ← 3 fontes self-hosted
  img/                       ← WebP responsivo
```

O CSS e o JS são compartilhados: editar `assets/css/estilo.css` muda o site
inteiro, e o navegador baixa uma vez só para as 15 páginas.

---

## 1. Onde fica o domínio

O domínio aparece **226 vezes, em 17 arquivos**. Não edite um por um — use o
script:

```bash
cd bot/public/vertice
./trocar-dominio.sh https://verticepaisagismo.com.br/
```

Ele descobre sozinho quais arquivos citam o domínio, faz backup de cada um
preservando as subpastas, troca todos, e **falha em vez de terminar calado** se
sobrar qualquer referência ao endereço antigo. Rodando sem argumento, mostra o
domínio atual.

Se quiser conferir na mão, o domínio está em:

| Arquivo | O que tem |
|---|---|
| as 15 páginas `.html` | `canonical`, `og:url`, `og:image`, `twitter:image` e todos os `@id` / `url` do JSON-LD |
| `sitemap.xml` | `<loc>` das 13 páginas e das imagens |
| `robots.txt` | linha `Sitemap:` |

> O script antigo só trocava `index.html`, `index-claro.html`, `sitemap.xml` e
> `robots.txt` — 4 dos 17 arquivos. As 13 subpáginas continuariam apontando
> para o endereço antigo, o que manda o Google de volta para lá e joga fora a
> migração inteira. Corrigido e testado numa cópia: 226 ocorrências trocadas,
> 0 restantes, JSON-LD das 15 páginas ainda válido.

### Situação hoje

O site está em `https://souabia.com/vertice/`, servido de uma subpasta, e o
`robots.txt` que vale é o da raiz desse domínio — que hoje bloqueia `/vertice/`.

**Consequência prática: enquanto o site estiver nesse endereço, ele não
ranqueia.** Isso independe do trabalho feito aqui. Todo o SEO desta entrega é
on-page e portátil: passa a valer integralmente no dia em que o site ganhar
domínio próprio.

### No dia da migração

1. `./trocar-dominio.sh https://novo-dominio.com.br/`
2. Conferir que o `robots.txt` servido na raiz do novo domínio é o desta pasta
   (e não herda o bloqueio do endereço antigo).
3. Google Search Console: cadastrar a propriedade e enviar
   `https://novo-dominio.com.br/sitemap.xml`.
4. Google Meu Negócio: criar/reivindicar o perfil. É de longe o que mais traz
   cliente para paisagismo — busca local com mapa.
5. Atualizar o link na bio dos dois Instagram.
6. Se o endereço antigo já tinha tráfego, configurar redirect **301** do antigo
   para o novo. Sem isso a autoridade acumulada se perde.

---

## 2. O que falta preencher (com dado real)

### 2.1 Endereço físico — maior ganho isolado disponível

Endereço + coordenadas é o fator mais forte de SEO local: é o que coloca a
empresa no mapa e no pacote local do Google.

No `index.html`, procure o comentário grande antes do `<script type="application/ld+json">`.
Ele já tem o trecho pronto para colar, com instruções. Preencha também as
metatags `geo.position` / `ICBM` no `<head>`.

### 2.2 Lista de cidades

**É um chute informado e precisa da sua confirmação.** As 17 cidades foram
deduzidas das regiões que o site já citava. É o que faz o Google associar a
Vértice a buscas como "paisagismo em Jacareí".

A lista aparece em **4 lugares** e os quatro têm que bater:
1. `index.html`, seção `id="areas"`
2. `index.html`, bloco `areaServed` do JSON-LD
3. `paisagismo-em-sao-paulo/index.html` (lista visível + `areaServed`)
4. `paisagismo-em-uberlandia/index.html` (lista visível + `areaServed`)

### 2.3 Fotos que não batem com o rótulo

Na seção "Para quem trabalhamos" da home, as quatro fotos estão rotuladas
como Residências / Condomínios / Empresas / Chácaras, mas as imagens são:
duas repetidas de outros projetos, uma parede de samambaia e um pátio
tropical. Nenhuma mostra área comum de condomínio ou fachada de empresa.

Corrigi os textos alternativos para descreverem o que a foto realmente
mostra — mas **o ideal é a Vértice mandar uma foto real de cada segmento.**
Foto de condomínio na página de condomínio converte mais e ranqueia melhor.

Pelo mesmo motivo, a página de gramados usa a única foto do acervo que
mostra gramado de fato.

### 2.4 Avaliações

Não inventei `aggregateRating` no JSON-LD. Estrelinha falsa na busca é
penalização certa quando o Google cruza com o Google Meu Negócio. Quando o
perfil tiver avaliações reais, dá para adicionar — e aí aparecem as estrelas
no resultado de busca.

### 2.5 Medição de conversão — falta só colar a tag

O site já dispara os eventos abaixo. Eles só precisam de uma tag para escutar:
cole o `gtag.js` do Google Analytics ou do Google Ads no `<head>` das 15
páginas e tudo começa a chegar sozinho, sem mexer em mais nada.

| Evento | Quando dispara |
|---|---|
| `gerar_lead` | formulário enviado — **é a conversão que vale** |
| `clique_whatsapp` | clique que abre mesmo uma conversa (`wa.me`) |
| `clique_cta` | botão interno que leva ao formulário/contato |
| `ligar` | clique no telefone |
| `whatsapp_bloqueado` | o navegador impediu a abertura do WhatsApp (ver 2.6) |

Todo evento vai carimbado com a origem da visita (`utm_source`, `utm_medium`,
`utm_campaign`, `gclid`, `fbclid`). O site guarda os UTMs da **primeira** página
aberta na sessão, porque o parâmetro do anúncio só existe na primeira URL — daí
em diante ele some. Isso é o que liga o gasto de mídia ao cliente fechado.

A mesma origem entra no **texto da mensagem do WhatsApp**, no rodapé: a Vértice
lê na conversa de qual campanha e de qual botão aquele cliente veio.

Sem a tag, você não sabe qual botão converte nem quanto custa um cliente.

### 2.6 Por que o formulário agora avisa quando falha

O formulário monta a mensagem e abre o WhatsApp. O navegador embutido do
Instagram e do Facebook costuma **bloquear** essa abertura — e é exatamente de
lá que vem o tráfego da Vértice.

Antes, quando isso acontecia, o cliente via "Pronto!", achava que tinha enviado,
e o lead sumia. Agora o site detecta o bloqueio, avisa que a mensagem **não** foi
enviada e mostra um botão grande com a conversa já preenchida.

**Limite honesto:** o site é HTML puro, sem servidor. Se o cliente fechar a
página nesse ponto, não há registro em lugar nenhum. A única forma de nunca
perder um lead seria um formulário com backend — hoje fora do escopo.

### 2.7 Prova social — a maior lacuna de conversão que sobrou

O site inteiro não tem **um único depoimento**. Nenhum nome de cliente, nenhuma
avaliação, nenhuma frase de quem contratou.

A Vértice tem +10 anos, OAB-SJC e ExpoGarden — e nada disso é a voz de um
cliente. Em serviço de alto ticket, comprado por confiança, depoimento é o
elemento que mais aumenta conversão.

Peça seis, com **nome, cidade e bairro** ("Ana P., Jacareí"). Eles fazem dois
trabalhos ao mesmo tempo: convencem, e criam menção textual das cidades-alvo.
Marcados como `Review` no JSON-LD, viram estrela no resultado de busca assim
que o Google Meu Negócio existir (ver 2.4).

### 2.8 Faixa de preço — o filtro que falta

Não há nenhum "a partir de" no site, e o FAQ responde "quanto custa" com
*depende*.

Quem pesquisa paisagismo está comparando 3 ou 4 fornecedores. Sem nenhuma
âncora de valor a Vértice é descartada por quem presume que vai ser caro, **e**
recebe pedido de orçamento de quem tinha R$ 800 no bolso — gastando o recurso
mais caro da operação, que é deslocar equipe para a visita técnica.

Uma faixa honesta ("manutenção mensal a partir de R$ X", "projeto residencial
a partir de R$ Y") qualifica o lead antes da visita. É decisão comercial da
Vértice, não de código.

### 2.9 Telefone de MG para cliente de SP

Todos os contatos do site usam **(34)**, DDD de Uberlândia. Um cliente em
Barueri lendo "paisagismo em São Paulo" vê telefone de outro estado. É atrito
pequeno, mas no momento exato da decisão. Um número SP (mesmo virtual,
redirecionado para o mesmo WhatsApp) na página de São Paulo resolve.

---

## 3. O que foi feito

### Indexação e resultados enriquecidos
- Title e description reescritos com a palavra-chave na frente
  (`Paisagismo e Jardinagem em SP e Uberlândia`), dentro do limite de corte
  do Google.
- JSON-LD reescrito como `@graph` com 5 entidades: `LandscapingBusiness`
  (com catálogo dos 6 serviços e 17 cidades), `WebSite`, `WebPage`,
  `ImageObject` e **`FAQPage`**.
  O `FAQPage` é o de maior retorno: faz as 6 perguntas aparecerem expansíveis
  direto no resultado da busca, ocupando muito mais espaço na tela.
- `canonical`, Open Graph completo e Twitter Card completo — o link deixa de
  aparecer "pelado" no WhatsApp e no Instagram.
- **Uma imagem de compartilhamento própria por página** (`img/og-*.jpg`, todas
  1200×630 com `width`/`height`/`alt` declarados). Antes, 3 páginas apontavam
  para arquivo inexistente (preview sem foto) e outras 8 usavam WebP em formato
  retrato — o WhatsApp não renderiza WebP de forma confiável, e 900×1200 corta
  no meio. Fotos retrato viram card com a foto inteira sobre fundo desfocado,
  em vez de corte que decapita quem aparece nela.
- `index-claro.html` marcado como `noindex, follow`: era conteúdo duplicado
  competindo com a página principal. O `robots.txt` **não** bloqueia essa página
  nem a 404: bloquear impede o Google de baixar o arquivo, e sem baixar ele
  nunca lê o `noindex` — a URL acabava indexada assim mesmo, sem título. Os dois
  juntos se anulam; só o `noindex` funciona.
- `geo.region` é metatag de valor único. A home declarava SP **e** MG, então o
  segundo par era descartado. A home não declara mais nenhum: o sinal geográfico
  ficou nas páginas de cidade (um par correto, com coordenadas, em cada) e no
  `areaServed` do JSON-LD.
- `sitemap.xml` com extensão de imagens (as 6 fotos de projeto entram na busca
  por imagens) e `robots.txt`, prontos para o domínio próprio.
- Seção "áreas atendidas" com 17 cidades — conteúdo real para as buscas
  "paisagismo em <cidade>", que é como o cliente procura.
- H1 passou a conter a palavra "paisagismo", que antes não aparecia nele.

### Performance (Core Web Vitals — critério de ranqueamento do Google)

Medido com Chromium, carregamento completo da home:

| | Antes | Depois |
|---|---|---|
| Mobile | 572 KB | **319 KB** (−44%) |
| Mobile — imagens | 316 KB | **55 KB** (−83%) |
| Desktop | 907 KB | **575 KB** (−37%) |
| LCP mobile | 452 ms | **120 ms** |

- Todas as fotos convertidas para **WebP** em 3–4 tamanhos, com `srcset` e
  `sizes` calculados a partir do layout real. O celular baixa a versão de
  320 px em vez do JPEG de 1600 px.
- Fontes **self-hosted** (`assets/fonts/`, subset latin, variable): elimina
  duas conexões externas e o CSS bloqueante do Google Fonts. Conferido: as
  métricas batem pixel a pixel com a versão anterior.
- `preload` do hero com `imagesrcset` — o navegador começa a baixar a imagem
  principal antes de ler o CSS.
- `width`/`height` em todas as imagens: elimina o pulo de layout (CLS).
- Tudo abaixo da dobra com `loading="lazy"` e `decoding="async"`.
- A lightbox só baixa a foto grande quando alguém clica.

### Acessibilidade (o Google usa como sinal, e amplia o público)
- Link "pular para o conteúdo".
- `<main id="conteudo">` — a página não tinha landmark principal.
- Galeria com `role="button"` e `aria-label`: antes era `tabindex` solto, que
  o leitor de tela não anunciava como clicável.
- Lightbox com foco preso dentro dela e devolvido ao elemento de origem ao
  fechar.
- Textos alternativos reescritos: descrevem a foto e usam vocabulário de
  busca, em vez de "Paisagismo residencial".

### Outros
- Favicons de verdade (16/32/180/192/512) e `site.webmanifest` — antes o ícone
  era um JPEG de 150px, que vários navegadores ignoram.
- Honeypot anti-spam no formulário.
- Ganchos de conversão em todos os CTAs, com o evento certo para cada tipo de
  botão. Antes, todo CTA disparava `clique_whatsapp` — inclusive os que só
  rolam a página até o formulário. Metade dos "cliques no WhatsApp" seria
  clique em âncora interna, e a campanha seria otimizada em cima de número
  falso.
- O evento sai por `gtag` **ou** por `dataLayer`, nunca pelos dois. Com GTM
  instalado encaminhando para o GA4, mandar nos dois canais contava cada
  conversão duas vezes.

---

## 4. Uma checagem de servidor

O HTML tem 91 KB crus e 22 KB comprimidos. Conferido em 18/09/2026: a
hospedagem atual **já envia comprimido**. Se o site mudar de hospedagem, vale
refazer a checagem — é o ganho mais barato que existe:

```bash
curl -sI -H 'Accept-Encoding: gzip' <URL-DO-SITE> | grep -i content-encoding
```

Se não voltar `content-encoding: gzip` (ou `br`), ative a compressão no
servidor ou ponha um CDN na frente. É configuração de hospedagem, não do site.

---

## 5. Regenerar os arquivos

**Imagens** (só se trocar alguma foto): as variantes WebP em `img/` foram
geradas com `sharp`, cada foto em 3–4 larguras com `quality: 74`.

**Cabeçalho e rodapé** são repetidos nas 15 páginas (HTML puro, sem build).
Mudou um link do menu? Tem que mudar nas 15. É o custo de não ter build step
— e é a mesma convenção do site da lavanderia neste repositório.

**Imagens de compartilhamento** (`img/og-*.jpg`): geradas por `gerar-og.py`.

```bash
cd bot/public/vertice
python3 gerar-og.py        # requer Pillow: pip install Pillow
```

Rode só se trocar alguma foto de origem. O mapa de qual foto vira o card de
qual página está no topo do script, junto com o ajuste de enquadramento.

**`index-claro.html`**: cópia do `index.html` que só carrega o `tema-claro.css`
a mais. **Não é linkada de lugar nenhum do site** — não há troca de tema na
interface. Hoje ela só custa manutenção: se editar o `index.html`, tem que
replicar no claro. Se ninguém for usar esse tema, apagar o arquivo elimina o
risco de as duas versões divergirem.

**Validar depois de qualquer mudança:**
- Dados estruturados: https://search.google.com/test/rich-results
- Imagem de compartilhamento: https://developers.facebook.com/tools/debug/
  (cole o link e clique em *Scrape Again* — o Facebook e o WhatsApp guardam
  cache da versão antiga)
- Performance: https://pagespeed.web.dev/
