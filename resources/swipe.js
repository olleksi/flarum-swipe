/**
 * Flarum Swipe Gestures Extension
 * Simple version without compilation
 */

(function() {
    'use strict';

    console.log('[Swipe Extension] Script loaded');

    // Multiple initialization attempts
    function tryInit() {
        console.log('[Swipe Extension] Trying to initialize...');
        initSwipeGestures();
    }

    // Try immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

    // Also try after a delay (for SPA navigation)
    setTimeout(tryInit, 1000);
    setTimeout(tryInit, 3000);

    function initSwipeGestures() {
        console.log('[Swipe Extension] Initializing...');
        console.log('[Swipe Extension] Body exists:', !!document.body);
        console.log('[Swipe Extension] Dropdowns found:', document.querySelectorAll('.Dropdown-menu').length);

        // ===== SWIPE TO CLOSE DROPDOWNS =====
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let canClose = false;
        let currentDropdown = null;

        function setupSwipeToClose() {
            const dropdowns = document.querySelectorAll('.Dropdown-menu');
            
            dropdowns.forEach(function(dropdown) {
                // Add swipe indicator if not exists
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

                // Mouse handlers
                dropdown.removeEventListener('mousedown', handleMouseDown);
                dropdown.addEventListener('mousedown', handleMouseDown);
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
                currentDropdown.style.transform = 'translateY(' + deltaY + 'px)';
                currentDropdown.style.opacity = Math.max(0.3, 1 - progress);
                
                const borderRadius = Math.max(8, 16 - (progress * 8));
                currentDropdown.style.borderRadius = borderRadius + 'px ' + borderRadius + 'px 0 0';
            }
        }

        function handleTouchEnd(e) {
            if (!isDragging || !currentDropdown) return;
            
            const deltaY = currentY - startY;
            const dropdownParent = currentDropdown.parentElement;
            
            if (deltaY > 80 && canClose) {
                currentDropdown.style.transform = 'translateY(100vh)';
                currentDropdown.style.opacity = '0';
                currentDropdown.style.borderRadius = '8px 8px 0 0';
                currentDropdown.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(function() {
                    if (dropdownParent) {
                        dropdownParent.classList.remove('open');
                    }
                    setTimeout(function() {
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
                
                setTimeout(function() {
                    currentDropdown.style.transition = '';
                }, 200);
            }
            
            isDragging = false;
            currentDropdown = null;
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
                currentDropdown.style.transform = 'translateY(' + deltaY + 'px)';
                currentDropdown.style.opacity = Math.max(0.3, 1 - progress);
                
                const borderRadius = Math.max(8, 16 - (progress * 8));
                currentDropdown.style.borderRadius = borderRadius + 'px ' + borderRadius + 'px 0 0';
            }
        }

        function handleMouseUp() {
            if (!isDragging || !currentDropdown) return;
            
            const deltaY = currentY - startY;
            const dropdownParent = currentDropdown.parentElement;
            
            if (deltaY > 80 && canClose) {
                currentDropdown.style.transform = 'translateY(100vh)';
                currentDropdown.style.opacity = '0';
                currentDropdown.style.borderRadius = '8px 8px 0 0';
                currentDropdown.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(function() {
                    if (dropdownParent) {
                        dropdownParent.classList.remove('open');
                    }
                    setTimeout(function() {
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
                
                setTimeout(function() {
                    currentDropdown.style.transition = '';
                }, 200);
            }
            
            isDragging = false;
            currentDropdown = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        // ===== NAVIGATION SWIPE GESTURES =====
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
            if (evt.target.closest('.Dropdown-toggle') || 
                evt.target.closest('.navigation') || 
                evt.target.closest('.modal') || 
                evt.target.closest('.Dropdown-menu') || 
                evt.target.closest('button') || 
                evt.target.closest('textarea') || 
                evt.target.closest('input')) {
                return;
            }

            const firstTouch = evt.touches[0];
            xStart = firstTouch.clientX;
            yStart = firstTouch.clientY;
            isSwiping = true;
            hasReachedThreshold = false;
        }

        function handleNavTouchMove(evt) {
            if (!xStart || !isSwiping) return;

            let xEnd = evt.touches[0].clientX;
            let yEnd = evt.touches[0].clientY;

            xDiff = xEnd - xStart;
            yDiff = yEnd - yStart;

            if (Math.abs(xDiff) < Math.abs(yDiff)) return;
            if (Math.abs(xDiff) < swipeIgnoreThreshold) return;

            if (xDiff > 0) {
                document.querySelectorAll('.App-content').forEach(function(content) {
                    content.style.transform = 'translateX(' + xDiff + 'px)';
                    content.style.opacity = 1 - Math.abs(xDiff) / (2 * swipeRightThreshold);

                    if (xDiff > swipeRightThreshold) {
                        content.classList.add('permanently-swiped');
                        hasReachedThreshold = true;
                    }
                });
            } else if (xDiff < 0 && window.location.pathname === '/') {
                document.querySelectorAll('.App-content').forEach(function(content) {
                    content.style.transform = 'translateX(' + xDiff + 'px) rotateY(' + (xDiff/10) + 'deg)';
                    content.style.opacity = 1 - Math.abs(xDiff) / 500;

                    if (Math.abs(xDiff) > Math.abs(swipeLeftThreshold)) {
                        content.classList.add('permanently-swiped');
                        hasReachedThreshold = true;
                    }
                });
            }
        }

        function handleNavTouchEnd(evt) {
            if (isSwiping && hasReachedThreshold) {
                if (xDiff > 0) {
                    const button = document.querySelector('.Button-label');
                    if (button) {
                        button.click();
                        setTimeout(removeSwipeClasses, 300);
                    }
                } else if (xDiff < 0 && window.location.pathname === '/') {
                    document.querySelectorAll('.App-content').forEach(function(content) {
                        content.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-out';
                        content.style.transform = 'translateX(-100%) rotateY(-15deg)';
                        content.style.opacity = '0';
                    });

                    // Navigate using Flarum's router
                    if (typeof app !== 'undefined' && app.history) {
                        app.history.push('/all');
                    } else {
                        window.location.href = '/all';
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
                            document.querySelectorAll('.App-content').forEach(function(content) {
                                content.style.transition = '';
                                content.style.transform = '';
                                content.style.opacity = '';
                            });
                        }, 500);
                    }, 400);
                }
            } else if (isSwiping) {
                document.querySelectorAll('.App-content').forEach(function(content) {
                    content.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                    content.style.transform = '';
                    content.style.opacity = '';
                });
            }

            isSwiping = false;
            xStart = null;
            yStart = null;
        }

        function removeSwipeClasses() {
            document.querySelectorAll('.App-content').forEach(function(content) {
                content.classList.remove('swiped');
                content.classList.remove('permanently-swiped');
                content.style.transform = '';
                content.style.opacity = '';
            });
        }

        // Initialize
        setupSwipeToClose();
        
        document.addEventListener('touchstart', handleNavTouchStart, false);
        document.addEventListener('touchmove', handleNavTouchMove, false);
        document.addEventListener('touchend', handleNavTouchEnd, false);
        
        window.addEventListener('resize', function() {
            setTimeout(function() {
                setupSwipeToClose();
            }, 100);
        });

        // Mutation observer for dynamic content
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    shouldUpdate = true;
                }
                
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('Dropdown-menu') && target.classList.contains('open')) {
                        target.style.transform = '';
                        target.style.opacity = '';
                        target.style.transition = '';
                        target.style.borderRadius = '16px 16px 0 0';
                        
                        if (!target.querySelector('.swipe-indicator')) {
                            const indicator = document.createElement('div');
                            indicator.className = 'swipe-indicator';
                            target.insertBefore(indicator, target.firstChild);
                        }
                    }
                }
            });
            
            if (shouldUpdate) {
                setTimeout(function() {
                    setupSwipeToClose();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        console.log('[Swipe Extension] Initialized successfully');
    }
})();
