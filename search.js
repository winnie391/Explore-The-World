// Destinations data
const destinations = [
    {
        id: 'bali',
        name: 'Bali, Indonesia',
        description: 'Experience the perfect blend of stunning beaches, vibrant culture, and spiritual temples.',
        category: 'Beach',
        region: 'Asia',
        budget: 'mid-range',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        tags: ['beach', 'culture', 'temples', 'nature', 'food']
    },
    // New destinations
    {
        id: 'maldives',
        name: 'Maldives',
        description: 'Paradise on Earth with overwater bungalows, pristine beaches, and world-class diving experiences.',
        category: 'Beach',
        region: 'Asia',
        budget: 'luxury',
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
        tags: ['beach', 'luxury', 'romantic', 'diving', 'relaxation']
    },
    {
        id: 'kyoto',
        name: 'Kyoto, Japan',
        description: 'Immerse yourself in Japanese culture with ancient temples, traditional gardens, and authentic tea ceremonies.',
        category: 'City',
        region: 'Asia',
        budget: 'mid-range',
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        tags: ['culture', 'temples', 'history', 'food', 'traditional']
    },
    {
        id: 'swiss-alps',
        name: 'Swiss Alps',
        description: 'Experience world-class skiing, stunning mountain views, and charming alpine villages.',
        category: 'Mountain',
        region: 'Europe',
        budget: 'luxury',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1531938716357-224c16b5ace3?auto=format&fit=crop&w=800&q=80',
        tags: ['mountain', 'skiing', 'nature', 'hiking', 'adventure']
    },
    {
        id: 'cape-town',
        name: 'Cape Town, South Africa',
        description: 'Discover stunning beaches, Table Mountain, vibrant culture, and amazing wildlife.',
        category: 'City',
        region: 'Africa',
        budget: 'mid-range',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
        tags: ['city', 'beach', 'nature', 'culture', 'wildlife']
    },
    {
        id: 'great-barrier-reef',
        name: 'Great Barrier Reef, Australia',
        description: 'Explore the world\'s largest coral reef system with incredible marine life and diving opportunities.',
        category: 'Beach',
        region: 'Oceania',
        budget: 'luxury',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1582434571535-c2f0e35a8dd4?auto=format&fit=crop&w=800&q=80',
        tags: ['beach', 'diving', 'nature', 'marine-life', 'adventure']
    },
    {
        id: 'rio-de-janeiro',
        name: 'Rio de Janeiro, Brazil',
        description: 'Experience the rhythm of samba, iconic beaches, and the majestic Christ the Redeemer statue.',
        category: 'City',
        region: 'South America',
        budget: 'mid-range',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
        tags: ['beach', 'culture', 'nightlife', 'food', 'landmarks']
    },
    {
        id: 'iceland',
        name: 'Iceland',
        description: 'Witness the Northern Lights, dramatic landscapes, hot springs, and stunning waterfalls.',
        category: 'Mountain',
        region: 'Europe',
        budget: 'luxury',
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
        tags: ['nature', 'adventure', 'northern-lights', 'hiking', 'hot-springs']
    },
    {
        id: 'dubai',
        name: 'Dubai, UAE',
        description: 'Experience luxury shopping, futuristic architecture, desert adventures, and traditional markets.',
        category: 'City',
        region: 'Asia',
        budget: 'luxury',
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        tags: ['luxury', 'shopping', 'desert', 'architecture', 'modern']
    },
    {
        id: 'hawaii',
        name: 'Hawaii, USA',
        description: 'Paradise islands offering volcanic landscapes, surfing, tropical beaches, and rich Polynesian culture.',
        category: 'Beach',
        region: 'North America',
        budget: 'luxury',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=800&q=80',
        tags: ['beach', 'nature', 'surfing', 'culture', 'volcanoes']
    },
    {
        id: 'marrakech',
        name: 'Marrakech, Morocco',
        description: 'Explore colorful markets, historic medinas, traditional riads, and stunning desert landscapes.',
        category: 'City',
        region: 'Africa',
        budget: 'mid-range',
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1597211684565-dca64d72c3fa?auto=format&fit=crop&w=800&q=80',
        tags: ['culture', 'markets', 'history', 'food', 'desert']
    },
    {
        id: 'paris',
        name: 'Paris, France',
        description: 'Discover the city of love with its iconic landmarks, world-class cuisine, and artistic heritage.',
        category: 'City',
        region: 'Europe',
        budget: 'luxury',
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        tags: ['city', 'culture', 'food', 'art', 'architecture']
    },
    {
        id: 'santorini',
        name: 'Santorini, Greece',
        description: 'Enjoy breathtaking sunsets, white-washed buildings, and crystal-clear waters in this island paradise.',
        category: 'Island',
        region: 'Europe',
        budget: 'luxury',
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80',
        tags: ['island', 'beach', 'sunset', 'architecture', 'romantic']
    },
    {
        id: 'new-york',
        name: 'New York, USA',
        description: 'Experience the vibrant energy of the Big Apple with its iconic skyline, diverse culture, and endless entertainment.',
        category: 'City',
        region: 'North America',
        budget: 'mid-range',
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        tags: ['city', 'culture', 'food', 'shopping', 'entertainment']
    },
    {
        id: 'bangkok',
        name: 'Bangkok, Thailand',
        description: 'Explore the vibrant street life, ornate temples, and modern cityscape of Thailand\'s bustling capital.',
        category: 'City',
        region: 'Asia',
        budget: 'budget',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
        tags: ['city', 'culture', 'food', 'temples', 'shopping']
    },
    {
        id: 'machu-picchu',
        name: 'Machu Picchu, Peru',
        description: 'Discover the ancient Incan citadel set high in the Andes Mountains, offering breathtaking views and rich history.',
        category: 'Mountain',
        region: 'South America',
        budget: 'mid-range',
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
        tags: ['mountain', 'history', 'culture', 'hiking', 'nature']
    }
];

// Search functionality
function searchDestinations(query) {
    query = query.toLowerCase();
    return destinations.filter(destination => {
        return destination.name.toLowerCase().includes(query) ||
            destination.description.toLowerCase().includes(query) ||
            destination.category.toLowerCase().includes(query) ||
            destination.region.toLowerCase().includes(query) ||
            destination.tags.some(tag => tag.toLowerCase().includes(query));
    });
}

// Create destination card HTML
function createDestinationCard(destination) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card destination-card" data-id="${destination.id}">
                <div class="destination-img-container">
                    <div class="card-img-wrapper loading">
                        <img src="${destination.imageUrl}" 
                             class="card-img-top" 
                             alt="${destination.name}"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80'"
                             onload="this.parentElement.classList.remove('loading'); this.classList.add('fade-in')">
                    </div>
                    <div class="destination-category">${destination.category}</div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${destination.name}</h5>
                    <p class="card-text">${destination.description}</p>
                    <div class="destination-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${destination.region}</span>
                        <span><i class="fas fa-dollar-sign"></i> ${destination.budget}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="rating">
                            ${createRatingStars(destination.rating)}
                            <span>${destination.rating}</span>
                        </div>
                        <a href="destinations-details.html?destinations=${destination.id}" class="btn btn-outline-primary">Explore <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create rating stars HTML
function createRatingStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    return starsHtml;
}

// Get recommended destinations based on criteria
function getRecommendedDestinations() {
    // Get destinations with high ratings (4.5 and above)
    const highlyRated = destinations.filter(dest => dest.rating >= 4.5);

    // Get a mix of different categories
    const categories = [...new Set(destinations.map(dest => dest.category))];
    const diverseDestinations = categories.map(category => {
        return destinations.find(dest => dest.category === category);
    }).filter(Boolean);

    // Combine and remove duplicates
    const recommended = [...new Set([...highlyRated, ...diverseDestinations])];

    // Return up to 3 recommended destinations
    return recommended.slice(0, 3);
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    const destinationsContainer = document.getElementById('featured-destinations');
    const recommendedContainer = document.getElementById('recommended-destinations');

    // Load initial featured destinations
    if (destinationsContainer) {
        destinationsContainer.innerHTML = destinations.slice(0, 3).map(createDestinationCard).join('');
    }

    // Load recommended destinations
    if (recommendedContainer) {
        const recommendedDestinations = getRecommendedDestinations();
        recommendedContainer.innerHTML = recommendedDestinations.map(createDestinationCard).join('');
    }

    function performSearch() {
        const query = searchInput.value;
        const results = searchDestinations(query);

        if (destinationsContainer) {
            destinationsContainer.innerHTML = results.length > 0
                ? results.map(createDestinationCard).join('')
                : '<div class="col-12 text-center"><p>No destinations found. Try different search terms.</p></div>';
        }
    }

    if (searchInput && searchButton) {
        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        searchButton.addEventListener('click', performSearch);
    }
}); 