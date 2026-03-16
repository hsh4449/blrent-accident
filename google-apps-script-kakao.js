/**
 * 아레스렌트카 상담 신청 폼 처리
 * Google Sheets 저장 + 카카오톡 알림
 */

// ========================================
// 1. 설정 (여기만 수정하세요!)
// ========================================

// 카카오톡 REST API 키 (https://developers.kakao.com)
const KAKAO_REST_API_KEY = "YOUR_KAKAO_REST_API_KEY";

// 카카오톡 메시지 받을 사람의 친구 UUID
// (친구 목록 조회 API로 확인 가능)
const KAKAO_FRIEND_UUID = "YOUR_FRIEND_UUID";

// 이메일 알림 받을 주소
const NOTIFICATION_EMAIL = "your-email@example.com";

// ========================================
// 2. 메인 함수 (수정 불필요)
// ========================================

function doPost(e) {
  try {
    // Google Sheets에 저장
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    
    // 폼 데이터 파싱
    const formData = {
      timestamp: timestamp,
      name: e.parameter['이름'] || '',
      phone: e.parameter['연락처'] || '',
      carModel: e.parameter['차량종류'] || '',
      accidentDate: e.parameter['사고일자'] || '',
      message: e.parameter['문의내용'] || ''
    };
    
    // 시트에 추가
    sheet.appendRow([
      formData.timestamp,
      formData.name,
      formData.phone,
      formData.carModel,
      formData.accidentDate,
      formData.message
    ]);
    
    // 카카오톡 알림 발송
    sendKakaoNotification(formData);
    
    // 이메일 알림 발송
    sendEmailNotification(formData);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '상담 신청이 완료되었습니다'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// 3. 카카오톡 알림 함수
// ========================================

function sendKakaoNotification(data) {
  const message = `🚗 [아레스렌트카] 새로운 상담 신청

📋 신청 정보:
• 이름: ${data.name}
• 연락처: ${data.phone}
• 차량: ${data.carModel || '미입력'}
• 사고일자: ${data.accidentDate || '미입력'}

💬 문의내용:
${data.message || '없음'}

⏰ 신청시간: ${Utilities.formatDate(data.timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')}`;

  const url = 'https://kapi.kakao.com/v1/api/talk/friends/message/default/send';
  
  const payload = {
    receiver_uuids: JSON.stringify([KAKAO_FRIEND_UUID]),
    template_object: JSON.stringify({
      object_type: 'text',
      text: message,
      link: {
        web_url: 'https://blrent-dj.netlify.app',
        mobile_web_url: 'https://blrent-dj.netlify.app'
      }
    })
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + KAKAO_REST_API_KEY
    },
    payload: payload,
    muteHttpExceptions: true
  };
  
  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log('Kakao notification failed: ' + error);
  }
}

// ========================================
// 4. 이메일 알림 함수
// ========================================

function sendEmailNotification(data) {
  const subject = `🚗 [아레스렌트카] 새로운 상담 신청 - ${data.name}님`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
      <div style="background: #FF6B00; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🚗 아레스렌트카 상담 신청</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #FF6B00; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;">📋 고객 정보</h2>
        
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold; width: 30%;">이름</td>
            <td style="padding: 10px;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">연락처</td>
            <td style="padding: 10px;"><a href="tel:${data.phone}" style="color: #FF6B00;">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">차량 종류</td>
            <td style="padding: 10px;">${data.carModel || '미입력'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">사고 일자</td>
            <td style="padding: 10px;">${data.accidentDate || '미입력'}</td>
          </tr>
        </table>
        
        <h2 style="color: #FF6B00; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;">💬 문의 내용</h2>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          ${data.message || '없음'}
        </div>
        
        <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #FF6B00; margin: 20px 0;">
          <strong>⏰ 신청 시간:</strong> ${Utilities.formatDate(data.timestamp, 'Asia/Seoul', 'yyyy년 MM월 dd일 HH시 mm분')}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="tel:${data.phone}" style="display: inline-block; background: #FF6B00; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            📞 바로 전화하기
          </a>
        </div>
      </div>
      
      <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
        <p>아레스렌트카 자동 알림 시스템</p>
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (error) {
    Logger.log('Email notification failed: ' + error);
  }
}

// ========================================
// 5. 테스트 함수 (직접 실행 가능)
// ========================================

function testNotification() {
  const testData = {
    timestamp: new Date(),
    name: '테스트 고객',
    phone: '010-1234-5678',
    carModel: '소나타',
    accidentDate: '2026-01-27',
    message: '빠른 배차 부탁드립니다.'
  };
  
  sendKakaoNotification(testData);
  sendEmailNotification(testData);
  
  Logger.log('테스트 알림 발송 완료!');
}
