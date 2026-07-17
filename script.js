/**
 * Portfolio Website Logic
 * Includes custom cursor, typewriter typing effect, theme toggler,
 * dynamic project filters, scroll animations, and interactive forms.
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
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
});

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    
    // Check if the device has a mouse/fine pointer
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    
    if (!hasFinePointer) {
        if (cursor) cursor.style.display = 'none';
        if (cursorDot) cursorDot.style.display = 'none';
        return;
    }
    
    // Track mouse coordinates
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements once first movement occurs
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        
        // Dot follows cursor immediately
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    // Smooth lerp (linear interpolation) loop for the outer cursor ring
    function renderCursor() {
        // Calculate smooth movement
        const lerpFactor = 0.15; // Adjust for speed of following
        cursorX += (mouseX - cursorX) * lerpFactor;
        cursorY += (mouseY - cursorY) * lerpFactor;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(renderCursor);
    }
    renderCursor();
    
    // Hover interactions
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .filter-btn, .timeline-dot');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
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
    
    form.addEventListener('submit', (e) => {
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
        
        // Simulate API post call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
            
            showFeedback('Message sent successfully! Thank you.', 'success');
            form.reset();
        }, 1800);
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
            
            // Swell custom cursor feedback
            const cursor = document.getElementById('custom-cursor');
            if (cursor) {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
                setTimeout(() => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 250);
            }
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
    
    // ASCII/Math matrix resolution
    const cols = 64;
    const rows = 76;
    
    const mathSymbols = [" ", "·", "≈", "√", "θ", "π", "λ", "Σ", "∫", "∞", "█"];
    
    // Ripple physical buffers
    let currentWave = Array(cols + 2).fill(0).map(() => Array(rows + 2).fill(0));
    let previousWave = Array(cols + 2).fill(0).map(() => Array(rows + 2).fill(0));
    const damping = 0.86;
    let hoverPoint = null;
    
    // Image loading & brightness mapping
    const img = new Image();
    let brightness = [];
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
            for (let x = 0; x < cols; x++) {
                const idx = (y * cols + x) * 4;
                const r = imgData[idx];
                const g = imgData[idx + 1];
                const b = imgData[idx + 2];
                // Luminosity formula
                brightness[y][x] = 0.299 * r + 0.587 * g + 0.114 * b;
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
        
        ctx.font = '8px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const cellW = canvas.width / cols;
        const cellH = canvas.height / rows;
        
        const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e07a5f';
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
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
                ctx.fillStyle = activeColor;
                ctx.globalAlpha = (luma / 255) * 0.82 + 0.18;
                
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
