# 아레스렌트카 자체 방문 분석

GA4 대신 우리 Supabase에 직접 방문 데이터를 쌓는 자체 분석 시스템.

## 수집 항목 (상세)
- **방문**: 페이지뷰, 순방문자(재방문 식별), 세션
- **유입경로**: referrer 도메인 + UTM 파라미터 (네이버/구글/카카오/광고 등)
- **체류시간**: 페이지 떠날 때 측정
- **스크롤 깊이**: 25 / 50 / 75 / 100% 도달
- **클릭/전환**: 전화(1666-6525), 카카오 상담, 상담신청 폼 제출
- **환경**: 기기(모바일/태블릿/PC), OS, 브라우저, 화면/뷰포트 크기, 언어

## 구성 파일
| 파일 | 역할 |
|---|---|
| `analytics/supabase-schema.sql` | 테이블 생성 SQL |
| `js/analytics.js` | 사이트에 심는 추적 스크립트 (index.html에서 로드) |
| `analytics/dashboard.html` | 분석 대시보드 (GitHub Pages 호스팅) |

## 설치 순서

### 1. Supabase 새 프로젝트
1. https://supabase.com/dashboard → New Project (이름 `ares-analytics`, 리전 Seoul 권장)
2. SQL Editor에 `supabase-schema.sql` 붙여넣고 실행
3. Settings → API 에서 **Project URL** 과 **anon public key** 복사

### 2. 키 적용 (2곳)
아래 두 파일의 상단 `__SUPABASE_URL__`, `__SUPABASE_ANON_KEY__` 를 실제 값으로 교체:
- `js/analytics.js`
- `analytics/dashboard.html`

> 키 적용 전에는 트래커가 아무 것도 전송하지 않으므로 사이트에 영향 없음.

### 3. 배포
- **사이트**: Netlify 수동 배포 (메인 사이트)
- **대시보드**: `analytics/dashboard.html` 을 GitHub Pages 등에 호스팅

## 참고
- RLS는 BL 운영 패턴대로 끔 (anon 읽기/쓰기 개방).
- 대시보드는 `noindex` 처리됨. URL 자체는 아는 사람만 접근하도록 관리.
- 봇/크롤러 트래픽은 별도 필터링 안 됨 — 필요 시 추후 보강.
