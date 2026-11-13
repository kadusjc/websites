# Frienzi Festas — site institucional

Site responsivo estático em HTML, CSS e JavaScript, preparado para hospedagem simples (GitHub Pages, hospedagem tradicional ou CDN).

## Arquivos
- `index.html`: conteúdo, SEO básico, links de contato e estrutura acessível.
- `styles.css`: identidade visual responsiva e componentes.
- `script.js`: menu mobile e ano automático.
- `assets/`: imagens convertidas para WebP e logo original em PNG.

## Antes de publicar
1. Confirme com a cliente o número de WhatsApp usado no site: **(12) 99635-7532**. Esse número foi lido do material visual fornecido.
2. Confirme cidades/raio de atendimento, serviços disponíveis, sabores, quantidades mínimas e condições de locação.
3. Adicione o domínio definitivo e, se houver, os perfis oficiais de Instagram/Facebook.
4. Para SEO local avançado, inclua endereço público (se houver), horário de atendimento e dados comerciais confirmados.
5. Teste links de WhatsApp e Facebook no celular e computador.

## Desempenho
As fotos principais foram convertidas para WebP e redimensionadas para no máximo 1200 px de largura (logo: 720 px). Imagens fora da primeira dobra usam `loading="lazy"`. O site não usa bibliotecas JavaScript de terceiros. As fontes são carregadas do Google Fonts; se preferir independência total, remova o link de fontes do cabeçalho e use as fontes de sistema no CSS.

## Personalização
- Cores: variáveis CSS no início de `styles.css`.
- WhatsApp: procure por `5512996357532` e substitua pelo número oficial no formato internacional sem `+`, espaços ou traços.
- Textos e serviços: edite diretamente `index.html`.
- A imagem `assets/logo-frienzi-original.png` preserva o logo recebido para futura troca por uma versão transparente de maior qualidade.
