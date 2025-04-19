// Import Firebase SDKs
let app, db;

// Wikivoyage API endpoint
const WIKIVOYAGE_API = 'https://en.wikivoyage.org/w/api.php';

// Import necessary functions from wikivoyage-service
import { fetchWikivoyageContent } from './wikivoyage-service.js';

async function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function initializeFirebase() {
    try {
        // Load Firebase scripts
        await Promise.all([
            loadScript('https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js'),
            loadScript('https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js')
        ]);

        // Get Firebase modules
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js');
        const { getFirestore, collection, doc, setDoc, serverTimestamp } = 
            await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js');
        
        // Firebase Config
        const firebaseConfig = {
            apiKey: "AIzaSyByb5wVh6ojASWxwBXyzBX8HazDsWO1MNs",
            authDomain: "exploretheworld-ff671.firebaseapp.com",
            projectId: "exploretheworld-ff671",
            storageBucket: "exploretheworld-ff671.appspot.com",
            messagingSenderId: "122418833897",
            appId: "1:122418833897:web:66f96d2796726eeff3c378",
            measurementId: "G-8PWLG7NVZK"
        };

        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        
        return { collection, doc, setDoc, serverTimestamp };
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        throw error;
    }
}

// Categories for destinations
const DESTINATION_CATEGORIES = {
    'Cities': 'Urban',
    'Beaches': 'Beach',
    'Mountains': 'Mountain',
    'Historical': 'Cultural',
    'Nature': 'Nature',
    'Islands': 'Island'
};

// Regions mapping with more destinations
const REGIONS = {
    'Europe': [
        'Paris', 'Rome', 'London', 'Barcelona', 'Amsterdam', 'Prague', 'Venice', 'Vienna',
        'Berlin', 'Madrid', 'Athens', 'Istanbul', 'Copenhagen', 'Stockholm', 'Dublin'
    ],
    'Asia': [
        'Tokyo', 'Bangkok', 'Singapore', 'Bali', 'Hong Kong', 'Seoul', 'Shanghai', 'Beijing',
        'Dubai', 'Mumbai', 'Kyoto', 'Hanoi', 'Ho Chi Minh City', 'Taipei', 'Manila'
    ],
    'North America': [
        'New York', 'San Francisco', 'Vancouver', 'Cancun', 'Las Vegas', 'Miami', 'Toronto',
        'Montreal', 'Chicago', 'Los Angeles', 'Seattle', 'Boston', 'New Orleans', 'Mexico City'
    ],
    'South America': [
        'Rio de Janeiro', 'Buenos Aires', 'Cusco', 'Machu Picchu', 'Santiago', 'Lima',
        'Cartagena', 'Quito', 'Bogota', 'Sao Paulo', 'Salvador', 'Medellin'
    ],
    'Africa': [
        'Cape Town', 'Marrakech', 'Cairo', 'Nairobi', 'Johannesburg', 'Zanzibar',
        'Victoria Falls', 'Luxor', 'Casablanca', 'Dar es Salaam', 'Addis Ababa'
    ],
    'Oceania': [
        'Sydney', 'Auckland', 'Fiji', 'Bora Bora', 'Melbourne', 'Brisbane', 'Perth',
        'Gold Coast', 'Queenstown', 'Wellington', 'Tahiti', 'Great Barrier Reef'
    ]
};

// Budget categories
const BUDGET_CATEGORIES = ['Budget', 'Mid-range', 'Luxury'];

// Add debugging function
async function testWikivoyageAPI(destination) {
    console.log(`🔍 Testing Wikivoyage API for: ${destination}`);
    try {
        const searchUrl = `https://en.wikivoyage.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(destination)}&srnamespace=0`;
        const searchResponse = await fetch(searchUrl);
        if (!searchResponse.ok) {
            console.error(`❌ API Error for ${destination}: ${searchResponse.status}`);
            return false;
        }
        const searchData = await searchResponse.json();
        console.log(`✅ Found ${searchData.query.search.length} results for ${destination}`);
        return searchData.query.search.length > 0;
    } catch (error) {
        console.error(`❌ Error testing API for ${destination}:`, error);
        return false;
    }
}

/**
 * Fetch destinations from Wikivoyage by region
 * @param {string} region - Region to fetch destinations for
 * @returns {Promise<string[]>} Array of destination names
 */
async function fetchDestinationsByRegion(region) {
    try {
        console.log(`🌍 Fetching destinations for ${region}...`);
        
        // First try to get direct category members
        const params = new URLSearchParams({
            action: 'query',
            list: 'categorymembers',
            cmtitle: `Category:${region}`,
            cmlimit: '500',
            cmtype: 'page',
            cmnamespace: '0', // Only get main namespace articles
            format: 'json',
            origin: '*'
        });

        const url = `${WIKIVOYAGE_API}?${params}`;
        console.log(`🔍 API URL: ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ HTTP error! status: ${response.status}`);
            console.log('Response headers:', Object.fromEntries([...response.headers]));
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.error) {
            console.error(`❌ API error:`, data.error);
            return [];
        }

        // Get destinations from direct category members
        const destinations = new Set();
        const directMembers = data.query?.categorymembers || [];
        
        // Filter and add direct members
        directMembers.forEach(member => {
            const title = member.title;
            if (!title.startsWith('Category:') && 
                !title.startsWith('Template:') && 
                !title.startsWith('File:') && 
                !title.includes('disambiguation')) {
                destinations.add(title);
            }
        });

        // Now try to get subcategories
        const subcatParams = new URLSearchParams({
            action: 'query',
            list: 'categorymembers',
            cmtitle: `Category:${region}`,
            cmtype: 'subcat',
            cmlimit: '500',
            format: 'json',
            origin: '*'
        });

        const subcatResponse = await fetch(`${WIKIVOYAGE_API}?${subcatParams}`);
        const subcatData = await subcatResponse.json();
        const subcategories = subcatData.query?.categorymembers || [];

        // Fetch destinations from each subcategory
        for (const subcat of subcategories) {
            const subcatTitle = subcat.title.replace('Category:', '');
            console.log(`📂 Checking subcategory: ${subcatTitle}`);
            
            const subcatDestinations = await fetchDestinationsByRegion(subcatTitle);
            subcatDestinations.forEach(dest => destinations.add(dest));
            
            // Add a small delay between subcategory requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const filteredDestinations = Array.from(destinations);
        console.log(`✅ Found ${filteredDestinations.length} destinations in ${region}`);
        return filteredDestinations;
    } catch (error) {
        console.error(`❌ Error fetching destinations for ${region}:`, error);
        return [];
    }
}

// Modify fetchDestinationList to use dynamic fetching
async function fetchDestinationList() {
    try {
        // Define major regions in Wikivoyage using correct category names
        const regions = [
            // Cities by continent
            'Cities in Africa',
            'Cities in Asia',
            'Cities in Europe',
            'Cities in North America',
            'Cities in Oceania',
            'Cities in South America',
            // Popular city categories
            'Capital cities',
            'Port cities',
            'Historic cities',
            // Geographic features
            'National parks',
            'Islands',
            'Beaches',
            'Mountains',
            // Special categories
            'World Heritage Sites',
            'UNESCO World Heritage Sites',
            'Top level city articles',
            'Big city articles',
            'Huge city articles'
        ];

        console.log('🌎 Fetching destinations from all regions...');
        
        // Fetch destinations for each region
        const allDestinations = new Set(); // Use Set to avoid duplicates
        for (const region of regions) {
            const destinations = await fetchDestinationsByRegion(region);
            destinations.forEach(dest => allDestinations.add(dest));
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

            // If we got no results, try without "in" for city categories
            if (destinations.length === 0 && region.startsWith('Cities in ')) {
                const altRegion = region.replace('Cities in ', 'Cities of ');
                console.log(`🔄 Retrying with alternative category: ${altRegion}`);
                const altDestinations = await fetchDestinationsByRegion(altRegion);
                altDestinations.forEach(dest => allDestinations.add(dest));
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        const destinationList = Array.from(allDestinations);
        console.log(`📋 Total destinations found: ${destinationList.length}`);

        // Test API for sample destinations
        console.log('🔄 Testing Wikivoyage API accessibility...');
        const testResults = await Promise.all(
            destinationList.slice(0, 5).map(testWikivoyageAPI)
        );
        const successfulTests = testResults.filter(result => result).length;
        console.log(`✅ API Test Results: ${successfulTests}/5 successful`);

        return destinationList;
    } catch (error) {
        console.error('❌ Error fetching destination list:', error);
        // Fallback to predefined destinations if dynamic fetching fails
        console.log('⚠️ Falling back to predefined destinations...');
        return Object.values(REGIONS).flat();
    }
}

// Fetch detailed content for a destination
async function fetchWikivoyageData(destination) {
    console.log(`📥 Fetching data for ${destination}...`);
    
    try {
        // Construct base params for both direct and search queries
        const baseParams = {
            action: 'query',
            format: 'json',
            origin: '*',
            prop: 'extracts|images|info',
            inprop: 'url',
            exchars: 1500, // Limit extract to 1500 characters
            exintro: 1     // Only get the introduction section
        };

        // Try direct title match first
        let url = `${WIKIVOYAGE_API}?${new URLSearchParams({
            ...baseParams,
            titles: destination
        })}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0];

        // If page exists, return its data
        if (!page.missing) {
            return {
                extract: page.extract || `No description available for ${destination}`,
                images: page.images?.map(img => img.title) || [],
                wikiUrl: page.fullurl || `https://en.wikivoyage.org/wiki/${encodeURIComponent(destination)}`
            };
        }

        // If no direct match, try search
        const searchUrl = `${WIKIVOYAGE_API}?${new URLSearchParams({
            action: 'query',
            format: 'json',
            origin: '*',
            list: 'search',
            srsearch: destination,
            srnamespace: 0,
            srlimit: 1 // Only get best match
        })}`;

        const searchData = await (await fetch(searchUrl)).json();
        if (!searchData.query?.search?.[0]) {
            return {
                extract: `No description available for ${destination}`,
                images: [],
                wikiUrl: null
            };
        }

        // Fetch content for best match
        const bestMatch = searchData.query.search[0].title;
        const altUrl = `${WIKIVOYAGE_API}?${new URLSearchParams({
            ...baseParams,
            titles: bestMatch
        })}`;

        const altData = await (await fetch(altUrl)).json();
        const altPage = Object.values(altData.query.pages)[0];

        return {
            extract: altPage.extract || `No description available for ${destination}`,
            images: altPage.images?.map(img => img.title) || [],
            wikiUrl: altPage.fullurl || `https://en.wikivoyage.org/wiki/${encodeURIComponent(bestMatch)}`
        };
    } catch (error) {
        console.error(`❌ Error fetching data for ${destination}:`, error);
        return {
            extract: `Error fetching data for ${destination}`,
            images: [],
            wikiUrl: null
        };
    }
}

// Get region for a destination
async function getDestinationRegion(destination) {
    try {
        // Query Wikivoyage for categories of this destination
        const params = new URLSearchParams({
            action: 'query',
            titles: destination,
            prop: 'categories',
            cllimit: '50',
            format: 'json',
            origin: '*'
        });

        const response = await fetch(`${WIKIVOYAGE_API}?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const pages = data.query?.pages || {};
        const pageId = Object.keys(pages)[0];
        const categories = pages[pageId]?.categories?.map(cat => cat.title.toLowerCase()) || [];

        // Check categories for region matches
        if (categories.some(cat => cat.includes('europe'))) return 'Europe';
        if (categories.some(cat => cat.includes('asia'))) return 'Asia';
        if (categories.some(cat => cat.includes('north america'))) return 'North America';
        if (categories.some(cat => cat.includes('south america'))) return 'South America';
        if (categories.some(cat => cat.includes('africa'))) return 'Africa';
        if (categories.some(cat => cat.includes('oceania'))) return 'Oceania';

        // Fallback to checking predefined regions if no category match
        for (const [region, cities] of Object.entries(REGIONS)) {
            if (cities.includes(destination)) {
                return region;
            }
        }

        return 'Other';
    } catch (error) {
        console.error(`❌ Error determining region for ${destination}:`, error);
        return 'Other';
    }
}

// Get random category and budget
function getRandomCategory() {
    const categories = Object.values(DESTINATION_CATEGORIES);
    return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomBudget() {
    return BUDGET_CATEGORIES[Math.floor(Math.random() * BUDGET_CATEGORIES.length)];
}

// Store destination data in Firestore
async function saveToFirestore(destination, firebaseUtils) {
    console.log(`🔄 Processing ${destination}...`);
    try {
        // First test if we can fetch data
        const canFetch = await testWikivoyageAPI(destination);
        if (!canFetch) {
            console.error(`❌ Cannot fetch data for ${destination} - skipping`);
            return false;
        }

        const content = await fetchWikivoyageData(destination);
        if (!content || !content.extract) {
            console.error(`❌ No content found for ${destination}`);
            return false;
        }
        
        const destinationData = {
            name: destination,
            description: content.extract,
            region: await getDestinationRegion(destination),
            category: getRandomCategory(),
            budget: getRandomBudget(),
            imageUrl: 'https://source.unsplash.com/800x600/?' + encodeURIComponent(destination),
            images: content.images,
            wikiUrl: content.wikiUrl,
            createdAt: firebaseUtils.serverTimestamp(),
            lastUpdated: firebaseUtils.serverTimestamp()
        };

        const destinationRef = firebaseUtils.doc(firebaseUtils.collection(db, "destinations"), 
                                               destination.toLowerCase().replace(/\s+/g, '-'));
        await firebaseUtils.setDoc(destinationRef, destinationData);
        console.log(`✅ Saved ${destination} to Firestore!`);
        return true;
    } catch (error) {
        console.error(`❌ Error processing ${destination}:`, error);
        return false;
    }
}

// Main function to collect and save all destinations
export async function collectAndSaveAllDestinations() {
    try {
        console.log("🚀 Initializing Firebase...");
        const firebaseUtils = await initializeFirebase();
        
        console.log("🚀 Starting destination import process...");
        const destinations = await fetchDestinationList();
        console.log(`📋 Found ${destinations.length} destinations to process`);

        let successCount = 0;
        let failCount = 0;

        for (const destination of destinations) {
            const success = await saveToFirestore(destination, firebaseUtils);
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`
        🎉 Import process completed!
        ✅ Successfully imported: ${successCount} destinations
        ❌ Failed to import: ${failCount} destinations
        `);
    } catch (error) {
        console.error("Failed to initialize Firebase:", error);
        throw error;
    }
} 