// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzL1B_B0NrRZQ9wrvk6Rq8qpT-4HDiEHo",
  authDomain: "prompt-wizard-7ed62.firebaseapp.com",
  projectId: "prompt-wizard-7ed62",
  storageBucket: "prompt-wizard-7ed62.firebasestorage.app",
  messagingSenderId: "793702652201",
  appId: "1:793702652201:web:2f4ae26c8ccde092617f38",
  measurementId: "G-2Y0DB8RQBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure GitHub provider
const githubProvider = new GithubAuthProvider();
// Add custom scopes if needed
githubProvider.addScope('user:email');
// Set custom parameters to ensure we get an email from GitHub
githubProvider.setCustomParameters({
  // Add the correct redirect URL - should match what's in GitHub OAuth App settings
  redirect_uri: window.location.origin
});

export { auth, googleProvider, githubProvider };
export default app; 