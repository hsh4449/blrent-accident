/**
 * 비엘렌트카 상담 신청 → 카카오톡 알림 (나에게 보내기)
 * 가장 간단한 방법!
 */

// ========================================
// 설정: 여기만 수정하세요!
// ========================================

// 카카오 REST API 키 (https://developers.kakao.com에서 발급)
const KAKAO_REST_API_KEY = "YOUR_REST_API_KEY_HERE";

// 카카오톡 액세스 토큰 (아래 getAccessToken() 함수 실행해서 얻기)
const KAKAO_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN_HERE";

// ========================================
// 메인 함수
// ========================================

function doPost(e) {
  try {
    // 1. Google Sheets에 저장
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    
    const name = e.parameter['이름'] || '';
    const phone = e.parameter['연락처'] || '';
    const carModel = e.parameter['차량종류'] || '';
    const accidentDate = e.parameter['사고일자'] || '';
    const message = e.parameter['문의내용'] || '';
    
    // 시트에 추가
    sheet.appendRow([
      Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
      name,
      phone,
      carModel,
      accidentDate,
      message
    ]);
    
    // 2. 카카오톡으로 나에게 보내기
    sendKakaoMessage(name, phone, carModel, accidentDate, message, timestamp);
    
    return ContentService.createTextOutput('success');
    
  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput('error');
  }
}

// ========================================
// 카카오톡 메시지 발송 (나에게 보내기)
// ========================================

function sendKakaoMessage(name, phone, carModel, accidentDate, message, timestamp) {
  const url = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
  
  // 메시지 내용
  const messageText = `🚗 [비엘렌트카] 새 상담 신청!

📋 고객 정보:
• 이름: ${name}
• 연락처: ${phone}
• 차량: ${carModel || '미입력'}
• 사고일자: ${accidentDate || '미입력'}

💬 문의내용:
${message || '없음'}

⏰ ${Utilities.formatDate(timestamp, 'Asia/Seoul', 'MM/dd HH:mm')}`;

  const payload = {
    template_object: JSON.stringify({
      object_type: 'text',
      text: messageText,
      link: {
        web_url: 'https://blrent-dj.netlify.app',
        mobile_web_url: 'https://blrent-dj.netlify.app'
      },
      button_title: '전화하기'
    })
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + KAKAO_ACCESS_TOKEN,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    payload: payload,
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log('카카오톡 발송 성공: ' + response.getContentText());
  } catch (error) {
    Logger.log('카카오톡 발송 실패: ' + error);
  }
}

// ========================================
// 액세스 토큰 발급 (처음 한 번만 실행)
// ========================================

function getAccessToken() {
  // 1. https://developers.kakao.com/console 접속
  // 2. 내 애플리케이션 → 앱 설정 → 플랫폼 추가 → Web
  // 3. Redirect URI: https://developers.kakao.com/tool/demo/oauth
  // 4. 동의항목 설정 → talk_message 권한 활성화
  // 5. 아래 URL을 브라우저에 입력 (REST_API_KEY는 본인 것으로 교체):
  
  const AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=https://developers.kakao.com/tool/demo/oauth&response_type=code`;
  
  Logger.log('1. 아래 URL로 접속하세요:');
  Logger.log(AUTH_URL);
  Logger.log('');
  Logger.log('2. 로그인 후 나오는 code 값을 복사');
  Logger.log('3. 아래 getTokenFromCode() 함수에 code 붙여넣고 실행');
}

function getTokenFromCode() {
  const CODE = "여기에_인증코드_붙여넣기"; // 👈 여기에 code 값 입력!
  
  const url = 'https://kauth.kakao.com/oauth/token';
  const payload = {
    grant_type: 'authorization_code',
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: 'https://developers.kakao.com/tool/demo/oauth',
    code: CODE
  };
  
  const options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  
  Logger.log('========================================');
  Logger.log('🎉 액세스 토큰 발급 성공!');
  Logger.log('========================================');
  Logger.log('아래 토큰을 복사해서 위의 KAKAO_ACCESS_TOKEN에 붙여넣으세요:');
  Logger.log('');
  Logger.log(result.access_token);
  Logger.log('');
  Logger.log('========================================');
}

// ========================================
// 테스트 함수
// ========================================

function test() {
  sendKakaoMessage(
    '테스트 고객',
    '010-1234-5678',
    '소나타',
    '2026-01-27',
    '빠른 배차 부탁드립니다.',
    new Date()
  );
  Logger.log('테스트 메시지 발송 완료!');
}
