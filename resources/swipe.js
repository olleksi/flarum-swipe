(function() {
    // Змінні для swipe to close
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let canClose = false;
    let currentDropdown = null;
    let dropdownIsOpen = false;

    // Логування (можна видалити у продакшені)
    const log = (msg, data) => console.log(`[Flarum Swipe] ${msg}`, data || '');

    function isMobileScreen() {
        return window.innerWidth <= 768;
    }

   
    // ПЕРЕХОПЛЮЄМО МЕТОДИ DROPDOWN
    function interceptDropdownMethods() {
        const dropdowns = document.querySelectorAll('.Dropdown-menu');
        
        dropdowns.forEach(dropdown => {
            const origShow = dropdown.show;
            const origHide = dropdown.hide;
            const origToggle = dropdown.toggle;
            
            if (typeof origShow === 'function') {
                dropdown.show = function() {
                    dropdownIsOpen = true;
                    return origShow.call(this);
                };
            }
            
            if (typeof origHide === 'function') {
                dropdown.hide = function() {
                    dropdownIsOpen = false;
                    return origHide.call(this);
                };
            }
            
            if (typeof origToggle === 'function') {
                dropdown.toggle = function() {
                    return origToggle.call(this);
                };
            }
        });
    }

    // Логуємо клік события для отримання інформації про toggle
    document.addEventListener('click', (e) => {
        const dropdown = e.target.closest('.Dropdown-menu');
        const toggle = e.target.closest('[data-toggle="dropdown"], .Dropdown-toggle');
        
        if (dropdown) {
            log('Click inside dropdown', { className: dropdown.className });
        }
        if (toggle) {
            log('Click on dropdown toggle', { 
                toggleClass: toggle.className,
                text: toggle.textContent?.substring(0, 50)
            });
        }
        
        if (!dropdown && !toggle) {
            log('Click OUTSIDE dropdown - closing triggered');
        }
    }, true);

    // ===== SWIPE TO CLOSE ДЛЯ ВСІХ DROPDOWN =====
    
    function setupSwipeToClose() {
        const dropdowns = document.querySelectorAll('.Dropdown-menu');
        
        dropdowns.forEach(dropdown => {
            if (!dropdown.querySelector('.swipe-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'swipe-indicator';
                dropdown.insertBefore(indicator, dropdown.firstChild);
            }
            
            dropdown.style.borderRadius = '23px 23px 0 0';
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
        if (e.target.closest('.mobile-nav-menu') || e.target.closest('.Scrubber-info')) {
            return;
        }
        
        startY = e.touches[0].clientY;
        currentY = startY;
        isDragging = true;
        canClose = false;
        currentDropdown = e.currentTarget;
        
        canClose = currentDropdown.scrollTop === 0;
        
        if (canClose) {
            currentDropdown.style.transition = 'none';
        }
    }

    function handleTouchMove(e) {
        if (!isDragging || !currentDropdown) return;
        
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
            
            const borderRadius = Math.max(8, 16 - (progress * 8));
            currentDropdown.style.borderRadius = `${borderRadius}px ${borderRadius}px 0 0`;
        }
    }

    function handleTouchEnd(e) {
        if (!isDragging || !currentDropdown) return;
        
        const deltaY = currentY - startY;
        const dropdownRef = currentDropdown;
        const dropdownParent = currentDropdown.parentElement;
        
        if (deltaY > 80 && canClose) {
            log('Closing dropdown via swipe');
            dropdownRef.style.transform = `translateY(100vh)`;
            dropdownRef.style.opacity = '0';
            dropdownRef.style.borderRadius = '8px 8px 0 0';
            dropdownRef.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                // Симулюємо клік за межами дропдауну - це спустить фларум логіку закриття
                log('Simulating click outside dropdown to trigger Flarum close logic');
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                document.body.dispatchEvent(clickEvent);
                
                dropdownIsOpen = false;
                
                setTimeout(() => {
                    dropdownRef.style.transform = '';
                    dropdownRef.style.opacity = '';
                    dropdownRef.style.transition = '';
                    dropdownRef.style.borderRadius = '16px 16px 0 0';
                }, 50);
            }, 300);
        } else {
            dropdownRef.style.transform = '';
            dropdownRef.style.opacity = '';
            dropdownRef.style.borderRadius = '16px 16px 0 0';
            dropdownRef.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                dropdownRef.style.transition = '';
            }, 200);
        }
        
        isDragging = false;
        currentDropdown = null;
    }

    function setupMouseHandlers() {
        const dropdowns = document.querySelectorAll('.Dropdown-menu');
        
        dropdowns.forEach(dropdown => {
            if (!dropdown.querySelector('.swipe-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'swipe-indicator';
                dropdown.insertBefore(indicator, dropdown.firstChild);
            }
            
            dropdown.style.borderRadius = '16px 16px 0 0';
            dropdown.style.transform = '';
            dropdown.style.opacity = '';
            dropdown.style.transition = '';
            
            dropdown.removeEventListener('mousedown', handleMouseDown);
            dropdown.addEventListener('mousedown', handleMouseDown);
        });
    }

    function handleMouseDown(e) {
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
            
            const borderRadius = Math.max(8, 16 - (progress * 8));
            currentDropdown.style.borderRadius = `${borderRadius}px ${borderRadius}px 0 0`;
        }
    }

    function handleMouseUp() {
        if (!isDragging || !currentDropdown) return;
        
        const deltaY = currentY - startY;
        const dropdownRef = currentDropdown;
        const dropdownParent = currentDropdown.parentElement;
        
        if (deltaY > 80 && canClose) {
            log('Closing dropdown via mouse drag');
            dropdownRef.style.transform = `translateY(100vh)`;
            dropdownRef.style.opacity = '0';
            dropdownRef.style.borderRadius = '8px 8px 0 0';
            dropdownRef.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                // Симулюємо клік за межами дропдауну - це спустить фларум логіку закриття
                log('Simulating click outside dropdown to trigger Flarum close logic');
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                document.body.dispatchEvent(clickEvent);
                
                dropdownIsOpen = false;
                
                setTimeout(() => {
                    dropdownRef.style.transform = '';
                    dropdownRef.style.opacity = '';
                    dropdownRef.style.transition = '';
                    dropdownRef.style.borderRadius = '16px 16px 0 0';
                }, 50);
            }, 300);
        } else {
            dropdownRef.style.transform = '';
            dropdownRef.style.opacity = '';
            dropdownRef.style.borderRadius = '16px 16px 0 0';
            dropdownRef.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                dropdownRef.style.transition = '';
            }, 200);
        }
        
        isDragging = false;
        currentDropdown = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    function initSwipe() {
        setupSwipeToClose();
        setupMouseHandlers();
        interceptDropdownMethods();
        
        window.addEventListener('resize', () => {
            setTimeout(() => {
                setupSwipeToClose();
                setupMouseHandlers();
            }, 100);
        });
    }

    const swipeObserver = new MutationObserver(function(mutations) {
        let shouldUpdateSwipe = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                shouldUpdateSwipe = true;
            }
        });
        
        if (shouldUpdateSwipe) {
            setTimeout(() => {
                setupSwipeToClose();
                setupMouseHandlers();
            }, 100);
        }
    });
    
    function startObserver() {
        if (!document.body) {
            setTimeout(startObserver, 100);
            return;
        }
        swipeObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    startObserver();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwipe);
    } else {
        initSwipe();
    }

    // ===== ОСНОВНИЙ SWIPE ФУНКЦІОНАЛ ФЛАРУМУ =====

    document.addEventListener('touchstart', handleNavTouchStart, false);
    document.addEventListener('touchmove', handleNavTouchMove, false);
    document.addEventListener('touchend', handleNavTouchEnd, false);

    let xStart = null;
    let yStart = null;
    let xDiff = 0;
    let yDiff = 0;
    let isSwiping = false;
    let hasReachedThreshold = false;

    const swipeRightThreshold = 200;
    const swipeLeftThreshold = -140;
    const swipeIgnoreThreshold = 90;

    function handleNavTouchStart(evt) {
        if (dropdownIsOpen) {
            log('Global swipe blocked: dropdown is open');
            return;
        }

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
        if (dropdownIsOpen) {
            return;
        }

        if (!xStart || !isSwiping) {
            return;
        }

        let xEnd = evt.touches[0].clientX;
        let yEnd = evt.touches[0].clientY;

        xDiff = xEnd - xStart;
        yDiff = yEnd - yStart;

        if (Math.abs(xDiff) < Math.abs(yDiff)) {
            return;
        }

        if (Math.abs(xDiff) < swipeIgnoreThreshold) {
            return;
        }

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
        else if (xDiff < 0) {
            if (window.location.pathname === '/') {
                document.querySelectorAll('.App-content').forEach(function (content) {
                    content.style.transform = `translateX(${xDiff}px) rotateY(${xDiff/10}deg)`;
                    content.style.opacity = 1 - Math.abs(xDiff) / 500;

                    if (Math.abs(xDiff) > Math.abs(swipeLeftThreshold)) {
                        content.classList.add('permanently-swiped');
                        hasReachedThreshold = true;
                    }
                });
            } else if (hasReachedThreshold) {
                document.querySelectorAll('.App-content').forEach(function (content) {
                    content.style.transform = `translateX(${xDiff}px)`;
                    content.style.opacity = 1 - Math.abs(xDiff) / (2 * Math.abs(swipeLeftThreshold));

                    if (Math.abs(xDiff) < swipeRightThreshold) {
                        content.style.transform = `translateX(0)`;
                        content.style.opacity = 1;
                    }
                });
            }
        }
    }

    function handleNavTouchEnd(evt) {
        if (dropdownIsOpen) {
            return;
        }

        if (isSwiping) {
            if (hasReachedThreshold) {
                if (xDiff > 0) {
                    const button = document.querySelector('.Button-label');
                    if (button) {
                        button.click();
                        setTimeout(removeSwipeClasses, 300);
                    }
                } 
                else if (xDiff < 0 && window.location.pathname === '/') {
                    document.querySelectorAll('.App-content').forEach(function (content) {
                        content.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-out';
                        content.style.transform = 'translateX(-100%) rotateY(-15deg)';
                        content.style.opacity = '0';
                    });

                    if (typeof m !== 'undefined' && m.route) {
                        m.route.set('/all');
                    }

                    setTimeout(function() {
                        const newPageContent = document.querySelectorAll('.App-content');
                        if (newPageContent.length > 0) {
                            newPageContent.forEach(function(content) {
                                content.style.transform = 'translateY(100px)';
                                content.style.opacity = '0';
                                
                                setTimeout(function() {
                                    content.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-out';
                                    content.style.transform = 'translateY(0)';
                                    content.style.opacity = '1';
                                }, 50);
                            });
                        }

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
