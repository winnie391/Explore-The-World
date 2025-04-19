// Image preloader utility
class ImagePreloader {
    static preloadImages(imageUrls) {
        return Promise.all(imageUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => reject(url);
                img.src = url;
            });
        }));
    }
}

class TravelRecommendations {
    constructor() {
        this.destinations = [
            {
                name: "Swiss Alps, Switzerland",
                interests: ["mountains", "adventure"],
                budget: "high",
                seasons: ["winter", "summer"],
                description: "Perfect for skiing in winter and hiking in summer",
                activities: ["skiing", "hiking", "snowboarding", "mountain climbing"],
                imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a",
                fallbackImageUrl: "https://images.unsplash.com/photo-1452441205352-7d4ab5aaad5b"
            },
            {
                name: "Bali, Indonesia",
                interests: ["beaches", "culture"],
                budget: "medium",
                seasons: ["spring", "summer", "fall"],
                description: "Tropical paradise with rich cultural heritage",
                activities: ["surfing", "temple visits", "beach relaxation", "yoga"],
                imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
                fallbackImageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62"
            },
            {
                name: "Iceland",
                interests: ["adventure", "nature"],
                budget: "high",
                seasons: ["winter"],
                description: "Northern Lights and dramatic landscapes",
                activities: ["northern lights viewing", "ice caves", "hot springs", "glacier hiking"],
                imageUrl: "https://images.unsplash.com/photo-1520769945061-0a448c463865",
                fallbackImageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67"
            },
            {
                name: "Petra, Jordan",
                interests: ["history", "culture"],
                budget: "medium",
                seasons: ["spring", "fall"],
                description: "Ancient city carved in rose-colored rock",
                activities: ["archaeological tours", "desert camping", "historical sites", "photography"],
                imageUrl: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3",
                fallbackImageUrl: "https://images.unsplash.com/photo-1548191654-102c76d4b61c"
            },
            {
                name: "Costa Rica",
                interests: ["adventure", "nature", "beaches"],
                budget: "medium",
                seasons: ["winter", "spring"],
                description: "Rainforests, volcanoes, and beautiful beaches",
                activities: ["zip-lining", "surfing", "wildlife watching", "hiking"],
                imageUrl: "https://images.unsplash.com/photo-1518181835702-6eef8b4b2113",
                fallbackImageUrl: "https://images.unsplash.com/photo-1536708880921-03a9306ec47d"
            },
            {
                name: "Kyoto, Japan",
                interests: ["culture", "history"],
                budget: "high",
                seasons: ["spring", "fall"],
                description: "Traditional Japanese culture and cherry blossoms",
                activities: ["temple visits", "tea ceremonies", "garden tours", "cultural workshops"],
                imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
                fallbackImageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9"
            },
            {
                name: "Queenstown, New Zealand",
                interests: ["adventure", "mountains"],
                budget: "high",
                seasons: ["summer", "winter"],
                description: "Adventure capital of the world",
                activities: ["bungee jumping", "skiing", "hiking", "skydiving"],
                imageUrl: "https://images.unsplash.com/photo-1589871973318-9ca1258faa5d",
                fallbackImageUrl: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884"
            },
            {
                name: "Maldives",
                interests: ["beaches", "luxury"],
                budget: "high",
                seasons: ["winter", "spring"],
                description: "Luxury overwater villas and pristine beaches",
                activities: ["snorkeling", "diving", "spa treatments", "water sports"],
                imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
                fallbackImageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd"
            }
        ];

        // Preload all images when class is instantiated
        this.preloadAllImages();
    }

    async preloadAllImages() {
        const imageUrls = this.destinations.flatMap(dest => [dest.imageUrl, dest.fallbackImageUrl]);
        try {
            await ImagePreloader.preloadImages(imageUrls);
            console.log('All images preloaded successfully');
        } catch (error) {
            console.warn('Some images failed to preload:', error);
        }
    }

    // Calculate match score between user preferences and destination
    calculateMatchScore(destination, preferences) {
        let score = 0;
        
        // Interest match (highest weight)
        const interestMatch = destination.interests.some(interest => 
            preferences.interests.includes(interest));
        if (interestMatch) score += 5;

        // Budget match
        if (destination.budget === preferences.budget) score += 3;

        // Season match
        const seasonMatch = destination.seasons.includes(preferences.season);
        if (seasonMatch) score += 4;

        return score;
    }

    // Get recommendations based on user preferences
    getRecommendations(preferences) {
        // Calculate scores for all destinations
        const scoredDestinations = this.destinations.map(destination => ({
            ...destination,
            score: this.calculateMatchScore(destination, preferences)
        }));

        // Sort by score (highest first) and filter out low matches
        return scoredDestinations
            .filter(dest => dest.score > 3) // Minimum match threshold
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Return top 5 matches
    }

    // Format recommendations for display
    formatRecommendation(destination) {
        return {
            name: destination.name,
            description: destination.description,
            activities: destination.activities,
            imageUrl: destination.imageUrl,
            fallbackImageUrl: destination.fallbackImageUrl,
            interests: destination.interests,
            matchScore: Math.round((destination.score / 12) * 100) // Convert score to percentage
        };
    }

    // Main recommendation function
    recommend(userPreferences) {
        const recommendations = this.getRecommendations(userPreferences);
        return recommendations.map(this.formatRecommendation);
    }
}

// Initialize the recommendations system
const travelRecommender = new TravelRecommendations();

// Event handler for the recommendation form
document.addEventListener('DOMContentLoaded', () => {
    const recommendationForm = document.getElementById('recommendation-form');
    const resultsContainer = document.getElementById('recommendation-results');

    if (recommendationForm) {
        recommendationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
                .map(checkbox => checkbox.value);
            const budget = document.querySelector('input[name="budget"]:checked').value;
            const season = document.querySelector('select[name="season"]').value;

            const preferences = { interests, budget, season };
            const recommendations = travelRecommender.recommend(preferences);

            displayRecommendations(recommendations, resultsContainer);
        });
    }
});

// Function to display recommendations with enhanced image handling
function displayRecommendations(recommendations, container) {
    if (!container) return;

    // Show loading state
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Finding your perfect destinations...</p>
        </div>
    `;

    // Create recommendation cards with enhanced image handling
    const recommendationHTML = recommendations.map(rec => `
        <div class="col-lg-4 col-md-6">
            <div class="recommendation-card">
                <div class="card mb-4">
                    <div class="position-relative">
                        <div class="card-img-wrapper loading">
                            <img src="${rec.imageUrl}?auto=format&fit=crop&w=800&q=80" 
                                 class="card-img-top" 
                                 alt="${rec.name}"
                                 loading="lazy"
                                 onerror="this.onerror=null; this.src='${rec.fallbackImageUrl}?auto=format&fit=crop&w=800&q=80'; if(this.src === '${rec.fallbackImageUrl}?auto=format&fit=crop&w=800&q=80') this.classList.add('img-error')"
                                 onload="this.parentElement.classList.remove('loading'); this.classList.add('fade-in')">
                            <div class="img-overlay">
                                <div class="destination-type">
                                    ${rec.interests.map(interest => 
                                        `<span class="badge bg-light text-dark me-1">${interest}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${rec.name}</h5>
                        <p class="card-text">${rec.description}</p>
                        <div class="match-score mb-3">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" 
                                     style="width: ${rec.matchScore}%" 
                                     aria-valuenow="${rec.matchScore}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="100">
                                    ${rec.matchScore}% Match
                                </div>
                            </div>
                        </div>
                        <h6 class="mt-3">Activities:</h6>
                        <ul class="list-unstyled">
                            ${rec.activities.map(activity => 
                                `<li><i class="fas fa-check-circle text-success me-2"></i>${activity}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Update container with recommendations
    container.innerHTML = `
        <div class="row">
            ${recommendationHTML}
        </div>
    `;
} 