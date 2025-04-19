// Budget Calculator
export class TravelBudgetCalculator {
    constructor() {
        this.baseCosts = {
            'budget': {
                accommodation: 50,
                food: 20,
                transportation: 10,
                activities: 20
            },
            'moderate': {
                accommodation: 100,
                food: 40,
                transportation: 20,
                activities: 40
            },
            'luxury': {
                accommodation: 200,
                food: 80,
                transportation: 40,
                activities: 80
            }
        };
        
        this.destinationMultipliers = {
            'europe': 1.5,
            'asia': 0.8,
            'north america': 1.3,
            'south america': 0.9,
            'africa': 0.7,
            'oceania': 1.4
        };
    }

    calculateBudget(destination, duration, accommodationType, foodPreference) {
        const region = this.getRegion(destination);
        const multiplier = this.destinationMultipliers[region] || 1;
        const baseCosts = this.baseCosts[accommodationType] || this.baseCosts.moderate;
        
        const foodMultiplier = foodPreference === 'luxury' ? 1.5 : 
                             foodPreference === 'budget' ? 0.7 : 1;

        const breakdown = {
            accommodation: Math.round(baseCosts.accommodation * duration * multiplier),
            food: Math.round(baseCosts.food * duration * multiplier * foodMultiplier),
            transportation: Math.round(baseCosts.transportation * duration * multiplier),
            activities: Math.round(baseCosts.activities * duration * multiplier)
        };

        const total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);

        return {
            total,
            breakdown,
            currency: 'USD'
        };
    }

    getBudgetTips(total, duration) {
        const dailyBudget = total / duration;
        const tips = [];

        if (dailyBudget < 100) {
            tips.push('Consider hostels or shared accommodations to save money');
            tips.push('Look for free walking tours and public transportation');
            tips.push('Cook your own meals when possible');
        } else if (dailyBudget < 200) {
            tips.push('Mix dining out with self-prepared meals');
            tips.push('Book accommodations in advance for better rates');
            tips.push('Look for city passes for attractions');
        } else {
            tips.push('Consider luxury accommodations with included amenities');
            tips.push('Book private tours for a more exclusive experience');
            tips.push('Research Michelin-starred restaurants in your destination');
        }

        tips.push('Always have an emergency fund of about 10% of your budget');
        return tips;
    }

    getRegion(destination) {
        destination = destination.toLowerCase();
        for (const region of Object.keys(this.destinationMultipliers)) {
            if (destination.includes(region)) {
                return region;
            }
        }
        return 'moderate';
    }
}

// Trip Planner & Wishlist
export class TripPlanner {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.trips = [];
        this.wishlist = [];
        this.loadTrips();
    }

    async loadTrips() {
        try {
            const user = this.auth.currentUser;
            if (!user) return;

            // Load trips
            const tripsSnapshot = await this.db.collection('trips')
                .where('userId', '==', user.uid)
                .orderBy('created', 'desc')
                .get();
            
            this.trips = tripsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load wishlist
            const wishlistSnapshot = await this.db.collection('wishlist')
                .where('userId', '==', user.uid)
                .get();
            
            this.wishlist = wishlistSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Trigger UI update
            this.onDataChange && this.onDataChange();
        } catch (error) {
            console.error('Error loading trips:', error);
        }
    }

    async addToWishlist(destination) {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            if (!this.wishlist.find(item => item.name === destination.name)) {
                const wishlistRef = await this.db.collection('wishlist').add({
                    userId: user.uid,
                    name: destination.name,
                    notes: destination.notes || '',
                    created: firebase.firestore.FieldValue.serverTimestamp()
                });

                const newItem = {
                    id: wishlistRef.id,
                    userId: user.uid,
                    name: destination.name,
                    notes: destination.notes || '',
                    created: new Date()
                };

                this.wishlist.push(newItem);
                this.onDataChange && this.onDataChange();
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    }

    async removeFromWishlist(destinationId) {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            await this.db.collection('wishlist').doc(destinationId).delete();
            this.wishlist = this.wishlist.filter(item => item.id !== destinationId);
            this.onDataChange && this.onDataChange();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    }

    async planTrip(tripDetails) {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const trip = {
                userId: user.uid,
                destination: tripDetails.destination,
                startDate: tripDetails.startDate,
                endDate: tripDetails.endDate,
                notes: tripDetails.notes || '',
                type: tripDetails.type || 'domestic', // 'domestic' or 'international'
                status: tripDetails.status || 'planned', // 'planned', 'ongoing', 'completed'
                budget: tripDetails.budget || 0,
                activities: tripDetails.activities || [],
                created: firebase.firestore.FieldValue.serverTimestamp(),
                updated: firebase.firestore.FieldValue.serverTimestamp()
            };

            const tripRef = await this.db.collection('trips').add(trip);
            
            const newTrip = {
                id: tripRef.id,
                ...trip,
                created: new Date(),
                updated: new Date()
            };

            this.trips.unshift(newTrip);
            this.onDataChange && this.onDataChange();
            
            return newTrip;
        } catch (error) {
            console.error('Error planning trip:', error);
            throw error;
        }
    }

    async updateTrip(tripId, updates) {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const tripRef = this.db.collection('trips').doc(tripId);
            const tripDoc = await tripRef.get();

            if (!tripDoc.exists || tripDoc.data().userId !== user.uid) {
                throw new Error('Trip not found or unauthorized');
            }

            updates.updated = firebase.firestore.FieldValue.serverTimestamp();
            await tripRef.update(updates);

            // Update local data
            const index = this.trips.findIndex(t => t.id === tripId);
            if (index !== -1) {
                this.trips[index] = {
                    ...this.trips[index],
                    ...updates,
                    updated: new Date()
                };
                this.onDataChange && this.onDataChange();
            }
        } catch (error) {
            console.error('Error updating trip:', error);
            throw error;
        }
    }

    async deleteTrip(tripId) {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            await this.db.collection('trips').doc(tripId).delete();
            this.trips = this.trips.filter(trip => trip.id !== tripId);
            this.onDataChange && this.onDataChange();
        } catch (error) {
            console.error('Error deleting trip:', error);
            throw error;
        }
    }

    async generatePDF(tripId) {
        try {
            const trip = this.trips.find(t => t.id === tripId);
            if (!trip) throw new Error('Trip not found');

            const doc = new jsPDF();
            
            // Add header with logo
            doc.setFontSize(24);
            doc.setTextColor(52, 152, 219); // Blue color
            doc.text('Trip Itinerary', 20, 20);
            
            // Add trip details
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(`Destination: ${trip.destination}`, 20, 40);
            doc.text(`Dates: ${trip.startDate} - ${trip.endDate}`, 20, 50);
            doc.text(`Type: ${trip.type.charAt(0).toUpperCase() + trip.type.slice(1)}`, 20, 60);
            doc.text(`Status: ${trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}`, 20, 70);
            
            if (trip.budget) {
                doc.text(`Budget: $${trip.budget}`, 20, 80);
            }
            
            if (trip.activities && trip.activities.length > 0) {
                doc.text('Planned Activities:', 20, 90);
                trip.activities.forEach((activity, index) => {
                    doc.text(`• ${activity}`, 30, 100 + (index * 10));
                });
            }
            
            if (trip.notes) {
                const yPos = 100 + ((trip.activities?.length || 0) * 10) + 10;
                doc.text('Notes:', 20, yPos);
                doc.setFontSize(12);
                const splitNotes = doc.splitTextToSize(trip.notes, 170);
                doc.text(splitNotes, 20, yPos + 10);
            }
            
            // Add footer
            doc.setFontSize(10);
            doc.setTextColor(128);
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.height - 10);
            
            // Save the PDF
            doc.save(`trip-${trip.destination.toLowerCase()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }

    // Helper method to set a callback for data changes
    setOnDataChange(callback) {
        this.onDataChange = callback;
    }
}

// Travel Recommendations
export class TravelRecommendations {
    constructor() {
        this.destinations = {
            'beach': ['Bali', 'Maldives', 'Hawaii', 'Caribbean Islands', 'Greek Islands'],
            'culture': ['Rome', 'Kyoto', 'Paris', 'Istanbul', 'Cairo'],
            'nature': ['New Zealand', 'Costa Rica', 'Norway', 'Switzerland', 'Canada'],
            'adventure': ['Nepal', 'Peru', 'Iceland', 'South Africa', 'Australia'],
            'food': ['Tokyo', 'Bangkok', 'Barcelona', 'Vietnam', 'Mexico City'],
            'city': ['New York', 'London', 'Singapore', 'Dubai', 'Hong Kong']
        };
        
        this.seasonalDestinations = {
            'summer': ['Mediterranean', 'Greek Islands', 'Croatia', 'California', 'Bali'],
            'winter': ['Swiss Alps', 'Japan', 'New Zealand', 'Canada', 'Norway'],
            'spring': ['Japan', 'Netherlands', 'Paris', 'Washington DC', 'South Korea'],
            'fall': ['New England', 'Germany', 'Scotland', 'China', 'South Africa']
        };
    }

    getRecommendations(interests, season, budget) {
        let recommendations = new Set();
        
        // Add destinations based on interests
        interests.forEach(interest => {
            if (this.destinations[interest]) {
                this.destinations[interest].forEach(dest => recommendations.add(dest));
            }
        });
        
        // Add seasonal destinations
        if (season && this.seasonalDestinations[season]) {
            this.seasonalDestinations[season].forEach(dest => recommendations.add(dest));
        }
        
        // Filter by budget if specified
        let results = Array.from(recommendations);
        if (budget === 'budget') {
            results = results.filter(dest => this.getDestinationCostLevel(dest) === 'budget');
        } else if (budget === 'luxury') {
            results = results.filter(dest => this.getDestinationCostLevel(dest) === 'luxury');
        }
        
        // Return top 6 recommendations
        return results.slice(0, 6);
    }

    getDestinationCostLevel(destination) {
        const expensiveDestinations = ['Switzerland', 'Japan', 'Norway', 'Dubai', 'Singapore'];
        const budgetDestinations = ['Thailand', 'Vietnam', 'Mexico', 'Turkey', 'Cambodia'];
        
        if (expensiveDestinations.some(d => destination.includes(d))) return 'luxury';
        if (budgetDestinations.some(d => destination.includes(d))) return 'budget';
        return 'moderate';
    }
}

// Weather Integration
export class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeather(city) {
        const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        return await response.json();
    }

    getBestTimeToVisit(city) {
        // Simplified logic - in a real app, this would use historical weather data
        const cityLower = city.toLowerCase();
        
        if (this.isEuropeanCity(cityLower)) {
            return {
                best: ['May', 'June', 'September'],
                why: 'Pleasant weather and fewer tourists'
            };
        } else if (this.isAsianCity(cityLower)) {
            return {
                best: ['November', 'December', 'January'],
                why: 'Dry season with comfortable temperatures'
            };
        } else if (this.isTropicalCity(cityLower)) {
            return {
                best: ['April', 'May', 'June'],
                why: 'Before the rainy season with sunny weather'
            };
        }
        
        return {
            best: ['May', 'September'],
            why: 'Generally good weather conditions'
        };
    }

    isEuropeanCity(city) {
        const europeanCities = ['paris', 'rome', 'london', 'barcelona', 'amsterdam'];
        return europeanCities.some(c => city.includes(c));
    }

    isAsianCity(city) {
        const asianCities = ['tokyo', 'bangkok', 'singapore', 'seoul', 'hong kong'];
        return asianCities.some(c => city.includes(c));
    }

    isTropicalCity(city) {
        const tropicalCities = ['bali', 'phuket', 'maldives', 'hawaii', 'cancun'];
        return tropicalCities.some(c => city.includes(c));
    }
}

// Export all classes
export {
    TravelBudgetCalculator,
    TripPlanner,
    TravelRecommendations,
    WeatherService
}; 