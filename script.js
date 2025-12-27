// =====================================================
// 🌴 CYPRUS ISLAND — ENHANCED JAVASCRIPT
// Smooth animations, parallax effects, and interactive features
// =====================================================

(function() {
    'use strict';
    
    // ===== CONFIGURATION =====
    const CONFIG = {
        scrollThreshold: 50,
        animationOffset: 100,
        parallaxIntensity: 0.3,
        cursorFollowSpeed: 0.1,
        imageLoadDelay: 100
    };
    
    // ===== DOM ELEMENTS =====
    const elements = {
        header: document.getElementById('header'),
        menuBtn: document.querySelector('.menu-btn'),
        nav: document.querySelector('.nav'),
        navLinks: document.querySelectorAll('.nav-link'),
        scrollTopBtn: document.getElementById('scrollTop'),
        images: document.querySelectorAll('img[loading="lazy"]'),
        sections: document.querySelectorAll('section'),
        cards: document.querySelectorAll('.region-card, .beach-card, .dish-card'),
        stats: document.querySelectorAll('.stat'),
        prices: document.querySelectorAll('.price-tag')
    };
    
    // ===== STATE MANAGEMENT =====
    let state = {
        scrollPosition: 0,
        isMenuOpen: false,
        lastScroll: 0,
        cursor: { x: 0, y: 0 },
        mousePosition: { x: 0, y: 0 },
        animationFrameId: null,
        observer: null
    };
    
    // ===== INITIALIZATION =====
    function init() {
        setupEventListeners();
        setupIntersectionObserver();
        setupSmoothAnimations();
        setupImageLoading();
        setupParallaxEffects();
        setupPriceAnimations();
        startAnimationLoop();
        
        // Initial checks
        checkScrollPosition();
        preloadImages();
        
        console.log('🌴 Cyprus Island — Interactive features loaded');
    }
    
    // ===== EVENT LISTENERS SETUP =====
    function setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('scroll', throttle(handleScrollAnimations, 100), { passive: true });
        
        // Click events
        elements.menuBtn.addEventListener('click', toggleMenu);
        elements.scrollTopBtn.addEventListener('click', scrollToTop);
        
        // Navigation clicks
        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Mouse movement for effects
        document.addEventListener('mousemove', handleMouseMove);
        
        // Window events
        window.addEventListener('resize', debounce(handleResize, 200));
        window.addEventListener('load', handlePageLoad);
        
        // Card hover effects
        setupCardHoverEffects();
        
        // Price tag interactions
        setupPriceInteractions();
    }
    
    // ===== SCROLL HANDLING =====
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        const scrollDelta = currentScroll - state.lastScroll;
        
        // Header scroll effect
        if (currentScroll > CONFIG.scrollThreshold) {
            elements.header.classList.add('scrolled');
            
            // Hide/show header based on scroll direction
            if (scrollDelta > 5) {
                elements.header.style.transform = 'translateY(-100%)';
            } else if (scrollDelta < -5) {
                elements.header.style.transform = 'translateY(0)';
            }
        } else {
            elements.header.classList.remove('scrolled');
            elements.header.style.transform = 'translateY(0)';
        }
        
        // Scroll to top button
        if (currentScroll > 500) {
            elements.scrollTopBtn.classList.add('visible');
        } else {
            elements.scrollTopBtn.classList.remove('visible');
        }
        
        state.lastScroll = currentScroll;
        state.scrollPosition = currentScroll;
    }
    
    // ===== MENU HANDLING =====
    function toggleMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        elements.nav.classList.toggle('active');
        
        const icon = elements.menuBtn.querySelector('i');
        icon.className = state.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        
        // Smooth animation
        if (state.isMenuOpen) {
            elements.nav.style.animation = 'slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }
    }
    
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        // Update active state
        elements.navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        
        // Close mobile menu
        if (state.isMenuOpen) {
            toggleMenu();
        }
        
        // Smooth scroll to section
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - 80;
            smoothScrollTo(targetPosition, 800);
        }
    }
    
    // ===== ANIMATIONS =====
    function setupSmoothAnimations() {
        // Add reveal class to animatable elements
        const animatableElements = [
            ...elements.cards,
            ...elements.stats,
            ...document.querySelectorAll('.content-section'),
            ...document.querySelectorAll('.section-header')
        ];
        
        animatableElements.forEach(el => {
            el.classList.add('reveal');
            el.style.willChange = 'transform, opacity';
        });
        
        // Initial reveal for elements in viewport
        setTimeout(() => {
            animatableElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - CONFIG.animationOffset) {
                    el.classList.add('active');
                }
            });
        }, 300);
    }
    
    function handleScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('active');
                
                // Add delay based on position
                const delay = Math.min(elementTop * 0.1, 300);
                el.style.transitionDelay = `${delay}ms`;
            }
        });
    }
    
    // ===== PARALLAX EFFECTS =====
    function setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-image, .content-image, .region-card');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || CONFIG.parallaxIntensity;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }
    
    // ===== IMAGE LOADING =====
    function setupImageLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image with delay for smooth appearance
                    setTimeout(() => {
                        img.src = img.dataset.src || img.src;
                        img.onload = () => {
                            img.classList.add('loaded');
                            img.style.opacity = '1';
                        };
                    }, CONFIG.imageLoadDelay);
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        elements.images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.style.opacity = '0';
                imageObserver.observe(img);
            }
        });
    }
    
    function preloadImages() {
        const criticalImages = [
            'images/hero-cyprus.jpg',
            'images/history-ruins.jpg',
            'images/climate-beach.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // ===== INTERSECTION OBSERVER =====
    function setupIntersectionObserver() {
        state.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('stat')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observe elements
        elements.stats.forEach(stat => state.observer.observe(stat));
        elements.sections.forEach(section => state.observer.observe(section));
    }
    
    // ===== COUNTER ANIMATIONS =====
    function animateCounter(statElement) {
        const numberElement = statElement.querySelector('.stat-number');
        const finalValue = parseInt(numberElement.textContent.replace(/,/g, ''));
        const duration = 2000;
        const startTime = Date.now();
        
        function updateCounter() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * finalValue);
            
            numberElement.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        updateCounter();
    }
    
    // ===== CARD HOVER EFFECTS =====
    function setupCardHoverEffects() {
        elements.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-12px) scale(1.02)';
                card.style.zIndex = '10';
                
                // Add glow effect
                card.style.boxShadow = `
                    0 20px 60px rgba(0, 0, 0, 0.8),
                    0 0 40px rgba(0, 212, 255, 0.3)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.zIndex = '1';
                card.style.boxShadow = '';
            });
        });
    }
    
    // ===== PRICE ANIMATIONS =====
    function setupPriceAnimations() {
        elements.prices.forEach(priceTag => {
            priceTag.addEventListener('mouseenter', (e) => {
                const tag = e.target;
                tag.style.transform = 'scale(1.1) translateY(-2px)';
                tag.style.boxShadow = '0 4px 20px rgba(255, 215, 0, 0.3)';
                
                // Add currency symbol animation
                const symbol = tag.querySelector('.currency-symbol') || 
                              (() => {
                                  const span = document.createElement('span');
                                  span.className = 'currency-symbol';
                                  span.textContent = '€';
                                  tag.prepend(span);
                                  return span;
                              })();
                
                symbol.style.transform = 'scale(1.3)';
                symbol.style.opacity = '1';
            });
            
            priceTag.addEventListener('mouseleave', (e) => {
                const tag = e.target;
                tag.style.transform = '';
                tag.style.boxShadow = '';
                
                const symbol = tag.querySelector('.currency-symbol');
                if (symbol) {
                    symbol.style.transform = '';
                    symbol.style.opacity = '0.8';
                }
            });
        });
    }
    
    // ===== MOUSE EFFECTS =====
    function handleMouseMove(e) {
        state.mousePosition.x = e.clientX;
        state.mousePosition.y = e.clientY;
        
        // Update cursor trail
        updateCursorPosition();
        
        // Glass effect on hover
        const glassElements = document.querySelectorAll('.glass');
        glassElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                const intensity = Math.min(0.3, 0.1 + (y / rect.height) * 0.2);
                el.style.setProperty('--glass-glow', intensity);
            }
        });
    }
    
    function updateCursorPosition() {
        state.cursor.x += (state.mousePosition.x - state.cursor.x) * CONFIG.cursorFollowSpeed;
        state.cursor.y += (state.mousePosition.y - state.cursor.y) * CONFIG.cursorFollowSpeed;
        
        // Update CSS custom properties for cursor effects
        document.documentElement.style.setProperty('--cursor-x', `${state.cursor.x}px`);
        document.documentElement.style.setProperty('--cursor-y', `${state.cursor.y}px`);
    }
    
    // ===== SCROLL FUNCTIONS =====
    function scrollToTop() {
        smoothScrollTo(0, 800);
    }
    
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        // Easing function
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // ===== ANIMATION LOOP =====
    function startAnimationLoop() {
        function loop() {
            // Update any continuous animations here
            updateFloatingAnimations();
            state.animationFrameId = requestAnimationFrame(loop);
        }
        
        loop();
    }
    
    function updateFloatingAnimations() {
        const time = Date.now() * 0.001;
        const floatingElements = document.querySelectorAll('.hero-image, .region-card');
        
        floatingElements.forEach((el, index) => {
            const delay = index * 0.3;
            const y = Math.sin(time + delay) * 5;
            const rotation = Math.sin(time + delay * 1.5) * 0.5;
            
            if (!el.matches(':hover')) {
                el.style.transform = `
                    translateY(${y}px)
                    rotate(${rotation}deg)
                `;
            }
        });
    }
    
    // ===== UTILITY FUNCTIONS =====
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===== PAGE LOAD HANDLER =====
    function handlePageLoad() {
        // Add loaded class to body for fade-in effect
        document.body.classList.add('loaded');
        
        // Animate hero elements sequentially
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 * index);
        });
        
        // Start stats counters
        setTimeout(() => {
            elements.stats.forEach(stat => {
                if (isElementInViewport(stat)) {
                    animateCounter(stat);
                }
            });
        }, 1000);
    }
    
    function handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && state.isMenuOpen) {
            toggleMenu();
        }
        
        // Update any layout-dependent animations
        updateLayoutAnimations();
    }
    
    function updateLayoutAnimations() {
        // Adjust animation speeds based on screen size
        const isMobile = window.innerWidth < 768;
        document.documentElement.style.setProperty(
            '--transition-normal',
            isMobile ? '0.4s' : '0.6s'
        );
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    function checkScrollPosition() {
        // Initial scroll position check
        state.scrollPosition = window.pageYOffset;
        if (state.scrollPosition > CONFIG.scrollThreshold) {
            elements.header.classList.add('scrolled');
        }
    }
    
    // ===== CLEANUP =====
    function cleanup() {
        if (state.animationFrameId) {
            cancelAnimationFrame(state.animationFrameId);
        }
        
        if (state.observer) {
            state.observer.disconnect();
        }
    }
    
    // ===== INITIALIZE =====
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // ===== EXPOSE PUBLIC API =====
    window.CyprusApp = {
        scrollToSection: function(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                smoothScrollTo(element.offsetTop - 80, 800);
            }
        },
        
        toggleMenu: toggleMenu,
        
        refreshAnimations: function() {
            setupSmoothAnimations();
            handleScrollAnimations();
        },
        
        // Stats for debugging
        getStats: function() {
            return {
                scrollPosition: state.scrollPosition,
                isMenuOpen: state.isMenuOpen,
                animatedElements: document.querySelectorAll('.reveal.active').length,
                loadedImages: document.querySelectorAll('img.loaded').length
            };
        }
    };
    
})();

// ===== ADDITIONAL CSS FOR JS EFFECTS =====
// Add this to your CSS file for enhanced effects
const additionalCSS = `
/* Cursor glow effect */
.glass:hover {
    --glass-glow: 0.2;
    box-shadow: 
        var(--shadow-lg),
        0 0 calc(var(--glass-glow, 0.1) * 100px) rgba(0, 212, 255, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Loading state */
body:not(.loaded) * {
    animation: none !important;
    transition: none !important;
}

/* Currency symbol animation */
.price-tag .currency-symbol {
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55),
                opacity 0.3s ease;
    opacity: 0.8;
}

/* Smooth image loading */
img {
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Active section highlighting */
section.in-view {
    --section-glow: 0.05;
    background: radial-gradient(
        circle at center,
        rgba(0, 212, 255, var(--section-glow)) 0%,
        transparent 70%
    );
}

/* Floating animation for cards */
@keyframes subtleFloat {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-10px) rotate(0.5deg); }
}

.region-card, .dish-card {
    animation: subtleFloat 6s ease-in-out infinite;
    animation-delay: calc(var(--index, 0) * 0.3s);
}

/* Counter animation */
.stat-number {
    display: inline-block;
    min-width: 60px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .glass {
        backdrop-filter: blur(15px);
    }
    
    .hero-image {
        animation-duration: 10s;
    }
}
`;

// Inject additional CSS
(function() {
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);
})();
