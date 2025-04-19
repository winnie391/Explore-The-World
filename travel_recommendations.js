/**
 * Travel Recommendations Tool for Travel Website
 * Provides personalized travel destination recommendations based on user preferences
 */

// Initialize the recommendations tool
document.addEventListener('DOMContentLoaded', function() {
    const recommendationsForm = document.getElementById('recommendations-form');
    const recommendationResults = document.getElementById('recommendation-results');
    
    if (recommendationsForm) {
        // Handle form submission
        recommendationsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            generateRecommendations();
        });
    }
});

// Destination data for recommendations
const destinationData = [
    {
        id: 1,
        name: 'Bali, Indonesia',
        description: 'A tropical paradise with stunning beaches, lush rice terraces, and unique cultural experiences.',
        image: 'https://source.unsplash.com/600x400/?bali',
        interests: ['beaches', 'culture', 'nature', 'adventure'],
        budget: ['low', 'medium'],
        season: ['spring', 'summer', 'fall']
    },
    {
        id: 2,
        name: 'Kyoto, Japan',
        description: 'An ancient city filled with temples, shrines, and gardens that showcase the best of traditional Japanese culture.',
        image: 'https://source.unsplash.com/600x400/?kyoto',
        interests: ['culture', 'history'],
        budget: ['medium', 'high'],
        season: ['spring', 'fall']
    },
    {
        id: 3,
        name: 'Swiss Alps',
        description: 'Majestic snow-capped mountains offering world-class skiing in winter and spectacular hiking in summer.',
        image: 'https://source.unsplash.com/600x400/?swiss+alps',
        interests: ['mountains', 'adventure', 'nature'],
        budget: ['high'],
        season: ['winter', 'summer']
    },
    {
        id: 4,
        name: 'Costa Rica',
        description: 'A biodiversity hotspot with rainforests, beaches, and abundant wildlife perfect for eco-tourism.',
        image: 'https://source.unsplash.com/600x400/?costa+rica',
        interests: ['beaches', 'nature', 'adventure'],
        budget: ['medium'],
        season: ['winter', 'spring']
    },
    {
        id: 5,
        name: 'Rome, Italy',
        description: 'The Eternal City offers ancient ruins, world-class art, and delicious cuisine at every turn.',
        image: 'https://source.unsplash.com/600x400/?rome',
        interests: ['history', 'culture'],
        budget: ['medium', 'high'],
        season: ['spring', 'fall']
    },
    {
        id: 6,
        name: 'Queenstown, New Zealand',
        description: 'The adventure capital of the world nestled between mountains and a crystal-clear lake.',
        image: 'https://source.unsplash.com/600x400/?queenstown',
        interests: ['mountains', 'adventure', 'nature'],
        budget: ['medium', 'high'],
        season: ['summer', 'fall', 'winter']
    },
    {
        id: 7,
        name: 'Santorini, Greece',
        description: 'Iconic whitewashed buildings with blue domes overlooking the stunning Aegean Sea.',
        image: 'https://source.unsplash.com/600x400/?santorini',
        interests: ['beaches', 'culture', 'history'],
        budget: ['medium', 'high'],
        season: ['spring', 'summer', 'fall']
    },
    {
        id: 8,
        name: 'Marrakech, Morocco',
        description: 'A vibrant city with colorful markets, palaces, and gardens set against the backdrop of the Atlas Mountains.',
        image: 'https://source.unsplash.com/600x400/?marrakech',
        interests: ['culture', 'history'],
        budget: ['low', 'medium'],
        season: ['spring', 'fall']
    },
    {
        id: 9,
        name: 'Machu Picchu, Peru',
        description: 'An ancient Incan citadel set high in the Andes Mountains, offering spectacular views and archaeological wonders.',
        image: 'https://source.unsplash.com/600x400/?machu+picchu',
        interests: ['history', 'mountains', 'adventure'],
        budget: ['medium'],
        season: ['winter', 'spring', 'fall']
    },
    {
        id: 10,
        name: 'Reykjavik, Iceland',
        description: 'A land of fire and ice with stunning landscapes including volcanoes, geysers, hot springs, and glaciers.',
        image: 'https://source.unsplash.com/600x400/?iceland',
        interests: ['nature', 'adventure'],
        budget: ['high'],
        season: ['summer']
    },
    {
        id: 11,
        name: 'Phuket, Thailand',
        description: 'Beautiful beaches, crystal-clear waters, and vibrant nightlife on Thailand\'s largest island.',
        image: 'https://source.unsplash.com/600x400/?phuket',
        interests: ['beaches', 'culture'],
        budget: ['low', 'medium'],
        season: ['winter', 'spring']
    },
    {
        id: 12,
        name: 'Serengeti National Park, Tanzania',
        description: 'Vast plains hosting the spectacular annual migration of millions of wildebeest and zebra.',
        image: 'https://source.unsplash.com/600x400/?serengeti',
        interests: ['nature', 'adventure'],
        budget: ['high'],
        season: ['summer', 'fall']
    },
    {
        id: 13,
        name: 'Barcelona, Spain',
        description: 'A vibrant city known for its unique architecture, art, cuisine, and Mediterranean beaches.',
        image: 'https://source.unsplash.com/600x400/?barcelona',
        interests: ['culture', 'beaches', 'history'],
        budget: ['medium'],
        season: ['spring', 'fall']
    },
    {
        id: 14,
        name: 'Petra, Jordan',
        description: 'An ancient city carved into rose-colored stone cliffs, featuring monumental facades and a rich history.',
        image: 'https://source.unsplash.com/600x400/?petra+jordan',
        interests: ['history', 'culture'],
        budget: ['medium'],
        season: ['spring', 'fall']
    },
    {
        id: 15,
        name: 'Maldives',
        description: 'A tropical paradise of white sandy beaches, crystal-clear waters, and overwater bungalows.',
        image: 'https://source.unsplash.com/600x400/?maldives',
        interests: ['beaches', 'nature'],
        budget: ['high'],
        season: ['winter', 'spring']
    }
];

// Generate travel recommendations based on user preferences
function generateRecommendations() {
    // Get form values
    const selectedInterests = getSelectedCheckboxValues('interests');
    const selectedBudget = getSelectedRadioValue('budget');
    const selectedSeason = document.getElementById('season').value;
    
    // Validate inputs
    if (selectedInterests.length === 0) {
        alert('Please select at least one interest.');
        return;
    }
    
    if (!selectedBudget) {
        alert('Please select a budget level.');
        return;
    }
    
    // Filter destinations based on preferences
    const recommendations = destinationData.filter(destination => {
        // Check if there's at least one matching interest
        const hasMatchingInterest = selectedInterests.some(interest => 
            destination.interests.includes(interest)
        );
        
        // Check if budget matches
        const hasMatchingBudget = destination.budget.includes(selectedBudget);
        
        // Check if season matches
        const hasMatchingSeason = destination.season.includes(selectedSeason);
        
        return hasMatchingInterest && hasMatchingBudget && hasMatchingSeason;
    });
    
    // Sort by number of matching interests (most matches first)
    recommendations.sort((a, b) => {
        const aMatchCount = countMatchingInterests(a, selectedInterests);
        const bMatchCount = countMatchingInterests(b, selectedInterests);
        return bMatchCount - aMatchCount;
    });
    
    // Display recommendations
    displayRecommendations(recommendations);
}

// Count matching interests for sorting
function countMatchingInterests(destination, selectedInterests) {
    return destination.interests.filter(interest => 
        selectedInterests.includes(interest)
    ).length;
}

// Get selected checkbox values
function getSelectedCheckboxValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(checkbox => checkbox.value);
}

// Get selected radio value
function getSelectedRadioValue(name) {
    const selectedRadio = document.querySelector(`input[name="${name}"]:checked`);
    return selectedRadio ? selectedRadio.value : null;
}

// Display recommendations
function displayRecommendations(recommendations) {
    const resultsContainer = document.getElementById('recommendation-results');
    const recommendationsContainer = document.getElementById('recommendations-container');
    
    if (resultsContainer && recommendationsContainer) {
        // Clear previous results
        recommendationsContainer.innerHTML = '';
        
        if (recommendations.length === 0) {
            recommendationsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="alert alert-info">No destinations match your criteria. Try adjusting your preferences.</p>
                </div>
            `;
        } else {
            // Display each recommendation
            recommendations.slice(0, 6).forEach(destination => {
                const matchScore = calculateMatchScore(destination, 
                    getSelectedCheckboxValues('interests'),
                    getSelectedRadioValue('budget'),
                    document.getElementById('season').value
                );
                
                const card = createRecommendationCard(destination, matchScore);
                recommendationsContainer.innerHTML += card;
            });
            
            // Add event listeners to view details buttons
            document.querySelectorAll('.view-details-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const destinationId = this.dataset.id;
                    viewDestinationDetails(destinationId);
                });
            });
        }
        
        // Show results
        resultsContainer.classList.remove('d-none');
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Calculate match score (as a percentage)
function calculateMatchScore(destination, selectedInterests, selectedBudget, selectedSeason) {
    let totalPoints = 0;
    let earnedPoints = 0;
    
    // Interest points (60% of total)
    totalPoints += 60;
    const interestMatches = destination.interests.filter(interest => 
        selectedInterests.includes(interest)
    ).length;
    earnedPoints += (interestMatches / selectedInterests.length) * 60;
    
    // Budget points (20% of total)
    totalPoints += 20;
    if (destination.budget.includes(selectedBudget)) {
        earnedPoints += 20;
    }
    
    // Season points (20% of total)
    totalPoints += 20;
    if (destination.season.includes(selectedSeason)) {
        earnedPoints += 20;
    }
    
    // Calculate percentage
    return Math.round((earnedPoints / totalPoints) * 100);
}

// Create HTML for a recommendation card
function createRecommendationCard(destination, matchScore) {
    // Determine badge classes based on match score
    let matchBadgeClass = 'bg-danger';
    if (matchScore >= 80) {
        matchBadgeClass = 'bg-success';
    } else if (matchScore >= 60) {
        matchBadgeClass = 'bg-primary';
    } else if (matchScore >= 40) {
        matchBadgeClass = 'bg-warning';
    }
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
                <img src="${destination.image}" class="card-img-top" alt="${destination.name}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${destination.name}</h5>
                        <span class="badge ${matchBadgeClass}">${matchScore}% match</span>
                    </div>
                    <p class="card-text">${destination.description}</p>
                    <div class="match-score mb-3">
                        <div class="progress">
                            <div class="progress-bar ${matchBadgeClass}" role="progressbar" style="width: ${matchScore}%;" 
                                aria-valuenow="${matchScore}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-sm btn-outline-primary view-details-btn" data-id="${destination.id}">
                            View Details
                        </button>
                        <small class="text-muted">${getBudgetLabel(destination.budget[0])}</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get human-readable budget label
function getBudgetLabel(budget) {
    const labels = {
        'low': 'Budget-friendly',
        'medium': 'Moderate',
        'high': 'Luxury'
    };
    
    return labels[budget] || budget;
}

// View destination details
function viewDestinationDetails(destinationId) {
    const destination = destinationData.find(dest => dest.id === parseInt(destinationId));
    
    if (!destination) {
        alert('Destination not found');
        return;
    }
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('destination-details-modal');
    
    if (!modal) {
        const modalHTML = `
            <div class="modal fade" id="destination-details-modal" tabindex="-1" aria-labelledby="destinationDetailsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="destinationDetailsModalLabel"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="destination-image mb-3">
                                <img src="" class="img-fluid w-100 rounded" alt="" id="destination-modal-image">
                            </div>
                            <p id="destination-modal-description"></p>
                            <div class="row mt-4">
                                <div class="col-md-4 mb-3">
                                    <h6>Best for</h6>
                                    <div id="destination-modal-interests"></div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <h6>Budget Level</h6>
                                    <div id="destination-modal-budget"></div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <h6>Best Seasons</h6>
                                    <div id="destination-modal-seasons"></div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <a href="#" class="btn btn-primary" id="explore-destination-btn">Explore Further</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('destination-details-modal');
    }
    
    // Populate modal with destination details
    document.getElementById('destinationDetailsModalLabel').textContent = destination.name;
    document.getElementById('destination-modal-image').src = destination.image;
    document.getElementById('destination-modal-image').alt = destination.name;
    document.getElementById('destination-modal-description').textContent = destination.description;
    
    // Interests
    const interestsContainer = document.getElementById('destination-modal-interests');
    interestsContainer.innerHTML = '';
    destination.interests.forEach(interest => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary me-1 mb-1';
        badge.textContent = interest.charAt(0).toUpperCase() + interest.slice(1);
        interestsContainer.appendChild(badge);
    });
    
    // Budget
    const budgetContainer = document.getElementById('destination-modal-budget');
    budgetContainer.innerHTML = '';
    destination.budget.forEach(budget => {
        const badge = document.createElement('span');
        badge.className = `badge me-1 mb-1 ${budget === 'low' ? 'bg-success' : budget === 'medium' ? 'bg-warning' : 'bg-danger'}`;
        badge.textContent = getBudgetLabel(budget);
        budgetContainer.appendChild(badge);
    });
    
    // Seasons
    const seasonsContainer = document.getElementById('destination-modal-seasons');
    seasonsContainer.innerHTML = '';
    destination.season.forEach(season => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary me-1 mb-1';
        badge.textContent = season.charAt(0).toUpperCase() + season.slice(1);
        seasonsContainer.appendChild(badge);
    });
    
    // Update explore button link
    document.getElementById('explore-destination-btn').href = `destinations.html?search=${encodeURIComponent(destination.name)}`;
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Export for use in other modules
window.generateRecommendations = generateRecommendations; 