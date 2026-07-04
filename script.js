/**
 * Novus Business Engineering - Main Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    const toggleMenu = () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Intersection Observer for Scroll Animations ---
    const animationElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    animationElements.forEach(el => {
        elementObserver.observe(el);
    });

    // --- Number Counter Animation ---
    const counterElements = document.querySelectorAll('.counter');
    
    counterElements.forEach(target => {
        const targetValue = parseInt(target.getAttribute('data-target'));
        let isAnimating = false;

        const startCounting = () => {
            if (isAnimating) return;
            isAnimating = true;
            let current = 0;
            const increment = targetValue / 30; // Faster count on hover
            
            const updateCounter = () => {
                current += increment;
                if (current < targetValue) {
                    target.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    target.textContent = targetValue;
                    isAnimating = false;
                }
            };
            updateCounter();
        };

        // Trigger on hover
        const parentCard = target.closest('.stat-card');
        if (parentCard) {
            parentCard.addEventListener('mouseenter', startCounting);
        } else {
            target.addEventListener('mouseenter', startCounting);
        }

        // Trigger on scroll (repeating)
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting();
                } else {
                    if (!isAnimating) {
                        target.textContent = '0';
                    }
                }
            });
        }, observerOptions);
        
        counterObserver.observe(target);
    });

    // --- Lazy Loading Background Image ---
    const lazyBg = document.querySelector('.lazy-bg');
    if (lazyBg) {
        const bgUrl = lazyBg.getAttribute('data-bg');
        
        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = new Image();
                    img.src = bgUrl;
                    img.onload = () => {
                        entry.target.style.backgroundImage = `url('${bgUrl}')`;
                        entry.target.classList.add('loaded');
                    };
                    observer.unobserve(entry.target);
                }
            });
        });
        
        bgObserver.observe(lazyBg);
    }

    // --- Form Submission Handling ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate API call delay
                setTimeout(() => {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                }, 1500);
            } else {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.className = 'form-status error';
            }
        });
    }
});
