# Catálogo Tecnoway

O catálogo público fica em `content/products.json`. A tela administrativa fica em `https://fcsoftware.com.br/tecnoway/admin/`; os produtos, textos, contatos, links e imagens do site são gravados nos arquivos de conteúdo do repositório `kadusjc/websites`, branch `main`. O GitHub Pages publica as alterações aprovadas automaticamente.

## Login do cliente

O CMS usa Netlify Identity para autenticar por e-mail e senha, e Git Gateway para acessar o repositório. O site público e o domínio `fcsoftware.com.br` continuam no GitHub Pages. O Netlify serve uma cópia de Tecnoway e o painel em um endereço `*.netlify.app`, apenas para o CMS e a autenticação; não altere o DNS do domínio de produção.

Para criar o site de administração no Netlify:

1. Entre em Netlify com sua conta GitHub e importe o repositório `kadusjc/websites`.
2. Configure **Base directory** como `tecnoway`, deixe **Build command** vazio e use `.` como **Publish directory**.
3. Depois do primeiro deploy, em **Identity**, ative o serviço e mantenha o cadastro somente por convite.
4. Em **Identity > Services**, ative **Git Gateway** para o repositório conectado.
5. Convide o e-mail do cliente em **Identity > Users**. O cliente recebe o convite e define a própria senha; não compartilhe sua conta.
6. Abra o painel no endereço Netlify do site, em `/admin/`.

O formulário do CMS inclui produtos, textos, contatos, links e imagens. As imagens são gravadas em `tecnoway/assets/products`; o site público no GitHub Pages as exibe após a publicação.

## Aprovação antes de publicar

O CMS mantém `editorial_workflow`, que organiza as alterações em propostas/PRs. Para garantir que o cliente não publique sem sua aprovação, proteja a branch `main` no GitHub: em **Settings > Branches** (ou **Rulesets**), exija pull request e pelo menos uma aprovação antes do merge. Inclua administradores na regra e não permita bypass para a integração do Netlify. Você revisa e aprova o PR; o merge na `main` dispara a publicação normal do GitHub Pages.

Sem a proteção da `main`, o Git Gateway pode gravar no repositório em nome do serviço. Não considere o workflow do CMS, sozinho, uma barreira de segurança para publicação.