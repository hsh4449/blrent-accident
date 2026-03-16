const express = require('express');
const path = require('path');
const app = express();

// 환경변수 포트 설정 (Netlify, Vercel 등 호환)
const PORT = process.env.PORT || 3000;

// ========================================
// 미들웨어
// ========================================

// 정적 파일 서빙 (css, js, img, video 폴더)
app.use(express.static(__dirname));

// 로깅 미들웨어 (개발용)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========================================
// 라우트
// ========================================

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 처리
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - 페이지를 찾을 수 없습니다</title>
      <style>
        body { 
          font-family: 'Noto Sans KR', sans-serif; 
          text-align: center; 
          padding: 50px;
          background: #f8f9fa;
        }
        h1 { color: #FF6B00; font-size: 72px; margin: 0; }
        p { font-size: 18px; color: #666; }
        a { 
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background: #FF6B00;
          color: white;
          text-decoration: none;
          border-radius: 8px;
        }
        a:hover { background: #E85D00; }
      </style>
    </head>
    <body>
      <h1>404</h1>
      <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <a href="/">홈으로 돌아가기</a>
    </body>
    </html>
  `);
});

// 서버 에러 핸들링
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>500 - 서버 오류</title>
      <style>
        body { 
          font-family: 'Noto Sans KR', sans-serif; 
          text-align: center; 
          padding: 50px;
        }
        h1 { color: #FF6B00; }
      </style>
    </head>
    <body>
      <h1>서버 오류가 발생했습니다</h1>
      <p>잠시 후 다시 시도해주세요.</p>
    </body>
    </html>
  `);
});

// ========================================
// 서버 시작
// ========================================

app.listen(PORT, () => {
  console.log('');
  console.log('🚗 ========================================');
  console.log('   아레스렌트카 서버 시작!');
  console.log('========================================');
  console.log(`   🌐 URL: http://localhost:${PORT}`);
  console.log(`   📂 폴더: ${__dirname}`);
  console.log(`   ⏰ 시간: ${new Date().toLocaleString('ko-KR')}`);
  console.log('========================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏹️  서버 종료 중...');
  process.exit(0);
});
