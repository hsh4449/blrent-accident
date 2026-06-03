# 스마트로그(smlog.co.kr) 데이터 미러

아레스렌트카가 쓰는 부정클릭방지/광고분석 SaaS **스마트로그**의 데이터를 우리 Supabase로 매일 미러링한다.
스마트로그는 공식 API가 없지만 대시보드가 내부 JSON 엔드포인트로 동작 → 그대로 호출해 적재한다.

## 왜?
스마트로그는 **광고/트래픽 집계**만 준다. 우리 Supabase에 누적하면 스마트로그 혼자선 못 하는 걸 할 수 있다:
- 키워드별 **진짜 ROI** (스마트로그 키워드 유입 × 자체 analytics 전화/카톡 전환)
- 자체 행동데이터 기반 **부정클릭 재판단** (환급 근거 강화)
- **무제한 장기 누적** (스마트로그는 보관 짧음) → 월/년 비교
- 스마트로그 + 자체 analytics + 상담을 한 화면에 **통합 대시보드**

## API 구조 (역설계)
- **로그인**: `POST /2020/member/member.php` — `id`, `pass`(평문), `method=login`. 비번 암호화 없음. 세션 쿠키(`SMTGSS`) 자동 발급.
- **데이터 엔드포인트 2개** (세션 쿠키 인증, 별도 토큰 없음):

| 엔드포인트 | method 표기 | 파라미터 | 예시 |
|---|---|---|---|
| `POST /api/log_api.php` | snake_case | `svid`, `startDate`/`endDate` (YYMMDD), 일부 `type`/`page`/`init` | `get_page_view_info`, `get_env`(type=os/bs/rs), `get_referrer` |
| `POST /api/dashboard_api.php` | camelCase | `svid` 만 (최근30일 내장) | `keywordVisitLast30day`, `dailyCount`, `itypeConversion`, `getNaverAdBid` |

- 응답: 깔끔한 JSON. 시계열형 `{list:[{yymmdd,page_view,visit_count,visit_time}],old,new}`, 차원형 `{list:[{os,visit_count,break_count,visit_time,...conversion_amt}]}`, 키워드형 `[{keyword,visit_count}]`.
- `svid=36572` = 아레스렌트카 서비스ID.

> ⚠️ 일부 method(`get_keyword`, `get_ad_ip`(부정클릭 IP) 등)는 이 svid 에서 빈 응답이거나 추가 파라미터가 필요. 부정클릭 IP 재판단 데이터는 `get_ad_ip`/`dn_ip` 실제 요청 파라미터를 추가 캡처한 뒤 v2 에서 연동 예정. 현재는 `smartlog_raw` 에 원본을 보관해 추후 재처리 가능.

## 구성
| 파일 | 역할 |
|---|---|
| `schema.sql` | Supabase 테이블 4개 (daily / keyword / dimension / raw) |
| `crawler.py` | 로그인 → 두 엔드포인트 호출 → Supabase upsert. self-healing(최근 `WINDOW_DAYS`일 재수집) |
| `../../.github/workflows/smartlog-crawl.yml` | 매일 23:30 KST cron |

## 설치 (1회)
1. **테이블 생성**: 공유 Supabase(`jjwsnwnfhqcszwmjdcac`) SQL Editor 에 `schema.sql` 붙여넣고 실행.
2. **GitHub Actions 시크릿** (blrent-accident repo → Settings → Secrets → Actions):
   - `SMLOG_ID`, `SMLOG_PW` — 스마트로그 로그인
   - `SUPABASE_URL` = `https://jjwsnwnfhqcszwmjdcac.supabase.co`
   - `SUPABASE_KEY` — anon key (RLS off 라 insert 가능)
3. 워크플로우 수동 실행(`workflow_dispatch`)으로 첫 적재 확인.

## 로컬 실행
```bash
# dry-run (DB 미적재, 호출·변환 결과만 출력)
SMLOG_PW='****' python analytics/smartlog/crawler.py

# 실제 적재
SMLOG_PW='****' SUPABASE_URL='https://...' SUPABASE_KEY='****' python analytics/smartlog/crawler.py
```
