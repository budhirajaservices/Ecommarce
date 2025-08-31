// Global Variables
let currentSlide = 0;
let currentTestimonial = 0;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Sample Products Data
const products = [
    {
        id: 1,
        name: "Premium Cotton Bed Sheet Set",
        price: 2499,
        originalPrice: 3499,
        image: "images/product-1.jpg",
        category: "bedsheets",
        rating: 4.8,
        reviews: 156,
        badge: "Best Seller",
        description: "Luxurious 100% cotton bed sheet set with traditional block prints",
        material: "100% Cotton",
        colors: ["Beige", "Maroon", "Gold"],
        sizes: ["Single", "Double", "King"]
    },
    {
        id: 2,
        name: "Handwoven Silk Cushion Covers",
        price: 899,
        originalPrice: 1299,
        image: "images/product-2.jpg",
        category: "pillows",
        rating: 4.6,
        reviews: 89,
        badge: "New",
        description: "Elegant silk cushion covers with traditional motifs",
        material: "Pure Silk",
        colors: ["Gold", "Maroon", "Brown"],
        sizes: ["16x16", "18x18", "20x20"]
    },
    {
        id: 3,
        name: "Traditional Block Print Curtains",
        price: 3299,
        originalPrice: 4599,
        image: "images/product-3.jpg",
        category: "curtains",
        rating: 4.7,
        reviews: 124,
        badge: "Sale",
        description: "Beautiful block print curtains with traditional patterns",
        material: "Cotton Blend",
        colors: ["Beige", "Brown", "Maroon"],
        sizes: ["5ft", "7ft", "9ft"]
    },
    {
        id: 4,
        name: "Handknotted Wool Rug",
        price: 8999,
        originalPrice: 12999,
        image: "images/product-4.jpg",
        category: "rugs",
        rating: 4.9,
        reviews: 67,
        badge: "Premium",
        description: "Exquisite handknotted wool rug with intricate designs",
        material: "Pure Wool",
        colors: ["Maroon", "Gold", "Beige"],
        sizes: ["4x6", "6x9", "8x10"]
    },
    {
        id: 5,
        name: "Embroidered Table Runner",
        price: 1299,
        originalPrice: 1899,
        image: "images/product-5.jpg",
        category: "table",
        rating: 4.5,
        reviews: 93,
        badge: "Handmade",
        description: "Beautiful embroidered table runner with traditional motifs",
        material: "Cotton",
        colors: ["Gold", "Maroon", "Beige"],
        sizes: ["6ft", "8ft", "10ft"]
    },
    {
        id: 6,
        name: "Soft Cotton Sofa Throw",
        price: 1899,
        originalPrice: 2699,
        image: "images/product-6.jpg",
        category: "throws",
        rating: 4.6,
        reviews: 78,
        badge: "Comfort",
        description: "Cozy cotton throw perfect for sofas and chairs",
        material: "Organic Cotton",
        colors: ["Beige", "Brown", "Gold"],
        sizes: ["Single", "Double"]
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    setupHeroSlider();
    setupTestimonialSlider();
    loadBestSellers();
    setupMobileMenu();
    setupSearch();
    setupCart();
    setupNewsletterPopup();
    setupNewsletterForms();
    updateCartCount();
}

// Hero Slider
function setupHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto slide
    setInterval(nextSlide, 5000);
}

// Testimonial Slider
function setupTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (!testimonials.length) return;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(next);
    }

    // Auto slide testimonials
    setInterval(nextTestimonial, 4000);
}

// Load Best Sellers
function loadBestSellers() {
    const container = document.getElementById('bestSellers');
    if (!container) return;

    const bestSellers = products.slice(0, 4);
    container.innerHTML = bestSellers.map(product => createProductCard(product)).join('');
}

// Create Product Card
function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                <div class="product-badge">${product.badge}</div>
                <div class="product-actions">
                    <button onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${discount}% OFF</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Generate Stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Mobile Menu
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

// Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            showSearchSuggestions(query);
        } else {
            hideSearchSuggestions();
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            hideSearchSuggestions();
        }
    });
}

function showSearchSuggestions(query) {
    const suggestions = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    ).slice(0, 5);

    let suggestionsHTML = suggestions.map(product => `
        <div class="suggestion-item" onclick="goToProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            <div>
                <div class="suggestion-name">${product.name}</div>
                <div class="suggestion-price">₹${product.price}</div>
            </div>
        </div>
    `).join('');

    if (!document.querySelector('.search-suggestions')) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        document.querySelector('.search-box').appendChild(suggestionsDiv);
    }

    document.querySelector('.search-suggestions').innerHTML = suggestionsHTML;
    document.querySelector('.search-suggestions').style.display = 'block';
}

function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
}

function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Cart Functionality
function setupCart() {
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product removed from cart!', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Wishlist Functionality
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist!', 'info');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist!', 'success');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    // Update wishlist icons
    const wishlistButtons = document.querySelectorAll('[onclick*="toggleWishlist"]');
    wishlistButtons.forEach(button => {
        const productId = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
        const isInWishlist = wishlist.some(item => item.id === productId);
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
            icon.style.color = isInWishlist ? '#e74c3c' : '';
        }
    });
}

// Quick View
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Create and show quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="quick-view-content">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="quick-view-info">
                    <h2>${product.name}</h2>
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span>(${product.reviews} reviews)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₹${product.price}</span>
                        <span class="original-price">₹${product.originalPrice}</span>
                    </div>
                    <p>${product.description}</p>
                    <div class="product-options">
                        <div class="option-group">
                            <label>Color:</label>
                            <select>
                                ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                            </select>
                        </div>
                        <div class="option-group">
                            <label>Size:</label>
                            <select>
                                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal()">Add to Cart</button>
                        <button class="btn btn-outline" onclick="goToProduct(${product.id})">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function closeModal() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Newsletter
function setupNewsletterPopup() {
    // Show newsletter popup after 30 seconds if not shown before
    const hasShownPopup = localStorage.getItem('newsletterPopupShown');
    if (!hasShownPopup) {
        setTimeout(() => {
            showNewsletterPopup();
        }, 30000);
    }
}

function showNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (popup) {
        popup.classList.add('show');
        localStorage.setItem('newsletterPopupShown', 'true');
    }
}

function closeNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (popup) {
        popup.classList.remove('show');
    }
}

function setupNewsletterForms() {
    // Main newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Popup newsletter form
    const popupForm = document.getElementById('popupNewsletterForm');
    if (popupForm) {
        popupForm.addEventListener('submit', handlePopupNewsletterSubmit);
    }

    // Popup close button
    const popupClose = document.querySelector('.popup-close');
    if (popupClose) {
        popupClose.addEventListener('click', closeNewsletterPopup);
    }

    // Close popup when clicking outside
    const popup = document.getElementById('newsletterPopup');
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closeNewsletterPopup();
            }
        });
    }
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    subscribeToNewsletter(email);
    e.target.reset();
}

function handlePopupNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    subscribeToNewsletter(email);
    closeNewsletterPopup();
    e.target.reset();
}

function subscribeToNewsletter(email) {
    // Simulate newsletter subscription
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    
    // Store subscription in localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLazyLoading);
} else {
    setupLazyLoading();
}
