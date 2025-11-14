(function() {
    // Змінні для swipe to close
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let canClose = false;
    let currentDropdown = null;

    function isMobileScreen() {
        return window.innerWidth <= 768;
    }

    // ===== SWIPE TO CLOSE ДЛЯ ВСІХ DROPDOWN =====
    
    function setupSwipeToClose() {
        const dropdowns = document.querySelectorAll('.Dropdown-menu');
        
        dropdowns.forEach(dropdown => {
            // Додаємо індикаторну полоску, якщо її ще немає
            if (!dropdown.querySelector('.swipe-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'swipe-indicator';
                dropdown.insertBefore(indicator, dropdown.firstChild);
            }
            
            // Застосовуємо закруглені кути
            dropdown.style.borderRadius = '23px 23px 0 0';
            
            // Скидаємо стилі при кожному відкритті
            dropdown.style.transform = '';
            dropdown.style.opacity = '';
            dropdown.style.transition = '';
            
            dropdown.removeEventListener('touchstart', handleTouchStart);
            dropdown.removeEventListener('touchmove', handleTouchMove);
            dropdown.removeEventListener('touchend', handleTouchEnd);
            
            dropdown.addEventListener('touchstart', handleTouchStart, { passive: false });
            dropdown.addEventListener('touchmove', handleTouchMove, { passive: false });
            dropdown.addEventListener('touchend', handleTouchEnd, { passive: true });
        });
    }

    function handleTouchStart(e) {
        // Не обробляємо якщо це мобільне меню або Scrubber-info
        if (e.target.closest('.mobile-nav-menu') || e.target.closest('.Scrubber-info')) {
            return;
        }
        
        startY = e.touches[0].clientY;
        currentY = startY;
        isDragging = true;
        canClose = false;
        currentDropdown = e.currentTarget;
        
        canClose = currentDropdown.scrollTop === 0;
        
        // Додаємо активний стан для плавної анімації
        if (canClose) {
            currentDropdown.style.transition = 'none';
        }
    }

    function handleTouchMove(e) {
        if (!isDragging || !currentDropdown) return;
        
        // Не обробляємо якщо це Scrubber-scrollbar
        if (e.target.closest('.Scrubber-scrollbar') || e.target.closest('.mobile-nav-menu')) {
            return;
        }
        
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY < 0 || !canClose) {
            return;
        }
        
        if (deltaY > 0 && canClose) {
            e.preventDefault();
            const progress = Math.min(deltaY / 150, 1);
            currentDropdown.style.transform = `translateY(${deltaY}px)`;
            currentDropdown.style.opacity = Math.max(0.3, 1 - progress);
            
            // Анімація закруглення кутів - зменшуємо при свайпі
            const borderRadius = Math.max(8, 16 - (progress * 8));
            currentDropdown.style.borderRadius = `${borderRadius}px ${borderRadius}px 0 0`;
        }
    }

    function handleTouchEnd(e) {
        if (!isDragging || !currentDropdown) return;
        
        const deltaY = currentY - startY;
        const dropdownParent = currentDropdown.parentElement;
        
        if (deltaY > 80 && canClose) {
            currentDropdown.style.transform = `translateY(100vh)`;
            currentDropdown.style.opacity = '0';
            currentDropdown.style.borderRadius = '8px 8px 0 0';
            currentDropdown.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                if (dropdownParent) {
                    dropdownParent.classList.remove('open');
                }
                // Обов'язково скидаємо стилі після закриття
                setTimeout(() => {
                    currentDropdown.style.transform = '';
                    currentDropdown.style.opacity = '';
                    currentDropdown.style.transition = '';
                    currentDropdown.style.borderRadius = '16px 16px 0 0';
                }, 50);
            }, 300);
        } else {
            // Повертаємо до початкового стану
            currentDropdown.style.transform = '';
            currentDropdown.style.opacity = '';
            currentDropdown.style.borderRadius = '16px 16px 0 0';
            currentDropdown.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                currentDropdown.style.transition = '';
            }, 200);
        }
        
        isDragging = false;
        currentDropdown = null;
    }

    // Обробники для миші
    function setupMouseHandlers() {
        const dropdowns = document.querySelectorAll('.Dropdown-menu');
        
        dropdowns.forEach(dropdown => {
            // Додаємо індикаторну полоску, якщо її ще немає
            if (!dropdown.querySelector('.swipe-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'swipe-indicator';
                dropdown.insertBefore(indicator, dropdown.firstChild);
            }
            
            // Застосовуємо закруглені кути
            dropdown.style.borderRadius = '16px 16px 0 0';
            
            // Скидаємо стилі
            dropdown.style.transform = '';
            dropdown.style.opacity = '';
            dropdown.style.transition = '';
            
            dropdown.removeEventListener('mousedown', handleMouseDown);
            dropdown.addEventListener('mousedown', handleMouseDown);
        });
    }

    function handleMouseDown(e) {
        // Не обробляємо якщо це мобільне меню або Scrubber-scrollbar
        if (e.target.closest('.mobile-nav-menu') || e.target.closest('.Scrubber-scrollbar')) {
            return;
        }
        
        startY = e.clientY;
        currentY = startY;
        isDragging = true;
        canClose = false;
        currentDropdown = e.currentTarget;
        
        canClose = currentDropdown.scrollTop === 0;
        
        if (canClose) {
            currentDropdown.style.transition = 'none';
        }
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
        if (!isDragging || !currentDropdown) return;
        
        currentY = e.clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 0 && canClose) {
            const progress = Math.min(deltaY / 150, 1);
            currentDropdown.style.transform = `translateY(${deltaY}px)`;
            currentDropdown.style.opacity = Math.max(0.3, 1 - progress);
            
            // Анімація закруглення кутів
            const borderRadius = Math.max(8, 16 - (progress * 8));
            currentDropdown.style.borderRadius = `${borderRadius}px ${borderRadius}px 0 0`;
        }
    }

    function handleMouseUp() {
        if (!isDragging || !currentDropdown) return;
        
        const deltaY = currentY - startY;
        const dropdownParent = currentDropdown.parentElement;
        
        if (deltaY > 80 && canClose) {
            currentDropdown.style.transform = `translateY(100vh)`;
            currentDropdown.style.opacity = '0';
            currentDropdown.style.borderRadius = '8px 8px 0 0';
            currentDropdown.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                if (dropdownParent) {
                    dropdownParent.classList.remove('open');
                }
                setTimeout(() => {
                    currentDropdown.style.transform = '';
                    currentDropdown.style.opacity = '';
                    currentDropdown.style.transition = '';
                    currentDropdown.style.borderRadius = '16px 16px 0 0';
                }, 50);
            }, 300);
        } else {
            currentDropdown.style.transform = '';
            currentDropdown.style.opacity = '';
            currentDropdown.style.borderRadius = '16px 16px 0 0';
            currentDropdown.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                currentDropdown.style.transition = '';
            }, 200);
        }
        
        isDragging = false;
        currentDropdown = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

   
    // Ініціалізація swipe функціоналу
    function initSwipe() {
        addSwipeIndicatorStyles();
        setupSwipeToClose();
        setupMouseHandlers();
        
        // Оновлюємо при зміні розміру вікна
        window.addEventListener('resize', () => {
            setTimeout(() => {
                setupSwipeToClose();
                setupMouseHandlers();
            }, 100);
        });
    }

    // Mutation Observer для swipe
    const swipeObserver = new MutationObserver(function(mutations) {
        let shouldUpdateSwipe = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                shouldUpdateSwipe = true;
            }
            
            // Перевіряємо відкриття dropdown
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('Dropdown-menu') && 
                    mutation.target.classList.contains('open')) {
                    // Скидаємо стилі при відкритті
                    mutation.target.style.transform = '';
                    mutation.target.style.opacity = '';
                    mutation.target.style.transition = '';
                    mutation.target.style.borderRadius = '16px 16px 0 0';
                    
                    // Додаємо індикатор, якщо його немає
                    if (!mutation.target.querySelector('.swipe-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'swipe-indicator';
                        mutation.target.insertBefore(indicator, mutation.target.firstChild);
                    }
                }
            }
        });
        
        if (shouldUpdateSwipe) {
            setTimeout(() => {
                setupSwipeToClose();
                setupMouseHandlers();
            }, 100);
        }
    });
    
    // Чекаємо поки document.body буде готовим
    function startObserver() {
        if (!document.body) {
            setTimeout(startObserver, 100);
            return;
        }
        swipeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    startObserver();

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwipe);
    } else {
        initSwipe();
    }

    // ===== ОСНОВНИЙ SWIPE ФУНКЦІОНАЛ =====

    document.addEventListener('touchstart', handleNavTouchStart, false);
    document.addEventListener('touchmove', handleNavTouchMove, false);
    document.addEventListener('touchend', handleNavTouchEnd, false);

    let xStart = null;
    let yStart = null;
    let xDiff = 0;
    let yDiff = 0;
    let isSwiping = false;
    let hasReachedThreshold = false;

    const swipeRightThreshold = 200; // Поріг для свайпу вправо
    const swipeLeftThreshold = -140; // Поріг для свайпу вліво
    const swipeIgnoreThreshold = 90; // Мінімальний поріг для ігнорування маленьких рухів

    function handleNavTouchStart(evt) {
        if (evt.target.closest('.Dropdown-toggle') || evt.target.closest('.navigation') || evt.target.closest('.modal') || evt.target.closest('.Dropdown-menu') || evt.target.closest('button') || evt.target.closest('textarea') || evt.target.closest('input')) {
            return;
        }

        const firstTouch = evt.touches[0];
        xStart = firstTouch.clientX;
        yStart = firstTouch.clientY;
        isSwiping = true;
        hasReachedThreshold = false;
    }

    function handleNavTouchMove(evt) {
        if (!xStart || !isSwiping) {
            return;
        }

        let xEnd = evt.touches[0].clientX;
        let yEnd = evt.touches[0].clientY;

        // Розрахунок різниці між початковими і поточними координатами
        xDiff = xEnd - xStart;
        yDiff = yEnd - yStart;

        // Якщо рух в основному вертикальний, ігноруємо його
        if (Math.abs(xDiff) < Math.abs(yDiff)) {
            return;
        }

        // Ігноруємо маленькі горизонтальні рухи
        if (Math.abs(xDiff) < swipeIgnoreThreshold) {
            return;
        }

        // Обробка рухів вправо
        if (xDiff > 0) {
            document.querySelectorAll('.App-content').forEach(function (content) {
                content.style.transform = `translateX(${xDiff}px)`;
                content.style.opacity = 1 - Math.abs(xDiff) / (2 * swipeRightThreshold);

                if (xDiff > swipeRightThreshold) {
                    content.classList.add('permanently-swiped');
                    hasReachedThreshold = true;
                }
            });
        }
        // Обробка рухів вліво
        else if (xDiff < 0) {
            if (window.location.pathname === '/') {
                // Свайп вліво тільки на головній сторінці
                document.querySelectorAll('.App-content').forEach(function (content) {
                    // Анімація зсуву вліво з поворотом
                    content.style.transform = `translateX(${xDiff}px) rotateY(${xDiff/10}deg)`;
                    content.style.opacity = 1 - Math.abs(xDiff) / 500;

                    if (Math.abs(xDiff) > Math.abs(swipeLeftThreshold)) {
                        content.classList.add('permanently-swiped');
                        hasReachedThreshold = true;
                    }
                });
            } else if (hasReachedThreshold) {
                // Свайп вліво на інших сторінках — повернення анімації на місце
                document.querySelectorAll('.App-content').forEach(function (content) {
                    content.style.transform = `translateX(${xDiff}px)`;
                    content.style.opacity = 1 - Math.abs(xDiff) / (2 * Math.abs(swipeLeftThreshold));

                    // Якщо рух вліво, але ми не досягли порогу, скидаємо елементи
                    if (Math.abs(xDiff) < swipeRightThreshold) {
                        content.style.transform = `translateX(0)`;
                        content.style.opacity = 1;
                    }
                });
            }
        }
    }

    function handleNavTouchEnd(evt) {
        if (isSwiping) {
            if (hasReachedThreshold) {
                // Свайп вправо - натискання на кнопку для повернення
                if (xDiff > 0) {
                    const button = document.querySelector('.Button-label');
                    if (button) {
                        button.click();
                        setTimeout(removeSwipeClasses, 300);
                    }
                } 
                // Свайп вліво - лише на головній сторінці
                else if (xDiff < 0 && window.location.pathname === '/') {
                    // АНІМАЦІЯ ГОРТАННЯ СТОРІНОК
                    document.querySelectorAll('.App-content').forEach(function (content) {
                        // Поточна сторінка з'їжджає вліво
                        content.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-out';
                        content.style.transform = 'translateX(-100%) rotateY(-15deg)';
                        content.style.opacity = '0';
                    });

                    // Переміщаємо на сторінку /all
                    if (typeof app !== 'undefined' && app.history) {
                        app.history.push('/all');
                    } else {
                        window.location.href = '/all';
                    }

                    // Додаємо стилі для нової сторінки, щоб вона з'являлася знизу
                    setTimeout(function() {
                        const newPageContent = document.querySelectorAll('.App-content');
                        if (newPageContent.length > 0) {
                            newPageContent.forEach(function(content) {
                                // Спочатку встановлюємо початковий стан (знизу)
                                content.style.transform = 'translateY(100px)';
                                content.style.opacity = '0';
                                
                                // Потім анімуємо появу знизу
                                setTimeout(function() {
                                    content.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-out';
                                    content.style.transform = 'translateY(0)';
                                    content.style.opacity = '1';
                                }, 50);
                            });
                        }

                        // Фінальне скидання стилів
                        setTimeout(function() {
                            document.querySelectorAll('.App-content').forEach(function (content) {
                                content.style.transition = '';
                                content.style.transform = '';
                                content.style.opacity = '';
                                content.style.willChange = '';
                            });
                        }, 500);
                    }, 400);
                }
            } else {
                // Якщо поріг не досягнутий, повертаємо елементи на місце
                document.querySelectorAll('.App-content').forEach(function (content) {
                    content.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                    content.style.transform = '';
                    content.style.opacity = '';
                });
            }
        }

        isSwiping = false;
        xStart = null;
        yStart = null;
    }

    function removeSwipeClasses() {
        document.querySelectorAll('.App-content').forEach(function (content) {
            content.classList.remove('swiped');
            content.classList.remove('permanently-swiped');
            content.style.transform = '';
            content.style.opacity = '';
        });
    }
})();
