import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./firebase.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import mercadopago from "mercadopago";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuración Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración MercadoPago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// 🟢 Rutas

// Test
app.get("/", (req, res) => res.send("Backend funcionando ✅"));

// Listar todos los sorteos
app.get("/api/sorteos", async (req, res) => {
  try {
    const snapshot = await db.collection("sorteos").get();
    const sorteos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(sorteos);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo sorteos" });
  }
});

// Detalle sorteo
app.get("/api/sorteos/:id", async (req, res) => {
  try {
    const docSnap = await db.collection("sorteos").doc(req.params.id).get();
    if (!docSnap.exists) return res.status(404).json({ error: "Sorteo no encontrado" });
    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo sorteo" });
  }
});

// Crear preferencia de pago
app.post("/api/crear-preferencia", async (req, res) => {
  try {
    const { sorteoId } = req.body;
    const docSnap = await db.collection("sorteos").doc(sorteoId).get();
    if (!docSnap.exists) return res.status(404).json({ error: "Sorteo no encontrado" });

    const sorteo = docSnap.data();

    const preference = {
      items: [{ title: sorteo.titulo, quantity: 1, currency_id: "ARS", unit_price: parseFloat(sorteo.precio) }],
      back_urls: { success: "http://localhost:5173/success", failure: "http://localhost:5173/failure", pending: "http://localhost:5173/pending" },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: "Error creando preferencia" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
