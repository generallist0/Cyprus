// main.js - Улучшенный JavaScript с анимациями, эффектами и оптимизацией

'use strict';

// ========== КОНФИГУРАЦИЯ ==========
const CONFIG = {
    // Анимации
    animationThreshold: 0.15,
    scrollOffset: 100,
    scrollTopThreshold: 300,
    parallaxSpeed: 0.3,
    
    // Эффекты
    waveCount: 3,
    waveSpeed: 3,
    bubbleCount: 15,
    
    // Производительность
    debounceDelay: 100,
    throttleDelay: 16,
    
    // Статистика
    stats: {
        population: 1264000,
        area: 9251,
        beaches: 57,
        sunnyDays: 340
    }
};

// ========== КЛАСС ДЛЯ УПРАВЛЕНИЯ САЙТОМ ==========
class CyprusWebsite {
    constructor() {
        this.initialize();
    }

    initialize() {
        console.log('🏝️ Инициализация сайта о Кипре...');
        
        // Кэширование DOM элементов
        this.cacheElements();
        
        // Инициализация модулей
        this.initModules();
        
        // Запуск анимаций
        this.startAnimations();
        
        // Обновление года
        this.updateCopyrightYear();
        
        // Отслеживание производительности
        this.trackPerformance();
    }

    cacheElements() {
        this.elements = {
            // Основные элементы
            body: document.body,
            html: document.documentElement,
            
            // Навигация
            header: document.querySelector('.header'),
            nav: document.querySelector('.nav'),
            mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
            navLinks: document.querySelectorAll('.nav-link'),
            
            // UI элементы
            scrollProgress: document.querySelector('.scroll-progress'),
            scrollTopBtn: document.querySelector('.scroll-top'),
            
            // Секции и контент
            sections: document.querySelectorAll('section'),
            revealElements: document.querySelectorAll('.reveal'),
            images: document.querySelectorAll('img'),
            
            // Специальные элементы
            heroTitle: document.querySelector('.hero-title'),
            logoIcon: document.querySelector('.logo-icon'),
            temperatureChart: document.querySelector('.temp-chart'),
            statsElements: document.querySelectorAll('.stat-number')
        };
        
        this.state = {
            isMobileMenuOpen: false,
            lastScrollY: 0,
            scrollDirection: 'down',
            isScrolling: false,
            scrollTimeout: null,
            animationsEnabled: true,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }

    initModules() {
        this.initEventListeners();
        this.initScrollEffects();
        this.initAnimations();
        this.initInteractiveElements();
        this.initLazyLoading();
        this.initImageOptimization();
    }

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
    initEventListeners() {
        // События окна
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), CONFIG.throttleDelay));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), CONFIG.debounceDelay));
        window.addEventListener('load', this.handleLoad.bind(this));
        
        // Навигация
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Навигационные ссылки
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // Кнопка "Наверх"
        if (this.elements.scrollTopBtn) {
            this.elements.scrollTopBtn.addEventListener('click', this.scrollToTop.bind(this));
        }
        
        // Интерактивные элементы
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Ошибки изображений
        this.elements.images.forEach(img => {
            img.addEventListener('error', this.handleImageError.bind(this));
        });
        
        // Предотвращение контекстного меню на изображениях
        document.addEventListener('contextmenu', e => {
            if (e.target.tagName === 'IMG') e.preventDefault();
        });
    }

    // ========== СКРОЛЛ ЭФФЕКТЫ ==========
    initScrollEffects() {
        if (this.state.prefersReducedMotion) return;
        
        // Инициализация параллакса
        this.initParallax();
        
        // Инициализация наблюдения за элементами
        this.initIntersectionObserver();
    }

    handleScroll() {
        const currentScrollY = window.pageYOffset;
        this.state.isScrolling = true;
        
        // Обновление состояния
        this.updateHeader(currentScrollY);
        this.updateScrollProgress(currentScrollY);
        this.updateActiveSection(currentScrollY);
        this.updateScrollTopButton(currentScrollY);
        
        // Анимации при скролле
        this.handleScrollAnimations(currentScrollY);
        
        // Определение направления
        this.state.scrollDirection = currentScrollY > this.state.lastScrollY ? 'down' : 'up';
        this.state.lastScrollY = currentScrollY;
        
        // Сброс таймера скролла
        clearTimeout(this.state.scrollTimeout);
        this.state.scrollTimeout = setTimeout(() => {
            this.state.isScrolling = false;
        }, 100);
    }

    updateHeader(scrollY) {
        if (!this.elements.header) return;
        
        // Добавление/удаление класса при прокрутке
        if (scrollY > 50) {
            this.elements.header.classList.add('scrolled');
        } else {
            this.elements.header.classList.remove('scrolled');
        }
        
        // Анимация хедера
        if (scrollY > 200 && this.state.scrollDirection === 'down' && !this.state.isMobileMenuOpen) {
            this.elements.header.style.transform = 'translateY(-100%)';
        } else {
            this.elements.header.style.transform = 'translateY(0)';
        }
    }

    updateScrollProgress(scrollY) {
        if (!this.elements.scrollProgress) return;
        
        const windowHeight = this.elements.html.scrollHeight - this.elements.html.clientHeight;
        const scrolled = (scrollY / windowHeight) * 100;
        this.elements.scrollProgress.style.width = `${scrolled}%`;
    }

    updateActiveSection(scrollY) {
        let currentSection = '';
        const offset = scrollY + CONFIG.scrollOffset;
        
        this.elements.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (offset >= sectionTop && offset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Обновление активной ссылки
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    updateScrollTopButton(scrollY) {
        if (!this.elements.scrollTopBtn) return;
        
        if (scrollY > CONFIG.scrollTopThreshold) {
            this.elements.scrollTopBtn.classList.add('visible');
        } else {
            this.elements.scrollTopBtn.classList.remove('visible');
        }
    }

    scrollToTop(e) {
        if (e) e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ========== НАВИГАЦИЯ ==========
    toggleMobileMenu(e) {
        if (e) e.preventDefault();
        
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
        
        if (this.elements.nav) {
            this.elements.nav.classList.toggle('active');
        }
        
        // Анимация кнопки меню
        if (this.elements.mobileMenuBtn) {
            const icon = this.elements.mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = this.state.isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
                this.elements.mobileMenuBtn.style.transform = this.state.isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)';
            }
        }
        
        // Блокировка скролла
        this.elements.body.style.overflow = this.state.isMobileMenuOpen ? 'hidden' : '';
        
        // Звуковой эффект (опционально)
        if (this.state.isMobileMenuOpen) {
            this.playSoundEffect('open');
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрытие мобильного меню
            if (this.state.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
            
            // Плавная прокрутка
            const headerHeight = this.elements.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight + 10;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Фокус на целевом элементе для доступности
            setTimeout(() => {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }, 500);
        }
    }

    // ========== АНИМАЦИИ И ЭФФЕКТЫ ==========
    initAnimations() {
        if (this.state.prefersReducedMotion) {
            this.disableAnimations();
            return;
        }
        
        // Инициализация статистики
        this.initStatsAnimation();
        
        // Инициализация волнового эффекта
        this.initWaveEffect();
        
        // Инициализация пузырьков
        this.initBubbleEffect();
        
        // Инициализация температурного графика
        this.initTemperatureChart();
    }

    startAnimations() {
        // Задержка для анимаций при загрузке
        setTimeout(() => {
            this.animateLogo();
            this.animateHeroTitle();
            this.animateOnLoad();
        }, 300);
    }

    animateLogo() {
        if (!this.elements.logoIcon) return;
        
        this.elements.logoIcon.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            this.elements.logoIcon.style.transform = 'rotate(0) scale(1)';
        }, 600);
    }

    animateHeroTitle() {
        if (!this.elements.heroTitle) return;
        
        // Анимация появления заголовка
        this.elements.heroTitle.style.opacity = '0';
        this.elements.heroTitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.elements.heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            this.elements.heroTitle.style.opacity = '1';
            this.elements.heroTitle.style.transform = 'translateY(0)';
        }, 500);
    }

    animateOnLoad() {
        // Анимация появления элементов
        this.elements.body.style.opacity = '0';
        this.elements.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            this.elements.body.style.opacity = '1';
        }, 100);
        
        // Анимация элементов с задержкой
        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Добавление класса для готовности анимаций
        setTimeout(() => {
            this.elements.body.classList.add('animations-ready');
        }, 1000);
    }

    handleScrollAnimations(scrollY) {
        if (this.state.prefersReducedMotion) return;
        
        // Параллакс для изображений
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || CONFIG.parallaxSpeed;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Анимация волн
        const waves = document.querySelectorAll('.wave-animation');
        waves.forEach(wave => {
            const speed = parseFloat(wave.getAttribute('data-speed')) || CONFIG.waveSpeed;
            const xPos = (scrollY * speed * 0.5) % 100;
            wave.style.backgroundPositionX = `${xPos}%`;
        });
    }

    initIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackAnimation();
            return;
        }
        
        const observerOptions = {
            threshold: CONFIG.animationThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Анимация дочерних элементов
                    const children = entry.target.querySelectorAll('[data-delay]');
                    children.forEach((child, index) => {
                        const delay = parseInt(child.getAttribute('data-delay')) || index * 100;
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, delay);
                    });
                }
            });
        }, observerOptions);
        
        this.elements.revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    initParallax() {
        // Автоматическое добавление параллакса к изображениям
        const images = document.querySelectorAll('.image-frame img');
        images.forEach((img, index) => {
            img.setAttribute('data-parallax', (0.2 + (index % 3) * 0.1).toString());
        });
    }

    // ========== СТАТИСТИКА И ДАННЫЕ ==========
    initStatsAnimation() {
        if (!this.elements.statsElements.length) return;
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statElement = entry.target;
                    const targetValue = this.parseStatValue(statElement.textContent);
                    
                    if (targetValue > 0) {
                        this.animateCounter(statElement, 0, targetValue, 2000);
                        statsObserver.unobserve(statElement);
                    }
                }
            });
        }, observerOptions);
        
        this.elements.statsElements.forEach(element => {
            statsObserver.observe(element);
        });
    }

    parseStatValue(text) {
        // Парсинг числовых значений из текста
        const match = text.match(/(\d+[\d,]*)/);
        if (match) {
            return parseInt(match[1].replace(/,/g, ''));
        }
        return 0;
    }

    animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            element.textContent = this.formatNumber(value);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }

    // ========== ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ ==========
    initInteractiveElements() {
        // Карточки с hover эффектом
        this.initCardHoverEffects();
        
        // Интерактивная карта
        this.initInteractiveMap();
        
        // Галерея изображений
        this.initImageGallery();
        
        // Аккордеоны для информации
        this.initAccordions();
    }

    initCardHoverEffects() {
        const cards = document.querySelectorAll('.glass-hover');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (this.state.prefersReducedMotion) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-5px)';
            });
        });
    }

    initInteractiveMap() {
        const mapContainer = document.querySelector('.cyprus-map');
        if (!mapContainer) return;
        
        // Создание интерактивной карты
        const cities = [
            { name: 'Никосия', x: 50, y: 40, info: 'Столица Кипра' },
            { name: 'Лимасол', x: 40, y: 70, info: 'Крупнейший порт' },
            { name: 'Пафос', x: 25, y: 70, info: 'Культурная столица' },
            { name: 'Ларнака', x: 60, y: 65, info: 'Международный аэропорт' }
        ];
        
        const mapHTML = cities.map(city => `
            <div class="map-point" 
                 style="left: ${city.x}%; top: ${city.y}%"
                 data-city="${city.name}"
                 data-info="${city.info}"
                 aria-label="${city.name} - ${city.info}"
                 tabindex="0">
                <div class="map-point-dot"></div>
                <div class="map-point-tooltip">${city.name}</div>
            </div>
        `).join('');
        
        if (mapContainer.querySelector('.map-points')) {
            mapContainer.querySelector('.map-points').innerHTML = mapHTML;
        }
        
        // Обработчики для точек карты
        setTimeout(() => {
            document.querySelectorAll('.map-point').forEach(point => {
                point.addEventListener('click', this.showCityInfo.bind(this));
                point.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        this.showCityInfo(e);
                    }
                });
            });
        }, 100);
    }

    showCityInfo(e) {
        e.preventDefault();
        const point = e.currentTarget;
        const city = point.getAttribute('data-city');
        const info = point.getAttribute('data-info');
        
        this.showNotification(`${city}: ${info}`, 'info');
    }

    initImageGallery() {
        const images = document.querySelectorAll('.image-frame img');
        
        images.forEach(img => {
            img.addEventListener('click', (e) => {
                this.openLightbox(e.target.src, e.target.alt);
            });
        });
    }

    openLightbox(src, alt) {
        // Создание лайтбокса
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content glass">
                <button class="lightbox-close" aria-label="Закрыть">
                    <i class="fas fa-times"></i>
                </button>
                <div class="lightbox-image-container">
                    <img src="${src}" alt="${alt}" loading="lazy">
                </div>
                <div class="lightbox-caption">
                    <h3>${alt}</h3>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Анимация появления
        setTimeout(() => lightbox.classList.add('active'), 10);
        
        // Обработчики событий
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox(lightbox));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox(lightbox);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLightbox(lightbox);
        });
    }

    closeLightbox(lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            if (lightbox.parentNode) {
                lightbox.parentNode.removeChild(lightbox);
            }
        }, 300);
    }

    initAccordions() {
        const accordions = document.querySelectorAll('.accordion');
        
        accordions.forEach(accordion => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            header.addEventListener('click', () => {
                accordion.classList.toggle('active');
                content.style.maxHeight = accordion.classList.contains('active') 
                    ? `${content.scrollHeight}px` 
                    : '0';
            });
        });
    }

    // ========== СПЕЦИАЛЬНЫЕ ЭФФЕКТЫ ==========
    initWaveEffect() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection || this.state.prefersReducedMotion) return;
        
        for (let i = 0; i < CONFIG.waveCount; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave-effect';
            wave.style.cssText = `
                position: absolute;
                width: 200%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(0, 168, 255, ${0.1 - i * 0.03}), 
                    transparent);
                top: ${i * 20}%;
                left: -50%;
                animation: waveFlow ${10 + i * 2}s linear infinite;
                animation-delay: ${i * -2}s;
                z-index: 1;
                pointer-events: none;
            `;
            
            heroSection.appendChild(wave);
        }
        
        // Добавление CSS анимации
        if (!document.querySelector('#wave-flow-animation')) {
            const style = document.createElement('style');
            style.id = 'wave-flow-animation';
            style.textContent = `
                @keyframes waveFlow {
                    0% { transform: translateX(0) scaleY(1); }
                    50% { transform: translateX(-25%) scaleY(1.1); }
                    100% { transform: translateX(-50%) scaleY(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initBubbleEffect() {
        const bubbleContainer = document.querySelector('.bubble-effect');
        if (!bubbleContainer || this.state.prefersReducedMotion) return;
        
        for (let i = 0; i < CONFIG.bubbleCount; i++) {
            setTimeout(() => this.createBubble(bubbleContainer), i * 300);
        }
        
        // Периодическое создание пузырьков
        setInterval(() => {
            if (document.querySelectorAll('.bubble').length < CONFIG.bubbleCount * 2) {
                this.createBubble(bubbleContainer);
            }
        }, 2000);
    }

    createBubble(container) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 20 + 5;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        bubble.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle at 30% 30%, 
                rgba(0, 210, 255, 0.2), 
                rgba(0, 168, 255, 0.1));
            border-radius: 50%;
            left: ${left}%;
            bottom: -20px;
            animation: bubbleRise ${duration}s ease-in ${delay}s infinite;
            z-index: 1;
            pointer-events: none;
        `;
        
        container.appendChild(bubble);
        
        // Удаление после анимации
        setTimeout(() => {
            if (bubble.parentNode) bubble.remove();
        }, (duration + delay) * 1000);
    }

    initTemperatureChart() {
        const tempChart = document.querySelector('.temp-chart');
        if (!tempChart) return;
        
        // Данные температур
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        const temperatures = [15, 16, 18, 21, 25, 29, 32, 32, 29, 26, 21, 17];
        
        // Создание графика
        const chartHTML = months.map((month, index) => `
            <div class="temp-month" data-temp="${temperatures[index]}">
                <span class="temp-month-name">${month}</span>
                <span class="temp-value">${temperatures[index]}°</span>
                <div class="temp-bar" style="height: ${temperatures[index] * 5}px"></div>
            </div>
        `).join('');
        
        tempChart.innerHTML = chartHTML;
        
        // Анимация появления
        setTimeout(() => {
            document.querySelectorAll('.temp-month').forEach((month, index) => {
                setTimeout(() => {
                    month.classList.add('active');
                }, index * 100);
            });
        }, 500);
    }

    // ========== ОПТИМИЗАЦИЯ ==========
    initLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            this.loadAllImages();
            return;
        }
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }

    initImageOptimization() {
        // Оптимизация размера изображений для экрана
        this.optimizeImageSizes();
        
        // Предзагрузка критических изображений
        this.preloadCriticalImages();
    }

    optimizeImageSizes() {
        const viewportWidth = window.innerWidth;
        let targetWidth = 1200;
        
        if (viewportWidth <= 768) targetWidth = 768;
        if (viewportWidth <= 480) targetWidth = 480;
        
        // Здесь можно добавить логику для динамической подгрузки
        // изображений соответствующего размера
    }

    preloadCriticalImages() {
        const criticalImages = [
            'images/hero-cyprus.jpg',
            'images/history-ruins.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // ========== ОБРАБОТКА ОШИБОК ==========
    handleImageError(e) {
        const img = e.target;
        console.warn(`Не удалось загрузить изображение: ${img.src}`);
        
        // Установка fallback изображения
        const fallbacks = {
            'hero-cyprus.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
            'history-ruins.jpg': 'https://images.unsplash.com/photo-1531157733723-6841323e6d73?w=1200',
            'default': 'https://images.unsplash.com/photo-1531157733723-6841323e6d73?w=800'
        };
        
        const filename = img.src.split('/').pop();
        img.src = fallbacks[filename] || fallbacks.default;
        img.classList.add('fallback');
    }

    // ========== УТИЛИТНЫЕ ФУНКЦИИ ==========
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    throttle(func, limit) {
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

    debounce(func, wait) {
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

    playSoundEffect(type) {
        // Базовые звуковые эффекты (можно расширить)
        if (typeof Audio === 'undefined') return;
        
        try {
            const audio = new Audio();
            audio.volume = 0.3;
            
            if (type === 'open') {
                // Можно добавить реальные звуковые файлы
                console.log('🔊 Звуковой эффект:', type);
            }
        } catch (e) {
            console.warn('Не удалось воспроизвести звуковой эффект:', e);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'exclamation-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Закрыть уведомление">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => notification.classList.add('active'), 10);
        
        // Закрытие
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));
        
        // Автоматическое закрытие
        setTimeout(() => this.closeNotification(notification), 5000);
    }

    closeNotification(notification) {
        notification.classList.remove('active');
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    }

    disableAnimations() {
        this.state.animationsEnabled = false;
        document.body.classList.add('reduced-motion');
    }

    fallbackAnimation() {
        // Fallback для браузеров без IntersectionObserver
        this.elements.revealElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 100);
        });
    }

    // ========== СИСТЕМНЫЕ ФУНКЦИИ ==========
    handleResize() {
        // Закрытие мобильного меню при увеличении экрана
        if (window.innerWidth > 768 && this.state.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
        
        // Обновление размеров
        this.optimizeImageSizes();
    }

    handleLoad() {
        console.log('✅ Сайт полностью загружен');
        
        // Обновление состояния загрузки
        this.elements.body.classList.add('loaded');
        
        // Отправка метрики загрузки
        this.sendPerformanceMetric();
    }

    handleDocumentClick(e) {
        // Закрытие мобильного меню при клике вне его
        if (this.state.isMobileMenuOpen && 
            !this.elements.nav.contains(e.target) && 
            !this.elements.mobileMenuBtn.contains(e.target)) {
            this.toggleMobileMenu();
        }
    }

    handleKeyDown(e) {
        // Закрытие элементов по ESC
        if (e.key === 'Escape') {
            if (this.state.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
            
            const lightbox = document.querySelector('.lightbox.active');
            if (lightbox) this.closeLightbox(lightbox);
            
            const notification = document.querySelector('.notification.active');
            if (notification) this.closeNotification(notification);
        }
        
        // Навигация по сайту с клавиатуры
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }

    updateCopyrightYear() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    trackPerformance() {
        if ('performance' in window) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`⚡ Время загрузки: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Время загрузки превышает 3 секунды');
            }
        }
    }

    sendPerformanceMetric() {
        // Отправка метрик производительности (можно подключить аналитику)
        if (typeof ga !== 'undefined') {
            ga('send', 'timing', 'Page Load', 'load', performance.now());
        }
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Проверка поддержки WebGL для продвинутых эффектов
    const supportsWebGL = (() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    })();
    
    // Создание экземпляра приложения
    const app = new CyprusWebsite();
    
    // Экспорт в глобальную область видимости
    window.CyprusApp = app;
    
    console.log(`🏝️ Cyprus Website v1.0.0 | WebGL: ${supportsWebGL ? '✅' : '❌'}`);
});

// ========== ПРЕЛОАДЕР ==========
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 500);
    }
});

// ========== ПОЛИФИЛЛЫ ==========
// IntersectionObserver полифилл
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver не поддерживается');
    
    // Простой полифилл
    window.IntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

// requestAnimationFrame полифилл
(function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function() { 
                callback(currTime + timeToCall); 
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
 
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

// ========== ГЛОБАЛЬНЫЙ API ==========
window.CyprusWebsite = {
    // Навигация
    scrollTo: function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            window.scrollTo({
                top: element.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    },
    
    // Информация
    getInfo: function(type) {
        const info = {
            climate: {
                summer: '28-35°C',
                winter: '15-20°C',
                sea: '16-28°C'
            },
            prices: {
                meal: '12-20€',
                apartment: '500-800€/мес',
                transport: '1.5€/билет'
            },
            facts: {
                population: '1.26 млн',
                area: '9,251 км²',
                language: 'Греческий, Турецкий',
                currency: 'Евро (€)'
            }
        };
        
        return info[type] || info.facts;
    },
    
    // Утилиты
    formatPrice: function(amount) {
        return `${amount.toFixed(2)}€`;
    },
    
    // Анимации
    triggerAnimation: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('animated');
            setTimeout(() => element.classList.remove('animated'), 1000);
        }
    }
};

// ========== ОБРАБОТКА ОШИБОК ГЛОБАЛЬНО ==========
window.addEventListener('error', function(e) {
    console.error('🌊 Ошибка на сайте:', e.error);
    
    // Показать пользовательское сообщение
    if (!document.querySelector('.global-error')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'global-error glass';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Произошла ошибка. Пожалуйста, обновите страницу.</span>
            <button onclick="location.reload()">Обновить</button>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background: rgba(255, 50, 50, 0.1);
            border: 1px solid rgba(255, 50, 50, 0.3);
            border-radius: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(errorDiv);
        
        // Автоматическое скрытие
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }
});

// Предотвращение ошибок при отладке
if (typeof console === 'undefined') {
    window.console = {
        log: function() {},
        warn: function() {},
        error: function() {}
    };
}
