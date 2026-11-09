#!/usr/bin/env python3
"""
La Casa Planejados · otimizador de imagens
Baixa o logo e as fotos do site atual e gera versões WebP leves
em 3 larguras (480, 960 e 1600 px), usadas automaticamente pelo site.

Uso:  python otimizar-imagens.py
      python otimizar-imagens.py --pasta fotos-novas   (converte fotos que você já tem)
Requer: Python 3.8+ e Pillow (instalado automaticamente se faltar).
"""
import io, os, sys, subprocess, urllib.request, argparse

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Instalando Pillow (só na primeira vez)...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "pillow"])
    from PIL import Image, ImageOps

LARGURAS = (480, 960, 1600)
QUALIDADE = 76
RAIZ = os.path.dirname(os.path.abspath(__file__))


def kb(n): return f"{n/1024:.0f} KB"


def salvar_webp(img, destino, largura, qualidade=QUALIDADE):
    w, h = img.size
    if w > largura:
        img = img.resize((largura, round(h * largura / w)), Image.LANCZOS)
    img.save(destino, "WEBP", quality=qualidade, method=6)
    return os.path.getsize(destino)


def preparar(dados):
    img = Image.open(io.BytesIO(dados))
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "transparency" in img.info or img.mode in ("P", "LA") else "RGB")
    return img


def processar(base, dados):
    """base = caminho sem extensão, ex.: img/projetos/cozinha"""
    destino_base = os.path.join(RAIZ, base)
    os.makedirs(os.path.dirname(destino_base), exist_ok=True)
    img = preparar(dados)
    original = len(dados)

    if base.endswith("logo"):
        # Logo: WebP leve para o site + PNG para ícone do celular
        total = salvar_webp(img, destino_base + ".webp", 320, 90)
        png = img.copy(); png.thumbnail((180, 180), Image.LANCZOS)
        png.save(destino_base + ".png", optimize=True)
        print(f"  ✔ {base}.webp  {kb(original)} → {kb(total)}")
        return original, total

    if img.mode == "RGBA":
        fundo = Image.new("RGB", img.size, (255, 255, 255)); fundo.paste(img, mask=img.split()[3]); img = fundo
    total = 0
    for larg in LARGURAS:
        total += salvar_webp(img, f"{destino_base}-{larg}.webp", larg)
    medio = os.path.getsize(f"{destino_base}-960.webp")
    print(f"  ✔ {base}  {kb(original)} → {kb(medio)} (versão 960 px)")
    return original, medio


def baixar(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (otimizador La Casa)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pasta", help="converter imagens desta pasta em vez de baixar (saída em img/extras/)")
    a = ap.parse_args()
    antes = depois = ok = falhas = 0

    if a.pasta:
        for nome in sorted(os.listdir(a.pasta)):
            if not nome.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic")):
                continue
            base = "img/extras/" + os.path.splitext(nome)[0].lower().replace(" ", "-")
            try:
                with open(os.path.join(a.pasta, nome), "rb") as f:
                    o, d = processar(base, f.read())
                antes += o; depois += d; ok += 1
            except Exception as e:
                print(f"  ✘ {nome}: {e}"); falhas += 1
    else:
        print("Baixando e convertendo as imagens do site atual...\n")
        with open(os.path.join(RAIZ, "imagens.txt"), encoding="utf-8") as f:
            for linha in f:
                linha = linha.strip()
                if not linha or linha.startswith("#"):
                    continue
                base, url = linha.split("|", 1)
                try:
                    o, d = processar(base, baixar(url))
                    antes += o; depois += d; ok += 1
                except Exception as e:
                    print(f"  ✘ {base}: {e}"); falhas += 1

    print(f"\nConcluído: {ok} imagens convertidas, {falhas} com falha.")
    if antes:
        print(f"Peso: {kb(antes)} nos originais → {kb(depois)} em WebP ({100 - depois * 100 // antes}% menor).")


if __name__ == "__main__":
    main()
    if os.name == "nt":
        input("\nPressione Enter para fechar")
