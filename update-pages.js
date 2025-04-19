const fs = require('fs');
const path = require('path');

// List of pages to update
const pages = [
    'index.html',
    'destinations.html',
    'travel-tips.html',
    'gallery.html',
    'tools.html',
    'contact.html',
    'login.html',
    'register.html',
    'upload.html'
];

// Basic HTML template
const createTemplate = (title) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Explore the World</title>
</head>
<body>
    <!-- Content will go here -->
    <main class="container mt-5 pt-5">
        <!-- Page specific content -->
    </main>

    <!-- Include header script -->
    <script src="js/include-header.js"></script>
    
    <!-- Page specific scripts -->
    <script type="module" src="js/${title.toLowerCase()}.js"></script>
</body>
</html>`;

// Update each page
pages.forEach(page => {
    const title = path.basename(page, '.html')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    const template = createTemplate(title);
    
    try {
        fs.writeFileSync(page, template);
        console.log(`Updated ${page}`);
    } catch (error) {
        console.error(`Error updating ${page}:`, error);
    }
}); 