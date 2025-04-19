const https = require('https');
const fs = require('fs');
const path = require('path');

const FIREBASE_VERSION = '11.4.0';
const FILES_TO_DOWNLOAD = [
    'firebase-app.js',
    'firebase-firestore.js'
];

const FIREBASE_BASE_URL = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
const OUTPUT_DIR = path.join(__dirname, 'js', 'firebase');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download each file
FILES_TO_DOWNLOAD.forEach(filename => {
    const url = `${FIREBASE_BASE_URL}/${filename}`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    
    https.get(url, (response) => {
        const file = fs.createWriteStream(outputPath);
        response.pipe(file);
        
        file.on('finish', () => {
            file.close();
            console.log(`✅ Downloaded ${filename}`);
        });
    }).on('error', (err) => {
        console.error(`❌ Error downloading ${filename}:`, err);
        fs.unlink(outputPath, () => {}); // Delete the file if download failed
    });
}); 