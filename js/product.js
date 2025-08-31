// Product Page JavaScript
let currentProduct = null;
let currentImageIndex = 0;
let productImages = [];
let selectedQuantity = 1;

// Sample product reviews
const productReviews = [
    {
        id: 1,
        productId: 1,
        rating: 5,
        title: "Excellent Quality!",
        text: "The bed sheet set exceeded my expectations. The fabric is soft, durable, and the traditional prints are beautiful. Highly recommended!",
        reviewer: "Priya Sharma",
        date: "2024-01-15",
        verified: true
    },
    {
        id: 2,
        productId: 1,
        rating: 4,
        title: "Good value for money",
        text: "Nice quality cotton sheets with authentic handloom feel. The colors are vibrant and washing doesn't fade them.",
        reviewer: "Rajesh Kumar",
        date: "2024-01-10",
        verified: true
    },
    {
        id: 3,
        productId: 1,
        rating: 5,
        title: "Love the traditional patterns",
        text: "Beautiful block prints and the cotton is very comfortable. Perfect for our bedroom decor.",
        reviewer: "Meera Patel",
        date: "2024-01-08",
        verified: false
    }
];

// Size charts for different categories
const sizeCharts = {
    bedsheets: [
        { size: "Single", dimensions: "60\" x 90\"", fits: "Single Bed" },
        { size: "Double", dimensions: "90\" x 100\"", fits: "Double Bed" },
        { size: "King", dimensions: "108\" x 108\"", fits: "King Size Bed" }
    ],
    pillows: [
        { size: "16x16", dimensions: "16\" x 16\"", fits: "Standard Pillow" },
        { size: "18x18", dimensions: "18\" x 18\"", fits: "Large Pillow" },
        { size: "20x20", dimensions: "20\" x 20\"", fits: "Euro Pillow" }
    ],
    curtains: [
        { size: "5ft", dimensions: "60\" x 84\"", fits: "Small Window" },
        { size: "7ft", dimensions: "84\" x 90\"", fits: "Medium Window" },
        { size: "9ft", dimensions: "108\" x 96\"", fits: "Large Window" }
    ]
};

// Initialize product page
document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
    setupEventListeners();
});

function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    // Find product from shop products or use sample data
    currentProduct = shopProducts ? shopProducts.find(p => p.id === productId) : null;
    
    if (!currentProduct) {
        // Fallback product data
        currentProduct = {
            id: productId,
            name: "Premium Cotton Bed Sheet Set",
            price: 2499,
            originalPrice: 3499,
            images: [
                "images/product-1.jpg",
                "images/product-1-2.jpg",
                "images/product-1-3.jpg",
                "images/product-1-4.jpg"
            ],
            category: "bedsheets",
            rating: 4.8,
            reviews: 156,
            badge: "Best Seller",
            description: "Experience luxury with our premium 100% cotton bed sheet set featuring traditional block prints. Handcrafted by skilled artisans using time-honored techniques, these sheets offer exceptional comfort and durability. The intricate patterns showcase the rich heritage of Indian textile artistry.",
            material: "100% Cotton",
            colors: ["Beige", "Maroon", "Gold"],
            sizes: ["Single", "Double", "King"],
            inStock: true,
            stockCount: 25,
            specifications: {
                "Thread Count": "300 TC",
                "Weave": "Percale",
                "Pattern": "Traditional Block Print",
                "Care": "Machine Washable",
                "Origin": "Rajasthan, India",
                "Certification": "GOTS Certified"
            }
        };
    }
    
    // Set up product images
    productImages = currentProduct.images || [currentProduct.image];
    
    renderProduct();
    loadRelatedProducts();
    loadRecentlyViewed();
    addToRecentlyViewed(currentProduct.id);
}

function renderProduct() {
    updateBreadcrumb();
    renderProductContent();
    renderProductTabs();
    updatePageTitle();
}

function updateBreadcrumb() {
    const categoryNames = {
        'bedsheets': 'Bed Sheets & Covers',
        'pillows': 'Pillow & Cushion Covers',
        'curtains': 'Curtains & Drapes',
        'rugs': 'Rugs & Carpets',
        'table': 'Table Runners & Cloths',
        'throws': 'Sofa Throws',
        'quilts': 'Quilts & Dohars'
    };
    
    const categoryElement = document.getElementById('productCategory');
    const nameElement = document.getElementById('productName');
    
    if (categoryElement) {
        categoryElement.textContent = categoryNames[currentProduct.category] || 'Products';
    }
    
    if (nameElement) {
        nameElement.textContent = currentProduct.name;
    }
}

function renderProductContent() {
    const container = document.getElementById('productContent');
    if (!container) return;
    
    const discount = Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100);
    
    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img src="${productImages[0]}" alt="${currentProduct.name}" id="mainProductImage" onerror="this.src='images/placeholder.jpg'">
                <button class="zoom-icon" onclick="openZoomModal()">
                    <i class="fas fa-search-plus"></i>
                </button>
            </div>
            <div class="thumbnail-gallery">
                ${productImages.map((img, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(${index})">
                        <img src="${img}" alt="${currentProduct.name}" onerror="this.src='images/placeholder.jpg'">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="product-info">
            <h1>${currentProduct.name}</h1>
            
            <div class="product-rating">
                <div class="rating-stars">
                    <div class="stars">${generateStars(currentProduct.rating)}</div>
                    <span class="rating-text">(${currentProduct.reviews} reviews)</span>
                </div>
            </div>
            
            <div class="product-price">
                <span class="current-price">₹${currentProduct.price.toLocaleString()}</span>
                <span class="original-price">₹${currentProduct.originalPrice.toLocaleString()}</span>
                <span class="discount-badge">${discount}% OFF</span>
            </div>
            
            <div class="stock-status">
                <div class="stock-indicator ${currentProduct.inStock ? '' : 'out-of-stock'}"></div>
                <span class="stock-text ${currentProduct.inStock ? '' : 'out-of-stock'}">
                    ${currentProduct.inStock ? `In Stock (${currentProduct.stockCount || 'Available'})` : 'Out of Stock'}
                </span>
            </div>
            
            <p class="product-description">${currentProduct.description}</p>
            
            <div class="product-options">
                <div class="option-group">
                    <label class="option-label">Color:</label>
                    <div class="color-options">
                        ${currentProduct.colors.map((color, index) => `
                            <div class="color-option">
                                <input type="radio" name="color" value="${color}" id="color${index}" ${index === 0 ? 'checked' : ''}>
                                <div class="color-swatch" style="background-color: ${getColorCode(color)}"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="option-group">
                    <label class="option-label">Size: 
                        <a href="#" class="size-guide-link" onclick="openSizeChart()">Size Guide</a>
                    </label>
                    <div class="size-options">
                        ${currentProduct.sizes.map((size, index) => `
                            <div class="size-option">
                                <input type="radio" name="size" value="${size}" id="size${index}" ${index === 0 ? 'checked' : ''}>
                                <label for="size${index}" class="size-label">${size}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="quantity-selector">
                <span class="quantity-label">Quantity:</span>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10" id="quantityInput">
                    <button class="quantity-btn" onclick="increaseQuantity()">+</button>
                </div>
            </div>
            
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addProductToCart()" ${!currentProduct.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${currentProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="wishlist-btn" onclick="toggleProductWishlist()">
                    <i class="far fa-heart"></i>
                    Add to Wishlist
                </button>
            </div>
            
            <div class="product-meta">
                <div class="meta-item">
                    <span class="meta-label">SKU:</span>
                    <span class="meta-value">HH-${currentProduct.id.toString().padStart(4, '0')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Category:</span>
                    <span class="meta-value">${getCategoryName(currentProduct.category)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Material:</span>
                    <span class="meta-value">${currentProduct.material}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Shipping:</span>
                    <span class="meta-value">Free shipping on orders over ₹2000</span>
                </div>
            </div>
        </div>
    `;
}

function renderProductTabs() {
    // Description tab
    const descriptionContent = document.getElementById('descriptionContent');
    if (descriptionContent) {
        descriptionContent.innerHTML = `
            <h3>Product Description</h3>
            <p>${currentProduct.description}</p>
            <h4>Features:</h4>
            <ul>
                <li>Premium quality ${currentProduct.material.toLowerCase()}</li>
                <li>Traditional handloom craftsmanship</li>
                <li>Authentic Indian block prints</li>
                <li>Durable and long-lasting</li>
                <li>Easy to care and maintain</li>
                <li>Available in multiple sizes and colors</li>
            </ul>
        `;
    }
    
    // Specifications tab
    const specificationsContent = document.getElementById('specificationsContent');
    if (specificationsContent && currentProduct.specifications) {
        specificationsContent.innerHTML = `
            <h3>Product Specifications</h3>
            <table class="specifications-table">
                ${Object.entries(currentProduct.specifications).map(([key, value]) => `
                    <tr>
                        <th>${key}</th>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    }
    
    // Reviews tab
    loadProductReviews();
}

function loadProductReviews() {
    const reviewsSummary = document.getElementById('reviewsSummary');
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviewsSummary || !reviewsList) return;
    
    const reviews = productReviews.filter(r => r.productId === currentProduct.id);
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    
    // Rating breakdown
    const ratingCounts = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
        ratingCounts[review.rating - 1]++;
    });
    
    reviewsSummary.innerHTML = `
        <div class="overall-rating">
            <div class="rating-number">${avgRating.toFixed(1)}</div>
            <div class="stars">${generateStars(avgRating)}</div>
            <p>${reviews.length} Reviews</p>
        </div>
        <div class="rating-breakdown">
            ${[5, 4, 3, 2, 1].map(rating => `
                <div class="rating-row">
                    <span class="rating-label">${rating} star</span>
                    <div class="rating-bar">
                        <div class="rating-fill" style="width: ${reviews.length > 0 ? (ratingCounts[rating - 1] / reviews.length) * 100 : 0}%"></div>
                    </div>
                    <span class="rating-count">${ratingCounts[rating - 1]}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.reviewer.charAt(0)}</div>
                    <div class="reviewer-details">
                        <h4>${review.reviewer} ${review.verified ? '<i class="fas fa-check-circle" style="color: #27ae60; font-size: 0.8rem;" title="Verified Purchase"></i>' : ''}</h4>
                        <span class="review-date">${formatDate(review.date)}</span>
                    </div>
                </div>
                <div class="review-rating">${generateStars(review.rating)}</div>
            </div>
            <h5 class="review-title">${review.title}</h5>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Quantity input
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            selectedQuantity = parseInt(this.value) || 1;
            if (selectedQuantity < 1) {
                selectedQuantity = 1;
                this.value = 1;
            }
            if (selectedQuantity > 10) {
                selectedQuantity = 10;
                this.value = 10;
            }
        });
    }
    
    // Review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
    
    // Modal close events
    setupModalEvents();
}

function changeMainImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = productImages[index];
    }
    
    // Update thumbnail active state
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function increaseQuantity() {
    const input = document.getElementById('quantityInput');
    if (input && selectedQuantity < 10) {
        selectedQuantity++;
        input.value = selectedQuantity;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantityInput');
    if (input && selectedQuantity > 1) {
        selectedQuantity--;
        input.value = selectedQuantity;
    }
}

function addProductToCart() {
    if (!currentProduct.inStock) return;
    
    const selectedColor = document.querySelector('input[name="color"]:checked')?.value;
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    
    const cartItem = {
        ...currentProduct,
        quantity: selectedQuantity,
        selectedColor,
        selectedSize,
        cartId: Date.now() // Unique identifier for cart item
    };
    
    // Add to cart using the global cart functionality
    if (typeof addToCart === 'function') {
        for (let i = 0; i < selectedQuantity; i++) {
            addToCart(currentProduct.id);
        }
    } else {
        // Fallback cart functionality
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => 
            item.id === cartItem.id && 
            item.selectedColor === cartItem.selectedColor && 
            item.selectedSize === cartItem.selectedSize
        );
        
        if (existingItem) {
            existingItem.quantity += selectedQuantity;
        } else {
            cart.push(cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    showNotification(`${currentProduct.name} added to cart!`, 'success');
}

function toggleProductWishlist() {
    const btn = document.querySelector('.wishlist-btn');
    const icon = btn.querySelector('i');
    
    if (typeof toggleWishlist === 'function') {
        toggleWishlist(currentProduct.id);
    } else {
        // Fallback wishlist functionality
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingIndex = wishlist.findIndex(item => item.id === currentProduct.id);
        
        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            icon.className = 'far fa-heart';
            btn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            showNotification('Removed from wishlist!', 'info');
        } else {
            wishlist.push(currentProduct);
            icon.className = 'fas fa-heart';
            btn.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
            showNotification('Added to wishlist!', 'success');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabId);
    });
}

function openSizeChart() {
    const modal = document.getElementById('sizeChartModal');
    const sizeChartBody = document.getElementById('sizeChartBody');
    
    if (!modal || !sizeChartBody) return;
    
    const chartData = sizeCharts[currentProduct.category] || [];
    
    sizeChartBody.innerHTML = chartData.map(item => `
        <tr>
            <td>${item.size}</td>
            <td>${item.dimensions}</td>
            <td>${item.fits}</td>
        </tr>
    `).join('');
    
    modal.classList.add('show');
}

function openZoomModal() {
    const modal = document.getElementById('zoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    
    if (!modal || !zoomedImage) return;
    
    zoomedImage.src = productImages[currentImageIndex];
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function setupModalEvents() {
    // Size chart modal
    const sizeChartModal = document.getElementById('sizeChartModal');
    if (sizeChartModal) {
        sizeChartModal.querySelector('.modal-close')?.addEventListener('click', () => closeModal('sizeChartModal'));
        sizeChartModal.addEventListener('click', (e) => {
            if (e.target === sizeChartModal) closeModal('sizeChartModal');
        });
    }
    
    // Zoom modal
    const zoomModal = document.getElementById('zoomModal');
    if (zoomModal) {
        zoomModal.querySelector('.zoom-close')?.addEventListener('click', () => closeModal('zoomModal'));
        zoomModal.addEventListener('click', (e) => {
            if (e.target === zoomModal) closeModal('zoomModal');
        });
        
        // Zoom navigation
        document.getElementById('zoomPrev')?.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
            document.getElementById('zoomedImage').src = productImages[currentImageIndex];
        });
        
        document.getElementById('zoomNext')?.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % productImages.length;
            document.getElementById('zoomedImage').src = productImages[currentImageIndex];
        });
    }
}

function handleReviewSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const rating = formData.get('rating');
    const title = formData.get('reviewTitle') || document.getElementById('reviewTitle').value;
    const text = formData.get('reviewText') || document.getElementById('reviewText').value;
    const reviewer = formData.get('reviewerName') || document.getElementById('reviewerName').value;
    
    if (!rating || !title || !text || !reviewer) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        productId: currentProduct.id,
        rating: parseInt(rating),
        title,
        text,
        reviewer,
        date: new Date().toISOString().split('T')[0],
        verified: false
    };
    
    productReviews.push(newReview);
    loadProductReviews();
    e.target.reset();
    
    showNotification('Thank you for your review!', 'success');
}

function loadRelatedProducts() {
    const container = document.getElementById('relatedProducts');
    if (!container) return;
    
    // Get products from the same category
    const relatedProducts = (shopProducts || [])
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        container.innerHTML = '<p>No related products found.</p>';
        return;
    }
    
    container.innerHTML = relatedProducts.map(product => createProductCard(product)).join('');
}

function loadRecentlyViewed() {
    const container = document.getElementById('recentlyViewed');
    if (!container) return;
    
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const recentProducts = (shopProducts || [])
        .filter(p => recentlyViewed.includes(p.id) && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (recentProducts.length === 0) {
        container.innerHTML = '<p>No recently viewed products.</p>';
        return;
    }
    
    container.innerHTML = recentProducts.map(product => createProductCard(product)).join('');
}

function addToRecentlyViewed(productId) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to beginning
    recentlyViewed.unshift(productId);
    
    // Keep only last 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

function updatePageTitle() {
    document.title = `${currentProduct.name} - Heritage Handlooms`;
}

// Utility functions
function getColorCode(colorName) {
    const colorCodes = {
        'beige': '#F5F5DC',
        'brown': '#8B4513',
        'maroon': '#800000',
        'gold': '#DAA520'
    };
    return colorCodes[colorName.toLowerCase()] || '#ccc';
}

function getCategoryName(category) {
    const categoryNames = {
        'bedsheets': 'Bed Sheets & Covers',
        'pillows': 'Pillow & Cushion Covers',
        'curtains': 'Curtains & Drapes',
        'rugs': 'Rugs & Carpets',
        'table': 'Table Runners & Cloths',
        'throws': 'Sofa Throws',
        'quilts': 'Quilts & Dohars'
    };
    return categoryNames[category] || 'Products';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate stars function (if not available from main script)
if (typeof generateStars !== 'function') {
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
}
