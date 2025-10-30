// server.js
import express from "express";
import cors from "cors";

import multer from "multer";
import { db } from "./config/firebase.js";
import { cloudinary } from "./config/cloudinary.js";

import dotenv from "dotenv";
import admin from "firebase-admin";
import mercadopago from "mercadopago";
import path from "path";
import { fileURLToPath } from "url";

// --- CONFIGURACIONES INICIALES ---
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- FIREBASE ADMIN SDK ---
let serviceAccount;


    if (!file) return res.status(400).json({ error: "Imagen requerida" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "sorteos" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(file.buffer);
    });

    await db.collection("sorteos").add({
      titulo,
      descripcion,
      precio: Number(precio),
      numerosTotales: Number(numerosTotales),
      numerosVendidos: 0,
      imagenUrl: result.secure_url,
      activo: true,
      fecha: new Date()
    });

    res.json({ message: "Sorteo creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando sorteo" });

try {
  // Si estamos en Render, las credenciales vienen del entorno
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
  } else {
    // Si estás en local, usá el archivo .json
    serviceAccount = JSON.parse(
      JSON.stringify(
        await import("./config/sorteoslxm-firebase-adminsdk.json", {
          assert: { type: "json" },
        })
      )
    );

  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin inicializado correctamente");
} catch (error) {
  console.error("❌ Error al inicializar Firebase Admin:", error);
}

// --- MERCADO PAGO CONFIG ---
if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  console.log("✅ MercadoPago configurado");
} else {
  console.warn("⚠️ Falta MERCADOPAGO_ACCESS_TOKEN en variables de entorno");
}

// --- RUTAS FIREBASE (ejemplo) ---
const db = admin.firestore();

app.get("/sorteos", async (req, res) => {
  try {
    const snapshot = await db.collection("sorteos").get();
    const sorteos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(sorteos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener sorteos" });
  }
});


// 🔹 Obtener sorteo por ID
app.get("/api/sorteos/:id", async (req, res) => {
  try {
    const docRef = db.collection("sorteos").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return res.status(404).json({ error: "Sorteo no encontrado" });

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el sorteo" });
  }
});

// 🔹 Editar sorteo
app.put("/api/sorteos/:id", async (req, res) => {
  try {
    const { titulo, descripcion, precio, numerosTotales, activo } = req.body;
    const docRef = db.collection("sorteos").doc(req.params.id);

    await docRef.update({
      titulo,
      descripcion,
      precio: Number(precio),
      numerosTotales: Number(numerosTotales),
      ...(activo !== undefined ? { activo } : {})
    });

    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando sorteo" });
  }
});

// 🔹 Eliminar sorteo
app.delete("/api/sorteos/:id", async (req, res) => {
  try {
    await db.collection("sorteos").doc(req.params.id).delete();
    res.json({ message: "Sorteo eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando sorteo" });
  }
});

// 🔹 Servidor

// --- RUTA TEST PARA VER SI EL SERVIDOR RESPONDE ---
app.get("/", (req, res) => {
  res.send("🚀 Backend Sorteos LXM funcionando correctamente");
});

// --- SERVIDOR ---

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
