import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./firebase.js"; // Firebase ya configurado
// import rutas o controladores si los tenés
// import { routerSorteos } from "./routes/sorteos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("Backend sorteos funcionando correctamente ✅");
});

// Si tenés rutas de sorteos, por ejemplo:
// app.use("/sorteos", routerSorteos);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
