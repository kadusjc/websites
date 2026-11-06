#!/usr/bin/env python3
"""
Otimizador de imagens — Teodoro Prime Garden
--------------------------------------------
Baixa as fotos e logos do site original e gera versões WebP leves
em vários tamanhos (o navegador escolhe o tamanho certo para cada tela).

Uso (dentro da pasta do site):
    python otimizar-imagens.py
    python otimizar-imagens.py --origem pasta-com-fotos   (usa fotos que você já tem)

Requer Python 3 e Pillow (instalado automaticamente se faltar).
"""
import io, json, os, subprocess, sys, urllib.request

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Instalando Pillow…")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "pillow"])
    from PIL import Image, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(AQUI, "img")
QUALIDADE_FOTO = 74
QUALIDADE_LOGO = 90


def carregar(chave, url, origem):
    if origem:
        caminho = os.path.join(origem, chave)
        if not os.path.exists(caminho):
            caminho = os.path.join(origem, os.path.basename(chave))
        with open(caminho, "rb") as f:
            return f.read()
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (otimizador Teodoro)"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


def main():
    origem = None
    if "--origem" in sys.argv:
        origem = os.path.abspath(sys.argv[sys.argv.index("--origem") + 1])
    with open(os.path.join(IMG, "_lista-imagens.json"), encoding="utf-8") as f:
        lista = json.load(f)

    antes = depois = falhas = 0
    for chave, info in lista.items():
        base = chave.rsplit(".", 1)[0]
        logo = chave.startswith("logo-")
        try:
            dados = carregar(chave, info["original"], origem)
        except Exception as e:
            print(f"  ✗ {chave}: não consegui obter ({e})")
            falhas += 1
            continue
        antes += len(dados)
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(dados)))
        im = im.convert("RGBA") if (logo or im.mode in ("RGBA", "LA", "P")) else im.convert("RGB")
        os.makedirs(os.path.dirname(os.path.join(IMG, base)) or IMG, exist_ok=True)
        for w in info["larguras"]:
            alvo = min(w, im.width)                       # nunca aumenta a foto
            h = round(im.height * alvo / im.width)
            out = im.resize((alvo, h), Image.LANCZOS) if alvo != im.width else im
            destino = os.path.join(IMG, f"{base}-{w}.webp")
            out.save(destino, "WEBP", quality=QUALIDADE_LOGO if logo else QUALIDADE_FOTO, method=6)
            depois += os.path.getsize(destino)
        print(f"  ✓ {chave}")

    print(f"\nPronto! {len(lista) - falhas} imagens otimizadas"
          + (f", {falhas} falharam" if falhas else "")
          + f". Originais: {antes / 1e6:.1f} MB → todas as versões WebP: {depois / 1e6:.1f} MB.")
    print("Cada visitante baixa só o tamanho certo para a tela dele.")


if __name__ == "__main__":
    main()
