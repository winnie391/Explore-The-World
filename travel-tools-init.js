import { TravelBudgetCalculator, TripPlanner, TravelRecommendations, WeatherService } from './travel-tools.js';

// Initialize all tools
document.addEventListener('DOMContentLoaded', function() {
    const budgetCalculator = new TravelBudgetCalculator();
    const tripPlanner = new TripPlanner();
    const recommendations = new TravelRecommendations();
    const weatherService = new WeatherService('YOUR_OPENWEATHER_API_KEY'); // Replace with actual API key

    // Budget Calculator
    const budgetForm = document.getElementById('budget-form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('destination').value;
            const duration = parseInt(document.getElementById('duration').value);
            const accommodation = document.getElementById('accommodation').value;
            const food = document.getElementById('food').value;
            
            const budget = budgetCalculator.calculateBudget(destination, duration, accommodation, food);
            const tips = budgetCalculator.getBudgetTips(budget.total, duration);
            
            // Update results
            document.getElementById('total-budget').textContent = budget.total;
            document.getElementById('accommodation-cost').textContent = budget.breakdown.accommodation;
            document.getElementById('food-cost').textContent = budget.breakdown.food;
            document.getElementById('transportation-cost').textContent = budget.breakdown.transportation;
            document.getElementById('activities-cost').textContent = budget.breakdown.activities;
            
            // Update tips
            const tipsContainer = document.getElementById('budget-tips-list');
            tipsContainer.innerHTML = tips.map(tip => `<li class="list-group-item">${tip}</li>`).join('');
            
            // Show results
            document.getElementById('budget-results').classList.remove('d-none');
        });
    }

    // Trip Planner
    const wishlistForm = document.getElementById('wishlist-form');
    const tripForm = document.getElementById('trip-form');
    
    if (wishlistForm) {
        wishlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = document.getElementById('wishlist-input');
            const destination = {
                name: input.value,
                notes: ''
            };
            
            tripPlanner.addToWishlist(destination);
            updateWishlist();
            input.value = '';
        });
    }
    
    if (tripForm) {
        // Initialize date range picker
        $('#trip-dates').daterangepicker({
            opens: 'left',
            locale: {
                format: 'YYYY-MM-DD'
            }
        });
        
        tripForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('trip-destination').value;
            const dates = document.getElementById('trip-dates').value.split(' - ');
            const notes = document.getElementById('trip-notes').value;
            
            const trip = tripPlanner.planTrip({
                destination,
                startDate: dates[0],
                endDate: dates[1],
                notes
            });
            
            updateTrips();
            this.reset();
        });
    }
    
    // Download PDF functionality
    const downloadPdfBtn = document.getElementById('download-pdf');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            const selectedTrip = document.querySelector('.trip-item.selected');
            if (selectedTrip) {
                tripPlanner.generatePDF(parseInt(selectedTrip.dataset.tripId));
            }
        });
    }

    // Travel Recommendations
    const recommendationsForm = document.getElementById('recommendations-form');
    if (recommendationsForm) {
        recommendationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const interests = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            const season = document.getElementById('travel-season').value;
            const budget = document.getElementById('budget-level').value;
            
            const recommendedDestinations = recommendations.getRecommendations(interests, season, budget);
            
            // Update results
            const container = document.getElementById('recommendations-container');
            container.innerHTML = recommendedDestinations.map(dest => `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <img src="https://source.unsplash.com/random/400x300/?${dest.toLowerCase()}" class="card-img-top" alt="${dest}">
                        <div class="card-body">
                            <h5 class="card-title">${dest}</h5>
                            <button class="btn btn-sm btn-outline-primary add-to-wishlist" data-destination="${dest}">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('recommendations-results').classList.remove('d-none');
        });
    }

    // Weather Information
    const weatherForm = document.getElementById('weather-form');
    if (weatherForm) {
        weatherForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const city = document.getElementById('weather-city').value;
            
            try {
                const weatherData = await weatherService.getWeather(city);
                const bestTime = weatherService.getBestTimeToVisit(city);
                
                // Update weather information
                document.getElementById('temperature').textContent = `${Math.round(weatherData.main.temp)}°C`;
                document.getElementById('weather-description').textContent = weatherData.weather[0].description;
                document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
                document.getElementById('wind-speed').textContent = `${Math.round(weatherData.wind.speed * 3.6)} km/h`;
                document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                
                // Update best time information
                document.getElementById('best-months').querySelector('span').textContent = bestTime.best.join(', ');
                document.getElementById('visit-reason').textContent = bestTime.why;
                
                document.getElementById('weather-results').classList.remove('d-none');
            } catch (error) {
                console.error('Error fetching weather data:', error);
                alert('Error fetching weather data. Please try again.');
            }
        });
    }

    // Helper functions
    function updateWishlist() {
        const container = document.getElementById('wishlist-container');
        if (!container) return;
        
        const wishlist = tripPlanner.wishlist;
        container.innerHTML = wishlist.map(item => `
            <div class="wishlist-item d-flex justify-content-between align-items-center mb-2">
                <span>${item.name}</span>
                <button class="btn btn-sm btn-outline-danger remove-wishlist" data-destination="${item.name}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', function() {
                tripPlanner.removeFromWishlist(this.dataset.destination);
                updateWishlist();
            });
        });
    }
    
    function updateTrips() {
        const container = document.getElementById('trips-list');
        if (!container) return;
        
        const trips = tripPlanner.trips;
        container.innerHTML = trips.map(trip => `
            <div class="list-group-item trip-item" data-trip-id="${trip.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-1">${trip.destination}</h6>
                    <small>${trip.startDate} - ${trip.endDate}</small>
                </div>
                <p class="mb-1 text-muted small">${trip.notes || 'No notes added'}</p>
            </div>
        `).join('');
        
        // Add click event to select trips
        document.querySelectorAll('.trip-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.trip-item').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    // Initial updates
    updateWishlist();
    updateTrips();
}); 