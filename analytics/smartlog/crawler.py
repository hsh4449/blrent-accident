"""
스마트로그(smlog.co.kr) 데이터 미러 크롤러
- 매일 GitHub Actions cron 에서 실행 (self-healing: 매 실행마다 최근 WINDOW_DAYS 일을 다시 당겨 upsert)
- 비공식 JSON API 2개를 그대로 호출:
    log_api.php       (snake_case method, 날짜 파라미터 필요)
    dashboard_api.php (camelCase method, svid 만, 최근30일 내장)
- 결과를 공유 Supabase(jjwsnwnfhqcszwmjdcac) 의 smartlog_* 테이블에 적재.
- SUPABASE_URL/KEY 미설정 시 dry-run (호출 결과만 출력, DB 미적재) — 로컬 검증용.

상세 API 구조: analytics/smartlog/README.md
"""

import os
import sys
import json
import requests
from datetime import datetime, timedelta, timezone

# ---- 설정 ----
SMLOG_ID = os.environ.get('SMLOG_ID', 'boloung5757')
SMLOG_PW = os.environ.get('SMLOG_PW', '')
SVID = os.environ.get('SMLOG_SVID', '36572')
WINDOW_DAYS = int(os.environ.get('WINDOW_DAYS', '14'))   # self-healing 재수집 창
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

BASE = 'https://smlog.co.kr'
KST = timezone(timedelta(hours=9))


def yymmdd(d):
    return d.strftime('%y%m%d')


def to_date(yy):
    # '260603' -> date(2026,6,3)
    return datetime.strptime(yy, '%y%m%d').date()


def num(v):
    """문자열 숫자를 int/float 로. 빈값/None 은 None."""
    if v is None or v == '':
        return None
    try:
        f = float(v)
        return int(f) if f.is_integer() else f
    except (ValueError, TypeError):
        return None


def login():
    s = requests.Session()
    s.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      'Chrome/124.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
    })
    r = s.post(BASE + '/2020/member/member.php',
               data={'id': SMLOG_ID, 'pass': SMLOG_PW, 'method': 'login',
                     'sskey': '', 'token': '', 'mid': '', 'sid': '', 'svid': ''},
               timeout=30)
    r.raise_for_status()
    ok = False
    try:
        ok = bool(r.json().get('result'))
    except ValueError:
        pass
    if not ok:
        raise RuntimeError(f'스마트로그 로그인 실패: {r.text[:200]}')
    print(f'[LOGIN] OK (svid={SVID})')
    return s


def call_log_api(s, method, start, end, **extra):
    old_start = start - timedelta(days=(end - start).days + 1)
    old_end = start - timedelta(days=1)
    data = {'method': method, 'svid': SVID,
            'startDate': yymmdd(start), 'endDate': yymmdd(end),
            'oldStartDate': yymmdd(old_start), 'oldEndDate': yymmdd(old_end)}
    data.update(extra)
    r = s.post(BASE + '/api/log_api.php', data=data, timeout=30)
    r.raise_for_status()
    return (r.json() if r.text.strip() else None), data


def call_dashboard_api(s, method):
    data = {'method': method, 'svid': SVID}
    r = s.post(BASE + '/api/dashboard_api.php', data=data, timeout=30)
    r.raise_for_status()
    return (r.json() if r.text.strip() else None), data


# ---- 수집 + 변환 ----
def collect(s, today):
    start = today - timedelta(days=WINDOW_DAYS)
    snap = today.isoformat()
    daily, keyword, dimension, raw = [], [], [], []

    def archive(endpoint, method, params, payload):
        raw.append({'svid': SVID, 'endpoint': endpoint, 'method': method,
                    'params': params, 'payload': payload})

    # 1) 일별 트래픽
    pv, params = call_log_api(s, 'get_page_view_info', start, today)
    archive('log_api', 'get_page_view_info', params, pv)
    for row in ((pv or {}).get('list') or []):
        daily.append({
            'svid': SVID, 'date': to_date(row['yymmdd']).isoformat(),
            'page_view': num(row.get('page_view')),
            'visit_count': num(row.get('visit_count')),
            'visit_time': num(row.get('visit_time')),
            'page_view_per_visit': num(row.get('page_view_per_visit')),
        })

    # 2) 키워드 (최근30일 스냅샷)
    kw, params = call_dashboard_api(s, 'keywordVisitLast30day')
    archive('dashboard_api', 'keywordVisitLast30day', params, kw)
    for row in (kw or []):
        keyword.append({'svid': SVID, 'snapshot_date': snap,
                        'keyword': row.get('keyword'),
                        'visit_count': num(row.get('visit_count'))})

    # 3) 차원 분해 — 환경(os/browser/resolution) + referrer
    env_types = {'os': 'os', 'bs': 'browser', 'rs': 'resolution'}
    for t, dim_type in env_types.items():
        env, params = call_log_api(s, 'get_env', start, today, type=t, page='1', init='1')
        archive('log_api', f'get_env:{t}', params, env)
        for row in ((env or {}).get('list') or []):
            dimension.append(_dim_row(snap, dim_type, row.get(t), row))

    ref, params = call_log_api(s, 'get_referrer', start, today, bookmark='1', page='1', init='true')
    archive('log_api', 'get_referrer', params, ref)
    for row in ((ref or {}).get('list') or []):
        dimension.append(_dim_row(snap, 'referrer', row.get('url'), row))

    # 방문 집중 — 요일(get_time) + 시간대(get_time type=hour)
    wk, params = call_log_api(s, 'get_time', start, today)
    archive('log_api', 'get_time:weekday', params, wk)
    for row in ((wk or {}).get('list') or []):
        dimension.append(_dim_row(snap, 'weekday', row.get('dayofweek'), row))
    hr, params = call_log_api(s, 'get_time', start, today, type='hour')
    archive('log_api', 'get_time:hour', params, hr)
    for row in ((hr or {}).get('list') or []):
        dimension.append(_dim_row(snap, 'hour', row.get('hour'), row))

    # 4) 그 외 dashboard 지표는 원본 아카이브만 (대시보드에서 raw 조회)
    for m in ['dailyCount', 'networkVisitLast30day', 'totalCodeVisitLast30day',
              'itypeConversion', 'adVisitByItype', 'getNaverAdBid']:
        payload, params = call_dashboard_api(s, m)
        archive('dashboard_api', m, params, payload)

    return daily, keyword, dimension, raw


def _dim_row(snap, dim_type, value, row):
    return {
        'svid': SVID, 'snapshot_date': snap, 'dim_type': dim_type,
        'dim_value': value or '(none)',
        'visit_count': num(row.get('visit_count')),
        'break_count': num(row.get('break_count')),
        'visit_time': num(row.get('visit_time')),
        'q_count': num(row.get('q_count')),
        'order_count': num(row.get('order_count')),
        'join_count': num(row.get('join_count')),
        'conversion_amt': num(row.get('conversion_amt')),
    }


# ---- 적재 ----
def upload(daily, keyword, dimension, raw):
    from supabase import create_client
    db = create_client(SUPABASE_URL, SUPABASE_KEY)
    if daily:
        db.table('smartlog_daily').upsert(daily, on_conflict='svid,date').execute()
    if keyword:
        db.table('smartlog_keyword').upsert(keyword, on_conflict='svid,snapshot_date,keyword').execute()
    if dimension:
        db.table('smartlog_dimension').upsert(
            dimension, on_conflict='svid,snapshot_date,dim_type,dim_value').execute()
    if raw:
        db.table('smartlog_raw').insert(raw).execute()
    print(f'[DB] upsert daily={len(daily)} keyword={len(keyword)} '
          f'dimension={len(dimension)} | insert raw={len(raw)}')


def main():
    if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    if not SMLOG_PW:
        sys.exit('환경변수 SMLOG_PW 가 필요합니다.')

    today = datetime.now(KST).date()
    s = login()
    daily, keyword, dimension, raw = collect(s, today)
    print(f'[COLLECT] daily={len(daily)} keyword={len(keyword)} '
          f'dimension={len(dimension)} raw_methods={len(raw)}')

    if SUPABASE_URL and SUPABASE_KEY:
        upload(daily, keyword, dimension, raw)
    else:
        print('[DRY-RUN] SUPABASE_URL/KEY 미설정 → DB 미적재. 샘플 출력:')
        if daily:
            print('  daily[-1]   :', json.dumps(daily[-1], ensure_ascii=False))
        if keyword:
            print('  keyword[:3] :', json.dumps(keyword[:3], ensure_ascii=False))
        if dimension:
            print('  dimension[0]:', json.dumps(dimension[0], ensure_ascii=False))


if __name__ == '__main__':
    main()
