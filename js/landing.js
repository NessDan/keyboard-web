import { setupFirebaseAnalytics } from "./shared/web/firebase.js";
import { confetti } from "./confetti.js";

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
  const price = priceInputEle.value;

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
  formData.append("l", "0a0d8ba4-a10a-4af7-9f6f-630d23f6c1cd"); // TEST
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
      confetti(); // 🎉
      window.confetti = confetti; // For debugging

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

buyItNowEle?.addEventListener("click", confetti);

emailFormEle.addEventListener("submit", handleEmailFormSubmit);

setupFirebaseAnalytics(); // Setup analytics on load.
