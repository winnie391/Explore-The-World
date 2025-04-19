# Explore the World - Travel Website

A responsive travel website built with HTML, CSS, and JavaScript that showcases travel destinations, provides travel tips, and offers an interactive gallery.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices (mobile, tablet, desktop)
- **Modern UI**: Clean and modern interface with smooth animations and transitions
- **Interactive Elements**: Dynamic content filtering, image lightbox, and form validations
- **Local Storage**: Saves user preferences and favorites using browser storage
- **Session Storage**: Maintains session data like search history
- **API Integration**: Ready for integration with external APIs like weather services

## Pages

1. **Home Page**: Landing page with hero section, featured destinations, and travel tips
2. **Destinations**: Grid layout of travel destinations with filtering options
3. **Travel Tips**: Blog-style layout with travel advice and guides
4. **Gallery**: Photo and video gallery with filtering and lightbox functionality
5. **Contact**: Contact form, Google Maps integration, and FAQ section

## Technologies Used

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with flexbox and grid layouts
- **Bootstrap 5**: Responsive framework for UI components
- **JavaScript**: Dynamic functionality and interactivity
- **jQuery**: Simplified DOM manipulation
- **Font Awesome**: Icon library
- **Google Fonts**: Typography with Montserrat and Poppins
- **Lightbox**: Image gallery lightbox functionality

## Browser Storage Implementation

- **Local Storage**:
  - Newsletter subscriptions
  - Favorite destinations
  - Recently viewed destinations
  - First-time visitor detection

- **Session Storage**:
  - Search history
  - Current filters

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/explore-the-world.git
   ```

2. Navigate to the project directory:
   ```
   cd explore-the-world
   ```

3. Open the website:
   - Simply open `index.html` in your web browser
   - Alternatively, use a local development server like Live Server in VS Code

## Project Structure

```
explore-the-world/
├── index.html              # Home page
├── destinations.html       # Destinations page
├── travel-tips.html        # Travel tips page
├── gallery.html            # Gallery page
├── contact.html            # Contact page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js             # Main JavaScript file
├── images/                 # Image assets (not included in this demo)
└── README.md               # Project documentation
```

## Future Enhancements

- User authentication system
- Booking functionality
- Weather API integration
- Progressive Web App (PWA) capabilities
- Blog section with CMS
- Multi-language support

## Credits

- Images: [Unsplash](https://unsplash.com)
- Icons: [Font Awesome](https://fontawesome.com)
- Fonts: [Google Fonts](https://fonts.google.com)
- Framework: [Bootstrap](https://getbootstrap.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Your Name - [your-website.com](https://your-website.com)

---

© 2025 Explore the World. All Rights Reserved.

## Firebase Permission Errors

If you encounter the error: **"Missing or insufficient permissions"** when using the image upload or gallery features, you need to configure Firebase security rules:

### Configuring Firebase Rules

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. For **Firestore** permissions:
   * Navigate to **Firestore Database > Rules**
   * Replace existing rules with the content below:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to upload images
    match /images/{imageId} {
      allow read: if true; // Public access to read images
      allow create: if request.auth != null; // Logged-in users can create
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId; // Only owners can modify
    }
    
    // Allow access to gallery collection
    match /gallery/{docId} {
      allow read: if true; // Everyone can view gallery
      allow write: if request.auth != null; // Only authenticated users can add/update
    }
    
    // Default deny for everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. For **Storage** permissions:
   * Navigate to **Storage > Rules**
   * Replace existing rules with the content below:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read images
    match /images/{allPaths=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                             request.resource.metadata.userId == request.auth.uid;
    }
    
    // Default deny for everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish** for each set of rules

### Features Requiring Firebase Permissions

- User authentication (login, register)
- Image upload functionality
- Gallery display with user-uploaded images
- Image filtering by category

## Firebase Configuration

The Firebase project is already configured in the code with the following information:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAb6bp6ot5tWz16b1qJzv_30VxJR87nzW8",
    authDomain: "gallery-1609e.firebaseapp.com",
    projectId: "gallery-1609e",
    storageBucket: "gallery-1609e.firebasestorage.app",
    messagingSenderId: "616484716286",
    appId: "1:616484716286:web:2cdfe99e8698e03687afaf",
    measurementId: "G-F4VM09MT90"
};
```

## Authentication Methods

The following authentication methods are supported:
- Email/Password
- Google Sign-In
- Facebook Sign-In

To enable Google and Facebook authentication, you'll need to configure these authentication providers in the Firebase Console as well.

## User Profile Features

For authenticated users, the application provides a user profile page with the following features:

1. **View Profile Information**
   - Display name
   - Email address
   - Profile picture

2. **Update Profile**
   - Change display name
   - Upload/update profile picture

3. **User Statistics**
   - Images uploaded count
   - Member since date
   - Activity statistics

The profile information is stored in both Firebase Authentication and Firestore for persistence.

### Storage Rules for Profile Pictures

Firebase Storage rules are configured to allow users to upload and update their profile pictures. Make sure your Storage rules include:

```
// Allow profile picture uploads and updates
match /profile-pictures/{userId}/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

### Firestore Structure for User Data

User profile data is stored in the Firestore database with the following structure:

```javascript
// Collection: users
// Document ID: {user.uid}
{
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
``` 