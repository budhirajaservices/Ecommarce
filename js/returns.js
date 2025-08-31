/**
 * Returns Management System
 * Handles both user returns and admin returns management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin (in a real app, this would be handled by server-side authentication)
    const isAdmin = window.location.search.includes('admin=true');
    
    // Initialize the appropriate view based on user role
    initReturnsPage(isAdmin);
    
    // If user is viewing the admin interface, load returns data
    if (isAdmin) {
        loadReturnsData();
    } else {
        // Check for order ID and email in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        const email = urlParams.get('email');
        
        if (orderId && email) {
            document.getElementById('orderNumber').value = orderId;
            document.getElementById('email').value = decodeURIComponent(email);
            // Pre-fetch order details if needed
            fetchOrderDetails(orderId, decodeURIComponent(email));
        }
    }
});

/**
 * Initialize the returns page based on user role
 * @param {boolean} isAdmin - Whether the user is an admin
 */
function initReturnsPage(isAdmin) {
    const userView = document.getElementById('userReturnsView');
    const adminView = document.getElementById('adminReturnsView');
    
    if (isAdmin) {
        userView.style.display = 'none';
        adminView.style.display = 'block';
        setupAdminEventListeners();
        loadReturnsData();
    } else {
        userView.style.display = 'block';
        adminView.style.display = 'none';
        setupUserEventListeners();
    }
}

/**
 * Fetch order details to pre-fill the return form
 * @param {string} orderId - The order ID
 * @param {string} email - The customer's email
 */
function fetchOrderDetails(orderId, email) {
    // Simulate API call to get order details
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => 
        o.orderId === orderId && 
        o.shipping.email.toLowerCase() === email.toLowerCase()
    );
    
    if (order) {
        // Pre-fill order items in the return form
        const itemsContainer = document.getElementById('returnItemsContainer');
        if (itemsContainer) {
            itemsContainer.innerHTML = order.items.map(item => `
                <div class="return-item">
                    <label class="checkbox-container">
                        <input type="checkbox" name="returnItems" value="${item.id}" checked>
                        <span class="checkmark"></span>
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-sku">SKU: HH-${item.id.toString().padStart(4, '0')}</span>
                            ${item.selectedColor ? `<span class="item-variant">Color: ${item.selectedColor}</span>` : ''}
                            ${item.selectedSize ? `<span class="item-variant">Size: ${item.selectedSize}</span>` : ''}
                            <span class="item-quantity">Qty: 
                                <select name="itemQty_${item.id}" class="quantity-select">
                                    ${Array.from({length: item.quantity}, (_, i) => 
                                        `<option value="${i+1}">${i+1}</option>`
                                    ).join('')}
                                </select>
                            </span>
                        </div>
                    </label>
                </div>
            `).join('');
        }
    }
}

/**
 * Set up event listeners for the user view
 */
function setupUserEventListeners() {
    const returnForm = document.getElementById('returnRequestForm');
    const returnMethodInputs = document.querySelectorAll('input[name="returnMethod"]');
    const exchangeItemContainer = document.getElementById('exchangeItemContainer');
    
    // Toggle exchange item dropdown based on return method selection
    returnMethodInputs.forEach(input => {
        input.addEventListener('change', function() {
            exchangeItemContainer.style.display = this.value === 'exchange' ? 'block' : 'none';
        });
    });
    
    // Handle return form submission
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReturnRequest();
        });
    }
    
    // Load user's recent orders for the order number dropdown (in a real app, this would come from the server)
    loadUserOrders();
}

/**
 * Submit a return request
 */
function submitReturnRequest() {
    const orderNumber = document.getElementById('orderNumber').value;
    const email = document.getElementById('email').value;
    const reason = document.getElementById('returnReason').value;
    const details = document.getElementById('returnDetails').value;
    const returnMethod = document.querySelector('input[name="returnMethod"]:checked').value;
    const exchangeItem = document.getElementById('exchangeItem').value;
    
    // Basic validation
    if (!orderNumber || !email || !reason) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // In a real app, this would be an API call to the server
    const returnData = {
        id: 'RET' + Date.now(),
        orderNumber,
        email,
        reason,
        details,
        returnMethod,
        exchangeItem: returnMethod === 'exchange' ? exchangeItem : null,
        status: 'pending',
        date: new Date().toISOString(),
        items: [] // In a real app, this would be populated with the actual items being returned
    };
    
    // Save to localStorage (in a real app, this would be saved to a database)
    saveReturnRequest(returnData);
    
    // Show success message
    showNotification('Your return request has been submitted successfully!', 'success');
    
    // Reset form
    document.getElementById('returnRequestForm').reset();
    
    // If admin is viewing, refresh the returns list
    if (window.location.search.includes('admin=true')) {
        loadReturnsData();
    } else {
        // Show order status to user
        setTimeout(() => {
            alert(`Your return request #${returnData.id} has been received. We'll review it and get back to you within 24 hours.`);
        }, 500);
    }
}

/**
 * Save return request to localStorage
 * @param {Object} returnData - The return request data
 */
function saveReturnRequest(returnData) {
    // Get existing returns or initialize empty array
    const existingReturns = JSON.parse(localStorage.getItem('returns')) || [];
    
    // Add new return
    existingReturns.push(returnData);
    
    // Save back to localStorage
    localStorage.setItem('returns', JSON.stringify(existingReturns));
}

/**
 * Load user's recent orders for the order number dropdown
 */
function loadUserOrders() {
    // In a real app, this would be an API call to get the user's orders
    // For demo purposes, we'll use sample data
    const sampleOrders = [
        { orderNumber: 'ORD' + Math.floor(100000 + Math.random() * 900000), date: '2023-06-15' },
        { orderNumber: 'ORD' + Math.floor(100000 + Math.random() * 900000), date: '2023-06-10' },
        { orderNumber: 'ORD' + Math.floor(100000 + Math.random() * 900000), date: '2023-06-05' }
    ];
    
    const orderNumberInput = document.getElementById('orderNumber');
    if (orderNumberInput) {
        // Convert to datalist for better UX
        orderNumberInput.setAttribute('list', 'orderNumbers');
        
        const datalist = document.createElement('datalist');
        datalist.id = 'orderNumbers';
        
        sampleOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.orderNumber;
            datalist.appendChild(option);
        });
        
        orderNumberInput.parentNode.insertBefore(datalist, orderNumberInput.nextSibling);
    }
}

/**
 * Set up event listeners for the admin view
 */
function setupAdminEventListeners() {
    // Filter returns
    document.getElementById('filterStatus')?.addEventListener('change', loadReturnsData);
    document.getElementById('filterStartDate')?.addEventListener('change', loadReturnsData);
    document.getElementById('filterEndDate')?.addEventListener('change', loadReturnsData);
    document.getElementById('searchReturns')?.addEventListener('input', debounce(loadReturnsData, 300));
    
    // Action buttons
    document.getElementById('refreshReturnsBtn')?.addEventListener('click', loadReturnsData);
    document.getElementById('exportReturnsBtn')?.addEventListener('click', exportReturns);
    
    // Modal buttons
    document.getElementById('closeModalBtn')?.addEventListener('click', closeReturnDetailsModal);
    document.getElementById('approveReturnBtn')?.addEventListener('click', () => updateReturnStatus('approved'));
    document.getElementById('rejectReturnBtn')?.addEventListener('click', () => updateReturnStatus('rejected'));
    document.getElementById('processRefundBtn')?.addEventListener('click', processRefund);
    
    // Close modal when clicking outside
    const modal = document.getElementById('returnDetailsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeReturnDetailsModal();
            }
        });
    }
}

/**
 * Load returns data for the admin view
 */
function loadReturnsData() {
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const startDate = document.getElementById('filterStartDate')?.value;
    const endDate = document.getElementById('filterEndDate')?.value;
    const searchTerm = document.getElementById('searchReturns')?.value.toLowerCase();
    
    // In a real app, this would be an API call to get returns data
    // For demo purposes, we'll use sample data
    let returns = JSON.parse(localStorage.getItem('returns')) || [];
    
    // Apply filters
    if (statusFilter !== 'all') {
        returns = returns.filter(r => r.status === statusFilter);
    }
    
    if (startDate) {
        returns = returns.filter(r => new Date(r.date) >= new Date(startDate));
    }
    
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        returns = returns.filter(r => new Date(r.date) <= end);
    }
    
    if (searchTerm) {
        returns = returns.filter(r => 
            r.orderNumber.toLowerCase().includes(searchTerm) || 
            r.email.toLowerCase().includes(searchTerm) ||
            r.id.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort by date (newest first)
    returns.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render the returns table
    renderReturnsTable(returns);
    
    // Update pagination (in a real app)
    // updatePagination(returns.length);
}

/**
 * Render the returns table with the given data
 * @param {Array} returns - Array of return requests
 */
function renderReturnsTable(returns) {
    const tbody = document.getElementById('returnsTableBody');
    
    if (!tbody) return;
    
    if (returns.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-results">No returns found matching your criteria.</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = returns.map(returnItem => {
        const statusClass = `status-${returnItem.status.replace(' ', '_')}`;
        const formattedDate = new Date(returnItem.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <tr>
                <td>${returnItem.id}</td>
                <td>${returnItem.orderNumber}</td>
                <td>${returnItem.email}</td>
                <td>1 item</td>
                <td>${formatReturnReason(returnItem.reason)}</td>
                <td><span class="status-badge ${statusClass}">${returnItem.status}</span></td>
                <td>${formattedDate}</td>
                <td>
                    <button class="action-btn view-btn" data-return-id="${returnItem.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add click handlers to view buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const returnId = this.getAttribute('data-return-id');
            showReturnDetails(returnId);
        });
    });
}

/**
 * Show return details in a modal
 * @param {string} returnId - The ID of the return to show
 */
function showReturnDetails(returnId) {
    // In a real app, this would be an API call to get the return details
    const returns = JSON.parse(localStorage.getItem('returns')) || [];
    const returnItem = returns.find(r => r.id === returnId);
    
    if (!returnItem) {
        showNotification('Return not found', 'error');
        return;
    }
    
    const modal = document.getElementById('returnDetailsModal');
    const content = document.getElementById('returnDetailsContent');
    const formattedDate = new Date(returnItem.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Format the return details
    content.innerHTML = `
        <div class="return-details">
            <div class="detail-row">
                <span class="detail-label">Return ID:</span>
                <span class="detail-value">${returnItem.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Order Number:</span>
                <span class="detail-value">${returnItem.orderNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Customer Email:</span>
                <span class="detail-value">${returnItem.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge status-${returnItem.status.replace(' ', '_')}">
                    ${returnItem.status}
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date Requested:</span>
                <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Reason:</span>
                <span class="detail-value">${formatReturnReason(returnItem.reason)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Return Method:</span>
                <span class="detail-value">${formatReturnMethod(returnItem.returnMethod)}</span>
            </div>
            ${returnItem.exchangeItem ? `
                <div class="detail-row">
                    <span class="detail-label">Exchange Item:</span>
                    <span class="detail-value">${returnItem.exchangeItem}</span>
                </div>
            ` : ''}
            <div class="detail-row full-width">
                <span class="detail-label">Additional Details:</span>
                <p class="detail-value">${returnItem.details || 'No additional details provided.'}</p>
            </div>
        </div>
    `;
    
    // Show/hide action buttons based on status
    const approveBtn = document.getElementById('approveReturnBtn');
    const rejectBtn = document.getElementById('rejectReturnBtn');
    const processRefundBtn = document.getElementById('processRefundBtn');
    
    if (returnItem.status === 'pending') {
        approveBtn.style.display = 'inline-block';
        rejectBtn.style.display = 'inline-block';
        processRefundBtn.style.display = 'none';
    } else if (returnItem.status === 'approved') {
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
        processRefundBtn.style.display = 'inline-block';
    } else {
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
        processRefundBtn.style.display = 'none';
    }
    
    // Store the current return ID on the modal for later use
    modal.setAttribute('data-current-return', returnId);
    
    // Show the modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

/**
 * Close the return details modal
 */
function closeReturnDetailsModal() {
    const modal = document.getElementById('returnDetailsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
}

/**
 * Update the status of a return
 * @param {string} newStatus - The new status to set
 */
function updateReturnStatus(newStatus) {
    const modal = document.getElementById('returnDetailsModal');
    const returnId = modal.getAttribute('data-current-return');
    
    if (!returnId) return;
    
    // In a real app, this would be an API call to update the return status
    const returns = JSON.parse(localStorage.getItem('returns')) || [];
    const returnIndex = returns.findIndex(r => r.id === returnId);
    
    if (returnIndex === -1) {
        showNotification('Return not found', 'error');
        return;
    }
    
    // Update the status
    returns[returnIndex].status = newStatus;
    
    // Add status update timestamp
    if (!returns[returnIndex].statusUpdates) {
        returns[returnIndex].statusUpdates = [];
    }
    
    returns[returnIndex].statusUpdates.push({
        status: newStatus,
        date: new Date().toISOString(),
        // In a real app, this would be the admin's user ID
        updatedBy: 'Admin'
    });
    
    // Save back to localStorage
    localStorage.setItem('returns', JSON.stringify(returns));
    
    // Show success message
    showNotification(`Return ${newStatus} successfully`, 'success');
    
    // Close the modal and refresh the data
    closeReturnDetailsModal();
    loadReturnsData();
}

/**
 * Process a refund for a return
 */
function processRefund() {
    const modal = document.getElementById('returnDetailsModal');
    const returnId = modal.getAttribute('data-current-return');
    
    if (!returnId) return;
    
    // In a real app, this would integrate with a payment processor
    // For demo purposes, we'll just update the status
    updateReturnStatus('refunded');
    
    // Show success message
    showNotification('Refund processed successfully', 'success');
}

/**
 * Export returns data to CSV
 */
function exportReturns() {
    // In a real app, this would generate and download a CSV file
    // For demo purposes, we'll just show a notification
    showNotification('Exporting returns data...', 'info');
    
    // Simulate export delay
    setTimeout(() => {
        showNotification('Export completed successfully!', 'success');
    }, 1500);
}

/**
 * Format return reason for display
 * @param {string} reason - The reason code
 * @returns {string} Formatted reason text
 */
function formatReturnReason(reason) {
    const reasons = {
        'wrong_item': 'Wrong item received',
        'damaged': 'Item arrived damaged',
        'not_as_described': 'Not as described',
        'no_longer_wanted': 'No longer wanted',
        'better_price': 'Found better price',
        'other': 'Other reason'
    };
    
    return reasons[reason] || reason;
}

/**
 * Format return method for display
 * @param {string} method - The return method code
 * @returns {string} Formatted method text
 */
function formatReturnMethod(method) {
    const methods = {
        'refund': 'Refund to original payment method',
        'exchange': 'Exchange for another item',
        'store_credit': 'Store credit'
    };
    
    return methods[method] || method;
}

/**
 * Show a notification message
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // In a real app, this would show a nice toast notification
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
}

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
