// 방문 추적 수집 엔드포인트 (/track)
// analytics.js 가 보낸 이벤트에 Netlify 엣지의 IP·지역(geo)을 붙여 Supabase 에 저장.
// 브라우저 JS 는 자기 IP·지역을 못 보므로, 엣지를 통과시켜 서버측에서 부착한다.
const SUPABASE_URL = 'https://jjwsnwnfhqcszwmjdcac.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqd3Nud25maHFjc3p3bWpkY2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTk3NjgsImV4cCI6MjA4NTMzNTc2OH0.8sH1l1fVKEc48qzT6u4qFyUDPZGaLndcYi8si21dtoc';

export default async (request, context) => {
  if (request.method !== 'POST') return new Response('ok');

  let body = {};
  try { body = await request.json(); } catch (e) { return new Response(null, { status: 204 }); }

  const geo = context.geo || {};
  const ip = context.ip || request.headers.get('x-nf-client-connection-ip') || null;

  // IP·지역을 extra(jsonb)에 부착 — 스키마 변경 없이 저장
  const extra = Object.assign({}, body.extra || {}, {
    ip: ip,
    country: geo.country?.code || null,
    region: geo.subdivision?.name || geo.subdivision?.code || null,
    city: geo.city || null
  });
  const row = Object.assign({}, body, { extra: extra });

  try {
    await fetch(SUPABASE_URL + '/rest/v1/ares_analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    });
  } catch (e) { /* 수집 실패는 무시 (사이트 영향 없음) */ }

  return new Response(null, { status: 204 });
};

export const config = { path: '/track' };
