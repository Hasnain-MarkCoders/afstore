import { initializeApp } from "firebase/app";
import { getMessaging, getToken , onMessage  } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAYHN2EpvydDXS-SejKb_njSvcdXq0fP8k",
    authDomain: "linton-fb31e.firebaseapp.com",
    projectId: "linton-fb31e",
    storageBucket: "linton-fb31e.firebasestorage.app",
    messagingSenderId: "670923450328",
    appId: "1:670923450328:web:64886d0e5ed196992934ad",
    measurementId: "G-34MRJH25CZ"
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app); 



export {  messaging, getToken,onMessage  };