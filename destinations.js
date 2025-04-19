// Import destinations data from search.js if needed
const destinationsContainer = document.getElementById('destinations-container');
const regionFilter = document.getElementById('region-filter');
const typeFilter = document.getElementById('type-filter');
const budgetFilter = document.getElementById('budget-filter');
const searchInput = document.getElementById('destination-search');
const searchButton = searchInput?.nextElementSibling;

// Pagination settings
const ITEMS_PER_PAGE = 6;
const LOADING_TIMEOUT = 10000; // 10 seconds timeout for loading
const ANIMATION_DURATION = 300;

// Import Firebase functions
import { 
    collection, 
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { db } from './firebase-config.js';
import { fetchWikivoyageContent } from './wikivoyage-service.js';

// State management
const state = {
    destinations: [],
    filteredDestinations: [],
    currentPage: 1,
    itemsPerPage: 9,
    isLoading: false,
    filters: {
        region: '',
        category: '',
        budget: '',
        search: ''
    },
    favorites: new Set(JSON.parse(localStorage.getItem('favorites') || '[]'))
};


// Check if content is older than 7 days
function isContentStale(lastUpdated) {
    if (!lastUpdated) return true;
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    const lastUpdate = lastUpdated?.toDate?.() || new Date(lastUpdated);
    return Date.now() - lastUpdate.getTime() > ONE_WEEK;
}

// Function to populate filters
function populateFilters() {
    const regions = new Set();
    const types = new Set();
    const budgets = new Set();

    state.destinations.forEach(dest => {
        if (dest.region) regions.add(dest.region);
        if (dest.category) types.add(dest.category);
        if (dest.budget) budgets.add(dest.budget);
    });

    // Populate region filter
    const regionFilter = document.getElementById('region-filter');
    if (regionFilter) {
        populateSelect(regionFilter, Array.from(regions));
    }

    // Populate type filter
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        populateSelect(typeFilter, Array.from(types));
    }

    // Populate budget filter
    const budgetFilter = document.getElementById('budget-filter');
    if (budgetFilter) {
        populateSelect(budgetFilter, Array.from(budgets));
    }
}

// Helper function to populate select elements
function populateSelect(select, options) {
    select.innerHTML = `
        <option value="">All</option>
        ${options.map(option => `
            <option value="${option}">${option}</option>
        `).join('')}
    `;
}

// Function to setup event listeners
function setupEventListeners() {
    // Filter change listeners
    const filterIds = ['region-filter', 'type-filter', 'budget-filter'];
    filterIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', handleFilterChange);
        }
    });

    // Search input listener with debounce
    const searchInput = document.getElementById('destination-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            handleFilterChange();
        }, 300));
    }

    // Search button listener
    const searchButton = document.querySelector('.input-group .btn');
    if (searchButton) {
        searchButton.addEventListener('click', handleFilterChange);
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Function to handle filter changes
function handleFilterChange() {
    // Update filter values
    state.filters.region = document.getElementById('region-filter')?.value || '';
    state.filters.category = document.getElementById('type-filter')?.value || '';
    state.filters.budget = document.getElementById('budget-filter')?.value || '';
    state.filters.search = document.getElementById('destination-search')?.value || '';

    // Apply filters
    applyFilters();
}

// Function to apply filters
function applyFilters() {
    const { region, category, budget, search } = state.filters;
    
    state.filteredDestinations = state.destinations.filter(dest => {
        const matchesRegion = !region || (dest.region && dest.region.toLowerCase() === region.toLowerCase());
        const matchesCategory = !category || (dest.category && dest.category.toLowerCase() === category.toLowerCase());
        const matchesBudget = !budget || (dest.budget && dest.budget.toLowerCase() === budget.toLowerCase());
        const matchesSearch = !search || 
            (dest.name && dest.name.toLowerCase().includes(search.toLowerCase())) ||
            (dest.description && dest.description.toLowerCase().includes(search.toLowerCase()));

        return matchesRegion && matchesCategory && matchesBudget && matchesSearch;
    });

    // Reset to first page and display filtered results
    state.currentPage = 1;
    displayDestinations();
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to display destinations
function displayDestinations() {
    const container = document.getElementById('destinations-container');
    const noResults = document.getElementById('no-results');
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const paginatedDestinations = state.filteredDestinations.slice(start, end);

    if (state.filteredDestinations.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    
    // Create rows with proper grid layout
    const rows = [];
    for (let i = 0; i < paginatedDestinations.length; i += 3) {
        const rowCards = paginatedDestinations.slice(i, i + 3);
        const row = document.createElement('div');
        row.className = 'destinations-row';
        
        // Add actual destination cards
        rowCards.forEach(destination => {
            const card = document.createElement('div');
            card.innerHTML = createDestinationCard(destination);
            row.appendChild(card.firstElementChild);
        });
        
        // Add placeholder cards if needed
        if (rowCards.length < 3 && window.innerWidth >= 1200) {
            const placeholdersNeeded = 3 - rowCards.length;
            for (let j = 0; j < placeholdersNeeded; j++) {
                const placeholder = document.createElement('div');
                placeholder.className = 'destination-card-placeholder';
                row.appendChild(placeholder);
            }
        }
        
        rows.push(row.outerHTML);
    }

    container.innerHTML = rows.join('');
    updatePagination();
    initializeFavoriteButtons();
}

// Enhanced destination card creation with performance optimizations
function createDestinationCard(destination) {
    const hasWikivoyageContent = destination.wikivoyageContent && 
                                destination.wikivoyageContent.description;

    // Simplified image selection with better fallbacks
    let mainImage = '/images/placeholder.jpg';
    if (hasWikivoyageContent && destination.wikivoyageContent.images?.length > 0) {
        const images = destination.wikivoyageContent.images;
        // Prioritize images with destination name
        const destinationNameImage = images.find(img => 
            img.toLowerCase().includes(destination.name.toLowerCase()));
        mainImage = destinationNameImage || images[0];
    } else if (destination.imageUrl) {
        mainImage = destination.imageUrl;
    }

    // Enhanced description processing
    const description = hasWikivoyageContent
        ? destination.wikivoyageContent.description
        : destination.description || 'No description available';
    const truncatedDescription = description.length > 150 
        ? description.substring(0, 150).trim().replace(/[.,!?]?\s*$/, '...') 
        : description;

    // Format budget with icon
    const formattedBudget = destination.budget.charAt(0).toUpperCase() + destination.budget.slice(1).toLowerCase();
    const budgetIcon = getBudgetIcon(destination.budget);
    const categoryIcon = getCategoryIcon(destination.category);

    // Enhanced highlights processing
    const highlights = hasWikivoyageContent && destination.wikivoyageContent.highlights 
        ? destination.wikivoyageContent.highlights
        : [];
    
    // Check if this destination is favorited
    const isFavorited = state.favorites.has(destination.id);
    const favoriteIconClass = isFavorited ? "fas fa-heart" : "far fa-heart";
    
    // Create theme-aware classes for proper dark mode support
    const cardClass = "destination-card";
    const cardBodyClass = "destination-card-body";
    const titleClass = "destination-title";
    const descriptionClass = "destination-description";
    const metaClass = "destination-meta";
    
    return `
    <div class="${cardClass}" data-id="${destination.id}">
        <div class="destination-img-container">
            <img 
                src="${mainImage}" 
                class="card-img" 
                alt="${destination.name}" 
                loading="lazy"
                onerror="this.onerror=null; this.src='/images/placeholder.jpg'"
            >
            <span class="destination-category">
                <i class="${categoryIcon}"></i> ${destination.category}
            </span>
            <div class="destination-actions">
                <button class="favorite-btn" data-id="${destination.id}" aria-label="Add to favorites">
                    <i class="${favoriteIconClass}"></i>
                </button>
                <button class="share-btn" data-id="${destination.id}" aria-label="Share destination">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
        <div class="${cardBodyClass}">
            <h3 class="${titleClass}">
                <a href="destinations-details.html?id=${destination.id}">${destination.name}</a>
            </h3>
            <p class="${descriptionClass}">${truncatedDescription}</p>
            <div class="${metaClass}">
                <span><i class="fas fa-map-marker-alt"></i> ${destination.region}</span>
                <span><i class="${budgetIcon}"></i> ${formattedBudget}</span>
            </div>
            <div class="rating mt-2">
                ${createRatingStars(destination.rating)}
                <span>(${destination.reviewCount || 0})</span>
            </div>
            <a href="destinations-details.html?id=${destination.id}" class="btn btn-sm btn-outline-primary mt-3">View Details</a>
        </div>
    </div>
    `;
}

// New helper function for budget icons
function getBudgetIcon(budget) {
    const icons = {
        'budget': '<i class="fas fa-dollar-sign me-1" aria-hidden="true"></i>',
        'mid-range': '<i class="fas fa-dollar-sign me-1" aria-hidden="true"></i><i class="fas fa-dollar-sign me-1" aria-hidden="true"></i>',
        'luxury': '<i class="fas fa-dollar-sign me-1" aria-hidden="true"></i><i class="fas fa-dollar-sign me-1" aria-hidden="true"></i><i class="fas fa-dollar-sign me-1" aria-hidden="true"></i>'
    };
    return icons[budget.toLowerCase()] || '<i class="fas fa-dollar-sign me-1" aria-hidden="true"></i>';
}

// Enhanced rating stars creation with ARIA support
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return `
        <div class="stars">
            ${Array(fullStars).fill('<i class="fas fa-star text-warning" aria-hidden="true"></i>').join('')}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt text-warning" aria-hidden="true"></i>' : ''}
            ${Array(emptyStars).fill('<i class="far fa-star text-warning" aria-hidden="true"></i>').join('')}
            <span class="ms-1 small" aria-hidden="true">${rating.toFixed(1)}</span>
        </div>
    `;
}

// Helper function to get category icon
function getCategoryIcon(category) {
    const icons = {
        'Beach': 'fa-umbrella-beach',
        'Mountain': 'fa-mountain',
        'City': 'fa-city',
        'Cultural': 'fa-landmark',
        'Adventure': 'fa-hiking',
        'Historical': 'fa-monument',
        'Nature': 'fa-leaf',
        'Island': 'fa-island-tropical',
        'Countryside': 'fa-tree',
        'Urban': 'fa-building',
        'Desert': 'fa-sun',
        'Tropical': 'fa-palm-tree',
        'Snow': 'fa-snowflake',
        'Lake': 'fa-water',
        'Forest': 'fa-tree'
    };
    return icons[category] || 'fa-map-marker-alt';
}

// Update pagination
function updatePagination() {
    const paginationContainer = document.querySelector('.pagination-container');
    const totalPages = Math.ceil(state.filteredDestinations.length / state.itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Destination navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${state.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${state.currentPage - 1})">Previous</a>
                </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${state.currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${state.currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${state.currentPage + 1})">Next</a>
                </li>
            </ul>
        </nav>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Change page
window.changePage = function(page) {
    if (page < 1 || page > Math.ceil(state.filteredDestinations.length / state.itemsPerPage)) {
        return;
    }
    state.currentPage = page;
    displayDestinations();
};

// Handle favorite button clicks
function initializeFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        const destId = button.dataset.destinationId;
        const isFavorite = state.favorites.has(destId);
        
        if (isFavorite) {
            button.querySelector('i').className = 'fas fa-heart';
            button.classList.add('active');
        }

        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isCurrentlyFavorite = this.classList.contains('active');
            
            if (isCurrentlyFavorite) {
                icon.className = 'far fa-heart';
                this.classList.remove('active');
                state.favorites.delete(destId);
            } else {
                icon.className = 'fas fa-heart';
                this.classList.add('active');
                state.favorites.add(destId);
            }

            localStorage.setItem('favorites', JSON.stringify([...state.favorites]));
            animateFavoriteButton(this);
        });
    });
}

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
        messageDiv.textContent = message;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Show loading state
        showLoading();

        // Initialize destinations
        await fetchDestinations();

        // Setup filter event listeners
        setupEventListeners();

        // Hide loading state
        hideLoading();
    } catch (error) {
        console.error('Error initializing destinations:', error);
        showError('Failed to load destinations. Please try again.');
        hideLoading();
    }
});

// Function to show loading state
function showLoading() {
    state.isLoading = true;
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('destinations-container').style.display = 'none';
}

// Function to hide loading state
function hideLoading() {
    state.isLoading = false;
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('destinations-container').style.display = 'block';
}

// Function to show error message
function showError(message) {
    const container = document.getElementById('destinations-container');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            </div>
        `;
    }
}

// Function to clear filters
window.clearFilters = function() {
    state.filters = {
        region: '',
        category: '',
        budget: '',
        search: ''
    };

    // Reset filter elements
    const regionFilter = document.getElementById('region-filter');
    const typeFilter = document.getElementById('type-filter');
    const budgetFilter = document.getElementById('budget-filter');
    const searchInput = document.getElementById('destination-search');

    if (regionFilter) regionFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (budgetFilter) budgetFilter.value = '';
    if (searchInput) searchInput.value = '';

    // Reset filtered destinations and display
    state.filteredDestinations = [...state.destinations];
    state.currentPage = 1;
    displayDestinations();
    
    // Hide active filters section
    const activeFiltersSection = document.getElementById('active-filters');
    if (activeFiltersSection) {
        activeFiltersSection.style.display = 'none';
    }
};

// Filter destinations
function filterDestinations() {
    state.filteredDestinations = state.destinations.filter(destination => {
        const matchesRegion = !state.filters.region || destination.region === state.filters.region;
        const matchesCategory = !state.filters.category || destination.category === state.filters.category;
        const matchesBudget = !state.filters.budget || destination.budget === state.filters.budget;
        const matchesSearch = !state.filters.search || 
            destination.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
            destination.description.toLowerCase().includes(state.filters.search.toLowerCase());

        return matchesRegion && matchesCategory && matchesBudget && matchesSearch;
    });

    state.currentPage = 1;
    displayDestinations();
    updateActiveFilters();
}

// Update active filters display
function updateActiveFilters() {
    const activeFiltersSection = document.getElementById('active-filters');
    const activeFilterTags = document.querySelector('.active-filter-tags');
    const hasActiveFilters = Object.values(state.filters).some(filter => filter);

    if (!hasActiveFilters) {
        activeFiltersSection.style.display = 'none';
        return;
    }

    activeFiltersSection.style.display = 'block';
    activeFilterTags.innerHTML = '';

    Object.entries(state.filters).forEach(([key, value]) => {
        if (value) {
            activeFilterTags.innerHTML += `
                <span class="badge rounded-pill bg-secondary">
                    ${key}: ${value}
                    <button class="btn-close btn-close-white" onclick="clearFilter('${key}')" aria-label="Remove filter"></button>
                </span>
            `;
        }
    });
}

// Clear individual filter
window.clearFilter = function(filterKey) {
    state.filters[filterKey] = '';
    
    // Reset corresponding input
    const inputId = filterKey === 'category' ? 'type-filter' : `${filterKey}-filter`;
    const element = document.getElementById(inputId);
    if (element) {
        element.value = '';
    }

    filterDestinations();
};

// Show destination details in a modal
window.showDestinationDetails = async function(destinationId) {
    const destination = state.destinations.find(d => d.id === destinationId);
    if (!destination) return;

    try {
        const wikivoyageContent = await fetchWikivoyageContent(destination.name);
        // Show destination details in a modal
        const modalContent = createDestinationModal(destination, wikivoyageContent);
        
        // Remove existing modal if present
        const existingModal = document.getElementById('destinationModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        const modal = new bootstrap.Modal(document.getElementById('destinationModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching Wikivoyage content:', error);
        showError('Failed to load destination details');
    }
};

// Helper function to create destination modal
function createDestinationModal(destination, wikivoyageContent) {
    const description = wikivoyageContent?.description || destination.description || 'No description available';
    const highlights = wikivoyageContent?.highlights || [];
    const images = wikivoyageContent?.images || [destination.imageUrl];

    return `
        <div class="modal fade" id="destinationModal" tabindex="-1" aria-labelledby="destinationModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="destinationModalLabel">${destination.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="destinationCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                ${images.map((img, index) => `
                                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                        <img src="${img}" class="d-block w-100" alt="${destination.name}">
                                    </div>
                                `).join('')}
                            </div>
                            ${images.length > 1 ? `
                                <button class="carousel-control-prev" type="button" data-bs-target="#destinationCarousel" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#destinationCarousel" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            ` : ''}
                        </div>
                        <div class="destination-meta mb-3">
                            <span class="badge bg-primary">${destination.region}</span>
                            <span class="badge bg-secondary">${destination.category}</span>
                            <span class="badge bg-info">${destination.budget}</span>
                        </div>
                        <p>${description}</p>
                        ${highlights.length > 0 ? `
                            <div class="highlights mt-4">
                                <h6>Highlights:</h6>
                                <ul class="list-unstyled">
                                    ${highlights.map(highlight => `
                                        <li><i class="fas fa-check-circle text-success me-2"></i>${highlight}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        ${wikivoyageContent?.wikiUrl ? `
                            <a href="${wikivoyageContent.wikiUrl}" target="_blank" class="btn btn-outline-primary">
                                <i class="fas fa-external-link-alt me-1"></i>Read More on Wikivoyage
                            </a>
                        ` : ''}
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Make necessary functions available globally
Object.assign(window, {
    changePage,
    clearFilter,
    showDestinationDetails
});