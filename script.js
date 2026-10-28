document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Animated Particle Canvas Background Effect
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.floor(window.innerWidth / 20);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ==========================================================================
       2. Typing Text Effect
       ========================================================================== */
    const typingElement = document.getElementById('typing-text');
    const words = [
        "Web Applications",
        "Data Dashboards",
        "Responsive Designs",
        "Figma Mockups to Code"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 1800; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    typeEffect();

    /* ==========================================================================
       3. Theme Toggle (Dark / Light Mode)
       ========================================================================== */
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn.querySelector('i');

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });

    /* ==========================================================================
       4. 3D Tilt Card Effect on Hover
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const tiltX = (y / (rect.height / 2)) * -10;
            const tiltY = (x / (rect.width / 2)) * 10;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* ==========================================================================
       5. Scroll Reveal & Active Navigation Links Observer
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (pageYOffset >= sectionTop) {
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

    /* ==========================================================================
       6. Animated Counter for Stats
       ========================================================================== */
    const statNums = document.querySelectorAll('.stat-num');
    let counted = false;

    const statsSection = document.getElementById('about');

    window.addEventListener('scroll', () => {
        if (!statsSection) return;
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !counted) {
            counted = true;
            statNums.forEach(num => {
                const target = +num.getAttribute('data-target');
                let count = 0;
                const increment = Math.ceil(target / 40);

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        num.innerText = count;
                        setTimeout(updateCount, 40);
                    } else {
                        num.innerText = target;
                    }
                };
                updateCount();
            });
        }
    });

    /* ==========================================================================
       7. CV Download Modal Handler
       ========================================================================== */
    const openCvBtn = document.getElementById('open-cv-btn');
    const closeCvBtn = document.getElementById('close-cv-btn');
    const cvModal = document.getElementById('cv-modal');
    const downloadConfirmBtn = document.getElementById('download-confirm-btn');

    openCvBtn.addEventListener('click', () => cvModal.classList.add('active'));
    closeCvBtn.addEventListener('click', () => cvModal.classList.remove('active'));

    cvModal.addEventListener('click', (e) => {
        if (e.target === cvModal) cvModal.classList.remove('active');
    });

    downloadConfirmBtn.addEventListener('click', () => {
        cvModal.classList.remove('active');
        showToast("Resume download started!");
    });

    /* ==========================================================================
       8. Mobile Menu Hamburger Toggle
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinksMenu = document.getElementById('nav-links');

    hamburgerBtn.addEventListener('click', () => {
        navLinksMenu.classList.toggle('active');
    });

    /* ==========================================================================
       9. Form Submission & Toast Alert System
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        contactForm.reset();
        showToast("Thank you, Sabahat Fatima will contact you soon!");
    });

    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastText = document.getElementById('toast-text');
        
        toastText.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});