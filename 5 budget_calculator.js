// Budget_calculator.js
const budgetData = {
    "Kyoto": { "Budget": 150, "Mid-Range": 400, "Luxury": 1000, "Street Food": 50, "Regular Restaurant": 150, "Premium Dining": 400, "Activities": 200, "Flight": 2500 },
    "Maldives": { "Budget": 300, "Mid-Range": 700, "Luxury": 2000, "Street Food": 80, "Regular Restaurant": 250, "Premium Dining": 600, "Activities": 400, "Flight": 3500 },
    "Bali": { "Budget": 100, "Mid-Range": 350, "Luxury": 800, "Street Food": 40, "Regular Restaurant": 120, "Premium Dining": 350, "Activities": 150, "Flight": 1200 },
    "Petra": { "Budget": 200, "Mid-Range": 600, "Luxury": 1200, "Street Food": 60, "Regular Restaurant": 200, "Premium Dining": 500, "Activities": 300, "Flight": 4000 },
    "Costa Rica": { "Budget": 250, "Mid-Range": 550, "Luxury": 1500, "Street Food": 70, "Regular Restaurant": 180, "Premium Dining": 450, "Activities": 250, "Flight": 5000 },
    "Swiss Alps": { "Budget": 400, "Mid-Range": 900, "Luxury": 2500, "Street Food": 100, "Regular Restaurant": 300, "Premium Dining": 800, "Activities": 500, "Flight": 6000 },
    "Iceland": { "Budget": 350, "Mid-Range": 800, "Luxury": 2200, "Street Food": 90, "Regular Restaurant": 280, "Premium Dining": 750, "Activities": 450, "Flight": 5500 },
    "Queenstown": { "Budget": 250, "Mid-Range": 600, "Luxury": 1800, "Street Food": 75, "Regular Restaurant": 200, "Premium Dining": 500, "Activities": 350, "Flight": 4800 }
};

document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const budgetForm = document.getElementById('budget-form');
    
    // Add event listener for form submission
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBudget();
        });
    }
});

function calculateBudget() {
    // Get form values
    let destination = document.getElementById("destination").value;
    let days = parseInt(document.getElementById("duration").value);
    let accommodationType = document.getElementById("accommodation").value;
    let foodType = document.getElementById("food").value;
    
    // Check if the destination exists in our data
    if (!budgetData[destination]) {
        alert("Please select an item in the list");
        return;
    }
    
    // Map form values to budget data keys
    let accommodationMapping = {
        "budget": "Budget",
        "midRange": "Mid-Range", 
        "luxury": "Luxury"
    };
    
    let foodMapping = {
        "streetFood": "Street Food",
        "restaurant": "Regular Restaurant",
        "premium": "Premium Dining"
    };
    
    // Calculate costs
    let accommodationCost = budgetData[destination][accommodationMapping[accommodationType]] * days;
    let foodCost = budgetData[destination][foodMapping[foodType]] * days;
    let activitiesCost = budgetData[destination]["Activities"] * days;
    let flightCost = budgetData[destination]["Flight"];
    
    let totalBudget = accommodationCost + foodCost + activitiesCost + flightCost;
    
    // Update the results in the HTML
    document.getElementById("total-budget").textContent = totalBudget.toFixed(2);
    document.getElementById("accommodation-cost").textContent = accommodationCost.toFixed(2);
    document.getElementById("food-cost").textContent = foodCost.toFixed(2);
    document.getElementById("transportation-cost").textContent = flightCost.toFixed(2);
    document.getElementById("activities-cost").textContent = activitiesCost.toFixed(2);
    
    // Show the results section
    document.getElementById("budget-results").classList.remove("d-none");
    
    // Add budget tips based on choices
    const tipsList = document.getElementById("budget-tips-list");
    tipsList.innerHTML = ""; // Clear previous tips
    
    // Add destination-specific and general tips
    const tips = [
        `Consider traveling to ${destination} during shoulder season for better prices.`,
        "Book accommodations with kitchen facilities to save on food costs.",
        "Use public transportation instead of taxis where available.",
        "Look for free activities and attractions at your destination.",
        "Consider purchasing a city pass if available for discounted attraction entry."
    ];
    
    tips.forEach(tip => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = tip;
        tipsList.appendChild(li);
    });
}