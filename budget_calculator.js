/**
 * Budget Calculator for Travel Website
 * Handles budget calculations based on destination, duration, accommodation type, and food preferences
 */

// Budget data by destination (in RM)
const destinationBudgets = {
    'Kyoto': {
        accommodationPerDay: {
            budget: 150,
            midRange: 350,
            luxury: 750
        },
        foodPerDay: {
            streetFood: 80,
            restaurant: 150,
            premium: 300
        },
        transportationPerDay: 60,
        activitiesPerDay: 100,
        tips: [
            "Stay in traditional guesthouses (ryokans) instead of hotels for an authentic experience.",
            "Buy a Japan Rail Pass if you plan to visit multiple cities.",
            "Visit temples early in the morning to avoid crowds and entrance fees.",
            "Many shrines and gardens are free to visit.",
            "Try the affordable set lunch menus (teishoku) for great value meals."
        ]
    },
    'Maldives': {
        accommodationPerDay: {
            budget: 200,
            midRange: 600,
            luxury: 2000
        },
        foodPerDay: {
            streetFood: 100,
            restaurant: 200,
            premium: 500
        },
        transportationPerDay: 120,
        activitiesPerDay: 200,
        tips: [
            "Consider a guesthouse on local islands instead of luxury resorts for a budget trip.",
            "Book full-board meal plans to save on food costs.",
            "Visit during off-peak season (May-November) for better rates.",
            "Bring essential snacks and toiletries as they can be expensive.",
            "Book activities through your accommodation for potential discounts."
        ]
    },
    'Bali': {
        accommodationPerDay: {
            budget: 120,
            midRange: 300,
            luxury: 800
        },
        foodPerDay: {
            streetFood: 60,
            restaurant: 120,
            premium: 250
        },
        transportationPerDay: 50,
        activitiesPerDay: 80,
        tips: [
            "Stay in guesthouses or homestays for an authentic experience at lower prices.",
            "Rent a scooter for around RM30 per day to save on transportation.",
            "Eat at warungs (local eateries) for delicious, affordable food.",
            "Negotiate prices for activities and souvenirs.",
            "Visit temples during their free public hours."
        ]
    },
    'Petra': {
        accommodationPerDay: {
            budget: 100,
            midRange: 250,
            luxury: 600
        },
        foodPerDay: {
            streetFood: 70,
            restaurant: 150,
            premium: 300
        },
        transportationPerDay: 80,
        activitiesPerDay: 150,
        tips: [
            "Buy the Jordan Pass before your trip to save on visa fees and entrance tickets.",
            "Stay in nearby Wadi Musa for more affordable accommodations.",
            "Visit Petra by Night for a magical experience (additional fee).",
            "Bring water and snacks to avoid high prices inside Petra.",
            "Hire a local guide for more in-depth information about the site."
        ]
    },
    'Costa Rica': {
        accommodationPerDay: {
            budget: 150,
            midRange: 350,
            luxury: 700
        },
        foodPerDay: {
            streetFood: 80,
            restaurant: 150,
            premium: 300
        },
        transportationPerDay: 70,
        activitiesPerDay: 120,
        tips: [
            "Visit during the green (rainy) season for lower prices and fewer tourists.",
            "Use public buses for budget transportation between cities.",
            "Eat at 'sodas' (local restaurants) for affordable traditional food.",
            "Look for free activities like hiking trails and public beaches.",
            "Book adventure activities as packages for discounts."
        ]
    },
    'Swiss Alps': {
        accommodationPerDay: {
            budget: 180,
            midRange: 450,
            luxury: 1200
        },
        foodPerDay: {
            streetFood: 100,
            restaurant: 200,
            premium: 400
        },
        transportationPerDay: 100,
        activitiesPerDay: 150,
        tips: [
            "Get a Swiss Travel Pass for unlimited public transportation and museum access.",
            "Stay in mountain huts or hostels instead of hotels.",
            "Buy groceries and prepare some of your own meals.",
            "Look for ski package deals that include lift tickets and rentals.",
            "Visit during the shoulder seasons (spring/fall) for better rates."
        ]
    },
    'Iceland': {
        accommodationPerDay: {
            budget: 200,
            midRange: 500,
            luxury: 1000
        },
        foodPerDay: {
            streetFood: 120,
            restaurant: 250,
            premium: 500
        },
        transportationPerDay: 120,
        activitiesPerDay: 150,
        tips: [
            "Rent a campervan to combine transportation and accommodation costs.",
            "Shop at budget supermarkets like Bonus for groceries.",
            "Take advantage of free natural attractions and hiking trails.",
            "Book activities in advance for better rates.",
            "Fill your water bottle from the tap - Iceland's water is clean and free."
        ]
    },
    'Queenstown': {
        accommodationPerDay: {
            budget: 150,
            midRange: 400,
            luxury: 800
        },
        foodPerDay: {
            streetFood: 90,
            restaurant: 180,
            premium: 350
        },
        transportationPerDay: 80,
        activitiesPerDay: 200,
        tips: [
            "Consider staying in nearby Arrowtown or Frankton for cheaper accommodations.",
            "Buy a comboo pass for multiple adventure activities to save money.",
            "Use the Orbus public transport for getting around.",
            "Visit during autumn or spring for lower prices and beautiful scenery.",
            "Take advantage of happy hour specials at local bars and restaurants."
        ]
    }
};

// Initialize the budget calculator
document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budget-form');
    const budgetResults = document.getElementById('budget-results');
    
    if (budgetForm) {
        budgetForm.addEventListener('submit', calculateBudget);
    }
    
    // Make the destination select dynamic based on available data
    populateDestinationOptions();
});

// Populate destination dropdown based on available data
function populateDestinationOptions() {
    const destinationSelect = document.getElementById('destination');
    
    if (destinationSelect) {
        // Clear existing options except the first one
        while (destinationSelect.options.length > 1) {
            destinationSelect.remove(1);
        }
        
        // Add destinations from our data
        Object.keys(destinationBudgets).forEach(destination => {
            const option = document.createElement('option');
            option.value = destination;
            option.textContent = destination;
            destinationSelect.appendChild(option);
        });
    }
}

// Calculate travel budget based on form inputs
function calculateBudget(event) {
    event.preventDefault();
    
    // Get form values
    const destination = document.getElementById('destination').value;
    const duration = parseInt(document.getElementById('duration').value);
    const accommodation = document.getElementById('accommodation').value;
    const food = document.getElementById('food').value;
    
    // Validate inputs
    if (!destination || isNaN(duration) || duration < 1) {
        alert('Please fill in all fields with valid values.');
        return;
    }
    
    // Get budget data for selected destination
    const budgetData = destinationBudgets[destination];
    
    if (!budgetData) {
        alert('Budget data not available for selected destination.');
        return;
    }
    
    // Calculate costs
    const accommodationCost = budgetData.accommodationPerDay[accommodation] * duration;
    const foodCost = budgetData.foodPerDay[food] * duration;
    const transportationCost = budgetData.transportationPerDay * duration;
    const activitiesCost = budgetData.activitiesPerDay * duration;
    
    // Calculate total
    const totalBudget = accommodationCost + foodCost + transportationCost + activitiesCost;
    
    // Display results
    document.getElementById('accommodation-cost').textContent = accommodationCost.toLocaleString();
    document.getElementById('food-cost').textContent = foodCost.toLocaleString();
    document.getElementById('transportation-cost').textContent = transportationCost.toLocaleString();
    document.getElementById('activities-cost').textContent = activitiesCost.toLocaleString();
    document.getElementById('total-budget').textContent = totalBudget.toLocaleString();
    
    // Show budget saving tips
    const tipsListElement = document.getElementById('budget-tips-list');
    tipsListElement.innerHTML = '';
    
    budgetData.tips.forEach(tip => {
        const tipItem = document.createElement('li');
        tipItem.className = 'list-group-item';
        tipItem.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${tip}`;
        tipsListElement.appendChild(tipItem);
    });
    
    // Show results
    document.getElementById('budget-results').classList.remove('d-none');
    
    // Scroll to results
    document.getElementById('budget-results').scrollIntoView({ behavior: 'smooth' });
}

// Export for use in other modules
window.calculateBudget = calculateBudget;
window.destinationBudgets = destinationBudgets; 