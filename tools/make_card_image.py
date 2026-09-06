"""차량 카드 이미지 생성기 — 원본 사진을 750x500 카드 규격 webp 로.

규칙 (벤츠·BMW·아우디·테슬라·랜드로버 카드에 적용된 것과 동일):
  - 캔버스 750x500 (3:2). css/style.css 의 .modelSwiper .vehicle-image 가 aspect-ratio 3/2 라 크롭 없이 꽉 참
  - 전경: 원본을 높이(또는 폭)에 맞춰 contain, 가운데 배치 — 차량이 잘리지 않음
  - 배경: 같은 사진을 cover 로 확대해 GaussianBlur(25) + 밝기 0.9 → 좌우 빈 공간을 블러로 채움
  - webp quality 85

사용:  python tools/make_card_image.py "원본.png" "img/cars/브랜드 모델 색상.webp"
       python tools/make_card_image.py 원본폴더/ img/cars/   (폴더면 png/jpg 전부, 파일명 그대로 .webp)
필요 패키지: pillow
"""
import os, sys
from PIL import Image, ImageFilter, ImageEnhance

W, H = 750, 500
BLUR, BRIGHTNESS, QUALITY = 25, 0.9, 85


def make(src_path, out_path):
    src = Image.open(src_path).convert("RGB")
    s = max(W / src.width, H / src.height)
    bg = src.resize((round(src.width * s), round(src.height * s)), Image.Resampling.LANCZOS)
    x, y = (bg.width - W) // 2, (bg.height - H) // 2
    bg = bg.crop((x, y, x + W, y + H)).filter(ImageFilter.GaussianBlur(BLUR))
    bg = ImageEnhance.Brightness(bg).enhance(BRIGHTNESS)
    s2 = min(W / src.width, H / src.height)
    fg = src.resize((round(src.width * s2), round(src.height * s2)), Image.Resampling.LANCZOS)
    bg.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2))
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    bg.save(out_path, "WEBP", quality=QUALITY, method=6)
    print(f"{os.path.basename(out_path)}  {os.path.getsize(out_path) // 1024}KB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    if os.path.isdir(src):
        for f in sorted(os.listdir(src)):
            if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                make(os.path.join(src, f), os.path.join(dst, os.path.splitext(f)[0] + ".webp"))
    else:
        make(src, dst)
