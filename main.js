
// Variables globales
let currentPage = 'home';
let cart = [];
let isDarkMode = false;

// Éléments DOM
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const themeToggle = document.querySelector('.theme-toggle');
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const miniCart = document.getElementById('mini-cart');
const cartClose = document.querySelector('.cart-close');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const filterBtns = document.querySelectorAll('.filter-btn');
const newsletterPopup = document.getElementById('newsletter-popup');
const popupClose = document.querySelector('.popup-close');
const ctaBtns = document.querySelectorAll('.cta-btn');

// Navigation
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    currentPage = pageId;
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
    });
});

ctaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = btn.getAttribute('data-page');
        if (pageId) {
            showPage(pageId);
        }
    });
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
});

// Gestion du panier
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showCartFeedback();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.querySelector('.cart-total-amount');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); margin-top: 2rem;">Votre panier est vide</p>';
        cartTotal.textContent = 'Total: 0,00 €';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">🧴</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} € x ${item.quantity}</div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: ${total.toFixed(2)} €`;
}

function showCartFeedback() {
    const originalText = cartBtn.innerHTML;
    cartBtn.innerHTML = '<i class="fas fa-check" style="color: green;"></i>';
    
    setTimeout(() => {
        cartBtn.innerHTML = originalText;
    }, 1000);
}

// Event listeners pour le panier
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const productName = btn.getAttribute('data-product');
        const price = btn.getAttribute('data-price');
        addToCart(productName, price);
    });
});

cartBtn.addEventListener('click', () => {
    miniCart.classList.add('show');
});

cartClose.addEventListener('click', () => {
    miniCart.classList.remove('show');
});

// Filtres produits
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        const productCards = document.querySelectorAll('#all-products .product-card');
        
        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Formulaire de contact
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulation d'envoi
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Message envoyé !';
        submitBtn.style.background = 'green';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 2000);
    }, 1500);
});

// Newsletter popup
setTimeout(() => {
    newsletterPopup.classList.add('show');
}, 3000);

popupClose.addEventListener('click', () => {
    newsletterPopup.classList.remove('show');
});

newsletterPopup.addEventListener('click', (e) => {
    if (e.target === newsletterPopup) {
        newsletterPopup.classList.remove('show');
    }
});

const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = newsletterForm.querySelector('button');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Inscription...';
    
    setTimeout(() => {
        submitBtn.textContent = 'Inscrit(e) !';
        submitBtn.style.background = 'green';
        
        setTimeout(() => {
            newsletterPopup.classList.remove('show');
        }, 1500);
    }, 1000);
});

// Fermeture du panier en cliquant à l'extérieur
document.addEventListener('click', (e) => {
    if (!miniCart.contains(e.target) && !cartBtn.contains(e.target)) {
        miniCart.classList.remove('show');
    }
});

// Animation des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observer les cartes de produits et les éléments d'engagement
document.querySelectorAll('.product-card, .commitment-item').forEach(el => {
    observer.observe(el);
});

// Event listeners pour les liens du footer
document.querySelectorAll('.footer-links a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.querySelectorAll('.footer-links a[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = link.getAttribute('data-filter');
        showPage('products');
        
        setTimeout(() => {
            const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });
});

// Newsletter footer
const footerNewsletterForm = document.querySelector('.footer-newsletter-form');
footerNewsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = footerNewsletterForm.querySelector('button');
    const input = footerNewsletterForm.querySelector('input');
    const originalHTML = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i>';
    submitBtn.style.background = 'green';
    
    setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        input.value = '';
    }, 2000);
});

// Animation des badges au survol
document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialisation
updateCartDisplay();

    const menuBtn = document.querySelector(".mobile-menu");
    const body = document.body;

    menuBtn.addEventListener("click", () => {
        body.classList.toggle("nav-open");
    });

