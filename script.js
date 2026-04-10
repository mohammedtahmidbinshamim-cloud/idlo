document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Smooth Scrolling & Header Interaction
    // ---------------------------------------------------------
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Background change logic
                if (currentScrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/Show on scroll logic
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling DOWN -> Hide
                    header.classList.add('header-hidden');
                    // Also close mobile menu if open
                    header.classList.remove('nav-active');
                } else {
                    // Scrolling UP -> Show
                    header.classList.remove('header-hidden');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            header.classList.toggle('nav-active');
        });
    }

    // ---------------------------------------------------------
    // 2. Scroll Animations (Intersection Observer)
    // ---------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes to elements
    const scrollElements = document.querySelectorAll('.product-card, .trust-card, .section-header, .brand-statement');
    scrollElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.1}s`; // Staggered delay
        animateOnScroll.observe(el);
    });

    // ---------------------------------------------------------
    // 3. Category Filtering (Visual Only)
    // ---------------------------------------------------------
    const categoryBtns = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filter = btn.innerText.toLowerCase();

            products.forEach(product => {
                const category = product.querySelector('.category').innerText.toLowerCase();
                if (filter === 'all' || category.includes(filter)) {
                    product.style.display = 'block';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ---------------------------------------------------------
    // 4. Product Detail Expand (Modal/Overlay)
    // ---------------------------------------------------------
    // Create Modal Element
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <button class="prev-image">&#10094;</button>
                    <button class="next-image">&#10095;</button>
                </div>
                <div class="modal-details">
                    <h2 class="modal-title"></h2>
                    <p class="modal-desc"></p>
                    <div class="modal-badges">
                        <span>Organic</span>
                        <span>Non-GMO</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Modal CSS (dynamically added for simplicity)
    const style = document.createElement('style');
    style.innerHTML = `
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(16px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        }
        .product-modal.active {
            opacity: 1;
            pointer-events: all;
        }
        .modal-content {
            background: var(--color-white);
            width: 90%;
            max-width: 1000px;
            height: 80vh;
            position: relative;
            box-shadow: var(--shadow-lg);
            border-radius: 24px;
            transform: translateY(20px);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 1px solid var(--color-border);
            overflow: hidden;
            display: flex; /* Ensure body fills it */
            flex-direction: column;
        }
        .product-modal.active .modal-content {
            transform: translateY(0);
        }
        .modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: 100%;
            overflow: hidden;
            width: 100%;
        }
        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.05);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 20;
            color: var(--color-text);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .close-modal:hover {
            background: var(--color-text);
            color: var(--color-white);
            transform: rotate(90deg);
        }
        .modal-image {
            background: #F5F5F4;
            height: 100%;
            width: 100%;
            background-size: cover;
            background-position: center;
            position: relative;
        }
        .next-image, .prev-image {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.8);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 10;
            font-size: 1.2rem;
            color: var(--color-text);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .next-image { right: 20px; }
        .prev-image { left: 20px; }

        .next-image:hover, .prev-image:hover {
            background: var(--color-text);
            color: white;
            transform: translateY(-50%) scale(1.1);
        }
        .modal-details {
            padding: 60px 40px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow-y: auto;
            height: 100%;
        }
        .modal-title {
            font-family: var(--font-display);
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: var(--color-text);
        }
        .modal-desc {
            font-family: var(--font-body);
            font-size: 1rem;
            color: var(--color-text-light);
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .modal-specs {
            list-style: none;
            margin-bottom: 30px;
            border-top: 1px solid var(--color-border);
            border-bottom: 1px solid var(--color-border);
            padding: 20px 0;
            color: var(--color-text);
        }
        .modal-specs li {
            margin-bottom: 10px;
            font-size: 0.9rem;
            display: flex;
            justify-content: space-between;
        }
        .modal-badges span {
            display: inline-block;
            padding: 6px 16px;
            border: 1px solid var(--color-accent);
            color: var(--color-accent);
            background: var(--color-accent-light);
            border-radius: 20px;
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.05em;
            margin-right: 10px;
        }
        @media (max-width: 768px) {
            .modal-content {
                height: auto;
                max-height: 90vh;
                width: 95%;
                border-radius: 24px;
                display: block; /* Stack */
            }
            .modal-body {
                display: block;
                height: auto;
                overflow-y: auto;
                max-height: 90vh; /* Scroll body on mobile */
            }
            .modal-image {
                height: 300px;
                width: 100%;
            }
            .modal-details {
                height: auto;
                overflow: visible;
                padding: 30px;
            }
        }
    `;
    document.head.appendChild(style);

    // Modal Interaction
    const modalEl = document.querySelector('.product-modal');
    const closeBtn = document.querySelector('.close-modal');
    const nextBtn = document.querySelector('.next-image');
    const prevBtn = document.querySelector('.prev-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalDesc = document.querySelector('.modal-desc');
    const modalImg = document.querySelector('.modal-image');

    let currentFrontImg = '';
    let currentBackImg = '';
    let isShowingFront = true;

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    products.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            const dx = Math.abs(e.touches[0].clientX - touchStartX);
            const dy = Math.abs(e.touches[0].clientY - touchStartY);
            if (dx > 10 || dy > 10) {
                isSwiping = true;
            }
        }, { passive: true });

        card.addEventListener('click', (e) => {
            if (isSwiping) {
                e.preventDefault();
                isSwiping = false;
                return;
            }

            const title = card.querySelector('h3').innerText;
            const desc = card.querySelector('.product-overlay p').innerText;
            const container = card.querySelector('.product-image-container');
            const imgDiv = card.querySelector('.product-image');

            const bg = container.style.backgroundColor;

            // Clean up the URL string to get just the path
            currentFrontImg = imgDiv.style.backgroundImage;
            const backImgRaw = card.getAttribute('data-back-image');
            currentBackImg = backImgRaw ? `url('${backImgRaw}')` : currentFrontImg; // Fallback to front if missing

            const customDesc = card.getAttribute('data-full-desc');

            modalTitle.innerText = title;
            if (customDesc) {
                modalDesc.innerHTML = customDesc;
            } else {
                modalDesc.innerText = `${desc} Experience the finest quality sourced directly from sustainable farms. Our ${title} represents the pinnacle of culinary excellence.`;
            }

            // Apply styles to modal image
            modalImg.style.backgroundColor = bg;
            modalImg.style.backgroundImage = currentFrontImg; // Start with front
            isShowingFront = true;

            modalImg.style.backgroundSize = 'contain';
            modalImg.style.backgroundRepeat = 'no-repeat';
            modalImg.style.backgroundPosition = 'center';

            if (currentBackImg === currentFrontImg) {
                nextBtn.style.display = 'none';
                prevBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'flex';
                prevBtn.style.display = 'flex';
            }

            modalEl.classList.add('active');
        });
    });

    const toggleImage = () => {
        if (isShowingFront) {
            modalImg.style.backgroundImage = currentBackImg;
            isShowingFront = false;
        } else {
            modalImg.style.backgroundImage = currentFrontImg;
            isShowingFront = true;
        }
    };

    nextBtn.addEventListener('click', toggleImage);
    prevBtn.addEventListener('click', toggleImage);

    closeBtn.addEventListener('click', () => {
        modalEl.classList.remove('active');
    });

    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
            modalEl.classList.remove('active');
        }
    });
    // ---------------------------------------------------------
    // 5. Carousel Controls
    // ---------------------------------------------------------
    const navPrevCarousel = document.querySelector('.carousel-nav-btn.prev');
    const navNextCarousel = document.querySelector('.carousel-nav-btn.next');
    const productCarouselTrack = document.querySelector('.product-grid.data-carousel');

    if (navPrevCarousel && navNextCarousel && productCarouselTrack) {
        navNextCarousel.addEventListener('click', () => {
            const cardWidth = productCarouselTrack.querySelector('.product-card').offsetWidth;
            const gap = parseFloat(getComputedStyle(productCarouselTrack).gap) || 0;
            productCarouselTrack.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        });

        navPrevCarousel.addEventListener('click', () => {
            const cardWidth = productCarouselTrack.querySelector('.product-card').offsetWidth;
            const gap = parseFloat(getComputedStyle(productCarouselTrack).gap) || 0;
            productCarouselTrack.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        });

        // ---------------------------------------------------------
        // 6. Faded Peeking Cards (Intersection Observer)
        // ---------------------------------------------------------
        const carouselCards = productCarouselTrack.querySelectorAll('.product-card');

        // Only run focus observer on desktop - causes vibration on mobile
        if (window.innerWidth > 768) {
            const focusObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('focused');
                    } else {
                        entry.target.classList.remove('focused');
                    }
                });
            }, {
                root: productCarouselTrack,
                rootMargin: '0px -30% 0px -30%',
                threshold: 0.4
            });

            carouselCards.forEach(card => focusObserver.observe(card));
        } else {
            // On mobile, all cards are fully visible
            carouselCards.forEach(card => card.classList.add('focused'));
        }
    }

    // ---------------------------------------------------------
    // 7. Feedback Form Intercept (Open Gmail Compose)
    // ---------------------------------------------------------
    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard mailto behavior
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const feedback = document.getElementById('feedback').value;
            
            const subject = encodeURIComponent(`Idlo Fresh Feedback from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nFeedback:\n${feedback}`);
            
            // Gmail Compose URL format
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=idlofresh@gmail.com&su=${subject}&body=${body}`;
            
            // Open Gmail specifically in a new tab
            window.open(gmailLink, '_blank');
            
            // Optionally clear the form after sending
            feedbackForm.reset();
        });
    }

    // ---------------------------------------------------------
    // 8. Carousel Scroll Dots (Mobile)
    // ---------------------------------------------------------
    const dotsContainer = document.querySelector('.carousel-dots');

    function buildDots() {
        if (!dotsContainer || !productCarouselTrack) return;

        // Clear existing dots
        dotsContainer.innerHTML = '';

        // Only count visible cards
        const visibleCards = [...productCarouselTrack.querySelectorAll('.product-card')].filter(
            card => card.style.display !== 'none'
        );

        if (visibleCards.length === 0) return;

        visibleCards.forEach((card, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
            dotsContainer.appendChild(dot);
        });

        // Scroll tracking
        const onScroll = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            const currentVisible = [...productCarouselTrack.querySelectorAll('.product-card')].filter(
                c => c.style.display !== 'none'
            );
            if (currentVisible.length === 0) return;

            const scrollLeft = productCarouselTrack.scrollLeft;
            const cardWidth = currentVisible[0].offsetWidth;
            const gap = parseFloat(getComputedStyle(productCarouselTrack).gap) || 0;
            const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        };

        productCarouselTrack.removeEventListener('scroll', productCarouselTrack._dotScrollHandler);
        productCarouselTrack._dotScrollHandler = onScroll;
        productCarouselTrack.addEventListener('scroll', onScroll);
    }

    // Build dots initially
    buildDots();

    // Rebuild dots when category changes
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Wait for filter animation to finish
            setTimeout(() => {
                // Reset scroll position
                if (productCarouselTrack) {
                    productCarouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
                }
                buildDots();
            }, 350);
        });
    });
});
