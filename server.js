import express from "express";
import cors from "cors";
import multer from "multer";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "./config/firebase.js";
import { cloudinary } from "./config/cloudinary.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Multer para subir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Crear sorteo con imagen
app.post("/api/sorteos", upload.single("imagen"), async (req, res) => {
  try {
    const file = req.file;
    const { titulo, descripcion, precio, numerosTotales } = req.body;

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
      fecha: Timestamp.now()
    });

    res.json({ message: "Sorteo creado correctamente" });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el sorteo" });
  }
});

// 🔹 Editar sorteo
app.put("/api/sorteos/:id", async (req, res) => {
  try {
    const { titulo, descripcion, precio, numerosTotales } = req.body;
    await db.collection("sorteos").doc(req.params.id).update({
      titulo,
      descripcion,
      precio: Number(precio),
      numerosTotales: Number(numerosTotales)
    });
    res.json({ message: "Sorteo actualizado" });
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
