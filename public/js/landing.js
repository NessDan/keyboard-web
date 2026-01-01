import { setupFirebaseAnalytics } from "./shared/web/firebase.js";

const emailFormEle = document.getElementById("email-form");
const buyItNowEle = document.getElementById("buy-it-now");

// Post the email to https://mail.keyboard.gg/subscription/form
const handleEmailFormSubmit = async (e) => {
  e.preventDefault();

  const emailFormEle = document.getElementById("email-form");
  const submitButton = document.getElementById("interested-submit");
  const emailInputEle = document.getElementById("interested-email");
  const priceInputEle = document.getElementById("interested-price");
  const thankYouEle = document.getElementById("thank-you");
  const email = emailInputEle.value;
  const price = priceInputEle?.value;

  const handleError = (error) => {
    console.error("Error adding document: ", error);
    submitButton.disabled = false;
    submitButton.classList.add("failed");
    submitButton.value = "Failed 😞 Try once more!";
  };

  if (!email) {
    return;
  }

  const { analytics, logEvent } = await setupFirebaseAnalytics();

  try {
    logEvent(analytics, "email_submitted", {
      email,
    });
  } catch (error) {
    console.error("Analytic log failed: ", error);
  }

  const formData = new FormData();

  formData.append("email", email);
  formData.append("l", "9cd4ae6c-5a93-4976-a44f-f1865dc2b7d7"); // Keyboard.gg Email Updates List ID
  formData.append("attribs", JSON.stringify({ test: "test" })); // Doesn't add custom attribute
  formData.append("name", "");
  formData.append("nonce", "");

  let response;

  try {
    submitButton.disabled = true; // Don't let them press more than once
    submitButton.classList.remove("failed");
    submitButton.value = "Beaming it up... 🛸";

    response = await fetch("https://mail.keyboard.gg/subscription/form", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    handleError(error);
  }

  if (response.ok) {
    const success = () => {
      // confetti(); // 🎉 // Disabled because the CDN import broke the site, then fixed it but
      // didn't want to use a CDN so I tried hosting the files locally but you can't just copy
      // paste the files from the the CDN because it's trying to import the files from the CDN
      // and not from the local. So not worth the hassle. Spent too much time on this.

      emailFormEle.classList.add("hidden");
      thankYouEle.classList.remove("hidden");

      logEvent(analytics, "email-signup", {
        email: email,
      });
    };

    // Success!
    success();
  } else {
    handleError(error);
  }

  return response;
};

// buyItNowEle?.addEventListener("click", confetti); // See above for why this is commented out

emailFormEle.addEventListener("submit", handleEmailFormSubmit);

setupFirebaseAnalytics(); // Setup analytics on load.
