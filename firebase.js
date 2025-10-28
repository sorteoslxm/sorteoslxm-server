import admin from "firebase-admin";

let serviceAccount;

try {
  if (process.env.FIREBASE_CONFIG) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
    console.log("🌍 Credenciales Firebase cargadas desde variable de entorno.");
  } else {
    throw new Error("No se encontraron credenciales Firebase en variable de entorno.");
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
