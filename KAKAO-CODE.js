/**
 * 비엘렌트카 상담 신청 → 카카오톡 알림
 * 복사해서 Google Apps Script에 붙여넣으세요!
 */

// ========================================
// 🔧 설정: 여기만 수정하세요!
// ========================================

// 카카오톡 Webhook URL (2단계에서 복사한 URL 붙여넣기)
const KAKAO_WEBHOOK_URL = "여기에_Webhook_URL_붙여넣기";

// ========================================
// 메인 함수 (수정 금지!)
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
    
    // 2. 카카오톡 알림 발송
    sendKakaoNotification(name, phone, carModel, accidentDate, message, timestamp);
    
    return ContentService.createTextOutput('success');
    
  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput('error: ' + error);
  }
}

// ========================================
// 카카오톡 알림 함수 (수정 금지!)
// ========================================

function sendKakaoNotification(name, phone, carModel, accidentDate, message, timestamp) {
  
  const kakaoMessage = {
    "text": `🚗 [비엘렌트카] 새로운 상담 신청!\n\n━━━━━━━━━━━━━━━━━━━\n📋 고객 정보\n━━━━━━━━━━━━━━━━━━━\n\n👤 이름: ${name}\n📞 연락처: ${phone}\n🚙 차량: ${carModel || '미입력'}\n📅 사고일자: ${accidentDate || '미입력'}\n\n💬 문의내용\n━━━━━━━━━━━━━━━━━━━\n${message || '없음'}\n\n⏰ 신청시간: ${Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm')}\n━━━━━━━━━━━━━━━━━━━`
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(kakaoMessage),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(KAKAO_WEBHOOK_URL, options);
    Logger.log('카카오톡 알림 발송 성공: ' + response.getContentText());
  } catch (error) {
    Logger.log('카카오톡 알림 실패: ' + error);
  }
}

// ========================================
// 테스트 함수 (실행해서 테스트하세요!)
// ========================================

function test() {
  sendKakaoNotification(
    '홍길동',
    '010-1234-5678',
    '소나타',
    '2026-01-27',
    '빠른 배차 부탁드립니다.',
    new Date()
  );
  Logger.log('✅ 테스트 완료! 카카오톡 확인하세요!');
}
