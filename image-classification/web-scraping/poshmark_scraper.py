import os
import re
import time
import requests
import warnings
warnings.filterwarnings('ignore')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# --- Config ---
URL = "https://poshmark.com/search?query=underwear&type=listings&src=dir"
SAVE_DIR = "dataset"
SCROLL_PAUSE = 2       # seconds to wait after each scroll
MAX_SCROLLS = 30       # how many times to scroll down
TARGET_IMAGES = 300    # stop early if we collect this many
# --------------

os.makedirs(SAVE_DIR, exist_ok=True)

CDN_PATTERN = re.compile(r'https://di2ponv0v5otw\.cloudfront\.net/posts/[\w/\-]+\.jpg')

options = Options()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)

driver = webdriver.Chrome(options=options)
driver.get(URL)
time.sleep(3)  # initial page load

seen = set()

headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    )
}

for scroll in range(1, MAX_SCROLLS + 1):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(SCROLL_PAUSE)

    found = CDN_PATTERN.findall(driver.page_source)
    new_urls = []
    for u in found:
        if u not in seen:
            seen.add(u)
            new_urls.append(u)

    print(f"Scroll {scroll}/{MAX_SCROLLS} - {len(new_urls)} new URLs (total seen: {len(seen)})")

    for i, img_url in enumerate(new_urls):
        filename = os.path.join(SAVE_DIR, img_url.split("/")[-1])
        if os.path.exists(filename):
            continue
        try:
            r = requests.get(img_url, headers=headers, timeout=10)
            r.raise_for_status()
            with open(filename, "wb") as f:
                f.write(r.content)
            print(f"  [{i}] Saved -> {filename}")
        except Exception as e:
            print(f"  [{i}] Failed: {e}")

    if len(seen) >= TARGET_IMAGES:
        print(f"Reached target of {TARGET_IMAGES} images, stopping early.")
        break

driver.quit()
print(f"\nDone. {len(os.listdir(SAVE_DIR))} images in '{SAVE_DIR}/'")
