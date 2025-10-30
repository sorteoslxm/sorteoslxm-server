// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import dotenv from "dotenv";
import fs from "fs";

// 🔹 Configuración
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync("./config/sorteoslxm-firebase-adminsdk.json", "utf-8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// 🔹 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Multer (subida de archivos en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ======================================================
// 🔹 RUTAS API
// ======================================================

// Crear sorteo
app.post("/api/sorteos", upload.single("imagen"), async (req, res) => {
  try {
    const file = req.file;
    const { titulo, descripcion, precio, numerosTotales } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Imagen requerida" });
    }

    // Subir imagen a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "sorteos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // Guardar sorteo en Firestore
    const docRef = await db.collection("sorteos").add({
      titulo,
      descripcion,
      precio: Number(precio),
      numerosTotales: Number(numerosTotales),
      numerosVendidos: 0,
      imagenUrl: result.secure_url,
      activo: true,
      fecha: Timestamp.now(),
    });

    const newDoc = await docRef.get();
    res.json({ id: newDoc.id, ...newDoc.data() });
  } catch (error) {
    console.error("Error creando sorteo:", error);
    res.status(500).json({ error: "Error creando sorteo" });
  }
});

// Listar sorteos
app.get("/api/sorteos", async (req, res) => {
  try {
    const snapshot = await db.collection("sorteos").get();
    const sorteos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(sorteos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error listando sorteos" });
  }
});

// Obtener sorteo por ID
app.get("/api/sorteos/:id", async (req, res) => {
  try {
    const docRef = db.collection("sorteos").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists)
      return res.status(404).json({ error: "Sorteo no encontrado" });

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el sorteo" });
  }
});

// Editar sorteo
app.put("/api/sorteos/:id", async (req, res) => {
  try {
    const { titulo, descripcion, precio, numerosTotales, activo } = req.body;
    const docRef = db.collection("sorteos").doc(req.params.id);

    await docRef.update({
      titulo,
      descripcion,
      precio: Number(precio),
      numerosTotales: Number(numerosTotales),
      ...(activo !== undefined ? { activo } : {}),
    });

    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando sorteo" });
  }
});

// Eliminar sorteo
app.delete("/api/sorteos/:id", async (req, res) => {
  try {
    await db.collection("sorteos").doc(req.params.id).delete();
    res.json({ message: "Sorteo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando sorteo" });
  }
});


// 🔹 Servidor

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
