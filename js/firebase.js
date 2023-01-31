let initializeApp,
  getAnalytics,
  logEvent,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getFirestore,
  serverTimestamp,
  app,
  analytics,
  db;

export const getFirebase = async () => {
  if (app) {
    return {
      initializeApp,
      getAnalytics,
      logEvent,
      doc,
      getDoc,
      setDoc,
      updateDoc,
      getFirestore,
      serverTimestamp,
      app,
      analytics,
      db,
    };
  }

  ({ initializeApp } = await import(
    "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
  ));

  // If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
  ({ getAnalytics, logEvent } = await import(
    "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js"
  ));

  // Add Firebase products that you want to use
  ({ doc, getDoc, setDoc, updateDoc, getFirestore, serverTimestamp } =
    await import(
      "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
    ));

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
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);

  return {
    initializeApp,
    getAnalytics,
    logEvent,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getFirestore,
    serverTimestamp,
    app,
    analytics,
    db,
  };
};
