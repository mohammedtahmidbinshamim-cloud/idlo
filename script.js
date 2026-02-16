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

    products.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').innerText;
            const desc = card.querySelector('.product-overlay p').innerText;
            const container = card.querySelector('.product-image-container');
            const imgDiv = card.querySelector('.product-image');

            const bg = container.style.backgroundColor;

            // Clean up the URL string to get just the path
            currentFrontImg = imgDiv.style.backgroundImage;
            const backImgRaw = card.getAttribute('data-back-image');
            currentBackImg = backImgRaw ? `url('${backImgRaw}')` : currentFrontImg; // Fallback to front if missing

            modalTitle.innerText = title;
            modalDesc.innerText = `${desc} Experience the finest quality sourced directly from sustainable farms. Our ${title} represents the pinnacle of culinary excellence.`;

            // Apply styles to modal image
            modalImg.style.backgroundColor = bg;
            modalImg.style.backgroundImage = currentFrontImg; // Start with front
            isShowingFront = true;

            modalImg.style.backgroundSize = 'contain';
            modalImg.style.backgroundRepeat = 'no-repeat';
            modalImg.style.backgroundPosition = 'center';

            // Hide next/prev buttons if no back image is effectively different
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
});

/* ---------------------------------------------------------
   5. Hero Background Shader (Three.js Silk Effect)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    // Resize handler
    function resize() {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        if (material) {
            material.uniforms.uResolution.value.set(width, height);
        }
    }

    container.appendChild(renderer.domElement);

    // SHADERS
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3  uColor;
        uniform float uSpeed;
        uniform float uScale;
        uniform float uRotation;
        uniform float uNoiseIntensity;
        uniform vec2  uResolution;

        const float e = 2.71828182845904523536;

        float noise(vec2 texCoord) {
            float G = e;
            vec2  r = (G * sin(G * texCoord));
            return fract(r.x * r.y * (1.0 + texCoord.x));
        }

        vec2 rotateUvs(vec2 uv, float angle) {
            float c = cos(angle);
            float s = sin(angle);
            mat2  rot = mat2(c, -s, s, c);
            return rot * uv;
        }

        void main() {
            vec2 uv = vUv;
            // Fix aspect ratio
            float aspect = uResolution.x / uResolution.y;
            uv.x *= aspect;

            float rnd        = noise(gl_FragCoord.xy);
            vec2  rotatedUv  = rotateUvs(uv * uScale, uRotation);
            vec2  tex        = rotatedUv;
            float tOffset    = uSpeed * uTime;

            tex.y += 0.05 * sin(4.0 * tex.x - tOffset);

            float pattern = 0.5 +
                            0.5 * sin(5.0 * (tex.x + tex.y +
                                            cos(3.0 * tex.x + 5.0 * tex.y) +
                                            0.02 * tOffset) +
                                    sin(15.0 * (tex.x + tex.y - 0.1 * tOffset)));

            vec3 color = uColor * pattern;
            
            // Mix with white to keep it subtle/background-y
            color = mix(vec3(1.0), color, 0.1); // Lighter, more elegant tint
            
            /* Add some noise */
            color -= rnd / 50.0 * uNoiseIntensity; // Less noise

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    // Hex to RGB Helper
    function hexToRGB(hex) {
        hex = hex.replace('#', '');
        return new THREE.Vector3(
            parseInt(hex.slice(0, 2), 16) / 255,
            parseInt(hex.slice(2, 4), 16) / 255,
            parseInt(hex.slice(4, 6), 16) / 255
        );
    }

    // UNIFORMS & MATERIAL
    // Brand Green: Deep Forest (Secondary)
    const brandColor = hexToRGB('1F5E4A');

    const uniforms = {
        uTime: { value: 0 },
        uColor: { value: brandColor },
        uSpeed: { value: 0.15 }, // Slightly slower
        uScale: { value: 1.0 },
        uRotation: { value: 0 },
        uNoiseIntensity: { value: 0.05 }, // Smoother silk
        uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    }

    animate();

    // HANDLE RESIZE
    window.addEventListener('resize', () => {
        resize();
    });


    // Trigger initial resize
    resize();
});
