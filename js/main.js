/* ========================================
   비엘렌트카 - JavaScript
   모바일 인터랙션 및 기능 구현
======================================== */

// ========================================
// DOM 요소 선택
// ========================================

const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

// ========================================
// 모바일 메뉴 토글
// ========================================

function openMobileNav() {
    mobileNav.classList.add('active');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

function closeMobileNav() {
    mobileNav.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 복원
}

// 메뉴 토글 버튼 클릭
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });
}

// 오버레이 클릭시 닫기
if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
}

// 닫기 버튼 클릭
if (navClose) {
    navClose.addEventListener('click', closeMobileNav);
}

// 네비게이션 링크 클릭시 메뉴 닫기
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        closeMobileNav();
        
        // 부드러운 스크롤
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ESC 키로 메뉴 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileNav();
    }
});

// ========================================
// 헤더 스크롤 효과
// ========================================

let lastScrollTop = 0;
const headerHeight = header ? header.offsetHeight : 60;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 헤더 그림자 추가
    if (scrollTop > 10) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop;
});

// ========================================
// Swiper 초기화
// ========================================

// 프로모션 배너 슬라이더
const promoSwiper = new Swiper('.promoSwiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.promoSwiper .swiper-pagination',
        clickable: true,
    },
    speed: 800,
});

// 윗줄 차량 슬라이더 (독립 스와이프)
const vehicleSwiperTop = new Swiper('.vehicleSwiperTop', {
    slidesPerView: 2.2, // 모바일: 2.2개씩
    slidesPerGroup: 2,
    spaceBetween: 12,
    centeredSlides: false,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    loop: false,
    pagination: {
        el: '.vehicleSwiperTop .swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    lazy: {
        loadPrevNext: true,
    },
    breakpoints: {
        480: {
            slidesPerView: 2.5,
            slidesPerGroup: 2,
            spaceBetween: 12,
        },
        640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 16,
        },
        768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 24,
        },
        1280: {
            slidesPerView: 6,
            slidesPerGroup: 6,
            spaceBetween: 28,
        },
    },
});

// 아랫줄 차량 슬라이더 (독립 스와이프)
const vehicleSwiperBottom = new Swiper('.vehicleSwiperBottom', {
    slidesPerView: 2.2, // 모바일: 2.2개씩
    slidesPerGroup: 2,
    spaceBetween: 12,
    centeredSlides: false,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    loop: false,
    pagination: {
        el: '.vehicleSwiperBottom .swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    lazy: {
        loadPrevNext: true,
    },
    breakpoints: {
        480: {
            slidesPerView: 2.5,
            slidesPerGroup: 2,
            spaceBetween: 12,
        },
        640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 16,
        },
        768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 24,
        },
        1280: {
            slidesPerView: 6,
            slidesPerGroup: 6,
            spaceBetween: 28,
        },
    },
});

// 고객후기 슬라이더
const reviewSwiper = new Swiper('.reviewSwiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    pagination: {
        el: '.reviewSwiper .swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1.5,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 24,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 24,
        },
    },
});

// ========================================
// FAQ 아코디언
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            // 현재 활성화된 다른 아이템 닫기 (선택사항)
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 현재 아이템 토글
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    }
});

// ========================================
// 부드러운 스크롤 (모든 앵커 링크)
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // 빈 해시나 특수한 경우 제외
        if (href === '#' || href === '#0') {
            e.preventDefault();
            return;
        }
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 60;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 통계 숫자 카운트업 애니메이션
// ========================================

function animateCount(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps 기준
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Intersection Observer로 화면에 보일 때 애니메이션 실행
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                
                if (!isNaN(number) && number > 0) {
                    stat.dataset.animated = 'true';
                    
                    // 시간 표시는 애니메이션 안함
                    if (text.includes('시간') || text.includes('분')) {
                        return;
                    }
                    
                    stat.textContent = '0';
                    animateCount(stat, number);
                    
                    // 원래 텍스트의 + 기호 유지
                    if (text.includes('+')) {
                        setTimeout(() => {
                            stat.textContent = stat.textContent + '+';
                        }, 2000);
                    }
                }
            });
            entry.target.dataset.animated = 'true';
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ========================================
// 전화번호 클릭 추적 (분석용)
// ========================================

const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
        console.log('전화 상담 클릭:', link.href);
        // 여기에 Google Analytics 등 분석 코드 추가 가능
        // gtag('event', 'click', { 'event_category': 'phone', 'event_label': link.href });
    });
});

// ========================================
// 카카오톡 링크 클릭 추적 (분석용)
// ========================================

const kakaoLinks = document.querySelectorAll('a[href*="kakao"]');
kakaoLinks.forEach(link => {
    link.addEventListener('click', () => {
        console.log('카카오톡 상담 클릭:', link.href);
        // 여기에 Google Analytics 등 분석 코드 추가 가능
        // gtag('event', 'click', { 'event_category': 'kakao', 'event_label': link.href });
    });
});

// ========================================
// 이미지 지연 로딩 (Lazy Loading)
// ========================================

if ('loading' in HTMLImageElement.prototype) {
    // 브라우저가 네이티브 lazy loading을 지원하는 경우
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
} else {
    // Intersection Observer를 사용한 폴백
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// 페이지 로드 완료시 애니메이션
// ========================================

window.addEventListener('load', () => {
    // 페이지 로딩 완료
    document.body.classList.add('loaded');
    
    // 부드러운 페이드인 효과
    const sections = document.querySelectorAll('section');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });
});

// ========================================
// 터치 제스처 지원 - 제거됨 (클릭으로만 메뉴 열기)
// ========================================

// 스와이프 제스처로 메뉴가 열리는 기능을 제거하여
// 메뉴 토글 버튼 클릭으로만 네비게이션이 열리도록 수정

// ========================================
// 디버그 모드 (개발용)
// ========================================

const DEBUG_MODE = false;

if (DEBUG_MODE) {
    console.log('🚗 비엘렌트카 홈페이지 로드됨');
    console.log('📱 화면 너비:', window.innerWidth);
    console.log('📏 헤더 높이:', headerHeight);
    
    // 리사이즈 이벤트 로깅
    window.addEventListener('resize', () => {
        console.log('📐 화면 크기 변경:', window.innerWidth, 'x', window.innerHeight);
    });
}

// ========================================
// 성능 모니터링
// ========================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log('⚡ 페이지 로딩 시간:', (loadTime / 1000).toFixed(2), '초');
    });
}

// ========================================
// 서비스 워커 등록 (PWA 지원 - 선택사항)
// ========================================

if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ========================================
// contenteditable 요소 편집 안내
// ========================================

const editableElements = document.querySelectorAll('[contenteditable="true"]');
editableElements.forEach(element => {
    element.addEventListener('focus', function() {
        if (DEBUG_MODE) {
            console.log('✏️ 편집 모드:', this.tagName, this.className);
        }
    });
    
    // 엔터키 방지 (한 줄 텍스트)
    element.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !this.dataset.multiline) {
            e.preventDefault();
        }
    });
});

// ========================================
// 초기화 완료 로그
// ========================================

console.log('%c🚗 비엘렌트카 홈페이지', 'color: #FF6B00; font-size: 20px; font-weight: bold;');
console.log('%c✅ JavaScript 초기화 완료', 'color: #4CAF50; font-size: 14px;');
console.log('%c📱 모바일 우선 반응형 디자인', 'color: #2196F3; font-size: 12px;');

// ========================================
// 외부에 노출할 API (선택사항)
// ========================================

window.BLRentCar = {
    version: '1.0.0',
    openMenu: openMobileNav,
    closeMenu: closeMobileNav,
    scrollToSection: (sectionId) => {
        const element = document.querySelector(sectionId);
        if (element) {
            const headerHeight = header ? header.offsetHeight : 60;
            window.scrollTo({
                top: element.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    }
};