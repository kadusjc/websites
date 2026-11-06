#!/usr/bin/env python3
"""
Gera as imagens de compartilhamento (Open Graph) do site — img/og-*.jpg.

São as fotos que aparecem quando alguém cola um link do site no WhatsApp,
no Instagram ou no Facebook. Precisam ser JPEG 1200x630: WebP não renderiza
de forma confiável nesses apps, e qualquer outra proporção corta no meio.

Uso:
    cd bot/public/vertice
    python3 gerar-og.py

Só precisa rodar se trocar alguma das fotos de origem listadas em CARDS.
Depois de rodar, confira os arquivos gerados em img/ antes de publicar.

Requer Pillow:  pip install Pillow
"""

from PIL import Image, ImageFilter, ImageEnhance
import os
import sys

W, H = 1200, 630

# página do site -> (foto de origem na raiz, viés vertical do corte)
# O viés só vale para fotos em paisagem: 0 = corta pelo topo, .5 = centro,
# 1 = corta pela base. Ajuste se o corte pegar mal o assunto da foto.
CARDS = {
    'og-servicos.jpg':                    ('projeto-06.jpg', .50),
    'og-projeto-de-paisagismo.jpg':       ('projeto-01.jpg', .50),
    'og-execucao-e-plantio.jpg':          ('projeto-05.jpg', .50),
    'og-manutencao-de-jardins.jpg':       ('depois.jpg',     .50),
    'og-jardins-verticais.jpg':           ('projeto-02.jpg', .50),
    'og-grama-e-gramados.jpg':            ('projeto-06.jpg', .58),
    'og-vasos-kokedamas-e-terrarios.jpg': ('projeto-04.jpg', .50),
    'og-projetos.jpg':                    ('projeto-01.jpg', .45),
    'og-sobre.jpg':                       ('equipe.jpg',     .45),
    'og-sao-paulo.jpg':                   ('projeto-01.jpg', .55),
    'og-uberlandia.jpg':                  ('projeto-06.jpg', .45),
}

# Abaixo desta proporção a foto é retrato demais para cortar: um corte de
# 1200x630 numa foto 900x1200 decapita quem aparece nela. Nesses casos a
# foto entra inteira sobre um fundo desfocado dela mesma.
LIMITE_CORTE = 1.30


def cobrir(im, w, h, vies=.5):
    """Corta a imagem para preencher exatamente w x h, sem distorcer."""
    iw, ih = im.size
    if iw / ih > w / h:
        nw = int(ih * w / h)
        x = int((iw - nw) * .5)
        caixa = (x, 0, x + nw, ih)
    else:
        nh = int(iw * h / w)
        y = int((ih - nh) * vies)
        caixa = (0, y, iw, y + nh)
    return im.crop(caixa).resize((w, h), Image.LANCZOS)


def main():
    if not os.path.isdir('img'):
        sys.exit('Rode este script de dentro da pasta do site (bot/public/vertice).')

    for saida, (origem, vies) in CARDS.items():
        if not os.path.exists(origem):
            print(f'  ! {origem} não encontrada — pulando {saida}')
            continue

        im = Image.open(origem).convert('RGB')
        iw, ih = im.size

        if iw / ih >= LIMITE_CORTE:
            card = cobrir(im, W, H, vies)
            modo = 'corte'
        else:
            fundo = cobrir(im, W, H, .5).filter(ImageFilter.GaussianBlur(28))
            fundo = ImageEnhance.Brightness(fundo).enhance(.62)
            escala = H / ih
            fw = int(iw * escala)
            fundo.paste(im.resize((fw, H), Image.LANCZOS), ((W - fw) // 2, 0))
            card = fundo
            modo = 'blur-fill'

        destino = os.path.join('img', saida)
        card.save(destino, 'JPEG', quality=82, optimize=True, progressive=True)
        print(f'  {saida:38} <- {origem:16} {modo:10} {os.path.getsize(destino)//1024:>4} KB')

    print('\nPronto. Confira as imagens em img/ e valide um link em:')
    print('  https://developers.facebook.com/tools/debug/')


if __name__ == '__main__':
    main()
