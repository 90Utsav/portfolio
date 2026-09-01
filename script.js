/**
 * Portfolio Website Logic
 * Includes custom cursor, typewriter typing effect, theme toggler,
 * dynamic project filters, scroll animations, and interactive forms.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initThemeToggler();
    initMobileMenu();
    initActiveNavOnScroll();
    initProjectFilter();
    initSkillAnimation();
    initContactForm();
    initAccentPicker();
    initAvatarEasterEgg();
    initInteractiveCanvas();
    initMathAvatarCanvas();
    initPhotoGallery();
});

/* ===========================================================================
   PERSONAL PHOTO GALLERY
   =========================================================================== */
function initPhotoGallery() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeButton = document.getElementById('lightbox-close');

    if (!galleryCards.length || !lightbox || !lightboxImage || !lightboxTitle || !closeButton) return;

    const markGalleryImageLoaded = (image) => {
        const media = image.parentElement;
        if (!media) return;

        if (image.complete && image.naturalWidth > 0) {
            media.classList.add('has-image');
        }

        image.addEventListener('load', () => media.classList.add('has-image'));
        image.addEventListener('error', () => media.classList.remove('has-image'));
    };

    document.querySelectorAll('.gallery-media img').forEach(markGalleryImageLoaded);

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImage.src = '';
        document.body.style.overflow = '';
    }

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const galleryGroup = card.closest('.gallery-group');
            const isCoverPhoto = galleryGroup && card === galleryGroup.querySelector('.gallery-card');

            if (isCoverPhoto && !galleryGroup.classList.contains('is-open')) {
                const category = card.dataset.galleryCategory;
                if (category) window.location.href = `gallery.html?category=${category}`;
                return;
            }

            const imagePath = card.dataset.galleryImage;
            const title = card.dataset.galleryTitle;

            if (!imagePath || !card.querySelector('.gallery-media.has-image')) return;

            lightboxImage.src = imagePath;
            lightboxImage.alt = title;
            lightboxTitle.textContent = title;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            closeButton.focus();
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
}

/* ==========================================================================
   HERO TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const typingTextEl = document.getElementById('typing-text');
    if (!typingTextEl) return;
    
    const words = ["Computer Science Student", "Full Stack Developer", "AI Tech Founder", "Robotics Enthusiast"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster when deleting
        } else {
            // Add character
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // standard typing speed
        }
        
        // Handling word completion states
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at completion
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // brief pause before next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing loop
    setTimeout(type, 800);
}

/* ==========================================================================
   THEME TOGGLER (DARK / LIGHT)
   ========================================================================== */
function initThemeToggler() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    
    // Retrieve theme preference from localStorage or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const currentTheme = savedTheme || systemTheme;
    
    // Set theme initial state
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================================================
   MOBILE INTERACTIVE MENU
   ========================================================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuBtn || !mainNav) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Close nav menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });
}

/* ==========================================================================
   ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
   ========================================================================== */
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35 // 35% of the section is visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);
    
    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   PROJECT GALLERY FILTER
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from current button
            filterButtons.forEach(b => b.classList.remove('active'));
            // Set active state on clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show item
                    card.style.display = 'block';
                    // Animation delay simulation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350); // Match transition speed
                }
            });
        });
    });
}

/* ==========================================================================
   SKILLS BAR SCROLL ANIMATION
   ========================================================================== */
function initSkillAnimation() {
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    if (!skillsSection || !skillBars.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each bar to its target value defined by inline styles
                skillBars.forEach(bar => {
                    const widthVal = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = widthVal;
                        bar.style.transition = 'width 1.5s cubic-bezier(0.1, 0.8, 0.25, 1)';
                    }, 100);
                });
                // Unobserve once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    observer.observe(skillsSection);
}

/* ==========================================================================
   CONTACT FORM HANDLER (WITH SIMULATED API CALL)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');
    
    if (!form || !feedback || !submitBtn) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Verify values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !subject || !message) {
            showFeedback('Please fill out all fields.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        feedback.style.display = 'none';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
            showFeedback('Message sent successfully! Thank you.', 'success');
            form.reset();
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
            showFeedback('Unable to send your message right now. Please email me directly.', 'error');
        }
    });
    
    function showFeedback(text, type) {
        feedback.textContent = text;
        feedback.className = `form-feedback ${type}`;
        feedback.style.display = 'block';
    }
}

/* ==========================================================================
   DYNAMIC COLOR ACCENT PICKER
   ========================================================================== */
function initAccentPicker() {
    const dots = document.querySelectorAll('.color-dot');
    
    // Retrieve color selection from localStorage
    const savedAccent = localStorage.getItem('accent-color');
    const savedAccentGlow = localStorage.getItem('accent-glow');
    
    if (savedAccent && savedAccentGlow) {
        document.documentElement.style.setProperty('--accent', savedAccent);
        document.documentElement.style.setProperty('--accent-glow', savedAccentGlow);
        
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-accent') === savedAccent) {
                dot.classList.add('active');
            }
        });
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const accent = dot.getAttribute('data-accent');
            const glow = dot.getAttribute('data-accent-glow');
            
            // Set styles dynamically
            document.documentElement.style.setProperty('--accent', accent);
            document.documentElement.style.setProperty('--accent-glow', glow);
            
            // Save state
            localStorage.setItem('accent-color', accent);
            localStorage.setItem('accent-glow', glow);
            
        });
    });
}

/* ==========================================================================
   AVATAR EASTER EGG (SPEECH BUBBLE & ROTATE)
   ========================================================================== */
function initAvatarEasterEgg() {
    const avatarWrapper = document.getElementById('avatar-wrapper');
    const bubble = document.getElementById('avatar-bubble');
    
    if (!avatarWrapper || !bubble) return;
    
    const quotes = [
        "Hey there! Thanks for stopping by! 👋",
        "SATitide.xyz has helped over 50,000 students prep! 🎓",
        "Tinkering with code & robotics is my favorite escape. 🤖",
        "That 1590 SAT score took tons of coffee & practice! ☕",
        "Currently studying CS at Howard University in DC! 🏫",
        "Swachha Budhanilkantha cleanup co-founder here! 🧹",
        "Click me again! I have plenty of stories. 😄",
        "Let's collaborate and build something fun! 🚀"
    ];
    
    let clickTimeout;
    
    avatarWrapper.addEventListener('click', () => {
        // Prevent overlapping animations
        avatarWrapper.classList.remove('clicked');
        void avatarWrapper.offsetWidth; // Trigger reflow
        avatarWrapper.classList.add('clicked');
        
        // Show bubble
        bubble.classList.remove('active');
        void bubble.offsetWidth; // Trigger reflow
        bubble.classList.add('active');
        
        // Pick random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        bubble.textContent = randomQuote;
        
        // Clear previous timeout and set new one to hide bubble
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
            bubble.classList.remove('active');
        }, 3800);
    });
}

/* ==========================================================================
   REACTIVE CANVAS BACKGROUNDS (HERO CANVAS)
   ========================================================================== */
function initInteractiveCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 130 };
    
    // Resize handler
    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });
    
    // Track cursor
    window.addEventListener('mousemove', (e) => {
        // Adjust coordinate offset based on canvas parent positioning
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = Math.random() * 30 + 1;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
        }
        
        draw() {
            // Draw glowing stars/nodes
            const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c4dff';
            ctx.fillStyle = activeColor;
            ctx.shadowBlur = 4;
            ctx.shadowColor = activeColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow
        }
        
        update() {
            // Constant drifting motion
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounds check
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
            
            // Mouse interactions (push / attract)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Move slightly away from cursor
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const directionX = forceDirectionX * force * this.density * 0.5;
                    const directionY = forceDirectionY * force * this.density * 0.5;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }
    }
    
    // Initialize Particles
    function init() {
        particles = [];
        const quantity = Math.floor((width * height) / 18000);
        for (let i = 0; i < Math.min(quantity, 85); i++) {
            particles.push(new Particle());
        }
    }
    init();
    
    // Draw lines connecting nearby particles
    function drawLines() {
        const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c4dff';
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 110) {
                    // Alpha transitions based on distance
                    const alpha = (1 - distance / 110) * 0.12;
                    ctx.strokeStyle = activeColor;
                    ctx.globalAlpha = alpha;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;
                }
            }
        }
    }
    
    // Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();
    
    // Re-initialize particle counts on window resizing
    window.addEventListener('resize', init);
}

/* ==========================================================================
   MATHEMATICAL SYMBOLS RIPPLE AVATAR CANVAS
   ========================================================================== */
function initMathAvatarCanvas() {
    const canvas = document.getElementById('avatar-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const displayWidth = canvas.clientWidth || 360;
    const displayHeight = canvas.clientHeight || 430;
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(displayWidth * devicePixelRatio);
    canvas.height = Math.floor(displayHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // ASCII/Math matrix resolution
    const cols = 96;
    const rows = 127;
    
    const mathSymbols = [" ", "·", "≈", "√", "θ", "π", "λ", "Σ", "∫", "∞", "█"];
    
    // Ripple physical buffers
    let currentWave = Array(cols + 2).fill(0).map(() => Array(rows + 2).fill(0));
    let previousWave = Array(cols + 2).fill(0).map(() => Array(rows + 2).fill(0));
    const damping = 0.86;
    let hoverPoint = null;
    
    // Image loading & brightness mapping
    const img = new Image();
    let brightness = [];
    let alpha = [];
    let isLoaded = false;
    
    img.onload = () => {
        const offscreen = document.createElement('canvas');
        offscreen.width = cols;
        offscreen.height = rows;
        const offCtx = offscreen.getContext('2d');
        
        // Preserve the portrait framing instead of cropping it into a circle.
        offCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, cols, rows);
        
        const imgData = offCtx.getImageData(0, 0, cols, rows).data;
        
        for (let y = 0; y < rows; y++) {
            brightness[y] = [];
            alpha[y] = [];
            for (let x = 0; x < cols; x++) {
                const idx = (y * cols + x) * 4;
                const r = imgData[idx];
                const g = imgData[idx + 1];
                const b = imgData[idx + 2];
                const a = imgData[idx + 3];
                // Luminosity formula
                brightness[y][x] = 0.299 * r + 0.587 * g + 0.114 * b;
                alpha[y][x] = a;
            }
        }
        
        isLoaded = true;
        animate();
    };
    img.src = 'assets/avatar_src.png';
    
    // Mouse hover splash injection
    canvas.addEventListener('mousemove', (e) => {
        if (!isLoaded) return;
        const rect = canvas.getBoundingClientRect();
        
        // Calculate relative coordinates (accounting for element sizing vs grid resolution)
        const mouseGridX = Math.floor(((e.clientX - rect.left) / rect.width) * cols) + 1;
        const mouseGridY = Math.floor(((e.clientY - rect.top) / rect.height) * rows) + 1;
        
        if (mouseGridX > 1 && mouseGridX < cols && mouseGridY > 1 && mouseGridY < rows) {
            hoverPoint = { x: mouseGridX - 1, y: mouseGridY - 1 };
            addSplash(mouseGridX, mouseGridY, 45, 2);
        }
    });

    canvas.addEventListener('mouseleave', () => {
        hoverPoint = null;
    });
    
    // Wave simulation solver
    function propagateWave() {
        for (let x = 1; x <= cols; x++) {
            for (let y = 1; y <= rows; y++) {
                currentWave[x][y] = (
                    previousWave[x - 1][y] +
                    previousWave[x + 1][y] +
                    previousWave[x][y - 1] +
                    previousWave[x][y + 1]
                ) / 2 - currentWave[x][y];
                
                currentWave[x][y] *= damping;
            }
        }
        
        // Swap buffers
        const temp = previousWave;
        previousWave = currentWave;
        currentWave = temp;
    }
    
    // Render loop
    function animate() {
        if (!isLoaded) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Propagate simulated physical wave ripple
        propagateWave();
        
        ctx.font = `${Math.max(5, Math.min(8, (displayWidth / cols) * 1.45))}px "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const cellW = displayWidth / cols;
        const cellH = displayHeight / rows;
        
        const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e07a5f';
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // Skip transparent pixels (background removed) to create body silhouette
                if (alpha[y][x] < 30) continue;
                
                const luma = brightness[y][x];
                const symIdx = Math.floor((luma / 255) * (mathSymbols.length - 1));
                const symbol = mathSymbols[symIdx];
                
                // Get offset from wave buffers (horizontal & vertical gradient displacements)
                // Add 1 to index since wave simulation is padded by 1 cell on borders
                // A stronger displacement makes the ripple readable across the portrait.
                const shiftX = (currentWave[x + 2][y + 1] - currentWave[x][y + 1]) * 0.22;
                const shiftY = (currentWave[x + 1][y + 2] - currentWave[x + 1][y]) * 0.22;
                
                const screenX = x * cellW + cellW / 2;
                const screenY = y * cellH + cellH / 2;
                let repelX = 0;
                let repelY = 0;

                // A soft, circular field pushes symbols away from the cursor.
                // Its falloff keeps the interaction localized and subtle.
                if (hoverPoint) {
                    const deltaX = x - hoverPoint.x;
                    const deltaY = y - hoverPoint.y;
                    const distance = Math.hypot(deltaX, deltaY);
                    const radius = 12;

                    if (distance > 0 && distance < radius) {
                        const force = Math.pow(1 - distance / radius, 2) * 13;
                        repelX = (deltaX / distance) * force;
                        repelY = (deltaY / distance) * force;
                    }
                }
                
                // Apply slight opacity variance for realistic contrast depth
                // Factor in the alpha channel for smooth feathered silhouette edges
                const alphaFactor = alpha[y][x] / 255;
                ctx.fillStyle = activeColor;
                ctx.globalAlpha = ((luma / 255) * 0.82 + 0.18) * alphaFactor;
                
                ctx.fillText(symbol, screenX + shiftX + repelX, screenY + shiftY + repelY);
            }
        }
        
        ctx.globalAlpha = 1.0; // Reset
        requestAnimationFrame(animate);
    }
    
    function addSplash(centerGridX, centerGridY, strength, radius) {
        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                const distance = Math.hypot(x, y);
                const splashX = centerGridX + x;
                const splashY = centerGridY + y;

                if (distance <= radius && splashX > 0 && splashX <= cols && splashY > 0 && splashY <= rows) {
                    currentWave[splashX][splashY] = strength * (1 - distance / (radius + 1));
                }
            }
        }
    }

    // Click splash helper
    canvas.addEventListener('click', (e) => {
        if (!isLoaded) return;
        const rect = canvas.getBoundingClientRect();
        
        const centerGridX = Math.floor(((e.clientX - rect.left) / rect.width) * cols) + 1;
        const centerGridY = Math.floor(((e.clientY - rect.top) / rect.height) * rows) + 1;
        
        addSplash(centerGridX, centerGridY, 120, 4);
    });
}

/* ==========================================================================
   DOWNFALL MINI GAME
   ========================================================================== */
function initDownfallGame() {
    const startButton = document.getElementById('game-start');
    const closeButton = document.getElementById('game-close');
    const overlay = document.getElementById('game-overlay');
    const canvas = document.getElementById('downfall-canvas');
    const scoreElement = document.getElementById('game-score');

    if (!startButton || !closeButton || !overlay || !canvas || !scoreElement) return;

    const ctx = canvas.getContext('2d');
    const keys = new Set();
    let animationFrame;
    let running = false;
    let previousTime = 0;
    let player;
    let cameraY;
    let hazards;
    let stars;
    let deepestEntity;
    let collected;

    function resizeCanvas() {
        canvas.width = Math.max(320, Math.floor(canvas.clientWidth));
        canvas.height = Math.max(340, Math.floor(canvas.clientHeight));
    }

    function addWorldSlice() {
        const spacing = 155 + Math.random() * 115;
        deepestEntity += spacing;
        const hazardWidth = 44 + Math.random() * 68;
        hazards.push({
            x: 22 + Math.random() * (canvas.width - hazardWidth - 44),
            y: deepestEntity,
            width: hazardWidth,
            height: 18
        });

        if (Math.random() > 0.28) {
            stars.push({
                x: 24 + Math.random() * (canvas.width - 48),
                y: deepestEntity - 55 - Math.random() * 45,
                collected: false
            });
        }
    }

    function resetGame() {
        resizeCanvas();
        player = { x: canvas.width / 2, y: 76, radius: 14, speed: 285 };
        cameraY = 0;
        collected = 0;
        hazards = [];
        stars = [];
        deepestEntity = 160;

        for (let i = 0; i < 38; i++) addWorldSlice();
        scoreElement.textContent = '0m';
    }

    function intersectsHazard(hazard) {
        return player.x + player.radius > hazard.x &&
            player.x - player.radius < hazard.x + hazard.width &&
            player.y + player.radius > hazard.y &&
            player.y - player.radius < hazard.y + hazard.height;
    }

    function update(delta) {
        let direction = 0;
        if (keys.has('arrowleft') || keys.has('a')) direction -= 1;
        if (keys.has('arrowright') || keys.has('d')) direction += 1;

        player.x += direction * player.speed * delta;
        player.x = Math.max(player.radius + 10, Math.min(canvas.width - player.radius - 10, player.x));
        player.y += (118 + Math.min(player.y / 48, 125)) * delta;

        const targetCameraY = Math.max(0, player.y - canvas.height * 0.55);
        cameraY += (targetCameraY - cameraY) * Math.min(1, delta * 5);

        stars.forEach(star => {
            if (!star.collected && Math.hypot(player.x - star.x, player.y - star.y) < player.radius + 12) {
                star.collected = true;
                collected += 1;
            }
        });

        if (hazards.some(intersectsHazard)) {
            player.y = Math.max(cameraY + 75, player.y - 110);
            player.x = canvas.width / 2;
        }

        while (deepestEntity < player.y + canvas.height * 2) addWorldSlice();
        hazards = hazards.filter(hazard => hazard.y > cameraY - 100);
        stars = stars.filter(star => star.y > cameraY - 100 && !star.collected);
        scoreElement.textContent = `${Math.floor(player.y / 10) + collected * 25}m`;
    }

    function drawStar(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#f2cc8f';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#f2cc8f';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? 10 : 4.5;
            const angle = -Math.PI / 2 + i * Math.PI / 5;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(pointX, pointY) : ctx.lineTo(pointX, pointY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e07a5f';
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim() || '#f2cc8f';
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#08111f');
        gradient.addColorStop(1, '#13233a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(0, -cameraY);

        for (let y = Math.floor(cameraY / 90) * 90; y < cameraY + canvas.height + 90; y += 90) {
            ctx.strokeStyle = 'rgba(152, 193, 217, 0.09)';
            ctx.setLineDash([5, 13]);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        hazards.forEach(hazard => {
            ctx.fillStyle = '#e66b6b';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#e66b6b';
            ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
            ctx.shadowBlur = 0;
        });

        stars.forEach(star => drawStar(star.x, star.y));

        ctx.fillStyle = activeColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = activeColor;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0a0f18';
        ctx.beginPath();
        ctx.arc(player.x - 5, player.y - 2, 2, 0, Math.PI * 2);
        ctx.arc(player.x + 5, player.y - 2, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.fillStyle = secondaryColor;
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillText('KEEP FALLING ↓', 18, 26);
    }

    function loop(timestamp) {
        if (!running) return;
        const delta = Math.min((timestamp - previousTime) / 1000, 0.05);
        previousTime = timestamp;
        update(delta);
        draw();
        animationFrame = requestAnimationFrame(loop);
    }

    function openGame() {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        resetGame();
        running = true;
        previousTime = performance.now();
        animationFrame = requestAnimationFrame(loop);
    }

    function closeGame() {
        running = false;
        cancelAnimationFrame(animationFrame);
        keys.clear();
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    startButton.addEventListener('click', openGame);
    closeButton.addEventListener('click', closeGame);
    overlay.addEventListener('click', event => {
        if (event.target === overlay) closeGame();
    });

    window.addEventListener('keydown', event => {
        if (!running) return;
        if (event.key === 'Escape') {
            closeGame();
            return;
        }
        if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(event.key)) {
            event.preventDefault();
            keys.add(event.key.toLowerCase());
        }
    });

    window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
    window.addEventListener('resize', () => {
        if (running) resetGame();
    });
}

/* ===========================================================================
   IN-PAGE PORTFOLIO EXPLORER
   =========================================================================== */
function initPortfolioExplorerGame() {
    const startButton = document.getElementById('game-start');
    const closeButton = document.getElementById('game-close');
    const overlay = document.getElementById('game-overlay');
    const canvas = document.getElementById('downfall-canvas');
    const scoreElement = document.getElementById('game-score');

    if (!startButton || !closeButton || !overlay || !canvas || !scoreElement) return;

    const ctx = canvas.getContext('2d');
    const keys = new Set();
    let active = false;
    let animationFrame;
    let previousTime = 0;
    let player;
    let platforms = [];
    let stars = [];
    let nextPlatformY = 0;
    let lastPlatform;
    let starsCollected = 0;
    let dropTimer = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function addPlatform() {
        const width = 125 + Math.random() * 55;
        const verticalGap = 125 + Math.random() * 30;
        const previousCenter = lastPlatform ? lastPlatform.x + lastPlatform.width / 2 : canvas.width / 2;
        const horizontalStep = (Math.random() - 0.5) * 155;
        const center = Math.max(width / 2 + 18, Math.min(canvas.width - width / 2 - 18, previousCenter + horizontalStep));

        nextPlatformY += verticalGap;
        const platform = {
            x: center - width / 2,
            y: nextPlatformY,
            width
        };
        platforms.push(platform);
        lastPlatform = platform;

        if (Math.random() > 0.2) {
            stars.push({ x: platform.x + platform.width / 2, y: platform.y - 31 });
        }
    }

    function resetGame() {
        resizeCanvas();
        player = {
            x: canvas.width / 2,
            y: 140,
            width: 23,
            height: 23,
            vx: 0,
            vy: 0,
            grounded: true
        };
        platforms = [{ x: canvas.width / 2 - 85, y: 165, width: 170 }];
        lastPlatform = platforms[0];
        stars = [];
        nextPlatformY = 165;
        starsCollected = 0;
        dropTimer = 0;
        while (nextPlatformY < canvas.height + 180) addPlatform();
        scoreElement.textContent = '0';
    }

    function scrollWithPlayer() {
        const triggerY = canvas.height * 0.68;
        if (player.y < triggerY) return;

        // Limit the camera advance per frame so the real page scroll stays smooth.
        const requestedScroll = Math.min(player.y - canvas.height * 0.56, 6);
        const beforeScroll = window.scrollY;
        document.documentElement.scrollTop = beforeScroll + requestedScroll;
        const actualScroll = window.scrollY - beforeScroll;

        if (actualScroll > 0) {
            player.y -= actualScroll;
            platforms.forEach(platform => { platform.y -= actualScroll; });
            stars.forEach(star => { star.y -= actualScroll; });
            nextPlatformY -= actualScroll;
        }
    }

    function update(delta) {
        const movingLeft = keys.has('arrowleft') || keys.has('a');
        const movingRight = keys.has('arrowright') || keys.has('d');
        const direction = Number(movingRight) - Number(movingLeft);
        const previousBottom = player.y + player.height / 2;

        player.vx += (direction * 220 - player.vx) * Math.min(1, delta * 8);
        player.x += player.vx * delta;
        player.x = Math.max(player.width / 2 + 10, Math.min(canvas.width - player.width / 2 - 10, player.x));

        dropTimer = Math.max(0, dropTimer - delta);
        player.vy = Math.min(player.vy + 720 * delta, 260);
        player.y += player.vy * delta;
        player.grounded = false;

        if (dropTimer === 0 && player.vy >= 0) {
            for (const platform of platforms) {
                const playerLeft = player.x - player.width / 2;
                const playerRight = player.x + player.width / 2;
                const currentBottom = player.y + player.height / 2;
                const overlapsPlatform = playerRight > platform.x && playerLeft < platform.x + platform.width;

                if (overlapsPlatform && previousBottom <= platform.y && currentBottom >= platform.y) {
                    player.y = platform.y - player.height / 2;
                    player.vy = 0;
                    player.grounded = true;
                    break;
                }
            }
        }

        stars = stars.filter(star => {
            if (Math.hypot(player.x - star.x, player.y - star.y) < 25) {
                starsCollected += 1;
                scoreElement.textContent = String(starsCollected);
                return false;
            }
            return star.y > -50;
        });

        scrollWithPlayer();
        while (nextPlatformY < canvas.height + 180) addPlatform();
        platforms = platforms.filter(platform => platform.y > -45);
    }

    function drawStar(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#f2cc8f';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f2cc8f';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? 10 : 4;
            const angle = -Math.PI / 2 + i * Math.PI / 5;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(pointX, pointY) : ctx.lineTo(pointX, pointY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e07a5f';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        platforms.forEach(platform => {
            ctx.fillStyle = 'rgba(129, 178, 154, 0.22)';
            ctx.strokeStyle = 'rgba(129, 178, 154, 0.85)';
            ctx.lineWidth = 2;
            ctx.fillRect(platform.x, platform.y, platform.width, 11);
            ctx.strokeRect(platform.x, platform.y, platform.width, 11);
        });
        stars.forEach(star => drawStar(star.x, star.y));

        ctx.shadowBlur = 16;
        ctx.shadowColor = accent;
        ctx.fillStyle = accent;
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0a0f18';
        ctx.fillRect(player.x - 6, player.y - 3, 3, 3);
        ctx.fillRect(player.x + 3, player.y - 3, 3, 3);
    }

    function loop(timestamp) {
        if (!active) return;
        const delta = Math.min((timestamp - previousTime) / 1000, 0.035);
        previousTime = timestamp;
        update(delta);
        draw();
        animationFrame = requestAnimationFrame(loop);
    }

    function startGame() {
        resetGame();
        active = true;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        previousTime = performance.now();
        animationFrame = requestAnimationFrame(loop);
    }

    function stopGame() {
        active = false;
        cancelAnimationFrame(animationFrame);
        keys.clear();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
    }

    startButton.addEventListener('click', startGame);
    closeButton.addEventListener('click', stopGame);
    window.addEventListener('keydown', event => {
        if (!active) return;
        const key = event.key.toLowerCase();
        if (key === 'escape') {
            stopGame();
            return;
        }
        if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's', ' '].includes(key)) {
            event.preventDefault();
            keys.add(key);
            if ((key === 'arrowdown' || key === 's') && player.grounded) {
                dropTimer = 0.24;
                player.vy = 95;
            }
            if ((key === 'arrowup' || key === 'w' || key === ' ') && player.grounded) {
                player.vy = -285;
                player.grounded = false;
            }
        }
    });
    window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
    window.addEventListener('resize', () => {
        if (active) resetGame();
    });
}
