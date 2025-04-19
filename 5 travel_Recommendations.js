// Travel Recommendations functionality
document.addEventListener('DOMContentLoaded', function() {
    const recommendationsForm = document.getElementById('recommendations-form');
    const recommendationResults = document.getElementById('recommendation-results');
    const recommendationsContainer = document.getElementById('recommendations-container');
    
    if (recommendationsForm) {
        recommendationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const interests = [];
            document.querySelectorAll('input[name="interests"]:checked').forEach(function(checkbox) {
                interests.push(checkbox.value);
            });
            
            const budget = document.querySelector('input[name="budget"]:checked').value;
            const season = document.getElementById('season').value;
            
            // Simple destination recommendations based on selections
            const recommendations = getRecommendations(interests, budget, season);
            
            // Display results
            showRecommendations(recommendations);
        });
    }
    
    function getRecommendations(interests, budget, season) {
        // Sample recommendation logic - in a real app, this would be more sophisticated
        const destinations = [
            {
                name: "Bali, Indonesia",
                description: "Tropical paradise with beautiful beaches and rich culture.",
                image: "bali.jpg",
                tags: ["beaches", "culture", "nature"],
                budgetLevel: ["low", "medium"],
                bestSeasons: ["spring", "fall"]
            },
            {
                name: "Kyoto, Japan",
                description: "Historic city with stunning temples and traditional gardens.",
                image: "kyoto.jpg",
                tags: ["culture", "history"],
                budgetLevel: ["medium", "high"],
                bestSeasons: ["spring", "fall"]
            },
            {
                name: "Swiss Alps",
                description: "Breathtaking mountain scenery and world-class skiing.",
                image: "swiss-alps.jpg",
                tags: ["mountains", "adventure", "nature"],
                budgetLevel: ["medium", "high"],
                bestSeasons: ["winter", "summer"]
            },
            {
                name: "Costa Rica",
                description: "Diverse wildlife, rainforests, and adventure activities.",
                image: "costa-rica.jpg",
                tags: ["adventure", "nature", "beaches"],
                budgetLevel: ["low", "medium"],
                bestSeasons: ["winter", "spring"]
            },
            {
                name: "Rome, Italy",
                description: "Ancient history, incredible architecture, and amazing food.",
                image: "rome.jpg",
                tags: ["history", "culture"],
                budgetLevel: ["medium", "high"],
                bestSeasons: ["spring", "fall"]
            },
            {
                name: "Queenstown, New Zealand",
                description: "Adventure capital with stunning landscapes and outdoor activities.",
                image: "queenstown.jpg",
                tags: ["adventure", "mountains", "nature"],
                budgetLevel: ["medium", "high"],
                bestSeasons: ["summer", "fall"]
            }
        ];
        
        // Filter destinations based on user preferences
        return destinations.filter(dest => {
            const hasMatchingInterest = interests.length === 0 || interests.some(interest => dest.tags.includes(interest));
            const matchesBudget = dest.budgetLevel.includes(budget);
            const matchesSeason = dest.bestSeasons.includes(season);
            
            return hasMatchingInterest && matchesBudget && matchesSeason;
        });
    }
    
    function showRecommendations(recommendations) {
        // Clear previous results
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '';
            
            if (recommendations.length === 0) {
                recommendationsContainer.innerHTML = '<div class="col-12"><p class="text-center">No destinations match your criteria. Try adjusting your preferences.</p></div>';
            } else {
                // Create recommendation cards
                recommendations.forEach(destination => {
                    const card = document.createElement('div');
                    card.className = 'col-md-6 mb-4';
                    
                    card.innerHTML = `
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${destination.name}</h5>
                                <p class="card-text">${destination.description}</p>
                                <div class="d-flex flex-wrap mb-2">
                                    ${destination.tags.map(tag => `<span class="badge bg-primary me-1 mb-1">${tag}</span>`).join('')}
                                </div>
                                <p class="card-text"><small class="text-muted">Best season: ${destination.bestSeasons.join(', ')}</small></p>
                            </div>
                        </div>
                    `;
                    
                    recommendationsContainer.appendChild(card);
                });
            }
            
            // Show results section
            document.getElementById('recommendation-results').classList.remove('d-none');
        }
    }
});