/**
 * 아레스렌트카 상담 신청 폼 처리
 * Google Sheets 저장 + 이메일 알림 (간단 버전)
 */

// ========================================
// 설정: 이메일 주소만 입력하세요!
// ========================================
const NOTIFICATION_EMAIL = "blrentcar@naver.com"; // 👈 실제 이메일 적용됨!

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
    
    // 2. 이메일 알림 발송
    sendEmail(name, phone, carModel, accidentDate, message, timestamp);
    
    return ContentService.createTextOutput('success');
    
  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput('error');
  }
}

// ========================================
// 이메일 발송 함수
// ========================================

function sendEmail(name, phone, carModel, accidentDate, message, timestamp) {
  const subject = `🚗 [아레스렌트카] 새로운 상담 신청 - ${name}님`;
  
  const body = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚗 아레스렌트카 상담 신청 알림
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 고객 정보:
────────────────────────
• 이름: ${name}
• 연락처: ${phone}
• 차량: ${carModel || '미입력'}
• 사고일자: ${accidentDate || '미입력'}

💬 문의내용:
────────────────────────
${message || '없음'}

⏰ 신청시간: ${Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 바로 전화하기: ${phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  try {
    // 일반 텍스트 이메일
    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    
    // HTML 이메일 (더 이쁘게)
    const htmlBody = `
      <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center; box-shadow: 0 4px 15px rgba(255,107,0,0.3);">
          <h1 style="margin: 0; font-size: 28px;">🚗 아레스렌트카</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">새로운 상담 신청이 도착했습니다</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 5px solid #FF6B00;">
            <h2 style="color: #FF6B00; margin: 0 0 15px 0; font-size: 20px;">📋 고객 정보</h2>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 15px; background: #f9f9f9; font-weight: bold; width: 30%; border-radius: 5px 0 0 0;">이름</td>
              <td style="padding: 15px; background: white; border-left: 3px solid #FF6B00;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 15px; background: #f9f9f9; font-weight: bold;">연락처</td>
              <td style="padding: 15px; background: white; border-left: 3px solid #FF6B00;"><a href="tel:${phone}" style="color: #FF6B00; text-decoration: none; font-size: 18px; font-weight: bold;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 15px; background: #f9f9f9; font-weight: bold;">차량 종류</td>
              <td style="padding: 15px; background: white; border-left: 3px solid #FF6B00;">${carModel || '미입력'}</td>
            </tr>
            <tr>
              <td style="padding: 15px; background: #f9f9f9; font-weight: bold; border-radius: 0 0 0 5px;">사고 일자</td>
              <td style="padding: 15px; background: white; border-left: 3px solid #FF6B00; border-radius: 0 0 5px 0;">${accidentDate || '미입력'}</td>
            </tr>
          </table>
          
          <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 10px; margin: 30px 0; border-left: 5px solid #FF6B00;">
            <h2 style="color: #FF6B00; margin: 0 0 15px 0; font-size: 20px;">💬 문의 내용</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; line-height: 1.8; color: #333;">
              ${message || '<span style="color: #999;">문의 내용 없음</span>'}
            </div>
          </div>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <strong style="color: #666;">⏰ 신청 시간:</strong> 
            <span style="color: #FF6B00; font-weight: bold;">${Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy년 MM월 dd일 HH시 mm분')}</span>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="tel:${phone}" style="display: inline-block; background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255,107,0,0.3); transition: transform 0.3s;">
              📞 바로 전화하기
            </a>
          </div>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 13px; margin-top: 30px; padding: 20px;">
          <p style="margin: 5px 0;">━━━━━━━━━━━━━━━━━━</p>
          <p style="margin: 5px 0;">아레스렌트카 자동 알림 시스템</p>
          <p style="margin: 5px 0;">📞 1666-6525 | 📧 contact@blrentcar.com</p>
          <p style="margin: 5px 0;">━━━━━━━━━━━━━━━━━━</p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });
    
    Logger.log('이메일 발송 성공: ' + NOTIFICATION_EMAIL);
    
  } catch (error) {
    Logger.log('이메일 발송 실패: ' + error);
  }
}

// ========================================
// 테스트 함수 (직접 실행 가능)
// ========================================

function test() {
  sendEmail(
    '홍길동',
    '010-1234-5678', 
    '소나타',
    '2026-01-27',
    '빠른 배차 부탁드립니다.',
    new Date()
  );
  Logger.log('테스트 이메일 발송 완료!');
}
