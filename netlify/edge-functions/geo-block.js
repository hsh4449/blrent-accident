export default async (request, context) => {
  const country = context.geo?.country?.code;
  const userAgent = request.headers.get("user-agent") || "";

  // 검색엔진 및 SNS 크롤러 허용 (구글, 네이버, 다음, 빙, 카카오, 인스타/페이스북, 트위터, 텔레그램, 라인)
  const allowedBots = [
    "googlebot",
    "google-inspectiontool",
    "bingbot",
    "yeti",         // 네이버
    "daumoa",       // 다음
    "kakaotalk-scrap",
    "kakaostory",
    "facebookexternalhit",
    "facebot",
    "instagram",
    "twitterbot",
    "telegrambot",
    "linebot",
    "slurp",        // Yahoo
    "pinterestbot",
    "linkedinbot",
  ];

  const isAllowedBot = allowedBots.some((bot) =>
    userAgent.toLowerCase().includes(bot)
  );

  // 봇이면 허용, 한국이면 허용, 그 외 차단
  if (!isAllowedBot && country && country !== "KR") {
    return new Response(
      `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>비엘렌트카 - 접근 제한</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; color: #333; }
    .container { text-align: center; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>이 서비스는 대한민국에서만 이용 가능합니다.</h1>
    <p>This service is only available in South Korea.</p>
    <p>문의: 1666-6525</p>
  </div>
</body>
</html>`,
      {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  return context.next();
};

export const config = { path: "/*" };
