// User Profile Header Module
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Initialize the profile header
function initProfileHeader() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        // Update header-user-info element instead of creating a new header
        updateUserProfileDisplay(user);
    });
}

// Handle logout action
async function handleLogout() {
    try {
        const auth = getAuth();
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Update the header user info with user data
function updateUserProfileDisplay(user) {
    const headerUserInfo = document.getElementById('header-user-info');
    
    if (headerUserInfo) {
        if (user) {
            // User is logged in, show profile info
            let displayName = user.displayName || 'User';
            if (displayName.length > 10) {
                displayName = displayName.substring(0, 10) + '...';
            }
            
            const userPhoto = user.photoURL || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"%3E%3Cpath fill="%23e2e8f0" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.23 72 72S295.8 272 256 272c-39.77 0-72-32.23-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"%3E%3C/path%3E%3C/svg%3E';
            
            headerUserInfo.innerHTML = `
                <div class="dropdown">
                    <a class="dropdown-toggle d-flex align-items-center" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="${userPhoto}" alt="Profile" class="me-2">
                        <span>${displayName}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user-circle"></i> My Profile</a></li>
                        <li><a class="dropdown-item" href="gallery.html"><i class="fas fa-images"></i> My Gallery</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                </div>
            `;
            
            // Set up logout button functionality
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleLogout();
                });
            }
            
            // Make the header user info visible
            headerUserInfo.classList.remove('d-none');
        } else {
            // User is not logged in, hide the profile section
            headerUserInfo.classList.add('d-none');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProfileHeader);

// Export the initialization function
export { initProfileHeader }; 