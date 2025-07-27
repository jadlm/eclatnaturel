

// Variables globales
let cart = [];
let isDarkMode = false;
let currentView = 'grid';
let currentFilter = 'all';
let allProducts = [];

// Éléments DOM
const themeToggle = document.querySelector('.theme-toggle');
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const miniCart = document.getElementById('mini-cart');
const cartClose = document.querySelector('.cart-close');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const filterBtns = document.querySelectorAll('.filter-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const sortSelect = document.getElementById('sort-select');
const productsGrid = document.getElementById('products-grid');
const resultsCount = document.getElementById('results-count');
const loading = document.getElementById('loading');

// Initialisation des produits
function initProducts() {
    allProducts = Array.from(document.querySelectorAll('.product-card')).map(card => ({
        element: card,
        category: card.getAttribute('data-category'),
        price: parseFloat(card.getAttribute('data-price')),
        name: card.getAttribute('data-name'),
        rating: parseFloat(card.getAttribute('data-rating'))
    }));
    updateResultsCount();
}

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

// Filtres par catégorie
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = btn.getAttribute('data-filter');
        filterProducts();
    });
});

// Vue grille/liste
viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentView = btn.getAttribute('data-view');
        toggleView();
    });
});

function toggleView() {
    const productCards = document.querySelectorAll('.product-card');
    
    if (currentView === 'list') {
        productsGrid.classList.add('list-view');
        productCards.forEach(card => card.classList.add('list-view'));
    } else {
        productsGrid.classList.remove('list-view');
        productCards.forEach(card => card.classList.remove('list-view'));
    }
}

// Tri des produits
sortSelect.addEventListener('change', () => {
    sortProducts();
});

function sortProducts() {
    const sortValue = sortSelect.value;
    let sortedProducts = [...allProducts];
    
    switch(sortValue) {
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Simuler un tri par nouveauté
            sortedProducts.sort(() => Math.random() - 0.5);
            break;
    }
    
    // Réorganiser les éléments dans le DOM
    sortedProducts.forEach(product => {
        productsGrid.appendChild(product.element);
    });
}

function filterProducts() {
    showLoading();
    
    setTimeout(() => {
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (currentFilter === 'all' || category === currentFilter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        resultsCount.textContent = visibleCount;
        hideLoading();
    }, 500);
}

function updateResultsCount() {
    const visibleProducts = document.querySelectorAll('.product-card[style*="block"], .product-card:not([style*="none"])');
    resultsCount.textContent = visibleProducts.length;
}

function showLoading() {
    loading.classList.add('show');
    productsGrid.style.opacity = '0.5';
}

function hideLoading() {
    loading.classList.remove('show');
    productsGrid.style.opacity = '1';
}

// Gestion des favoris
document.querySelectorAll('.action-btn').forEach(btn => {
    if (btn.title === 'Favori') {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#dc3545';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    }
});

// Pagination
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!btn.disabled && !btn.classList.contains('active')) {
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            if (!btn.querySelector('i')) { // Si ce n'est pas un bouton de navigation
                btn.classList.add('active');
            }
            
            // Scroll vers le haut
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
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

// Observer les cartes de produits
document.querySelectorAll('.product-card').forEach(el => {
    observer.observe(el);
});

// Recherche en temps réel (optionnel)
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Rechercher un produit...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 0.8rem 1rem;
        border: 2px solid #eee;
        border-radius: 25px;
        background: var(--white);
        color: var(--text-dark);
        font-family: inherit;
        width: 300px;
        transition: var(--transition);
    `;
    
    const filtersRow = document.querySelector('.filters-row');
    filtersRow.insertBefore(searchInput, filtersRow.firstChild);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const productName = card.getAttribute('data-name').toLowerCase();
            const category = card.getAttribute('data-category');
            const shouldShow = (currentFilter === 'all' || category === currentFilter) && 
                             productName.includes(searchTerm);
            
            if (shouldShow) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        resultsCount.textContent = visibleCount;
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    updateCartDisplay();
    addSearchFunctionality();
    
    // Animation d'entrée pour les éléments de la page
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 100);
        });
    }, 300);
});

// Gestion responsive du menu mobile
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Ajout de styles pour le menu mobile
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .nav-links.show {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--white);
            flex-direction: column;
            padding: 1rem;
            box-shadow: var(--shadow);
            border-radius: 0 0 15px 15px;
        }
        
        .search-input {
            width: 100% !important;
            margin-bottom: 1rem;
        }
        
        .filters-row {
            gap: 1rem;
        }
        
        .category-filters {
            order: 2;
        }
        
        .sort-controls {
            order: 3;
        }
    }
`;
document.head.appendChild(mobileStyles);

// Animation de chargement pour les changements de filtre
function smoothFilterTransition() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.transition = 'all 0.3s ease';
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            if (card.style.display !== 'none') {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }
        }, index * 50);
    });
}

// Amélioration de la fonction de filtrage avec animation
function filterProductsWithAnimation() {
    showLoading();
    
    // Masquer tous les produits avec animation
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
    });
    
    setTimeout(() => {
        let visibleCount = 0;
        
        productCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (currentFilter === 'all' || category === currentFilter) {
                card.style.display = 'block';
                
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }, index * 100);
                
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        resultsCount.textContent = visibleCount;
        hideLoading();
    }, 500);
}

// Remplacer la fonction de filtrage standard
filterBtns.forEach(btn => {
    btn.removeEventListener('click', filterProducts);
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = btn.getAttribute('data-filter');
        filterProductsWithAnimation();
    });
});
