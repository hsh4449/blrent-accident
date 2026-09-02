// ========================================
// index.html 인라인 스크립트에서 이동 (2026-09-02 리팩토링)
// ========================================

/* Hero 함께한 인원수: 날짜 기반으로 매일 1회 결정(132~224), 하루 고정 */
(function(){
  var d=new Date();
  var seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
  var x=Math.sin(seed)*10000; x=x-Math.floor(x);
  var n=132+Math.floor(x*93); /* 132~224 */
  var el=document.getElementById('heroCount');
  if(el) el.textContent=n.toLocaleString()+'명';
})();

(function(){
  var modal=document.getElementById('evtModal'); if(!modal) return;
  var KEY='evtHideUntil';
  try{ if(localStorage.getItem(KEY)===new Date().toDateString()) return; }catch(e){}
  setTimeout(function(){
    modal.classList.add('show');
    if(window.aresTrack) window.aresTrack('event_impression', {label:'evt-modal'});  // 이벤트배너 노출 집계
  }, 700);
  function closeModal(){ modal.classList.remove('show'); }
  modal.querySelector('.evt-close').addEventListener('click', closeModal);
  modal.querySelector('.evt-closebtn').addEventListener('click', closeModal);
  modal.querySelector('.evt-dismiss').addEventListener('click', function(){ try{ localStorage.setItem(KEY,new Date().toDateString()); }catch(e){} closeModal(); });
  modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
})();

// 상담 신청 폼 → Google Apps Script 전송 (index.html 인라인에서 이동)
(function () {
    var consultForm = document.getElementById("consultForm");
    if (!consultForm) return;
consultForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // 2번의 실제 Google Apps Script URL
    const scriptURL = "https://script.google.com/macros/s/AKfycbwtjwHFurSLMz3In7t_GJa4gRRtg3qtYXwXaUuf-64sIE5gHQMCbvrLS17lJzdXeBIQEQ/exec"; 

    const btn = this.querySelector(".submit-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 접수중입니다...';
    btn.disabled = true;

    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(this), 
        mode: 'no-cors'
    })
    .then(response => {
        // 성공 팝업 표시
        alert("✅ 신청되었습니다!\n\n담당자가 확인 후 24시간 이내에 연락드리겠습니다.\n빠른 상담을 원하시면 1666-6525로 전화주세요.");

        // 폼 초기화
        document.getElementById("consultForm").reset();

        // 버튼 원래대로
        btn.innerHTML = originalText;
        btn.disabled = false;
    })
    .catch(error => {
        console.error('Error!', error);
        alert("⚠️ 신청 중 문제가 발생했습니다.\n\n직접 전화로 문의해주시면 감사하겠습니다.\n📞 1666-6525");

        // 버튼 원래대로
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
});
})();

// 누적 이용 고객 수: 2026-03-13 기준 68,661 + 일별 결정적 증가 (index.html 인라인에서 이동)
(function() {
    var baseDate = new Date('2026-03-13');
    var baseCount = 68661;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var daysDiff = Math.floor((today - baseDate) / (1000 * 60 * 60 * 24));
    var total = baseCount;
    for (var i = 0; i < daysDiff; i++) {
        var seed = 20260313 + i * 7 + i * i * 3;
        var daily = 10 + (seed % 21);
        total += daily;
    }
    var el = document.getElementById('customer-count');
    if (el) el.textContent = total.toLocaleString() + '+';
})();

// ========================================
// 이하 원래 main.js
// ========================================

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

// 브랜드 필터: 칩 누르면 그 브랜드 차량 전부 표시(회전 없음, 다 보이게)
(function () {
    const bar = document.getElementById('brandFilter');
    if (!bar) return;
    const LABELS = {
        'Mercedes-Benz': '벤츠', 'BMW': 'BMW', 'Audi': '아우디', 'Tesla': '테슬라',
        'Land Rover': '랜드로버', 'Porsche': '포르쉐', 'Bentley': '벤틀리', 'Lamborghini': '람보르기니'
    };
    const titles = [...document.querySelectorAll('.vehicle-section-title')];
    const groups = titles.map(title => {
        const els = [title];
        let el = title.nextElementSibling;
        while (el && !el.classList.contains('vehicle-section-title')
                  && !el.classList.contains('vehicle-cta-band')) {
            els.push(el);
            el = el.nextElementSibling;
        }
        return { label: LABELS[title.textContent.trim()] || title.textContent.trim(), els };
    });
    const chips = [];
    function preload(g) {
        g.els.forEach(e => e.querySelectorAll('img').forEach(im => {
            const u = im.getAttribute('src'); if (u) { const p = new Image(); p.src = u; }
        }));
    }
    function select(idx) {
        groups.forEach((g, gi) => g.els.forEach(e => { e.style.display = gi === idx ? '' : 'none'; }));
        chips.forEach((c, ci) => c.classList.toggle('active', ci === idx));
        preload(groups[idx]);
    }
    groups.forEach((g, i) => {
        const c = document.createElement('button');
        c.type = 'button'; c.className = 'brand-chip'; c.textContent = g.label;
        c.addEventListener('click', () => select(i));
        bar.appendChild(c); chips.push(c);
    });
    select(0);
})();

// 고객후기 슬라이더 (왼쪽으로 자동 흐름)
// 설정을 전역으로 노출 → reviews.js 가 Supabase 후기 로드 후 동일 설정으로 재초기화
window.REVIEW_SWIPER_CONFIG = {
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
};
// 하드코딩 후기(폴백)로 우선 초기화 — reviews.js 가 Supabase 로드 성공 시 교체
window.reviewSwiper = new Swiper('.reviewSwiper', window.REVIEW_SWIPER_CONFIG);

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

function animateCount(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16); // 60fps 기준
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target) + suffix;
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
                    // 원래 텍스트의 + 기호는 마지막 틱에서 함께 출력 (별도 타이머로 붙이면 애니메이션과 경합해 사라짐)
                    animateCount(stat, number, 2000, text.includes('+') ? '+' : '');
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
// contenteditable 요소 편집 안내
// ========================================

const editableElements = document.querySelectorAll('[contenteditable="true"]');
editableElements.forEach(element => {
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