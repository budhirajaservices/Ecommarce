// Shop Page JavaScript
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let currentFilters = {
    categories: [],
    colors: [],
    materials: [],
    minPrice: 0,
    maxPrice: 15000,
    rating: 0
};
let currentSort = 'featured';
let currentView = 'grid';

// Extended Products Data for Shop
const shopProducts = [
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
        material: "Cotton",
        colors: ["Beige", "Maroon", "Gold"],
        sizes: ["Single", "Double", "King"],
        inStock: true,
        featured: true
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
        material: "Silk",
        colors: ["Gold", "Maroon", "Brown"],
        sizes: ["16x16", "18x18", "20x20"],
        inStock: true,
        featured: true
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
        sizes: ["5ft", "7ft", "9ft"],
        inStock: true,
        featured: true
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
        material: "Wool",
        colors: ["Maroon", "Gold", "Beige"],
        sizes: ["4x6", "6x9", "8x10"],
        inStock: true,
        featured: true
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
        sizes: ["6ft", "8ft", "10ft"],
        inStock: true,
        featured: false
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
        material: "Cotton",
        colors: ["Beige", "Brown", "Gold"],
        sizes: ["Single", "Double"],
        inStock: true,
        featured: false
    },
    {
        id: 7,
        name: "Royal Silk Bed Cover",
        price: 4999,
        originalPrice: 6999,
        image: "images/product-7.jpg",
        category: "bedsheets",
        rating: 4.8,
        reviews: 142,
        badge: "Luxury",
        description: "Luxurious silk bed cover with golden embroidery",
        material: "Silk",
        colors: ["Gold", "Maroon"],
        sizes: ["Double", "King"],
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: "Handwoven Cotton Cushions",
        price: 699,
        originalPrice: 999,
        image: "images/product-8.jpg",
        category: "pillows",
        rating: 4.4,
        reviews: 76,
        badge: "Eco-Friendly",
        description: "Sustainable handwoven cotton cushion covers",
        material: "Cotton",
        colors: ["Beige", "Brown"],
        sizes: ["16x16", "18x18"],
        inStock: true,
        featured: false
    },
    {
        id: 9,
        name: "Elegant Linen Curtains",
        price: 2799,
        originalPrice: 3999,
        image: "images/product-9.jpg",
        category: "curtains",
        rating: 4.5,
        reviews: 98,
        badge: "Natural",
        description: "Premium linen curtains with subtle texture",
        material: "Cotton Blend",
        colors: ["Beige", "Brown"],
        sizes: ["5ft", "7ft", "9ft"],
        inStock: true,
        featured: false
    },
    {
        id: 10,
        name: "Traditional Jute Rug",
        price: 3499,
        originalPrice: 4999,
        image: "images/product-10.jpg",
        category: "rugs",
        rating: 4.3,
        reviews: 54,
        badge: "Sustainable",
        description: "Eco-friendly jute rug with traditional patterns",
        material: "Cotton Blend",
        colors: ["Beige", "Brown"],
        sizes: ["4x6", "6x9"],
        inStock: true,
        featured: false
    },
    {
        id: 11,
        name: "Festive Table Cloth",
        price: 1599,
        originalPrice: 2299,
        image: "images/product-11.jpg",
        category: "table",
        rating: 4.6,
        reviews: 87,
        badge: "Festive",
        description: "Beautiful table cloth perfect for celebrations",
        material: "Cotton",
        colors: ["Gold", "Maroon"],
        sizes: ["6ft", "8ft"],
        inStock: true,
        featured: false
    },
    {
        id: 12,
        name: "Cozy Wool Throw",
        price: 2499,
        originalPrice: 3499,
        image: "images/product-12.jpg",
        category: "throws",
        rating: 4.7,
        reviews: 91,
        badge: "Warm",
        description: "Soft wool throw for cold winter nights",
        material: "Wool",
        colors: ["Brown", "Maroon"],
        sizes: ["Single", "Double"],
        inStock: true,
        featured: false
    },
    {
        id: 13,
        name: "Traditional Quilt",
        price: 3999,
        originalPrice: 5499,
        image: "images/product-13.jpg",
        category: "quilts",
        rating: 4.8,
        reviews: 103,
        badge: "Heritage",
        description: "Handcrafted traditional quilt with intricate patterns",
        material: "Cotton",
        colors: ["Maroon", "Gold", "Beige"],
        sizes: ["Single", "Double", "King"],
        inStock: true,
        featured: false
    },
    {
        id: 14,
        name: "Summer Cotton Dohar",
        price: 1999,
        originalPrice: 2799,
        image: "images/product-14.jpg",
        category: "quilts",
        rating: 4.5,
        reviews: 68,
        badge: "Summer",
        description: "Lightweight cotton dohar perfect for summer",
        material: "Cotton",
        colors: ["Beige", "Gold"],
        sizes: ["Single", "Double"],
        inStock: true,
        featured: false
    },
    {
        id: 15,
        name: "Designer Pillow Covers Set",
        price: 1299,
        originalPrice: 1899,
        image: "images/product-15.jpg",
        category: "pillows",
        rating: 4.4,
        reviews: 82,
        badge: "Set of 4",
        description: "Set of 4 designer pillow covers with matching patterns",
        material: "Cotton",
        colors: ["Gold", "Maroon", "Beige"],
        sizes: ["16x16", "18x18"],
        inStock: true,
        featured: false
    }
];

// Initialize Shop Page
document.addEventListener('DOMContentLoaded', function() {
    allProducts = [...shopProducts];
    filteredProducts = [...allProducts];
    
    initializeShop();
    setupEventListeners();
    loadProducts();
    updateURL();
});

function initializeShop() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Update page title and description based on category
        updatePageForCategory(category);
        // Set category filter
        currentFilters.categories = [category];
        // Check the corresponding checkbox
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    applyFilters();
}

function updatePageForCategory(category) {
    const categoryNames = {
        'bedsheets': 'Bed Sheets & Covers',
        'pillows': 'Pillow & Cushion Covers',
        'curtains': 'Curtains & Drapes',
        'rugs': 'Rugs & Carpets',
        'table': 'Table Runners & Cloths',
        'throws': 'Sofa Throws',
        'quilts': 'Quilts & Dohars'
    };
    
    const categoryDescriptions = {
        'bedsheets': 'Luxurious bed sheets and covers crafted with traditional techniques',
        'pillows': 'Elegant pillow and cushion covers to enhance your living space',
        'curtains': 'Beautiful curtains and drapes with traditional Indian patterns',
        'rugs': 'Handwoven rugs and carpets featuring intricate designs',
        'table': 'Elegant table runners and cloths for your dining space',
        'throws': 'Cozy sofa throws perfect for comfort and style',
        'quilts': 'Traditional quilts and dohars for year-round comfort'
    };
    
    const title = document.getElementById('shopTitle');
    const description = document.getElementById('shopDescription');
    const breadcrumb = document.getElementById('currentCategory');
    
    if (title && categoryNames[category]) {
        title.textContent = categoryNames[category];
    }
    
    if (description && categoryDescriptions[category]) {
        description.textContent = categoryDescriptions[category];
    }
    
    if (breadcrumb && categoryNames[category]) {
        breadcrumb.textContent = categoryNames[category];
    }
}

function setupEventListeners() {
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            updateProductsView();
        });
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortProducts();
            loadProducts();
        });
    }
    
    // Filter checkboxes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });
    
    document.querySelectorAll('input[name="color"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });
    
    document.querySelectorAll('input[name="material"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });
    
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', updateFilters);
    });
    
    // Price range
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            currentFilters.maxPrice = parseInt(this.value);
            if (maxPrice) maxPrice.value = this.value;
            debounce(updateFilters, 300)();
        });
    }
    
    if (minPrice) {
        minPrice.addEventListener('input', function() {
            currentFilters.minPrice = parseInt(this.value) || 0;
            debounce(updateFilters, 300)();
        });
    }
    
    if (maxPrice) {
        maxPrice.addEventListener('input', function() {
            currentFilters.maxPrice = parseInt(this.value) || 15000;
            if (priceRange) priceRange.value = this.value;
            debounce(updateFilters, 300)();
        });
    }
    
    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            // Reset all filters
            currentFilters = {
                categories: [],
                colors: [],
                materials: [],
                minPrice: 0,
                maxPrice: 15000,
                rating: 0
            };
            
            // Uncheck all checkboxes and radios
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
            
            // Reset price inputs
            if (minPrice) minPrice.value = '';
            if (maxPrice) maxPrice.value = '';
            if (priceRange) priceRange.value = 15000;
            
            updateFilters();
        });
    }
    
    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    
    if (mobileFilterToggle && filtersSidebar) {
        mobileFilterToggle.addEventListener('click', function() {
            filtersSidebar.classList.toggle('active');
        });
        
        // Close filters when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.filters-sidebar') && !e.target.closest('.mobile-filter-toggle')) {
                filtersSidebar.classList.remove('active');
            }
        });
    }
    
    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
        prevPage.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadProducts();
                scrollToTop();
            }
        });
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                loadProducts();
                scrollToTop();
            }
        });
    }
}

function updateFilters() {
    // Update categories
    currentFilters.categories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    
    // Update colors
    currentFilters.colors = Array.from(document.querySelectorAll('input[name="color"]:checked'))
        .map(cb => cb.value);
    
    // Update materials
    currentFilters.materials = Array.from(document.querySelectorAll('input[name="material"]:checked'))
        .map(cb => cb.value);
    
    // Update rating
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    currentFilters.rating = ratingInput ? parseInt(ratingInput.value) : 0;
    
    applyFilters();
    currentPage = 1; // Reset to first page
    loadProducts();
    updateURL();
}

function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (currentFilters.categories.length > 0 && 
            !currentFilters.categories.includes(product.category)) {
            return false;
        }
        
        // Color filter
        if (currentFilters.colors.length > 0 && 
            !currentFilters.colors.some(color => 
                product.colors.some(productColor => 
                    productColor.toLowerCase().includes(color.toLowerCase())))) {
            return false;
        }
        
        // Material filter
        if (currentFilters.materials.length > 0 && 
            !currentFilters.materials.some(material => 
                product.material.toLowerCase().includes(material.toLowerCase()))) {
            return false;
        }
        
        // Price filter
        if (product.price < currentFilters.minPrice || 
            product.price > currentFilters.maxPrice) {
            return false;
        }
        
        // Rating filter
        if (currentFilters.rating > 0 && product.rating < currentFilters.rating) {
            return false;
        }
        
        return true;
    });
    
    sortProducts();
}

function sortProducts() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.rating - a.rating;
            });
            break;
    }
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Show loading state
    productsGrid.innerHTML = '<div class="loading">Loading products...</div>';
    
    setTimeout(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                    <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
                </div>
            `;
        } else {
            productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        }
        
        updatePagination();
        updateResultsCount();
        updateProductsView();
    }, 500);
}

function updateProductsView() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.className = `products-grid ${currentView}-view`;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    
    // Update prev/next buttons
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
    
    // Update page numbers
    if (pageNumbers) {
        let pagesHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pagesHTML += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" 
                        onclick="goToPage(${i})">${i}</button>
            `;
        }
        
        pageNumbers.innerHTML = pagesHTML;
    }
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (!resultsCount) return;
    
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(currentPage * productsPerPage, filteredProducts.length);
    const total = filteredProducts.length;
    
    resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} results`;
}

function goToPage(page) {
    currentPage = page;
    loadProducts();
    scrollToTop();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function clearAllFilters() {
    document.getElementById('clearFilters').click();
}

function updateURL() {
    const url = new URL(window.location);
    
    // Clear existing category parameter
    url.searchParams.delete('category');
    
    // Add current category if only one is selected
    if (currentFilters.categories.length === 1) {
        url.searchParams.set('category', currentFilters.categories[0]);
    }
    
    // Update URL without reloading the page
    window.history.replaceState({}, '', url);
}

// Utility function for debouncing
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
