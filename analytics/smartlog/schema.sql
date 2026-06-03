-- 스마트로그(smlog.co.kr) 데이터 미러 — 테이블 생성
-- 기존 공유 blrent Supabase(jjwsnwnfhqcszwmjdcac) SQL Editor 에 붙여넣고 실행.
-- 스타일은 analytics/supabase-schema.sql(ares_analytics) 과 동일: snake_case, RLS off.

-- 1) 일별 트래픽 (get_page_view_info) — svid+date PK 로 self-healing upsert
create table if not exists smartlog_daily (
  svid                text not null,
  date                date not null,      -- yymmdd → date 변환 저장
  page_view           int,
  visit_count         int,
  visit_time          int,                -- 체류시간 초 합계
  page_view_per_visit numeric,
  updated_at          timestamptz not null default now(),
  primary key (svid, date)
);
create index if not exists idx_smartlog_daily_date on smartlog_daily (date);

-- 2) 키워드 스냅샷 (dashboard_api keywordVisitLast30day = 최근30일 누적값)
--    매 수집일마다 스냅샷으로 쌓아 추세 추적. svid+snapshot_date+keyword PK.
create table if not exists smartlog_keyword (
  svid          text not null,
  snapshot_date date not null,            -- 크롤링 실행일
  keyword       text not null,
  visit_count   int,
  updated_at    timestamptz not null default now(),
  primary key (svid, snapshot_date, keyword)
);
create index if not exists idx_smartlog_keyword_snap on smartlog_keyword (snapshot_date);

-- 3) 차원 분해 (get_env type=os/bs/rs, get_referrer 등 공통 응답 형태)
create table if not exists smartlog_dimension (
  svid           text not null,
  snapshot_date  date not null,
  dim_type       text not null,           -- os | browser | resolution | referrer | itype ...
  dim_value      text not null,
  visit_count    int,
  break_count    int,                     -- 이탈수
  visit_time     int,
  q_count        int,                     -- 문의수
  order_count    int,
  join_count     int,
  conversion_amt bigint,
  updated_at     timestamptz not null default now(),
  primary key (svid, snapshot_date, dim_type, dim_value)
);
create index if not exists idx_smartlog_dim_snap on smartlog_dimension (snapshot_date, dim_type);

-- 4) 원본 아카이브 — 모든 method 응답을 JSON 그대로 보관.
--    미지 method/재처리/부정클릭(get_ad_ip 등) 대비 안전망.
create table if not exists smartlog_raw (
  id          bigint generated always as identity primary key,
  svid        text not null,
  endpoint    text not null,              -- log_api | dashboard_api
  method      text not null,
  params      jsonb,
  payload     jsonb,                       -- 응답 JSON 원본
  captured_at timestamptz not null default now()
);
create index if not exists idx_smartlog_raw_method on smartlog_raw (method, captured_at);

-- RLS: BL 운영 패턴대로 끔 (anon 읽기/쓰기 개방).
alter table smartlog_daily     disable row level security;
alter table smartlog_keyword   disable row level security;
alter table smartlog_dimension disable row level security;
alter table smartlog_raw       disable row level security;
