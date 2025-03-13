// DOM Elements
const preloader = document.querySelector('.preloader');
const header = document.querySelector('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const scrollTopBtn = document.querySelector('.scroll-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');
const sectionHeaders = document.querySelectorAll('.section-header');

// Add animation index to nav links for staggered animation
navLinksItems.forEach((link, index) => {
    link.style.setProperty('--i', index + 1);
});

// Add data-value attribute to skill names for percentage display
document.querySelectorAll('.skill-item').forEach(item => {
    const skillLevel = item.querySelector('.skill-level');
    const skillName = item.querySelector('.skill-name');
    if (skillLevel && skillName) {
        const width = skillLevel.style.width;
        skillName.setAttribute('data-value', width);
    }
});

// Typing Effect
const typingText = document.querySelector('.typing-text');
const textToType = "Python Developer | Web Developer | AI/ML Enthusiast | Cybersecurity Researcher";
let i = 0;
let isDeleting = false;
let currentText = '';
let typeSpeed = 100;

function typeEffect() {
    if (!typingText) return;
    
    const fullText = textToType;
    
    if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
    } else {
        currentText = fullText.substring(0, currentText.length + 1);
    }
    
    typingText.textContent = currentText;
    
    let speed = isDeleting ? typeSpeed / 2 : typeSpeed;
    
    if (!isDeleting && currentText === fullText) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        isDeleting = false;
        speed = 500;
    }
    
    setTimeout(typeEffect, speed);
}

// Preloader removal
window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            document.body.style.overflow = 'auto';
        }
    }, 1000);
    
    if (typingText) {
        setTimeout(typeEffect, 500);
    }
});

// Prevent scrolling while preloader is active
if (document.body) {
    document.body.style.overflow = 'hidden';
}

// Sticky Header
let lastScrollTop = 0;
const scrollThreshold = 5;

window.addEventListener('scroll', () => {
    const currentScrollTop = window.scrollY;
    
    if (Math.abs(lastScrollTop - currentScrollTop) > scrollThreshold) {
        if (header && currentScrollTop > 50) {
            header.classList.add('sticky');
        } else if (header) {
            header.classList.remove('sticky');
        }
        
        if (scrollTopBtn && currentScrollTop > 500) {
            scrollTopBtn.classList.add('active');
        } else if (scrollTopBtn) {
            scrollTopBtn.classList.remove('active');
        }
        
        updateActiveNavLink();
        lastScrollTop = currentScrollTop;
    }
}, { passive: true });

// Update active nav link based on scroll position
function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        hamburger.setAttribute('aria-label', 
            isExpanded ? 'Open menu' : 'Close menu'
        );
        
        document.body.style.overflow = !isExpanded ? 'hidden' : 'auto';
    });
}

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const scrollToTop = targetElement.offsetTop - 70;
            smoothScrollTo(scrollToTop, 500);
        }
    });
});

// Smooth scroll function
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeInOutCubic = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Project Filtering
filterBtns.forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', btn.classList.contains('active'));
    
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        
        const filterValue = btn.getAttribute('data-filter');
        filterProjects(filterValue);
    });
});

function filterProjects(filterValue) {
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const isVisible = filterValue === 'all' || category === filterValue;
        
        if (isVisible) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Contact Form Validation
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        let isValid = true;
        
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        if (isValid) {
            alert('Message sent successfully!');
            contactForm.reset();
        }
    });
}

// Helper functions for form validation
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorElement);
    }
    
    input.classList.add('error-input');
}

function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        formGroup.removeChild(errorElement);
    }
    
    input.classList.remove('error-input');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll to top button
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        smoothScrollTo(0, 500);
    });
}

// Animate elements on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -5% 0px',
    threshold: 0.05
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.animationDelay || 0;
            setTimeout(() => {
                entry.target.classList.add('animate');
            }, Math.min(delay, 50));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elements to animate
const animateElements = document.querySelectorAll('.project-card, .timeline-item, .achievement-item, .certification-item, .experience-item, .skill-item');

// Pre-animate elements in viewport
function preAnimateVisibleElements() {
    animateElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = (
            rect.top <= window.innerHeight &&
            rect.bottom >= 0
        );
        
        if (isVisible) {
            element.classList.add('animate');
            element.classList.add('pre-animated');
        } else {
            element.classList.add('animate-on-scroll');
            element.dataset.animationDelay = Math.min(index * 30, 100);
            observer.observe(element);
        }
    });
    
    sectionHeaders.forEach((header) => {
        const rect = header.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            header.classList.add('animate');
        } else {
            observer.observe(header);
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    preAnimateVisibleElements();
    
    animateElements.forEach((element, index) => {
        if (!element.classList.contains('pre-animated')) {
            element.classList.add('animate-on-scroll');
            element.dataset.animationDelay = Math.min(index * 30, 100);
            observer.observe(element);
        }
    });
    
    sectionHeaders.forEach(header => {
        if (!header.classList.contains('animate')) {
            observer.observe(header);
        }
    });
});

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.4s ease, transform 0.4s ease;
    }
    
    .animate-on-scroll.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Add image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});

// Add parallax effect to decorative elements
window.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) / 50;
    const moveY = (e.clientY - window.innerHeight / 2) / 50;
    
    document.documentElement.style.setProperty('--mouse-x', moveX + 'px');
    document.documentElement.style.setProperty('--mouse-y', moveY + 'px');
}); 