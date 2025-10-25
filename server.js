import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db, bucket } from "./firebase.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("Servidor Sorteos LXM funcionando correctamente ✅");
});

// Ejemplo de obtener datos de Firestore
app.get("/sorteos", async (req, res) => {
  try {
    const snapshot = await db.collection("sorteos").get();
    const sorteos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(sorteos);
  } catch (error) {
    console.error("Error obteniendo sorteos:", error);
    res.status(500).json({ error: "Error al obtener sorteos" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
