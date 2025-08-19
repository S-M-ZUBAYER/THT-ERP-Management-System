// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   // apiKey: "AIzaSyAtSgmSMnHPmZlT4CROMtv1-qfeph07HTY",
//   apiKey: process.env.REACT_APP_apiKey,
//   authDomain: process.env.REACT_APP_authDomain,
//   projectId: process.env.REACT_APP_projectId,
//   storageBucket: process.env.REACT_APP_storageBucket,
//   messagingSenderId: process.env.REACT_APP_messagingSenderId,
//   appId: process.env.REACT_APP_appId,
// };

// const app = initializeApp(firebaseConfig);

// export default app;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_apiKey,
  authDomain: import.meta.env.REACT_APP_authDomain,
  projectId: import.meta.env.REACT_APP_projectId,
  storageBucket: import.meta.env.REACT_APP_storageBucket,
  messagingSenderId: import.meta.env.REACT_APP_messagingSenderId,
  appId: import.meta.env.REACT_APP_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
