# 아레스렌트카 사고대차 랜딩 (blrent-accident)

정적 사이트. Netlify 사이트 `blrent` → 아레스.kr (xn--om2b27qt4b.kr). 빌드 단계 없음, 저장소 루트를 그대로 배포.

## 구성
| 경로 | 역할 |
|---|---|
| `index.html` | 사고대차 랜딩페이지 (SEO 메타, 상담폼, 이벤트 모달) |
| `css/style.css` | 랜딩 스타일 (index.html 전용) |
| `js/main.js` | 랜딩 동작: 메뉴·Swiper 슬라이더·브랜드 필터·FAQ·상담폼 전송·이벤트 모달·카운터 |
| `js/reviews.js` | Supabase `ares_reviews` 후기 동적 로드 (실패 시 index.html 하드코딩 후기 유지) |
| `js/analytics.js` | 자체 방문/클릭 집계 → `/track` 엣지 함수 |
| `taksong.html` | 탁송장부 (내부 정산 도구, 데이터는 브라우저 localStorage — 파일에 없음) |
| `analytics/` | 후기 관리(reviews.html)·방문 대시보드·스마트로그 대시보드, Supabase 스키마 |
| `netlify/edge-functions/` | `geo-block`(해외 차단), `track`(집계 수신) |
| `netlify.toml`, `_redirects` | Netlify 설정 |
| `google-apps-script-email.js` | 상담폼(consultForm) 수신용 Google Apps Script 소스 (배포는 Google 측) |
| `.github/workflows/smartlog-crawl.yml` | 스마트로그 수집 워크플로 |
| `img/배너슬라이드/` | 이벤트 배너 제작용 원본 (사이트에서 직접 참조하지 않음) |

## 외부 의존성
- Pretendard(jsDelivr), Swiper 11(jsDelivr), Font Awesome 서브셋(css/fa-subset.css, 사용 아이콘만 self-host), 스마트로그(smlog.co.kr)

## 배포
- 미리보기: `netlify deploy --dir . --alias preview` → https://preview--blrent.netlify.app
- 운영: `netlify deploy --dir . --prod`
- 사이트 계정이 CLI 기본 로그인과 다를 수 있음 — 배포 전 `netlify status`로 사이트가 `blrent`인지 확인
