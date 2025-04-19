// Wait for DOM to fully load before executing
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const wishlistForm = document.getElementById('wishlist-form');
  const wishlistInput = document.getElementById('wishlist-input');
  const wishlistContainer = document.getElementById('wishlist-container');
  const tripForm = document.getElementById('trip-form');
  const tripDestination = document.getElementById('trip-destination');
  const tripDates = document.getElementById('trip-dates');
  const tripNotes = document.getElementById('trip-notes');
  const downloadPdfBtn = document.getElementById('download-pdf');
  const tripsList = document.getElementById('trips-list');

  // Predefined destinations
  const predefinedDestinations = [
    'Kyoto',
    'Maldives',
    'Bali',
    'Petra',
    'Costa Rica',
    'Swiss Alps',
    'Iceland',
    'Queenstown'
  ];

  // Store trip data
  let plannedTrips = [];

  // Load Flatpickr date picker
  function loadDatepicker() {
    // Add Flatpickr CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    document.head.appendChild(link);
    
    // Load Flatpickr JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    script.onload = function() {
      if (tripDates) {
        flatpickr(tripDates, {
          mode: 'range',
          dateFormat: 'Y-m-d',
          placeholder: 'Select dates'
        });
      }
    };
    document.head.appendChild(script);
  }

  // Load saved data from localStorage
  function loadSavedTrips() {
    try {
      const savedTrips = localStorage.getItem('plannedTrips');
      if (savedTrips) {
        plannedTrips = JSON.parse(savedTrips);
        displayTrips();
      }
    } catch (error) {
      console.error('Error loading saved trips:', error);
      plannedTrips = [];
    }
  }

  // Save data to localStorage
  function saveTrips() {
    try {
      localStorage.setItem('plannedTrips', JSON.stringify(plannedTrips));
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  }

  // Create destination dropdown list
  function setupDestinationOptions() {
    // Create datalist element
    const datalist = document.createElement('datalist');
    datalist.id = 'destinations-list';
    
    // Add options
    predefinedDestinations.forEach(destination => {
      const option = document.createElement('option');
      option.value = destination;
      datalist.appendChild(option);
    });
    
    // Add to document
    document.body.appendChild(datalist);
    
    // Associate datalist with input fields
    if (tripDestination) tripDestination.setAttribute('list', 'destinations-list');
    if (wishlistInput) wishlistInput.setAttribute('list', 'destinations-list');
  }

  // Add destination to wishlist
  function addDestinationToWishlist(e) {
    e.preventDefault();
    
    const destination = wishlistInput.value.trim();
    if (!destination) return;
    
    // Create wishlist item
    const wishlistItem = document.createElement('div');
    wishlistItem.className = 'alert alert-info d-flex justify-content-between align-items-center mt-2';
    wishlistItem.innerHTML = `
      <span>${destination}</span>
      <div>
        <button type="button" class="btn btn-sm btn-outline-primary select-destination">Select</button>
        <button type="button" class="btn btn-sm btn-outline-danger delete-wishlist ms-1">×</button>
      </div>
    `;
    
    // Add to container
    wishlistContainer.appendChild(wishlistItem);
    
    // Clear input field
    wishlistInput.value = '';
    
    // Add "Select" button click event
    const selectBtn = wishlistItem.querySelector('.select-destination');
    selectBtn.addEventListener('click', function() {
      tripDestination.value = destination;
    });
    
    // Add "Delete" button click event
    const deleteBtn = wishlistItem.querySelector('.delete-wishlist');
    deleteBtn.addEventListener('click', function() {
      wishlistItem.remove();
    });
  }

  // Save new trip
  function saveNewTrip(e) {
    e.preventDefault();
    
    const destination = tripDestination.value.trim();
    const dates = tripDates.value.trim();
    const notes = tripNotes.value.trim();
    
    if (!destination || !dates) {
      alert('Please fill out destination and travel dates.');
      return;
    }
    
    // Create new trip object
    const newTrip = {
      id: Date.now(),
      destination: destination,
      travelDates: dates,
      notes: notes
    };
    
    // Add to trips array
    plannedTrips.push(newTrip);
    
    // Save and display
    saveTrips();
    displayTrips();
    
    // Reset form
    tripForm.reset();
    
    // Reset date picker
    if (window.flatpickr && tripDates._flatpickr) {
      tripDates._flatpickr.clear();
    }
  }

  // Display all trips
  function displayTrips() {
    // Clear existing content
    tripsList.innerHTML = '';
    
    if (plannedTrips.length === 0) {
      tripsList.innerHTML = '<div class="alert alert-light">No trips planned yet.</div>';
      return;
    }
    
    // Add each trip
    plannedTrips.forEach(trip => {
      const tripElement = document.createElement('div');
      tripElement.className = 'list-group-item list-group-item-action';
      tripElement.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-1">${trip.destination}</h6>
          <small>${trip.travelDates}</small>
        </div>
        ${trip.notes ? `<p class="mb-1 small text-muted">${trip.notes}</p>` : ''}
        <div class="d-flex justify-content-end mt-2">
          <button class="btn btn-sm btn-outline-danger delete-trip" data-id="${trip.id}">Delete</button>
        </div>
      `;
      
      tripsList.appendChild(tripElement);
      
      // Add delete button event
      const deleteBtn = tripElement.querySelector('.delete-trip');
      deleteBtn.addEventListener('click', function() {
        const tripId = parseInt(this.getAttribute('data-id'));
        deleteTrip(tripId);
      });
    });
  }

  // Delete trip
  function deleteTrip(tripId) {
    plannedTrips = plannedTrips.filter(trip => trip.id !== tripId);
    saveTrips();
    displayTrips();
  }

  // Load jsPDF and generate PDF
  function downloadPDF() {
    if (plannedTrips.length === 0) {
      alert('No trips to download. Please plan a trip first.');
      return;
    }
    
    // Create download status indicator
    const statusDiv = document.createElement('div');
    statusDiv.className = 'alert alert-info';
    statusDiv.textContent = 'Preparing PDF...';
    tripsList.parentNode.insertBefore(statusDiv, tripsList);
    
    // Load jsPDF
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
      try {
        generatePDF();
        statusDiv.remove();
      } catch (e) {
        statusDiv.className = 'alert alert-danger';
        statusDiv.textContent = 'Error generating PDF. Please try again.';
        console.error('PDF generation error:', e);
        
        // Remove error message automatically after 3 seconds
        setTimeout(() => {
          statusDiv.remove();
        }, 3000);
      }
    };
    script.onerror = function() {
      statusDiv.className = 'alert alert-danger';
      statusDiv.textContent = 'Failed to load PDF generator. Please check your internet connection.';
      
      // Remove error message automatically after 3 seconds
      setTimeout(() => {
        statusDiv.remove();
      }, 3000);
    };
    document.head.appendChild(script);
  }

  // Generate PDF using jsPDF
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set title
    doc.setFontSize(22);
    doc.text('My Planned Trips', 20, 20);
    
    let yPos = 40;
    
    // Add each trip to PDF
    plannedTrips.forEach((trip, index) => {
      // If not enough space remains on page, add new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Destination
      doc.setFontSize(16);
      doc.text(`Trip ${index + 1}: ${trip.destination}`, 20, yPos);
      yPos += 10;
      
      // Dates
      doc.setFontSize(12);
      doc.text(`Dates: ${trip.travelDates}`, 20, yPos);
      yPos += 10;
      
      // Notes
      if (trip.notes) {
        // Split long notes into multiple lines
        const splitNotes = doc.splitTextToSize(trip.notes, 170);
        doc.text('Notes:', 20, yPos);
        yPos += 7;
        doc.text(splitNotes, 20, yPos);
        yPos += (splitNotes.length * 7);
      }
      
      yPos += 15; // Space between trips
    });
    
    // Generate and download PDF
    doc.save('my-planned-trips.pdf');
  }

  // Initialize various event listeners
  function setupEventListeners() {
    if (wishlistForm) {
      wishlistForm.addEventListener('submit', addDestinationToWishlist);
    }
    
    if (tripForm) {
      tripForm.addEventListener('submit', saveNewTrip);
    }
    
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', downloadPDF);
    }
  }

  // Main initialization function
  function initialize() {
    loadDatepicker();
    setupDestinationOptions();
    setupEventListeners();
    loadSavedTrips();
  }

  // Execute initialization
  initialize();
});