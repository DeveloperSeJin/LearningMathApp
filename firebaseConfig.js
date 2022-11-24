// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBpGtyIqEBVYnR6ZtF1-SQqqAa_HSHNUFs",

  authDomain: "math-learning-app-5729e.firebaseapp.com",

  projectId: "math-learning-app-5729e",

  storageBucket: "math-learning-app-5729e.appspot.com",

  messagingSenderId: "786257694735",

  appId: "1:786257694735:web:cc092138160e4d7c3d937a"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
    experimentalForceLongPolling:true,
});

export default app
export {db}