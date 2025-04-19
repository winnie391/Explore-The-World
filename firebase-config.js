// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAb6bp6ot5tWz16b1qJzv_30VxJR87nzW8",
    authDomain: "gallery-1609e.firebaseapp.com",
    projectId: "gallery-1609e",
    storageBucket: "gallery-1609e.firebasestorage.app",
    messagingSenderId: "616484716286",
    appId: "1:616484716286:web:2cdfe99e8698e03687afaf",
    measurementId: "G-F4VM09MT90"
};

// Initialize Firebase
let app;
let db;
let analytics;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    analytics = getAnalytics(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Add some test data if the destinations collection is empty
async function initializeTestData() {
    if (!db) {
        console.error('Firestore not initialized');
        return;
    }

    try {
        const destinationsRef = collection(db, "destinations");
        const snapshot = await getDocs(destinationsRef);
        
        if (snapshot.empty) {
            console.log("No destinations found, adding test data...");
            const testDestinations = [
                {
                    name: "Paris",
                    region: "Europe",
                    category: "City",
                    budget: "Luxury",
                    description: "The City of Light, known for its iconic Eiffel Tower and world-class cuisine.",
                    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                    createdAt: serverTimestamp()
                },
                {
                    name: "Bali",
                    region: "Asia",
                    category: "Beach",
                    budget: "Mid-range",
                    description: "A tropical paradise with beautiful beaches and rich cultural heritage.",
                    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
                    createdAt: serverTimestamp()
                },
                {
                    name: "New York",
                    region: "North America",
                    category: "City",
                    budget: "Luxury",
                    description: "The Big Apple, a vibrant metropolis known for its iconic skyline and diverse culture.",
                    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
                    createdAt: serverTimestamp()
                }
            ];

            for (const destination of testDestinations) {
                try {
                    await addDoc(destinationsRef, destination);
                    console.log(`Added test destination: ${destination.name}`);
                } catch (error) {
                    console.error(`Error adding destination: ${destination.name}`, error);
                }
            }
        } else {
            console.log("Destinations collection already has data");
        }
    } catch (error) {
        console.error('Error initializing test data:', error);
    }
}

// Initialize test data
initializeTestData().catch(console.error);

// Export the initialized Firestore instance
export { db }; 