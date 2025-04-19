// Cache for header content
let headerCache = null;
let headerLoadPromise = null;

// Function to include header with improved error handling and caching
async function includeHeader() {
    try {
        // If header is already being loaded, wait for that promise
        if (headerLoadPromise) {
            await headerLoadPromise;
            return;
        }

        // If header is cached, use it
        if (headerCache) {
            insertHeader(headerCache);
            return;
        }

        // Load header content
        headerLoadPromise = fetch('/components/header.html');
        const response = await headerLoadPromise;
        
        if (!response.ok) {
            throw new Error(`Failed to load header: ${response.status} ${response.statusText}`);
        }

        const headerContent = await response.text();
        headerCache = headerContent; // Cache the header content
        
        insertHeader(headerContent);
    } catch (error) {
        console.error('Error loading header:', error);
        showErrorMessage('Failed to load navigation. Please refresh the page.');
    } finally {
        headerLoadPromise = null;
    }
}

// Function to insert header content
function insertHeader(headerContent) {
    // Create a temporary container
    const temp = document.createElement('div');
    temp.innerHTML = headerContent;
    
    // Insert CSS links at the head
    insertStylesheets(temp);
    
    // Insert the navbar at the start of the body
    insertNavbar(temp);
    
    // Add the scripts at the end of body
    insertScripts(temp);

    // Initialize header functionality
    initializeHeader();
}

// Function to insert stylesheets
function insertStylesheets(container) {
    const cssLinks = container.querySelectorAll('link');
    cssLinks.forEach(link => {
        if (!document.querySelector(`link[href="${link.getAttribute('href')}"]`)) {
            document.head.appendChild(link.cloneNode(true));
        }
    });
    cssLinks.forEach(link => link.remove());
}

// Function to insert navbar
function insertNavbar(container) {
    const navbar = container.querySelector('nav');
    if (navbar) {
        document.body.insertBefore(navbar, document.body.firstChild);
    }
}

// Function to insert scripts
function insertScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
        const scriptSrc = script.getAttribute('src');
        if (scriptSrc && !document.querySelector(`script[src="${scriptSrc}"]`)) {
            document.body.appendChild(script.cloneNode(true));
        } else if (!scriptSrc) {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            if (script.type) newScript.type = script.type;
            document.body.appendChild(newScript);
        }
    });
}

// Function to initialize header functionality
function initializeHeader() {
    // Set active navigation link
    setActiveNavLink();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize language selector
    initializeLanguage();
    
    // Initialize scroll behavior
    initializeScroll();
}

// Function to set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Function to initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
    
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = savedTheme === 'dark';
        themeSwitch.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            document.body.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Function to initialize language
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    const languageSelector = document.querySelector('.language-selector select');
    if (languageSelector) {
        languageSelector.value = savedLanguage;
        languageSelector.addEventListener('change', (e) => {
            localStorage.setItem('language', e.target.value);
            // Here you would typically trigger language change functionality
        });
    }
}

// Function to initialize scroll behavior
function initializeScroll() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.top = '-100px';
        } else {
            navbar.style.top = '0';
        }
        
        lastScroll = currentScroll;
    });
}

// Function to show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger fixed-top text-center';
    errorDiv.style.zIndex = '9999';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Include header when the document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', includeHeader);
} else {
    includeHeader();
} 