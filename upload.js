// Import Firebase functions
import { 
    getFirestore, 
    collection, 
    addDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Categories for destinations
const categories = [
    'Beach',
    'Mountain',
    'City',
    'Cultural',
    'Adventure',
    'Historical',
    'Nature',
    'Island'
];

// Regions for destinations
const regions = [
    'Asia',
    'Europe',
    'North America',
    'South America',
    'Africa',
    'Oceania',
    'Antarctica'
];

// Budget ranges
const budgets = [
    'Budget',
    'Mid-Range',
    'Luxury',
    'Ultra-Luxury'
];

// Initialize form elements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Populate dropdowns
    populateDropdown('category', categories);
    populateDropdown('region', regions);
    populateDropdown('budget', budgets);

    // Add form submit handler
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
});

// Populate dropdown with options
function populateDropdown(id, options) {
    const select = document.getElementById(id);
    if (select) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toLowerCase().replace(/\s+/g, '-');
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }
}

// Handle destination upload
async function handleUpload(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const region = document.getElementById('region').value;
    const budget = document.getElementById('budget').value;
    const imageUrl = document.getElementById('imageUrl').value;

    // Validate form
    if (!name || !description || !category || !region || !budget || !imageUrl) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        // Get current user
        const user = window.auth.currentUser;
        if (!user) {
            showMessage('You must be logged in to upload destinations', 'error');
            return;
        }

        // Create destination object
        const destinationData = {
            name,
            description,
            category,
            region,
            budget,
            imageUrl,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'pending', // For moderation purposes
            rating: 0,
            reviewCount: 0
        };

        // Add to Firestore
        const db = getFirestore();
        const docRef = await addDoc(collection(db, 'destinations'), destinationData);

        // Show success message
        showMessage('Destination uploaded successfully! Pending review.', 'success');
        
        // Reset form
        e.target.reset();

    } catch (error) {
        console.error('Upload error:', error);
        showMessage('Error uploading destination. Please try again.', 'error');
    }
}

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.getElementById('uploadMessage');
    if (messageDiv) {
        messageDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
        messageDiv.textContent = message;
    }
}

// Check authentication status
document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const uploadForm = document.getElementById('uploadForm');
    const uploadMessage = document.getElementById('uploadMessage');

    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('destinationName').value;
            const description = document.getElementById('description').value;
            const category = document.getElementById('category').value;
            const region = document.getElementById('region').value;
            const budget = document.getElementById('budget').value;
            const imageUrl = document.getElementById('imageUrl').value;
            const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim().toLowerCase());
            const rating = parseFloat(document.getElementById('rating').value);

            // Create destination ID
            const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

            // Create new destination object
            const newDestination = {
                id,
                name,
                description,
                category,
                region,
                budget,
                rating,
                imageUrl,
                tags
            };

            // Get existing destinations from localStorage or initialize empty array
            let savedDestinations = JSON.parse(localStorage.getItem('userDestinations')) || [];
            
            // Add new destination
            savedDestinations.push(newDestination);
            
            // Save back to localStorage
            localStorage.setItem('userDestinations', JSON.stringify(savedDestinations));

            // Show success message
            uploadMessage.className = 'alert alert-success mt-3';
            uploadMessage.textContent = 'Destination uploaded successfully!';

            // Reset form
            uploadForm.reset();

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'destinations.html';
            }, 2000);
        });
    }

    // Preview image URL
    const imageUrlInput = document.getElementById('imageUrl');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('blur', function() {
            const url = this.value;
            if (url) {
                // Test if image loads
                const img = new Image();
                img.onload = function() {
                    uploadMessage.className = 'alert alert-success mt-3';
                    uploadMessage.textContent = 'Image URL is valid!';
                };
                img.onerror = function() {
                    uploadMessage.className = 'alert alert-danger mt-3';
                    uploadMessage.textContent = 'Invalid image URL. Please provide a direct link to an image.';
                };
                img.src = url;
            }
        });
    }
});

// Function to load user-uploaded destinations
function loadUserDestinations() {
    const userDestinations = JSON.parse(localStorage.getItem('userDestinations')) || [];
    return userDestinations;
}

// Add user destinations to the main destinations array
if (typeof destinations !== 'undefined') {
    const userDestinations = loadUserDestinations();
    destinations.push(...userDestinations);
} 