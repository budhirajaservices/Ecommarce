// Admin Dashboard JavaScript
let currentTab = 'dashboard';
let products = [];
let orders = [];
let customers = [];
let categories = [];
let coupons = [];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminData();
    setupEventListeners();
    loadDashboardData();
});

function initializeAdminData() {
    // Initialize sample data if not exists
    if (!localStorage.getItem('adminProducts')) {
        const sampleProducts = [
            {
                id: 1,
                name: "Royal Silk Bedsheet Set",
                category: "bedsheets",
                price: 2499,
                stock: 25,
                status: "active",
                image: "images/bedsheet-1.jpg",
                description: "Premium silk bedsheet set with traditional patterns",
                sku: "HH-BS-001"
            },
            {
                id: 2,
                name: "Handwoven Cotton Curtains",
                category: "curtains",
                price: 1899,
                stock: 15,
                status: "active",
                image: "images/curtain-1.jpg",
                description: "Beautiful handwoven cotton curtains with ethnic designs",
                sku: "HH-CT-001"
            },
            {
                id: 3,
                name: "Traditional Pillow Covers",
                category: "pillows",
                price: 599,
                stock: 0,
                status: "out-of-stock",
                image: "images/pillow-1.jpg",
                description: "Traditional pillow covers with intricate embroidery",
                sku: "HH-PC-001"
            }
        ];
        localStorage.setItem('adminProducts', JSON.stringify(sampleProducts));
    }

    if (!localStorage.getItem('adminCategories')) {
        const sampleCategories = [
            { id: 1, name: "Bed Sheets", slug: "bedsheets", products: 12, icon: "fas fa-bed" },
            { id: 2, name: "Pillow Covers", slug: "pillows", products: 8, icon: "fas fa-square" },
            { id: 3, name: "Curtains", slug: "curtains", products: 6, icon: "fas fa-window-maximize" },
            { id: 4, name: "Rugs", slug: "rugs", products: 10, icon: "fas fa-th-large" },
            { id: 5, name: "Table Runners", slug: "table", products: 5, icon: "fas fa-table" },
            { id: 6, name: "Sofa Throws", slug: "throws", products: 7, icon: "fas fa-couch" },
            { id: 7, name: "Quilts", slug: "quilts", products: 4, icon: "fas fa-layer-group" }
        ];
        localStorage.setItem('adminCategories', JSON.stringify(sampleCategories));
    }

    // Initialize sample coupons if not exists
    if (!localStorage.getItem('adminCoupons')) {
        const sampleCoupons = [
            {
                id: 1,
                code: 'WELCOME20',
                type: 'percentage',
                discountValue: 20,
                maxDiscount: 500,
                minOrderAmount: 1000,
                usageLimit: 100,
                usedCount: 15,
                validFrom: '2024-01-01T00:00',
                validUntil: '2024-12-31T23:59',
                description: 'Welcome discount for new customers',
                isActive: true,
                firstTimeOnly: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                code: 'SAVE500',
                type: 'fixed',
                discountValue: 500,
                maxDiscount: 500,
                minOrderAmount: 2500,
                usageLimit: 50,
                usedCount: 8,
                validFrom: '2024-01-01T00:00',
                validUntil: '2024-06-30T23:59',
                description: 'Fixed discount on orders above ₹2500',
                isActive: true,
                firstTimeOnly: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                code: 'FREESHIP',
                type: 'free-shipping',
                discountValue: 0,
                maxDiscount: 300,
                minOrderAmount: 1500,
                usageLimit: null,
                usedCount: 45,
                validFrom: '2024-01-01T00:00',
                validUntil: '2024-12-31T23:59',
                description: 'Free shipping on orders above ₹1500',
                isActive: true,
                firstTimeOnly: false,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('adminCoupons', JSON.stringify(sampleCoupons));
    }

    // Load data
    products = JSON.parse(localStorage.getItem('adminProducts')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    customers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    categories = JSON.parse(localStorage.getItem('adminCategories')) || [];
    coupons = JSON.parse(localStorage.getItem('adminCoupons')) || [];
}

function setupEventListeners() {
    // Menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(item.dataset.tab);
        });
    });

    // Search functionality
    const adminSearch = document.getElementById('adminSearch');
    if (adminSearch) {
        adminSearch.addEventListener('input', handleGlobalSearch);
    }

    // Date range filter
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', updateDashboardStats);
    }

    // Product filters
    const productSearch = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (productSearch) productSearch.addEventListener('input', filterProducts);
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (statusFilter) statusFilter.addEventListener('change', filterProducts);

    // Order filters
    const orderSearch = document.getElementById('orderSearch');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderDateFrom = document.getElementById('orderDateFrom');
    const orderDateTo = document.getElementById('orderDateTo');

    if (orderSearch) orderSearch.addEventListener('input', filterOrders);
    if (orderStatusFilter) orderStatusFilter.addEventListener('change', filterOrders);
    if (orderDateFrom) orderDateFrom.addEventListener('change', filterOrders);
    if (orderDateTo) orderDateTo.addEventListener('change', filterOrders);

    // Customer filters
    const customerSearch = document.getElementById('customerSearch');
    if (customerSearch) customerSearch.addEventListener('input', filterCustomers);

    // Coupon filters
    const couponSearch = document.getElementById('couponSearch');
    const couponStatusFilter = document.getElementById('couponStatusFilter');
    const couponTypeFilter = document.getElementById('couponTypeFilter');

    if (couponSearch) couponSearch.addEventListener('input', filterCoupons);
    if (couponStatusFilter) couponStatusFilter.addEventListener('change', filterCoupons);
    if (couponTypeFilter) couponTypeFilter.addEventListener('change', filterCoupons);

    // Coupon form handlers
    const addCouponForm = document.getElementById('addCouponForm');
    const editCouponForm = document.getElementById('editCouponForm');

    if (addCouponForm) addCouponForm.addEventListener('submit', handleAddCoupon);
    if (editCouponForm) editCouponForm.addEventListener('submit', handleEditCoupon);

    // Form submissions
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // Settings forms
    const storeSettingsForm = document.getElementById('storeSettingsForm');
    const paymentSettingsForm = document.getElementById('paymentSettingsForm');
    const shippingSettingsForm = document.getElementById('shippingSettingsForm');

    if (storeSettingsForm) storeSettingsForm.addEventListener('submit', handleStoreSettings);
    if (paymentSettingsForm) paymentSettingsForm.addEventListener('submit', handlePaymentSettings);
    if (shippingSettingsForm) shippingSettingsForm.addEventListener('submit', handleShippingSettings);
}

function switchTab(tab) {
    // Update menu
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Show/hide content
    document.querySelectorAll('.admin-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');

    currentTab = tab;

    // Load tab-specific data
    switch(tab) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'inventory':
            loadInventory();
            break;
        case 'analytics':
        case 'coupons':
            loadCoupons();
            break;
        case 'settings':
            break;
    }
}

function loadDashboardData() {
    updateDashboardStats();
    loadRecentOrders();
}

function updateDashboardStats() {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.payment?.total || 0), 0);
    const totalOrdersCount = orders.length;
    const totalCustomersCount = customers.length;
    const totalProductsCount = products.length;

    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('totalOrders').textContent = totalOrdersCount;
    document.getElementById('totalCustomers').textContent = totalCustomersCount;
    document.getElementById('totalProducts').textContent = totalProductsCount;
}

function loadRecentOrders() {
    const recentOrders = orders.slice(-5).reverse();
    const recentOrdersList = document.getElementById('recentOrdersList');

    if (!recentOrdersList) return;

    if (recentOrders.length === 0) {
        recentOrdersList.innerHTML = '<p>No recent orders</p>';
        return;
    }

    recentOrdersList.innerHTML = recentOrders.map(order => {
        const customer = customers.find(c => c.id === order.userId) || { firstName: 'Guest', lastName: 'User' };
        return `
            <div class="activity-item">
                <div class="activity-avatar">
                    ${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}
                </div>
                <div class="activity-info">
                    <h5>Order #${order.orderId}</h5>
                    <p>${customer.firstName} ${customer.lastName} • ₹${order.payment.total.toLocaleString()}</p>
                </div>
                <div class="activity-time">${new Date(order.timestamp).toLocaleDateString()}</div>
            </div>
        `;
    }).join('');
}

function loadProducts() {
    renderProductsTable(products);
}

function renderProductsTable(productsToRender) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (productsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = productsToRender.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <div class="product-details">
                        <h6>${product.name}</h6>
                        <p>SKU: ${product.sku}</p>
                    </div>
                </div>
            </td>
            <td>${getCategoryName(product.category)}</td>
            <td>₹${product.price.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge ${product.status}">${product.status.replace('-', ' ')}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.sku.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesStatus = !statusFilter || product.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    renderProductsTable(filteredProducts);
}

function loadOrders() {
    renderOrdersTable(orders);
}

function renderOrdersTable(ordersToRender) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (ordersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = ordersToRender.map(order => {
        const customer = customers.find(c => c.id === order.userId) || { firstName: 'Guest', lastName: 'User' };
        return `
            <tr>
                <td>#${order.orderId}</td>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                <td>${order.items.length} item${order.items.length !== 1 ? 's' : ''}</td>
                <td>₹${order.payment.total.toLocaleString()}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="viewOrder('${order.orderId}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="updateOrderStatus('${order.orderId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
    const dateFrom = document.getElementById('orderDateFrom')?.value || '';
    const dateTo = document.getElementById('orderDateTo')?.value || '';

    let filteredOrders = orders.filter(order => {
        const customer = customers.find(c => c.id === order.userId) || { firstName: 'Guest', lastName: 'User' };
        const customerName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        
        const matchesSearch = order.orderId.toLowerCase().includes(searchTerm) || 
                            customerName.includes(searchTerm);
        const matchesStatus = !statusFilter || order.status === statusFilter;
        
        const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
        const matchesDateFrom = !dateFrom || orderDate >= dateFrom;
        const matchesDateTo = !dateTo || orderDate <= dateTo;

        return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    renderOrdersTable(filteredOrders);
}

function loadCustomers() {
    renderCustomersTable(customers);
}

function renderCustomersTable(customersToRender) {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    if (customersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No customers found</td></tr>';
        return;
    }

    tbody.innerHTML = customersToRender.map(customer => {
        const customerOrders = orders.filter(order => order.userId === customer.id);
        const totalSpent = customerOrders.reduce((sum, order) => sum + (order.payment?.total || 0), 0);
        
        return `
            <tr>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customerOrders.length}</td>
                <td>₹${totalSpent.toLocaleString()}</td>
                <td>${new Date(customer.registeredAt || Date.now()).toLocaleDateString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="viewCustomer('${customer.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="editCustomer('${customer.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterCustomers() {
    const searchTerm = document.getElementById('customerSearch')?.value.toLowerCase() || '';

    let filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        return fullName.includes(searchTerm) || 
               customer.email.toLowerCase().includes(searchTerm) ||
               (customer.phone && customer.phone.includes(searchTerm));
    });

    renderCustomersTable(filteredCustomers);
}

function loadCategories() {
    renderCategoriesGrid(categories);
}

function renderCategoriesGrid(categoriesToRender) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = categoriesToRender.map(category => `
        <div class="category-card">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h4>${category.name}</h4>
            <p>Category for ${category.name.toLowerCase()}</p>
            <div class="category-stats">
                <span>${category.products} Products</span>
                <span>Active</span>
            </div>
            <div class="category-actions">
                <button class="btn btn-outline btn-sm" onclick="editCategory(${category.id})">
                    Edit
                </button>
                <button class="btn btn-primary btn-sm" onclick="viewCategoryProducts('${category.slug}')">
                    View Products
                </button>
            </div>
        </div>
    `).join('');
}

function loadInventory() {
    updateInventoryAlerts();
    renderInventoryTable(products);
}

function updateInventoryAlerts() {
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    document.getElementById('lowStockCount').textContent = `${lowStockProducts.length} products running low on stock`;
    document.getElementById('outOfStockCount').textContent = `${outOfStockProducts.length} products out of stock`;
}

function renderInventoryTable(productsToRender) {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = productsToRender.map(product => {
        const reserved = Math.floor(product.stock * 0.1); // Simulate reserved stock
        const available = product.stock - reserved;
        
        return `
            <tr>
                <td>
                    <div class="product-info">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                        </div>
                        <div class="product-details">
                            <h6>${product.name}</h6>
                        </div>
                    </div>
                </td>
                <td>${product.sku}</td>
                <td>${product.stock}</td>
                <td>${reserved}</td>
                <td>${available}</td>
                <td>
                    <span class="status-badge ${product.stock === 0 ? 'out-of-stock' : product.stock <= 5 ? 'pending' : 'active'}">
                        ${product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick="updateStock(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadAnalytics() {
    loadTopProducts();
    loadCustomerInsights();
}

function loadTopProducts() {
    // Simulate top products based on orders
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
    });

    const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([productId, sales]) => {
            const product = products.find(p => p.id == productId);
            return { product, sales };
        })
        .filter(item => item.product);

    const topProductsContainer = document.getElementById('topProducts');
    if (!topProductsContainer) return;

    if (topProducts.length === 0) {
        topProductsContainer.innerHTML = '<p>No sales data available</p>';
        return;
    }

    topProductsContainer.innerHTML = topProducts.map(({ product, sales }) => `
        <div class="top-product">
            <div class="top-product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="top-product-info">
                <h6>${product.name}</h6>
                <p>${getCategoryName(product.category)}</p>
            </div>
            <div class="top-product-sales">${sales} sold</div>
        </div>
    `).join('');
}

function loadCustomerInsights() {
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(c => {
        const registrationDate = new Date(c.registeredAt || Date.now());
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return registrationDate >= thirtyDaysAgo;
    }).length;

    const returningCustomers = customers.filter(c => {
        const customerOrders = orders.filter(o => o.userId === c.id);
        return customerOrders.length > 1;
    }).length;

    const totalRevenue = orders.reduce((sum, order) => sum + (order.payment?.total || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    document.getElementById('newCustomers').textContent = newCustomers;
    document.getElementById('returningCustomers').textContent = returningCustomers;
    document.getElementById('avgOrderValue').textContent = `₹${Math.round(avgOrderValue).toLocaleString()}`;
}

// Modal functions
function showAddProductModal() {
    document.getElementById('addProductModal').classList.add('active');
}

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.remove('active');
    document.getElementById('addProductForm').reset();
}

function showAddCategoryModal() {
    alert('Add Category modal would open here');
}

function showBulkUpdateModal() {
    alert('Bulk Update modal would open here');
}

// CRUD Operations
function handleAddProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newProduct = {
        id: Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        description: formData.get('description'),
        status: 'active',
        image: 'images/placeholder.jpg', // In real app, would handle file upload
        sku: `HH-${formData.get('category').toUpperCase()}-${String(Date.now()).slice(-3)}`
    };

    products.push(newProduct);
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    closeAddProductModal();
    loadProducts();
    showNotification('Product added successfully!', 'success');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Edit product: ${product.name}`);
        // In real app, would open edit modal with product data
    }
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        window.open(`product.html?id=${productId}`, '_blank');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('adminProducts', JSON.stringify(products));
        loadProducts();
        showNotification('Product deleted successfully!', 'success');
    }
}

function viewOrder(orderId) {
    alert(`View order details: ${orderId}`);
}

function updateOrderStatus(orderId) {
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
        const newStatus = prompt('Enter new status (pending, confirmed, shipped, delivered, cancelled):', order.status);
        if (newStatus && ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
            order.status = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            loadOrders();
            showNotification('Order status updated!', 'success');
        }
    }
}

function viewCustomer(customerId) {
    alert(`View customer details: ${customerId}`);
}

function editCustomer(customerId) {
    alert(`Edit customer: ${customerId}`);
}

function editCategory(categoryId) {
    alert(`Edit category: ${categoryId}`);
}

function viewCategoryProducts(categorySlug) {
    switchTab('products');
    setTimeout(() => {
        document.getElementById('categoryFilter').value = categorySlug;
        filterProducts();
    }, 100);
}

function updateStock(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const newStock = prompt('Enter new stock quantity:', product.stock);
        if (newStock !== null && !isNaN(newStock)) {
            product.stock = parseInt(newStock);
            product.status = product.stock === 0 ? 'out-of-stock' : 'active';
            localStorage.setItem('adminProducts', JSON.stringify(products));
            loadInventory();
            showNotification('Stock updated successfully!', 'success');
        }
    }
}

// Settings handlers
function handleStoreSettings(e) {
    e.preventDefault();
    showNotification('Store settings saved!', 'success');
}

function handlePaymentSettings(e) {
    e.preventDefault();
    showNotification('Payment settings saved!', 'success');
}

function handleShippingSettings(e) {
    e.preventDefault();
    showNotification('Shipping settings saved!', 'success');
}

// Utility functions
function getCategoryName(slug) {
    const category = categories.find(c => c.slug === slug);
    return category ? category.name : slug;
}

function handleGlobalSearch() {
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
    // Implement global search functionality
    console.log('Searching for:', searchTerm);
}

function exportOrders() {
    alert('Export orders functionality would be implemented here');
}

function exportCustomers() {
    alert('Export customers functionality would be implemented here');
}

function updateAllStock() {
    alert('Update all stock functionality would be implemented here');
}

function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 90px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        padding: 15px 20px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 2000;
        border-left: 4px solid #007bff;
    }
    
    .notification.success { border-left-color: #28a745; }
    .notification.error { border-left-color: #dc3545; }
    .notification.warning { border-left-color: #ffc107; }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.1rem;
    }
    
    .notification.success i { color: #28a745; }
    .notification.error i { color: #dc3545; }
    .notification.warning i { color: #ffc107; }
    .notification.info i { color: #007bff; }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// ==================== COUPON MANAGEMENT FUNCTIONS ====================

// Load and display coupons
function loadCoupons() {
    coupons = JSON.parse(localStorage.getItem('adminCoupons')) || [];
    renderCouponsTable(coupons);
}

// Render coupons table
function renderCouponsTable(couponsToRender) {
    const tbody = document.getElementById('couponsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    couponsToRender.forEach(coupon => {
        const status = getCouponStatus(coupon);
        const statusClass = status === 'Active' ? 'success' : status === 'Expired' ? 'danger' : 'warning';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${coupon.code}</strong>
                ${coupon.firstTimeOnly ? '<span class="badge badge-info">First Time</span>' : ''}
            </td>
            <td>
                <span class="badge badge-${coupon.type === 'percentage' ? 'primary' : coupon.type === 'fixed' ? 'success' : 'info'}">
                    ${coupon.type === 'percentage' ? 'Percentage' : coupon.type === 'fixed' ? 'Fixed Amount' : 'Free Shipping'}
                </span>
            </td>
            <td>
                ${coupon.type === 'percentage' ? `${coupon.discountValue}%` : 
                  coupon.type === 'fixed' ? `₹${coupon.discountValue}` : 'Free Shipping'}
                ${coupon.maxDiscount && coupon.type === 'percentage' ? `<br><small>Max: ₹${coupon.maxDiscount}</small>` : ''}
            </td>
            <td>₹${coupon.minOrderAmount || 0}</td>
            <td>${coupon.usageLimit || 'Unlimited'}</td>
            <td>${coupon.usedCount || 0}</td>
            <td>${formatDate(coupon.validUntil)}</td>
            <td><span class="status ${statusClass}">${status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editCoupon(${coupon.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleCouponStatus(${coupon.id})" title="${coupon.isActive ? 'Disable' : 'Enable'}">
                        <i class="fas fa-${coupon.isActive ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteCoupon(${coupon.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get coupon status
function getCouponStatus(coupon) {
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    
    if (!coupon.isActive) return 'Disabled';
    if (validUntil < now) return 'Expired';
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 'Exhausted';
    return 'Active';
}

// Filter coupons
function filterCoupons() {
    const searchTerm = document.getElementById('couponSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('couponStatusFilter')?.value || '';
    const typeFilter = document.getElementById('couponTypeFilter')?.value || '';

    let filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm) ||
                            coupon.description.toLowerCase().includes(searchTerm);
        
        const status = getCouponStatus(coupon).toLowerCase();
        const matchesStatus = !statusFilter || status === statusFilter;
        
        const matchesType = !typeFilter || coupon.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    renderCouponsTable(filteredCoupons);
}

// Show add coupon modal
function showAddCouponModal() {
    const modal = document.getElementById('addCouponModal');
    if (modal) {
        // Set default dates
        const now = new Date();
        const validFrom = document.getElementById('addCouponForm').querySelector('[name="validFrom"]');
        const validUntil = document.getElementById('addCouponForm').querySelector('[name="validUntil"]');
        
        if (validFrom) validFrom.value = now.toISOString().slice(0, 16);
        
        const futureDate = new Date(now);
        futureDate.setMonth(futureDate.getMonth() + 3);
        if (validUntil) validUntil.value = futureDate.toISOString().slice(0, 16);
        
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

// Close add coupon modal
function closeAddCouponModal() {
    const modal = document.getElementById('addCouponModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.getElementById('addCouponForm').reset();
    }
}

// Show edit coupon modal
function showEditCouponModal() {
    const modal = document.getElementById('editCouponModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

// Close edit coupon modal
function closeEditCouponModal() {
    const modal = document.getElementById('editCouponModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.getElementById('editCouponForm').reset();
    }
}

// Generate random coupon code
function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('couponCode').value = code;
}

// Toggle discount fields based on coupon type
function toggleDiscountFields() {
    const type = document.getElementById('couponType').value;
    const discountRow = document.getElementById('discountRow');
    const discountLabel = document.getElementById('discountLabel');
    const discountValue = document.getElementById('discountValue');
    const maxDiscount = document.getElementById('maxDiscount');

    if (type === 'free-shipping') {
        discountRow.style.display = 'none';
        discountValue.required = false;
    } else {
        discountRow.style.display = 'flex';
        discountValue.required = true;
        
        if (type === 'percentage') {
            discountLabel.textContent = 'Discount Percentage (%) *';
            discountValue.max = 100;
            discountValue.placeholder = 'e.g., 20';
            maxDiscount.style.display = 'block';
        } else if (type === 'fixed') {
            discountLabel.textContent = 'Discount Amount (₹) *';
            discountValue.max = '';
            discountValue.placeholder = 'e.g., 500';
            maxDiscount.style.display = 'none';
        }
    }
}

// Toggle edit discount fields
function toggleEditDiscountFields() {
    const type = document.getElementById('editCouponType').value;
    const discountRow = document.getElementById('editDiscountRow');
    const discountLabel = document.getElementById('editDiscountLabel');
    const discountValue = document.getElementById('editDiscountValue');
    const maxDiscount = document.getElementById('editMaxDiscount');

    if (type === 'free-shipping') {
        discountRow.style.display = 'none';
        discountValue.required = false;
    } else {
        discountRow.style.display = 'flex';
        discountValue.required = true;
        
        if (type === 'percentage') {
            discountLabel.textContent = 'Discount Percentage (%) *';
            discountValue.max = 100;
            maxDiscount.parentElement.style.display = 'block';
        } else if (type === 'fixed') {
            discountLabel.textContent = 'Discount Amount (₹) *';
            discountValue.max = '';
            maxDiscount.parentElement.style.display = 'none';
        }
    }
}

// Handle add coupon form submission
function handleAddCoupon(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const couponData = {
        id: Date.now(),
        code: formData.get('code').toUpperCase(),
        type: formData.get('type'),
        discountValue: parseFloat(formData.get('discountValue')) || 0,
        maxDiscount: parseFloat(formData.get('maxDiscount')) || null,
        minOrderAmount: parseFloat(formData.get('minOrderAmount')) || 0,
        usageLimit: parseInt(formData.get('usageLimit')) || null,
        usedCount: 0,
        validFrom: formData.get('validFrom'),
        validUntil: formData.get('validUntil'),
        description: formData.get('description') || '',
        isActive: formData.get('isActive') === 'on',
        firstTimeOnly: formData.get('firstTimeOnly') === 'on',
        createdAt: new Date().toISOString()
    };

    // Validate coupon code uniqueness
    if (coupons.some(c => c.code === couponData.code)) {
        showNotification('Coupon code already exists!', 'error');
        return;
    }

    // Validate dates
    if (new Date(couponData.validFrom) >= new Date(couponData.validUntil)) {
        showNotification('Valid until date must be after valid from date!', 'error');
        return;
    }

    coupons.push(couponData);
    localStorage.setItem('adminCoupons', JSON.stringify(coupons));
    
    closeAddCouponModal();
    loadCoupons();
    showNotification('Coupon created successfully!', 'success');
}

// Handle edit coupon form submission
function handleEditCoupon(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const couponId = parseInt(formData.get('couponId'));
    const couponIndex = coupons.findIndex(c => c.id === couponId);
    
    if (couponIndex === -1) {
        showNotification('Coupon not found!', 'error');
        return;
    }

    const updatedCoupon = {
        ...coupons[couponIndex],
        type: formData.get('type'),
        discountValue: parseFloat(formData.get('discountValue')) || 0,
        maxDiscount: parseFloat(formData.get('maxDiscount')) || null,
        minOrderAmount: parseFloat(formData.get('minOrderAmount')) || 0,
        usageLimit: parseInt(formData.get('usageLimit')) || null,
        validFrom: formData.get('validFrom'),
        validUntil: formData.get('validUntil'),
        description: formData.get('description') || '',
        isActive: formData.get('isActive') === 'on',
        firstTimeOnly: formData.get('firstTimeOnly') === 'on',
        updatedAt: new Date().toISOString()
    };

    // Validate dates
    if (new Date(updatedCoupon.validFrom) >= new Date(updatedCoupon.validUntil)) {
        showNotification('Valid until date must be after valid from date!', 'error');
        return;
    }

    coupons[couponIndex] = updatedCoupon;
    localStorage.setItem('adminCoupons', JSON.stringify(coupons));
    
    closeEditCouponModal();
    loadCoupons();
    showNotification('Coupon updated successfully!', 'success');
}

// Edit coupon
function editCoupon(couponId) {
    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon) return;

    // Populate edit form
    document.getElementById('editCouponId').value = coupon.id;
    document.getElementById('editCouponCode').value = coupon.code;
    document.getElementById('editCouponType').value = coupon.type;
    document.getElementById('editDiscountValue').value = coupon.discountValue;
    document.getElementById('editMaxDiscount').value = coupon.maxDiscount || '';
    document.getElementById('editMinOrderAmount').value = coupon.minOrderAmount;
    document.getElementById('editUsageLimit').value = coupon.usageLimit || '';
    document.getElementById('editValidFrom').value = coupon.validFrom;
    document.getElementById('editValidUntil').value = coupon.validUntil;
    document.getElementById('editDescription').value = coupon.description;
    document.getElementById('editIsActive').checked = coupon.isActive;
    document.getElementById('editFirstTimeOnly').checked = coupon.firstTimeOnly;

    toggleEditDiscountFields();
    showEditCouponModal();
}

// Toggle coupon status
function toggleCouponStatus(couponId) {
    const couponIndex = coupons.findIndex(c => c.id === couponId);
    if (couponIndex === -1) return;

    coupons[couponIndex].isActive = !coupons[couponIndex].isActive;
    localStorage.setItem('adminCoupons', JSON.stringify(coupons));
    
    loadCoupons();
    showNotification(`Coupon ${coupons[couponIndex].isActive ? 'enabled' : 'disabled'} successfully!`, 'success');
}

// Delete coupon
function deleteCoupon(couponId) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    const couponIndex = coupons.findIndex(c => c.id === couponId);
    if (couponIndex === -1) return;

    coupons.splice(couponIndex, 1);
    localStorage.setItem('adminCoupons', JSON.stringify(coupons));
    
    loadCoupons();
    showNotification('Coupon deleted successfully!', 'success');
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}
