"""Otimiza as fotos da Aderic para a web (WebP, até 1600px, ~80 KB cada).

Uso:
  pip install pillow
  python otimizar-fotos.py

1. Coloque as fotos originais (jpg/png) em  fotos-originais/
   A foto da fachada deve se chamar  fachada.jpg
2. Rode o script. Os arquivos .webp saem em  images/
   Se fachada.jpg não existir, o script tenta baixá-la do site atual.
"""
import pathlib, urllib.request
from PIL import Image, ImageOps

AQUI = pathlib.Path(__file__).parent
SRC, DST = AQUI / "fotos-originais", AQUI / "images"
SRC.mkdir(exist_ok=True); DST.mkdir(exist_ok=True)

fachada = SRC / "fachada.jpg"
if not fachada.exists():
    url = "https://img1.wsimg.com/isteam/ip/48f4a6a6-f9a4-42d4-aa6e-732c4cbea8eb/fachada%20loja.jpg"
    try:
        urllib.request.urlretrieve(url, fachada); print("fachada.jpg baixada do site atual")
    except Exception as e:
        print("Não consegui baixar a fachada:", e)

for f in sorted(SRC.iterdir()):
    if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}: continue
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    im.thumbnail((1600, 1600))
    out = DST / (f.stem.lower().replace(" ", "-") + ".webp")
    im.save(out, "WEBP", quality=78, method=6)
    print(f"{f.name} -> {out.name} ({out.stat().st_size // 1024} KB)")
