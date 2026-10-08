#!/usr/bin/env bash
#
# Troca o domínio do site da Vértice em todos os arquivos de uma vez.
#
#   ./trocar-dominio.sh https://verticepaisagismo.com.br/
#
# Atualiza canonical, og:url, twitter, todos os @id do JSON-LD, o
# sitemap.xml e o robots.txt. Faz backup antes e mostra o que mudou.
#
set -euo pipefail
cd "$(dirname "$0")"

NOVO="${1:-}"
if [ -z "$NOVO" ]; then
  echo "Uso: ./trocar-dominio.sh https://seu-dominio.com.br/"
  echo
  echo "Domínio atual no site:"
  grep -o 'rel="canonical" href="[^"]*"' index.html || true
  exit 1
fi

# normaliza: garante exatamente uma barra no fim
NOVO="${NOVO%/}/"

ATUAL="$(grep -o 'rel="canonical" href="[^"]*"' index.html \
         | head -1 | sed 's/.*href="//; s/"$//')"

if [ -z "$ATUAL" ]; then
  echo "ERRO: não achei o canonical em index.html. Abortando."
  exit 1
fi

if [ "$ATUAL" = "$NOVO" ]; then
  echo "O site já aponta para $NOVO. Nada a fazer."
  exit 0
fi

echo "De:   $ATUAL"
echo "Para: $NOVO"
echo

# TODOS os arquivos com URL absoluta — não só os da raiz. Cada uma das 15
# páginas tem canonical, og:url, og:image e @id do JSON-LD apontando para o
# domínio; deixar as subpáginas de fora manda o Google de volta ao endereço
# antigo e joga fora a migração inteira.
mapfile -t ARQUIVOS < <(
  grep -rl "$ATUAL" \
    --include='*.html' --include='*.xml' --include='*.txt' --include='*.webmanifest' \
    . | sed 's#^\./##' | sort
)

if [ "${#ARQUIVOS[@]}" -eq 0 ]; then
  echo "ERRO: nenhum arquivo contém $ATUAL. Abortando."
  exit 1
fi

ANTES="$(grep -ro "$ATUAL" \
  --include='*.html' --include='*.xml' --include='*.txt' --include='*.webmanifest' \
  . | wc -l)"

echo "${#ARQUIVOS[@]} arquivos, $ANTES ocorrências:"
printf '  %s\n' "${ARQUIVOS[@]}"
echo

BACKUP="backup-dominio-$(date +%Y%m%d-%H%M%S)"
for f in "${ARQUIVOS[@]}"; do
  mkdir -p "$BACKUP/$(dirname "$f")"
  cp "$f" "$BACKUP/$f"
done
echo "Backup em $BACKUP/"

for f in "${ARQUIVOS[@]}"; do
  sed -i "s#${ATUAL}#${NOVO}#g" "$f"
done

# remove os avisos que só faziam sentido enquanto o site morava numa
# subpasta de outro domínio — depois da migração viram texto desatualizado
sed -i '/NOTA-TRANSICAO/,/FIM-NOTA-TRANSICAO/d' sitemap.xml robots.txt

SOBROU="$(grep -ro "$ATUAL" \
  --include='*.html' --include='*.xml' --include='*.txt' --include='*.webmanifest' \
  . | grep -v "^./$BACKUP/" | wc -l)"

echo
echo "Trocadas: $ANTES · Restantes do domínio antigo: $SOBROU"
if [ "$SOBROU" -ne 0 ]; then
  echo "ATENÇÃO: sobrou referência ao domínio antigo. Confira antes de publicar."
  exit 1
fi

cat <<AVISO

Pronto. Agora, fora do código:

  1. Confirme que o robots.txt servido em ${NOVO}robots.txt é o desta
     pasta. Se o site ainda estiver numa subpasta, quem vale é o
     robots.txt da raiz daquele domínio — e ele não pode bloquear o
     caminho do site.

  2. Google Search Console: cadastre o novo domínio e envie
     ${NOVO}sitemap.xml

  3. Se o site já estava indexado no endereço antigo, configure
     redirect 301 do antigo para o novo — sem isso a autoridade
     acumulada se perde.

  4. Atualize o link na bio dos dois Instagram da Vértice.

AVISO
