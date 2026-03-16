# 💬 카카오톡 알림 설정 가이드

상담 신청이 들어오면 **내 카카오톡으로 즉시 알림!**

---

## 🎯 **설정 시간: 약 10분**

---

## 📋 **전체 과정**

```
1. 카카오 개발자 계정 만들기 (2분)
2. 앱 등록 (3분)
3. Google Apps Script 설정 (3분)
4. 테스트 (2분)
```

---

## 🚀 **Step 1: 카카오 개발자 등록**

### **1-1. 개발자 계정 만들기**
```
1. https://developers.kakao.com 접속
2. 로그인 (카카오톡 계정으로)
3. "시작하기" 클릭
```

### **1-2. 앱 만들기**
```
1. "내 애플리케이션" 클릭
2. "애플리케이션 추가하기" 클릭
3. 앱 이름: "아레스렌트카" 입력
4. 회사명: "아레스렌트카" 입력
5. 저장
```

### **1-3. REST API 키 복사**
```
1. 생성된 앱 클릭
2. "앱 키" 탭
3. "REST API 키" 복사 (중요!)
   예: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 🔧 **Step 2: 앱 설정**

### **2-1. 플랫폼 추가**
```
1. "플랫폼" 탭 클릭
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인: https://blrent-dj.netlify.app
4. Redirect URI: https://developers.kakao.com/tool/demo/oauth
5. 저장
```

### **2-2. 동의항목 설정**
```
1. "카카오 로그인" 탭
2. "활성화 설정" → ON
3. "동의항목" 클릭
4. "카카오톡 메시지 전송" → 필수 동의 (ON)
5. 저장
```

---

## 📝 **Step 3: Google Sheets 준비**

### **3-1. Sheets 만들기**
```
1. https://sheets.google.com 접속
2. 새 스프레드시트
3. 이름: "아레스렌트카 상담신청"
```

### **3-2. 헤더 입력**
```
A1: 신청시간
B1: 이름
C1: 연락처
D1: 차량종류
E1: 사고일자
F1: 문의내용
```

---

## 💻 **Step 4: Apps Script 코드 입력**

### **4-1. Apps Script 열기**
```
1. 도구 → Apps Script
2. 기존 코드 전체 삭제
3. google-apps-script-kakao-simple.js 파일 내용 복사
4. 붙여넣기
```

### **4-2. REST API 키 입력**
```javascript
// 이 부분 찾아서 수정:
const KAKAO_REST_API_KEY = "YOUR_REST_API_KEY_HERE";

// 👇 이렇게 바꾸기:
const KAKAO_REST_API_KEY = "복사한_REST_API_키";
```

---

## 🔑 **Step 5: 액세스 토큰 발급 (중요!)**

### **5-1. 인증 URL 생성**
```
1. Apps Script에서 "getAccessToken" 함수 선택
2. 실행 클릭
3. 로그에 나온 URL 복사
```

### **5-2. 인증**
```
1. 복사한 URL을 브라우저에 붙여넣기
2. 카카오톡 로그인
3. "동의하고 계속하기" 클릭
4. URL에 나온 code 값 복사
   예: https://developers.kakao.com/...?code=ABC123XYZ
        👆 이 부분 복사
```

### **5-3. 토큰 발급**
```
1. Apps Script로 돌아가기
2. "getTokenFromCode" 함수 찾기
3. 이 부분 수정:
   const CODE = "여기에_인증코드_붙여넣기";
   👇
   const CODE = "복사한_code값";

4. 실행 클릭
5. 로그에 나온 액세스 토큰 복사
```

### **5-4. 토큰 입력**
```javascript
// 이 부분 찾아서 수정:
const KAKAO_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN_HERE";

// 👇 이렇게 바꾸기:
const KAKAO_ACCESS_TOKEN = "복사한_액세스_토큰";
```

**저장!** (Ctrl+S)

---

## 🌐 **Step 6: 웹 앱 배포**

```
1. Apps Script 우측 상단 "배포" 클릭
2. "새 배포" 선택
3. 설정:
   - 유형: 웹 앱
   - 실행 계정: 나
   - 액세스 권한: 모든 사용자
4. "배포" 클릭
5. 웹 앱 URL 복사! (매우 중요)
   예: https://script.google.com/macros/s/.../exec
```

---

## 🔗 **Step 7: 홈페이지 연결**

### **index.html 수정**

이 부분 찾기:
```javascript
const scriptURL = "https://script.google.com/macros/s/AKfycbz6J-fvL3HSgwaoMZdq3hj4QRsILGaEx7LxY2rGsy1SX3f1E5RGNtl9cErm0nzQs799tg/exec";
```

위 URL을 **Step 6에서 복사한 URL**로 교체!

---

## 🧪 **Step 8: 테스트**

### **8-1. Apps Script 테스트**
```
1. Apps Script에서 "test" 함수 선택
2. 실행 클릭
3. 카카오톡 확인!
```

### **8-2. 실제 폼 테스트**
```
1. 홈페이지 접속
2. 상담 신청 폼 작성
3. 제출
4. 카카오톡 확인!
```

---

## 📱 **카카오톡 메시지 미리보기**

```
🚗 [아레스렌트카] 새 상담 신청!

📋 고객 정보:
• 이름: 홍길동
• 연락처: 010-1234-5678
• 차량: 소나타
• 사고일자: 2026-01-27

💬 문의내용:
빠른 배차 부탁드립니다.

⏰ 01/27 14:30

[전화하기 버튼]
```

---

## ✅ **체크리스트**

- [ ] 카카오 개발자 계정 생성
- [ ] 앱 만들기
- [ ] REST API 키 복사
- [ ] Web 플랫폼 등록
- [ ] 카카오톡 메시지 권한 활성화
- [ ] Google Sheets 생성
- [ ] Apps Script 코드 붙여넣기
- [ ] REST API 키 입력
- [ ] 액세스 토큰 발급
- [ ] 액세스 토큰 입력
- [ ] 웹 앱 배포
- [ ] URL 복사
- [ ] index.html 수정
- [ ] 테스트 성공!

---

## 🆘 **자주 발생하는 문제**

### **Q: 토큰 발급이 안 돼요!**
```
A: 동의항목에서 "카카오톡 메시지 전송" 권한 확인
   플랫폼에 Redirect URI 정확히 입력했는지 확인
```

### **Q: 메시지가 안 와요!**
```
A: 
1. 액세스 토큰이 올바른지 확인
2. Apps Script 로그 확인 (Ctrl+Enter)
3. test() 함수로 먼저 테스트
```

### **Q: 권한 오류가 나요!**
```
A: Apps Script 실행 시 권한 승인 필요
   "고급" → "안전하지 않은 앱 허용" 클릭
```

---

## 🎁 **추가 팁**

### **토큰 갱신**
```
액세스 토큰은 영구적입니다!
한 번 발급받으면 계속 사용 가능
(단, 앱을 삭제하거나 권한을 취소하면 재발급 필요)
```

### **여러 명에게 보내기**
```
친구에게도 보내고 싶다면:
1. 친구 목록 API로 UUID 확인
2. 코드에서 /v2/api/talk/memo 대신
   /v1/api/talk/friends/message 사용
```

---

## 📞 **도움말**

**카카오 개발자 문서:**
https://developers.kakao.com/docs/latest/ko/message/rest-api

**문제가 계속되면:**
카카오 개발자 포럼이나 Q&A 활용

---

**10분이면 설정 완료! 실시간 알림 받으세요! 💬🚀**
