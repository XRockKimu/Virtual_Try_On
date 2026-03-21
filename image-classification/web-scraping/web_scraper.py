import requests
from bs4 import BeautifulSoup
import os
import json
import warnings
warnings.filterwarnings('ignore')

SAVE_DIR = "DATA/bikini"
os.makedirs(SAVE_DIR, exist_ok=True)

def get_best_image_url(img_tag):
    data_src = img_tag.get("data-src", "")
    if data_src and "{width}" in data_src:
        widths_raw = img_tag.get("data-widths", "[1080]")
        try:
            widths = json.loads(widths_raw)
        except Exception:
            widths = [1080]
        best_width = max(int(w) for w in widths)
        url = data_src.replace("{width}", str(best_width))
        return "https:" + url if url.startswith("//") else url

    srcset = img_tag.get("srcset") or img_tag.get("data-srcset") or ""
    if srcset:
        entries = [e.strip() for e in srcset.split(",") if e.strip()]
        best = entries[-1].split()[0]
        return "https:" + best if best.startswith("//") else best

    src = img_tag.get("src", "")
    return ("https:" + src) if src.startswith("//") else src


for page in range(1, 13):
    url = f"https://vetchy.com/collections/swim-sets?page={page}"
    req = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(req.text, "html.parser")
    imgs = soup.find_all(name='img', class_='grid__image-contain')

    print(f"Found {len(imgs)} images")

    for i, img_tag in enumerate(imgs):
        img_url = get_best_image_url(img_tag)
        alt     = img_tag.get("alt", f"image_{i}")
        if not img_url:
            print(f"[{i}] No URL found, skipping")
            continue

        print(f"[{i}] Downloading: {img_url}")
        try:
            resp = requests.get(img_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
            resp.raise_for_status()
            ext      = img_url.split("?")[0].split(".")[-1]   # jpg / png …
            filename = os.path.join(SAVE_DIR, f"{i:04d}_{page}.{ext}")
            with open(filename, "wb") as f:
                f.write(resp.content)
            print(f"    Saved → {filename}")
        except Exception as e:
            print(f"    Failed: {e}")