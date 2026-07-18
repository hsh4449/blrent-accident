/* =====================================================================
 * 김부장렌트카 고객후기 동적 로드
 * Supabase(ares_reviews) 에서 노출(visible) 후기를 불러와
 * #reviewTrack (CSS scroll-snap 트랙)에 렌더.
 * - 로드 실패 시 index.html 의 하드코딩 후기(폴백)를 그대로 유지
 * - 관리자 페이지(analytics/reviews.html)에서 추가/수정/숨김 → 여기 자동 반영
 * ===================================================================== */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://jjwsnwnfhqcszwmjdcac.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqd3Nud25maHFjc3p3bWpkY2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTk3NjgsImV4cCI6MjA4NTMzNTc2OH0.8sH1l1fVKEc48qzT6u4qFyUDPZGaLndcYi8si21dtoc';
  var ENDPOINT = SUPABASE_URL + '/rest/v1/ares_reviews';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function stars(n) {
    n = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
    return '★★★★★'.slice(0, n);
  }
  /* vehicle 필드("셀토스 → BMW 520i 대차") → 라우트 헤더 텍스트 */
  function route(r) {
    return String(r.vehicle || '').replace(/\s*대차\s*$/, '');
  }
  /* 후기 본문에서 과실 비율 추출 → "과실 N%" 칩 (못 찾으면 미노출) */
  function faultChip(text) {
    var t = String(text || '');
    if (/과실\s*(없|0\s*%)/.test(t) || /무과실/.test(t)) return '<span class="rv-fault">과실 0%</span>';
    var m = t.match(/과실[^0-9%]{0,10}(\d{1,2})\s*%/);
    if (m) return '<span class="rv-fault">과실 ' + m[1] + '%</span>';
    return '';
  }
  function card(r) {
    var photo = r.image_url ? '<div class="rv-photo"><img src="' + esc(r.image_url) + '" alt="사고 차량 후기 사진" loading="lazy"></div>' : '';
    return '<article class="rv-card">' +
      '<div class="rv-route">' + esc(route(r)) + '</div>' +
      faultChip(r.text) +
      photo +
      '<div class="rv-stars">' + stars(r.rating) + '</div>' +
      '<p class="rv-text">"' + esc(r.text) + '"</p>' +
      '<div class="rv-author">' + esc(r.author_name) + '</div>' +
      '</article>';
  }

  var track = document.getElementById('reviewTrack');
  if (!track) return;

  fetch(ENDPOINT + '?select=*&visible=eq.true&order=sort_order.asc,created_at.asc', {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY }
  })
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (rows) {
      if (rows && rows.length) track.innerHTML = rows.map(card).join('');
      // 비어있으면 하드코딩 폴백 유지
    })
    .catch(function () { /* 실패 시 하드코딩 폴백 유지 */ });
})();
