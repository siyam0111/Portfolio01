document.addEventListener('DOMContentLoaded', () => {
    // ==================== AOS INITIALIZATION ====================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // ==================== NAVIGATION & SCROLLING ====================
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileHeader = document.getElementById('mobileHeader');
    
    // Get all navigation links for smoother scrolling
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    function scrollToSection(targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            const headerOffset = window.innerWidth <= 1024 ? 80 : 0;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        // Close mobile sidebar if open
        if (sidebar && window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    }

    // Nav item click handler
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.tab;
            if (sectionId) {
                scrollToSection(sectionId);
            }
        });
    });

    // Smooth scroll for all anchor links
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });

    // ==================== SCROLL SPY ====================
    function scrollSpy() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150;
        
        // Check if at bottom of page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        // Update active nav item
        if (currentSectionId) {
            navItems.forEach(item => {
                const tabId = item.dataset.tab;
                if (tabId === currentSectionId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    // Throttled scroll spy for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            scrollSpy();
        });
    });
    
    // Initial scroll spy
    scrollSpy();

    // ==================== SECTION FADE ANIMATION ====================
    const fadeObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    sections.forEach(section => {
        if ('IntersectionObserver' in window) {
            fadeObserver.observe(section);
        } else {
            // Fallback for older browsers
            section.classList.add('visible');
        }
    });

    // ==================== MOBILE MENU ====================
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            
            // Update button icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (sidebar.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }

    // Close sidebar on window resize (if becomes desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && sidebar) {
            sidebar.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });

    // Click outside mobile menu to close
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar && 
            sidebar.classList.contains('active') && 
            mobileMenuBtn && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });

    // ==================== BANNER ====================
    const banner = document.getElementById('justiceBanner');
    const closeBannerBtn = document.getElementById('closeBannerBtn');
    
    // Check if banner was previously closed (session storage)
    const bannerClosed = sessionStorage.getItem('bannerClosed');
    if (bannerClosed === 'true' && banner) {
        banner.style.display = 'none';
    }

    if (closeBannerBtn && banner) {
        closeBannerBtn.addEventListener('click', () => {
            banner.style.display = 'none';
            sessionStorage.setItem('bannerClosed', 'true');
        });
    }

    // ==================== QUICK LINKS ====================
    const quickLinks = document.querySelectorAll('[data-goto]');
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.goto;
            if (targetTab) {
                scrollToSection(targetTab);
            }
        });
    });

    // ==================== TYPING EFFECT ====================
    const typedTextSpan = document.querySelector(".typed-text");
    const phrases = [
        "Web Developer",
        "Problem Solver",
        "ICT Engineer",
        "Tech Enthusiast",
        "Continuous Learner"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newPhraseDelay = 2000;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typedTextSpan) return;
        
        const currentPhrase = phrases[phraseIndex];
        
        if (!isDeleting) {
            // Typing
            if (charIndex < currentPhrase.length) {
                typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeEffect, typingSpeed);
            } else {
                // Pause before deleting
                setTimeout(() => {
                    isDeleting = true;
                    setTimeout(typeEffect, erasingSpeed);
                }, newPhraseDelay);
            }
        } else {
            // Deleting
            if (charIndex > 0) {
                typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeEffect, erasingSpeed);
            } else {
                // Move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, typingSpeed + 500);
            }
        }
    }

    if (typedTextSpan && phrases.length > 0) {
        // Start typing after a delay
        setTimeout(typeEffect, 1000);
    }

    // ==================== COPY TO CLIPBOARD ====================
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    let toastTimeout;

    function showToast(message, isSuccess = true) {
        if (toast && toastText) {
            toastText.textContent = message;
            toast.className = 'custom-toast';
            if (isSuccess) {
                toast.classList.add('active');
            } else {
                toast.classList.add('active', 'error');
            }
            
            // Clear existing timeout
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
            
            toastTimeout = setTimeout(() => {
                toast.classList.remove('active', 'error');
            }, 3000);
        }
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.dataset.copy;
            if (!textToCopy) return;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast(`✓ Copied: ${textToCopy}`);
                
                // Visual feedback on button
                const icon = btn.querySelector('i');
                if (icon) {
                    const originalClass = icon.className;
                    icon.className = 'fas fa-check-circle';
                    icon.style.color = '#00d26a';
                    
                    setTimeout(() => {
                        icon.className = originalClass;
                        icon.style.color = '';
                    }, 2000);
                }
            } catch (err) {
                // Fallback method
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast(`✓ Copied: ${textToCopy}`);
                } catch (fallbackErr) {
                    showToast('Failed to copy text', false);
                }
                document.body.removeChild(textArea);
            }
        });
    });

    // ==================== GALLERY LIGHTBOX ====================
    const galleryCards = document.querySelectorAll('.gallery-card:not(.gallery-card-svg)');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    const galleryItems = [];

    // Build gallery items array from images
    galleryCards.forEach((card, index) => {
        const title = card.dataset.title || 'Untitled';
        const img = card.querySelector('img');
        if (img) {
            galleryItems.push({
                title: title,
                src: img.src,
                alt: img.alt || title
            });
            
            card.addEventListener('click', () => {
                currentImageIndex = index;
                openLightbox(index);
            });
        }
    });

    function openLightbox(index) {
        if (!lightbox || !lightboxImg || galleryItems.length === 0) return;
        
        const item = galleryItems[index];
        if (!item) return;
        
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update navigation buttons
        updateLightboxNav();
    }

    function updateLightboxNav() {
        if (lightboxPrev) {
            lightboxPrev.style.display = galleryItems.length > 1 ? 'flex' : 'none';
        }
        if (lightboxNext) {
            lightboxNext.style.display = galleryItems.length > 1 ? 'flex' : 'none';
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function navigateLightbox(direction) {
        if (galleryItems.length === 0) return;
        
        currentImageIndex = (currentImageIndex + direction + galleryItems.length) % galleryItems.length;
        openLightbox(currentImageIndex);
    }

    // Lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }

    // Keyboard controls for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                if (galleryItems.length > 1) navigateLightbox(-1);
                break;
            case 'ArrowRight':
                if (galleryItems.length > 1) navigateLightbox(1);
                break;
        }
    });

    // Swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    navigateLightbox(1);
                } else {
                    navigateLightbox(-1);
                }
            }
        }, { passive: true });
    }

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Basic validation
            if (!nameInput || !emailInput || !messageInput) return;
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            if (!name || !email || !message) {
                showToast('Please fill in all fields.', false);
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address.', false);
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.innerHTML;
            const originalDisabled = submitBtn.disabled;
            
            // Simulate sending
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            setTimeout(() => {
                showToast('✓ Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    // ==================== PERFORMANCE OPTIMIZATIONS ====================
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ==================== CONSOLE WELCOME ====================
    console.log('%c🚀 Siyam Ahmed Portfolio', 'font-size: 20px; font-weight: bold; color: #00d26a;');
    console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'font-size: 14px; color: #9ca3af;');
    
    // ==================== DYNAMIC YEAR IN FOOTER ====================
    const footerYear = document.querySelector('.sidebar-footer p:first-child');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace(/\d{4}/, currentYear);
    }
});