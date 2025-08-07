// Global Variables
let currentSlide = 0;
let currentTestimonial = 0;
let isAutoplayActive = true;
let slideInterval;
let testimonialInterval;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSlideshow();
    initializeTestimonials();
    initializeScrollAnimations();
    initializeNavigation();
    startAutoplay();
    startTestimonialAutoplay();
});

// Navigation Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.remove('active');
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('active');
}

function initializeNavigation() {
    // Handle scroll effects on navigation
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Slideshow Functions
function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Ensure first slide is active
    slides[0].classList.add('active');
    indicators[0].classList.add('active');
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Calculate new slide index
    if (direction === 1) {
        currentSlide = (currentSlide + 1) % slides.length;
    } else {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Restart autoplay
    if (isAutoplayActive) {
        clearInterval(slideInterval);
        startAutoplay();
    }
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Set new slide
    currentSlide = slideIndex;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Restart autoplay
    if (isAutoplayActive) {
        clearInterval(slideInterval);
        startAutoplay();
    }
}

function toggleAutoplay() {
    const playPauseIcon = document.getElementById('play-pause-icon');
    
    if (isAutoplayActive) {
        clearInterval(slideInterval);
        isAutoplayActive = false;
        playPauseIcon.className = 'fas fa-play';
    } else {
        startAutoplay();
        isAutoplayActive = true;
        playPauseIcon.className = 'fas fa-pause';
    }
}

function startAutoplay() {
    slideInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

// Testimonials Functions
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials[0].classList.add('active');
}

function changeTestimonial(direction) {
    const testimonials = document.querySelectorAll('.testimonial');
    
    // Remove active class from current testimonial
    testimonials[currentTestimonial].classList.remove('active');
    
    // Calculate new testimonial index
    if (direction === 1) {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    } else {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    }
    
    // Add active class to new testimonial
    testimonials[currentTestimonial].classList.add('active');
    
    // Restart autoplay
    clearInterval(testimonialInterval);
    startTestimonialAutoplay();
}

function startTestimonialAutoplay() {
    testimonialInterval = setInterval(function() {
        changeTestimonial(1);
    }, 6000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in-element');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling for anchor links
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effects to cards
function initializeHoverEffects() {
    const cards = document.querySelectorAll('.value-card, .founder-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const mobileMenu = document.getElementById('mobile-menu');
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
    }
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Slideshow keyboard controls
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleAutoplay();
    }
});

// Pause autoplay when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(slideInterval);
        clearInterval(testimonialInterval);
    } else if (isAutoplayActive) {
        startAutoplay();
        startTestimonialAutoplay();
    }
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images have data-src attribute
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add loading states for better UX
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.log('Image failed to load:', this.src);
    });
});

// Initialize all functionality
function init() {
    initializeSlideshow();
    initializeTestimonials();
    initializeScrollAnimations();
    initializeNavigation();
    initializeHoverEffects();
    smoothScroll();
    startAutoplay();
    startTestimonialAutoplay();
}

// Call init if DOM is already loaded, otherwise wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}