# Catálogo Tecnoway

O catálogo público fica em `content/products.json`. A tela administrativa fica em `https://fcsoftware.com.br/tecnoway/admin/`; os produtos, textos, contatos, links e imagens do site são gravados nos arquivos de conteúdo do repositório `kadusjc/websites`, branch `main`. O GitHub Pages publica as alterações aprovadas automaticamente.

## Autenticação obrigatória

O GitHub Pages serve apenas arquivos estáticos e não pode guardar o segredo exigido pelo OAuth do GitHub. Por isso, antes do primeiro login, é necessário hospedar um proxy OAuth em um serviço externo (por exemplo, Netlify ou Cloudflare) e criar uma GitHub OAuth App para esse proxy. Não coloque o client secret no `config.yml` nem em arquivos públicos.

O Decap não cria usuários nem senhas próprias. Qualquer pessoa pode abrir a URL do painel e iniciar uma tentativa de login, mas só uma conta GitHub com permissão de escrita no repositório consegue publicar alterações. Para limitar a uma pessoa, conceda escrita apenas à conta GitHub dessa pessoa e não compartilhe a conta. O `auth_scope: public_repo` reduz o escopo do token a repositórios públicos, mas não substitui as permissões de acesso do GitHub.

Não use senhas pessoais no HTML, JavaScript ou YAML: esses arquivos são públicos no GitHub Pages. Se for obrigatório usar usuário e senha próprios, será necessário um serviço de autenticação e backend seguros; o Decap estático não oferece esse tipo de conta local.

## Edição pelo cliente com publicação aprovada

O painel está configurado com `open_authoring` e `editorial_workflow`. O cliente entra com a própria conta GitHub e pode propor alterações sem receber permissão de escrita direta no repositório. As alterações chegam como proposta/PR; você revisa e faz o merge na `main`. Só então o GitHub Pages publica a versão aprovada.

Para convidar o cliente, envie a URL do painel e peça que use a própria conta GitHub. Como o repositório é público, ele poderá fazer uma proposta sem ser colaborador; a conta OAuth ainda precisa ser configurada. Não conceda acesso de escrita se a intenção é manter a publicação sob sua aprovação.

O formulário do CMS oferece a coleção de produtos e os campos de conteúdo das seções do site. As imagens selecionadas são enviadas para `tecnoway/assets/products`.

Depois de publicar o proxy:

1. Configure na GitHub OAuth App a URL de callback informada pelo serviço do proxy e restrinja o acesso ao repositório `kadusjc/websites` sempre que a implementação permitir.
2. Configure o proxy com o Client ID e o Client Secret da OAuth App e permita o domínio `fcsoftware.com.br` como origem.
3. Troque `https://YOUR-OAUTH-PROXY-DOMAIN` em `admin/config.yml` pela origem HTTPS do proxy, sem barra final, e publique essa alteração.
4. Acesse `/tecnoway/admin/` e entre com uma conta GitHub que possa gravar na branch `main`.

Sem essa configuração externa, o painel estático carrega, mas o login não consegue autenticar. O site público e o catálogo continuam hospedados no GitHub Pages.