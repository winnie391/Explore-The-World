// Import Firebase Auth functions
import { 
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    browserLocalPersistence,
    setPersistence,
    getAuth,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    setDoc,
    collection 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

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
const app = initializeApp(firebaseConfig);
// Get auth instance directly
const auth = getAuth(app);
const db = getFirestore(app);

// Make auth globally available
window.auth = auth;

// Enable persistence
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log('Persistence enabled');
    })
    .catch((error) => {
        console.error('Persistence error:', error);
    });

// Mock user data (replace with actual backend authentication)
const validUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'user@example.com', password: 'user123', role: 'user' }
];

// Check if user is logged in
function isLoggedIn() {
    return auth.currentUser !== null;
}

// Get current user
function getCurrentUser() {
    const user = auth.currentUser;
    if (user) {
        return {
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            role: 'user'
        };
    }
    return null;
}

// Store user data in Firestore
async function storeUserData(userId, userData) {
    try {
        await setDoc(doc(db, 'users', userId), {
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error storing user data:', error);
        // Don't let Firestore errors affect the authentication flow
        console.warn('Continuing authentication process despite Firestore error');
        return true;
    }
}

// Register with email/password
async function registerWithEmail(email, password, fullName) {
    try {
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with full name
        await updateProfile(user, {
            displayName: fullName
        });

        // Store additional user data in Firestore
        const userData = {
            email: user.email,
            displayName: fullName,
            role: 'user',
            provider: 'email',
            photoURL: null
        };

        // Try to store in Firestore but don't block if it fails
        try {
            await storeUserData(user.uid, userData);
        } catch (firestoreError) {
            console.error('Firestore error (non-blocking):', firestoreError);
        }

        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

// Register/Login with Google
async function loginWithGoogle() {
    console.log("Google login initiated");
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log("Google login successful", user.email);
        
        // Store user data in Firestore
        const userData = {
            email: user.email,
            displayName: user.displayName,
            role: 'user',
            provider: 'google',
            photoURL: user.photoURL
        };

        // Try to store in Firestore but don't block if it fails
        try {
            await storeUserData(user.uid, userData);
        } catch (firestoreError) {
            console.error('Firestore error (non-blocking):', firestoreError);
        }
        
        // Show success message and redirect
        const message = document.getElementById('registerMessage') || document.getElementById('loginMessage');
        if (message) {
            message.className = 'alert alert-success mt-3';
            message.textContent = 'Login successful! Redirecting...';
        }
        
        setTimeout(() => {
            window.location.href = 'gallery.html';
        }, 1500);
    } catch (error) {
        console.error('Google login error:', error);
        const message = document.getElementById('registerMessage') || document.getElementById('loginMessage');
        if (message) {
            message.className = 'alert alert-danger mt-3';
            message.textContent = 'Login failed: ' + error.message;
        }
    }
}

// Make auth functions available globally
window.loginWithGoogle = loginWithGoogle;
window.registerWithGoogle = loginWithGoogle;

// Debug logging for confirming functions are available globally
console.log("Auth functions registered globally", {
    loginWithGoogle: !!window.loginWithGoogle,
    registerWithGoogle: !!window.registerWithGoogle
});

// Rate limiting for password reset
const resetAttempts = new Map();
const MAX_RESET_ATTEMPTS = 3;
const RESET_TIMEOUT = 3600000; // 1 hour in milliseconds

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254; // RFC 5321
}

// Rate limiting check function
function checkResetRateLimit(email) {
    const now = Date.now();
    const attempts = resetAttempts.get(email) || { count: 0, timestamp: now };
    
    // Clear attempts if timeout has passed
    if (now - attempts.timestamp >= RESET_TIMEOUT) {
        resetAttempts.delete(email);
        return true;
    }
    
    // Check if max attempts reached
    if (attempts.count >= MAX_RESET_ATTEMPTS) {
        const remainingTime = Math.ceil((RESET_TIMEOUT - (now - attempts.timestamp)) / 60000);
        throw new Error(`Too many reset attempts. Please try again in ${remainingTime} minutes.`);
    }
    
    // Update attempts
    attempts.count += 1;
    attempts.timestamp = now;
    resetAttempts.set(email, attempts);
    return true;
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Setting up auth forms");
    
    // Reset Password form handling
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        console.log("Reset password form found, adding event listener");
        resetPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value.trim().toLowerCase();
            const resetMessage = document.getElementById('resetMessage');
            const submitButton = resetPasswordForm.querySelector('button[type="submit"]');
            
            try {
                // Disable submit button
                submitButton.disabled = true;
                
                // Show loading message
                resetMessage.className = 'alert alert-info';
                resetMessage.textContent = 'Verifying request...';
                
                // Validate email
                if (!isValidEmail(email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                // Check rate limiting
                checkResetRateLimit(email);
                
                // Show loading message
                resetMessage.textContent = 'Sending reset link...';
                
                // Send password reset email
                await sendPasswordResetEmail(auth, email, {
                    // URL to redirect to after password reset (optional)
                    url: window.location.origin + '/login.html',
                    handleCodeInApp: true
                });
                
                // Clear form
                resetPasswordForm.reset();
                
                // Show success message with security reminder
                resetMessage.className = 'alert alert-success';
                resetMessage.innerHTML = `
                    Password reset link has been sent to your email!<br>
                    <small class="text-muted">
                        • The link will expire in 1 hour<br>
                        • Check your spam folder if you don't see the email<br>
                        • Never share your password reset link with anyone
                    </small>
                `;
                
                // Log successful attempt (for security monitoring)
                console.log('Password reset requested for:', email);
                
                // Close modal after 5 seconds (increased from 3 for better readability)
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
                    if (modal) {
                        modal.hide();
                    }
                }, 5000);
            } catch (error) {
                console.error('Password reset error:', error);
                resetMessage.className = 'alert alert-danger';
                resetMessage.textContent = error.message || 'Failed to send reset link. Please try again.';
                
                // Log failed attempt (for security monitoring)
                console.warn('Failed password reset attempt:', {
                    email,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            } finally {
                // Re-enable submit button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("Login form found, adding event listener");
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const loginMessage = document.getElementById('loginMessage');
            
            // Show loading message
            loginMessage.className = 'alert alert-info mt-3';
            loginMessage.textContent = 'Logging in...';
            
            try {
                // Sign in with Firebase
                console.log("Attempting login with", email);
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                console.log("Login successful for:", user.email);
                
                loginMessage.className = 'alert alert-success mt-3';
                loginMessage.textContent = 'Login successful! Redirecting...';
                
                setTimeout(() => {
                    window.location.href = 'gallery.html';
                }, 1500);
            } catch (error) {
                console.error('Login error:', error);
                loginMessage.className = 'alert alert-danger mt-3';
                loginMessage.textContent = error.message || 'Invalid email or password';
            }
        });
    }
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("Register form found, adding event listener");
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.getElementById('termsAccept').checked;
            const registerMessage = document.getElementById('registerMessage');
            
            // Validation
            if (password !== confirmPassword) {
                registerMessage.className = 'alert alert-danger mt-3';
                registerMessage.textContent = 'Passwords do not match';
                return;
            }
            
            if (!termsAccepted) {
                registerMessage.className = 'alert alert-danger mt-3';
                registerMessage.textContent = 'Please accept the Terms of Service and Privacy Policy';
                return;
            }

            // Register user
            registerMessage.className = 'alert alert-info mt-3';
            registerMessage.textContent = 'Registering your account...';
            
            console.log("Attempting registration for", email);
            const result = await registerWithEmail(email, password, fullName);
            
            if (result.success) {
                registerMessage.className = 'alert alert-success mt-3';
                registerMessage.textContent = 'Registration successful! Redirecting...';
                
                setTimeout(() => {
                    window.location.href = 'gallery.html';
                }, 1500);
            } else {
                registerMessage.className = 'alert alert-danger mt-3';
                registerMessage.textContent = result.error || 'Registration failed. Please try again.';
            }
        });
    }

    // Set up social login buttons
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        console.log("Google login button found, adding event listener");
        googleLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginWithGoogle();
        });
    }
    
    const googleRegisterBtn = document.getElementById('googleRegisterBtn');
    if (googleRegisterBtn) {
        console.log("Google register button found, adding event listener");
        googleRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerWithGoogle();
        });
    }

    // Update navigation based on auth status
    const authNav = document.querySelector('.auth-nav');
    if (authNav) {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // When user is logged in, we don't need to show nav items here
                // as they're available in the user profile dropdown
                authNav.innerHTML = ''; // Clear the auth nav
                
                // Update the header with user info if present
                const headerUserInfo = document.getElementById('header-user-info');
                if (headerUserInfo) {
                    headerUserInfo.style.display = 'block';
                }
            } else {
                authNav.innerHTML = `
                    <li class="nav-item">
                        <a class="nav-link" href="login.html">Login</a>
                    </li>
                `;
                
                // Hide the header user info if present
                const headerUserInfo = document.getElementById('header-user-info');
                if (headerUserInfo) {
                    headerUserInfo.style.display = 'none';
                }
            }
        });
    }
});

// Logout function
async function logout() {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Make logout available globally
window.logout = logout; 