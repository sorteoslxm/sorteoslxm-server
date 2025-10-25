// config/firebase.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Firebase Admin SDK
const serviceAccount = JSON.parse(
  fs.readFileSync("./config/sorteoslxm-firebase-adminsdk.json", "utf-8")
);

initializeApp({
  credential: cert(serviceAccount)
});

// 🔹 Export Firestore
export const db = getFirestore();
