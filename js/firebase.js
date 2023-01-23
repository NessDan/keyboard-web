import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import {
  getAnalytics,
  logEvent,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";

// Add Firebase products that you want to use
import {
  collection,
  addDoc,
  updateDoc,
  getFirestore,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDwdPhFoZZYQXeEkxMrWHH2EJHZe5Zius",
  authDomain: "keyboard-controller-waitlist.firebaseapp.com",
  databaseURL: "https://keyboard-controller-waitlist.firebaseio.com",
  projectId: "keyboard-controller-waitlist",
  storageBucket: "keyboard-controller-waitlist.appspot.com",
  messagingSenderId: "757579060743",
  appId: "1:757579060743:web:64a5b6b35c55e2fec13ca2",
  measurementId: "G-TRS5XJHX3B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

let emailDocRef; // Store the docRef from Firebase to update the price in later.
const emailFormEle = document.getElementById("email-form");
const priceFormEle = document.getElementById("price-form");

const handleEmailFormSubmit = async (ev) => {
  ev.preventDefault();
  const emailInputEle = document.getElementById("interested-email");
  const emailSubmitEle = document.getElementById("interested-email-submit");
  const emailVal = emailInputEle.value;

  emailSubmitEle.disabled = true; // Don't let them press more than once
  emailSubmitEle.classList.remove("failed");
  emailSubmitEle.value = "Beaming it up... 🛸";

  const handleError = (error) => {
    console.error("Error adding document: ", error);
    emailSubmitEle.disabled = false;
    emailSubmitEle.classList.add("failed");
    emailSubmitEle.value = "Failed 😞 Try once more!";
  };

  try {
    emailDocRef = await addDoc(collection(db, "emails"), {
      timestamp: serverTimestamp(),
      email: emailVal,
      price: 0,
    });
    console.log("Document written with ID: ", emailDocRef.id);

    emailFormEle.classList.add("hidden");
    priceFormEle.classList.remove("hidden");
    logEvent(analytics, "email_signup");
  } catch (e) {
    handleError(e);
  }
};

function handlePriceFormSubmit(ev) {
  ev.preventDefault();
  const submitButton = document.getElementById("interested-price-submit");
  const priceInput = document.getElementById("interested-price");
  const thankYouEle = document.getElementById("thank-you");
  const priceVal = priceInput.value;

  submitButton.disabled = true; // Don't let them press more than once
  submitButton.classList.remove("failed");
  submitButton.value = "Beaming it up... 🛸";

  const handleError = (error) => {
    console.error("Error adding document: ", error);
    submitButton.disabled = false;
    submitButton.classList.add("failed");
    submitButton.value = "Failed 😞 Try once more!";
  };

  try {
    updateDoc(emailDocRef, {
      price: priceVal,
    });

    priceFormEle.classList.add("hidden");
    thankYouEle.classList.remove("hidden");
    logEvent(analytics, "price_signup");
  } catch (e) {
    handleError(e);
  }
}

emailFormEle.addEventListener("submit", handleEmailFormSubmit);
priceFormEle.addEventListener("submit", handlePriceFormSubmit);
