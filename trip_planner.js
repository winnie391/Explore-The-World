/**
 * Trip Planner for Travel Website
 * Handles trip planning, wishlist management, and itinerary creation
 */

// Initialize the trip planner
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wishlist
    initWishlist();
    
    // Initialize trip planning
    initTripPlanner();
    
    // Initialize date picker for trip dates
    initDatePicker();
    
    // Initialize PDF download functionality
    initPdfDownload();
});

// Trip data storage key
const TRIPS_STORAGE_KEY = 'plannedTrips';
const WISHLIST_STORAGE_KEY = 'travelWishlist';

// Initialize wishlist functionality
function initWishlist() {
    const wishlistForm = document.getElementById('wishlist-form');
    const wishlistInput = document.getElementById('wishlist-input');
    
    if (wishlistForm && wishlistInput) {
        // Load existing wishlist
        loadWishlist();
        
        // Handle adding new wishlist items
        wishlistForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const destination = wishlistInput.value.trim();
            if (destination) {
                addToWishlist(destination);
                wishlistInput.value = '';
            }
        });
    }
}

// Load wishlist from local storage
function loadWishlist() {
    const wishlistContainer = document.getElementById('wishlist-container');
    const wishlist = getWishlist();
    
    if (wishlistContainer) {
        wishlistContainer.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p class="text-muted">Your wishlist is empty. Add destinations you\'d like to visit.</p>';
            return;
        }
        
        // Create wishlist items
        wishlist.forEach((destination, index) => {
            const item = document.createElement('div');
            item.className = 'wishlist-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom';
            
            item.innerHTML = `
                <span>
                    <i class="fas fa-map-marker-alt text-primary me-2"></i>
                    ${destination}
                </span>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-1 add-to-trip-btn" data-destination="${destination}">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger remove-wishlist-btn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            wishlistContainer.appendChild(item);
        });
        
        // Add event listeners to buttons
        attachWishlistButtonEvents();
    }
}

// Get wishlist from local storage
function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || [];
}

// Add a destination to wishlist
function addToWishlist(destination) {
    const wishlist = getWishlist();
    
    // Don't add if already exists
    if (wishlist.includes(destination)) {
        showNotification('This destination is already on your wishlist!', 'warning');
        return;
    }
    
    wishlist.push(destination);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    
    // Reload wishlist
    loadWishlist();
    showNotification(`Added ${destination} to your wishlist!`, 'success');
}

// Remove a destination from wishlist
function removeFromWishlist(index) {
    const wishlist = getWishlist();
    const removed = wishlist.splice(index, 1)[0];
    
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    
    // Reload wishlist
    loadWishlist();
    showNotification(`Removed ${removed} from your wishlist!`, 'success');
}

// Attach event listeners to wishlist buttons
function attachWishlistButtonEvents() {
    // Remove buttons
    document.querySelectorAll('.remove-wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromWishlist(index);
        });
    });
    
    // Add to trip buttons
    document.querySelectorAll('.add-to-trip-btn').forEach(button => {
        button.addEventListener('click', function() {
            const destination = this.dataset.destination;
            
            if (destination) {
                // Set the destination in the trip form
                const tripDestInput = document.getElementById('trip-destination');
                if (tripDestInput) {
                    tripDestInput.value = destination;
                    
                    // Scroll to the trip form
                    document.getElementById('trip-form').scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Initialize trip planner functionality
function initTripPlanner() {
    const tripForm = document.getElementById('trip-form');
    
    if (tripForm) {
        // Load existing trips
        loadTrips();
        
        // Handle adding new trips
        tripForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const destination = document.getElementById('trip-destination').value.trim();
            const dates = document.getElementById('trip-dates').value.trim();
            const notes = document.getElementById('trip-notes').value.trim();
            
            if (destination && dates) {
                saveTrip(destination, dates, notes);
                
                // Reset form
                tripForm.reset();
            } else {
                alert('Please enter a destination and travel dates.');
            }
        });
    }
}

// Load trips from local storage
function loadTrips() {
    const tripsContainer = document.getElementById('trips-list');
    const trips = getTrips();
    
    if (tripsContainer) {
        tripsContainer.innerHTML = '';
        
        if (trips.length === 0) {
            tripsContainer.innerHTML = '<p class="text-muted">You haven\'t planned any trips yet.</p>';
            return;
        }
        
        // Sort trips by start date
        trips.sort((a, b) => {
            return new Date(a.startDate) - new Date(b.startDate);
        });
        
        // Create trip items
        trips.forEach((trip, index) => {
            const item = document.createElement('div');
            item.className = 'list-group-item';
            
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${trip.destination}</h5>
                    <small>${trip.dates}</small>
                </div>
                ${trip.notes ? `<p class="mb-1">${trip.notes}</p>` : ''}
                <div class="d-flex justify-content-end mt-2">
                    <button class="btn btn-sm btn-outline-danger remove-trip-btn me-2" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn btn-sm btn-outline-primary edit-trip-btn" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            `;
            
            tripsContainer.appendChild(item);
        });
        
        // Add event listeners to buttons
        attachTripButtonEvents();
    }
}

// Get trips from local storage
function getTrips() {
    return JSON.parse(localStorage.getItem(TRIPS_STORAGE_KEY)) || [];
}

// Save a trip to local storage
function saveTrip(destination, dates, notes) {
    const trips = getTrips();
    const dateRange = dates.split(' - ');
    const startDate = dateRange[0];
    const endDate = dateRange[1] || startDate;
    
    // Create new trip object
    const trip = {
        id: Date.now(),
        destination,
        dates,
        startDate,
        endDate,
        notes,
        created: new Date().toISOString()
    };
    
    trips.push(trip);
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    
    // Reload trips
    loadTrips();
    showNotification(`Trip to ${destination} has been saved!`, 'success');
}

// Update an existing trip
function updateTrip(index, destination, dates, notes) {
    const trips = getTrips();
    const dateRange = dates.split(' - ');
    const startDate = dateRange[0];
    const endDate = dateRange[1] || startDate;
    
    // Update trip values while preserving ID and creation date
    trips[index] = {
        ...trips[index],
        destination,
        dates,
        startDate,
        endDate,
        notes,
        updated: new Date().toISOString()
    };
    
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    
    // Reload trips
    loadTrips();
    showNotification(`Trip to ${destination} has been updated!`, 'success');
}

// Delete a trip
function deleteTrip(index) {
    const trips = getTrips();
    const removed = trips.splice(index, 1)[0];
    
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    
    // Reload trips
    loadTrips();
    showNotification(`Trip to ${removed.destination} has been deleted!`, 'success');
}

// Attach event listeners to trip buttons
function attachTripButtonEvents() {
    // Delete buttons
    document.querySelectorAll('.remove-trip-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this trip?')) {
                const index = parseInt(this.dataset.index);
                deleteTrip(index);
            }
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-trip-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const trips = getTrips();
            const trip = trips[index];
            
            // Populate the form with trip details
            document.getElementById('trip-destination').value = trip.destination;
            document.getElementById('trip-dates').value = trip.dates;
            document.getElementById('trip-notes').value = trip.notes || '';
            
            // Change the submit button to update
            const submitBtn = document.querySelector('#trip-form button[type="submit"]');
            submitBtn.textContent = 'Update Trip';
            submitBtn.dataset.editing = 'true';
            submitBtn.dataset.editIndex = index;
            
            // Scroll to the form
            document.getElementById('trip-form').scrollIntoView({ behavior: 'smooth' });
            
            // Update the event listener for the form
            const tripForm = document.getElementById('trip-form');
            const oldSubmitHandler = tripForm.onsubmit;
            
            tripForm.onsubmit = function(event) {
                event.preventDefault();
                
                const destination = document.getElementById('trip-destination').value.trim();
                const dates = document.getElementById('trip-dates').value.trim();
                const notes = document.getElementById('trip-notes').value.trim();
                
                if (destination && dates) {
                    updateTrip(index, destination, dates, notes);
                    
                    // Reset form and button
                    tripForm.reset();
                    submitBtn.textContent = 'Save Trip';
                    submitBtn.dataset.editing = 'false';
                    delete submitBtn.dataset.editIndex;
                    
                    // Restore original event handler
                    tripForm.onsubmit = oldSubmitHandler;
                }
            };
        });
    });
}

// Initialize date picker for trip dates
function initDatePicker() {
    const tripDates = document.getElementById('trip-dates');
    
    if (tripDates && typeof $.fn.daterangepicker === 'function') {
        try {
            $(tripDates).daterangepicker({
                opens: 'center',
                autoApply: true,
                locale: {
                    format: 'MM/DD/YYYY'
                }
            });
        } catch (error) {
            console.error('Error initializing daterangepicker:', error);
        }
    } else {
        console.warn('DateRangePicker not available or trip-dates element not found');
    }
}

// Initialize PDF download functionality
function initPdfDownload() {
    const downloadBtn = document.getElementById('download-pdf');
    
    if (downloadBtn && typeof jspdf !== 'undefined') {
        downloadBtn.addEventListener('click', function() {
            generateTripPdf();
        });
    }
}

// Generate a PDF of planned trips
function generateTripPdf() {
    // Check if jsPDF is available
    if (typeof jspdf === 'undefined') {
        alert('PDF generation is not available. Please try again later.');
        return;
    }
    
    const trips = getTrips();
    
    if (trips.length === 0) {
        alert('You have no trips to download.');
        return;
    }
    
    try {
        // Create new PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(22);
        doc.text('My Planned Trips', 105, 20, null, null, 'center');
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, null, null, 'center');
        
        // Add trips
        let yPos = 40;
        doc.setFontSize(14);
        
        trips.forEach((trip, index) => {
            // Add page if needed
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            // Add trip header
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${trip.destination}`, 20, yPos);
            yPos += 8;
            
            // Add trip details
            doc.setFont(undefined, 'normal');
            doc.setFontSize(12);
            doc.text(`Dates: ${trip.dates}`, 25, yPos);
            yPos += 6;
            
            if (trip.notes) {
                doc.text('Notes:', 25, yPos);
                yPos += 6;
                
                // Split long notes into multiple lines
                const noteLines = doc.splitTextToSize(trip.notes, 160);
                doc.text(noteLines, 30, yPos);
                yPos += noteLines.length * 6 + 4;
            }
            
            // Add separator
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPos, 190, yPos);
            yPos += 10;
        });
        
        // Save the PDF
        doc.save('my-planned-trips.pdf');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating your PDF. Please try again later.');
    }
}

// Show notification message
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('trip-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'trip-notification';
        notification.className = 'position-fixed bottom-0 end-0 p-3';
        notification.style.zIndex = '5';
        document.body.appendChild(notification);
    }
    
    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'danger' ? 'danger' : 'primary'}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    notification.appendChild(toast);
    
    // Show the toast
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Export functions for use in other modules
window.initWishlist = initWishlist;
window.initTripPlanner = initTripPlanner;
window.generateTripPdf = generateTripPdf; 