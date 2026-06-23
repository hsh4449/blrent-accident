/* =====================================================================
 * 아레스렌트카 고객후기 동적 로드
 * Supabase(ares_reviews) 에서 노출(visible) 후기를 불러와 슬라이더에 렌더.
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
    var s = '';
    for (var i = 0; i < n; i++) s += '<i class="fas fa-star"></i>';
    return s;
  }
  function slide(r) {
    return '<div class="swiper-slide"><div class="review-card">' +
      '<div class="review-rating">' + stars(r.rating) + '</div>' +
      '<p class="review-text">"' + esc(r.text) + '"</p>' +
      '<div class="review-author">' +
      '<div class="author-name">' + esc(r.author_name) + '</div>' +
      '<div class="author-vehicle">' + esc(r.vehicle || '') + '</div>' +
      '</div></div></div>';
  }
  function reinit() {
    try { if (window.reviewSwiper && window.reviewSwiper.destroy) window.reviewSwiper.destroy(true, true); } catch (e) {}
    window.reviewSwiper = new Swiper('.reviewSwiper', window.REVIEW_SWIPER_CONFIG || {});
  }

  var wrap = document.querySelector('.reviewSwiper .swiper-wrapper');
  if (!wrap) return;

  fetch(ENDPOINT + '?select=*&visible=eq.true&order=sort_order.asc,created_at.asc', {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY }
  })
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (rows) {
      if (rows && rows.length) {
        wrap.innerHTML = rows.map(slide).join('');
        reinit();   // 동적 후기로 교체 후 슬라이더 재초기화
      }
      // 비어있으면 하드코딩 폴백 유지(이미 main.js 가 초기화함)
    })
    .catch(function () { /* 실패 시 하드코딩 폴백 유지 */ });
})();
