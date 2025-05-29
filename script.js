document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    const progressBar = preloader.querySelector('.progress-bar');
    const loadingText = preloader.querySelector('.loading-text');
    let loadProgress = 0;
    const loadingStates = [
        "Menginisialisasi antarmuka...",
        "Memuat modul grafis...",
        "Menyusun partikel visual...",
        "Menyinkronkan animasi...",
        "Hampir selesai..."
    ];
    let stateIndex = 0;

    const interval = setInterval(() => {
        loadProgress += Math.random() * 15; // Simulate loading
        if (loadProgress >= 100) {
            loadProgress = 100;
            progressBar.style.width = loadProgress + '%';
            loadingText.textContent = "Selamat Datang!";
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 800);
             // Start hero animations after preloader
            startHeroAnimations();
            document.querySelector('.scroll-down-indicator').classList.add('visible');
        } else {
            progressBar.style.width = loadProgress + '%';
            if (loadProgress > (stateIndex + 1) * (100 / loadingStates.length)) {
                stateIndex = Math.min(stateIndex + 1, loadingStates.length -1);
                loadingText.textContent = loadingStates[stateIndex];
            }
        }
    }, 250);


    // --- REALTIME CLOCK ---
    const clockElement = document.getElementById('realtime-clock');
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateClock, 1000);
    updateClock(); // Initial call

    // --- THEME CHANGER & DARK/LIGHT MODE ---
    const themeButtons = document.querySelectorAll('.theme-btn');
    const lightModeToggle = document.getElementById('light-mode-toggle');
    const defaultDarkBtn = document.querySelector('.theme-btn[data-theme="default-dark"]');

    function setActiveThemeButton(activeBtn) {
        themeButtons.forEach(btn => btn.classList.remove('active'));
        if (activeBtn) activeBtn.classList.add('active');
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            if (theme) { // For color themes
                body.classList.remove('purple-neon-theme', 'blue-neon-theme', 'pink-neon-theme', 'light-theme');
                if (theme !== 'default-dark') {
                    body.classList.add(theme + '-theme');
                }
                 // Ensure dark mode is active when a color theme is chosen, unless it's the light toggle
                if (body.classList.contains('light-theme') && button !== lightModeToggle) {
                    body.classList.remove('light-theme');
                    lightModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Show sun icon
                }
                localStorage.setItem('userTheme', theme);
                setActiveThemeButton(button);
                if (button !== lightModeToggle) localStorage.setItem('darkMode', 'true'); // Assume color themes are dark variants
            }
        });
    });

    lightModeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('darkMode', isLight ? 'false' : 'true');
        lightModeToggle.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        
        if (isLight) { // If switching to light, remove color theme classes and active state from color buttons
            body.classList.remove('purple-neon-theme', 'blue-neon-theme', 'pink-neon-theme');
            setActiveThemeButton(lightModeToggle); // Only light toggle is active
        } else { // Switching back to dark
            const lastTheme = localStorage.getItem('userTheme') || 'default-dark';
             if (lastTheme && lastTheme !== 'default-dark') {
                body.classList.add(lastTheme + '-theme');
                setActiveThemeButton(document.querySelector(`.theme-btn[data-theme="${lastTheme}"]`));
            } else {
                setActiveThemeButton(defaultDarkBtn);
            }
        }
    });

    // Load saved theme and mode
    const savedTheme = localStorage.getItem('userTheme');
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'false') { // Light mode was saved
        body.classList.add('light-theme');
        lightModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        setActiveThemeButton(lightModeToggle);
    } else { // Dark mode or no preference (default to dark)
        lightModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        if (savedTheme && savedTheme !== 'default-dark') {
            body.classList.add(savedTheme + '-theme');
            setActiveThemeButton(document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`));
        } else {
             setActiveThemeButton(defaultDarkBtn);
        }
    }


    // --- INTERACTIVE CURSOR ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;

        // Animate outline slightly delayed for a nice effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 300, fill: "forwards" });
    });

    document.querySelectorAll('a, button, .portfolio-item, .skill-item, .theme-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)');
        el.addEventListener('mouseleave', () => cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)');
    });


    // --- HEADER SCROLL EFFECT ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- HERO SECTION ANIMATIONS ---
    function startHeroAnimations() {
        // Letter by letter animation for name
        const nameSpans = document.querySelectorAll('.hero-name span');
        nameSpans.forEach((span, index) => {
            span.style.animationDelay = `${0.1 * index + 1.2}s`; // Delay after preloader
        });

        // Typing effect for subtitle
        const subtitleElement = document.getElementById('hero-typing-effect');
        const subtitleText = "Video Editor | Motion Designer | Visual Artist";
        let charIndex = 0;
        function typeSubtitle() {
            if (charIndex < subtitleText.length) {
                subtitleElement.textContent += subtitleText.charAt(charIndex);
                charIndex++;
                setTimeout(typeSubtitle, 100 + Math.random() * 100); // Varied typing speed
            }
        }
        setTimeout(typeSubtitle, 2000); // Start after name animation likely starts
    }
    // Note: Hero animations start is called from preloader logic now


    // --- MOUSE PARALLAX EFFECT (Example on Hero, can be extended) ---
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = heroSection;
        const xPercentage = (clientX / offsetWidth - 0.5) * 2; // -1 to 1
        const yPercentage = (clientY / offsetHeight - 0.5) * 2; // -1 to 1

        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) { // Ensure content is there
           heroContent.style.transform = `translate(${xPercentage * -15}px, ${yPercentage * -15}px) perspective(1000px) rotateY(${xPercentage * -2}deg) rotateX(${yPercentage * 2}deg)`;
        }
        // Example for background video (subtle)
        const heroVideo = document.getElementById('heroVideo');
        if (heroVideo) {
           heroVideo.style.transform = `scale(1.1) translate(${xPercentage * 5}px, ${yPercentage * 5}px)`;
        }
    });
    heroSection.addEventListener('mouseleave', () => {
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) heroContent.style.transform = 'translate(0,0) perspective(1000px) rotateY(0) rotateX(0)';
        const heroVideo = document.getElementById('heroVideo');
        if (heroVideo) heroVideo.style.transform = 'scale(1.1) translate(0,0)';
    });

    // --- SCROLL REVEAL ANIMATION ---
    const scrollRevealElements = document.querySelectorAll('[data-scrollreveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Animate skill bars when skills section is visible
                if (entry.target.classList.contains('skill-item')) {
                    const skillBar = entry.target.querySelector('.skill-bar');
                    const skillLevel = entry.target.dataset.skillLevel;
                    if (skillBar && skillLevel) {
                        setTimeout(() => { // Add a slight delay for effect
                           skillBar.style.width = skillLevel + '%';
                        }, 300);
                    }
                }
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, { threshold: 0.1 });

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- SKILL BAR ANIMATION (Alternative if not using scroll reveal for it directly) ---
    // Already integrated with ScrollReveal logic above


    // --- PORTFOLIO MODAL ---
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolio-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            modalImage.src = item.dataset.image;
            modalTitle.textContent = item.dataset.title;
            modalDescription.textContent = item.dataset.description;
            modal.classList.add('show');
            body.style.overflow = 'hidden'; // Prevent background scroll
            // Sound effect for click (optional)
            // playSound('sounds/click_open.mp3');
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { // Close if clicked outside content
        if (e.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => { // Close with Escape key
        if (e.key === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        body.style.overflow = 'auto';
         // Sound effect for close (optional)
        // playSound('sounds/click_close.mp3');
    }


    // --- CONTACT FORM VALIDATION & SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const whitelistedEmails = [ // Add whitelisted emails here
        "test@example.com",
        "admin@mysite.com",
        "riskialightmt@gmail.com" // Riski's email should be here for testing
    ];

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default POST submission

        const name = document.getElementById('name').value.trim();
        const email = emailInput.value.trim();
        const message = document.getElementById('message').value.trim();
        let isValid = true;

        // Basic validation
        if (!name) {
            alert("Nama tidak boleh kosong."); isValid = false; return;
        }
        if (!email) {
            alert("Email tidak boleh kosong."); isValid = false; return;
        }
        if (!message) {
            alert("Pesan tidak boleh kosong."); isValid = false; return;
        }

        // Whitelist Email Validation
        if (!whitelistedEmails.includes(email.toLowerCase())) {
            emailError.textContent = "Maaf, email Anda tidak terdaftar dalam whitelist kami.";
            emailInput.style.borderColor = 'var(--neon-pink)';
            isValid = false;
        } else {
            emailError.textContent = "";
            emailInput.style.borderColor = 'var(--tertiary-dark)'; // Reset border
        }

        if (isValid) {
            // Sound effect for submit (optional)
            // playSound('sounds/submit_form.mp3');

            // Using mailto:
            const subject = `Pesan Portofolio dari ${name}`;
            const mailtoLink = `mailto:riskialightmt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;
            window.location.href = mailtoLink;
            alert("Formulir siap dikirim! Silakan lanjutkan melalui aplikasi email Anda.");
            contactForm.reset(); // Reset form fields
        }
    });

    // Clear email error on input
    emailInput.addEventListener('input', () => {
        if (emailError.textContent) {
            emailError.textContent = "";
            emailInput.style.borderColor = 'var(--tertiary-dark)';
        }
    });

    // --- INTERACTIVE BACKGROUND PARTICLES (Simple Version) ---
    const bgContainer = document.getElementById('interactive-background');
    const numParticles = 50; // Adjust for performance/density
    let particlesArray = [];

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 5 + 2; // size 2px to 7px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        // Random initial motion direction and speed
        particle.vx = (Math.random() - 0.5) * 0.5; // Horizontal velocity
        particle.vy = (Math.random() - 0.5) * 0.5; // Vertical velocity
        bgContainer.appendChild(particle);
        particlesArray.push(particle);
    }

    function animateParticles() {
        particlesArray.forEach(p => {
            let newX = parseFloat(p.style.left) + p.vx;
            let newY = parseFloat(p.style.top) + p.vy;

            // Boundary check (bounce off edges)
            if (newX <= 0 || newX >= 100) p.vx *= -1;
            if (newY <= 0 || newY >= 100) p.vy *= -1;

            p.style.left = `${newX}%`;
            p.style.top = `${newY}%`;

            // Optional: interaction with mouse (particles move away)
            // This can be performance intensive, implement carefully
        });
        requestAnimationFrame(animateParticles);
    }

    if (bgContainer) {
        for (let i = 0; i < numParticles; i++) {
            createParticle();
        }
        animateParticles();
    }


    // --- SMOOTH SCROLLING FOR NAV LINKS ---
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Sound effect for navigation (optional)
                // playSound('sounds/swoosh.mp3');
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Align top of element to top of viewport
                });

                // Update active nav link
                document.querySelectorAll('a.nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', navHighlighter);

    function navHighlighter() {
      let scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Adjust offset
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
              navLink.classList.add("active");
            } else {
              navLink.classList.remove("active");
            }
        }
      });
    }


    // --- EFECT SUARA (Contoh Fungsi) ---
    // function playSound(soundFile) {
    //     // Anda perlu membuat elemen audio atau menggunakan Web Audio API
    //     // Contoh sederhana:
    //     // const audio = new Audio(soundFile);
    //     // audio.play().catch(e => console.error("Error playing sound:", e));
    //     console.log("Playing sound (placeholder): " + soundFile);
    // }

    // --- MOUSE PARALLAX FOR PROFILE PICTURE (Example) ---
    const profilePic = document.getElementById('profile-pic');
    const aboutSection = document.getElementById('about');

    if (profilePic && aboutSection) {
        aboutSection.addEventListener('mousemove', (e) => {
            const rect = aboutSection.getBoundingClientRect();
            // Calculate mouse position relative to the center of the aboutSection
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Adjust these values for sensitivity
            const tiltX = (y / rect.height) * -10; // Max 10deg tilt
            const tiltY = (x / rect.width) * 10;   // Max 10deg tilt
            const shiftX = (x / rect.width) * -5; // Max 5px shift
            const shiftY = (y / rect.height) * -5;  // Max 5px shift

            profilePic.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${shiftX}px) translateY(${shiftY}px) scale(1.05)`;
        });

        aboutSection.addEventListener('mouseleave', () => {
            profilePic.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) scale(1)';
        });
    }

});