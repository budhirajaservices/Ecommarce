// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupFAQ();
});

// Contact Form Setup
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Handle Contact Form Submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    // Validate all fields
    if (!validateForm(form)) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        clearAllErrors(form);
        
        // Track form submission
        trackContactFormSubmission(formData);
        
        showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Validate entire form
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const formGroup = field.closest('.form-group');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Specific field validations
    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'phone':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'firstName':
        case 'lastName':
            if (value && value.length < 2) {
                showFieldError(field, `${getFieldLabel(field)} must be at least 2 characters`);
                return false;
            }
            break;
            
        case 'message':
            if (value && value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters');
                return false;
            }
            break;
    }
    
    // Mark field as valid
    formGroup.classList.add('success');
    return true;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Clear all form errors
function clearAllErrors(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

// Get field label
function getFieldLabel(field) {
    const label = field.closest('.form-group').querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// Show success message
function showSuccessMessage() {
    let successElement = document.querySelector('.success-message');
    
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Thank you for your message! We'll get back to you within 24 hours.
        `;
        
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(successElement, form);
    }
    
    successElement.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 5000);
}

// Simulate form submission
async function simulateFormSubmission(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store form data in localStorage for demo purposes
    const contactSubmissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    const submission = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data: Object.fromEntries(formData.entries())
    };
    
    contactSubmissions.push(submission);
    localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
        throw new Error('Simulated network error');
    }
}

// Track form submission for analytics
function trackContactFormSubmission(formData) {
    // In a real application, you would send this to your analytics service
    console.log('Contact form submitted:', {
        subject: formData.get('subject'),
        timestamp: new Date().toISOString(),
        newsletter: formData.get('newsletter') === 'on'
    });
}

// FAQ Setup
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFAQ(question));
        }
    });
}

// Toggle FAQ Item
function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
        
        // Scroll to item if needed
        setTimeout(() => {
            const rect = faqItem.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isVisible) {
                faqItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 300);
    }
}

// Auto-fill form from URL parameters (for customer support links)
function autoFillFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    const message = urlParams.get('message');
    
    if (subject) {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.value = subject;
        }
    }
    
    if (message) {
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.value = decodeURIComponent(message);
        }
    }
}

// Initialize auto-fill on page load
document.addEventListener('DOMContentLoaded', autoFillFromURL);

// Map interaction (if needed for custom map features)
function initializeMap() {
    // This would be used if implementing custom map features
    // For now, we're using Google Maps embed which handles interaction
    console.log('Map initialized');
}

// Contact form analytics
function trackFormInteraction(action, field = null) {
    // Track user interactions for form optimization
    const event = {
        action,
        field,
        timestamp: new Date().toISOString(),
        page: 'contact'
    };
    
    // Store in localStorage for demo (in production, send to analytics service)
    const interactions = JSON.parse(localStorage.getItem('formInteractions')) || [];
    interactions.push(event);
    localStorage.setItem('formInteractions', JSON.stringify(interactions));
}

// Track form field focus for analytics
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            trackFormInteraction('field_focus', field.name);
        });
        
        field.addEventListener('blur', () => {
            if (field.value.trim()) {
                trackFormInteraction('field_complete', field.name);
            }
        });
    });
});

// Export functions for global access
window.toggleFAQ = toggleFAQ;
