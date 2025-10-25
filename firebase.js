import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta al JSON privado (ahora dentro de /config)
const serviceAccountPath = path.join(__dirname, "config", "sorteoslxm-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  storageBucket: "sorteoslxm.appspot.com", // reemplazá por tu bucket real si es distinto
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };
