// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Firebase Admin desde variable de entorno
if (!process.env.FIREBASE_CONFIG) {
  console.error("❌ ERROR: No se encontró la variable de entorno FIREBASE_CONFIG");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
});

const db = admin.firestore();

// 🔹 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Crear sorteo
app.post("/api/sorteos", upload.single("imagen"), async (req, res) => {
  try {
    const { titulo, descripcion, precio, numerosTotales } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Imagen requerida" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "sorteos" }, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
      stream.end(file.buffer);
    });

    const docRef = await db.collection("sorteos").add({
      titulo,
      descripcion,
      precio: Number(precio),
      numerosTotales: Number(numerosTotales),
      numerosVendidos: 0,
      imagenUrl: result.secure_url,
      activo: true,
      fecha: new Date(),
    });

    const newDoc = await docRef.get();
    res.json({ id: newDoc.id, ...newDoc.data() });
  } catch (error) {
    console.error("Error creando sorteo:", error);
    res.status(500).json({ error: "Error creando sorteo" });
  }
});

// 🔹 Listar todos los sorteos
app.get("/api/sorteos", async (req, res) => {
  try {
    const snapshot = await db.collection("sorteos").get();
    const sorteos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(sorteos);
  } catch (error) {
    console.error("Error listando sorteos:", error);
    res.status(500).json({ error: "Error listando sorteos" });
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
    console.error("Error obteniendo sorteo:", error);
    res.status(500).json({ error: "Error obteniendo sorteo" });
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
    console.error("Error actualizando sorteo:", error);
    res.status(500).json({ error: "Error actualizando sorteo" });
  }
});

// 🔹 Eliminar sorteo
app.delete("/api/sorteos/:id", async (req, res) => {
  try {
    await db.collection("sorteos").doc(req.params.id).delete();
    res.json({ message: "Sorteo eliminado" });
  } catch (error) {
    console.error("Error eliminando sorteo:", error);
    res.status(500).json({ error: "Error eliminando sorteo" });
  }
});

// 🔹 Rutas de prueba
app.get("/", (req, res) => {
  res.send("Backend sorteos funcionando correctamente ✅");
});

// 🔹 Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
