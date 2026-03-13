/**
 * 비엘렌트카 상담 신청
 * Google Sheets 저장 + Gmail 발송 → 네이버 메일 알림
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
    // ========================================
    // 1. 폼 데이터 받기
    // ========================================
    var name = e.parameter['이름'] || "이름없음";
    var phone = e.parameter['연락처'] || "번호없음";
    var carModel = e.parameter['차량종류'] || "선택안함";
    var accidentDate = e.parameter['사고일자'] || "날짜미상";
    var message = e.parameter['문의내용'] || "내용없음";
    var timestamp = new Date();
    
    // ========================================
    // 2. Google Sheets에 저장
    // ========================================
    sheet.appendRow([
      Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
      name,
      phone,
      carModel,
      accidentDate,
      message
    ]);
    
    // ========================================
    // 3. Gmail로 메일 발송 (네이버 메일로)
    // ========================================
    var toEmail = "blrentcar@naver.com";
    var subject = "🚗 [비엘렌트카] " + name + "님 상담 신청";
    
    // 일반 텍스트 메일
    var plainBody = "";
    plainBody += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    plainBody += "🚗 비엘렌트카 상담 신청 알림\n";
    plainBody += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    plainBody += "📋 고객 정보\n";
    plainBody += "────────────────────────\n";
    plainBody += "👤 이름: " + name + "\n";
    plainBody += "📞 연락처: " + phone + "\n";
    plainBody += "🚙 차량: " + carModel + "\n";
    plainBody += "📅 사고일자: " + accidentDate + "\n\n";
    plainBody += "💬 문의내용\n";
    plainBody += "────────────────────────\n";
    plainBody += message + "\n\n";
    plainBody += "⏰ 신청시간: " + Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss') + "\n";
    plainBody += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    plainBody += "📞 바로 전화하기: " + phone + "\n";
    plainBody += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    // HTML 메일 (더 이쁘게)
    var htmlBody = "";
    htmlBody += "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;'>";
    htmlBody += "  <div style='background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center;'>";
    htmlBody += "    <h1 style='margin: 0; font-size: 28px;'>🚗 비엘렌트카</h1>";
    htmlBody += "    <p style='margin: 10px 0 0 0; font-size: 16px;'>새로운 상담 신청이 도착했습니다</p>";
    htmlBody += "  </div>";
    htmlBody += "  <div style='background: white; padding: 40px; border-radius: 0 0 15px 15px;'>";
    htmlBody += "    <h2 style='color: #FF6B00; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;'>📋 고객 정보</h2>";
    htmlBody += "    <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>";
    htmlBody += "      <tr><td style='padding: 15px; background: #f9f9f9; font-weight: bold; width: 30%;'>이름</td><td style='padding: 15px;'>" + name + "</td></tr>";
    htmlBody += "      <tr><td style='padding: 15px; background: #f9f9f9; font-weight: bold;'>연락처</td><td style='padding: 15px;'><a href='tel:" + phone + "' style='color: #FF6B00; font-size: 18px; font-weight: bold; text-decoration: none;'>" + phone + "</a></td></tr>";
    htmlBody += "      <tr><td style='padding: 15px; background: #f9f9f9; font-weight: bold;'>차량</td><td style='padding: 15px;'>" + carModel + "</td></tr>";
    htmlBody += "      <tr><td style='padding: 15px; background: #f9f9f9; font-weight: bold;'>사고일자</td><td style='padding: 15px;'>" + accidentDate + "</td></tr>";
    htmlBody += "    </table>";
    htmlBody += "    <h2 style='color: #FF6B00; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;'>💬 문의 내용</h2>";
    htmlBody += "    <div style='background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; line-height: 1.8;'>" + message.replace(/\n/g, '<br>') + "</div>";
    htmlBody += "    <div style='background: #fff3e0; padding: 15px; border-left: 4px solid #FF6B00; margin: 20px 0;'>";
    htmlBody += "      <strong>⏰ 신청시간:</strong> " + Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy년 MM월 dd일 HH시 mm분');
    htmlBody += "    </div>";
    htmlBody += "    <div style='text-align: center; margin-top: 40px;'>";
    htmlBody += "      <a href='tel:" + phone + "' style='display: inline-block; background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px;'>📞 바로 전화하기</a>";
    htmlBody += "    </div>";
    htmlBody += "  </div>";
    htmlBody += "  <div style='text-align: center; color: #999; font-size: 13px; margin-top: 20px; padding: 20px;'>";
    htmlBody += "    <p>비엘렌트카 자동 알림 시스템</p>";
    htmlBody += "    <p>📞 1666-6525 | 📧 blrentcar@naver.com</p>";
    htmlBody += "  </div>";
    htmlBody += "</div>";
    
    // GmailApp으로 발송 (사람이 보낸 것처럼)
    GmailApp.sendEmail(toEmail, subject, plainBody, {
      htmlBody: htmlBody,
      name: '비엘렌트카'
    });
    
    Logger.log('✅ 메일 발송 성공: ' + toEmail);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success', 
        'row': sheet.getLastRow() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('❌ 오류 발생: ' + error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}

// ========================================
// 테스트 함수
// ========================================

function test() {
  var testData = {
    parameter: {
      '이름': '홍길동',
      '연락처': '010-1234-5678',
      '차량종류': '소나타',
      '사고일자': '2026-01-27',
      '문의내용': '빠른 배차 부탁드립니다.'
    }
  };
  
  doPost(testData);
  Logger.log('✅ 테스트 완료! 구글시트와 네이버 메일 확인하세요!');
}
