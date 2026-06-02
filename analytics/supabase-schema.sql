-- 아레스렌트카 자체 방문 분석 — 테이블 생성
-- 새 Supabase 프로젝트의 SQL Editor에 그대로 붙여넣고 실행하세요.

create table if not exists ares_analytics (
  id            bigint generated always as identity primary key,
  visitor_id    text,          -- 재방문 식별 (localStorage, 영구)
  session_id    text,          -- 세션 식별 (sessionStorage, 탭 단위)
  event_type    text not null, -- pageview | page_exit | scroll | click_phone | click_kakao | submit_consult
  path          text,          -- 방문 경로
  referrer      text,          -- 유입 전체 URL
  referrer_host text,          -- 유입 도메인 (naver/google/kakao 등)
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  device        text,          -- mobile | tablet | desktop
  os            text,
  browser       text,
  screen_w      int,
  screen_h      int,
  viewport_w    int,
  viewport_h    int,
  language      text,
  duration_sec  int,           -- 체류시간 (page_exit 이벤트에 기록)
  scroll_depth  int,           -- 스크롤 깊이 % (scroll / page_exit)
  extra         jsonb,         -- 부가정보 (클릭한 href 등)
  created_at    timestamptz not null default now()
);

create index if not exists idx_ares_analytics_created  on ares_analytics (created_at);
create index if not exists idx_ares_analytics_event    on ares_analytics (event_type);
create index if not exists idx_ares_analytics_session  on ares_analytics (session_id);
create index if not exists idx_ares_analytics_visitor  on ares_analytics (visitor_id);

-- RLS: BL 운영 패턴대로 끔 (anon 읽기/쓰기 개방).
-- 공개 사이트가 직접 INSERT 하고, 대시보드가 직접 SELECT 함.
alter table ares_analytics disable row level security;
