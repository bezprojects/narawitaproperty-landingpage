// Init Lucide icons (called after DOM ready because script is defer)
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // ── Navbar scroll effect ──────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ── Scroll reveal (IntersectionObserver) ──────
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('active');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.10 });
    revealEls.forEach(el => revealObserver.observe(el));

    // ── Smooth anchor scroll (respects fixed nav) ─
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight + 12;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            closeMobileMenu();
        });
    });

    // ── Mobile menu ───────────────────────────────
    const mobileBtn     = document.getElementById('mobileMenuBtn');
    const mobileOverlay = document.getElementById('mobileNavOverlay');
    const iconOpen      = document.getElementById('menuIconOpen');
    const iconClose     = document.getElementById('menuIconClose');

    function openMobileMenu() {
        mobileOverlay.classList.add('open');
        iconOpen.style.display  = 'none';
        iconClose.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        mobileOverlay.classList.remove('open');
        iconOpen.style.display  = 'block';
        iconClose.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileOverlay.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
        });
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) closeMobileMenu();
        });
    }

    // ── Hero Slideshow (3 second auto-advance) ────
    const slides      = document.querySelectorAll('.slide');
    const dots        = document.querySelectorAll('.dot');
    let   current     = 0;
    let   slideshowTimer;

    function goToSlide(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function startSlideshow() {
        slideshowTimer = setInterval(() => goToSlide(current + 1), 3000);
    }

    function resetSlideshow() {
        clearInterval(slideshowTimer);
        startSlideshow();
    }

    if (slides.length > 1) {
        // Dot click
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetSlideshow();
            });
        });

        // Touch swipe support for hero slideshow
        const heroEl = document.getElementById('hero');
        let touchStartX = 0;
        heroEl.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        heroEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                goToSlide(diff > 0 ? current + 1 : current - 1);
                resetSlideshow();
            }
        }, { passive: true });

        // Pause on visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            document.hidden ? clearInterval(slideshowTimer) : startSlideshow();
        });

        startSlideshow();
    }
});
