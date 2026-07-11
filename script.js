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
    const animationElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .swipe-in-left, .swipe-in-right');
    
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
            const increment = targetValue / 100; // Slower count on hover
            
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
            const serviceSelect = document.getElementById('service');
            const serviceText = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'General Inquiry';
            const message = document.getElementById('message').value;

            if (name && email && message) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Construct mailto link to send details to info@ammpeak.com
                const subject = encodeURIComponent(`Ammon Peak Website Inquiry - ${serviceText}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSelected Service: ${serviceText}\n\nMessage:\n${message}`);
                const mailtoUrl = `mailto:info@ammpeak.com?subject=${subject}&body=${body}`;

                // Trigger email client redirect
                window.location.href = mailtoUrl;

                setTimeout(() => {
                    formStatus.textContent = 'Opening your email client to send message to info@ammpeak.com...';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 6000);
                }, 800);
            } else {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
        });
    }

    // --- Page Transition Logic ---
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);

    // Fade out overlay on load
    setTimeout(() => {
        transitionOverlay.classList.add('loaded');
    }, 100);

    // Reset overlay when restored from browser back-forward cache (bfcache)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            transitionOverlay.classList.remove('exiting');
            transitionOverlay.classList.add('loaded');
        }
    });

    // Intercept clicks on transition links
    const transitionLinks = document.querySelectorAll('.service-card-link, .transition-link');
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = link.getAttribute('href');
            
            transitionOverlay.classList.remove('loaded');
            transitionOverlay.classList.add('exiting');
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500); // Matches the 0.5s transition in CSS
        });
    });
});
