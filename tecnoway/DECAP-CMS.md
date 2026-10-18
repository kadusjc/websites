# CMS Tecnoway (Decap CMS + DecapBridge)

O site é estático e fica no GitHub Pages (hoje no repositório `kadusjc/websites`, pasta `tecnoway/`, domínio `fcsoftware.com.br`). Todo o conteúdo editável está em dois arquivos JSON e numa pasta de imagens:

| O quê | Onde |
|---|---|
| Produtos (código, nome, categoria, preço, foto, ativo) | `tecnoway/content/products.json` |
| Textos, contatos, links, logo, galeria | `tecnoway/content/site.json` |
| Imagens enviadas pelo painel | `tecnoway/assets/products/` |

O painel administrativo é o Decap CMS em `https://fcsoftware.com.br/tecnoway/admin/`. O login do cliente (e-mail e senha) é feito pelo **DecapBridge** (`decapbridge.com`), um serviço de autenticação criado para substituir o Netlify Identity. Ele grava no repositório usando um token do GitHub que só você conhece; o cliente **não** precisa de conta GitHub nem de Netlify.

## Configuração inicial (você faz uma vez)

1. **Token do GitHub.** Em `github.com/settings/personal-access-tokens`, crie um token *fine-grained* restrito ao repositório `kadusjc/websites` com permissões:
   - *Contents*: Read and write
   - *Pull requests*: Read and write (necessário para o fluxo de aprovação)
2. **Conta no DecapBridge.** Crie uma conta em `https://decapbridge.com` (plano gratuito cobre 3 sites e 10 colaboradores por site).
3. **Adicionar site** no painel do DecapBridge:
   - Git provider: **GitHub**
   - Repository: `kadusjc/websites`
   - Access token: o token do passo 1
   - Decap CMS login URL: `https://fcsoftware.com.br/tecnoway/admin/index.html`
   - Auth type: **Classic** (login com e-mail e senha dentro do painel)
4. **Copiar o SITE_ID.** O DecapBridge mostra um template de `config.yml`. Copie apenas o ID que aparece em `identity_url: https://auth.decapbridge.com/sites/<ID>` e substitua `SITE_ID` em `tecnoway/admin/config.yml`. O restante do arquivo já está pronto; não copie o template inteiro.
5. **Publicar.** Faça commit e push. Aguarde o GitHub Pages atualizar e abra `https://fcsoftware.com.br/tecnoway/admin/`.
6. **Convidar o cliente.** No DecapBridge, aba **Manage collaborators**, informe o e-mail do cliente. Ele recebe um link, define a própria senha e passa a entrar direto pelo `/admin/`. Para remover o acesso, basta excluir o colaborador no mesmo lugar.

## Como o cliente usa

1. Acessa `https://fcsoftware.com.br/tecnoway/admin/` e entra com e-mail e senha.
2. Em **Catálogo > Produtos**, adiciona, edita ou remove peças. O campo **Foto** aceita upload direto do computador ou celular.
3. Em **Catálogo > Conteúdo do site**, altera textos, telefone, WhatsApp, endereço, links, logo e galeria.
4. Clica em **Salvar**. A alteração entra no fluxo de aprovação (abaixo).

## Aprovação antes de publicar

O `config.yml` usa `publish_mode: editorial_workflow`: cada alteração salva vira um pull request no GitHub. No painel do CMS, a aba **Fluxo de trabalho** mostra os cards em *Rascunho*, *Em revisão* e *Pronto*. Quando o card é movido para *Pronto* e alguém clica em **Publicar**, o PR é mesclado na `main` e o GitHub Pages publica.

Para garantir que só você aprova, proteja a branch `main` no GitHub (**Settings > Branches** ou **Rulesets**): exigir pull request com pelo menos uma aprovação, incluindo administradores. Assim o botão **Publicar** do cliente falha até você aprovar o PR no GitHub.

Se preferir que o cliente publique direto, sem revisão, remova a linha `publish_mode: editorial_workflow` do `config.yml`. Nesse caso a permissão *Pull requests* do token deixa de ser necessária.

## Testar o painel localmente (sem login)

Na raiz do repositório `websites`:

```bash
npm start      # terminal 1: serve o site em http://localhost:3000
npm run cms    # terminal 2: backend local do Decap (porta 8081)
```

Abra `http://localhost:3000/tecnoway/admin/`. Com `local_backend: true` no `config.yml`, o Decap detecta que está em `localhost` e grava direto nos arquivos da sua máquina, sem pedir login nem tocar no GitHub. Localmente não existe fluxo de aprovação: o Decap avisa no console que o servidor local só suporta o modo simples e salva direto. Em produção essa opção é ignorada.

## Quando o site for para um repositório próprio

1. Mova o conteúdo da pasta `tecnoway/` para a raiz do novo repositório.
2. Em `admin/config.yml`, ajuste `repo`, remova o prefixo `tecnoway/` de `media_folder`, dos `file:` das coleções e de `public_folder` (ex.: `/assets/products`).
3. Nos JSONs de conteúdo, troque caminhos `/tecnoway/assets/...` por `/assets/...`.
4. No DecapBridge, crie um novo site apontando para o novo repositório (com um token restrito a ele) e atualize `identity_url` com o novo SITE_ID. Convide o cliente novamente.
