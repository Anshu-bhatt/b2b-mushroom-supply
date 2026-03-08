/**
 * B2B Mushroom Supply - Frontend JavaScript
 * Handles API integration, form submission, and interactive features
 */

// Configuration
const CONFIG = {
    // Use runtime-configured API URL in production; fallback to local backend for development.
    API_BASE_URL: (window.__API_BASE_URL && window.__API_BASE_URL.trim()) || 'http://localhost:5000/api',
    ENDPOINTS: {
        PRODUCTS: '/products',
        CATEGORIES: '/products/categories',
        SEARCH: '/products/search',
        INQUIRY: '/inquiry'
    },
    FORM_MESSAGES: {
        LOADING: 'Submitting your inquiry...',
        SUCCESS: 'Thank you! Your inquiry has been submitted successfully. We will contact you within 24 hours.',
        ERROR: 'Sorry, there was an error submitting your inquiry. Please try again or contact us directly.'
    }
};

// Global state
let allProducts = [];
let currentCategory = 'all';
let isLoading = false;

/**
 * API Service - Handle all backend communications
 */
const ApiService = {
    async fetchProducts(category = '') {
        try {
            const url = category 
                ? `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.PRODUCTS}?category=${category}` 
                : `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.PRODUCTS}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    async fetchCategories() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CATEGORIES}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    async submitInquiry(formData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.INQUIRY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Submission failed');
            }

            return data;
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            throw error;
        }
    }
};

/**
 * UI Components - Handle rendering and display logic
 */
const UIComponents = {
    renderCategories(categories) {
        const categoryGrid = document.getElementById('category-grid');
        if (!categoryGrid) return;

        categoryGrid.innerHTML = categories.map(category => `
            <div class="category-card" onclick="filterProducts('${category.id}')">
                <div class="category-header">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                </div>
                <div class="category-content">
                    <div class="category-meta">
                        <span>${category.products} Products</span>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderProducts(products) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        if (products.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p style="font-size: 1.2rem; color: var(--text-secondary);">
                        No products found for the selected category.
                    </p>
                </div>
            `;
            return;
        }

        productGrid.innerHTML = products.map(product => {
            const specEntries = Object.entries(product.specifications || {});
            const applications = product.applications || [];
            
            return `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-header">
                        <span class="product-badge">${this.formatCategoryBadge(product.category)}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                    
                    <div class="product-body">
                        ${specEntries.length > 0 ? `
                            <div class="product-specs">
                                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Specifications</h4>
                                ${specEntries.map(([key, value]) => `
                                    <div class="spec-item">
                                        <span class="spec-label">${this.formatSpecLabel(key)}:</span>
                                        <span class="spec-value">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        ${applications.length > 0 ? `
                            <div class="product-applications">
                                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1rem;">Applications</h4>
                                <div class="application-tags">
                                    ${applications.map(app => `
                                        <span class="application-tag">${app}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="product-footer">
                            <div class="product-price">${product.price?.bulkPricing || 'Contact for pricing'}</div>
                            <button class="btn btn-primary" onclick="openQuoteForm('${product.name}')">
                                Request Quote
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    formatCategoryBadge(category) {
        const badges = {
            fresh: 'Fresh Products',
            dry: 'Dried Products',
            medicinal: 'Medicinal',
            ingredients: 'Ingredients'
        };
        return badges[category] || category.toUpperCase();
    },

    formatSpecLabel(key) {
        return key.replace(/([A-Z])/g, ' $1')
                 .replace(/^./, str => str.toUpperCase())
                 .replace(/^[a-z]/, str => str.toUpperCase());
    },

    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('form-message');
        if (!messageEl) return;

        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    },

    showLoading(show = true) {
        const loadingEl = document.getElementById('loading');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoader = submitBtn?.querySelector('.btn-loader');

        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }

        if (submitBtn) {
            submitBtn.disabled = show;
            if (btnText && btnLoader) {
                btnText.style.display = show ? 'none' : 'inline';
                btnLoader.style.display = show ? 'inline' : 'none';
            }
        }

        isLoading = show;
    }
};

/**
 * Navigation Handler - Smooth scrolling and active states
 */
const NavigationHandler = {
    init() {
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update navbar on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }

            // Update active navigation link
            this.updateActiveNavLink();
            
            // Show/hide back to top button
            this.updateBackToTopButton();
        });

        // Back to top functionality
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    },

    updateBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        }
    }
};

/**
 * Form Handler - Manage inquiry form submission
 */
const FormHandler = {
    init() {
        const form = document.getElementById('inquiryForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (isLoading) return;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate required fields
            const requiredFields = ['name', 'companyName', 'email', 'phone', 'productRequired', 'quantity'];
            const missingFields = requiredFields.filter(field => !data[field] || !data[field].trim());

            if (missingFields.length > 0) {
                UIComponents.showMessage(
                    `Please fill in all required fields: ${missingFields.join(', ')}`,
                    'error'
                );
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                UIComponents.showMessage('Please enter a valid email address.', 'error');
                return;
            }

            try {
                UIComponents.showLoading(true);
                UIComponents.showMessage(CONFIG.FORM_MESSAGES.LOADING, 'info');

                const response = await ApiService.submitInquiry(data);

                if (response.success) {
                    UIComponents.showMessage(CONFIG.FORM_MESSAGES.SUCCESS, 'success');
                    form.reset();
                } else {
                    throw new Error(response.message || 'Submission failed');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                UIComponents.showMessage(
                    error.message || CONFIG.FORM_MESSAGES.ERROR,
                    'error'
                );
            } finally {
                UIComponents.showLoading(false);
            }
        });
    }
};

/**
 * Product Filter Functionality
 */
function filterProducts(category) {
    currentCategory = category;
    
    // Update filter button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category || (category === 'all' && btn.dataset.category === 'all')) {
            btn.classList.add('active');
        }
    });

    // Filter and display products
    const filteredProducts = category === 'all' 
        ? allProducts 
        : allProducts.filter(product => product.category === category);
    
    UIComponents.renderProducts(filteredProducts);
    
    // Smooth scroll to products section
    const productsSection = document.querySelector('.product-listing');
    if (productsSection) {
        const offsetTop = productsSection.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/**
 * Open quote form with pre-selected product
 */
function openQuoteForm(productName) {
    const productSelect = document.getElementById('productRequired');
    if (productSelect) {
        productSelect.value = productName;
    }

    // Scroll to inquiry form
    const inquirySection = document.getElementById('inquiry');
    if (inquirySection) {
        const offsetTop = inquirySection.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Highlight the form briefly
    const formWrapper = document.querySelector('.inquiry-form-wrapper');
    if (formWrapper) {
        formWrapper.style.animationName = 'pulse';
        formWrapper.style.animationDuration = '1s';
        setTimeout(() => {
            formWrapper.style.animationName = '';
        }, 1000);
    }
}

/**
 * Data Loading Functions
 */
async function loadCategories() {
    try {
        const categories = await ApiService.fetchCategories();
        UIComponents.renderCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    try {
        UIComponents.showLoading(true);
        allProducts = await ApiService.fetchProducts();
        UIComponents.renderProducts(allProducts);
        
        // Initialize filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterProducts(btn.dataset.category);
            });
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
        UIComponents.showMessage('Error loading products. Please refresh the page.', 'error');
    } finally {
        UIComponents.showLoading(false);
    }
}

/**
 * Animation and Visual Effects
 */
const AnimationHandler = {
    init() {
        // Add CSS for pulse animation
        if (!document.getElementById('dynamic-styles')) {
            const style = document.createElement('style');
            style.id = 'dynamic-styles';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                
                .fade-in {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeInUp 0.6s ease forwards;
                }
                
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add intersection observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.about-card, .feature-card, .contact-card, .product-card').forEach(el => {
            observer.observe(el);
        });
    }
};

/**
 * Error Handler
 */
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    
    // Show user-friendly error message for critical errors
    if (event.error && event.error.message && event.error.message.includes('fetch')) {
        UIComponents.showMessage(
            'Connection error. Please check your internet connection and try again.',
            'error'
        );
    }
});

/**
 * Initialize Application
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🍄 B2B Mushroom Supply - Initializing...');
    
    try {
        // Initialize all handlers
        NavigationHandler.init();
        FormHandler.init();
        AnimationHandler.init();
        
        // Load data
        await Promise.all([
            loadCategories(),
            loadProducts()
        ]);
        
        console.log('✅ Application initialized successfully');
        
        // Remove any loading overlays
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        UIComponents.showMessage(
            'Failed to load application data. Please refresh the page.',
            'error'
        );
    }
});

/**
 * Service Worker Registration (for production)
 */
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(() => console.log('Service Worker registration failed'));
    });
}

/**
 * Export for testing (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ApiService,
        UIComponents,
        NavigationHandler,
        FormHandler,
        filterProducts,
        openQuoteForm
    };
}