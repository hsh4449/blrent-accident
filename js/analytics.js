/* =====================================================================
 * 아레스렌트카 자체 방문 분석 트래커
 * 수집 데이터 → Supabase (ares_analytics 테이블)
 *
 * ▼ 설정: 아래 두 값을 새 Supabase 프로젝트 값으로 채우면 작동 시작.
 *   (채우기 전에는 아무 것도 전송하지 않음 — 배포돼도 에러 없음)
 * ===================================================================== */
(function () {
  'use strict';

  var SUPABASE_URL = '__SUPABASE_URL__';        // 예: https://xxxxxxxx.supabase.co
  var SUPABASE_ANON_KEY = '__SUPABASE_ANON_KEY__';

  // 설정 전이면 즉시 중단
  if (SUPABASE_URL.indexOf('__') === 0 || SUPABASE_ANON_KEY.indexOf('__') === 0) return;

  var ENDPOINT = SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/ares_analytics';

  // ---- util: throttle (선언은 호이스팅됨) ----
  function throttle(fn, wait) {
    var last = 0, timer = null;
    return function () {
      var now = Date.now(), remain = wait - (now - last);
      if (remain <= 0) { last = now; fn(); }
      else if (!timer) { timer = setTimeout(function () { last = Date.now(); timer = null; fn(); }, remain); }
    };
  }

  // ---- ID 관리 ----
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function persistentId(store, key) {
    try {
      var v = store.getItem(key);
      if (!v) { v = uuid(); store.setItem(key, v); }
      return v;
    } catch (e) { return null; }
  }

  // ---- 기기 / OS / 브라우저 ----
  var ua = navigator.userAgent;
  function deviceType() {
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
    if (/Mobi|Android|iPhone|iPod|IEMobile|BlackBerry|Opera Mini/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  function osName() {
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Other';
  }
  function browserName() {
    if (/KAKAOTALK/i.test(ua)) return 'KakaoTalk';
    if (/whale/i.test(ua)) return 'Whale';
    if (/NAVER/i.test(ua)) return 'Naver';
    if (/Edg/i.test(ua)) return 'Edge';
    if (/SamsungBrowser/i.test(ua)) return 'Samsung';
    if (/Chrome/i.test(ua)) return 'Chrome';
    if (/Firefox/i.test(ua)) return 'Firefox';
    if (/Safari/i.test(ua)) return 'Safari';
    return 'Other';
  }

  // ---- UTM / 유입경로 ----
  function qs(name) {
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  var refHost = null;
  try { refHost = document.referrer ? new URL(document.referrer).hostname : null; } catch (e) {}

  var COMMON = {
    visitor_id: persistentId(window.localStorage, 'ares_vid'),
    session_id: persistentId(window.sessionStorage, 'ares_sid'),
    path: location.pathname + location.search,
    referrer: document.referrer || null,
    referrer_host: refHost,
    utm_source: qs('utm_source'),
    utm_medium: qs('utm_medium'),
    utm_campaign: qs('utm_campaign'),
    device: deviceType(),
    os: osName(),
    browser: browserName(),
    screen_w: screen.width,
    screen_h: screen.height,
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
    language: navigator.language || null
  };

  function send(fields) {
    var body = {};
    for (var k in COMMON) body[k] = COMMON[k];
    for (var k2 in fields) body[k2] = fields[k2];
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        keepalive: true, // 페이지 떠날 때도 전송 보장
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body)
      }).catch(function () {});
    } catch (e) {}
  }

  // ---- 1) 페이지뷰 ----
  var startTime = Date.now();
  send({ event_type: 'pageview' });

  // ---- 2) 스크롤 깊이 (25/50/75/100% 도달 시 1회) ----
  var maxScroll = 0, milestones = [25, 50, 75, 100], sent = {};
  function onScroll() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    var pct = Math.min(100, Math.round((window.scrollY / docH) * 100));
    if (pct > maxScroll) maxScroll = pct;
    for (var i = 0; i < milestones.length; i++) {
      var m = milestones[i];
      if (maxScroll >= m && !sent[m]) { sent[m] = true; send({ event_type: 'scroll', scroll_depth: m }); }
    }
  }
  window.addEventListener('scroll', throttle(onScroll, 500), { passive: true });

  // ---- 3) 클릭 추적 (전화 / 카카오) ----
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) send({ event_type: 'click_phone', extra: { href: href } });
    else if (href.indexOf('kakao.com') !== -1) send({ event_type: 'click_kakao', extra: { href: href } });
  }, true);

  // ---- 4) 상담신청 폼 제출 ----
  var form = document.getElementById('consultForm');
  if (form) form.addEventListener('submit', function () { send({ event_type: 'submit_consult' }); });

  // ---- 5) 체류시간 (떠날 때 1회) ----
  var exitSent = false;
  function sendExit() {
    if (exitSent) return; exitSent = true;
    send({ event_type: 'page_exit', duration_sec: Math.round((Date.now() - startTime) / 1000), scroll_depth: maxScroll });
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') sendExit(); });
  window.addEventListener('pagehide', sendExit);
})();
