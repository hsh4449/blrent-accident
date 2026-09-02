"""Font Awesome 6.5.1 solid 서브셋 빌더.

index.html / js/*.js 에서 실제로 쓰는 `fa-*` 아이콘만 골라
  css/webfonts/fa-solid-900-subset.woff  (글리프 서브셋)
  css/fa-subset.css                      (@font-face + .fas 기본 규칙 + 아이콘별 content)
를 다시 만든다. 아이콘을 새로 쓰기 시작했으면 이 스크립트를 한 번 돌리고 커밋하면 된다.

원본(all.min.css, fa-solid-900.ttf)은 cdnjs 에서 임시 폴더로 내려받는다.
필요 패키지: fonttools  (pip install fonttools)
사용:  python tools/build_fa_subset.py   (저장소 루트에서)
"""
import os, re, glob, io, sys, tempfile, urllib.request
from fontTools import subset

FA_VER = "6.5.1"
CDN = f"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{FA_VER}"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

tmp = tempfile.mkdtemp(prefix="fa-subset-")
def fetch(name):
    dst = os.path.join(tmp, os.path.basename(name))
    urllib.request.urlretrieve(f"{CDN}/{name}", dst)
    return dst
allcss = io.open(fetch("css/all.min.css"), encoding="utf-8").read()
ttf = fetch("webfonts/fa-solid-900.ttf")

# index.html 은 class 속성값만, js 는 전체 텍스트에서 fa-* 토큰 수집 (href 의 css/fa-subset.css 같은 경로는 제외)
html = io.open("index.html", encoding="utf-8").read()
corpus = "\n".join(re.findall(r'class="([^"]*)"', html)) + "\n" + "\n".join(io.open(f, encoding="utf-8").read() for f in glob.glob("js/*.js"))
used = sorted(set(re.findall(r"\bfa-([a-z0-9-]+)", corpus)))
styles = sorted(set(re.findall(r"\b(fa[srlb]|fa-solid|fa-regular|fa-brands)\b", corpus)))
if styles != ["fas"]:
    sys.exit(f"solid(fas) 외 스타일 사용 감지: {styles} — 스크립트가 solid 만 처리함")

# 공식 css 의 ".fa-a::before,.fa-b::before{content:\"\\f005\"}" 에서 코드포인트 추출
cp = {}
for sel, content in re.findall(r"((?:\.fa-[a-z0-9-]+::?before,?)+)\{content:\"\\([0-9a-f]+)\"\}", allcss):
    for name in re.findall(r"\.fa-([a-z0-9-]+)::?before", sel):
        cp[name] = content
icons = [u for u in used if u in cp]
modifiers = [u for u in used if u not in cp]
if not set(modifiers) <= {"spin"}:
    sys.exit(f"지원 안 하는 fa- 수식 클래스: {modifiers} — 필요하면 아래 CSS 에 규칙 추가")

os.makedirs("css/webfonts", exist_ok=True)
out_font = "css/webfonts/fa-solid-900-subset.woff"
unicodes = sorted({int(cp[i], 16) for i in icons})
subset.main([ttf, f"--unicodes={','.join(f'U+{u:04X}' for u in unicodes)}",
             "--flavor=woff", "--no-hinting", "--desubroutinize", "--layout-features=", "--name-IDs=0,1,2,3,4,5,6,13,14",
             f"--output-file={out_font}"])

lines = [f'/*! Font Awesome Free {FA_VER} (https://fontawesome.com) - solid 스타일 중 이 사이트가 쓰는 아이콘만 서브셋해 self-host.',
         ' * License: Icons CC BY 4.0, Fonts SIL OFL 1.1, Code MIT. 재생성: python tools/build_fa_subset.py */',
         '@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:900;font-display:block;src:url(webfonts/fa-solid-900-subset.woff) format("woff")}',
         '.fa,.fas,.fa-solid{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:var(--fa-display,inline-block);font-style:normal;font-variant:normal;line-height:1;text-rendering:auto;font-family:"Font Awesome 6 Free";font-weight:900}',
         '.fa-spin{animation:fa-spin 2s linear infinite}',
         '@keyframes fa-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}']
lines += [f'.fa-{i}::before{{content:"\\{cp[i]}"}}' for i in icons]
io.open("css/fa-subset.css", "w", encoding="utf-8", newline="\n").write("\n".join(lines) + "\n")
print(f"{len(icons)} icons -> {out_font} ({os.path.getsize(out_font)} B), css/fa-subset.css ({os.path.getsize('css/fa-subset.css')} B)")
