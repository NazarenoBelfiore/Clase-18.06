/* ==========================================================================
   VENZO AMPHION LANDING PAGE - COMPONENT LOGIC & INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. STICKY HEADER EFFECT
       ---------------------------------------------------------------------- */
    const header = document.getElementById('site-header');
    const scrollThreshold = 50;

    const handleHeaderScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Execute on initial load


    /* ----------------------------------------------------------------------
       1.1 MOBILE MENU TOGGLE LOGIC
       ---------------------------------------------------------------------- */
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('header-nav');
    const menuOverlay = document.getElementById('menu-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    const closeMobileMenu = () => {
        if (navMenu) navMenu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        // Only restore scroll if the distributor modal is not open
        const modalElement = document.getElementById('distributor-modal');
        if (modalElement && !modalElement.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    };

    const toggleMobileMenu = () => {
        if (!navMenu) return;
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            navMenu.classList.add('active');
            if (menuToggle) menuToggle.classList.add('active');
            if (menuOverlay) menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    if (menuToggle && navMenu && menuOverlay) {
        menuToggle.addEventListener('click', toggleMobileMenu);
        menuOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }


    /* ----------------------------------------------------------------------
       2. RETAILER LOCATOR MODAL LOGIC
       ---------------------------------------------------------------------- */
    const modal = document.getElementById('distributor-modal');
    const modalContent = document.getElementById('distributor-modal-content');
    const closeBtn = document.getElementById('modal-close-btn');
    const triggerButtons = document.querySelectorAll('.btn-trigger-modal');
    const searchInput = document.getElementById('search-dealer-input');
    const searchBtn = document.getElementById('search-dealer-btn');
    const dealersList = document.getElementById('dealers-list-container');
    const dealerItems = document.querySelectorAll('.dealer-item');
    const mockMapLabel = document.querySelector('.map-label');
    const mapMarker = document.querySelector('.map-marker');

    // Open Modal
    const openModal = () => {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Block background scroll
        // Focus search input
        setTimeout(() => searchInput.focus(), 300);
    };

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scroll
    };

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeMobileMenu();
            openModal();
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Dealer Item Selection
    dealerItems.forEach(item => {
        item.addEventListener('click', () => {
            dealerItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Reposition mock map marker to simulate navigation
            const name = item.querySelector('.dealer-name').textContent;
            mockMapLabel.textContent = `Viendo: ${name}`;
            
            // Randomize position slightly for visual feedback
            const randomTop = Math.floor(Math.random() * 40) + 30;
            const randomLeft = Math.floor(Math.random() * 40) + 30;
            mapMarker.style.top = `${randomTop}%`;
            mapMarker.style.left = `${randomLeft}%`;
        });
    });

    // Simple Search / Filter functionality
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        let firstMatch = null;

        dealerItems.forEach(item => {
            const name = item.querySelector('.dealer-name').textContent.toLowerCase();
            const address = item.querySelector('.dealer-address').textContent.toLowerCase();
            
            if (name.includes(query) || address.includes(query)) {
                item.style.display = 'flex';
                if (!firstMatch) firstMatch = item;
            } else {
                item.style.display = 'none';
            }
        });

        if (firstMatch) {
            firstMatch.click();
        } else {
            mockMapLabel.textContent = 'Sin resultados en tu zona';
        }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });


    /* ----------------------------------------------------------------------
       3. SCROLL-LINKED PARALLAX (MODULE 3)
       ---------------------------------------------------------------------- */
    const parallaxSection = document.getElementById('dominio');
    const parallaxImage = document.getElementById('parallax-wheel-img');

    const handleParallaxScroll = () => {
        // Skip parallax scroll calculations on small devices to conserve CPU
        if (window.innerWidth < 992) {
            if (parallaxImage) parallaxImage.style.transform = 'translateY(0)';
            return;
        }

        const sectionRect = parallaxSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Verify if section is in or near viewport
        if (sectionRect.top < viewportHeight && sectionRect.bottom > 0) {
            // Percent scrolled through the section
            const totalScrollable = viewportHeight + sectionRect.height;
            const currentScroll = viewportHeight - sectionRect.top;
            const scrollPercent = currentScroll / totalScrollable; // 0 to 1

            // Map scroll percentage to image Y translation (e.g. from -5% to 5%)
            const maxTranslation = 8; // percent
            const translateY = (scrollPercent * 2 - 1) * maxTranslation;

            parallaxImage.style.transform = `scale(1.1) translateY(${translateY}%)`;
        }
    };

    window.addEventListener('scroll', handleParallaxScroll);
    // Initial run for alignment
    handleParallaxScroll();


    /* ----------------------------------------------------------------------
       4. INTERACTIVE CAROUSEL (MODULE 4) - PORSCHE-INSPIRED CINEMATIC SLIDER
       ---------------------------------------------------------------------- */
    const sliderWrapper = document.getElementById('components-slider-wrapper');
    const sliderTrack = document.getElementById('slider-track');
    const slides = Array.from(sliderTrack.children);
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots-container');
    const dots = Array.from(dotsContainer.children);
    const textContent = document.getElementById('slider-text-content');
    const titleEl = document.getElementById('slider-component-title');
    const descEl = document.getElementById('slider-component-desc');

    const componentData = [
        {
            title: "CUADRO ALUMINIO 6061",
            desc: "Ligereza estructural y rigidez torsional para máxima respuesta."
        },
        {
            title: "TRANSMISIÓN SHIMANO",
            desc: "Cadencia exacta y paso de marchas fluido en terrenos de alta exigencia."
        },
        {
            title: "FRENOS HIDRÁULICOS",
            desc: "Control absoluto y potencia de frenado inmediato ante cualquier condición climática."
        }
    ];

    let currentIndex = 0;

    const updateSlider = (index) => {
        // Loop boundary index check
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // 1. Calculate active translation to center the current index slide
        const wrapperWidth = sliderWrapper.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const gap = 40; // matches css gap

        // Offset formula to center active slide: center of wrapper - center of slide - index * step
        const translateX = (wrapperWidth - slideWidth) / 2 - currentIndex * (slideWidth + gap);
        sliderTrack.style.transform = `translateX(${translateX}px)`;

        // 2. Update slides classes
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // 3. Update dots classes
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // 4. Opacity animation for text content changes (Porsche look and feel)
        textContent.classList.add('fade-out');
        setTimeout(() => {
            titleEl.textContent = componentData[currentIndex].title;
            descEl.textContent = componentData[currentIndex].desc;
            textContent.classList.remove('fade-out');
        }, 400);
    };

    // Controls Event Listeners
    prevBtn.addEventListener('click', () => {
        updateSlider(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        updateSlider(currentIndex + 1);
    });

    // Dot Navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
        });
    });

    // Recalculate on screen resize to keep the active slide centered
    window.addEventListener('resize', () => {
        updateSlider(currentIndex);
    });

    // Touch Swipe Integration for Mobile Devices
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    const handleSwipeGesture = () => {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                updateSlider(currentIndex - 1);
            } else {
                updateSlider(currentIndex + 1);
            }
        }
    };

    // Keyboard navigation when slider track is in viewport
    document.addEventListener('keydown', (e) => {
        const sliderRect = sliderTrack.getBoundingClientRect();
        const isInViewport = (
            sliderRect.top >= 0 &&
            sliderRect.bottom <= window.innerHeight
        );

        if (isInViewport) {
            if (e.key === 'ArrowLeft') {
                updateSlider(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateSlider(currentIndex + 1);
            }
        }
    });

    // Initial centering setup
    updateSlider(0);


    /* ----------------------------------------------------------------------
       5. SCROLL ENTRANCE REVEAL ANIMATIONS (IntersectionObserver)
       ---------------------------------------------------------------------- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing once revealed to retain visual state
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(revealCallback, observerOptions);

    // Target elements to animate on scroll entrance
    const animatedElements = [
        ...document.querySelectorAll('.manifesto-col'),
        ...document.querySelectorAll('.spec-item'),
        document.querySelector('.sticky-inner'),
        document.querySelector('.carousel-container'),
        document.querySelector('.conversion-container')
    ];

    animatedElements.forEach(el => {
        if (el) {
            el.classList.add('scroll-reveal-init');
            scrollObserver.observe(el);
        }
    });

});

/* CSS Styles injected dynamically for entrance animations */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .scroll-reveal-init {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 1.2s cubic-bezier(0.3, 0.8, 0.4, 1), transform 1.2s cubic-bezier(0.3, 0.8, 0.4, 1);
    }
    .scroll-reveal-init.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    .manifesto-col.scroll-reveal-init {
        transform: translateY(40px);
    }
    .manifesto-col.scroll-reveal-init.revealed {
        transform: translateY(0);
    }
`;
document.head.appendChild(styleSheet);
