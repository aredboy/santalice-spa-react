// import express from "express";
// import { readFileSync } from "fs";
// import cors from "cors";
// const app = express();
// const port = 5000;

// // Middleware to parse JSON requests
// app.use(cors());
// app.use(express.json());

// // Sample products data (replace with your own or use a database)
// let products;
// try {
//     products = JSON.parse(readFileSync("./products.json", "utf8"));
// } catch (error) {
//     console.error("Error loading products.json:", error);
//     products = []; // Fallback to empty array
// }

// // Endpoint to get all products
// app.get("/products", (req, res) => {
//     res.json(products);
// });

// // Endpoint to get a single product by ID
// app.get("/products/:id", (req, res) => {
//     const product = products.find((p) => p.id === parseInt(req.params.id));
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

// server.js (Versión con MongoDB Atlas)
import express from "express";
import cors from "cors";
import mongoose from "mongoose"; // Importamos mongoose
import * as dotenv from "dotenv"; // Importamos dotenv
dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- 🎯 Conexión a MongoDB ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        // Exit process with failure
        process.exit(1);
    }
};

// --- 🎯 Definición del Esquema y Modelo ---
// Define la estructura de tus productos
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: mongoose.Schema.Types.Mixed }, // Para aceptar strings o arrays
});

// El nombre 'Product' se convierte a 'products' en la colección
const Product = mongoose.model("Product", ProductSchema);


// --- 🎯 Endpoints con MongoDB ---

// Endpoint para obtener todos los productos
app.get("/products", async (req, res) => {
    try {
        // Usa el modelo para buscar todos los documentos
        const products = await Product.find({}).lean();
        console.log("Productos devueltos por la DB:", products.length, "documentos.");
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", details: error.message });
    }
});

// Endpoint para obtener un solo producto por ID
app.get("/products/:id", async (req, res) => {
    try {
        // Busca el producto por el campo 'id'
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});