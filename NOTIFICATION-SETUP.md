# 📬 상담 신청 알림 설정 가이드

상담 신청 폼이 제출되면 **실시간 알림**을 받을 수 있습니다!

---

## 🎯 **추천 방법**

### ⭐ **1순위: 이메일 알림** (가장 간단!)
- 무료
- 설정 5분
- 자동으로 이쁜 HTML 메일 발송

### ⭐ **2순위: 카카오톡 알림**
- 가장 빠른 알림
- 카카오 개발자 계정 필요
- 설정 30분

### ⭐ **3순위: 문자 (SMS)**
- 유료 (건당 20-30원)
- Twilio, CoolSMS 등 서비스 필요

---

## 📧 **방법 1: 이메일 알림 (추천!)**

### **Step 1: Google Sheets 생성**

1. https://sheets.google.com 접속
2. 새 스프레드시트 만들기
3. 첫 줄에 헤더 입력:
   ```
   A1: 신청시간
   B1: 이름
   C1: 연락처
   D1: 차량종류
   E1: 사고일자
   F1: 문의내용
   ```

---

### **Step 2: Apps Script 설정**

1. **도구** → **Apps Script** 클릭
2. 기존 코드 전체 삭제
3. `google-apps-script-email.js` 파일 내용 복사해서 붙여넣기
4. **1줄만 수정:**
   ```javascript
   const NOTIFICATION_EMAIL = "your-email@example.com"; 
   // 👆 이 부분을 실제 이메일로 변경!
   ```

---

### **Step 3: 배포**

1. Apps Script에서 **배포** → **새 배포** 클릭
2. 유형: **웹 앱**
3. 실행 계정: **나**
4. 액세스 권한: **모든 사용자**
5. **배포** 클릭
6. **웹 앱 URL 복사** (매우 중요!)

---

### **Step 4: 홈페이지 연결**

index.html에서 이 부분 찾아서:
```javascript
const scriptURL = "https://script.google.com/macros/s/AKfycbz6J-fvL3HSgwaoMZdq3hj4QRsILGaEx7LxY2rGsy1SX3f1E5RGNtl9cErm0nzQs799tg/exec";
```

위 URL을 **Step 3에서 복사한 URL**로 교체!

---

### **Step 5: 테스트**

1. Apps Script에서 `test` 함수 선택
2. **실행** 클릭
3. 권한 승인
4. 이메일 수신 확인!

---

## 📱 **방법 2: 카카오톡 알림**

### **필요한 것:**
1. 카카오 개발자 계정
2. 앱 등록 및 REST API 키
3. 메시지 전송 권한

### **설정 순서:**

#### **1. 카카오 개발자 등록**
```
1. https://developers.kakao.com 접속
2. 로그인 → 내 애플리케이션
3. 앱 만들기
4. REST API 키 복사
```

#### **2. 친구 목록 가져오기**
```
카카오톡 친구에게 메시지 보내려면
친구의 UUID를 알아야 함
(API 문서 참고: https://developers.kakao.com/docs/latest/ko/message/rest-api)
```

#### **3. Apps Script 코드 사용**
```javascript
// google-apps-script-kakao.js 파일 사용
const KAKAO_REST_API_KEY = "복사한_REST_API_키";
const KAKAO_FRIEND_UUID = "친구_UUID";
const NOTIFICATION_EMAIL = "이메일도_함께";
```

---

## 💬 **방법 3: 문자 (SMS) 알림**

### **추천 서비스:**

#### **CoolSMS (한국)**
```
https://www.coolsms.co.kr
가격: 건당 20원
```

#### **Twilio (글로벌)**
```
https://www.twilio.com
가격: 건당 $0.05 (~60원)
```

### **Apps Script 연동:**
```javascript
function sendSMS(phone, message) {
  const url = 'https://api.coolsms.co.kr/...'; // CoolSMS API
  const options = {
    method: 'post',
    payload: {
      to: phone,
      from: '발신번호',
      text: message
    }
  };
  UrlFetchApp.fetch(url, options);
}
```

---

## 🎨 **이메일 미리보기**

이메일 알림은 이렇게 옵니다:

```
제목: 🚗 [아레스렌트카] 새로운 상담 신청 - 홍길동님

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚗 아레스렌트카 상담 신청 알림
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 고객 정보:
────────────────────────
• 이름: 홍길동
• 연락처: 010-1234-5678
• 차량: 소나타
• 사고일자: 2026-01-27

💬 문의내용:
────────────────────────
빠른 배차 부탁드립니다.

⏰ 신청시간: 2026-01-27 14:30:00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 바로 전화하기: 010-1234-5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

HTML 버전은 훨씬 더 이쁩니다! (컬러, 버튼 등)

---

## ✅ **체크리스트**

### **이메일 알림 설정:**
- [ ] Google Sheets 생성
- [ ] Apps Script 코드 붙여넣기
- [ ] 이메일 주소 수정
- [ ] 웹 앱 배포
- [ ] URL 복사
- [ ] index.html에 URL 적용
- [ ] 테스트 실행
- [ ] 이메일 수신 확인

---

## 🆘 **문제 해결**

### **Q: 이메일이 안 와요!**
```
1. Apps Script 실행 로그 확인
2. Gmail 스팸함 확인
3. 이메일 주소 오타 확인
```

### **Q: 권한 오류가 나요!**
```
1. Apps Script에서 권한 승인 필요
2. "고급" → "안전하지 않은 앱 허용" 클릭
3. Google 계정 보안 설정 확인
```

### **Q: 데이터가 Sheets에 안 들어가요!**
```
1. 배포 URL이 올바른지 확인
2. "모든 사용자" 액세스 권한 확인
3. 웹 앱 재배포 시도
```

---

## 📞 **긴급 연락처**

**Google Apps Script 도움말:**
https://developers.google.com/apps-script

**카카오 개발자 문서:**
https://developers.kakao.com/docs

**CoolSMS 가이드:**
https://www.coolsms.co.kr/guide

---

## 💡 **추천 조합**

### **가장 이상적:**
```
이메일 (기본) + 카카오톡 (빠른 알림)
```

### **가성비:**
```
이메일만 (무료 + 충분함)
```

### **프리미엄:**
```
이메일 + 카카오톡 + 문자 (3중 알림!)
```

---

**이메일 알림이 가장 간단하고 효과적입니다!**
**5분이면 설정 완료 가능! 🚀**
