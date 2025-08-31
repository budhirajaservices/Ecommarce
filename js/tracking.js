// Order Tracking Page JavaScript

// Initialize tracking page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCartCount();
    
    // Check URL parameters for direct tracking
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    const email = urlParams.get('email');
    
    if (orderId && email) {
        document.getElementById('orderId').value = orderId;
        document.getElementById('email').value = email;
        trackOrder(orderId, email);
    }
});

function setupEventListeners() {
    // Tracking form submission
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', handleTrackingSubmit);
    }
    
    // Order ID input formatting
    const orderIdInput = document.getElementById('orderId');
    if (orderIdInput) {
        orderIdInput.addEventListener('input', function() {
            // Auto-format order ID (remove spaces, convert to uppercase)
            this.value = this.value.replace(/\s/g, '').toUpperCase();
        });
    }
}

function handleTrackingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderId = formData.get('orderId').trim().toUpperCase();
    const email = formData.get('email').trim().toLowerCase();
    
    if (!orderId || !email) {
        showError('Please enter both Order ID and Email Address');
        return;
    }
    
    trackOrder(orderId, email);
}

function trackOrder(orderId, email) {
    const trackingResults = document.getElementById('trackingResults');
    
    // Show loading state
    showLoading();
    
    // Simulate API delay
    setTimeout(() => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => 
            o.orderId === orderId && 
            o.shipping.email.toLowerCase() === email.toLowerCase()
        );
        
        if (order) {
            displayTrackingResults(order);
        } else {
            showError('Order not found. Please check your Order ID and Email Address.');
        }
    }, 1500);
}

function showLoading() {
    const trackingResults = document.getElementById('trackingResults');
    trackingResults.style.display = 'block';
    trackingResults.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <h3>Tracking your order...</h3>
            <p>Please wait while we fetch your order details</p>
        </div>
    `;
    trackingResults.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    const trackingResults = document.getElementById('trackingResults');
    trackingResults.style.display = 'block';
    trackingResults.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Order Not Found</h3>
            <p>${message}</p>
            <div style="margin-top: 20px;">
                <p><strong>Tips:</strong></p>
                <ul style="text-align: left; display: inline-block;">
                    <li>Check your order confirmation email for the correct Order ID</li>
                    <li>Make sure you're using the email address from checkout</li>
                    <li>Order ID should be in format: HH1234567890</li>
                    <li>Contact customer support if you need assistance</li>
                </ul>
            </div>
        </div>
    `;
    trackingResults.scrollIntoView({ behavior: 'smooth' });
}

function displayTrackingResults(order) {
    const trackingResults = document.getElementById('trackingResults');
    
    // Generate tracking timeline based on order status
    const timeline = generateTrackingTimeline(order);
    
    trackingResults.innerHTML = `
        <div class="order-summary">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.orderId}</div>
                    <div class="order-date">Placed on ${new Date(order.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })}</div>
                </div>
                <div class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
            </div>
        </div>

        <div class="tracking-timeline">
            <h3><i class="fas fa-route"></i> Tracking Timeline</h3>
            <div class="timeline">
                ${timeline.map(item => `
                    <div class="timeline-item ${item.status}">
                        <div class="timeline-content">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            ${item.timestamp ? `<div class="timestamp">${item.timestamp}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="order-items">
            <h4><i class="fas fa-box"></i> Order Items (${order.items.length} item${order.items.length !== 1 ? 's' : ''})</h4>
            <div class="items-grid">
                ${order.items.map(item => `
                    <div class="item-card">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                        </div>
                        <div class="item-info">
                            <h5>${item.name}</h5>
                            <p>SKU: HH-${item.id.toString().padStart(4, '0')}</p>
                            ${item.selectedColor ? `<p>Color: ${item.selectedColor}</p>` : ''}
                            ${item.selectedSize ? `<p>Size: ${item.selectedSize}</p>` : ''}
                        </div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="delivery-info">
            <h4><i class="fas fa-map-marker-alt"></i> Delivery Address</h4>
            <div class="delivery-address">
                <strong>${order.shipping.firstName} ${order.shipping.lastName}</strong><br>
                ${order.shipping.address}<br>
                ${order.shipping.apartment ? order.shipping.apartment + '<br>' : ''}
                ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}<br>
                <i class="fas fa-phone"></i> ${order.shipping.phone}
            </div>
        </div>

        ${order.status === 'delivered' ? `
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="reorderItems('${order.orderId}')">
                    <i class="fas fa-redo"></i> Reorder Items
                </button>
                <button class="btn btn-outline" onclick="window.location.href='returns.html?orderId=${order.orderId}&email=${encodeURIComponent(document.getElementById('email').value)}'" style="margin-left: 15px;">
                    <i class="fas fa-undo"></i> Return Item
                </button>
                <button class="btn btn-outline" onclick="downloadInvoice('${order.orderId}')" style="margin-left: 15px;">
                    <i class="fas fa-download"></i> Download Invoice
                </button>
            </div>
        ` : ''}

        ${order.status === 'shipped' ? `
            <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;">
                <h4 style="color: #2d5a2d; margin-bottom: 10px;">
                    <i class="fas fa-truck"></i> Your order is on the way!
                </h4>
                <p style="color: #2d5a2d; margin: 0;">
                    Estimated delivery: ${getEstimatedDelivery(order)} | 
                    <a href="tel:+919876543210" style="color: #2d5a2d;">Call us</a> for any queries
                </p>
            </div>
        ` : ''}
    `;
    
    trackingResults.style.display = 'block';
    trackingResults.scrollIntoView({ behavior: 'smooth' });
}

function generateTrackingTimeline(order) {
    const timeline = [];
    const orderDate = new Date(order.timestamp);
    
    // Order Placed
    timeline.push({
        title: 'Order Placed',
        description: 'Your order has been successfully placed and payment confirmed.',
        timestamp: orderDate.toLocaleDateString('en-IN') + ' at ' + orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed'
    });
    
    if (order.status === 'pending') {
        timeline.push({
            title: 'Processing Order',
            description: 'We are preparing your order for shipment.',
            timestamp: '',
            status: 'active'
        });
    } else {
        // Order Confirmed
        const confirmedDate = new Date(orderDate.getTime() + (2 * 60 * 60 * 1000)); // +2 hours
        timeline.push({
            title: 'Order Confirmed',
            description: 'Your order has been confirmed and is being prepared.',
            timestamp: confirmedDate.toLocaleDateString('en-IN') + ' at ' + confirmedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'completed'
        });
        
        // Packed
        const packedDate = new Date(orderDate.getTime() + (24 * 60 * 60 * 1000)); // +1 day
        timeline.push({
            title: 'Order Packed',
            description: 'Your items have been carefully packed and ready for dispatch.',
            timestamp: packedDate.toLocaleDateString('en-IN') + ' at ' + packedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: order.status === 'confirmed' ? 'active' : 'completed'
        });
    }
    
    if (order.status === 'shipped' || order.status === 'delivered') {
        // Shipped
        const shippedDate = new Date(orderDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // +2 days
        timeline.push({
            title: 'Order Shipped',
            description: 'Your order is on the way to your delivery address.',
            timestamp: shippedDate.toLocaleDateString('en-IN') + ' at ' + shippedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: order.status === 'shipped' ? 'active' : 'completed'
        });
    }
    
    if (order.status === 'delivered') {
        // Delivered
        const deliveredDate = new Date(orderDate.getTime() + (5 * 24 * 60 * 60 * 1000)); // +5 days
        timeline.push({
            title: 'Order Delivered',
            description: 'Your order has been successfully delivered. Thank you for shopping with us!',
            timestamp: deliveredDate.toLocaleDateString('en-IN') + ' at ' + deliveredDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'completed'
        });
    }
    
    if (order.status === 'cancelled') {
        timeline.push({
            title: 'Order Cancelled',
            description: 'Your order has been cancelled. Refund will be processed within 5-7 business days.',
            timestamp: new Date().toLocaleDateString('en-IN') + ' at ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'completed'
        });
    }
    
    return timeline;
}

function getEstimatedDelivery(order) {
    const orderDate = new Date(order.timestamp);
    const deliveryDate = new Date(orderDate.getTime() + (5 * 24 * 60 * 60 * 1000)); // +5 days
    return deliveryDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
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
        showNotification('Items added to cart! Redirecting to cart...', 'success');
        
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
    }
}

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

// Show notification
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
    }, 4000);
}

// Add notification styles if not already present
if (!document.querySelector('#notification-styles')) {
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
            max-width: 350px;
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

    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}
