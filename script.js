// main.js - Улучшенный JavaScript для сайта о Кипре с морской тематикой

document.addEventListener('DOMContentLoaded', function() {
    // ========== КОНСТАНТЫ И ПЕРЕМЕННЫЕ ==========
    const CONFIG = {
        scrollOffset: 100,
        animationThreshold: 0.15,
        scrollTopThreshold: 500,
        waveSpeed: 20000,
        bubbleCount: 20
    };

    // ========== ОСНОВНЫЕ ЭЛЕМЕНТЫ ==========
    const DOM = {
        header: document.querySelector('.header'),
        nav: document.querySelector('.nav'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        scrollProgress: document.querySelector('.scroll-progress'),
        scrollTopBtn: document.querySelector('.scroll-top'),
        navLinks: document.querySelectorAll('.nav-link'),
        sections: document.querySelectorAll('section'),
        revealElements: document.querySelectorAll('.reveal')
    };

    // ========== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ==========
    const STATE = {
        isMobileMenuOpen: false,
        lastScrollY: 0,
        scrollDirection: 'down',
        isScrolling: false,
        scrollTimeout: null
    };

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    function init() {
        console.log('🌊 Инициализация сайта о Кипре...');
        
        initEventListeners();
        initAnimations();
        initScrollEffects();
        initTemperatureChart();
        initCyprusMap();
        initStatsAnimation();
        initBubbleEffect();
        
        // Начальные настройки
        updateActiveNav();
        checkScrollTop();
        
        // Анимация при загрузке
        setTimeout(() => {
            animateOnLoad();
        }, 300);
    }

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
    function initEventListeners() {
        // Окно
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', debounce(handleResize, 250));
        window.addEventListener('load', handleLoad);
        
        // Мобильное меню
        if (DOM.mobileMenuBtn) {
            DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
        
        // Навигационные ссылки
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Кнопка "Наверх"
        if (DOM.scrollTopBtn) {
            DOM.scrollTopBtn.addEventListener('click', scrollToTop);
        }
        
        // Клик вне мобильного меню
        document.addEventListener('click', handleDocumentClick);
        
        // Клавиатура
        document.addEventListener('keydown', handleKeyDown);
    }

    // ========== СКРОЛЛ ЭФФЕКТЫ ==========
    function initScrollEffects() {
        // Прогресс-бар
        if (DOM.scrollProgress) {
            window.addEventListener('scroll', updateScrollProgress);
        }
        
        // Параллакс эффект для изображений
        initParallax();
    }

    function handleScroll() {
        STATE.isScrolling = true;
        
        // Обновление хедера
        updateHeader();
        
        // Обновление активной навигации
        updateActiveNav();
        
        // Проверка кнопки "Наверх"
        checkScrollTop();
        
        // Анимация при скролле
        handleScrollAnimations();
        
        // Определение направления скролла
        const currentScrollY = window.pageYOffset;
        STATE.scrollDirection = currentScrollY > STATE.lastScrollY ? 'down' : 'up';
        STATE.lastScrollY = currentScrollY;
        
        // Сброс состояния скролла
        clearTimeout(STATE.scrollTimeout);
        STATE.scrollTimeout = setTimeout(() => {
            STATE.isScrolling = false;
        }, 100);
    }

    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        DOM.scrollProgress.style.width = `${scrolled}%`;
    }

    function updateHeader() {
        const scrollY = window.pageYOffset;
        
        if (scrollY > 50) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        
        // Прятать хедер при скролле вниз
        if (scrollY > 200 && STATE.scrollDirection === 'down' && !STATE.isMobileMenuOpen) {
            DOM.header.style.transform = 'translateY(-100%)';
        } else {
            DOM.header.style.transform = 'translateY(0)';
        }
    }

    function checkScrollTop() {
        if (!DOM.scrollTopBtn) return;
        
        if (window.pageYOffset > CONFIG.scrollTopThreshold) {
            DOM.scrollTopBtn.classList.add('visible');
        } else {
            DOM.scrollTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ========== НАВИГАЦИЯ ==========
    function toggleMobileMenu() {
        STATE.isMobileMenuOpen = !STATE.isMobileMenuOpen;
        
        if (DOM.nav) {
            DOM.nav.classList.toggle('active');
        }
        
        // Анимация кнопки меню
        if (DOM.mobileMenuBtn) {
            const icon = DOM.mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = STATE.isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        }
        
        // Блокировка скролла
        document.body.style.overflow = STATE.isMobileMenuOpen ? 'hidden' : '';
        
        // Анимация кнопки
        if (DOM.mobileMenuBtn) {
            DOM.mobileMenuBtn.style.transform = STATE.isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)';
        }
    }

    function handleNavClick(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрытие мобильного меню
            if (STATE.isMobileMenuOpen) {
                toggleMobileMenu();
            }
            
            // Плавная прокрутка
            const headerHeight = DOM.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight + 10;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Активный пункт меню
            DOM.navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    }

    function updateActiveNav() {
        let currentSection = '';
        const scrollY = window.pageYOffset + CONFIG.scrollOffset;
        
        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ========== АНИМАЦИИ ==========
    function initAnimations() {
        // Intersection Observer для анимаций при скролле
        const observerOptions = {
            threshold: CONFIG.animationThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Анимация дочерних элементов с задержкой
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
        
        DOM.revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    function handleScrollAnimations() {
        // Параллакс эффект для изображений
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Анимация волн
        const waves = document.querySelectorAll('.wave-animation');
        waves.forEach(wave => {
            const speed = parseFloat(wave.getAttribute('data-speed')) || 1;
            const xPos = (scrolled * speed * 0.5) % 100;
            wave.style.backgroundPositionX = `${xPos}%`;
        });
    }

    function initParallax() {
        // Добавляем параллакс эффект к изображениям
        const images = document.querySelectorAll('.image-frame img');
        images.forEach(img => {
            img.setAttribute('data-parallax', '0.3');
        });
    }

    // ========== ТЕМПЕРАТУРНЫЙ ГРАФИК ==========
    function initTemperatureChart() {
        const tempMonths = document.querySelectorAll('.temp-month');
        if (!tempMonths.length) return;
        
        // Температуры по месяцам (средние значения)
        const temperatures = {
            air: [15, 16, 18, 21, 25, 29, 32, 32, 29, 26, 21, 17],
            sea: [17, 16, 17, 18, 20, 23, 26, 27, 26, 24, 21, 18]
        };
        
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        
        // Анимация температур
        setTimeout(() => {
            tempMonths.forEach((month, index) => {
                if (index < months.length) {
                    const tempValue = month.querySelector('.temp-value');
                    if (tempValue) {
                        // Анимация появления температуры
                        setTimeout(() => {
                            tempValue.textContent = `${temperatures.air[index]}°C`;
                            tempValue.style.opacity = '1';
                            tempValue.style.transform = 'scale(1)';
                        }, index * 100);
                    }
                }
            });
        }, 1000);
        
        // Интерактивность
        tempMonths.forEach(month => {
            month.addEventListener('mouseenter', function() {
                const currentTemp = parseInt(this.querySelector('.temp-value').textContent);
                const seaTemp = currentTemp - 3; // Примерная разница
                
                // Показываем температуру моря
                const tooltip = document.createElement('div');
                tooltip.className = 'temp-tooltip';
                tooltip.textContent = `Море: ${seaTemp}°C`;
                tooltip.style.cssText = `
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--glass-bg);
                    backdrop-filter: blur(10px);
                    padding: 8px 15px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    border: 1px solid var(--glass-border);
                    z-index: 10;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;
                
                this.appendChild(tooltip);
                setTimeout(() => tooltip.style.opacity = '1', 10);
            });
            
            month.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.temp-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    // ========== КАРТА КИПРА ==========
    function initCyprusMap() {
        const mapContainer = document.querySelector('.cyprus-map');
        if (!mapContainer) return;
        
        // Города Кипра с координатами (относительными)
        const cities = [
            { name: 'Никосия', x: 50, y: 40 },
            { name: 'Лимасол', x: 40, y: 70 },
            { name: 'Пафос', x: 25, y: 70 },
            { name: 'Ларнака', x: 60, y: 65 },
            { name: 'Айя-Напа', x: 75, y: 55 },
            { name: 'Протарас', x: 80, y: 60 },
            { name: 'Полис', x: 20, y: 30 },
            { name: 'Троодос', x: 45, y: 20 }
        ];
        
        const mapPoints = document.querySelector('.map-points');
        if (!mapPoints) return;
        
        // Создаем точки на карте
        cities.forEach(city => {
            const point = document.createElement('div');
            point.className = 'map-point';
            point.setAttribute('data-city', city.name);
            point.style.left = `${city.x}%`;
            point.style.top = `${city.y}%`;
            
            // Анимация пульсации
            point.style.animation = `pulse 2s infinite ${Math.random() * 2}s`;
            
            // Информация о городе при клике
            point.addEventListener('click', function() {
                showCityInfo(city.name);
            });
            
            mapPoints.appendChild(point);
        });
        
        // Добавляем эффект волн на карте
        createWaveEffect(mapContainer);
    }

    function createWaveEffect(container) {
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'map-wave';
            wave.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 20px;
                border: 2px solid rgba(0, 168, 255, ${0.1 + i * 0.1});
                animation: wave ${3 + i}s linear infinite;
                z-index: 1;
            `;
            
            // Добавляем ключевые кадры для анимации волн
            if (!document.querySelector('#wave-animation')) {
                const style = document.createElement('style');
                style.id = 'wave-animation';
                style.textContent = `
                    @keyframes wave {
                        0% {
                            transform: scale(1);
                            opacity: 0.5;
                        }
                        100% {
                            transform: scale(1.05);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            container.appendChild(wave);
        }
    }

    function showCityInfo(cityName) {
        // Информация о городах Кипра
        const cityInfo = {
            'Никосия': 'Столица Кипра, единственная разделенная столица в мире. Крупнейший город острова.',
            'Лимасол': 'Второй по величине город, важный торговый порт и туристический центр.',
            'Пафос': 'Культурная столица Европы 2017 года. Известен археологическим парком.',
            'Ларнака': 'Третий по величине город с международным аэропортом и соленым озером.',
            'Айя-Напа': 'Молодежный курорт с лучшими пляжами и ночной жизнью.',
            'Протарас': 'Семейный курорт с песчаными пляжами и спокойной атмосферой.',
            'Полис': 'Небольшой прибрежный город у залива Хризохуса.',
            'Троодос': 'Горный курорт, зимой работает горнолыжная база.'
        };
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'city-modal';
        modal.innerHTML = `
            <div class="modal-content glass">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <h3><i class="fas fa-map-marker-alt"></i> ${cityName}</h3>
                <p>${cityInfo[cityName] || 'Информация о городе'}</p>
                <div class="modal-stats">
                    <div class="stat">
                        <span class="stat-value">${getRandomTemp()}</span>
                        <span class="stat-label">Средняя температура</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${getRandomPopulation()}</span>
                        <span class="stat-label">Население</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 25, 49, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(modal);
        
        // Анимация появления
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Закрытие модального окна
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    // ========== СТАТИСТИКА ==========
    function initStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const targetValue = parseInt(statNumber.textContent);
                    animateCounter(statNumber, 0, targetValue, 2000);
                    statsObserver.unobserve(statNumber);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(number => {
            statsObserver.observe(number);
        });
    }

    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = formatNumber(value);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ========== ЭФФЕКТ ПУЗЫРЬКОВ ==========
    function initBubbleEffect() {
        const bubbleContainer = document.querySelector('.bubble-effect');
        if (!bubbleContainer) return;
        
        for (let i = 0; i < CONFIG.bubbleCount; i++) {
            createBubble(bubbleContainer);
        }
        
        // Периодическое создание новых пузырьков
        setInterval(() => {
            if (document.querySelectorAll('.bubble').length < CONFIG.bubbleCount) {
                createBubble(bubbleContainer);
            }
        }, 3000);
    }

    function createBubble(container) {
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
            background: radial-gradient(circle at 30% 30%, rgba(0, 210, 255, 0.3), rgba(0, 168, 255, 0.1));
            border-radius: 50%;
            left: ${left}%;
            bottom: -20px;
            animation: bubble-rise ${duration}s ease-in ${delay}s infinite;
            z-index: 1;
        `;
        
        // Добавляем ключевые кадры для анимации пузырьков
        if (!document.querySelector('#bubble-animation')) {
            const style = document.createElement('style');
            style.id = 'bubble-animation';
            style.textContent = `
                @keyframes bubble-rise {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(-100vh) scale(0.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.appendChild(bubble);
        
        // Удаляем пузырек после анимации
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, (duration + delay) * 1000);
    }

    // ========== ОБРАБОТКА СОБЫТИЙ ==========
    function handleResize() {
        // Обновление состояния мобильного меню
        if (window.innerWidth > 768 && STATE.isMobileMenuOpen) {
            toggleMobileMenu();
        }
        
        // Перерасчет параллакса
        handleScrollAnimations();
    }

    function handleLoad() {
        // Анимация после полной загрузки
        document.body.classList.add('loaded');
        
        // Предзагрузка изображений
        preloadImages();
    }

    function handleDocumentClick(e) {
        // Закрытие мобильного меню при клике вне его
        if (STATE.isMobileMenuOpen && 
            !DOM.nav.contains(e.target) && 
            !DOM.mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    }

    function handleKeyDown(e) {
        // Закрытие модальных окон и меню по ESC
        if (e.key === 'Escape') {
            if (STATE.isMobileMenuOpen) {
                toggleMobileMenu();
            }
            
            const modal = document.querySelector('.city-modal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        }
    }

    // ========== АНИМАЦИИ ПРИ ЗАГРУЗКЕ ==========
    function animateOnLoad() {
        // Анимация логотипа
        const logoIcon = document.querySelector('.logo-icon');
        if (logoIcon) {
            logoIcon.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                logoIcon.style.transform = 'rotate(0) scale(1)';
            }, 600);
        }
        
        // Волновая анимация заголовка
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.animation = 'wave 3s ease-in-out';
        }
        
        // Постепенное появление элементов
        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Запуск эффекта пузырьков
        setTimeout(() => {
            document.body.classList.add('animations-ready');
        }, 1000);
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    function getRandomTemp() {
        const temps = ['15-20°C', '20-25°C', '25-30°C', '30-35°C'];
        return temps[Math.floor(Math.random() * temps.length)];
    }
    
    function getRandomPopulation() {
        const populations = ['50K', '150K', '250K', '350K', '500K'];
        return populations[Math.floor(Math.random() * populations.length)];
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
    
    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            const image = new Image();
            image.src = src;
            image.onload = () => {
                img.src = src;
                img.classList.add('loaded');
            };
        });
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
    init();

    // ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==========
    window.CyprusSite = {
        showCityInfo: showCityInfo,
        scrollToSection: function(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerHeight = DOM.header.offsetHeight;
                window.scrollTo({
                    top: element.offsetTop - headerHeight + 10,
                    behavior: 'smooth'
                });
            }
        },
        getTemperature: function(month) {
            const temps = [15, 16, 18, 21, 25, 29, 32, 32, 29, 26, 21, 17];
            return temps[month] || temps[new Date().getMonth()];
        }
    };
});

// ========== ПРЕЛОАДЕР ==========
(function() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <div class="logo-icon">
                    <i class="fas fa-sun"></i>
                </div>
                <div class="logo-text">КИПР</div>
            </div>
            <div class="preloader-wave">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
            <div class="preloader-text">Загрузка острова солнца...</div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        #preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--sea-deep) 0%, var(--sea-dark) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .preloader-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .preloader-logo .logo-icon {
            width: 70px;
            height: 70px;
            background: var(--gradient-wave);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .preloader-logo .logo-text {
            font-size: 36px;
            font-weight: 800;
            background: var(--gradient-wave);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: 3px;
        }
        
        .preloader-wave {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            gap: 8px;
            height: 50px;
            margin-bottom: 30px;
        }
        
        .preloader-wave .wave {
            width: 10px;
            background: var(--gradient-wave);
            border-radius: 5px;
            animation: wave-bounce 1.2s ease-in-out infinite;
        }
        
        .preloader-wave .wave:nth-child(2) {
            animation-delay: -0.2s;
            height: 30px;
        }
        
        .preloader-wave .wave:nth-child(3) {
            animation-delay: -0.4s;
            height: 40px;
        }
        
        .preloader-wave .wave:nth-child(4) {
            animation-delay: -0.6s;
            height: 30px;
        }
        
        .preloader-wave .wave:nth-child(5) {
            animation-delay: -0.8s;
            height: 20px;
        }
        
        .preloader-text {
            color: var(--sea-foam);
            font-size: 1.1rem;
            opacity: 0.8;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes wave-bounce {
            0%, 100% { height: 20px; }
            50% { height: 40px; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(preloader);
    
    // Удаляем прелоадер после загрузки
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 800);
    });
})();

// ========== ПОЛИФИЛЛЫ ==========
(function() {
    // requestAnimationFrame
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                      window.mozRequestAnimationFrame ||
                                      function(callback) {
                                          return window.setTimeout(callback, 1000 / 60);
                                      };
    }
    
    // IntersectionObserver
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver не поддерживается в этом браузере');
    }
})();

// ========== ОБРАБОТКА ОШИБОК ==========
window.addEventListener('error', function(e) {
    console.error('🌊 Ошибка на сайте о Кипре:', e.error);
    
    // Показываем дружелюбное сообщение об ошибке
    if (!document.querySelector('.error-message')) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.innerHTML = `
            <div class="error-content glass">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Что-то пошло не так</h4>
                <p>Попробуйте обновить страницу или вернуться позже</p>
                <button onclick="location.reload()">Обновить страницу</button>
            </div>
        `;
        errorMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
        `;
        document.body.appendChild(errorMsg);
    }
});
