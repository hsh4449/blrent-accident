# 🚗 비엘렌트카 - 통합 버전 (1번 구조 + 2번 기능)

> **2번 → 1번 마이그레이션 완료 버전**  
> 모바일 우선 구조 + SEO 최적화 + Google Apps Script 폼 연동

---

## 🎯 **이 버전의 특징**

### ✅ **1번에서 가져온 것**
- 📁 깔끔한 파일 구조 (HTML/CSS/JS 분리)
- 📱 완벽한 모바일 최적화
- 🎨 주황색 브랜드 컬러
- 🔧 Swiper.js 슬라이더
- 📍 고정 하단 CTA 버튼

### ✅ **2번에서 가져온 것**
- 🔍 완벽한 SEO 메타태그
- 📝 Google Apps Script 상담 폼
- 🏢 실제 사업자 정보 (대전/세종/충청)
- 📞 실제 전화번호 (1666-6525)
- 🌐 Schema.org 구조화 데이터
- ✅ 네이버/구글 검색엔진 인증

---

## 📁 **프로젝트 구조**

```
blrent-migration/
├── index.html              # 메인 HTML (SEO 최적화)
├── css/
│   └── style.css          # 스타일시트 (1번 + 폼 스타일)
├── js/
│   └── main.js            # JavaScript (모바일 기능)
├── img/                   # 이미지 폴더 (차량 사진 여기에)
├── video/                 # 비디오 폴더 (선택사항)
├── server.js              # Express 서버
├── package.json           # NPM 설정
└── README.md              # 이 파일

```

---

## 🚀 **설치 및 실행**

### **1단계: 의존성 설치**
```bash
npm install
```

### **2단계: 서버 실행**
```bash
# 프로덕션 모드
npm start

# 개발 모드 (자동 재시작)
npm run dev
```

### **3단계: 브라우저 접속**
```
http://localhost:3000
```

---

## 📝 **다음 할 일 체크리스트**

### ✅ **즉시 해야 할 것**

- [ ] **차량 이미지 교체**
  - `img/benz-e-class.jpg`
  - `img/bmw-5-series.jpg`
  - `img/porsche-panamera.jpg`
  - `img/genesis-g80.jpg`
  - `img/tesla-model-3.jpg`
  - `img/lexus-es.jpg`

- [ ] **사업자 정보 확인**
  - Footer의 대표자명
  - 사업자등록번호
  - 통신판매업신고번호

- [ ] **카카오톡 채널 확인**
  - 현재: `@blrentcar`
  - 실제 채널로 변경 필요시 수정

### 🔄 **1주일 내**

- [ ] **Netlify 재배포**
  1. Netlify에 로그인
  2. 기존 사이트 설정 → Deploy settings
  3. 새 폴더 업로드 또는 GitHub 연동
  4. 배포 완료

- [ ] **Google Apps Script 폼 테스트**
  - 상담 신청 폼 제출 테스트
  - Google Sheets 데이터 확인

- [ ] **모바일 테스트**
  - 실제 스마트폰에서 테스트
  - 터치 동작 확인
  - 고정 하단 CTA 확인

---

## 🔧 **커스터마이징 가이드**

### **1. 전화번호 변경**
```html
<!-- index.html -->
<a href="tel:1666-6525">
```
→ `tel:` 뒤의 번호만 변경

### **2. 카카오톡 채널 변경**
```html
<a href="https://pf.kakao.com/_blrentcar">
```
→ `_blrentcar`를 실제 채널 ID로 변경

### **3. 주소 변경**
```html
<!-- index.html -->
대전광역시 서구 괴정로 168, 2층 1호
```
→ 텍스트 직접 수정

### **4. Google Apps Script URL 변경**
```javascript
// index.html 맨 아래
const scriptURL = "https://script.google.com/macros/s/...";
```
→ 새로운 Google Apps Script URL로 교체

---

## 🌐 **Netlify 배포 가이드**

### **방법 1: 드래그 앤 드롭**
1. [Netlify](https://netlify.com) 로그인
2. "Add new site" → "Deploy manually"
3. 이 폴더 전체를 드래그 앤 드롭
4. 배포 완료!

### **방법 2: GitHub 연동 (권장)**
1. GitHub에 새 저장소 생성
2. 이 폴더를 푸시
```bash
git init
git add .
git commit -m "1번+2번 통합 버전"
git remote add origin [YOUR_REPO_URL]
git push -u origin main
```
3. Netlify에서 "New site from Git" 선택
4. GitHub 저장소 연결
5. 자동 배포 완료!

### **방법 3: Netlify CLI**
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod
```

---

## 📊 **2번과의 주요 차이점**

| 항목 | 2번 (기존) | 통합 버전 | 개선도 |
|------|-----------|----------|--------|
| 파일 구조 | 단일 HTML | HTML/CSS/JS 분리 | ⭐⭐⭐⭐⭐ |
| 모바일 최적화 | 보통 | 완벽 | ⭐⭐⭐⭐⭐ |
| SEO | 완벽 | 완벽 (유지) | ⭐⭐⭐⭐⭐ |
| 유지보수 | 어려움 | 쉬움 | ⭐⭐⭐⭐⭐ |
| 성능 | 느림 (비디오) | 빠름 | ⭐⭐⭐⭐ |
| 고정 CTA | 없음 | 있음 | ⭐⭐⭐⭐⭐ |

---

## ⚠️ **주의사항**

### **이미지 파일 필수!**
현재 `img/` 폴더에 이미지가 없으면 차량이 표시되지 않습니다.
**반드시** 실제 차량 사진을 업로드하세요!

### **배경 비디오는 제거됨**
2번의 무거운 배경 비디오는 제거했습니다.
필요시 직접 추가 가능합니다.

### **Google Apps Script URL 확인**
상담 폼이 작동하려면 **반드시** Google Apps Script가 설정되어 있어야 합니다.

---

## 🎓 **추가 개발 아이디어**

### **단기 (1주일)**
- [ ] 404 페이지 디자인 개선
- [ ] 로딩 애니메이션 추가
- [ ] 이미지 최적화 (WebP 변환)

### **중기 (1개월)**
- [ ] 예약 캘린더 기능
- [ ] 실시간 채팅 위젯
- [ ] 블로그 섹션

### **장기 (3개월)**
- [ ] 관리자 대시보드
- [ ] 회원 시스템
- [ ] 데이터베이스 연동

---

## 💬 **문의 및 지원**

**기술 문의**: contact@blrentcar.com  
**전화**: 1666-6525  
**영업시간**: 24시간 연중무휴

---

## 📜 **버전 히스토리**

### v2.0.0 (2024-01-XX)
- ✅ 1번 구조 + 2번 기능 통합
- ✅ 모바일 최적화 강화
- ✅ Google Apps Script 폼 연동
- ✅ Express 서버 에러 핸들링 추가

### v1.0.0 (2024-01-22)
- ✅ 2번 버전 (단일 HTML, 프리미엄 디자인)

---

**🚗 비엘렌트카와 함께 안전하고 편안한 이동을 시작하세요!**
