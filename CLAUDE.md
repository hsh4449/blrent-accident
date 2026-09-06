# CLAUDE.md — 아레스렌트카 사고대차 랜딩 (blrent-accident)

정적 사이트. 빌드 단계 없음, 저장소 루트를 그대로 Netlify 사이트 `blrent`에 배포 → https://xn--om2b27qt4b.kr (아레스.kr).
로컬 폴더명은 `blrent`, GitHub 레포는 `hsh4449/blrent-accident` (**PUBLIC**). 커밋에 개인 토큰·이메일·서비스 키를 넣지 말 것.
코드에 박혀 있는 Supabase anon key(`jjwsnwnfhqcszwmjdcac`)는 RLS off 정책으로 공개된 값이라 그대로 둔다.

## 폴더 구조

```
index.html                  랜딩페이지 (유일한 공개 페이지)
taksong.html                탁송장부 (내부 정산 도구, 단일 파일, 데이터는 브라우저 localStorage)
css/style.css               랜딩 스타일 (index.html 전용)
css/fa-subset.css           Font Awesome 6.5.1 solid 서브셋 CSS (아이콘 18개)
css/webfonts/               위 서브셋 폰트 (fa-solid-900-subset.woff)
js/main.js                  랜딩 동작 전부 (메뉴·슬라이더·브랜드 필터·FAQ·상담폼 전송·이벤트 모달·카운터)
js/reviews.js               Supabase 후기 동적 로드
js/analytics.js             자체 방문 추적 → /track
img/cars/                   차량 카드 사진 webp (파일명에 공백·한글 있음)
img/reviews/                index.html 하드코딩 후기(폴백)의 사진 7장
img/배너슬라이드/            banner1~3.jpg 는 프로모 슬라이더가 사용, 나머지는 배너 제작 원본
img/ logo.png·urus.png(og:image)·huracan.webp·event-voucher.jpg·favicon-*·apple-touch-icon.png
analytics/dashboard.html            방문 분석 대시보드 (ares_analytics 읽기)
analytics/reviews.html              후기 관리 (ares_reviews 쓰기, PIN 게이트)
analytics/smartlog-dashboard.html   광고 분석 대시보드 (smartlog_* 읽기)
analytics/supabase-schema.sql       ares_analytics 테이블 DDL
analytics/smartlog/crawler.py       스마트로그 미러 크롤러 (GitHub Actions 가 실행)
analytics/smartlog/schema.sql       smartlog_daily/keyword/dimension/raw DDL
analytics/smartlog/README.md        스마트로그 내부 API 역설계 메모
netlify/edge-functions/geo-block.js 해외 접속 차단 (path /*)
netlify/edge-functions/track.js     /track 수집 엔드포인트
netlify.toml, _redirects            Netlify 설정
deno.lock                           엣지 함수 부트스트랩(edge.netlify.com) 해시 — 직접 수정 대상 아님
google-apps-script-email.js         상담폼 수신 GAS 소스 (배포는 Google 측, 여기선 참고용)
tools/build_fa_subset.py            FA 서브셋 재생성
tools/make_card_image.py            차량 카드 이미지(750x500) 생성
.github/workflows/smartlog-crawl.yml 스마트로그 크롤러 cron
.claude/settings.local.json         이 저장소용 Claude 권한 허용 목록
README.md                           구성·배포 요약
```

## 파일별 역할

### index.html
- 섹션 id 순서: `header` → `home`(프로모 슬라이더 `.promoSwiper`, banner1~3.jpg) → 이벤트 모달 `#evtModal`(상품권 이벤트, event-voucher.jpg) → `service` → `vehicles` → `process` → `reviews`(`.reviewSwiper`) → `faq` → `consult`(`#consultForm`) → `contact` → footer.
- `#vehicles`: `#brandFilter`(칩은 main.js가 생성) + 브랜드별 `<h3 class="vehicle-section-title">` 블록. Mercedes-Benz·BMW·Audi·Tesla·Land Rover 5개는 `.benz-cards > .model-row.mr-multi > .swiper.modelSwiper` 그리드에 `.vehicle-card` + `.mr-name`(카드 라벨). Porsche는 예전 `model-row` 단독 구조, Bentley·Lamborghini는 `lineup-row` 구조 그대로 (모두 `.vehicle-info`/`.vehicle-name` 라벨 방식).
- 상담폼 필드 `name` 속성: `이름`(필수) `연락처`(필수) `차량종류` `사고일자` `문의내용` — GAS 쪽 `e.parameter` 키와 동일해야 함.
- 인라인으로 남겨둔 스크립트 2개: ld+json(AutoRental, 상호 `브랜드라운지`/alternateName 아레스렌트카) 와 스마트로그 `hpt_info={'_account':'UHPT-36572','_server':'a30'}` — **hpt_info 는 반드시 `//cdn.smlog.co.kr/core/smart.js` 태그보다 앞에** 있어야 함.
- 외부 로드: Pretendard(jsDelivr gh v1.3.9), Swiper `@11`(jsDelivr, css+js defer), 스마트로그 smart.js(동기). 로컬: `css/fa-subset.css?v=1`, `css/style.css?v=mobile42`, `js/main.js?v=mobile31`, `js/reviews.js?v=1`, `js/analytics.js?v=2` — **css/js 수정 시 `?v=` 값을 올릴 것**.
- 전화번호 `1666-6525` 하드코딩(5곳), 카카오 오픈채팅 `https://open.kakao.com/o/st1FwHLi`(문의 CTA + 하단 고정바 2곳). 전환 추적용 `data-cta="contact|evt-banner|fixed"` 속성이 전화 링크에 붙어 있음.

### css/style.css
- `.modelSwiper .vehicle-image { aspect-ratio: 3/2 }` 가 모든 카드 비율의 기준. 카드 이미지가 750x500(3:2)이면 크롭 없이 꽉 참.
- `.benz-cards .mr-name`, `.mr-multi .mr-name` 이 카드 라벨 스타일.
- 파일 끝의 "이벤트 섹션·이벤트 모달" 블록은 예전 index.html 인라인 `<style>` 을 옮겨온 것 (캐스케이드 순서 유지 위해 끝에 둠).
- `.smartlog-chat/#smartlog-chat { display:none }` 규칙이 있지만 현재 스마트로그 채팅 위젯의 셀렉터와 맞지 않아 효과 없음.

### js/main.js (전부 defer, DOM 완성 후 실행)
- 상단 IIFE 4개(예전 인라인 스크립트): Hero `#heroCount`(날짜 시드로 132~224명), 이벤트 모달 표시/"오늘 안 보기"(`localStorage.evtHideUntil`, 노출 시 `aresTrack('event_impression')`), 상담폼 submit → `fetch(GAS_URL, {method:'POST', body:FormData, mode:'no-cors'})` 후 alert·reset, 누적 고객 `#customer-count`(2026-03-13 기준 68,661 + 일별 결정적 증가).
- 이하: 모바일 메뉴, 헤더 스크롤, `promoSwiper`(loop+autoplay+pagination), 브랜드 필터(`.vehicle-section-title` 부터 다음 타이틀 또는 `.vehicle-cta-band` 전까지를 한 그룹으로 묶어 칩 클릭 시 display 토글, 첫 그룹 기본 표시), `window.REVIEW_SWIPER_CONFIG` + `window.reviewSwiper`, FAQ 아코디언, 앵커 스무스 스크롤, `.stat-number` 카운트업(`animateCount(el, target, duration, suffix)` — "+" 접미사는 마지막 틱에서 함께 출력), 이미지 lazy, 섹션 페이드인, 이미지 확대 모달, `window.BLRentCar` API.
- `.modelSwiper` 요소는 Swiper 로 초기화하지 않음 (CSS 그리드로만 배치). Swiper 인스턴스는 promoSwiper·reviewSwiper 2개.

### js/reviews.js
- `GET {SUPABASE}/rest/v1/ares_reviews?select=*&visible=eq.true&order=sort_order.asc,created_at.asc` → 행이 있으면 `.reviewSwiper .swiper-wrapper` 를 교체하고 `REVIEW_SWIPER_CONFIG` 로 재초기화. 실패·빈 결과면 index.html 하드코딩 후기 유지.
- 후기 행 필드: `image_url`, `rating`, `text`, `author_name`, `vehicle`, `visible`, `sort_order`, `created_at`.

### js/analytics.js
- 식별자: `localStorage.ares_vid`(영구 방문자), `sessionStorage.ares_sid`(세션).
- 이벤트: `pageview`, `scroll`(25/50/75/100 각 1회), `click_phone`(`tel:` 링크), `click_kakao`(href에 kakao.com), `click_event`(`[data-track]` 요소), `submit_consult`, `page_exit`(체류초·최대 스크롤). 공통 필드: path, referrer(_host), utm_*, device/os/browser, screen/viewport, language.
- 전송은 전부 `POST /track` (keepalive). `window.aresTrack(type, extra)` 로 외부에서 커스텀 이벤트 기록.

### netlify/edge-functions
- `geo-block.js` (`/*`): `context.geo.country.code` 가 있고 KR 이 아니며 허용 봇 UA(googlebot, yeti, daumoa, kakaotalk-scrap, facebookexternalhit 등)도 아니면 403 안내 페이지. 그 외 `context.next()`.
- `track.js` (`/track`): POST JSON 을 받아 `extra` 에 `ip, country, region, city` 를 붙여 Supabase `ares_analytics` 에 INSERT(anon key). GET 은 'ok', 실패는 무시, 항상 204.

### taksong.html (탁송장부)
- 탭: `list`(장부) `settlement`(정산) `commission`(수수료) `monthly`(월별) `calendar`(달력) `price`(요금표, `PRICE_DATA` 상수 검색).
- localStorage 키: `taksong_data`(기록), `taksong_vat_records`(부가세 납부), `taksong_transfers`(계좌 이동), `taksong_commission`(수수료).
- 담당자(`fPerson`): 탁송기사·황성현·조윤호·신동석·전동환. 대여종류: 장기대여·사고대여·일반대여·기타. 상태: 청구전·청구완료·입금완료·고객직접입금(=부가세 면제). 청구처: 고객·비엘·모빌리티·기타. 입금처/분배: 불꽃탁송·황성현·조윤호·신동석·전동환·적립.
- 계산: 담당자가 탁송기사면 수수료 = 탁송비×요율(내림), 기사지급 = 탁송비−수수료, 수익 = 수수료 + (공급가 − 탁송비). 공급가 = 면제면 청구액, 아니면 청구액 − round(청구액/11). 주유비는 수익에서 제외.
- 내보내기: `exportData()` → 필터된 행을 CSV(Blob) 다운로드. 서버 통신 없음. 라이브에서 `/taksong.html` 로 열림(데이터는 각 브라우저에만 있음).

### analytics/
- `dashboard.html`: `ares_analytics` 를 읽어 일별 방문·유입경로·기기·버튼 전환·기기별 전환 채널·버튼별 전화 전환(data-cta 별)·부정클릭 의심 탐지. IP 정보는 `https://api.ipapi.is/` 조회 후 `localStorage.ares_ipintel` 캐시. `noindex`.
- `reviews.html`: `ADMIN_PIN = '0000'` 입력 후 `ares_reviews` 추가·수정·숨김.
- `smartlog-dashboard.html`: `smartlog_daily`·`smartlog_keyword`·`smartlog_dimension` 읽기.
- 세 페이지 모두 저장소에 있으므로 라이브 `/analytics/*.html` 로도 열림.

### google-apps-script-email.js
- `doPost(e)`: 활성 스프레드시트 시트에 행 추가 + `MailApp.sendEmail` → `blrentcar@naver.com`. 파라미터 키 `이름/연락처/차량종류/사고일자/문의내용`. 실제 배포 URL은 main.js 의 `scriptURL` 상수.

### tools/
- `build_fa_subset.py`: index.html `class` 속성과 js 에서 쓰는 `fa-*` 를 모아 cdnjs 6.5.1 원본을 서브셋 → `css/fa-subset.css` + `css/webfonts/fa-solid-900-subset.woff`. 아이콘을 새로 쓰면 재실행. (fonttools 필요, solid 만 지원)
- `make_card_image.py`: 원본 사진 → 750x500 카드 webp (contain + 좌우 블러 25·밝기 0.9, q85). 새 차량 사진은 이걸로 만들어 `img/cars/` 에 넣고 index.html 카드 한 줄 추가.

## 데이터 흐름

```
[방문자 브라우저 index.html]
  ├─ 상담폼 submit ──FormData POST(no-cors)──▶ Google Apps Script(doPost) ─▶ 스프레드시트 행 추가 + 메일 blrentcar@naver.com
  │                └─ 동시에 analytics.js 가 submit_consult 이벤트
  ├─ analytics.js 이벤트 ──POST /track──▶ Netlify 엣지 track.js(+ip/geo) ──▶ Supabase ares_analytics ──▶ analytics/dashboard.html
  ├─ reviews.js ◀──GET ares_reviews(visible=true)── Supabase ◀── analytics/reviews.html(PIN 0000) 이 관리
  ├─ smart.js(스마트로그 SaaS, UHPT-36572) ──▶ smlog.co.kr 자체 집계
  └─ 전화(tel:) / 카카오 오픈채팅 링크 클릭 → click_phone / click_kakao 이벤트

[GitHub Actions smartlog-crawl.yml: 매일 22:30 UTC(07:30 KST) + 수동]
  crawler.py ─로그인(SMLOG_ID/PW)─▶ smlog.co.kr /api/log_api.php, /api/dashboard_api.php
             ─▶ Supabase smartlog_daily / smartlog_keyword / smartlog_dimension (upsert), smartlog_raw (insert)
             ─▶ analytics/smartlog-dashboard.html
  * SUPABASE_URL/KEY 없이 실행하면 dry-run(호출만, 적재 안 함). 시크릿은 GitHub repo Secrets.
  * smartlog/README.md 는 "23:30 KST" 라고 적혀 있으나 yml 기준은 22:30 UTC.

[모든 요청] ─▶ 엣지 geo-block.js: 한국 아님 & 허용 봇 아님 → 403

[taksong.html] 브라우저 localStorage 만 사용, 서버·Supabase 연동 없음, CSV 내보내기만.
```

Supabase 프로젝트는 하나(`jjwsnwnfhqcszwmjdcac`, BL 다른 시스템과 공유). 테이블: `ares_analytics`, `ares_reviews`, `smartlog_daily`, `smartlog_keyword`, `smartlog_dimension`, `smartlog_raw`. 이 저장소에 DDL 이 있는 건 `ares_analytics` 와 `smartlog_*` 뿐이고 `ares_reviews` DDL 은 없다. `reviews` 테이블은 다른 시스템 것이므로 건드리지 말 것.

## 자주 쓰는 명령어

```bash
# 로컬 확인 (엣지 함수·/track 은 동작 안 함 → /track POST 501 은 정상)
python -m http.server 8765            # http://127.0.0.1:8765/index.html

# Netlify — 운영 사이트 blrent 는 CLI 기본 로그인과 다른 팀 계정에 있음.
# 해당 계정 토큰을 NETLIFY_AUTH_TOKEN 환경변수로 넘기고 --site 로 지정한다 (토큰은 커밋 금지).
netlify status                        # 현재 링크된 사이트 확인 (.netlify/state.json 은 ares-preview 라는 별도 미리보기 사이트를 가리킴)
netlify deploy --dir . --alias preview --site 89541249-aa73-405d-8d4b-452d002b8278   # → https://preview--blrent.netlify.app
netlify deploy --dir . --prod          --site 89541249-aa73-405d-8d4b-452d002b8278   # 운영 반영 (사용자가 "배포해" 할 때만)

# 자산 재생성
python tools/build_fa_subset.py                                  # 아이콘 추가 후
python tools/make_card_image.py "원본.png" "img/cars/브랜드 모델 색상.webp"   # 차량 카드 사진

# 스마트로그 크롤러 로컬 dry-run (SMLOG_PW 필요, DB 적재 없음)
SMLOG_PW=... python analytics/smartlog/crawler.py

# 브랜치
git branch -a     # main = 운영, kimbujang-hold = 2026-07 김부장렌트카 리브랜딩 보류분(다른 디자인·다크테마)
```

## 작업 규칙 (코드·설정에서 확인되는 것)
- 코드 수정 → 커밋·푸시 → preview 별칭 배포까지는 진행하고, `--prod` 는 사용자가 명시할 때만.
- `_redirects` 의 `/* /index.html 200` 은 존재하지 않는 경로를 index.html 로 돌린다. 실제 파일(analytics/, taksong.html, css/js/img)은 그대로 서빙된다.
- 이미지 참조를 스캔할 땐 따옴표 안 경로 전체를 읽을 것 — `img/cars/벤츠 S580 화이트.webp` 처럼 공백이 있어 공백에서 끊는 정규식은 현행 사진을 미참조로 오판한다.
- 차량 카드 이미지 규격: 벤츠·BMW·아우디·테슬라·랜드로버 = 750x500. 포르쉐·벤틀리·람보르기니·맥라렌은 아직 840x564 구 규격(카드 비율은 CSS 3:2 로 맞춰지지만 사진 자체는 미교체).
- 브랜드 그리드는 2열(모바일)이라 카드 수를 짝수로 맞춘다 (BMW 는 그래서 16장).
- `@media` 블록 병합·CSS 순서 변경은 하지 않는다 (같은 특이도 규칙 순서가 캐스케이드에 영향).
- Swiper 는 CDN `@11` 고정. 12 이상으로 올릴 땐 promoSwiper/reviewSwiper 동작과 `.swiper-pagination-bullet` 스타일을 다시 확인할 것. 14.x 는 Safari 16.4/Chrome 110 미만을 버림.
- 화면 변경은 로컬 서버 + Playwright 스크린샷(모바일 390 / 데스크탑 1280, 이벤트 모달 표시·해제)으로 전후 비교해 검증한다. 검증 스크립트는 저장소에 없음(세션 스크래치에서 작성).
