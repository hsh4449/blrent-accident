# ✅ 2번 → 1번 마이그레이션 체크리스트

## 📋 **완료된 작업**

### ✅ **파일 구조 개선**
- [x] HTML/CSS/JS 분리
- [x] 폴더 구조 정리 (css/, js/, img/, video/)
- [x] .gitignore 추가
- [x] README.md 작성

### ✅ **2번 기능 이식**
- [x] SEO 메타태그 전체 복사
- [x] Open Graph 태그
- [x] Schema.org 구조화 데이터
- [x] 네이버/구글 검색엔진 인증
- [x] Google Apps Script 폼 연동
- [x] 실제 전화번호 (1666-6525)
- [x] 실제 주소 (대전광역시 서구 괴정로 168)

### ✅ **1번 기능 유지**
- [x] 고정 헤더 + 햄버거 메뉴
- [x] 프로모션 배너 슬라이더
- [x] 서비스 카드 (6개)
- [x] 보유차량 갤러리
- [x] 이용절차 타임라인
- [x] 고객후기 슬라이더
- [x] FAQ 아코디언
- [x] 고정 하단 CTA (모바일)

### ✅ **백엔드 개선**
- [x] Express 서버 에러 핸들링
- [x] 404 페이지
- [x] 환경변수 포트 설정
- [x] Graceful shutdown
- [x] npm start 스크립트

---

## 🚨 **즉시 해야 할 일 (필수)**

### 1️⃣ **차량 이미지 추가**
```bash
# img/ 폴더에 아래 이미지 파일 추가
img/benz-e-class.jpg      # 벤츠 E-Class
img/bmw-5-series.jpg      # BMW 5시리즈
img/porsche-panamera.jpg  # 포르쉐 파나메라
img/genesis-g80.jpg       # 제네시스 G80
img/tesla-model-3.jpg     # 테슬라 Model 3
img/lexus-es.jpg          # 렉서스 ES
```

**권장 사이즈**: 800x600px (4:3 비율)  
**포맷**: JPG (WebP 권장)  
**용량**: 파일당 200KB 이하

---

### 2️⃣ **사업자 정보 확인**
```html
<!-- index.html의 Footer 섹션 -->
<p>대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
<p>통신판매업신고번호: 제2024-대전서구-12345호</p>
```
→ 실제 정보로 변경 필요!

---

### 3️⃣ **Google Apps Script 테스트**
1. 상담 폼 제출 테스트
2. Google Sheets에 데이터 확인
3. 이메일 알림 설정 (선택)

---

## 🌐 **Netlify 재배포 가이드**

### **방법 A: 기존 사이트 업데이트**

1. **Netlify 대시보드 접속**
   - https://app.netlify.com
   - 기존 `blrent-dj` 사이트 선택

2. **Deploys 탭 선택**
   - "Deploy manually" 클릭

3. **파일 업로드**
   ```
   blrent-migration/ 폴더 전체를 드래그 앤 드롭
   ```

4. **배포 완료 확인**
   - 배포 로그 확인
   - https://blrent-dj.netlify.app 접속 테스트

---

### **방법 B: GitHub 자동 배포 (권장)**

1. **GitHub 저장소 생성**
   ```bash
   cd blrent-migration
   git init
   git add .
   git commit -m "마이그레이션 완료: 1번 구조 + 2번 기능"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/blrent.git
   git push -u origin main
   ```

2. **Netlify에서 GitHub 연동**
   - Netlify 대시보드
   - Site settings → Build & deploy
   - "Link repository" 선택
   - GitHub 저장소 선택

3. **자동 배포 설정**
   - Build command: (비워둠)
   - Publish directory: `/`
   - Deploy site 클릭

4. **코드 수정시 자동 재배포**
   ```bash
   git add .
   git commit -m "업데이트 내용"
   git push
   ```
   → Netlify가 자동으로 재배포!

---

## 🧪 **로컬 테스트**

### 1. **의존성 설치**
```bash
cd blrent-migration
npm install
```

### 2. **서버 실행**
```bash
npm start
```

### 3. **브라우저 접속**
```
http://localhost:3000
```

### 4. **테스트 항목**
- [ ] 메인 페이지 로딩
- [ ] 햄버거 메뉴 동작
- [ ] 프로모션 슬라이더 자동 재생
- [ ] 차량 갤러리 스와이프
- [ ] FAQ 아코디언 확장/축소
- [ ] 상담 폼 제출 (Google Sheets 확인)
- [ ] 고정 하단 CTA (모바일)
- [ ] 전화/카톡 버튼 클릭

---

## 📊 **성능 체크**

### **Google PageSpeed Insights**
1. https://pagespeed.web.dev/ 접속
2. 배포된 URL 입력
3. 점수 확인 (목표: 90점 이상)

### **개선이 필요하면**
- 이미지 압축 (TinyPNG)
- WebP 포맷 변환
- CSS 압축 (cssnano)
- JS 압축 (UglifyJS)

---

## 🔍 **SEO 체크**

### **네이버 검색 등록**
1. https://searchadvisor.naver.com
2. 사이트 등록
3. 소유권 확인 (메타태그 이미 추가됨)
4. 사이트맵 제출

### **구글 검색 등록**
1. https://search.google.com/search-console
2. 속성 추가
3. 소유권 확인 (메타태그 이미 추가됨)
4. 사이트맵 제출

### **사이트맵 생성**
```xml
<!-- sitemap.xml 예시 -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://blrent-dj.netlify.app/</loc>
    <lastmod>2024-01-22</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## ⚡ **자주 묻는 질문**

### Q1. 차량 이미지가 안 보여요!
**A**: `img/` 폴더에 실제 이미지 파일을 업로드하세요.

### Q2. 상담 폼이 작동 안 해요!
**A**: Google Apps Script URL이 올바른지 확인하세요.

### Q3. 모바일에서 고정 CTA가 안 보여요!
**A**: CSS가 제대로 로드되었는지 확인하세요.

### Q4. Netlify 배포가 안 돼요!
**A**: `_redirects` 파일이 있는지 확인하세요.

---

## 🎉 **완료 후 확인사항**

배포 완료 후 아래 항목을 체크하세요:

- [ ] 메인 페이지 정상 로딩
- [ ] 모든 섹션 표시 확인
- [ ] 차량 이미지 6개 모두 표시
- [ ] 전화/카톡 버튼 작동
- [ ] 상담 폼 제출 → Google Sheets 저장
- [ ] 모바일 반응형 확인
- [ ] 네이버/구글 검색 등록
- [ ] 도메인 연결 (선택)

---

## 🚀 **다음 단계**

마이그레이션이 완료되면:

1. **마케팅 시작**
   - 네이버 플레이스 등록
   - 구글 마이 비즈니스 등록
   - 네이버 검색광고
   - 카카오톡 채널 운영

2. **기능 추가**
   - 실시간 채팅
   - 예약 캘린더
   - 블로그/공지사항

3. **분석 및 개선**
   - Google Analytics 데이터 분석
   - A/B 테스트
   - 전환율 최적화

---

**축하합니다! 마이그레이션이 거의 완료되었습니다! 🎉**

남은 것은 이미지만 추가하면 끝!
