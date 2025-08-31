// Cart Page JavaScript
let cartItems = [];
let promoCode = null;
let shippingCost = 0;
let taxRate = 0.18; // 18% GST

// Load dynamic coupons from admin system
function getActiveCoupons() {
    const adminCoupons = JSON.parse(localStorage.getItem('adminCoupons')) || [];
    const activeCoupons = {};
    
    adminCoupons.forEach(coupon => {
        // Check if coupon is valid and active
        if (isValidCoupon(coupon)) {
            activeCoupons[coupon.code] = {
                id: coupon.id,
                discount: coupon.discountValue,
                maxDiscount: coupon.maxDiscount,
                minAmount: coupon.minOrderAmount || 0,
                description: coupon.description || `${coupon.type === 'percentage' ? coupon.discountValue + '% off' : '₹' + coupon.discountValue + ' off'}`,
                type: coupon.type,
                freeShipping: coupon.type === 'free-shipping',
                usageLimit: coupon.usageLimit,
                usedCount: coupon.usedCount || 0,
                firstTimeOnly: coupon.firstTimeOnly
            };
        }
    });
    
    return activeCoupons;
}

// Check if coupon is valid
function isValidCoupon(coupon) {
    if (!coupon.isActive) return false;
    
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (now < validFrom || now > validUntil) return false;
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;
    
    return true;
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    setupEventListeners();
    updateCartDisplay();
});

function loadCartItems() {
    cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

function setupEventListeners() {
    // Checkout form validation
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        const inputs = checkoutForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    // PIN code validation
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
        });
        pincodeInput.addEventListener('blur', validatePincode);
    }

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
}

function updateCartDisplay() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutSection = document.getElementById('checkoutSection');
    const cartItemCount = document.getElementById('cartItemCount');

    if (cartItems.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        checkoutSection.style.display = 'none';
        cartItemCount.textContent = '0 items in your cart';
        return;
    }

    cartContent.style.display = 'block';
    emptyCart.style.display = 'none';
    checkoutSection.style.display = 'block';
    
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`;

    renderCartItems();
    updateOrderSummary();
}

function renderCartItems() {
    const cartContent = document.getElementById('cartContent');
    
    const cartItemsHTML = `
        <div class="cart-items">
            ${cartItems.map(item => createCartItemHTML(item)).join('')}
        </div>
        <div class="continue-shopping">
            <a href="shop.html"><i class="fas fa-arrow-left"></i> Continue Shopping</a>
        </div>
    `;
    
    cartContent.innerHTML = cartItemsHTML;
}

function createCartItemHTML(item) {
    const itemTotal = item.price * item.quantity;
    
    return `
        <div class="cart-item" data-item-id="${item.cartId || item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Color: ${item.selectedColor || 'Default'}</p>
                <p>Size: ${item.selectedSize || 'Standard'}</p>
                <p>SKU: HH-${item.id.toString().padStart(4, '0')}</p>
            </div>
            <div class="item-price">₹${item.price.toLocaleString()}</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.cartId || item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                       onchange="updateQuantity(${item.cartId || item.id}, this.value)">
                <button class="quantity-btn" onclick="updateQuantity(${item.cartId || item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.cartId || item.id})" title="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

function updateQuantity(itemId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    if (newQuantity > 10) {
        showNotification('Maximum quantity is 10', 'warning');
        return;
    }
    
    const itemIndex = cartItems.findIndex(item => (item.cartId || item.id) === itemId);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartDisplay();
        updateCartCount();
        showNotification('Quantity updated', 'success');
    }
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => (item.cartId || item.id) !== itemId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartDisplay();
    updateCartCount();
    showNotification('Item removed from cart', 'info');
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const discountRow = document.getElementById('discountRow');
    const taxElement = document.getElementById('tax');
    const finalTotalElement = document.getElementById('finalTotal');

    if (!orderSummary) return;

    // Render summary items
    orderSummary.innerHTML = cartItems.map(item => `
        <div class="summary-item">
            <div class="summary-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="summary-details">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity} × ₹${item.price.toLocaleString()}</p>
            </div>
            <div class="summary-price">₹${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = calculateDiscount(); // Use the updated discount calculation
    let finalShipping = shippingCost;

    // Check for free shipping coupon
    if (promoCode) {
        const activeCoupons = getActiveCoupons();
        const promo = activeCoupons[promoCode];
        if (promo && promo.freeShipping && subtotal >= promo.minAmount) {
            finalShipping = 0;
        }
    }

    // Free shipping for orders above ₹2000
    if (subtotal >= 2000) {
        finalShipping = 0;
    } else if (finalShipping === 0 && (!promoCode || !getActiveCoupons()[promoCode]?.freeShipping)) {
        finalShipping = 150; // Standard shipping charge
    } else if (finalShipping === shippingCost) {
        finalShipping = 150; // Standard shipping charge
    }

    const taxableAmount = subtotal - discount + finalShipping;
    const tax = taxableAmount * taxRate;
    const finalTotal = subtotal - discount + finalShipping + tax;

    // Update display
    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    if (shippingElement) {
        shippingElement.textContent = finalShipping === 0 ? 'Free' : `₹${finalShipping}`;
    }
    if (discountElement && discount > 0) {
        discountElement.textContent = `-₹${discount.toLocaleString()}`;
        discountRow.style.display = 'flex';
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
    if (taxElement) taxElement.textContent = `₹${Math.round(tax).toLocaleString()}`;
    if (finalTotalElement) finalTotalElement.textContent = `₹${Math.round(finalTotal).toLocaleString()}`;
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
        showPromoMessage('Please enter a promo code', 'error');
        return;
    }

    // Get active coupons from admin system
    const activeCoupons = getActiveCoupons();

    if (!activeCoupons[code]) {
        showPromoMessage('Invalid or expired promo code', 'error');
        return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const promo = activeCoupons[code];

    // Check minimum order amount
    if (subtotal < promo.minAmount) {
        showPromoMessage(`Minimum order amount ₹${promo.minAmount.toLocaleString()} required for this code`, 'error');
        return;
    }

    // Check if it's for first-time customers only (simplified check)
    if (promo.firstTimeOnly) {
        const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
        if (existingOrders.length > 0) {
            showPromoMessage('This coupon is only valid for first-time customers', 'error');
            return;
        }
    }

    // Apply the promo code
    promoCode = code;
    showPromoMessage(`Promo code applied: ${promo.description}`, 'success');
    
    // Update coupon usage count in admin system
    updateCouponUsage(promo.id);
    
    updateOrderSummary();
    promoInput.value = '';
}

function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promoMessage');
    if (promoMessage) {
        promoMessage.textContent = message;
        promoMessage.className = `promo-message ${type}`;
    }
}

function proceedToPayment() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (!validateCheckoutForm(checkoutForm)) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    const formData = new FormData(checkoutForm);
    const orderData = {
        items: cartItems,
        shipping: Object.fromEntries(formData.entries()),
        payment: {
            method: formData.get('paymentMethod'),
            subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: shippingCost,
            tax: 0, // Will be calculated
            discount: promoCode ? calculateDiscount() : 0,
            promoCode: promoCode,
            total: 0 // Will be calculated
        },
        timestamp: new Date().toISOString(),
        orderId: generateOrderId()
    };

    // Calculate final amounts
    const subtotal = orderData.payment.subtotal;
    const discount = orderData.payment.discount;
    const shipping = subtotal >= 2000 ? 0 : 150;
    const taxableAmount = subtotal - discount + shipping;
    const tax = Math.round(taxableAmount * taxRate);
    const total = subtotal - discount + shipping + tax;

    orderData.payment.shipping = shipping;
    orderData.payment.tax = tax;
    orderData.payment.total = total;

    // Store order for processing
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Simulate payment processing
    processPayment(orderData);
}

function validateCheckoutForm(form) {
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }

    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid 10-digit phone number');
                return false;
            }
            break;
        case 'pincode':
            if (value && !isValidPincode(value)) {
                showFieldError(field, 'Please enter a valid 6-digit PIN code');
                return false;
            }
            break;
    }

    return true;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function getFieldLabel(field) {
    const label = field.closest('.form-group').querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}

function isValidPincode(pincode) {
    return /^[1-9]\d{5}$/.test(pincode);
}

function validatePincode() {
    const pincodeInput = document.getElementById('pincode');
    const pincode = pincodeInput.value;
    
    if (pincode && isValidPincode(pincode)) {
        // Simulate pincode validation and delivery estimation
        showNotification('PIN code verified. Estimated delivery: 3-5 business days', 'success');
    }
}

function calculateDiscount() {
    if (!promoCode) return 0;
    
    const activeCoupons = getActiveCoupons();
    const promo = activeCoupons[promoCode];
    
    if (!promo) return 0;
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotal < promo.minAmount) return 0;
    
    let discount = 0;
    
    if (promo.type === 'fixed') {
        discount = promo.discount;
    } else if (promo.type === 'percentage') {
        discount = subtotal * (promo.discount / 100);
        // Apply maximum discount limit if specified
        if (promo.maxDiscount && discount > promo.maxDiscount) {
            discount = promo.maxDiscount;
        }
    } else if (promo.type === 'free-shipping') {
        // Free shipping discount is handled separately in shipping calculation
        discount = 0;
    }
    
    return Math.min(discount, subtotal); // Discount cannot exceed subtotal
}

// Update coupon usage count in admin system
function updateCouponUsage(couponId) {
    const adminCoupons = JSON.parse(localStorage.getItem('adminCoupons')) || [];
    const couponIndex = adminCoupons.findIndex(c => c.id === couponId);
    
    if (couponIndex !== -1) {
        adminCoupons[couponIndex].usedCount = (adminCoupons[couponIndex].usedCount || 0) + 1;
        localStorage.setItem('adminCoupons', JSON.stringify(adminCoupons));
    }
}

function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `HH${timestamp}${random}`.slice(-10);
}

function processPayment(orderData) {
    const paymentMethod = orderData.payment.method;
    
    showNotification('Processing payment...', 'info');
    
    // Simulate payment processing delay
    setTimeout(() => {
        switch (paymentMethod) {
            case 'upi':
                processUPIPayment(orderData);
                break;
            case 'card':
                processCardPayment(orderData);
                break;
            case 'netbanking':
                processNetBankingPayment(orderData);
                break;
            case 'cod':
                processCODOrder(orderData);
                break;
            default:
                showNotification('Invalid payment method', 'error');
        }
    }, 2000);
}

function processUPIPayment(orderData) {
    // Simulate UPI payment
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
        completeOrder(orderData, 'UPI Payment Successful');
    } else {
        showNotification('UPI payment failed. Please try again.', 'error');
    }
}

function processCardPayment(orderData) {
    // Simulate card payment
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
        completeOrder(orderData, 'Card Payment Successful');
    } else {
        showNotification('Card payment failed. Please check your card details.', 'error');
    }
}

function processNetBankingPayment(orderData) {
    // Simulate net banking
    const success = Math.random() > 0.08; // 92% success rate
    
    if (success) {
        completeOrder(orderData, 'Net Banking Payment Successful');
    } else {
        showNotification('Net banking payment failed. Please try again.', 'error');
    }
}

function processCODOrder(orderData) {
    // COD orders are always successful
    completeOrder(orderData, 'Order placed successfully. Pay on delivery.');
}

function completeOrder(orderData, message) {
    // Clear cart
    cartItems = [];
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Update order status
    orderData.status = 'confirmed';
    orderData.paymentStatus = orderData.payment.method === 'cod' ? 'pending' : 'completed';
    
    // Store updated order
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.orderId === orderData.orderId);
    if (orderIndex > -1) {
        orders[orderIndex] = orderData;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    showNotification(message, 'success');
    
    // Redirect to order confirmation or account page
    setTimeout(() => {
        window.location.href = `account.html?tab=orders&order=${orderData.orderId}`;
    }, 2000);
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}
