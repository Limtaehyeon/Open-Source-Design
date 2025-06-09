// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 추가

const firebaseConfig = {
  apiKey: "",
  authDomain: "software-web-ecfce.firebaseapp.com",
  projectId: "software-web-ecfce",
  storageBucket: "software-web-ecfce.appspot.com", // 수정 완료
  messagingSenderId: "139388250772",
  appId: "1:139388250772:web:41604936209ef0bee7a281",
  measurementId: "G-HBBF2KBKPP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 추가
