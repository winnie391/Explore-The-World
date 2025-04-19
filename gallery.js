// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    limit,
    startAfter,
    addDoc,
    getDoc,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
    Timestamp,
    serverTimestamp,
    where,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Track the last document for pagination
let lastVisible = null;
const IMAGES_PER_PAGE = 12;

// Current user object
let currentUser = null;

// LocalStorage Keys
const LIKES_STORAGE_KEY = 'gallery_likes';
const USER_LIKES_STORAGE_KEY = 'gallery_user_likes';
const COMMENTS_STORAGE_KEY = 'gallery_comments';

// Flag to track if we're using local storage fallback due to Firebase permission issues
let usingLocalStorageFallback = false;

// Initialize local storage if needed
function initLocalStorage() {
    if (!localStorage.getItem(LIKES_STORAGE_KEY)) {
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(USER_LIKES_STORAGE_KEY)) {
        localStorage.setItem(USER_LIKES_STORAGE_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(COMMENTS_STORAGE_KEY)) {
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify({}));
    }
}

// Initialize when the script loads
initLocalStorage();

// Set up authentication state change listener
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        // User is signed in
        enableInteractions();
        try {
            // Load user likes and handle errors gracefully
            loadUserLikes().catch(error => {
                console.error('Error loading user likes:', error);
                // Load likes from local storage as fallback
                if (error.code === 'permission-denied' || error.message.includes('permission')) {
                    usingLocalStorageFallback = true;
                    loadUserLikesFromLocalStorage();
                }
            });
        } catch (error) {
            console.error('Error in auth state change handler:', error);
            // Handle any unexpected errors
            usingLocalStorageFallback = true;
            loadUserLikesFromLocalStorage();
        }
    } else {
        // User is signed out
        disableInteractions();
    }
});

// Load user likes from local storage
function loadUserLikesFromLocalStorage() {
    if (!currentUser) return;
    
    console.log('Loading user likes from local storage');
    
    try {
        const userLikes = JSON.parse(localStorage.getItem(USER_LIKES_STORAGE_KEY) || '{}');
        
        console.log('User likes from local storage:', userLikes);
        
        // Clear all liked states first
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.classList.remove('liked');
            btn.querySelector('i').className = 'far fa-heart';
        });
        
        // Apply liked state to user's liked photos
        for (const photoId in userLikes) {
            console.log(`Marking photo ${photoId} as liked`);
            document.querySelectorAll(`.like-btn[data-photo-id="${photoId}"]`).forEach(btn => {
                btn.classList.add('liked');
                btn.querySelector('i').className = 'fas fa-heart';
            });
        }
        
        // Update like counts for all photos
        const photoIds = Array.from(new Set(
            Array.from(document.querySelectorAll('.gallery-card[data-photo-id]')).map(el => el.dataset.photoId)
        ));
        
        console.log('Updating like counts for photos:', photoIds);
        
        for (const photoId of photoIds) {
            updateLikeCountFromLocalStorage(photoId);
        }
    } catch (error) {
        console.error('Error loading likes from local storage:', error);
    }
}

// Add user like to local storage
function addUserLikeToLocalStorage(photoId) {
    // Update user likes
    const userLikes = JSON.parse(localStorage.getItem(USER_LIKES_STORAGE_KEY) || '{}');
    userLikes[photoId] = true;
    localStorage.setItem(USER_LIKES_STORAGE_KEY, JSON.stringify(userLikes));
    
    // Update total likes
    const allLikes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
    if (!allLikes[photoId]) {
        allLikes[photoId] = {};
    }
    
    if (currentUser) {
        allLikes[photoId][currentUser.uid] = {
            timestamp: new Date().toISOString()
        };
    }
    
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(allLikes));
}

// Remove user like from local storage
function removeUserLikeFromLocalStorage(photoId) {
    // Update user likes
    const userLikes = JSON.parse(localStorage.getItem(USER_LIKES_STORAGE_KEY) || '{}');
    delete userLikes[photoId];
    localStorage.setItem(USER_LIKES_STORAGE_KEY, JSON.stringify(userLikes));
    
    // Update total likes
    const allLikes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
    
    if (allLikes[photoId] && currentUser) {
        delete allLikes[photoId][currentUser.uid];
    }
    
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(allLikes));
}

// Update like count from local storage
function updateLikeCountFromLocalStorage(photoId) {
    const allLikes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
    const likeCount = allLikes[photoId] ? Object.keys(allLikes[photoId]).length : 0;
    
    // Update UI
    document.querySelectorAll(`.like-btn[data-photo-id="${photoId}"] .like-count`).forEach(el => {
        el.textContent = likeCount;
    });
}

// Add comment to local storage
function addCommentToLocalStorage(photoId, text, userName) {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || '{}');
    if (!comments[photoId]) {
        comments[photoId] = [];
    }
    
    comments[photoId].push({
        text,
        userName,
        timestamp: new Date().toISOString(),
        userId: getAuth().currentUser?.uid || 'anonymous'
    });
    
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
}

// Load comments from local storage
function loadCommentsFromLocalStorage(photoId) {
    console.log(`Loading comments from local storage for photo ID: ${photoId}`);
    
    const comments = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || '{}');
    const photoComments = comments[photoId] || [];
    
    console.log(`Found ${photoComments.length} comments in local storage for photo ID: ${photoId}`);
    
    // Update UI
    const commentsListEl = document.getElementById(`comments-list-${photoId}`);
    if (!commentsListEl) {
        console.error(`Comments list element not found for photo ID: ${photoId}`);
        return photoComments;
    }
    
    commentsListEl.innerHTML = '';
    
    // Update comment count
    updateCommentCount(photoId, photoComments.length);
    
    if (photoComments.length === 0) {
        commentsListEl.innerHTML = '<p class="text-muted text-center my-3">No comments yet</p>';
    } else {
        // Sort comments by timestamp (newest first)
        photoComments.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        // Add each comment to the list
        photoComments.forEach(comment => {
            const date = new Date(comment.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">
                        <i class="fas fa-user-circle"></i>
                        ${comment.userName || 'Guest User'}
                    </span>
                    <span class="comment-date">${formattedDate}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
            `;
            
            commentsListEl.appendChild(commentElement);
        });
    }
    
    return photoComments;
}

// Update comment count from local storage
function updateCommentCountFromLocalStorage(photoId) {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || '{}');
    const commentCount = comments[photoId] ? comments[photoId].length : 0;
    
    // Update UI
    document.querySelectorAll(`.comment-toggle-btn[data-photo-id="${photoId}"] .comment-count`).forEach(el => {
        el.textContent = commentCount;
    });
}

// Hide Firebase rules alert on page load if previously dismissed
document.addEventListener('DOMContentLoaded', () => {
    const alert = document.getElementById('firebase-rules-alert');
    if (alert && localStorage.getItem('hideFirebaseRulesAlert') === 'true') {
        alert.style.display = 'none';
    }
    
    // Load initial images
    loadUserImages();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreImages);
    }
    
    // Initialize gallery
    initGallery();
});

// Debug function to check if likes and comments are loaded correctly
function debugInteractionsLoading(message) {
    console.log(`[DEBUG] ${message}`);
    const likeCounters = document.querySelectorAll('.like-count');
    const commentCounters = document.querySelectorAll('.comment-count');
    
    console.log(`Found ${likeCounters.length} like counters and ${commentCounters.length} comment counters`);
    
    // Log the first few counters for debugging
    for (let i = 0; i < Math.min(5, likeCounters.length); i++) {
        const btn = likeCounters[i].closest('.like-btn');
        const photoId = btn ? btn.dataset.photoId : 'unknown';
        console.log(`Like counter ${i}: photo-id=${photoId}, value=${likeCounters[i].textContent}`);
    }
    
    for (let i = 0; i < Math.min(5, commentCounters.length); i++) {
        const btn = commentCounters[i].closest('.comment-toggle-btn');
        const photoId = btn ? btn.dataset.photoId : 'unknown';
        console.log(`Comment counter ${i}: photo-id=${photoId}, value=${commentCounters[i].textContent}`);
    }
}

// Load initial images from Firestore
export async function loadUserImages() {
    try {
        // Show loading indicator
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;
        
        // Clear the gallery grid before loading new images
        galleryGrid.innerHTML = '';
        
        // Create initial query
        const imagesQuery = query(
            collection(db, "images"), 
            orderBy("timestamp", "desc"), 
            limit(IMAGES_PER_PAGE)
        );
        
        const querySnapshot = await getDocs(imagesQuery);
        
        // Update last visible document for pagination
        if (!querySnapshot.empty) {
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            
            // Generate HTML for user images
            let userImagesHTML = '';
            
            querySnapshot.forEach((doc) => {
                const imageData = doc.data();
                userImagesHTML += createImageCard(imageData, doc.id);
            });
            
            // Add user images to the gallery
            if (userImagesHTML) {
                galleryGrid.innerHTML = userImagesHTML;
                
                // Setup event listeners for newly added elements
                setupEventListeners();
                
                // Debug before loading interactions
                debugInteractionsLoading('Before loading interactions');
                
                // Load interactions for new images
                try {
                    loadAllInteractions();
                    // Debug after loading interactions
                    debugInteractionsLoading('After loading interactions');
                } catch (error) {
                    console.error('Error loading interactions:', error);
                    // Switch to local storage fallback if permission error
                    if (error.code === 'permission-denied' || error.message.includes('permission')) {
                        usingLocalStorageFallback = true;
                    }
                }
            }
            
            // Set up filtering
            setupFiltering();
        }
    } catch (error) {
        console.error("Error loading images:", error);
        
        // Handle permission errors gracefully
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
            usingLocalStorageFallback = true;
            
            const galleryGrid = document.getElementById('gallery-grid');
            if (galleryGrid) {
                galleryGrid.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <h5><i class="fas fa-exclamation-triangle"></i> Permission Error</h5>
                            <p>Unable to load images at this time. Please try again later.</p>
                        </div>
                    </div>
                `;
            }
        }
    }
}

// Load more images when requested
export async function loadMoreImages() {
    if (!lastVisible) return;
    
    try {
        // Show loading spinner on load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
            loadMoreBtn.disabled = true;
        }
        
        // Create query for next batch of images
        const nextImagesQuery = query(
            collection(db, "images"),
            orderBy("timestamp", "desc"),
            startAfter(lastVisible),
            limit(IMAGES_PER_PAGE)
        );
        
        const querySnapshot = await getDocs(nextImagesQuery);
        
        // Update last visible for next pagination
        if (!querySnapshot.empty) {
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            
            let moreImagesHTML = '';
            
            querySnapshot.forEach((doc) => {
                const imageData = doc.data();
                moreImagesHTML += createImageCard(imageData, doc.id);
            });
            
            // Add new images to gallery
            if (moreImagesHTML) {
                const galleryGrid = document.getElementById('gallery-grid');
                galleryGrid.innerHTML += moreImagesHTML;
                
                // Setup event listeners for newly added elements
                setupEventListeners();
                
                // Load interactions for new images
                try {
                    // Get all newly added photo IDs
                    const newPhotoIds = Array.from(querySnapshot.docs).map(doc => doc.id);
                    
                    // Load interactions for just these new photos
                    newPhotoIds.forEach(photoId => {
                        loadLikesCount(photoId);
                        loadComments(photoId);
                    });
                    
                    // Load user likes for new photos if user is logged in
                    if (currentUser) {
                        loadUserLikes(newPhotoIds);
                    }
                } catch (error) {
                    console.error('Error loading interactions for new images:', error);
                    // Show Firebase rules alert if there's a permission error
                    if (error.code === 'permission-denied' || error.message.includes('permission')) {
                        usingLocalStorageFallback = true;
                    }
                }
                
                // Re-run filtering if a filter is active
                const activeFilter = document.querySelector('[data-filter].active');
                if (activeFilter && activeFilter.getAttribute('data-filter') !== 'all') {
                    filterGallery(activeFilter.getAttribute('data-filter'));
                }
            }
            
            // Hide load more button if we've reached the end
            if (querySnapshot.size < IMAGES_PER_PAGE) {
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = 'none';
                }
            }
        } else {
            // No more images to load
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
        
        // Reset load more button
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = 'Load More';
            loadMoreBtn.disabled = false;
        }
    } catch (error) {
        console.error("Error loading more images:", error);
        
        // Handle permission errors gracefully
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
            usingLocalStorageFallback = true;
        }
        
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = 'Load More';
            loadMoreBtn.disabled = false;
        }
    }
}

// Helper function to create image card HTML
function createImageCard(imageData, id) {
    const timestamp = imageData.timestamp ? formatTimestamp(imageData.timestamp) : 'Just now';
    const category = imageData.category ? `<span class="category-badge">${imageData.category}</span>` : '';
    const userName = imageData.userName || 'Anonymous';
    
    return `
        <div class="col-lg-4 col-md-6 gallery-item" data-category="${imageData.category || 'user'}" data-id="${id}">
            <div class="gallery-card" data-photo-id="${id}">
                ${category}
                <div class="card-img-wrapper">
                    <a href="${imageData.imageUrl}" data-lightbox="gallery" data-title="${imageData.title || 'User Image'}" class="image-link">
                        <img src="${imageData.imageUrl}" 
                            class="img-fluid" 
                            alt="${imageData.title || 'User Image'}"
                            loading="lazy"
                            onload="this.parentElement.parentElement.classList.remove('loading'); this.classList.add('fade-in')">
                        <div class="zoom-icon">
                            <i class="fas fa-search-plus"></i>
                        </div>
                    </a>
                    <div class="gallery-overlay">
                        <h5>${imageData.title || 'User Image'}</h5>
                        <div class="description-wrapper">
                            <p class="image-description">${imageData.description || 'No description provided'}</p>
                        </div>
                        <div class="image-meta">
                            <span class="uploader"><i class="fas fa-user"></i> ${userName}</span>
                            <span class="upload-time"><i class="far fa-clock"></i> ${timestamp}</span>
                        </div>
                    </div>
                </div>
                <div class="gallery-interactions">
                    <div class="interaction-buttons">
                        <button class="interaction-btn like-btn" data-photo-id="${id}">
                            <i class="far fa-heart"></i> <span class="like-count">0</span>
                        </button>
                        <button class="interaction-btn comment-toggle-btn" data-photo-id="${id}" data-tooltip="Comment">
                            <i class="far fa-comment"></i> <span class="comment-count">0</span>
                        </button>
                    </div>
                    <div class="upload-info">
                        <i class="far fa-clock"></i> ${timestamp}
                    </div>
                    <div class="comments-section" id="comments-${id}" style="display: none;">
                        <div class="comments-list" id="comments-list-${id}">
                            <!-- Comments will be loaded here -->
                        </div>
                        <form class="comment-form" data-photo-id="${id}">
                            <input type="text" placeholder="Add a comment..." required>
                            <button type="submit"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup gallery filtering
function setupFiltering() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            filterGallery(filterValue);
        });
    });
}

// Filter gallery items
function filterGallery(filterValue) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Setup event listeners for like buttons, comment toggles, and comment forms
export function setupEventListeners() {
    // Set up like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.removeEventListener('click', handleLikeClick);
        btn.addEventListener('click', handleLikeClick);
    });
    
    // Set up comment toggle buttons
    document.querySelectorAll('.comment-toggle-btn').forEach(btn => {
        btn.removeEventListener('click', handleCommentToggle);
        btn.addEventListener('click', handleCommentToggle);
    });
    
    // Set up comment forms
    document.querySelectorAll('.comment-form').forEach(form => {
        form.removeEventListener('submit', handleCommentSubmit);
        form.addEventListener('submit', handleCommentSubmit);
    });
}

// Load all interactions (likes and comments) for the current gallery
export function loadAllInteractions() {
    // Get all visible photos
    const galleryCards = document.querySelectorAll('.gallery-card[data-photo-id]');
    const photoIds = Array.from(galleryCards).map(el => el.dataset.photoId).filter(Boolean);
    
    console.log('Found photo IDs:', photoIds);
    
    // Load likes and comments for each photo
    photoIds.forEach(photoId => {
        loadLikesCount(photoId);
        loadComments(photoId);
    });
    
    // Load user likes to highlight liked photos
    if (currentUser) {
        loadUserLikes(photoIds);
    }
}

// Initialize gallery
export function initGallery() {
    // Initialize lightbox with custom options
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'showImageNumberLabel': false,
        'fadeDuration': 300,
        'imageFadeDuration': 300,
        'positionFromTop': 100,
        'alwaysShowNavOnTouchDevices': true
    });

    // Load initial images
    loadUserImages().then(() => {
        console.log('Initial images loaded');
        loadAllInteractions();
    }).catch(error => {
        console.error('Error loading initial images:', error);
    });

    // Set up event listeners
    setupEventListeners();
    setupFiltering();
}

// Firebase interaction functions
export async function handleLikeClick(event) {
    const button = event.currentTarget;
    const photoId = button.dataset.photoId;
    const auth = getAuth();
    
    if (!auth.currentUser) {
        alert('Please sign in to like photos');
        return;
    }
    
    const userId = auth.currentUser.uid;
    const likeId = `${photoId}_${userId}`;
    const likeRef = doc(db, 'likes', likeId);
    
    try {
        const likeDoc = await getDoc(likeRef);
        
        if (likeDoc.exists()) {
            // Unlike
            await deleteDoc(likeRef);
            button.classList.remove('liked');
            button.querySelector('i').className = 'far fa-heart';
        } else {
            // Like
            await setDoc(likeRef, {
                photoId,
                userId,
                timestamp: serverTimestamp()
            });
            button.classList.add('liked');
            button.querySelector('i').className = 'fas fa-heart';
            
            // Add like animation
            button.querySelector('i').style.animation = 'none';
            button.querySelector('i').offsetHeight; // Trigger reflow
            button.querySelector('i').style.animation = null;
            }
            
        // Update like count
        await updateLikeCount(photoId);
        
    } catch (error) {
        console.error('Error toggling like:', error);
        }
    }

// Helper function to get user display name
function getUserDisplayName(userId) {
    const auth = getAuth();
    if (auth.currentUser && userId === auth.currentUser.uid) {
        return auth.currentUser.displayName || 'You';
    }
    return 'Guest User';
}

// Update loadComments function
export async function loadComments(photoId) {
    const commentsSection = document.getElementById(`comments-${photoId}`);
    const commentsList = document.getElementById(`comments-list-${photoId}`);
    
    if (!commentsList) return;
    
    try {
        const commentsRef = collection(db, 'comments');
        const q = query(
            commentsRef,
            where('photoId', '==', photoId),
            orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        commentsList.innerHTML = '';
        
        // Update comment count
        updateCommentCount(photoId, querySnapshot.size);
        
        if (querySnapshot.empty) {
            commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const comment = doc.data();
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            
            // Get user display name
            const displayName = comment.userDisplayName || getUserDisplayName(comment.userId);
            
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">
                        <i class="fas fa-user-circle"></i>
                        ${displayName}
                    </span>
                    <span class="comment-date">
                        ${formatTimestamp(comment.timestamp)}
                    </span>
                </div>
                <p class="comment-text">${comment.text}</p>
            `;
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error loading comments:', error);
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
            usingLocalStorageFallback = true;
            loadCommentsFromLocalStorage(photoId);
        } else {
            commentsList.innerHTML = '<p class="text-danger">Error loading comments</p>';
        }
    }
}

// Update handleCommentSubmit function
export async function handleCommentSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const photoId = form.dataset.photoId;
    const input = form.querySelector('input');
    const commentText = input.value.trim();
    const auth = getAuth();
    
    if (!auth.currentUser) {
        alert('Please sign in to comment');
        return;
    }
    
    if (!commentText) return;
    
    try {
        if (usingLocalStorageFallback) {
            const userName = auth.currentUser.displayName || 'You';
            addCommentToLocalStorage(photoId, commentText, userName);
            input.value = '';
            loadCommentsFromLocalStorage(photoId);
            return;
        }

        const commentsRef = collection(db, 'comments');
        await addDoc(commentsRef, {
            photoId,
            userId: auth.currentUser.uid,
            userDisplayName: auth.currentUser.displayName || 'You',
            text: commentText,
            timestamp: serverTimestamp()
        });
        
        input.value = '';
        await loadComments(photoId);
        
        // Get updated comment count
        const q = query(commentsRef, where('photoId', '==', photoId));
        const querySnapshot = await getDocs(q);
        updateCommentCount(photoId, querySnapshot.size);
    } catch (error) {
        console.error('Error adding comment:', error);
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
            usingLocalStorageFallback = true;
            const userName = auth.currentUser.displayName || 'You';
            addCommentToLocalStorage(photoId, commentText, userName);
            input.value = '';
            loadCommentsFromLocalStorage(photoId);
        }
    }
}

async function updateLikeCount(photoId) {
    const likeCountElement = document.querySelector(`[data-photo-id="${photoId}"] .like-count`);
    if (!likeCountElement) return;
    
    try {
        const likesRef = collection(db, 'likes');
        const q = query(likesRef, where('photoId', '==', photoId));
        const querySnapshot = await getDocs(q);
        likeCountElement.textContent = querySnapshot.size;
    } catch (error) {
        console.error('Error updating like count:', error);
    }
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

// Toggle comment section visibility
export function handleCommentToggle(event) {
    const btn = event.currentTarget;
    const photoId = btn.dataset.photoId;
    const commentsSection = document.getElementById(`comments-${photoId}`);
    
    if (commentsSection) {
        // Toggle visibility
        if (commentsSection.style.display === 'none') {
            commentsSection.style.display = 'block';
            loadComments(photoId); // Refresh comments when section is opened
        } else {
            commentsSection.style.display = 'none';
        }
    }
}

// Handle dynamic gallery items (for those loaded from Firestore)
export function setupDynamicGalleryItem(photoElement, photoData) {
    const photoId = photoData.id;
    
    // Create interaction elements
    const interactionsDiv = document.createElement('div');
    interactionsDiv.className = 'gallery-interactions';
    interactionsDiv.innerHTML = `
        <div class="interaction-buttons">
            <button class="interaction-btn like-btn" data-photo-id="${photoId}">
                <i class="far fa-heart"></i> <span class="like-count">0</span>
            </button>
            <button class="interaction-btn comment-toggle-btn" data-photo-id="${photoId}">
                <i class="far fa-comment"></i> <span class="comment-count">0</span>
            </button>
        </div>
        <div class="comments-section" id="comments-${photoId}" style="display: none;">
            <div class="comments-list" id="comments-list-${photoId}">
                <!-- Comments will be loaded here -->
            </div>
            <form class="comment-form" data-photo-id="${photoId}">
                <input type="text" placeholder="Add a comment..." required>
                <button type="submit"><i class="fas fa-paper-plane"></i></button>
            </form>
        </div>
    `;
    
    // Add interaction elements to the photo card
    photoElement.appendChild(interactionsDiv);
    
    // Setup event listeners for new elements
    const likeBtn = interactionsDiv.querySelector('.like-btn');
    const commentToggleBtn = interactionsDiv.querySelector('.comment-toggle-btn');
    const commentForm = interactionsDiv.querySelector('.comment-form');
    
    likeBtn.addEventListener('click', handleLikeClick);
    commentToggleBtn.addEventListener('click', handleCommentToggle);
    commentForm.addEventListener('submit', handleCommentSubmit);
    
    // Load initial data
    loadLikesCount(photoId);
    loadComments(photoId);
    
    // Check if user already liked this photo
    if (currentUser) {
        checkUserLike(photoId, currentUser.uid, likeBtn);
    }
    
    return interactionsDiv;
}

// Check if user already liked a photo
async function checkUserLike(photoId, userId, likeBtn) {
    try {
        const likeRef = doc(db, 'likes', `${photoId}_${userId}`);
        const likeDoc = await getDoc(likeRef);
        
        if (likeDoc.exists()) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').className = 'fas fa-heart';
        }
    } catch (error) {
        console.error('Error checking user like:', error);
    }
}

// Enable interaction buttons for logged-in users
function enableInteractions() {
    document.querySelectorAll('.interaction-btn').forEach(btn => {
        btn.disabled = false;
    });
    
    document.querySelectorAll('.comment-form').forEach(form => {
        form.querySelectorAll('input, button').forEach(el => {
            el.disabled = false;
        });
    });
}

// Disable interaction buttons for logged-out users
function disableInteractions() {
    document.querySelectorAll('.interaction-btn').forEach(btn => {
        btn.disabled = false; // Keep enabled but will prompt for login when clicked
    });
    
    document.querySelectorAll('.comment-form').forEach(form => {
        form.querySelectorAll('input, button').forEach(el => {
            el.disabled = true;
        });
        
        // Add placeholder message
        const input = form.querySelector('input');
        if (input) {
            input.placeholder = "Login to add a comment";
        }
    });
}

// Load user's liked photos to update UI
async function loadUserLikes(photoIds) {
    if (!currentUser) return;
    
    try {
        // If using local storage fallback, get likes from there
        if (usingLocalStorageFallback) {
            const userLikes = JSON.parse(localStorage.getItem(USER_LIKES_STORAGE_KEY) || '{}');
            
            // Mark each photo the user has liked
            Object.keys(userLikes).forEach(photoId => {
                document.querySelectorAll(`.like-btn[data-photo-id="${photoId}"]`).forEach(btn => {
                    btn.classList.add('liked');
                    btn.querySelector('i').className = 'fas fa-heart';
                });
            });
            
            return;
        }
        
        // Normal Firebase operation - handle a specific set of photoIds if provided
        if (photoIds && Array.isArray(photoIds)) {
            for (const photoId of photoIds) {
                const likeRef = doc(db, 'likes', `${photoId}_${currentUser.uid}`);
                const likeDoc = await getDoc(likeRef);
                
                if (likeDoc.exists()) {
                    // Mark the photo as liked in UI
                    const likeBtn = document.querySelector(`.like-btn[data-photo-id="${photoId}"]`);
                    if (likeBtn) {
                        likeBtn.classList.add('liked');
                        likeBtn.querySelector('i').className = 'fas fa-heart';
                    }
                }
            }
            return;
        }
        
        // If no specific photoIds are provided, load all user likes
        const likesQuery = query(
            collection(db, 'likes'),
            where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(likesQuery);
        
        // Clear all liked states first
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.classList.remove('liked');
            btn.querySelector('i').className = 'far fa-heart';
        });
        
        // Apply liked state to user's liked photos
        snapshot.forEach(doc => {
            const photoId = doc.data().photoId;
            document.querySelectorAll(`.like-btn[data-photo-id="${photoId}"]`).forEach(btn => {
                btn.classList.add('liked');
                btn.querySelector('i').className = 'fas fa-heart';
            });
        });
    } catch (error) {
        console.error('Error loading user likes:', error);
        // Show Firebase rules alert if there's a permission error
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
            usingLocalStorageFallback = true;
            loadUserLikesFromLocalStorage();
        }
    }
}

// Load likes count for a specific photo
async function loadLikesCount(photoId) {
    try {
        if (usingLocalStorageFallback) {
            updateLikeCountFromLocalStorage(photoId);
            return;
        }

        const likesRef = collection(db, 'likes');
        const q = query(likesRef, where('photoId', '==', photoId));
        const querySnapshot = await getDocs(q);
        
        // Update all like count elements for this photo
        document.querySelectorAll(`.like-btn[data-photo-id="${photoId}"] .like-count`).forEach(el => {
            el.textContent = querySnapshot.size;
        });
    } catch (error) {
        console.error('Error loading likes count:', error);
        // If there's a permission error, fall back to local storage
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
            usingLocalStorageFallback = true;
            updateLikeCountFromLocalStorage(photoId);
        }
    }
}

// Add this new function to update comment count
async function updateCommentCount(photoId, count) {
    try {
        // Update all comment count elements for this photo
        document.querySelectorAll(`.comment-toggle-btn[data-photo-id="${photoId}"] .comment-count`).forEach(el => {
            el.textContent = count;
        });
    } catch (error) {
        console.error('Error updating comment count:', error);
    }
} 