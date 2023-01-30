const emailFormEle = document.getElementById("email-form");

const handleEmailFormSubmit = async (ev) => {
  ev.preventDefault();

  const emailInputEle = document.getElementById("interested-email");
  const emailSubmitEle = document.getElementById("interested-email-submit");
  const priceInput = document.getElementById("interested-price");
  const thankYouEle = document.getElementById("thank-you");
  const bidPriceEle = document.getElementById("bid-price");
  const emailVal = emailInputEle.value;
  const priceVal = priceInput.value;

  emailSubmitEle.disabled = true; // Don't let them press more than once
  emailSubmitEle.classList.remove("failed");
  emailSubmitEle.value = "Beaming it up... 🛸";

  const handleError = (error) => {
    console.error("Error: ", error);
    emailSubmitEle.disabled = false;
    emailSubmitEle.classList.add("failed");
    emailSubmitEle.value = "Failed 😞 Try once more!";
  };

  const { confetti } = await import("./auction.js");

  const { initializeApp } = await import(
    "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
  );

  // If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
  const { getAnalytics, logEvent } = await import(
    "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js"
  );

  // Add Firebase products that you want to use
  const { doc, getDoc, setDoc, updateDoc, getFirestore, serverTimestamp } =
    await import(
      "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
    );

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

  try {
    let emailDocRef = doc(db, "auction", emailVal);
    const existingDoc = await getDoc(emailDocRef);
    const timestamp = serverTimestamp();

    if (existingDoc.exists()) {
      emailDocRef = await updateDoc(emailDocRef, {
        latestBid: priceVal,
        timestamp,
        allBids: [priceVal, ...existingDoc.data().allBids],
      });
    } else {
      emailDocRef = await setDoc(emailDocRef, {
        latestBid: priceVal,
        timestamp,
        allBids: [priceVal],
      });
    }

    const success = () => {
      confetti(); // 🎉
      bidPriceEle.innerText = priceVal;
      emailFormEle.classList.add("hidden");
      thankYouEle.classList.remove("hidden");
      logEvent(analytics, "email_signup");
    };

    // Success!
    success();
  } catch (e) {
    handleError(e);
  }
};

emailFormEle.addEventListener("submit", handleEmailFormSubmit);
