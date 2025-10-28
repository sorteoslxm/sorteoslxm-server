// firebase.js
import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";

let serviceAccount;

try {
  // 🔹 Si existe el archivo local (modo desarrollo en tu compu)
  if (existsSync("./config/sorteoslxm-firebase-adminsdk.json")) {
    const fileData = readFileSync("./config/sorteoslxm-firebase-adminsdk.json");
    serviceAccount = JSON.parse(fileData);
    console.log("🔑 Credenciales Firebase cargadas desde archivo local.");
  } 
  // 🔹 Si no existe el archivo (modo producción en Render)
  else if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
    console.log("🌍 Credenciales Firebase cargadas desde variable de entorno.");
  } 
  // 🔹 Si no encuentra nada
  else {
    throw new Error("No se encontraron credenciales Firebase.");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });
  }

} catch (error) {
  console.error("❌ Error inicializando Firebase:", error);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };
