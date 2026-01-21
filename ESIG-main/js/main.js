/**
 * ESIG - Main JavaScript File
 * École Supérieure d'Informatique et de Gestion
 */

// ===== LOAD HEADER AND FOOTER COMPONENTS =====
async function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (element) {
        try {
            const response = await fetch(componentPath);
            if (response.ok) {
                const html = await response.text();
                element.innerHTML = html;
                
                // After loading header, initialize nav functionality
                if (elementId === 'header-placeholder') {
                    initializeNavigation();
                    setActiveNavLink();
                }
            }
        } catch (error) {
            console.error(`Error loading ${componentPath}:`, error);
        }
    }
}

// Initialize navigation after header is loaded
function initializeNavigation() {
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Show menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden';
        });
    }

    // Hide menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = 'auto';
        });
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && navMenu.classList.contains('show-menu')) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (header && window.scrollY > 100) {
            header.classList.add('scrolled');
        } else if (header) {
            header.classList.remove('scrolled');
        }
    });
}

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const navLinks = document.querySelectorAll('.nav__link[data-page]');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.stat-card, .formation-card, .news-card, .value-card, .team-card, .activity-card, .campus-card, .pricing-card');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial styles for animation
revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== FORMATIONS TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const formationCards = document.querySelectorAll('.formation-detail-card');

if (tabBtns.length > 0 && formationCards.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.dataset.tab;
            
            formationCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'grid';
                } else {
                    if (card.dataset.category === category) {
                        card.style.display = 'grid';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// ===== FORM HANDLING =====
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });
        
        if (isValid) {
            // Show success message
            showNotification('Merci ! Votre message a été envoyé avec succès.', 'success');
            form.reset();
        } else {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
        }
    });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close">&times;</button>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// Animate counters when they come into view
const counters = document.querySelectorAll('.stat-card__number');
let countersAnimated = false;

const animateCountersOnScroll = () => {
    if (countersAnimated) return;
    
    counters.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            const target = parseInt(counter.textContent);
            if (!isNaN(target)) {
                animateCounter(counter, target);
            }
        }
    });
};

window.addEventListener('scroll', animateCountersOnScroll);

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            openLightbox(img.src, img.alt);
        }
    });
});

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox__overlay"></div>
        <div class="lightbox__content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox__close">&times;</button>
        </div>
    `;
    
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const overlay = lightbox.querySelector('.lightbox__overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
    `;
    
    const content = lightbox.querySelector('.lightbox__content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        animation: fadeIn 0.3s ease;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox__close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close handlers
    const closeLightbox = () => {
        lightbox.remove();
        document.body.style.overflow = 'auto';
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    }, { once: true });
}

// ===== BACK TO TOP BUTTON =====
const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #1e3a5f, #2d5a8b);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(button);
    
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
};

createBackToTopButton();

// ===== EVENTS CAROUSEL =====
function initEventsCarousel() {
    const track = document.querySelector('.events-carousel__track');
    const prevBtn = document.querySelector('.events-carousel__btn--prev');
    const nextBtn = document.querySelector('.events-carousel__btn--next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = track.querySelectorAll('.events-carousel__slide');
    const slideWidth = 300; // Width of each slide
    const gap = 24; // Gap between slides (var(--spacing-lg) = 1.5rem = 24px)
    const slideStep = slideWidth + gap;
    let currentPosition = 0;
    const maxScroll = (slides.length * slideStep) - track.parentElement.offsetWidth;
    
    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(currentPosition - slideStep, 0);
        track.style.transform = `translateX(-${currentPosition}px)`;
    });
    
    nextBtn.addEventListener('click', () => {
        currentPosition = Math.min(currentPosition + slideStep, maxScroll);
        track.style.transform = `translateX(-${currentPosition}px)`;
    });
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', initEventsCarousel);

// ===== TESTIMONIALS CAROUSEL =====
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-carousel__track');
    const prevBtn = document.querySelector('.testimonials-carousel__btn--prev');
    const nextBtn = document.querySelector('.testimonials-carousel__btn--next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = track.querySelectorAll('.testimonial-card');
    const slideWidth = 400; // Width of each testimonial card
    const gap = 32; // Gap between slides (var(--spacing-xl) = 2rem = 32px)
    const slideStep = slideWidth + gap;
    let currentPosition = 0;
    const maxScroll = Math.max(0, (slides.length * slideStep) - track.parentElement.offsetWidth);
    
    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(currentPosition - slideStep, 0);
        track.style.transform = `translateX(-${currentPosition}px)`;
    });
    
    nextBtn.addEventListener('click', () => {
        currentPosition = Math.min(currentPosition + slideStep, maxScroll);
        track.style.transform = `translateX(-${currentPosition}px)`;
    });
}

// Initialize testimonials carousel when DOM is ready
document.addEventListener('DOMContentLoaded', initTestimonialsCarousel);

// ===== ARCHIVES AUTO-GENERATION =====
function generateArchiveYears() {
    const archiveList = document.querySelector('.sidebar-widget .categories-list');
    
    // Vérifier si c'est bien la liste d'archives (pas catégories)
    const archiveWidget = document.querySelector('.sidebar-widget__title');
    let isArchiveWidget = false;
    
    document.querySelectorAll('.sidebar-widget').forEach(widget => {
        const title = widget.querySelector('.sidebar-widget__title');
        if (title && title.textContent.trim() === 'Archives') {
            const list = widget.querySelector('.categories-list');
            if (list) {
                // Générer les années de 2025 à l'année actuelle
                const currentYear = new Date().getFullYear();
                const startYear = 2025;
                
                // Vider la liste existante
                list.innerHTML = '';
                
                // Générer les années (du plus récent au plus ancien)
                for (let year = currentYear; year >= startYear; year--) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#';
                    a.textContent = year;
                    li.appendChild(a);
                    list.appendChild(li);
                }
            }
        }
    });
}

// Initialize archives when DOM is ready
document.addEventListener('DOMContentLoaded', generateArchiveYears);

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

console.log('ESIG Website - JavaScript Loaded Successfully');
