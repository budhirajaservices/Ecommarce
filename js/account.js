// Account Page JavaScript
let currentUser = null;
let isLoggedIn = false;

// Initialize account page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    loadUserData();
});

function checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        showDashboard();
    } else {
        showAuthForms();
    }
}

function showAuthForms() {
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('accountDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('accountDashboard').style.display = 'block';
    updateUserInfo();
    loadDashboardData();
}

function setupEventListeners() {
    // Auth tab switching
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });

    // Form submissions
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Dashboard navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(item.dataset.tab);
        });
    });

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }

    // Add address form
    const addAddressForm = document.getElementById('addAddressForm');
    if (addAddressForm) {
        addAddressForm.addEventListener('submit', handleAddAddress);
    }

    // Password strength checker
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', checkPasswordStrength);
    }

    // Order filter
    const orderFilter = document.getElementById('orderFilter');
    if (orderFilter) {
        orderFilter.addEventListener('change', filterOrders);
    }
}

function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Show/hide forms
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
}

function switchTab(tab) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');

    // Load tab-specific data
    switch(tab) {
        case 'orders':
            loadOrders();
            break;
        case 'wishlist':
            loadWishlist();
            break;
        case 'addresses':
            loadAddresses();
            break;
        case 'profile':
            loadProfile();
            break;
        case 'overview':
            loadOverview();
            break;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Simulate login API call
    try {
        showNotification('Signing in...', 'info');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock authentication - in real app, this would be server-side
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const user = users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // In real app, password would be hashed and verified server-side
        if (user.password !== password) {
            throw new Error('Invalid password');
        }
        
        // Login successful
        currentUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            gender: user.gender || '',
            dateOfBirth: user.dateOfBirth || '',
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        if (remember) {
            localStorage.setItem('rememberUser', 'true');
        }
        
        isLoggedIn = true;
        showNotification('Login successful!', 'success');
        showDashboard();
        
    } catch (error) {
        showNotification(error.message || 'Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    const userData = {
        id: Date.now().toString(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: password, // In real app, this would be hashed
        registeredAt: new Date().toISOString()
    };

    try {
        showNotification('Creating account...', 'info');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        if (users.find(u => u.email === userData.email)) {
            throw new Error('User with this email already exists');
        }
        
        // Save user
        users.push(userData);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // Auto login after registration
        currentUser = {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        isLoggedIn = true;
        
        showNotification('Account created successfully!', 'success');
        showDashboard();
        
    } catch (error) {
        showNotification(error.message || 'Registration failed. Please try again.', 'error');
    }
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('userName').textContent = `Welcome, ${currentUser.firstName}!`;
        document.getElementById('userEmail').textContent = currentUser.email;
    }
}

function loadDashboardData() {
    loadOverview();
    updateCartCount();
}

function loadOverview() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === currentUser?.id || !order.userId);
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update stats
    document.getElementById('totalOrders').textContent = userOrders.length;
    document.getElementById('wishlistCount').textContent = wishlist.length;
    
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.payment?.total || 0), 0);
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString()}`;
    
    // Load recent orders
    const recentOrders = userOrders.slice(-3).reverse();
    const recentOrdersContainer = document.getElementById('recentOrders');
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <div class="recent-order">
            <div class="order-image">
                <img src="${order.items[0]?.image || 'images/placeholder.jpg'}" alt="Order">
            </div>
            <div class="order-info">
                <h5>Order #${order.orderId}</h5>
                <p>${order.items.length} item${order.items.length !== 1 ? 's' : ''} • ₹${order.payment.total.toLocaleString()}</p>
            </div>
            <div class="order-status ${order.status}">${order.status}</div>
        </div>
    `).join('');
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === currentUser?.id || !order.userId);
    const ordersList = document.getElementById('ordersList');
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    renderOrders(userOrders.reverse());
}

function renderOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.orderId}</div>
                    <div class="order-date">${new Date(order.timestamp).toLocaleDateString()}</div>
                </div>
                <div class="order-status ${order.status}">${order.status}</div>
            </div>
            <div class="order-body">
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <div class="order-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="order-item-info">
                                <h6>${item.name}</h6>
                                <p>Qty: ${item.quantity} × ₹${item.price.toLocaleString()}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: ₹${order.payment.total.toLocaleString()}</div>
                    <div class="order-actions">
                        <button class="btn btn-outline btn-sm" onclick="viewOrderDetails('${order.orderId}')">
                            View Details
                        </button>
                        ${order.status === 'delivered' ? 
                            '<button class="btn btn-primary btn-sm" onclick="reorderItems(\'' + order.orderId + '\')">Reorder</button>' : 
                            ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function filterOrders() {
    const filter = document.getElementById('orderFilter').value;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === currentUser?.id || !order.userId);
    
    let filteredOrders = userOrders;
    if (filter !== 'all') {
        filteredOrders = userOrders.filter(order => order.status === filter);
    }
    
    renderOrders(filteredOrders.reverse());
}

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistGrid = document.getElementById('wishlistGrid');
    
    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save items you love for later</p>
                <a href="shop.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }
    
    wishlistGrid.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <button class="remove-wishlist" onclick="removeFromWishlist(${item.id})">
                <i class="fas fa-times"></i>
            </button>
            <div class="wishlist-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="wishlist-info">
                <h4>${item.name}</h4>
                <p>${item.category}</p>
                <div class="wishlist-price">₹${item.price.toLocaleString()}</div>
                <div class="wishlist-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCartFromWishlist(${item.id})">
                        Add to Cart
                    </button>
                    <a href="product.html?id=${item.id}" class="btn btn-outline btn-sm">
                        View Product
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAddresses() {
    const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    const addressesList = document.getElementById('addressesList');
    
    if (addresses.length === 0) {
        addressesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <h3>No saved addresses</h3>
                <p>Add addresses for faster checkout</p>
                <button class="btn btn-primary" onclick="showAddAddressModal()">
                    Add Address
                </button>
            </div>
        `;
        return;
    }
    
    addressesList.innerHTML = addresses.map((address, index) => `
        <div class="address-card ${address.isDefault ? 'default' : ''}">
            <div class="address-header">
                <div class="address-name">${address.name}</div>
                ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            </div>
            <div class="address-details">
                <strong>${address.firstName} ${address.lastName}</strong><br>
                ${address.address}<br>
                ${address.city}, ${address.state} ${address.pincode}<br>
                Phone: ${address.phone}
            </div>
            <div class="address-actions">
                <button class="btn btn-outline btn-sm" onclick="editAddress(${index})">
                    Edit
                </button>
                <button class="btn btn-outline btn-sm" onclick="deleteAddress(${index})">
                    Delete
                </button>
                ${!address.isDefault ? 
                    `<button class="btn btn-primary btn-sm" onclick="setDefaultAddress(${index})">
                        Set Default
                    </button>` : ''}
            </div>
        </div>
    `).join('');
}

function loadProfile() {
    if (currentUser) {
        document.getElementById('profileFirstName').value = currentUser.firstName || '';
        document.getElementById('profileLastName').value = currentUser.lastName || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileGender').value = currentUser.gender || '';
        document.getElementById('profileDOB').value = currentUser.dateOfBirth || '';
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const updatedUser = {
        ...currentUser,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        gender: formData.get('gender'),
        dateOfBirth: formData.get('dateOfBirth')
    };
    
    // Update current user
    currentUser = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in registered users list
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
    
    updateUserInfo();
    showNotification('Profile updated successfully!', 'success');
}

function handlePasswordChange(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmNewPassword = formData.get('confirmNewPassword');
    
    if (newPassword !== confirmNewPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    // In real app, this would be handled server-side
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user || user.password !== currentPassword) {
        showNotification('Current password is incorrect', 'error');
        return;
    }
    
    // Update password
    user.password = newPassword;
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Clear form
    e.target.reset();
    showNotification('Password changed successfully!', 'success');
}

function handleAddAddress(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newAddress = {
        id: Date.now().toString(),
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode'),
        isDefault: formData.get('isDefault') === 'on',
        userId: currentUser.id
    };
    
    const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    
    // If this is set as default, remove default from others
    if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
    }
    
    addresses.push(newAddress);
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    
    closeAddAddressModal();
    loadAddresses();
    showNotification('Address added successfully!', 'success');
}

function showAddAddressModal() {
    document.getElementById('addAddressModal').classList.add('active');
}

function closeAddAddressModal() {
    document.getElementById('addAddressModal').classList.remove('active');
    document.getElementById('addAddressForm').reset();
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        addresses.splice(index, 1);
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        loadAddresses();
        showNotification('Address deleted successfully!', 'success');
    }
}

function setDefaultAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    addresses.forEach((addr, i) => addr.isDefault = i === index);
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    loadAddresses();
    showNotification('Default address updated!', 'success');
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    currentUser = null;
    isLoggedIn = false;
    showAuthForms();
    showNotification('Logged out successfully!', 'success');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthElement = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthElement.style.display = 'none';
        return;
    }
    
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('at least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('lowercase letter');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('uppercase letter');
    
    if (/[0-9]/.test(password)) strength++;
    else feedback.push('number');
    
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('special character');
    
    strengthElement.style.display = 'block';
    
    if (strength < 3) {
        strengthElement.textContent = `Weak password. Add: ${feedback.join(', ')}`;
        strengthElement.className = 'password-strength weak';
    } else if (strength < 5) {
        strengthElement.textContent = 'Medium strength password';
        strengthElement.className = 'password-strength medium';
    } else {
        strengthElement.textContent = 'Strong password';
        strengthElement.className = 'password-strength strong';
    }
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
        loadWishlist();
        showNotification('Wishlist cleared!', 'info');
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    showNotification('Item removed from wishlist', 'info');
}

function addToCartFromWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = wishlist.find(item => item.id === productId);
    
    if (item) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1, cartId: Date.now() });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Item added to cart!', 'success');
    }
}

function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    
    orderDetailsContent.innerHTML = `
        <div class="order-details">
            <div class="order-summary">
                <div class="order-info-grid">
                    <div class="order-info-item">
                        <label>Order ID:</label>
                        <span>#${order.orderId}</span>
                    </div>
                    <div class="order-info-item">
                        <label>Order Date:</label>
                        <span>${new Date(order.timestamp).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}</span>
                    </div>
                    <div class="order-info-item">
                        <label>Status:</label>
                        <span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div class="order-info-item">
                        <label>Payment Method:</label>
                        <span>${order.payment.method.toUpperCase()}</span>
                    </div>
                    <div class="order-info-item">
                        <label>Payment Status:</label>
                        <span class="status-badge ${order.paymentStatus}">${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
                    </div>
                </div>
            </div>

            <div class="shipping-address">
                <h4><i class="fas fa-shipping-fast"></i> Shipping Address</h4>
                <div class="address-details">
                    <p><strong>${order.shipping.firstName} ${order.shipping.lastName}</strong></p>
                    <p>${order.shipping.address}</p>
                    ${order.shipping.apartment ? `<p>${order.shipping.apartment}</p>` : ''}
                    <p>${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}</p>
                    <p><i class="fas fa-phone"></i> ${order.shipping.phone}</p>
                    <p><i class="fas fa-envelope"></i> ${order.shipping.email}</p>
                </div>
            </div>

            <div class="order-items-details">
                <h4><i class="fas fa-box"></i> Order Items</h4>
                <div class="items-list">
                    ${order.items.map(item => `
                        <div class="order-item-detail">
                            <div class="item-image">
                                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                            </div>
                            <div class="item-info">
                                <h5>${item.name}</h5>
                                <p>SKU: HH-${item.id.toString().padStart(4, '0')}</p>
                                ${item.selectedColor ? `<p>Color: ${item.selectedColor}</p>` : ''}
                                ${item.selectedSize ? `<p>Size: ${item.selectedSize}</p>` : ''}
                            </div>
                            <div class="item-quantity">
                                <span>Qty: ${item.quantity}</span>
                            </div>
                            <div class="item-price">
                                <span>₹${item.price.toLocaleString()}</span>
                                <small>each</small>
                            </div>
                            <div class="item-total">
                                <strong>₹${(item.price * item.quantity).toLocaleString()}</strong>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="order-pricing">
                <h4><i class="fas fa-calculator"></i> Order Summary</h4>
                <div class="pricing-details">
                    <div class="pricing-row">
                        <span>Subtotal:</span>
                        <span>₹${order.payment.subtotal.toLocaleString()}</span>
                    </div>
                    ${order.payment.discount > 0 ? `
                        <div class="pricing-row discount">
                            <span>Discount ${order.couponCode ? `(${order.couponCode})` : ''}:</span>
                            <span>-₹${order.payment.discount.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    <div class="pricing-row">
                        <span>Shipping:</span>
                        <span>${order.payment.shipping === 0 ? 'Free' : '₹' + order.payment.shipping.toLocaleString()}</span>
                    </div>
                    <div class="pricing-row">
                        <span>Tax (GST):</span>
                        <span>₹${order.payment.tax.toLocaleString()}</span>
                    </div>
                    <div class="pricing-row total">
                        <span><strong>Total:</strong></span>
                        <span><strong>₹${order.payment.total.toLocaleString()}</strong></span>
                    </div>
                </div>
            </div>

            ${order.status === 'delivered' ? `
                <div class="order-actions-detail">
                    <button class="btn btn-primary" onclick="reorderItems('${order.orderId}')">
                        <i class="fas fa-redo"></i> Reorder Items
                    </button>
                    <button class="btn btn-outline" onclick="downloadInvoice('${order.orderId}')">
                        <i class="fas fa-download"></i> Download Invoice
                    </button>
                </div>
            ` : ''}

            ${order.status === 'shipped' ? `
                <div class="tracking-info">
                    <h4><i class="fas fa-truck"></i> Tracking Information</h4>
                    <p>Your order is on the way! Estimated delivery: 2-3 business days</p>
                    <div class="tracking-steps">
                        <div class="tracking-step completed">
                            <i class="fas fa-check-circle"></i>
                            <span>Order Confirmed</span>
                        </div>
                        <div class="tracking-step completed">
                            <i class="fas fa-box"></i>
                            <span>Packed</span>
                        </div>
                        <div class="tracking-step active">
                            <i class="fas fa-truck"></i>
                            <span>In Transit</span>
                        </div>
                        <div class="tracking-step">
                            <i class="fas fa-home"></i>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Show the modal
    document.getElementById('orderDetailsModal').classList.add('active');
    document.body.classList.add('modal-open');
}

// Close order details modal
function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Download invoice function
function downloadInvoice(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Create invoice content
    const invoiceContent = `
        HERITAGE HANDLOOMS
        Invoice #${order.orderId}
        
        Order Date: ${new Date(order.timestamp).toLocaleDateString('en-IN')}
        
        Bill To:
        ${order.shipping.firstName} ${order.shipping.lastName}
        ${order.shipping.address}
        ${order.shipping.apartment ? order.shipping.apartment + '\n' : ''}${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}
        Phone: ${order.shipping.phone}
        Email: ${order.shipping.email}
        
        Items:
        ${order.items.map(item => 
            `${item.name} - Qty: ${item.quantity} × ₹${item.price.toLocaleString()} = ₹${(item.price * item.quantity).toLocaleString()}`
        ).join('\n')}
        
        Summary:
        Subtotal: ₹${order.payment.subtotal.toLocaleString()}
        ${order.payment.discount > 0 ? `Discount: -₹${order.payment.discount.toLocaleString()}\n` : ''}Shipping: ${order.payment.shipping === 0 ? 'Free' : '₹' + order.payment.shipping.toLocaleString()}
        Tax (GST): ₹${order.payment.tax.toLocaleString()}
        Total: ₹${order.payment.total.toLocaleString()}
        
        Payment Method: ${order.payment.method.toUpperCase()}
        Payment Status: ${order.paymentStatus.toUpperCase()}
        
        Thank you for shopping with Heritage Handlooms!
    `;
    
    // Create and download the invoice as a text file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Invoice downloaded successfully!', 'success');
}

function reorderItems(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (order) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        order.items.forEach(item => {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({ ...item, cartId: Date.now() + Math.random() });
            }
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Items added to cart!', 'success');
    }
}

function loadUserData() {
    // Load cart count
    updateCartCount();
    
    // Check URL parameters for specific tabs
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const orderId = urlParams.get('order');
    
    if (isLoggedIn && tab) {
        setTimeout(() => {
            switchTab(tab);
            if (orderId && tab === 'orders') {
                // Highlight specific order
                setTimeout(() => {
                    const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
                    if (orderCard) {
                        orderCard.scrollIntoView({ behavior: 'smooth' });
                        orderCard.style.border = '2px solid var(--primary-color)';
                    }
                }, 500);
            }
        }, 100);
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}
