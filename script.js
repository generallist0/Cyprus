// main.js - Полный JavaScript для сайта о Кипре

document.addEventListener('DOMContentLoaded', function() {
    // ========== ПЕРЕМЕННЫЕ И КОНФИГУРАЦИЯ ==========
    const config = {
        scrollOffset: 100,
        animationThreshold: 0.1,
        scrollTopThreshold: 500
    };

    // ========== ОСНОВНЫЕ ЭЛЕМЕНТЫ ==========
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.reveal');

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    init();

    // ========== ОСНОВНЫЕ ФУНКЦИИ ==========
    function init() {
        // Инициализация всех модулей
        initHeaderScroll();
        initMobileMenu();
        initScrollProgress();
        initScrollTopButton();
        initSmoothScroll();
        initScrollAnimations();
        initActiveNav();
        initGalleryHover();
        
        // Запуск анимаций при загрузке
        setTimeout(() => {
            animateOnLoad();
        }, 300);
    }

    // ========== ФИКСИРОВАННЫЙ ХЕДЕР ==========
    function initHeaderScroll() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Добавление/удаление класса при прокрутке
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Скрытие/показ хедера при скролле
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    function initMobileMenu() {
        if (!mobileMenuBtn) return;
        
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
            
            // Блокировка скролла при открытом меню
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
    }

    // ========== ПРОГРЕСС-БАР СКРОЛЛА ==========
    function initScrollProgress() {
        if (!scrollProgress) return;
        
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            scrollProgress.style.width = scrolled + '%';
        });
    }

    // ========== КНОПКА "НАВЕРХ" ==========
    function initScrollTopButton() {
        if (!scrollTopBtn) return;
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > config.scrollTopThreshold) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== ПЛАВНАЯ ПРОКРУТКА ==========
    function initSmoothScroll() {
        // Плавная прокрутка к якорям
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Закрытие мобильного меню если открыто
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        document.body.style.overflow = '';
                    }
                    
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Плавная прокрутка для кнопок с data-target
        document.querySelectorAll('[data-target]').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========== АНИМАЦИИ ПРИ СКРОЛЛЕ ==========
    function initScrollAnimations() {
        if (revealElements.length === 0) return;
        
        const observerOptions = {
            threshold: config.animationThreshold,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Добавляем задержку для дочерних элементов
                    const children = entry.target.querySelectorAll('[data-delay]');
                    children.forEach((child, index) => {
                        const delay = child.getAttribute('data-delay') || index * 100;
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, delay);
                    });
                }
            });
        }, observerOptions);
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // ========== АКТИВНЫЙ ПУНКТ МЕНЮ ==========
    function initActiveNav() {
        if (navLinks.length === 0) return;
        
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const headerHeight = header.offsetHeight;
                
                if (scrollY >= (sectionTop - headerHeight - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ========== ГАЛЕРЕЯ ==========
    function initGalleryHover() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
                this.style.transform = 'scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
                this.style.transform = 'scale(1)';
            });
            
            // Клик по элементу галереи
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                openLightbox(imgSrc, this.querySelector('.gallery-title').textContent);
            });
        });
    }

    // ========== ЛАЙТБОКС ==========
    function openLightbox(imageSrc, title) {
        // Создаем лайтбокс если его нет
        let lightbox = document.querySelector('.lightbox');
        
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close"><i class="fas fa-times"></i></button>
                    <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                    <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                    <div class="lightbox-image-container">
                        <img src="${imageSrc}" alt="${title}">
                    </div>
                    <div class="lightbox-caption">
                        <h3>${title}</h3>
                    </div>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Добавляем стили для лайтбокса
            addLightboxStyles();
            
            // Добавляем обработчики событий
            const closeBtn = lightbox.querySelector('.lightbox-close');
            const prevBtn = lightbox.querySelector('.lightbox-prev');
            const nextBtn = lightbox.querySelector('.lightbox-next');
            
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // Навигация по галерее
            const galleryItems = document.querySelectorAll('.gallery-item');
            let currentIndex = Array.from(galleryItems).findIndex(item => 
                item.querySelector('img').src === imageSrc
            );
            
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', function() {
                    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                    updateLightbox(galleryItems[currentIndex]);
                });
                
                nextBtn.addEventListener('click', function() {
                    currentIndex = (currentIndex + 1) % galleryItems.length;
                    updateLightbox(galleryItems[currentIndex]);
                });
                
                // Навигация с помощью клавиатуры
                document.addEventListener('keydown', function(e) {
                    if (!lightbox.classList.contains('active')) return;
                    
                    switch(e.key) {
                        case 'Escape':
                            closeLightbox();
                            break;
                        case 'ArrowLeft':
                            prevBtn.click();
                            break;
                        case 'ArrowRight':
                            nextBtn.click();
                            break;
                    }
                });
            }
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateLightbox(galleryItem) {
        const lightbox = document.querySelector('.lightbox');
        const imgSrc = galleryItem.querySelector('img').src;
        const title = galleryItem.querySelector('.gallery-title').textContent;
        
        lightbox.querySelector('img').src = imgSrc;
        lightbox.querySelector('img').alt = title;
        lightbox.querySelector('.lightbox-caption h3').textContent = title;
    }
    
    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => {
                if (lightbox.parentNode) {
                    lightbox.parentNode.removeChild(lightbox);
                }
            }, 300);
            document.body.style.overflow = '';
        }
    }
    
    function addLightboxStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(13, 19, 33, 0.95);
                backdrop-filter: blur(10px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            
            .lightbox.active {
                opacity: 1;
                visibility: visible;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                background: rgba(30, 45, 70, 0.8);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            }
            
            .lightbox-image-container {
                max-width: 90vw;
                max-height: 70vh;
                overflow: hidden;
            }
            
            .lightbox-image-container img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }
            
            .lightbox-caption {
                padding: 20px;
                text-align: center;
                background: rgba(13, 19, 33, 0.8);
            }
            
            .lightbox-caption h3 {
                color: #fff;
                margin: 0;
                font-size: 1.5rem;
            }
            
            .lightbox-close,
            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                background: rgba(30, 45, 70, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #fff;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
                z-index: 10;
            }
            
            .lightbox-close:hover,
            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(0, 180, 216, 0.8);
                transform: scale(1.1);
            }
            
            .lightbox-close {
                top: 20px;
                right: 20px;
            }
            
            .lightbox-prev {
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
            }
            
            .lightbox-next {
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
            }
        `;
        document.head.appendChild(style);
    }

    // ========== АНИМАЦИИ ПРИ ЗАГРУЗКЕ ==========
    function animateOnLoad() {
        // Анимация логотипа
        const logoIcon = document.querySelector('.logo-icon');
        if (logoIcon) {
            setTimeout(() => {
                logoIcon.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    logoIcon.style.transform = 'rotate(0deg)';
                }, 500);
            }, 300);
        }
        
        // Анимация элементов с задержкой
        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Плавное появление основного контента
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    // ========== ПАРАЛЛАКС ЭФФЕКТ ==========
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // ========== ТАЙМЕР ДЛЯ АНИМАЦИЙ ==========
    function createCounterAnimation(element, targetValue, duration = 2000) {
        let startValue = 0;
        const increment = targetValue / (duration / 16); // 60fps
        let currentValue = 0;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue);
        }, 16);
    }

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
    
    // Ресайз окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Обновление позиций для мобильного меню
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    // Предотвращение перетаскивания изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    });

    // ========== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ==========
    
    // Форматирование чисел
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Получение текущего года для футера
    function updateCopyrightYear() {
        const yearElement = document.querySelector('.current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // Инициализация счетчика года
    updateCopyrightYear();

    // ========== ЭФФЕКТЫ ДЛЯ КАРТОЧЕК ==========
    function initCardEffects() {
        const cards = document.querySelectorAll('.glass-hover');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                this.style.boxShadow = `${rotateY * 2}px ${rotateX * 2}px 20px rgba(0, 0, 0, 0.3)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-5px)';
                this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
            });
        });
    }
    
    // Инициализация эффектов карточек
    initCardEffects();

    // ========== ИНИЦИАЛИЗАЦИЯ ПАРАЛЛАКСА ==========
    initParallax();

    // ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ФОРМАМИ ==========
    function initForms() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Валидация формы
                if (validateForm(this)) {
                    // Эмуляция отправки формы
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                    submitBtn.disabled = true;
                    
                    // Эмуляция задержки отправки
                    setTimeout(() => {
                        showNotification('Сообщение успешно отправлено!', 'success');
                        contactForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                }
            });
        }
    }
    
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4757';
                isValid = false;
                
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                });
            }
        });
        
        // Проверка email
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#ff4757';
                isValid = false;
                
                emailInput.addEventListener('input', function() {
                    this.style.borderColor = '';
                });
            }
        }
        
        return isValid;
    }
    
    function showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Добавляем стили
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: rgba(30, 45, 70, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    z-index: 3000;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    transform: translateX(150%);
                    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    max-width: 400px;
                }
                
                .notification.active {
                    transform: translateX(0);
                }
                
                .notification-success {
                    border-left: 4px solid #00d9b3;
                }
                
                .notification-error {
                    border-left: 4px solid #ff4757;
                }
                
                .notification-info {
                    border-left: 4px solid #00b4d8;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #fff;
                }
                
                .notification-content i {
                    font-size: 1.5rem;
                }
                
                .notification-success .notification-content i {
                    color: #00d9b3;
                }
                
                .notification-error .notification-content i {
                    color: #ff4757;
                }
                
                .notification-info .notification-content i {
                    color: #00b4d8;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 5px;
                    transition: color 0.3s;
                }
                
                .notification-close:hover {
                    color: #fff;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Закрытие уведомления
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Автоматическое закрытие
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('active');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // Инициализация форм
    initForms();

    // ========== LAZY LOADING ДЛЯ ИЗОБРАЖЕНИЙ ==========
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback для старых браузеров
            lazyImages.forEach(img => {
                img.src = img.getAttribute('data-src');
            });
        }
    }
    
    initLazyLoading();

    // ========== ДЕБАГ ИНФОРМАЦИЯ ==========
    console.log('Кипрский сайт инициализирован успешно! 🏝️');
    console.log('Версия: 1.0.0');
    console.log('Дата сборки: ' + new Date().toLocaleDateString());
});

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==========

// Функция для показа прелоадера
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <div class="logo-icon">
                    <i class="fas fa-umbrella-beach"></i>
                </div>
                <div class="logo-text">КИПР</div>
            </div>
            <div class="preloader-spinner"></div>
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
            background: var(--dark-bg);
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
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .preloader-logo .logo-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: white;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .preloader-logo .logo-text {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .preloader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: var(--primary);
            margin: 0 auto;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
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
        }, 500);
    });
}

// Инициализация прелоадера при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPreloader);
} else {
    showPreloader();
}

// ========== ПОЛИФИЛЛЫ ==========

// requestAnimationFrame полифилл
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// ========== СЛУЖЕБНЫЕ ФУНКЦИИ ==========

// Функция для проверки поддержки свойств
function supportsCSSProperty(property) {
    return CSS.supports(property, 'initial');
}

// Функция для добавления класса к body в зависимости от устройства
function detectDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('is-mobile');
    } else if (isTablet) {
        document.body.classList.add('is-tablet');
    } else {
        document.body.classList.add('is-desktop');
    }
}

// Инициализация определения устройства
detectDevice();

// ========== ОБРАБОТКА ОШИБОК ==========
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});

// ========== ЭКСПОРТ ФУНКЦИЙ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ ==========
window.CyprusSite = {
    showNotification: showNotification,
    closeLightbox: closeLightbox,
    scrollToSection: function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            window.scrollTo({
                top: element.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    }
};