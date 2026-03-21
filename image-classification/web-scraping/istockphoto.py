import requests
import os
import time
import warnings
warnings.filterwarnings("ignore")

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
}

SEARCH_QUERIES = {
    "bikini": "bikini no people",
}

SAVE_ROOT = "DATA"
MAX_IMAGES = 50  # images per category


def build_driver() -> webdriver.Chrome:
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument(f"user-agent={HEADERS['User-Agent']}")
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=opts)


def get_image_urls(driver: webdriver.Chrome, phrase: str) -> list[str]:
    encoded = phrase.replace(" ", "+")
    url = (
        f"https://www.istockphoto.com/search/2/image-film"
        f"?phrase={encoded}&mediatype=photography&sort=mostpopular"
    )
    driver.get(url)
    time.sleep(4)  # wait for JS to render

    imgs = driver.find_elements(By.TAG_NAME, "img")
    urls = []
    for img in imgs:
        src = img.get_attribute("src") or img.get_attribute("data-src") or ""
        if "media.istockphoto.com" in src and src.startswith("http"):
            urls.append(src)
        if len(urls) >= MAX_IMAGES:
            break

    print(f"  Found {len(urls)} image URLs for phrase '{phrase}'")
    return urls


def download_images(urls: list[str], folder: str) -> None:
    os.makedirs(folder, exist_ok=True)
    session = requests.Session()
    session.headers.update(HEADERS)
    for i, url in enumerate(urls, 1):
        try:
            resp = session.get(url, timeout=15)
            if resp.status_code == 200 and "image" in resp.headers.get("Content-Type", ""):
                path = os.path.join(folder, f"img_{i:04d}.jpg")
                with open(path, "wb") as f:
                    f.write(resp.content)
                print(f"  [{i}/{len(urls)}] Saved -> {path}")
            else:
                print(f"  [{i}] Skipped (status {resp.status_code}): {url[:70]}")
        except Exception as e:
            print(f"  [{i}] Error: {e}")


if __name__ == "__main__":
    driver = build_driver()
    try:
        for category, phrase in SEARCH_QUERIES.items():
            print(f"\n=== Category: {category} ===")
            folder = os.path.join(SAVE_ROOT, category)
            urls = get_image_urls(driver, phrase)
            if urls:
                download_images(urls, folder)
            else:
                print("  No images found.")
    finally:
        driver.quit()
    print("\nDone.")