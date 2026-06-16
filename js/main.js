/* ========================================
   아레스렌트카 - JavaScript
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
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
    },
    pagination: {
        el: '.promoSwiper .swiper-pagination',
        clickable: true,
    },
    speed: 800,
});

// 차량 슬라이더 공통 옵션
const vehicleSwiperConfig = {
    slidesPerView: 2.2,
    slidesPerGroup: 2,
    spaceBetween: 12,
    centeredSlides: false,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    loop: false,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    lazy: { loadPrevNext: true },
    breakpoints: {
        480: { slidesPerView: 2.5, slidesPerGroup: 2, spaceBetween: 12 },
        640: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 16 },
        768: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
        1024: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 24 },
        1280: { slidesPerView: 6, slidesPerGroup: 6, spaceBetween: 28 },
    },
};

// 차량 쇼케이스: 브랜드 선택 → 모델 자동 회전(점/화살표/스와이프) + '전체 보기' 리스트 모드
(function () {
    const bar = document.getElementById('brandFilter');
    if (!bar) return;
    const LABELS = {
        'Mercedes-Benz': '벤츠', 'BMW': 'BMW', 'Audi': '아우디', 'Tesla': '테슬라',
        'Land Rover': '랜드로버', 'Porsche': '포르쉐', 'Bentley': '벤틀리', 'Lamborghini': '람보르기니'
    };
    const ROTATE_MS = 3000;
    const cta = document.querySelector('.vehicle-cta-band');
    const stage = document.getElementById('vehicles');
    const titles = [...document.querySelectorAll('.vehicle-section-title')];
    const groups = titles.map(title => {
        const els = [title], rows = [];
        let el = title.nextElementSibling;
        while (el && !el.classList.contains('vehicle-section-title')
                  && !el.classList.contains('vehicle-cta-band')
                  && !el.classList.contains('showcase-ctrl-wrap')) {
            els.push(el);
            if (el.classList.contains('model-row')) rows.push(el);
            else rows.push(...el.querySelectorAll('.model-row'));
            el = el.nextElementSibling;
        }
        return { label: LABELS[title.textContent.trim()] || title.textContent.trim(), els, rows };
    });

    // 컨트롤(화살표+점) + '전체 보기' 버튼 — 맞춤배차 배너 앞에 삽입
    const wrap = document.createElement('div'); wrap.className = 'showcase-ctrl-wrap';
    wrap.innerHTML =
        '<div class="showcase-ctrl">'
        + '<button type="button" class="sc-arrow sc-prev" aria-label="이전">‹</button>'
        + '<div class="sc-dots"></div>'
        + '<button type="button" class="sc-arrow sc-next" aria-label="다음">›</button>'
        + '</div>'
        + '<button type="button" class="sc-all">이 브랜드 전체 보기</button>';
    if (cta && cta.parentNode) cta.parentNode.insertBefore(wrap, cta);
    const ctrl = wrap.querySelector('.showcase-ctrl');
    const dotsBox = wrap.querySelector('.sc-dots');
    const allBtn = wrap.querySelector('.sc-all');

    const chips = [];
    let timer = null, curBrand = -1, curModel = 0, listMode = false;

    function preload(g) {
        g.rows.forEach(r => r.querySelectorAll('img').forEach(im => {
            const u = im.getAttribute('src'); if (u) { const p = new Image(); p.src = u; }
        }));
    }
    function renderDots(g) {
        dotsBox.innerHTML = '';
        g.rows.forEach((r, i) => {
            const d = document.createElement('button');
            d.type = 'button'; d.className = 'sc-dot' + (i === curModel ? ' active' : '');
            d.addEventListener('click', () => { curModel = i; showModel(g, i, 0); restart(); });
            dotsBox.appendChild(d);
        });
    }
    function showModel(g, mi, dir) {
        g.rows.forEach((r, ri) => {
            if (ri === mi) {
                r.style.display = '';
                r.classList.remove('mr-next', 'mr-prev'); void r.offsetWidth;
                r.classList.add(dir < 0 ? 'mr-prev' : 'mr-next');
            } else { r.style.display = 'none'; }
        });
        [...dotsBox.children].forEach((d, i) => d.classList.toggle('active', i === mi));
    }
    function restart() {
        clearInterval(timer);
        const g = groups[curBrand];
        if (!listMode && g && g.rows.length > 1) timer = setInterval(() => go(1), ROTATE_MS);
    }
    function go(delta) {
        const g = groups[curBrand];
        if (listMode || !g || g.rows.length <= 1) return;
        curModel = (curModel + delta + g.rows.length) % g.rows.length;
        showModel(g, curModel, delta);
        restart();
    }
    function setListMode(on) {
        const g = groups[curBrand]; if (!g) return;
        listMode = on;
        if (on) {
            clearInterval(timer);
            if (stage) stage.classList.remove('sc-rotating');   // 리스트 모드: 고정높이 해제
            g.rows.forEach(r => { r.style.display = ''; r.classList.remove('mr-next', 'mr-prev'); });
            ctrl.style.display = 'none';
            allBtn.textContent = '한 모델씩 보기 ▴';
        } else {
            if (stage) stage.classList.add('sc-rotating');
            ctrl.style.display = '';
            allBtn.textContent = '전체보기';
            curModel = 0; showModel(g, 0, 1); restart();
        }
    }
    function select(idx) {
        listMode = false; curBrand = idx; curModel = 0;
        if (stage) stage.classList.add('sc-rotating');   // 회전 모드: 모델 영역 고정높이
        groups.forEach((g, gi) => g.els.forEach(e => { e.style.display = gi === idx ? '' : 'none'; }));
        chips.forEach((c, ci) => c.classList.toggle('active', ci === idx));
        const g = groups[idx];
        preload(g);
        renderDots(g);
        const multi = g.rows.length > 1;
        ctrl.style.display = multi ? '' : 'none';
        allBtn.style.display = multi ? '' : 'none';
        allBtn.textContent = '전체보기';
        showModel(g, 0, 1);
        restart();
    }
    groups.forEach((g, i) => {
        const c = document.createElement('button');
        c.type = 'button'; c.className = 'brand-chip'; c.textContent = g.label;
        c.addEventListener('click', () => select(i));
        bar.appendChild(c); chips.push(c);
    });
    select(0);

    ctrl.querySelector('.sc-prev').addEventListener('click', () => go(-1));
    ctrl.querySelector('.sc-next').addEventListener('click', () => go(1));
    allBtn.addEventListener('click', () => setListMode(!listMode));

    // 손 스와이프(터치+마우스드래그): 왼쪽으로 밀면 다음, 오른쪽으로 밀면 이전
    const sec = document.getElementById('vehicles');
    let sx = null, sy = null;
    const down = (x, y) => { sx = x; sy = y; };
    const upX = (x, y) => {
        if (sx === null) return;
        const dx = x - sx, dy = y - sy; sx = sy = null;
        if (!listMode && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    };
    if (sec) {
        sec.addEventListener('touchstart', e => down(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        sec.addEventListener('touchend', e => upX(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });
        sec.addEventListener('mousedown', e => down(e.clientX, e.clientY));
        sec.addEventListener('mouseup', e => upX(e.clientX, e.clientY));
        sec.addEventListener('mouseenter', () => { if (!listMode) clearInterval(timer); });
        sec.addEventListener('mouseleave', () => { if (!listMode) restart(); });
    }
})();

// 고객후기 슬라이더 (왼쪽으로 자동 흐름)
const reviewSwiper = new Swiper('.reviewSwiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    speed: 700,
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
        threshold: 0,
        rootMargin: '0px 0px -10% 0px'
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
    console.log('🚗 아레스렌트카 홈페이지 로드됨');
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
// 차량 이미지 클릭 확대
// ========================================

const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');

if (imageModal && modalImg) {
    document.querySelectorAll('.vehicle-image img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            imageModal.style.display = 'flex';
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') imageModal.style.display = 'none';
    });
}

// ========================================
// 초기화 완료 로그
// ========================================

console.log('%c🚗 아레스렌트카 홈페이지', 'color: #FF6B00; font-size: 20px; font-weight: bold;');
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