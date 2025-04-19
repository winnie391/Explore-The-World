// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initAnimations();
    initNewsletterForm();
    initLocalStorage();
    initSearchBar();
    initCookieConsent(); // Initialize cookie consent banner
    initThemePreference(); // Initialize theme preference
    initLanguagePreference(); // Initialize language preference
});

// Navbar scroll effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize animations for elements
function initAnimations() {
    // Add fade-in class to section titles when they come into view
    const sectionTitles = document.querySelectorAll('.section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
    
    // Add slide-up animation to cards when they come into view
    const cards = document.querySelectorAll('.destination-card, .tip-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        cardObserver.observe(card);
    });
}

// Newsletter subscription form
function initNewsletterForm() {
    const subscribeBtn = document.getElementById('subscribe-btn');
    const emailInput = document.getElementById('newsletter-email');
    const messageDiv = document.getElementById('newsletter-message');
    
    if (subscribeBtn && emailInput && messageDiv) {
        subscribeBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage('Please enter your email address.', 'text-danger');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'text-danger');
                return;
            }
            
            // Store email in local storage
            saveSubscriber(email);
            
            // Show success message
            showMessage('Thank you for subscribing! You will receive our latest updates.', 'text-success');
            emailInput.value = '';
        });
    }
    
    function showMessage(message, className) {
        messageDiv.textContent = message;
        messageDiv.className = className;
        
        // Clear message after 5 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 5000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function saveSubscriber(email) {
        let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        
        // Check if email already exists
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
        }
    }
}

// Local Storage functionality
function initLocalStorage() {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
        // First time visitor
        localStorage.setItem('hasVisited', 'true');
        
        // You could show a welcome modal or special offer for first-time visitors
        console.log('First time visitor');
    }
    
    // Favorite destinations functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
        const destinationId = button.dataset.id;
        
        // Check if this destination is already a favorite
        if (isFavorite(destinationId)) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        button.addEventListener('click', function() {
            toggleFavorite(destinationId, button);
        });
    });
    
    function isFavorite(id) {
        const favorites = JSON.parse(localStorage.getItem('favoriteDestinations')) || [];
        return favorites.includes(id);
    }
    
    function toggleFavorite(id, button) {
        let favorites = JSON.parse(localStorage.getItem('favoriteDestinations')) || [];
        
        if (favorites.includes(id)) {
            // Remove from favorites
            favorites = favorites.filter(favId => favId !== id);
            button.classList.remove('active');
            button.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            // Add to favorites
            favorites.push(id);
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        localStorage.setItem('favoriteDestinations', JSON.stringify(favorites));
    }
    
    // Recently viewed destinations
    const destinationLinks = document.querySelectorAll('.destination-card a');
    
    destinationLinks.forEach(link => {
        link.addEventListener('click', function() {
            const destinationId = this.closest('.destination-card').dataset.id;
            const destinationName = this.closest('.destination-card').querySelector('.card-title').textContent;
            
            if (destinationId && destinationName) {
                saveRecentlyViewed(destinationId, destinationName);
            }
        });
    });
    
    function saveRecentlyViewed(id, name) {
        let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        
        // Remove if already exists
        recentlyViewed = recentlyViewed.filter(item => item.id !== id);
        
        // Add to beginning of array
        recentlyViewed.unshift({ id, name, timestamp: Date.now() });
        
        // Keep only the 5 most recent
        recentlyViewed = recentlyViewed.slice(0, 5);
        
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
}

// Search bar functionality
function initSearchBar() {
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    
    if (searchInput && searchButton) {
        // Store search history in session storage
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                saveSearchHistory(searchTerm);
                
                // Redirect to search results page (in a real application)
                window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
                
                // For demo purposes, just log the search term
                console.log('Searching for:', searchTerm);
            }
        });
        
        // Also trigger search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
    
    function saveSearchHistory(term) {
        let searchHistory = JSON.parse(sessionStorage.getItem('searchHistory')) || [];
        
        // Add to beginning of array
        searchHistory.unshift({
            term,
            timestamp: Date.now()
        });
        
        // Keep only the 10 most recent searches
        searchHistory = searchHistory.slice(0, 10);
        
        sessionStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// Weather API integration (example)
function getWeatherForDestination(cityName) {
    // This is a placeholder for a real API call
    // In a real application, you would use the OpenWeather API or similar
    console.log(`Getting weather for ${cityName}`);
    
    // Example API call (commented out)
    /*
    const apiKey = 'your_api_key';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Update UI with weather data
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
    */
}

// Cookie consent functionality
function initCookieConsent() {
    // Check if cookie consent banner already exists, if not create it
    if (!document.getElementById('cookie-consent')) {
        createCookieConsentBanner();
    }
    
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');
    const customizeCookiesBtn = document.getElementById('customize-cookies');
    
    if (cookieConsent && acceptCookiesBtn) {
        // Check if user has already accepted cookies
        const cookiesAccepted = getCookie('cookiesAccepted');
        
        if (!cookiesAccepted) {
            // Show cookie consent banner
            cookieConsent.classList.remove('d-none');
            
            // Accept all cookies
            acceptCookiesBtn.addEventListener('click', function() {
                // Set cookie to remember user's choice
                setCookie('cookiesAccepted', 'true', 365);
                setCookie('analyticsCookies', 'true', 365);
                setCookie('marketingCookies', 'true', 365);
                setCookie('functionalCookies', 'true', 365);
                
                // Hide cookie consent banner
                cookieConsent.classList.add('d-none');
            });
            
            // Reject all cookies except necessary
            if (rejectCookiesBtn) {
                rejectCookiesBtn.addEventListener('click', function() {
                    // Set cookie to remember user's choice
                    setCookie('cookiesAccepted', 'false', 365);
                    setCookie('analyticsCookies', 'false', 365);
                    setCookie('marketingCookies', 'false', 365);
                    setCookie('functionalCookies', 'false', 365);
                    
                    // Hide cookie consent banner
                    cookieConsent.classList.add('d-none');
                });
            }
            
            // Show cookie customization modal
            if (customizeCookiesBtn) {
                customizeCookiesBtn.addEventListener('click', function() {
                    const cookieModal = document.getElementById('cookie-settings-modal');
                    if (cookieModal) {
                        // Using Bootstrap modal
                        const modal = new bootstrap.Modal(cookieModal);
                        modal.show();
                    }
                });
            }
        }
    }
    
    // Save cookie preferences from modal
    const saveCookiePreferencesBtn = document.getElementById('save-cookie-preferences');
    if (saveCookiePreferencesBtn) {
        saveCookiePreferencesBtn.addEventListener('click', function() {
            const analyticsCookies = document.getElementById('analytics-cookies').checked;
            const marketingCookies = document.getElementById('marketing-cookies').checked;
            const functionalCookies = document.getElementById('functional-cookies').checked;
            
            setCookie('cookiesAccepted', 'custom', 365);
            setCookie('analyticsCookies', analyticsCookies.toString(), 365);
            setCookie('marketingCookies', marketingCookies.toString(), 365);
            setCookie('functionalCookies', functionalCookies.toString(), 365);
            
            // Hide cookie consent banner
            const cookieConsent = document.getElementById('cookie-consent');
            if (cookieConsent) {
                cookieConsent.classList.add('d-none');
            }
            
            // Close modal if using Bootstrap
            const cookieModal = document.getElementById('cookie-settings-modal');
            if (cookieModal) {
                const modal = bootstrap.Modal.getInstance(cookieModal);
                if (modal) {
                    modal.hide();
                }
            }
        });
    }
}

// Create cookie consent banner dynamically
function createCookieConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.className = 'cookie-consent d-none';
    
    banner.innerHTML = `
        <div class="container">
            <div class="cookie-content">
                <h5>Cookie Consent</h5>
                <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button id="customize-cookies" class="btn btn-outline-light btn-sm">Customize</button>
                    <button id="reject-cookies" class="btn btn-outline-light btn-sm">Reject All</button>
                    <button id="accept-cookies" class="btn btn-light btn-sm">Accept All</button>
                </div>
            </div>
        </div>
    `;
    
    // Create cookie settings modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'cookie-settings-modal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'cookieSettingsModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="cookieSettingsModalLabel">Cookie Settings</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Customize your cookie preferences. Necessary cookies are always enabled as they are essential for the website to function properly.</p>
                    
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="necessary-cookies" checked disabled>
                        <label class="form-check-label" for="necessary-cookies">
                            <strong>Necessary Cookies</strong>
                            <p class="text-muted small mb-0">These cookies are essential for the website to function properly.</p>
                        </label>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="analytics-cookies">
                        <label class="form-check-label" for="analytics-cookies">
                            <strong>Analytics Cookies</strong>
                            <p class="text-muted small mb-0">These cookies help us understand how visitors interact with our website.</p>
                        </label>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="marketing-cookies">
                        <label class="form-check-label" for="marketing-cookies">
                            <strong>Marketing Cookies</strong>
                            <p class="text-muted small mb-0">These cookies are used to track visitors across websites to display relevant advertisements.</p>
                        </label>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="functional-cookies">
                        <label class="form-check-label" for="functional-cookies">
                            <strong>Functional Cookies</strong>
                            <p class="text-muted small mb-0">These cookies enable personalized features and functionality.</p>
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="save-cookie-preferences">Save Preferences</button>
                </div>
            </div>
        </div>
    `;
    
    // Append banner and modal to body
    document.body.appendChild(banner);
    document.body.appendChild(modal);
}

// Cookie utility functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    
    return null;
}

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

// Theme preference using cookies
function initThemePreference() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Check both localStorage and cookie for theme preference
        const localStorageTheme = localStorage.getItem('theme');
        const cookieTheme = getCookie('theme');
        
        // Use localStorage if available, otherwise use cookie, default to light
        const theme = localStorageTheme || cookieTheme || 'light';
        
        // Apply theme
        document.body.setAttribute('data-theme', theme);
        
        // Update toggle state
        if (theme === 'dark') {
            themeToggle.checked = true;
        }
        
        // Listen for changes
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            
            // Update both localStorage and cookie
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            setCookie('theme', newTheme, 365);
            
            // Force a style refresh by triggering a reflow
            void document.body.offsetHeight;
            
            // Allow components to react to theme change
            const event = new CustomEvent('themeChanged', {
                detail: { theme: newTheme }
            });
            document.dispatchEvent(event);
        });
    }
}

// Language preference using cookies
function initLanguagePreference() {
    const languageSelector = document.getElementById('language-selector');
    
    if (languageSelector) {
        // Check if user has a language preference
        const language = getCookie('language') || 'en';
        
        // Set selected language
        languageSelector.value = language;
        
        // Listen for changes
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            setCookie('language', selectedLanguage, 365);
            
            // In a real application, you would reload the page or update the UI
            // window.location.reload();
        });
    }
}

// Gallery Load More functionality
$(document).ready(function() {
    // Remove hardcoded gallery items and rely on Firebase
    $('#load-more').on('click', function() {
        // The loadMoreImages function from gallery.js will handle loading more images
        if (typeof window.loadMoreImages === 'function') {
            window.loadMoreImages();
        }
    });
}); 