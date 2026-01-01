import { getFirebase } from "./firebase.js";
const emailFormEle = document.getElementById("email-form");
let ip = "";

const handleFormFocus = (ev) => {
  emailFormEle.removeEventListener("focus", handleFormFocus, true);

  getIp(); // Get the user's IP address ahead of time
  getFirebase(); // Load the Firebase SDK
};

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

  // https://stackoverflow.com/a/70870895/231730
  const getTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const getLocale = () => {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  };

  const handleError = (error) => {
    console.error("Error: ", error);
    emailSubmitEle.disabled = false;
    emailSubmitEle.classList.add("failed");
    emailSubmitEle.value = "Failed 😞 Try once more!";
  };

  // Initialize Firebase
  const {
    analytics,
    db,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
    setDoc,
    logEvent,
  } = await getFirebase();

  try {
    let emailDocRef = doc(db, "auction", emailVal);
    const existingDoc = await getDoc(emailDocRef);
    const timestamp = serverTimestamp();

    if (existingDoc.exists()) {
      const existingData = existingDoc.data();

      // Only update if the bid has changed
      if (existingData.bid !== priceVal) {
        emailDocRef = await updateDoc(emailDocRef, {
          bid: priceVal,
          timestamp,
          bidHistory: [existingData.bid, ...existingData.bidHistory],
          ip: ip || existingData.ip,
          timeZone: getTimeZone() || existingData.timeZone,
          locale: getLocale() || existingData.locale,
        });

        if (twq) {
          // Track if user came from Twitter ad
          twq("event", "tw-odoha-odohr", {
            email_address: emailVal,
          });
        }
      }
    } else {
      emailDocRef = await setDoc(emailDocRef, {
        bid: priceVal,
        timestamp,
        bidHistory: [],
        ip,
        timeZone: getTimeZone(),
        locale: getLocale(),
      });

      if (twq) {
        // Track if user came from Twitter ad
        twq("event", "tw-odoha-odohr", {
          email_address: emailVal,
        });
      }
    }

    const success = () => {
      // confetti(); // 🎉
      bidPriceEle.innerText = priceVal;
      emailFormEle.classList.add("hidden");
      thankYouEle.classList.remove("hidden");
      logEvent(analytics, "bid-received", {
        email: emailVal,
        price: priceVal,
      });
    };

    // Success!
    success();
  } catch (e) {
    handleError(e);
  }
};

emailFormEle.addEventListener("focus", handleFormFocus, true);
emailFormEle.addEventListener("submit", handleEmailFormSubmit);

countdown();
