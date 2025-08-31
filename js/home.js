document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;
    const slideIntervalTime = 5000; // 5 seconds

    // Create dots for slider
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('data-slide', index);
            dotsContainer.appendChild(dot);
        });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === slideIndex) {
                slide.classList.add('active');
            }
        });

        // Update active dot
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex].classList.add('active');

        currentSlide = slideIndex;
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    // Start slider
    function startSlider() {
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }

    // Pause slider on hover
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    slider.addEventListener('mouseleave', startSlider);

    // Event listeners
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    // Reset interval function
    function resetInterval() {
        clearInterval(slideInterval);
        startSlider();
    }

    // Handle dot clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('slider-dot')) {
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            goToSlide(slideIndex);
            resetInterval();
        }
    });

    // Initialize slider
    if (slides.length > 0) {
        createDots();
        goToSlide(0);
        startSlider();
    }

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-slide');
    if (testimonials.length > 0) {
        let testimonialIndex = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }
        
        // Initialize first testimonial
        showTestimonial(0);
        
        // Auto-rotate testimonials
        setInterval(() => {
            testimonialIndex = (testimonialIndex + 1) % testimonials.length;
            showTestimonial(testimonialIndex);
        }, 8000);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the email to your server
            console.log('Subscribed with email:', email);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'newsletter-success';
            successMessage.textContent = 'Thank you for subscribing to our newsletter!';
            successMessage.style.color = '#4caf50';
            successMessage.style.marginTop = '15px';
            successMessage.style.fontWeight = '500';
            
            // Remove any existing success messages
            const existingMessage = this.querySelector('.newsletter-success');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            this.appendChild(successMessage);
            this.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
                setTimeout(() => {
                    successMessage.remove();
                }, 500);
            }, 5000);
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3 a').textContent;
                const productPrice = productCard.querySelector('.price').textContent;
                const productImage = productCard.querySelector('img').src;
                
                // Create cart item object
                const cartItem = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                // Here you would typically add the item to the cart in your state management
                console.log('Added to cart:', cartItem);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'add-to-cart-message';
                successMessage.textContent = `${productName} added to cart!`;
                successMessage.style.position = 'fixed';
                successMessage.style.bottom = '20px';
                successMessage.style.left = '50%';
                successMessage.style.transform = 'translateX(-50%)';
                successMessage.style.backgroundColor = '#4caf50';
                successMessage.style.color = 'white';
                successMessage.style.padding = '10px 20px';
                successMessage.style.borderRadius = '4px';
                successMessage.style.zIndex = '1000';
                successMessage.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                successMessage.style.opacity = '0';
                successMessage.style.transition = 'opacity 0.3s ease';
                
                document.body.appendChild(successMessage);
                
                // Trigger reflow
                void successMessage.offsetWidth;
                
                // Show message
                successMessage.style.opacity = '1';
                
                // Update cart count
                updateCartCount();
                
                // Hide message after 3 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 300);
                }, 3000);
            });
        });
    }
    
    // Update cart count function
    function updateCartCount() {
        // This is a placeholder - in a real app, you would get the count from your cart state
        const cartCount = document.querySelectorAll('.cart-icon .badge');
        if (cartCount.length > 0) {
            const currentCount = parseInt(cartCount[0].textContent) || 0;
            cartCount[0].textContent = currentCount + 1;
            // Update all cart count elements
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = currentCount + 1;
            });
        }
    }
    
    // Initialize cart count on page load
    updateCartCount();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
    
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});
